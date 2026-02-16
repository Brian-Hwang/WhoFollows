// Run this in the browser console while logged into Instagram
// It checks all follow relationships between 환승연애4 cast members

const castMap = [
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

const headers = {
  'x-ig-app-id': '936619743392459',
  'x-requested-with': 'XMLHttpRequest',
};

async function getUserId(handle) {
  const resp = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${handle}`,
    { headers, credentials: 'include' }
  );
  const data = await resp.json();
  return data.data.user.id;
}

async function getFollowing(userId, count) {
  // Fetch ALL following using Instagram's GraphQL API
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
      { headers, credentials: 'include' }
    );
    const data = await resp.json();
    const edge = data.data.user.edge_follow;
    const users = edge.edges.map((e) => e.node.username);
    allFollowing.push(...users);

    hasNext = edge.page_info.has_next_page;
    endCursor = edge.page_info.end_cursor;

    // Rate limit
    await new Promise((r) => setTimeout(r, 1500));
  }

  return allFollowing;
}

async function main() {
  console.log('=== Starting follow check ===');

  // Step 1: Get all user IDs
  console.log('Step 1: Getting user IDs...');
  const userIds = {};
  for (const c of castMap) {
    try {
      userIds[c.id] = await getUserId(c.handle);
      console.log(`  ${c.id} (${c.handle}): ID ${userIds[c.id]}`);
    } catch (e) {
      console.error(`  ERROR: ${c.id} (${c.handle}): ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }

  // Step 2: For each person, get their following list and check against cast
  console.log('\nStep 2: Checking follows...');
  const handleSet = new Set(castMap.map((c) => c.handle));
  const handleToId = {};
  castMap.forEach((c) => (handleToId[c.handle] = c.id));

  const follows = [];
  const matrix = {};

  for (const source of castMap) {
    console.log(`\nChecking ${source.id} (@${source.handle})...`);
    matrix[source.id] = {};

    try {
      const followingList = await getFollowing(userIds[source.id]);
      const followingSet = new Set(followingList);

      for (const target of castMap) {
        if (target.id === source.id) continue;
        const doesFollow = followingSet.has(target.handle);
        matrix[source.id][target.id] = doesFollow;
        if (doesFollow) {
          follows.push({ source: source.id, target: target.id });
          console.log(`  ✅ ${source.id} → ${target.id}`);
        } else {
          console.log(`  ❌ ${source.id} ✗ ${target.id}`);
        }
      }
    } catch (e) {
      console.error(`  ERROR fetching following for ${source.id}: ${e.message}`);
      // Fallback: try the search-in-following approach
      console.log('  Trying fallback approach...');
    }

    // Rate limit between profiles
    await new Promise((r) => setTimeout(r, 3000));
  }

  // Step 3: Output results
  console.log('\n=== RESULTS ===');
  console.log('\nFollow matrix:');
  console.table(matrix);

  console.log('\nFollows array (for follows.ts):');
  console.log(JSON.stringify(follows, null, 2));

  // Also store in window for easy access
  window.__FOLLOW_RESULTS = { matrix, follows };
  console.log('\nResults stored in window.__FOLLOW_RESULTS');

  return follows;
}

main();
