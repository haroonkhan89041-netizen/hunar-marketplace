'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Checkout() {
  const router = useRouter()
  const [requirements, setRequirements] = useState('')
  const [payment, setPayment] = useState('JazzCash')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace('/login')
      else setUserEmail(user.email || '')
    })
  }, [router])

  async function placeOrder(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError(''); setMessage('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    // Demo checkout: payment-provider credentials are intentionally not hardcoded.
    // The order is created as pending until a real payment gateway is connected.
    const { error: orderError } = await supabase.from('orders').insert({
      client_id: user.id,
      freelancer_id: user.id,
      amount_pkr: 8000,
      status: 'pending',
      requirements: `${requirements.trim()}\nPayment method selected: ${payment}`.trim(),
    })
    if (orderError) setError(orderError.message)
    else setMessage('Order request created. A payment gateway can be connected before funds are collected.')
    setSaving(false)
  }

  return <main className="section"><div className="container"><span className="pill">Secure checkout</span><h1>Place your HUNAR order</h1><p className="muted">Signed in as {userEmail}</p>
    <div className="grid"><form className="card" style={{gridColumn:'span 2'}} onSubmit={placeOrder}><h2>Order details</h2><p>Web application development · PKR 8,000</p><div className="field"><label>Project requirements<textarea rows={6} value={requirements} onChange={e=>setRequirements(e.target.value)} placeholder="Describe what you need..." required /></label></div><div className="field"><label>Payment method<select value={payment} onChange={e=>setPayment(e.target.value)}><option>JazzCash</option><option>Easypaisa</option><option>Bank Transfer</option><option>International Card</option></select></label></div>{error && <p role="alert">{error}</p>}{message && <p>{message}</p>}<button className="btn primary" disabled={saving}>{saving ? 'Creating order...' : 'Create order request'}</button></form><div className="card"><h3>Order summary</h3><p>Basic package <b style={{float:'right'}}>PKR 8,000</b></p><p>HUNAR protection <b style={{float:'right'}}>Included</b></p><hr/><h2>PKR 8,000</h2><p className="muted">Payment is not collected until a real gateway is connected.</p><Link href="/dashboard" className="btn">Dashboard</Link></div></div></div></main>
}