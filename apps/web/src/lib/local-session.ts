type SessionUser = {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  runningPace?: string;
  goalTime?: string;
  hyroxCategory?: string;
  eventName?: string;
  eventLocation?: string;
  eventDate?: string;
  thresholdPace?: string;
  hydrationTarget?: number;
  calorieTarget?: number;
  proteinTarget?: number;
  carbTarget?: number;
  fatTarget?: number;
  profileImage?: string;
  bio?: string;
};

const sessionKey = "hyrox.session";
const completionKey = "hyrox.completed";
const recoveryKey = "hyrox.recovery";

export type Session = {
  token: string;
  user: SessionUser;
};

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(sessionKey);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(session: Session) {
  window.localStorage.setItem(sessionKey, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent("hyrox.session.updated", { detail: session }));
}

export function clearSession() {
  window.localStorage.removeItem(sessionKey);
}

export function fallbackSession(email: string, name = "HYROX Athlete"): Session {
  const session = {
    token: "local-demo-token",
    user: {
      id: "local-user",
      name,
      email,
      age: 23,
      weight: 74,
      runningPace: "4:45/km",
      goalTime: "1:24",
      hyroxCategory: "Doubles Open",
      eventName: "HYROX Delhi",
      eventLocation: "Delhi",
      eventDate: "2026-07-25",
      thresholdPace: "4:28/km",
      hydrationTarget: 3000,
      calorieTarget: 2900,
      proteinTarget: 150,
      carbTarget: 370,
      fatTarget: 80
    }
  };
  setSession(session);
  return session;
}

export function getCompletedWorkoutIds() {
  if (typeof window === "undefined") return new Set<string>();
  const raw = window.localStorage.getItem(completionKey);
  return new Set<string>(raw ? JSON.parse(raw) : []);
}

export function setWorkoutCompleted(workoutId: string, completed: boolean) {
  const current = getCompletedWorkoutIds();
  if (completed) current.add(workoutId);
  else current.delete(workoutId);
  window.localStorage.setItem(completionKey, JSON.stringify([...current]));
  return current;
}

export type LocalRecoveryEntry = {
  date: string;
  score: number;
  sleep: number;
  hydration: number;
  soreness: number;
  fatigue: number;
};

export function getRecoveryEntries(): LocalRecoveryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(recoveryKey);
  return raw ? JSON.parse(raw) : [];
}

export function saveRecoveryEntry(entry: LocalRecoveryEntry) {
  const entries = getRecoveryEntries();
  const next = [...entries.filter((candidate) => candidate.date !== entry.date), entry].slice(-30);
  window.localStorage.setItem(recoveryKey, JSON.stringify(next));
  return next;
}
