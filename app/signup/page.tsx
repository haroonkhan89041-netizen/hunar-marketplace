'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function Signup() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'client' | 'freelancer'>('client')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    if (cleanName.length < 2) return setError('Please enter your full name.')
    if (cleanName.length > 100) return setError('Name must be 100 characters or fewer.')
    if (!cleanEmail || !cleanEmail.includes('@')) return setError('Please enter a valid email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setError('')
    setMessage('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { full_name: cleanName, role } },
    })
    setLoading(false)
    if (error) return setError(error.message)
    if (data.session) router.push('/dashboard')
    else setMessage('Account created. Please check your email to confirm your account, then log in.')
  }

  return <main className="auth"><span className="pill">Join HUNAR</span><h1>Create your account</h1><p className="muted">Start hiring talent or selling your skills.</p><form onSubmit={handleSubmit} aria-busy={loading}>
    <div className="field"><label htmlFor="signup-name">Full name</label><input id="signup-name" name="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name" required maxLength={100} /></div>
    <div className="field"><label htmlFor="signup-email">Email</label><input id="signup-email" name="email" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" autoComplete="email" required /></div>
    <div className="field"><label htmlFor="signup-password">Password</label><input id="signup-password" name="password" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="At least 6 characters" autoComplete="new-password" minLength={6} required /></div>
    <div className="field"><label htmlFor="signup-role">I want to</label><select id="signup-role" value={role} onChange={e=>setRole(e.target.value as 'client'|'freelancer')}><option value="client">Hire freelancers</option><option value="freelancer">Work as a freelancer</option></select></div>
    {error && <p className="error" role="alert">{error}</p>}{message && <p role="status" aria-live="polite">{message}</p>}
    <button className="btn primary" style={{width:'100%'}} disabled={loading} aria-disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
  </form><p className="muted" style={{marginTop:16}}>Already have an account? <Link href="/login">Log in</Link></p></main>
}
