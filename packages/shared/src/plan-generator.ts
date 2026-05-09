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

const stationRotation = [
  "SkiErg",
  "Sled Push",
  "Sled Pull",
  "Burpee Broad Jumps",
  "Row",
  "Farmer Carry",
  "Sandbag Lunges",
  "Wall Balls"
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

function phaseWeekNumber(week: number, totalWeeks: number) {
  const phase = phaseForWeek(week, totalWeeks);
  let count = 0;
  for (let currentWeek = 1; currentWeek <= week; currentWeek += 1) {
    if (phaseForWeek(currentWeek, totalWeeks) === phase) count += 1;
  }
  return count;
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

function buildStep(week: number) {
  const cycle = ((week - 1) % 4) + 1;
  return cycle === 4 ? 2 : cycle;
}

function stationFocus(answers: OnboardingAnswers, week: number) {
  const selected = answers.weakestStations.length ? answers.weakestStations : stationRotation;
  return selected[(week - 1) % selected.length] ?? stationRotation[(week - 1) % stationRotation.length];
}

function secondaryStation(answers: OnboardingAnswers, week: number) {
  return stationRotation[(week + 2) % stationRotation.length];
}

function progressionNote(week: number, phase: number) {
  const step = buildStep(week);
  if (phase === 4) return "Taper progression: reduce fatigue while preserving movement rhythm";
  if (week % 4 === 0) return "Deload progression: lower volume, cleaner reps, no maximal efforts";
  if (phase === 1) return `Base progression: week ${step} adds controlled aerobic and strength capacity`;
  if (phase === 2) return `Build progression: week ${step} increases threshold volume and compromised running density`;
  return `Peak progression: week ${step} raises race specificity, transition precision, and simulation demand`;
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

function levelScale(level: TrainingLevel, phase: number) {
  const table: Record<TrainingLevel, { run: string; reps: string; load: string; cap: string; rounds: number; intensity: DailyWorkout["intensity"] }> = {
    "absolute-beginner": {
      run: phase <= 1 ? "walk-jog" : "easy jog",
      reps: "35-50%",
      load: "bodyweight or very light dumbbells",
      cap: "35-40 min",
      rounds: phase >= 3 ? 2 : 1,
      intensity: "moderate"
    },
    beginner: {
      run: "controlled run",
      reps: "60-75%",
      load: "light-moderate loads",
      cap: "40-45 min",
      rounds: phase >= 2 ? 2 : 1,
      intensity: "moderate-hard"
    },
    moderate: {
      run: "HYROX effort",
      reps: "85-100%",
      load: "race-practice loads where technique stays clean",
      cap: "45-55 min",
      rounds: phase >= 2 ? 3 : 2,
      intensity: phase >= 3 ? "race" : "hard"
    },
    expert: {
      run: "race pace or slightly faster",
      reps: "100-115%",
      load: "race loads or slightly heavy",
      cap: "strict race cap",
      rounds: phase >= 2 ? 3 : 2,
      intensity: "race"
    }
  };
  return table[level];
}

function benchmarkModifier(level: TrainingLevel, week: number, phase: number) {
  const step = buildStep(week);
  const scale = levelScale(level, phase);
  return {
    step,
    scale,
    note: [
      `Level scaling: ${levelLabels[level]} uses ${scale.reps} of the benchmark volume with ${scale.load}.`,
      `Coach rationale: ${phaseCoachingRationale(phase)}`,
      `Week ${week} progression: ${phase === 4 ? "tapered rehearsal" : week % 4 === 0 ? "deload technique version" : `density step ${step}`}.`,
      "Score the session: total time, run quality after stations, breathing control, and notes for the next progression."
    ]
  };
}

function phaseCoachingRationale(phase: number) {
  if (phase === 1) {
    return "base phase builds repeatable mechanics, aerobic durability, trunk control, and station confidence before chasing intensity";
  }
  if (phase === 2) {
    return "build phase increases threshold exposure, station density, and compromised running while preserving repeatable pacing";
  }
  if (phase === 3) {
    return "peak phase prioritizes race-order simulations, transition discipline, doubles execution, and finish-time prediction";
  }
  return "taper phase lowers fatigue, keeps neuromuscular sharpness, and rehearses rhythm without creating soreness";
}

function benchmarkTitle(title: string, week: number) {
  return `${title} - Week ${week}`;
}

function runSquatBurpeeLadder(level: TrainingLevel, week: number, phase: number, answers: OnboardingAnswers, goals: string[]) {
  const { step, scale, note } = benchmarkModifier(level, week, phase);
  const beginnerRun = level === "absolute-beginner" ? "400m walk-jog / 200m walk-jog / 100m walk-jog" : "600m / 300m / 150m";
  const runSet = level === "expert" ? "800m / 400m / 200m at aggressive controlled pace" : level === "moderate" ? "800m / 400m / 200m at HYROX effort" : beginnerRun;
  const squatSet = level === "absolute-beginner" ? "20 / 12 / 8 air squats" : level === "beginner" ? "35 / 18 / 10 squats" : level === "moderate" ? "50 / 25 / 10 squats" : "50 / 30 / 15 squats, last set tempo controlled";
  const burpeeSet = level === "absolute-beginner" ? "4 / 8 / 12 step-back burpees" : level === "beginner" ? "8 / 15 / 25 burpees" : level === "moderate" ? "10 / 25 / 50 burpees" : "12 / 30 / 55 burpees or burpee broad jump finish";

  return workout(`bench-${week}-jour199`, week, phase, "Saturday", benchmarkTitle("Run-Squat-Burpee Ladder", week), "Bodyweight durability, breathing under fatigue, and side-stitch control", 45 + step * 5, scale.intensity, [
    { title: `Benchmark Ladder - ${scale.rounds} round${scale.rounds > 1 ? "s" : ""}`, items: [`Run sequence: ${runSet}`, `Squat sequence: ${squatSet}`, `Burpee sequence: ${burpeeSet}`, `Time cap: ${scale.cap}`, "Do not sprint the first run; the workout is won by breathing control late"], timer: { mode: "countdown", durationSeconds: level === "expert" ? 2400 : 2700 } },
    { title: "Coaching Purpose", items: ["Develop leg endurance without equipment dependence", "Practice rib-cage control before burpees", "Build confidence when breathing is already elevated", ...note] }
  ], answers, { goals });
}

function hyroxConditioningStations(level: TrainingLevel, week: number, phase: number, answers: OnboardingAnswers, goals: string[], weakness: string, partnerCue: string) {
  const { step, scale, note } = benchmarkModifier(level, week, phase);
  const run = level === "absolute-beginner" ? `${350 + step * 50}m walk-jog` : level === "beginner" ? `${500 + step * 50}m run` : `${650 + step * 50}m run`;
  const wallBall = level === "absolute-beginner" ? "12 wall balls or goblet squats" : level === "beginner" ? "18-22 wall balls" : "25 wall balls";
  const lunge = level === "absolute-beginner" ? "16 walking lunges bodyweight" : level === "beginner" ? "24 walking lunges light" : "30 walking lunges loaded";
  const carry = level === "absolute-beginner" ? "40m farmer carry" : level === "beginner" ? "70m farmer carry" : "100m farmer carry";
  const skiRow = level === "absolute-beginner" ? "200m ski/row or bike" : level === "beginner" ? "300m ski/row" : "400m ski/row";
  const sled = level === "absolute-beginner" ? "10 min sled technique or incline treadmill push" : level === "beginner" ? "25m sled push + 25m sled pull" : "50m sled push + 50m sled pull";

  return workout(`bench-${week}-stations`, week, phase, "Saturday", benchmarkTitle("HYROX Conditioning Stations", week), "Progression-week station flow and compromised running", 60 + step * 8, scale.intensity, [
    { title: `Station Circuit - ${scale.rounds} rounds`, items: [`Station 1: ${run}, ${wallBall}, ${level === "absolute-beginner" ? "8 burpee step-overs" : "15 burpee over plate or box"}`, `Station 2: ${run}, ${lunge}, ${carry}`, `Station 3: ${run}, ${skiRow}, ${level === "absolute-beginner" ? "12 squat jumps or air squats" : "30 jump squats"}`, `Station 4: ${run}, ${sled}`, `Primary weakness emphasis: ${weakness}`, partnerCue], timer: { mode: "station", rounds: scale.rounds } },
    { title: "Coaching Purpose", items: ["Practice station entry while heart rate is elevated", "Keep run pace repeatable across all stations", "Use planned breathing before sled and wall balls", ...note] }
  ], answers, { goals });
}

function allEnginesNoBrakes(level: TrainingLevel, week: number, phase: number, answers: OnboardingAnswers, goals: string[]) {
  const { step, scale, note } = benchmarkModifier(level, week, phase);
  const engineWindow = level === "absolute-beginner" ? "3:00 each machine, easy-moderate" : level === "beginner" ? "4:00 each machine, sustainable" : "5:00 each machine, max sustainable distance";
  const amrapWindow = level === "absolute-beginner" ? "12 min AMRAP" : level === "beginner" ? "16 min AMRAP" : "20 min AMRAP";
  const dbLoad = level === "absolute-beginner" ? "very light DBs or step-back burpees only" : level === "beginner" ? "light DBs" : level === "moderate" ? "moderate DBs" : "heavy but unbroken DBs";

  return workout(`bench-${week}-engines`, week, phase, "Saturday", benchmarkTitle("All Engines, No Brakes", week), "Mixed-machine engine capacity and dumbbell fatigue tolerance", 55 + step * 5, scale.intensity, [
    { title: "For Distance", items: [`SkiErg: ${engineWindow}`, `BikeErg or Assault Bike: ${engineWindow}`, `RowErg: ${engineWindow}`, `Optional fourth machine: ${engineWindow}`, "Rest 3 min before the AMRAP"], timer: { mode: "station", workSeconds: level === "absolute-beginner" ? 180 : level === "beginner" ? 240 : 300, restSeconds: 0, rounds: level === "absolute-beginner" ? 3 : 4 } },
    { title: amrapWindow, items: [`${level === "absolute-beginner" ? "100m walk-jog" : "200m run"}`, `${level === "absolute-beginner" ? "3" : "5"} dual DB devil's press (${dbLoad})`, `${level === "absolute-beginner" ? "6" : "10"} burpee over DB`, `${level === "absolute-beginner" ? "10" : "15"} DB deadlifts`, "Move continuously; avoid early redline"], timer: { mode: "countdown", durationSeconds: level === "absolute-beginner" ? 720 : level === "beginner" ? 960 : 1200 } },
    { title: "Coaching Purpose", items: ["Raise aerobic ceiling across modalities", "Build tolerance for breathing shifts between erg and floor work", "Record machine meters and AMRAP rounds", ...note] }
  ], answers, { goals });
}

function gritProtocol(level: TrainingLevel, week: number, phase: number, answers: OnboardingAnswers, goals: string[]) {
  const { step, scale, note } = benchmarkModifier(level, week, phase);
  const rounds = level === "absolute-beginner" ? 2 : level === "beginner" ? 3 : 4;
  const calories = level === "absolute-beginner" ? "6-8 cal" : level === "beginner" ? "9-10 cal" : "12 cal";
  const wallBalls = level === "absolute-beginner" ? "8 wall balls or squats" : level === "beginner" ? "12 wall balls" : "15 wall balls";
  const swings = level === "absolute-beginner" ? "10 Russian KB swings" : level === "beginner" ? "12 KB swings" : "15 American KB swings";

  return workout(`bench-${week}-grit`, week, phase, "Saturday", benchmarkTitle("Grit Protocol", week), "Sled repeatability, wall-ball stamina, and carry mechanics", 50 + step * 5, scale.intensity, [
    { title: `For Time - ${rounds} rounds`, items: [`Sled pull ${level === "absolute-beginner" ? "technique 20 sec" : "30 sec"}`, `Sled push ${level === "absolute-beginner" ? "technique 20 sec" : "30 sec"}`, `${level === "absolute-beginner" ? "Ring row" : "Pull-up"} ${level === "absolute-beginner" ? "20 sec" : "30 sec"}`, "Rest 90 sec"], timer: { mode: "interval", workSeconds: level === "absolute-beginner" ? 20 : 30, restSeconds: 90, rounds } },
    { title: `EMOM - ${rounds} rounds`, items: [`Minute 1: calories of choice ${calories}`, `Minute 2: ${wallBalls}`, `Minute 3: ${swings}`, `Minute 4: KB farmer carry ${level === "absolute-beginner" ? "25 sec" : "40 sec"}`, "Keep every minute repeatable"], timer: { mode: "emom", workSeconds: 60, rounds: rounds * 4 } },
    { title: "Coaching Purpose", items: ["Build sled output without panic breathing", "Practice wall balls after posterior-chain fatigue", "Protect grip by relaxing hands between carries", ...note] }
  ], answers, { goals });
}

function hyrox347Simulation(level: TrainingLevel, week: number, phase: number, answers: OnboardingAnswers, goals: string[], partnerCue: string) {
  const { step, scale, note } = benchmarkModifier(level, week, phase);
  const run = level === "absolute-beginner" ? "400m walk-jog" : level === "beginner" ? "700m run" : "1000m run";
  const ski = level === "absolute-beginner" ? "250m SkiErg or bike" : level === "beginner" ? "350m SkiErg" : "500m SkiErg";
  const row = level === "absolute-beginner" ? "250m row or bike" : level === "beginner" ? "350m row" : "500m row";
  const wallBalls = level === "absolute-beginner" ? "12 wall balls or squats" : level === "beginner" ? "18 wall balls" : "25 wall balls";
  const carry = level === "absolute-beginner" ? "30m farmer carry" : level === "beginner" ? "40m farmer carry" : "50m farmer carry";
  const lunges = level === "absolute-beginner" ? "25m bodyweight lunges" : level === "beginner" ? "35m sandbag lunges" : "50m sandbag lunges";
  const burpees = level === "absolute-beginner" ? "20m step-back burpee broad jumps" : level === "beginner" ? "35m burpee broad jumps" : "50m burpee broad jumps";

  return workout(`bench-${week}-jour347`, week, phase, "Saturday", benchmarkTitle("HYROX 347 Simulation", week), "Race-specific run-station sequencing and finish prediction", 65 + step * 10, scale.intensity, [
    { title: "Simulation Flow", items: [`${run}`, `${ski}`, `${wallBalls}`, `${run}`, `${carry}`, `${level === "absolute-beginner" ? "10 burpees to plate" : "25 burpees to plate"}`, `${run}`, `${lunges}`, `${wallBalls}`, `${run}`, `${burpees}`, `${row}`, `Time cap: ${level === "expert" ? "50 min strict" : scale.cap}`, partnerCue], timer: { mode: "station", rounds: 1 } },
    { title: "Coaching Purpose", items: ["Rehearse race-day order without guessing", "Learn which station damages the next run", "Use finish time to update target pacing", ...note] }
  ], answers, { goals });
}

function featuredSaturday(level: TrainingLevel, week: number, phase: number, phaseWeek: number, answers: OnboardingAnswers, goals: string[], weakness: string, partnerCue: string) {
  const phaseSlot = ((phaseWeek - 1) % 5) + 1;

  if (phase === 1) {
    if (phaseSlot === 1) return runSquatBurpeeLadder(level, week, phase, answers, goals);
    if (phaseSlot === 2) return hyroxConditioningStations(level, week, phase, answers, goals, weakness, partnerCue);
    if (phaseSlot === 3) return allEnginesNoBrakes(level, week, phase, answers, goals);
    if (phaseSlot === 4) return gritProtocol(level, week, phase, answers, goals);
    return hyroxConditioningStations(level, week, phase, answers, goals, weakness, partnerCue);
  }

  if (phase === 2) {
    if (phaseSlot === 1) return hyroxConditioningStations(level, week, phase, answers, goals, weakness, partnerCue);
    if (phaseSlot === 2) return gritProtocol(level, week, phase, answers, goals);
    if (phaseSlot === 3) return allEnginesNoBrakes(level, week, phase, answers, goals);
    if (phaseSlot === 4) return runSquatBurpeeLadder(level, week, phase, answers, goals);
    return hyrox347Simulation(level, week, phase, answers, goals, partnerCue);
  }

  if (phase === 3) {
    if (phaseSlot === 1) return hyrox347Simulation(level, week, phase, answers, goals, partnerCue);
    if (phaseSlot === 2) return hyroxConditioningStations(level, week, phase, answers, goals, weakness, partnerCue);
    if (phaseSlot === 3) return allEnginesNoBrakes(level, week, phase, answers, goals);
    if (phaseSlot === 4) return gritProtocol(level, week, phase, answers, goals);
    return hyrox347Simulation(level, week, phase, answers, goals, partnerCue);
  }

  if (phaseSlot === 1) return runSquatBurpeeLadder(level, week, phase, answers, goals);
  if (phaseSlot === 2) return hyroxConditioningStations(level, week, phase, answers, goals, weakness, partnerCue);
  return hyrox347Simulation(level, week, phase, answers, goals, partnerCue);
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

function levelSessions(level: TrainingLevel, week: number, phase: number, phaseWeek: number, answers: OnboardingAnswers): DailyWorkout[] {
  const paces = paceGuide(level, answers);
  const weakness = stationFocus(answers, week);
  const secondary = secondaryStation(answers, week);
  const step = buildStep(week);
  const isBenchmarkWeek = week % 2 === 0;
  const benchmark = isBenchmarkWeek ? "Benchmark: record split, RPE, breathing quality, and station notes" : progressionNote(week, phase);
  const doubles = answers.raceCategory.includes("doubles");
  const partnerCue = doubles
    ? `Doubles cue: run together; partner pace ${answers.partnerRunningPace || "sets the cap"}; communicate before every station`
    : "Solo cue: preserve run rhythm and avoid station redlining";

  const baseGoals = [
    partnerCue,
    `Station target focus: ${stationTargets[level].slice(0, 3).join("; ")}`,
    "Practice fast entry, calm first reps, and clean exit",
    benchmark
  ];

  const programs: Record<TrainingLevel, DailyWorkout[]> = {
    "absolute-beginner": [
      workout(`gen-${week}-1`, week, phase, "Monday", "Walk-Run Engine + Core", "Consistency, aerobic habit, side stitch prevention", 40, "easy", [
        { title: "Walk-Run", items: [`${phase <= 1 ? `${8 + step * 2} x ${step} min jog / 2 min walk` : `${6 + step * 2} x ${step + 1} min jog / 90 sec walk`}`, `Keep ${paces.easy}`, "Nasal breathing for the first 10 min", progressionNote(week, phase)] },
        { title: "Core Stability", items: [`Dead bugs 3x${8 + step * 2}/side`, `Bird dogs 3x${8 + step}/side`, `Side plank 3x${20 + step * 5} sec/side`, `Suitcase carry ${3 + step}x20m`] },
        { title: "Breathing", items: ["Crocodile breathing 5 min", "Box breathing 4-4-4-4 x 4 rounds"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-2`, week, phase, "Wednesday", "Strength Foundation", "Movement quality and structural capacity", 45, "moderate", [
        { title: "Strength", items: [`Goblet squat ${2 + step}x8 RPE ${4 + step}`, `Dumbbell Romanian deadlift ${2 + step}x8`, `Step-up ${2 + step}x8/side`, `Incline push-up ${2 + step}x8`, `Cable row or ring row ${2 + step}x10`] },
        { title: "HYROX Skill", items: [`Technique practice: ${weakness}`, `${10 + step * 3} min only`, `Secondary exposure: ${secondary}`, "Stop before form breaks"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-3`, week, phase, "Friday", "Low-Impact Engine", "Aerobic work without pounding", 35, "easy", [
        { title: "Bike/Row/Walk", items: [`${25 + step * 5} min Zone 2`, `Every ${6 - Math.min(step, 2)} min add 30 sec slightly faster`, "No breath holding"] },
        { title: "Mobility", items: ["Hips 2 min/side", "Calves 2 min/side", "Ankles 2 min/side", "Thoracic rotation 2x8/side"] }
      ], answers),
      featuredSaturday(level, week, phase, phaseWeek, answers, baseGoals, weakness, partnerCue)
    ],
    beginner: [
      workout(`gen-${week}-1`, week, phase, "Monday", "Aerobic Base + Core", "Running durability and trunk control", 55, "easy", [
        { title: "Run", items: [`${30 + step * 5}-${40 + step * 5} min Zone 2`, `Hold ${paces.easy}`, `Finish with ${3 + step} x 20 sec relaxed strides`, progressionNote(week, phase)] },
        { title: "Core", items: [`Copenhagen plank 3x${15 + step * 5} sec/side`, `Dead bugs 3x${10 + step}`, `Pallof press 3x${10 + step}/side`, `Suitcase carry ${3 + step}x30m`] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-2`, week, phase, "Tuesday", "Lower Strength + Skill", "Foundational force production", 65, "moderate", [
        { title: "Strength", items: [`Back squat ${3 + step}x6 RPE ${5 + step}`, `Romanian deadlift ${3 + step}x8`, `Walking lunges ${2 + step}x20m`, "Tibialis raises 3x20"] },
        { title: "Station Skill", items: [`${weakness} technique ${12 + step * 3} min`, `Secondary station: ${secondary}`, "Keep reps smooth", "Rest before failure"] }
      ], answers),
      workout(`gen-${week}-3`, week, phase, "Thursday", "Intro Threshold", "Controlled lactate tolerance", 55, "moderate-hard", [
        { title: "Run", items: [`${phase <= 1 ? `${3 + step} x ${3 + step} min comfortably hard` : `${4 + step} x 800m threshold`}`, "2 min easy jog recovery", `Target: ${paces.threshold}`, isBenchmarkWeek ? "Benchmark: compare average pace to last threshold session" : "Stay controlled; last rep should be repeatable"], timer: { mode: "interval", workSeconds: phase <= 1 ? (180 + step * 60) : 300, restSeconds: 120, rounds: phase <= 1 ? 3 + step : 4 + step } },
        { title: "Breathing", items: ["Use 3:3 rhythm early", "Shift to 2:2 only when effort rises"] }
      ], answers),
      featuredSaturday(level, week, phase, phaseWeek, answers, baseGoals, weakness, partnerCue),
      workout(`gen-${week}-5`, week, phase, "Sunday", "Full Rest", "Absorb training", 20, "recovery", [
        { title: "Recovery Only", items: ["Easy walk optional", "Mobility 10 min", "Hydration and meal prep", "No intense training"] }
      ], answers, { warmup: [], cooldown: [] })
    ],
    moderate: [
      workout(`gen-${week}-1`, week, phase, "Monday", "Recovery Engine", "Zone 2, core, and anti-side-stitch work", 70, "easy", [
        { title: "Run", items: [`${40 + step * 5}-${50 + step * 5} min Zone 2`, `Target: ${paces.easy}`, "Nasal breathing first 15 min", progressionNote(week, phase)] },
        { title: "Core", items: [`Copenhagen plank 3x${25 + step * 5} sec/side`, `Dead bugs 3x${10 + step}`, `Bird dogs 3x${8 + step}/side`, `Side planks 3x${35 + step * 5} sec/side`] },
        { title: "Mobility", items: ["Hips", "Thoracic spine", "Ankles", "Calves", "Adductors"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-2`, week, phase, "Tuesday", "Threshold + Lower Strength", "Lactate threshold and force durability", 95, "hard", [
        { title: "Run", items: [`${phase <= 1 ? `${4 + step} x 1 km threshold` : phase === 2 ? `${2 + step} x 2 km threshold` : `${5 + step} x 1 km race pace`}`, "2-3 min jog recovery", `Target: ${paces.threshold}`, isBenchmarkWeek ? "Benchmark: record average rep pace and HR drift" : "Keep the final rep controlled, not desperate"], timer: { mode: "interval", workSeconds: phase === 2 ? 570 : 285, restSeconds: phase === 2 ? 180 : 120, rounds: phase === 2 ? 2 + step : phase === 3 ? 5 + step : 4 + step } },
        { title: "Strength", items: [`Back squat ${3 + step}x5-6 RPE 7-8`, `Romanian deadlift ${3 + step}x8`, `Bulgarian split squat ${2 + step}x10/side`, `Walking lunges ${2 + step}x20m`, "Tibialis raises 3x20"] }
      ], answers),
      workout(`gen-${week}-3`, week, phase, "Wednesday", "HYROX Engine Session", "Compromised running and station rhythm", 85, "moderate-hard", [
        { title: `${phase <= 1 ? 2 + step : 3 + step} rounds`, items: ["1 km run", `${phase <= 1 ? 500 + step * 100 : 750 + step * 100}m SkiErg`, `${25 + step * 12.5}m sled push`, `${25 + step * 12.5}m sled pull`, `${500 + step * 100}m row`, `Primary station focus: ${weakness}`, partnerCue], timer: { mode: "station", rounds: phase <= 1 ? 2 + step : 3 + step } },
        { title: "Purpose", items: ["Smooth transitions", "No standing still", "Keep the run controlled after stations"] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-4`, week, phase, "Thursday", "Active Recovery + Mobility", "Downshift fatigue", 45, "recovery", [
        { title: "Option", items: ["40 min cycling Zone 1-2", "Or 30-35 min easy run", "Keep breathing fully conversational"] },
        { title: "Reset", items: ["Foam rolling", "Lacrosse ball feet release", "Hip and calf mobility", "Diaphragmatic breathing 5 min"] }
      ], answers),
      workout(`gen-${week}-5`, week, phase, "Friday", "Strength + Compromised Running", "Strength under fatigue", 90, "hard", [
        { title: "Strength", items: [`Trap bar deadlift ${3 + step}x5`, `Bench press ${3 + step}x6`, `Pull-ups ${3 + step}x8`, `Push press ${2 + step}x8`, `Farmer carry ${3 + step}x40m`] },
        { title: `Compromised Running - ${3 + step} rounds`, items: [`${400 + step * 100}m SkiErg`, `${600 + step * 200}m run at HYROX pace`, `Station focus: ${weakness}`, `Secondary station: ${secondary}`], timer: { mode: "interval", workSeconds: 360 + step * 60, restSeconds: 90, rounds: 3 + step } }
      ], answers),
      featuredSaturday(level, week, phase, phaseWeek, answers, [...baseGoals, ...(doubles ? doublesSplits : ["Solo strategy: never sprint transitions; win by preserving run pace"])], weakness, partnerCue)
    ],
    expert: [
      workout(`gen-${week}-1`, week, phase, "Monday", "Aerobic Reset + Strides", "Absorb load while maintaining speed", 70, "easy", [
        { title: "Run", items: [`${45 + step * 5}-${55 + step * 5} min Zone 2`, `Target: ${paces.easy}`, `${5 + step} x 20 sec relaxed strides`, "Full walk-back recovery", progressionNote(week, phase)] },
        { title: "Core", items: [`Copenhagen plank 3x${35 + step * 5} sec/side`, `${3 + step}x10/side Pallof press`, `Suitcase carry ${4 + step}x40m`] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-2`, week, phase, "Tuesday", "Advanced Threshold", "Race engine and lactate clearance", 100, "hard", [
        { title: "Run", items: [phase <= 1 ? `${3 + step} x 1600m threshold` : phase === 2 ? `${3 + step} x 2 km threshold` : `${2 + step} x 3 km threshold`, "2-3 min jog recovery", `Target: ${paces.threshold}`, isBenchmarkWeek ? "Benchmark: compare total threshold volume at same RPE" : "Stay submaximal until the final rep"], timer: { mode: "interval", workSeconds: phase === 3 ? 780 : phase === 2 ? 520 : 390, restSeconds: 150, rounds: phase === 3 ? 2 + step : 3 + step } },
        { title: "Lower Strength", items: [`Back squat ${4 + step}x4 RPE 8`, `RDL ${3 + step}x6`, `Heavy walking lunge ${3 + step}x20m`, `Sled push technique ${5 + step}x12.5m`] }
      ], answers),
      workout(`gen-${week}-3`, week, phase, "Wednesday", "HYROX Engine + Transitions", "High-specificity station flow", 90, "hard", [
        { title: "Engine", items: [`${4 + step} rounds`, "1 km run", `${400 + step * 100}m SkiErg`, `${15 + step * 5} burpee broad jumps`, `${400 + step * 100}m row`, `Primary station focus: ${weakness}`, "Fast but controlled transitions"], timer: { mode: "station", rounds: 4 + step } },
        { title: "Transition Rehearsal", items: ["Station entry line", "Station exit line", "Breathing cue", `Next run first ${150 + step * 50}m controlled`] }
      ], answers, { goals: baseGoals }),
      workout(`gen-${week}-4`, week, phase, "Thursday", "Second Threshold / VO2", "Advanced speed reserve", 75, "hard", [
        { title: "Run", items: [`${5 + step} x 800m at VO2 effort`, "2 min jog recovery", `Target: ${paces.vo2}`, phase === 3 ? "Peak: keep mechanics intact under high breathing demand" : "Build speed reserve without sprinting"], timer: { mode: "interval", workSeconds: 190, restSeconds: 120, rounds: 5 + step } },
        { title: "Flush", items: ["10 min easy jog", "Mobility and diaphragm reset"] }
      ], answers),
      workout(`gen-${week}-5`, week, phase, "Friday", "Heavy Station Efficiency", "Force output without redlining", 90, "hard", [
        { title: "Stations", items: [`Heavy sled push ${5 + step} x 12.5m`, `Sled pull ${5 + step} x 12.5m`, `Farmer carry ${4 + step} x 40m`, `Sandbag lunge ${3 + step} x 25m`, `Wall balls in planned sets focused on ${weakness}`] },
        { title: "Compromised Finish", items: [`${2 + step} rounds: 500m row, ${15 + step * 5} wall balls, 400m run`, `Secondary station: ${secondary}`] }
      ], answers),
      featuredSaturday(level, week, phase, phaseWeek, answers, [...baseGoals, ...(doubles ? doublesSplits : ["Solo strategy: hold back through sled pull, attack from farmer carry onward"])], weakness, partnerCue),
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
    const phaseWeek = phaseWeekNumber(weekNumber, weeks);
    const rawWorkouts = levelSessions(level, weekNumber, phase, phaseWeek, answers);
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
