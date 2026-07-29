import { getQueuedPhotos, removeQueuedPhoto, type QueuedPhoto } from "./offlineQueue";

type UploadResult = "success" | "retry" | "rejected";

async function uploadPhoto(photo: QueuedPhoto): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", photo.blob, "photo.webp");
  formData.append("eventId", photo.eventId);
  formData.append("sessionId", photo.sessionId);
  formData.append("guestName", photo.guestName);
  formData.append("retaken", String(photo.retaken ?? false));

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) return "success";
    // 403 (shot limit reached) or 404 (event/session gone) can never succeed
    // on retry — drop them instead of looping forever on every reconnect.
    if (res.status === 403 || res.status === 404) return "rejected";
    return "retry";
  } catch {
    return "retry";
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
    const result = await uploadPhoto(photo);
    if (result === "success") {
      await removeQueuedPhoto(photo.id);
      // Retaken shots were never counted into queuedCount on the camera page
      // (they don't occupy a shot slot), so they must not decrement it here either.
      if (!photo.retaken) synced++;
    } else if (result === "rejected") {
      await removeQueuedPhoto(photo.id);
    } else {
      if (!photo.retaken) failed++;
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
