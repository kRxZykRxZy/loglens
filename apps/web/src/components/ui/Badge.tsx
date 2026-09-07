export function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-muted)]">
      {children}
    </span>
  );
}
