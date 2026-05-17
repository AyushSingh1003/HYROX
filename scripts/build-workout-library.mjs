import { mkdir, writeFile } from "node:fs/promises";
import { allWorkouts } from "../packages/shared/dist/index.js";

const outDir = new URL("../docs/workout-library/", import.meta.url);

const sources = {
  pureGymUk: "https://www.puregym.com/blog/hyrox-training-plan/",
  bodySpec: "https://www.bodyspec.com/blog/post/the_ultimate_hyrox_training_guide",
  fitnessDrum: "https://fitnessdrum.com/12-week-hyrox-training-plan-for-beginners/",
  pureGymUs: "https://www.puregym.com/us/blog/hyrox-training-plan-a-free-workout-plan-to-get-hyrox-ready",
  vpa: "https://www.vpa.com.au/blogs/supplements/hyrox-training-plan"
};

const warmups = {
  easyRun: [
    "5 min brisk walk or easy jog",
    "Dynamic calves, hips, hamstrings, and thoracic rotations",
    "3 x 20 sec relaxed strides with walk-back recovery"
  ],
  hybrid: [
    "6-8 min easy run, bike, ski, or row",
    "Dynamic hips, ankles, thoracic rotations, leg swings, and arm circles",
    "2 light practice rounds of the first station movement",
    "3 full forced exhales before starting the first run"
  ],
  strength: [
    "5 min easy bike or row",
    "Glute bridges x 12, bodyweight squats x 10, inchworms x 5",
    "2 progressive warmup sets before the first loaded lift"
  ],
  station: [
    "5 min easy machine flush",
    "Station-specific technique reps at 30-40% effort",
    "Nasal breathing for the final 2 min before the main set"
  ]
};

const cooldown = [
  "5-8 min easy walk or machine flush",
  "Hip flexor, calf, quad, hamstring, and lat stretch",
  "5 deep belly breaths: 4 sec inhale, 2 sec hold, 6 sec exhale"
];

const sourceUrls = Object.values(sources);

function step(exercise, fields = {}) {
  return {
    exercise,
    sets: fields.sets ?? 1,
    reps: fields.reps ?? "",
    distance: fields.distance ?? "",
    time: fields.time ?? "",
    rest: fields.rest ?? "",
    rpe: fields.rpe ?? "",
    notes: fields.notes ?? ""
  };
}

function workout(input) {
  return {
    id: input.id,
    title: input.title,
    category: input.category,
    subcategory: input.subcategory,
    goal: input.goal,
    difficulty: input.difficulty,
    duration_minutes: input.duration_minutes,
    estimated_calories: input.estimated_calories,
    equipment: input.equipment,
    warmup: input.warmup,
    workout: input.workout,
    cooldown: input.cooldown ?? cooldown,
    scaling: input.scaling,
    progression: input.progression,
    coach_notes: input.coach_notes,
    source_urls: input.source_urls,
    inspired_by: input.inspired_by,
    tags: input.tags
  };
}

const scaling = {
  run: {
    beginner: ["Reduce run distance 20-40%", "Use conversational run-walk intervals", "Keep RPE below 6 until mechanics are stable"],
    intermediate: ["Use prescribed distance and RPE", "Cap pace fade at 5-8% across repeats"],
    advanced: ["Hold race pace or slightly faster", "Reduce rest before increasing speed"]
  },
  station: {
    beginner: ["Use 50-70% race load", "Break reps early before form fails", "Extend rest to preserve movement quality"],
    intermediate: ["Use 75-100% race load", "Plan short breaks before redline"],
    advanced: ["Use race load or 105-110% overload", "Keep transitions under 20 sec"]
  }
};

const library = [
  workout({
    id: "end-zone2-001",
    title: "Conversational 5K Builder",
    category: "endurance",
    subcategory: "zone_2",
    goal: "Build aerobic durability for the 8 HYROX running legs without accumulating station fatigue.",
    difficulty: "beginner",
    duration_minutes: 45,
    estimated_calories: 430,
    equipment: ["running route or treadmill"],
    warmup: warmups.easyRun,
    workout: [
      step("Zone 2 run", { distance: "5 km", rest: "none", rpe: "4-5", notes: "Hold a pace where full sentences are possible." }),
      step("Strides", { sets: 4, time: "20 sec", rest: "walk back", rpe: "6", notes: "Smooth turnover, not a sprint." })
    ],
    scaling: scaling.run,
    progression: { week_1: "30 min easy", week_2: "35 min easy", week_3: "40 min easy + 4 strides", week_4: "5 km easy + 4 strides" },
    coach_notes: ["Most athletes underperform HYROX because they run too hard too early.", "Zone 2 should leave you better after the session, not flattened."],
    source_urls: [sources.bodySpec, sources.fitnessDrum, sources.vpa],
    inspired_by: ["Public programming: weekly easy/Zone 2 running emphasis"],
    tags: ["aerobic_base", "running", "beginner"]
  }),
  workout({
    id: "end-zone2-002",
    title: "Long Run With Station Breathing Resets",
    category: "endurance",
    subcategory: "zone_2",
    goal: "Extend time on feet while rehearsing post-station breathing control.",
    difficulty: "intermediate",
    duration_minutes: 70,
    estimated_calories: 720,
    equipment: ["running route or treadmill"],
    warmup: warmups.easyRun,
    workout: [
      step("Zone 2 run", { time: "50-60 min", rpe: "4-5", notes: "Every 10 min, walk 30 sec and take 3 complete forced exhales." }),
      step("Technique strides", { sets: 6, time: "20 sec", rest: "60 sec walk", rpe: "6-7", notes: "Stay tall and quick, no sprinting." })
    ],
    scaling: scaling.run,
    progression: { week_1: "45 min", week_2: "50 min", week_3: "55 min", week_4: "60 min with 6 strides" },
    coach_notes: ["The breathing reset teaches the nervous system to downshift before the next station.", "Use this after a high-stress workday instead of forcing intervals."],
    source_urls: [sources.bodySpec, sources.vpa],
    inspired_by: ["Public programming: long aerobic runs and transition heart-rate drops"],
    tags: ["zone_2", "breathing", "race_skill"]
  }),
  workout({
    id: "end-interval-001",
    title: "1K Repeat Pace Lock",
    category: "endurance",
    subcategory: "intervals",
    goal: "Improve repeatable 1 km pacing for HYROX running legs.",
    difficulty: "intermediate",
    duration_minutes: 65,
    estimated_calories: 680,
    equipment: ["track or treadmill"],
    warmup: warmups.easyRun,
    workout: [
      step("1 km run", { sets: 6, distance: "1 km", rest: "2 min walk/jog", rpe: "7-8", notes: "Start 5-10 sec/km slower than target, finish controlled." })
    ],
    scaling: scaling.run,
    progression: { week_1: "4 x 1 km", week_2: "5 x 1 km", week_3: "6 x 1 km", week_4: "4 x 1 km with 90 sec rest" },
    coach_notes: ["If rep 1 is the fastest, you missed the session objective.", "The win is low split variance, not one heroic repeat."],
    source_urls: [sources.bodySpec, sources.pureGymUk, sources.pureGymUs],
    inspired_by: ["Public programming: 1 km repeat intervals and race-pace running"],
    tags: ["intervals", "race_pace", "running"]
  }),
  workout({
    id: "end-interval-002",
    title: "800m VO2 Control Set",
    category: "endurance",
    subcategory: "intervals",
    goal: "Raise speed reserve without turning the session into a sprint workout.",
    difficulty: "advanced",
    duration_minutes: 60,
    estimated_calories: 650,
    equipment: ["track or treadmill"],
    warmup: warmups.easyRun,
    workout: [
      step("800m run", { sets: 6, distance: "800m", rest: "2 min easy jog", rpe: "8-9", notes: "5K effort, relaxed shoulders, even splits." })
    ],
    scaling: scaling.run,
    progression: { week_1: "5 x 800m", week_2: "6 x 800m", week_3: "7 x 800m", week_4: "5 x 800m with sharper pacing" },
    coach_notes: ["Advanced athletes need speed reserve so race pace feels economical.", "Stop the set if mechanics collapse."],
    source_urls: [sources.bodySpec, sources.vpa],
    inspired_by: ["Public programming: VO2 and advanced interval phases"],
    tags: ["vo2", "advanced", "running"]
  }),
  workout({
    id: "end-tempo-001",
    title: "Steady Tempo Six",
    category: "endurance",
    subcategory: "tempo",
    goal: "Build sustained aerobic strength between Zone 2 and threshold.",
    difficulty: "intermediate",
    duration_minutes: 55,
    estimated_calories: 590,
    equipment: ["running route or treadmill"],
    warmup: warmups.easyRun,
    workout: [
      step("Tempo run", { distance: "6 km", rest: "none", rpe: "6", notes: "Controlled pressure: short phrases are possible, full conversation is not." })
    ],
    scaling: scaling.run,
    progression: { week_1: "4 km tempo", week_2: "5 km tempo", week_3: "6 km tempo", week_4: "5 km tempo + 4 strides" },
    coach_notes: ["Tempo is where many HYROX runs live after station fatigue.", "Do not drift into threshold unless prescribed."],
    source_urls: [sources.bodySpec, sources.vpa],
    inspired_by: ["Public programming: tempo run progression"],
    tags: ["tempo", "aerobic_strength"]
  }),
  workout({
    id: "end-threshold-001",
    title: "Cruise Threshold Builder",
    category: "endurance",
    subcategory: "threshold",
    goal: "Build lactate clearance for race-pace running under fatigue.",
    difficulty: "intermediate",
    duration_minutes: 70,
    estimated_calories: 740,
    equipment: ["track or treadmill"],
    warmup: warmups.easyRun,
    workout: [
      step("Threshold interval", { sets: 3, time: "8 min", rest: "4 min easy jog", rpe: "7-8", notes: "Hard but repeatable; no rep should feel like a race finish." })
    ],
    scaling: scaling.run,
    progression: { week_1: "4 x 5 min", week_2: "3 x 8 min", week_3: "2 x 12 min", week_4: "3 x 1 km race pace taper" },
    coach_notes: ["Threshold work is the bridge between pure running fitness and HYROX durability.", "Hold rhythm before chasing pace."],
    source_urls: [sources.fitnessDrum, sources.bodySpec],
    inspired_by: ["Public programming: threshold blocks and race-pace emphasis"],
    tags: ["threshold", "lactate", "running"]
  }),
  workout({
    id: "end-comp-001",
    title: "Run Wall Ball Repeatability",
    category: "endurance",
    subcategory: "compromised_runs",
    goal: "Practice returning to target pace after quad and breathing fatigue.",
    difficulty: "intermediate",
    duration_minutes: 60,
    estimated_calories: 700,
    equipment: ["wall ball", "running route or treadmill"],
    warmup: warmups.hybrid,
    workout: [
      step("Run", { sets: 4, distance: "1 km", rest: "0 sec before wall balls", rpe: "6-7", notes: "First 200m controlled; settle after breathing normalizes." }),
      step("Wall balls", { sets: 4, reps: "20-25", rest: "2 min after wall balls", rpe: "7", notes: "Break before misses; breathe on every catch." })
    ],
    scaling: scaling.station,
    progression: { week_1: "3 rounds, 15 wall balls", week_2: "4 rounds, 20 wall balls", week_3: "4 rounds, 25 wall balls", week_4: "3 rounds at race pace" },
    coach_notes: ["This is a race-skill session, not a wall-ball max test.", "The run after wall balls should look like running, not survival."],
    source_urls: [sources.bodySpec, sources.fitnessDrum],
    inspired_by: ["Public programming: run + station repeats"],
    tags: ["compromised_running", "wall_balls", "race_pace"]
  }),
  workout({
    id: "end-comp-002",
    title: "Run Erg Brick Ladder",
    category: "endurance",
    subcategory: "compromised_runs",
    goal: "Build tolerance to machine fatigue before running.",
    difficulty: "beginner",
    duration_minutes: 50,
    estimated_calories: 520,
    equipment: ["row erg", "ski erg or bike", "running route or treadmill"],
    warmup: warmups.hybrid,
    workout: [
      step("Run", { sets: 3, distance: "600m", rest: "0 sec", rpe: "5-6", notes: "Easy enough to protect form." }),
      step("Row", { sets: 3, distance: "300m", rest: "60 sec", rpe: "6", notes: "Legs first, then body, then arms." }),
      step("SkiErg or bike", { sets: 3, distance: "250m ski or 12 cal bike", rest: "2 min", rpe: "6", notes: "Smooth strokes, not max watts." })
    ],
    scaling: scaling.run,
    progression: { week_1: "3 rounds", week_2: "4 rounds", week_3: "4 rounds with 500m row", week_4: "3 rounds deload" },
    coach_notes: ["Beginners need exposure to the feeling of running after work before they need race loads.", "Keep the first month non-threatening."],
    source_urls: [sources.fitnessDrum, sources.bodySpec],
    inspired_by: ["Public programming: beginner bricks"],
    tags: ["beginner", "brick", "erg"]
  }),
  workout({
    id: "str-lower-001",
    title: "Sled Drive Lower Strength",
    category: "strength",
    subcategory: "lower_body",
    goal: "Build squat, hinge, and unilateral strength that transfers to sled push and lunges.",
    difficulty: "intermediate",
    duration_minutes: 60,
    estimated_calories: 430,
    equipment: ["barbell", "dumbbells", "sled optional"],
    warmup: warmups.strength,
    workout: [
      step("Back squat", { sets: 4, reps: "5-6", rest: "2-3 min", rpe: "7-8", notes: "Brace hard, whole foot pressure, break parallel." }),
      step("Romanian deadlift", { sets: 3, reps: "8", rest: "2 min", rpe: "7", notes: "Hips back, bar close, flat back." }),
      step("Bulgarian split squat", { sets: 3, reps: "8/side", rest: "90 sec", rpe: "7", notes: "Front shin stable, torso tall." }),
      step("Farmer carry", { sets: 4, distance: "40m", rest: "90 sec", rpe: "7-8", notes: "Tall posture, quiet shoulders." })
    ],
    scaling: scaling.station,
    progression: { week_1: "4x6 squat", week_2: "4x5 heavier", week_3: "4x4 heavier", week_4: "3x5 deload" },
    coach_notes: ["This strength day should make station work smoother, not destroy the next run session.", "Leave one rep in reserve on all main lifts."],
    source_urls: [sources.fitnessDrum, sources.bodySpec, sources.vpa],
    inspired_by: ["Internal program: lower strength + carries"],
    tags: ["lower_body", "sled_transfer", "strength"]
  }),
  workout({
    id: "str-upper-001",
    title: "Pulling Engine Strength",
    category: "strength",
    subcategory: "upper_body",
    goal: "Develop lats, upper back, and grip for SkiErg, sled pull, row, and farmer carry.",
    difficulty: "intermediate",
    duration_minutes: 55,
    estimated_calories: 390,
    equipment: ["barbell", "pull-up bar", "dumbbells", "cable or band"],
    warmup: warmups.strength,
    workout: [
      step("Barbell bent-over row", { sets: 4, reps: "6-8", rest: "2 min", rpe: "7-8", notes: "Pull to lower ribs; no torso swing." }),
      step("Pull-up or lat pulldown", { sets: 4, reps: "5-8", rest: "2 min", rpe: "7-8", notes: "Full reach and strong elbow drive." }),
      step("Single-arm dumbbell row", { sets: 3, reps: "8/side", rest: "90 sec", rpe: "7", notes: "Pull to hip; do not rotate." }),
      step("Farmer hold", { sets: 3, time: "45-60 sec", rest: "90 sec", rpe: "8", notes: "Use heavy DBs; posture stays tall." }),
      step("Face pull", { sets: 3, reps: "15", rest: "60 sec", rpe: "5", notes: "Shoulder health, not max load." })
    ],
    scaling: scaling.station,
    progression: { week_1: "4x8 rows", week_2: "4x6 heavier", week_3: "4x5 heavier + longer holds", week_4: "3x8 deload" },
    coach_notes: ["Grip usually fails before fitness on carries and pulls.", "Train shoulder health every week."],
    source_urls: [sources.bodySpec, sources.vpa],
    inspired_by: ["Internal expert plan: back + Session B logic"],
    tags: ["upper_body", "grip", "pulling"]
  }),
  workout({
    id: "str-full-001",
    title: "Beginner Full Body HYROX Foundation",
    category: "strength",
    subcategory: "full_body",
    goal: "Teach squat, hinge, pull, press, carry, and trunk control for new HYROX athletes.",
    difficulty: "beginner",
    duration_minutes: 50,
    estimated_calories: 360,
    equipment: ["dumbbells", "bench optional"],
    warmup: warmups.strength,
    workout: [
      step("Goblet squat", { sets: 3, reps: "10-12", rest: "90 sec", rpe: "5-6", notes: "Chest tall, thighs to parallel or below." }),
      step("Dumbbell Romanian deadlift", { sets: 3, reps: "10-12", rest: "90 sec", rpe: "5-6", notes: "Feel hamstrings, never round the back." }),
      step("One-arm dumbbell row", { sets: 3, reps: "10/side", rest: "60 sec", rpe: "6", notes: "Pull to hip." }),
      step("Seated dumbbell press", { sets: 3, reps: "10", rest: "90 sec", rpe: "6", notes: "Full lockout, ribs down." }),
      step("Farmer carry", { sets: 3, distance: "30-50m", rest: "90 sec", rpe: "6", notes: "Short, quick steps." }),
      step("Dead bug", { sets: 3, reps: "8/side", rest: "45 sec", rpe: "4", notes: "Lower back stays flat." })
    ],
    scaling: scaling.station,
    progression: { week_1: "3x10 light", week_2: "3x10 slightly heavier", week_3: "3x12", week_4: "3x10 deload" },
    coach_notes: ["Beginners need frequency and confidence more than volume.", "This session should be repeatable three times per week if needed."],
    source_urls: [sources.fitnessDrum, sources.bodySpec],
    inspired_by: ["Internal absolute beginner plan"],
    tags: ["beginner", "full_body", "foundation"]
  }),
  workout({
    id: "str-end-001",
    title: "Strength-Endurance Chipper",
    category: "strength",
    subcategory: "strength_endurance",
    goal: "Build muscular endurance across HYROX-relevant movement patterns.",
    difficulty: "intermediate",
    duration_minutes: 55,
    estimated_calories: 540,
    equipment: ["barbell", "dumbbells", "wall ball"],
    warmup: warmups.hybrid,
    workout: [
      step("Barbell push press", { reps: "25", rest: "90 sec", rpe: "7", notes: "Moderate load, crisp lockout." }),
      step("Burpee over bar", { reps: "20", rest: "90 sec", rpe: "7-8", notes: "Step down if breathing spikes too early." }),
      step("Bent-over row", { reps: "25", rest: "90 sec", rpe: "7", notes: "Use load you can move cleanly." }),
      step("Wall balls", { reps: "50", rest: "as needed", rpe: "8", notes: "Use planned sets, never fail reps." })
    ],
    scaling: scaling.station,
    progression: { week_1: "20 reps per strength move", week_2: "25 reps", week_3: "30 reps", week_4: "20 reps deload" },
    coach_notes: ["This style builds local fatigue resistance, but it must not replace race-specific running.", "Keep the load moderate and standards clean."],
    source_urls: [sources.pureGymUk, sources.pureGymUs],
    inspired_by: ["Public programming: strength endurance circuits"],
    tags: ["strength_endurance", "chipper"]
  }),
  workout({
    id: "str-sled-001",
    title: "Sled Push Pull Overload",
    category: "strength",
    subcategory: "sled_specific",
    goal: "Improve sled mechanics, force production, and recovery between sled efforts.",
    difficulty: "advanced",
    duration_minutes: 55,
    estimated_calories: 520,
    equipment: ["sled", "turf lane"],
    warmup: warmups.station,
    workout: [
      step("Sled push", { sets: 6, distance: "12-15m", rest: "walk back + 60 sec", rpe: "8", notes: "Use race load to 110% race load; short powerful steps." }),
      step("Sled pull", { sets: 6, distance: "12-15m", rest: "walk back + 60 sec", rpe: "8", notes: "Lean back, rope organized, hand-over-hand rhythm." }),
      step("Easy run flush", { sets: 6, distance: "200m", rest: "as needed", rpe: "4-5", notes: "Run immediately after each push/pull pair." })
    ],
    scaling: scaling.station,
    progression: { week_1: "6 x 10m at 90%", week_2: "6 x 12m at 100%", week_3: "6 x 15m at 105-110%", week_4: "4 x 10m at 80%" },
    coach_notes: ["Sled gains come from clean force application, not panic pushing.", "The easy run teaches you to restore mechanics after heavy leg drive."],
    source_urls: [sources.bodySpec, sources.fitnessDrum],
    inspired_by: ["Public programming: sled EMOM/overload concepts"],
    tags: ["sled", "overload", "race_specific"]
  }),
  workout({
    id: "fun-wall-001",
    title: "Wall Ball Capacity EMOM",
    category: "functional",
    subcategory: "wall_balls",
    goal: "Build repeatable wall-ball sets without failed reps.",
    difficulty: "intermediate",
    duration_minutes: 35,
    estimated_calories: 330,
    equipment: ["wall ball", "target"],
    warmup: warmups.station,
    workout: [
      step("Wall balls", { sets: 12, reps: "10-15 per min", time: "EMOM 12 min", rest: "remainder of each minute", rpe: "7", notes: "Choose a number you can repeat without no-reps." }),
      step("Easy jog", { time: "8 min", rpe: "4", notes: "Flush quads and restore breathing." })
    ],
    scaling: scaling.station,
    progression: { week_1: "10/min", week_2: "12/min", week_3: "15/min", week_4: "8-10/min deload" },
    coach_notes: ["Wall-ball readiness is repeatability, not one huge set.", "Break before your squat depth disappears."],
    source_urls: [sources.bodySpec, sources.vpa],
    inspired_by: ["Public programming: wall-ball volume accumulation"],
    tags: ["wall_balls", "emom", "capacity"]
  }),
  workout({
    id: "fun-carry-001",
    title: "Carry Grip Ladder",
    category: "functional",
    subcategory: "farmer_carries",
    goal: "Develop grip endurance and posture for the 200m carry.",
    difficulty: "intermediate",
    duration_minutes: 40,
    estimated_calories: 360,
    equipment: ["dumbbells or kettlebells"],
    warmup: warmups.station,
    workout: [
      step("Farmer carry", { sets: 4, distance: "50m", rest: "60 sec", rpe: "7", notes: "No drops, tall posture." }),
      step("Farmer carry", { sets: 3, distance: "75m", rest: "90 sec", rpe: "8", notes: "Use same load; relax jaw and shoulders." }),
      step("Farmer hold", { sets: 2, time: "max quality hold", rest: "2 min", rpe: "8-9", notes: "Stop before posture collapses." })
    ],
    scaling: scaling.station,
    progression: { week_1: "50m repeats", week_2: "75m repeats", week_3: "100m repeats", week_4: "50m deload" },
    coach_notes: ["Grip work should build confidence, not tear your hands before pull sessions.", "Fast walking with no drops beats reckless jogging."],
    source_urls: [sources.pureGymUk, sources.bodySpec],
    inspired_by: ["Public programming: grip and carry emphasis"],
    tags: ["farmer_carry", "grip"]
  }),
  workout({
    id: "fun-burpee-001",
    title: "Burpee Broad Jump Rhythm Builder",
    category: "functional",
    subcategory: "burpees",
    goal: "Build sustainable burpee broad jump rhythm and soft landings.",
    difficulty: "beginner",
    duration_minutes: 35,
    estimated_calories: 360,
    equipment: ["floor space"],
    warmup: warmups.station,
    workout: [
      step("Burpee broad jumps", { sets: 5, reps: "8-12", rest: "90 sec", rpe: "6-7", notes: "Stand fully, jump only as far as you can repeat, land soft." }),
      step("Easy run", { sets: 5, distance: "200m", rest: "walk 60 sec", rpe: "5", notes: "Start the run controlled after each set." })
    ],
    scaling: scaling.station,
    progression: { week_1: "5x8", week_2: "5x10", week_3: "5x12", week_4: "4x8 deload" },
    coach_notes: ["Small repeatable jumps beat early hero jumps.", "The first 50m after burpees is where form discipline matters."],
    source_urls: [sources.fitnessDrum, sources.pureGymUk],
    inspired_by: ["Public programming: burpee broad jump bricks"],
    tags: ["burpees", "movement_quality"]
  }),
  workout({
    id: "fun-lunge-001",
    title: "Sandbag Lunge Progression",
    category: "functional",
    subcategory: "lunges",
    goal: "Prepare legs and trunk for the 100m sandbag lunge station.",
    difficulty: "intermediate",
    duration_minutes: 45,
    estimated_calories: 420,
    equipment: ["sandbag or dumbbells"],
    warmup: warmups.station,
    workout: [
      step("Sandbag walking lunges", { sets: 4, distance: "25m", rest: "90 sec", rpe: "7", notes: "Torso upright, rear knee controlled, breathe every rep." }),
      step("Easy run", { sets: 4, distance: "400m", rest: "2 min", rpe: "5-6", notes: "No surging after lunges." })
    ],
    scaling: scaling.station,
    progression: { week_1: "4x20m", week_2: "4x25m", week_3: "3x40m", week_4: "2x25m deload" },
    coach_notes: ["Lunges punish rushed breathing and sloppy trunk position.", "Race-day success is stable reps, not fast no-reps."],
    source_urls: [sources.fitnessDrum, sources.vpa],
    inspired_by: ["Public programming: lunge progression and station density"],
    tags: ["lunges", "sandbag", "compromised_running"]
  }),
  workout({
    id: "fun-ski-001",
    title: "SkiErg Technique Density",
    category: "functional",
    subcategory: "ski_erg",
    goal: "Improve efficient SkiErg strokes under mild fatigue.",
    difficulty: "beginner",
    duration_minutes: 35,
    estimated_calories: 330,
    equipment: ["SkiErg"],
    warmup: warmups.station,
    workout: [
      step("SkiErg", { sets: 6, distance: "250m", rest: "75 sec", rpe: "5-6", notes: "Long reach, lats first, hinge as handles pass face." }),
      step("Plank", { sets: 6, time: "30 sec", rest: "30 sec", rpe: "5", notes: "Brace without breath holding." })
    ],
    scaling: scaling.station,
    progression: { week_1: "6x250m", week_2: "5x300m", week_3: "4x400m", week_4: "4x250m deload" },
    coach_notes: ["Technique beats brute force on the SkiErg.", "Watch stroke power fade; switch or rest before the movement becomes arms-only."],
    source_urls: [sources.bodySpec, sources.fitnessDrum],
    inspired_by: ["Public programming: SkiErg technique and calories"],
    tags: ["ski_erg", "technique"]
  }),
  workout({
    id: "fun-row-001",
    title: "Row Stroke Economy",
    category: "functional",
    subcategory: "row_erg",
    goal: "Build row efficiency so the station does not damage the next run.",
    difficulty: "intermediate",
    duration_minutes: 40,
    estimated_calories: 390,
    equipment: ["RowErg"],
    warmup: warmups.station,
    workout: [
      step("Row", { sets: 5, distance: "500m", rest: "90 sec", rpe: "6-7", notes: "Legs-body-arms; recover arms-body-legs. Keep strokes long." }),
      step("Run", { sets: 5, distance: "200m", rest: "90 sec", rpe: "5", notes: "Stand tall before running; no panic first 50m." })
    ],
    scaling: scaling.run,
    progression: { week_1: "5x400m", week_2: "5x500m", week_3: "3x750m", week_4: "4x400m deload" },
    coach_notes: ["The row is not won in the first 250m.", "A controlled exit matters as much as the split."],
    source_urls: [sources.bodySpec, sources.pureGymUk],
    inspired_by: ["Public programming: row/run alternation"],
    tags: ["row_erg", "technique", "run_off_row"]
  }),
  workout({
    id: "fun-station-001",
    title: "Eight-Station Skill Flow",
    category: "functional",
    subcategory: "station_skill",
    goal: "Practice all HYROX movement patterns at low pressure.",
    difficulty: "beginner",
    duration_minutes: 50,
    estimated_calories: 460,
    equipment: ["SkiErg", "sled", "rower", "wall ball", "sandbag", "dumbbells"],
    warmup: warmups.hybrid,
    workout: [
      step("SkiErg", { distance: "250m", rpe: "5", notes: "Technique only." }),
      step("Sled push", { distance: "15m", rpe: "5", notes: "Light load, clean body angle." }),
      step("Sled pull", { distance: "15m", rpe: "5", notes: "Rope organized." }),
      step("Burpee broad jump", { distance: "20m", rpe: "5-6", notes: "Soft landings." }),
      step("Row", { distance: "250m", rpe: "5", notes: "Long strokes." }),
      step("Farmer carry", { distance: "50m", rpe: "6", notes: "No drops." }),
      step("Sandbag lunges", { distance: "20m", rpe: "6", notes: "Upright torso." }),
      step("Wall balls", { reps: "20", rpe: "6", notes: "Break before misses." })
    ],
    scaling: scaling.station,
    progression: { week_1: "1 round", week_2: "1 round + 200m runs between 4 stations", week_3: "2 rounds reduced", week_4: "1 round deload" },
    coach_notes: ["This is the safest way to teach the full race menu.", "Technique exposure reduces race-day anxiety."],
    source_urls: [sources.fitnessDrum, sources.vpa],
    inspired_by: ["Public programming: station technique phases"],
    tags: ["station_skill", "beginner", "all_stations"]
  }),
  workout({
    id: "race-comp-001",
    title: "Four-Station Compromised Primer",
    category: "race_simulation",
    subcategory: "compromised",
    goal: "Introduce race order without full simulation cost.",
    difficulty: "beginner",
    duration_minutes: 60,
    estimated_calories: 640,
    equipment: ["SkiErg", "sled", "rower", "running route or treadmill"],
    warmup: warmups.hybrid,
    workout: [
      step("Run + SkiErg", { sets: 1, distance: "500m run + 500m ski", rest: "2 min", rpe: "6", notes: "Control transitions." }),
      step("Run + Sled push", { sets: 1, distance: "500m run + 25m push", rest: "2 min", rpe: "6-7", notes: "Light to moderate load." }),
      step("Run + Burpee broad jump", { sets: 1, distance: "500m run + 30m BBJ", rest: "2 min", rpe: "6-7", notes: "Small repeatable jumps." }),
      step("Run + Row", { sets: 1, distance: "500m run + 500m row", rest: "cooldown", rpe: "6", notes: "Record total time." })
    ],
    scaling: scaling.station,
    progression: { week_1: "500m runs and 50% station volume", week_2: "750m runs", week_3: "1km runs", week_4: "repeat week 2 faster" },
    coach_notes: ["This is a confidence builder.", "Record transition time, not just station time."],
    source_urls: [sources.fitnessDrum, sources.pureGymUk, sources.pureGymUs],
    inspired_by: ["Public programming: half simulation and first four stations"],
    tags: ["partial_order", "simulation_intro"]
  }),
  workout({
    id: "race-partial-001",
    title: "50 Percent HYROX Format",
    category: "race_simulation",
    subcategory: "partial_simulation",
    goal: "Run the full race order at half station volume to learn pacing and transitions.",
    difficulty: "intermediate",
    duration_minutes: 85,
    estimated_calories: 950,
    equipment: ["full HYROX station setup"],
    warmup: warmups.hybrid,
    workout: [
      step("HYROX race order", { sets: 1, distance: "8 x 1km runs + all 8 stations at 50% volume", rest: "transition only", rpe: "7", notes: "Use race order; record every split." })
    ],
    scaling: scaling.station,
    progression: { week_1: "50% volume", week_2: "60% volume", week_3: "70% volume", week_4: "50% deload" },
    coach_notes: ["Half-volume simulations reveal pacing mistakes without crushing recovery.", "If transitions are messy here, they will be worse on race day."],
    source_urls: [sources.bodySpec, sources.fitnessDrum, sources.pureGymUk],
    inspired_by: ["Public programming: partial simulations"],
    tags: ["partial_simulation", "race_order", "splits"]
  }),
  workout({
    id: "race-full-001",
    title: "Controlled Full HYROX Simulation",
    category: "race_simulation",
    subcategory: "full_simulation",
    goal: "Complete all 8 stations and 8 running legs under controlled race rules.",
    difficulty: "advanced",
    duration_minutes: 120,
    estimated_calories: 1400,
    equipment: ["full HYROX station setup"],
    warmup: [
      "10 min easy jog",
      "Dynamic prep: hips, ankles, thoracic spine, shoulders",
      "One 30% effort practice set for each station",
      "Race shoes, fuel, hydration, and transitions exactly as planned"
    ],
    workout: [
      step("Full HYROX simulation", { sets: 1, distance: "8 x 1km runs + all 8 stations", rest: "transition only", rpe: "8-9", notes: "Target 85-90% race effort unless this is the final benchmark." })
    ],
    cooldown: [
      "10 min continuous walk",
      "Protein + carbohydrates within 45 min",
      "Legs elevated 20 min",
      "Record splits, transition delays, fueling notes, and weakest station"
    ],
    scaling: scaling.station,
    progression: { week_1: "70% simulation", week_2: "full simulation at 85%", week_3: "90% simulation", week_4: "taper, no full simulation" },
    coach_notes: ["Do not prove fitness every weekend; full simulations are expensive.", "One high-quality full simulation beats several sloppy maximal rehearsals."],
    source_urls: [sources.bodySpec, sources.pureGymUk, sources.vpa],
    inspired_by: ["Public programming: full simulation timing and taper placement"],
    tags: ["full_simulation", "advanced", "race_rehearsal"]
  }),
  workout({
    id: "race-rehearsal-001",
    title: "Transition Discipline Rehearsal",
    category: "race_simulation",
    subcategory: "race_rehearsal",
    goal: "Reduce wasted time and heart-rate spikes between stations.",
    difficulty: "intermediate",
    duration_minutes: 50,
    estimated_calories: 520,
    equipment: ["SkiErg", "rower", "wall ball", "farmer carry implements"],
    warmup: warmups.hybrid,
    workout: [
      step("Run to station entry", { sets: 6, distance: "300m", rest: "0 sec", rpe: "6", notes: "Last 30m includes nasal breathing and visualizing station split." }),
      step("Station micro-dose", { sets: 6, reps: "10-15 reps or 100-200m", rest: "0 sec", rpe: "6-7", notes: "Rotate ski, row, wall ball, carry." }),
      step("Exit run", { sets: 6, distance: "200m", rest: "90 sec", rpe: "6", notes: "First 50m controlled, then settle to target rhythm." })
    ],
    scaling: scaling.run,
    progression: { week_1: "4 transitions", week_2: "6 transitions", week_3: "8 transitions", week_4: "4 transitions deload" },
    coach_notes: ["Free speed comes from knowing what happens before you arrive.", "Never let both doubles athletes stand still at the same time."],
    source_urls: [sources.vpa, sources.bodySpec],
    inspired_by: ["Public programming: transition practice and heart-rate drops"],
    tags: ["transitions", "race_rehearsal"]
  }),
  workout({
    id: "race-taper-001",
    title: "Race Week Station Primer",
    category: "race_simulation",
    subcategory: "taper_sessions",
    goal: "Stay sharp without creating soreness in race week.",
    difficulty: "intermediate",
    duration_minutes: 35,
    estimated_calories: 280,
    equipment: ["SkiErg", "wall ball", "sled optional", "running route or treadmill"],
    warmup: warmups.hybrid,
    workout: [
      step("Easy run", { distance: "2-3 km", rest: "2 min", rpe: "4", notes: "Finish fresher than you started." }),
      step("Station flow", { sets: 2, reps: "10 cal ski + 10 wall balls + 10m sled push optional", rest: "2 min", rpe: "5", notes: "Everything smooth, no strain." }),
      step("Strides", { sets: 4, time: "20 sec", rest: "walk back", rpe: "6", notes: "Light and elastic." })
    ],
    scaling: scaling.station,
    progression: { week_1: "Not used", week_2: "Not used", week_3: "Not used", week_4: "Race-week primer only" },
    coach_notes: ["The taper goal is confidence, not fitness gain.", "If you feel tempted to add work, go home."],
    source_urls: [sources.bodySpec, sources.vpa],
    inspired_by: ["Public programming: race-week taper and light station primers"],
    tags: ["taper", "race_week", "primer"]
  })
];

const extraCandidates = [
  workout({
    id: "new-hybrid-001",
    title: "Ski Pull Row Negative Split",
    category: "functional",
    subcategory: "station_skill",
    goal: "Teach controlled pacing across pulling stations before run re-entry.",
    difficulty: "advanced",
    duration_minutes: 55,
    estimated_calories: 610,
    equipment: ["SkiErg", "sled", "rower"],
    warmup: warmups.hybrid,
    workout: [
      step("SkiErg", { sets: 3, distance: "500m", rest: "0 sec", rpe: "7", notes: "Each round slightly faster." }),
      step("Sled pull", { sets: 3, distance: "25m", rest: "0 sec", rpe: "8", notes: "Smooth rope rhythm." }),
      step("Row", { sets: 3, distance: "500m", rest: "2 min", rpe: "7", notes: "Negative split each row." }),
      step("Run", { sets: 3, distance: "400m", rest: "2 min", rpe: "6", notes: "No panic off the rower." })
    ],
    cooldown,
    scaling: scaling.station,
    progression: { week_1: "3 rounds at 400m ski/row", week_2: "3 rounds at 500m", week_3: "4 rounds", week_4: "2 rounds deload" },
    coach_notes: ["Useful for athletes who overcook SkiErg and lose the row/run.", "Pacing discipline matters more than peak watts."],
    source_urls: [sources.bodySpec],
    inspired_by: ["Gap analysis: pulling-station cluster"],
    tags: ["new_candidate", "pulling", "negative_split"]
  }),
  workout({
    id: "new-doubles-001",
    title: "Doubles Handoff Speed Lab",
    category: "race_simulation",
    subcategory: "race_rehearsal",
    goal: "Practice doubles communication, planned workload splits, and no-dead-time station changes.",
    difficulty: "intermediate",
    duration_minutes: 50,
    estimated_calories: 520,
    equipment: ["wall ball", "farmer carry implements", "SkiErg or rower"],
    warmup: warmups.hybrid,
    workout: [
      step("Ski or row relay", { sets: 4, distance: "500m total", rest: "30 sec", rpe: "7", notes: "Switch before power drops, not after." }),
      step("Farmer carry relay", { sets: 4, distance: "100m total", rest: "30 sec", rpe: "7", notes: "One athlete works while the other resets breathing." }),
      step("Wall ball relay", { sets: 4, reps: "40 total", rest: "60 sec", rpe: "7", notes: "Use pre-agreed sets like 15/10/10/5." })
    ],
    cooldown,
    scaling: scaling.station,
    progression: { week_1: "3 rounds", week_2: "4 rounds", week_3: "5 rounds", week_4: "3 rounds deload" },
    coach_notes: ["The best doubles teams do not negotiate during stations.", "Every handoff should be under 5 sec."],
    source_urls: [],
    inspired_by: ["Internal doubles strategy"],
    tags: ["new_candidate", "doubles", "handoff"]
  })
];

function classify(workout) {
  const text = `${workout.title} ${workout.focus} ${workout.blocks.map((b) => `${b.title} ${b.items.join(" ")}`).join(" ")}`.toLowerCase();
  if (text.includes("simulation") || text.includes("race day")) return ["race_simulation", text.includes("taper") ? "taper_sessions" : text.includes("half") || text.includes("50%") || text.includes("70%") || text.includes("90%") ? "partial_simulation" : "full_simulation"];
  if (text.includes("zone 2") || text.includes("threshold") || text.includes("vo2") || text.includes("interval")) return ["endurance", text.includes("threshold") ? "threshold" : text.includes("vo2") || text.includes("interval") ? "intervals" : "zone_2"];
  if (text.includes("strength") || text.includes("squat") || text.includes("deadlift")) return ["strength", text.includes("sled") ? "sled_specific" : text.includes("lower") ? "lower_body" : "strength_endurance"];
  return ["functional", text.includes("wall ball") ? "wall_balls" : text.includes("sled") ? "sled_specific" : "station_skill"];
}

const validated = allWorkouts.map((item) => {
  const [category, subcategory] = classify(item);
  const hasTimers = item.blocks.some((block) => Boolean(block.timer));
  const hasProgression = /w\d+-/.test(item.id) && item.week > 1;
  const status = item.warmup.length && item.cooldown.length && item.recovery.length && item.nutrition.length && item.scaling.length
    ? hasProgression
      ? "validated"
      : "missing_progression"
    : "needs_improvement";
  return {
    id: item.id,
    title: item.title,
    category,
    subcategory,
    status,
    difficulty: item.intensity === "race" || item.intensity === "hard" ? "advanced" : item.intensity === "easy" || item.intensity === "recovery" ? "beginner" : "intermediate",
    duration_minutes: item.durationMinutes,
    strengths: [
      "Has warmup/cooldown/recovery/nutrition fields",
      "Uses HYROX-specific stations and pacing language",
      ...(hasTimers ? ["Includes timer metadata"] : [])
    ],
    improvement_notes: [
      ...(hasTimers ? [] : ["Add precise timer/rest metadata where applicable"]),
      ...(hasProgression ? [] : ["Link session to a 4-week progression family"]),
      "Normalize into library JSON schema before surfacing in workout browser"
    ],
    source: "internal_training_program"
  };
});

const upgraded = [...library, ...extraCandidates];

const ranked = upgraded
  .map((item) => {
    const specificity = item.tags.some((tag) => ["race_order", "full_simulation", "compromised_running", "race_specific"].includes(tag)) ? 5 : item.category === "race_simulation" ? 4 : 3;
    const coaching = item.coach_notes.length >= 2 && item.scaling.beginner.length && item.progression.week_4 ? 5 : 4;
    const progression = Object.values(item.progression).filter(Boolean).length;
    const beginner = item.difficulty === "beginner" ? 5 : item.scaling.beginner.length >= 2 ? 4 : 3;
    const race = item.category === "race_simulation" ? 5 : item.subcategory === "compromised_runs" || item.subcategory === "sled_specific" ? 4 : 3;
    return {
      id: item.id,
      title: item.title,
      scores: {
        hyrox_specificity: specificity,
        coaching_quality: coaching,
        progression_quality: progression,
        beginner_usability: beginner,
        race_relevance: race,
        total: specificity + coaching + progression + beginner + race
      }
    };
  })
  .sort((a, b) => b.scores.total - a.scores.total);

const upgradedLibrary = {
  metadata: {
    generated_at: new Date().toISOString(),
    schema_version: "1.0",
    categories: ["endurance", "strength", "functional", "race_simulation"],
    source_policy: "Public sources and internal workouts are paraphrased/normalized. Endur extraction is pending user-provided screenshots/export and must not copy private content verbatim."
  },
  source_urls: sourceUrls,
  ranking: ranked,
  workouts: upgraded
};

const endurInspired = {
  metadata: {
    status: "pending_private_assets",
    reason: "No Endur screenshots, screen recordings, or exported text were provided in this thread.",
    copyright_policy: "Do not copy Endur text verbatim. Extract only high-level workout structure, then rewrite into original app schema.",
    accepted_inputs: ["screenshots", "screen recordings", "pasted/exported workout text"]
  },
  import_pipeline: {
    screenshot_fields_to_capture: ["title", "objective", "warmup", "main set", "rest", "distance/reps/load", "cooldown", "coach notes"],
    normalization_steps: [
      "OCR or manual transcription into raw notes",
      "Map each session to category/subcategory",
      "Rewrite in original wording",
      "Add scaling and 4-week progression",
      "Mark source as endur_inspired, never endur_copied"
    ],
    ready_schema: Object.keys(upgraded[0])
  },
  workouts: []
};

function json(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

const gapAnalysis = `# HYROX Workout Gap Analysis

## Source Synthesis

The public sources consistently emphasize four pillars: running volume, compromised station work, strength endurance, and progressive simulations. PureGym's plans include dense mixed-modal circuits, AMRAP/EMOM concepts, half simulations, Zone 2 work, and 1 km repeats. BodySpec separates beginner, time-crunched, and advanced plans and highlights scaled volume, sled overload, wall-ball accumulation, transition heart-rate control, and full simulation timing. Fitness Drum is especially useful for beginner structure: three weekly sessions, engine/skill, strength/sleds, and brick work. VPA reinforces phased progression: base, intensity, peak conditioning, and taper/race prep.

## Current App Gaps

- Workout browser taxonomy is not yet separated into endurance, strength, functional, and race_simulation collections.
- Many internal sessions are strong program days but not standalone library entries with universal scaling.
- Timer/rest fields are inconsistent across internal workouts.
- Progression families exist in programming logic, but standalone workouts need explicit 4-week progressions.
- Doubles-specific handoff sessions are underrepresented.
- Transition practice exists in strategy guidance but needs more library workouts.
- Erg technique sessions should be separated from hard conditioning so beginners can learn safely.

## Recommended Additions

1. Doubles handoff and communication workouts.
2. Pulling-station clusters: SkiErg + sled pull + row + run-off-row.
3. Dedicated transition discipline rehearsals.
4. Beginner station-skill flows with no race pressure.
5. Wall-ball capacity EMOMs and broken-set race strategy sessions.
6. Sled overload sessions with immediate easy run mechanics.
7. Taper primers that preserve confidence without fatigue.

## Endur Extraction Gap

No Endur screenshots, recordings, or text exports were available. The app should accept Endur-derived inputs through a controlled import pipeline, then rewrite all workouts into original language before inclusion.
`;

const comparisonReport = `# Workout Comparison Report

## Internal Library Summary

- Internal fixed program workouts reviewed: ${allWorkouts.length}
- Internal workouts with full support fields: ${validated.filter((item) => item.status === "validated").length}
- Workouts needing explicit progression metadata: ${validated.filter((item) => item.status === "missing_progression").length}
- Workouts needing improvement: ${validated.filter((item) => item.status === "needs_improvement").length}

## Public Source Patterns Mapped

| Pattern | Public Source Signal | Library Response |
| --- | --- | --- |
| Zone 2 running | Easy 5 km, 5-8 km, long runs | Added Zone 2 builder and long run reset sessions |
| 1 km repeats | Repeated 1 km run intervals | Added 1K Repeat Pace Lock |
| Beginner bricks | Run + station + run progressions | Added Run Erg Brick Ladder and Four-Station Primer |
| Sled overload | Sled EMOMs and progressive load | Added Sled Push Pull Overload |
| Wall-ball accumulation | Weekly volume/EMOM concepts | Added Wall Ball Capacity EMOM |
| Full simulation | Week 11/full or 90% simulation | Added Controlled Full HYROX Simulation |
| Taper primer | Light stations and strides | Added Race Week Station Primer |

## Validation Labels

- validated: usable internal workout with complete support fields.
- needs_improvement: missing core coaching fields or insufficient prescription detail.
- replace: should be superseded by upgraded library item.
- missing_progression: good session but not yet connected to an explicit 4-week progression.
- new_workout_candidate: new addition recommended by gap analysis.

## Production Recommendation

Use upgraded_hyrox_workout_library.json as the canonical workout browser seed. Keep validated_workouts.json as a migration/comparison layer for existing plans. Add Endur-derived workouts only after user-provided assets are normalized and rewritten.
`;

await mkdir(outDir, { recursive: true });
await writeFile(new URL("validated_workouts.json", outDir), json(validated));
await writeFile(new URL("new_workout_candidates.json", outDir), json(extraCandidates));
await writeFile(new URL("workout_gap_analysis.md", outDir), gapAnalysis);
await writeFile(new URL("workout_comparison_report.md", outDir), comparisonReport);
await writeFile(new URL("upgraded_hyrox_workout_library.json", outDir), json(upgradedLibrary));
await writeFile(new URL("endur_inspired_workouts.json", outDir), json(endurInspired));

console.log(`Generated ${upgraded.length} upgraded workouts and ${validated.length} internal validation records.`);
