export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm opacity-60">{description}</p>
    </div>
  );
}
