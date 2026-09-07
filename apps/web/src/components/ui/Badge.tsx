export function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-white/10 px-2 py-1 text-xs opacity-80">
      {children}
    </span>
  );
}
