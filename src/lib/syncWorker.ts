import { getQueuedPhotos, removeQueuedPhoto, type QueuedPhoto } from "./offlineQueue";

async function uploadPhoto(photo: QueuedPhoto): Promise<boolean> {
  const formData = new FormData();
  formData.append("file", photo.blob, "photo.webp");
  formData.append("eventId", photo.eventId);
  formData.append("sessionId", photo.sessionId);
  formData.append("guestName", photo.guestName);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type SyncStatus = "idle" | "syncing" | "error";
export type SyncCallback = (status: SyncStatus, synced: number, failed: number) => void;

let syncInProgress = false;

export async function processQueue(onStatus?: SyncCallback): Promise<void> {
  if (syncInProgress) return;
  if (!navigator.onLine) return;

  syncInProgress = true;
  onStatus?.("syncing", 0, 0);

  const queue = await getQueuedPhotos();
  let synced = 0;
  let failed = 0;

  for (const photo of queue) {
    const success = await uploadPhoto(photo);
    if (success) {
      await removeQueuedPhoto(photo.id);
      synced++;
    } else {
      failed++;
    }
    onStatus?.("syncing", synced, failed);
  }

  syncInProgress = false;
  onStatus?.("idle", synced, failed);
}

export function startSyncListener(onStatus: SyncCallback): () => void {
  const handleOnline = () => processQueue(onStatus);

  window.addEventListener("online", handleOnline);

  return () => {
    window.removeEventListener("online", handleOnline);
  };
}
