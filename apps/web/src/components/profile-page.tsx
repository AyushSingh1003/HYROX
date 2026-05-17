"use client";

import { Activity, Droplets, Save, Target, User } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { competitionCategories, eventSubtitle } from "../lib/athlete-display";
import { goalTimeOptions, optionsWithCurrent, runningPaceOptions } from "../lib/form-options";
import { getSession, setSession, type Session } from "../lib/local-session";

function dateInputValue(value?: string | Date | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function ProfilePage() {
  const [session, setLocalSession] = useState<Session | null>(null);

  useEffect(() => {
    const current = getSession();
    setLocalSession(current);
    if (!current) return;
    apiFetch<{ user: Session["user"] }>("/profile", { token: current.token })
      .then(({ user }) => {
        const next = { ...current, user };
        setLocalSession(next);
        setSession(next);
      })
      .catch(() => undefined);
  }, []);

  function update(field: string, value: string) {
    if (!session) return;
    setLocalSession({ ...session, user: { ...session.user, [field]: value } });
  }

  async function save() {
    if (!session) return;
    const payload = {
      ...session.user,
      age: session.user.age ? Number(session.user.age) : undefined,
      weight: session.user.weight ? Number(session.user.weight) : undefined,
      eventDate: session.user.eventDate ? dateInputValue(session.user.eventDate) : undefined,
      hydrationTarget: session.user.hydrationTarget ? Number(session.user.hydrationTarget) : undefined,
      calorieTarget: session.user.calorieTarget ? Number(session.user.calorieTarget) : undefined,
      proteinTarget: session.user.proteinTarget ? Number(session.user.proteinTarget) : undefined,
      carbTarget: session.user.carbTarget ? Number(session.user.carbTarget) : undefined,
      fatTarget: session.user.fatTarget ? Number(session.user.fatTarget) : undefined
    };
    const updated = await apiFetch<{ user: Session["user"] }>("/profile", {
      method: "PATCH",
      token: session.token,
      body: JSON.stringify(payload)
    }).catch(() => ({ user: session.user }));
    const next = { ...session, user: updated.user };
    setLocalSession(next);
    setSession(next);
  }

  const user = session?.user ?? {
    name: "HYROX Athlete",
    email: "athlete@hyrox.local",
    age: 23,
    weight: 74,
    runningPace: "4:45/km",
    thresholdPace: "4:28/km",
    goalTime: "1:24",
    hyroxCategory: "Doubles Open",
    eventName: "HYROX Delhi",
    eventLocation: "Delhi",
    eventDate: "2026-07-25",
    hydrationTarget: 3000,
    calorieTarget: 2900,
    proteinTarget: 150,
    carbTarget: 370,
    fatTarget: 80,
    profileImage: "",
    bio: "Intermediate HYROX athlete focused on doubles pacing, compromised running, and station efficiency."
  };

  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">Elite Athlete Dashboard</div>
          <h1>{user.name}</h1>
        </div>
        <button className="btn primary" type="button" onClick={save}>
          <Save size={18} />
          Save
        </button>
      </header>

      <section className="grid dashboard-grid">
        <div className="card">
          <div className="section-title">
            <h2>Editable profile</h2>
            <User size={20} />
          </div>
          <div className="grid grid-2">
            <label className="field">
              <span>Name</span>
              <input value={user.name} onChange={(event) => update("name", event.target.value)} />
            </label>
            <label className="field">
              <span>Profile image URL</span>
              <input value={user.profileImage ?? ""} onChange={(event) => update("profileImage", event.target.value)} />
            </label>
            <label className="field">
              <span>Age</span>
              <input value={user.age ?? ""} onChange={(event) => update("age", event.target.value)} />
            </label>
            <label className="field">
              <span>Weight kg</span>
              <input value={user.weight ?? ""} onChange={(event) => update("weight", event.target.value)} />
            </label>
            <label className="field">
              <span>HYROX event name</span>
              <input
                value={user.eventName ?? ""}
                onChange={(event) => update("eventName", event.target.value)}
                placeholder="HYROX Delhi"
              />
            </label>
            <label className="field">
              <span>Event location</span>
              <input
                list="hyrox-event-locations"
                value={user.eventLocation ?? ""}
                onChange={(event) => update("eventLocation", event.target.value)}
                placeholder="Delhi"
              />
              <datalist id="hyrox-event-locations">
                {["Delhi", "Mumbai", "Singapore", "London"].map((location) => (
                  <option key={location} value={location} />
                ))}
              </datalist>
            </label>
            <label className="field">
              <span>Competition category</span>
              <select value={user.hyroxCategory ?? ""} onChange={(event) => update("hyroxCategory", event.target.value)}>
                <option value="">Select category</option>
                {competitionCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Event date</span>
              <input
                type="date"
                value={dateInputValue(user.eventDate)}
                onChange={(event) => update("eventDate", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Running pace</span>
              <select value={user.runningPace ?? ""} onChange={(event) => update("runningPace", event.target.value)}>
                <option value="">Select running pace</option>
                {optionsWithCurrent(runningPaceOptions, user.runningPace).map((pace) => (
                  <option key={pace} value={pace}>{pace}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Threshold pace</span>
              <input value={user.thresholdPace ?? ""} onChange={(event) => update("thresholdPace", event.target.value)} />
            </label>
            <label className="field">
              <span>Goal time</span>
              <select value={user.goalTime ?? ""} onChange={(event) => update("goalTime", event.target.value)}>
                <option value="">Select goal time</option>
                {optionsWithCurrent(goalTimeOptions, user.goalTime).map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Hydration target ml</span>
              <input value={user.hydrationTarget ?? ""} onChange={(event) => update("hydrationTarget", event.target.value)} />
            </label>
            <label className="field">
              <span>Calories</span>
              <input value={user.calorieTarget ?? ""} onChange={(event) => update("calorieTarget", event.target.value)} />
            </label>
            <label className="field">
              <span>Protein g</span>
              <input value={user.proteinTarget ?? ""} onChange={(event) => update("proteinTarget", event.target.value)} />
            </label>
            <label className="field">
              <span>Carbs g</span>
              <input value={user.carbTarget ?? ""} onChange={(event) => update("carbTarget", event.target.value)} />
            </label>
            <label className="field">
              <span>Fats g</span>
              <input value={user.fatTarget ?? ""} onChange={(event) => update("fatTarget", event.target.value)} />
            </label>
            <label className="field">
              <span>Race notes</span>
              <textarea value={user.bio ?? ""} onChange={(event) => update("bio", event.target.value)} />
            </label>
          </div>
        </div>

        <aside className="grid">
          <div className="metric">
            <div className="metric-label">Running pace <Activity size={18} /></div>
            <div className="metric-value">{user.runningPace}</div>
            <span className="chip">Current sustainable</span>
          </div>
          <div className="metric">
            <div className="metric-label">Threshold pace <Target size={18} /></div>
            <div className="metric-value">{user.thresholdPace}</div>
            <span className="chip green">Race engine</span>
          </div>
          <div className="metric">
            <div className="metric-label">Race goal</div>
            <div className="metric-value">{user.goalTime}</div>
            <span className="chip green">Elite amateur</span>
          </div>
          <div className="metric">
            <div className="metric-label">Hydration target <Droplets size={18} /></div>
            <div className="metric-value">{user.hydrationTarget}ml</div>
            <span className="chip">Electrolytes on hard days</span>
          </div>
          <div className="card">
            <div className="section-title"><h2>Nutrition targets</h2></div>
            <div className="chip-row">
              <span className="chip green">{user.calorieTarget} kcal</span>
              <span className="chip green">{user.proteinTarget}g protein</span>
              <span className="chip green">{user.carbTarget}g carbs</span>
              <span className="chip green">{user.fatTarget}g fats</span>
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Category</div>
            <div className="metric-value" style={{ fontSize: 34 }}>{user.hyroxCategory}</div>
            <span className="chip">{eventSubtitle(user)}</span>
          </div>
        </aside>
      </section>
    </>
  );
}
