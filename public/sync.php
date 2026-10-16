<?php
/**
 * ============================================================================
 * BACKEND MYSQL / XAMPP HYBRID BRIDGE (sync.php)
 * PORTAL PELAYANAN TERPADU SATU PINTU (PTSP) ELEKTRONIK
 * PENGADILAN MILITER TINGGI V MAKASSAR
 * ============================================================================
 * Cara Penggunaan di XAMPP / Laragon / Server Lokal:
 * 1. Letakkan file `sync.php` ini di dalam folder `C:/xampp/htdocs/ptsp_dilmilti5/sync.php`
 * 2. Pastikan MySQL pada XAMPP Control Panel sudah berstatus "Running".
 * 3. File ini secara OTOMATIS membuat database `db_ptsp_dilmilti5` beserta 9 tabel:
 *    - ptsp_applications
 *    - online_consultations
 *    - ptsp_room_streams
 *    - ptsp_room_chats
 *    - queue_tickets
 *    - reply_documents
 *    - tbl_users
 *    - tbl_satker
 *    - tbl_pejabat
 * ============================================================================
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = getenv('DB_HOST') ?: '127.0.0.1';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';
$db_name = getenv('DB_NAME') ?: 'db_ptsp_dilmilti5';

try {
    $pdo = new PDO("mysql:host=$db_host;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // 1. Buat Database otomatis jika belum ada
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$db_name`");

    // 2. Buat 9 Tabel Utama Secara Otomatis jika belum ada
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `ptsp_applications` (
            `id` VARCHAR(64) PRIMARY KEY,
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `reply_documents` (
            `id` VARCHAR(64) PRIMARY KEY,
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `queue_tickets` (
            `id` VARCHAR(64) PRIMARY KEY,
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `online_consultations` (
            `id` VARCHAR(64) PRIMARY KEY,
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
            `status_ruang` VARCHAR(50) NOT NULL DEFAULT 'Menunggu Petugas',
            `nama_petugas` VARCHAR(150) DEFAULT 'Petugas Jaga PTSP',
            `notulensi_ringkasan` TEXT DEFAULT NULL,
            `notulensi_rekomendasi` TEXT DEFAULT NULL,
            `notulensi_signed` TINYINT(1) NOT NULL DEFAULT 0,
            `notulensi_signed_at` VARCHAR(60) DEFAULT NULL,
            `notulensi_qr_hash` VARCHAR(128) DEFAULT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `ptsp_room_streams` (
            `room_code` VARCHAR(64) PRIMARY KEY,
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `ptsp_room_chats` (
            `id` VARCHAR(64) PRIMARY KEY,
            `room_code` VARCHAR(64) NOT NULL,
            `sender_role` ENUM('pemohon', 'petugas', 'sistem') NOT NULL,
            `sender_name` VARCHAR(150) NOT NULL,
            `message` TEXT NOT NULL,
            `timestamp` VARCHAR(40) NOT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX (`room_code`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `tbl_users` (
            `id` VARCHAR(64) PRIMARY KEY,
            `username` VARCHAR(100) NOT NULL UNIQUE,
            `nama_lengkap` VARCHAR(150) NOT NULL,
            `nip_nrp` VARCHAR(64) NOT NULL,
            `pangkat_gol` VARCHAR(100) NOT NULL,
            `role` ENUM('super_admin', 'petugas_meja', 'pejabat_struktural') NOT NULL DEFAULT 'petugas_meja',
            `meja_assigned` INT DEFAULT 0,
            `jabatan` VARCHAR(150) NOT NULL,
            `no_wa` VARCHAR(40) DEFAULT '-',
            `status_aktif` TINYINT(1) NOT NULL DEFAULT 1,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `tbl_satker` (
            `id` VARCHAR(64) PRIMARY KEY,
            `kode_satker` VARCHAR(30) NOT NULL,
            `nama_satker` VARCHAR(200) NOT NULL,
            `tingkat` VARCHAR(80) NOT NULL,
            `wilayah_hukum` TEXT NOT NULL,
            `alamat` TEXT NOT NULL,
            `telepon` VARCHAR(80) DEFAULT '-',
            `kepala_satker` VARCHAR(150) DEFAULT '-',
            `status_koneksi` VARCHAR(40) DEFAULT 'Terhubung'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `tbl_pejabat` (
            `id` VARCHAR(64) PRIMARY KEY,
            `urutan` INT NOT NULL DEFAULT 1,
            `nama_pejabat` VARCHAR(150) NOT NULL,
            `pangkat_korps` VARCHAR(100) NOT NULL,
            `nrp_nip` VARCHAR(64) NOT NULL,
            `jabatan` VARCHAR(150) NOT NULL,
            `kategori` VARCHAR(80) NOT NULL,
            `matra` VARCHAR(40) NOT NULL DEFAULT 'TNI AD',
            `status_kehadiran` VARCHAR(60) NOT NULL DEFAULT 'Siap Dinas (Di Kantor)'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `ptsp_sync_kv` (
            `sync_key` VARCHAR(100) PRIMARY KEY,
            `sync_payload` LONGTEXT NOT NULL,
            `version` INT NOT NULL DEFAULT 1,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $action = $_GET['action'] ?? ($_POST['action'] ?? 'status');
    $rawBody = file_get_contents('php://input');
    $body = $rawBody ? json_decode($rawBody, true) : [];
    if (!empty($body['action'])) {
        $action = $body['action'];
    }

    if ($action === 'status' || $action === 'ping') {
        echo json_encode([
            'success' => true,
            'engine' => 'MySQL / XAMPP PHP Bridge (db_ptsp_dilmilti5)',
            'database' => $db_name,
            'tables' => [
                'ptsp_applications',
                'online_consultations',
                'ptsp_room_streams',
                'ptsp_room_chats',
                'queue_tickets',
                'reply_documents',
                'tbl_users',
                'tbl_satker',
                'tbl_pejabat'
            ],
            'timestamp' => date('c')
        ]);
        exit();
    }

    // Simpan snapshot JSON lengkap ke tabel relational & kv
    if ($action === 'push_state' && isset($body['state'])) {
        $stateJson = json_encode($body['state'], JSON_UNESCAPED_UNICODE);
        $stmt = $pdo->prepare("
            INSERT INTO `ptsp_sync_kv` (`sync_key`, `sync_payload`, `version`)
            VALUES ('ptsp_master_state', :payload, 1)
            ON DUPLICATE KEY UPDATE `sync_payload` = :payload, `version` = `version` + 1
        ");
        $stmt->execute([':payload' => $stateJson]);

        // Sinkronkan juga stream video ke tabel ptsp_room_streams jika ada
        if (!empty($body['state']['roomStreams']) && is_array($body['state']['roomStreams'])) {
            $streamStmt = $pdo->prepare("
                INSERT INTO `ptsp_room_streams`
                (`room_code`, `caller_frame`, `caller_mic_on`, `caller_cam_on`, `caller_updated_at`, `officer_frame`, `officer_mic_on`, `officer_cam_on`, `officer_updated_at`)
                VALUES (:rc, :cf, :cm, :cc, :cu, :of, :om, :oc, :ou)
                ON DUPLICATE KEY UPDATE
                    `caller_frame` = VALUES(`caller_frame`),
                    `caller_mic_on` = VALUES(`caller_mic_on`),
                    `caller_cam_on` = VALUES(`caller_cam_on`),
                    `caller_updated_at` = VALUES(`caller_updated_at`),
                    `officer_frame` = VALUES(`officer_frame`),
                    `officer_mic_on` = VALUES(`officer_mic_on`),
                    `officer_cam_on` = VALUES(`officer_cam_on`),
                    `officer_updated_at` = VALUES(`officer_updated_at`)
            ");
            foreach ($body['state']['roomStreams'] as $rc => $st) {
                $streamStmt->execute([
                    ':rc' => $rc,
                    ':cf' => $st['callerFrame'] ?? null,
                    ':cm' => !empty($st['callerMicOn']) ? 1 : 0,
                    ':cc' => !empty($st['callerCamOn']) ? 1 : 0,
                    ':cu' => $st['callerUpdatedAt'] ?? 0,
                    ':of' => $st['officerFrame'] ?? null,
                    ':om' => !empty($st['officerMicOn']) ? 1 : 0,
                    ':oc' => !empty($st['officerCamOn']) ? 1 : 0,
                    ':ou' => $st['officerUpdatedAt'] ?? 0
                ]);
            }
        }

        echo json_encode(['success' => true, 'message' => 'Data tersinkronisasi ke MySQL db_ptsp_dilmilti5']);
        exit();
    }

    if ($action === 'pull_state') {
        $stmt = $pdo->query("SELECT `sync_payload`, `version`, `updated_at` FROM `ptsp_sync_kv` WHERE `sync_key` = 'ptsp_master_state' LIMIT 1");
        $row = $stmt->fetch();
        echo json_encode([
            'success' => true,
            'version' => $row ? (int)$row['version'] : 0,
            'updated_at' => $row ? $row['updated_at'] : null,
            'state' => $row ? json_decode($row['sync_payload'], true) : null
        ]);
        exit();
    }

    echo json_encode(['success' => true, 'message' => 'PTSP Sync Bridge Ready']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
