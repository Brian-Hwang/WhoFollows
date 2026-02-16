'use client';

import ShowSelector from './ShowSelector';
import LanguageToggle from './LanguageToggle';
import type { ShowInfo } from '@/data/shows';
import { useI18n } from '@/lib/i18n';

interface HeaderProps {
  shows: ShowInfo[];
  selectedShowId: string;
  onShowSelect: (id: string) => void;
}

export default function Header({ shows, selectedShowId, onShowSelect }: HeaderProps) {
  const { t } = useI18n();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="pointer-events-auto">
          <h1 className="text-lg font-bold text-[var(--foreground)]">
            WhoFollows
          </h1>
          <p className="text-xs text-[var(--muted)]">
            {t('header.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          <LanguageToggle />
          <ShowSelector
            shows={shows}
            selectedId={selectedShowId}
            onSelect={onShowSelect}
          />
        </div>
      </div>
    </header>
  );
}
