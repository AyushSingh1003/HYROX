import { NextRequest, NextResponse } from "next/server";
import { race, trainingWeeks } from "@hyrox/shared";
import { prisma, requireUser, unauthorized } from "../../../lib/server-api";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const activePlan = await prisma.trainingPlan.findFirst({
    where: { userId: user.id, active: true },
    orderBy: { createdAt: "desc" }
  });
  if (!activePlan) {
    return NextResponse.json({
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
  }
  return NextResponse.json({ source: activePlan.source, plan: activePlan });
}
