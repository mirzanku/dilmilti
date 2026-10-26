import { db, auth } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import { CourtDB, STORAGE_KEYS } from '../data/courtDatabase';
import { PersonnelItem } from '../types';

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
    return new Date().toDateString();
  }
}

export function checkIsQuotaExceeded(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const today = getTodayString();
    const stored = localStorage.getItem(QUOTA_EXHAUSTED_KEY);
    // Only return true if today explicitly had a quota exhaustion error from Firestore
    return stored === today;
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
 * Synchronizes a single personnel document to Firestore /personnel/{personnelId}
 * Ensures that employee profile details and photo URLs are stored in the database.
 */
export async function syncPersonnelToFirestore(item: PersonnelItem): Promise<boolean> {
  if (typeof window === 'undefined' || getIsQuotaExceeded() || !item || !item.id) return false;
  try {
    const personRef = doc(db, 'personnel', item.id);
    await setDoc(personRef, {
      id: item.id,
      no: item.no,
      nama: item.nama || '',
      nipNrp: item.nipNrp || '',
      pangkatGol: item.pangkatGol || '',
      jabatan: item.jabatan || '',
      kategori: item.kategori || 'Kesekretariatan',
      isMutasiMasuk: Boolean(item.isMutasiMasuk),
      matra: item.matra || 'ASN MA-RI',
      pendidikan: item.pendidikan || '',
      riwayatSingkat: item.riwayatSingkat || '',
      fotoUrl: item.fotoUrl || '',
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firestore] Successfully saved personnel profile photo & details to database: ${item.nama} (${item.id})`);
    return true;
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Quota exceeded') || msg.includes('resource-exhausted')) {
      markQuotaExceeded();
      isQuotaExceeded = true;
      notifySyncStatus('quota_paused');
      return false;
    }
    handleFirestoreError(err, OperationType.WRITE, `personnel/${item.id}`);
    return false;
  }
}

/**
 * Deletes a personnel document from Firestore /personnel/{personnelId}
 */
export async function deletePersonnelFromFirestore(id: string): Promise<boolean> {
  if (typeof window === 'undefined' || getIsQuotaExceeded() || !id) return false;
  try {
    const personRef = doc(db, 'personnel', id);
    await deleteDoc(personRef);
    console.log(`[Firestore] Successfully deleted personnel from database: ${id}`);
    return true;
  } catch (err: any) {
    handleFirestoreError(err, OperationType.DELETE, `personnel/${id}`);
    return false;
  }
}

/**
 * Synchronizes all personnel items to Firestore /personnel/{personnelId}
 */
export async function syncAllPersonnelToFirestore(items: PersonnelItem[]): Promise<boolean> {
  if (typeof window === 'undefined' || getIsQuotaExceeded() || !Array.isArray(items)) return false;
  try {
    for (const item of items) {
      if (!item || !item.id) continue;
      await syncPersonnelToFirestore(item);
    }
    return true;
  } catch (err) {
    console.warn('[Firestore] Error syncing all personnel:', err);
    return false;
  }
}

/**
 * Hydrates database from Firestore on app startup.
 * If data exists in Firestore, populates localStorage and triggers UI refresh.
 * Also hydrates the individual /personnel collection to guarantee profile photos are always restored.
 */
export async function hydrateFromFirestore(): Promise<{ success: boolean; source: 'cloud' | 'seeded' | 'local_fallback' | 'error' }> {
  if (typeof window === 'undefined') return { success: false, source: 'error' };
  if (getIsQuotaExceeded()) {
    notifySyncStatus('quota_paused');
    return { success: true, source: 'local_fallback' };
  }

  try {
    notifySyncStatus('syncing');
    let hasChanges = false;

    // 1. Fetch centralized database snapshot
    const centralDocRef = doc(db, 'central_db', 'dilmilti5_central_db');
    try {
      const centralDocSnap = await getDoc(centralDocRef);
      if (centralDocSnap && centralDocSnap.exists()) {
        const cloudData = centralDocSnap.data();
        const entries = cloudData?.data;

        if (entries && typeof entries === 'object' && Object.keys(entries).length > 0) {
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
        }
      }
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Quota exceeded') || msg.includes('resource-exhausted') || msg.includes('Quota limit exceeded')) {
        markQuotaExceeded();
        isQuotaExceeded = true;
        notifySyncStatus('quota_paused');
        return { success: true, source: 'local_fallback' };
      }
      console.warn('[Firestore] Central DB fetch notice:', msg);
    }

    // 2. Fetch all personnel profiles directly from Firestore /personnel collection
    try {
      const persSnapshot = await getDocs(collection(db, 'personnel'));
      if (persSnapshot && !persSnapshot.empty) {
        const cloudPersonnelMap = new Map<string, PersonnelItem>();
        persSnapshot.forEach(docSnap => {
          const p = docSnap.data() as PersonnelItem;
          if (p && p.id) {
            cloudPersonnelMap.set(p.id, p);
          }
        });

        if (cloudPersonnelMap.size > 0) {
          const localPersonnelRaw = localStorage.getItem(STORAGE_KEYS.PERSONNEL);
          let localPersonnel: PersonnelItem[] = [];
          try {
            localPersonnel = localPersonnelRaw ? JSON.parse(localPersonnelRaw) : [];
          } catch {}

          const mergedPersonnel = [...localPersonnel];
          cloudPersonnelMap.forEach((cloudPerson, id) => {
            const idx = mergedPersonnel.findIndex(p => p.id === id);
            if (idx !== -1) {
              // If cloud has a valid fotoUrl or newer fields, merge them
              mergedPersonnel[idx] = {
                ...mergedPersonnel[idx],
                ...cloudPerson,
                fotoUrl: cloudPerson.fotoUrl || mergedPersonnel[idx].fotoUrl
              };
            } else {
              mergedPersonnel.push(cloudPerson);
            }
          });

          const newStr = JSON.stringify(mergedPersonnel);
          if (localPersonnelRaw !== newStr) {
            localStorage.setItem(STORAGE_KEYS.PERSONNEL, newStr);
            hasChanges = true;
            console.log(`[Firestore] Hydrated ${cloudPersonnelMap.size} personnel profile records from database collection.`);
          }
        }
      }
    } catch (err: any) {
      console.warn('[Firestore] Personnel collection fetch notice:', err?.message || err);
    }

    if (hasChanges) {
      window.dispatchEvent(new CustomEvent('dilmilti_db_updated', { detail: { source: 'cloud' } }));
    }

    notifySyncStatus('synced');
    return { success: true, source: 'cloud' };
  } catch (error) {
    console.warn('[Firestore] Hydration notice:', error);
    notifySyncStatus('connected');
    return { success: true, source: 'local_fallback' };
  }
}

/**
 * Pushes full database snapshot to Firestore central_db and also syncs all personnel.
 */
export async function pushAllToFirestore(): Promise<void> {
  if (typeof window === 'undefined' || getIsQuotaExceeded()) return;

  const now = Date.now();
  if (now - lastCloudWriteTime < 3000) {
    return;
  }
  lastCloudWriteTime = now;
  lastLocalSaveTimestamp = now;

  try {
    notifySyncStatus('syncing');
    const allData = getAllLocalEntries();
    const version = CourtDB.serverVersion || Date.now();
    const nowIso = new Date().toISOString();

    // Save central document snapshot (contains all keys including personnel)
    const centralDocRef = doc(db, 'central_db', 'dilmilti5_central_db');
    try {
      await setDoc(centralDocRef, {
        docId: 'dilmilti5_central_db',
        version,
        lastUpdated: nowIso,
        data: allData
      });
      notifySyncStatus('synced');
      console.log('[Firestore] Synchronized database snapshot to cloud.');
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
        console.warn('[Firestore] Quota limit reached on push. Switching to local resilient database mode.');
        return;
      }
      handleFirestoreError(err, OperationType.WRITE, 'central_db/dilmilti5_central_db');
    }
  } catch (error) {
    console.warn('[Firestore] Notice saving snapshot:', error);
    notifySyncStatus('connected');
  }
}

/**
 * Subscribes to real-time updates from Firestore to enable live sync across devices.
 * Automatically pauses and unsubscribes if daily free quota is reached.
 */
export function subscribeToFirestoreChanges(): () => void {
  if (typeof window === 'undefined' || getIsQuotaExceeded()) return () => {};

  const unsubscribes: (() => void)[] = [];

  const cleanupSubscriptions = () => {
    unsubscribes.forEach(unsub => {
      try { unsub(); } catch {}
    });
    unsubscribes.length = 0;
  };

  try {
    // 1. Listen to central database snapshot
    const centralDocRef = doc(db, 'central_db', 'dilmilti5_central_db');
    const unsubCentral = onSnapshot(
      centralDocRef,
      (snapshot) => {
        if (snapshot.metadata.hasPendingWrites) return;

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
              console.log('[Firestore] Real-time remote central update received.');
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
          console.warn('[Firestore] Real-time subscription paused: daily quota limit reached.');
          cleanupSubscriptions();
        }
      }
    );
    unsubscribes.push(unsubCentral);

    // 2. Listen to personnel collection changes in real-time
    const unsubPersonnel = onSnapshot(
      collection(db, 'personnel'),
      (snapshot) => {
        if (snapshot.metadata.hasPendingWrites) return;
        if (snapshot.empty) return;

        const cloudPersonnelMap = new Map<string, PersonnelItem>();
        snapshot.forEach(docSnap => {
          const p = docSnap.data() as PersonnelItem;
          if (p && p.id) {
            cloudPersonnelMap.set(p.id, p);
          }
        });

        if (cloudPersonnelMap.size > 0) {
          const localRaw = localStorage.getItem(STORAGE_KEYS.PERSONNEL);
          let localList: PersonnelItem[] = [];
          try {
            localList = localRaw ? JSON.parse(localRaw) : [];
          } catch {}

          let changed = false;
          const mergedList = [...localList];

          cloudPersonnelMap.forEach((cloudP, id) => {
            const idx = mergedList.findIndex(p => p.id === id);
            if (idx !== -1) {
              if (JSON.stringify(mergedList[idx]) !== JSON.stringify(cloudP)) {
                mergedList[idx] = { ...mergedList[idx], ...cloudP };
                changed = true;
              }
            } else {
              mergedList.push(cloudP);
              changed = true;
            }
          });

          if (changed) {
            localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(mergedList));
            console.log('[Firestore] Real-time personnel update received.');
            window.dispatchEvent(new CustomEvent('dilmilti_db_updated', { detail: { source: 'cloud' } }));
            notifySyncStatus('synced');
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
          console.warn('[Firestore] Personnel subscription paused: daily quota limit reached.');
          cleanupSubscriptions();
        }
      }
    );
    unsubscribes.push(unsubPersonnel);

    return cleanupSubscriptions;
  } catch (err) {
    console.warn('[Firestore] Could not start snapshot listeners:', err);
    return () => {};
  }
}
