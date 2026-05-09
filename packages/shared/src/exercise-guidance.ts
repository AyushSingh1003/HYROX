import type { ExerciseGuidance } from "./types.js";

const thumbnail = (youtubeId: string) => `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
const url = (youtubeId: string) => `https://www.youtube.com/watch?v=${youtubeId}`;

const guidanceLibrary: Record<string, ExerciseGuidance> = {
  skierg: {
    exerciseName: "SkiErg",
    instructions: [
      "Set feet hip-width and hinge from the hips before the handles pass the face.",
      "Drive down with lats and trunk, then finish with a short knee bend.",
      "Return tall and relaxed so the next pull starts with length, not tension."
    ],
    coachingNotes: [
      "Start controlled in round one and build only when breathing is stable.",
      "Use a consistent stroke rate instead of chasing one huge pull.",
      "Step off with posture tall so the first 200m of the run is not panicked."
    ],
    pacingGuidance: [
      "Hold threshold effort, around 7-8/10, unless this is a benchmark.",
      "Doubles: switch before stroke power drops, not after the athlete is cooked."
    ],
    commonMistakes: ["Squatting every pull", "Yanking with the arms first", "Standing still after the final meter"],
    recoveryTips: ["Shake the arms in transition", "Use two long exhales before running", "Open lats and thoracic spine post-session"],
    video: {
      title: "SkiErg technique and HYROX pacing",
      youtubeId: "YtK0oZ6vbxY",
      channel: "Concept2 / HYROX technique",
      thumbnail: thumbnail("YtK0oZ6vbxY"),
      url: url("YtK0oZ6vbxY")
    }
  },
  "sled push": {
    exerciseName: "Sled Push",
    instructions: [
      "Lock hands low or mid-post and keep shoulders stacked over the sled.",
      "Brace hard, eyes down, and use short powerful steps.",
      "Keep hips driving forward without letting the back round."
    ],
    coachingNotes: [
      "Win the first three steps before trying to accelerate.",
      "Stay patient on heavy carpet; rhythm beats panic.",
      "Doubles: call the switch before speed collapses."
    ],
    pacingGuidance: ["Push at strong but repeatable pressure", "Treat each lane as controlled force production, not a sprint"],
    commonMistakes: ["Overstriding", "High hips with a rounded back", "Stopping completely at turns"],
    recoveryTips: ["Walk 5-10 seconds before surging", "Open hip flexors after training", "Rehydrate aggressively after heavy sled days"],
    video: {
      title: "HYROX sled push positioning",
      youtubeId: "ZJrJ6ZlC8VQ",
      channel: "HYROX technique",
      thumbnail: thumbnail("ZJrJ6ZlC8VQ"),
      url: url("ZJrJ6ZlC8VQ")
    }
  },
  "sled pull": {
    exerciseName: "Sled Pull",
    instructions: [
      "Plant feet wide, brace, and lean away from the sled before pulling.",
      "Pull hand-over-hand with the rope close to the body.",
      "Step back only when rope tension is high and posture is stable."
    ],
    coachingNotes: ["Keep the rope organized", "Use legs and trunk before arms", "Avoid rushing the turn reset"],
    pacingGuidance: ["Steady force, minimal failed pulls", "Doubles: one athlete pulls while the other clears rope and calls distance"],
    commonMistakes: ["Loose rope piles underfoot", "Pulling with bent wrists only", "Letting heart rate spike before the next run"],
    recoveryTips: ["Forearm shakeout immediately after", "Easy first 100m on the run", "Add calf and grip mobility later"],
    video: {
      title: "HYROX sled pull technique",
      youtubeId: "WX7mZ0sM1sE",
      thumbnail: thumbnail("WX7mZ0sM1sE"),
      url: url("WX7mZ0sM1sE")
    }
  },
  "burpee": {
    exerciseName: "Burpee Broad Jump",
    instructions: [
      "Drop with hands under shoulders and chest to floor.",
      "Step or snap feet forward, then jump only as far as you can repeat.",
      "Land soft and immediately begin the next rep."
    ],
    coachingNotes: ["Keep a metronome rhythm", "Breathe out when standing", "Small consistent jumps beat early hero jumps"],
    pacingGuidance: ["Never redline before halfway", "Use a sustainable step-up if the run matters more that day"],
    commonMistakes: ["Jumping too far early", "Standing fully relaxed between reps", "Landing stiff-legged"],
    recoveryTips: ["Walk tall into the next run", "Unload calves after session", "Use nasal breathing once HR settles"],
    video: {
      title: "Burpee broad jump efficiency",
      youtubeId: "xQdyIrSSFnE",
      thumbnail: thumbnail("xQdyIrSSFnE"),
      url: url("xQdyIrSSFnE")
    }
  },
  row: {
    exerciseName: "Row",
    instructions: [
      "Drive legs first, then swing the trunk, then finish with arms.",
      "Recover arms, body, then knees so the chain stays smooth.",
      "Keep strokes long without pausing at the catch."
    ],
    coachingNotes: ["Hold form under fatigue", "Choose a damper you can repeat", "Exit calmly before standing upright"],
    pacingGuidance: ["Aim for controlled threshold watts", "Avoid sprinting the first 250m"],
    commonMistakes: ["Early arm pull", "Rushing the slide", "Collapsing posture at the catch"],
    recoveryTips: ["Stand slowly after hard rows", "Reset breathing before the run", "Mobilize hamstrings and mid-back"],
    video: {
      title: "Rowing technique for HYROX",
      youtubeId: "ZN0J6qKCIrI",
      thumbnail: thumbnail("ZN0J6qKCIrI"),
      url: url("ZN0J6qKCIrI")
    }
  },
  "farmer carry": {
    exerciseName: "Farmer Carry",
    instructions: [
      "Keep shoulders depressed and ribs stacked over pelvis.",
      "Brace the core and walk with short controlled steps.",
      "Maintain upright posture without leaning sideways."
    ],
    coachingNotes: ["Stay controlled first round", "Focus on breathing rhythm", "Avoid sprinting transitions"],
    pacingGuidance: ["Fast walk with zero drops beats an early run and grip failure", "Doubles: switch just before grip tension spikes"],
    commonMistakes: ["Rounded back", "Overstriding", "Excessive grip tension"],
    recoveryTips: ["Open hands fully after the set", "Relax traps before running", "Add forearm tissue work after training"],
    video: {
      title: "Farmer carry posture and pacing",
      youtubeId: "rt17lmnaLSM",
      thumbnail: thumbnail("rt17lmnaLSM"),
      url: url("rt17lmnaLSM")
    }
  },
  "wall ball": {
    exerciseName: "Wall Ball",
    instructions: [
      "Stand close enough to catch tall without reaching forward.",
      "Squat below parallel, drive through the floor, and release late.",
      "Let the ball drop into the next squat without losing the chest."
    ],
    coachingNotes: ["Break sets before misses appear", "Use planned sets like 15-15-10, not emotional sets", "Breathe every catch"],
    pacingGuidance: ["Smooth repeatable cadence", "Doubles: use short sets if one athlete is running-biased"],
    commonMistakes: ["Catching too low", "No-repping depth", "Holding breath for long sets"],
    recoveryTips: ["Walk for 5 seconds after the final rep", "Flush quads and calves", "Prioritize carbs after wall-ball-heavy days"],
    video: {
      title: "Wall ball pacing and standards",
      youtubeId: "EqjGKsiIMCE",
      thumbnail: thumbnail("EqjGKsiIMCE"),
      url: url("EqjGKsiIMCE")
    }
  },
  run: {
    exerciseName: "Compromised Running",
    instructions: [
      "Start the first 100-200m slightly restrained after each station.",
      "Keep cadence quick, shoulders quiet, and breathing rhythmic.",
      "Return to target pace only after mechanics stabilize."
    ],
    coachingNotes: ["Run the same speed you can still station from", "Use transitions to lower panic, not to rest forever"],
    pacingGuidance: ["Threshold days: controlled discomfort", "Race sims: lock into HYROX pace and avoid surges"],
    commonMistakes: ["Sprinting out of stations", "Overstriding on tired legs", "Ignoring partner communication"],
    recoveryTips: ["Cooldown until gait feels normal", "Carbs plus sodium after compromised sessions", "Monitor calves and hip flexors next morning"],
    video: {
      title: "HYROX running under fatigue",
      youtubeId: "BrnWOwS7tUQ",
      thumbnail: thumbnail("BrnWOwS7tUQ"),
      url: url("BrnWOwS7tUQ")
    }
  }
};

const aliases: Array<[string, keyof typeof guidanceLibrary]> = [
  ["ski", "skierg"],
  ["sled push", "sled push"],
  ["sled pull", "sled pull"],
  ["burpee", "burpee"],
  ["row", "row"],
  ["farmer", "farmer carry"],
  ["carry", "farmer carry"],
  ["wall ball", "wall ball"],
  ["run", "run"],
  ["threshold", "run"],
  ["compromised", "run"]
];

export function getExerciseGuidance(title: string, items: string[] = []): ExerciseGuidance {
  const haystack = `${title} ${items.join(" ")}`.toLowerCase();
  const match = aliases.find(([needle]) => haystack.includes(needle));
  return guidanceLibrary[match?.[1] ?? "run"];
}

export function getWorkoutGuidance(blocks: Array<{ title: string; items: string[] }>) {
  return blocks.map((block) => ({ blockTitle: block.title, guidance: getExerciseGuidance(block.title, block.items) }));
}
