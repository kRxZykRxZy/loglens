import type { InputHTMLAttributes } from 'react';
export function Input(p: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...p}
      className={`w-full rounded-md border border-[var(--color-border)] bg-[var(--color-input-bg)] px-3 py-2 text-[var(--color-fg)] outline-none ${p.className ?? ''}`}
    />
  );
}
