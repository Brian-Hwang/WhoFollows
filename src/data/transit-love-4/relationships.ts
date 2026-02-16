import { Relationship } from '@/lib/types';

export const relationships: Relationship[] = [
  { source: 'kim-woojin', target: 'hong-jiyeon', type: 'ex-couple' },
  { source: 'jung-wongyu', target: 'park-jihyun', type: 'ex-couple' },
  { source: 'kwak-minkyung', target: 'jo-yusik', type: 'ex-couple', label: '8년 연애' },
  { source: 'park-hyunji', target: 'seong-baekhyun', type: 'ex-couple' },
  { source: 'park-hyunji', target: 'shin-seungyong', type: 'ex-couple' },
  { source: 'choi-yunnyeong', target: 'lee-jaehyeong', type: 'ex-couple' },

  { source: 'kim-woojin', target: 'hong-jiyeon', type: 'confirmed-couple' },
  { source: 'jung-wongyu', target: 'park-jihyun', type: 'confirmed-couple' },
  { source: 'seong-baekhyun', target: 'choi-yunnyeong', type: 'confirmed-couple' },
  { source: 'jo-yusik', target: 'park-hyunji', type: 'not-together' },
];
