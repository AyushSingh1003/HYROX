"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trainingWeeks } from "@hyrox/shared";
import { getCompletedWorkoutIds } from "../lib/local-session";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export function CalendarPage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCompleted(getCompletedWorkoutIds());
  }, []);

  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">Training Calendar</div>
          <h1>11-week race build</h1>
        </div>
        <div className="chip-row">
          <span className="chip green">Workout indicators</span>
          <span className="chip">Simulation highlights</span>
        </div>
      </header>

      <section className="table-wrap">
        <table className="calendar-table">
          <thead>
            <tr>
              <th>Week</th>
              {days.map((day) => <th key={day}>{day.slice(0, 3)}</th>)}
            </tr>
          </thead>
          <tbody>
            {trainingWeeks.map((week) => (
              <tr key={week.week}>
                <td>
                  <strong>W{week.week}</strong>
                  <div className="muted">{week.phaseTitle}</div>
                </td>
                {days.map((day) => {
                  const workout = week.workouts.find((item) => item.day === day);
                  return (
                    <td className="calendar-cell" key={`${week.week}-${day}`}>
                      {workout ? (
                        <div className="calendar-workout">
                          <span className={`completion-dot ${completed.has(workout.id) ? "done" : ""}`} />
                          <Link href={`/workouts/${workout.id}`}>{workout.title}</Link>
                          <small>{workout.durationMinutes} min / {workout.intensity}</small>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

