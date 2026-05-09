import "dotenv/config";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import cors from "cors";
import express, { type Request, type Response, type NextFunction } from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import {
  allWorkouts,
  benchmarks,
  breathingProtocol,
  calculateRecoveryScore,
  calculateNutritionEntry,
  generateTrainingPlan,
  getTodaysWorkout,
  getWorkoutById,
  heartRateZones,
  nutritionRules,
  phaseProgress,
  race,
  recoveryLabel,
  stationSplits,
  stationTargets,
  trainingWeeks,
  sumNutrition,
  weeklyStructure
} from "@hyrox/shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const storePath = path.join(dataDir, "store.json");
const jwtSecret = process.env.JWT_SECRET ?? "local-dev-secret-change-me";
const prisma = process.env.DATABASE_URL ? new PrismaClient() : null;

type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  age?: number;
  weight?: number;
  hyroxCategory?: string;
  eventName?: string;
  eventLocation?: string;
  eventDate?: string;
  runningPace?: string;
  goalTime?: string;
  profileImage?: string;
  bio?: string;
  thresholdPace?: string;
  hydrationTarget?: number;
  calorieTarget?: number;
  proteinTarget?: number;
  carbTarget?: number;
  fatTarget?: number;
  createdAt: string;
};

type CompletedWorkout = {
  id: string;
  userId: string;
  workoutId: string;
  completed: boolean;
  status: "completed" | "partial" | "skipped";
  completionTime?: number;
  notes?: string;
  createdAt: string;
};

type RecoveryEntry = {
  id: string;
  userId: string;
  date: string;
  sleep: number;
  hydration: number;
  soreness: number;
  hrv?: number;
  fatigueScore: number;
  stress?: number;
  score: number;
  label: string;
  createdAt: string;
};

type SimulationEntry = {
  id: string;
  userId: string;
  date: string;
  type: "half" | "seventy" | "full" | "ninety" | "custom";
  totalTime: string;
  stationTimes: Record<string, string>;
  transitionTime?: string;
  notes?: string;
  createdAt: string;
};

type NutritionEntry = ReturnType<typeof calculateNutritionEntry> & { userId: string };

type WorkoutOverride = {
  id: string;
  userId: string;
  workoutId: string;
  patch: Record<string, unknown>;
  updatedAt: string;
};

type Store = {
  users: User[];
  completedWorkouts: CompletedWorkout[];
  recovery: RecoveryEntry[];
  simulations: SimulationEntry[];
  nutrition: NutritionEntry[];
  workoutOverrides: WorkoutOverride[];
};

type AuthedRequest = Request & { user?: User };

const defaultStore: Store = {
  users: [],
  completedWorkouts: [],
  recovery: [],
  simulations: [],
  nutrition: [],
  workoutOverrides: []
};

function publicUser(user: User) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

function normalizeUser(user: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  age?: number | null;
  weight?: number | null;
  hyroxCategory?: string | null;
  eventName?: string | null;
  eventLocation?: string | null;
  eventDate?: string | Date | null;
  runningPace?: string | null;
  goalTime?: string | null;
  profileImage?: string | null;
  bio?: string | null;
  thresholdPace?: string | null;
  hydrationTarget?: number | null;
  calorieTarget?: number | null;
  proteinTarget?: number | null;
  carbTarget?: number | null;
  fatTarget?: number | null;
  createdAt: string | Date;
}): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    age: user.age ?? undefined,
    weight: user.weight ?? undefined,
    hyroxCategory: user.hyroxCategory ?? undefined,
    eventName: user.eventName ?? undefined,
    eventLocation: user.eventLocation ?? undefined,
    eventDate: user.eventDate instanceof Date ? user.eventDate.toISOString() : user.eventDate ?? undefined,
    runningPace: user.runningPace ?? undefined,
    goalTime: user.goalTime ?? undefined,
    profileImage: user.profileImage ?? undefined,
    bio: user.bio ?? undefined,
    thresholdPace: user.thresholdPace ?? undefined,
    hydrationTarget: user.hydrationTarget ?? undefined,
    calorieTarget: user.calorieTarget ?? undefined,
    proteinTarget: user.proteinTarget ?? undefined,
    carbTarget: user.carbTarget ?? undefined,
    fatTarget: user.fatTarget ?? undefined,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt
  };
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

async function readStore(): Promise<Store> {
  try {
    const raw = await readFile(storePath, "utf8");
    return { ...defaultStore, ...JSON.parse(raw) };
  } catch {
    await mkdir(dataDir, { recursive: true });
    await writeFile(storePath, JSON.stringify(defaultStore, null, 2));
    return defaultStore;
  }
}

async function writeStore(store: Store) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

async function updateStore<T>(updater: (store: Store) => T | Promise<T>) {
  const store = await readStore();
  const result = await updater(store);
  await writeStore(store);
  return result;
}

function signToken(user: User) {
  return jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: "14d" });
}

async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), jwtSecret) as { sub: string };
    const user = prisma
      ? await prisma.user.findUnique({ where: { id: payload.sub } }).then((found) => found ? normalizeUser(found) : null)
      : (await readStore()).users.find((candidate) => candidate.id === payload.sub);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  age: z.coerce.number().int().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  hyroxCategory: z.string().optional(),
  eventName: z.string().optional(),
  eventLocation: z.string().optional(),
  eventDate: z.string().optional(),
  runningPace: z.string().optional(),
  goalTime: z.string().optional()
});

const onboardingSchema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().int().positive().optional(),
  sex: z.string().optional(),
  height: z.coerce.number().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  current5kPace: z.string().optional(),
  easyRunPace: z.string().optional(),
  fiveKPB: z.string().optional(),
  tenKPB: z.string().optional(),
  currentHyroxFinishTime: z.string().optional(),
  weeklyRunningVolume: z.coerce.number().min(0).optional(),
  strengthExperience: z.string().optional(),
  hyroxExperience: z.string().optional(),
  restingHeartRate: z.coerce.number().positive().optional(),
  maximumHeartRate: z.coerce.number().positive().optional(),
  raceCategory: z.enum(["singles-open", "singles-pro", "doubles-open", "doubles-pro", "relay", "other"]).default("singles-open"),
  goalRaceDate: z.string().min(8),
  targetGoalTime: z.string().optional(),
  availableTrainingDays: z.coerce.number().int().min(3).max(7).default(4),
  equipmentAccess: z.array(z.string()).default([]),
  injuryHistory: z.string().optional(),
  weakestStations: z.array(z.string()).default([]),
  strongestStations: z.array(z.string()).default([]).optional(),
  sleepHours: z.coerce.number().min(0).max(16).optional(),
  recoveryQuality: z.string().optional(),
  nutritionConsistency: z.string().optional(),
  stressLevel: z.string().optional(),
  occupationActivityLevel: z.string().optional(),
  nutritionPreference: z.string().optional(),
  partnerAge: z.coerce.number().int().positive().optional(),
  partnerRunningPace: z.string().optional(),
  partnerStrengths: z.array(z.string()).default([]).optional(),
  partnerWeaknesses: z.array(z.string()).default([]).optional(),
  trainingLevel: z.enum(["absolute-beginner", "beginner", "moderate", "expert"])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const completionSchema = z.object({
  workoutId: z.string(),
  completed: z.boolean().default(true),
  status: z.enum(["completed", "partial", "skipped"]).default("completed"),
  completionTime: z.number().optional(),
  notes: z.string().optional()
});

const recoverySchema = z.object({
  date: z.string().optional(),
  sleep: z.number().min(0).max(16),
  hydration: z.number().min(0).max(150),
  soreness: z.number().min(0).max(10),
  hrv: z.number().min(0).max(150).optional(),
  fatigueScore: z.number().min(0).max(10),
  stress: z.number().min(0).max(10).optional()
});

const simulationSchema = z.object({
  date: z.string().optional(),
  type: z.enum(["half", "seventy", "full", "ninety", "custom"]).default("custom"),
  totalTime: z.string().min(1),
  stationTimes: z.record(z.string()).default({}),
  transitionTime: z.string().optional(),
  notes: z.string().optional()
});

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  age: z.number().int().positive().optional(),
  weight: z.number().positive().optional(),
  hyroxCategory: z.string().optional(),
  eventName: z.string().optional(),
  eventLocation: z.string().optional(),
  eventDate: z.string().optional(),
  runningPace: z.string().optional(),
  goalTime: z.string().optional(),
  profileImage: z.union([z.string().url(), z.literal("")]).optional(),
  bio: z.string().max(500).optional(),
  thresholdPace: z.string().optional(),
  hydrationTarget: z.number().positive().optional(),
  calorieTarget: z.number().positive().optional(),
  proteinTarget: z.number().positive().optional(),
  carbTarget: z.number().positive().optional(),
  fatTarget: z.number().positive().optional()
});

const nutritionSchema = z.object({
  foodName: z.string().min(2),
  quantity: z.string().min(1),
  mealTiming: z.string().min(1)
});

const workoutOverrideSchema = z.object({
  patch: z.record(z.unknown())
});

const app = express();
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
const configuredOrigins = (process.env.WEB_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...configuredOrigins,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001"
].filter(Boolean));

app.use(cors({
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.has(origin) ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) ||
      /^https:\/\/[a-z0-9-]+\.ngrok-free\.app$/.test(origin) ||
      /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/.test(origin)
    ) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "hyrox-api", raceDate: race.date });
});

app.get("/program", (_req, res) => {
  res.json({
    race,
    weeklyStructure,
    heartRateZones,
    trainingWeeks,
    stationSplits,
    stationTargets,
    benchmarks,
    nutritionRules,
    breathingProtocol
  });
});

app.post("/auth/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const body = parsed.data;
  const passwordHash = await bcrypt.hash(body.password, 12);

  if (prisma) {
    const existing = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const user = normalizeUser(await prisma.user.create({
      data: {
        id: id("usr"),
        name: body.name,
        email: body.email.toLowerCase(),
        passwordHash,
        age: body.age,
        weight: body.weight,
        hyroxCategory: body.hyroxCategory,
        eventName: body.eventName || "HYROX Delhi",
        eventLocation: body.eventLocation || "Delhi",
        eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
        runningPace: body.runningPace,
        goalTime: body.goalTime,
        thresholdPace: body.runningPace,
        hydrationTarget: body.weight ? Math.round(body.weight * 40) : 3000,
        calorieTarget: 2900,
        proteinTarget: body.weight ? Math.round(body.weight * 2) : 150,
        carbTarget: body.weight ? Math.round(body.weight * 5) : 370,
        fatTarget: 80
      }
    }));
    res.status(201).json({ user: publicUser(user), token: signToken(user) });
    return;
  }

  const result = await updateStore((store) => {
    const existing = store.users.find((user) => user.email.toLowerCase() === body.email.toLowerCase());
    if (existing) return { error: "Email already registered" };

    const user: User = {
      id: id("usr"),
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash,
      age: body.age,
      weight: body.weight,
      hyroxCategory: body.hyroxCategory,
      eventName: body.eventName || "HYROX Delhi",
      eventLocation: body.eventLocation || "Delhi",
      eventDate: body.eventDate,
      runningPace: body.runningPace,
      goalTime: body.goalTime,
      thresholdPace: body.runningPace,
      hydrationTarget: body.weight ? Math.round(body.weight * 40) : 3000,
      calorieTarget: 2900,
      proteinTarget: body.weight ? Math.round(body.weight * 2) : 150,
      carbTarget: body.weight ? Math.round(body.weight * 5) : 370,
      fatTarget: 80,
      createdAt: new Date().toISOString()
    };
    store.users.push(user);
    return { user, token: signToken(user) };
  });

  if ("error" in result) {
    res.status(409).json(result);
    return;
  }
  res.status(201).json({ user: publicUser(result.user), token: result.token });
});

app.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const user = prisma
    ? await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } }).then((found) => found ? normalizeUser(found) : null)
    : (await readStore()).users.find((candidate) => candidate.email === parsed.data.email.toLowerCase());
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.json({ user: publicUser(user), token: signToken(user) });
});

app.post("/auth/logout", (_req, res) => {
  res.status(204).end();
});

app.post("/auth/forgot-password", (_req, res) => {
  res.json({ ok: true, message: "Password reset flow is ready for email provider integration." });
});

app.get("/onboarding", requireAuth, async (req: AuthedRequest, res) => {
  if (!prisma) {
    res.json({ onboarding: null, profile: null, raceGoal: null });
    return;
  }

  const [onboarding, profile, raceGoal, activePlan] = await Promise.all([
    prisma.onboardingResponse.findUnique({ where: { userId: req.user!.id } }),
    prisma.athleteProfile.findUnique({ where: { userId: req.user!.id } }),
    prisma.raceGoal.findFirst({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" } }),
    prisma.trainingPlan.findFirst({ where: { userId: req.user!.id, active: true }, orderBy: { createdAt: "desc" } })
  ]);

  res.json({ onboarding, profile, raceGoal, activePlan });
});

app.post("/onboarding", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = onboardingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const answers = parsed.data;
  const plan = generateTrainingPlan(answers);

  if (!prisma) {
    res.status(201).json({ onboarding: { answers }, plan });
    return;
  }

  const userId = req.user!.id;
  const answerJson = JSON.parse(JSON.stringify(answers)) as Prisma.InputJsonValue;
  const equipmentJson = JSON.parse(JSON.stringify(answers.equipmentAccess)) as Prisma.InputJsonValue;
  const weaknessJson = JSON.parse(JSON.stringify(answers.weakestStations)) as Prisma.InputJsonValue;
  const weekJson = JSON.parse(JSON.stringify(plan.weeks)) as Prisma.InputJsonValue;
  const prioritiesJson = JSON.parse(JSON.stringify(plan.priorities)) as Prisma.InputJsonValue;
  const phasesJson = JSON.parse(JSON.stringify(plan.phases)) as Prisma.InputJsonValue;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: answers.name,
      age: answers.age,
      weight: answers.weight,
      runningPace: answers.current5kPace,
      goalTime: answers.targetGoalTime,
      hyroxCategory: answers.raceCategory,
      thresholdPace: answers.current5kPace,
      hydrationTarget: answers.weight ? Math.round(answers.weight * 40) : undefined,
      proteinTarget: answers.weight ? Math.round(answers.weight * 2) : undefined,
      carbTarget: answers.weight ? Math.round(answers.weight * 5) : undefined
    }
  });

  const [onboarding, profile, raceGoal] = await prisma.$transaction([
    prisma.onboardingResponse.upsert({
      where: { userId },
      update: { answers: answerJson },
      create: { userId, answers: answerJson }
    }),
    prisma.athleteProfile.upsert({
      where: { userId },
      update: {
        sex: answers.sex,
        height: answers.height,
        current5kPace: answers.current5kPace,
        weeklyRunningVolume: answers.weeklyRunningVolume,
        strengthExperience: answers.strengthExperience,
        hyroxExperience: answers.hyroxExperience,
        trainingLevel: answers.trainingLevel,
        availableTrainingDays: answers.availableTrainingDays,
        equipmentAccess: equipmentJson,
        injuryHistory: answers.injuryHistory,
        weakestStations: weaknessJson,
        sleepHours: answers.sleepHours,
        recoveryQuality: answers.recoveryQuality,
        nutritionConsistency: answers.nutritionConsistency
      },
      create: {
        userId,
        sex: answers.sex,
        height: answers.height,
        current5kPace: answers.current5kPace,
        weeklyRunningVolume: answers.weeklyRunningVolume,
        strengthExperience: answers.strengthExperience,
        hyroxExperience: answers.hyroxExperience,
        trainingLevel: answers.trainingLevel,
        availableTrainingDays: answers.availableTrainingDays,
        equipmentAccess: equipmentJson,
        injuryHistory: answers.injuryHistory,
        weakestStations: weaknessJson,
        sleepHours: answers.sleepHours,
        recoveryQuality: answers.recoveryQuality,
        nutritionConsistency: answers.nutritionConsistency
      }
    }),
    prisma.raceGoal.create({
      data: {
        userId,
        category: answers.raceCategory,
        raceName: answers.raceCategory === "doubles-open" ? "HYROX Doubles Open" : "HYROX Race",
        raceDate: new Date(answers.goalRaceDate),
        targetGoalTime: answers.targetGoalTime
      }
    })
  ]);

  await prisma.trainingPlan.updateMany({ where: { userId }, data: { active: false } });
  const savedPlan = await prisma.trainingPlan.create({
    data: {
      userId,
      title: plan.title,
      level: plan.level,
      raceCategory: plan.raceCategory,
      goalRaceDate: new Date(plan.goalRaceDate),
      targetGoalTime: plan.targetGoalTime,
      weeksUntilRace: plan.weeksUntilRace,
      summary: plan.summary,
      priorities: prioritiesJson,
      phases: phasesJson,
      weeks: weekJson,
      source: "generated",
      active: true
    }
  });

  res.status(201).json({ onboarding, profile, raceGoal, plan: { ...plan, databaseId: savedPlan.id } });
});

app.get("/training-plan", requireAuth, async (req: AuthedRequest, res) => {
  if (!prisma) {
    res.json({
      source: "personal-delhi-template",
      plan: {
        title: "HYROX Delhi 2026 - Personal Moderate Doubles Plan",
        level: "moderate",
        raceCategory: "doubles-open",
        weeks: trainingWeeks,
        priorities: ["threshold running", "compromised running", "doubles pacing", "side stitch prevention"]
      }
    });
    return;
  }

  const activePlan = await prisma.trainingPlan.findFirst({
    where: { userId: req.user!.id, active: true },
    orderBy: { createdAt: "desc" }
  });

  if (!activePlan) {
    res.json({
      source: "personal-delhi-template",
      plan: {
        title: "HYROX Delhi 2026 - Personal Moderate Doubles Plan",
        level: "moderate",
        raceCategory: "doubles-open",
        goalRaceDate: race.date,
        targetGoalTime: race.goalWindow,
        weeks: trainingWeeks,
        priorities: ["threshold running", "compromised running", "doubles pacing", "side stitch prevention"]
      }
    });
    return;
  }

  res.json({ source: activePlan.source, plan: activePlan });
});

app.get("/workouts", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const completions = prisma
    ? await prisma.completedWorkout.findMany({ where: { userId } })
    : (await readStore()).completedWorkouts.filter((entry) => entry.userId === userId);
  const overrides = prisma
    ? await prisma.workoutOverride.findMany({ where: { userId } })
    : (await readStore()).workoutOverrides.filter((entry) => entry.userId === userId);
  res.json({
    race,
    phaseProgress: phaseProgress(),
    today: getTodaysWorkout(),
    workouts: allWorkouts,
    weeks: trainingWeeks,
    completions,
    overrides
  });
});

app.get("/workouts/:id", requireAuth, async (req, res) => {
  const workoutId = String(req.params.id);
  const workout = getWorkoutById(workoutId);
  if (!workout) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }
  res.json({ workout });
});

app.patch("/workouts/:id", requireAuth, async (req: AuthedRequest, res) => {
  const workoutId = String(req.params.id);
  const workout = getWorkoutById(workoutId);
  if (!workout) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }

  const parsed = workoutOverrideSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  if (prisma) {
    const patch = JSON.parse(JSON.stringify(parsed.data.patch)) as Prisma.InputJsonValue;
    const override = await prisma.workoutOverride.upsert({
      where: { userId_workoutId: { userId: req.user!.id, workoutId } },
      update: { patch },
      create: { id: id("wrk"), userId: req.user!.id, workoutId, patch }
    });
    res.json({ workout: { ...workout, ...(override.patch as Record<string, unknown>) }, override });
    return;
  }

  const override = await updateStore((store) => {
    const existing = store.workoutOverrides.find((entry) => entry.userId === req.user!.id && entry.workoutId === workoutId);
    if (existing) {
      existing.patch = { ...existing.patch, ...parsed.data.patch };
      existing.updatedAt = new Date().toISOString();
      return existing;
    }
    const created: WorkoutOverride = {
      id: id("wrk"),
      userId: req.user!.id,
      workoutId,
      patch: parsed.data.patch,
      updatedAt: new Date().toISOString()
    };
    store.workoutOverrides.push(created);
    return created;
  });

  res.json({ workout: { ...workout, ...override.patch }, override });
});

app.post("/complete-workout", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = completionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const workout = getWorkoutById(parsed.data.workoutId);
  if (!workout) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }

  if (prisma) {
    const entry = await prisma.completedWorkout.upsert({
      where: { userId_workoutId: { userId: req.user!.id, workoutId: parsed.data.workoutId } },
      update: {
        completed: parsed.data.completed,
        status: parsed.data.status,
        completionTime: parsed.data.completionTime,
        notes: parsed.data.notes
      },
      create: {
        id: id("cmp"),
        userId: req.user!.id,
        workoutId: parsed.data.workoutId,
        completed: parsed.data.completed,
        status: parsed.data.status,
        completionTime: parsed.data.completionTime,
        notes: parsed.data.notes
      }
    });
    res.status(201).json({ completion: entry });
    return;
  }

  const entry = await updateStore((store) => {
    const existing = store.completedWorkouts.find(
      (candidate) => candidate.userId === req.user!.id && candidate.workoutId === parsed.data.workoutId
    );
    const payload = {
      completed: parsed.data.completed,
      status: parsed.data.status,
      completionTime: parsed.data.completionTime,
      notes: parsed.data.notes
    };

    if (existing) {
      Object.assign(existing, payload);
      return existing;
    }

    const completion: CompletedWorkout = {
      id: id("cmp"),
      userId: req.user!.id,
      workoutId: parsed.data.workoutId,
      ...payload,
      createdAt: new Date().toISOString()
    };
    store.completedWorkouts.push(completion);
    return completion;
  });

  res.status(201).json({ completion: entry });
});

app.post("/recovery", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = recoverySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const data = parsed.data;
  const score = calculateRecoveryScore({
    sleepHours: data.sleep,
    hydrationPercent: data.hydration,
    soreness: data.soreness,
    hrv: data.hrv,
    fatigue: data.fatigueScore,
    stress: data.stress
  });
  if (prisma) {
    const entry = await prisma.recoveryEntry.create({
      data: {
        id: id("rec"),
        userId: req.user!.id,
        date: new Date(data.date ?? new Date().toISOString().slice(0, 10)),
        sleep: data.sleep,
        hydration: data.hydration,
        soreness: data.soreness,
        hrv: data.hrv,
        fatigueScore: data.fatigueScore,
        stress: data.stress,
        score,
        label: recoveryLabel(score).label
      }
    });
    res.status(201).json({ recovery: entry });
    return;
  }

  const entry = await updateStore((store) => {
    const recovery: RecoveryEntry = {
      id: id("rec"),
      userId: req.user!.id,
      date: data.date ?? new Date().toISOString().slice(0, 10),
      sleep: data.sleep,
      hydration: data.hydration,
      soreness: data.soreness,
      hrv: data.hrv,
      fatigueScore: data.fatigueScore,
      stress: data.stress,
      score,
      label: recoveryLabel(score).label,
      createdAt: new Date().toISOString()
    };
    store.recovery.push(recovery);
    return recovery;
  });

  res.status(201).json({ recovery: entry });
});

app.get("/recovery", requireAuth, async (req: AuthedRequest, res) => {
  if (prisma) {
    const entries = await prisma.recoveryEntry.findMany({ where: { userId: req.user!.id }, orderBy: { date: "asc" } });
    res.json({ recovery: entries });
    return;
  }

  const store = await readStore();
  const entries = store.recovery.filter((entry) => entry.userId === req.user!.id);
  res.json({ recovery: entries });
});

app.post("/simulation", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = simulationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  if (prisma) {
    const entry = await prisma.simulation.create({
      data: {
        id: id("sim"),
        userId: req.user!.id,
        date: new Date(parsed.data.date ?? new Date().toISOString().slice(0, 10)),
        type: parsed.data.type,
        totalTime: parsed.data.totalTime,
        stationTimes: parsed.data.stationTimes,
        transitionTime: parsed.data.transitionTime,
        notes: parsed.data.notes
      }
    });
    res.status(201).json({ simulation: entry });
    return;
  }

  const entry = await updateStore((store) => {
    const simulation: SimulationEntry = {
      id: id("sim"),
      userId: req.user!.id,
      date: parsed.data.date ?? new Date().toISOString().slice(0, 10),
      type: parsed.data.type,
      totalTime: parsed.data.totalTime,
      stationTimes: parsed.data.stationTimes,
      transitionTime: parsed.data.transitionTime,
      notes: parsed.data.notes,
      createdAt: new Date().toISOString()
    };
    store.simulations.push(simulation);
    return simulation;
  });

  res.status(201).json({ simulation: entry });
});

app.get("/simulations", requireAuth, async (req: AuthedRequest, res) => {
  if (prisma) {
    const simulations = await prisma.simulation.findMany({ where: { userId: req.user!.id }, orderBy: { date: "desc" } });
    res.json({ simulations });
    return;
  }

  const store = await readStore();
  res.json({ simulations: store.simulations.filter((entry) => entry.userId === req.user!.id) });
});

app.post("/nutrition", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = nutritionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  if (prisma) {
    const calculated = calculateNutritionEntry(parsed.data);
    const entry = await prisma.nutritionEntry.create({
      data: {
        id: id("nut"),
        userId: req.user!.id,
        foodName: calculated.foodName,
        quantity: calculated.quantity,
        mealTiming: calculated.mealTiming,
        calories: calculated.calories,
        protein: calculated.protein,
        carbs: calculated.carbs,
        fats: calculated.fats,
        sodium: calculated.sodium,
        hydration: calculated.hydration,
        electrolytes: calculated.electrolytes
      }
    });
    res.status(201).json({ entry });
    return;
  }

  const entry = await updateStore((store) => {
    const nutrition = { ...calculateNutritionEntry(parsed.data), id: id("nut"), userId: req.user!.id };
    store.nutrition.push(nutrition);
    return nutrition;
  });

  res.status(201).json({ entry });
});

app.get("/nutrition", requireAuth, async (req: AuthedRequest, res) => {
  if (prisma) {
    const entries = await prisma.nutritionEntry.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" } });
    res.json({ entries, totals: sumNutrition(entries.map((entry) => ({
      id: entry.id,
      foodName: entry.foodName,
      quantity: entry.quantity,
      mealTiming: entry.mealTiming,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fats: entry.fats,
      sodium: entry.sodium,
      hydration: entry.hydration,
      electrolytes: entry.electrolytes,
      createdAt: entry.createdAt.toISOString()
    }))) });
    return;
  }

  const store = await readStore();
  const entries = store.nutrition.filter((entry) => entry.userId === req.user!.id);
  res.json({ entries, totals: sumNutrition(entries) });
});

app.get("/profile", requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: publicUser(req.user!) });
});

app.patch("/profile", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  if (prisma) {
    const { eventDate, ...profileData } = parsed.data;
    const updated = normalizeUser(await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...profileData,
        eventDate: eventDate ? new Date(eventDate) : eventDate === "" ? null : undefined
      }
    }));
    res.json({ user: publicUser(updated) });
    return;
  }

  const updated = await updateStore((store) => {
    const user = store.users.find((candidate) => candidate.id === req.user!.id)!;
    Object.assign(user, parsed.data);
    return user;
  });

  res.json({ user: publicUser(updated) });
});

app.get("/analytics", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const completions = prisma
    ? await prisma.completedWorkout.findMany({ where: { userId } })
    : (await readStore()).completedWorkouts.filter((entry) => entry.userId === userId);
  const completedCount = completions.filter((entry) => entry.completed).length;
  const consistency = Math.round((completedCount / allWorkouts.length) * 100);
  const recentRecovery = prisma
    ? await prisma.recoveryEntry.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 7 })
    : (await readStore()).recovery.filter((entry) => entry.userId === userId).slice(-7);
  const simulations = prisma
    ? await prisma.simulation.findMany({ where: { userId }, orderBy: { date: "desc" } })
    : (await readStore()).simulations.filter((entry) => entry.userId === userId);

  res.json({
    consistency,
    completedCount,
    totalWorkouts: allWorkouts.length,
    currentPhaseProgress: phaseProgress(),
    recoveryTrend: recentRecovery,
    simulations,
    benchmarks,
    stationTargets
  });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error" });
});

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
app.listen(port, host, () => {
  console.log(`HYROX API listening on http://${host}:${port}`);
});
