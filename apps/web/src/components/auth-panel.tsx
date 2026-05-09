"use client";

import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { apiFetch } from "../lib/api";
import { setSession, type Session } from "../lib/local-session";

type Mode = "login" | "signup" | "forgot";

export function AuthPanel({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "23",
    weight: "74",
    hyroxCategory: "Doubles Open",
    runningPace: "4:45/km",
    goalTime: "1:24"
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "forgot") {
        await apiFetch("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email: form.email })
        });
        setError("Reset instructions are ready for your email provider integration.");
        return;
      }

      const payload =
        mode === "signup"
          ? {
              ...form,
              age: Number(form.age),
              weight: Number(form.weight)
            }
          : { email: form.email, password: form.password };

      const path = mode === "signup" ? "/auth/signup" : "/auth/login";
      const session = await apiFetch<Session>(path, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setSession(session);
      router.push(mode === "signup" ? "/onboarding" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <motion.section
        className="auth-visual"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="chip green">HYROX Delhi 2026</div>
          <h1>Hyrox Prep Without Wasted Effort</h1>
          <div className="chip-row">
            <span className="chip">Timing target window</span>
            <span className="chip">Weekly program</span>
            <span className="chip">Execution</span>
          </div>
        </div>
        <div className="track-visual" aria-hidden="true" />
      </motion.section>

      <motion.section
        className="auth-panel"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        <div className="brand" style={{ paddingLeft: 0, borderBottom: 0 }}>
          <div className="brand-mark">HX</div>
          <div>
            <div className="brand-title">HYROX Elite</div>
            <div className="brand-subtitle">Race prep platform</div>
          </div>
        </div>
        <h2>{mode === "signup" ? "Create athlete profile" : "Welcome back"}</h2>
        <p className="muted">
          {mode === "signup"
            ? "Set editable race, pace, and nutrition targets for the Delhi doubles build."
            : mode === "forgot"
              ? "Request a secure password reset handoff."
              : "Sign in to continue the race build."}
        </p>

        <form className="form-grid" onSubmit={submit}>
          {mode === "signup" ? (
            <label className="field">
              <span>Name</span>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
          ) : null}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              autoComplete="email"
            />
          </label>

          {mode !== "forgot" ? (
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                minLength={8}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </label>
          ) : null}

          {mode === "signup" ? (
            <div className="grid grid-2">
              <label className="field">
                <span>Age</span>
                <input type="number" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} />
              </label>
              <label className="field">
                <span>Weight kg</span>
                <input type="number" value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })} />
              </label>
              <label className="field">
                <span>Category</span>
                <input value={form.hyroxCategory} onChange={(event) => setForm({ ...form, hyroxCategory: event.target.value })} />
              </label>
              <label className="field">
                <span>Running pace</span>
                <input value={form.runningPace} onChange={(event) => setForm({ ...form, runningPace: event.target.value })} />
              </label>
              <label className="field">
                <span>Goal time</span>
                <input value={form.goalTime} onChange={(event) => setForm({ ...form, goalTime: event.target.value })} />
              </label>
            </div>
          ) : mode === "login" ? (
            <div className="chip-row">
              <span className="chip"><Mail size={14} />Email login</span>
              <span className="chip"><LockKeyhole size={14} />Remember me</span>
              <Link className="chip green" href="/forgot-password">Forgot password</Link>
            </div>
          ) : null}

          {error ? <div className="chip red">{error}</div> : null}

          <button className="btn primary full" disabled={loading} type="submit">
            {mode === "signup" ? <UserPlus size={18} /> : <ArrowRight size={18} />}
            {loading ? "Working" : mode === "signup" ? "Sign up" : mode === "forgot" ? "Send reset" : "Log in"}
          </button>
        </form>

        {mode !== "forgot" ? <p className="muted">
          {mode === "signup" ? "Already training? " : "New athlete? "}
          <Link className="auth-link" href={mode === "signup" ? "/login" : "/signup"}>
            {mode === "signup" ? "Log in" : "Create account"}
          </Link>
        </p> : <p className="muted"><Link className="auth-link" href="/login">Back to login</Link></p>}
      </motion.section>
    </div>
  );
}
