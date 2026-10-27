# Audit & Perbaikan Penyimpanan, Caching Vercel, dan Koneksi MongoDB Serverless

## Ringkasan Masalah & Solusi

### 1. Masalah Tampilan/UI Tidak Terupdate di Perangkat Lain (Caching Vercel & PWA)
- **Akar Masalah**:
  - `vercel.json` sebelumnya belum memiliki konfigurasi `headers`, sehingga Vercel Edge Cache / CDN menyimpan respons HTML dan rute API secara agresif.
  - Service Worker (`sw.js`) dan cache shell `index.html` masih menggunakan versi lama (`v7`) yang mempertahankan aset atau snapshot cache lokal lama di browser pengguna lain.
- **Perbaikan yang Diterapkan**:
  - Menambahkan konfigurasi `headers` di `vercel.json` dengan `Cache-Control: public, max-age=0, must-revalidate` untuk semua rute HTML (`/(.*)` dan `/index.html`), serta `no-cache, no-store, must-revalidate` untuk `/sw.js` dan `/api/(.*)`.
  - Menaikkan versi Service Worker ke `v8` (`public/sw.js`), memperbarui auto-purge cache usang di `index.html` dan `src/utils/serviceWorkerRegistration.ts` agar cache `v7` atau yang lebih lama otomatis dihapus dari memori browser klien.
  - Memastikan permintaan `_t` (cache-bust) dan `priority=network-first` pada API (`/api/court-db`) selalu melewati (*bypass*) in-memory TTL serverless dan langsung mengambil versi terbaru dari database MongoDB Atlas.

### 2. Masalah CRUD Gagal / Tidak Sinkron di Arsitektur Serverless (MongoDB di Vercel)
- **Akar Masalah**:
  - Pada Vercel Serverless Functions, container API (`/api/court-db.ts` dan `/api/upload.ts`) hidup dan mati secara dinamis. Jika koneksi Mongoose tidak disimpan pada objek `globalThis` yang tepat atau mencoba membuka koneksi baru di setiap *invocation*, terjadi *connection leak*, *pool exhaustion*, atau timeout.
  - Pada rute `POST /api/court-db`, versi server (`serverVer`) sebelumnya tidak selalu dinaikkan secara pasti saat sinkronisasi penuh (`clientVer` vs `serverVer`), menyebabkan versi tidak bertambah dan perangkat klien lain menganggap data belum berubah.
- **Perbaikan yang Diterapkan**:
  - Mengimplementasikan pola koneksi `globalThis.mongoose` yang direkomendasikan untuk Vercel Serverless (`let cached = globalThis.mongoose; if (!cached) cached = globalThis.mongoose = { conn: null, promise: null };`) pada `/api/court-db.ts` dan `/api/upload.ts`.
  - Mengatur parameter koneksi Mongoose yang optimal untuk serverless: `bufferCommands: false`, `serverSelectionTimeoutMS: 7000`, `connectTimeoutMS: 7000`, `maxPoolSize: 3`, `minPoolSize: 0`, `maxIdleTimeMS: 30000`.
  - Memastikan `dbState.version = Math.max(serverVer + 1, clientVer + 1)` di setiap penyimpanan POST, sehingga versi database pusat selalu bertambah dan memicu deteksi versi baru di seluruh perangkat lain.
  - Memastikan *state* lokal React dan `localStorage` langsung terbarui secara *optimistic* dan memicu *event* broadcast `dilmilti_db_updated` seketika saat operasi CRUD selesai.
