'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Category = { id: string; name: string }

export default function NewProject() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [deadline, setDeadline] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'client' && profile?.role !== 'admin') { router.replace('/dashboard'); return }
      const { data } = await supabase.from('categories').select('id,name').order('name')
      setCategories(data || []); setLoading(false)
    }
    load()
  }, [router])

  async function submit(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    if (min && max && Number(max) < Number(min)) { setError('Maximum budget must be greater than minimum budget.'); setSaving(false); return }
    const { error: insertError } = await supabase.from('projects').insert({ client_id: user.id, category_id: category || null, title: title.trim(), description: description.trim() || null, budget_min: min ? Number(min) : null, budget_max: max ? Number(max) : null, deadline: deadline || null })
    if (insertError) { setError(insertError.message); setSaving(false); return }
    router.push('/work')
  }

  if (loading) return <main className="section"><div className="container"><p className="muted">Loading...</p></div></main>
  return <main className="section"><div className="container" style={{maxWidth:760}}>
    <span className="pill">Client</span><h1>Post a project</h1><p className="muted">Tell skilled HUNAR freelancers what you need.</p>
    <form className="card" onSubmit={submit} style={{display:'grid',gap:16,marginTop:24}}>
      <label>Project title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Build my business website" required /></label>
      <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Select category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} rows={6} placeholder="Explain your requirements, deliverables and expectations" /></label>
      <div className="grid"><label>Minimum budget (PKR)<input type="number" min="0" value={min} onChange={e=>setMin(e.target.value)} /></label><label>Maximum budget (PKR)<input type="number" min="0" value={max} onChange={e=>setMax(e.target.value)} /></label></div>
      <label>Deadline<input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} /></label>
      {error && <p role="alert">{error}</p>}
      <button className="btn primary" disabled={saving}>{saving ? 'Posting...' : 'Post project'}</button>
    </form>
  </div></main>
}