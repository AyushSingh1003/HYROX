"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { benchmarks, stationTargets } from "@hyrox/shared";

const paceData = [
  { week: "W1", threshold: 4.55, simulation: 92 },
  { week: "W2", threshold: 4.48, simulation: 90 },
  { week: "W3", threshold: 4.42, simulation: 88 },
  { week: "W4", threshold: 4.44, simulation: 86 },
  { week: "W5", threshold: 4.36, simulation: 84 },
  { week: "W6", threshold: 4.3, simulation: 82 },
  { week: "W7", threshold: 4.28, simulation: 81 },
  { week: "W8", threshold: 4.3, simulation: 80 },
  { week: "W9", threshold: 4.24, simulation: 78 },
  { week: "W10", threshold: 4.22, simulation: 76 }
];

const stationData = stationTargets.slice(0, 8).map((target, index) => ({
  station: target.station.replace("Farmer Carry", "Carry").replace("Wall Balls", "Walls"),
  score: [88, 78, 82, 74, 84, 90, 76, 72][index]
}));

export function AnalyticsPage() {
  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">Progress Tracking</div>
          <h1>Performance analytics</h1>
        </div>
        <div className="chip-row">
          <span className="chip green">Consistency</span>
          <span className="chip">Simulation PRs</span>
          <span className="chip">Station gaps</span>
        </div>
      </header>

      <section className="grid grid-2">
        <div className="card">
          <div className="section-title">
            <h2>Threshold and simulation trend</h2>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paceData}>
                <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
                <XAxis dataKey="week" stroke="#737b70" tickLine={false} axisLine={false} />
                <YAxis stroke="#737b70" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0e100e", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="threshold" stroke="#B6FF3B" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="simulation" stroke="#79DCFF" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title">
            <h2>Station readiness</h2>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stationData}>
                <XAxis dataKey="station" stroke="#737b70" tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "#0e100e", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
                <Bar dataKey="score" fill="#B6FF3B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="section-title">
          <h2>Benchmarks</h2>
        </div>
        <div className="grid grid-2">
          {benchmarks.map((benchmark) => (
            <div className="block" key={benchmark.title}>
              <strong>Week {benchmark.week}: {benchmark.title}</strong>
              <ul>
                {benchmark.targets.map((target) => <li key={target}>{target}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

