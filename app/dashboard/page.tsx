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
      if (!user) {
        router.replace('/login')
        return
      }
      setEmail(user.email || '')
      const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
      if (active) {
        setProfile(data)
        setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [router])

  async function logout() {
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }

  if (loading) return <main className="section"><div className="container"><p className="muted">Loading your dashboard...</p></div></main>

  const role = profile?.role || 'client'
  return (
    <main className="section">
      <div className="container">
        <div className="sectionhead">
          <div>
            <span className="pill">HUNAR dashboard</span>
            <h1>Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}.</h1>
            <p className="muted">{email} · {role}</p>
          </div>
          <button className="btn" onClick={logout}>Log out</button>
        </div>

        <div className="grid" style={{ marginTop: 28 }}>
          <Link className="card" href="/talent"><h3>Find Talent</h3><p className="muted">Discover skilled Pakistani freelancers.</p></Link>
          <Link className="card" href="/work"><h3>Find Work</h3><p className="muted">Explore opportunities and freelance work.</p></Link>
          <Link className="card" href="/categories"><h3>Browse Categories</h3><p className="muted">Explore services by skill and category.</p></Link>
          <Link className="card" href="/checkout"><h3>Orders & Checkout</h3><p className="muted">Review your marketplace purchase flow.</p></Link>
        </div>
      </div>
    </main>
  )
}