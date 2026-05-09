"use client";

import { motion } from "framer-motion";
import { Activity, CalendarDays, CheckCircle2, Droplets, Flame, Moon, Timer, Trophy } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  allWorkouts,
  currentProgramWeek,
  daysUntilRace,
  getTodaysWorkout,
  phaseProgress,
  race,
  stationTargets,
  trainingWeeks
} from "@hyrox/shared";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { getCompletedWorkoutIds, getSession, setWorkoutCompleted } from "../lib/local-session";
import { MetricCard } from "./metric-card";
import { ProgressRing } from "./progress-ring";
import { TimerPanel } from "./timer-panel";
import { WorkoutCard } from "./workout-card";

const loadData = [
  { week: "W1", load: 58, recovery: 78 },
  { week: "W2", load: 64, recovery: 74 },
  { week: "W3", load: 71, recovery: 70 },
  { week: "W4", load: 42, recovery: 84 },
  { week: "W5", load: 78, recovery: 68 },
  { week: "W6", load: 84, recovery: 66 },
  { week: "W7", load: 92, recovery: 62 },
  { week: "W8", load: 48, recovery: 82 },
  { week: "W9", load: 88, recovery: 65 },
  { week: "W10", load: 80, recovery: 72 },
  { week: "W11", load: 38, recovery: 90 }
];

export function DashboardClient() {
  const today = getTodaysWorkout();
  const [completed, setCompleted] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const ids = getCompletedWorkoutIds();
    setCompleted(ids.has(today.id));
    setCompletedCount(ids.size);
  }, [today.id]);

  async function toggleWorkout(next: boolean) {
    const ids = setWorkoutCompleted(today.id, next);
    setCompleted(next);
    setCompletedCount(ids.size);
    const session = getSession();
    if (session?.token && session.token !== "local-demo-token") {
      await apiFetch("/complete-workout", {
        method: "POST",
        token: session.token,
        body: JSON.stringify({ workoutId: today.id, completed: next, status: next ? "completed" : "partial" })
      }).catch(() => undefined);
    }
  }

  const completionPercent = Math.round((completedCount / allWorkouts.length) * 100);
  const currentWeek = currentProgramWeek();
  const activeWeek = useMemo(() => trainingWeeks.find((week) => week.week === currentWeek) ?? trainingWeeks[0], [currentWeek]);

  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">HYROX Delhi 2026 / Elite Doubles</div>
          <h1>Today: {today.title}</h1>
        </div>
        <div className="topbar-actions">
          <span className="chip green"><Trophy size={14} />{daysUntilRace()} days</span>
          <span className="chip">Week {currentWeek}</span>
          <span className="chip">{race.goalWindow}</span>
        </div>
      </header>

      <section className="grid grid-4">
        <MetricCard label="Fatigue" value="Low" detail="green" tone="green" icon={Flame} />
        <MetricCard label="Readiness" value="82" detail="ready" tone="green" icon={Activity} />
        <MetricCard label="Hydration" value="3.4L" detail="target" icon={Droplets} />
        <MetricCard label="Sleep" value="8h" detail="minimum" icon={Moon} />
      </section>

      <section className="grid dashboard-grid" style={{ marginTop: 16 }}>
        <div className="grid">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <WorkoutCard workout={today} completed={completed} onToggle={toggleWorkout} />
          </motion.div>

          <div className="grid grid-2">
            <div className="card">
              <div className="section-title">
                <div>
                  <div className="eyebrow">Weekly Load</div>
                  <h2>{activeWeek.phaseTitle}</h2>
                </div>
                <span className="chip">Phase {activeWeek.phase}</span>
              </div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={loadData}>
                    <defs>
                      <linearGradient id="load" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#B6FF3B" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#B6FF3B" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" stroke="#737b70" tickLine={false} axisLine={false} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "#0e100e", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="load" stroke="#B6FF3B" fill="url(#load)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="section-title">
                <div>
                  <div className="eyebrow">Completion</div>
                  <h2>Program status</h2>
                </div>
                <CheckCircle2 color="#B6FF3B" />
              </div>
              <div style={{ display: "grid", placeItems: "center", minHeight: 280 }}>
                <ProgressRing value={completionPercent || phaseProgress()} label="complete" />
              </div>
            </div>
          </div>
        </div>

        <aside className="grid">
          <TimerPanel initialSeconds={today.blocks.find((block) => block.timer)?.timer?.durationSeconds ?? 600} />

          <div className="card">
            <div className="section-title">
              <div>
                <div className="eyebrow">Station Targets</div>
                <h2>Aggressive 1:15</h2>
              </div>
              <Timer size={18} />
            </div>
            <div className="stat-row">
              {stationTargets.slice(0, 6).map((target) => (
                <div className="phase-row" key={target.station}>
                  <span className="chip green">{target.target}</span>
                  <strong>{target.station}</strong>
                  <CalendarDays size={16} color="#737b70" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

