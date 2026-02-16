import ShowSelector from './ShowSelector';
import type { ShowInfo } from '@/data/shows';

interface HeaderProps {
  shows: ShowInfo[];
  selectedShowId: string;
  onShowSelect: (id: string) => void;
}

export default function Header({ shows, selectedShowId, onShowSelect }: HeaderProps) {
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
        <ShowSelector
          shows={shows}
          selectedId={selectedShowId}
          onSelect={onShowSelect}
        />
      </div>
    </header>
  );
}
