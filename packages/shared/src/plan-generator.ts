import type { DailyWorkout, GeneratedTrainingPlan, OnboardingAnswers, TrainingLevel, TrainingWeek } from "./types.js";

const levelLabels: Record<TrainingLevel, string> = {
  "absolute-beginner": "Absolute Beginner",
  beginner: "Beginner",
  moderate: "Moderate",
  expert: "Expert"
};

const levelPriorities: Record<TrainingLevel, string[]> = {
  "absolute-beginner": [
    "Consistency, movement quality, and injury prevention",
    "Walk-run aerobic development",
    "Bodyweight and basic dumbbell strength",
    "Low-pressure HYROX station familiarity"
  ],
  beginner: [
    "Aerobic base and foundational strength",
    "Gradual threshold exposure",
    "Basic HYROX circuits and station technique",
    "Controlled compromised running"
  ],
  moderate: [
    "Threshold running",
    "Compromised running",
    "Station efficiency",
    "Race simulations and progressive overload"
  ],
  expert: [
    "Advanced threshold and VO2 max development",
    "High-specificity compromised running",
    "Frequent simulations and station split optimization",
    "Performance taper and race execution precision"
  ]
};

const finishRanges: Record<TrainingLevel, { conservative: string; realistic: string; stretch: string }> = {
  "absolute-beginner": { conservative: "3:30+", realistic: "2:45-3:15", stretch: "2:20-2:45" },
  beginner: { conservative: "2:20", realistic: "1:55-2:10", stretch: "1:45-1:55" },
  moderate: { conservative: "1:45", realistic: "1:25-1:35", stretch: "1:15-1:25" },
  expert: { conservative: "1:12", realistic: "1:05-1:10", stretch: "Sub-1:05" }
};

const phaseTitles = [
  "Base Engine + Structural Capacity",
  "Build Phase",
  "Peak HYROX Specificity",
  "Taper"
];

const stationTargets: Record<TrainingLevel, string[]> = {
  "absolute-beginner": [
    "Runs: 8:00-10:00/km or run-walk",
    "SkiErg: 7:00-9:00",
    "Sled Push: controlled completion",
    "Sled Pull: controlled completion",
    "Burpee Broad Jumps: 10:00-14:00",
    "Row: 6:00-8:00",
    "Farmer Carry: 4:00-6:00",
    "Sandbag Lunges: 8:00-12:00",
    "Wall Balls: 8:00-14:00"
  ],
  beginner: [
    "Runs: 6:30-7:45/km",
    "SkiErg: 5:30-7:00",
    "Sled Push: 5:00-7:00",
    "Sled Pull: 5:00-7:00",
    "Burpee Broad Jumps: 7:00-10:00",
    "Row: 5:00-6:30",
    "Farmer Carry: 3:00-4:30",
    "Sandbag Lunges: 6:00-9:00",
    "Wall Balls: 6:00-10:00"
  ],
  moderate: [
    "Runs: 4:45-5:45/km depending on station fatigue",
    "SkiErg: 4:15-5:15",
    "Sled Push: 3:00-4:30",
    "Sled Pull: 3:30-5:00",
    "Burpee Broad Jumps: 4:45-6:30",
    "Row: 4:15-5:15",
    "Farmer Carry: 2:15-3:15",
    "Sandbag Lunges: 4:30-6:30",
    "Wall Balls: 4:30-7:00"
  ],
  expert: [
    "Runs: 3:55-4:35/km depending on station fatigue",
    "SkiErg: 3:35-4:10",
    "Sled Push: 2:15-3:00",
    "Sled Pull: 2:30-3:20",
    "Burpee Broad Jumps: 3:30-4:45",
    "Row: 3:35-4:15",
    "Farmer Carry: 1:30-2:10",
    "Sandbag Lunges: 3:15-4:30",
    "Wall Balls: 3:00-4:30"
  ]
};

const doublesSplits = [
  "SkiErg: stronger puller 55-65%, partner 35-45%",
  "Sled Push: stronger lower-body athlete 60-70%, partner 30-40%",
  "Sled Pull: split by rope rhythm; swap before grip degrades",
  "Burpee Broad Jumps: alternate every 8-12 reps or 10m",
  "Row: stronger aerobic athlete 50-60%, partner 40-50%",
  "Farmer Carry: stronger grip athlete 60-70%, partner 30-40%",
  "Sandbag Lunges: alternate every 20m unless one athlete is clearly stronger",
  "Wall Balls: small planned sets, usually 15/10 or 20/10 based on fatigue"
];

function daysBetween(start: Date, end: Date) {
  return Math.ceil((end.getTime() - start.getTime()) / 86_400_000);
}

function weeksUntil(date: string) {
  const target = new Date(`${date}T00:00:00`);
  if (Number.isNaN(target.getTime())) return 8;
  return Math.max(1, Math.ceil(daysBetween(new Date(), target) / 7));
}

function phaseForWeek(week: number, totalWeeks: number) {
  if (totalWeeks < 6) return week >= totalWeeks - 1 ? 4 : 3;
  if (totalWeeks <= 12) {
    if (week > totalWeeks - 2) return 4;
    if (week > Math.round(totalWeeks * 0.66)) return 3;
    if (week > Math.round(totalWeeks * 0.34)) return 2;
    return 1;
  }
  if (week > totalWeeks - 2) return 4;
  if (week > Math.round(totalWeeks * 0.72)) return 3;
  if (week > Math.round(totalWeeks * 0.45)) return 2;
  return 1;
}

function isDeloadWeek(level: TrainingLevel, week: number, totalWeeks: number) {
  if (week >= totalWeeks - 1) return false;
  const cadence = level === "expert" ? 5 : level === "absolute-beginner" ? 3 : 4;
  return week % cadence === 0;
}

function exertion(level: TrainingLevel, phase: number) {
  const table: Record<TrainingLevel, string[]> = {
    "absolute-beginner": ["RPE 3-5", "RPE 4-6", "RPE 5-7", "RPE 3-5"],
    beginner: ["RPE 4-6", "RPE 5-7", "RPE 6-8", "RPE 3-5"],
    moderate: ["RPE 5-7", "RPE 6-8", "RPE 7-9", "RPE 3-6"],
    expert: ["RPE 6-8", "RPE 7-9", "RPE 8-9", "RPE 4-6"]
  };
  return table[level][phase - 1];
}

function paceGuide(level: TrainingLevel, answers: OnboardingAnswers) {
  const easy = answers.easyRunPace || answers.current5kPace || {
    "absolute-beginner": "brisk walk to 8:00-10:00/km jog",
    beginner: "6:30-7:45/km",
    moderate: "5:15-6:05/km",
    expert: "4:35-5:15/km"
  }[level];
  const threshold = answers.current5kPace || {
    "absolute-beginner": "short jog intervals only",
    beginner: "5:45-6:30/km",
    moderate: "4:20-4:45/km",
    expert: "3:45-4:10/km"
  }[level];
  return {
    easy,
    threshold: answers.currentHyroxFinishTime ? `slightly faster than current HYROX run pace (${threshold})` : threshold,
    vo2: level === "expert" ? "3K-5K effort, full control" : level === "moderate" ? "5K effort, never all-out" : "short controlled pickups",
    race: answers.targetGoalTime ? `pace for ${answers.targetGoalTime}` : "controlled HYROX race effort"
  };
}

function substitutions(answers: OnboardingAnswers) {
  const equipment = new Set(answers.equipmentAccess.map((item) => item.toLowerCase()));
  return [
    equipment.has("skierg") ? "SkiErg available: use normal ski prescriptions" : "No SkiErg: use banded lat pulldowns, high pulls, or Assault Bike intervals",
    equipment.has("rowerg") ? "RowErg available: use normal row prescriptions" : "No RowErg: use bike, run, or kettlebell swing intervals",
    equipment.has("sled") ? "Sled available: use normal push and pull prescriptions" : "No sled: use heavy treadmill pushes, prowler alternative, or heavy backward drags",
    equipment.has("wall ball") || equipment.has("wall ball setup") ? "Wall ball available: use wall ball progression" : "No wall ball: use thrusters or med-ball front squats"
  ];
}

function sharedWarmup(level: TrainingLevel) {
  if (level === "absolute-beginner") {
    return [
      "5-8 min brisk walk or bike",
      "Dynamic ankles, hips, calves, and thoracic rotations",
      "Two easy practice sets before loading any station"
    ];
  }
  return [
    "8-12 min easy aerobic warmup",
    "Leg swings, skips, lunges, high knees, and thoracic rotations",
    "Two progressive prep sets before the first hard block"
  ];
}

function sharedRecovery(level: TrainingLevel, answers: OnboardingAnswers) {
  const sleep = answers.sleepHours ? `Sleep target: at least ${Math.max(7.5, answers.sleepHours)} hours` : "Sleep target: 7.5-9 hours";
  return [
    sleep,
    "Post-workout: protein plus carbs within 60 min",
    "Hydration: 35-45 ml/kg/day plus electrolytes on hard or hot sessions",
    level === "expert" ? "Use HRV/resting HR trends to reduce volume if readiness drops" : "Reduce volume if soreness or fatigue changes running mechanics"
  ];
}

function sharedNutrition(level: TrainingLevel, answers: OnboardingAnswers) {
  const protein = answers.weight ? `${Math.round(answers.weight * 1.8)}-${Math.round(answers.weight * 2.2)}g protein/day` : "Protein: 1.8-2.2 g/kg/day";
  return [
    protein,
    level === "absolute-beginner" ? "Carbs around sessions; do not underfuel new training stress" : "Carbs higher on threshold, compromised running, and simulation days",
    "Long sessions: 30-60g carbs/hour and 500-900mg sodium/hour",
    "Race week: 48 hours carb emphasis, lower fiber, lower spicy/fatty foods"
  ];
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
  answers: OnboardingAnswers,
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
    targetPace: options.targetPace,
    targetHeartRate: options.targetHeartRate,
    warmup: options.warmup ?? sharedWarmup(answers.trainingLevel),
    blocks,
    cooldown: options.cooldown ?? [
      "5-10 min easy walk or jog",
      "Long exhale breathing reset",
      "Stretch calves, hip flexors, glutes, adductors, and lats"
    ],
    recovery: options.recovery ?? sharedRecovery(answers.trainingLevel, answers),
    nutrition: options.nutrition ?? sharedNutrition(answers.trainingLevel, answers),
    goals: options.goals ?? [
      `Build toward ${answers.targetGoalTime || finishRanges[answers.trainingLevel].realistic}`,
      `Improve ${answers.weakestStations[0] ?? "HYROX race execution"}`,
      "Finish with clean mechanics and controlled breathing"
    ],
    scaling: options.scaling ?? [
      "Reduce volume 20-30% if soreness, sleep, stress, or injury history demands it",
      ...substitutions(answers)
    ]
  };
}

function levelSessions(level: TrainingLevel, week: number, phase: number, answers: OnboardingAnswers): DailyWorkout[] {
  const paces = paceGuide(level, answers);
  const weakness = answers.weakestStations[0] ?? "weakest station";
  const doubles = answers.raceCategory.includes("doubles");
  const partnerCue = doubles
    ? `Doubles cue: run together; partner pace ${answers.partnerRunningPace || "sets the cap"}; communicate before every station`
    : "Solo cue: preserve run rhythm and avoid station redlining";

  const baseGoals = [
    partnerCue,
    `Station target focus: ${stationTargets[level].slice(0, 3).join("; ")}`,
    "Practice fast entry, calm first reps, and clean exit"
  ];

  const programs: Record<TrainingLevel, DailyWorkout[]> = {
    "absolute-beginner": [
      workout(`gen-${week}-1`, week, phase, "Monday", "Walk-Run Engine + Core", "Consistency, aerobic habit, side stitch prevention", 40, "easy", [
        { title: "Walk-Run", items: [`${phase <= 1 ? "10 x 1 min jog / 2 min walk" : "8 x 2 min jog / 90 sec walk"}`, `Keep ${paces.easy}`, "Nasal breathing for the first 10 min"] },
        { title: "Core Stability", items: ["Dead bugs 3x10/side", "Bird dogs 3x10/side", "Side plank 3x20-30 sec/side", "Suitcase carry 4x20m"] },
        { title: "Breathing", items: ["Crocodile breathing 5 min", "Box breathing 4-4-4-4 x 4 rounds"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-2`, week, phase, "Wednesday", "Strength Foundation", "Movement quality and structural capacity", 45, "moderate", [
        { title: "Strength", items: ["Goblet squat 3x8 RPE 5", "Dumbbell Romanian deadlift 3x8", "Step-up 3x8/side", "Incline push-up 3x8", "Cable row or ring row 3x10"] },
        { title: "HYROX Skill", items: [`Technique practice: ${weakness}`, "10-15 min only", "Stop before form breaks"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-3`, week, phase, "Friday", "Low-Impact Engine", "Aerobic work without pounding", 35, "easy", [
        { title: "Bike/Row/Walk", items: ["30 min Zone 2", "Every 5 min add 30 sec slightly faster", "No breath holding"] },
        { title: "Mobility", items: ["Hips 2 min/side", "Calves 2 min/side", "Ankles 2 min/side", "Thoracic rotation 2x8/side"] }
      ], answers),
      workout(`gen-${week}-4`, week, phase, "Saturday", "Intro HYROX Circuit", "Low-pressure station exposure", 55, "moderate", [
        { title: "Circuit - 3 rounds", items: ["400m walk-jog", "250m row or bike", "10 wall balls or air squats", "20m farmer carry", "Rest 2 min between rounds"] },
        { title: "Finish", items: ["5 min easy walk", "Long exhale breathing", "Write one station note"] }
      ], answers, { goals: baseGoals })
    ],
    beginner: [
      workout(`gen-${week}-1`, week, phase, "Monday", "Aerobic Base + Core", "Running durability and trunk control", 55, "easy", [
        { title: "Run", items: ["35-45 min Zone 2", `Hold ${paces.easy}`, "Finish with 4 x 20 sec relaxed strides"] },
        { title: "Core", items: ["Copenhagen plank 3x20 sec/side", "Dead bugs 3x12", "Pallof press 3x12/side", "Suitcase carry 4x30m"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-2`, week, phase, "Tuesday", "Lower Strength + Skill", "Foundational force production", 65, "moderate", [
        { title: "Strength", items: ["Back squat 4x6 RPE 6-7", "Romanian deadlift 4x8", "Walking lunges 3x20m", "Tibialis raises 3x20"] },
        { title: "Station Skill", items: [`${weakness} technique 15 min`, "Keep reps smooth", "Rest before failure"] }
      ], answers),
      workout(`gen-${week}-3`, week, phase, "Thursday", "Intro Threshold", "Controlled lactate tolerance", 55, "moderate-hard", [
        { title: "Run", items: [`${phase <= 1 ? "4 x 4 min comfortably hard" : "5 x 800m threshold"}`, "2 min easy jog recovery", `Target: ${paces.threshold}`], timer: { mode: "interval", workSeconds: phase <= 1 ? 240 : 300, restSeconds: 120, rounds: phase <= 1 ? 4 : 5 } },
        { title: "Breathing", items: ["Use 3:3 rhythm early", "Shift to 2:2 only when effort rises"] }
      ], answers),
      workout(`gen-${week}-4`, week, phase, "Saturday", "HYROX Skills Circuit", "Station flow and confidence", 70, "moderate-hard", [
        { title: "Circuit - 4 rounds", items: ["800m run", "500m row or SkiErg", "20m farmer carry", "15 wall balls", "Rest 90 sec"] },
        { title: "Transition Practice", items: ["Walk in with purpose", "No standing still", "Start each station controlled"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-5`, week, phase, "Sunday", "Full Rest", "Absorb training", 20, "recovery", [
        { title: "Recovery Only", items: ["Easy walk optional", "Mobility 10 min", "Hydration and meal prep", "No intense training"] }
      ], answers, { warmup: [], cooldown: [] })
    ],
    moderate: [
      workout(`gen-${week}-1`, week, phase, "Monday", "Recovery Engine", "Zone 2, core, and anti-side-stitch work", 70, "easy", [
        { title: "Run", items: ["45-60 min Zone 2", `Target: ${paces.easy}`, "Nasal breathing first 15 min"] },
        { title: "Core", items: ["Copenhagen plank 3x30 sec/side", "Dead bugs 3x12", "Bird dogs 3x10/side", "Side planks 3x45 sec/side"] },
        { title: "Mobility", items: ["Hips", "Thoracic spine", "Ankles", "Calves", "Adductors"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-2`, week, phase, "Tuesday", "Threshold + Lower Strength", "Lactate threshold and force durability", 95, "hard", [
        { title: "Run", items: [`${phase <= 1 ? "5 x 1 km threshold" : phase === 2 ? "3 x 2 km threshold" : "6 x 1 km race pace"}`, "2-3 min jog recovery", `Target: ${paces.threshold}`], timer: { mode: "interval", workSeconds: phase === 2 ? 570 : 285, restSeconds: phase === 2 ? 180 : 120, rounds: phase === 2 ? 3 : phase === 3 ? 6 : 5 } },
        { title: "Strength", items: ["Back squat 4x5-6 RPE 7-8", "Romanian deadlift 4x8", "Bulgarian split squat 3x10/side", "Walking lunges 3x20m", "Tibialis raises 3x20"] }
      ], answers),
      workout(`gen-${week}-3`, week, phase, "Wednesday", "HYROX Engine Session", "Compromised running and station rhythm", 85, "moderate-hard", [
        { title: `${phase <= 1 ? "3" : "4"} rounds`, items: ["1 km run", "500-1000m SkiErg", "25-50m sled push", "25-50m sled pull", "500-1000m row", partnerCue], timer: { mode: "station", rounds: phase <= 1 ? 3 : 4 } },
        { title: "Purpose", items: ["Smooth transitions", "No standing still", "Keep the run controlled after stations"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-4`, week, phase, "Thursday", "Active Recovery + Mobility", "Downshift fatigue", 45, "recovery", [
        { title: "Option", items: ["40 min cycling Zone 1-2", "Or 30-35 min easy run", "Keep breathing fully conversational"] },
        { title: "Reset", items: ["Foam rolling", "Lacrosse ball feet release", "Hip and calf mobility", "Diaphragmatic breathing 5 min"] }
      ], answers),
      workout(`gen-${week}-5`, week, phase, "Friday", "Strength + Compromised Running", "Strength under fatigue", 90, "hard", [
        { title: "Strength", items: ["Trap bar deadlift 4x5", "Bench press 4x6", "Pull-ups 4x8", "Push press 3x8", "Farmer carry 4x40m"] },
        { title: "Compromised Running - 4 rounds", items: ["500m SkiErg", "800m run at HYROX pace", `Station focus: ${weakness}`], timer: { mode: "interval", workSeconds: 420, restSeconds: 90, rounds: 4 } }
      ], answers),
      workout(`gen-${week}-6`, week, phase, "Saturday", phase === 3 ? "90% HYROX Simulation" : "Simulation / Long Hybrid Session", "Race rehearsal, station splits, and pacing", phase === 3 ? 115 : 85, phase === 3 ? "race" : "hard", [
        { title: "Simulation", items: phase === 1 ? ["75 min continuous", "1 km run", "500m row", "20 lunges", "20 wall balls", "200m farmer carry"] : ["1 km run repeats", "SkiErg", "Sled push/pull", "Burpee broad jumps", "Row", "Farmer carry", "Sandbag lunges", "Wall balls", "Record station times and transitions"] },
        { title: "Targets", items: stationTargets.moderate }
      ], answers, { goals: [...baseGoals, ...(doubles ? doublesSplits : ["Solo strategy: never sprint transitions; win by preserving run pace"])] })
    ],
    expert: [
      workout(`gen-${week}-1`, week, phase, "Monday", "Aerobic Reset + Strides", "Absorb load while maintaining speed", 70, "easy", [
        { title: "Run", items: ["50-60 min Zone 2", `Target: ${paces.easy}`, "6 x 20 sec relaxed strides", "Full walk-back recovery"] },
        { title: "Core", items: ["Copenhagen plank 3x40 sec/side", "Pallof press 4x10/side", "Suitcase carry 5x40m"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-2`, week, phase, "Tuesday", "Advanced Threshold", "Race engine and lactate clearance", 100, "hard", [
        { title: "Run", items: [phase <= 1 ? "4 x 1600m threshold" : phase === 2 ? "4 x 2 km threshold" : "3 x 3 km threshold", "2-3 min jog recovery", `Target: ${paces.threshold}`], timer: { mode: "interval", workSeconds: phase === 3 ? 780 : phase === 2 ? 520 : 390, restSeconds: 150, rounds: phase === 3 ? 3 : 4 } },
        { title: "Lower Strength", items: ["Back squat 5x4 RPE 8", "RDL 4x6", "Heavy walking lunge 4x20m", "Sled push technique 6x12.5m"] }
      ], answers),
      workout(`gen-${week}-3`, week, phase, "Wednesday", "HYROX Engine + Transitions", "High-specificity station flow", 90, "hard", [
        { title: "Engine", items: ["5 rounds", "1 km run", "500m SkiErg", "20 burpee broad jumps", "500m row", "Fast but controlled transitions"], timer: { mode: "station", rounds: 5 } },
        { title: "Transition Rehearsal", items: ["Station entry line", "Station exit line", "Breathing cue", "Next run first 200m controlled"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-4`, week, phase, "Thursday", "Second Threshold / VO2", "Advanced speed reserve", 75, "hard", [
        { title: "Run", items: ["6 x 800m at VO2 effort", "2 min jog recovery", `Target: ${paces.vo2}`], timer: { mode: "interval", workSeconds: 190, restSeconds: 120, rounds: 6 } },
        { title: "Flush", items: ["10 min easy jog", "Mobility and diaphragm reset"] }
      ], answers),
      workout(`gen-${week}-5`, week, phase, "Friday", "Heavy Station Efficiency", "Force output without redlining", 90, "hard", [
        { title: "Stations", items: ["Heavy sled push 6 x 12.5m", "Sled pull 6 x 12.5m", "Farmer carry 5 x 40m", "Sandbag lunge 4 x 25m", "Wall balls in planned sets"] },
        { title: "Compromised Finish", items: ["3 rounds: 500m row, 20 wall balls, 400m run"] }
      ], answers),
      workout(`gen-${week}-6`, week, phase, "Saturday", phase >= 3 ? "Full HYROX Simulation" : "Race-Specific Simulation", "Race execution and finish prediction", phase >= 3 ? 120 : 100, "race", [
        { title: "Simulation", items: ["6-8 x 1 km run", "Rotate through SkiErg, sleds, burpees, row, carry, lunges, wall balls", "Record every split and transition", partnerCue] },
        { title: "Targets", items: stationTargets.expert }
      ], answers, { goals: [...baseGoals, ...(doubles ? doublesSplits : ["Solo strategy: hold back through sled pull, attack from farmer carry onward"])] }),
      workout(`gen-${week}-7`, week, phase, "Sunday", "Recovery Only", "Maintain tissue quality", 30, "recovery", [
        { title: "Recovery", items: ["Zone 1 walk or bike only", "Mobility 20 min", "Breathing reset 5 min", "No strength loading"] }
      ], answers, { warmup: [], cooldown: [] })
    ]
  };

  return programs[level];
}

function compressForTrainingDays(workouts: DailyWorkout[], level: TrainingLevel, days: number) {
  const limits: Record<TrainingLevel, [number, number]> = {
    "absolute-beginner": [3, 4],
    beginner: [4, 5],
    moderate: [5, 6],
    expert: [6, 7]
  };
  const [minDays, maxDays] = limits[level];
  const target = Math.min(maxDays, Math.max(minDays, days || minDays));
  return workouts.slice(0, target);
}

function applyWeekModifiers(workouts: DailyWorkout[], level: TrainingLevel, isDeload: boolean, isTaper: boolean) {
  return workouts.map((item) => ({
    ...item,
    durationMinutes: isDeload ? Math.round(item.durationMinutes * 0.65) : isTaper ? Math.round(item.durationMinutes * 0.5) : item.durationMinutes,
    intensity: isTaper ? "moderate" as const : isDeload && ["hard", "race"].includes(item.intensity) ? "moderate" as const : item.intensity,
    blocks: item.blocks.map((block) => ({
      ...block,
      items: [
        ...block.items,
        ...(isDeload ? ["Deload: reduce total volume 35-40%, keep technique crisp"] : []),
        ...(isTaper ? ["Taper: preserve rhythm, stop before fatigue accumulates"] : [])
      ]
    })),
    recovery: [
      ...item.recovery,
      ...(isDeload ? ["Deload priority: sleep, mobility, and low soreness"] : []),
      ...(isTaper ? ["Taper priority: glycogen restoration, hydration, and confidence"] : []),
      ...(level === "expert" ? ["Monitor HRV/resting HR and cut accessories if readiness drops"] : [])
    ]
  }));
}

function weekIntent(level: TrainingLevel, phase: number, isDeload: boolean, isTaper: boolean) {
  if (isTaper) return "Reduce volume, preserve sharpness, dial race-day pacing, hydration, and nutrition.";
  if (isDeload) return "Reduce volume 35-40%, keep movement quality high, and absorb the prior block.";
  const intents = [
    "Build aerobic efficiency, structural resilience, breathing mechanics, and movement quality.",
    "Increase threshold capacity, strength endurance, compromised running, and station skill.",
    "Prioritize race-specific conditioning, simulations, transition speed, and pacing discipline.",
    "Arrive fresh: low soreness, high confidence, full glycogen, and precise race execution."
  ];
  return `${levelLabels[level]} focus: ${intents[phase - 1]}`;
}

export function generateTrainingPlan(answers: OnboardingAnswers): GeneratedTrainingPlan {
  const weeks = Math.min(16, Math.max(4, weeksUntil(answers.goalRaceDate)));
  const level = answers.trainingLevel;
  const generatedWeeks: TrainingWeek[] = Array.from({ length: weeks }, (_, index) => {
    const weekNumber = index + 1;
    const phase = phaseForWeek(weekNumber, weeks);
    const isTaper = phase === 4;
    const isDeload = isDeloadWeek(level, weekNumber, weeks);
    const rawWorkouts = levelSessions(level, weekNumber, phase, answers);
    const workouts = applyWeekModifiers(
      compressForTrainingDays(rawWorkouts, level, answers.availableTrainingDays),
      level,
      isDeload,
      isTaper
    );

    return {
      week: weekNumber,
      phase,
      phaseTitle: isDeload ? `${phaseTitles[phase - 1]} Deload` : phaseTitles[phase - 1],
      dateRange: `Week ${weekNumber} of ${weeks}`,
      intent: weekIntent(level, phase, isDeload, isTaper),
      expectedTrainingLoad: isTaper ? "Low" : isDeload ? "Reduced" : level === "expert" ? "High" : level === "absolute-beginner" ? "Low-moderate" : "Moderate",
      recoveryEmphasis: isTaper
        ? "Sleep 8-9 hours, carb emphasis, mobility, and no soreness chasing."
        : isDeload
          ? "Reduce volume, keep intensity controlled, and prioritize soft-tissue quality."
          : "Fuel hard days, keep easy days easy, protect sleep, and manage stress.",
      workouts
    };
  });

  const range = finishRanges[level];
  const format = answers.raceCategory.includes("doubles") ? "Doubles" : answers.raceCategory.includes("relay") ? "Relay" : "Solo";

  return {
    id: `plan-${level}-${answers.raceCategory}-${answers.goalRaceDate}`,
    title: `${levelLabels[level]} HYROX ${format} Program`,
    level,
    raceCategory: answers.raceCategory,
    goalRaceDate: answers.goalRaceDate,
    targetGoalTime: answers.targetGoalTime,
    weeksUntilRace: weeks,
    summary: [
      `${weeks}-week ${levelLabels[level]} HYROX ${format} build for ${answers.name}.`,
      `Finish time range: conservative ${range.conservative}, realistic ${range.realistic}, stretch ${range.stretch}.`,
      `Plan adapts for ${answers.availableTrainingDays} training days/week, ${answers.weakestStations.join(", ") || "general HYROX development"}, and available equipment.`
    ].join(" "),
    priorities: [
      ...levelPriorities[level],
      `Heart-rate / pace guidance: Zone 2 ${paceGuide(level, answers).easy}; threshold ${paceGuide(level, answers).threshold}; VO2 ${paceGuide(level, answers).vo2}; race pace ${paceGuide(level, answers).race}`,
      `Benchmarks every 2 weeks: 5K or run-walk test, 1000m Ski/Row test, weakest station technique score, and simulation split review`,
      `Station targets: ${stationTargets[level].join("; ")}`,
      ...(format === "Doubles" ? [`Doubles strategy: ${doublesSplits.join("; ")}`] : ["Solo strategy: control the first half, protect running pace, and finish progressively"])
    ],
    phases: phaseTitles,
    weeks: generatedWeeks
  };
}
