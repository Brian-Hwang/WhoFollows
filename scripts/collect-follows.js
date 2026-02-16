// This script runs in the browser console on instagram.com while logged in.
// It collects follow relationships between 환승연애4 cast members.

const CAST = [
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
];

const HEADERS = {
  'x-ig-app-id': '936619743392459',
  'x-requested-with': 'XMLHttpRequest',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getUserId(handle) {
  const resp = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${handle}`,
    { headers: HEADERS, credentials: 'include' }
  );
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${handle}`);
  const data = await resp.json();
  return {
    id: data.data.user.id,
    name: data.data.user.full_name,
    followers: data.data.user.edge_followed_by.count,
    following: data.data.user.edge_follow.count,
  };
}

async function getFollowingList(userId) {
  const allUsernames = [];
  let hasNext = true;
  let cursor = '';

  while (hasNext) {
    const variables = JSON.stringify({
      id: userId,
      include_reel: false,
      fetch_mutual: false,
      first: 50,
      after: cursor,
    });

    const resp = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=${encodeURIComponent(variables)}`,
      { headers: HEADERS, credentials: 'include' }
    );

    if (!resp.ok) throw new Error(`GraphQL HTTP ${resp.status}`);
    const data = await resp.json();
    const edge = data.data.user.edge_follow;

    for (const e of edge.edges) {
      allUsernames.push(e.node.username);
    }

    hasNext = edge.page_info.has_next_page;
    cursor = edge.page_info.end_cursor;

    if (hasNext) await sleep(1500);
  }

  return new Set(allUsernames);
}

async function main() {
  console.log('=== WhoFollows: Collecting follow data ===');

  // Step 1: Get all user IDs
  const userIds = {};
  for (const c of CAST) {
    try {
      const info = await getUserId(c.handle);
      userIds[c.id] = info;
      console.log(`✅ ${c.id} (@${c.handle}): ID=${info.id}, ${info.followers} followers, ${info.following} following`);
    } catch (e) {
      console.error(`❌ ${c.id} (@${c.handle}): ${e.message}`);
      userIds[c.id] = null;
    }
    await sleep(2000);
  }

  // Step 2: For each person, get their following list and check cast members
  const follows = [];
  const castHandleSet = new Set(CAST.map((c) => c.handle));
  const handleToId = {};
  for (const c of CAST) handleToId[c.handle] = c.id;

  for (const src of CAST) {
    if (!userIds[src.id]) {
      console.log(`⏭️ Skipping ${src.id} (no user ID)`);
      continue;
    }

    try {
      console.log(`🔍 Checking ${src.id} (@${src.handle})...`);
      const followingSet = await getFollowingList(userIds[src.id].id);

      for (const tgt of CAST) {
        if (tgt.id === src.id) continue;
        const doesFollow = followingSet.has(tgt.handle);
        if (doesFollow) {
          follows.push({ source: src.id, target: tgt.id });
          console.log(`  → follows ${tgt.id} (@${tgt.handle})`);
        } else {
          console.log(`  ✗ NOT following ${tgt.id} (@${tgt.handle})`);
        }
      }
    } catch (e) {
      console.error(`❌ Error checking ${src.id}: ${e.message}`);
    }

    await sleep(3000);
  }

  // Store results globally
  window.__FOLLOW_DATA = follows;
  window.__USER_IDS = userIds;

  console.log(`\n=== DONE: ${follows.length} follow relationships found ===`);
  console.log(JSON.stringify(follows));

  return { total: follows.length, follows };
}

main();
