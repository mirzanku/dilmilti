import { useEffect, useState } from 'react';

export interface OfflineCachedOfficialDoc {
  docId: string;
  title: string;
  nomorDokumen: string;
  kodeFormulirBukuII: string;
  kategori:
    | 'DOKUMEN BALASAN RESMI TTE'
    | 'TANDA TERIMA REGISTRASI'
    | 'BERITA ACARA KONSULTASI'
    | 'SERTIFIKAT VALIDASI TTE'
    | 'SOP & PEDOMAN BUKU II MA-RI'
    | 'STRUK ANTREAN PTSP';
  ticketOrRef: string;
  pemohonNama: string;
  mejaNama: string;
  htmlContent: string;
  cachedAt: string;
  isSyncedWithSw: boolean;
}

export interface PendingBackgroundSyncItem {
  id: string;
  actionType: 'AJUKAN_PERMOHONAN' | 'AMBIL_ANTREAN' | 'SIMPAN_DOKUMEN_BALASAN' | 'SYNC_DB_STATE';
  summary: string;
  endpoint: string;
  payload: any;
  createdAt: string;
  status: 'PENDING_OFFLINE' | 'SYNCING' | 'SYNCED';
}

const OFFLINE_DOCS_STORAGE_KEY = 'dilmilti5_ptsp_offline_docs_vault_v2';
const BG_SYNC_QUEUE_STORAGE_KEY = 'dilmilti5_ptsp_bg_sync_queue_v2';
const DOCS_CACHE_NAME = 'ptsp-official-docs-cache-v2';

type VaultListener = () => void;
const listeners = new Set<VaultListener>();

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {}
  });
}

export function subscribeToOfflineVault(fn: VaultListener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Register the unified Service Worker (/sw.js) and attach Background Sync listeners
export async function registerPtspServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  // In Vite development mode, do not register a Service Worker so HMR & @react-refresh preamble are never intercepted
  if ((import.meta as any).env?.DEV) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    navigator.serviceWorker.addEventListener('message', (event) => {
      const data = event.data;
      if (!data) return;
      if (data.type === 'PTSP_BG_SYNC_COMPLETED') {
        markAllPendingQueueSynced();
        notifyListeners();
      }
      if (data.type === 'OFFICIAL_DOCUMENT_CACHED') {
        notifyListeners();
      }
    });

    return reg;
  } catch {
    return null;
  }
}

// Save an official document to both Cache Storage (Service Worker) & LocalStorage Vault
export async function cacheOfficialDocumentForOffline(
  doc: Omit<OfflineCachedOfficialDoc, 'cachedAt' | 'isSyncedWithSw'>
): Promise<OfflineCachedOfficialDoc> {
  const timestamp = new Date().toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  let swCached = false;

  // 1. Store directly in Browser Cache Storage API (accessible by Service Worker when offline)
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cache = await caches.open(DOCS_CACHE_NAME);
      const virtualUrl = `/ptsp-offline-doc/${encodeURIComponent(doc.docId)}`;
      const response = new Response(doc.htmlContent, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-PTSP-Doc-Id': doc.docId,
          'X-PTSP-Kode-Buku-II': doc.kodeFormulirBukuII
        }
      });
      await cache.put(virtualUrl, response);
      swCached = true;
    } catch {}
  }

  // 2. Also send message to active Service Worker controller
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_OFFICIAL_DOCUMENT',
        docId: doc.docId,
        title: doc.title,
        htmlContent: doc.htmlContent
      });
      swCached = true;
    } catch {}
  }

  const entry: OfflineCachedOfficialDoc = {
    ...doc,
    cachedAt: timestamp,
    isSyncedWithSw: swCached
  };

  // 3. Store metadata + HTML fallback in localStorage vault
  try {
    const existing = getOfflineCachedDocuments();
    const filtered = existing.filter((d) => d.docId !== doc.docId);
    const updated = [entry, ...filtered].slice(0, 35);
    localStorage.setItem(OFFLINE_DOCS_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  notifyListeners();
  return entry;
}

export function getOfflineCachedDocuments(): OfflineCachedOfficialDoc[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFLINE_DOCS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getOfflineDocumentHtml(docId: string): Promise<string | null> {
  // 1. Check Service Worker Cache Storage first
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cache = await caches.open(DOCS_CACHE_NAME);
      const match = await cache.match(`/ptsp-offline-doc/${encodeURIComponent(docId)}`);
      if (match) {
        return await match.text();
      }
    } catch {}
  }
  // 2. Fallback to LocalStorage Vault
  const list = getOfflineCachedDocuments();
  const found = list.find((d) => d.docId === docId);
  return found ? found.htmlContent : null;
}

export async function removeOfflineCachedDocument(docId: string): Promise<void> {
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cache = await caches.open(DOCS_CACHE_NAME);
      await cache.delete(`/ptsp-offline-doc/${encodeURIComponent(docId)}`);
    } catch {}
  }
  try {
    const list = getOfflineCachedDocuments().filter((d) => d.docId !== docId);
    localStorage.setItem(OFFLINE_DOCS_STORAGE_KEY, JSON.stringify(list));
  } catch {}
  notifyListeners();
}

// ============================================================================
// BACKGROUND SYNC QUEUE FOR OFFLINE PTSP MUTATIONS
// ============================================================================

async function saveToSwIndexedDb(item: PendingBackgroundSyncItem) {
  if (typeof window === 'undefined' || !('indexedDB' in window)) return;
  try {
    const req = indexedDB.open('ptsp_sw_background_sync_db', 1);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('sync_queue')) {
        db.createObjectStore('sync_queue', { keyPath: 'id' });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('sync_queue', 'readwrite');
      tx.objectStore('sync_queue').put(item);
    };
  } catch {}
}

export async function queuePtspBackgroundSync(
  actionType: PendingBackgroundSyncItem['actionType'],
  summary: string,
  payload: any,
  endpoint = '/api/court-db'
): Promise<PendingBackgroundSyncItem> {
  const item: PendingBackgroundSyncItem = {
    id: `bgsync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    actionType,
    summary,
    endpoint,
    payload,
    createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium' }),
    status: 'PENDING_OFFLINE'
  };

  try {
    const list = getPendingBackgroundSyncQueue();
    const updated = [item, ...list].slice(0, 30);
    localStorage.setItem(BG_SYNC_QUEUE_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  await saveToSwIndexedDb(item);

  // Register Background Sync tag with Service Worker if supported
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if ('sync' in reg) {
        await (reg as any).sync.register('ptsp-background-sync');
      }
    } catch {}
  }

  notifyListeners();
  return item;
}

export function getPendingBackgroundSyncQueue(): PendingBackgroundSyncItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BG_SYNC_QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markAllPendingQueueSynced() {
  try {
    const list = getPendingBackgroundSyncQueue().map((item) => ({
      ...item,
      status: 'SYNCED' as const
    }));
    localStorage.setItem(BG_SYNC_QUEUE_STORAGE_KEY, JSON.stringify(list));
  } catch {}
  notifyListeners();
}

export async function flushBackgroundSyncQueueNow(): Promise<{ synced: number }> {
  const queue = getPendingBackgroundSyncQueue();
  const pending = queue.filter((q) => q.status !== 'SYNCED');
  let synced = 0;

  for (const item of pending) {
    try {
      const res = await fetch(item.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload)
      });
      if (res.ok) {
        synced++;
      }
    } catch {}
  }

  if (synced > 0 || navigator.onLine) {
    markAllPendingQueueSynced();
  }

  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'TRIGGER_NOW_BG_SYNC' });
  }

  notifyListeners();
  return { synced };
}

// ============================================================================
// PWA INSTALL & ONLINE STATUS HOOKS (Per pwa-integration Skill)
// ============================================================================

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushBackgroundSyncQueueNow();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
