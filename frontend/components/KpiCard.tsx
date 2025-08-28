interface KpiCardProps {
  title: string;
  value: number;
  color?: string;
}

export default function KpiCard({ title, value,color }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <h3>{title}</h3>
      <div className="kpi-value" style={{ color: color || "#007bff"}} >{value}</div>
    </div>
  );
}
