import { ShowData } from '@/lib/types';
import { cast } from './cast';
import { relationships } from './relationships';
import { follows } from './follows';

export const loveIsBlind8: ShowData = {
  id: 'love-is-blind-8',
  nameKo: '러브 이즈 블라인드 8',
  nameEn: 'Love Is Blind 8',
  network: 'Netflix',
  episodes: 12,
  airDateStart: '2025-02-14',
  airDateEnd: '2025-03-09',
  cast,
  relationships,
  follows,
  lastVerified: '2026-02-16',
};

export { cast, relationships, follows };
