"use client";

import { generateTrainingPlan, type OnboardingAnswers, type TrainingLevel } from "@hyrox/shared";
import { ArrowRight, CheckCircle2, Dumbbell, Save } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";
import { getSession, setSession } from "../lib/local-session";

const levelOptions: Array<{ value: TrainingLevel; title: string; body: string }> = [
  { value: "absolute-beginner", title: "Absolute Beginner", body: "Does not currently train. Starts with walking, easy jogging, bodyweight strength, and injury prevention." },
  { value: "beginner", title: "Beginner", body: "Goes to the gym but does not run seriously. Builds running base and HYROX technique." },
  { value: "moderate", title: "Moderate", body: "Runs, lifts, and may have completed HYROX before. Starts with threshold and compromised running." },
  { value: "expert", title: "Expert", body: "Strong runner and experienced HYROX athlete. Uses advanced intervals and simulations." }
];

const stationOptions = ["SkiErg", "Sled Push", "Sled Pull", "Burpee Broad Jump", "Row", "Farmer Carry", "Sandbag Lunges", "Wall Balls", "Running"];
const equipmentOptions = ["Gym", "SkiErg", "RowErg", "Sled", "Wall ball", "Kettlebells", "Sandbag", "Treadmill", "Track"];

const defaultAnswers: OnboardingAnswers = {
  name: "HYROX Athlete",
  age: 23,
  weight: 74,
  current5kPace: "4:45/km",
  weeklyRunningVolume: 25,
  strengthExperience: "Regular gym training",
  hyroxExperience: "Completed HYROX before",
  raceCategory: "doubles-open",
  goalRaceDate: "2026-07-25",
  targetGoalTime: "1:12-1:15",
  availableTrainingDays: 5,
  equipmentAccess: ["Gym", "SkiErg", "RowErg", "Sled", "Wall ball", "Kettlebells", "Sandbag"],
  injuryHistory: "Side stitches in previous race; focus on breathing, hydration, and pacing.",
  weakestStations: ["Running", "Sled Push", "Wall Balls"],
  sleepHours: 8,
  recoveryQuality: "Good",
  nutritionConsistency: "Moderate",
  trainingLevel: "moderate"
};

function toggle(list: string[], item: string) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

export function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState<OnboardingAnswers>(defaultAnswers);
  const [saved, setSaved] = useState(false);
  const preview = useMemo(() => generateTrainingPlan(form), [form]);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    setForm((current) => ({
      ...current,
      name: session.user.name || current.name,
      age: session.user.age || current.age,
      weight: session.user.weight || current.weight,
      current5kPace: session.user.runningPace || current.current5kPace,
      targetGoalTime: session.user.goalTime || current.targetGoalTime,
      raceCategory: session.user.hyroxCategory?.toLowerCase().includes("double") ? "doubles-open" : current.raceCategory
    }));
    apiFetch<{ onboarding?: { answers?: OnboardingAnswers } }>("/onboarding", { token: session.token })
      .then(({ onboarding }) => {
        if (onboarding?.answers) setForm({ ...defaultAnswers, ...onboarding.answers });
      })
      .catch(() => undefined);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSession();
    if (!session) return;
    const result = await apiFetch<{ plan: unknown }>("/onboarding", {
      method: "POST",
      token: session.token,
      body: JSON.stringify(form)
    });
    setSession({
      ...session,
      user: {
        ...session.user,
        name: form.name,
        age: form.age,
        weight: form.weight,
        runningPace: form.current5kPace,
        goalTime: form.targetGoalTime,
        hyroxCategory: form.raceCategory
      }
    });
    setSaved(Boolean(result.plan));
    router.push("/training");
  }

  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">Athlete Onboarding</div>
          <h1>Build your HYROX plan</h1>
        </div>
        <div className="chip-row">
          <span className="chip green"><Dumbbell size={14} />{preview.weeksUntilRace} week plan</span>
          <span className="chip">{preview.level}</span>
        </div>
      </header>

      <form className="grid dashboard-grid" onSubmit={submit}>
        <div className="grid">
          <section className="card">
            <div className="section-title">
              <div>
                <div className="eyebrow">Step 1</div>
                <h2>Training level</h2>
              </div>
            </div>
            <div className="grid grid-2">
              {levelOptions.map((level) => (
                <button
                  className={`level-card ${form.trainingLevel === level.value ? "active" : ""}`}
                  key={level.value}
                  type="button"
                  onClick={() => setForm({ ...form, trainingLevel: level.value })}
                >
                  <strong>{level.title}</strong>
                  <span>{level.body}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-title"><h2>Athlete details</h2></div>
            <div className="grid grid-3">
              <label className="field"><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
              <label className="field"><span>Age</span><input type="number" value={form.age ?? ""} onChange={(event) => setForm({ ...form, age: Number(event.target.value) })} /></label>
              <label className="field"><span>Weight kg</span><input type="number" value={form.weight ?? ""} onChange={(event) => setForm({ ...form, weight: Number(event.target.value) })} /></label>
              <label className="field"><span>Sex / gender optional</span><input value={form.sex ?? ""} onChange={(event) => setForm({ ...form, sex: event.target.value })} /></label>
              <label className="field"><span>Height cm optional</span><input type="number" value={form.height ?? ""} onChange={(event) => setForm({ ...form, height: Number(event.target.value) })} /></label>
              <label className="field"><span>Sleep hours</span><input type="number" value={form.sleepHours ?? ""} onChange={(event) => setForm({ ...form, sleepHours: Number(event.target.value) })} /></label>
            </div>
          </section>

          <section className="card">
            <div className="section-title"><h2>Race goal</h2></div>
            <div className="grid grid-3">
              <label className="field"><span>Race category</span><select value={form.raceCategory} onChange={(event) => setForm({ ...form, raceCategory: event.target.value as OnboardingAnswers["raceCategory"] })}>
                <option value="singles-open">Singles Open</option>
                <option value="singles-pro">Singles Pro</option>
                <option value="doubles-open">Doubles Open</option>
                <option value="doubles-pro">Doubles Pro</option>
                <option value="relay">Relay</option>
                <option value="other">Other</option>
              </select></label>
              <label className="field"><span>Race date</span><input type="date" value={form.goalRaceDate} onChange={(event) => setForm({ ...form, goalRaceDate: event.target.value })} required /></label>
              <label className="field"><span>Target goal time</span><input value={form.targetGoalTime ?? ""} onChange={(event) => setForm({ ...form, targetGoalTime: event.target.value })} /></label>
            </div>
          </section>

          <section className="card">
            <div className="section-title"><h2>Training background</h2></div>
            <div className="grid grid-2">
              <label className="field"><span>Current 5K pace</span><input value={form.current5kPace ?? ""} onChange={(event) => setForm({ ...form, current5kPace: event.target.value })} /></label>
              <label className="field"><span>Weekly running volume km</span><input type="number" value={form.weeklyRunningVolume ?? ""} onChange={(event) => setForm({ ...form, weeklyRunningVolume: Number(event.target.value) })} /></label>
              <label className="field"><span>Strength training experience</span><textarea value={form.strengthExperience ?? ""} onChange={(event) => setForm({ ...form, strengthExperience: event.target.value })} /></label>
              <label className="field"><span>HYROX experience</span><textarea value={form.hyroxExperience ?? ""} onChange={(event) => setForm({ ...form, hyroxExperience: event.target.value })} /></label>
              <label className="field"><span>Injury history</span><textarea value={form.injuryHistory ?? ""} onChange={(event) => setForm({ ...form, injuryHistory: event.target.value })} /></label>
              <label className="field"><span>Available days per week</span><input type="number" min={3} max={7} value={form.availableTrainingDays} onChange={(event) => setForm({ ...form, availableTrainingDays: Number(event.target.value) })} /></label>
            </div>
          </section>

          <section className="card">
            <div className="section-title"><h2>Equipment and weak stations</h2></div>
            <div className="grid grid-2">
              <div>
                <div className="eyebrow">Equipment access</div>
                <div className="chip-row option-row">
                  {equipmentOptions.map((item) => <button className={`chip ${form.equipmentAccess.includes(item) ? "green" : ""}`} type="button" key={item} onClick={() => setForm({ ...form, equipmentAccess: toggle(form.equipmentAccess, item) })}>{item}</button>)}
                </div>
              </div>
              <div>
                <div className="eyebrow">Weakest stations</div>
                <div className="chip-row option-row">
                  {stationOptions.map((item) => <button className={`chip ${form.weakestStations.includes(item) ? "green" : ""}`} type="button" key={item} onClick={() => setForm({ ...form, weakestStations: toggle(form.weakestStations, item) })}>{item}</button>)}
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="grid">
          <section className="card">
            <div className="section-title">
              <div>
                <div className="eyebrow">Generated Preview</div>
                <h2>{preview.title}</h2>
              </div>
            </div>
            <p className="muted">{preview.summary}</p>
            <div className="stat-row">
              {preview.priorities.map((priority) => (
                <div className="phase-row" key={priority}>
                  <CheckCircle2 size={17} color="#B6FF3B" />
                  <strong>{priority}</strong>
                  <span className="muted">priority</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-title"><h2>Plan phases</h2></div>
            <div className="stat-row">
              {preview.phases.map((phase, index) => (
                <div className="phase-row" key={phase}>
                  <span className="chip green">{index + 1}</span>
                  <strong>{phase}</strong>
                  <span className="muted">phase</span>
                </div>
              ))}
            </div>
          </section>

          <button className="btn primary full" type="submit">
            {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            Save and Generate Plan
            <ArrowRight size={18} />
          </button>
        </aside>
      </form>
    </>
  );
}
