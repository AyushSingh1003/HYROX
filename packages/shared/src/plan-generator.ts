import type { DailyWorkout, GeneratedTrainingPlan, OnboardingAnswers, TrainingLevel, TrainingWeek } from "./types.js";

type ProgramMeta = {
  title: string;
  who: string;
  days: string;
  goal: { individual: string; doubles: string };
  philosophy: string;
  priorities: string[];
};

type StationProgression = {
  ski: string[];
  sledPush: string[];
  sledPull: string[];
  burpee: string[];
  row: string[];
  farmerCarry: string[];
  lunges: string[];
  wallBall: string[];
  runPace?: string[];
  weeklyRunVolume?: string[];
};

const levelLabels: Record<TrainingLevel, string> = {
  "absolute-beginner": "Absolute Beginner",
  beginner: "Beginner",
  moderate: "Moderate",
  expert: "Expert / Elite"
};

const programMeta: Record<TrainingLevel, ProgramMeta> = {
  "absolute-beginner": {
    title: "Absolute Beginner HYROX Finish Program",
    who: "Never done HYROX, may be new to structured training, cannot yet run 5km continuously, and needs to finish without quitting.",
    days: "3 structured days per week in weeks 1-6, optional 4th recovery day from week 7 onward.",
    goal: { individual: "2:00-2:30", doubles: "1:45-2:15" },
    philosophy: "Build movement patterns, aerobic base, station confidence, and injury resistance before chasing pace or load.",
    priorities: [
      "Full-body strength frequency instead of a bro split",
      "Walk-run aerobic development and time on feet",
      "Technique-only station exposure across all 8 HYROX stations",
      "Complete every race station without surprises"
    ]
  },
  beginner: {
    title: "Beginner HYROX Completion Program",
    who: "Some gym experience, can run 5km without stopping, limited HYROX exposure, and wants a respectable finish.",
    days: "4 structured days per week.",
    goal: { individual: "1:30-1:50", doubles: "1:25-1:45" },
    philosophy: "Build a real aerobic base, introduce threshold running, progress all 8 stations, and learn compromised running.",
    priorities: [
      "Lower and upper compound strength without excess isolation",
      "One dedicated HYROX conditioning block each week",
      "Friday running development from Zone 2 to race-pace rehearsal",
      "Simulation progression from simple formats to 85% race format"
    ]
  },
  moderate: {
    title: "Moderate HYROX Competitive Program",
    who: "Completed HYROX or has a year of hybrid training, can run 5km under 25 minutes, and can train 5 days per week.",
    days: "5 structured days per week.",
    goal: { individual: "1:10-1:25", doubles: "1:05-1:20" },
    philosophy: "Introduce the bro-split mechanical pairings at reduced HYROX volume while prioritizing threshold running and race-weight station progressions.",
    priorities: [
      "Lower body before Session C",
      "Upper/back work before Session B",
      "Chest/push work before Session A",
      "50%, 70%, and 90% simulation schedule with week 4 and week 8 deloads"
    ]
  },
  expert: {
    title: "Expert / Elite HYROX Race-Specific Program",
    who: "Experienced HYROX competitor, regular hybrid athlete, comfortable at race weight, and targeting sub-70 individual or 1:05-1:15 doubles.",
    days: "5 gym days plus optional Zone 2 add-on and Saturday simulation/run.",
    goal: { individual: "Sub-70", doubles: "1:05-1:15" },
    philosophy: "Use the full bro-split plus Sessions A/B/C/W to relentlessly serve the fixed HYROX race format.",
    priorities: [
      "Chest plus Session A: sled push, burpee broad jump, devil press",
      "Back plus Session B: SkiErg, sled pull, row, run-off-row",
      "Arms plus Session W: wall ball, burpee, grip and elbow resilience",
      "Legs plus Session C: full station circuit with compromised 1km runs",
      "Race-weight specificity by week 9, full simulation week 7, 90% simulation week 9"
    ]
  }
};

const phases = [
  "Foundation / Base",
  "Build",
  "Peak HYROX Specificity",
  "Taper / Race Week"
];

const stationProgressions: Record<TrainingLevel, StationProgression> = {
  "absolute-beginner": {
    ski: ["4x100m", "4x150m", "4x200m", "3x300m", "3x400m", "3x500m", "3x600m", "3x750m", "3x750m technique", "2x500m", "2x500m", "2x500m taper"],
    sledPush: ["2x10m light", "2x10m light", "3x15m", "3x15m moderate", "3x20m", "3x20m race-ish", "3x25m", "3x25m race weight", "3x25m race weight", "2x15m taper", "2x15m taper", "2x15m taper"],
    sledPull: ["2x10m light", "2x10m light", "3x15m", "3x15m moderate", "3x20m", "3x20m race-ish", "3x25m", "3x25m race weight", "3x25m race weight", "2x15m taper", "2x15m taper", "2x15m taper"],
    burpee: ["3x5 reps", "3x8 reps", "3x10 reps", "3x12 reps", "3x15 reps", "3x15 reps", "4x15 reps", "3x20 reps", "3x20 reps", "2x15 taper", "2x15 taper", "2x15 taper"],
    row: ["4x100m", "4x200m", "3x300m", "3x400m", "3x500m", "2x500m", "3x500m", "2x750m", "2x750m", "1x500m taper", "1x500m taper", "1x500m taper"],
    farmerCarry: ["3x30m moderate", "3x40m", "3x50m", "3x60m", "3x75m", "3x100m", "3x150m", "3x200m", "3x200m", "2x100m taper", "2x100m taper", "2x100m taper"],
    lunges: ["3x10m bodyweight", "3x15m bodyweight", "3x20m light", "3x30m light", "3x40m moderate", "3x50m", "3x60m", "3x75m", "3x75m", "2x40m taper", "2x40m taper", "2x40m taper"],
    wallBall: ["3x10 / 4kg", "3x12", "3x15", "3x15 / 6kg", "3x20", "3x20", "4x20", "3x25", "3x25", "2x20 taper", "2x20 taper", "2x20 taper"]
  },
  beginner: {
    ski: ["3x200m", "3x250m", "3x300m", "3x400m", "4x300m", "4x400m", "3x500m", "3x600m", "1x750m + 2x500m", "1x1000m", "1x1000m", "500m taper"],
    sledPush: ["3x15m light", "3x20m", "3x20m moderate", "3x25m", "3x30m moderate", "3x30m heavier", "3x40m", "3x50m race weight", "3x50m race weight", "3x50m race weight", "2x25m race weight", "2x25m taper"],
    sledPull: ["3x15m light", "3x20m", "3x20m moderate", "3x25m", "3x25m race weight", "3x25m", "3x25m", "3x25m", "3x25m", "3x25m", "2x20m", "2x20m taper"],
    burpee: ["3x10", "3x12", "3x15", "4x15", "3x20", "4x20", "3x25", "4x25", "4x25", "4x25", "2x20", "2x20 taper"],
    row: ["3x300m", "3x400m", "3x500m", "3x500m", "3x600m", "3x700m", "2x750m", "1x1000m", "1x1000m", "1x1000m", "2x500m", "2x500m taper"],
    farmerCarry: ["3x50m moderate", "3x75m", "3x75m heavier", "3x100m", "3x125m", "3x150m", "3x175m", "3x200m", "3x200m", "3x200m", "2x100m", "2x100m taper"],
    lunges: ["3x15m light", "3x20m", "3x30m moderate", "3x40m", "3x50m", "3x60m", "3x75m", "3x100m", "3x100m", "3x100m", "2x50m", "2x50m taper"],
    wallBall: ["3x15 / 6kg", "3x20", "3x25", "3x25 / 9kg", "4x20", "4x25", "3x30", "4x25", "4x25", "4x25", "2x25", "2x25 taper"]
  },
  moderate: {
    ski: ["300m", "400m", "500m", "400m deload", "600m", "700m", "750m", "750m deload", "1000m", "1000m", "1000m", "500m taper"],
    sledPush: ["20m / 80kg", "20m / 100kg", "30m / 120kg", "20m / 80kg deload", "30m / 140kg", "40m / 152kg", "50m / 152kg", "30m / 152kg deload", "50m / 152kg", "50m / 152kg", "50m / 152kg", "20m / 152kg taper"],
    sledPull: ["20m / 60kg", "20m / 80kg", "25m / 90kg", "20m / 80kg deload", "25m / 95kg", "25m / 103kg", "25m / 103kg", "20m / 103kg deload", "25m / 103kg", "25m / 103kg", "25m / 103kg", "15m / 103kg taper"],
    burpee: ["15m", "20m", "30m", "20m deload", "40m", "50m", "60m", "40m deload", "80m", "80m", "80m", "30m taper"],
    row: ["400m", "500m", "600m", "400m deload", "600m", "750m", "1000m", "750m deload", "1000m", "1000m", "1000m", "500m taper"],
    farmerCarry: ["50m / 20kg", "75m / 22kg", "100m / 22kg", "50m / 22kg deload", "125m / 24kg", "150m / 24kg", "175m / 24kg", "100m / 24kg deload", "200m / 24kg", "200m / 24kg", "200m / 24kg", "75m / 24kg taper"],
    lunges: ["20m / 15kg", "30m / 15kg", "40m / 20kg", "20m / 15kg deload", "50m / 20kg", "60m / 20kg", "80m / 20kg", "60m / 20kg deload", "100m / 20kg", "100m / 20kg", "100m / 20kg", "30m / 20kg taper"],
    wallBall: ["20 / 6kg", "25 / 6kg", "30 / 9kg", "20 / 6kg deload", "40 / 9kg", "50 / 9kg", "60 / 9kg", "40 / 9kg deload", "80 / 9kg", "100 / 9kg", "100 / 9kg", "30 / 9kg taper"]
  },
  expert: {
    ski: ["500m", "500m", "500m", "750m", "750m", "750m", "1000m", "1000m", "1000m", "1000m", "1000m", "500m taper"],
    sledPush: ["20m / 120kg", "20m / 120kg", "30m / 140kg", "30m / 140kg", "50m / 152kg", "50m / 152kg", "50m / 152kg", "50m / 152kg", "50m / 152kg", "50m / 152kg", "50m / 152kg", "20m / 152kg taper"],
    sledPull: ["20m / 80kg", "20m / 80kg", "25m / 90kg", "25m / 95kg", "25m / 103kg", "25m / 103kg", "25m / 103kg", "25m / 103kg", "25m / 103kg", "25m / 103kg", "25m / 103kg", "20m / 103kg taper"],
    burpee: ["20m", "20m", "30m", "40m", "40m", "50m", "60m", "60m", "80m", "80m", "80m", "20m taper"],
    row: ["500m", "500m", "500m", "500m", "750m", "750m", "750m", "1000m", "1000m", "1000m", "1000m", "500m taper"],
    farmerCarry: ["50m / 20kg", "50m / 20kg", "100m / 22kg", "100m / 22kg", "150m / 24kg", "150m / 24kg", "150m / 24kg", "200m / 24kg", "200m / 24kg", "200m / 24kg", "200m / 24kg", "50m / 24kg taper"],
    lunges: ["20m / 15kg", "20m / 15kg", "40m / 15kg", "40m / 15kg", "60m / 20kg", "60m / 20kg", "80m / 20kg", "80m / 20kg", "100m / 20kg", "100m / 20kg", "100m / 20kg", "20m / 20kg taper"],
    wallBall: ["30 / 6kg", "30 / 6kg", "30 / 6kg", "40 / 6kg", "40 / 9kg", "40 / 9kg", "60 / 9kg", "80 / 9kg", "80 / 9kg", "100 / 9kg", "100 / 9kg", "30 / 9kg taper"],
    runPace: ["5:20/km", "5:18/km", "5:15/km", "5:15/km", "5:08/km", "5:05/km", "5:02/km", "5:00/km", "4:58/km", "4:55/km", "4:55/km", "4:50/km"],
    weeklyRunVolume: ["15km", "15km", "16km", "16km", "18km", "18km", "19km", "20km", "21km", "22km", "22km", "10km taper"]
  }
};

const breathingProtocol = [
  "Crocodile breathing: 5 min before sleep or after sessions, breathe into the belly against the floor.",
  "Box breathing 4-4-4-4 before and after sessions.",
  "Diaphragm expansion with a resistance band around the lower ribs: 3x10 deep lateral breaths.",
  "Nasal-only warmup jog for the first 5-10 min of running sessions.",
  "Running rhythm: 3:3 on easy runs, 2:2 during threshold and race pace.",
  "Forced exhale after every station: 3 complete exhales before starting the next run.",
  "Side stitch rescue: exhale forcefully on the opposite foot strike, press into the stitch, and keep moving."
];

const nutritionProtocol = [
  "Hydration: 35-45ml/kg/day.",
  "Sodium: 3-5g/day depending on sweat rate and climate; use the higher end for hot race environments.",
  "Protein: 1.8-2.2g/kg/day.",
  "Sessions longer than 60 min: 500-750ml fluid/hour, 500-900mg sodium/hour, and 30-60g carbs/hour.",
  "Normal training days: 4-7g carbs/kg; heavy simulation days: 7-9g/kg; 48 hours pre-race: 8-10g/kg.",
  "Post-workout within 30 min: 30-40g protein plus fast carbs and sodium.",
  "Useful foods: chicken breast, white rice, banana, eggs, oats, whey, Greek yogurt, salmon, pasta, sweet potato, white bread, honey, sports drinks, electrolyte tabs."
];

const recoveryProtocol = [
  "Track resting heart rate, sleep quality, and readiness every morning.",
  "If resting heart rate is more than 5 bpm above baseline, reduce session intensity by 30%.",
  "If resting heart rate is 8-10 bpm above baseline, consider rest.",
  "Foam roll 10-15 min from week 5 onward: glutes, IT band, calves, thoracic spine, hip flexors.",
  "Use a cold shower after hard sessions; expert athletes may use 10 min ice bath after simulations.",
  "No alcohol on training nights; prioritize a cool, dark room and consistent wake time."
];

const doublesStrategy = [
  "SkiErg: Athlete A 60%, partner 40%.",
  "Sled Push: Athlete A 65-70%, partner 30-35%.",
  "Sled Pull: Athlete A 60%, partner 40%.",
  "Burpee Broad Jumps: alternate every 10 reps.",
  "Row: partner 55%, Athlete A 45%.",
  "Farmer Carry: Athlete A 65%, partner 35%.",
  "Lunges: alternate every 20m.",
  "Wall Balls: Athlete A 55-60%, partner 40-45%.",
  "Run every 1km leg together; Athlete A never runs ahead in legs 1-5 and helps pull the partner through legs 6-8.",
  "No mid-station discussions; one partner always works while the other resets breathing."
];

const runningPaces: Record<TrainingLevel, string[]> = {
  "absolute-beginner": [
    "Zone 2 easy: conversational walk-jog; no fixed pace target.",
    "Race target: complete all running legs, 6:30-8:00/km is acceptable."
  ],
  beginner: [
    "Zone 2 easy: 6:30-7:30/km or conversational.",
    "Threshold: 5:45-6:15/km.",
    "Race target: 5:45-6:30/km."
  ],
  moderate: [
    "Zone 2 easy: 5:45-6:30/km.",
    "Threshold: 5:00-5:30/km.",
    "VO2max intervals: 4:45-5:10/km.",
    "Race target: 5:00-5:20/km."
  ],
  expert: [
    "Athlete A Zone 2: 5:35-6:05/km; threshold: 4:20-4:35/km; VO2max: 3:55-4:10/km; race target: 5:00-5:10/km.",
    "Partner Zone 2: 6:00-6:40/km; threshold: 4:50-5:05/km; VO2max: 4:20-4:40/km; race target: 5:15-5:30/km."
  ]
};

function phaseForWeek(week: number) {
  if (week <= 3) return 1;
  if (week <= 8) return 2;
  if (week <= 10) return 3;
  return 4;
}

function phaseTitle(level: TrainingLevel, week: number) {
  if (level === "absolute-beginner") {
    if (week <= 3) return "Foundation";
    if (week <= 6) return "Base Building";
    if (week <= 9) return "Development";
    if (week === 10) return "Deload";
    if (week === 11) return "Pre-Race Prep";
    return "Race Week";
  }
  if (week === 4) return "Base Deload";
  if (week === 8) return "Build Deload";
  if (week === 12) return "Race Week Taper";
  return phases[phaseForWeek(week) - 1];
}

function weekLoad(level: TrainingLevel, week: number) {
  if (week === 12) return "Low";
  if ((level !== "absolute-beginner" && [4, 8].includes(week)) || (level === "absolute-beginner" && week === 10)) return "Reduced";
  if (level === "expert" && [7, 9, 10, 11].includes(week)) return "Very high";
  if (level === "expert") return "High";
  if (level === "absolute-beginner") return week >= 7 ? "Low-moderate" : "Low";
  return "Moderate";
}

function weekIntent(level: TrainingLevel, week: number) {
  if (level === "absolute-beginner") {
    if (week <= 3) return "Learn all 8 movement patterns, build run-walk consistency, and keep intensity low.";
    if (week <= 6) return "Increase station distances and weights slightly, introduce station-to-run combinations, and practice breathing drills.";
    if (week <= 9) return "Combine stations in simple circuits and develop basic compromised running.";
    if (week === 10) return "Deload by reducing volume about 40% while preserving movement quality.";
    if (week === 11) return "Practice short, sharp race-prep sessions and finalize strategy.";
    return "Race week: rest, light movement, carb load, hydrate, and arrive fresh.";
  }
  if (week === 4) return "Base deload: reduce volume about 40%, keep movement crisp, no simulation.";
  if (week === 8) return "Build deload: reduce volume about 40%, preserve rhythm, and prepare for peak work.";
  if (week === 12) return "Race week taper: prime movement, protect the nervous system, carb load, and execute.";
  if (week <= 3) return "Build base strength, station mechanics, aerobic volume, and breathing discipline.";
  if (week <= 6) return "Increase threshold exposure, station volume, and compromised running density.";
  if (week <= 10) return "Prioritize race-specific station loads, simulations, split recording, and pacing precision.";
  return "Absorb the peak block and keep confidence high without chasing soreness.";
}

function stationBlock(level: TrainingLevel, week: number): DailyWorkout["blocks"][number] {
  const p = stationProgressions[level];
  const i = week - 1;
  return {
    title: "Station Progressions",
    items: [
      `SkiErg: ${p.ski[i]}`,
      `Sled Push: ${p.sledPush[i]}`,
      `Sled Pull: ${p.sledPull[i]}`,
      `Burpee Broad Jump: ${p.burpee[i]}`,
      `Row: ${p.row[i]}`,
      `Farmer Carry: ${p.farmerCarry[i]}`,
      `Sandbag Lunges: ${p.lunges[i]}`,
      `Wall Balls: ${p.wallBall[i]}`,
      ...(p.runPace ? [`Run pace target: ${p.runPace[i]}`] : []),
      ...(p.weeklyRunVolume ? [`Weekly run volume target: ${p.weeklyRunVolume[i]}`] : [])
    ]
  };
}

function sharedWarmup(level: TrainingLevel) {
  if (level === "absolute-beginner" || level === "beginner") {
    return [
      "2 min easy walk",
      "3 min dynamic leg swings, arm circles, and hip circles",
      "2 min activation: 10 glute bridges and 10 bodyweight squats",
      "3 min movement prep: 5 inchworms, 5 push-ups, 10 high-knee marches"
    ];
  }
  return [
    "3 min easy jog",
    "3 min dynamic drills: leg swings, hip circles, thoracic rotation, arm circles",
    "2 min activation: glute bridges, band walks if available, 10 inchworms",
    "3 min movement prep: 5 squat jumps, 5 explosive push-ups, 10 high knees",
    "For runs add 4x20 sec strides; for strength add 2 warmup sets of the primary movement"
  ];
}

function sharedCooldown() {
  return [
    "5 min easy walk or jog until heart rate is below 65% max",
    "5 min static stretching: hip flexor, hamstring, quad, calf, chest opener",
    "5 min breathing: 5 deep belly breaths with 4 sec inhale, 2 sec hold, 6 sec exhale x 3 sets",
    "After hard simulations add 10 min continuous walk, protein plus carbs within 45 min, and legs elevated for 20 min"
  ];
}

function substitutions(answers: OnboardingAnswers) {
  const equipment = new Set(answers.equipmentAccess.map((item) => item.toLowerCase()));
  return [
    equipment.has("skierg") ? "SkiErg available: use normal ski prescriptions." : "No SkiErg: use banded lat pulldowns, high pulls, or assault bike intervals.",
    equipment.has("rowerg") ? "RowErg available: use normal row prescriptions." : "No RowErg: use bike, running, or kettlebell swing intervals.",
    equipment.has("sled") ? "Sled available: use normal push and pull prescriptions." : "No sled: use heavy treadmill pushes, prowler alternative, heavy backward drags, cable rows, or battle rope pulls.",
    equipment.has("wall ball") || equipment.has("wall ball setup") ? "Wall ball available: use wall ball progressions." : "No wall ball: use thrusters or med-ball front squats."
  ];
}

function workout(
  level: TrainingLevel,
  answers: OnboardingAnswers,
  week: number,
  day: DailyWorkout["day"],
  title: string,
  focus: string,
  durationMinutes: number,
  intensity: DailyWorkout["intensity"],
  blocks: DailyWorkout["blocks"],
  options: Partial<Pick<DailyWorkout, "targetPace" | "targetHeartRate" | "warmup" | "cooldown" | "recovery" | "nutrition" | "goals" | "scaling">> = {}
): DailyWorkout {
  const meta = programMeta[level];
  const format = answers.raceCategory.includes("doubles") ? "doubles" : "individual";
  return {
    id: `${level}-w${week}-${day.toLowerCase().slice(0, 3)}`,
    week,
    phase: phaseForWeek(week),
    day,
    title,
    focus,
    durationMinutes,
    intensity,
    targetPace: options.targetPace,
    targetHeartRate: options.targetHeartRate,
    warmup: options.warmup ?? sharedWarmup(level),
    blocks,
    cooldown: options.cooldown ?? sharedCooldown(),
    recovery: options.recovery ?? recoveryProtocol,
    nutrition: options.nutrition ?? nutritionProtocol,
    goals: options.goals ?? [
      `Build toward ${answers.targetGoalTime || meta.goal[format]}.`,
      "Train the fixed HYROX race format, not generic fitness.",
      "Finish with clean mechanics, controlled breathing, and repeatable station pacing."
    ],
    scaling: options.scaling ?? [
      "Reduce volume 20-30% if soreness, sleep, stress, injury history, or running mechanics demand it.",
      ...substitutions(answers)
    ]
  };
}

function absoluteBeginnerStrength(week: number) {
  const early = week <= 4;
  const mid = week <= 8;
  return [
    "Goblet squat: HYROX transfer to wall ball depth and sled push position. Cue: hold DB at chest, feet shoulder-width, squat to parallel or below, chest up.",
    `Sets: ${early ? "3x10 light 8-12kg" : mid ? "3x12, increase weight when 3x10 feels easy" : "3x10 heavier, add goblet squat to box"}.`,
    "DB bent-over row: transfer to SkiErg pull, sled pull, rowing drive. Cue: hinge 45 degrees, one hand on bench, pull DB to hip, pause, lower slowly.",
    `Sets: ${early ? "3x10 each side light" : mid ? "3x10 each side moderate" : "3x8 each side heavier"}.`,
    "DB Romanian deadlift: transfer to sled push drive, kettlebell swing, posterior chain endurance. Cue: hips back, DBs close, flat back, feel hamstring stretch.",
    `Sets: ${early ? "3x10 light" : mid ? "3x10 adding weight" : "3x8 heavier"}.`,
    "Seated DB shoulder press: transfer to devil press lockout and wall ball throw. Cue: start at ear level, full lockout, no back arch.",
    `Sets: ${early ? "3x10 light" : mid ? "3x10 moderate" : "3x8 moderate-heavy"}.`,
    `Farmer carry walk: ${early ? "3x30m moderate" : mid ? "3x50m heavier" : "3x75m heaviest available"}. Stand tall, short quick steps, no leaning.`,
    "Dead bug: 3x8 each side all 12 weeks. Lower back stays flat; do not sacrifice position."
  ];
}

function absoluteBeginnerRun(week: number) {
  if (week <= 3) return "Walk 2 min, jog 1 min, repeat for 20 min.";
  if (week <= 6) return "Jog 3 min, walk 1 min, repeat for 25 min.";
  if (week <= 9) return "Jog 5 min, walk 1 min, repeat for 25 min.";
  if (week <= 11) return "Continuous easy jog 25 min.";
  return "Easy 15 min jog only.";
}

function absoluteBeginnerStationIntro(week: number) {
  if (week <= 2) return ["Row technique: legs, body, arms; recovery arms, body, legs; damper 3-4; 4x100m full rest.", "Wall ball technique: 4-6kg ball, squat depth, catch into next squat; use the weekly station progression."];
  if (week <= 4) return ["SkiErg technique: reach fully, drive elbows down, hinge at hips; total-body pull.", "Burpee broad jump mechanics: chest to floor, stand fully, jump with soft landing; do not rush."];
  if (week <= 6) return ["Sled push: hips low, 45 degree body angle, short powerful steps.", "Sled pull: sit slightly back, hand-over-hand rope pull, short quick steps; use cable row or battle rope pulls if no sled."];
  if (week <= 8) return ["Farmer carry finisher: 3x50m moderate, upright posture.", "Sandbag lunge: upright torso, long stride, rear knee near floor; use dumbbells if no sandbag."];
  return ["Combine 3-4 stations in simple circuits.", "Use basic compromised running: 2 stations, then 500m run.", "Record whether breathing stays controlled."];
}

function buildAbsoluteBeginnerWeek(answers: OnboardingAnswers, week: number): TrainingWeek {
  const workouts: DailyWorkout[] = [
    workout("absolute-beginner", answers, week, "Monday", "Full Body Strength A", "Strength and movement foundation", 50, "moderate", [
      { title: "Full Body Strength", items: absoluteBeginnerStrength(week) },
      stationBlock("absolute-beginner", week),
      { title: "Breathing", items: breathingProtocol.slice(0, 4) }
    ]),
    workout("absolute-beginner", answers, week, "Wednesday", "Aerobic Engine + Station Introduction", "Build aerobic base and learn station mechanics", 55, "easy", [
      { title: "Run / Walk-Run", items: [absoluteBeginnerRun(week), "Target pace is conversational; if you cannot speak a full sentence, slow down."] },
      { title: "Station Technique Focus", items: absoluteBeginnerStationIntro(week) },
      stationBlock("absolute-beginner", week)
    ], { targetPace: { shared: "Conversational walk-jog" }, targetHeartRate: "Zone 2, below 70% max HR" })
  ];

  if (week >= 7 && answers.availableTrainingDays >= 4) {
    workouts.push(workout("absolute-beginner", answers, week, "Friday", "Optional Recovery Walk + Mobility", "Optional fourth day from week 7 onward", 30, "recovery", [
      { title: "Recovery", items: ["20-30 min light walking only", "Hip 90/90, pigeon pose, thoracic rotations, ankle circles", "Crocodile breathing 5 min and box breathing 5 min"] }
    ], { warmup: [], cooldown: [] }));
  }

  workouts.push(workout("absolute-beginner", answers, week, "Saturday", week >= 9 ? "Simple Simulation / Long Easy Effort" : "Long Easy Effort", "Build time on feet and aerobic capacity", week <= 3 ? 30 : week <= 6 ? 40 : week <= 9 ? 55 : week <= 11 ? 45 : 30, week >= 9 ? "moderate" : "easy", [
    { title: "Long Effort", items: [
      week <= 3 ? "30 min easy walk with occasional jogging." : week <= 6 ? "40 min walk-jog; jog as much as feels comfortable." : week <= 9 ? "50 min easy continuous jog or 60 min walk-jog." : week <= 11 ? "45 min easy jog. Practice row 200m then run 500m." : "30 min easy jog only.",
      "Zone 2 only. Conversational. Heart rate below 70% max."
    ] },
    stationBlock("absolute-beginner", week)
  ]));

  return makeWeek("absolute-beginner", week, workouts);
}

function beginnerLower(week: number) {
  return [
    week <= 4 ? "Goblet squat 3x10 moderate DB. Transfer: wall ball depth, sled push posture, running leg cycles." : week <= 8 ? "Barbell back squat 4x8 at 60-70%. Break parallel, chest up, drive through entire foot." : "Barbell back squat 4x6 at 70-80%.",
    week <= 4 ? "DB Romanian deadlift 3x10." : week <= 8 ? "Barbell Romanian deadlift 3x10 moderate." : "Barbell Romanian deadlift 3x8 heavier.",
    week <= 4 ? "Bulgarian split squat 3x10 each side bodyweight." : week <= 8 ? "Bulgarian split squat 3x10 each side light DBs." : "Bulgarian split squat 3x8 each side heavier DBs.",
    week <= 6 ? "Hip thrust 3x12 bodyweight or lightly loaded." : "Hip thrust 3x10 barbell loaded.",
    week <= 4 ? "Farmer carry finisher 3x50m heavy." : week <= 8 ? "Farmer carry finisher 3x75m heavy." : "Farmer carry finisher 3x100m heavy.",
    "After gym: 10 min easy run or 15 min walk."
  ];
}

function beginnerUpper(week: number) {
  return [
    week <= 4 ? "Incline DB bench press 3x10." : week <= 8 ? "Incline DB bench press 3x8." : "Incline DB bench press 4x6.",
    week <= 4 ? "Bent-over DB row 3x10 each side." : week <= 8 ? "Bent-over DB row 3x8 each side." : "Bent-over DB row 4x8 each side heavier.",
    week <= 4 ? "DB shoulder press 3x10." : "DB shoulder press 3x8.",
    "Face pulls 3x15 every week, zero exceptions.",
    "External rotation with cable or band 3x15 each side every week."
  ];
}

function beginnerConditioning(week: number) {
  if (week <= 3) return ["3 rounds: 300m row -> 10 wall balls (6kg) -> 400m easy run.", "Full 3 min rest between rounds."];
  if (week <= 6) return ["3 rounds: 400m row -> 15 wall balls (6kg) -> 500m run at moderate effort.", "2 min rest between rounds."];
  if (week <= 9) return ["3 rounds: 500m SkiErg -> 20 wall balls (9kg) -> 500m run.", "Alternative: 500m row -> 20 burpee broad jumps -> 500m run.", "2 min rest."];
  if (week <= 11) return ["4 rounds: 500m SkiErg or row -> 25 wall balls -> 500m at race-target pace.", "90 sec rest only."];
  return ["Taper: skip conditioning block. Gym only, 45 min."];
}

function beginnerRun(week: number) {
  if (week <= 3) return ["30 min continuous easy run. Walk-jog if needed until continuous running is possible.", "Conversational pace only."];
  if (week <= 6) return ["40 min continuous Zone 2 run.", "Finish with 4x20 sec strides, faster than easy but not sprinting."];
  if (week <= 9) return ["10 min easy warmup.", "4x4 min hard but sustainable threshold; 3 min easy jog between.", "10 min easy cooldown."];
  if (week <= 11) return ["10 min easy.", "3x8 min at target race pace effort; 4 min easy between.", "10 min cooldown."];
  return ["20 min easy jog only."];
}

function beginnerSaturday(week: number) {
  if (week <= 4) return ["45-60 min easy aerobic effort: run, bike, row, or mixed low-intensity work."];
  if (week === 5) return ["First simple simulation: 4 stations (SkiErg, sled push, burpee, row) at reduced distance with 500m run between each.", "Record total time."];
  if (week === 6) return ["60 min run with station stops: run 1km, perform 20 wall balls, continue running.", "Do not chase race distances."];
  if (week === 7) return ["Second simple simulation: 6 stations at 50-75% distance with 500m runs."];
  if (week <= 9) return ["70% HYROX simulation: all 8 stations at 50-75% race distance with 1km runs between.", "Record time."];
  if (week === 10) return ["85% simulation: stations at 75-90% race distance, 1km runs, race-format completion."];
  if (week === 11) return ["45 min easy effort only. Let the body absorb prior work."];
  return ["Rest."];
}

function buildBeginnerWeek(answers: OnboardingAnswers, week: number): TrainingWeek {
  const workouts = [
    workout("beginner", answers, week, "Monday", "Lower Body Strength + Short Run", "Leg and posterior-chain capacity for stations and running", 60, "moderate", [
      { title: "Lower Body Strength", items: beginnerLower(week) },
      stationBlock("beginner", week)
    ]),
    workout("beginner", answers, week, "Wednesday", "Upper Body Strength + HYROX Conditioning", "Upper strength and compromised running skill", week === 12 ? 45 : 85, week === 12 ? "moderate" : "moderate-hard", [
      { title: "Upper Body Strength", items: beginnerUpper(week) },
      { title: "HYROX Conditioning Block", items: beginnerConditioning(week), timer: { mode: "station", rounds: week <= 6 ? 3 : week <= 11 ? 4 : 1 } },
      stationBlock("beginner", week)
    ]),
    workout("beginner", answers, week, "Friday", "Running Session", "Zone 2, threshold, or race-pace rehearsal", week === 12 ? 25 : 65, week <= 6 || week === 12 ? "easy" : "hard", [
      { title: "Run", items: beginnerRun(week) },
      { title: "Breathing Protocol", items: breathingProtocol }
    ], { targetPace: { shared: "Beginner race target 5:45-6:30/km when prescribed" } }),
    workout("beginner", answers, week, "Saturday", "Long Session / Simulation", "Aerobic capacity and progressive race-format practice", week <= 4 ? 55 : week === 12 ? 20 : 85, week <= 4 || week >= 11 ? "easy" : "hard", [
      { title: "Saturday Prescription", items: beginnerSaturday(week) },
      stationBlock("beginner", week)
    ], { warmup: week === 12 ? [] : undefined })
  ];
  return makeWeek("beginner", week, workouts);
}

function moderateLower(week: number) {
  return [
    week <= 4 ? "Back squat 4x6 at 70%." : week <= 8 ? "Back squat 4x5 at 75-80%." : "Back squat 4x4 at 80-85%.",
    week <= 4 ? "Romanian deadlift 3x8." : week <= 8 ? "Romanian deadlift 3x8 heavier." : "Romanian deadlift 3x6 heavy.",
    week <= 6 ? "Bulgarian split squat 3x10 each side with DBs." : "Bulgarian split squat 3x8 each side heavier.",
    week <= 4 ? "Hip thrust 3x10 moderate." : week <= 8 ? "Hip thrust 3x10 heavier." : "Hip thrust 3x8 heavy."
  ];
}

function moderateSessionC(week: number) {
  const rounds = week <= 4 ? 2 : week <= 11 ? 3 : 1;
  return [
    "Cash in: 1km run at target race pace.",
    `Per round (${rounds} rounds): row erg -> wall balls -> burpee broad jumps -> kettlebell swings -> sandbag lunges -> farmer carry -> 1km compromised run with zero rest off carry.`,
    "Cash out: 1km run at max sustainable pace.",
    week <= 4 ? "Progressions: row 500m, wall balls 20/6kg to 30/9kg, burpees 15-25m, KB swings 15/16kg, lunges 20m/15kg, farmer carry 50m/20kg." : week <= 8 ? "Progressions: row 750m, wall balls 50/9kg, burpees 40-60m, KB swings 20/24kg, lunges 60m/20kg, farmer carry 100-150m/22-24kg." : "Progressions: row 1000m, wall balls 60-100/9kg, burpees 80m, KB swings 20/24kg, lunges 100m/20kg, farmer carry 200m/24kg."
  ];
}

function moderateRun(week: number) {
  if (week <= 3) return ["10 min easy warmup.", "4x5 min threshold; 3 min easy jog rest.", "10 min cooldown."];
  if (week <= 6) return ["10 min warmup.", "3x8 min threshold; 4 min rest.", "10 min cooldown."];
  if (week <= 8) return ["10 min warmup.", "2x12 min threshold; 5 min rest.", "10 min cooldown."];
  if (week <= 10) return ["10 min warmup.", "6x2 min at 90-95% max effort; 2 min jog rest.", "10 min cooldown."];
  return ["3x1km at race pace, 90 sec rest. Taper into race week."];
}

function moderateUpper(week: number) {
  return [
    week <= 4 ? "Barbell bent-over row 4x8." : week <= 8 ? "Barbell bent-over row 4x6." : "Barbell bent-over row 4x5.",
    week <= 4 ? "Weighted pull-ups 4x6 bodyweight, or lat pulldown." : week <= 8 ? "Weighted pull-ups 4x5 with 5kg." : "Weighted pull-ups 4x5 with 10kg.",
    week <= 4 ? "Incline barbell bench press 4x8." : week <= 8 ? "Incline barbell bench press 4x6." : "Incline barbell bench press 4x5.",
    "Face pulls 3x15 every week.",
    "External rotation 3x15 each side every week.",
    week <= 4 ? "DB farmer carry holds 3x45 sec heavy." : "DB farmer carry holds 3x60 sec heavy."
  ];
}

function moderateSessionB(week: number) {
  const rounds = week <= 4 ? 2 : 3;
  return [
    "Cash in: 1km run at race pace target.",
    `Per round (${rounds} rounds): SkiErg -> sled pull -> row erg -> 400m run with no rest off the rower.`,
    "Cash out: 1km run at race pace.",
    week <= 2 ? "Ski 300m, sled pull 60kg, row 300m, run 30-40 sec/km slower than race pace." : week <= 4 ? "Ski 400m, sled pull 80kg, row 400m, run 30-40 sec/km slower than race pace." : week <= 6 ? "Ski 500m, sled pull 103kg, row 500m, run at race pace." : week <= 8 ? "Ski 750m, sled pull 103kg, row 750m, run at race pace." : "Ski 1000m, sled pull 103kg, row 1000m, run at race pace."
  ];
}

function moderateSessionA(week: number) {
  const rounds = week <= 4 ? 2 : week <= 11 ? 3 : 1;
  return [
    "Gym primer: incline barbell bench press, weighted dips, face pulls.",
    "Cash in: 500m assault bike or 500m row sprint.",
    `Per round (${rounds} rounds): sled push -> burpee broad jump -> 400m run -> optional 10 devil press with moderate DBs.`,
    "Cash out: 500m assault bike or row sprint.",
    week <= 2 ? "Sled 80kg, BBJ 15m." : week <= 4 ? "Sled 100kg, BBJ 25m." : week <= 6 ? "Sled 120kg, BBJ 40m." : week <= 8 ? "Sled 140kg, BBJ 60m." : "Sled 152kg, BBJ 80m.",
    week <= 6 ? "Short run after: 15 min easy Zone 2." : week <= 11 ? "Short run after: 20 min with 10 min easy + 3x30 sec strides." : "Week 12: skip the short run."
  ];
}

function moderateSaturday(week: number) {
  if (week <= 3) return ["45-55 min Zone 2 run, HR below 70% max."];
  if (week === 4) return ["Deload: 40 min easy run, no intensity."];
  if (week === 5) return ["50% HYROX simulation: all 8 stations at 50% race distance, 1km runs between."];
  if (week === 6) return ["60 min Zone 2 run with 6x30 sec strides at the end."];
  if (week === 7) return ["70% simulation: all stations at 70% race distance, 1km runs, record every split."];
  if (week === 8) return ["Deload: 45 min easy Zone 2."];
  if (week === 9) return ["90% simulation: all stations at 90% race distance, 1km runs, full race effort, record splits."];
  if (week === 10) return ["45 min easy run + 4x1km at race pace."];
  if (week === 11) return ["40 min easy run only. No simulation."];
  return ["Race week: rest or 15 min walk."];
}

function buildModerateWeek(answers: OnboardingAnswers, week: number): TrainingWeek {
  const workouts = [
    workout("moderate", answers, week, "Monday", "Lower Body Strength + Session C", "Leg strength before full station circuit", 85, week === 4 || week === 8 || week === 12 ? "moderate" : "hard", [
      { title: "Lower Body Strength", items: moderateLower(week) },
      { title: "Moderate Station Circuit (Session C)", items: moderateSessionC(week), timer: { mode: "station", rounds: week <= 4 ? 2 : week <= 11 ? 3 : 1 } },
      stationBlock("moderate", week)
    ]),
    workout("moderate", answers, week, "Tuesday", "Running Quality Session", "Threshold or VO2 running development", 65, week === 12 ? "moderate" : "hard", [
      { title: "Run", items: moderateRun(week), timer: { mode: "interval", rounds: week <= 3 ? 4 : week <= 6 ? 3 : week <= 8 ? 2 : 6 } },
      { title: "Breathing Protocol", items: breathingProtocol }
    ], { targetPace: { shared: "Moderate race target 5:00-5:20/km" } }),
    workout("moderate", answers, week, "Wednesday", "Upper Body Strength + Session B", "Pulling muscles before SkiErg, sled pull, and row", 85, week === 4 || week === 8 || week === 12 ? "moderate" : "hard", [
      { title: "Upper Body Strength", items: moderateUpper(week) },
      { title: "Session B Modified", items: moderateSessionB(week), timer: { mode: "station", rounds: week <= 4 ? 2 : 3 } },
      stationBlock("moderate", week)
    ]),
    workout("moderate", answers, week, "Thursday", "Active Recovery + Mobility", "Required downshift to sustain the week", 40, "recovery", [
      { title: "Recovery", items: ["10 min foam roll: IT band, glutes, thoracic spine, calves, hip flexors.", "10 min mobility: hip 90/90, pigeon pose, thoracic rotation, ankle circles.", "10 min breathing: crocodile breathing 5 min, box breathing 5 min.", "Optional 20 min easy walk or Zone 1 bike. Do not add intensity."] }
    ], { warmup: [], cooldown: [] }),
    workout("moderate", answers, week, "Friday", "Session A + Short Run", "Push muscles before sled push and burpee broad jumps", 75, week === 4 || week === 8 || week === 12 ? "moderate" : "hard", [
      { title: "Session A", items: moderateSessionA(week), timer: { mode: "station", rounds: week <= 4 ? 2 : week <= 11 ? 3 : 1 } },
      stationBlock("moderate", week)
    ]),
    workout("moderate", answers, week, "Saturday", "Long Run / Simulation", "Race-format rehearsal and aerobic base", week <= 4 || week >= 11 ? 45 : 95, week <= 4 || week >= 11 ? "easy" : "race", [
      { title: "Saturday Prescription", items: moderateSaturday(week) },
      stationBlock("moderate", week)
    ])
  ];
  return makeWeek("moderate", week, workouts);
}

function expertChest(week: number) {
  return [
    week <= 4 ? "Incline barbell bench press 4x8 at about 70%." : week <= 8 ? "Incline barbell bench press 4x6 at about 80%." : "Incline barbell bench press 4x5 at about 85%.",
    "Cue: retract scapula before unracking, bar to mid-chest, elbows 45-60 degrees, full lockout, 3 sec descent.",
    week <= 4 ? "Weighted dips 3x10 bodyweight." : week <= 8 ? "Weighted dips 3x8 with 5kg." : "Weighted dips 3x6 with 10kg.",
    "Cue: slight forward lean, lower until upper arm is parallel, full lockout, controlled descent.",
    "Face pulls 3x15 every week, zero exceptions. Cable at face height, elbows high, hands beside ears."
  ];
}

function expertSessionA(week: number) {
  const rounds = week <= 4 ? 3 : week <= 11 ? 4 : 2;
  return [
    "Cash in: 500m assault bike sprint; note time every week.",
    `Per round (${rounds} rounds): sled push -> burpee broad jump -> 400m run -> 12 devil press.`,
    "Cash out: 500m assault bike sprint; match or beat cash-in time.",
    week <= 2 ? "Sled 120kg, BBJ 20m, run 5:20/km, devil press 2x15kg." : week <= 4 ? "Sled 140kg, BBJ 20m, run 5:20/km, devil press 2x15kg." : week <= 8 ? "Sled 152kg, BBJ 40m, run 5:05/km, devil press 2x20kg." : week <= 10 ? "Sled 152kg, BBJ 60m, run 4:55/km, devil press 2x22.5kg." : week === 11 ? "Sled 152kg, BBJ 80m, run 4:55/km, devil press 2x22.5kg." : "Race week primer: sled push 2x20m race weight, run 4:50/km, do not fatigue.",
    "Rest: 30 sec between rounds only."
  ];
}

function expertBack(week: number) {
  return [
    week <= 4 ? "Barbell bent-over row 4x8." : week <= 8 ? "Barbell bent-over row 4x6." : "Barbell bent-over row 4x5.",
    "Cue: hinge 45 degrees, back flat, pull to lower ribs, elbows drive back, full stretch, no momentum.",
    week <= 4 ? "Weighted pull-ups 4x6 bodyweight." : week <= 8 ? "Weighted pull-ups 4x5 with 5kg." : "Weighted pull-ups 4x5 with 10kg.",
    "Cue: full dead hang, drive elbows down and back, chin clears bar, 3 sec lower.",
    week <= 4 ? "Single-arm DB row 3x10 each side." : "Single-arm DB row 3x8 each side, heavier.",
    week <= 4 ? "Farmer carry holds 3x45 sec." : week <= 8 ? "Farmer carry holds 3x60 sec heavy." : "Farmer carry holds 3x60 sec very heavy."
  ];
}

function expertSessionB(week: number) {
  const rounds = week <= 4 ? 3 : 4;
  return [
    "Cash in: 1km run at race pace target; time it every week.",
    `Per round (${rounds} rounds): SkiErg -> sled pull -> row erg -> 400m run with zero rest off rower.`,
    "Cash out: 1km run at race pace.",
    week <= 2 ? "Ski 500m technique, sled pull 80kg, row 500m at 2:10/500m, run 5:18/km." : week <= 4 ? "Ski 500m technique, sled pull 90-95kg, row 500-750m, run 5:18/km." : week <= 8 ? "Ski 750m sub-4:45/1000m effort, sled pull 103kg, row 750m at 2:04/500m, run 5:03/km." : "Ski 1000m full race distance, sled pull 103kg, row 1000m sub-2:00/500m, run 4:55/km.",
    "Coaching note: lats and upper back are pre-warmed from the gym; that is intentional."
  ];
}

function expertArms(week: number) {
  return [
    week <= 4 ? "EZ bar skullcrusher 4x10." : week <= 8 ? "EZ bar skullcrusher 4x8." : "EZ bar skullcrusher 3x8.",
    "Cue: upper arms vertical and still, lower to forehead, full extension, elbows do not flare.",
    week <= 4 ? "Barbell curl 4x10." : week <= 8 ? "Barbell curl 4x8." : "Barbell curl 3x8.",
    "Hammer curl: " + (week <= 4 ? "3x12 each side." : "3x10 each side."),
    "Reverse curl 3x12 every week for wrist extensor balance and elbow protection."
  ];
}

function expertSessionW(week: number) {
  if (week <= 4) return ["Wall ball / burpee pyramid: 10/10 -> 20/20 -> 30/30 -> 20/20 -> 10/10.", "6kg wall ball, 15 min."];
  if (week <= 8) return ["Same pyramid plus 500m SkiErg between each set.", "9kg wall ball, 22 min."];
  if (week <= 11) return ["Mini Jour 347: 500m SkiErg -> 25 wall balls -> 100m farmer carry -> 25 burpee broad jumps -> 500m row -> 1km run.", "Race weights throughout, 28-30 min."];
  return ["Skip Session W entirely. Arms gym only plus 15 min mobility."];
}

function expertLegs(week: number) {
  return [
    week <= 4 ? "Back squat 4x6." : week <= 8 ? "Back squat 4x5." : "Back squat 4x4 heavy.",
    "Cue: chest up, brace hard, knees track over toes, break parallel, drive through whole foot.",
    week <= 4 ? "Romanian deadlift 3x8." : week <= 8 ? "Romanian deadlift 3x8 heavier." : "Romanian deadlift 3x6 heavy.",
    week <= 4 ? "Bulgarian split squat 3x10 each side bodyweight." : week <= 8 ? "Bulgarian split squat 3x8 each side DBs." : "Bulgarian split squat 3x8 each side heavier DBs.",
    week <= 4 ? "Hip thrust 3x10 moderate." : week <= 8 ? "Hip thrust 3x10 heavier." : "Hip thrust 3x8 heavy."
  ];
}

function expertSessionC(week: number) {
  const rounds = week <= 4 ? 3 : week <= 8 ? 4 : week <= 10 ? 5 : week === 11 ? 1 : 2;
  return [
    "Cash in: 1km run at race pace target; time it.",
    `Per round (${rounds} rounds): row erg -> wall balls -> burpees to plate -> kettlebell swings -> sandbag lunges -> farmer carry -> 1km compromised run with zero rest off carry.`,
    "Cash out: 1km run at maximum sustainable pace; this tells you what is left after a full session.",
    week <= 4 ? "Progressions: row 500m, wall balls 30/6kg, burpees to plate 20, KB swings 20/24kg, lunges 20m/15kg, farmer carry 50m/20kg." : week <= 8 ? "Progressions: row 750m, wall balls 40-60/9kg, burpees 25, KB swings 20/32kg, lunges 60m/20kg, farmer carry 150m/24kg." : "Progressions: row 1000m, wall balls 80-100/9kg, burpees 30, KB swings 20/32kg, lunges 100m/20kg, farmer carry 200m/24kg.",
    "Compromised 1km run at race pace is the most important rep of the week."
  ];
}

function expertShoulders(week: number) {
  return [
    week <= 4 ? "Seated DB overhead press 4x10." : week <= 8 ? "Seated DB overhead press 4x8." : "Seated DB overhead press 4x6.",
    week <= 4 ? "Arnold press 3x12." : week <= 8 ? "Arnold press 3x10." : "Arnold press 3x8.",
    week <= 8 ? "Lateral raise 4x15." : "Lateral raise 4x12.",
    week <= 8 ? "Rear delt fly 4x15." : "Rear delt fly 4x12.",
    week <= 4 ? "Barbell shrug 3x15." : week <= 8 ? "Barbell shrug 3x12 heavy." : "Barbell shrug 3x10 heavy.",
    "External rotation 3x15 each side every week, no exceptions.",
    "Optional after gym: 30-40 min Zone 2 run if legs feel good; never pushed."
  ];
}

function expertSaturday(week: number) {
  if (week <= 3) return ["50-60 min Zone 2 run at 65-75% max HR, conversational."];
  if (week === 4) return ["Deload: 40 min easy Zone 2. No intensity."];
  if (week === 5) return ["50% HYROX simulation: all 8 stations at 50% race distance, full 1km runs, record splits."];
  if (week === 6) return ["60 min Zone 2 run."];
  if (week === 7) return ["Full HYROX Simulation: all 8 stations at race weight and distance, 1km runs between, 85% effort, record every split."];
  if (week === 8) return ["Deload: 60 min easy Zone 2."];
  if (week === 9) return ["90% simulation: all stations, all distances, race weight, 90-95% effort, treat like race day."];
  if (week === 10) return ["45 min run with 4x1km at race pace."];
  if (week === 11) return ["40 min easy run only."];
  return ["Full rest. Carb load 6-7g/kg, confirm race kit and sled weight, sleep 8+ hours."];
}

function buildExpertWeek(answers: OnboardingAnswers, week: number): TrainingWeek {
  const raceWeek = week === 12;
  const workouts = [
    workout("expert", answers, week, "Monday", "Chest Gym + Session A", "Push strength mechanically paired with sled push and burpee work", raceWeek ? 70 : 90, raceWeek ? "moderate" : "hard", [
      { title: "Chest Gym", items: expertChest(week) },
      { title: "Session A - Push + Sled", items: expertSessionA(week), timer: { mode: "station", rounds: week <= 4 ? 3 : week <= 11 ? 4 : 2 } },
      stationBlock("expert", week)
    ]),
    workout("expert", answers, week, "Tuesday", raceWeek ? "Back Gym + Race Pace Sharpening" : "Back Gym + Session B", "Pulling strength paired with SkiErg, sled pull, row, and run-off-row", raceWeek ? 75 : 100, "hard", [
      { title: "Back Gym", items: expertBack(week) },
      { title: raceWeek ? "Race Week Sharpening" : "Session B - Ski + Pull + Row", items: raceWeek ? ["3x1km at 4:50/km with 90 sec rest.", "Sled pull 2x20m only. Sharpen fast-twitch; do not fatigue."] : expertSessionB(week), timer: { mode: "station", rounds: raceWeek ? 3 : week <= 4 ? 3 : 4 } },
      stationBlock("expert", week)
    ]),
    workout("expert", answers, week, "Wednesday", "Arms Gym + Session W", "Triceps, biceps, forearm resilience, wall ball and burpee accumulation", raceWeek ? 60 : 70, raceWeek ? "moderate" : "moderate-hard", [
      { title: "Arms Gym", items: expertArms(week) },
      { title: "Session W", items: expertSessionW(week), timer: { mode: "countdown", durationSeconds: week <= 4 ? 900 : week <= 8 ? 1320 : 1800 } }
    ]),
    workout("expert", answers, week, "Thursday", raceWeek ? "Legs Gym + Station Walkthrough" : "Legs Gym + Session C", "Longest and hardest day: legs before full station circuit", raceWeek ? 70 : 130, raceWeek ? "moderate" : "race", [
      { title: "Legs Gym", items: expertLegs(week) },
      { title: raceWeek ? "Station Walkthrough" : "Session C - Full Station Circuit", items: raceWeek ? ["10 min station walkthrough at 30% effort.", "Form only, no intensity."] : expertSessionC(week), timer: { mode: "station", rounds: week <= 4 ? 3 : week <= 8 ? 4 : week <= 10 ? 5 : week === 11 ? 1 : 2 } },
      stationBlock("expert", week)
    ]),
    workout("expert", answers, week, "Friday", "Full Shoulders + Optional Zone 2", "Full shoulder volume and rotator cuff integrity", 60, "moderate", [
      { title: "Shoulders Gym", items: expertShoulders(week) },
      { title: "Race Week Note", items: raceWeek ? ["Zero HYROX. Final CNS rest day before the race."] : ["Optional Zone 2 run only if recovering well. Conversational pace."] }
    ]),
    workout("expert", answers, week, "Saturday", "Zone 2 Run / Simulation", "Saturday race-specific data session or aerobic base", week <= 4 || week >= 10 ? 50 : 115, week === 7 || week === 9 ? "race" : week === 12 ? "recovery" : "hard", [
      { title: "Saturday Prescription", items: expertSaturday(week) },
      stationBlock("expert", week)
    ], { warmup: week === 12 ? [] : undefined })
  ];
  return makeWeek("expert", week, workouts);
}

function makeWeek(level: TrainingLevel, week: number, workouts: DailyWorkout[]): TrainingWeek {
  return {
    week,
    phase: phaseForWeek(week),
    phaseTitle: phaseTitle(level, week),
    dateRange: `Week ${week} of 12`,
    intent: weekIntent(level, week),
    expectedTrainingLoad: weekLoad(level, week),
    recoveryEmphasis: week === 12
      ? "Race week: sleep, carb load, hydration, and no soreness chasing."
      : weekLoad(level, week) === "Reduced"
        ? "Deload priority: reduce volume 35-40%, keep movement quality high, and arrive hungry for the next block."
        : "Fuel hard days, keep easy days easy, protect sleep, track resting HR, and use breathing drills daily.",
    workouts
  };
}

function buildWeeks(level: TrainingLevel, answers: OnboardingAnswers) {
  return Array.from({ length: 12 }, (_, index) => {
    const week = index + 1;
    if (level === "absolute-beginner") return buildAbsoluteBeginnerWeek(answers, week);
    if (level === "beginner") return buildBeginnerWeek(answers, week);
    if (level === "moderate") return buildModerateWeek(answers, week);
    return buildExpertWeek(answers, week);
  });
}

function formatLabel(answers: OnboardingAnswers) {
  if (answers.raceCategory.includes("doubles")) return "Doubles";
  if (answers.raceCategory.includes("relay")) return "Relay";
  return "Individual";
}

export function generateTrainingPlan(answers: OnboardingAnswers): GeneratedTrainingPlan {
  const level = answers.trainingLevel;
  const meta = programMeta[level];
  const format = formatLabel(answers);
  const formatKey = format === "Doubles" ? "doubles" : "individual";
  const weeks = buildWeeks(level, answers);

  return {
    id: `plan-${level}-${answers.raceCategory}-${answers.goalRaceDate}`,
    title: `${levelLabels[level]} HYROX ${format} 12-Week Program`,
    level,
    raceCategory: answers.raceCategory,
    goalRaceDate: answers.goalRaceDate,
    targetGoalTime: answers.targetGoalTime,
    weeksUntilRace: 12,
    summary: [
      `${meta.title} for ${answers.name}.`,
      `Who it is for: ${meta.who}`,
      `Training architecture: ${meta.days}`,
      `Goal finish time: ${format === "Doubles" ? meta.goal.doubles : meta.goal.individual}.`,
      meta.philosophy
    ].join(" "),
    priorities: [
      "HYROX is a predictable fixed-format race; every session serves the 8 stations and 8 running legs.",
      ...meta.priorities,
      `Race goal: ${answers.targetGoalTime || meta.goal[formatKey]}.`,
      `Running paces: ${runningPaces[level].join(" ")}`,
      `Station progressions: SkiErg ${stationProgressions[level].ski.join(" -> ")}; Sled Push ${stationProgressions[level].sledPush.join(" -> ")}; Sled Pull ${stationProgressions[level].sledPull.join(" -> ")}; Burpee Broad Jump ${stationProgressions[level].burpee.join(" -> ")}; Row ${stationProgressions[level].row.join(" -> ")}; Farmer Carry ${stationProgressions[level].farmerCarry.join(" -> ")}; Sandbag Lunges ${stationProgressions[level].lunges.join(" -> ")}; Wall Ball ${stationProgressions[level].wallBall.join(" -> ")}.`,
      `Breathing protocol: ${breathingProtocol.join(" ")}`,
      `Nutrition protocol: ${nutritionProtocol.join(" ")}`,
      `Recovery protocol: ${recoveryProtocol.join(" ")}`,
      ...(format === "Doubles" ? [`Doubles strategy: ${doublesStrategy.join(" ")}`] : ["Solo strategy: control the first half, protect running pace, avoid Zone 5 mid-race, and finish progressively."])
    ],
    phases,
    weeks
  };
}
