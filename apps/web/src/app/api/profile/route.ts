import { NextRequest, NextResponse } from "next/server";
import { prisma, publicUser, requireUser, unauthorized } from "../../../lib/server-api";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  return NextResponse.json({ user: publicUser(user) });
}

export async function PATCH(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const body = await req.json();
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name,
      age: body.age ? Number(body.age) : undefined,
      weight: body.weight ? Number(body.weight) : undefined,
      hyroxCategory: body.hyroxCategory,
      eventName: body.eventName,
      eventLocation: body.eventLocation,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      runningPace: body.runningPace,
      goalTime: body.goalTime,
      profileImage: body.profileImage || undefined,
      bio: body.bio,
      thresholdPace: body.thresholdPace,
      hydrationTarget: body.hydrationTarget ? Number(body.hydrationTarget) : undefined,
      calorieTarget: body.calorieTarget ? Number(body.calorieTarget) : undefined,
      proteinTarget: body.proteinTarget ? Number(body.proteinTarget) : undefined,
      carbTarget: body.carbTarget ? Number(body.carbTarget) : undefined,
      fatTarget: body.fatTarget ? Number(body.fatTarget) : undefined
    }
  });
  return NextResponse.json({ user: publicUser(updated) });
}
