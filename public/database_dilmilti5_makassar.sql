-- ==============================================================================
-- DATABASE SQL SCHEMA & INITIAL SEED DATA
-- PORTAL RESMI PENGADILAN MILITER TINGGI V MAKASSAR
-- STANDAR KUALITAS & STABILITAS DATA: MAHKAMAH AGUNG RI (PERMA 1/2017 & SK 593/2026)
-- GENERATED: 2026-09-21
-- TARGET ENGINE: MySQL 8.0+ / MariaDB 10.5+ / PostgreSQL (ANSI Standard Compliant)
-- CHARACTER SET: utf8mb4 / COLLATE: utf8mb4_unicode_ci
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";

CREATE DATABASE IF NOT EXISTS `dilmilti5_makassar_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dilmilti5_makassar_db`;

-- --------------------------------------------------------
-- 1. TABEL: users (Sistem Akun Pengelola & Hak Akses RBAC)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nama` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin_kepaniteraan', 'admin_kesekretariatan', 'editor_humas', 'petugas_ptsp', 'user_tamu') NOT NULL DEFAULT 'petugas_ptsp',
  `nip_nrp` VARCHAR(50) DEFAULT NULL,
  `instansi` VARCHAR(150) NOT NULL DEFAULT 'Pengadilan Militer Tinggi V Makassar',
  `nomor_wa` VARCHAR(30) DEFAULT NULL,
  `status` ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
  `avatar_url` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Akun Pengelola dan Hak Akses RBAC';

INSERT INTO `users` (`id`, `nama`, `email`, `password_hash`, `role`, `nip_nrp`, `instansi`, `nomor_wa`, `status`, `avatar_url`, `created_at`, `last_login`) VALUES
('usr-1', 'Super Admin Utama', 'admin@dilmilti5.go.id', '$2a$12$eImiTXuWVxfM37uY4JANjO5r0z5V2Xb4N4qM6iR1zG8rT1yV6X6nS', 'super_admin', '11980012340571', 'Pengadilan Militer Tinggi V Makassar', '08114441010', 'aktif', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', '2026-01-01 08:00:00', '2026-09-21 10:15:00'),
('usr-2', 'Panitera Dilmilti V', 'panitera@dilmilti5.go.id', '$2a$12$eImiTXuWVxfM37uY4JANjO5r0z5V2Xb4N4qM6iR1zG8rT1yV6X6nS', 'admin_kepaniteraan', '11020023410882', 'Kepaniteraan Dilmilti V Makassar', '08124445566', 'aktif', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', '2026-01-02 09:00:00', '2026-09-20 14:20:00'),
('usr-3', 'Sekretaris Dilmilti V', 'sekretaris@dilmilti5.go.id', '$2a$12$eImiTXuWVxfM37uY4JANjO5r0z5V2Xb4N4qM6iR1zG8rT1yV6X6nS', 'admin_kesekretariatan', '197805122003121002', 'Kesekretariatan Dilmilti V Makassar', '08135556677', 'aktif', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', '2026-01-02 09:30:00', '2026-09-19 11:10:00'),
('usr-4', 'Tim Humas & IT', 'humas@dilmilti5.go.id', '$2a$12$eImiTXuWVxfM37uY4JANjO5r0z5V2Xb4N4qM6iR1zG8rT1yV6X6nS', 'editor_humas', '198504102009121001', 'Subbag Hukum & Humas', '08118889900', 'aktif', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', '2026-01-03 10:00:00', '2026-09-21 08:30:00'),
('usr-5', 'Petugas PTSP Terpadu', 'ptsp@dilmilti5.go.id', '$2a$12$eImiTXuWVxfM37uY4JANjO5r0z5V2Xb4N4qM6iR1zG8rT1yV6X6nS', 'petugas_ptsp', '199208152018012003', 'Meja PTSP Taktis', '08129990011', 'aktif', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200', '2026-01-03 10:30:00', '2026-09-21 09:00:00');

-- --------------------------------------------------------
-- 2. TABEL: court_identity (Profil Satker, Indeks IKM & IPAK)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `court_identity`;
CREATE TABLE `court_identity` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_satker` VARCHAR(255) NOT NULL DEFAULT 'Pengadilan Militer Tinggi V Makassar',
  `alamat_lengkap` TEXT NOT NULL,
  `telepon` VARCHAR(100) DEFAULT NULL,
  `whatsapp` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `jam_operasional` VARCHAR(255) DEFAULT NULL,
  `yurisdiksi` TEXT DEFAULT NULL,
  `logo_url` TEXT DEFAULT NULL,
  `slogan` TEXT DEFAULT NULL,
  `ikm_skor` DECIMAL(4,2) NOT NULL DEFAULT 3.92,
  `ikm_predikat` VARCHAR(100) NOT NULL DEFAULT 'Sangat Baik (A)',
  `ikm_responden` INT NOT NULL DEFAULT 168,
  `ipak_skor` DECIMAL(4,2) NOT NULL DEFAULT 3.96,
  `ipak_predikat` VARCHAR(100) NOT NULL DEFAULT 'Bebas Korupsi (A)',
  `ipak_responden` INT NOT NULL DEFAULT 168,
  `survei_url` TEXT DEFAULT NULL,
  `sambutan_nama` VARCHAR(255) DEFAULT NULL,
  `sambutan_jabatan` VARCHAR(255) DEFAULT NULL,
  `sambutan_pangkat_nrp` VARCHAR(255) DEFAULT NULL,
  `sambutan_quote` TEXT DEFAULT NULL,
  `sambutan_paragraph1` TEXT DEFAULT NULL,
  `sambutan_paragraph2` TEXT DEFAULT NULL,
  `visi_text` TEXT DEFAULT NULL,
  `sejarah_intro` TEXT DEFAULT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Identitas Resmi Satker, Skor Survei IKM/IPAK & Visi Misi';

INSERT INTO `court_identity` (`id`, `nama_satker`, `alamat_lengkap`, `telepon`, `whatsapp`, `email`, `website`, `jam_operasional`, `yurisdiksi`, `logo_url`, `slogan`, `ikm_skor`, `ikm_predikat`, `ikm_responden`, `ipak_skor`, `ipak_predikat`, `ipak_responden`, `survei_url`, `sambutan_nama`, `sambutan_jabatan`, `sambutan_pangkat_nrp`, `sambutan_quote`, `sambutan_paragraph1`, `sambutan_paragraph2`, `visi_text`, `sejarah_intro`) VALUES
(1, 'Pengadilan Militer Tinggi V Makassar', 'Jl. Urip Sumoharjo No. 73, KM. 7, Panakkukang, Kota Makassar, Sulawesi Selatan 90232', '(0411) 441234 / 445678', '0811-4441-010', 'dilmilti5.makassar@mahkamahagung.go.id', 'https://dilmilti5-makassar.go.id', 'Senin - Kamis: 08:00 - 16:30 WITA | Jumat: 08:00 - 17:00 WITA', 'Wilayah Hukum Tingkat Banding Peradilan Militer Meliputi Provinsi Sulawesi Selatan, Sulawesi Barat, Sulawesi Tenggara, Sulawesi Tengah, Gorontalo, Sulawesi Utara, Maluku, Maluku Utara, Papua, dan Papua Barat.', '/images/logo_dilmilti.png', 'Mewujudkan Peradilan Militer yang Agung, Modern, Akuntabel, dan Transparan Demi Keadilan Prajurit TNI', 3.92, 'Sangat Baik (A)', 168, 3.96, 'Bebas Korupsi (A)', 168, 'https://survei.mahkamahagung.go.id/dilmilti5', 'Brigadir Jenderal TNI Faridah Hastuti, S.H., M.H.', 'Kepala Pengadilan Militer Tinggi V Makassar', 'Brigadir Jenderal TNI / NRP 11930001230471', 'Keadilan Militer yang Agung Ditegakkan dengan Kejujuran, Integritas, dan Dedikasi Tanpa Kompromi.', 'Selamat datang di Portal Informasi Resmi Pengadilan Militer Tinggi V Makassar. Kami berkomitmen menyajikan pelayanan peradilan militer yang transparan, profesional, ramah, dan berintegritas tinggi bagi seluruh anggota TNI dan masyarakat pencari keadilan.', 'Dengan dukungan e-Court Terpadu, SIPP, dan Pelayanan Terpadu Satu Pintu (PTSP) Taktis, kami memastikan keterbukaan informasi publik secara wajar dan akuntabel sesuai standar Mahkamah Agung RI.', 'Mewujudkan Pengadilan Militer Tinggi V Makassar yang Agung, Mandiri, Transparan, Akuntabel, dan Terpercaya.', 'Pengadilan Militer Tinggi V Makassar didirikan berdasarkan Peraturan Pemerintah dan Keputusan Panglima TNI sebagai lembaga peradilan tingkat banding di lingkungan Peradilan Militer.');

-- --------------------------------------------------------
-- 3. TABEL: personnel (Daftar Personel & Hakim Militer)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `personnel`;
CREATE TABLE `personnel` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `no` INT NOT NULL DEFAULT 1,
  `nama` VARCHAR(150) NOT NULL,
  `nip_nrp` VARCHAR(50) NOT NULL,
  `pangkat_gol` VARCHAR(100) NOT NULL,
  `jabatan` VARCHAR(150) NOT NULL,
  `kategori` ENUM('Pimpinan', 'Hakim Militer Tinggi', 'Kepaniteraan', 'Kesekretariatan') NOT NULL,
  `is_mutasi_masuk` TINYINT(1) NOT NULL DEFAULT 0,
  `matra` ENUM('TNI AD', 'TNI AL', 'TNI AU', 'ASN MA-RI') NOT NULL DEFAULT 'TNI AD',
  `pendidikan` VARCHAR(255) DEFAULT NULL,
  `riwayat_singkat` TEXT DEFAULT NULL,
  `foto_url` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Daftar Personel Pimpinan, Hakim, Kepaniteraan & Kesekretariatan';

INSERT INTO `personnel` (`id`, `no`, `nama`, `nip_nrp`, `pangkat_gol`, `jabatan`, `kategori`, `is_mutasi_masuk`, `matra`, `pendidikan`, `riwayat_singkat`, `foto_url`) VALUES
('p-1', 1, 'Brigadir Jenderal TNI Faridah Hastuti, S.H., M.H.', '11930001230471', 'Brigadir Jenderal TNI', 'Kepala Pengadilan Militer Tinggi V Makassar', 'Pimpinan', 0, 'TNI AD', 'S2 Hukum Pidana Militer Universitas Indonesia', 'Aparatur Hukum TNI AD, Mantan Kadilmil III-12 Surabaya', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'),
('p-2', 2, 'Kolonel Chk Sultan, S.H.', '11980017760771', 'Kolonel Chk', 'Wakil Kepala Pengadilan Militer Tinggi V Makassar', 'Pimpinan', 0, 'TNI AD', 'S1 Hukum Universitas Hasanuddin', 'Mantan Anggota Pokkimilti Dilmilti I Medan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'),
('p-3', 3, 'Kolonel Chk Sugeng Aryanto, S.H., M.H.', '11980018880872', 'Kolonel Chk', 'Hakim Militer Tinggi', 'Hakim Militer Tinggi', 0, 'TNI AD', 'S2 Hukum Universitas Gadjah Mada', 'Ketua Majelis Hakim Perkara Banding Pidana Militer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'),
('p-4', 4, 'Kolonel Laut (H) Dr. R. Subagyo, S.H., M.H.', '12990023410975', 'Kolonel Laut (H)', 'Hakim Militer Tinggi', 'Hakim Militer Tinggi', 0, 'TNI AL', 'S3 Ilmu Hukum Universitas Padjadjaran', 'Hakim Spesialis Pidana Khusus & Sengketa TUN Militer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'),
('p-5', 5, 'Letkol Chk S. Haryanto, S.H., M.H.', '11020023410882', 'Letkol Chk', 'Panitera', 'Kepaniteraan', 0, 'TNI AD', 'S2 Hukum Universitas Airlangga', 'Penanggung Jawab Kepaniteraan & SIPP Terpadu', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'),
('p-6', 6, 'Dra. Hj. Andi Nurmiah, M.H.', '197805122003121002', 'Pembina Utama Muda (IV/c)', 'Sekretaris', 'Kesekretariatan', 0, 'ASN MA-RI', 'S2 Manajemen Publik Universitas Hasanuddin', 'Penanggung Jawab Pengelolaan DIPA 01/04 & SDM', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80');

-- --------------------------------------------------------
-- 4. TABEL: satker_structure (Struktur Organisasi PERMA 1/2017)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `satker_structure`;
CREATE TABLE `satker_structure` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `kelompok` ENUM('Pimpinan', 'Kepaniteraan', 'Kesekretariatan') NOT NULL,
  `jabatan` VARCHAR(150) NOT NULL,
  `nama_pejabat` VARCHAR(150) NOT NULL,
  `pangkat_nip` VARCHAR(100) NOT NULL,
  `tugas_fungsi` TEXT NOT NULL,
  `urutan` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Struktur Satuan Kerja Sesuai PERMA 1/2017';

INSERT INTO `satker_structure` (`id`, `kelompok`, `jabatan`, `nama_pejabat`, `pangkat_nip`, `tugas_fungsi`, `urutan`) VALUES
('st-1', 'Pimpinan', 'Kepala Pengadilan Militer Tinggi V Makassar', 'Brigadir Jenderal TNI Faridah Hastuti, S.H., M.H.', 'Brigadir Jenderal TNI / NRP 11930001230471', 'Memimpin pelaksanaan tugas pokok peradilan militer tingkat banding, pembinaan aparatur, dan pengawasan internal.', 1),
('st-2', 'Pimpinan', 'Wakil Kepala Pengadilan Militer Tinggi V Makassar', 'Kolonel Chk Sultan, S.H.', 'Kolonel Chk / NRP 11980017760771', 'Membantu Kadilmilti V dalam pengawasan teknis yustisial, Pembangunan Zona Integritas, dan pengawasan disiplin.', 2),
('st-3', 'Kepaniteraan', 'Panitera', 'Letkol Chk S. Haryanto, S.H., M.H.', 'Letkol Chk / NRP 11020023410882', 'Mengelola administrasi perkara banding, minutasi, persidangan, e-Court, dan laporan SIPP.', 3),
('st-4', 'Kepaniteraan', 'Panitera Muda Pidana Militer', 'Mayor Chk R. Iskandar, S.H.', 'Mayor Chk / NRP 11050012340985', 'Pengelolaan berkas perkara banding pidana militer, pendaftaran register, dan distribusi berkas.', 4),
('st-5', 'Kesekretariatan', 'Sekretaris', 'Dra. Hj. Andi Nurmiah, M.H.', 'Pembina Utama Muda / NIP 197805122003121002', 'Memimpin perencanaan program, pengelolaan anggaran DIPA, kepegawaian, dan sarana kehumasan.', 5),
('st-6', 'Kesekretariatan', 'Kepala Sub Bagian Ke perencanaan, IT & Pelaporan', 'M. Imran, S.Kom., M.T.', 'Penata Tk. I / NIP 198504102009121001', 'Pengelolaan sistem TI, aplikasi SIPP, portal berita web, keamanan jaringan, dan penyusunan LKjIP.', 6);

-- --------------------------------------------------------
-- 5. TABEL: news (Berita & Artikel Publik)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `judul` VARCHAR(255) NOT NULL,
  `ringkasan` TEXT NOT NULL,
  `konten_lengkap` LONGTEXT NOT NULL,
  `kategori` ENUM('Kegiatan Satker', 'Inovasi Pelayanan', 'Pengawasan & ZI', 'Putusan Penting', 'Pengumuman Resmi') NOT NULL DEFAULT 'Kegiatan Satker',
  `tanggal` DATE NOT NULL,
  `penulis` VARCHAR(100) NOT NULL DEFAULT 'Humas Dilmilti V Makassar',
  `gambar_url` TEXT DEFAULT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Berita & Pengumuman Publik Portal Resmi';

INSERT INTO `news` (`id`, `judul`, `ringkasan`, `konten_lengkap`, `kategori`, `tanggal`, `penulis`, `gambar_url`, `is_featured`) VALUES
('news-1', 'Pengadilan Militer Tinggi V Makassar Gelar Deklarasi Pembangunan ZI Menuju WBBM 2026', 'Komitmen bersama pimpinan dan seluruh prajurit serta ASN mewujudkan Wilayah Birokrasi Bersih dan Melayani.', 'Makassar, Dilmilti V - Kepala Pengadilan Militer Tinggi V Makassar memimpin apel Deklarasi Pembangunan Zona Integritas (ZI) Menuju Wilayah Birokrasi Bersih dan Melayani (WBBM) tahun 2026. Seluruh pimpinan, Hakim Militer Tinggi, dan staf penandatanganan pakta integritas secara terbuka.', 'Pengawasan & ZI', '2026-09-18', 'Tim Humas & IT', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80', 1),
('news-2', 'Sosialisasi e-Court & e-Berpadu Terintegrasi Bagi Oditurat Militer IV-16 Makassar', 'Peningkatan percepatan pelimpahan berkas perkara pidana militer secara elektronik berbasis aplikasi e-Berpadu MA-RI.', 'Makassar - Pengadilan Militer Tinggi V Makassar menyelenggarakan sosialisasi integrasi sistem e-Berpadu dan e-Court bersama jajaran Oditurat Militer IV-16 Makassar dan Dilmil III-16 Makassar guna menjamin keterbukaan informasi persidangan.', 'Inovasi Pelayanan', '2026-09-15', 'Kepaniteraan Dilmilti V', 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80', 0);

-- --------------------------------------------------------
-- 6. TABEL: perkara_sipp (Sistem Informasi Penelusuran Perkara)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `perkara_sipp`;
CREATE TABLE `perkara_sipp` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nomor_perkara` VARCHAR(100) NOT NULL UNIQUE,
  `nomor_register_oditurat` VARCHAR(100) DEFAULT NULL,
  `jenis_perkara` VARCHAR(150) NOT NULL DEFAULT 'Banding Pidana Militer',
  `klasifikasi` VARCHAR(150) NOT NULL,
  `tingkat_perkara` ENUM('Banding', 'Tingkat Pertama') NOT NULL DEFAULT 'Banding',
  `tanggal_daftar` DATE NOT NULL,
  `status_perkara` VARCHAR(100) NOT NULL,
  `terdakwa_nama` VARCHAR(150) NOT NULL,
  `terdakwa_pangkat` VARCHAR(100) NOT NULL,
  `terdakwa_korps` VARCHAR(50) DEFAULT NULL,
  `terdakwa_nrp` VARCHAR(50) NOT NULL,
  `terdakwa_kesatuan` VARCHAR(150) NOT NULL,
  `terdakwa_matra` ENUM('TNI AD', 'TNI AL', 'TNI AU', 'Mabes TNI') NOT NULL DEFAULT 'TNI AD',
  `oditur_militer` VARCHAR(150) DEFAULT NULL,
  `hakim_ketua` VARCHAR(150) DEFAULT NULL,
  `hakim_anggota1` VARCHAR(150) DEFAULT NULL,
  `hakim_anggota2` VARCHAR(150) DEFAULT NULL,
  `panitera_pengganti` VARCHAR(150) DEFAULT NULL,
  `amar_putusan` TEXT DEFAULT NULL,
  `tanggal_putusan` DATE DEFAULT NULL,
  `petikan_url` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Data Register Perkara SIPP Dilmilti V Makassar';

INSERT INTO `perkara_sipp` (`id`, `nomor_perkara`, `nomor_register_oditurat`, `jenis_perkara`, `klasifikasi`, `tingkat_perkara`, `tanggal_daftar`, `status_perkara`, `terdakwa_nama`, `terdakwa_pangkat`, `terdakwa_korps`, `terdakwa_nrp`, `terdakwa_kesatuan`, `terdakwa_matra`, `oditur_militer`, `hakim_ketua`, `hakim_anggota1`, `hakim_anggota2`, `panitera_pengganti`, `amar_putusan`, `tanggal_putusan`) VALUES
('sipp-1', '12-K/PMT.V/BDG/AD/IX/2026', 'REG-OD/08/IX/2026', 'Banding Pidana Militer', 'Pelanggaran Disiplin/Desersi', 'Banding', '2026-09-02', 'Pemeriksaan Musyawarah Majelis', 'Serka Ahmad Fauzi', 'Serka', 'Inf', '21120034560890', 'Kodim 1408/Makassar', 'TNI AD', 'Mayor Chk Ruslan, S.H. (Odmilti IV-16)', 'Kolonel Chk Sugeng Aryanto, S.H., M.H.', 'Kolonel Laut (H) Dr. R. Subagyo, S.H., M.H.', 'Kolonel Udara (H) M. Yasin, S.H.', 'Kapten Chk Rusjana, S.H.', 'Proses Musyawarah Majelis Hakim Tinggi.', NULL),
('sipp-2', '08-K/PMT.V/BDG/AL/VIII/2026', 'REG-OD/05/VIII/2026', 'Banding Pidana Militer', 'Tindak Pidana Khusus Militer', 'Banding', '2026-08-14', 'Putusan Diucapkan', 'Letda Laut (P) Dwi Prasetyo', 'Letda Laut (P)', 'Pelaut', '12880045670991', 'Lantamal VI Makassar', 'TNI AL', 'Letkol Laut (H) Bambang, S.H.', 'Kolonel Laut (H) Dr. R. Subagyo, S.H., M.H.', 'Kolonel Chk Sugeng Aryanto, S.H., M.H.', 'Kolonel Chk Sultan, S.H.', 'Mayor Chk Taufik, S.H.', 'Menguatkan Putusan Pengadilan Militer III-16 Makassar Nomor 45-K/PM.III-16/AL/VI/2026 dengan Pidana Penjara 1 Tahun 2 Bulan.', '2026-09-10');

-- --------------------------------------------------------
-- 7. TABEL: jadwal_sidang (Jadwal Persidangan Terbuka)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `jadwal_sidang`;
CREATE TABLE `jadwal_sidang` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nomor_perkara` VARCHAR(100) NOT NULL,
  `terdakwa` VARCHAR(150) NOT NULL,
  `kesatuan` VARCHAR(150) NOT NULL,
  `tanggal` DATE NOT NULL,
  `waktu` VARCHAR(50) NOT NULL DEFAULT '09:00 WITA',
  `ruang_sidang` VARCHAR(100) NOT NULL DEFAULT 'Ruang Sidang Utama Kartika',
  `agenda` TEXT NOT NULL,
  `majelis_hakim` VARCHAR(255) NOT NULL,
  `oditur` VARCHAR(150) NOT NULL,
  `sifat_sidang` ENUM('Terbuka untuk Umum', 'Tertutup untuk Umum') NOT NULL DEFAULT 'Terbuka untuk Umum',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Jadwal Persidangan Terbuka Pengadilan Militer Tinggi V';

INSERT INTO `jadwal_sidang` (`id`, `nomor_perkara`, `terdakwa`, `kesatuan`, `tanggal`, `waktu`, `ruang_sidang`, `agenda`, `majelis_hakim`, `oditur`, `sifat_sidang`) VALUES
('jdw-1', '12-K/PMT.V/BDG/AD/IX/2026', 'Serka Ahmad Fauzi', 'Kodim 1408/Makassar', '2026-09-22', '09:00 WITA', 'Ruang Sidang Utama Kartika', 'Pembacaan Putusan Banding Perkara Desersi', 'Kolonel Chk Sugeng Aryanto, S.H., M.H. (Ketua)', 'Mayor Chk Ruslan, S.H.', 'Terbuka untuk Umum'),
('jdw-2', '14-K/PMT.V/BDG/AU/IX/2026', 'Peltu Riyan Hidayat', 'Lanud Sultan Hasanuddin', '2026-09-23', '10:00 WITA', 'Ruang Sidang Garuda', 'Pemeriksaan Berkas Memori Banding & Musyawarah', 'Kolonel Udara (H) M. Yasin, S.H. (Ketua)', 'Letkol Chk Agus, S.H.', 'Terbuka untuk Umum');

-- --------------------------------------------------------
-- 8. TABEL: dip_ppid (Daftar Informasi Publik)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `dip_ppid`;
CREATE TABLE `dip_ppid` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nomor_dokumen` VARCHAR(100) NOT NULL,
  `nama_informasi` VARCHAR(255) NOT NULL,
  `kategori` ENUM('Berkala', 'Serta Merta', 'Setiap Saat', 'Dikecualikan') NOT NULL,
  `penanggung_jawab` VARCHAR(150) NOT NULL DEFAULT 'PPID Utama Dilmilti V Makassar',
  `tahun` VARCHAR(10) NOT NULL DEFAULT '2026',
  `file_url` TEXT DEFAULT NULL,
  `format_file` VARCHAR(20) NOT NULL DEFAULT 'PDF',
  `ukuran_file` VARCHAR(50) NOT NULL DEFAULT '1.2 MB',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Daftar Informasi Publik PPID MA-RI SK KMA 2-144/2022';

INSERT INTO `dip_ppid` (`id`, `nomor_dokumen`, `nama_informasi`, `kategori`, `penanggung_jawab`, `tahun`, `file_url`, `format_file`, `ukuran_file`) VALUES
('dip-1', 'PPID/DIP/2026/001', 'Laporan Kinerja Instansi Pemerintah (LKjIP) Tahun 2025 Dilmilti V Makassar', 'Berkala', 'PPID Utama / Subbag PTIP', '2026', 'https://dilmilti5-makassar.go.id/dokumen/lkjip-2025.pdf', 'PDF', '2.4 MB'),
('dip-2', 'PPID/DIP/2026/002', 'Rencana Strategis (Renstra) Dilmilti V Makassar 2025-2029', 'Berkala', 'Subbag PTIP', '2026', 'https://dilmilti5-makassar.go.id/dokumen/renstra-2025-2029.pdf', 'PDF', '3.1 MB'),
('dip-3', 'PPID/DIP/2026/003', 'Prosedur Layanan Permohonan Informasi Publik SK KMA 2-144/KMA/SK/VIII/2022', 'Setiap Saat', 'Meja PPID PTSP', '2026', 'https://dilmilti5-makassar.go.id/dokumen/sop-ppid-2026.pdf', 'PDF', '850 KB');

-- --------------------------------------------------------
-- 9. TABEL: menu_contents (Konten Dinamis Halaman Menu)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `menu_contents`;
CREATE TABLE `menu_contents` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `kategori` ENUM('tentang', 'layanan', 'hukum') NOT NULL,
  `nomor_urut` INT NOT NULL DEFAULT 1,
  `judul` VARCHAR(255) NOT NULL,
  `sub_judul` VARCHAR(255) DEFAULT NULL,
  `dasar_hukum` TEXT DEFAULT NULL,
  `sk_nomor` VARCHAR(150) DEFAULT NULL,
  `konten_utama` LONGTEXT NOT NULL,
  `poin_poin_json` JSON DEFAULT NULL,
  `link_dokumen` TEXT DEFAULT NULL,
  `link_eksternal` TEXT DEFAULT NULL,
  `petugas_penanggung_jawab` VARCHAR(150) DEFAULT NULL,
  `badge` VARCHAR(100) DEFAULT NULL,
  `icon_name` VARCHAR(50) DEFAULT 'Building2',
  `status` ENUM('Aktif', 'Draft', 'Diarsipkan') NOT NULL DEFAULT 'Aktif',
  `tanggal_update` DATE NOT NULL,
  `custom_fields_json` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Konten Dinamis Seluruh Menu Website';

INSERT INTO `menu_contents` (`id`, `kategori`, `nomor_urut`, `judul`, `sub_judul`, `dasar_hukum`, `sk_nomor`, `konten_utama`, `poin_poin_json`, `link_dokumen`, `petugas_penanggung_jawab`, `badge`, `icon_name`, `status`, `tanggal_update`) VALUES
('m1', 'tentang', 1, 'Pengantar Pimpinan Pengadilan Militer Tinggi V Makassar', 'Sambutan Resmi Kepala Pengadilan Militer Tinggi V Makassar', 'Keputusan Panglima TNI & SK KMA RI', 'SK-KMA/2026/DILMILTI-V', 'Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya, sehingga portal informasi resmi Pengadilan Militer Tinggi V Makassar dapat terus memberikan pelayanan informasi hukum yang transparan, akuntabel, dan terpercaya bagi seluruh prajurit TNI dan masyarakat pencari keadilan.', '["Penyelenggaraan peradilan militer yang modern dan berintegritas.", "Pemberian pelayanan yustisial yang transparan.", "Komitmen ZI menuju WBBM."]', 'https://dilmilti5-makassar.go.id/dokumen/sambutan-resmi.pdf', 'Subbag Humas & IT Dilmilti V Makassar', 'Pimpinan Satker', 'Building2', 'Aktif', '2026-09-20'),
('m2', 'tentang', 2, 'Visi dan Misi Pengadilan Militer Tinggi V Makassar', 'Selaras dengan Cetak Biru Pembaruan Peradilan Mahkamah Agung RI', 'Cetak Biru Pembaruan Peradilan 2010-2035 & SK KMA RI', 'SK-KMA/014/KMA/SK/I/2011', 'Visi Pengadilan Militer Tinggi V Makassar berakar teguh pada Visi Mahkamah Agung Republik Indonesia, yaitu mewujudkan badan peradilan yang agung dan terpercaya.', '["Mewujudkan peradilan militer yang mandiri.", "Menjaga integritas dan kejujuran aparatur.", "Meningkatkan kualitas kepemimpinan badan peradilan."]', 'https://dilmilti5-makassar.go.id/dokumen/visi-misi.pdf', 'Sub Bagian PTIP Dilmilti V Makassar', 'Visi Misi MA', 'Target', 'Aktif', '2026-09-20');

-- --------------------------------------------------------
-- 10. TABEL: audit_logs (Catatan Log Aktivitas Sistem)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_name` VARCHAR(150) NOT NULL,
  `user_role` VARCHAR(100) NOT NULL,
  `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'REGISTER', 'BACKUP', 'RESTORE', 'SYNC') NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `details` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catatan Audit Aktivitas Pengelola Portal';

INSERT INTO `audit_logs` (`id`, `timestamp`, `user_name`, `user_role`, `action`, `module`, `details`) VALUES
('log-1', '2026-09-21 08:30:00', 'Super Admin Utama', 'super_admin', 'LOGIN', 'SISTEM', 'Sesi login berhasil dari perangkat workstation admin.'),
('log-2', '2026-09-21 09:15:00', 'Super Admin Utama', 'super_admin', 'SYNC', 'SISTEM', 'Sinkronisasi database sentral lintas perangkat berhasil diproses.');

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
