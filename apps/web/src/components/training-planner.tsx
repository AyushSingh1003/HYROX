"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { currentProgramWeek, trainingWeeks, type TrainingWeek } from "@hyrox/shared";
import { apiFetch } from "../lib/api";
import { getCompletedWorkoutIds, getSession, setWorkoutCompleted } from "../lib/local-session";
import { WorkoutCard } from "./workout-card";

export function TrainingPlanner() {
  const [selectedWeek, setSelectedWeek] = useState(currentProgramWeek());
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [weeks, setWeeks] = useState<TrainingWeek[]>(trainingWeeks);
  const [planTitle, setPlanTitle] = useState("Weekly training plan");
  const [planSource, setPlanSource] = useState("HYROX Delhi template");

  useEffect(() => {
    setCompleted(getCompletedWorkoutIds());
    const session = getSession();
    if (!session) return;
    apiFetch<{ source: string; plan: { title: string; weeks: TrainingWeek[] } }>("/training-plan", { token: session.token })
      .then(({ source, plan }) => {
        if (plan.weeks?.length) {
          setWeeks(plan.weeks);
          setSelectedWeek(plan.weeks[0].week);
          setPlanTitle(plan.title);
          setPlanSource(source);
        }
      })
      .catch(() => undefined);
  }, []);

  function toggle(id: string, next: boolean) {
    setCompleted(new Set(setWorkoutCompleted(id, next)));
  }

  const week = weeks.find((item) => item.week === selectedWeek) ?? weeks[0];

  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">Complete Program / {planSource}</div>
          <h1>{planTitle}</h1>
        </div>
        <div className="tabs" role="tablist" aria-label="Training weeks">
          {weeks.map((item) => (
            <button
              key={item.week}
              className={`tab ${item.week === selectedWeek ? "active" : ""}`}
              type="button"
              onClick={() => setSelectedWeek(item.week)}
            >
              W{item.week}
            </button>
          ))}
        </div>
      </header>

      <section className="card">
        <div className="section-title">
          <div>
            <div className="eyebrow">{week.dateRange}</div>
            <h2>{week.phaseTitle}</h2>
          </div>
          <span className="chip green">Phase {week.phase}</span>
        </div>
        <p className="muted">{week.intent}</p>
        <div className="chip-row" style={{ marginTop: 12 }}>
          {week.expectedTrainingLoad ? <span className="chip green">Load: {week.expectedTrainingLoad}</span> : null}
          {week.recoveryEmphasis ? <span className="chip">Recovery: {week.recoveryEmphasis}</span> : null}
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        {week.workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            completed={completed.has(workout.id)}
            onToggle={(next) => toggle(workout.id, next)}
          />
        ))}
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        {weeks.map((item) => (
          <button
            className="phase-row"
            key={item.week}
            type="button"
            onClick={() => setSelectedWeek(item.week)}
            aria-expanded={item.week === selectedWeek}
          >
            <span className="chip">W{item.week}</span>
            <span>
              <strong>{item.phaseTitle}</strong>
              <span className="muted" style={{ display: "block" }}>{item.intent}</span>
            </span>
            {item.week === selectedWeek ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        ))}
      </section>
    </>
  );
}
