import { NextRequest, NextResponse } from "next/server";
import { asJson, onboardingSchema, prisma, publicUser, requireUser, saveGeneratedPlan, unauthorized } from "../../../lib/server-api";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const [onboarding, profile, raceGoal, activePlan] = await Promise.all([
    prisma.onboardingResponse.findUnique({ where: { userId: user.id } }),
    prisma.athleteProfile.findUnique({ where: { userId: user.id } }),
    prisma.raceGoal.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    prisma.trainingPlan.findFirst({ where: { userId: user.id, active: true }, orderBy: { createdAt: "desc" } })
  ]);
  return NextResponse.json({ onboarding, profile, raceGoal, activePlan, user: publicUser(user) });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const parsed = onboardingSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const answers = parsed.data;

  await prisma.user.update({
    where: { id: user.id },
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
      where: { userId: user.id },
      update: { answers: asJson(answers) },
      create: { userId: user.id, answers: asJson(answers) }
    }),
    prisma.athleteProfile.upsert({
      where: { userId: user.id },
      update: {
        sex: answers.sex,
        height: answers.height,
        current5kPace: answers.current5kPace,
        weeklyRunningVolume: answers.weeklyRunningVolume,
        strengthExperience: answers.strengthExperience,
        hyroxExperience: answers.hyroxExperience,
        trainingLevel: answers.trainingLevel,
        availableTrainingDays: answers.availableTrainingDays,
        equipmentAccess: asJson(answers.equipmentAccess),
        injuryHistory: answers.injuryHistory,
        weakestStations: asJson(answers.weakestStations),
        sleepHours: answers.sleepHours,
        recoveryQuality: answers.recoveryQuality,
        nutritionConsistency: answers.nutritionConsistency
      },
      create: {
        userId: user.id,
        sex: answers.sex,
        height: answers.height,
        current5kPace: answers.current5kPace,
        weeklyRunningVolume: answers.weeklyRunningVolume,
        strengthExperience: answers.strengthExperience,
        hyroxExperience: answers.hyroxExperience,
        trainingLevel: answers.trainingLevel,
        availableTrainingDays: answers.availableTrainingDays,
        equipmentAccess: asJson(answers.equipmentAccess),
        injuryHistory: answers.injuryHistory,
        weakestStations: asJson(answers.weakestStations),
        sleepHours: answers.sleepHours,
        recoveryQuality: answers.recoveryQuality,
        nutritionConsistency: answers.nutritionConsistency
      }
    }),
    prisma.raceGoal.create({
      data: {
        userId: user.id,
        category: answers.raceCategory,
        raceName: "HYROX Race",
        raceDate: new Date(answers.goalRaceDate),
        targetGoalTime: answers.targetGoalTime
      }
    })
  ]);
  const { plan, savedPlan } = await saveGeneratedPlan(user.id, answers);
  return NextResponse.json({ onboarding, profile, raceGoal, plan: { ...plan, databaseId: savedPlan.id } }, { status: 201 });
}
