import { DocumentTemplateItem, SakipDipaDocumentItem } from '../types';

const DB_NAME = 'dilmilti_templates_cache_db';
const DB_VERSION = 1;

const STORES = {
  TEMPLATES: 'cached_templates',
  REPORTS: 'cached_reports',
  METADATA: 'cache_metadata'
} as const;

export interface CachedTemplateRecord extends DocumentTemplateItem {
  cachedAt: string;
  localDownloadCount: number;
  isOfflineAvailable: boolean;
}

export interface CachedReportRecord extends SakipDipaDocumentItem {
  cachedAt: string;
  localDownloadCount: number;
  isOfflineAvailable: boolean;
}

export interface TemplateCacheStats {
  isSupported: boolean;
  templateCount: number;
  reportCount: number;
  totalCached: number;
  frequentlyDownloadedCount: number;
  lastSyncTime: string | null;
}

function isIndexedDbAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDbAvailable()) {
      return reject(new Error('IndexedDB tidak didukung oleh browser ini'));
    }

    const req = window.indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Store for Document Templates
      if (!db.objectStoreNames.contains(STORES.TEMPLATES)) {
        const templateStore = db.createObjectStore(STORES.TEMPLATES, { keyPath: 'id' });
        templateStore.createIndex('kategori', 'kategori', { unique: false });
        templateStore.createIndex('localDownloadCount', 'localDownloadCount', { unique: false });
        templateStore.createIndex('jumlahDiunduh', 'jumlahDiunduh', { unique: false });
        templateStore.createIndex('cachedAt', 'cachedAt', { unique: false });
      }

      // 2. Store for Official Reports (SAKIP/DIPA/LKjIP/Laptah)
      if (!db.objectStoreNames.contains(STORES.REPORTS)) {
        const reportStore = db.createObjectStore(STORES.REPORTS, { keyPath: 'id' });
        reportStore.createIndex('kategori', 'kategori', { unique: false });
        reportStore.createIndex('tahun', 'tahun', { unique: false });
        reportStore.createIndex('localDownloadCount', 'localDownloadCount', { unique: false });
        reportStore.createIndex('cachedAt', 'cachedAt', { unique: false });
      }

      // 3. Metadata store
      if (!db.objectStoreNames.contains(STORES.METADATA)) {
        db.createObjectStore(STORES.METADATA, { keyPath: 'key' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Gagal membuka IndexedDB'));
  });
}

/**
 * Cache single template item into IndexedDB
 */
export async function cacheTemplateToIndexedDb(
  item: DocumentTemplateItem,
  incrementDownload: boolean = false
): Promise<void> {
  if (!isIndexedDbAvailable()) return;
  try {
    const db = await openDb();
    const tx = db.transaction([STORES.TEMPLATES, STORES.METADATA], 'readwrite');
    const store = tx.objectStore(STORES.TEMPLATES);

    const getReq = store.get(item.id);
    getReq.onsuccess = () => {
      const existing: CachedTemplateRecord | undefined = getReq.result;
      const currentDownloadCount = (existing?.localDownloadCount || 0) + (incrementDownload ? 1 : 0);

      const record: CachedTemplateRecord = {
        ...item,
        cachedAt: new Date().toISOString(),
        localDownloadCount: Math.max(currentDownloadCount, item.jumlahDiunduh || 0),
        isOfflineAvailable: true
      };

      store.put(record);

      const metaStore = tx.objectStore(STORES.METADATA);
      metaStore.put({ key: 'last_sync', value: new Date().toISOString() });
    };

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IndexedDB Cache] Gagal menyimpan template:', err);
  }
}

/**
 * Cache multiple templates into IndexedDB in a single transaction
 */
export async function cacheTemplatesBatchToIndexedDb(
  items: DocumentTemplateItem[]
): Promise<number> {
  if (!isIndexedDbAvailable() || !items || items.length === 0) return 0;
  try {
    const db = await openDb();
    const tx = db.transaction([STORES.TEMPLATES, STORES.METADATA], 'readwrite');
    const store = tx.objectStore(STORES.TEMPLATES);
    const now = new Date().toISOString();

    let count = 0;
    for (const item of items) {
      const record: CachedTemplateRecord = {
        ...item,
        cachedAt: now,
        localDownloadCount: item.jumlahDiunduh || 1,
        isOfflineAvailable: true
      };
      store.put(record);
      count++;
    }

    const metaStore = tx.objectStore(STORES.METADATA);
    metaStore.put({ key: 'last_sync', value: now });
    metaStore.put({ key: 'total_templates_cached', value: count });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(count);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IndexedDB Cache] Gagal menyimpan batch template:', err);
    return 0;
  }
}

/**
 * Cache official report (SAKIP / DIPA / LKJIP) into IndexedDB
 */
export async function cacheSakipDocToIndexedDb(
  doc: SakipDipaDocumentItem,
  incrementDownload: boolean = false
): Promise<void> {
  if (!isIndexedDbAvailable()) return;
  try {
    const db = await openDb();
    const tx = db.transaction([STORES.REPORTS, STORES.METADATA], 'readwrite');
    const store = tx.objectStore(STORES.REPORTS);

    const getReq = store.get(doc.id);
    getReq.onsuccess = () => {
      const existing: CachedReportRecord | undefined = getReq.result;
      const currentDownloadCount = (existing?.localDownloadCount || 0) + (incrementDownload ? 1 : 0);

      const record: CachedReportRecord = {
        ...doc,
        cachedAt: new Date().toISOString(),
        localDownloadCount: currentDownloadCount,
        isOfflineAvailable: true
      };

      store.put(record);

      const metaStore = tx.objectStore(STORES.METADATA);
      metaStore.put({ key: 'last_sync', value: new Date().toISOString() });
    };

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IndexedDB Cache] Gagal menyimpan laporan:', err);
  }
}

/**
 * Cache batch of official reports
 */
export async function cacheSakipDocsBatchToIndexedDb(
  docs: SakipDipaDocumentItem[]
): Promise<number> {
  if (!isIndexedDbAvailable() || !docs || docs.length === 0) return 0;
  try {
    const db = await openDb();
    const tx = db.transaction([STORES.REPORTS, STORES.METADATA], 'readwrite');
    const store = tx.objectStore(STORES.REPORTS);
    const now = new Date().toISOString();

    let count = 0;
    for (const doc of docs) {
      const record: CachedReportRecord = {
        ...doc,
        cachedAt: now,
        localDownloadCount: 1,
        isOfflineAvailable: true
      };
      store.put(record);
      count++;
    }

    const metaStore = tx.objectStore(STORES.METADATA);
    metaStore.put({ key: 'last_sync', value: now });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(count);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IndexedDB Cache] Gagal menyimpan batch laporan:', err);
    return 0;
  }
}

/**
 * Retrieve all cached document templates from IndexedDB
 */
export async function getAllCachedTemplatesFromIndexedDb(): Promise<CachedTemplateRecord[]> {
  if (!isIndexedDbAvailable()) return [];
  try {
    const db = await openDb();
    const tx = db.transaction(STORES.TEMPLATES, 'readonly');
    const store = tx.objectStore(STORES.TEMPLATES);
    const req = store.getAll();

    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[IndexedDB Cache] Gagal membaca cached templates:', err);
    return [];
  }
}

/**
 * Retrieve all cached reports from IndexedDB
 */
export async function getAllCachedReportsFromIndexedDb(): Promise<CachedReportRecord[]> {
  if (!isIndexedDbAvailable()) return [];
  try {
    const db = await openDb();
    const tx = db.transaction(STORES.REPORTS, 'readonly');
    const store = tx.objectStore(STORES.REPORTS);
    const req = store.getAll();

    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[IndexedDB Cache] Gagal membaca cached reports:', err);
    return [];
  }
}

/**
 * Get frequently downloaded templates from IndexedDB sorted by download count
 */
export async function getFrequentlyDownloadedFromIndexedDb(
  limit: number = 10
): Promise<CachedTemplateRecord[]> {
  const all = await getAllCachedTemplatesFromIndexedDb();
  return all
    .sort((a, b) => (b.localDownloadCount || b.jumlahDiunduh || 0) - (a.localDownloadCount || a.jumlahDiunduh || 0))
    .slice(0, limit);
}

/**
 * Check if a specific template ID is cached in IndexedDB
 */
export async function isTemplateCachedInIndexedDb(id: string): Promise<boolean> {
  if (!isIndexedDbAvailable() || !id) return false;
  try {
    const db = await openDb();
    const tx = db.transaction(STORES.TEMPLATES, 'readonly');
    const store = tx.objectStore(STORES.TEMPLATES);
    const req = store.get(id);

    return new Promise((resolve) => {
      req.onsuccess = () => resolve(Boolean(req.result));
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Get overall IndexedDB cache statistics
 */
export async function getTemplateCacheStats(): Promise<TemplateCacheStats> {
  if (!isIndexedDbAvailable()) {
    return {
      isSupported: false,
      templateCount: 0,
      reportCount: 0,
      totalCached: 0,
      frequentlyDownloadedCount: 0,
      lastSyncTime: null
    };
  }

  try {
    const db = await openDb();
    const tx = db.transaction([STORES.TEMPLATES, STORES.REPORTS, STORES.METADATA], 'readonly');

    const templateStore = tx.objectStore(STORES.TEMPLATES);
    const reportStore = tx.objectStore(STORES.REPORTS);
    const metaStore = tx.objectStore(STORES.METADATA);

    const templateCountReq = templateStore.count();
    const reportCountReq = reportStore.count();
    const metaReq = metaStore.get('last_sync');

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        const tCount = templateCountReq.result || 0;
        const rCount = reportCountReq.result || 0;
        const lastSync = metaReq.result?.value || null;

        resolve({
          isSupported: true,
          templateCount: tCount,
          reportCount: rCount,
          totalCached: tCount + rCount,
          frequentlyDownloadedCount: tCount,
          lastSyncTime: lastSync
        });
      };

      tx.onerror = () => {
        resolve({
          isSupported: true,
          templateCount: 0,
          reportCount: 0,
          totalCached: 0,
          frequentlyDownloadedCount: 0,
          lastSyncTime: null
        });
      };
    });
  } catch {
    return {
      isSupported: true,
      templateCount: 0,
      reportCount: 0,
      totalCached: 0,
      frequentlyDownloadedCount: 0,
      lastSyncTime: null
    };
  }
}

/**
 * Clear the entire IndexedDB template cache
 */
export async function clearTemplateIndexedDbCache(): Promise<boolean> {
  if (!isIndexedDbAvailable()) return false;
  try {
    const db = await openDb();
    const tx = db.transaction([STORES.TEMPLATES, STORES.REPORTS, STORES.METADATA], 'readwrite');
    tx.objectStore(STORES.TEMPLATES).clear();
    tx.objectStore(STORES.REPORTS).clear();
    tx.objectStore(STORES.METADATA).clear();

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IndexedDB Cache] Gagal membersihkan cache:', err);
    return false;
  }
}
