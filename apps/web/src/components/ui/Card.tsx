import type { ReactNode } from 'react';
export function Card({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      {children}
    </section>
  );
}