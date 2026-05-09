import { NextRequest, NextResponse } from "next/server";
import { hashPassword, prisma, publicUser, signToken, signupSchema } from "../../../../lib/server-api";

export async function POST(req: NextRequest) {
  const parsed = signupSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const body = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash: await hashPassword(body.password),
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
  });
  return NextResponse.json({ user: publicUser(user), token: signToken(user) }, { status: 201 });
}
