/**
 * Instagram Follow Checker — runs inside Playwright MCP browser
 * 
 * Strategy: For each cast member, open their Following dialog,
 * search for each other cast member's handle, check if they appear.
 * 
 * This file is a reference — the actual execution happens via
 * Playwright MCP browser_evaluate calls.
 */

export const CAST = [
  { id: 'seong-baekhyun', handle: '_sbh777_' },
  { id: 'choi-yunnyeong', handle: 'hinyeong' },
  { id: 'kim-woojin', handle: 'kimwujiin' },
  { id: 'hong-jiyeon', handle: 'jiyeoniizi' },
  { id: 'kwak-minkyung', handle: 'm.inngu' },
  { id: 'jung-wongyu', handle: 'garden9yu' },
  { id: 'park-jihyun', handle: 'hyunniry' },
  { id: 'jo-yusik', handle: 'joyusik' },
  { id: 'park-hyunji', handle: 'hyundipark' },
  { id: 'lee-jaehyeong', handle: 'l_jhyeong' },
  { id: 'shin-seungyong', handle: 'shin.seungg' },
] as const;
