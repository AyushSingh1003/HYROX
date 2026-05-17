import type { RaceCategory } from "./types.js";

export type StrategyFormat = "singles" | "doubles" | "relay";
export type StrategyTier = "sub60" | "sub70" | "competitive" | "finisher";

export interface StrategyInput {
  raceCategory?: RaceCategory | string | null;
  goalTime?: string | null;
  runningPace?: string | null;
}

export interface StrategySplit {
  station: string;
  athleteA: string;
  athleteB: string;
  cue: string;
}

export interface StrategyTarget {
  station: string;
  target: string;
}

export interface RaceStrategy {
  title: string;
  format: StrategyFormat;
  tier: StrategyTier;
  categoryLabel: string;
  goalTime: string;
  headlineChips: string[];
  runPacing: string[];
  transitionRules: string[];
  stationSplits: StrategySplit[];
  stationTargets: StrategyTarget[];
}

const defaultGoalSeconds = 90 * 60;

const stationShare = [
  { station: "SkiErg", share: 0.072 },
  { station: "Sled Push", share: 0.052 },
  { station: "Sled Pull", share: 0.052 },
  { station: "Burpee Broad Jumps", share: 0.071 },
  { station: "Row", share: 0.07 },
  { station: "Farmer Carry", share: 0.035 },
  { station: "Sandbag Lunges", share: 0.07 },
  { station: "Wall Balls", share: 0.082 },
  { station: "Transitions total", share: 0.045 },
  { station: "Running total", share: 0.451 }
];

const categoryLabels: Record<string, string> = {
  "singles-open": "Singles Open",
  "singles-pro": "Singles Pro",
  "doubles-open": "Doubles Open",
  "doubles-pro": "Doubles Pro",
  relay: "Relay",
  other: "Open"
};

function parseGoalTime(value?: string | null) {
  if (!value?.trim()) return defaultGoalSeconds;
  const parts = value.trim().split(":").map(Number);
  if (parts.some((part) => Number.isNaN(part))) return defaultGoalSeconds;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return defaultGoalSeconds;
}

function formatDuration(totalSeconds: number) {
  const rounded = Math.max(1, Math.round(totalSeconds / 5) * 5);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;
  if (hours) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatPace(secondsPerKm: number) {
  const rounded = Math.max(1, Math.round(secondsPerKm / 5) * 5);
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}/km`;
}

function categoryKey(value?: string | null) {
  return (value || "singles-open").trim().toLowerCase().replace(/\s+/g, "-");
}

function strategyFormat(category: string): StrategyFormat {
  if (category.includes("relay")) return "relay";
  if (category.includes("double") || category.includes("mixed")) return "doubles";
  return "singles";
}

function strategyTier(goalSeconds: number, format: StrategyFormat): StrategyTier {
  const adjusted = format === "doubles" ? goalSeconds + 8 * 60 : goalSeconds;
  if (adjusted <= 60 * 60) return "sub60";
  if (adjusted <= 70 * 60) return "sub70";
  if (adjusted <= 95 * 60) return "competitive";
  return "finisher";
}

function labelForCategory(category: string) {
  if (categoryLabels[category]) return categoryLabels[category];
  return category
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function intensityCue(tier: StrategyTier) {
  if (tier === "sub60") return "Aggressive: protect watts, no comfort breaks";
  if (tier === "sub70") return "Fast: controlled first half, hard station exits";
  if (tier === "competitive") return "Controlled: hold repeatable splits";
  return "Finish-first: cap effort and avoid failed reps";
}

function stationTargets(goalSeconds: number, format: StrategyFormat, tier: StrategyTier): StrategyTarget[] {
  const formatModifier = format === "doubles" ? 0.92 : format === "relay" ? 0.82 : 1;
  const tierModifier = tier === "finisher" ? 1.04 : tier === "competitive" ? 1 : tier === "sub70" ? 0.96 : 0.92;
  return stationShare.map(({ station, share }) => ({
    station,
    target: formatDuration(goalSeconds * share * formatModifier * tierModifier)
  }));
}

function runPacing(goalSeconds: number, format: StrategyFormat, tier: StrategyTier, runningPace?: string | null) {
  const runSeconds = goalSeconds * 0.451;
  const basePace = runSeconds / 8;
  const opening = formatPace(basePace + (tier === "finisher" ? 20 : 10));
  const middle = formatPace(basePace + (tier === "sub60" ? 0 : 15));
  const closing = formatPace(Math.max(basePace - (tier === "finisher" ? 0 : 10), 210));
  const anchor = runningPace?.trim() ? `Use saved running pace ${runningPace.trim()} as the ceiling if breathing spikes.` : "Use nasal-control warmup breathing to set the ceiling.";

  if (format === "doubles") {
    return [
      `Runs 1-3: both athletes stay together at ${opening}.`,
      `Runs 4-6: stronger runner stays half a step behind at ${middle}.`,
      `Runs 7-8: pull the slower partner forward only if form holds, target ${closing}.`,
      anchor
    ];
  }

  if (format === "relay") {
    return [
      `Each runner caps the first 200m, then settles near ${middle}.`,
      "Next athlete is ready before the incoming runner reaches the change zone.",
      `Final assigned leg can build toward ${closing}.`,
      anchor
    ];
  }

  return [
    `Runs 1-2: deliberately controlled at ${opening}.`,
    `Runs 3-6: lock into ${middle} and avoid surges after sleds.`,
    `Runs 7-8: progress toward ${closing} if wall-ball legs are still available.`,
    anchor
  ];
}

function splitStrategy(format: StrategyFormat, category: string, tier: StrategyTier): StrategySplit[] {
  if (format === "singles") {
    return [
      { station: "SkiErg", athleteA: "100%", athleteB: "N/A", cue: "Settle by 200m; never sprint the first pull." },
      { station: "Sled Push", athleteA: "100%", athleteB: "N/A", cue: tier === "finisher" ? "Break after each lane if needed." : "Two hard lanes, short breath, repeat." },
      { station: "Sled Pull", athleteA: "100%", athleteB: "N/A", cue: "Walk rope back with control; avoid failed yanks." },
      { station: "Burpee Broad Jumps", athleteA: "100%", athleteB: "N/A", cue: "Small repeatable jump beats early overreach." },
      { station: "Row", athleteA: "100%", athleteB: "N/A", cue: "Legs first; recover grip for carries." },
      { station: "Farmer Carry", athleteA: "100%", athleteB: "N/A", cue: "Planned drops only if grip is about to fail." },
      { station: "Sandbag Lunges", athleteA: "100%", athleteB: "N/A", cue: "Upright torso, no rushed no-reps." },
      { station: "Wall Balls", athleteA: "100%", athleteB: "N/A", cue: tier === "sub60" || tier === "sub70" ? "Start in 25s or 20s." : "Start in 10s or 15s; no failure sets." }
    ];
  }

  if (format === "relay") {
    return [
      { station: "SkiErg", athleteA: "Best puller opens", athleteB: "Next athlete ready", cue: "Switch before stroke rate collapses." },
      { station: "Sled Push", athleteA: "Power athlete leads", athleteB: "Fresh athlete finishes", cue: "No discussion at handoff." },
      { station: "Sled Pull", athleteA: "Two-lane blocks", athleteB: "Rope manager", cue: "One athlete clears rope continuously." },
      { station: "Burpee Broad Jumps", athleteA: "Short rep blocks", athleteB: "Immediate tag", cue: "Keep every landing clean." },
      { station: "Row", athleteA: "Long rhythm block", athleteB: "Short fast finish", cue: "Do not waste time adjusting foot straps repeatedly." },
      { station: "Farmer Carry", athleteA: "Grip athlete first", athleteB: "No standing drops", cue: "Change only at planned marks." },
      { station: "Sandbag Lunges", athleteA: "20m blocks", athleteB: "20m blocks", cue: "Call depth standards." },
      { station: "Wall Balls", athleteA: "Clean sets only", athleteB: "Fast tag", cue: "Switch before no-reps appear." }
    ];
  }

  const proBias = category.includes("pro") || tier === "sub60" || tier === "sub70";
  return [
    { station: "SkiErg", athleteA: proBias ? "55%" : "50%", athleteB: proBias ? "45%" : "50%", cue: "Stronger puller opens while partner lowers heart rate." },
    { station: "Sled Push", athleteA: proBias ? "65%" : "55%", athleteB: proBias ? "35%" : "45%", cue: "Power athlete takes the heavier damage cost." },
    { station: "Sled Pull", athleteA: proBias ? "60%" : "50%", athleteB: proBias ? "40%" : "50%", cue: "Rope stays organized; switch before failed pulls." },
    { station: "Burpee Broad Jumps", athleteA: "Alternate 8-10 reps", athleteB: "Alternate 8-10 reps", cue: "Short swaps preserve jump quality." },
    { station: "Row", athleteA: proBias ? "45%" : "50%", athleteB: proBias ? "55%" : "50%", cue: "Give more row to the smoother rhythm athlete." },
    { station: "Farmer Carry", athleteA: proBias ? "60%" : "50%", athleteB: proBias ? "40%" : "50%", cue: "Switch before grip failure, not after." },
    { station: "Sandbag Lunges", athleteA: "Alternate 20m", athleteB: "Alternate 20m", cue: "Depth and balance matter more than speed." },
    { station: "Wall Balls", athleteA: proBias ? "55%" : "50%", athleteB: proBias ? "45%" : "50%", cue: "Never let both athletes rest at once." }
  ];
}

export function generateRaceStrategy(input: StrategyInput = {}): RaceStrategy {
  const category = categoryKey(input.raceCategory);
  const format = strategyFormat(category);
  const goalSeconds = parseGoalTime(input.goalTime);
  const tier = strategyTier(goalSeconds, format);
  const categoryLabel = labelForCategory(category);

  return {
    title: `${categoryLabel} ${formatDuration(goalSeconds)} Strategy`,
    format,
    tier,
    categoryLabel,
    goalTime: formatDuration(goalSeconds),
    headlineChips: [
      intensityCue(tier),
      format === "doubles" ? "Run together" : format === "relay" ? "Zero-debate handoffs" : "Solo pace discipline",
      tier === "finisher" ? "No failed reps" : "Fast transitions"
    ],
    runPacing: runPacing(goalSeconds, format, tier, input.runningPace),
    transitionRules: [
      format === "singles" ? "Know the next station before entering the Roxzone." : "Station assignments are decided before the race.",
      tier === "finisher" ? "Walk with purpose if needed; never stand still." : "Roxzone movement is free speed; no casual walking.",
      "Three forced exhales before every run exit."
    ],
    stationSplits: splitStrategy(format, category, tier),
    stationTargets: stationTargets(goalSeconds, format, tier)
  };
}
