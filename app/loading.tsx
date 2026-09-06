export default function Loading() {
  return (
    <main className="container" aria-busy="true" aria-live="polite" style={{ padding: '96px 20px', textAlign: 'center' }}>
      <p style={{ fontWeight: 700 }}>Loading HUNAR…</p>
      <p style={{ marginTop: 10 }}>Please wait while we prepare this page.</p>
    </main>
  );
}
