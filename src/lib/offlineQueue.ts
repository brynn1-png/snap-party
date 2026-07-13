const DB_NAME = "snap-party-queue";
const DB_VERSION = 1;
const STORE_NAME = "pending-uploads";

export interface QueuedPhoto {
  id: string;
  blob: Blob;
  eventId: string;
  sessionId: string;
  guestName: string;
  timestamp: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function enqueuePhoto(photo: QueuedPhoto): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(photo);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getQueuedPhotos(): Promise<QueuedPhoto[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const all = store.getAll();
    all.onsuccess = () => {
      db.close();
      resolve(all.result.sort((a, b) => a.timestamp - b.timestamp));
    };
    all.onerror = () => {
      db.close();
      reject(all.error);
    };
  });
}

export async function removeQueuedPhoto(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getQueueCount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const count = tx.objectStore(STORE_NAME).count();
    count.onsuccess = () => {
      db.close();
      resolve(count.result);
    };
    count.onerror = () => {
      db.close();
      reject(count.error);
    };
  });
}
