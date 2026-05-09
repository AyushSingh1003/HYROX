"use client";

import {
  Activity,
  BarChart3,
  CalendarDays,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Settings,
  Timer,
  Trophy,
  User,
  Utensils
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { currentProgramWeek, daysUntilRace, race, trainingWeeks } from "@hyrox/shared";
import { apiFetch } from "../lib/api";
import { athleteInitials, athleteName, eventSubtitle } from "../lib/athlete-display";
import { clearSession, getSession, setSession, type Session } from "../lib/local-session";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/training", label: "Training", icon: Dumbbell },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/strategy", label: "Strategy", icon: Trophy },
  { href: "/recovery", label: "Recovery", icon: Activity },
  { href: "/nutrition", label: "Nutrition", icon: Utensils },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/timer", label: "Timer", icon: Timer },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/onboarding", label: "Settings", icon: Settings }
];

const mobileItems = navItems.slice(0, 5);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSessionState] = useState<Session | null>(null);
  const countdown = daysUntilRace();
  const currentWeek = currentProgramWeek();
  const progress = Math.min(100, Math.round((currentWeek / trainingWeeks.length) * 100));
  const visibleProgress = Math.max(progress, 6);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      router.replace("/login");
      return;
    }
    setSessionState(current);
    apiFetch<{ user: Session["user"] }>("/profile", { token: current.token })
      .then(({ user }) => {
        const next = { ...current, user };
        setSession(next);
        setSessionState(next);
      })
      .catch(() => undefined);

    function syncSession(event: Event) {
      setSessionState((event as CustomEvent<Session>).detail ?? getSession());
    }

    window.addEventListener("hyrox.session.updated", syncSession);
    return () => window.removeEventListener("hyrox.session.updated", syncSession);
  }, [router]);

  async function logout() {
    const current = getSession();
    if (current) {
      await apiFetch("/auth/logout", { method: "POST", token: current.token }).catch(() => undefined);
    }
    clearSession();
    router.replace("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/dashboard" className="brand" aria-label="HYROX dashboard">
          <div className="brand-mark">
            {session?.user.profileImage ? <img src={session.user.profileImage} alt="" /> : athleteInitials(session?.user)}
          </div>
          <div>
            <div className="brand-title">{athleteName(session?.user)}</div>
            <div className="brand-subtitle">{eventSubtitle(session?.user)}</div>
          </div>
        </Link>

        <nav className="nav-group" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} prefetch className={`nav-link ${active ? "active" : ""}`}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="mini-stat">
            <span className="eyebrow">Race Countdown</span>
            <strong>{countdown}</strong>
            <span className="muted">days to {race.date}</span>
          </div>
          <div className="mini-stat">
            <span className="eyebrow">Training Progress</span>
            <strong>{progress}%</strong>
            <span className="muted">Week {currentWeek} of {trainingWeeks.length}</span>
            <div className="load-bar" aria-hidden="true">
              <span style={{ width: `${visibleProgress}%` }} />
            </div>
          </div>
          <button className="btn ghost" onClick={logout} type="button">
            <LogOut size={17} />
            {session ? session.user.name : "Sign out"}
          </button>
        </div>
      </aside>

      <main className="main">
        {children}
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} prefetch className={active ? "active" : ""} aria-label={item.label}>
              <Icon size={20} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
