'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Service = { id: string; title: string; price_pkr: number; freelancer_id: string; freelancer?: { full_name: string | null } | null }

export default function Checkout() {
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [requirements, setRequirements] = useState('')
  const [payment, setPayment] = useState('JazzCash')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data } = await supabase.from('services').select('id,title,price_pkr,freelancer_id,profiles:freelancer_id(full_name)').eq('published', true).limit(1).maybeSingle()
      if (data) setService(data as Service)
      setLoading(false)
    }
    load()
  }, [router])

  async function placeOrder(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError(''); setMessage('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    if (!service) { setError('No published service is available yet.'); setSaving(false); return }
    const { error: orderError } = await supabase.from('orders').insert({ client_id: user.id, freelancer_id: service.freelancer_id, service_id: service.id, amount_pkr: Number(service.price_pkr), status: 'pending', requirements: `${requirements.trim()}\nPayment method selected: ${payment}`.trim() })
    if (orderError) setError(orderError.message)
    else setMessage('Order request created successfully. Payment is not collected until a real gateway is connected.')
    setSaving(false)
  }

  if (loading) return <main className="section"><div className="container"><p className="muted">Loading checkout...</p></div></main>
  if (!service) return <main className="section"><div className="container"><div className="card"><h2>No services available</h2><p className="muted">A freelancer needs to publish a service before an order can be created.</p><Link href="/talent" className="btn primary">Browse talent</Link></div></div></main>

  return <main className="section"><div className="container"><span className="pill">Secure checkout</span><h1>Place your HUNAR order</h1><div className="grid"><form className="card" style={{gridColumn:'span 2'}} onSubmit={placeOrder}><h2>{service.title}</h2><p>Freelancer service · PKR {Number(service.price_pkr).toLocaleString()}</p><div className="field"><label>Project requirements<textarea rows={6} value={requirements} onChange={e=>setRequirements(e.target.value)} placeholder="Describe what you need..." required /></label></div><div className="field"><label>Payment method<select value={payment} onChange={e=>setPayment(e.target.value)}><option>JazzCash</option><option>Easypaisa</option><option>Bank Transfer</option><option>International Card</option></select></label></div>{error && <p role="alert">{error}</p>}{message && <p>{message}</p>}<button className="btn primary" disabled={saving}>{saving ? 'Creating order...' : 'Create order request'}</button></form><div className="card"><h3>Order summary</h3><p>Service <b style={{float:'right'}}>PKR {Number(service.price_pkr).toLocaleString()}</b></p><p>HUNAR protection <b style={{float:'right'}}>Included</b></p><hr/><h2>PKR {Number(service.price_pkr).toLocaleString()}</h2><p className="muted">Payment gateway integration will be added separately.</p><Link href="/dashboard" className="btn">Dashboard</Link></div></div></div></main>
}