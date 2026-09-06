import Link from 'next/link'

export default function Profile(){
 return <main className="section"><div className="container">
  <div className="sectionhead"><div><span className="pill">✓ Verified freelancer</span><h1>Zainab Malik</h1><p className="muted">Full-Stack Developer · Karachi, Pakistan</p><p>★ 4.9 · 120 reviews · 98% completion · Responds within 1 hour</p></div><Link className="btn" href="/talent">← Browse talent</Link></div>
  <div className="grid" style={{marginTop:30}}>
   <div className="card" style={{gridColumn:'span 3'}}><h2>About</h2><p className="muted">I build modern web applications with React, Next.js, TypeScript and Supabase. I focus on clean UX, reliable delivery and long-term client relationships.</p><h2 style={{marginTop:28}}>Skills</h2><p>Next.js · React · TypeScript · Supabase · UI Engineering · APIs</p><h2 style={{marginTop:28}}>Portfolio</h2><div className="grid" style={{marginTop:16}}><div className="card"><h3>SaaS Dashboard</h3><p className="muted">Modern analytics and productivity interface.</p></div><div className="card"><h3>E-commerce Platform</h3><p className="muted">Responsive shopping experience with admin tools.</p></div><div className="card"><h3>Marketplace App</h3><p className="muted">Service discovery, orders and messaging workflow.</p></div><div className="card"><h3>Admin System</h3><p className="muted">Secure management dashboard and reporting.</p></div></div></div>
   <div className="card"><span className="pill">Popular service</span><h3 style={{marginTop:14}}>Web application development</h3><p className="muted">Starting from</p><h2>PKR 8,000</h2><p>Delivery: 5 days · 2 revisions</p><Link className="btn primary" href="/checkout" style={{display:'inline-flex',marginTop:12}}>Order now</Link><p className="muted" style={{marginTop:12}}>Secure checkout · Requirements collected before work starts.</p></div>
  </div>
 </div></main>
}