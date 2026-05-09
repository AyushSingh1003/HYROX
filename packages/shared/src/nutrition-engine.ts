import type { NutritionEntry } from "./types.js";

type FoodProfile = {
  match: string[];
  per100g: { calories: number; protein: number; carbs: number; fats: number; sodium: number; hydration: number; electrolytes: number };
};

const foodProfiles: FoodProfile[] = [
  { match: ["chicken", "chicken breast"], per100g: { calories: 165, protein: 31, carbs: 0, fats: 3.6, sodium: 74, hydration: 65, electrolytes: 120 } },
  { match: ["rice", "white rice", "cooked rice"], per100g: { calories: 130, protein: 2.7, carbs: 28, fats: 0.3, sodium: 1, hydration: 70, electrolytes: 35 } },
  { match: ["banana", "bananas"], per100g: { calories: 89, protein: 1.1, carbs: 23, fats: 0.3, sodium: 1, hydration: 74, electrolytes: 360 } },
  { match: ["egg", "eggs"], per100g: { calories: 143, protein: 13, carbs: 1.1, fats: 9.5, sodium: 142, hydration: 76, electrolytes: 160 } },
  { match: ["oats", "oatmeal"], per100g: { calories: 389, protein: 16.9, carbs: 66, fats: 6.9, sodium: 2, hydration: 8, electrolytes: 430 } },
  { match: ["whey", "protein"], per100g: { calories: 400, protein: 80, carbs: 8, fats: 6, sodium: 220, hydration: 4, electrolytes: 330 } },
  { match: ["sports drink", "electrolyte"], per100g: { calories: 24, protein: 0, carbs: 6, fats: 0, sodium: 45, hydration: 92, electrolytes: 120 } },
  { match: ["salmon"], per100g: { calories: 208, protein: 20, carbs: 0, fats: 13, sodium: 59, hydration: 64, electrolytes: 420 } },
  { match: ["pasta"], per100g: { calories: 158, protein: 5.8, carbs: 31, fats: 0.9, sodium: 1, hydration: 62, electrolytes: 35 } }
];

function quantityToGrams(quantity: string, foodName: string) {
  const text = `${quantity} ${foodName}`.toLowerCase();
  const gramMatch = text.match(/(\d+(?:\.\d+)?)\s*g/);
  if (gramMatch) return Number(gramMatch[1]);
  const mlMatch = text.match(/(\d+(?:\.\d+)?)\s*ml/);
  if (mlMatch) return Number(mlMatch[1]);
  const countMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (countMatch && /banana|egg/.test(text)) return Number(countMatch[1]) * (text.includes("egg") ? 50 : 118);
  if (countMatch) return Number(countMatch[1]) * 100;
  return 100;
}

export function calculateNutritionEntry(input: { foodName: string; quantity: string; mealTiming: string }): NutritionEntry {
  const foodName = input.foodName.trim();
  const profile =
    foodProfiles.find((candidate) => candidate.match.some((term) => foodName.toLowerCase().includes(term))) ?? foodProfiles[1];
  const grams = quantityToGrams(input.quantity, foodName);
  const factor = grams / 100;
  const round = (value: number) => Math.round(value * 10) / 10;

  return {
    id: `nut_${Date.now()}`,
    foodName,
    quantity: input.quantity.trim(),
    mealTiming: input.mealTiming.trim(),
    calories: Math.round(profile.per100g.calories * factor),
    protein: round(profile.per100g.protein * factor),
    carbs: round(profile.per100g.carbs * factor),
    fats: round(profile.per100g.fats * factor),
    sodium: Math.round(profile.per100g.sodium * factor),
    hydration: Math.round(profile.per100g.hydration * factor),
    electrolytes: Math.round(profile.per100g.electrolytes * factor),
    createdAt: new Date().toISOString()
  };
}

export function sumNutrition(entries: NutritionEntry[]) {
  return entries.reduce(
    (total, entry) => ({
      calories: total.calories + entry.calories,
      protein: total.protein + entry.protein,
      carbs: total.carbs + entry.carbs,
      fats: total.fats + entry.fats,
      sodium: total.sodium + entry.sodium,
      hydration: total.hydration + entry.hydration,
      electrolytes: total.electrolytes + entry.electrolytes
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, sodium: 0, hydration: 0, electrolytes: 0 }
  );
}
