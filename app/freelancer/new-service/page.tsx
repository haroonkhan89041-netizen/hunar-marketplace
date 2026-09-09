'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Category = { id: string; name: string }

export default function NewService() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [days, setDays] = useState('3')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'freelancer' && profile?.role !== 'admin') { router.replace('/dashboard'); return }
      const { data, error: categoryError } = await supabase.from('categories').select('id, name').order('name')
      if (!mounted) return
      if (categoryError) setError(categoryError.message)
      setCategories(data || [])
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [router])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const cleanTitle = title.trim()
    const cleanDescription = description.trim()
    const priceValue = Number(price)
    const daysValue = Number(days)
    if (cleanTitle.length < 5 || cleanTitle.length > 120) return setError('Service title must be between 5 and 120 characters.')
    if (cleanDescription.length < 20 || cleanDescription.length > 5000) return setError('Description must be between 20 and 5000 characters.')
    if (!Number.isFinite(priceValue) || priceValue <= 0 || !Number.isInteger(priceValue)) return setError('Price must be a whole PKR amount greater than 0.')
    if (!Number.isInteger(daysValue) || daysValue < 1 || daysValue > 365) return setError('Delivery time must be between 1 and 365 days.')
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    const { error: insertError } = await supabase.from('services').insert({ freelancer_id: user.id, category_id: category || null, title: cleanTitle, description: cleanDescription, price_pkr: priceValue, delivery_days: daysValue, published: true })
    if (insertError) { setError(insertError.message); setSaving(false); return }
    router.push('/dashboard')
  }

  if (loading) return <main className="section"><div className="container"><p className="muted" role="status">Loading service form...</p></div></main>
  return <main className="section"><div className="container" style={{maxWidth:760}}>
    <div className="sectionhead"><div><span className="pill">Freelancer</span><h1>Create a service</h1><p className="muted">Turn your skill into a clear offer that clients can discover and order.</p></div><Link className="btn" href="/dashboard">Dashboard</Link></div>
    <div className="card" style={{marginTop:24,marginBottom:16}}><h3>Make your offer stand out</h3><p className="muted">Use a specific title, explain exactly what is included, and set a realistic delivery time. Clear offers build client trust.</p></div>
    <form className="card" onSubmit={submit} style={{display:'grid',gap:16}} aria-busy={saving}>
      <label htmlFor="service-title">Service title<input id="service-title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="I will build a modern business website" minLength={5} maxLength={120} required /><span className="muted">{title.length}/120</span></label>
      <label htmlFor="service-category">Category<select id="service-category" value={category} onChange={e=>setCategory(e.target.value)}><option value="">Select a category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label htmlFor="service-description">What will the client receive?<textarea id="service-description" value={description} onChange={e=>setDescription(e.target.value)} rows={6} minLength={20} maxLength={5000} placeholder="Explain deliverables, what is included, and what the client needs to provide." required /><span className="muted" aria-live="polite">{description.length}/5000</span></label>
      <div className="grid"><label htmlFor="service-price">Price (PKR)<input id="service-price" type="number" min="1" step="1" value={price} onChange={e=>setPrice(e.target.value)} placeholder="8000" required /></label><label htmlFor="service-days">Delivery days<input id="service-days" type="number" min="1" max="365" step="1" value={days} onChange={e=>setDays(e.target.value)} required /></label></div>
      {error && <p role="alert">{error}</p>}
      <button className="btn primary" disabled={saving}>{saving ? 'Publishing service...' : 'Publish service'}</button>
    </form>
  </div></main>
}