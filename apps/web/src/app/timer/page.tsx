import { AppShell } from "../../components/app-shell";
import { TimerPanel } from "../../components/timer-panel";

export default function TimerRoute() {
  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">HYROX Timer Mode</div>
          <h1>Intervals and stations</h1>
        </div>
      </header>
      <section className="grid dashboard-grid">
        <TimerPanel initialSeconds={720} />
        <div className="card">
          <div className="section-title">
            <h2>Timer modes</h2>
          </div>
          <div className="grid">
            <div className="phase-row"><span className="chip green">10:00</span><strong>Countdown</strong><span className="muted">General block</span></div>
            <div className="phase-row"><span className="chip">5:00</span><strong>1 km rep</strong><span className="muted">Race pace intervals</span></div>
            <div className="phase-row"><span className="chip">12:00</span><strong>EMOM</strong><span className="muted">Wall balls</span></div>
            <div className="phase-row"><span className="chip">1:30</span><strong>Station rest</strong><span className="muted">Simulation recovery</span></div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

