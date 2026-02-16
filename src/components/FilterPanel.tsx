'use client';

import { useI18n } from '@/lib/i18n';

interface FilterPanelProps {
  showFollows: boolean;
  showNonFollows: boolean;
  showRelationships: boolean;
  onToggleFollows: () => void;
  onToggleNonFollows: () => void;
  onToggleRelationships: () => void;
}

export default function FilterPanel({
  showFollows,
  showNonFollows,
  showRelationships,
  onToggleFollows,
  onToggleNonFollows,
  onToggleRelationships,
}: FilterPanelProps) {
  const { t } = useI18n();

  const toggles = [
    { label: t('filter.follows'), active: showFollows, onToggle: onToggleFollows },
    { label: t('filter.nonFollows'), active: showNonFollows, onToggle: onToggleNonFollows },
    { label: t('filter.relationships'), active: showRelationships, onToggle: onToggleRelationships },
  ];

  return (
    <div className="bg-[var(--surface)]/80 backdrop-blur-sm rounded-lg p-2.5 border border-[var(--border)]">
      <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-medium mb-2 px-0.5">
        {t('filter.title')}
      </p>
      <div className="flex gap-1.5">
        {toggles.map(({ label, active, onToggle }) => (
          <button
            key={label}
            onClick={onToggle}
            className={`
              px-2.5 py-1 text-xs rounded-md transition-colors duration-150 cursor-pointer
              border
              ${active
                ? 'bg-[var(--foreground)]/10 border-[var(--foreground)]/20 text-[var(--foreground)]'
                : 'bg-transparent border-[var(--border)] text-[var(--muted)] line-through'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
