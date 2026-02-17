'use client';

import { useMemo } from 'react';
import type { ShowData } from '@/lib/types';
import { useI18n, type TranslationKey } from '@/lib/i18n';

interface InsightsPanelProps {
  showData: ShowData;
}

interface Insight {
  emoji: string;
  textKo: string;
  textEn: string;
  textZh: string;
  category: 'follow' | 'relationship';
}

export default function InsightsPanel({ showData }: InsightsPanelProps) {
  const { locale } = useI18n();

  const insights = useMemo(() => {
    const result: Insight[] = [];
    const { cast, follows, relationships } = showData;
    const castMap = new Map(cast.map(c => [c.id, c]));
    const followSet = new Set(follows.map(f => `${f.source}->${f.target}`));

    const ko = (id: string) => castMap.get(id)?.nameKo ?? id;
    const en = (id: string) => castMap.get(id)?.nameEn ?? id;
    const zh = (id: string) => castMap.get(id)?.nameZh ?? castMap.get(id)?.nameEn ?? id;

    const enFull = en;
    const koFull = ko;
    const zhFull = zh;

    // 1. One-way follows
    for (const f of follows) {
      if (!followSet.has(`${f.target}->${f.source}`)) {
        result.push({
          emoji: '👀',
          textKo: `${koFull(f.source)} → ${koFull(f.target)} (맞팔 ✗)`,
          textEn: `${enFull(f.source)} → ${enFull(f.target)} (not mutual)`,
          textZh: `${zhFull(f.source)} → ${zhFull(f.target)} (未回关)`,
          category: 'follow',
        });
      }
    }

    // 2. Mutual non-follows
    const nodeIds = cast.map(c => c.id);
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const a = nodeIds[i], b = nodeIds[j];
        if (!followSet.has(`${a}->${b}`) && !followSet.has(`${b}->${a}`)) {
          result.push({
            emoji: '🚫',
            textKo: `${koFull(a)} ✗ ${koFull(b)}`,
            textEn: `${enFull(a)} ✗ ${enFull(b)}`,
            textZh: `${zhFull(a)} ✗ ${zhFull(b)}`,
            category: 'follow',
          });
        }
      }
    }

    // 3. Ex-couples still mutual
    for (const rel of relationships) {
      if (rel.type === 'ex-couple') {
        const aFollowsB = followSet.has(`${rel.source}->${rel.target}`);
        const bFollowsA = followSet.has(`${rel.target}->${rel.source}`);
        if (aFollowsB && bFollowsA) {
          result.push({
            emoji: '🤝',
            textKo: `전 연인 ${koFull(rel.source)} ↔ ${koFull(rel.target)} 맞팔 유지`,
            textEn: `Exes ${enFull(rel.source)} ↔ ${enFull(rel.target)} still mutual`,
            textZh: `前任 ${zhFull(rel.source)} ↔ ${zhFull(rel.target)} 仍互关`,
            category: 'relationship',
          });
        }
      }
    }

    // 4. Ex-couples where one/both unfollowed
    for (const rel of relationships) {
      if (rel.type === 'ex-couple') {
        const aFollowsB = followSet.has(`${rel.source}->${rel.target}`);
        const bFollowsA = followSet.has(`${rel.target}->${rel.source}`);
        if (aFollowsB && !bFollowsA) {
          result.push({
            emoji: '💔',
            textKo: `${koFull(rel.target)} → ${koFull(rel.source)} 언팔`,
            textEn: `${enFull(rel.target)} unfollowed ex ${enFull(rel.source)}`,
            textZh: `${zhFull(rel.target)} 取关前任 ${zhFull(rel.source)}`,
            category: 'relationship',
          });
        } else if (!aFollowsB && bFollowsA) {
          result.push({
            emoji: '💔',
            textKo: `${koFull(rel.source)} → ${koFull(rel.target)} 언팔`,
            textEn: `${enFull(rel.source)} unfollowed ex ${enFull(rel.target)}`,
            textZh: `${zhFull(rel.source)} 取关前任 ${zhFull(rel.target)}`,
            category: 'relationship',
          });
        } else if (!aFollowsB && !bFollowsA) {
          result.push({
            emoji: '💔',
            textKo: `전 연인 ${koFull(rel.source)} ✗ ${koFull(rel.target)} 서로 언팔`,
            textEn: `Exes ${enFull(rel.source)} ✗ ${enFull(rel.target)} mutual unfollow`,
            textZh: `前任 ${zhFull(rel.source)} ✗ ${zhFull(rel.target)} 互相取关`,
            category: 'relationship',
          });
        }
      }
    }

    // 5. Confirmed couples
    for (const rel of relationships) {
      if (rel.type === 'confirmed-couple') {
        result.push({
          emoji: '❤️',
          textKo: `${koFull(rel.source)} ♥ ${koFull(rel.target)} 연애 중`,
          textEn: `${enFull(rel.source)} ♥ ${enFull(rel.target)} dating`,
          textZh: `${zhFull(rel.source)} ♥ ${zhFull(rel.target)} 恋爱中`,
          category: 'relationship',
        });
      }
    }

    // 6. Broken up
    for (const rel of relationships) {
      if (rel.type === 'not-together') {
        result.push({
          emoji: '😢',
          textKo: `${koFull(rel.source)} ✗ ${koFull(rel.target)} 결별`,
          textEn: `${enFull(rel.source)} ✗ ${enFull(rel.target)} broke up`,
          textZh: `${zhFull(rel.source)} ✗ ${zhFull(rel.target)} 分手`,
          category: 'relationship',
        });
      }
    }

    // 7. Most followed
    const followerCounts = new Map<string, number>();
    for (const f of follows) followerCounts.set(f.target, (followerCounts.get(f.target) || 0) + 1);
    let maxFollowers = 0, mostFollowed = '';
    for (const [id, count] of followerCounts) {
      if (count > maxFollowers) { maxFollowers = count; mostFollowed = id; }
    }
    if (mostFollowed) {
      result.push({
        emoji: '👑',
        textKo: `${koFull(mostFollowed)} — 최다 팔로워 (${maxFollowers})`,
        textEn: `${enFull(mostFollowed)} — most followers (${maxFollowers})`,
        textZh: `${zhFull(mostFollowed)} — 最多粉丝 (${maxFollowers})`,
        category: 'follow',
      });
    }

    // 8. Least following
    const followingCounts = new Map<string, number>();
    for (const c of cast) followingCounts.set(c.id, 0);
    for (const f of follows) followingCounts.set(f.source, (followingCounts.get(f.source) || 0) + 1);
    let minFollowing = Infinity, leastFollowing = '';
    for (const [id, count] of followingCounts) {
      if (count < minFollowing) { minFollowing = count; leastFollowing = id; }
    }
    if (leastFollowing && minFollowing < cast.length - 1) {
      result.push({
        emoji: '🤔',
        textKo: `${koFull(leastFollowing)} — 최소 팔로잉 (${minFollowing})`,
        textEn: `${enFull(leastFollowing)} — fewest following (${minFollowing})`,
        textZh: `${zhFull(leastFollowing)} — 最少关注 (${minFollowing})`,
        category: 'follow',
      });
    }

    return result;
  }, [showData, locale]);

  if (insights.length === 0) return null;

  return (
    <div className="fixed top-16 left-4 z-30 w-[320px] max-h-[calc(100vh-160px)] overflow-y-auto">
      <div className="bg-[var(--surface)]/90 backdrop-blur-sm rounded-xl border border-[var(--border)] shadow-xl">
        <div className="px-4 pt-3 pb-2">
          <h3 className="text-base font-bold text-[var(--foreground)] tracking-wide">
            {locale === 'zh' ? '洞察' : locale === 'en' ? 'Insights' : '인사이트'}
          </h3>
        </div>
        <div className="px-3 pb-3 space-y-1.5">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[var(--surface-hover)]/50 transition-colors"
            >
              <span className="text-lg shrink-0 mt-0.5">{insight.emoji}</span>
              <p className="text-[13px] text-[var(--foreground)] leading-relaxed">
                {locale === 'zh' ? insight.textZh : locale === 'en' ? insight.textEn : insight.textKo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
