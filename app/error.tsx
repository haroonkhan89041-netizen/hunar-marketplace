'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container" style={{ padding: '96px 20px', textAlign: 'center' }}>
      <p style={{ fontWeight: 700, letterSpacing: '0.08em' }}>Something went wrong</p>
      <h1 style={{ marginTop: 10 }}>We couldn't load this page</h1>
      <p style={{ margin: '14px auto 28px', maxWidth: 560 }}>
        Please try again. If the problem continues, return to HUNAR and continue from there.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn primary" type="button" onClick={() => reset()}>Try again</button>
        <a className="btn" href="/">Back to HUNAR</a>
      </div>
    </main>
  );
}
