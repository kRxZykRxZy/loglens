import { Card } from '../../../components/ui/Card';
export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <div className="text-sm text-[var(--color-muted)]">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </Card>
  );
}
