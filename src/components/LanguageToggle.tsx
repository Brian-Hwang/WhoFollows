'use client';

import { useI18n } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'ko', label: 'KO' },
  { value: 'en', label: 'EN' },
];

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm">
      {LOCALES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setLocale(value)}
          className={`
            px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 cursor-pointer
            ${locale === value
              ? 'bg-[var(--accent-blue)] text-white'
              : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
