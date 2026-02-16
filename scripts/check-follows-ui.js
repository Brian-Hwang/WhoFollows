// Script to check Instagram follow relationships via UI automation
// Run this in the browser console while logged into Instagram
// It navigates to each profile, opens Following dialog, and searches for each target

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

// Use Instagram's internal API to get user IDs and following lists
async function getUserInfo(handle) {
  const resp = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${handle}`,
    {
      headers: {
        'x-ig-app-id': '936619743392459',
        'x-requested-with': 'XMLHttpRequest',
      },
      credentials: 'include',
    }
  );
  const data = await resp.json();
  return data.data.user;
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
      {
        headers: {
          'x-ig-app-id': '936619743392459',
          'x-requested-with': 'XMLHttpRequest',
        },
        credentials: 'include',
      }
    );
    const data = await resp.json();
    const edge = data.data.user.edge_follow;
    allFollowing.push(...edge.edges.map((e) => e.node.username));
    hasNext = edge.page_info.has_next_page;
    endCursor = edge.page_info.end_cursor;
    await new Promise((r) => setTimeout(r, 1500));
  }

  return allFollowing;
}

async function checkAllFollows() {
  console.log('=== Starting follow check ===');
  const follows = [];
  const handleSet = new Set(CAST.map((c) => c.handle));
  const handleToId = {};
  CAST.forEach((c) => (handleToId[c.handle] = c.id));

  // Step 1: Get all user IDs
  console.log('Step 1: Getting user IDs...');
  const userIds = {};
  for (const c of CAST) {
    try {
      const user = await getUserInfo(c.handle);
      userIds[c.id] = user.id;
      console.log(`  ${c.id} (${c.handle}): ID=${user.id}, ${user.edge_followed_by.count} followers`);
    } catch (e) {
      console.error(`  FAILED: ${c.id} (${c.handle}): ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Step 2: For each person, get their following list and check against cast
  console.log('\nStep 2: Checking follows...');
  for (const source of CAST) {
    if (!userIds[source.id]) {
      console.log(`  SKIP ${source.id}: no user ID`);
      continue;
    }

    try {
      console.log(`  Checking ${source.id} (${source.handle})...`);
      const followingList = await getFollowingList(userIds[source.id]);
      const followingSet = new Set(followingList);

      for (const target of CAST) {
        if (target.id === source.id) continue;
        if (followingSet.has(target.handle)) {
          follows.push({ source: source.id, target: target.id });
          console.log(`    ✅ ${source.id} → ${target.id}`);
        } else {
          console.log(`    ❌ ${source.id} ✗ ${target.id}`);
        }
      }
    } catch (e) {
      console.error(`  ERROR for ${source.id}: ${e.message}`);
    }

    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log('\n=== RESULTS ===');
  console.log(`Total follows: ${follows.length}`);
  console.log(JSON.stringify(follows, null, 2));

  // Store globally for easy access
  window.__FOLLOW_DATA = follows;
  return follows;
}

checkAllFollows();
