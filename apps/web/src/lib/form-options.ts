export const goalTimeOptions = [
  "55:00",
  "1:00:00",
  "1:10:00",
  "1:20:00",
  "1:30:00",
  "1:40:00",
  "1:50:00",
  "2:00:00",
  "2:10:00",
  "2:20:00",
  "2:30:00"
];

function paceLabel(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}/km`;
}

export const runningPaceOptions = Array.from({ length: 19 }, (_, index) => paceLabel(210 + index * 15));

export function optionsWithCurrent(options: string[], current?: string | null) {
  const value = current?.trim();
  if (!value || options.includes(value)) return options;
  return [value, ...options];
}
