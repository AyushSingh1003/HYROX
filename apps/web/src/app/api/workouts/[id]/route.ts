import { NextRequest, NextResponse } from "next/server";
import { getWorkoutById } from "@hyrox/shared";
import { asJson, prisma, requireUser, unauthorized } from "../../../../lib/server-api";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const { id } = await params;
  const workout = getWorkoutById(id);
  if (!workout) return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  const override = await prisma.workoutOverride.findUnique({ where: { userId_workoutId: { userId: user.id, workoutId: id } } });
  return NextResponse.json({ workout: override ? { ...workout, ...(override.patch as Record<string, unknown>) } : workout, override });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const { id } = await params;
  const workout = getWorkoutById(id);
  if (!workout) return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  const body = await req.json();
  const patch = asJson(body.patch ?? {});
  const override = await prisma.workoutOverride.upsert({
    where: { userId_workoutId: { userId: user.id, workoutId: id } },
    update: { patch },
    create: { userId: user.id, workoutId: id, patch }
  });
  return NextResponse.json({ workout: { ...workout, ...(override.patch as Record<string, unknown>) }, override });
}
