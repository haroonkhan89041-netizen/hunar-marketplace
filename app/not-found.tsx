import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '96px 20px', textAlign: 'center' }}>
      <p style={{ fontWeight: 700, letterSpacing: '0.08em' }}>404</p>
      <h1 style={{ marginTop: 10 }}>Page not found</h1>
      <p style={{ margin: '14px auto 28px', maxWidth: 560 }}>
        The page you are looking for may have moved, been removed, or never existed.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link className="btn primary" href="/">Back to HUNAR</Link>
        <Link className="btn" href="/talent">Find Talent</Link>
        <Link className="btn" href="/work">Find Work</Link>
      </div>
    </main>
  );
}
