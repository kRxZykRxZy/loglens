import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'danger' | 'ghost';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-[var(--color-accent)] text-white',
  danger: 'bg-red-600 text-white',
  ghost: 'bg-transparent text-[var(--color-fg)] border border-[var(--color-border)]',
};

export function Button({ variant = 'primary', className, ...p }: Props) {
  return (
    <button
      {...p}
      className={`rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50 ${VARIANTS[variant]} ${className ?? ''}`}
    />
  );
}
