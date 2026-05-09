import type {
  Benchmark,
  DailyWorkout,
  DayName,
  RecoveryInput,
  StationSplit,
  StationTarget,
  TrainingWeek
} from "./types.js";

export const race = {
  name: "HYROX Delhi 2026 - Elite Doubles Open",
  date: "2026-07-25",
  trainingStart: "2026-05-08",
  trainingEnd: "2026-07-21",
  athletes: {
    you: "23 yrs, about 4:45/km pace",
    partner: "37 yrs, about 5:10-5:30/km pace"
  },
  goalWindow: "1:12-1:15 aggressive elite amateur target",
  progressionBenchmarks: ["Sub 1:30 = excellent", "Sub 1:24 = very strong", "Sub 1:20 = elite amateur"]
};

export const heartRateZones = [
  {
    name: "Zone 2",
    effort: "65-75% max HR, conversational",
    you: "5:35-6:05/km",
    partner: "6:00-6:40/km"
  },
  {
    name: "Threshold",
    effort: "80-88% max HR, comfortably hard",
    you: "4:20-4:35/km",
    partner: "4:50-5:05/km"
  },
  {
    name: "VO2 Max",
    effort: "90-95% max HR, very difficult",
    you: "3:55-4:10/km",
    partner: "4:20-4:40/km"
  }
];

const commonWarmup = [
  "5-10 min easy jog or machine flush",
  "Leg swings, skips, lunges, high knees",
  "Progressive warmup sets before heavy lifts",
  "Nasal breathing in the first easy block"
];

const commonCooldown = [
  "5-10 min easy jog or walk",
  "Breathing reset with long exhales",
  "Stretch calves, hips, glutes, adductors, and thoracic spine"
];

const commonRecovery = [
  "Hydrate with electrolytes after training",
  "Protein plus fast carbs within 30 min after hard sessions",
  "Mobility flow before bed",
  "No caffeine after 2 pm; target 7.5-9 hours sleep"
];

const commonNutrition = [
  "Training days: 4-7 g/kg carbs",
  "Protein: 1.8-2.2 g/kg",
  "Long sessions: 500-750 ml fluid, 500-900 mg sodium, 30-60 g carbs per hour"
];

function workout(
  id: string,
  week: number,
  phase: number,
  day: DayName,
  title: string,
  focus: string,
  durationMinutes: number,
  intensity: DailyWorkout["intensity"],
  blocks: DailyWorkout["blocks"],
  options: Partial<Omit<DailyWorkout, "id" | "week" | "phase" | "day" | "title" | "focus" | "durationMinutes" | "intensity" | "blocks">> = {}
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
    warmup: options.warmup ?? commonWarmup,
    blocks,
    cooldown: options.cooldown ?? commonCooldown,
    recovery: options.recovery ?? commonRecovery,
    nutrition: options.nutrition ?? commonNutrition,
    goals: options.goals ?? ["Smooth pacing", "No redlining", "Keep transitions intentional"],
    scaling: options.scaling ?? [
      "Reduce volume 20-30% if soreness is high",
      "Partner keeps sustainable effort; you absorb explosive station load",
      "Stop the session if running mechanics degrade"
    ],
    targetPace: options.targetPace,
    targetHeartRate: options.targetHeartRate
  };
}

export const trainingWeeks: TrainingWeek[] = [
  {
    week: 1,
    phase: 1,
    phaseTitle: "Base Engine + Structural Capacity",
    dateRange: "May 8-May 14",
    intent: "Build aerobic base, movement quality, breathing mechanics, and tendon durability.",
    workouts: [
      workout("w1-mon", 1, 1, "Monday", "Aerobic Recovery", "Zone 2, core, mobility", 75, "easy", [
        { title: "Run", items: ["50 min Zone 2 run", "You: 5:35-5:50/km", "Partner: 6:05-6:30/km"] },
        { title: "Core - 3 rounds", items: ["Dead bugs x 12", "Side plank x 30 sec", "Bird dogs x 10", "Suitcase carry x 30m"] },
        { title: "Mobility - 20 min", items: ["Hip openers", "Calves", "Ankles", "Thoracic rotation", "Adductor stretch"] }
      ], {
        targetPace: { you: "5:35-5:50/km", partner: "6:05-6:30/km" },
        targetHeartRate: "Zone 2, conversational"
      }),
      workout("w1-tue", 1, 1, "Tuesday", "Threshold + Lower Strength", "Threshold running and lower-body strength", 110, "hard", [
        { title: "Run", items: ["5 x 1 km threshold", "2 min easy jog recovery", "You: 4:20-4:30/km", "Partner: 4:50-5:00/km"], timer: { mode: "interval", workSeconds: 270, restSeconds: 120, rounds: 5 } },
        { title: "Strength", items: ["Back squat 4x6", "Romanian deadlift 4x8", "Bulgarian split squat 3x10", "Walking lunges 3x20m", "Tibialis raises 3x20"] },
        { title: "Sled Intro", items: ["6 x 12.5m push", "Moderate load", "Focus on mechanics"] }
      ], {
        targetPace: { you: "4:20-4:30/km", partner: "4:50-5:00/km" },
        targetHeartRate: "Threshold, 80-88% max HR"
      }),
      workout("w1-wed", 1, 1, "Wednesday", "HYROX Engine", "Station flow without maximal effort", 90, "moderate-hard", [
        { title: "3 rounds", items: ["1 km run", "1000m SkiErg", "25m sled push", "25m sled pull", "1000m row"], timer: { mode: "station", rounds: 3 } },
        { title: "Intensity", items: ["70% effort", "Smooth transitions", "Breathing control"] }
      ]),
      workout("w1-thu", 1, 1, "Thursday", "Active Recovery", "Flush work, soft tissue, diaphragm reset", 55, "recovery", [
        { title: "Option A", items: ["40 min cycling Zone 1-2"] },
        { title: "Option B", items: ["35 min easy run"] },
        { title: "Recovery Work", items: ["Foam rolling", "Lacrosse ball feet release", "Mobility flow", "Diaphragmatic breathing"] }
      ]),
      workout("w1-fri", 1, 1, "Friday", "Strength + Compromised Running", "Upper/posterior strength and running under fatigue", 100, "hard", [
        { title: "Strength", items: ["Trap bar deadlift 4x5", "Bench press 4x6", "Pull-ups 4x8", "Push press 3x8", "Farmer carry 4x40m"] },
        { title: "Compromised Running - 4 rounds", items: ["500m SkiErg hard", "800m run at HYROX pace"], timer: { mode: "interval", workSeconds: 420, restSeconds: 90, rounds: 4 } }
      ], {
        targetPace: { shared: "Run together at sustainable HYROX race pace" }
      }),
      workout("w1-sat", 1, 1, "Saturday", "Hybrid Endurance", "Low-intensity hybrid capacity", 75, "moderate", [
        { title: "75 min continuous", items: ["1 km run", "500m row", "20 lunges", "20 wall balls", "200m farmer carry", "Repeat at low intensity"] }
      ]),
      workout("w1-sun", 1, 1, "Sunday", "Full Rest", "Mandatory full rest", 20, "recovery", [
        { title: "Allowed", items: ["Stretching", "Hydration", "Easy breathing work"] },
        { title: "Avoid", items: ["Running", "Gym", "Intense walking"] }
      ], {
        warmup: [],
        cooldown: [],
        goals: ["Protect partner recovery", "Absorb the first week of work"],
        scaling: ["If fatigue is high, make this a complete off day with no mobility load"]
      })
    ]
  },
  {
    week: 2,
    phase: 1,
    phaseTitle: "Base Engine + Structural Capacity",
    dateRange: "May 15-May 21",
    intent: "Slight threshold progression plus first benchmark check.",
    workouts: [
      workout("w2-mon", 2, 1, "Monday", "Recovery Engine", "Zone 2 and anti-side-stitch core", 75, "easy", [
        { title: "Run", items: ["45-60 min Zone 2", "Nasal breathing first 15 min"] },
        { title: "Core", items: ["Copenhagen planks", "Dead bugs", "Bird dogs", "Side planks"] },
        { title: "Mobility", items: ["Hips", "Thoracic spine", "Ankles", "Calves", "Adductors"] }
      ], { targetPace: { you: "5:35-6:05/km", partner: "6:00-6:40/km" } }),
      workout("w2-tue", 2, 1, "Tuesday", "Threshold Progression", "6 x 1 km threshold", 95, "hard", [
        { title: "Run", items: ["6 x 1 km threshold", "2 min easy jog recovery", "Hold form on reps 5-6"], timer: { mode: "interval", workSeconds: 285, restSeconds: 120, rounds: 6 } },
        { title: "Strength", items: ["Back squat 4x6", "Romanian deadlift 4x8", "Walking lunges 3x20m", "Step-ups 3x12", "Pallof press"] }
      ], { targetPace: { you: "4:20-4:35/km", partner: "4:50-5:05/km" } }),
      workout("w2-wed", 2, 1, "Wednesday", "Engine + Burpees", "HYROX engine with burpee broad jump conditioning", 90, "moderate-hard", [
        { title: "4 rounds", items: ["1 km run", "500m SkiErg", "20 burpee broad jumps", "500m row"], timer: { mode: "station", rounds: 4 } },
        { title: "Focus", items: ["Land softly", "Keep breathing rhythm", "Transition without standing still"] }
      ]),
      workout("w2-thu", 2, 1, "Thursday", "Active Recovery", "Easy aerobic flush and mobility", 50, "recovery", [
        { title: "Option", items: ["40 min Zone 1-2 bike", "Or 30-40 min easy run"] },
        { title: "Reset", items: ["Foam roll calves and quads", "Diaphragmatic breathing", "Foot and ankle mobility"] }
      ]),
      workout("w2-fri", 2, 1, "Friday", "Compromised Sled Run", "Run after wall balls and sled mechanics", 85, "hard", [
        { title: "5 rounds", items: ["1 km run", "15 wall balls", "15m sled push"], timer: { mode: "interval", workSeconds: 390, restSeconds: 90, rounds: 5 } },
        { title: "Strength Support", items: ["Pull-ups 4x8", "Push press 3x8", "Farmer carry 4x40m"] }
      ]),
      workout("w2-sat", 2, 1, "Saturday", "Benchmark Day", "5 km time trial and SkiErg benchmark", 80, "hard", [
        { title: "Test 1", items: ["5 km time trial", "You target: sub 22 min", "Partner target: sub 25 min"], timer: { mode: "countdown", durationSeconds: 1500 } },
        { title: "Test 2", items: ["1000m SkiErg benchmark", "Record time, stroke rate, and perceived exertion"] },
        { title: "Cool Finish", items: ["15-20 min Zone 1 flush", "Long exhale breathing"] }
      ]),
      workout("w2-sun", 2, 1, "Sunday", "Full Rest", "Mandatory recovery", 20, "recovery", [
        { title: "Recovery Only", items: ["Hydrate", "Stretch", "Sleep 8+ hours", "No training"] }
      ], { warmup: [], cooldown: [] })
    ]
  },
  {
    week: 3,
    phase: 1,
    phaseTitle: "Base Engine + Structural Capacity",
    dateRange: "May 22-May 28",
    intent: "Longer threshold reps, station flow, heavy carries, and half HYROX simulation.",
    workouts: [
      workout("w3-mon", 3, 1, "Monday", "Recovery Engine", "Zone 2 and mobility", 75, "easy", [
        { title: "Run", items: ["45-60 min Zone 2", "Nasal breathing first 15 min"] },
        { title: "Core", items: ["Dead bugs", "Pallof press", "Suitcase carry", "Copenhagen plank"] }
      ]),
      workout("w3-tue", 3, 1, "Tuesday", "Long Threshold Repeats", "4 x 1600m threshold", 100, "hard", [
        { title: "Run", items: ["4 x 1600m threshold", "2-3 min easy jog recovery", "Hold even splits"], timer: { mode: "interval", workSeconds: 435, restSeconds: 150, rounds: 4 } },
        { title: "Strength", items: ["Back squat 4x5", "Romanian deadlift 4x8", "Step-ups 3x12", "Sled push technique 6 x 12.5m"] }
      ], { targetPace: { you: "4:20-4:35/km", partner: "4:50-5:05/km" } }),
      workout("w3-wed", 3, 1, "Wednesday", "HYROX Station Flow", "Run, sleds, burpees, row", 95, "moderate-hard", [
        { title: "4 rounds", items: ["Run", "Sled push", "Sled pull", "Burpees", "Row"], timer: { mode: "station", rounds: 4 } },
        { title: "Focus", items: ["Station entry", "Station exit", "Partner communication before arrival"] }
      ]),
      workout("w3-thu", 3, 1, "Thursday", "Active Recovery", "Bike or easy run plus tissue care", 50, "recovery", [
        { title: "Option", items: ["40 min bike Zone 1-2", "Or 30-40 min easy run"] },
        { title: "Mobility", items: ["Calf work", "Adductors", "Thoracic rotation", "Breathing reset"] }
      ]),
      workout("w3-fri", 3, 1, "Friday", "Heavy Carry + Compromised Run", "Grip, posterior chain, and fatigued running", 90, "hard", [
        { title: "Carries and Drags", items: ["Farmer carry", "Sandbag carry", "Sled drag"] },
        { title: "Run", items: ["2 km compromised run", "Run together without surging"] }
      ]),
      workout("w3-sat", 3, 1, "Saturday", "Half HYROX Simulation", "Four station controlled benchmark", 95, "hard", [
        { title: "Stations", items: ["SkiErg", "Sled push", "Burpee broad jumps", "Row"] },
        { title: "Execution", items: ["Controlled effort", "Record total time", "Record transition delays"] }
      ]),
      workout("w3-sun", 3, 1, "Sunday", "Full Rest", "Mandatory recovery", 20, "recovery", [
        { title: "Recovery Only", items: ["Stretching", "Hydration", "Sleep"] }
      ], { warmup: [], cooldown: [] })
    ]
  },
  {
    week: 4,
    phase: 1,
    phaseTitle: "Base Deload",
    dateRange: "May 29-June 1",
    intent: "Drop volume 40%, intensity 20%, preserve movement quality.",
    workouts: [
      workout("w4-mon", 4, 1, "Monday", "Easy Aerobic Reset", "Reduced Zone 2 and mobility", 50, "easy", [
        { title: "Run", items: ["35-45 min Zone 2", "Keep it conversational"] },
        { title: "Core", items: ["Dead bugs 2x12", "Side plank 2x30 sec", "Bird dogs 2x10"] }
      ]),
      workout("w4-tue", 4, 1, "Tuesday", "Light Threshold Touch", "Low-volume threshold maintenance", 60, "moderate", [
        { title: "Run", items: ["3 x 1 km threshold", "2 min jog recovery", "No maximal efforts"], timer: { mode: "interval", workSeconds: 285, restSeconds: 120, rounds: 3 } },
        { title: "Strength", items: ["Goblet squat 3x8", "RDL 3x8", "Step-ups 2x10", "Light sled mechanics"] }
      ]),
      workout("w4-wed", 4, 1, "Wednesday", "Easy HYROX Flow", "Technique without strain", 55, "moderate", [
        { title: "2-3 rounds", items: ["800m run", "500m SkiErg", "Light sled push", "500m row"], timer: { mode: "station", rounds: 3 } }
      ]),
      workout("w4-thu", 4, 1, "Thursday", "Recovery Day", "Mobility and breath mechanics", 40, "recovery", [
        { title: "Mobility", items: ["Hips", "Calves", "Ankles", "Adductors"] },
        { title: "Breathing", items: ["Crocodile breathing 5 min", "Box breathing 4-4-4-4"] }
      ]),
      workout("w4-fri", 4, 1, "Friday", "Light Strength + Strides", "Maintain sharpness", 55, "moderate", [
        { title: "Strength", items: ["Trap bar deadlift 3x3 light", "Pull-ups 3x6", "Farmer carry 3x30m"] },
        { title: "Run", items: ["4 x 20 sec relaxed strides", "Full walk-back recovery"] }
      ]),
      workout("w4-sat", 4, 1, "Saturday", "Easy Hybrid Aerobic", "Deload hybrid session only", 60, "easy", [
        { title: "Continuous Flow", items: ["Easy run", "Row", "Ski", "Carries", "Mobility breaks"] }
      ]),
      workout("w4-sun", 4, 1, "Sunday", "Full Rest", "Complete rest", 20, "recovery", [
        { title: "Recovery Only", items: ["No maximal efforts", "Sleep", "Hydration"] }
      ], { warmup: [], cooldown: [] })
    ]
  },
  {
    week: 5,
    phase: 2,
    phaseTitle: "Build Phase",
    dateRange: "June 2-June 8",
    intent: "Introduce more race-specific compromised intervals and 50% simulation.",
    workouts: [
      workout("w5-mon", 5, 2, "Monday", "Recovery + Zone 2", "Aerobic base maintenance", 70, "easy", [
        { title: "Run", items: ["45-60 min Zone 2", "Keep cadence smooth"] },
        { title: "Core", items: ["Dead bugs", "Pallof press", "Copenhagen plank", "Suitcase carry"] }
      ]),
      workout("w5-tue", 5, 2, "Tuesday", "Threshold Progression", "3 x 2 km threshold", 95, "hard", [
        { title: "Run", items: ["3 x 2 km threshold", "3 min easy jog recovery"], timer: { mode: "interval", workSeconds: 570, restSeconds: 180, rounds: 3 } },
        { title: "Strength", items: ["Back squat 4x5", "RDL 4x6", "Walking lunges 3x20m", "Sled push technique"] }
      ], { targetPace: { you: "4:20-4:35/km", partner: "4:50-5:05/km" } }),
      workout("w5-wed", 5, 2, "Wednesday", "Race-Specific Engine", "Run, sleds, and burpees", 95, "hard", [
        { title: "4 rounds", items: ["1 km run", "50m sled push", "50m sled pull", "20 burpee broad jumps"], timer: { mode: "station", rounds: 4 } },
        { title: "Goal", items: ["Maintain running pace after stations", "Communicate split before every station"] }
      ]),
      workout("w5-thu", 5, 2, "Thursday", "Active Recovery", "Low stress movement", 45, "recovery", [
        { title: "Option", items: ["40 min bike Zone 1-2", "Or 30 min easy run"] },
        { title: "Reset", items: ["Foam roll", "Calf work", "Diaphragm expansion breathing"] }
      ]),
      workout("w5-fri", 5, 2, "Friday", "Wall Ball Density + Race Pace", "Wall ball tolerance and fast finish", 65, "hard", [
        { title: "Wall Ball EMOM", items: ["EMOM 12 min", "12 wall balls/min", "Never hit failure"], timer: { mode: "emom", durationSeconds: 720, rounds: 12 } },
        { title: "Run", items: ["1 km race pace run immediately after"] }
      ]),
      workout("w5-sat", 5, 2, "Saturday", "50% HYROX Simulation", "Controlled doubles rehearsal", 90, "hard", [
        { title: "Simulation", items: ["50% race volume", "Use prescribed station splits", "Track transitions"] },
        { title: "Target", items: ["Smooth pacing", "No standing still", "Leave 1-2 reps in reserve"] }
      ]),
      workout("w5-sun", 5, 2, "Sunday", "Full Rest", "Protect recovery", 20, "recovery", [
        { title: "Recovery Only", items: ["Stretch", "Hydrate", "Sleep"] }
      ], { warmup: [], cooldown: [] })
    ]
  },
  {
    week: 6,
    phase: 2,
    phaseTitle: "Build Phase",
    dateRange: "June 9-June 15",
    intent: "VO2 work, burpee conditioning, lunge progression, and 70% simulation.",
    workouts: [
      workout("w6-mon", 6, 2, "Monday", "Recovery Engine", "Zone 2 and mobility", 65, "easy", [
        { title: "Run", items: ["45 min Zone 2", "Finish fresher than you started"] },
        { title: "Mobility", items: ["Hips", "Ankles", "Calves", "Adductors"] }
      ]),
      workout("w6-tue", 6, 2, "Tuesday", "VO2 Session", "6 x 800m", 85, "hard", [
        { title: "Run", items: ["6 x 800m", "2 min easy jog recovery", "You: 3:55-4:05/km", "Partner: 4:25-4:40/km"], timer: { mode: "interval", workSeconds: 195, restSeconds: 120, rounds: 6 } },
        { title: "Strength", items: ["Squat 3x5", "RDL 3x8", "Step-ups 3x10", "Pallof press"] }
      ], { targetPace: { you: "3:55-4:05/km", partner: "4:25-4:40/km" }, targetHeartRate: "VO2 Max, 90-95%" }),
      workout("w6-wed", 6, 2, "Wednesday", "Burpee Conditioning", "80m total repeat efforts", 75, "moderate-hard", [
        { title: "Burpee Volume", items: ["80m total burpee broad jumps", "Break into repeat efforts", "Keep landing quiet"] },
        { title: "Support Flow", items: ["1 km run", "500m SkiErg", "500m row", "Repeat as easy/moderate flow"] }
      ]),
      workout("w6-thu", 6, 2, "Thursday", "Active Recovery", "Easy movement and breath", 45, "recovery", [
        { title: "Option", items: ["40 min cycling", "Or 30 min easy run"] },
        { title: "Breathing", items: ["Crocodile breathing 5 min", "Box breathing 4-4-4-4"] }
      ]),
      workout("w6-fri", 6, 2, "Friday", "Lunge Progression", "100m total lunges in broken sets", 70, "hard", [
        { title: "Lunges", items: ["100m total", "Broken sets", "Switch every 20m in doubles practice"] },
        { title: "Compromised Finish", items: ["3 rounds: 500m row, 20 wall balls, 400m run"] }
      ]),
      workout("w6-sat", 6, 2, "Saturday", "70% Simulation", "Longer race rehearsal", 105, "hard", [
        { title: "Simulation", items: ["70% HYROX volume", "Record station times", "Record transition total"] },
        { title: "Goal", items: ["Partner never redlines before lunges", "Run together always"] }
      ]),
      workout("w6-sun", 6, 2, "Sunday", "Full Rest", "Recovery day", 20, "recovery", [
        { title: "Recovery Only", items: ["No training", "Hydration", "Sleep"] }
      ], { warmup: [], cooldown: [] })
    ]
  },
  {
    week: 7,
    phase: 2,
    phaseTitle: "Build Phase",
    dateRange: "June 16-June 22",
    intent: "Heavy race-specific week with sled specialization and full simulation.",
    workouts: [
      workout("w7-mon", 7, 2, "Monday", "Recovery + Mobility", "Easy aerobic reset", 65, "easy", [
        { title: "Run", items: ["45-55 min Zone 2"] },
        { title: "Core", items: ["Dead bugs", "Pallof press", "Suitcase carry", "Hanging knee raises"] }
      ]),
      workout("w7-tue", 7, 2, "Tuesday", "Threshold Progression", "4 x 2 km threshold", 105, "hard", [
        { title: "Run", items: ["4 x 2 km threshold", "3 min easy jog recovery"], timer: { mode: "interval", workSeconds: 570, restSeconds: 180, rounds: 4 } },
        { title: "Strength", items: ["Back squat 4x4", "RDL 4x6", "Walking lunges 3x20m"] }
      ], { targetPace: { you: "4:20-4:35/km", partner: "4:50-5:05/km" } }),
      workout("w7-wed", 7, 2, "Wednesday", "Sled Specialization", "Heavy pushes and pulls", 80, "hard", [
        { title: "Sled Push", items: ["Heavy pushes", "Short repeat efforts", "You take 65-70% workload"] },
        { title: "Sled Pull", items: ["Heavy pulls", "Smooth rope rhythm", "Partner avoids redlining"] },
        { title: "Run Link", items: ["Easy 800m after every sled block"] }
      ]),
      workout("w7-thu", 7, 2, "Thursday", "Active Recovery", "Flush and mobility", 45, "recovery", [
        { title: "Flush", items: ["30-40 min easy bike or run"] },
        { title: "Mobility", items: ["Calves", "Hips", "Thoracic spine", "Diaphragm work"] }
      ]),
      workout("w7-fri", 7, 2, "Friday", "Full Compromised Intervals", "Run, row, wall balls", 85, "hard", [
        { title: "5 rounds", items: ["1 km run", "500m row", "20 wall balls", "200m fast run"], timer: { mode: "interval", workSeconds: 480, restSeconds: 90, rounds: 5 } },
        { title: "Goal", items: ["Minimal rest", "Fast small wall ball sets", "Never failure"] }
      ]),
      workout("w7-sat", 7, 2, "Saturday", "Full HYROX Simulation", "Full doubles simulation, not maximal", 115, "race", [
        { title: "Simulation", items: ["Full HYROX doubles format", "Use exact split plan", "Record station and transition times"] },
        { title: "Target", items: ["80-88 min", "Not maximal", "Smooth pacing and communication"] }
      ]),
      workout("w7-sun", 7, 2, "Sunday", "Full Rest", "Mandatory rest after full simulation", 20, "recovery", [
        { title: "Recovery Only", items: ["No run", "No gym", "Hydration", "Legs elevated"] }
      ], { warmup: [], cooldown: [] })
    ]
  },
  {
    week: 8,
    phase: 2,
    phaseTitle: "Build Deload",
    dateRange: "June 23-June 29",
    intent: "Reduce volume 40% and intensity 20%; maintain speed touch and quality.",
    workouts: [
      workout("w8-mon", 8, 2, "Monday", "Easy Zone 2", "Deload aerobic", 50, "easy", [
        { title: "Run", items: ["35-45 min Zone 2", "Finish with mobility"] }
      ]),
      workout("w8-tue", 8, 2, "Tuesday", "Light Threshold", "Speed touch without fatigue", 55, "moderate", [
        { title: "Run", items: ["3 x 1 km threshold", "2 min jog recovery"], timer: { mode: "interval", workSeconds: 285, restSeconds: 120, rounds: 3 } },
        { title: "Strength", items: ["Light lower body", "Movement quality only"] }
      ]),
      workout("w8-wed", 8, 2, "Wednesday", "Easy Stations", "Technique and transitions", 55, "moderate", [
        { title: "Flow", items: ["Easy SkiErg", "Easy row", "Light wall balls", "Easy sled technique"] }
      ]),
      workout("w8-thu", 8, 2, "Thursday", "Mobility + Recovery", "No hard work", 35, "recovery", [
        { title: "Recovery", items: ["Foam rolling", "Breathing drills", "Easy walk optional"] }
      ]),
      workout("w8-fri", 8, 2, "Friday", "Short Sharp Primer", "Light strength and relaxed strides", 45, "moderate", [
        { title: "Strength", items: ["Pull-ups 3x6", "Push press 2x6", "Farmer carry 3x30m"] },
        { title: "Run", items: ["4 x 20 sec strides"] }
      ]),
      workout("w8-sat", 8, 2, "Saturday", "Deload Hybrid Aerobic", "Avoid heavy sleds and maximal intervals", 60, "easy", [
        { title: "Flow", items: ["Run", "Row", "Ski", "Carries", "Burpees low intensity"] }
      ]),
      workout("w8-sun", 8, 2, "Sunday", "Full Rest", "Absorb build phase", 20, "recovery", [
        { title: "Recovery Only", items: ["Sleep", "Hydration", "Mobility optional"] }
      ], { warmup: [], cooldown: [] })
    ]
  },
  {
    week: 9,
    phase: 3,
    phaseTitle: "Peak HYROX Specificity",
    dateRange: "June 30-July 6",
    intent: "Race pace locking, transitions, fatigue resistance, doubles communication.",
    workouts: [
      workout("w9-mon", 9, 3, "Monday", "Recovery + Mobility", "Keep nervous system fresh", 55, "easy", [
        { title: "Run", items: ["40-50 min Zone 2"] },
        { title: "Core", items: ["Dead bugs", "Pallof press", "Copenhagen plank"] }
      ]),
      workout("w9-tue", 9, 3, "Tuesday", "Race Pace Intervals", "6 x 1 km", 85, "hard", [
        { title: "Run", items: ["6 x 1 km at race/threshold blend", "2 min easy jog recovery"], timer: { mode: "interval", workSeconds: 300, restSeconds: 120, rounds: 6 } },
        { title: "Cue", items: ["No surging", "Practice running at partner sustainable pace"] }
      ], { targetPace: { shared: "5:00-5:20/km for race execution blocks" } }),
      workout("w9-wed", 9, 3, "Wednesday", "HYROX Transitions", "Station entry, exit, and communication", 75, "moderate-hard", [
        { title: "Practice", items: ["Station entry", "Station exit", "Pacing communication before arrival", "Walk directly to next station"] },
        { title: "Flow", items: ["Run to station", "Split workload", "Exit immediately", "Repeat"] }
      ]),
      workout("w9-thu", 9, 3, "Thursday", "Recovery Day", "Easy flush", 40, "recovery", [
        { title: "Option", items: ["30 min easy bike", "Or mobility-only if fatigue is high"] }
      ]),
      workout("w9-fri", 9, 3, "Friday", "Wall Ball Fatigue Protocol", "100 wall balls under fatigue", 75, "hard", [
        { title: "Primer", items: ["1 km run", "500m row"] },
        { title: "Wall Balls", items: ["100 total under fatigue", "Use small fast sets: 15/10", "Never failure"] },
        { title: "Finish", items: ["800m controlled run"] }
      ]),
      workout("w9-sat", 9, 3, "Saturday", "90% Simulation", "Most important race rehearsal", 115, "race", [
        { title: "Simulation", items: ["90-95% race simulation", "Full doubles format", "Exact transitions", "Exact pacing"] },
        { title: "Target", items: ["80-85 min", "Do not race all-out", "No redlining"] }
      ]),
      workout("w9-sun", 9, 3, "Sunday", "Full Rest", "Post-simulation recovery", 20, "recovery", [
        { title: "Recovery Only", items: ["Protein plus carbs", "Sodium", "Legs elevated", "Sleep"] }
      ], { warmup: [], cooldown: [] })
    ]
  },
  {
    week: 10,
    phase: 3,
    phaseTitle: "Peak HYROX Specificity",
    dateRange: "July 7-July 13",
    intent: "Final hard week: controlled threshold, sled/run repeats, sharp intervals, half simulation.",
    workouts: [
      workout("w10-mon", 10, 3, "Monday", "Recovery Engine", "Easy Zone 2", 50, "easy", [
        { title: "Run", items: ["40-50 min Zone 2", "Mobility after"] }
      ]),
      workout("w10-tue", 10, 3, "Tuesday", "3 x 3 km Threshold", "Final big threshold stimulus", 105, "hard", [
        { title: "Run", items: ["3 x 3 km threshold", "4 min easy jog recovery", "Keep every rep controlled"], timer: { mode: "interval", workSeconds: 855, restSeconds: 240, rounds: 3 } }
      ], { targetPace: { you: "4:20-4:35/km", partner: "4:50-5:05/km" } }),
      workout("w10-wed", 10, 3, "Wednesday", "Sled + Run Repeats", "Race fatigue tolerance", 80, "hard", [
        { title: "Repeats", items: ["1 km run", "Sled push", "Sled pull", "800m run", "Repeat controlled"] },
        { title: "Cue", items: ["Keep form under fatigue", "Partner sustainable output"] }
      ]),
      workout("w10-thu", 10, 3, "Thursday", "Active Recovery", "Downshift fatigue", 40, "recovery", [
        { title: "Flush", items: ["Easy bike or walk", "Mobility", "Breathing reset"] }
      ]),
      workout("w10-fri", 10, 3, "Friday", "Short Sharp HYROX Intervals", "Final hard controlled station dose", 60, "hard", [
        { title: "3 rounds", items: ["1 km run", "Sled push", "Sled pull", "Burpee broad jumps", "Row", "Lunges"], timer: { mode: "station", rounds: 3 } },
        { title: "Intensity", items: ["Hard but controlled", "No soreness chasing"] }
      ]),
      workout("w10-sat", 10, 3, "Saturday", "Final Half Simulation", "Confidence rehearsal", 85, "moderate-hard", [
        { title: "Simulation", items: ["Half HYROX volume", "Race pace discipline", "Transitions exact"] },
        { title: "Target", items: ["Finish feeling sharp", "No all-out finish"] }
      ]),
      workout("w10-sun", 10, 3, "Sunday", "Full Rest", "Start absorbing peak work", 20, "recovery", [
        { title: "Recovery Only", items: ["Hydration", "Sleep", "Light mobility optional"] }
      ], { warmup: [], cooldown: [] })
    ]
  },
  {
    week: 11,
    phase: 4,
    phaseTitle: "Taper + Race Week",
    dateRange: "July 14-July 25",
    intent: "Reduce fatigue, maintain sharpness, supercompensate glycogen, arrive fresh.",
    workouts: [
      workout("w11-mon", 11, 4, "Monday", "Easy Zone 2", "Freshness maintenance", 45, "easy", [
        { title: "Run", items: ["Easy Zone 2", "Keep it relaxed"] },
        { title: "Mobility", items: ["Hips", "Calves", "Thoracic spine"] }
      ]),
      workout("w11-tue", 11, 4, "Tuesday", "Sharp Race Pace Session", "Short intensity only", 45, "moderate", [
        { title: "Run", items: ["4 x 400m race pace", "Full easy recovery"], timer: { mode: "interval", workSeconds: 110, restSeconds: 120, rounds: 4 } },
        { title: "Light Stations", items: ["Light SkiErg", "Wall balls technique", "No soreness"] }
      ]),
      workout("w11-wed", 11, 4, "Wednesday", "Recovery Only", "Mobility and breathing", 30, "recovery", [
        { title: "Recovery", items: ["Mobility only", "Crocodile breathing", "Box breathing"] }
      ]),
      workout("w11-thu", 11, 4, "Thursday", "Very Light Movement", "Keep body awake", 30, "easy", [
        { title: "Movement", items: ["Light Ski", "Light row", "Easy mobility"] }
      ]),
      workout("w11-fri", 11, 4, "Friday", "Shakeout", "Race readiness", 25, "easy", [
        { title: "Shakeout", items: ["15-20 min easy", "Strides", "Mobility", "Breathing drills"] }
      ]),
      workout("w11-sat", 11, 4, "Saturday", "Race Day", "HYROX Delhi execution", 90, "race", [
        { title: "Execution", items: ["Controlled start", "Smooth transitions", "Run together", "Protect partner recovery", "Empty tank progressively in final 2 km"] },
        { title: "Race Pace", items: ["First 4 km: 5:00-5:10/km", "Middle: 5:05-5:20/km", "Final 2 km: build gradually"] }
      ], {
        nutrition: [
          "48 hours out: 8-10 g/kg carbs",
          "Increase sodium, potassium, and fluids",
          "Race morning: low fat carbs plus electrolytes"
        ],
        recovery: ["Post-race cooldown walk", "Hydrate", "Protein plus carbs", "Celebrate and record notes"]
      }),
      workout("w11-sun", 11, 4, "Sunday", "Post-Race Recovery", "Restore and debrief", 25, "recovery", [
        { title: "Recovery", items: ["Easy walk", "Mobility", "Record station notes", "No training pressure"] }
      ], { warmup: [], cooldown: [] })
    ]
  }
];

export const stationSplits: StationSplit[] = [
  { station: "SkiErg", you: "60%", partner: "40%", coachingCue: "You absorb the larger pull volume; partner keeps breathing under control." },
  { station: "Sled Push", you: "65-70%", partner: "30-35%", coachingCue: "You take explosive load; partner avoids a redline spike." },
  { station: "Sled Pull", you: "60%", partner: "40%", coachingCue: "Smooth rope rhythm beats panic pulling." },
  { station: "Burpee Broad Jumps", you: "Alternate every 10 reps", partner: "Alternate every 10 reps", coachingCue: "Short swaps keep movement crisp." },
  { station: "Row", you: "45%", partner: "55%", coachingCue: "Partner can take slightly more because damage cost is lower than sleds." },
  { station: "Farmer Carry", you: "65%", partner: "35%", coachingCue: "Grip discipline; no wasted drops." },
  { station: "Lunges", you: "Alternate every 20m", partner: "Alternate every 20m", coachingCue: "Stable reps, no rushed no-reps." },
  { station: "Wall Balls", you: "55-60%", partner: "40-45%", coachingCue: "Use small fast sets such as 15/10 and never hit failure." }
];

export const stationTargets: StationTarget[] = [
  { station: "SkiErg", target: "4:00-4:30" },
  { station: "Sled Push", target: "2:30-3:00" },
  { station: "Sled Pull", target: "3:00-3:30" },
  { station: "Burpees", target: "3:30-4:15" },
  { station: "Row", target: "4:00-4:30" },
  { station: "Farmer Carry", target: "1:45-2:15" },
  { station: "Lunges", target: "3:30-4:00" },
  { station: "Wall Balls", target: "3:30-4:30" },
  { station: "Transitions total", target: "Under 3:00" },
  { station: "Running total", target: "39:00-41:00" }
];

export const benchmarks: Benchmark[] = [
  { week: 2, title: "5 km time trial + 1000m SkiErg", targets: ["You: sub 22 min", "Partner: sub 25 min", "Record 1000m SkiErg time"] },
  { week: 4, title: "Half simulation benchmark", targets: ["Controlled effort", "Record transitions"] },
  { week: 6, title: "Threshold progression check", targets: ["3 x 2 km pace consistency", "No late fade"] },
  { week: 8, title: "70% simulation readiness", targets: ["Smooth pacing", "Station communication"] },
  { week: 10, title: "Full simulation readiness", targets: ["Race specificity", "No redlining"] }
];

export const nutritionRules = {
  daily: ["35-45 ml/kg water", "3-5 g sodium/day depending on sweat rate", "Protein 1.8-2.2 g/kg"],
  training: ["500-750 ml fluid/hour", "500-900 mg sodium/hour", "30-60 g carbs/hour"],
  carbs: ["Training days: 4-7 g/kg", "Heavy simulation days: 7-9 g/kg", "Two days pre-race: 8-10 g/kg"],
  preWorkout: ["60-90 min pre-workout", "Carbs", "Low fat", "Moderate sodium", "Example: banana, oats, honey, electrolytes"],
  postWorkout: ["Within 30 min", "Protein", "Fast carbs", "Sodium"],
  carbLoad: ["48 hours before race", "Reduce fiber", "Avoid excessive fats and spicy foods"]
};

export const breathingProtocol = [
  "Crocodile breathing - 5 min",
  "Box breathing - 4-4-4-4",
  "Diaphragm expansion with band around ribs",
  "Nasal-only warmup jog",
  "Use 3:3 rhythm early and 2:2 rhythm during hard efforts",
  "Exhale fully every few breaths"
];

export const weeklyStructure = [
  { day: "Monday", focus: "Zone 2 + Recovery + Mobility", intensity: "Easy" },
  { day: "Tuesday", focus: "Threshold Running + Lower Strength", intensity: "Hard" },
  { day: "Wednesday", focus: "HYROX Engine Session", intensity: "Moderate-Hard" },
  { day: "Thursday", focus: "Active Recovery + Mobility", intensity: "Easy" },
  { day: "Friday", focus: "Strength + Compromised Running", intensity: "Hard" },
  { day: "Saturday", focus: "Simulation / Long Hybrid Session", intensity: "Hard" },
  { day: "Sunday", focus: "Full Rest", intensity: "Recovery" }
];

export const allWorkouts = trainingWeeks.flatMap((week) => week.workouts);

export function getWorkoutById(id: string) {
  return allWorkouts.find((workout) => workout.id === id);
}

export function getWeek(weekNumber: number) {
  return trainingWeeks.find((week) => week.week === weekNumber) ?? trainingWeeks[0];
}

export function getDayName(date: Date): DayName {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()] as DayName;
}

function parseDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

export function daysUntilRace(now = new Date()) {
  const raceDate = parseDate(race.date);
  const ms = raceDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}

export function currentProgramWeek(now = new Date()) {
  const start = parseDate(race.trainingStart);
  const diff = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86400000));
  return Math.min(11, Math.floor(diff / 7) + 1);
}

export function getTodaysWorkout(now = new Date()) {
  const week = getWeek(currentProgramWeek(now));
  const dayName = getDayName(now);
  return week.workouts.find((workout) => workout.day === dayName) ?? week.workouts[0];
}

export function phaseProgress(now = new Date()) {
  const week = currentProgramWeek(now);
  const completedWeeks = week - 1;
  return Math.round((completedWeeks / trainingWeeks.length) * 100);
}

export function calculateRecoveryScore(input: RecoveryInput) {
  const sleepScore = Math.min(100, (input.sleepHours / 8) * 100);
  const hydrationScore = Math.max(0, Math.min(100, input.hydrationPercent));
  const sorenessScore = Math.max(0, 100 - input.soreness * 10);
  const fatigueScore = Math.max(0, 100 - input.fatigue * 10);
  const stressScore = input.stress == null ? 80 : Math.max(0, 100 - input.stress * 10);
  const hrvScore = input.hrv == null ? 75 : Math.max(0, Math.min(100, input.hrv));
  return Math.round((sleepScore * 0.25) + (hydrationScore * 0.2) + (sorenessScore * 0.2) + (fatigueScore * 0.2) + (stressScore * 0.1) + (hrvScore * 0.05));
}

export function recoveryLabel(score: number) {
  if (score >= 75) return { label: "Ready", tone: "green" as const };
  if (score >= 55) return { label: "Moderate", tone: "yellow" as const };
  return { label: "Recover", tone: "red" as const };
}
