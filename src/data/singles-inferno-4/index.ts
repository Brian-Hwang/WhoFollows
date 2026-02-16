import { ShowData } from '@/lib/types';
import { cast } from './cast';
import { relationships } from './relationships';
import { follows } from './follows';

export const singlesInferno4: ShowData = {
  id: 'singles-inferno-4',
  nameKo: '솔로지옥4',
  nameEn: "Single's Inferno 4",
  network: 'Netflix',
  episodes: 12,
  airDateStart: '2025-01-14',
  airDateEnd: '2025-02-11',
  cast,
  relationships,
  follows,
  lastVerified: '2026-02-16',
};

export { cast, relationships, follows };
