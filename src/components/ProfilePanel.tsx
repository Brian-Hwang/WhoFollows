'use client';

import type { GraphNode } from '@/lib/types';
import type { Relationship, Follow, CastMember } from '@/lib/types';
import { useI18n, type TranslationKey } from '@/lib/i18n';

interface ProfilePanelProps {
  node: GraphNode | null;
  relationships: Relationship[];
  follows: Follow[];
  cast: CastMember[];
  onClose: () => void;
}

const REL_META: Record<Relationship['type'], { key: TranslationKey; color: string }> = {
  'ex-couple': { key: 'rel.exCouple', color: 'var(--accent-amber)' },
  'final-couple': { key: 'rel.finalCouple', color: 'var(--accent-pink)' },
  'confirmed-couple': { key: 'rel.confirmedCouple', color: 'var(--accent-red)' },
  'not-together': { key: 'rel.notTogether', color: 'var(--muted)' },
};

export default function ProfilePanel({
  node,
  relationships,
  follows,
  cast,
  onClose,
}: ProfilePanelProps) {
  const { locale, t } = useI18n();
  const isOpen = node !== null;

  const castMap = new Map(cast.map((c) => [c.id, c]));

  const nodeRelationships = node
    ? relationships.filter((r) => r.source === node.id || r.target === node.id)
    : [];

  const following = node ? follows.filter((f) => f.source === node.id) : [];
  const followers = node ? follows.filter((f) => f.target === node.id) : [];

  function getName(member: CastMember | undefined, fallback: string): string {
    if (!member) return fallback;
    return locale === 'zh' ? (member.nameZh ?? member.nameEn) : locale === 'en' ? member.nameEn : member.nameKo;
  }

  function getPartnerName(rel: Relationship, currentId: string): string {
    const partnerId = rel.source === currentId ? rel.target : rel.source;
    return getName(castMap.get(partnerId), partnerId);
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
            aria-label={t('profile.close')}
          >
            ✕
          </button>

          <div className="flex flex-col items-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-medium mb-3 overflow-hidden"
              style={{ backgroundColor: node.color }}
            >
              {node.profileImage ? (
                <img
                  src={node.profileImage}
                  alt={node.nameEn}
                  className="w-full h-full object-cover"
                />
              ) : (
                node.initial
              )}
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              {locale === 'zh' ? (node.nameZh ?? node.nameEn) : locale === 'en' ? node.nameEn : node.nameKo}
            </h2>
            <p className="text-sm text-[var(--muted)]">{locale === 'zh' ? node.nameKo : locale === 'en' ? node.nameKo : node.nameEn}</p>
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
              <span className="text-[var(--muted)]">{t('profile.occupation')}</span>
              <span className="text-[var(--foreground)]">{t(`occ.${node.occupation}` as TranslationKey)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">{t('profile.age')}</span>
              <span className="text-[var(--foreground)]">{node.age}{t('profile.ageSuffix')}</span>
            </div>
          </div>

          {nodeRelationships.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
                {t('profile.relationships')}
              </h3>
              <div className="space-y-2">
                {nodeRelationships.map((rel, i) => {
                   const meta = REL_META[rel.type];
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
                        {t(meta.key)}
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
              {t('profile.follows')}
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[var(--background)] rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-[var(--foreground)]">
                  {following.length}
                </div>
                <div className="text-xs text-[var(--muted)]">{t('profile.following')}</div>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-[var(--foreground)]">
                  {followers.length}
                </div>
                <div className="text-xs text-[var(--muted)]">{t('profile.followers')}</div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-[var(--muted)] mb-1">{t('profile.following')}</p>
              {following.map((f) => {
                const target = castMap.get(f.target);
                const isMutual = followers.some((fl) => fl.source === f.target);
                return (
                  <div
                    key={f.target}
                    className="flex items-center justify-between text-sm py-1"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-white font-medium"
                        style={{ backgroundColor: target?.color ?? '#666' }}
                      >
                        {target?.profileImage ? (
                          <img src={target.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          target?.initial ?? '?'
                        )}
                      </div>
                      <span className="text-[var(--foreground)]">
                        {getName(target, f.target)}
                      </span>
                    </div>
                    {isMutual && (
                      <span className="text-xs text-[var(--accent-blue)]">
                        {t('profile.mutual')}
                      </span>
                    )}
                  </div>
                );
              })}
              {following.length === 0 && (
                <p className="text-xs text-[var(--muted)] italic">{t('profile.none')}</p>
              )}
            </div>

            <div className="space-y-1 mt-3">
              <p className="text-xs text-[var(--muted)] mb-1">{t('profile.followers')}</p>
              {followers
                .filter((f) => !following.some((fl) => fl.target === f.source))
                .map((f) => {
                  const source = castMap.get(f.source);
                  return (
                    <div
                      key={f.source}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-white font-medium"
                          style={{ backgroundColor: source?.color ?? '#666' }}
                        >
                          {source?.profileImage ? (
                            <img src={source.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            source?.initial ?? '?'
                          )}
                        </div>
                        <span className="text-[var(--foreground)]">
                          {getName(source, f.source)}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--muted)]">
                        {t('profile.followerOnly')}
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
