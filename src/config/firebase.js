import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────────────────────
// 🔥 PASTE YOUR FIREBASE CONFIG HERE
// Firebase Console → Project Settings → Your Apps → SDK setup
// ─────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "REPLACE_ME",
  authDomain:        "REPLACE_ME",
  projectId:         "REPLACE_ME",
  storageBucket:     "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId:             "REPLACE_ME",
};
// ─────────────────────────────────────────────────────────────

// True only when config has been filled in with real values
export const FIREBASE_READY = firebaseConfig.apiKey !== 'REPLACE_ME';

let db = null;
let storage = null;
let auth = null;

if (FIREBASE_READY) {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  db = getFirestore(app);
  storage = getStorage(app);
}

export { db, storage, auth };
