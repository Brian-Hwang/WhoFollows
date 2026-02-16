'use client';

import { useState } from 'react';

const LEGEND_ITEMS = [
  { label: '팔로우', color: '#64748b', width: 1, dashed: false, arrow: true },
  { label: '맞팔로우', color: '#94a3b8', width: 2, dashed: false, arrow: false },
  { label: '전 연인', color: '#f59e0b', width: 1.5, dashed: true, arrow: false },
  { label: '연애 중', color: '#ef4444', width: 3, dashed: false, arrow: false },
  { label: '결별', color: '#6b7280', width: 1.5, dashed: true, arrow: false },
];

export default function Legend() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-1 cursor-pointer"
      >
        {collapsed ? '범례 ▸' : '범례 ▾'}
      </button>

      {!collapsed && (
        <div className="bg-[var(--surface)]/80 backdrop-blur-sm rounded-lg p-3 border border-[var(--border)]">
          <div className="space-y-2">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <svg width="32" height="12" className="shrink-0">
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
