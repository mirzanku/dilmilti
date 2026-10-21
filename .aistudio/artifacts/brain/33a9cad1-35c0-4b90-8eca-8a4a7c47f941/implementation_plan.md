# Rencana Perbaikan Sinkronisasi Antar Perangkat

Masalah: Perubahan identitas (logo/banner) pada perangkat admin tidak segera tercermin pada perangkat klien meskipun sudah tersambung dan dilakukan hard refresh setelah lebih dari 5 menit.

## Analisis Masalah:
- Perangkat klien menunjukkan status "Tersambung" namun tidak mendapatkan pembaruan data `court_identity`.
- Log server menunjukkan sinkronisasi data terjadi.
- Mekanisme sinkronisasi saat ini mengandalkan `setInterval` (120 detik) dan peristiwa `focus`/`visibilitychange` untuk memicu `checkServerVersionAndUpdate`.

## Rencana Perbaikan:
1.  **Optimasi BroadcastChannel**: Memastikan pesan `DB_UPDATED` benar-benar dikirim dari server/worker ke *client* saat pembaruan identitas terjadi, sehingga perangkat klien mendapatkan notifikasi *real-time* untuk melakukan *pull* ulang tanpa menunggu *polling* 2 menit.
2.  **Pemaksaan Verifikasi Versi (Force Version Check)**: Meningkatkan sensitivitas `checkServerVersionAndUpdate` pada perangkat klien untuk memastikan bahwa saat terjadi sinkronisasi basis data, versi lokal benar-benar disinkronkan dengan versi terbaru di server, meskipun versi server yang terdeteksi secara lokal mungkin tampak sama karena masalah *caching* pada respons API `GET /api/court-db/version`.
3.  **Audit `syncManager`**: Memastikan `syncManager` tidak memblokir *pull* data identitas karena dianggap sebagai pembaruan "prioritas rendah".

Kami akan melakukan audit dan perbaikan pada logika `checkServerVersionAndUpdate` serta mekanisme *broadcast* pembaruan data agar sinkronisasi antar perangkat lebih responsif.
