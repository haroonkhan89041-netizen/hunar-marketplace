'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Message = { id:string; sender_id:string; body:string; created_at:string }

type OrderParty = { client_id:string; freelancer_id:string }

export default function Messages(){
  const params=useSearchParams(); const router=useRouter(); const orderId=params.get('order')||''
  const [userId,setUserId]=useState(''); const [messages,setMessages]=useState<Message[]>([]); const [body,setBody]=useState('')
  const [loading,setLoading]=useState(true); const [sending,setSending]=useState(false); const [error,setError]=useState(''); const [order,setOrder]=useState<OrderParty|null>(null)

  const remaining=2000-body.length
  const canSend=useMemo(()=>Boolean(body.trim()&&orderId&&userId&&!sending),[body,orderId,userId,sending])

  useEffect(()=>{
    let mounted=true; let channel:any
    async function load(){
      const {data:{user}}=await supabase.auth.getUser()
      if(!user){router.replace('/login');return}
      if(!mounted)return
      setUserId(user.id)
      if(!orderId){setLoading(false);return}

      const {data:orderData,error:orderError}=await supabase.from('orders').select('client_id,freelancer_id').eq('id',orderId).single()
      if(orderError||!orderData||![orderData.client_id,orderData.freelancer_id].includes(user.id)){
        if(mounted){setError('You are not a participant in this order.');setLoading(false)}
        return
      }
      setOrder(orderData)

      const {data,error:msgError}=await supabase.from('messages').select('id,sender_id,body,created_at').eq('order_id',orderId).order('created_at',{ascending:true})
      if(mounted){
        if(msgError)setError(msgError.message)
        setMessages(data??[])
        setLoading(false)
      }
      if(msgError)return

      channel=supabase.channel(`order-chat-${orderId}`)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:`order_id=eq.${orderId}`},payload=>{
          const next=payload.new as Message
          if(mounted)setMessages(current=>current.some(m=>m.id===next.id)?current:[...current,next])
        })
        .subscribe()
    }
    load()
    return()=>{mounted=false;if(channel)supabase.removeChannel(channel)}
  },[orderId,router])

  async function sendMessage(e:FormEvent){
    e.preventDefault()
    const text=body.trim()
    if(!text||!orderId||!userId||!order)return
    setSending(true);setError('')
    const {data,error}=await supabase.from('messages').insert({order_id:orderId,sender_id:userId,body:text}).select('id,sender_id,body,created_at').single()
    if(error)setError(error.message)
    else if(data){setMessages(c=>c.some(m=>m.id===data.id)?c:[...c,data]);setBody('')}
    setSending(false)
  }

  return <main className="section"><div className="container">
    <div className="sectionhead">
      <div><span className="pill">Order chat</span><h1>Messages</h1><p className="muted">Real-time conversation for requirements, updates and delivery.</p></div>
      {orderId&&<button className="btn" onClick={()=>router.push(`/orders/${orderId}`)}>Back to order</button>}
    </div>

    {error&&<div className="card" style={{marginTop:20,borderColor:'var(--danger,#ef4444)'}}><p>{error}</p></div>}
    {!orderId?<div className="card"><h3>No order selected</h3><p className="muted">Open a message thread from an order to start chatting.</p><button className="btn primary" style={{marginTop:14}} onClick={()=>router.push('/orders')}>View orders</button></div>
    :loading?<div className="card"><p className="muted">Loading secure conversation...</p></div>
    :!error&&<div className="card">
      <div style={{minHeight:320,maxHeight:520,overflowY:'auto',display:'grid',gap:12,alignContent:'start',padding:4}}>
        {messages.length===0?<div style={{padding:'70px 20px',textAlign:'center'}}><h3>No messages yet</h3><p className="muted">Send the first message and keep all order communication in one place.</p></div>
        :messages.map(m=><div key={m.id} style={{padding:'12px 14px',border:'1px solid var(--border)',borderRadius:14,marginLeft:m.sender_id===userId?40:0,marginRight:m.sender_id===userId?0:40,background:m.sender_id===userId?'var(--surface-2,rgba(255,255,255,.04))':'transparent'}}><b>{m.sender_id===userId?'You':'HUNAR member'}</b><p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',margin:'6px 0'}}>{m.body}</p><small className="muted">{new Date(m.created_at).toLocaleString()}</small></div>)}
      </div>
      <form onSubmit={sendMessage} style={{marginTop:20}}>
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Write a message..." maxLength={2000} required rows={3} style={{width:'100%',resize:'vertical'}} />
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginTop:8}}><small className="muted">{remaining} characters left</small><button className="btn primary" disabled={!canSend}>{sending?'Sending...':'Send message'}</button></div>
      </form>
    </div>}
  </div></main>
}
