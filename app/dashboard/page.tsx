'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Profile = { full_name: string | null; role: 'client' | 'freelancer' | 'admin' | null }

export default function Dashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      setEmail(user.email || '')
      const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
      if (active) { setProfile(data); setLoading(false) }
    }
    load()
    return () => { active = false }
  }, [router])

  async function logout() { await supabase.auth.signOut(); router.replace('/'); router.refresh() }

  if (loading) return <main className="section"><div className="container"><p className="muted">Loading your dashboard...</p></div></main>
  const role = profile?.role || 'client'
  const freelancer = role === 'freelancer' || role === 'admin'

  return <main className="section"><div className="container">
    <div className="sectionhead"><div><span className="pill">HUNAR dashboard</span><h1>Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}.</h1><p className="muted">{email} · {role}</p></div><button className="btn" onClick={logout}>Log out</button></div>
    <div className="grid" style={{marginTop:28}}>
      <Link className="card" href="/profile"><h3>My Profile</h3><p className="muted">Update your name, username, bio and location.</p></Link>
      <Link className="card" href="/orders"><h3>My Orders</h3><p className="muted">Track orders, delivery, revisions and messages.</p></Link>
      <Link className="card" href="/messages"><h3>Messages</h3><p className="muted">Communicate with clients and freelancers.</p></Link>
      {freelancer ? <Link className="card" href="/freelancer/new-service"><h3>Create a Service</h3><p className="muted">Publish a professional service and start receiving orders.</p></Link> : <Link className="card" href="/project/new"><h3>Post a Project</h3><p className="muted">Tell freelancers what you need and set your budget.</p></Link>}
      <Link className="card" href="/talent"><h3>Find Talent</h3><p className="muted">Discover skilled Pakistani freelancers.</p></Link>
      <Link className="card" href="/work"><h3>Find Work</h3><p className="muted">Explore client projects and freelance opportunities.</p></Link>
      <Link className="card" href="/categories"><h3>Browse Categories</h3><p className="muted">Explore services by skill and category.</p></Link>
    </div>
  </div></main>
}