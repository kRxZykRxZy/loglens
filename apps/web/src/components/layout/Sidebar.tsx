import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', to: '/' },
  { label: 'Logs', to: '/logs' },
  { label: 'Projects', to: '/projects' },
  { label: 'Settings', to: '/account/settings' },
  { label: 'Sessions', to: '/account/sessions' },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open ? <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} /> : null}
      <aside
        aria-label="Primary"
        className={`fixed z-40 flex h-full w-60 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] p-4 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <strong>LogLens</strong>
          <button aria-label="Close navigation" className="md:hidden" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <nav aria-label="Main" className="mt-8 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm ${
                  isActive
                    ? 'bg-[var(--color-surface)] font-medium'
                    : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
