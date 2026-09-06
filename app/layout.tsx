import './globals.css';
import Link from 'next/link';

export const metadata={
  metadataBase:new URL('https://hunar-marketplace.vercel.app'),
  title:{default:'HUNAR — Pakistan\'s Talent. The World\'s Opportunities.',template:'%s | HUNAR'},
  description:'A professional freelance marketplace connecting Pakistani talent with clients around the world.',
  keywords:['HUNAR','Pakistan freelancers','freelance marketplace','Pakistani talent','hire freelancers','remote work'],
  alternates:{canonical:'/'},
  robots:{index:true,follow:true},
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <div className="page">
    <header className="nav">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',gap:18}}>
        <Link className="logo" href="/" aria-label="HUNAR home">HUNAR</Link>
        <nav className="navlinks" aria-label="Main navigation">
          <Link href="/talent">Find Talent</Link><Link href="/work">Find Work</Link><Link href="/categories">Categories</Link><Link href="/how-it-works">How It Works</Link>
        </nav>
        <div className="actions">
          <Link className="btn" href="/login">Log in</Link><Link className="btn primary" href="/signup">Join HUNAR</Link>
        </div>
      </div>
    </header>
    {children}
    <footer className="footer">
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',gap:24,alignItems:'flex-start',flexWrap:'wrap'}}>
          <div><b>HUNAR</b><p>Pakistan's Talent. The World's Opportunities.</p></div>
          <nav aria-label="Footer navigation" style={{display:'flex',gap:16,flexWrap:'wrap',fontSize:14}}>
            <Link href="/talent">Talent</Link><Link href="/work">Work</Link><Link href="/categories">Categories</Link><Link href="/how-it-works">How It Works</Link>
          </nav>
        </div>
        <small>© 2026 HUNAR. Built for a global marketplace.</small>
      </div>
    </footer>
  </div>
}
