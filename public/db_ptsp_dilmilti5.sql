-- ==============================================================================
-- SKEMA DATABASE MYSQL: db_ptsp_dilmilti5
-- PORTAL PELAYANAN TERPADU SATU PINTU (PTSP) ELEKTRONIK
-- PENGADILAN MILITER TINGGI V MAKASSAR
-- ==============================================================================
-- Kompatibel dengan: MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.4+ (XAMPP / Laragon)
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";

CREATE DATABASE IF NOT EXISTS `db_ptsp_dilmilti5` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_ptsp_dilmilti5`;

-- ------------------------------------------------------------------------------
-- 1. TABEL: ptsp_applications (Permohonan Layanan 6 Meja PTSP & Berkas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ptsp_applications` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `ticket_no` VARCHAR(64) NOT NULL UNIQUE,
  `meja_id` INT NOT NULL DEFAULT 1,
  `meja_nama` VARCHAR(150) NOT NULL,
  `jenis_layanan` VARCHAR(200) NOT NULL,
  `kategori_pemohon` VARCHAR(100) NOT NULL,
  `nama_pemohon` VARCHAR(150) NOT NULL,
  `nrp_nip_nik` VARCHAR(64) NOT NULL,
  `pangkat_golongan` VARCHAR(100) DEFAULT '-',
  `kesatuan_instansi` VARCHAR(150) NOT NULL,
  `no_wa` VARCHAR(40) NOT NULL,
  `email` VARCHAR(150) DEFAULT '-',
  `nomor_perkara` VARCHAR(120) DEFAULT '-',
  `uraian_permohonan` TEXT NOT NULL,
  `berkas_nama` VARCHAR(255) DEFAULT NULL,
  `berkas_url` LONGTEXT DEFAULT NULL,
  `status` VARCHAR(60) NOT NULL DEFAULT 'Diajukan',
  `tahap_verifikasi` INT NOT NULL DEFAULT 1,
  `catatan_petugas` TEXT DEFAULT NULL,
  `petugas_verifikator` VARCHAR(150) DEFAULT NULL,
  `reply_doc_id` VARCHAR(64) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `ptsp_applications` (`id`, `ticket_no`, `meja_id`, `meja_nama`, `jenis_layanan`, `kategori_pemohon`, `nama_pemohon`, `nrp_nip_nik`, `pangkat_golongan`, `kesatuan_instansi`, `no_wa`, `email`, `nomor_perkara`, `uraian_permohonan`, `berkas_nama`, `status`, `tahap_verifikasi`, `catatan_petugas`, `petugas_verifikator`, `reply_doc_id`) VALUES
('app-101', 'PTSP-20260925-0101', 1, 'Meja 1: Kepaniteraan Pidana Militer', 'Permohonan Salinan Resmi Putusan Banding & Memori', 'Oditur Militer', 'Mayor Chk Rahmat Hidayat, S.H.', '11040021980579', 'Mayor Chk', 'Oditurat Militer Tinggi IV Makassar', '081241008899', 'rahmat.oditur@tni.mil.id', '24-K/PMT.V/BDG/AD/VIII/2026', 'Permohonan salinan resmi putusan banding yang telah berkekuatan hukum tetap (BHT) untuk pelaksanaan eksekusi.', 'Surat_Permohonan_Otmilti_24K.pdf', 'Selesai', 4, 'Berkas lengkap, salinan putusan telah ditandatangani secara elektronik (TTE BSrE) oleh Panitera.', 'Letkol Chk S. Haryanto, S.H., M.H.', 'rep-101'),
('app-102', 'PTSP-20260926-0102', 2, 'Meja 2: Kepaniteraan Hukum', 'Surat Keterangan Tidak Pernah Dipidana (SKTPD)', 'Prajurit TNI', 'Kapten Inf Andi Baso Pallawa, S.T.Han.', '11120014520889', 'Kapten Inf', 'Kodam XIV/Hasanuddin', '081355667788', 'andibaso.kodam14@tni.mil.id', '-', 'Pengajuan Surat Keterangan Tidak Pernah Dijatuhi Hukuman Pidana Militer sebagai syarat seleksi Dikreg Seskoad TA 2026.', 'Pengantar_Dansat_Seskoad_AndiBaso.pdf', 'Selesai', 4, 'Telah diverifikasi pada buku register induk perkara pidana militer. Dokumen SKTPD ber-TTE siap diunduh.', 'Mayor Chk Hendra Wijaya, S.H.', 'rep-102'),
('app-103', 'PTSP-20260927-0103', 6, 'Meja 6: Informasi, Pengaduan & Posbakum', 'Permohonan Informasi Publik (PPID) & Konsultasi Posbakum', 'Penasihat Hukum', 'Dr. Muh. Ilham Arifin, S.H., M.H.', '7371120908820003', 'Advokat / Penasihat Hukum', 'LBH Peradilan Militer Indonesia Timur', '081144223344', 'ilham.lawfirm@gmail.com', '27-K/PMT.V/BDG/AL/IX/2026', 'Permohonan jadwal pembacaan putusan sela dan konsultasi prosedur pengajuan kontra memori banding secara elektronik.', 'Surat_Kuasa_Khusus_27K.pdf', 'Sedang Diproses', 3, 'Sedang dikoordinasikan dengan Panitera Pengganti perkara Nomor 27-K/PMT.V/BDG/AL/IX/2026.', 'Serka (K) Dewi Sartika', NULL);

-- ------------------------------------------------------------------------------
-- 2. TABEL: reply_documents (Dokumen Balasan Resmi Ber-TTE & QR Validasi)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reply_documents` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `ticket_no` VARCHAR(64) NOT NULL,
  `nomor_surat_balasan` VARCHAR(150) NOT NULL,
  `judul_dokumen` VARCHAR(255) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_url` LONGTEXT NOT NULL,
  `tte_signer_nama` VARCHAR(150) NOT NULL,
  `tte_signer_jabatan` VARCHAR(150) NOT NULL,
  `tte_qr_hash` VARCHAR(128) NOT NULL,
  `uploaded_by` VARCHAR(150) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reply_documents` (`id`, `ticket_no`, `nomor_surat_balasan`, `judul_dokumen`, `file_name`, `file_url`, `tte_signer_nama`, `tte_signer_jabatan`, `tte_qr_hash`, `uploaded_by`) VALUES
('rep-101', 'PTSP-20260925-0101', 'W5-Mil/142/HK.02.01/IX/2026', 'Salinan Resmi Petikan & Putusan Banding Perkara No. 24-K/PMT.V/BDG/AD/VIII/2026', 'Salinan_Putusan_TTE_24K_2026.pdf', 'TTE-GENERATED-DOC', 'Letkol Chk S. Haryanto, S.H., M.H.', 'Panitera Pengadilan Militer Tinggi V Makassar', 'BSRE-DILMILTI5-2026-99812A', 'Petugas Meja 1 Kepaniteraan Pidana'),
('rep-102', 'PTSP-20260926-0102', 'W5-Mil/158/SK.HK/IX/2026', 'Surat Keterangan Tidak Pernah Dijatuhi Pidana Militer (SKTPD) a.n. Kapten Inf Andi Baso Pallawa', 'SKTPD_TTE_Kapten_Andi_Baso_2026.pdf', 'TTE-GENERATED-DOC', 'Brigadir Jenderal TNI Faridah Hastuti, S.H., M.H.', 'Kepala Pengadilan Militer Tinggi V Makassar', 'BSRE-DILMILTI5-2026-77431B', 'Petugas Meja 2 Kepaniteraan Hukum');

-- ------------------------------------------------------------------------------
-- 3. TABEL: queue_tickets (Antrean Digital 6 Meja Loket PTSP & Pemanggil TTS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `queue_tickets` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `nomor_antrean` VARCHAR(20) NOT NULL,
  `kode_loket` VARCHAR(10) NOT NULL,
  `meja_id` INT NOT NULL,
  `meja_nama` VARCHAR(150) NOT NULL,
  `nama_pemohon` VARCHAR(150) NOT NULL,
  `kategori_pemohon` VARCHAR(100) DEFAULT 'Umum / Prajurit TNI',
  `kesatuan_instansi` VARCHAR(150) DEFAULT '-',
  `no_wa` VARCHAR(40) DEFAULT '-',
  `keperluan` VARCHAR(255) NOT NULL,
  `waktu_ambil` VARCHAR(40) NOT NULL,
  `estimasi_panggil` VARCHAR(40) NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'Menunggu',
  `loket_tujuan` VARCHAR(100) NOT NULL,
  `petugas_panggil` VARCHAR(150) DEFAULT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `queue_tickets` (`id`, `nomor_antrean`, `kode_loket`, `meja_id`, `meja_nama`, `nama_pemohon`, `kategori_pemohon`, `kesatuan_instansi`, `no_wa`, `keperluan`, `waktu_ambil`, `estimasi_panggil`, `status`, `loket_tujuan`, `petugas_panggil`) VALUES
('q-1', 'A-001', 'A', 1, 'Meja 1: Kepaniteraan Pidana Militer', 'Mayor Chk Rahmat Hidayat, S.H.', 'Oditur Militer', 'Otmilti IV Makassar', '081241008899', 'Penyerahan Memori Banding Perkara Pidana Militer', '08:15 WITA', '08:20 WITA', 'Dipanggil', 'Loket Meja 1 (Kepaniteraan Pidana)', 'Pelda Andi Mappanyukki'),
('q-2', 'B-001', 'B', 2, 'Meja 2: Kepaniteraan Hukum', 'Kapten Inf Andi Baso Pallawa', 'Prajurit TNI', 'Kodam XIV/Hasanuddin', '081355667788', 'Legalisasi & Pengambilan SK Tidak Pernah Dipidana', '08:22 WITA', '08:30 WITA', 'Menunggu', 'Loket Meja 2 (Kepaniteraan Hukum)', NULL),
('q-3', 'F-001', 'F', 6, 'Meja 6: Informasi, Pengaduan & Posbakum', 'Ny. Siti Rahmawati', 'Masyarakat Umum', 'Keluarga Prajurit Makassar', '085299887766', 'Konsultasi Hukum Gratis Posbakum & Prosedur Izin Besuk', '08:30 WITA', '08:40 WITA', 'Menunggu', 'Loket Meja 6 (Informasi & Posbakum)', NULL);

-- ------------------------------------------------------------------------------
-- 4. TABEL: online_consultations (Jadwal & Ruang Konsultasi Video Call / Chat)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `online_consultations` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `room_code` VARCHAR(64) NOT NULL UNIQUE,
  `meja_id` INT NOT NULL DEFAULT 6,
  `meja_nama` VARCHAR(150) NOT NULL,
  `topik_konsultasi` VARCHAR(255) NOT NULL,
  `nama_pemohon` VARCHAR(150) NOT NULL,
  `nrp_nip_nik` VARCHAR(64) DEFAULT '-',
  `kesatuan_instansi` VARCHAR(150) DEFAULT '-',
  `no_wa` VARCHAR(40) NOT NULL,
  `jadwal_tanggal` VARCHAR(40) NOT NULL,
  `jadwal_jam` VARCHAR(40) NOT NULL,
  `status_ruang` VARCHAR(50) NOT NULL DEFAULT 'Aktif Berlangsung',
  `nama_petugas` VARCHAR(150) DEFAULT 'Petugas Jaga PTSP',
  `notulensi_ringkasan` TEXT DEFAULT NULL,
  `notulensi_rekomendasi` TEXT DEFAULT NULL,
  `notulensi_signed` TINYINT(1) NOT NULL DEFAULT 0,
  `notulensi_signed_at` VARCHAR(60) DEFAULT NULL,
  `notulensi_qr_hash` VARCHAR(128) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `online_consultations` (`id`, `room_code`, `meja_id`, `meja_nama`, `topik_konsultasi`, `nama_pemohon`, `nrp_nip_nik`, `kesatuan_instansi`, `no_wa`, `jadwal_tanggal`, `jadwal_jam`, `status_ruang`, `nama_petugas`, `notulensi_ringkasan`, `notulensi_rekomendasi`, `notulensi_signed`, `notulensi_signed_at`, `notulensi_qr_hash`) VALUES
('cons-1', 'V-PTSP-101', 1, 'Meja 1: Kepaniteraan Pidana Militer', 'Konsultasi Prosedur Pengajuan Memori Kasasi & Pemeriksaan Berkas (Inzage)', 'Lettu Laut (KH) Budi Santoso, S.H.', '12140099880190', 'Diskum Kodaeral VI Makassar', '081233445566', '2026-09-27', '09:00 WITA', 'Aktif Berlangsung', 'Letkol Chk S. Haryanto, S.H., M.H.', 'Pemohon berkonsultasi mengenai tenggang waktu penyerahan memori kasasi setelah akta permohonan kasasi ditandatangani di kepaniteraan.', 'Memori kasasi wajib diserahkan paling lambat 14 (empat belas) hari sejak pernyataan kasasi diajukan sesuai UU No. 31 Tahun 1997.', 1, '2026-09-27 09:25 WITA', 'BA-VPTSP101-BSRE-2026'),
('cons-2', 'V-PTSP-102', 6, 'Meja 6: Informasi, Pengaduan & Posbakum', 'Konsultasi Hukum Gratis Posbakum & Hak Bantuan Hukum Prajurit', 'Serda Inf Muh. Akbar', '21190044550399', 'Yonif 700/Wira Yudha Cakti', '085344556677', '2026-09-27', '10:30 WITA', 'Menunggu Petugas', 'Adv. Nurul Huda, S.H., M.H. (Posbakum)', NULL, NULL, 0, NULL, NULL);

-- ------------------------------------------------------------------------------
-- 5. TABEL: ptsp_room_streams (Sinkronisasi Video Streaming 2 Arah HTTP/WebRTC)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ptsp_room_streams` (
  `room_code` VARCHAR(64) NOT NULL PRIMARY KEY,
  `caller_frame` LONGTEXT DEFAULT NULL,
  `caller_mic_on` TINYINT(1) DEFAULT 1,
  `caller_cam_on` TINYINT(1) DEFAULT 1,
  `caller_updated_at` BIGINT DEFAULT 0,
  `officer_frame` LONGTEXT DEFAULT NULL,
  `officer_mic_on` TINYINT(1) DEFAULT 1,
  `officer_cam_on` TINYINT(1) DEFAULT 1,
  `officer_updated_at` BIGINT DEFAULT 0,
  `webrtc_signal_json` LONGTEXT DEFAULT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABEL: ptsp_room_chats (Riwayat Chat Real-Time Permanen Pemohon & Petugas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ptsp_room_chats` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `room_code` VARCHAR(64) NOT NULL,
  `sender_role` ENUM('pemohon', 'petugas', 'sistem') NOT NULL,
  `sender_name` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `timestamp` VARCHAR(40) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `ptsp_room_chats` (`id`, `room_code`, `sender_role`, `sender_name`, `message`, `timestamp`) VALUES
('chat-1', 'V-PTSP-101', 'sistem', 'Sistem e-PTSP Dilmilti V', 'Ruang Konsultasi Virtual V-PTSP-101 telah aktif. Sinkronisasi Video & Chat dienkripsi secara aman.', '09:00 WITA'),
('chat-2', 'V-PTSP-101', 'petugas', 'Letkol Chk S. Haryanto, S.H. (Petugas Meja 1)', 'Selamat pagi Lettu Budi Santoso, selamat datang di Ruang Konsultasi Virtual PTSP Pengadilan Militer Tinggi V Makassar. Silakan sampaikan hal yang ingin dikonsultasikan.', '09:01 WITA'),
('chat-3', 'V-PTSP-101', 'pemohon', 'Lettu Laut (KH) Budi Santoso, S.H.', 'Selamat pagi Pak Panitera. Izin mengonfirmasi kelengkapan berkas pengajuan memori kasasi dan jadwal pelaksanaan inzage berkas perkara tingkat banding.', '09:02 WITA');

-- ------------------------------------------------------------------------------
-- 7. TABEL: tbl_users (Akun Multi-Role: Super Admin, Petugas 6 Meja, Pejabat)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `nama_lengkap` VARCHAR(150) NOT NULL,
  `nip_nrp` VARCHAR(64) NOT NULL,
  `pangkat_gol` VARCHAR(100) NOT NULL,
  `role` ENUM('super_admin', 'petugas_meja', 'pejabat_struktural') NOT NULL DEFAULT 'petugas_meja',
  `meja_assigned` INT DEFAULT 0,
  `jabatan` VARCHAR(150) NOT NULL,
  `no_wa` VARCHAR(40) DEFAULT '-',
  `status_aktif` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tbl_users` (`id`, `username`, `nama_lengkap`, `nip_nrp`, `pangkat_gol`, `role`, `meja_assigned`, `jabatan`, `no_wa`, `status_aktif`) VALUES
('u-1', 'superadmin', 'Kolonel Chk Sultan, S.H.', '11980017760771', 'Kolonel Chk', 'super_admin', 0, 'Super Admin & Koordinator Pengawas PTSP', '08114441010', 1),
('u-2', 'petugas_meja1', 'Pelda Andi Mappanyukki', '21040219880384', 'Pelda', 'petugas_meja', 1, 'Petugas Meja 1 Kepaniteraan Pidana Militer', '08124445501', 1),
('u-3', 'petugas_meja2', 'Serma (K) Fitriani, S.H.', '21080112230988', 'Serma (K)', 'petugas_meja', 2, 'Petugas Meja 2 Kepaniteraan Hukum', '08124445502', 1),
('u-4', 'petugas_meja3', 'Penata Muda Tk.I Muh. Ruslan, S.E.', '198604122011011004', 'Penata Muda Tk.I (III/b)', 'petugas_meja', 3, 'Petugas Meja 3 Kesekretariatan / Umum & Keuangan', '08124445503', 1),
('u-5', 'petugas_meja4', 'Penata Muda Nurul Hidayah, S.Psi.', '199007182015032002', 'Penata Muda (III/a)', 'petugas_meja', 4, 'Petugas Meja 4 Kepegawaian, Organisasi & Tata Laksana', '08124445504', 1),
('u-6', 'petugas_meja5', 'Lettu Chk Arif Rahman, S.Kom., S.H.', '11160033440593', 'Lettu Chk', 'petugas_meja', 5, 'Petugas Meja 5 Perencanaan, TI & Pelaporan (PTIP)', '08124445505', 1),
('u-7', 'petugas_meja6', 'Serka (K) Dewi Sartika, S.H.', '21130088770494', 'Serka (K)', 'petugas_meja', 6, 'Petugas Meja 6 Informasi, Pengaduan & Posbakum', '08124445506', 1),
('u-8', 'pejabat_panitera', 'Letkol Chk S. Haryanto, S.H., M.H.', '11020023410882', 'Letkol Chk', 'pejabat_struktural', 0, 'Panitera Pengadilan Militer Tinggi V Makassar', '08124445566', 1);

-- ------------------------------------------------------------------------------
-- 8. TABEL: tbl_satker (Data Master Satuan Kerja Jajaran Wilayah Hukum)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_satker` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `kode_satker` VARCHAR(30) NOT NULL,
  `nama_satker` VARCHAR(200) NOT NULL,
  `tingkat` VARCHAR(80) NOT NULL,
  `wilayah_hukum` TEXT NOT NULL,
  `alamat` TEXT NOT NULL,
  `telepon` VARCHAR(80) DEFAULT '-',
  `kepala_satker` VARCHAR(150) DEFAULT '-',
  `status_koneksi` VARCHAR(40) DEFAULT 'Terhubung Online'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tbl_satker` (`id`, `kode_satker`, `nama_satker`, `tingkat`, `wilayah_hukum`, `alamat`, `telepon`, `kepala_satker`, `status_koneksi`) VALUES
('sat-1', '401988', 'Pengadilan Militer Tinggi V Makassar', 'Tingkat Banding (Induk)', 'Sulawesi, Maluku, Maluku Utara, Papua, Papua Barat', 'Jl. Urip Sumoharjo KM. 7 No. 73 Makassar', '(0411) 441234', 'Brigjen TNI Faridah Hastuti, S.H., M.H.', 'Server Utama Aktif'),
('sat-2', '663112', 'Pengadilan Militer III-16 Makassar', 'Tingkat Pertama', 'Sulawesi Selatan, Sulawesi Barat, Sulawesi Tenggara', 'Jl. Urip Sumoharjo KM. 7 Makassar', '(0411) 442345', 'Kolonel Chk Muhammad Saleh, S.H., M.H.', 'Terhubung Online'),
('sat-3', '663129', 'Pengadilan Militer III-17 Manado', 'Tingkat Pertama', 'Sulawesi Utara, Sulawesi Tengah, Gorontalo', 'Jl. Raya Manado - Bitung, Minahasa Utara, Sulut', '(0431) 881234', 'Letkol Chk Dedi Setiawan, S.H., M.H.', 'Terhubung Online'),
('sat-4', '663133', 'Pengadilan Militer III-18 Ambon', 'Tingkat Pertama', 'Provinsi Maluku dan Maluku Utara', 'Jl. Dr. Malaihollo Air Salobar, Nusaniwe, Kota Ambon', '(0911) 341567', 'Letkol Laut (H) Hendro Wibowo, S.H.', 'Terhubung Online'),
('sat-5', '663140', 'Pengadilan Militer III-19 Jayapura', 'Tingkat Pertama', 'Seluruh Provinsi di Tanah Papua', 'Jl. Sam Ratulangi No. 19 Dok V Atas, Kota Jayapura', '(0967) 532198', 'Kolonel Chk Kurniawan, S.H., M.H.', 'Terhubung Online');

-- ------------------------------------------------------------------------------
-- 9. TABEL: tbl_pejabat (Data Master Pejabat Struktural & Hakim Militer Tinggi)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tbl_pejabat` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `urutan` INT NOT NULL DEFAULT 1,
  `nama_pejabat` VARCHAR(150) NOT NULL,
  `pangkat_korps` VARCHAR(100) NOT NULL,
  `nrp_nip` VARCHAR(64) NOT NULL,
  `jabatan` VARCHAR(150) NOT NULL,
  `kategori` VARCHAR(80) NOT NULL,
  `matra` VARCHAR(40) NOT NULL DEFAULT 'TNI AD',
  `status_kehadiran` VARCHAR(60) NOT NULL DEFAULT 'Siap Dinas (Di Kantor)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tbl_pejabat` (`id`, `urutan`, `nama_pejabat`, `pangkat_korps`, `nrp_nip`, `jabatan`, `kategori`, `matra`, `status_kehadiran`) VALUES
('pej-1', 1, 'Brigadir Jenderal TNI Faridah Hastuti, S.H., M.H.', 'Brigadir Jenderal TNI', '11930001230471', 'Kepala Pengadilan Militer Tinggi V Makassar', 'Pimpinan', 'TNI AD', 'Siap Dinas (Di Kantor)'),
('pej-2', 2, 'Kolonel Chk Sultan, S.H.', 'Kolonel Chk', '11980017760771', 'Wakil Kepala Pengadilan Militer Tinggi V Makassar', 'Pimpinan', 'TNI AD', 'Siap Dinas (Di Kantor)'),
('pej-3', 3, 'Kolonel Chk Sugeng Aryanto, S.H., M.H.', 'Kolonel Chk', '11980018880872', 'Hakim Militer Tinggi Utama', 'Hakim Militer Tinggi', 'TNI AD', 'Sidang Majelis (Ruang Kartika)'),
('pej-4', 4, 'Kolonel Laut (H) Dr. R. Subagyo, S.H., M.H.', 'Kolonel Laut (H)', '12990023410975', 'Hakim Militer Tinggi & Pengawas PTSP', 'Hakim Militer Tinggi', 'TNI AL', 'Siap Dinas (Di Kantor)'),
('pej-5', 5, 'Kolonel Sus H. Bambang Wirawan, S.H., M.H.', 'Kolonel Sus', '524412', 'Hakim Militer Tinggi', 'Hakim Militer Tinggi', 'TNI AU', 'Siap Dinas (Di Kantor)'),
('pej-6', 6, 'Letkol Chk S. Haryanto, S.H., M.H.', 'Letkol Chk', '11020023410882', 'Panitera', 'Kepaniteraan', 'TNI AD', 'Siap Dinas (Di Kantor)'),
('pej-7', 7, 'Dra. Hj. Andi Nurmiah, M.H.', 'Pembina Utama Muda (IV/c)', '197805122003121002', 'Sekretaris', 'Kesekretariatan', 'ASN MA-RI', 'Siap Dinas (Di Kantor)');

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
