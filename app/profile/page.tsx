'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('Pakistan')
  const [role, setRole] = useState('client')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      setEmail(user.email || '')
      const { data } = await supabase.from('profiles').select('full_name, username, bio, location, role').eq('id', user.id).single()
      if (data) {
        setName(data.full_name || '')
        setUsername(data.username || '')
        setBio(data.bio || '')
        setLocation(data.location || 'Pakistan')
        setRole(data.role || 'client')
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function save(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError(''); setMessage('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    const { error: updateError } = await supabase.from('profiles').update({ full_name: name.trim(), username: username.trim() || null, bio: bio.trim() || null, location: location.trim() || null }).eq('id', user.id)
    if (updateError) setError(updateError.message)
    else setMessage('Profile updated successfully.')
    setSaving(false)
  }

  if (loading) return <main className="section"><div className="container"><p className="muted">Loading profile...</p></div></main>

  return <main className="section"><div className="container" style={{maxWidth:760}}>
    <span className="pill">Your profile</span><h1>Edit profile</h1><p className="muted">Keep your HUNAR profile professional and up to date.</p>
    <form className="card" onSubmit={save} style={{marginTop:24, display:'grid', gap:16}}>
      <label>Full name<input value={name} onChange={e=>setName(e.target.value)} required /></label>
      <label>Email<input value={email} disabled /></label>
      <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} placeholder="your-username" /></label>
      <label>Location<input value={location} onChange={e=>setLocation(e.target.value)} /></label>
      <label>Bio<textarea value={bio} onChange={e=>setBio(e.target.value)} rows={5} placeholder="Tell clients about your skills and experience" /></label>
      <label>Account type<input value={role} disabled /></label>
      {error && <p role="alert">{error}</p>}{message && <p>{message}</p>}
      <button className="btn primary" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
    </form>
  </div></main>
}