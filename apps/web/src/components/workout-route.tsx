"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DailyWorkout, TrainingWeek } from "@hyrox/shared";
import { apiFetch } from "../lib/api";
import { getSession } from "../lib/local-session";
import { WorkoutDetail } from "./workout-detail";

function findWorkout(weeks: TrainingWeek[], workoutId: string) {
  return weeks.flatMap((week) => week.workouts).find((workout) => workout.id === workoutId) ?? null;
}

export function WorkoutRoute({
  workoutId,
  initialWorkout
}: {
  workoutId: string;
  initialWorkout: DailyWorkout | null;
}) {
  const [workout, setWorkout] = useState<DailyWorkout | null>(initialWorkout);
  const [loading, setLoading] = useState(!initialWorkout);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialWorkout) {
      setWorkout(initialWorkout);
      setLoading(false);
      return;
    }

    const session = getSession();
    if (!session) {
      setLoading(false);
      setError("Log in to open this personalized workout.");
      return;
    }

    apiFetch<{ plan: { weeks: TrainingWeek[] } }>("/training-plan", { token: session.token })
      .then(({ plan }) => {
        const matchedWorkout = findWorkout(plan.weeks ?? [], workoutId);
        if (matchedWorkout) {
          setWorkout(matchedWorkout);
          setError(null);
        } else {
          setError("This workout is not in your active plan anymore.");
        }
      })
      .catch(() => setError("Could not load this workout. Please try refreshing."))
      .finally(() => setLoading(false));
  }, [initialWorkout, workoutId]);

  if (workout) return <WorkoutDetail workout={workout} />;

  return (
    <section className="card">
      <div className="section-title">
        <div>
          <div className="eyebrow">Workout details</div>
          <h1>{loading ? "Loading workout" : "Workout unavailable"}</h1>
        </div>
      </div>
      <p className="muted">
        {loading ? "Opening your active HYROX plan..." : error ?? "This workout could not be found."}
      </p>
      {!loading ? (
        <div className="topbar-actions" style={{ marginTop: 16 }}>
          <Link className="btn primary" href="/training">Back to training</Link>
          <Link className="btn ghost" href="/onboarding">Update plan</Link>
        </div>
      ) : null}
    </section>
  );
}
