"use client";

import { CheckCircle2, Edit3, HeartPulse, PlayCircle, Save, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { getExerciseGuidance, type DailyWorkout } from "@hyrox/shared";
import { apiFetch } from "../lib/api";
import { getCompletedWorkoutIds, getSession, setWorkoutCompleted } from "../lib/local-session";
import { TimerPanel } from "./timer-panel";

export function WorkoutDetail({ workout }: { workout: DailyWorkout }) {
  const [complete, setComplete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(workout);

  useEffect(() => {
    setComplete(getCompletedWorkoutIds().has(workout.id));
    const raw = window.localStorage.getItem(`hyrox.workout.${workout.id}`);
    setDraft(raw ? { ...workout, ...JSON.parse(raw) } : workout);
  }, [workout]);

  async function toggle() {
    const next = !complete;
    setWorkoutCompleted(workout.id, next);
    setComplete(next);
    const session = getSession();
    if (session) {
      await apiFetch("/complete-workout", {
        method: "POST",
        token: session.token,
        body: JSON.stringify({ workoutId: workout.id, completed: next, status: next ? "completed" : "skipped" })
      }).catch(() => undefined);
    }
  }

  async function saveEdits() {
    const patch = {
      title: draft.title,
      focus: draft.focus,
      durationMinutes: draft.durationMinutes,
      blocks: draft.blocks,
      warmup: draft.warmup,
      cooldown: draft.cooldown,
      recovery: draft.recovery,
      goals: draft.goals
    };
    window.localStorage.setItem(`hyrox.workout.${workout.id}`, JSON.stringify(patch));
    const session = getSession();
    if (session) {
      await apiFetch(`/workouts/${workout.id}`, {
        method: "PATCH",
        token: session.token,
        body: JSON.stringify({ patch })
      }).catch(() => undefined);
    }
    setEditing(false);
  }

  function updateBlock(index: number, value: string) {
    const blocks = draft.blocks.map((block, blockIndex) =>
      blockIndex === index ? { ...block, items: value.split("\n").filter(Boolean), editable: true } : block
    );
    setDraft({ ...draft, blocks });
  }

  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">Week {draft.week} / {draft.day}</div>
          {editing ? (
            <label className="field">
              <span>Workout title</span>
              <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
            </label>
          ) : <h1>{draft.title}</h1>}
        </div>
        <div className="topbar-actions">
          <button className={`btn ${complete ? "primary" : ""}`} type="button" onClick={toggle}>
            <CheckCircle2 size={18} />
            {complete ? "Completed" : "Mark complete"}
          </button>
          <button className="btn" type="button" onClick={() => editing ? saveEdits() : setEditing(true)}>
            {editing ? <Save size={18} /> : <Edit3 size={18} />}
            {editing ? "Save edits" : "Edit workout"}
          </button>
        </div>
      </header>

      <section className="grid dashboard-grid">
        <div className="grid">
          <div className="card">
            <div className="section-title">
              <div>
                <div className="eyebrow">Focus</div>
              {editing ? (
                <label className="field">
                  <span>Focus</span>
                  <input value={draft.focus} onChange={(event) => setDraft({ ...draft, focus: event.target.value })} />
                </label>
              ) : <h2>{draft.focus}</h2>}
            </div>
              <span className="chip green">{draft.durationMinutes} min</span>
            </div>
            <div className="chip-row">
              <span className="chip">{draft.intensity}</span>
              {draft.targetHeartRate ? <span className="chip"><HeartPulse size={14} />{draft.targetHeartRate}</span> : null}
              {draft.targetPace?.you ? <span className="chip">You: {draft.targetPace.you}</span> : null}
              {draft.targetPace?.partner ? <span className="chip">Partner: {draft.targetPace.partner}</span> : null}
              {draft.targetPace?.shared ? <span className="chip">Shared: {draft.targetPace.shared}</span> : null}
            </div>
          </div>

          <div className="card">
            <div className="section-title">
              <h2>Warmup</h2>
            </div>
            <ul>
              {draft.warmup.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="grid">
            {draft.blocks.map((block, index) => {
              const guidance = getExerciseGuidance(block.title, block.items);
              return <div className="block workout-instruction" key={block.title}>
                <strong>{block.title}</strong>
                {editing ? (
                  <label className="field">
                    <span>Exercises, sets, reps, distances, pacing, notes</span>
                    <textarea value={block.items.join("\n")} onChange={(event) => updateBlock(index, event.target.value)} />
                  </label>
                ) : (
                  <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
                )}
                {block.timer ? <span className="chip green"><Timer size={14} />{block.timer.mode}</span> : null}
                <div className="instruction-grid">
                  <details open>
                    <summary>Instructions</summary>
                    <ul>{guidance.instructions.map((item) => <li key={item}>{item}</li>)}</ul>
                  </details>
                  <details>
                    <summary>Coaching Notes</summary>
                    <ul>{guidance.coachingNotes.map((item) => <li key={item}>{item}</li>)}</ul>
                  </details>
                  <details>
                    <summary>Pacing Guidance</summary>
                    <ul>{guidance.pacingGuidance.map((item) => <li key={item}>{item}</li>)}</ul>
                  </details>
                  <details>
                    <summary>Common Mistakes</summary>
                    <ul>{guidance.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
                  </details>
                  <details>
                    <summary>Recovery Tips</summary>
                    <ul>{guidance.recoveryTips.map((item) => <li key={item}>{item}</li>)}</ul>
                  </details>
                </div>
                <div className="video-card">
                  <img src={guidance.video.thumbnail} alt="" />
                  <div>
                    <div className="eyebrow">Technique breakdown</div>
                    <h3>{guidance.video.title}</h3>
                    <div className="video-frame">
                      <iframe
                        src={`https://www.youtube.com/embed/${guidance.video.youtubeId}`}
                        title={guidance.video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <a className="btn primary" href={guidance.video.url} target="_blank" rel="noreferrer">
                      <PlayCircle size={18} />
                      Watch Technique
                    </a>
                  </div>
                </div>
              </div>;
            })}
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h2>Cooldown</h2>
              <ul>{draft.cooldown.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="card">
              <h2>Recovery</h2>
              <ul>{draft.recovery.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>

          <div className="card">
            <h2>Scaling</h2>
            <ul>{draft.scaling.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>

        <aside className="grid">
          <TimerPanel initialSeconds={draft.blocks.find((block) => block.timer)?.timer?.durationSeconds ?? 600} />
          <div className="card">
            <h2>Nutrition</h2>
            <ul>{draft.nutrition.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="card">
            <h2>Session goals</h2>
            <ul>{draft.goals.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </aside>
      </section>
    </>
  );
}
