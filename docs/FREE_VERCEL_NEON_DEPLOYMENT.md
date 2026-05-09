# Free Public Deployment: Vercel + Neon

This project can run publicly on free tiers for an early launch.

## Free Stack

- Vercel: hosts the Next.js web app.
- Neon: hosts free PostgreSQL.
- Prisma: database ORM.
- GitHub: source repo and Vercel deploy trigger.

## Environment Variables

Set these in Vercel:

- `DATABASE_URL`: Neon pooled PostgreSQL URL.
- `JWT_SECRET`: long random secret.
- `NEXT_PUBLIC_API_URL`: `same-origin` once API routes are moved into Next.js, or your API URL while Express is still separate.

## Recommended Launch Path

1. Push this repo to GitHub.
2. Create a Neon free PostgreSQL project.
3. Copy the Neon pooled connection string into Vercel as `DATABASE_URL`.
4. Import the GitHub repo in Vercel.
5. Use the root repo as the Vercel project root.
6. Keep `vercel.json` in the repo root.
7. Add `JWT_SECRET`.
8. Deploy.

## Current Backend Note

The current production backend is still Express-compatible and can run on Railway or another Node host.

For a fully free Vercel-only setup, migrate each Express endpoint into `apps/web/src/app/api/*/route.ts` over time:

- `/auth/signup`
- `/auth/login`
- `/auth/logout`
- `/profile`
- `/onboarding`
- `/training-plan`
- `/nutrition`
- `/recovery`
- `/complete-workout`
- `/workouts`

The app already supports `NEXT_PUBLIC_API_URL=same-origin`, so once those routes exist, the browser can call Vercel directly without a separate API host.
