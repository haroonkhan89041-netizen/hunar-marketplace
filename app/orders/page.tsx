'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Order = { id: string; amount_pkr: number; status: string; requirements: string | null; created_at: string; service_id: string | null; client_id: string; freelancer_id: string }
type Profile = { id: string; full_name: string | null }

export default function Orders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [profiles, setProfiles] = useState<Record<string, Profile>>({})
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      setUserId(user.id)
      const { data, error } = await supabase.from('orders').select('id,amount_pkr,status,requirements,created_at,service_id,client_id,freelancer_id').order('created_at', { ascending: false })
      if (!error && data) {
        setOrders(data)
        const ids = Array.from(new Set(data.flatMap(o => [o.client_id, o.freelancer_id])))
        if (ids.length) {
          const { data: people } = await supabase.from('profiles').select('id,full_name').in('id', ids)
          setProfiles(Object.fromEntries((people ?? []).map(p => [p.id, p])))
        }
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) setOrders(current => current.map(o => o.id === id ? { ...o, status } : o))
  }

  return <main className="section"><div className="container">
    <div className="sectionhead"><div><span className="pill">My orders</span><h1>Orders & delivery</h1><p className="muted">Track purchases, delivery progress and completed work in one place.</p></div><Link className="btn" href="/dashboard">Dashboard</Link></div>
    {loading ? <p>Loading orders...</p> : orders.length === 0 ? <div className="card"><h3>No orders yet</h3><p className="muted">Your orders will appear here after a client places an order.</p><Link className="btn primary" href="/talent">Find Talent</Link></div> : <div className="grid">{orders.map(order => {
      const isClient = order.client_id === userId
      const otherId = isClient ? order.freelancer_id : order.client_id
      return <div className="card" key={order.id}><div className="sectionhead"><div><span className="pill">{order.status.replaceAll('_',' ')}</span><h3>Order #{order.id.slice(0,8)}</h3></div><b>PKR {Number(order.amount_pkr).toLocaleString()}</b></div><p className="muted">{isClient ? 'Freelancer' : 'Client'}: {profiles[otherId]?.full_name || 'HUNAR member'}</p><p>{order.requirements || 'No requirements added.'}</p><p className="muted">Created: {new Date(order.created_at).toLocaleDateString()}</p><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><Link className="btn" href={`/messages?order=${order.id}`}>Messages</Link>{isClient && order.status === 'delivered' && <button className="btn primary" onClick={() => updateStatus(order.id,'completed')}>Accept delivery</button>}{!isClient && order.status === 'active' && <button className="btn primary" onClick={() => updateStatus(order.id,'in_progress')}>Start work</button>}{!isClient && order.status === 'in_progress' && <button className="btn primary" onClick={() => updateStatus(order.id,'delivered')}>Mark delivered</button>}{isClient && order.status === 'delivered' && <button className="btn" onClick={() => updateStatus(order.id,'revision_requested')}>Request revision</button>}</div></div>
    })}</div>}
  </div></main>
}
