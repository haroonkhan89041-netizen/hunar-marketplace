'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Message = { id:string; sender_id:string; body:string; created_at:string }

export default function Messages(){
  const params=useSearchParams(); const router=useRouter(); const orderId=params.get('order')||''
  const [userId,setUserId]=useState(''); const [messages,setMessages]=useState<Message[]>([]); const [body,setBody]=useState(''); const [loading,setLoading]=useState(true); const [sending,setSending]=useState(false); const [error,setError]=useState('')
  useEffect(()=>{let mounted=true;let channel:any
    async function load(){
      const {data:{user}}=await supabase.auth.getUser(); if(!user){router.replace('/login');return} setUserId(user.id)
      if(!orderId){setLoading(false);return}
      const {data:order,error:orderError}=await supabase.from('orders').select('client_id,freelancer_id').eq('id',orderId).single()
      if(orderError||!order||![order.client_id,order.freelancer_id].includes(user.id)){if(mounted){setError('You are not a participant in this order.');setLoading(false)}return}
      const {data,error:msgError}=await supabase.from('messages').select('id,sender_id,body,created_at').eq('order_id',orderId).order('created_at',{ascending:true})
      if(mounted){if(msgError)setError(msgError.message);setMessages(data??[]);setLoading(false)}
      channel=supabase.channel(`order-chat-${orderId}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:`order_id=eq.${orderId}`},payload=>{const next=payload.new as Message;if(mounted)setMessages(current=>current.some(m=>m.id===next.id)?current:[...current,next])}).subscribe()
    }
    load(); return()=>{mounted=false;if(channel)supabase.removeChannel(channel)}
  },[orderId,router])
  async function sendMessage(e:FormEvent){e.preventDefault();const text=body.trim();if(!text||!orderId||!userId)return;setSending(true);setError('');const {data,error}=await supabase.from('messages').insert({order_id:orderId,sender_id:userId,body:text}).select('id,sender_id,body,created_at').single();if(error)setError(error.message);else if(data){setMessages(c=>c.some(m=>m.id===data.id)?c:[...c,data]);setBody('')}setSending(false)}
  return <main className="section"><div className="container"><div className="sectionhead"><div><span className="pill">Order chat</span><h1>Messages</h1><p className="muted">Real-time conversation for requirements, updates and delivery.</p></div>{orderId&&<button className="btn" onClick={()=>router.push(`/orders/${orderId}`)}>Back to order</button>}</div>{error&&<div className="card" style={{marginTop:20}}><p>{error}</p></div>}{!orderId?<div className="card"><p>Select an order first.</p></div>:loading?<p>Loading messages...</p>:!error&&<div className="card"><div style={{minHeight:320,maxHeight:520,overflowY:'auto',display:'grid',gap:12,alignContent:'start'}}>{messages.length===0?<p className="muted">No messages yet. Start the conversation.</p>:messages.map(m=><div key={m.id} style={{padding:12,border:'1px solid var(--border)',borderRadius:12,marginLeft:m.sender_id===userId?40:0,marginRight:m.sender_id===userId?0:40}}><b>{m.sender_id===userId?'You':'HUNAR member'}</b><p>{m.body}</p><small className="muted">{new Date(m.created_at).toLocaleString()}</small></div>)}</div><form onSubmit={sendMessage} style={{display:'flex',gap:10,marginTop:20}}><input value={body} onChange={e=>setBody(e.target.value)} placeholder="Write a message..." maxLength={2000} required style={{flex:1}}/><button className="btn primary" disabled={sending}>{sending?'Sending...':'Send'}</button></form></div>}</div></main>
}
