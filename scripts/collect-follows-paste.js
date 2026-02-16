// ============================================================
// WhoFollows: Instagram Follow Data Collector
// ============================================================
// INSTRUCTIONS:
// 1. Log into Instagram in your browser
// 2. Open browser DevTools (F12 or Cmd+Option+I)
// 3. Go to the Console tab
// 4. Paste this entire script and press Enter
// 5. Wait ~2-3 minutes for it to complete
// 6. Copy the output JSON from the console
// ============================================================

(async () => {
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

  const HANDLE_TO_ID = {};
  for (const c of CAST) HANDLE_TO_ID[c.handle] = c.id;
  const CAST_HANDLES = new Set(CAST.map(c => c.handle));

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const HEADERS = {
    'x-ig-app-id': '936619743392459',
    'x-requested-with': 'XMLHttpRequest',
  };

  // Step 1: Get user IDs
  console.log('=== Step 1: Getting user IDs ===');
  const userIds = {};
  for (const c of CAST) {
    try {
      const resp = await fetch(
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${c.handle}`,
        { headers: HEADERS, credentials: 'include' }
      );
      const data = await resp.json();
      const user = data.data.user;
      userIds[c.handle] = user.id;
      console.log(`  ✅ ${c.id} (@${c.handle}) → ID: ${user.id} (${user.edge_followed_by.count} followers, ${user.edge_follow.count} following)`);
    } catch (e) {
      console.error(`  ❌ ${c.id} (@${c.handle}): ${e.message}`);
    }
    await sleep(2000);
  }

  // Step 2: For each person, get their full following list
  console.log('\n=== Step 2: Checking follow relationships ===');
  const follows = [];
  const matrix = {};

  for (const src of CAST) {
    const uid = userIds[src.handle];
    if (!uid) {
      console.log(`  ⚠️ Skipping ${src.id} (no user ID)`);
      continue;
    }

    console.log(`\n  Checking ${src.id} (@${src.handle})...`);
    matrix[src.id] = {};

    try {
      // Get following list using the friendships endpoint
      const allFollowing = new Set();
      let hasNext = true;
      let maxId = '';

      while (hasNext) {
        const url = maxId
          ? `https://www.instagram.com/api/v1/friendships/${uid}/following/?count=200&max_id=${maxId}`
          : `https://www.instagram.com/api/v1/friendships/${uid}/following/?count=200`;

        const resp = await fetch(url, { headers: HEADERS, credentials: 'include' });
        const data = await resp.json();

        if (data.users) {
          for (const u of data.users) {
            allFollowing.add(u.username);
          }
        }

        hasNext = !!data.next_max_id;
        maxId = data.next_max_id || '';
        await sleep(1500);
      }

      console.log(`    Total following: ${allFollowing.size}`);

      // Check which cast members they follow
      for (const tgt of CAST) {
        if (tgt.id === src.id) continue;
        const doesFollow = allFollowing.has(tgt.handle);
        matrix[src.id][tgt.id] = doesFollow;
        if (doesFollow) {
          follows.push({ source: src.id, target: tgt.id });
          console.log(`    → follows ${tgt.id} ✅`);
        } else {
          console.log(`    → NOT following ${tgt.id} ❌`);
        }
      }
    } catch (e) {
      console.error(`    ❌ Error: ${e.message}`);

      // Fallback: try the GraphQL endpoint
      console.log('    Trying fallback (GraphQL)...');
      try {
        const allFollowing = new Set();
        let hasNext = true;
        let cursor = '';

        while (hasNext) {
          const vars = JSON.stringify({
            id: uid,
            include_reel: false,
            fetch_mutual: false,
            first: 50,
            after: cursor,
          });
          const resp = await fetch(
            `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=${encodeURIComponent(vars)}`,
            { headers: HEADERS, credentials: 'include' }
          );
          const data = await resp.json();
          const edge = data.data.user.edge_follow;
          for (const x of edge.edges) allFollowing.add(x.node.username);
          hasNext = edge.page_info.has_next_page;
          cursor = edge.page_info.end_cursor;
          await sleep(1500);
        }

        for (const tgt of CAST) {
          if (tgt.id === src.id) continue;
          const doesFollow = allFollowing.has(tgt.handle);
          matrix[src.id][tgt.id] = doesFollow;
          if (doesFollow) {
            follows.push({ source: src.id, target: tgt.id });
            console.log(`    → follows ${tgt.id} ✅`);
          } else {
            console.log(`    → NOT following ${tgt.id} ❌`);
          }
        }
      } catch (e2) {
        console.error(`    ❌ Fallback also failed: ${e2.message}`);
      }
    }

    await sleep(3000);
  }

  // Step 3: Output results
  console.log('\n\n=== RESULTS ===');
  console.log(`Total follows found: ${follows.length}`);
  console.log('\n--- FOLLOW MATRIX ---');
  for (const src of CAST) {
    const row = CAST.filter(t => t.id !== src.id)
      .map(t => (matrix[src.id]?.[t.id] ? '✅' : '❌') + ' ' + t.id.split('-')[0])
      .join(', ');
    console.log(`${src.id}: ${row}`);
  }

  console.log('\n--- FOLLOWS.TS DATA (copy this) ---');
  const tsOutput = `import { Follow } from '@/lib/types';

// Real Instagram follow data — verified ${new Date().toISOString().split('T')[0]}
export const follows: Follow[] = [
${follows.map(f => `  { source: '${f.source}', target: '${f.target}' },`).join('\n')}
];
`;
  console.log(tsOutput);

  // Also store in window for easy access
  window.__FOLLOW_DATA = follows;
  window.__FOLLOW_MATRIX = matrix;
  window.__FOLLOW_TS = tsOutput;

  console.log('\n✅ Done! Data stored in window.__FOLLOW_DATA and window.__FOLLOW_TS');
  console.log('Copy window.__FOLLOW_TS for the follows.ts file content');
})();
