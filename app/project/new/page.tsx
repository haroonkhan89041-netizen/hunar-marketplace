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
    let mounted = true
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'client' && profile?.role !== 'admin') { router.replace('/dashboard'); return }
      const { data } = await supabase.from('categories').select('id,name').order('name')
      if (mounted) { setCategories(data || []); setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [router])

  async function submit(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    const cleanTitle = title.trim()
    const cleanDescription = description.trim()
    const minValue = min ? Number(min) : null
    const maxValue = max ? Number(max) : null
    if (cleanTitle.length < 5 || cleanTitle.length > 160) { setError('Project title must be between 5 and 160 characters.'); setSaving(false); return }
    if (cleanDescription.length < 20 || cleanDescription.length > 5000) { setError('Description must be between 20 and 5000 characters.'); setSaving(false); return }
    if (minValue !== null && (!Number.isFinite(minValue) || minValue <= 0)) { setError('Minimum budget must be greater than 0.'); setSaving(false); return }
    if (maxValue !== null && (!Number.isFinite(maxValue) || maxValue <= 0)) { setError('Maximum budget must be greater than 0.'); setSaving(false); return }
    if (minValue !== null && maxValue !== null && maxValue < minValue) { setError('Maximum budget must be greater than or equal to minimum budget.'); setSaving(false); return }
    if (deadline && deadline < new Date().toISOString().slice(0, 10)) { setError('Deadline cannot be in the past.'); setSaving(false); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    const { error: insertError } = await supabase.from('projects').insert({ client_id: user.id, category_id: category || null, title: cleanTitle, description: cleanDescription, budget_min: minValue, budget_max: maxValue, deadline: deadline || null })
    if (insertError) { setError(insertError.message); setSaving(false); return }
    router.push('/work')
  }

  if (loading) return <main className="section"><div className="container"><p className="muted" role="status">Loading...</p></div></main>
  return <main className="section"><div className="container" style={{maxWidth:760}}>
    <span className="pill">Client</span><h1>Post a project</h1><p className="muted">Tell skilled HUNAR freelancers what you need.</p>
    <form className="card" onSubmit={submit} style={{display:'grid',gap:16,marginTop:24}} aria-busy={saving}>
      <label htmlFor="project-title">Project title<input id="project-title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Build my business website" minLength={5} maxLength={160} required /></label>
      <label htmlFor="project-category">Category<select id="project-category" value={category} onChange={e=>setCategory(e.target.value)}><option value="">Select category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label htmlFor="project-description">Description<textarea id="project-description" value={description} onChange={e=>setDescription(e.target.value)} rows={6} minLength={20} maxLength={5000} placeholder="Explain your requirements, deliverables and expectations" required /><span className="muted" aria-live="polite">{description.length}/5000</span></label>
      <div className="grid"><label htmlFor="budget-min">Minimum budget (PKR)<input id="budget-min" type="number" min="1" step="1" value={min} onChange={e=>setMin(e.target.value)} /></label><label htmlFor="budget-max">Maximum budget (PKR)<input id="budget-max" type="number" min="1" step="1" value={max} onChange={e=>setMax(e.target.value)} /></label></div>
      <label htmlFor="project-deadline">Deadline<input id="project-deadline" type="date" min={new Date().toISOString().slice(0, 10)} value={deadline} onChange={e=>setDeadline(e.target.value)} /></label>
      {error && <p role="alert">{error}</p>}
      <button className="btn primary" disabled={saving}>{saving ? 'Posting...' : 'Post project'}</button>
    </form>
  </div></main>
}