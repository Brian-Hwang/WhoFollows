import { Relationship } from '@/lib/types';

export const relationships: Relationship[] = [
  // Engaged couples from the pods
  { source: 'daniel-hastings', target: 'taylor-haag', type: 'ex-couple' },
  { source: 'david-bettenburg', target: 'lauren-obrien', type: 'ex-couple' },
  { source: 'ben-mezzenga', target: 'sara-carton', type: 'ex-couple' },
  { source: 'mason-horacek', target: 'meg-fueggo', type: 'ex-couple' },
  { source: 'joey-kid', target: 'monica-danus', type: 'ex-couple' },

  // Daniel & Taylor: the ONLY couple who said "I do" — still married
  { source: 'daniel-hastings', target: 'taylor-haag', type: 'confirmed-couple' },

  // All other couples said NO at the altar
  { source: 'david-bettenburg', target: 'lauren-obrien', type: 'not-together' },
  { source: 'ben-mezzenga', target: 'sara-carton', type: 'not-together' },
  { source: 'mason-horacek', target: 'meg-fueggo', type: 'not-together' },
  { source: 'joey-kid', target: 'monica-danus', type: 'not-together' },
];
