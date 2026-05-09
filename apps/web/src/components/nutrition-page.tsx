"use client";

import { calculateNutritionEntry, nutritionRules, sumNutrition, type NutritionEntry } from "@hyrox/shared";
import { Plus, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { getSession } from "../lib/local-session";
import { ProgressRing } from "./progress-ring";

const groups = [
  { title: "Training", items: nutritionRules.training },
  { title: "Carbs", items: nutritionRules.carbs },
  { title: "Pre-workout", items: nutritionRules.preWorkout },
  { title: "Post-workout", items: nutritionRules.postWorkout }
];

const targets = { calories: 2900, protein: 150, carbs: 370, hydration: 3000 };
const storageKey = "hyrox.nutrition.entries";

export function NutritionPage() {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [form, setForm] = useState({ foodName: "200g chicken breast", quantity: "200g", mealTiming: "Post-workout" });

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) setEntries(JSON.parse(raw));
    const session = getSession();
    if (!session) return;
    apiFetch<{ entries: NutritionEntry[] }>("/nutrition", { token: session.token })
      .then(({ entries }) => persist(entries))
      .catch(() => undefined);
  }, []);

  const totals = useMemo(() => sumNutrition(entries), [entries]);
  const percent = (value: number, target: number) => Math.min(100, Math.round((value / target) * 100));

  function persist(next: NutritionEntry[]) {
    setEntries(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  async function addMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSession();
    const entry = session
      ? await apiFetch<{ entry: NutritionEntry }>("/nutrition", {
          method: "POST",
          token: session.token,
          body: JSON.stringify(form)
        }).then(({ entry }) => entry).catch(() => calculateNutritionEntry(form))
      : calculateNutritionEntry(form);
    persist([entry, ...entries]);
    setForm({ foodName: "", quantity: "", mealTiming: "Post-workout" });
  }

  function removeMeal(id: string) {
    persist(entries.filter((entry) => entry.id !== id));
  }

  return (
    <>
      <header className="topbar">
        <div>
          <div className="eyebrow">Fuel Plan</div>
          <h1>Performance nutrition</h1>
        </div>
        <div className="chip-row">
          <span className="chip green">MacroFactor-style tracking</span>
          <span className="chip">500-900 mg sodium/hour</span>
        </div>
      </header>

      <section className="grid dashboard-grid">
        <div className="grid">
          <div className="card">
            <div className="section-title">
              <div>
                <div className="eyebrow">Food log</div>
                <h2>Add meal</h2>
              </div>
              <span className="chip green">Auto-calculated</span>
            </div>
            <form className="form-grid" onSubmit={addMeal}>
              <div className="grid grid-3">
                <label className="field">
                  <span>Food name</span>
                  <input
                    value={form.foodName}
                    onChange={(event) => setForm({ ...form, foodName: event.target.value })}
                    placeholder="200g chicken breast"
                    required
                  />
                </label>
                <label className="field">
                  <span>Quantity</span>
                  <input
                    value={form.quantity}
                    onChange={(event) => setForm({ ...form, quantity: event.target.value })}
                    placeholder="150g"
                    required
                  />
                </label>
                <label className="field">
                  <span>Meal timing</span>
                  <input
                    value={form.mealTiming}
                    onChange={(event) => setForm({ ...form, mealTiming: event.target.value })}
                    placeholder="Pre-workout"
                    required
                  />
                </label>
              </div>
              <button className="btn primary" type="submit"><Plus size={18} />Add food</button>
            </form>
          </div>

          <div className="table-wrap">
            <table className="split-table">
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Timing</th>
                  <th>Calories</th>
                  <th>Protein</th>
                  <th>Carbs</th>
                  <th>Fats</th>
                  <th>Sodium</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td><strong>{entry.foodName}</strong><br /><span className="muted">{entry.quantity}</span></td>
                    <td>{entry.mealTiming}</td>
                    <td>{entry.calories}</td>
                    <td>{entry.protein}g</td>
                    <td>{entry.carbs}g</td>
                    <td>{entry.fats}g</td>
                    <td>{entry.sodium}mg</td>
                    <td><button className="btn icon ghost" type="button" onClick={() => removeMeal(entry.id)} aria-label="Remove meal"><Trash2 size={17} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="grid">
          <div className="card">
            <div className="section-title"><h2>Daily meters</h2></div>
            <div className="meter-grid">
              <ProgressRing value={percent(totals.calories, targets.calories)} label="Calories" />
              <ProgressRing value={percent(totals.protein, targets.protein)} label="Protein" />
              <ProgressRing value={percent(totals.carbs, targets.carbs)} label="Carbs" />
              <ProgressRing value={percent(totals.hydration, targets.hydration)} label="Hydration" />
            </div>
            <div className="chip-row">
              <span className="chip">{Math.round(totals.electrolytes)} mg electrolytes</span>
              <span className="chip">{Math.round(totals.sodium)} mg sodium</span>
            </div>
          </div>

          {groups.map((group) => (
            <div className="card" key={group.title}>
              <div className="eyebrow">{group.title}</div>
              <h2>{group.title}</h2>
              <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </aside>
      </section>
    </>
  );
}
