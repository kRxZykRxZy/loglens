import type { ButtonHTMLAttributes } from 'react';
export function Button(p: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={`rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white disabled:opacity-50 ${p.className ?? ''}`}
    />
  );
}
