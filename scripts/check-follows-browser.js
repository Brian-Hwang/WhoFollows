// Run this in the browser console while on instagram.com (logged in)
// It uses Instagram's internal GraphQL API to check follow relationships

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
  return data.data.user.id;
}

async function getFollowingList(userId) {
  const allFollowing = [];
  let hasNext = true;
  let endCursor = '';

  while (hasNext) {
    const variables = JSON.stringify({
      id: userId,
      include_reel: false,
      fetch_mutual: false,
      first: 50,
      after: endCursor,
    });

    const resp = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=${encodeURIComponent(variables)}`,
      { headers: HEADERS, credentials: 'include' }
    );

    if (!resp.ok) throw new Error(`GraphQL HTTP ${resp.status}`);
    const data = await resp.json();
    const edge = data.data.user.edge_follow;

    for (const e of edge.edges) {
      allFollowing.push(e.node.username);
    }

    hasNext = edge.page_info.has_next_page;
    endCursor = edge.page_info.end_cursor;
    await sleep(1500);
  }

  return new Set(allFollowing);
}

async function main() {
  console.log('=== WhoFollows: Checking Instagram follow relationships ===');
  console.log('Step 1: Getting user IDs...');

  const userIds = {};
  for (const c of CAST) {
    try {
      userIds[c.id] = await getUserId(c.handle);
      console.log(`  ✅ ${c.id} (${c.handle}) → ID: ${userIds[c.id]}`);
    } catch (e) {
      console.error(`  ❌ ${c.id} (${c.handle}): ${e.message}`);
    }
    await sleep(2000);
  }

  console.log('\nStep 2: Checking follow relationships...');
  const follows = [];
  const handleSet = new Set(CAST.map((c) => c.handle));
  const handleToId = {};
  for (const c of CAST) handleToId[c.handle] = c.id;

  for (const source of CAST) {
    if (!userIds[source.id]) {
      console.log(`  ⏭️ Skipping ${source.id} (no user ID)`);
      continue;
    }

    try {
      console.log(`  Checking ${source.id} (${source.handle})...`);
      const followingSet = await getFollowingList(userIds[source.id]);

      for (const target of CAST) {
        if (target.id === source.id) continue;
        if (followingSet.has(target.handle)) {
          follows.push({ source: source.id, target: target.id });
          console.log(`    → follows ${target.id} ✅`);
        } else {
          console.log(`    → does NOT follow ${target.id} ❌`);
        }
      }
    } catch (e) {
      console.error(`  ❌ Error for ${source.id}: ${e.message}`);
    }

    await sleep(3000);
  }

  console.log('\n=== RESULTS ===');
  console.log(`Total follows found: ${follows.length}`);
  console.log(JSON.stringify(follows, null, 2));

  // Store in window for easy access
  window.__FOLLOW_DATA = follows;
  console.log('\nData stored in window.__FOLLOW_DATA');

  return follows;
}

main();
