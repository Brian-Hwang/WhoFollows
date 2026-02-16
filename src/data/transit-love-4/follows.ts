import { Follow } from '@/lib/types';

/**
 * Placeholder follow data based on realistic patterns:
 * - Confirmed couples mutually follow each other
 * - Most cast members follow each other (~80% mutual)
 * - jo-yusik and park-hyunji don't follow each other (broke up on show)
 * - kwak-minkyung (560k followers) doesn't follow back everyone
 * - A few interesting one-way follows for graph variety
 */
export const follows: Follow[] = [
  // === Confirmed couples: always mutual ===

  // seong-baekhyun <-> choi-yunnyeong
  { source: 'seong-baekhyun', target: 'choi-yunnyeong' },
  { source: 'choi-yunnyeong', target: 'seong-baekhyun' },

  // kim-woojin <-> hong-jiyeon
  { source: 'kim-woojin', target: 'hong-jiyeon' },
  { source: 'hong-jiyeon', target: 'kim-woojin' },

  // jung-wongyu <-> park-jihyun
  { source: 'jung-wongyu', target: 'park-jihyun' },
  { source: 'park-jihyun', target: 'jung-wongyu' },

  // === Mutual follows between most cast members ===

  // seong-baekhyun mutual follows
  { source: 'seong-baekhyun', target: 'kim-woojin' },
  { source: 'kim-woojin', target: 'seong-baekhyun' },
  { source: 'seong-baekhyun', target: 'hong-jiyeon' },
  { source: 'hong-jiyeon', target: 'seong-baekhyun' },
  { source: 'seong-baekhyun', target: 'jung-wongyu' },
  { source: 'jung-wongyu', target: 'seong-baekhyun' },
  { source: 'seong-baekhyun', target: 'park-jihyun' },
  { source: 'park-jihyun', target: 'seong-baekhyun' },
  { source: 'seong-baekhyun', target: 'jo-yusik' },
  { source: 'jo-yusik', target: 'seong-baekhyun' },
  { source: 'seong-baekhyun', target: 'lee-jaehyeong' },
  { source: 'lee-jaehyeong', target: 'seong-baekhyun' },
  { source: 'seong-baekhyun', target: 'shin-seungyong' },
  { source: 'shin-seungyong', target: 'seong-baekhyun' },
  // seong-baekhyun -> kwak-minkyung (one-way: she doesn't follow back)
  { source: 'seong-baekhyun', target: 'kwak-minkyung' },

  // choi-yunnyeong mutual follows
  { source: 'choi-yunnyeong', target: 'hong-jiyeon' },
  { source: 'hong-jiyeon', target: 'choi-yunnyeong' },
  { source: 'choi-yunnyeong', target: 'park-jihyun' },
  { source: 'park-jihyun', target: 'choi-yunnyeong' },
  { source: 'choi-yunnyeong', target: 'kwak-minkyung' },
  { source: 'kwak-minkyung', target: 'choi-yunnyeong' },
  { source: 'choi-yunnyeong', target: 'kim-woojin' },
  { source: 'kim-woojin', target: 'choi-yunnyeong' },
  { source: 'choi-yunnyeong', target: 'jo-yusik' },
  { source: 'jo-yusik', target: 'choi-yunnyeong' },
  // choi-yunnyeong -> lee-jaehyeong (one-way: ex doesn't follow back)
  { source: 'choi-yunnyeong', target: 'lee-jaehyeong' },

  // kim-woojin mutual follows
  { source: 'kim-woojin', target: 'jung-wongyu' },
  { source: 'jung-wongyu', target: 'kim-woojin' },
  { source: 'kim-woojin', target: 'jo-yusik' },
  { source: 'jo-yusik', target: 'kim-woojin' },
  { source: 'kim-woojin', target: 'lee-jaehyeong' },
  { source: 'lee-jaehyeong', target: 'kim-woojin' },
  { source: 'kim-woojin', target: 'shin-seungyong' },
  { source: 'shin-seungyong', target: 'kim-woojin' },
  { source: 'kim-woojin', target: 'park-jihyun' },
  { source: 'park-jihyun', target: 'kim-woojin' },
  { source: 'kim-woojin', target: 'kwak-minkyung' },
  // kwak-minkyung doesn't follow kim-woojin back

  // hong-jiyeon mutual follows
  { source: 'hong-jiyeon', target: 'jung-wongyu' },
  { source: 'jung-wongyu', target: 'hong-jiyeon' },
  { source: 'hong-jiyeon', target: 'park-jihyun' },
  { source: 'park-jihyun', target: 'hong-jiyeon' },
  { source: 'hong-jiyeon', target: 'kwak-minkyung' },
  { source: 'kwak-minkyung', target: 'hong-jiyeon' },
  { source: 'hong-jiyeon', target: 'jo-yusik' },
  { source: 'jo-yusik', target: 'hong-jiyeon' },
  { source: 'hong-jiyeon', target: 'lee-jaehyeong' },
  { source: 'lee-jaehyeong', target: 'hong-jiyeon' },
  { source: 'hong-jiyeon', target: 'shin-seungyong' },
  { source: 'shin-seungyong', target: 'hong-jiyeon' },
  { source: 'hong-jiyeon', target: 'park-hyunji' },
  { source: 'park-hyunji', target: 'hong-jiyeon' },

  // kwak-minkyung selective follows (she's the big influencer)
  { source: 'kwak-minkyung', target: 'park-jihyun' },
  { source: 'park-jihyun', target: 'kwak-minkyung' },
  { source: 'kwak-minkyung', target: 'jo-yusik' },
  { source: 'jo-yusik', target: 'kwak-minkyung' },
  { source: 'kwak-minkyung', target: 'park-hyunji' },
  { source: 'park-hyunji', target: 'kwak-minkyung' },
  // kwak-minkyung doesn't follow: seong-baekhyun, kim-woojin, lee-jaehyeong, shin-seungyong
  // but they all follow her:
  { source: 'lee-jaehyeong', target: 'kwak-minkyung' },
  { source: 'shin-seungyong', target: 'kwak-minkyung' },

  // jung-wongyu mutual follows
  { source: 'jung-wongyu', target: 'jo-yusik' },
  { source: 'jo-yusik', target: 'jung-wongyu' },
  { source: 'jung-wongyu', target: 'lee-jaehyeong' },
  { source: 'lee-jaehyeong', target: 'jung-wongyu' },
  { source: 'jung-wongyu', target: 'shin-seungyong' },
  { source: 'shin-seungyong', target: 'jung-wongyu' },
  { source: 'jung-wongyu', target: 'park-hyunji' },
  { source: 'park-hyunji', target: 'jung-wongyu' },
  { source: 'jung-wongyu', target: 'kwak-minkyung' },
  // kwak-minkyung doesn't follow jung-wongyu back

  // park-jihyun mutual follows
  { source: 'park-jihyun', target: 'jo-yusik' },
  { source: 'jo-yusik', target: 'park-jihyun' },
  { source: 'park-jihyun', target: 'lee-jaehyeong' },
  { source: 'lee-jaehyeong', target: 'park-jihyun' },
  { source: 'park-jihyun', target: 'shin-seungyong' },
  { source: 'shin-seungyong', target: 'park-jihyun' },
  { source: 'park-jihyun', target: 'park-hyunji' },
  { source: 'park-hyunji', target: 'park-jihyun' },

  // jo-yusik — notably does NOT follow park-hyunji (and vice versa)
  { source: 'jo-yusik', target: 'lee-jaehyeong' },
  { source: 'lee-jaehyeong', target: 'jo-yusik' },
  { source: 'jo-yusik', target: 'shin-seungyong' },
  { source: 'shin-seungyong', target: 'jo-yusik' },

  // park-hyunji remaining
  { source: 'park-hyunji', target: 'lee-jaehyeong' },
  { source: 'lee-jaehyeong', target: 'park-hyunji' },
  { source: 'park-hyunji', target: 'shin-seungyong' },
  { source: 'shin-seungyong', target: 'park-hyunji' },
  // park-hyunji -> seong-baekhyun (one-way: ex, she still follows him)
  { source: 'park-hyunji', target: 'seong-baekhyun' },
  // seong-baekhyun does NOT follow park-hyunji back (unfollowed ex)

  // lee-jaehyeong <-> shin-seungyong
  { source: 'lee-jaehyeong', target: 'shin-seungyong' },
  { source: 'shin-seungyong', target: 'lee-jaehyeong' },

  // choi-yunnyeong remaining
  { source: 'choi-yunnyeong', target: 'jung-wongyu' },
  { source: 'jung-wongyu', target: 'choi-yunnyeong' },
  { source: 'choi-yunnyeong', target: 'shin-seungyong' },
  { source: 'shin-seungyong', target: 'choi-yunnyeong' },
  { source: 'choi-yunnyeong', target: 'park-hyunji' },
  { source: 'park-hyunji', target: 'choi-yunnyeong' },
];
