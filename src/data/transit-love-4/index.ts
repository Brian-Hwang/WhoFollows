import { ShowData } from '@/lib/types';
import { cast } from './cast';
import { relationships } from './relationships';
import { follows } from './follows';

export const transitLove4: ShowData = {
  id: 'transit-love-4',
  nameKo: '환승연애4',
  nameEn: 'Transit Love 4',
  network: 'TVING',
  episodes: 21,
  airDateStart: '2025-10-01',
  airDateEnd: '2026-01-21',
  cast,
  relationships,
  follows,
};

export { cast, relationships, follows };
