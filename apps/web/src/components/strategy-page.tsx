"use client";

import { breathingProtocol, generateRaceStrategy, heartRateZones } from "@hyrox/shared";
import { useEffect, useMemo, useState } from "react";
import { getSession, type Session } from "../lib/local-session";

export function StrategyPage() {
  const [user, setUser] = useState<Session["user"] | null>(null);

  useEffect(() => {
    setUser(getSession()?.user ?? null);
  }, []);

  const strategy = useMemo(() => generateRaceStrategy({
    raceCategory: user?.hyroxCategory,
    goalTime: user?.goalTime,
    runningPace: user?.runningPace
  }), [user?.goalTime, user?.hyroxCategory, user?.runningPace]);

  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">Race Execution</div>
          <h1>{strategy.title}</h1>
        </div>
        <div className="chip-row">
          {strategy.headlineChips.map((chip, index) => (
            <span className={`chip ${index === 0 ? "green" : ""}`} key={chip}>{chip}</span>
          ))}
        </div>
      </header>

      <section className="grid grid-2">
        <div className="table-wrap">
          <div className="section-title">
            <h2>{strategy.format === "singles" ? "Station execution" : strategy.format === "relay" ? "Relay station handoffs" : "Doubles station split"}</h2>
          </div>
          <table className="split-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>{strategy.format === "singles" ? "Work" : "Athlete A"}</th>
                <th>{strategy.format === "singles" ? "Partner" : "Athlete B"}</th>
                <th>Cue</th>
              </tr>
            </thead>
            <tbody>
              {strategy.stationSplits.map((split) => (
                <tr key={split.station}>
                  <td><strong>{split.station}</strong></td>
                  <td>{split.athleteA}</td>
                  <td>{split.athleteB}</td>
                  <td className="muted">{split.cue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-wrap">
          <div className="section-title">
            <h2>Target station times</h2>
          </div>
          <table className="split-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>Goal</th>
              </tr>
            </thead>
            <tbody>
              {strategy.stationTargets.map((target) => (
                <tr key={target.station}>
                  <td><strong>{target.station}</strong></td>
                  <td>{target.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-3" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="eyebrow">Run pacing</div>
          <h2>{strategy.format === "doubles" ? "Partner pace governs" : strategy.format === "relay" ? "Leg ownership" : "Solo restraint"}</h2>
          <ul>
            {strategy.runPacing.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="card">
          <div className="eyebrow">Transitions</div>
          <h2>Free speed</h2>
          <ul>
            {strategy.transitionRules.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="card">
          <div className="eyebrow">Side stitch protocol</div>
          <h2>Breathing discipline</h2>
          <ul>
            {breathingProtocol.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="section-title">
          <h2>Heart-rate and pace zones</h2>
        </div>
        <div className="grid grid-3">
          {heartRateZones.map((zone) => (
            <div className="block" key={zone.name}>
              <strong>{zone.name}</strong>
              <ul>
                <li>{zone.effort}</li>
                <li>You: {zone.you}</li>
                <li>Partner: {zone.partner}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
