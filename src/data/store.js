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
    { label: 'White linen shirt', category: 'top', color: '#FFFFFF', colorName: 'White', occasion: 'workwear' },
    { label: 'Navy blazer', category: 'top', color: '#000080', colorName: 'Navy', occasion: 'workwear' },
    { label: 'Black turtleneck', category: 'top', color: '#111111', colorName: 'Black', occasion: 'casual' },
    { label: 'Blush silk blouse', category: 'top', color: '#FFB6C1', colorName: 'Blush', occasion: 'date night' },
    { label: 'Olive green tee', category: 'top', color: '#6B7C3B', colorName: 'Olive', occasion: 'casual' },
    { label: 'Black trousers', category: 'bottom', color: '#111111', colorName: 'Black', occasion: 'workwear' },
    { label: 'Beige wide leg pants', category: 'bottom', color: '#F5F5DC', colorName: 'Beige', occasion: 'casual' },
    { label: 'Blue denim jeans', category: 'bottom', color: '#4169E1', colorName: 'Blue', occasion: 'casual' },
    { label: 'Plaid mini skirt', category: 'skirt', color: '#808080', colorName: 'Grey', occasion: 'casual' },
    { label: 'Black midi skirt', category: 'skirt', color: '#111111', colorName: 'Black', occasion: 'workwear' },
    { label: 'Black heels', category: 'shoes', color: '#111111', colorName: 'Black', occasion: 'workwear' },
    { label: 'White sneakers', category: 'shoes', color: '#FFFFFF', colorName: 'White', occasion: 'casual' },
  ];

  const addedItems = demoItems.map(item => addItem(item));

  // Create a couple of demo outfits
  addOutfit({
    name: 'Office Monday',
    vibe: 'workwear',
    itemIds: [addedItems[0].id, addedItems[5].id, addedItems[10].id],
  });
  addOutfit({
    name: 'Weekend Chill',
    vibe: 'casual',
    itemIds: [addedItems[4].id, addedItems[7].id, addedItems[11].id],
  });
}
