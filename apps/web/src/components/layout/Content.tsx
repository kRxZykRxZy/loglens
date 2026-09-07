import type { ReactNode } from 'react';
export function Content({ children }: { children: ReactNode }) {
  return (
    <div id="main-content" className="flex-1 p-6">
      {children}
    </div>
  );
}
