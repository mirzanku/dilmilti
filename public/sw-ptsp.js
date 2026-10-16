/**
 * ============================================================================
 * SERVICE WORKER: PORTAL PTSP ELEKTRONIK PENGADILAN MILITER TINGGI V MAKASSAR
 * Standar Buku II Mahkamah Agung RI Edisi Terbaru & Background Sync Offline
 * ============================================================================
 */

const STATIC_CACHE_NAME = 'ptsp-dilmilti5-static-v7';
const DOCS_CACHE_NAME = 'ptsp-official-docs-cache-v2';
const API_CACHE_NAME = 'ptsp-api-data-cache-v7';
const SYNC_TAG_PTSP = 'ptsp-background-sync';
const SYNC_TAG_DOCS = 'ptsp-doc-prefetch-sync';

const PRECACHE_URLS = [
  '/icon.svg'
];

// IndexedDB helper inside Service Worker for Background Sync Queue
function openSyncIdb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('ptsp_sw_background_sync_db', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('sync_queue')) {
        db.createObjectStore('sync_queue', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cached_docs_meta')) {
        db.createObjectStore('cached_docs_meta', { keyPath: 'docId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getPendingSyncItems() {
  try {
    const db = await openSyncIdb();
    return new Promise((resolve) => {
      const tx = db.transaction('sync_queue', 'readonly');
      const store = tx.objectStore('sync_queue');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

async function removeSyncedItem(id) {
  try {
    const db = await openSyncIdb();
    return new Promise((resolve) => {
      const tx = db.transaction('sync_queue', 'readwrite');
      tx.objectStore('sync_queue').delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res && res.ok) {
                return cache.put(url, res);
              }
            })
            .catch(() => {})
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (
              key !== STATIC_CACHE_NAME &&
              key !== DOCS_CACHE_NAME &&
              key !== API_CACHE_NAME &&
              key.startsWith('ptsp-')
            ) {
              return caches.delete(key);
            }
          })
        )
      )
    ])
  );
});

// Intercept Virtual Official Document URLs (/ptsp-offline-doc/*), API Data, QR Codes, and Navigation
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Virtual Offline Official Documents (/ptsp-offline-doc/:docId)
  if (url.pathname.startsWith('/ptsp-offline-doc/')) {
    event.respondWith(
      caches.open(DOCS_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        return new Response(
          '<!DOCTYPE html><html><body style="font-family:sans-serif;padding:24px;"><h3>Dokumen Offline Belum Tersedia di Cache</h3><p>Silakan buka dokumen ini terlebih dahulu saat terhubung jaringan.</p></body></html>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      })
    );
    return;
  }

  // 2. API & Database endpoints (/api/court-db, /sync.php, .sql): Network-First with Offline Cache Fallback
  if (
    url.pathname.startsWith('/api/court-db') ||
    url.pathname.endsWith('/sync.php') ||
    url.pathname.endsWith('.sql')
  ) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          const cachedResponse = await cache.match(request);
          if (cachedResponse) return cachedResponse;
          return new Response(
            JSON.stringify({ offline: true, cached: false, message: 'Using local offline database cache' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
      })
    );
    return;
  }

  // 3. QR Code images & Google Fonts: Cache-First with Network Fallback
  if (
    url.hostname.includes('api.qrserver.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.open(DOCS_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const netRes = await fetch(request);
          if (netRes && (netRes.ok || netRes.type === 'opaque')) {
            cache.put(request, netRes.clone());
          }
          return netRes;
        } catch {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // 4. Navigation & App Shell for Standalone PTSP Portal
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(STATIC_CACHE_NAME);
          return (
            (await cache.match(request)) ||
            (await cache.match('/?portal=ptsp-online')) ||
            (await cache.match('/index.html')) ||
            (await cache.match('/'))
          );
        })
    );
  }
});

// Background Sync Replay Handler
async function replayPendingSyncQueue() {
  const pendingItems = await getPendingSyncItems();
  let syncedCount = 0;

  for (const item of pendingItems) {
    try {
      const response = await fetch(item.endpoint || '/api/court-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload)
      });
      if (response.ok) {
        await removeSyncedItem(item.id);
        syncedCount++;
      }
    } catch {
      // Remain in queue for next sync event
    }
  }

  // Notify all open PTSP clients that background sync completed
  const clientList = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  for (const client of clientList) {
    client.postMessage({
      type: 'PTSP_BG_SYNC_COMPLETED',
      syncedCount,
      remainingCount: Math.max(0, pendingItems.length - syncedCount),
      timestamp: new Date().toISOString()
    });
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG_PTSP || event.tag === SYNC_TAG_DOCS) {
    event.waitUntil(replayPendingSyncQueue());
  }
});

// Message Handler from PTSP Portal Client
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || !data.type) return;

  if (data.type === 'CACHE_OFFICIAL_DOCUMENT' && data.docId && data.htmlContent) {
    event.waitUntil(
      caches.open(DOCS_CACHE_NAME).then(async (cache) => {
        const docUrl = `/ptsp-offline-doc/${encodeURIComponent(data.docId)}`;
        const response = new Response(data.htmlContent, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-PTSP-Doc-Title': encodeURIComponent(data.title || data.docId),
            'X-PTSP-Cached-At': new Date().toISOString()
          }
        });
        await cache.put(docUrl, response);

        if (event.source) {
          event.source.postMessage({
            type: 'OFFICIAL_DOCUMENT_CACHED',
            docId: data.docId,
            docUrl
          });
        }
      })
    );
  }

  if (data.type === 'TRIGGER_NOW_BG_SYNC') {
    event.waitUntil(replayPendingSyncQueue());
  }
});
