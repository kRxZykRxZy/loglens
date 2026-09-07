import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export type ToastType = 'info' | 'success' | 'error';
export type Toast = { id: number; type: ToastType; message: string };
type ToastInput = { type?: ToastType; message: string; durationMs?: number };

type ToastContextValue = {
  toast: (input: ToastInput) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const STYLES: Record<ToastType, string> = {
  info: 'border-[var(--color-border)]',
  success: 'border-emerald-500/50',
  error: 'border-red-500/50',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'info', message, durationMs = 4000 }: ToastInput) => {
      const id = nextId.current++;
      setToasts((ts) => [...ts, { id, type, message }]);
      if (durationMs > 0) {
        setTimeout(() => dismiss(id), durationMs);
      }
    },
    [dismiss],
  );

  const value: ToastContextValue = {
    toast,
    success: (m) => toast({ type: 'success', message: m }),
    error: (m) => toast({ type: 'error', message: m }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start justify-between gap-2 rounded-lg border bg-[var(--color-bg)] p-3 text-sm shadow-lg ${STYLES[t.type]}`}
          >
            <span className="flex items-start gap-2">
              {t.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={16} />
              ) : t.type === 'error' ? (
                <XCircle className="mt-0.5 shrink-0 text-red-500" size={16} />
              ) : null}
              {t.message}
            </span>
            <button aria-label="Dismiss notification" onClick={() => dismiss(t.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}