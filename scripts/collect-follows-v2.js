// Run this in the browser console while logged into Instagram
// It navigates to each cast member's following page, scrolls to load all,
// then checks which other cast members appear in the list.

const CAST = [
  {id:'seong-baekhyun', handle:'_sbh777_'},
  {id:'choi-yunnyeong', handle:'hinyeong'},
  {id:'kim-woojin', handle:'kimwujiin'},
  {id:'hong-jiyeon', handle:'jiyeoniizi'},
  {id:'kwak-minkyung', handle:'m.inngu'},
  {id:'jung-wongyu', handle:'garden9yu'},
  {id:'park-jihyun', handle:'hyunniry'},
  {id:'jo-yusik', handle:'joyusik'},
  {id:'park-hyunji', handle:'hyundipark'},
  {id:'lee-jaehyeong', handle:'l_jhyeong'},
  {id:'shin-seungyong', handle:'shin.seungg'},
];

const handleToId = {};
CAST.forEach(c => { handleToId[c.handle] = c.id; });
const castHandles = new Set(CAST.map(c => c.handle));

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getAllFollowing() {
  // Find the scrollable container in the following dialog
  const dialog = document.querySelector('[role="dialog"]');
  if (!dialog) return null;
  
  // Find scrollable div
  const divs = Array.from(dialog.querySelectorAll('div'));
  let sc = null;
  for (const d of divs) {
    if (d.scrollHeight > d.clientHeight + 10 && d.clientHeight > 100) {
      sc = d;
      break;
    }
  }
  if (!sc) return null;
  
  // Scroll to load all entries
  let prevCount = 0;
  let stableCount = 0;
  while (stableCount < 5) {
    sc.scrollTop = sc.scrollHeight;
    await sleep(800);
    const links = dialog.querySelectorAll('a[href]');
    const count = links.length;
    if (count === prevCount) stableCount++;
    else stableCount = 0;
    prevCount = count;
  }
  
  // Extract all usernames
  const usernames = new Set();
  const links = dialog.querySelectorAll('a[href]');
  for (const link of links) {
    const m = link.getAttribute('href').match(/^\/([a-zA-Z0-9_.]+)\/$/);
    if (m) usernames.add(m[1]);
  }
  return usernames;
}

// Main execution
const allFollows = [];
const results = {};

for (const source of CAST) {
  console.log(`\n=== Checking ${source.id} (@${source.handle}) ===`);
  
  // Navigate to profile
  window.location.href = `https://www.instagram.com/${source.handle}/`;
  await sleep(4000);
  
  // Click "following" link
  const followingLink = document.querySelector(`a[href="/${source.handle}/following/"]`);
  if (!followingLink) {
    console.log(`  ERROR: No following link found for ${source.handle}`);
    results[source.id] = {error: 'no following link'};
    continue;
  }
  followingLink.click();
  await sleep(3000);
  
  // Get all following
  const following = await getAllFollowing();
  if (!following) {
    console.log(`  ERROR: Could not load following list for ${source.handle}`);
    results[source.id] = {error: 'could not load list'};
    continue;
  }
  
  // Check which cast members they follow
  const castFollows = [];
  const castNotFollowing = [];
  for (const target of CAST) {
    if (target.id === source.id) continue;
    if (following.has(target.handle)) {
      castFollows.push(target.id);
      allFollows.push({source: source.id, target: target.id});
      console.log(`  ✅ follows ${target.id} (@${target.handle})`);
    } else {
      castNotFollowing.push(target.id);
      console.log(`  ❌ NOT following ${target.id} (@${target.handle})`);
    }
  }
  
  results[source.id] = {follows: castFollows, notFollowing: castNotFollowing, totalFollowing: following.size};
  
  // Close dialog by pressing Escape
  document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
  await sleep(2000);
}

console.log('\n\n=== FINAL RESULTS ===');
console.log(JSON.stringify(allFollows, null, 2));
console.log(`\nTotal follows: ${allFollows.length}`);

// Store in window for retrieval
window.__FOLLOW_RESULTS = allFollows;
window.__FOLLOW_DETAILS = results;
