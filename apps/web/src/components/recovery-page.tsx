"use client";

import { Activity, Droplets, HeartPulse, Moon, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { calculateRecoveryScore, recoveryLabel } from "@hyrox/shared";
import { apiFetch } from "../lib/api";
import { getRecoveryEntries, getSession, saveRecoveryEntry, type LocalRecoveryEntry } from "../lib/local-session";
import { MetricCard } from "./metric-card";
import { ProgressRing } from "./progress-ring";

export function RecoveryPage() {
  const [sleep, setSleep] = useState(8);
  const [hydration, setHydration] = useState(85);
  const [soreness, setSoreness] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const [entries, setEntries] = useState(getRecoveryEntries());

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    apiFetch<{ recovery: Array<LocalRecoveryEntry & { fatigueScore?: number }> }>("/recovery", { token: session.token })
      .then(({ recovery }) => setEntries(recovery.map((entry) => ({ ...entry, fatigue: entry.fatigue ?? entry.fatigueScore ?? 0 }))))
      .catch(() => undefined);
  }, []);

  const score = useMemo(
    () => calculateRecoveryScore({ sleepHours: sleep, hydrationPercent: hydration, soreness, fatigue }),
    [sleep, hydration, soreness, fatigue]
  );
  const label = recoveryLabel(score);

  async function save() {
    const next = saveRecoveryEntry({
      date: new Date().toISOString().slice(0, 10),
      score,
      sleep,
      hydration,
      soreness,
      fatigue
    });
    setEntries(next);
    const session = getSession();
    if (session) {
      await apiFetch("/recovery", {
        method: "POST",
        token: session.token,
        body: JSON.stringify({ sleep, hydration, soreness, fatigueScore: fatigue })
      }).catch(() => undefined);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">Recovery Dashboard</div>
          <h1>Readiness score</h1>
        </div>
        <button className="btn primary" type="button" onClick={save}>
          <Save size={18} />
          Save
        </button>
      </header>

      <section className="grid grid-4">
        <MetricCard label="Sleep" value={`${sleep}h`} detail="target 8h" icon={Moon} />
        <MetricCard label="Hydration" value={`${hydration}%`} detail="fluid target" icon={Droplets} />
        <MetricCard label="Soreness" value={soreness} detail="0-10" icon={Activity} />
        <MetricCard label="Fatigue" value={fatigue} detail={label.label} tone={label.tone} icon={HeartPulse} />
      </section>

      <section className="grid dashboard-grid" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="section-title">
            <div>
              <div className="eyebrow">Manual check-in</div>
              <h2>Daily recovery inputs</h2>
            </div>
            <span className={`chip ${label.tone}`}>{label.label}</span>
          </div>

          <div className="grid grid-2">
            <label className="field">
              <span>Sleep hours</span>
              <input type="number" min={0} max={16} step={0.5} value={sleep} onChange={(event) => setSleep(Number(event.target.value))} />
            </label>
            <label className="field">
              <span>Hydration %</span>
              <input type="number" min={0} max={150} value={hydration} onChange={(event) => setHydration(Number(event.target.value))} />
            </label>
            <label className="field">
              <span>Soreness</span>
              <input type="range" min={0} max={10} value={soreness} onChange={(event) => setSoreness(Number(event.target.value))} />
            </label>
            <label className="field">
              <span>Fatigue</span>
              <input type="range" min={0} max={10} value={fatigue} onChange={(event) => setFatigue(Number(event.target.value))} />
            </label>
          </div>
        </div>

        <aside className="card" style={{ display: "grid", placeItems: "center" }}>
          <ProgressRing value={score} label="ready" />
        </aside>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="section-title">
          <h2>Recent entries</h2>
        </div>
        <div className="stat-row">
          {entries.length ? entries.slice(-7).map((entry) => (
            <div className="phase-row" key={entry.date}>
              <span className="chip green">{entry.score}</span>
              <strong>{entry.date}</strong>
              <span className="muted">{entry.sleep}h sleep / {entry.hydration}% hydration</span>
            </div>
          )) : <p className="muted">No recovery entries yet.</p>}
        </div>
      </section>
    </>
  );
}
