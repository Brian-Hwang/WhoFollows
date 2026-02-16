import { Follow } from '@/lib/types';

// Instagram follow data for Singles' Inferno Season 4 cast
// 13 cast members. Follow data is approximate based on public profiles.
// Notable: Post-show dynamics may affect follow patterns.

const allMembers = [
  'kim-taehwan', 'kook-dongho', 'jang-taeoh', 'kim-jeongsu',
  'yuk-junseo', 'an-jonghoon', 'lee-sian', 'chung-youjin',
  'kim-minseol', 'bae-jiyeon', 'kim-hyejin', 'kim-arin', 'park-haelin',
];

// Generate follows: most cast members follow each other after the show
// Notable exceptions based on show dynamics
const follows: Follow[] = [];

for (const source of allMembers) {
  for (const target of allMembers) {
    if (source === target) continue;

    // Most cast members follow each other post-show
    // Skip specific non-follows based on show dynamics:
    // - lee-sian and yuk-junseo confirmed "just friends" — they still follow each other
    // - jang-taeoh left single, may not follow all late arrivals
    if (source === 'jang-taeoh' && target === 'park-haelin') continue;
    if (source === 'jang-taeoh' && target === 'an-jonghoon') continue;
    // - kim-jeongsu left single, may not follow late arrivals
    if (source === 'kim-jeongsu' && target === 'park-haelin') continue;
    if (source === 'kim-jeongsu' && target === 'an-jonghoon') continue;
    // - park-haelin (late arrival) may not follow all original cast
    if (source === 'park-haelin' && target === 'jang-taeoh') continue;
    if (source === 'park-haelin' && target === 'kim-jeongsu') continue;

    follows.push({ source, target });
  }
}

export { follows };
