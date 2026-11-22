export default function KpiCard({ label, value, icon: Icon }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-body-sm text-ink-secondary">{label}</span>
        {Icon && <Icon size={18} className="text-primary" />}
      </div>
      <p className="text-numeric">{value}</p>
    </div>
  );
}
