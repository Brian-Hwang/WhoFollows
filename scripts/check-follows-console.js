// Script to check all follow relationships via Instagram Following dialog search
// Run this in the browser console while logged into Instagram

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
  {id:'shin-seungyong', handle:'shin.seungg'}
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function checkSourceFollows(sourceHandle, targetHandles) {
  // Navigate to source profile
  window.location.href = `https://www.instagram.com/${sourceHandle}/`;
  await sleep(4000);
  
  // Click "following" link
  const followingLink = document.querySelector(`a[href="/${sourceHandle}/following/"]`);
  if (!followingLink) throw new Error('No following link found for ' + sourceHandle);
  followingLink.click();
  await sleep(3000);
  
  const results = {};
  
  for (const targetHandle of targetHandles) {
    // Find search input in dialog
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) { results[targetHandle] = 'NO_DIALOG'; continue; }
    
    const searchInput = dialog.querySelector('input[placeholder="Search"]');
    if (!searchInput) { results[targetHandle] = 'NO_SEARCH'; continue; }
    
    // Clear search
    const clearBtn = dialog.querySelector('button[aria-label="Clear the search box"], button img[alt="Clear"]');
    if (clearBtn) {
      (clearBtn.closest('button') || clearBtn).click();
      await sleep(500);
    }
    
    // Type target handle using React-compatible input simulation
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(searchInput, targetHandle);
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    await sleep(2500);
    
    // Check if target appears in results
    const links = dialog.querySelectorAll(`a[href="/${targetHandle}/"]`);
    results[targetHandle] = links.length > 0;
    
    console.log(`  ${sourceHandle} -> ${targetHandle}: ${links.length > 0 ? 'YES' : 'NO'}`);
    await sleep(1000);
  }
  
  return results;
}

async function checkAllFollows() {
  const allFollows = [];
  
  // 성백현 follows ALL 10 — already confirmed manually
  for (const target of CAST) {
    if (target.id !== 'seong-baekhyun') {
      allFollows.push({source: 'seong-baekhyun', target: target.id});
    }
  }
  console.log('Added 10 pre-confirmed follows for seong-baekhyun');
  
  // Check remaining 10 sources
  for (const source of CAST) {
    if (source.id === 'seong-baekhyun') continue; // Already done
    
    const targetHandles = CAST
      .filter(c => c.id !== source.id)
      .map(c => c.handle);
    
    console.log(`\n=== Checking ${source.id} (${source.handle}) ===`);
    
    try {
      const results = await checkSourceFollows(source.handle, targetHandles);
      
      for (const [targetHandle, follows] of Object.entries(results)) {
        if (follows === true) {
          const targetCast = CAST.find(c => c.handle === targetHandle);
          if (targetCast) {
            allFollows.push({source: source.id, target: targetCast.id});
          }
        }
      }
    } catch (e) {
      console.error(`ERROR for ${source.id}: ${e.message}`);
    }
    
    await sleep(3000);
  }
  
  window.__FOLLOW_DATA = allFollows;
  console.log(`\n=== COMPLETE: ${allFollows.length} total follows ===`);
  console.log(JSON.stringify(allFollows, null, 2));
  return allFollows;
}

// Run it
checkAllFollows();
