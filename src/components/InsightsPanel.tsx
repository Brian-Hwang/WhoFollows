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
  category: 'follow' | 'relationship';
}

export default function InsightsPanel({ showData }: InsightsPanelProps) {
  const { locale } = useI18n();

  const insights = useMemo(() => {
    const result: Insight[] = [];
    const { cast, follows, relationships } = showData;
    const castMap = new Map(cast.map(c => [c.id, c]));
    const followSet = new Set(follows.map(f => `${f.source}->${f.target}`));

    const name = (id: string) => {
      const c = castMap.get(id);
      if (!c) return id;
      return locale === 'en' ? c.nameEn : c.nameKo;
    };

    // 1. One-way follows (A follows B but B doesn't follow A)
    for (const f of follows) {
      const reverse = `${f.target}->${f.source}`;
      if (!followSet.has(reverse)) {
        result.push({
          emoji: '👀',
          textKo: `${castMap.get(f.source)?.nameKo}은(는) ${castMap.get(f.target)?.nameKo}을(를) 팔로우하지만, 맞팔이 아님`,
          textEn: `${castMap.get(f.source)?.nameEn} follows ${castMap.get(f.target)?.nameEn}, but not followed back`,
          category: 'follow',
        });
      }
    }

    // 2. Mutual non-follows (neither follows the other)
    const nodeIds = cast.map(c => c.id);
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const a = nodeIds[i], b = nodeIds[j];
        if (!followSet.has(`${a}->${b}`) && !followSet.has(`${b}->${a}`)) {
          result.push({
            emoji: '🚫',
            textKo: `${castMap.get(a)?.nameKo}와(과) ${castMap.get(b)?.nameKo}은(는) 서로 팔로우하지 않음`,
            textEn: `${castMap.get(a)?.nameEn} and ${castMap.get(b)?.nameEn} don't follow each other`,
            category: 'follow',
          });
        }
      }
    }

    // 3. Ex-couples who are still mutual follows
    for (const rel of relationships) {
      if (rel.type === 'ex-couple') {
        const aFollowsB = followSet.has(`${rel.source}->${rel.target}`);
        const bFollowsA = followSet.has(`${rel.target}->${rel.source}`);
        if (aFollowsB && bFollowsA) {
          result.push({
            emoji: '🤝',
            textKo: `전 연인 ${castMap.get(rel.source)?.nameKo}와(과) ${castMap.get(rel.target)?.nameKo}은(는) 여전히 맞팔`,
            textEn: `Exes ${castMap.get(rel.source)?.nameEn} & ${castMap.get(rel.target)?.nameEn} still follow each other`,
            category: 'relationship',
          });
        }
      }
    }

    // 4. Ex-couples where one unfollowed
    for (const rel of relationships) {
      if (rel.type === 'ex-couple') {
        const aFollowsB = followSet.has(`${rel.source}->${rel.target}`);
        const bFollowsA = followSet.has(`${rel.target}->${rel.source}`);
        if (aFollowsB && !bFollowsA) {
          result.push({
            emoji: '💔',
            textKo: `${castMap.get(rel.target)?.nameKo}은(는) 전 연인 ${castMap.get(rel.source)?.nameKo}을(를) 언팔`,
            textEn: `${castMap.get(rel.target)?.nameEn} unfollowed ex ${castMap.get(rel.source)?.nameEn}`,
            category: 'relationship',
          });
        } else if (!aFollowsB && bFollowsA) {
          result.push({
            emoji: '💔',
            textKo: `${castMap.get(rel.source)?.nameKo}은(는) 전 연인 ${castMap.get(rel.target)?.nameKo}을(를) 언팔`,
            textEn: `${castMap.get(rel.source)?.nameEn} unfollowed ex ${castMap.get(rel.target)?.nameEn}`,
            category: 'relationship',
          });
        } else if (!aFollowsB && !bFollowsA) {
          result.push({
            emoji: '💔',
            textKo: `전 연인 ${castMap.get(rel.source)?.nameKo}와(과) ${castMap.get(rel.target)?.nameKo}은(는) 서로 언팔`,
            textEn: `Exes ${castMap.get(rel.source)?.nameEn} & ${castMap.get(rel.target)?.nameEn} unfollowed each other`,
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
          textKo: `${castMap.get(rel.source)?.nameKo}와(과) ${castMap.get(rel.target)?.nameKo}은(는) 현재 연애 중`,
          textEn: `${castMap.get(rel.source)?.nameEn} & ${castMap.get(rel.target)?.nameEn} are currently dating`,
          category: 'relationship',
        });
      }
    }

    // 6. Broken up couples
    for (const rel of relationships) {
      if (rel.type === 'not-together') {
        result.push({
          emoji: '😢',
          textKo: `${castMap.get(rel.source)?.nameKo}와(과) ${castMap.get(rel.target)?.nameKo}은(는) 결별`,
          textEn: `${castMap.get(rel.source)?.nameEn} & ${castMap.get(rel.target)?.nameEn} broke up`,
          category: 'relationship',
        });
      }
    }

    // 7. Most followed person
    const followerCounts = new Map<string, number>();
    for (const f of follows) {
      followerCounts.set(f.target, (followerCounts.get(f.target) || 0) + 1);
    }
    let maxFollowers = 0;
    let mostFollowed = '';
    for (const [id, count] of followerCounts) {
      if (count > maxFollowers) {
        maxFollowers = count;
        mostFollowed = id;
      }
    }
    if (mostFollowed) {
      result.push({
        emoji: '👑',
        textKo: `${castMap.get(mostFollowed)?.nameKo}이(가) 가장 많은 팔로워 (${maxFollowers}명)`,
        textEn: `${castMap.get(mostFollowed)?.nameEn} has the most followers (${maxFollowers})`,
        category: 'follow',
      });
    }

    // 8. Person following the least
    const followingCounts = new Map<string, number>();
    for (const c of cast) followingCounts.set(c.id, 0);
    for (const f of follows) {
      followingCounts.set(f.source, (followingCounts.get(f.source) || 0) + 1);
    }
    let minFollowing = Infinity;
    let leastFollowing = '';
    for (const [id, count] of followingCounts) {
      if (count < minFollowing) {
        minFollowing = count;
        leastFollowing = id;
      }
    }
    if (leastFollowing && minFollowing < cast.length - 1) {
      result.push({
        emoji: '🤔',
        textKo: `${castMap.get(leastFollowing)?.nameKo}이(가) 가장 적게 팔로잉 (${minFollowing}명)`,
        textEn: `${castMap.get(leastFollowing)?.nameEn} follows the fewest people (${minFollowing})`,
        category: 'follow',
      });
    }

    return result;
  }, [showData, locale]);

  if (insights.length === 0) return null;

  return (
    <div className="fixed top-16 left-4 z-30 w-[300px] max-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="bg-[var(--surface)]/90 backdrop-blur-sm rounded-xl border border-[var(--border)] shadow-xl">
        <div className="px-4 pt-3 pb-2">
          <h3 className="text-base font-bold text-[var(--foreground)] tracking-wide">
            {locale === 'en' ? 'Insights' : '인사이트'}
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
                {locale === 'en' ? insight.textEn : insight.textKo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
