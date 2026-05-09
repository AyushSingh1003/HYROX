export type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type Intensity = "recovery" | "easy" | "moderate" | "moderate-hard" | "hard" | "race";

export type TimerMode = "countdown" | "interval" | "emom" | "tabata" | "station";
export type TrainingLevel = "absolute-beginner" | "beginner" | "moderate" | "expert";
export type RaceCategory = "singles-open" | "singles-pro" | "doubles-open" | "doubles-pro" | "relay" | "other";

export interface ExerciseVideo {
  title: string;
  youtubeId: string;
  channel?: string;
  thumbnail: string;
  url: string;
}

export interface ExerciseGuidance {
  exerciseName: string;
  instructions: string[];
  coachingNotes: string[];
  pacingGuidance: string[];
  commonMistakes: string[];
  recoveryTips: string[];
  video: ExerciseVideo;
}

export interface AthleteTargets {
  you?: string;
  partner?: string;
  shared?: string;
}

export interface OnboardingAnswers {
  name: string;
  age?: number;
  sex?: string;
  height?: number;
  weight?: number;
  current5kPace?: string;
  easyRunPace?: string;
  fiveKPB?: string;
  tenKPB?: string;
  currentHyroxFinishTime?: string;
  weeklyRunningVolume?: number;
  strengthExperience?: string;
  hyroxExperience?: string;
  restingHeartRate?: number;
  maximumHeartRate?: number;
  raceCategory: RaceCategory;
  goalRaceDate: string;
  targetGoalTime?: string;
  availableTrainingDays: number;
  equipmentAccess: string[];
  injuryHistory?: string;
  weakestStations: string[];
  strongestStations?: string[];
  sleepHours?: number;
  recoveryQuality?: string;
  nutritionConsistency?: string;
  stressLevel?: string;
  occupationActivityLevel?: string;
  nutritionPreference?: string;
  partnerAge?: number;
  partnerRunningPace?: string;
  partnerStrengths?: string[];
  partnerWeaknesses?: string[];
  trainingLevel: TrainingLevel;
}

export interface GeneratedTrainingPlan {
  id: string;
  title: string;
  level: TrainingLevel;
  raceCategory: RaceCategory;
  goalRaceDate: string;
  targetGoalTime?: string;
  weeksUntilRace: number;
  summary: string;
  priorities: string[];
  phases: string[];
  weeks: TrainingWeek[];
}

export interface WorkoutBlock {
  title: string;
  items: string[];
  timer?: {
    mode: TimerMode;
    workSeconds?: number;
    restSeconds?: number;
    rounds?: number;
    durationSeconds?: number;
  };
  editable?: boolean;
}

export interface DailyWorkout {
  id: string;
  week: number;
  phase: number;
  day: DayName;
  title: string;
  focus: string;
  durationMinutes: number;
  intensity: Intensity;
  targetPace?: AthleteTargets;
  targetHeartRate?: string;
  warmup: string[];
  blocks: WorkoutBlock[];
  cooldown: string[];
  recovery: string[];
  nutrition: string[];
  goals: string[];
  scaling: string[];
}

export interface TrainingWeek {
  week: number;
  phase: number;
  phaseTitle: string;
  dateRange: string;
  intent: string;
  expectedTrainingLoad?: string;
  recoveryEmphasis?: string;
  workouts: DailyWorkout[];
}

export interface StationSplit {
  station: string;
  you: string;
  partner: string;
  coachingCue: string;
}

export interface StationTarget {
  station: string;
  target: string;
}

export interface Benchmark {
  week: number;
  title: string;
  targets: string[];
}

export interface RecoveryInput {
  sleepHours: number;
  hydrationPercent: number;
  soreness: number;
  hrv?: number;
  fatigue: number;
  stress?: number;
}

export interface NutritionEntry {
  id: string;
  foodName: string;
  quantity: string;
  mealTiming: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  sodium: number;
  hydration: number;
  electrolytes: number;
  createdAt: string;
}
