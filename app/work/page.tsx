'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Project = { id:string; title:string; description:string|null; budget_min:number|null; budget_max:number|null; deadline:string|null; created_at:string }

export default function Work(){
  const params=useSearchParams(); const category=params.get('category')||''
  const [projects,setProjects]=useState<Project[]>([]); const [query,setQuery]=useState(''); const [loading,setLoading]=useState(true)
  useEffect(()=>{async function load(){const {data}=await supabase.from('projects').select('id,title,description,budget_min,budget_max,deadline,created_at').order('created_at',{ascending:false});setProjects(data??[]);setLoading(false)}load()},[])
  const filtered=useMemo(()=>projects.filter(p=>{const text=`${p.title} ${p.description||''}`.toLowerCase();return (!query.trim()||text.includes(query.trim().toLowerCase()))&&(!category||text.includes(category.toLowerCase().split(' & ')[0]))}),[projects,query,category])
  return <main className="section"><div className="container"><span className="pill">Find Work</span><h1>Find projects and win your next client</h1><p className="muted">Explore projects posted on HUNAR and send a professional proposal.</p><div className="searchbar" style={{marginTop:24}}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search projects..." aria-label="Search projects"/></div>{category&&<p className="muted" style={{marginTop:12}}>Category: <b>{category}</b> · <Link href="/work">Clear filter</Link></p>}{loading?<p>Loading projects...</p>:filtered.length===0?<div className="card" style={{marginTop:24}}><h3>No matching projects</h3><p className="muted">Try another search or check back later for new client projects.</p></div>:<div className="grid" style={{marginTop:24}}>{filtered.map(p=><div className="card" key={p.id}><span className="pill">Open project</span><h3>{p.title}</h3><p className="muted">{p.description||'No description provided.'}</p><p><b>{p.budget_min!=null||p.budget_max!=null?`PKR ${Number(p.budget_min??0).toLocaleString()}–${Number(p.budget_max??p.budget_min??0).toLocaleString()}`:'Budget negotiable'}</b></p>{p.deadline&&<p className="muted">Deadline: {new Date(p.deadline).toLocaleDateString()}</p>}<div style={{display:'flex',gap:10,flexWrap:'wrap'}}><Link className="btn" href={`/project/${p.id}`}>View project</Link><Link className="btn primary" href={`/proposals?project=${p.id}`}>Submit proposal</Link></div></div>)}</div>}</div></main>
}
