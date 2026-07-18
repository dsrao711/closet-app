import { useState, useEffect } from 'react';
import {
  collection, doc, getDoc, setDoc, deleteDoc, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, FIREBASE_READY } from '../config/firebase';
import { initAuth, getUid } from '../services/authService';
import { uploadItemPhoto, deleteItemPhoto } from '../services/storageService';

const PROFILE_STORAGE_KEY = 'closet_demo_profile';

// ── Local cache (Firestore is source of truth, or in-memory if not configured) ──
let _items = [];
let _outfits = [];
let _weeklyPlan = {
  current: { Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null },
  next:    { Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null },
};
let _profile = null;

let _listeners = [];
let _authPromise = null;
let _initialized = false;

function _notify() { _listeners.forEach(fn => fn()); }

export function subscribe(fn) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(l => l !== fn); };
}

// ── Boot ───────────────────────────────────────────────────
export async function initStore() {
  if (_initialized) return;
  _initialized = true;

  if (!FIREBASE_READY) {
    // Firebase not configured — run with demo data in memory
    _seedDemoData();
    const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) _profile = JSON.parse(raw);
    return;
  }

  _authPromise = initAuth();
  const uid = await _authPromise;
  if (!uid) { console.error('Auth failed'); return; }

  const profileSnap = await getDoc(doc(db, `users/${uid}`));
  if (profileSnap.exists()) _profile = profileSnap.data();

  // Real-time items listener
  onSnapshot(collection(db, `users/${uid}/items`), snap => {
    _items = snap.docs
      .map(d => {
        const data = d.data();
        return {
          id: d.id,
          label: data.label || '',
          category: data.category || 'top',
          occasion: data.occasion || 'casual',
          imageUri: data.imageUrl || null,
          storagePath: data.storagePath || null,
          addedAt: data.createdAt?.toMillis() || Date.now(),
        };
      })
      .sort((a, b) => b.addedAt - a.addedAt);
    _notify();
  });

  // Real-time outfits listener
  onSnapshot(collection(db, `users/${uid}/outfits`), snap => {
    _outfits = snap.docs
      .map(d => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || '',
          vibe: data.vibe || 'casual',
          itemIds: data.itemIds || [],
          addedAt: data.createdAt?.toMillis() || Date.now(),
        };
      })
      .sort((a, b) => b.addedAt - a.addedAt);
    _notify();
  });

  // Real-time weekly plan listener
  onSnapshot(doc(db, `users/${uid}/plan/week`), snap => {
    if (snap.exists()) {
      const data = snap.data();
      _weeklyPlan = {
        current: { Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null, ...(data.current || {}) },
        next:    { Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null, ...(data.next   || {}) },
      };
      _notify();
    }
  });
}

// ── Profile / onboarding ───────────────────────────────────
export function getProfile() { return _profile; }
export function isOnboarded() { return !!(_profile && _profile.name && _profile.mobile); }

export async function saveProfile({ name, mobile }) {
  _profile = { name, mobile };

  if (!FIREBASE_READY) {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(_profile));
    _notify();
    return;
  }

  const uid = await _authPromise;
  if (!uid) throw new Error('Not authenticated');
  await setDoc(doc(db, `users/${uid}`), { name, mobile, createdAt: serverTimestamp() }, { merge: true });
  _notify();
}

// ── Items ──────────────────────────────────────────────────
export function getItems() { return _items; }

export async function addItem(item) {
  const itemId = `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  if (!FIREBASE_READY) {
    const newItem = { id: itemId, ...item, addedAt: Date.now() };
    _items = [newItem, ..._items];
    _notify();
    return newItem;
  }

  const uid = await _authPromise;
  if (!uid) throw new Error('Not authenticated');

  let imageUrl = null;
  let storagePath = null;

  if (item.imageUri) {
    const isRemote = item.imageUri.startsWith('https://') || item.imageUri.startsWith('http://');
    if (isRemote) {
      imageUrl = item.imageUri;
    } else {
      const result = await uploadItemPhoto(item.imageUri, uid, itemId);
      imageUrl = result.imageUrl;
      storagePath = result.storagePath;
    }
  }

  await setDoc(doc(db, `users/${uid}/items/${itemId}`), {
    label: item.label || '',
    category: item.category || 'top',
    occasion: item.occasion || 'casual',
    imageUrl,
    storagePath,
    createdAt: serverTimestamp(),
  });

  return { id: itemId, label: item.label, category: item.category, occasion: item.occasion, imageUri: imageUrl };
}

export async function deleteItem(id) {
  if (!FIREBASE_READY) {
    _items = _items.filter(i => i.id !== id);
    _outfits = _outfits.map(o => ({ ...o, itemIds: o.itemIds.filter(x => x !== id) })).filter(o => o.itemIds.length > 0);
    _notify();
    return;
  }

  const uid = await _authPromise;
  if (!uid) return;

  const item = _items.find(i => i.id === id);
  await deleteDoc(doc(db, `users/${uid}/items/${id}`));
  if (item?.storagePath) deleteItemPhoto(item.storagePath);
}

// ── Outfits ────────────────────────────────────────────────
export function getOutfits() { return _outfits; }

export async function addOutfit(outfit) {
  const outfitId = `outfit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  if (!FIREBASE_READY) {
    const newOutfit = { id: outfitId, ...outfit, addedAt: Date.now() };
    _outfits = [newOutfit, ..._outfits];
    _notify();
    return newOutfit;
  }

  const uid = await _authPromise;
  if (!uid) throw new Error('Not authenticated');

  await setDoc(doc(db, `users/${uid}/outfits/${outfitId}`), {
    name: outfit.name || '',
    vibe: outfit.vibe || 'casual',
    itemIds: outfit.itemIds || [],
    createdAt: serverTimestamp(),
  });

  return { id: outfitId, ...outfit };
}

export async function deleteOutfit(id) {
  if (!FIREBASE_READY) {
    _outfits = _outfits.filter(o => o.id !== id);
    const clear = week => {
      const w = { ...week };
      Object.keys(w).forEach(d => { if (w[d] === id) w[d] = null; });
      return w;
    };
    _weeklyPlan = { current: clear(_weeklyPlan.current), next: clear(_weeklyPlan.next) };
    _notify();
    return;
  }

  const uid = await _authPromise;
  if (!uid) return;

  await deleteDoc(doc(db, `users/${uid}/outfits/${id}`));

  const planCopy = JSON.parse(JSON.stringify(_weeklyPlan));
  let dirty = false;
  ['current', 'next'].forEach(week => {
    Object.keys(planCopy[week]).forEach(day => {
      if (planCopy[week][day] === id) { planCopy[week][day] = null; dirty = true; }
    });
  });
  if (dirty) await setDoc(doc(db, `users/${uid}/plan/week`), planCopy);
}

// ── Weekly Plan ────────────────────────────────────────────
export function getWeeklyPlan() { return _weeklyPlan; }

export async function setDayOutfit(week, day, outfitId) {
  _weeklyPlan = { ..._weeklyPlan, [week]: { ..._weeklyPlan[week], [day]: outfitId } };
  _notify();

  if (!FIREBASE_READY) return;

  const uid = await _authPromise;
  if (!uid) return;
  await setDoc(doc(db, `users/${uid}/plan/week`), _weeklyPlan);
}

export async function clearDayOutfit(week, day) {
  _weeklyPlan = { ..._weeklyPlan, [week]: { ..._weeklyPlan[week], [day]: null } };
  _notify();

  if (!FIREBASE_READY) return;

  const uid = await _authPromise;
  if (!uid) return;
  await setDoc(doc(db, `users/${uid}/plan/week`), _weeklyPlan);
}

// ── Helpers ────────────────────────────────────────────────
export function getOutfitById(id) { return _outfits.find(o => o.id === id) || null; }
export function getItemById(id) { return _items.find(i => i.id === id) || null; }

export function getTodayOutfit() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days[new Date().getDay()];
  const id = _weeklyPlan.current[today];
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
    profile: getProfile(),
  };
}

// ── Demo seed data (offline / pre-Firebase mode only) ──────
function _seedDemoData() {
  const mkId = prefix => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
  const t = Date.now();

  const demoItems = [
    { id: mkId('item'), label: 'Eyelet blouse, noir', category: 'top', occasion: 'date night', imageUri: null, addedAt: t },
    { id: mkId('item'), label: 'Denim camp shirt', category: 'top', occasion: 'casual', imageUri: null, addedAt: t - 1 },
    { id: mkId('item'), label: 'Gingham overshirt', category: 'top', occasion: 'casual', imageUri: null, addedAt: t - 2 },
    { id: mkId('item'), label: 'Silk camisole', category: 'top', occasion: 'date night', imageUri: null, addedAt: t - 3 },
    { id: mkId('item'), label: 'Wide-leg chino culottes', category: 'bottom', occasion: 'casual', imageUri: null, addedAt: t - 4 },
    { id: mkId('item'), label: 'Charcoal wool trousers', category: 'bottom', occasion: 'workwear', imageUri: null, addedAt: t - 5 },
    { id: mkId('item'), label: 'Plaid pleated skirt', category: 'skirt', occasion: 'workwear', imageUri: null, addedAt: t - 6 },
    { id: mkId('item'), label: 'Dotted tulle midi skirt', category: 'skirt', occasion: 'party', imageUri: null, addedAt: t - 7 },
    { id: mkId('item'), label: 'Tweed heart-button dress', category: 'dress', occasion: 'date night', imageUri: null, addedAt: t - 8 },
    { id: mkId('item'), label: 'Leather loafers', category: 'shoes', occasion: 'workwear', imageUri: null, addedAt: t - 9 },
    { id: mkId('item'), label: 'Burgundy slingback heels', category: 'shoes', occasion: 'date night', imageUri: null, addedAt: t - 10 },
    { id: mkId('item'), label: 'Structured tote', category: 'bag', occasion: 'workwear', imageUri: null, addedAt: t - 11 },
    { id: mkId('item'), label: 'Rose-print shoulder bag', category: 'bag', occasion: 'date night', imageUri: null, addedAt: t - 12 },
  ];

  _items = demoItems;

  const o1 = mkId('outfit');
  const o2 = mkId('outfit');
  const o3 = mkId('outfit');
  _outfits = [
    { id: o1, name: 'Monday Boardroom', vibe: 'workwear', itemIds: [demoItems[0].id, demoItems[6].id, demoItems[9].id, demoItems[11].id], addedAt: t },
    { id: o2, name: 'Dinner Reservations', vibe: 'date night', itemIds: [demoItems[8].id, demoItems[10].id, demoItems[12].id], addedAt: t - 1 },
    { id: o3, name: 'Weekend Gingham', vibe: 'casual', itemIds: [demoItems[2].id, demoItems[4].id, demoItems[9].id], addedAt: t - 2 },
  ];

  _weeklyPlan.current.Mon = o1;
  _weeklyPlan.current.Wed = o3;
  _weeklyPlan.current.Fri = o2;

  _notify();
}
