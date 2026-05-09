import type { DailyWorkout, GeneratedTrainingPlan, OnboardingAnswers, TrainingLevel, TrainingWeek } from "./types.js";

const levelLabels: Record<TrainingLevel, string> = {
  "absolute-beginner": "Absolute Beginner",
  beginner: "Beginner",
  moderate: "Moderate",
  expert: "Expert"
};

const levelPriorities: Record<TrainingLevel, string[]> = {
  "absolute-beginner": [
    "Build a repeatable training habit",
    "Walking, easy jogging, and basic movement competency",
    "Bodyweight strength and injury prevention",
    "Gradual exposure to HYROX stations"
  ],
  beginner: [
    "Aerobic base development",
    "Strength foundation",
    "Technique development for HYROX stations",
    "Gradual compromised running"
  ],
  moderate: [
    "Threshold running",
    "Compromised running",
    "Station efficiency",
    "Race simulations and progressive overload"
  ],
  expert: [
    "Advanced threshold and VO2 max work",
    "Race-specific intervals",
    "Advanced simulations",
    "Performance optimization and taper precision"
  ]
};

const phaseNames: Record<TrainingLevel, string[]> = {
  "absolute-beginner": ["Foundation", "Run-Walk Capacity", "HYROX Skill Intro", "Confident Finish"],
  beginner: ["Aerobic Base", "Strength Endurance", "Compromised Running Intro", "Race Readiness"],
  moderate: ["Threshold Base", "HYROX Specific Build", "Race Simulation", "Taper"],
  expert: ["Performance Base", "High Specificity", "Peak Simulation", "Race Taper"]
};

function daysBetween(start: Date, end: Date) {
  return Math.ceil((end.getTime() - start.getTime()) / 86_400_000);
}

function weeksUntil(date: string) {
  const target = new Date(`${date}T00:00:00`);
  if (Number.isNaN(target.getTime())) return 8;
  return Math.max(1, Math.ceil(daysBetween(new Date(), target) / 7));
}

function workout(
  id: string,
  week: number,
  phase: number,
  day: DailyWorkout["day"],
  title: string,
  focus: string,
  durationMinutes: number,
  intensity: DailyWorkout["intensity"],
  blocks: DailyWorkout["blocks"],
  options: Partial<DailyWorkout> = {}
): DailyWorkout {
  return {
    id,
    week,
    phase,
    day,
    title,
    focus,
    durationMinutes,
    intensity,
    warmup: options.warmup ?? [
      "8-12 min easy aerobic warmup",
      "Dynamic hips, ankles, calves, and thoracic spine",
      "Two progressive prep sets before the first hard block"
    ],
    blocks,
    cooldown: options.cooldown ?? [
      "5-10 min easy walk or jog",
      "Long exhale breathing reset",
      "Stretch calves, hip flexors, glutes, adductors, and lats"
    ],
    recovery: options.recovery ?? [
      "Hydrate with electrolytes",
      "Protein plus carbs within 60 min",
      "Sleep target: 7.5-9 hours"
    ],
    nutrition: options.nutrition ?? [
      "Protein: 1.8-2.2 g/kg",
      "Carbs higher on run and simulation days",
      "500-900 mg sodium/hour for long or hot sessions"
    ],
    goals: options.goals ?? ["Smooth pacing", "Strong mechanics", "No unnecessary redlining"],
    scaling: options.scaling ?? ["Reduce volume 20-30% if soreness or fatigue is high"],
    targetPace: options.targetPace,
    targetHeartRate: options.targetHeartRate
  };
}

function workoutsForLevel(level: TrainingLevel, week: number, phase: number, answers: OnboardingAnswers): DailyWorkout[] {
  const days = Math.min(6, Math.max(3, answers.availableTrainingDays || 4));
  const stationWeakness = answers.weakestStations[0] ?? "HYROX stations";
  const pace = answers.easyRunPace || answers.current5kPace || "controlled conversational pace";
  const common = {
    targetPace: { shared: pace },
    goals: [
      `Build toward ${answers.targetGoalTime || "a realistic HYROX finish"}`,
      `Improve ${stationWeakness}`,
      "Finish each session with quality mechanics"
    ]
  };

  const templates: Record<TrainingLevel, DailyWorkout[]> = {
    "absolute-beginner": [
      workout(`gen-${week}-1`, week, phase, "Monday", "Movement + Walk-Jog", "Habit, easy aerobic work, movement quality", 35, "easy", [
        { title: "Walk-Jog", items: ["5 min brisk walk", "8 x 1 min easy jog / 2 min walk", "Stay nasal-breathing easy"] },
        { title: "Bodyweight Strength", items: ["Squat to box 3x8", "Incline push-up 3x8", "Dead bug 3x10", "Farmer carry light 4x20m"] }
      ], common),
      workout(`gen-${week}-2`, week, phase, "Wednesday", "Strength Foundation", "Basic strength and station confidence", 40, "moderate", [
        { title: "Strength", items: ["Goblet squat 3x8", "Romanian deadlift 3x8", "Step-up 3x8/side", "Ring row or cable row 3x10"] },
        { title: "Station Skill", items: [`Technique practice: ${stationWeakness}`, "Light effort only", "Stop before form breaks"] }
      ], common),
      workout(`gen-${week}-3`, week, phase, "Saturday", "Easy HYROX Skills", "Low-pressure station exposure", 45, "easy", [
        { title: "Skill Circuit - 3 rounds", items: ["400m walk-jog", "250m row", "10 wall balls or air squats", "20m farmer carry"] }
      ], common)
    ],
    beginner: [
      workout(`gen-${week}-1`, week, phase, "Monday", "Aerobic Base Run", "Build running durability", 45, "easy", [
        { title: "Run", items: ["30-40 min Zone 2", `Hold ${pace}`, "Finish with 4 relaxed strides"] }
      ], common),
      workout(`gen-${week}-2`, week, phase, "Tuesday", "Strength Foundation", "Lower body and trunk strength", 60, "moderate", [
        { title: "Strength", items: ["Back squat 4x6", "RDL 4x8", "Walking lunge 3x20m", "Pallof press 3x12"] },
        { title: "Station Skill", items: [`10-15 min focused practice: ${stationWeakness}`, "Keep effort technical"] }
      ], common),
      workout(`gen-${week}-3`, week, phase, "Thursday", "Intro Compromised Running", "Run after light station fatigue", 50, "moderate", [
        { title: "4 rounds", items: ["500m easy-moderate run", "250m SkiErg or row", "60 sec walk reset"], timer: { mode: "interval", workSeconds: 240, restSeconds: 60, rounds: 4 } }
      ], common),
      workout(`gen-${week}-4`, week, phase, "Saturday", "HYROX Skills Circuit", "Station flow and confidence", 60, "moderate", [
        { title: "Circuit", items: ["800m run", "500m row", "20m farmer carry", "15 wall balls", "Repeat controlled"] }
      ], common)
    ],
    moderate: [
      workout(`gen-${week}-1`, week, phase, "Monday", "Recovery Engine", "Zone 2 and mobility", 55, "easy", [
        { title: "Run", items: ["45 min Zone 2", `Relaxed pace around ${pace}`, "Nasal breathing first 15 min"] }
      ], common),
      workout(`gen-${week}-2`, week, phase, "Tuesday", "Threshold Repeats", "HYROX race engine", 75, "hard", [
        { title: "Run", items: ["5 x 1 km threshold", "2 min jog recovery", "Even splits, no sprinting"], timer: { mode: "interval", workSeconds: 285, restSeconds: 120, rounds: 5 } },
        { title: "Strength", items: ["Squat 4x5", "RDL 4x8", "Walking lunge 3x20m"] }
      ], common),
      workout(`gen-${week}-3`, week, phase, "Thursday", "Compromised Running", "Station fatigue into race-pace running", 70, "moderate-hard", [
        { title: "4 rounds", items: ["500m SkiErg", "800m run at HYROX effort", `Station focus: ${stationWeakness}`], timer: { mode: "station", rounds: 4 } }
      ], common),
      workout(`gen-${week}-4`, week, phase, "Saturday", "HYROX Simulation Build", "Race rhythm, transitions, pacing", 85, "hard", [
        { title: "Simulation", items: ["1 km run", "1000m SkiErg", "1 km run", "Sled push/pull practice", "1 km run", "1000m row"] }
      ], common)
    ],
    expert: [
      workout(`gen-${week}-1`, week, phase, "Monday", "Aerobic Reset + Strides", "Absorb load while staying sharp", 60, "easy", [
        { title: "Run", items: ["50 min Zone 2", "6 x 20 sec relaxed strides", "Full walk-back recovery"] }
      ], common),
      workout(`gen-${week}-2`, week, phase, "Tuesday", "VO2 / Threshold Blend", "Top-end engine for race pace", 85, "hard", [
        { title: "Run", items: ["3 x 1600m threshold", "4 x 400m faster than race pace", "2-3 min jog recoveries"], timer: { mode: "interval", workSeconds: 420, restSeconds: 150, rounds: 3 } }
      ], common),
      workout(`gen-${week}-3`, week, phase, "Thursday", "Heavy Station Efficiency", "Force output under control", 80, "hard", [
        { title: "Stations", items: ["Heavy sled push 6 x 12.5m", "Sled pull 6 x 12.5m", "Farmer carry 5 x 40m", "Wall balls in planned sets"] }
      ], common),
      workout(`gen-${week}-4`, week, phase, "Saturday", "Race-Specific Simulation", "Transitions, station splits, late-race running", 100, "race", [
        { title: "Simulation", items: ["6-8 x 1 km run", "Rotate through SkiErg, sleds, burpees, row, carry, lunges, wall balls", "Record every split and transition"] }
      ], common)
    ]
  };

  return templates[level].slice(0, days);
}

export function generateTrainingPlan(answers: OnboardingAnswers): GeneratedTrainingPlan {
  const weeks = Math.min(16, Math.max(4, weeksUntil(answers.goalRaceDate)));
  const phaseTitles = phaseNames[answers.trainingLevel];
  const generatedWeeks: TrainingWeek[] = Array.from({ length: weeks }, (_, index) => {
    const weekNumber = index + 1;
    const phase = Math.min(4, Math.floor((index / weeks) * 4) + 1);
    const isDeload = weekNumber % 4 === 0 && weekNumber < weeks - 1;
    const isTaper = weekNumber >= weeks - 1;
    const phaseTitle = isTaper ? "Race Taper" : isDeload ? `${phaseTitles[phase - 1]} Deload` : phaseTitles[phase - 1];
    return {
      week: weekNumber,
      phase,
      phaseTitle,
      dateRange: `Week ${weekNumber} of ${weeks}`,
      intent: isTaper
        ? "Reduce volume, preserve sharpness, dial race-day pacing and hydration."
        : isDeload
          ? "Drop volume 30-40%, keep movement quality high, and absorb training."
          : `${levelLabels[answers.trainingLevel]} HYROX build focused on ${levelPriorities[answers.trainingLevel].slice(0, 2).join(" and ").toLowerCase()}.`,
      expectedTrainingLoad: isTaper ? "Low-moderate" : isDeload ? "Reduced" : answers.trainingLevel === "expert" ? "High" : "Moderate",
      recoveryEmphasis: isTaper
        ? "Sleep, glycogen restoration, hydration, and low soreness."
        : isDeload
          ? "Reduce volume, keep technique crisp, and monitor soreness."
          : "Fuel hard sessions, keep easy days easy, and protect sleep quality.",
      workouts: workoutsForLevel(answers.trainingLevel, weekNumber, phase, answers).map((item) => ({
        ...item,
        durationMinutes: isDeload ? Math.round(item.durationMinutes * 0.72) : isTaper ? Math.round(item.durationMinutes * 0.55) : item.durationMinutes,
        intensity: isTaper ? "moderate" : isDeload && item.intensity === "hard" ? "moderate" : item.intensity
      }))
    };
  });

  return {
    id: `plan-${answers.trainingLevel}-${answers.goalRaceDate}`,
    title: `${levelLabels[answers.trainingLevel]} HYROX ${answers.raceCategory.replace("-", " ")} Plan`,
    level: answers.trainingLevel,
    raceCategory: answers.raceCategory,
    goalRaceDate: answers.goalRaceDate,
    targetGoalTime: answers.targetGoalTime,
    weeksUntilRace: weeks,
    summary: `A ${weeks}-week HYROX build for ${answers.name}, using ${answers.availableTrainingDays} training days per week and a ${answers.trainingLevel} starting level.`,
    priorities: levelPriorities[answers.trainingLevel],
    phases: phaseTitles,
    weeks: generatedWeeks
  };
}
