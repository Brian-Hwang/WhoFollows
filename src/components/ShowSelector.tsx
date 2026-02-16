'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ShowInfo } from '@/data/shows';

interface ShowSelectorProps {
  shows: ShowInfo[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ShowSelector({ shows, selectedId, onSelect }: ShowSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = shows.find((s) => s.id === selectedId) ?? shows[0];

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClickOutside]);

  const handleSelect = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative pointer-events-auto">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center gap-1.5
          text-sm px-3 py-1.5 rounded-full
          bg-[var(--surface)]/80 backdrop-blur-sm
          border border-[var(--border)]
          text-[var(--foreground)]
          transition-colors duration-150
          hover:bg-[var(--surface-hover)]/80
          cursor-pointer
        "
      >
        {current?.nameKo ?? '프로그램 선택'}
        <span
          className="text-[10px] text-[var(--muted)] transition-transform duration-200"
          style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      <div
        className="
          absolute right-0 top-full mt-2
          min-w-[240px]
          rounded-xl overflow-hidden
          bg-[var(--surface)]/90 backdrop-blur-md
          border border-[var(--border)]
          shadow-2xl shadow-black/40
          transition-all duration-200 origin-top-right
        "
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.96)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div className="px-3 pt-3 pb-1.5">
          <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-medium">
            프로그램
          </p>
        </div>

        <div className="px-1.5 pb-1.5">
          {shows.map((show) => {
            const isSelected = show.id === selectedId;
            return (
              <button
                key={show.id}
                onClick={() => handleSelect(show.id)}
                className={`
                  w-full text-left px-3 py-2.5 rounded-lg
                  flex items-start gap-3
                  transition-colors duration-100 cursor-pointer
                  ${isSelected
                    ? 'bg-[var(--foreground)]/10'
                    : 'hover:bg-[var(--surface-hover)]/60'
                  }
                `}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--foreground)] truncate">
                      {show.nameKo}
                    </span>
                    {isSelected && (
                      <span className="text-xs text-[var(--muted)]">✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--foreground)]/5 border border-[var(--border)] text-[var(--muted)] font-medium">
                      {show.network}
                    </span>
                    <span className="text-[11px] text-[var(--muted)]">
                      {show.castCount}명 · {show.year}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
