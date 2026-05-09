import { NextRequest, NextResponse } from "next/server";
import { calculateRecoveryScore, prisma, recoveryLabel, recoverySchema, requireUser, unauthorized } from "../../../lib/server-api";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const recovery = await prisma.recoveryEntry.findMany({ where: { userId: user.id }, orderBy: { date: "desc" } });
  return NextResponse.json({ recovery });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const parsed = recoverySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const score = calculateRecoveryScore({
    sleepHours: data.sleep,
    hydrationPercent: data.hydration,
    soreness: data.soreness,
    hrv: data.hrv,
    fatigue: data.fatigueScore,
    stress: data.stress
  });
  const recovery = await prisma.recoveryEntry.create({
    data: {
      userId: user.id,
      date: new Date(),
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
  return NextResponse.json({ recovery }, { status: 201 });
}
