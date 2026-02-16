'use client';

import { useI18n } from '@/lib/i18n';

export default function ThemeToggle() {
  const { theme, setTheme } = useI18n();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--foreground)',
      }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-label="sun">
          <circle cx="8" cy="8" r="3" />
          <line x1="8" y1="1" x2="8" y2="3" />
          <line x1="8" y1="13" x2="8" y2="15" />
          <line x1="1" y1="8" x2="3" y2="8" />
          <line x1="13" y1="8" x2="15" y2="8" />
          <line x1="3.05" y1="3.05" x2="4.46" y2="4.46" />
          <line x1="11.54" y1="11.54" x2="12.95" y2="12.95" />
          <line x1="3.05" y1="12.95" x2="4.46" y2="11.54" />
          <line x1="11.54" y1="4.46" x2="12.95" y2="3.05" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-label="moon">
          <path d="M13.5 8.5a5.5 5.5 0 0 1-7-7 5.5 5.5 0 1 0 7 7z" />
        </svg>
      )}
    </button>
  );
}
