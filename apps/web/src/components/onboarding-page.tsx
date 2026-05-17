"use client";

import { generateTrainingPlan, type OnboardingAnswers, type TrainingLevel } from "@hyrox/shared";
import { ArrowRight, CheckCircle2, Dumbbell, Save } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";
import { goalTimeOptions, optionsWithCurrent, runningPaceOptions } from "../lib/form-options";
import { getSession, setSession } from "../lib/local-session";

const levelOptions: Array<{ value: TrainingLevel; title: string; body: string }> = [
  { value: "absolute-beginner", title: "Absolute Beginner", body: "Does not currently train. Starts with walking, easy jogging, bodyweight strength, and injury prevention." },
  { value: "beginner", title: "Beginner", body: "Goes to the gym but does not run seriously. Builds running base and HYROX technique." },
  { value: "moderate", title: "Moderate", body: "Runs, lifts, and may have completed HYROX before. Starts with threshold and compromised running." },
  { value: "expert", title: "Expert", body: "Strong runner and experienced HYROX athlete. Uses advanced intervals and simulations." }
];

const stationOptions = ["SkiErg", "Sled Push", "Sled Pull", "Burpee Broad Jump", "Row", "Farmer Carry", "Sandbag Lunges", "Wall Balls", "Running"];
const equipmentOptions = ["Gym", "SkiErg", "RowErg", "Sled", "Wall ball", "Kettlebells", "Sandbag", "Treadmill", "Track"];
const raceCategoryOptions: Array<{ value: OnboardingAnswers["raceCategory"]; label: string }> = [
  { value: "singles-open", label: "Singles Open" },
  { value: "singles-pro", label: "Singles Pro" },
  { value: "doubles-open", label: "Doubles Open" },
  { value: "doubles-pro", label: "Doubles Pro" },
  { value: "relay", label: "Relay" },
  { value: "other", label: "Other" }
];

type OnboardingForm = Omit<OnboardingAnswers, "availableTrainingDays" | "raceCategory"> & {
  availableTrainingDays?: number;
  raceCategory: OnboardingAnswers["raceCategory"] | "";
};

const defaultAnswers: OnboardingForm = {
  name: "",
  age: undefined,
  sex: "",
  height: undefined,
  weight: undefined,
  current5kPace: "",
  easyRunPace: "",
  fiveKPB: "",
  tenKPB: "",
  currentHyroxFinishTime: "",
  weeklyRunningVolume: undefined,
  strengthExperience: "",
  hyroxExperience: "",
  restingHeartRate: undefined,
  maximumHeartRate: undefined,
  raceCategory: "",
  goalRaceDate: "",
  targetGoalTime: "",
  availableTrainingDays: undefined,
  equipmentAccess: [],
  injuryHistory: "",
  weakestStations: [],
  strongestStations: [],
  sleepHours: undefined,
  recoveryQuality: "",
  nutritionConsistency: "",
  stressLevel: "",
  occupationActivityLevel: "",
  nutritionPreference: "",
  partnerAge: undefined,
  partnerRunningPace: "",
  partnerStrengths: [],
  partnerWeaknesses: [],
  trainingLevel: "moderate"
};

function toggle(list: string[], item: string) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

function optionalNumber(value: string) {
  return value === "" ? undefined : Number(value);
}

function toOnboardingAnswers(form: OnboardingForm): OnboardingAnswers {
  return {
    ...form,
    raceCategory: form.raceCategory || "singles-open",
    availableTrainingDays: form.availableTrainingDays ?? 4
  };
}

type OnboardingHydration = {
  user?: {
    name?: string;
    age?: number | null;
    weight?: number | null;
    runningPace?: string | null;
    goalTime?: string | null;
    hyroxCategory?: string | null;
    eventDate?: string | Date | null;
  };
  onboarding?: { answers?: OnboardingAnswers };
  profile?: {
    sex?: string | null;
    height?: number | null;
    current5kPace?: string | null;
    weeklyRunningVolume?: number | null;
    strengthExperience?: string | null;
    hyroxExperience?: string | null;
    trainingLevel?: TrainingLevel | string | null;
    availableTrainingDays?: number | null;
    equipmentAccess?: unknown;
    injuryHistory?: string | null;
    weakestStations?: unknown;
    sleepHours?: number | null;
    recoveryQuality?: string | null;
    nutritionConsistency?: string | null;
  } | null;
  raceGoal?: {
    category?: OnboardingAnswers["raceCategory"] | string | null;
    raceDate?: string | Date | null;
    targetGoalTime?: string | null;
  } | null;
};

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeRaceDate(value?: string | Date | null) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

function isRaceCategory(value?: string | null): value is OnboardingAnswers["raceCategory"] {
  return ["singles-open", "singles-pro", "doubles-open", "doubles-pro", "relay", "other"].includes(value ?? "");
}

function hydrateForm(current: OnboardingForm, data: OnboardingHydration, sessionUser: OnboardingHydration["user"]): OnboardingForm {
  if (data.onboarding?.answers) return { ...defaultAnswers, ...data.onboarding.answers };
  const user = data.user ?? sessionUser;
  const profile = data.profile;
  const raceGoal = data.raceGoal;
  const category = raceGoal?.category ?? user?.hyroxCategory;

  return {
    ...current,
    name: user?.name ?? current.name,
    age: user?.age ?? current.age,
    weight: user?.weight ?? current.weight,
    current5kPace: profile?.current5kPace ?? user?.runningPace ?? current.current5kPace,
    targetGoalTime: raceGoal?.targetGoalTime ?? user?.goalTime ?? current.targetGoalTime,
    raceCategory: isRaceCategory(category) ? category : current.raceCategory,
    goalRaceDate: normalizeRaceDate(raceGoal?.raceDate ?? user?.eventDate) || current.goalRaceDate,
    sex: profile?.sex ?? current.sex,
    height: profile?.height ?? current.height,
    weeklyRunningVolume: profile?.weeklyRunningVolume ?? current.weeklyRunningVolume,
    strengthExperience: profile?.strengthExperience ?? current.strengthExperience,
    hyroxExperience: profile?.hyroxExperience ?? current.hyroxExperience,
    trainingLevel: isTrainingLevel(profile?.trainingLevel) ? profile.trainingLevel : current.trainingLevel,
    availableTrainingDays: profile?.availableTrainingDays ?? current.availableTrainingDays,
    equipmentAccess: asStringArray(profile?.equipmentAccess),
    injuryHistory: profile?.injuryHistory ?? current.injuryHistory,
    weakestStations: asStringArray(profile?.weakestStations),
    sleepHours: profile?.sleepHours ?? current.sleepHours,
    recoveryQuality: profile?.recoveryQuality ?? current.recoveryQuality,
    nutritionConsistency: profile?.nutritionConsistency ?? current.nutritionConsistency
  };
}

function isTrainingLevel(value?: string | null): value is TrainingLevel {
  return ["absolute-beginner", "beginner", "moderate", "expert"].includes(value ?? "");
}

export function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState<OnboardingForm>(defaultAnswers);
  const [storedSignupFields, setStoredSignupFields] = useState({ name: false, age: false, weight: false });
  const [saved, setSaved] = useState(false);
  const preview = useMemo(() => generateTrainingPlan(toOnboardingAnswers(form)), [form]);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    setStoredSignupFields({
      name: Boolean(session.user.name?.trim()),
      age: session.user.age != null,
      weight: session.user.weight != null
    });
    setForm((current) => hydrateForm(current, {}, session.user));
    apiFetch<OnboardingHydration>("/onboarding", { token: session.token })
      .then((data) => {
        setStoredSignupFields({
          name: Boolean((data.user?.name ?? session.user.name)?.trim()),
          age: (data.user?.age ?? session.user.age) != null,
          weight: (data.user?.weight ?? session.user.weight) != null
        });
        setForm((current) => hydrateForm(current, data, session.user));
      })
      .catch(() => undefined);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSession();
    if (!session) return;
    const answers = toOnboardingAnswers(form);
    const result = await apiFetch<{ plan: unknown }>("/onboarding", {
      method: "POST",
      token: session.token,
      body: JSON.stringify(answers)
    });
    setSession({
      ...session,
      user: {
        ...session.user,
        name: answers.name,
        age: answers.age,
        weight: answers.weight,
        runningPace: answers.current5kPace,
        goalTime: answers.targetGoalTime,
        hyroxCategory: answers.raceCategory
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
              {storedSignupFields.name ? null : <label className="field"><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>}
              {storedSignupFields.age ? null : <label className="field"><span>Age</span><input type="number" value={form.age ?? ""} onChange={(event) => setForm({ ...form, age: optionalNumber(event.target.value) })} /></label>}
              {storedSignupFields.weight ? null : <label className="field"><span>Weight kg</span><input type="number" value={form.weight ?? ""} onChange={(event) => setForm({ ...form, weight: optionalNumber(event.target.value) })} /></label>}
              <label className="field"><span>Sex / gender optional</span><input value={form.sex ?? ""} onChange={(event) => setForm({ ...form, sex: event.target.value })} /></label>
              <label className="field"><span>Height cm optional</span><input type="number" value={form.height ?? ""} onChange={(event) => setForm({ ...form, height: optionalNumber(event.target.value) })} /></label>
              <label className="field"><span>Sleep hours</span><input type="number" value={form.sleepHours ?? ""} onChange={(event) => setForm({ ...form, sleepHours: optionalNumber(event.target.value) })} /></label>
            </div>
          </section>

          <section className="card">
            <div className="section-title"><h2>Race goal</h2></div>
            <div className="grid grid-3">
              <label className="field"><span>Race category</span><select value={form.raceCategory} onChange={(event) => setForm({ ...form, raceCategory: event.target.value as OnboardingForm["raceCategory"] })}>
                <option value="" disabled>Select category</option>
                {raceCategoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select></label>
              <label className="field"><span>Race date</span><input type="date" value={form.goalRaceDate} onChange={(event) => setForm({ ...form, goalRaceDate: event.target.value })} required /></label>
              <label className="field"><span>Target goal time</span><select value={form.targetGoalTime ?? ""} onChange={(event) => setForm({ ...form, targetGoalTime: event.target.value })}>
                <option value="">Select goal time</option>
                {optionsWithCurrent(goalTimeOptions, form.targetGoalTime).map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select></label>
            </div>
          </section>

          <section className="card">
            <div className="section-title"><h2>Training background</h2></div>
            <div className="grid grid-2">
              <label className="field"><span>Current 5K pace</span><select value={form.current5kPace ?? ""} onChange={(event) => setForm({ ...form, current5kPace: event.target.value })}>
                <option value="">Select running pace</option>
                {optionsWithCurrent(runningPaceOptions, form.current5kPace).map((pace) => (
                  <option key={pace} value={pace}>{pace}</option>
                ))}
              </select></label>
              <label className="field"><span>Weekly running volume km</span><input type="number" value={form.weeklyRunningVolume ?? ""} onChange={(event) => setForm({ ...form, weeklyRunningVolume: optionalNumber(event.target.value) })} /></label>
              <label className="field"><span>Strength training experience</span><textarea value={form.strengthExperience ?? ""} onChange={(event) => setForm({ ...form, strengthExperience: event.target.value })} /></label>
              <label className="field"><span>HYROX experience</span><textarea value={form.hyroxExperience ?? ""} onChange={(event) => setForm({ ...form, hyroxExperience: event.target.value })} /></label>
              <label className="field"><span>Injury history</span><textarea value={form.injuryHistory ?? ""} onChange={(event) => setForm({ ...form, injuryHistory: event.target.value })} /></label>
              <label className="field"><span>Available days per week</span><input type="number" min={3} max={7} value={form.availableTrainingDays ?? ""} onChange={(event) => setForm({ ...form, availableTrainingDays: optionalNumber(event.target.value) })} /></label>
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
