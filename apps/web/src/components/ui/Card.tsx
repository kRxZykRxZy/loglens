import type { ReactNode } from 'react';
export function Card({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[.03] p-5">{children}</section>
  );
}
