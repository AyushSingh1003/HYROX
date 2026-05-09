import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateNutritionEntry, calculateRecoveryScore, generateTrainingPlan, recoveryLabel } from "@hyrox/shared";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const jwtSecret = process.env.JWT_SECRET ?? "local-dev-secret-change-me";

export const signupSchema = z.object({
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

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const onboardingSchema = z.object({
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

export const nutritionSchema = z.object({
  foodName: z.string().min(2),
  quantity: z.string().min(1),
  mealTiming: z.string().min(1)
});

export const recoverySchema = z.object({
  sleep: z.coerce.number().min(0).max(16),
  hydration: z.coerce.number().min(0).max(150),
  soreness: z.coerce.number().min(0).max(10),
  hrv: z.coerce.number().min(0).max(150).optional(),
  fatigueScore: z.coerce.number().min(0).max(10),
  stress: z.coerce.number().min(0).max(10).optional()
});

export const completionSchema = z.object({
  workoutId: z.string(),
  completed: z.boolean().default(true),
  status: z.enum(["completed", "partial", "skipped"]).default("completed"),
  completionTime: z.number().optional(),
  notes: z.string().optional()
});

export function publicUser(user: { passwordHash?: string; [key: string]: unknown }) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export function signToken(user: { id: string; email: string }) {
  return jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: "14d" });
}

export async function requireUser(req: NextRequest) {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(header.slice(7), jwtSecret) as { sub: string };
    return prisma.user.findUnique({ where: { id: payload.sub } });
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function asJson(value: unknown) {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function saveGeneratedPlan(userId: string, answers: z.infer<typeof onboardingSchema>) {
  const plan = generateTrainingPlan(answers);
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
      priorities: asJson(plan.priorities),
      phases: asJson(plan.phases),
      weeks: asJson(plan.weeks),
      source: "generated",
      active: true
    }
  });
  return { plan, savedPlan };
}

export { calculateNutritionEntry, calculateRecoveryScore, recoveryLabel };
