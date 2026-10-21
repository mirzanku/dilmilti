# Rencana Audit & Perbaikan Sinkronisasi Data Identitas

Tujuan: Mengatasi masalah di mana logo dan banner yang diunggah pengguna kembali ke default setelah beberapa menit akibat sinkronisasi otomatis dari server.

## Audit yang akan dilakukan:
1.  **Analisis Database (CourtDB)**: Memastikan bahwa logika `updateCourtIdentity` di `src/data/courtDatabase.ts` benar-benar memprioritaskan data lokal dan tidak terpengaruh oleh *payload* yang tidak lengkap dari server.
2.  **Mekanisme Sync/Pull**: Memeriksa apakah `fetchFromCentralServer` atau `checkServerVersionAndUpdate` di `src/data/courtDatabase.ts` melakukan penimpaan (*overwrite*) penuh pada objek `court_identity` alih-alih melakukan *merge* (penggabungan) properti secara selektif.
3.  **Audit Worker SyncManager**: Memastikan bahwa *worker* tidak memiliki logika *fallback* yang memaksa kembali ke *seed* data awal saat sinkronisasi.

## Langkah Perbaikan:
1.  **Penguatan Smart Merge**: Memastikan fungsi `applyWorkerSerializedArtifacts` (atau fungsi *merge* terkait di `courtDatabase.ts`) di masa depan akan secara eksplisit memproteksi `logoUrl` dan `bannerUrl` jika sudah ada kustomisasi lokal.
2.  **Pembaruan Status Penulisan**: Menambahkan logika verifikasi pada sinkronisasi server untuk memeriksa apakah nilai yang akan ditimpa adalah URL gambar kustom sebelum menerapkan perubahan dari server.
3.  **Verifikasi Cache**: Memastikan `getFreshImageUrl` bekerja optimal dengan *timestamp* yang dihasilkan setelah proses penyimpanan sukses.

Kami akan melakukan audit kode dan menerapkan perbaikan pada logika penggabungan data.
