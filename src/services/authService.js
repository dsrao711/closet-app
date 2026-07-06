import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

let currentUid = null;
let authReady = false;
const authListeners = [];

// Sign in anonymously on first launch — persists across restarts via AsyncStorage
export function initAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUid = user.uid;
        authReady = true;
        authListeners.forEach(fn => fn(currentUid));
        resolve(currentUid);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          currentUid = cred.user.uid;
          authReady = true;
          authListeners.forEach(fn => fn(currentUid));
          resolve(currentUid);
        } catch (err) {
          console.error('Auth failed:', err);
          resolve(null);
        }
      }
    });
  });
}

export function getUid() {
  return currentUid;
}

export function isAuthReady() {
  return authReady;
}
