import { transitLove4 } from './transit-love-4';
import { singlesInferno4 } from './singles-inferno-4';
import { loveIsBlind8 } from './love-is-blind-8';
import type { ShowData } from '@/lib/types';

export interface ShowInfo {
  id: string;
  nameKo: string;
  nameEn: string;
  nameZh?: string;
  network: string;
  episodeCount: number;
  year: number;
  castCount: number;
}

export const shows: ShowInfo[] = [
  {
    id: 'transit-love-4',
    nameKo: '환승연애4',
    nameEn: 'Transit Love 4',
    nameZh: '换乘恋爱4',
    network: 'TVING',
    episodeCount: 21,
    year: 2025,
    castCount: 11,
  },
  {
    id: 'singles-inferno-4',
    nameKo: '솔로지옥4',
    nameEn: "Single's Inferno 4",
    nameZh: '单身即地狱4',
    network: 'Netflix',
    episodeCount: 12,
    year: 2025,
    castCount: 13,
  },
  {
    id: 'love-is-blind-8',
    nameKo: '러브 이즈 블라인드 8',
    nameEn: 'Love Is Blind 8',
    nameZh: '盲婚试爱8',
    network: 'Netflix',
    episodeCount: 12,
    year: 2025,
    castCount: 14,
  },
];

export function getShowData(id: string): ShowData | null {
  switch (id) {
    case 'transit-love-4':
      return transitLove4;
    case 'singles-inferno-4':
      return singlesInferno4;
    case 'love-is-blind-8':
      return loveIsBlind8;
    default:
      return null;
  }
}
