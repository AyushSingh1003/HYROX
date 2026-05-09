# HYROX Elite Training Platform

Premium web, backend, and Expo iOS app scaffold for the HYROX Delhi 2026 Elite Doubles program from `Untitled document (2).docx`.

## What is included

- `apps/web` - Next.js 15 web dashboard with login/signup, daily workout completion, timer, recovery, nutrition, strategy, calendar, and analytics pages.
- `apps/api` - Express TypeScript API with auth, profile, workouts, completion, recovery, simulation, and analytics endpoints.
- `apps/mobile` - Expo Router iOS app shell with bottom tabs for Home, Workouts, Calendar, Analytics, and Profile.
- `packages/shared` - shared HYROX training program data, types, date helpers, scoring helpers, station strategy, and nutrition rules.
- `prisma/schema.prisma` - PostgreSQL schema matching the PRD.
- `docs/HYROX_PLATFORM_PRD.md` - implementation PRD distilled from the document.

## Run locally

```bash
npm install
npm run dev:api
npm run dev:web
```

The web app expects the API on `http://localhost:4000`. Copy `.env.example` to `.env.local` in `apps/web` if you want to override it.

For iOS:

```bash
npm run dev:mobile
```

Then open the project in Expo Go or build with EAS.

