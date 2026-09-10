'use client'

import Link from 'next/link'
import { useState } from 'react'

const cats=[['Programming & Tech','https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80'],['Graphics & Design','https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80'],['Digital Marketing','https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80'],['Writing & Translation','https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80'],['Video & Animation','https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80'],['Business & Consulting','https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80'],['AI Services','https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80'],['Data & Analytics','https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80']]
const people=[['Zainab Malik','Full-Stack Developer','PKR 8,000','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'],['Ayesha Khan','UI/UX Designer','PKR 5,000','https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80'],['Hamza Ali','Digital Marketer','PKR 4,500','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'],['Usman Ahmed','Video Editor','PKR 3,500','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80']]

export default function Home(){
 const [query,setQuery]=useState('')
 const searchHref=query.trim()?`/talent?q=${encodeURIComponent(query.trim())}`:'/talent'
 return <main>
  <section className="hero">
   <div className="container">
    <span className="pill">Pakistan's talent · Global opportunities</span>
    <h1>Talent without borders.<br/><em>Work without limits.</em></h1>
    <p>HUNAR is the premium marketplace for discovering Pakistani freelancers, launching projects, and building with exceptional people around the world.</p>
    <div className="search">
      <input id="home-search" aria-label="Search for a service" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')window.location.href=searchHref}} placeholder="What do you need help with?"/>
      <Link className="btn primary" href={searchHref}>Explore talent ↗</Link>
    </div>
    <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:10}}>
      <Link className="btn" href="/work">Post a project</Link>
      <Link className="btn" href="/signup">Join HUNAR</Link>
    </div>
    <div style={{display:'flex',gap:28,flexWrap:'wrap',marginTop:46,color:'#777e96',fontSize:12,textTransform:'uppercase',letterSpacing:'.1em'}}><span>✓ Verified talent</span><span>✓ Secure projects</span><span>✓ Global clients</span></div>
   </div>
  </section>

  <section className="section"><div className="container">
   <div className="sectionHeader"><div><span className="pill">Explore the network</span><h2 style={{marginTop:16}}>What are you looking for?</h2><p className="muted">Browse the skills and services clients hire on HUNAR.</p></div><Link href="/categories" className="btn">View all categories ↗</Link></div>
   <div className="grid">{cats.map(([c,img],i)=><Link className="card image-card" href={`/talent?category=${encodeURIComponent(c)}`} key={c}><img src={img} alt="" loading="lazy"/><div><span style={{color:'#6068e6',fontSize:11,fontWeight:800}}>0{i+1}</span><br/><b>{c}</b><p className="muted">Explore top HUNAR talent →</p></div></Link>)}</div>
  </div></section>

  <section className="section"><div className="container">
   <div className="sectionHeader"><div><span className="pill">Featured talent</span><h2 style={{marginTop:16}}>People worth working with.</h2><p className="muted">Discover skilled professionals ready to take your next idea forward.</p></div><Link href="/talent" className="btn">Browse talent ↗</Link></div>
   <div className="grid">{people.map(([n,t,p,img])=><div className="card profile-card" key={n}><img className="avatar-large" src={img} alt={n}/><span className="pill">Verified</span><h3>{n}</h3><p className="muted">{t}</p><p style={{color:'#d6d9e7'}}>★ 4.9 <span className="muted">· 120+ reviews</span></p><b>Starting {p}</b><br/><br/><Link className="btn" href={n==='Zainab Malik'?'/freelancer/zainab-malik':'/talent'}>View profile ↗</Link></div>)}</div>
  </div></section>

  <section className="section"><div className="container">
   <div className="sectionHeader"><div><span className="pill">Simple by design</span><h2 style={{marginTop:16}}>From idea to delivery.</h2><p className="muted">A focused workflow that keeps projects moving.</p></div><Link href="/how-it-works" className="btn">How it works ↗</Link></div>
   <div className="grid">{[['01','Discover','Search verified talent or projects.'],['02','Connect','Agree on scope, price and deadline.'],['03','Create','Work securely with organized messaging.'],['04','Deliver','Approve the work and leave a review.']].map(x=><div className="card" key={x[0]}><span style={{fontFamily:'monospace',color:'#6068e6',fontSize:13}}>{x[0]}</span><h3>{x[1]}</h3><p className="muted">{x[2]}</p></div>)}</div>
  </div></section>

  <section className="section"><div className="container"><div className="card" style={{padding:'70px 30px',textAlign:'center',background:'radial-gradient(circle at 50% 0%,rgba(96,104,230,.18),transparent 55%),linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.015))'}}><span className="pill">Ready when you are</span><h2 style={{fontSize:'clamp(42px,6vw,70px)',marginTop:22}}>Build something<br/><span style={{color:'#989fe2'}}>remarkable.</span></h2><p className="muted" style={{maxWidth:560,margin:'0 auto',lineHeight:1.7}}>Hire skilled Pakistani talent or turn your own skills into opportunities with HUNAR.</p><div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap',marginTop:26}}><Link className="btn primary" href="/talent">Find talent ↗</Link><Link className="btn" href="/signup">Start earning ↗</Link></div></div></div></section>
 </main>
}