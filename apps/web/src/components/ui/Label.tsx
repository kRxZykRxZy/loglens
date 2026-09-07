export function Label({ children }: { children: string }) {
  return <label className="text-sm font-medium text-[var(--color-muted)]">{children}</label>;
}
