'use client'

import { FormEvent, useEffect, useState } from 'react'
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
      const { data } = await supabase.from('categories').select('id, name').order('name')
      if (mounted) { setCategories(data || []); setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [router])

  async function submit(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    const cleanTitle = title.trim()
    const cleanDescription = description.trim()
    const priceValue = Number(price)
    const daysValue = Number(days)
    if (cleanTitle.length < 5 || cleanTitle.length > 120) { setError('Service title must be between 5 and 120 characters.'); setSaving(false); return }
    if (cleanDescription.length < 20 || cleanDescription.length > 5000) { setError('Description must be between 20 and 5000 characters.'); setSaving(false); return }
    if (!Number.isFinite(priceValue) || priceValue <= 0) { setError('Price must be greater than 0 PKR.'); setSaving(false); return }
    if (!Number.isInteger(priceValue)) { setError('Price must be a whole PKR amount.'); setSaving(false); return }
    if (!Number.isInteger(daysValue) || daysValue < 1 || daysValue > 365) { setError('Delivery time must be between 1 and 365 days.'); setSaving(false); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    const { error: insertError } = await supabase.from('services').insert({ freelancer_id: user.id, category_id: category || null, title: cleanTitle, description: cleanDescription, price_pkr: priceValue, delivery_days: daysValue, published: true })
    if (insertError) { setError(insertError.message); setSaving(false); return }
    router.push('/dashboard')
  }

  if (loading) return <main className="section"><div className="container"><p className="muted" role="status">Loading...</p></div></main>
  return <main className="section"><div className="container" style={{maxWidth:760}}>
    <span className="pill">Freelancer</span><h1>Create a service</h1><p className="muted">Publish a service clients can discover on HUNAR.</p>
    <form className="card" onSubmit={submit} style={{display:'grid',gap:16,marginTop:24}} aria-busy={saving}>
      <label htmlFor="service-title">Service title<input id="service-title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="I will build a modern website" minLength={5} maxLength={120} required /></label>
      <label htmlFor="service-category">Category<select id="service-category" value={category} onChange={e=>setCategory(e.target.value)}><option value="">Select category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label htmlFor="service-description">Description<textarea id="service-description" value={description} onChange={e=>setDescription(e.target.value)} rows={5} minLength={20} maxLength={5000} placeholder="Describe exactly what the client receives" required /><span className="muted" aria-live="polite">{description.length}/5000</span></label>
      <label htmlFor="service-price">Price (PKR)<input id="service-price" type="number" min="1" step="1" value={price} onChange={e=>setPrice(e.target.value)} required /></label>
      <label htmlFor="service-days">Delivery days<input id="service-days" type="number" min="1" max="365" step="1" value={days} onChange={e=>setDays(e.target.value)} required /></label>
      {error && <p role="alert">{error}</p>}
      <button className="btn primary" disabled={saving}>{saving ? 'Publishing...' : 'Publish service'}</button>
    </form>
  </div></main>
}