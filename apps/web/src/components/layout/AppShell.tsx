import type { ReactNode } from 'react';
export function AppShell({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-[#0b0d10] text-white">{children}</main>;
}
