import { Relationship } from '@/lib/types';

export const relationships: Relationship[] = [
  // Final couples from the show
  { source: 'lee-sian', target: 'yuk-junseo', type: 'final-couple' },
  { source: 'kim-arin', target: 'kook-dongho', type: 'final-couple' },
  { source: 'kim-hyejin', target: 'an-jonghoon', type: 'final-couple' },
  { source: 'bae-jiyeon', target: 'kim-taehwan', type: 'final-couple' },

  // Post-show status (as of early 2025)
  // Si-an & Jun-seo: confirmed NOT dating — "친한 오빠·동생 사이"
  { source: 'lee-sian', target: 'yuk-junseo', type: 'not-together' },
  // A-rin & Dong-ho: likely still dating (lovstagram posts)
  { source: 'kim-arin', target: 'kook-dongho', type: 'confirmed-couple' },
];
