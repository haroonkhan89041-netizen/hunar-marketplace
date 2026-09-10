import Link from 'next/link'

const categories = [
  ['Programming & Tech','Websites, apps, software and development','01','⌁'],
  ['Graphics & Design','Logos, branding, UI/UX and creative design','02','✦'],
  ['Digital Marketing','SEO, social media, ads and growth','03','↗'],
  ['Writing & Translation','Articles, copywriting, translation and editing','04','Aa'],
  ['Video & Animation','Video editing, motion graphics and animation','05','▶'],
  ['Business & Consulting','Business plans, research and professional support','06','◎'],
  ['AI Services','AI automation, chatbots and intelligent tools','07','⌘'],
  ['Data & Analytics','Data entry, dashboards, analysis and reporting','08','▦'],
]

export default function Categories(){
 return <main className="section discovery"><div className="container"><div className="discoveryHero"><span className="pill">HUNAR Skill Directory</span><h1>Everything you need. <span>One network.</span></h1><p>Browse the skills powering modern businesses. Find Pakistani specialists for digital products, creative work, growth and operations.</p></div><div className="categoryGrid">{categories.map(([name,desc,index,icon])=><Link className="card categoryCard" href={`/talent?category=${encodeURIComponent(name)}`} key={name} aria-label={`Explore ${name}`}><span className="categoryIndex">CAT / {index}</span><div><div className="categoryIcon" aria-hidden="true">{icon}</div><h3>{name}</h3><p className="muted">{desc}</p></div><span className="categoryArrow">Explore specialists →</span></Link>)}</div><div className="card" style={{marginTop:48,textAlign:'left',padding:'30px'}}><span className="pill">Need something specific?</span><h2 style={{marginTop:18}}>Turn your brief into a project.</h2><p className="muted" style={{maxWidth:650,lineHeight:1.7}}>Tell HUNAR what you need and let skilled freelancers come to you with proposals.</p><Link className="btn primary" href="/project/new" style={{marginTop:14}}>Post a project ↗</Link></div></div></main>
}