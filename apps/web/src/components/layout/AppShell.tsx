import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-accent)] focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onOpenNav={() => setNavOpen(true)} />
          <div id="main-content" className="flex-1 p-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}