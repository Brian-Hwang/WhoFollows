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

    // 1. One-way follows
    for (const f of follows) {
      if (!followSet.has(`${f.target}->${f.source}`)) {
        result.push({
          emoji: '👀',
          textKo: `${ko(f.source)}은(는) ${ko(f.target)}을(를) 팔로우하지만, 맞팔이 아님`,
          textEn: `${en(f.source)} follows ${en(f.target)}, but not followed back`,
          textZh: `${zh(f.source)}关注了${zh(f.target)}，但对方没有回关`,
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
            textKo: `${ko(a)}와(과) ${ko(b)}은(는) 서로 팔로우하지 않음`,
            textEn: `${en(a)} and ${en(b)} don't follow each other`,
            textZh: `${zh(a)}和${zh(b)}互相没有关注`,
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
            textKo: `전 연인 ${ko(rel.source)}와(과) ${ko(rel.target)}은(는) 여전히 맞팔`,
            textEn: `Exes ${en(rel.source)} & ${en(rel.target)} still follow each other`,
            textZh: `前任${zh(rel.source)}和${zh(rel.target)}仍然互相关注`,
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
            textKo: `${ko(rel.target)}은(는) 전 연인 ${ko(rel.source)}을(를) 언팔`,
            textEn: `${en(rel.target)} unfollowed ex ${en(rel.source)}`,
            textZh: `${zh(rel.target)}取消了对前任${zh(rel.source)}的关注`,
            category: 'relationship',
          });
        } else if (!aFollowsB && bFollowsA) {
          result.push({
            emoji: '💔',
            textKo: `${ko(rel.source)}은(는) 전 연인 ${ko(rel.target)}을(를) 언팔`,
            textEn: `${en(rel.source)} unfollowed ex ${en(rel.target)}`,
            textZh: `${zh(rel.source)}取消了对前任${zh(rel.target)}的关注`,
            category: 'relationship',
          });
        } else if (!aFollowsB && !bFollowsA) {
          result.push({
            emoji: '💔',
            textKo: `전 연인 ${ko(rel.source)}와(과) ${ko(rel.target)}은(는) 서로 언팔`,
            textEn: `Exes ${en(rel.source)} & ${en(rel.target)} unfollowed each other`,
            textZh: `前任${zh(rel.source)}和${zh(rel.target)}互相取消了关注`,
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
          textKo: `${ko(rel.source)}와(과) ${ko(rel.target)}은(는) 현재 연애 중`,
          textEn: `${en(rel.source)} & ${en(rel.target)} are currently dating`,
          textZh: `${zh(rel.source)}和${zh(rel.target)}目前正在恋爱`,
          category: 'relationship',
        });
      }
    }

    // 6. Broken up
    for (const rel of relationships) {
      if (rel.type === 'not-together') {
        result.push({
          emoji: '😢',
          textKo: `${ko(rel.source)}와(과) ${ko(rel.target)}은(는) 결별`,
          textEn: `${en(rel.source)} & ${en(rel.target)} broke up`,
          textZh: `${zh(rel.source)}和${zh(rel.target)}已经分手`,
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
        textKo: `${ko(mostFollowed)}이(가) 가장 많은 팔로워 (${maxFollowers}명)`,
        textEn: `${en(mostFollowed)} has the most followers (${maxFollowers})`,
        textZh: `${zh(mostFollowed)}拥有最多粉丝（${maxFollowers}人）`,
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
        textKo: `${ko(leastFollowing)}이(가) 가장 적게 팔로잉 (${minFollowing}명)`,
        textEn: `${en(leastFollowing)} follows the fewest people (${minFollowing})`,
        textZh: `${zh(leastFollowing)}关注的人最少（${minFollowing}人）`,
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
