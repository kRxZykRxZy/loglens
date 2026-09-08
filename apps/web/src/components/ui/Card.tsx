import type { ReactNode } from 'react';
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 ${className ?? ''}`}
    >
      {children}
    </section>
  );
}
