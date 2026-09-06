const steps=[
  ['01','Choose your path','Clients can browse talent and services. Freelancers can create a profile and publish services.'],
  ['02','Start the work','Post a project or order a service, then share clear requirements and communicate through HUNAR.'],
  ['03','Track progress','Orders move through clear statuses, while both sides can review requirements, delivery and messages.'],
  ['04','Complete & build trust','Clients approve completed work and both sides can leave reviews to build a stronger marketplace reputation.'],
];

export default function How(){return <main className="section"><div className="container"><div className="sectionHeader"><div><span className="eyebrow">SIMPLE BY DESIGN</span><h1>How HUNAR works</h1><p className="muted">A clear workflow for clients and Pakistani freelancers, from first search to completed work.</p></div></div><div className="grid">{steps.map(([n,t,d])=><div className="card" key={n}><div style={{fontWeight:800,fontSize:13,letterSpacing:1}}>{n}</div><h2>{t}</h2><p className="muted">{d}</p></div>)}</div><div className="section" style={{paddingBottom:0}}><div className="card"><h2>Built for trust</h2><p className="muted">Secure participant-only messaging, controlled order status changes, reviews after completed orders, and clear project proposals help keep every transaction organized.</p><div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:18}}><a className="btn primary" href="/talent">Find Talent</a><a className="btn" href="/work">Find Work</a></div></div></div></div></main>}
