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
  const [avatarUrl, setAvatarUrl] = useState('')
  const [role, setRole] = useState('client')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data, error: profileError } = await supabase.from('profiles').select('full_name, username, bio, location, avatar_url, role').eq('id', user.id).single()
      if (!mounted) return
      setEmail(user.email || '')
      if (profileError) setError('We could not load your profile. Please try again.')
      if (data) {
        setName(data.full_name || '')
        setUsername(data.username || '')
        setBio(data.bio || '')
        setLocation(data.location || 'Pakistan')
        setAvatarUrl(data.avatar_url || '')
        setRole(data.role || 'client')
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [router])

  async function save(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError(''); setMessage('')
    const cleanName = name.trim()
    const cleanUsername = username.trim().toLowerCase()
    const cleanBio = bio.trim()
    const cleanLocation = location.trim()
    const cleanAvatarUrl = avatarUrl.trim()
    if (cleanName.length < 2 || cleanName.length > 100) { setError('Full name must be between 2 and 100 characters.'); setSaving(false); return }
    if (cleanUsername && (cleanUsername.length < 3 || cleanUsername.length > 30 || !/^[a-z0-9_-]+$/.test(cleanUsername))) { setError('Username must be 3–30 characters and use only letters, numbers, hyphens, or underscores.'); setSaving(false); return }
    if (cleanBio.length > 2000) { setError('Bio must be 2000 characters or less.'); setSaving(false); return }
    if (cleanLocation.length > 100) { setError('Location must be 100 characters or less.'); setSaving(false); return }
    if (cleanAvatarUrl && !/^https:\/\//i.test(cleanAvatarUrl)) { setError('Profile photo URL must start with https://'); setSaving(false); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    const { error: updateError } = await supabase.from('profiles').update({ full_name: cleanName, username: cleanUsername || null, bio: cleanBio || null, location: cleanLocation || null, avatar_url: cleanAvatarUrl || null }).eq('id', user.id)
    if (updateError) setError(updateError.message)
    else { setUsername(cleanUsername); setMessage('Profile updated successfully.') }
    setSaving(false)
  }

  if (loading) return <main className="section"><div className="container"><p className="muted" role="status">Loading profile...</p></div></main>

  return <main className="section"><div className="container" style={{maxWidth:760}}>
    <span className="pill">Your profile</span><h1>Edit profile</h1><p className="muted">Keep your HUNAR profile professional and up to date.</p>
    <form className="card" onSubmit={save} style={{marginTop:24, display:'grid', gap:16}} aria-busy={saving}>
      {avatarUrl && <img src={avatarUrl} alt="Profile preview" className="avatar-large" style={{width:96,height:96,objectFit:'cover',borderRadius:'50%'}} />}
      <label htmlFor="avatar-url">Profile photo URL<input id="avatar-url" type="url" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} placeholder="https://..." /></label>
      <label htmlFor="full-name">Full name<input id="full-name" value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={100} required /></label>
      <label htmlFor="profile-email">Email<input id="profile-email" value={email} disabled /></label>
      <label htmlFor="username">Username<input id="username" value={username} onChange={e=>setUsername(e.target.value)} minLength={3} maxLength={30} placeholder="your-username" autoCapitalize="none" /><span className="muted">3–30 characters: letters, numbers, - or _</span></label>
      <label htmlFor="location">Location<input id="location" value={location} onChange={e=>setLocation(e.target.value)} maxLength={100} /></label>
      <label htmlFor="bio">Bio<textarea id="bio" value={bio} onChange={e=>setBio(e.target.value)} rows={5} maxLength={2000} placeholder="Tell clients about your skills and experience" /><span className="muted" aria-live="polite">{bio.length}/2000</span></label>
      <label htmlFor="account-type">Account type<input id="account-type" value={role} disabled /></label>
      {error && <p role="alert">{error}</p>}{message && <p role="status" aria-live="polite">{message}</p>}
      <button className="btn primary" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
    </form>
  </div></main>
}