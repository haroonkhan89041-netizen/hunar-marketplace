import Link from 'next/link'

const categories = [
  ['Programming & Tech','Websites, apps, software and development','💻'],
  ['Graphics & Design','Logos, branding, UI/UX and creative design','🎨'],
  ['Digital Marketing','SEO, social media, ads and growth','📈'],
  ['Writing & Translation','Articles, copywriting, translation and editing','✍️'],
  ['Video & Animation','Video editing, motion graphics and animation','🎬'],
  ['Business & Consulting','Business plans, research and professional support','💼'],
  ['AI Services','AI automation, chatbots and intelligent tools','🤖'],
  ['Data & Analytics','Data entry, dashboards, analysis and reporting','📊'],
]

export default function Categories(){
  return <main className="section"><div className="container">
    <span className="pill">Explore skills</span>
    <h1>Find the right talent for your next project</h1>
    <p className="muted" style={{maxWidth:720}}>Browse HUNAR categories and discover Pakistani freelancers offering professional services for local and global clients.</p>
    <div className="grid" style={{marginTop:28}}>{categories.map(([name,desc,icon])=><Link className="card category-card" href={`/talent?category=${encodeURIComponent(name)}`} key={name} aria-label={`Explore ${name}`}>
      <div aria-hidden="true" style={{fontSize:34,marginBottom:12}}>{icon}</div><h3 style={{overflowWrap:'anywhere'}}>{name}</h3><p className="muted" style={{overflowWrap:'anywhere'}}>{desc}</p><span className="btn">Explore <span aria-hidden="true">→</span></span>
    </Link>)}</div>
  </div></main>
}
