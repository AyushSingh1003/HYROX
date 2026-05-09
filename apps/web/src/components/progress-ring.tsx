import type { CSSProperties } from "react";

export function ProgressRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-ring" style={{ "--progress": value } as CSSProperties} aria-label={`${label}: ${value}%`}>
      <div>
        <strong>{value}%</strong>
        <div className="muted">{label}</div>
      </div>
    </div>
  );
}
