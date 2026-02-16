'use client';

import type { GraphNode } from '@/lib/types';
import type { Relationship, Follow, CastMember } from '@/lib/types';

interface ProfilePanelProps {
  node: GraphNode | null;
  relationships: Relationship[];
  follows: Follow[];
  cast: CastMember[];
  onClose: () => void;
}

const RELATIONSHIP_LABELS: Record<Relationship['type'], { label: string; color: string }> = {
  'ex-couple': { label: '전 연인', color: 'var(--accent-amber)' },
  'final-couple': { label: '최종 커플', color: 'var(--accent-pink)' },
  'confirmed-couple': { label: '연애 중 ♥', color: 'var(--accent-red)' },
  'not-together': { label: '결별', color: 'var(--muted)' },
};

export default function ProfilePanel({
  node,
  relationships,
  follows,
  cast,
  onClose,
}: ProfilePanelProps) {
  const isOpen = node !== null;

  const castMap = new Map(cast.map((c) => [c.id, c]));

  const nodeRelationships = node
    ? relationships.filter((r) => r.source === node.id || r.target === node.id)
    : [];

  const following = node ? follows.filter((f) => f.source === node.id) : [];
  const followers = node ? follows.filter((f) => f.target === node.id) : [];

  function getPartnerName(rel: Relationship, currentId: string): string {
    const partnerId = rel.source === currentId ? rel.target : rel.source;
    return castMap.get(partnerId)?.nameKo ?? partnerId;
  }

  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-[360px] max-w-[90vw] z-50
        bg-[var(--surface)] border-l border-[var(--border)]
        shadow-2xl transition-transform duration-300 ease-in-out
        overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {node && (
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-xl leading-none cursor-pointer"
            aria-label="닫기"
          >
            ✕
          </button>

          <div className="flex flex-col items-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-medium mb-3"
              style={{ backgroundColor: node.color }}
            >
              {node.initial}
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              {node.nameKo}
            </h2>
            <p className="text-sm text-[var(--muted)]">{node.nameEn}</p>
            <a
              href={`https://instagram.com/${node.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm text-[var(--accent-pink)] hover:underline"
            >
              @{node.instagram}
            </a>
          </div>

          <div className="space-y-1 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">직업</span>
              <span className="text-[var(--foreground)]">{node.occupation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">나이</span>
              <span className="text-[var(--foreground)]">{node.age}세</span>
            </div>
          </div>

          {nodeRelationships.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
                관계
              </h3>
              <div className="space-y-2">
                {nodeRelationships.map((rel, i) => {
                  const meta = RELATIONSHIP_LABELS[rel.type];
                  return (
                    <div
                      key={`${rel.source}-${rel.target}-${rel.type}-${i}`}
                      className="flex items-center justify-between bg-[var(--background)] rounded-lg px-3 py-2"
                    >
                      <span className="text-sm text-[var(--foreground)]">
                        {getPartnerName(rel, node.id)}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          color: meta.color,
                          backgroundColor: `color-mix(in srgb, ${meta.color} 15%, transparent)`,
                        }}
                      >
                        {meta.label}
                        {rel.label ? ` · ${rel.label}` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
              팔로우
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[var(--background)] rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-[var(--foreground)]">
                  {following.length}
                </div>
                <div className="text-xs text-[var(--muted)]">팔로잉</div>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-[var(--foreground)]">
                  {followers.length}
                </div>
                <div className="text-xs text-[var(--muted)]">팔로워</div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-[var(--muted)] mb-1">팔로잉</p>
              {following.map((f) => {
                const target = castMap.get(f.target);
                const isMutual = followers.some((fl) => fl.source === f.target);
                return (
                  <div
                    key={f.target}
                    className="flex items-center justify-between text-sm py-1"
                  >
                    <span className="text-[var(--foreground)]">
                      {target?.nameKo ?? f.target}
                    </span>
                    {isMutual && (
                      <span className="text-xs text-[var(--accent-blue)]">
                        맞팔
                      </span>
                    )}
                  </div>
                );
              })}
              {following.length === 0 && (
                <p className="text-xs text-[var(--muted)] italic">없음</p>
              )}
            </div>

            <div className="space-y-1 mt-3">
              <p className="text-xs text-[var(--muted)] mb-1">팔로워</p>
              {followers
                .filter((f) => !following.some((fl) => fl.target === f.source))
                .map((f) => {
                  const source = castMap.get(f.source);
                  return (
                    <div
                      key={f.source}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <span className="text-[var(--foreground)]">
                        {source?.nameKo ?? f.source}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        팔로워만
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
