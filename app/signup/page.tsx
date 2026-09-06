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
    setError('')
    setMessage('')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role } },
    })
    setLoading(false)
    if (error) return setError(error.message)
    if (data.session) router.push('/')
    else setMessage('Account created. Please check your email to confirm your account, then log in.')
  }

  return <main className="auth"><span className="pill">Join HUNAR</span><h1>Create your account</h1><p className="muted">Start hiring talent or selling your skills.</p><form onSubmit={handleSubmit}>
    <div className="field"><label>Full name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required /></div>
    <div className="field"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" required /></div>
    <div className="field"><label>Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="At least 6 characters" minLength={6} required /></div>
    <div className="field"><label>I want to</label><select value={role} onChange={e=>setRole(e.target.value as 'client'|'freelancer')}><option value="client">Hire freelancers</option><option value="freelancer">Work as a freelancer</option></select></div>
    {error && <p style={{color:'crimson'}}>{error}</p>}{message && <p>{message}</p>}
    <button className="btn primary" style={{width:'100%'}} disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
  </form><p className="muted" style={{marginTop:16}}>Already have an account? <Link href="/login">Log in</Link></p></main>
}
