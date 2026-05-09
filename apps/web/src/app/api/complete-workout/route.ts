import { NextRequest, NextResponse } from "next/server";
import { completionSchema, prisma, requireUser, unauthorized } from "../../../lib/server-api";

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const parsed = completionSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const completion = await prisma.completedWorkout.upsert({
    where: { userId_workoutId: { userId: user.id, workoutId: data.workoutId } },
    update: {
      completed: data.completed,
      status: data.status,
      completionTime: data.completionTime,
      notes: data.notes
    },
    create: {
      userId: user.id,
      workoutId: data.workoutId,
      completed: data.completed,
      status: data.status,
      completionTime: data.completionTime,
      notes: data.notes
    }
  });
  return NextResponse.json({ completion }, { status: 201 });
}
