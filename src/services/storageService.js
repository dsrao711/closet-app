import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export async function uploadItemPhoto(localUri, uid, itemId) {
  const rawExt = localUri.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp'].includes(rawExt) ? rawExt : 'jpg';
  const storagePath = `users/${uid}/items/${itemId}.${safeExt}`;

  const response = await fetch(localUri);
  const blob = await response.blob();

  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytesResumable(storageRef, blob);
  const imageUrl = await getDownloadURL(snapshot.ref);

  return { imageUrl, storagePath };
}

export async function deleteItemPhoto(storagePath) {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('Storage delete failed (non-fatal):', err.code);
  }
}
