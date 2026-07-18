export const CATEGORY_LABELS = {
  top: 'Top',
  bottom: 'Trouser',
  skirt: 'Skirt',
  dress: 'Dress',
  shoes: 'Shoes',
  bag: 'Bag',
  accessory: 'Accessory',
  outerwear: 'Outerwear',
};

export const OCCASION_LABELS = {
  workwear: 'Workwear',
  casual: 'Casual',
  'date night': 'Date night',
  party: 'Party',
  vacation: 'Vacation',
};

export const CATEGORY_OPTIONS = [
  { key: 'top', label: 'Top' }, { key: 'bottom', label: 'Trouser' },
  { key: 'skirt', label: 'Skirt' }, { key: 'dress', label: 'Dress' },
  { key: 'shoes', label: 'Shoes' }, { key: 'bag', label: 'Bag' },
  { key: 'accessory', label: 'Accessory' }, { key: 'outerwear', label: 'Outerwear' },
];

export const OCCASION_OPTIONS = [
  { key: 'workwear', label: 'Workwear' }, { key: 'casual', label: 'Casual' },
  { key: 'date night', label: 'Date night' }, { key: 'party', label: 'Party' },
  { key: 'vacation', label: 'Vacation' },
];

export function itemDisplayName(item) {
  return item?.label || CATEGORY_LABELS[item?.category] || 'Item';
}

// item.occasion is always an array (possibly empty)
export function occasionDisplay(occasions) {
  if (!occasions || occasions.length === 0) return 'Any occasion';
  return occasions.map(o => OCCASION_LABELS[o] || o).join(' · ');
}

export function outfitDisplayName(outfit) {
  if (outfit?.name) return outfit.name;
  const vibe = outfit?.vibe || 'casual';
  return `${vibe.charAt(0).toUpperCase()}${vibe.slice(1)} look`;
}
