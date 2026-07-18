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
  apiKey:            "AIzaSyAfmQqLkUN2YXdoQ2ESoeMx3Lh09J-pzX8",
  authDomain:        "closet-app-divyarao.firebaseapp.com",
  projectId:         "closet-app-divyarao",
  storageBucket:     "closet-app-divyarao.firebasestorage.app",
  messagingSenderId: "454617858598",
  appId:             "1:454617858598:web:25a53b89f587232dc45ce7",
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
