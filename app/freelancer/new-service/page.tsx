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
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'freelancer' && profile?.role !== 'admin') { router.replace('/dashboard'); return }
      const { data } = await supabase.from('categories').select('id, name').order('name')
      setCategories(data || [])
      setLoading(false)
    }
    load()
  }, [router])

  async function submit(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    const { error: insertError } = await supabase.from('services').insert({ freelancer_id: user.id, category_id: category || null, title: title.trim(), description: description.trim() || null, price_pkr: Number(price), delivery_days: Number(days), published: true })
    if (insertError) { setError(insertError.message); setSaving(false); return }
    router.push('/dashboard')
  }

  if (loading) return <main className="section"><div className="container"><p className="muted">Loading...</p></div></main>
  return <main className="section"><div className="container" style={{maxWidth:760}}>
    <span className="pill">Freelancer</span><h1>Create a service</h1><p className="muted">Publish a service clients can discover on HUNAR.</p>
    <form className="card" onSubmit={submit} style={{display:'grid',gap:16,marginTop:24}}>
      <label>Service title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="I will build a modern website" required /></label>
      <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Select category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} rows={5} placeholder="Describe exactly what the client receives" /></label>
      <label>Price (PKR)<input type="number" min="1" value={price} onChange={e=>setPrice(e.target.value)} required /></label>
      <label>Delivery days<input type="number" min="1" value={days} onChange={e=>setDays(e.target.value)} required /></label>
      {error && <p role="alert">{error}</p>}
      <button className="btn primary" disabled={saving}>{saving ? 'Publishing...' : 'Publish service'}</button>
    </form>
  </div></main>
}