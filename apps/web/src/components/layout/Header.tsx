import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../lib/theme';
import { logout } from '../../services/auth-service';

export function Header({ onOpenNav }: { onOpenNav: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] px-4 md:px-6">
      <div className="flex items-center gap-2">
        <button aria-label="Open navigation" className="md:hidden" onClick={onOpenNav}>
          <Menu size={20} />
        </button>
        <span className="text-sm text-[var(--color-muted)]">Developer observability</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={toggleTheme}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)]"
          onClick={() => logout()}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
