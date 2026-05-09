import { NextRequest, NextResponse } from "next/server";
import { sumNutrition } from "@hyrox/shared";
import { calculateNutritionEntry, nutritionSchema, prisma, requireUser, unauthorized } from "../../../lib/server-api";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const entries = await prisma.nutritionEntry.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ entries, totals: sumNutrition(entries.map((entry) => ({ ...entry, createdAt: entry.createdAt.toISOString() }))) });
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const parsed = nutritionSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const calculated = calculateNutritionEntry(parsed.data);
  const entry = await prisma.nutritionEntry.create({
    data: {
      id: calculated.id,
      userId: user.id,
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
  return NextResponse.json({ entry }, { status: 201 });
}
