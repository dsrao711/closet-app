import { useState, useEffect } from 'react';

// In-memory store — clean swap to Firebase later
// Collections mirror MongoDB document pattern

let items = [];
let outfits = [];
let weeklyPlan = {
  current: { Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null },
  next:    { Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null },
};
let listeners = [];

function notify() { listeners.forEach(fn => fn()); }

export function subscribe(fn) {
  listeners.push(fn);
  return () => { listeners = listeners.filter(l => l !== fn); };
}

// ── Items ──────────────────────────────────────────────────
export function getItems() { return items; }

export function addItem(item) {
  // item shape: { label, category, occasion, imageUri? }
  const newItem = { ...item, id: `item_${Date.now()}`, addedAt: Date.now() };
  items = [newItem, ...items];
  notify();
  return newItem;
}

export function deleteItem(id) {
  items = items.filter(i => i.id !== id);
  outfits = outfits.map(o => ({
    ...o,
    itemIds: o.itemIds.filter(iid => iid !== id),
  })).filter(o => o.itemIds.length > 0);
  notify();
}

// ── Outfits ────────────────────────────────────────────────
export function getOutfits() { return outfits; }

export function addOutfit(outfit) {
  const newOutfit = { ...outfit, id: `outfit_${Date.now()}`, addedAt: Date.now() };
  outfits = [newOutfit, ...outfits];
  notify();
  return newOutfit;
}

export function deleteOutfit(id) {
  outfits = outfits.filter(o => o.id !== id);
  // Remove from weekly plan
  const clearDay = (plan) => {
    const p = { ...plan };
    Object.keys(p).forEach(d => { if (p[d] === id) p[d] = null; });
    return p;
  };
  weeklyPlan = { current: clearDay(weeklyPlan.current), next: clearDay(weeklyPlan.next) };
  notify();
}

// ── Weekly Plan ────────────────────────────────────────────
export function getWeeklyPlan() { return weeklyPlan; }

export function setDayOutfit(week, day, outfitId) {
  weeklyPlan = {
    ...weeklyPlan,
    [week]: { ...weeklyPlan[week], [day]: outfitId },
  };
  notify();
}

export function clearDayOutfit(week, day) {
  weeklyPlan = {
    ...weeklyPlan,
    [week]: { ...weeklyPlan[week], [day]: null },
  };
  notify();
}

// ── Helpers ────────────────────────────────────────────────
export function getOutfitById(id) { return outfits.find(o => o.id === id) || null; }
export function getItemById(id) { return items.find(i => i.id === id) || null; }

export function getTodayOutfit() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days[new Date().getDay()];
  const id = weeklyPlan.current[today];
  return id ? getOutfitById(id) : null;
}

// ── React hook ─────────────────────────────────────────────
export function useStore() {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(n => n + 1)), []);
  return {
    items: getItems(),
    outfits: getOutfits(),
    weeklyPlan: getWeeklyPlan(),
    todayOutfit: getTodayOutfit(),
  };
}

// ── Seed data ──────────────────────────────────────────────
export function seedDemoData() {
  if (items.length > 0) return;

  const demoItems = [
    { label: 'Eyelet blouse, noir', category: 'top', occasion: 'date night' },
    { label: 'Denim camp shirt', category: 'top', occasion: 'casual' },
    { label: 'Gingham overshirt', category: 'top', occasion: 'casual' },
    { label: 'Silk camisole', category: 'top', occasion: 'date night' },
    { label: 'Wide-leg chino culottes', category: 'bottom', occasion: 'casual' },
    { label: 'Charcoal wool trousers', category: 'bottom', occasion: 'workwear' },
    { label: 'Plaid pleated skirt', category: 'skirt', occasion: 'workwear' },
    { label: 'Dotted tulle midi skirt', category: 'skirt', occasion: 'party' },
    { label: 'Tweed heart-button dress', category: 'dress', occasion: 'date night' },
    { label: 'Leather loafers', category: 'shoes', occasion: 'workwear' },
    { label: 'Burgundy slingback heels', category: 'shoes', occasion: 'date night' },
    { label: 'Structured tote', category: 'bag', occasion: 'workwear' },
    { label: 'Rose-print shoulder bag', category: 'bag', occasion: 'date night' },
  ];

  const addedItems = demoItems.map(item => addItem(item));

  addOutfit({ name: 'Monday Boardroom', vibe: 'workwear', itemIds: [addedItems[0].id, addedItems[6].id, addedItems[9].id, addedItems[11].id] });
  addOutfit({ name: 'Dinner Reservations', vibe: 'date night', itemIds: [addedItems[8].id, addedItems[10].id, addedItems[12].id] });
  addOutfit({ name: 'Weekend Gingham', vibe: 'casual', itemIds: [addedItems[2].id, addedItems[6].id, addedItems[10].id] });
}
