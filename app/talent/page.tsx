'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Freelancer = { id: string; full_name: string; username: string | null; bio: string | null; location: string | null; verified: boolean };

type Service = { id: string; freelancer_id: string; title: string; price_pkr: number; rating: number; review_count: number; delivery_days: number };

export default function Talent() {
  const [people, setPeople] = useState<Freelancer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: profiles }, { data: serviceRows }] = await Promise.all([
        supabase.from('profiles').select('id,full_name,username,bio,location,verified').eq('role', 'freelancer').order('created_at', { ascending: false }),
        supabase.from('services').select('id,freelancer_id,title,price_pkr,rating,review_count,delivery_days').eq('published', true).order('created_at', { ascending: false }),
      ]);
      setPeople(profiles ?? []);
      setServices(serviceRows ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const serviceFor = (id: string) => services.find((s) => s.freelancer_id === id);

  return <main className="section"><div className="container">
    <span className="pill">Find Talent</span>
    <h1>Verified freelancers ready to work</h1>
    <p className="muted">Browse real HUNAR freelancer profiles and published services.</p>
    {loading ? <p>Loading talent...</p> : people.length === 0 ? <div className="card"><h3>No freelancers yet</h3><p className="muted">Create a freelancer account and publish your first service to appear here.</p><Link className="btn primary" href="/signup">Join as freelancer</Link></div> : <div className="grid">{people.map((person) => { const service = serviceFor(person.id); return <div className="card" key={person.id}>
      <span className="pill">{person.verified ? '✓ Verified' : 'Freelancer'}</span>
      <h3>{person.full_name}</h3>
      <p>{person.bio || 'Professional freelancer on HUNAR.'}</p>
      <p className="muted">{person.location || 'Pakistan'}{service ? ` · ★ ${Number(service.rating).toFixed(1)} (${service.review_count})` : ''}</p>
      {service && <><p><b>{service.title}</b></p><p className="muted">Starting from PKR {Number(service.price_pkr).toLocaleString()} · {service.delivery_days} day delivery</p></>}
      <Link className="btn primary" href={`/freelancer/${person.username || person.id}`}>View profile</Link>
    </div> })}</div>}
  </div></main>;
}