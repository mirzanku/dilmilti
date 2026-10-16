import { CourtDB } from '../data/courtDatabase';

export function requestServiceWorkerHighPrioritySync(section: string = 'jadwal-sidang'): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }
  try {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'FETCH_HIGH_PRIORITY_SECTION',
        section
      });
    }
  } catch {
    // Ignore postMessage errors if SW is not active yet
  }
}

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Immediately purge any legacy pre-v7 or Workbox caches so stale HTML shells never block page refresh
  if ('caches' in window) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          if (
            key.startsWith('workbox-') ||
            key.startsWith('ptsp-dilmilti5-') ||
            (key.startsWith('dilmilti5-') && !key.endsWith('-v7'))
          ) {
            caches.delete(key);
          }
        });
      })
      .catch(() => {});
  }

  // In Vite development mode, unregister any existing Service Worker so Vite HMR & @react-refresh preamble are never intercepted
  if ((import.meta as any).env?.DEV) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      })
      .catch(() => {});
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      registration.update().catch(() => {});

      // Check for service worker updates periodically
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            installingWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    } catch (err) {
      console.warn('[SW Registration] Service worker registration skipped:', err);
    }
  });

  // Notify Service Worker when device goes offline
  window.addEventListener('offline', () => {
    try {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'NETWORK_OFFLINE' });
      }
    } catch {}
  });

  // Trigger Network-First high-priority sync immediately when connection is restored after offline period
  window.addEventListener('online', () => {
    try {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'NETWORK_RECONNECTED',
          section: 'jadwal-sidang'
        });
      }
    } catch {}
    CourtDB.fetchHighPrioritySection('jadwal-sidang');
  });

  // Listen for background Stale-While-Revalidate & Network-First completion messages from sw.js
  navigator.serviceWorker.addEventListener('message', (event) => {
    const data = event.data;
    if (data && data.type === 'SW_API_REVALIDATED' && data.url === '/api/court-db' && data.payload) {
      CourtDB.applyBackgroundRevalidatedPayload(data.payload);
    }
  });
}
