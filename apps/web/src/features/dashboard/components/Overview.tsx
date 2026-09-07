import { Card } from '../../../components/ui/Card';
export function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <div className="text-sm opacity-60">Events</div>
        <div className="mt-2 text-3xl">0</div>
      </Card>
      <Card>
        <div className="text-sm opacity-60">Errors</div>
        <div className="mt-2 text-3xl">0</div>
      </Card>
      <Card>
        <div className="text-sm opacity-60">Projects</div>
        <div className="mt-2 text-3xl">0</div>
      </Card>
    </div>
  );
}
