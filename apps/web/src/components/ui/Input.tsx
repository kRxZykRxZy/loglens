import type { InputHTMLAttributes } from 'react';
export function Input(p: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...p}
      className={`w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 outline-none ${p.className ?? ''}`}
    />
  );
}
