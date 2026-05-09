import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <section className="card" style={{ maxWidth: 520 }}>
        <div className="eyebrow">404</div>
        <h1 className="page-title">Workout not found</h1>
        <p className="muted">Return to the dashboard and continue the HYROX build.</p>
        <Link className="btn primary" href="/dashboard">Dashboard</Link>
      </section>
    </main>
  );
}

