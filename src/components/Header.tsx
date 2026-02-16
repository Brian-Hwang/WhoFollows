export default function Header({ showName }: { showName: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="pointer-events-auto">
          <h1 className="text-lg font-bold text-[var(--foreground)]">
            WhoFollows
          </h1>
          <p className="text-xs text-[var(--muted)]">
            누가 누구를 팔로우할까?
          </p>
        </div>
        <div className="pointer-events-auto">
          <span className="text-sm px-3 py-1.5 rounded-full bg-[var(--surface)]/80 backdrop-blur-sm border border-[var(--border)] text-[var(--foreground)]">
            {showName}
          </span>
        </div>
      </div>
    </header>
  );
}
