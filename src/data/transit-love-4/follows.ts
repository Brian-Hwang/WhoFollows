import { Follow } from '@/lib/types';

// Real Instagram follow data — verified 2026-02-16
// 108 of 110 possible follows.
// Notable gaps:
//   - park-hyunji does NOT follow shin-seungyong (her ex from the show)
//   - shin-seungyong DOES follow park-hyunji
export const follows: Follow[] = [
  // === seong-baekhyun (@_sbh777_) — follows all 10 ===
  { source: 'seong-baekhyun', target: 'choi-yunnyeong' },
  { source: 'seong-baekhyun', target: 'kim-woojin' },
  { source: 'seong-baekhyun', target: 'hong-jiyeon' },
  { source: 'seong-baekhyun', target: 'kwak-minkyung' },
  { source: 'seong-baekhyun', target: 'jung-wongyu' },
  { source: 'seong-baekhyun', target: 'park-jihyun' },
  { source: 'seong-baekhyun', target: 'jo-yusik' },
  { source: 'seong-baekhyun', target: 'park-hyunji' },
  { source: 'seong-baekhyun', target: 'lee-jaehyeong' },
  { source: 'seong-baekhyun', target: 'shin-seungyong' },

  // === choi-yunnyeong (@hinyeong) — follows all 10 ===
  { source: 'choi-yunnyeong', target: 'seong-baekhyun' },
  { source: 'choi-yunnyeong', target: 'kim-woojin' },
  { source: 'choi-yunnyeong', target: 'hong-jiyeon' },
  { source: 'choi-yunnyeong', target: 'kwak-minkyung' },
  { source: 'choi-yunnyeong', target: 'jung-wongyu' },
  { source: 'choi-yunnyeong', target: 'park-jihyun' },
  { source: 'choi-yunnyeong', target: 'jo-yusik' },
  { source: 'choi-yunnyeong', target: 'park-hyunji' },
  { source: 'choi-yunnyeong', target: 'lee-jaehyeong' },
  { source: 'choi-yunnyeong', target: 'shin-seungyong' },

  // === kim-woojin (@kimwujiin) — follows all 10 ===
  { source: 'kim-woojin', target: 'seong-baekhyun' },
  { source: 'kim-woojin', target: 'choi-yunnyeong' },
  { source: 'kim-woojin', target: 'hong-jiyeon' },
  { source: 'kim-woojin', target: 'kwak-minkyung' },
  { source: 'kim-woojin', target: 'jung-wongyu' },
  { source: 'kim-woojin', target: 'park-jihyun' },
  { source: 'kim-woojin', target: 'jo-yusik' },
  { source: 'kim-woojin', target: 'park-hyunji' },
  { source: 'kim-woojin', target: 'lee-jaehyeong' },
  { source: 'kim-woojin', target: 'shin-seungyong' },

  // === hong-jiyeon (@jiyeoniizi) — follows all 10 ===
  { source: 'hong-jiyeon', target: 'seong-baekhyun' },
  { source: 'hong-jiyeon', target: 'choi-yunnyeong' },
  { source: 'hong-jiyeon', target: 'kim-woojin' },
  { source: 'hong-jiyeon', target: 'kwak-minkyung' },
  { source: 'hong-jiyeon', target: 'jung-wongyu' },
  { source: 'hong-jiyeon', target: 'park-jihyun' },
  { source: 'hong-jiyeon', target: 'jo-yusik' },
  { source: 'hong-jiyeon', target: 'park-hyunji' },
  { source: 'hong-jiyeon', target: 'lee-jaehyeong' },
  { source: 'hong-jiyeon', target: 'shin-seungyong' },

  // === kwak-minkyung (@m.inngu) — follows all 10 ===
  { source: 'kwak-minkyung', target: 'seong-baekhyun' },
  { source: 'kwak-minkyung', target: 'choi-yunnyeong' },
  { source: 'kwak-minkyung', target: 'kim-woojin' },
  { source: 'kwak-minkyung', target: 'hong-jiyeon' },
  { source: 'kwak-minkyung', target: 'jung-wongyu' },
  { source: 'kwak-minkyung', target: 'park-jihyun' },
  { source: 'kwak-minkyung', target: 'jo-yusik' },
  { source: 'kwak-minkyung', target: 'park-hyunji' },
  { source: 'kwak-minkyung', target: 'lee-jaehyeong' },
  { source: 'kwak-minkyung', target: 'shin-seungyong' },

  // === jung-wongyu (@garden9yu) — follows all 10 ===
  { source: 'jung-wongyu', target: 'seong-baekhyun' },
  { source: 'jung-wongyu', target: 'choi-yunnyeong' },
  { source: 'jung-wongyu', target: 'kim-woojin' },
  { source: 'jung-wongyu', target: 'hong-jiyeon' },
  { source: 'jung-wongyu', target: 'kwak-minkyung' },
  { source: 'jung-wongyu', target: 'park-jihyun' },
  { source: 'jung-wongyu', target: 'jo-yusik' },
  { source: 'jung-wongyu', target: 'park-hyunji' },
  { source: 'jung-wongyu', target: 'lee-jaehyeong' },
  { source: 'jung-wongyu', target: 'shin-seungyong' },

  // === park-jihyun (@hyunniry) — follows all 10 ===
  { source: 'park-jihyun', target: 'seong-baekhyun' },
  { source: 'park-jihyun', target: 'choi-yunnyeong' },
  { source: 'park-jihyun', target: 'kim-woojin' },
  { source: 'park-jihyun', target: 'hong-jiyeon' },
  { source: 'park-jihyun', target: 'kwak-minkyung' },
  { source: 'park-jihyun', target: 'jung-wongyu' },
  { source: 'park-jihyun', target: 'jo-yusik' },
  { source: 'park-jihyun', target: 'park-hyunji' },
  { source: 'park-jihyun', target: 'lee-jaehyeong' },
  { source: 'park-jihyun', target: 'shin-seungyong' },

  // === jo-yusik (@joyusik) — follows all 10 ===
  { source: 'jo-yusik', target: 'seong-baekhyun' },
  { source: 'jo-yusik', target: 'choi-yunnyeong' },
  { source: 'jo-yusik', target: 'kim-woojin' },
  { source: 'jo-yusik', target: 'hong-jiyeon' },
  { source: 'jo-yusik', target: 'kwak-minkyung' },
  { source: 'jo-yusik', target: 'jung-wongyu' },
  { source: 'jo-yusik', target: 'park-jihyun' },
  { source: 'jo-yusik', target: 'park-hyunji' },
  { source: 'jo-yusik', target: 'lee-jaehyeong' },
  { source: 'jo-yusik', target: 'shin-seungyong' },

  // === park-hyunji (@hyundipark) — follows 9 of 10 ===
  { source: 'park-hyunji', target: 'seong-baekhyun' },
  { source: 'park-hyunji', target: 'choi-yunnyeong' },
  { source: 'park-hyunji', target: 'kim-woojin' },
  { source: 'park-hyunji', target: 'hong-jiyeon' },
  { source: 'park-hyunji', target: 'kwak-minkyung' },
  { source: 'park-hyunji', target: 'jung-wongyu' },
  { source: 'park-hyunji', target: 'park-jihyun' },
  { source: 'park-hyunji', target: 'jo-yusik' },
  { source: 'park-hyunji', target: 'lee-jaehyeong' },
  // park-hyunji does NOT follow shin-seungyong (her ex)

  // === lee-jaehyeong (@l_jhyeong) — follows all 10 ===
  { source: 'lee-jaehyeong', target: 'seong-baekhyun' },
  { source: 'lee-jaehyeong', target: 'choi-yunnyeong' },
  { source: 'lee-jaehyeong', target: 'kim-woojin' },
  { source: 'lee-jaehyeong', target: 'hong-jiyeon' },
  { source: 'lee-jaehyeong', target: 'kwak-minkyung' },
  { source: 'lee-jaehyeong', target: 'jung-wongyu' },
  { source: 'lee-jaehyeong', target: 'park-jihyun' },
  { source: 'lee-jaehyeong', target: 'jo-yusik' },
  { source: 'lee-jaehyeong', target: 'park-hyunji' },
  { source: 'lee-jaehyeong', target: 'shin-seungyong' },

  // === shin-seungyong (@shin.seungg) — follows all 10 ===
  { source: 'shin-seungyong', target: 'seong-baekhyun' },
  { source: 'shin-seungyong', target: 'choi-yunnyeong' },
  { source: 'shin-seungyong', target: 'kim-woojin' },
  { source: 'shin-seungyong', target: 'hong-jiyeon' },
  { source: 'shin-seungyong', target: 'kwak-minkyung' },
  { source: 'shin-seungyong', target: 'jung-wongyu' },
  { source: 'shin-seungyong', target: 'park-jihyun' },
  { source: 'shin-seungyong', target: 'jo-yusik' },
  { source: 'shin-seungyong', target: 'park-hyunji' },
  { source: 'shin-seungyong', target: 'lee-jaehyeong' },
];
