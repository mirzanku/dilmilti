import { db, auth } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import { CourtDB, STORAGE_KEYS } from '../data/courtDatabase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export type SyncStatus = 'connected' | 'syncing' | 'synced' | 'quota_paused' | 'offline';

const QUOTA_EXHAUSTED_KEY = 'dilmilti5_firestore_quota_exhausted_date';

function getTodayString(): string {
  try {
    return new Date().toISOString().split('T')[0];
  } catch {
    return '2026-10-22';
  }
}

export function checkIsQuotaExceeded(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const today = getTodayString();
    const stored = localStorage.getItem(QUOTA_EXHAUSTED_KEY);
    // If today is recorded as exhausted, return true
    return stored === today || stored === '2026-10-22';
  } catch {
    return false;
  }
}

export function markQuotaExceeded(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUOTA_EXHAUSTED_KEY, getTodayString());
  } catch {}
}

// Global flags and state tracking
let isQuotaExceeded = checkIsQuotaExceeded();
let lastCloudWriteTime = 0;
let lastLocalSaveTimestamp = 0;
let currentSyncStatus: SyncStatus = isQuotaExceeded ? 'quota_paused' : 'connected';

export function getIsQuotaExceeded(): boolean {
  return isQuotaExceeded || checkIsQuotaExceeded();
}

export function getSyncStatus(): SyncStatus {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'offline';
  if (getIsQuotaExceeded()) return 'quota_paused';
  return currentSyncStatus;
}

function notifySyncStatus(status: SyncStatus) {
  currentSyncStatus = status;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dilmilti_sync_status_changed', { detail: { status } }));
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errMsg = error instanceof Error ? error.message : String(error);

  // Gracefully handle free tier quota exhaustion without throwing unhandled exceptions
  if (
    errMsg.includes('Quota exceeded') ||
    errMsg.includes('resource-exhausted') ||
    errMsg.includes('Quota limit exceeded')
  ) {
    markQuotaExceeded();
    isQuotaExceeded = true;
    notifySyncStatus('quota_paused');
    console.warn(
      `[Firestore Quota Notice] Free daily quota reached for operation ${operationType} on ${path || 'database'}. ` +
      `The app will seamlessly continue using the local database. Quota resets daily. ` +
      `Firebase console: https://console.firebase.google.com/project/gen-lang-client-0432019785/firestore/databases/ai-studio-pengadilanmilite-33a9cad1-35c0-4b90-8eca-8a4a7c47f941/data?openUpgradeDialog=true`
    );
    return;
  }

  // Gracefully handle offline / network connectivity errors
  if (errMsg.includes('the client is offline') || errMsg.includes('unavailable')) {
    notifySyncStatus('offline');
    console.warn(`[Firestore Notice] Client is offline or service unavailable on ${path || 'database'}. Using local database.`);
    return;
  }

  // Strictly conform to Firestore error diagnostic contract for permission / security rule errors
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to Firestore at application boot
 */
export async function testConnection(): Promise<boolean> {
  if (getIsQuotaExceeded()) {
    notifySyncStatus('quota_paused');
    return false;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    notifySyncStatus('connected');
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('Quota exceeded') || msg.includes('resource-exhausted') || msg.includes('Quota limit exceeded')) {
      markQuotaExceeded();
      isQuotaExceeded = true;
      notifySyncStatus('quota_paused');
      console.warn('[Firestore] Daily quota limit reached on boot. Running in resilient local database mode.');
      return false;
    }
    if (msg.includes('the client is offline')) {
      notifySyncStatus('offline');
      console.warn('[Firestore] Client is offline. Using local cached database.');
      return false;
    }
    notifySyncStatus('connected');
    return true;
  }
}

/**
 * Reads all dilmilti5_ keys from localStorage to build a complete snapshot.
 * Filters out redundant caches to ensure payload remains well below Firestore 1MB document limit.
 */
export function getAllLocalEntries(): Record<string, any> {
  const result: Record<string, any> = {};
  if (typeof window === 'undefined') return result;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('dilmilti5_')) continue;
    if (key === STORAGE_KEYS.CURRENT_USER) continue; // Keep auth session device-specific
    if (key.includes('snapshot_cache')) continue; // Skip redundant snapshot duplicate to save bandwidth

    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try {
        result[key] = JSON.parse(raw);
      } catch {
        result[key] = raw;
      }
    }
  }
  return result;
}

/**
 * Hydrates database from Firestore on app startup.
 * If data exists in Firestore, populates localStorage and triggers UI refresh.
 * If quota is exhausted or offline, falls back safely to local database without crashing.
 */
export async function hydrateFromFirestore(): Promise<{ success: boolean; source: 'cloud' | 'seeded' | 'local_fallback' | 'error' }> {
  if (typeof window === 'undefined') return { success: false, source: 'error' };
  if (getIsQuotaExceeded()) {
    notifySyncStatus('quota_paused');
    return { success: true, source: 'local_fallback' };
  }

  try {
    notifySyncStatus('syncing');
    const centralDocRef = doc(db, 'central_db', 'dilmilti5_central_db');
    let centralDocSnap;

    try {
      centralDocSnap = await getDoc(centralDocRef);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Quota exceeded') || msg.includes('resource-exhausted') || msg.includes('Quota limit exceeded')) {
        markQuotaExceeded();
        isQuotaExceeded = true;
        notifySyncStatus('quota_paused');
        console.warn('[Firestore] Quota limit reached during hydration. Falling back to local court database.');
        return { success: true, source: 'local_fallback' };
      }
      handleFirestoreError(err, OperationType.GET, 'central_db/dilmilti5_central_db');
      return { success: false, source: 'error' };
    }

    if (centralDocSnap && centralDocSnap.exists()) {
      const cloudData = centralDocSnap.data();
      const entries = cloudData?.data;

      if (entries && typeof entries === 'object' && Object.keys(entries).length > 0) {
        let hasChanges = false;

        Object.entries(entries).forEach(([key, val]) => {
          if (!key.startsWith('dilmilti5_')) return;
          if (key === STORAGE_KEYS.CURRENT_USER) return;

          const strVal = typeof val === 'string' ? val : JSON.stringify(val);
          const currentLocal = localStorage.getItem(key);

          if (currentLocal !== strVal) {
            localStorage.setItem(key, strVal);
            hasChanges = true;
          }
        });

        if (hasChanges) {
          // Explicitly tag event with source: 'cloud' to prevent echo loop back to Firestore
          window.dispatchEvent(new CustomEvent('dilmilti_db_updated', { detail: { source: 'cloud' } }));
        }

        notifySyncStatus('synced');
        console.log('Successfully hydrated court database from Firestore cloud.');
        return { success: true, source: 'cloud' };
      }
    }

    notifySyncStatus('connected');
    return { success: true, source: 'seeded' };
  } catch (error) {
    console.warn('[Firestore] Hydration notice:', error);
    notifySyncStatus('connected');
    return { success: true, source: 'local_fallback' };
  }
}

/**
 * Pushes full database snapshot to Firestore.
 * Highly quota-efficient: utilizes exactly 1 document write (central_db/dilmilti5_central_db)
 * and throttles requests to at most once per 10 seconds.
 */
export async function pushAllToFirestore(): Promise<void> {
  if (typeof window === 'undefined' || getIsQuotaExceeded()) return;

  const now = Date.now();
  // Throttle to at most 1 cloud write every 10 seconds to conserve free daily quota
  if (now - lastCloudWriteTime < 10000) {
    return;
  }
  lastCloudWriteTime = now;
  lastLocalSaveTimestamp = now;

  try {
    notifySyncStatus('syncing');
    const allData = getAllLocalEntries();
    const version = CourtDB.serverVersion || Date.now();
    const nowIso = new Date().toISOString();

    const centralDocRef = doc(db, 'central_db', 'dilmilti5_central_db');
    try {
      await setDoc(centralDocRef, {
        docId: 'dilmilti5_central_db',
        version,
        lastUpdated: nowIso,
        data: allData
      });
      notifySyncStatus('synced');
      console.log('Synchronized database snapshot to Firestore cloud (1 quota unit used).');
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes('Quota exceeded') ||
        msg.includes('resource-exhausted') ||
        msg.includes('Quota limit exceeded')
      ) {
        markQuotaExceeded();
        isQuotaExceeded = true;
        notifySyncStatus('quota_paused');
        return;
      }
      handleFirestoreError(err, OperationType.WRITE, 'central_db/dilmilti5_central_db');
    }
  } catch (error) {
    console.warn('Error saving to Firestore:', error);
    notifySyncStatus('connected');
  }
}

/**
 * Subscribes to real-time updates from Firestore to enable live sync across devices.
 * Automatically pauses if daily quota is reached.
 */
export function subscribeToFirestoreChanges(): () => void {
  if (typeof window === 'undefined' || getIsQuotaExceeded()) return () => {};

  try {
    const centralDocRef = doc(db, 'central_db', 'dilmilti5_central_db');

    const unsubscribe = onSnapshot(
      centralDocRef,
      (snapshot) => {
        // Avoid overwriting local edits that occurred within the last 3 seconds
        if (Date.now() - lastLocalSaveTimestamp < 3000) {
          return;
        }

        if (snapshot.exists()) {
          const cloudData = snapshot.data();
          const entries = cloudData?.data;

          if (entries && typeof entries === 'object') {
            let changed = false;
            Object.entries(entries).forEach(([key, val]) => {
              if (!key.startsWith('dilmilti5_')) return;
              if (key === STORAGE_KEYS.CURRENT_USER) return;

              const strVal = typeof val === 'string' ? val : JSON.stringify(val);
              const current = localStorage.getItem(key);

              if (current !== strVal) {
                localStorage.setItem(key, strVal);
                changed = true;
              }
            });

            if (changed) {
              console.log('Real-time remote update received from Firestore.');
              // Tagged with source: 'cloud' to prevent echo loops
              window.dispatchEvent(new CustomEvent('dilmilti_db_updated', { detail: { source: 'cloud' } }));
              notifySyncStatus('synced');
            }
          }
        }
      },
      (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        if (
          msg.includes('Quota exceeded') ||
          msg.includes('resource-exhausted') ||
          msg.includes('Quota limit exceeded')
        ) {
          markQuotaExceeded();
          isQuotaExceeded = true;
          notifySyncStatus('quota_paused');
          console.warn('[Firestore] Real-time subscription paused: daily quota limit reached. Using local database.');
          return;
        }
        handleFirestoreError(error, OperationType.GET, 'central_db/dilmilti5_central_db');
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('[Firestore] Could not start snapshot listener:', err);
    return () => {};
  }
}
