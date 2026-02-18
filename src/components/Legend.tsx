'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function Legend() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useI18n();

  // Legend items built inside component to access t()
  const legendItems = [
    { label: t('legend.oneWayFollow'), color: '#9B8816', width: 2.5, dashed: false, arrow: true, glow: true },
    { label: t('legend.mutualFollow'), color: '#8A8890', width: 2, dashed: false, arrow: false, glow: false },
    { label: t('legend.exCouple'), color: '#9B8816', width: 1.5, dashed: true, arrow: false, glow: false },
    { label: t('legend.dating'), color: '#14248A', width: 3, dashed: false, arrow: false, glow: false },
    { label: t('legend.brokenUp'), color: '#6B6878', width: 1.5, dashed: true, arrow: false, glow: false },
    { label: t('legend.nonFollow'), color: '#14248A', width: 1.5, dashed: true, arrow: false, glow: false, cross: true },
  ];

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-1 cursor-pointer"
      >
        {collapsed ? `${t('legend.title')} ▸` : `${t('legend.title')} ▾`}
      </button>

      {!collapsed && (
        <div className="bg-[var(--surface)]/80 backdrop-blur-sm rounded-lg p-3 border border-[var(--border)]">
          <div className="space-y-2">
            {legendItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <svg width="32" height="12" className="shrink-0">
                  {/* Glow effect for one-way follow */}
                  {item.glow && (
                    <line
                      x1="2"
                      y1="6"
                      x2={item.arrow ? 24 : 30}
                      y2="6"
                      stroke={item.color}
                      strokeWidth={item.width + 3}
                      strokeOpacity={0.3}
                    />
                  )}
                  <line
                    x1="2"
                    y1="6"
                    x2={item.arrow ? 24 : 30}
                    y2="6"
                    stroke={item.color}
                    strokeWidth={item.width}
                    strokeDasharray={item.dashed ? '4 3' : 'none'}
                  />
                  {item.arrow && (
                    <polygon
                      points="24,2 30,6 24,10"
                      fill={item.color}
                    />
                  )}
                  {(item as { cross?: boolean }).cross && (
                    <>
                      <line x1="13" y1="2" x2="19" y2="10" stroke="#14248A" strokeWidth="2" />
                      <line x1="19" y1="2" x2="13" y2="10" stroke="#14248A" strokeWidth="2" />
                    </>
                  )}
                </svg>
                <span className="text-xs text-[var(--foreground)]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
