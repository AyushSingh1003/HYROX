import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
  tone?: "green" | "yellow" | "red";
}) {
  return (
    <div className="metric">
      <div className="metric-label">
        <span>{label}</span>
        <Icon size={18} />
      </div>
      <div>
        <div className="metric-value">{value}</div>
        {detail ? <div className={`chip ${tone ?? ""}`}>{detail}</div> : null}
      </div>
    </div>
  );
}

