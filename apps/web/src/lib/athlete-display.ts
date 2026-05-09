import type { Session } from "./local-session";

type AthleteUser = Partial<Session["user"]>;

const fallbackName = "HYROX Athlete";
const fallbackSubtitle = "Your Upcoming Race";

export const competitionCategories = [
  "Open Men",
  "Open Women",
  "Pro Men",
  "Pro Women",
  "Doubles Men",
  "Doubles Women",
  "Mixed Doubles"
];

const categoryLabels: Record<string, string> = {
  "singles-open": "Open Men",
  "singles-pro": "Pro Men",
  "doubles-open": "Doubles Men",
  "doubles-pro": "Doubles Men",
  relay: "Relay",
  other: "Open Men"
};

function titleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function athleteName(user?: AthleteUser | null) {
  return user?.name?.trim() || fallbackName;
}

export function athleteInitials(user?: AthleteUser | null) {
  const parts = athleteName(user).split(/\s+/).filter(Boolean);
  if (!parts.length) return "HA";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function categoryLabel(category?: string | null) {
  if (!category?.trim()) return "";
  const normalized = category.trim();
  return categoryLabels[normalized.toLowerCase()] ?? titleCase(normalized);
}

export function eventSubtitle(user?: AthleteUser | null) {
  const eventName = user?.eventName?.trim();
  const location = user?.eventLocation?.trim();
  const category = categoryLabel(user?.hyroxCategory);
  if (eventName && category) return `${eventName} ${category}`;
  if (eventName) return eventName;
  if (location && category) return `HYROX ${location} ${category}`;
  return fallbackSubtitle;
}
