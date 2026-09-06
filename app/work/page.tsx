'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Project = { id: string; title: string; description: string | null; budget_min: number | null; budget_max: number | null; deadline: string | null; created_at: string };

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('projects').select('id,title,description,budget_min,budget_max,deadline,created_at').order('created_at', { ascending: false });
      setProjects(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return <main className="section"><div className="container">
    <span className="pill">Find Work</span>
    <h1>Projects from clients worldwide</h1>
    <p className="muted">Discover projects posted on HUNAR and submit your proposal.</p>
    {loading ? <p>Loading projects...</p> : projects.length === 0 ? <div className="card"><h3>No projects posted yet</h3><p className="muted">Be the first client to post a project.</p><Link className="btn primary" href="/dashboard">Open dashboard</Link></div> : <div className="grid">{projects.map((project) => <div className="card" key={project.id}>
      <span className="pill">Open project</span>
      <h3>{project.title}</h3>
      <p className="muted">{project.description || 'No description provided.'}</p>
      <p><b>{project.budget_min != null || project.budget_max != null ? `PKR ${Number(project.budget_min ?? 0).toLocaleString()}–${Number(project.budget_max ?? project.budget_min ?? 0).toLocaleString()}` : 'Budget negotiable'}</b></p>
      {project.deadline && <p className="muted">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>}
      <Link className="btn primary" href="/signup">Submit proposal</Link>
    </div>)}</div>}
  </div></main>;
}