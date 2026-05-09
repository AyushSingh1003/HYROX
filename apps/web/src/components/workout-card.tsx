"use client";

import { CheckCircle2, Circle, Clock, Flame, HeartPulse, PlayCircle, Timer, Trophy } from "lucide-react";
import Link from "next/link";
import { getExerciseGuidance, type DailyWorkout } from "@hyrox/shared";
import { minutesLabel } from "../lib/format";

const intensityTone: Record<DailyWorkout["intensity"], string> = {
  recovery: "green",
  easy: "green",
  moderate: "yellow",
  "moderate-hard": "yellow",
  hard: "red",
  race: "red"
};

export function WorkoutCard({
  workout,
  completed,
  onToggle,
  compact = false
}: {
  workout: DailyWorkout;
  completed?: boolean;
  onToggle?: (completed: boolean) => void;
  compact?: boolean;
}) {
  const primaryGuidance = getExerciseGuidance(workout.blocks[0]?.title ?? workout.title, workout.blocks[0]?.items ?? []);

  return (
    <article className="workout-card">
      <div className="workout-card-header">
        <div>
          <div className="eyebrow">Week {workout.week} / {workout.day}</div>
          <h3>{workout.title}</h3>
          <p className="muted">{workout.focus}</p>
        </div>
        {onToggle ? (
          <button
            className={`btn icon ${completed ? "primary" : ""}`}
            type="button"
            onClick={() => onToggle(!completed)}
            aria-label={completed ? "Mark incomplete" : "Mark complete"}
          >
            {completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </button>
        ) : null}
      </div>

      <div className="workout-meta">
        <span className={`chip ${intensityTone[workout.intensity]}`}><Flame size={14} />{workout.intensity}</span>
        <span className="chip"><Clock size={14} />{minutesLabel(workout.durationMinutes)}</span>
        {workout.targetHeartRate ? <span className="chip"><HeartPulse size={14} />{workout.targetHeartRate}</span> : null}
        {workout.blocks.some((block) => block.timer) ? <span className="chip"><Timer size={14} />Timer ready</span> : null}
      </div>

      {!compact ? (
        <div className="block-list">
          {workout.blocks.slice(0, 3).map((block) => {
            const guidance = getExerciseGuidance(block.title, block.items);
            return <div className="block" key={block.title}>
              <strong>{block.title}</strong>
              <ul>
                {block.items.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
              </ul>
              <details className="compact-details">
                <summary>Instructions and pacing</summary>
                <ul>
                  {guidance.instructions.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                  {guidance.pacingGuidance.slice(0, 1).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </details>
            </div>;
          })}
          <div className="video-strip">
            <img src={primaryGuidance.video.thumbnail} alt="" />
            <div>
              <div className="eyebrow">Video ready</div>
              <strong>{primaryGuidance.video.title}</strong>
            </div>
            <Link className="btn ghost" href={`/workouts/${workout.id}`}>
              <PlayCircle size={17} />
              Watch
            </Link>
          </div>
        </div>
      ) : null}

      <div className="topbar-actions">
        <Link className="btn" href={`/workouts/${workout.id}`}>
          <Trophy size={17} />
          Open workout
        </Link>
        <Link className="btn ghost" href="/timer">
          <Timer size={17} />
          Timer
        </Link>
      </div>
    </article>
  );
}
