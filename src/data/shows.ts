import { transitLove4 } from './transit-love-4';
import type { ShowData } from '@/lib/types';

export interface ShowInfo {
  id: string;
  nameKo: string;
  nameEn: string;
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
    network: 'TVING',
    episodeCount: 21,
    year: 2025,
    castCount: 11,
  },
];

export function getShowData(id: string): ShowData | null {
  switch (id) {
    case 'transit-love-4':
      return transitLove4;
    default:
      return null;
  }
}
