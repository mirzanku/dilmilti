/**
 * Service Worker - Pengadilan Militer Tinggi V Makassar
 * Implements:
 * 1. Network-First with Cache Fallback for high-priority sections ('Jadwal Sidang', 'SIPP', etc.)
 *    and automatic offline-to-online reconnection recovery.
 * 2. Stale-While-Revalidate (SWR) caching for general assets, media uploads, and standard reads
 *    on slow cellular connections.
 */

const CACHE_VERSION = 'v8';
const CORE_CACHE_NAME = `dilmilti5-core-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `dilmilti5-static-${CACHE_VERSION}`;
const API_CACHE_NAME = `dilmilti5-api-swr-${CACHE_VERSION}`;
const DOCS_CACHE_NAME = 'ptsp-official-docs-cache-v2';

// In-flight deduplication maps so concurrent or re-rendered DOM requests never abort or duplicate Vercel hits
const inFlightMediaFetches = new Map();
const inFlightApiFetches = new Map();

const CORE_PRECACHE_URLS = [
  '/images/dilmilti_v_logo_transparent.png',
  '/images/makassar_court_banner_1789442426023.jpg'
];

// High-priority sections that require Network-First freshness with offline cache fallback
const HIGH_PRIORITY_SECTIONS = new Set([
  'jadwal-sidang',
  'jadwal_sidang',
  'jadwal',
  'sipp',
  'ptsp-queue',
  'reconnect'
]);

// Tracks whether the device experienced an offline period so the next detected connection
// automatically forces a Network-First refresh instead of serving stale cache
let wasOffline = false;

// Normalize API URLs by stripping ephemeral query params (_t, priority, section, reconnect)
function getNormalizedApiCacheRequest(requestUrl) {
  const normalized = new URL(requestUrl.toString());
  normalized.searchParams.delete('_t');
  normalized.searchParams.delete('priority');
  normalized.searchParams.delete('section');
  normalized.searchParams.delete('reconnect');
  return new Request(normalized.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });
}

// Broadcast fresh/revalidated API payloads to all active window clients
async function notifyClientsOfRevalidation(url, payload, strategy = 'STALE-WHILE-REVALIDATE') {
  try {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      client.postMessage({
        type: 'SW_API_REVALIDATED',
        strategy,
        url,
        timestamp: Date.now(),
        payload
      });
    }
  } catch (err) {
    // Ignore broadcast errors
  }
}

// Helper: Fetch with timeout so slow/hung mobile connections cleanly fall back to cache
async function fetchWithTimeout(request, timeoutMs = 4500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(request, {
      cache: 'no-store',
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * NETWORK-FIRST WITH CACHE FALLBACK STRATEGY:
 * Used for high-priority sections like 'Jadwal Sidang' and immediately after
 * a connection is detected following an offline period.
 */
async function executeNetworkFirstWithFallback(request, url) {
  const cache = await caches.open(API_CACHE_NAME);
  const normalizedKey = getNormalizedApiCacheRequest(url);
  const dedupKey = 'nf:' + normalizedKey.url;

  try {
    let networkPromise = inFlightApiFetches.get(dedupKey);
    if (!networkPromise) {
      networkPromise = fetchWithTimeout(request, 5000).finally(() => {
        inFlightApiFetches.delete(dedupKey);
      });
      inFlightApiFetches.set(dedupKey, networkPromise);
    }
    const networkResponse = await networkPromise;
    if (networkResponse && networkResponse.ok) {
      wasOffline = false;
      const cloneForCache = networkResponse.clone();
      const cloneForBroadcast = networkResponse.clone();
      const cloneForCaller = networkResponse.clone();
      await cache.put(normalizedKey, cloneForCache);

      try {
        const jsonPayload = await cloneForBroadcast.json();
        await notifyClientsOfRevalidation(url.pathname, jsonPayload, 'NETWORK-FIRST');
      } catch (e) {}

      const headers = new Headers(cloneForCaller.headers);
      headers.set('X-SW-Cache', 'NETWORK-FIRST-LIVE');
      return new Response(cloneForCaller.body, {
        status: cloneForCaller.status,
        statusText: cloneForCaller.statusText,
        headers
      });
    }
  } catch (err) {
    // Network unreachable or timed out -> mark offline state so next online request forces Network-First
    wasOffline = true;
  }

  // Fallback to cached snapshot when offline or network fails
  const cachedResponse = await cache.match(normalizedKey);
  if (cachedResponse) {
    const headers = new Headers(cachedResponse.headers);
    headers.set('X-SW-Cache', 'NETWORK-FIRST-FALLBACK-CACHE');
    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers
    });
  }

  return new Response(
    JSON.stringify({
      success: false,
      offline: true,
      message: 'Offline and no cached Jadwal Sidang / API snapshot available'
    }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  );
}

// Determine whether a request targets a high-priority section ('Jadwal Sidang', 'SIPP')
// or is recovering from an offline state
function shouldUseNetworkFirst(request, url) {
  if (wasOffline) return true;
  if (url.pathname === '/api/sipp/sync' || url.pathname.includes('/jadwal')) return true;

  if (url.searchParams.has('_t')) return true;

  const priorityParam = (url.searchParams.get('priority') || '').toLowerCase();
  if (priorityParam === 'network-first' || priorityParam === 'high') return true;

  const sectionParam = (url.searchParams.get('section') || '').toLowerCase();
  if (HIGH_PRIORITY_SECTIONS.has(sectionParam)) return true;

  if (url.searchParams.get('reconnect') === '1') return true;

  const cacheControl = (request.headers.get('Cache-Control') || '').toLowerCase();
  if (cacheControl.includes('no-cache') || cacheControl.includes('no-store')) return true;

  const strategyHeader = (request.headers.get('X-Priority-Strategy') || '').toLowerCase();
  if (strategyHeader === 'network-first') return true;

  const sectionHeader = (request.headers.get('X-Court-Section') || '').toLowerCase();
  if (HIGH_PRIORITY_SECTIONS.has(sectionHeader)) return true;

  return false;
}

// 1. INSTALL: Precache core application shell & assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CORE_CACHE_NAME);
        await Promise.allSettled(
          CORE_PRECACHE_URLS.map((url) =>
            fetch(url, { cache: 'reload' }).then((res) => {
              if (res && res.ok) {
                return cache.put(url, res);
              }
            })
          )
        );
      } catch (err) {
        // Continue activation even if an optional asset fails to precache
      }
      await self.skipWaiting();
    })()
  );
});

// 2. ACTIVATE: Clean up outdated caches and claim clients immediately
self.addEventListener('activate', (event) => {
  const validCaches = new Set([CORE_CACHE_NAME, STATIC_CACHE_NAME, API_CACHE_NAME, DOCS_CACHE_NAME]);
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (
            !validCaches.has(key) &&
            (key.startsWith('dilmilti5-') || key.startsWith('workbox-') || key.startsWith('ptsp-dilmilti5-'))
          ) {
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

// 3. MESSAGE: Handle skipWaiting, cache invalidation, and offline-to-online reconnection sync
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (data.type === 'INVALIDATE_API_CACHE') {
    caches.delete(API_CACHE_NAME);
  } else if (data.type === 'NETWORK_OFFLINE') {
    wasOffline = true;
  } else if (data.type === 'NETWORK_RECONNECTED' || data.type === 'FETCH_HIGH_PRIORITY_SECTION') {
    wasOffline = true;
    const targetUrl = new URL('/api/court-db', self.location.origin);
    targetUrl.searchParams.set('priority', 'network-first');
    targetUrl.searchParams.set('section', data.section || 'jadwal-sidang');
    targetUrl.searchParams.set('reconnect', '1');
    targetUrl.searchParams.set('_t', String(Date.now()));

    const req = new Request(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Priority-Strategy': 'network-first',
        'X-Court-Section': data.section || 'jadwal-sidang'
      }
    });
    event.waitUntil(executeNetworkFirstWithFallback(req, targetUrl));
  } else if (data.type === 'CACHE_OFFICIAL_DOCUMENT' && data.docId && data.htmlContent) {
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
});

// 4. FETCH: Route requests with Network-First (for high-priority sections & reconnects) or SWR
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin or Google Fonts requests
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFonts =
    url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

  if (!isSameOrigin && !isGoogleFonts) {
    return;
  }

  // A. When a POST /api/court-db mutation succeeds, clear stale API cache entry so fresh state wins
  if (isSameOrigin && request.method === 'POST' && url.pathname.startsWith('/api/court-db')) {
    event.respondWith(
      (async () => {
        const response = await fetch(request);
        if (response && response.ok) {
          try {
            const cache = await caches.open(API_CACHE_NAME);
            const normalizedKey = getNormalizedApiCacheRequest(new URL('/api/court-db', self.location.origin));
            await cache.delete(normalizedKey);
          } catch (e) {}
        }
        return response;
      })()
    );
    return;
  }

  // Ignore all other non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Ignore Vite HMR / dev internal requests
  if (
    url.pathname.startsWith('/@vite') ||
    url.pathname.startsWith('/@react-refresh') ||
    url.pathname.startsWith('/@fs/') ||
    url.pathname.startsWith('/@id/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/src/') ||
    url.searchParams.has('html-proxy')
  ) {
    return;
  }

  // A2. Virtual Offline Official Documents (/ptsp-offline-doc/:docId)
  if (isSameOrigin && url.pathname.startsWith('/ptsp-offline-doc/')) {
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

  // B. Lightweight version check (/api/court-db/version): Network-First with in-flight deduplication & cache fallback
  if (
    isSameOrigin &&
    (url.pathname === '/api/court-db/version' ||
      (url.pathname === '/api/court-db' && url.searchParams.get('action') === 'version'))
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE_NAME);
        const normalizedKey = getNormalizedApiCacheRequest(url);
        const dedupKey = 'ver:' + normalizedKey.url;
        try {
          let verPromise = inFlightApiFetches.get(dedupKey);
          if (!verPromise) {
            verPromise = fetchWithTimeout(request, 3500).finally(() => {
              inFlightApiFetches.delete(dedupKey);
            });
            inFlightApiFetches.set(dedupKey, verPromise);
          }
          const networkResponse = await verPromise;
          if (networkResponse && networkResponse.ok) {
            wasOffline = false;
            cache.put(normalizedKey, networkResponse.clone());
            return networkResponse.clone();
          }
          return networkResponse;
        } catch (err) {
          wasOffline = true;
          const cached = await cache.match(normalizedKey);
          if (cached) return cached;
          return new Response(
            JSON.stringify({ version: 85, offline: true }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
      })()
    );
    return;
  }

  // C. Core API Data (/api/court-db, /api/sipp/sync):
  //    - Uses NETWORK-FIRST with cache fallback for high-priority sections ('Jadwal Sidang', 'SIPP')
  //      or whenever a connection is detected after an offline period (`wasOffline`).
  //    - Uses STALE-WHILE-REVALIDATE (SWR) for standard background reads on slow mobile connections.
  if (
    isSameOrigin &&
    (url.pathname === '/api/court-db' || url.pathname === '/api/sipp/sync')
  ) {
    if (shouldUseNetworkFirst(request, url)) {
      event.respondWith(executeNetworkFirstWithFallback(request, url));
      return;
    }

    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE_NAME);
        const normalizedKey = getNormalizedApiCacheRequest(url);
        const cachedResponse = await cache.match(normalizedKey);
        const dedupKey = normalizedKey.url;

        let networkFetchPromise = inFlightApiFetches.get(dedupKey);
        if (!networkFetchPromise) {
          // Use a detached URL fetch so component unmounts or duplicate polls never abort the request mid-flight
          networkFetchPromise = fetch(url.toString(), {
            method: 'GET',
            headers: { Accept: 'application/json' },
            cache: 'no-store'
          })
            .then(async (networkResponse) => {
              if (networkResponse && networkResponse.ok) {
                wasOffline = false;
                const cloneForCache = networkResponse.clone();
                const cloneForBroadcast = networkResponse.clone();
                await cache.put(normalizedKey, cloneForCache);
                try {
                  const jsonPayload = await cloneForBroadcast.json();
                  await notifyClientsOfRevalidation(url.pathname, jsonPayload, 'STALE-WHILE-REVALIDATE');
                } catch (e) {}
              }
              return networkResponse;
            })
            .catch(() => {
              wasOffline = true;
              return null;
            })
            .finally(() => {
              inFlightApiFetches.delete(dedupKey);
            });
          inFlightApiFetches.set(dedupKey, networkFetchPromise);
        }

        event.waitUntil(networkFetchPromise);

        // Serve cached response immediately if available while revalidating in background
        if (cachedResponse) {
          const headers = new Headers(cachedResponse.headers);
          headers.set('X-SW-Cache', 'STALE-WHILE-REVALIDATE');
          return new Response(cachedResponse.body, {
            status: cachedResponse.status,
            statusText: cachedResponse.statusText,
            headers
          });
        }

        // No cached response yet: await network fetch and clone for caller
        const freshResponse = await networkFetchPromise;
        if (freshResponse) {
          return freshResponse.clone();
        }

        return new Response(
          JSON.stringify({ success: false, offline: true, message: 'Offline and no cached API snapshot available' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      })()
    );
    return;
  }

  // D1. Immutable Content-Addressed Media (/api/upload?id=...): Strict Cache-First with In-Flight Deduplication
  // Canonicalizes by `id` (stripping any legacy ?t= params) and uses a detached fetch so React re-renders
  // never abort an in-flight download (eliminating `GET --- /api/upload` in Vercel logs).
  if (url.pathname === '/api/upload') {
    event.respondWith(
      (async () => {
        const fileId = url.searchParams.get('id') || url.searchParams.get('fileId') || '';
        const canonicalUrl = fileId
          ? `${self.location.origin}/api/upload?id=${encodeURIComponent(fileId)}`
          : url.toString();
        const cacheKeyReq = new Request(canonicalUrl, { method: 'GET' });

        const cache = await caches.open(STATIC_CACHE_NAME);
        const cachedResponse = await cache.match(cacheKeyReq);
        if (cachedResponse) {
          return cachedResponse;
        }

        let mediaPromise = inFlightMediaFetches.get(canonicalUrl);
        if (!mediaPromise) {
          mediaPromise = fetch(canonicalUrl, { method: 'GET' })
            .then(async (networkResponse) => {
              if (networkResponse && networkResponse.ok) {
                try {
                  await cache.put(cacheKeyReq, networkResponse.clone());
                } catch (e) {}
              }
              return networkResponse;
            })
            .catch(() => null)
            .finally(() => {
              inFlightMediaFetches.delete(canonicalUrl);
            });
          inFlightMediaFetches.set(canonicalUrl, mediaPromise);
        }

        event.waitUntil(mediaPromise);

        const resolvedResponse = await mediaPromise;
        if (resolvedResponse) {
          return resolvedResponse.clone();
        }
        return new Response('', { status: 404, statusText: 'Offline Media Not Found' });
      })()
    );
    return;
  }

  // D2. Static Assets (/uploads/*, /images/*, fonts, styles, scripts): Stale-While-Revalidate
  const isStaticOrMedia =
    isGoogleFonts ||
    url.pathname.startsWith('/uploads/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/assets/') ||
    /\.(?:js|css|png|jpg|jpeg|webp|gif|svg|ico|woff|woff2|ttf|sql)$/i.test(url.pathname);

  if (isStaticOrMedia) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE_NAME);
        const cachedResponse = await cache.match(request);

        const networkPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
              const contentType = (networkResponse.headers.get('content-type') || '').toLowerCase();
              // Never cache HTML fallback responses as JS/CSS/media assets
              if (!contentType.includes('text/html')) {
                cache.put(request, networkResponse.clone());
              }
            }
            return networkResponse;
          })
          .catch(() => null);

        if (cachedResponse) {
          const cachedType = (cachedResponse.headers.get('content-type') || '').toLowerCase();
          if (!cachedType.includes('text/html')) {
            event.waitUntil(networkPromise);
            return cachedResponse;
          }
        }

        const freshResponse = await networkPromise;
        if (freshResponse) return freshResponse;

        return new Response('', { status: 404, statusText: 'Offline Asset Not Found' });
      })()
    );
    return;
  }

  // E. HTML Navigation Requests: Always Network-First so refreshes never serve stale/untransformed HTML
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CORE_CACHE_NAME);
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            const contentType = (networkResponse.headers.get('content-type') || '').toLowerCase();
            if (contentType.includes('text/html')) {
              cache.put('/index.html', networkResponse.clone());
            }
          }
          return networkResponse;
        } catch (err) {
          const cachedShell = (await cache.match('/index.html')) || (await cache.match('/'));
          if (cachedShell) {
            return cachedShell;
          }
          return new Response('Offline - Pengadilan Militer Tinggi V Makassar', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        }
      })()
    );
  }
});
