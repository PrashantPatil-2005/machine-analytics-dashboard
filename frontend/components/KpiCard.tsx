interface KpiCardProps {
  title: string;
  value: number;
}

export default function KpiCard({ title, value }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <h3>{title}</h3>
      <div className="kpi-value">{value}</div>
    </div>
  );
}
