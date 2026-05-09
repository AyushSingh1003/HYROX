# HYROX Elite Training Platform PRD

## Product Vision

Build a premium HYROX doubles training ecosystem for competitive hybrid athletes preparing for HYROX Delhi 2026. The platform should feel like WHOOP, Nike Run Club, TrainingPeaks, and an elite HYROX coaching dashboard, with a sharper focus on doubles synchronization, compromised running, station efficiency, recovery, and race execution.

## Core Users

- Athlete 1: younger, faster runner, about 4:45/km pace.
- Athlete 2: older endurance-capable partner, about 5:10-5:30/km pace, requiring stricter recovery management.

## Race Context

- Race: HYROX Delhi 2026 - Elite Doubles Open.
- Race date: July 25, 2026.
- Training end: July 21, 2026.
- Target window: 1:12-1:15 aggressive elite amateur.
- Benchmarks: sub 1:30 excellent, sub 1:24 very strong, sub 1:20 elite amateur.

## Platforms

- Web: Next.js 15, TypeScript, TailwindCSS, Framer Motion, Recharts.
- Backend: Node.js, Express TypeScript API now; NestJS-ready module boundaries later.
- Database: PostgreSQL via Supabase or Neon, Prisma ORM.
- iOS: React Native Expo Router, Reanimated, Expo Notifications, Secure Store, React Query, NativeWind.
- Deployment: Vercel for web, Railway/Render for API, Supabase/Neon for DB, Expo EAS for iOS.

## Required Pages

1. Dashboard
   - Today's workout.
   - Workout completion status.
   - Countdown to HYROX Delhi.
   - Hydration, sleep, fatigue, readiness, weekly load, training phase.
   - Progress ring, streak counter, simulation PRs.

2. Weekly Training
   - All phases, all weeks, all daily workouts.
   - Expandable workout cards.
   - Pacing and heart-rate targets.

3. Daily Workout
   - Warmup, workout blocks, targets, cooldown, recovery, nutrition.
   - Completion states: complete, partial, skipped.
   - Timer support for countdown, intervals, EMOM, station rest.

4. Training Calendar
   - Monthly/weekly structure.
   - Completed workout indicators.
   - Simulation highlights.

5. HYROX Strategy
   - Doubles station splits.
   - Target station times.
   - Running strategy.
   - Transition rules.
   - Dynamic pacing calculator later.

6. Recovery Dashboard
   - Sleep, hydration, soreness, fatigue, stress, HRV manual entry.
   - Readiness score with green/yellow/red labels.

7. Nutrition
   - Daily macros.
   - Hydration and sodium.
   - Workout fueling.
   - Carb loading and race-week rules.

8. Analytics
   - Running progression.
   - Threshold pace.
   - Simulation times.
   - Station weaknesses.
   - Recovery trends.

9. Profile
   - Profile image, stats, PRs, race goals, athlete bio.

## Core Interactions

- Login, signup, forgot password, email verification, session persistence.
- Mark today's workout complete.
- Record partial/skipped workouts and notes.
- Run countdown, interval, EMOM, Tabata, and station timers.
- Track recovery and calculate readiness.
- Record simulations with station times and transition time.
- View program progress and weekly load.
- iOS offline workout access.
- iOS background timers and push notifications in production.

## Backend API

Auth:
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/forgot-password`

Program:
- `GET /program`
- `GET /workouts`
- `GET /workouts/:id`
- `POST /complete-workout`

Recovery:
- `POST /recovery`
- `GET /recovery`

Simulations:
- `POST /simulation`
- `GET /simulations`

Profile:
- `GET /profile`
- `PATCH /profile`

Analytics:
- `GET /analytics`

## Design System

- Dark mode foundation: `#050505`, `#0A0A0A`.
- Accent: neon green, white, gray, with limited supporting cyan/amber/red for state.
- Typography: Inter, Satoshi, SF Pro.
- UI: dense athlete dashboard, glass panels, fast motion, progress rings, charts, completion states, responsive mobile-first layout.

## Current Implementation Map

- Shared training content: `packages/shared/src/training-program.ts`
- Web app: `apps/web`
- API: `apps/api/src/server.ts`
- iOS app: `apps/mobile`
- Prisma schema: `prisma/schema.prisma`

