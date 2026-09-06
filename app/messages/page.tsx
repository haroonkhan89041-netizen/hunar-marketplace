'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Message = { id: string; sender_id: string; body: string; created_at: string }

export default function Messages() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get('order') || ''
  const [userId, setUserId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      setUserId(user.id)
      if (!orderId) { setLoading(false); return }
      const { data } = await supabase.from('messages').select('id,sender_id,body,created_at').eq('order_id', orderId).order('created_at', { ascending: true })
      setMessages(data ?? [])
      setLoading(false)
    }
    load()
  }, [orderId, router])

  async function sendMessage(e: FormEvent) {
    e.preventDefault()
    const text = body.trim()
    if (!text || !orderId || !userId) return
    setSending(true)
    const { data, error } = await supabase.from('messages').insert({ order_id: orderId, sender_id: userId, body: text }).select('id,sender_id,body,created_at').single()
    if (!error && data) { setMessages(current => [...current, data]); setBody('') }
    setSending(false)
  }

  return <main className="section"><div className="container"><span className="pill">Order chat</span><h1>Messages</h1><p className="muted">Discuss requirements, updates and delivery details securely inside HUNAR.</p>{!orderId ? <div className="card"><p>Select an order first.</p></div> : loading ? <p>Loading messages...</p> : <div className="card"><div style={{minHeight:280,display:'grid',gap:12,alignContent:'start'}}>{messages.length === 0 ? <p className="muted">No messages yet. Start the conversation.</p> : messages.map(m => <div key={m.id} style={{padding:12,border:'1px solid var(--border)',borderRadius:12,marginLeft:m.sender_id===userId?40:0,marginRight:m.sender_id===userId?0:40}}><b>{m.sender_id===userId?'You':'HUNAR member'}</b><p>{m.body}</p><small className="muted">{new Date(m.created_at).toLocaleString()}</small></div>)}</div><form onSubmit={sendMessage} style={{display:'flex',gap:10,marginTop:20}}><input value={body} onChange={e=>setBody(e.target.value)} placeholder="Write a message..." required style={{flex:1}}/><button className="btn primary" disabled={sending}>{sending?'Sending...':'Send'}</button></form></div>}</div></main>
}
