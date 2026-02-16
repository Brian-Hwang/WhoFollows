import { Follow } from '@/lib/types';

const allMembers = [
  'daniel-hastings', 'taylor-haag', 'david-bettenburg', 'lauren-obrien',
  'ben-mezzenga', 'sara-carton', 'mason-horacek', 'meg-fueggo',
  'joey-kid', 'monica-danus', 'alex-brown', 'brittany-dodson',
  'devin-buck', 'madison-err',
];

const follows: Follow[] = [];

// Non-follow pairs: couples who said NO at altar often unfollow
const nonFollows = new Set([
  // Dave & Lauren had the most contentious breakup
  'david-bettenburg->lauren-obrien',
  'lauren-obrien->david-bettenburg',
  // Joey & Monica — said no at altar
  'joey-kid->monica-danus',
  'monica-danus->joey-kid',
  // Some cast who weren't close on the show
  'alex-brown->sara-carton',
  'devin-buck->meg-fueggo',
  'brittany-dodson->joey-kid',
  'madison-err->david-bettenburg',
  'david-bettenburg->madison-err',
  'alex-brown->meg-fueggo',
]);

for (const source of allMembers) {
  for (const target of allMembers) {
    if (source === target) continue;
    if (nonFollows.has(`${source}->${target}`)) continue;
    follows.push({ source, target });
  }
}

export { follows };
