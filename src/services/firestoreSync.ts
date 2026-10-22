import { db, auth } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or connectivity issue. Using cached database.');
      return false;
    }
    // If permission or not found, connection itself succeeded
    return true;
  }
}

// Memory tracking to prevent self-echo loops during real-time sync
let lastLocalSaveTimestamp = 0;
let isSyncingFromCloud = false;

/**
 * Reads all dilmilti5_ keys from localStorage to build a complete snapshot
 */
export function getAllLocalEntries(): Record<string, any> {
  const result: Record<string, any> = {};
  if (typeof window === 'undefined') return result;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('dilmilti5_')) continue;
    if (key === STORAGE_KEYS.CURRENT_USER) continue; // Keep auth session device-specific

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
 * If Firestore is empty, seeds Firestore from current database defaults.
 */
export async function hydrateFromFirestore(): Promise<{ success: boolean; source: 'cloud' | 'seeded' | 'error' }> {
  if (typeof window === 'undefined') return { success: false, source: 'error' };

  try {
    isSyncingFromCloud = true;
    const centralDocRef = doc(db, 'central_db', 'dilmilti5_central_db');
    let centralDocSnap;

    try {
      centralDocSnap = await getDoc(centralDocRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'central_db/dilmilti5_central_db');
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

        // Also query granular collections in case individual edits happened
        try {
          const [newsSnap, personnelSnap, jadwalSnap, sippSnap, identitySnap] = await Promise.all([
            getDocs(collection(db, 'news')),
            getDocs(collection(db, 'personnel')),
            getDocs(collection(db, 'jadwal')),
            getDocs(collection(db, 'sipp')),
            getDoc(doc(db, 'court_identity', 'identity'))
          ]);

          if (!newsSnap.empty) {
            const newsItems = newsSnap.docs.map(d => d.data());
            localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newsItems));
            hasChanges = true;
          }
          if (!personnelSnap.empty) {
            const personnelItems = personnelSnap.docs.map(d => d.data());
            localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(personnelItems));
            hasChanges = true;
          }
          if (!jadwalSnap.empty) {
            const jadwalItems = jadwalSnap.docs.map(d => d.data());
            localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(jadwalItems));
            hasChanges = true;
          }
          if (!sippSnap.empty) {
            const sippItems = sippSnap.docs.map(d => d.data());
            localStorage.setItem(STORAGE_KEYS.SIPP, JSON.stringify(sippItems));
            hasChanges = true;
          }
          if (identitySnap.exists()) {
            const identityData = identitySnap.data();
            localStorage.setItem(STORAGE_KEYS.COURT_IDENTITY, JSON.stringify(identityData));
            hasChanges = true;
          }
        } catch (collectionErr) {
          console.warn('Granular collections fetch notice:', collectionErr);
        }

        if (hasChanges) {
          window.dispatchEvent(new CustomEvent('dilmilti_db_updated'));
        }

        console.log('Successfully hydrated court database from Firestore cloud.');
        return { success: true, source: 'cloud' };
      }
    }

    // If Firestore is empty or uninitialized, seed it with current dataset
    console.log('Seeding initial court database to Firestore cloud...');
    await pushAllToFirestore();
    return { success: true, source: 'seeded' };
  } catch (error) {
    console.error('Firestore hydration error:', error);
    return { success: false, source: 'error' };
  } finally {
    isSyncingFromCloud = false;
  }
}

/**
 * Pushes full database snapshot and granular documents to Firestore.
 */
export async function pushAllToFirestore(): Promise<void> {
  if (typeof window === 'undefined') return;
  lastLocalSaveTimestamp = Date.now();

  try {
    const allData = getAllLocalEntries();
    const version = CourtDB.serverVersion || Date.now();
    const nowIso = new Date().toISOString();

    // 1. Central master document
    const centralDocRef = doc(db, 'central_db', 'dilmilti5_central_db');
    try {
      await setDoc(centralDocRef, {
        docId: 'dilmilti5_central_db',
        version,
        lastUpdated: nowIso,
        data: allData
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'central_db/dilmilti5_central_db');
    }

    // 2. Granular collections for high-fidelity queries
    const syncCollection = async (colName: string, items: any[]) => {
      if (!Array.isArray(items)) return;
      for (const item of items) {
        const docId = String(item.id || item.kode || item.nomorPerkara || item.label);
        if (!docId) continue;
        try {
          await setDoc(doc(db, colName, docId), item);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `${colName}/${docId}`);
        }
      }
    };

    const newsList = CourtDB.getNewsList();
    const personnelList = CourtDB.getPersonnelList();
    const jadwalList = CourtDB.getJadwalList();
    const sippList = CourtDB.getSippList();
    const queueList = CourtDB.getPTSPQueue();
    const quickAccessList = CourtDB.getQuickAccessList();
    const courtIdentity = CourtDB.getCourtIdentity();

    await Promise.all([
      syncCollection('news', newsList),
      syncCollection('personnel', personnelList),
      syncCollection('jadwal', jadwalList),
      syncCollection('sipp', sippList),
      syncCollection('ptsp_queue', queueList),
      syncCollection('quick_access', quickAccessList),
      setDoc(doc(db, 'court_identity', 'identity'), courtIdentity)
    ]);

    console.log('Successfully synchronized all court data to Firestore cloud.');
  } catch (error) {
    console.error('Error saving to Firestore:', error);
  }
}

/**
 * Subscribes to real-time updates from Firestore to enable live sync across devices.
 */
export function subscribeToFirestoreChanges(): () => void {
  if (typeof window === 'undefined') return () => {};

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
            window.dispatchEvent(new CustomEvent('dilmilti_db_updated'));
          }
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'central_db/dilmilti5_central_db');
    }
  );

  return unsubscribe;
}
