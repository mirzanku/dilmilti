import { CourtDB } from './courtDatabase';
import { queuePtspBackgroundSync } from '../utils/ptspServiceWorkerSync';

export interface PTSPMejaCatalogItem {
  mejaId: number;
  kodeAntrean: string;
  namaMeja: string;
  subNama: string;
  penanggungJawab: string;
  petugasJaga: string;
  standarBiaya: string;
  estimasiWaktu: string;
  deskripsi: string;
  layananList: {
    id: string;
    nama: string;
    syarat: string[];
    sla: string;
    biaya: string;
    outputDokumen: string;
  }[];
}

export interface PTSPApplicationItem {
  id: string;
  ticket_no: string;
  meja_id: number;
  meja_nama: string;
  jenis_layanan: string;
  kategori_pemohon: 'Prajurit TNI' | 'Oditur Militer' | 'Penasihat Hukum' | 'Masyarakat Umum' | 'Instansi / Satker';
  nama_pemohon: string;
  nrp_nip_nik: string;
  pangkat_golongan: string;
  kesatuan_instansi: string;
  no_wa: string;
  email: string;
  nomor_perkara: string;
  uraian_permohonan: string;
  berkas_nama?: string;
  berkas_url?: string;
  berkas_size?: string;
  status: 'Diajukan' | 'Verifikasi Berkas' | 'Sedang Diproses' | 'Selesai' | 'Ditolak';
  tahap_verifikasi: 1 | 2 | 3 | 4;
  catatan_petugas?: string;
  petugas_verifikator?: string;
  reply_doc_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PTSPReplyDocumentItem {
  id: string;
  ticket_no: string;
  nomor_surat_balasan: string;
  judul_dokumen: string;
  isi_ringkas: string;
  file_name: string;
  file_url: string;
  tte_signer_nama: string;
  tte_signer_pangkat_nrp: string;
  tte_signer_jabatan: string;
  tte_qr_hash: string;
  uploaded_by: string;
  created_at: string;
}

export interface PTSPQueueTicketItem {
  id: string;
  nomor_antrean: string;
  kode_loket: string;
  meja_id: number;
  meja_nama: string;
  nama_pemohon: string;
  kategori_pemohon: string;
  kesatuan_instansi: string;
  no_wa: string;
  keperluan: string;
  waktu_ambil: string;
  estimasi_panggil: string;
  status: 'Menunggu' | 'Dipanggil' | 'Dilayani' | 'Selesai' | 'Lewati';
  loket_tujuan: string;
  petugas_panggil?: string;
  called_count?: number;
  updated_at: string;
}

export interface PTSPOnlineConsultationItem {
  id: string;
  room_code: string;
  meja_id: number;
  meja_nama: string;
  topik_konsultasi: string;
  nama_pemohon: string;
  kategori_pemohon: string;
  nrp_nip_nik: string;
  kesatuan_instansi: string;
  no_wa: string;
  jadwal_tanggal: string;
  jadwal_jam: string;
  status_ruang: 'Menunggu Petugas' | 'Aktif Berlangsung' | 'Selesai & Berita Acara Terbit';
  nama_petugas: string;
  jabatan_petugas: string;
  notulensi_ringkasan?: string;
  notulensi_rekomendasi?: string;
  notulensi_signed: boolean;
  notulensi_signed_at?: string;
  notulensi_qr_hash?: string;
  created_at: string;
}

export interface PTSPRoomStreamState {
  room_code: string;
  callerFrame?: string | null;
  callerMicOn: boolean;
  callerCamOn: boolean;
  callerName?: string;
  callerUpdatedAt: number;
  officerFrame?: string | null;
  officerMicOn: boolean;
  officerCamOn: boolean;
  officerName?: string;
  officerUpdatedAt: number;
}

export interface PTSPRoomChatItem {
  id: string;
  room_code: string;
  sender_role: 'pemohon' | 'petugas' | 'sistem';
  sender_name: string;
  message: string;
  timestamp: string;
  created_at: string;
}

export interface PTSPUserItem {
  id: string;
  username: string;
  password?: string;
  nama_lengkap: string;
  nip_nrp: string;
  pangkat_gol: string;
  role: 'super_admin' | 'petugas_meja' | 'pejabat_struktural';
  meja_assigned: number; // 0 = Semua Meja, 1..6 = Meja Spesifik
  jabatan: string;
  no_wa: string;
  status_aktif: boolean;
}

export interface PTSPSatkerItem {
  id: string;
  kode_satker: string;
  nama_satker: string;
  tingkat: string;
  wilayah_hukum: string;
  alamat: string;
  telepon: string;
  kepala_satker: string;
  status_koneksi: 'Server Utama Aktif' | 'Terhubung Online' | 'Sinkronisasi Berkala';
}

export interface PTSPPejabatItem {
  id: string;
  urutan: number;
  nama_pejabat: string;
  pangkat_korps: string;
  nrp_nip: string;
  jabatan: string;
  kategori: 'Pimpinan' | 'Hakim Militer Tinggi' | 'Kepaniteraan' | 'Kesekretariatan';
  matra: 'TNI AD' | 'TNI AL' | 'TNI AU' | 'ASN MA-RI';
  status_kehadiran: 'Siap Dinas (Di Kantor)' | 'Sidang Majelis' | 'Dinas Luar' | 'Cuti / Izin';
}

export interface PTSPDatabaseState {
  version: number;
  lastSyncAt: string;
  mysqlBridgeUrl: string;
  mysqlBridgeEnabled: boolean;
  ptsp_applications: PTSPApplicationItem[];
  reply_documents: PTSPReplyDocumentItem[];
  queue_tickets: PTSPQueueTicketItem[];
  online_consultations: PTSPOnlineConsultationItem[];
  ptsp_room_streams: Record<string, PTSPRoomStreamState>;
  ptsp_room_chats: PTSPRoomChatItem[];
  tbl_users: PTSPUserItem[];
  tbl_satker: PTSPSatkerItem[];
  tbl_pejabat: PTSPPejabatItem[];
}

export const KATALOG_6_MEJA_PTSP: PTSPMejaCatalogItem[] = [
  {
    mejaId: 1,
    kodeAntrean: 'A',
    namaMeja: 'Meja 1: Kepaniteraan Pidana Militer',
    subNama: 'Banding, Kasasi, PK, Grasi & Perkara Koneksitas',
    penanggungJawab: 'Panmud Pidana (Mayor Chk Mahpul Saepuloh, S.H.)',
    petugasJaga: 'Mayor Chk Mahpul Saepuloh, S.H.',
    standarBiaya: 'Rp 0,- (Gratis / Beban Negara sesuai Pasal 248 UU 31/1997)',
    estimasiWaktu: '15 - 30 Menit (SLA 1 Hari Kerja)',
    deskripsi: 'Melayani administrasi perkara pidana militer tingkat banding, pengiriman berkas kasasi/PK/Grasi ke Mahkamah Agung RI, perkara koneksitas, izin besuk tahanan militer, serta penyerahan salinan resmi putusan.',
    layananList: [
      {
        id: 'm1-banding',
        nama: 'Pendaftaran & Penyerahan Memori / Kontra Memori Banding Pidana Militer',
        syarat: ['Akta Permohonan Banding dari Dilmil Tingkat Pertama', 'Dokumen Memori / Kontra Memori Banding (PDF/Cetak)', 'Surat Kuasa Khusus / Surat Perintah Penugasan Oditur'],
        sla: '15 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Tanda Terima Akta & Memori Banding Terverifikasi'
      },
      {
        id: 'm1-kasasi',
        nama: 'Permohonan Upaya Hukum Kasasi, Peninjauan Kembali (PK) & Grasi',
        syarat: ['Pernyataan Kasasi / PK / Permohonan Grasi', 'Memori Kasasi / Alasan PK (Novum)', 'Salinan Putusan Pengadilan Militer Tinggi'],
        sla: '30 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Akta Penerimaan Upaya Hukum & Bukti Registrasi SIPP'
      },
      {
        id: 'm1-salinan',
        nama: 'Permohonan Salinan Resmi & Petikan Putusan Pidana Militer / Koneksitas',
        syarat: ['Surat Permohonan dari Oditur / Ankum / Penasihat Hukum / Terdakwa', 'Identitas KTA TNI / KTP Pemohon'],
        sla: '20 Menit',
        biaya: 'Rp 0,- (Salinan Elektronik TTE BSrE)',
        outputDokumen: 'Salinan Resmi Putusan Ber-TTE QR Code'
      },
      {
        id: 'm1-besuk',
        nama: 'Permohonan Surat Izin Besuk Tahanan Militer (Staltahmil)',
        syarat: ['KTP / KTA TNI Pengunjung', 'Surat Keterangan Hubungan Keluarga / Kuasa Hukum', 'Nomor Perkara Terkait'],
        sla: '10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Surat Izin Besuk Tahanan Militer Resmi (TTE)'
      }
    ]
  },
  {
    mejaId: 2,
    kodeAntrean: 'B',
    namaMeja: 'Meja 2: Kepaniteraan Hukum',
    subNama: 'Legalisasi, Waarmerking, Penelitian Ilmiah & SK Tidak Pernah Dipidana',
    penanggungJawab: 'Panitera (Kolonel Kum M. Nirwan Said, S.H., M.H.)',
    petugasJaga: 'Kapten Chk Rusjana, S.H.',
    standarBiaya: 'Rp 0,- (Gratis untuk SK Kedinasan TNI & Penelitian)',
    estimasiWaktu: '15 - 25 Menit',
    deskripsi: 'Melayani penerbitan Surat Keterangan Tidak Pernah Dipidana (SKTPD) bagi prajurit TNI (syarat Sekolah/Kenaikan Pangkat/Satgas), legalisasi dokumen hukum, waarmerking, registrasi surat kuasa, dan izin penelitian ilmiah.',
    layananList: [
      {
        id: 'm2-sktpd',
        nama: 'Surat Keterangan Tidak Pernah Dipidana (SKTPD) Prajurit TNI',
        syarat: ['Surat Pengantar dari Komandan Satuan (Dansat)', 'Fotokopi KTA TNI & KTP', 'Pas Foto Pakaian Dinas (PDH) Background Merah'],
        sla: '15 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Surat Keterangan Tidak Pernah Dipidana (SKTPD) Ber-TTE'
      },
      {
        id: 'm2-legalisasi',
        nama: 'Legalisasi & Waarmerking Dokumen Putusan / Surat Bukti Hukum',
        syarat: ['Dokumen Asli yang akan dilegalisasi/waarmerking', 'Salinan/Fotokopi Dokumen', 'Identitas Pemohon (KTA/KTP)'],
        sla: '15 Menit',
        biaya: 'Sesuai PNBP Resmi / Rp 0,- Kedinasan',
        outputDokumen: 'Dokumen Terlegalisasi Resmi Kepaniteraan Hukum'
      },
      {
        id: 'm2-penelitian',
        nama: 'Permohonan Izin Penelitian Ilmiah / Akademik Hukum Militer',
        syarat: ['Surat Pengantar dari Universitas / Lembaga Pendidikan TNI', 'Proposal / Instrumen Penelitian', 'Identitas Mahasiswa / Peneliti'],
        sla: '1 Hari Kerja',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Surat Izin Penelitian & Surat Keterangan Selesai Riset'
      },
      {
        id: 'm2-suratkuasa',
        nama: 'Pendaftaran Surat Kuasa Khusus & Surat Perintah Penasihat Hukum TNI',
        syarat: ['Surat Kuasa Khusus Asli bermeterai / Sprin Kakumdam/Diskum', 'Berita Acara Sumpah (BAS) & KTA Advokat / KTA TNI'],
        sla: '15 Menit',
        biaya: 'Rp 0,- Kedinasan TNI',
        outputDokumen: 'Akta Registrasi Surat Kuasa Kepaniteraan Hukum'
      }
    ]
  },
  {
    mejaId: 3,
    kodeAntrean: 'C',
    namaMeja: 'Meja 3: Kesekretariatan / Umum & Keuangan',
    subNama: 'Surat Masuk Kedinasan, Pengadaan Barang/Jasa & Layanan Keuangan',
    penanggungJawab: 'Kabag Umum dan Keuangan (Herna Dian Prihatiny Napan, S.T.)',
    petugasJaga: 'Andi Adzan Mirzan, S.Kom., M.M.',
    standarBiaya: 'Rp 0,- (Gratis)',
    estimasiWaktu: '10 - 15 Menit',
    deskripsi: 'Melayani penerimaan surat masuk kedinasan TNI/Polri/Instansi, ekspedisi surat keluar, administrasi pengadaan barang/jasa pemerintah (LPSE/e-Katalog), serta layanan konfirmasi keuangan DIPA.',
    layananList: [
      {
        id: 'm3-suratmasuk',
        nama: 'Penerimaan Surat Masuk Kedinasan & Naskah Dinas Elektronik',
        syarat: ['Surat Resmi Instansi / Kesatuan TNI', 'Identitas Kurir / Petugas Penghubung'],
        sla: '10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Bukti Tanda Terima Surat Masuk Elektronik (QR Code)'
      },
      {
        id: 'm3-pengadaan',
        nama: 'Layanan Administrasi Pengadaan Barang/Jasa & Mitra Penyedia',
        syarat: ['Dokumen Kontrak / BAST / Faktur Tagihan', 'NPWP & Dokumen Perusahaan Penyedia'],
        sla: '20 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Tanda Terima Verifikasi Berkas Pengadaan'
      },
      {
        id: 'm3-keuangan',
        nama: 'Layanan Konfirmasi Keuangan, PNBP & Pengembalian Sisa Panjar',
        syarat: ['Bukti Setor / Nomor Register Perkara TUN', 'Identitas Pemohon'],
        sla: '15 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Bukti Konfirmasi Keuangan & Kwitansi Elektronik'
      }
    ]
  },
  {
    mejaId: 4,
    kodeAntrean: 'D',
    namaMeja: 'Meja 4: Kepegawaian, Organisasi & Tata Laksana',
    subNama: 'Kenaikan Pangkat, Mutasi, Izin/Cuti & Layanan Aparatur',
    penanggungJawab: 'Kabag Perencanaan dan Kepegawaian (Muhammad Arfah Afendi, S.E., M.M.)',
    petugasJaga: 'Afni Syafaatun, S.A.P., M.A.P.',
    standarBiaya: 'Rp 0,- (Gratis)',
    estimasiWaktu: '15 - 20 Menit',
    deskripsi: 'Melayani administrasi kepegawaian aparatur militer (TNI AD, TNI AL, TNI AU) dan ASN di lingkungan Pengadilan Militer Tinggi V Makassar, meliputi usul kenaikan pangkat, mutasi, cuti/izin, serta SIKep MA-RI.',
    layananList: [
      {
        id: 'm4-kp',
        nama: 'Pengajuan Usul Kenaikan Pangkat (UKP) Militer & Kenaikan Pangkat ASN',
        syarat: ['SK Pangkat Terakhir & SK Jabatan', 'Penilaian Kinerja (e-Kinerja / Dapen TNI)', 'Daftar Riwayat Hidup'],
        sla: '20 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Tanda Terima Usul Kenaikan Pangkat & Pengantar Satker'
      },
      {
        id: 'm4-mutasi',
        nama: 'Layanan Administrasi Mutasi Masuk/Keluar & Laporan Menghadap Personel',
        syarat: ['SKEP Mutasi Panglima TNI / Dirjen Badilmiltun / Sekma', 'Surat Perintah Pelaksanaan (Sprinlak)'],
        sla: '15 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Berita Acara Menghadap & Surat Pernyataan Melaksanakan Tugas (SPMT)'
      },
      {
        id: 'm4-cuti',
        nama: 'Permohonan Surat Izin / Cuti Tahunan & Izin Jalan Personel',
        syarat: ['Formulir Permohonan Cuti/Izin yang disetujui Atasan Langsung', 'Data Sisa Hak Cuti SIKep'],
        sla: '10 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Surat Izin / Surat Cuti Resmi Ber-TTE'
      }
    ]
  },
  {
    mejaId: 5,
    kodeAntrean: 'E',
    namaMeja: 'Meja 5: Perencanaan, TI & Pelaporan (PTIP)',
    subNama: 'Permintaan Data Statistik Perkara, SAKIP, DIPA & LHKPN/LHKASN',
    penanggungJawab: 'Kasubbag Rencana Program dan Anggaran (Muhammad Imam S, S.H.)',
    petugasJaga: 'Allen Farlianso, S.E.',
    standarBiaya: 'Rp 0,- (Gratis)',
    estimasiWaktu: '15 - 30 Menit',
    deskripsi: 'Melayani permintaan data statistik perkara peradilan militer se-wilayah hukum Indonesia Timur, dokumen perencanaan anggaran (DIPA/RKA-KL), laporan akuntabilitas kinerja (SAKIP/LKjIP), serta pelaporan LHKPN/LHKASN.',
    layananList: [
      {
        id: 'm5-statistik',
        nama: 'Permintaan Data Statistik Perkara & Laporan Tahunan Pengadilan',
        syarat: ['Surat Permohonan Resmi dari Satker / Instansi / Peneliti', 'Rincian Periode Data Statistik yang Diminta'],
        sla: '20 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Dokumen Rekapitulasi Statistik Perkara Resmi (PDF Ber-TTE)'
      },
      {
        id: 'm5-lhkpn',
        nama: 'Layanan Konsultasi & Bukti Kepatuhan LHKPN / LHKASN / SPT Tahunan',
        syarat: ['Identitas Aparatur / Penyelenggara Negara', 'Bukti Penerimaan Elektronik (BPE) KPK / SiHARKA'],
        sla: '15 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Tanda Terima Verifikasi Kepatuhan LHKPN/LHKASN'
      },
      {
        id: 'm5-ti',
        nama: 'Dukungan Teknis TI, Jaringan Sidang Virtual & Integrasi e-Berpadu/SIPP',
        syarat: ['Tiket Permohonan Bantuan TI / Jadwal Teleconference Kesatuan'],
        sla: '15 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Konfirmasi Kesiapan Jaringan & Kredensial Ruang Virtual'
      }
    ]
  },
  {
    mejaId: 6,
    kodeAntrean: 'F',
    namaMeja: 'Meja 6: Informasi, Pengaduan & Posbakum',
    subNama: 'Layanan PPID (SK KMA 2-144), Pengaduan SIWAS MA-RI & Posbakum Gratis',
    penanggungJawab: 'Kasubbag Kepegawaian dan TI (Afni Syafaatun, S.A.P., M.A.P.)',
    petugasJaga: 'Pratu Muhammad Faisal',
    standarBiaya: 'Rp 0,- (100% Gratis / Bebas Biaya)',
    estimasiWaktu: '10 - 30 Menit',
    deskripsi: 'Melayani permohonan informasi publik (PPID) sesuai SK KMA Nomor 2-144/KMA/SK/VIII/2022, penerimaan pengaduan masyarakat & Whistleblowing System (SIWAS MA-RI / SP4N-LAPOR!), serta konsultasi Pos Bantuan Hukum (Posbakum) gratis.',
    layananList: [
      {
        id: 'm6-ppid',
        nama: 'Permohonan Informasi Publik (PPID) sesuai SK KMA 2-144/KMA/SK/VIII/2022',
        syarat: ['KTP / KTA TNI / Akta Badan Hukum Pemohon', 'Rincian Informasi yang Dimohonkan & Tujuan Penggunaan'],
        sla: '10 - 20 Menit (Maks. 10 Hari Kerja untuk Informasi Kompleks)',
        biaya: 'Rp 0,- (Salinan Elektronik Gratis)',
        outputDokumen: 'Pemberitahuan Tertulis & Dokumen Informasi Publik (PDF)'
      },
      {
        id: 'm6-posbakum',
        nama: 'Konsultasi Hukum Gratis & Pembuatan Dokumen Hukum (Posbakum)',
        syarat: ['KTP / KTA TNI Pemohon', 'Kronologi Singkat Permasalahan Hukum Militer / TUN Militer'],
        sla: '30 Menit (Tatap Muka / Video Call Online)',
        biaya: 'Rp 0,- (Gratis Dibiayai DIPA Pengadilan)',
        outputDokumen: 'Berita Acara Konsultasi Posbakum & Advis Hukum'
      },
      {
        id: 'm6-pengaduan',
        nama: 'Layanan Pengaduan Masyarakat & Whistleblowing System (SIWAS MA-RI)',
        syarat: ['Identitas Pelapor (Dijamin Kerahasiaannya)', 'Uraian Dugaan Pelanggaran Kode Etik / Pelayanan & Bukti Awal'],
        sla: '15 Menit',
        biaya: 'Rp 0,- (Gratis)',
        outputDokumen: 'Tanda Terima Registrasi Pengaduan Resmi'
      }
    ]
  }
];

const PTSP_STORAGE_KEY = 'dilmilti5_db_ptsp_electronic_v1';

const INITIAL_PTSP_DB_STATE: PTSPDatabaseState = {
  version: 1,
  lastSyncAt: new Date().toISOString(),
  mysqlBridgeUrl: 'http://localhost/ptsp_dilmilti5/sync.php',
  mysqlBridgeEnabled: false,
  ptsp_applications: [
    {
      id: 'app-101',
      ticket_no: 'PTSP-20260925-0101',
      meja_id: 1,
      meja_nama: 'Meja 1: Kepaniteraan Pidana Militer',
      jenis_layanan: 'Permohonan Salinan Resmi & Petikan Putusan Pidana Militer / Koneksitas',
      kategori_pemohon: 'Oditur Militer',
      nama_pemohon: 'Mayor Chk Rahmat Hidayat, S.H.',
      nrp_nip_nik: '11040021980579',
      pangkat_golongan: 'Mayor Chk',
      kesatuan_instansi: 'Oditurat Militer Tinggi IV Makassar',
      no_wa: '081241008899',
      email: 'rahmat.oditur@tni.mil.id',
      nomor_perkara: '24-K/PMT.V/BDG/AD/VIII/2026',
      uraian_permohonan: 'Permohonan salinan resmi putusan banding yang telah berkekuatan hukum tetap (BHT) atas nama Terdakwa Serka Inf Dedi Kurniawan untuk kelengkapan administrasi eksekusi Oditurat.',
      berkas_nama: 'Surat_Permohonan_Otmilti_24K.pdf',
      berkas_size: '420 KB',
      status: 'Selesai',
      tahap_verifikasi: 4,
      catatan_petugas: 'Berkas persyaratan lengkap. Salinan resmi putusan telah diterbitkan dan ditandatangani secara elektronik (TTE BSrE-BSSN) oleh Panitera Dilmilti V Makassar.',
      petugas_verifikator: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
      reply_doc_id: 'rep-101',
      created_at: '2026-09-25 09:15 WITA',
      updated_at: '2026-09-25 10:05 WITA'
    },
    {
      id: 'app-102',
      ticket_no: 'PTSP-20260926-0102',
      meja_id: 2,
      meja_nama: 'Meja 2: Kepaniteraan Hukum',
      jenis_layanan: 'Surat Keterangan Tidak Pernah Dipidana (SKTPD) Prajurit TNI',
      kategori_pemohon: 'Prajurit TNI',
      nama_pemohon: 'Kapten Inf Andi Baso Pallawa, S.T.Han.',
      nrp_nip_nik: '11120014520889',
      pangkat_golongan: 'Kapten Inf',
      kesatuan_instansi: 'Kodam XIV/Hasanuddin',
      no_wa: '081355667788',
      email: 'andibaso.kodam14@tni.mil.id',
      nomor_perkara: '-',
      uraian_permohonan: 'Pengajuan Surat Keterangan Tidak Pernah Dijatuhi Hukuman Pidana Militer sebagai syarat administrasi seleksi Pendidikan Reguler (Dikreg) Seskoad TA 2026.',
      berkas_nama: 'Pengantar_Dansat_Seskoad_AndiBaso.pdf',
      berkas_size: '380 KB',
      status: 'Selesai',
      tahap_verifikasi: 4,
      catatan_petugas: 'Telah diperiksa pada buku register induk perkara pidana militer & SIPP. Pemohon bersih dari catatan pidana militer. Dokumen SKTPD ber-TTE siap diunduh.',
      petugas_verifikator: 'Mayor Chk Mahpul Saepuloh, S.H.',
      reply_doc_id: 'rep-102',
      created_at: '2026-09-26 08:40 WITA',
      updated_at: '2026-09-26 09:10 WITA'
    },
    {
      id: 'app-103',
      ticket_no: 'PTSP-20260927-0103',
      meja_id: 6,
      meja_nama: 'Meja 6: Informasi, Pengaduan & Posbakum',
      jenis_layanan: 'Permohonan Informasi Publik (PPID) sesuai SK KMA 2-144/KMA/SK/VIII/2022',
      kategori_pemohon: 'Penasihat Hukum',
      nama_pemohon: 'Dr. Muh. Ilham Arifin, S.H., M.H.',
      nrp_nip_nik: '7371120908820003',
      pangkat_golongan: 'Advokat / Penasihat Hukum',
      kesatuan_instansi: 'LBH Peradilan Militer Indonesia Timur',
      no_wa: '081144223344',
      email: 'ilham.lawfirm@gmail.com',
      nomor_perkara: '27-K/PMT.V/BDG/AL/IX/2026',
      uraian_permohonan: 'Permohonan informasi jadwal musyawarah majelis dan prosedur pengajuan tambahan alat bukti surat pada pemeriksaan tingkat banding.',
      berkas_nama: 'Surat_Kuasa_Khusus_27K.pdf',
      berkas_size: '512 KB',
      status: 'Sedang Diproses',
      tahap_verifikasi: 3,
      catatan_petugas: 'Berkas surat kuasa telah terverifikasi di Meja 6. Saat ini sedang dikoordinasikan dengan Panitera Muda Pidana.',
      petugas_verifikator: 'Afni Syafaatun, S.A.P., M.A.P.',
      created_at: '2026-09-27 08:20 WITA',
      updated_at: '2026-09-27 08:45 WITA'
    },
    {
      id: 'app-104',
      ticket_no: 'PTSP-20260927-0104',
      meja_id: 5,
      meja_nama: 'Meja 5: Perencanaan, TI & Pelaporan (PTIP)',
      jenis_layanan: 'Permintaan Data Statistik Perkara & Laporan Tahunan Pengadilan',
      kategori_pemohon: 'Masyarakat Umum',
      nama_pemohon: 'Andi Tenri Pada, S.H.',
      nrp_nip_nik: '7371105504990001',
      pangkat_golongan: 'Mahasiswa Pascasarjana Ilmu Hukum',
      kesatuan_instansi: 'Fakultas Hukum Universitas Hasanuddin',
      no_wa: '085299112233',
      email: 'anditenri.unhas@ac.id',
      nomor_perkara: '-',
      uraian_permohonan: 'Permohonan data statistik penyelesaian perkara banding pidana militer tahun 2024-2026 untuk bahan penelitian tesis.',
      berkas_nama: 'Surat_Pengantar_Dekan_FH_Unhas.pdf',
      berkas_size: '295 KB',
      status: 'Verifikasi Berkas',
      tahap_verifikasi: 2,
      catatan_petugas: 'Surat pengantar akademik diterima dan sedang diverifikasi oleh Kasubbag PTIP.',
      petugas_verifikator: 'Muhammad Imam S, S.H.',
      created_at: '2026-09-27 09:05 WITA',
      updated_at: '2026-09-27 09:15 WITA'
    }
  ],
  reply_documents: [
    {
      id: 'rep-101',
      ticket_no: 'PTSP-20260925-0101',
      nomor_surat_balasan: 'W5-Mil/142/HK.02.01/IX/2026',
      judul_dokumen: 'Salinan Resmi Petikan & Putusan Banding Perkara Nomor 24-K/PMT.V/BDG/AD/VIII/2026',
      isi_ringkas: 'Menerangkan bahwa perkara tingkat banding Nomor 24-K/PMT.V/BDG/AD/VIII/2026 telah diputus oleh Majelis Hakim Militer Tinggi Pengadilan Militer Tinggi V Makassar dengan amar putusan: Menguatkan Putusan Pengadilan Militer III-16 Makassar. Dokumen salinan resmi ini sah dan ditandatangani secara elektronik.',
      file_name: 'Salinan_Putusan_TTE_24K_PMT_V_2026.pdf',
      file_url: 'TTE-GENERATED-DOC',
      tte_signer_nama: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
      tte_signer_pangkat_nrp: 'Kolonel Kum NRP 524418',
      tte_signer_jabatan: 'Panitera Pengadilan Militer Tinggi V Makassar',
      tte_qr_hash: 'BSRE-BSSN-DILMILTI5-2026-99812A',
      uploaded_by: 'Mayor Chk Mahpul Saepuloh, S.H. (Meja 1)',
      created_at: '2026-09-25 10:05 WITA'
    },
    {
      id: 'rep-102',
      ticket_no: 'PTSP-20260926-0102',
      nomor_surat_balasan: 'W5-Mil/158/SK.HK/IX/2026',
      judul_dokumen: 'Surat Keterangan Tidak Pernah Dijatuhi Pidana Militer (SKTPD) a.n. Kapten Inf Andi Baso Pallawa, S.T.Han.',
      isi_ringkas: 'Kepala Pengadilan Militer Tinggi V Makassar menerangkan dengan sesungguhnya bahwa berdasarkan pemeriksaan Register Induk Perkara Pidana Militer dan Database SIPP, Prajurit TNI atas nama Kapten Inf Andi Baso Pallawa, S.T.Han. (NRP 11120014520889, Kesatuan Kodam XIV/Hasanuddin) TIDAK PERNAH dijatuhi hukuman pidana militer maupun sedang menjalani proses peradilan militer. Surat Keterangan ini diterbitkan untuk keperluan seleksi Dikreg Seskoad TA 2026.',
      file_name: 'SKTPD_TTE_Kapten_Andi_Baso_2026.pdf',
      file_url: 'TTE-GENERATED-DOC',
      tte_signer_nama: 'Kolonel Chk Sultan, S.H.',
      tte_signer_pangkat_nrp: 'Kolonel Chk NRP 11980017760771',
      tte_signer_jabatan: 'Wakadilmilti V Makassar',
      tte_qr_hash: 'BSRE-BSSN-DILMILTI5-2026-77431B',
      uploaded_by: 'Kapten Chk Rusjana, S.H. (Meja 2)',
      created_at: '2026-09-26 09:10 WITA'
    }
  ],
  queue_tickets: [
    {
      id: 'q-101',
      nomor_antrean: 'A-001',
      kode_loket: 'A',
      meja_id: 1,
      meja_nama: 'Meja 1: Kepaniteraan Pidana Militer',
      nama_pemohon: 'Mayor Chk Rahmat Hidayat, S.H.',
      kategori_pemohon: 'Oditur Militer',
      kesatuan_instansi: 'Oditurat Militer Tinggi IV Makassar',
      no_wa: '081241008899',
      keperluan: 'Penyerahan Memori Banding & Pengambilan Petikan Putusan',
      waktu_ambil: '08:15 WITA',
      estimasi_panggil: '08:20 WITA',
      status: 'Dipanggil',
      loket_tujuan: 'Loket Meja 1 (Kepaniteraan Pidana)',
      petugas_panggil: 'Mayor Chk Mahpul Saepuloh, S.H.',
      called_count: 2,
      updated_at: new Date().toISOString()
    },
    {
      id: 'q-102',
      nomor_antrean: 'B-001',
      kode_loket: 'B',
      meja_id: 2,
      meja_nama: 'Meja 2: Kepaniteraan Hukum',
      nama_pemohon: 'Kapten Inf Andi Baso Pallawa',
      kategori_pemohon: 'Prajurit TNI',
      kesatuan_instansi: 'Kodam XIV/Hasanuddin',
      no_wa: '081355667788',
      keperluan: 'Legalisasi Dokumen & Pengajuan SK Tidak Pernah Dipidana',
      waktu_ambil: '08:25 WITA',
      estimasi_panggil: '08:35 WITA',
      status: 'Menunggu',
      loket_tujuan: 'Loket Meja 2 (Kepaniteraan Hukum)',
      called_count: 0,
      updated_at: new Date().toISOString()
    },
    {
      id: 'q-103',
      nomor_antrean: 'C-001',
      kode_loket: 'C',
      meja_id: 3,
      meja_nama: 'Meja 3: Kesekretariatan / Umum & Keuangan',
      nama_pemohon: 'Serka Supriyadi',
      kategori_pemohon: 'Prajurit TNI',
      kesatuan_instansi: 'Denma Kodam XIV/Hasanuddin',
      no_wa: '081399887711',
      keperluan: 'Penyerahan Surat Masuk Kedinasan Resmi',
      waktu_ambil: '08:30 WITA',
      estimasi_panggil: '08:40 WITA',
      status: 'Menunggu',
      loket_tujuan: 'Loket Meja 3 (Umum & Keuangan)',
      called_count: 0,
      updated_at: new Date().toISOString()
    },
    {
      id: 'q-104',
      nomor_antrean: 'F-001',
      kode_loket: 'F',
      meja_id: 6,
      meja_nama: 'Meja 6: Informasi, Pengaduan & Posbakum',
      nama_pemohon: 'Ny. Siti Rahmawati',
      kategori_pemohon: 'Masyarakat Umum',
      kesatuan_instansi: 'Keluarga Prajurit Makassar',
      no_wa: '085299887766',
      keperluan: 'Konsultasi Hukum Gratis Posbakum & Prosedur Izin Besuk',
      waktu_ambil: '08:35 WITA',
      estimasi_panggil: '08:45 WITA',
      status: 'Menunggu',
      loket_tujuan: 'Loket Meja 6 (Informasi & Posbakum)',
      called_count: 0,
      updated_at: new Date().toISOString()
    }
  ],
  online_consultations: [
    {
      id: 'cons-101',
      room_code: 'V-PTSP-101',
      meja_id: 1,
      meja_nama: 'Meja 1: Kepaniteraan Pidana Militer',
      topik_konsultasi: 'Konsultasi Prosedur Pengajuan Memori Kasasi & Pemeriksaan Berkas (Inzage)',
      nama_pemohon: 'Lettu Laut (KH) Budi Santoso, S.H.',
      kategori_pemohon: 'Oditur / Perwira Hukum',
      nrp_nip_nik: '12140099880190',
      kesatuan_instansi: 'Diskum Kodaeral VI Makassar',
      no_wa: '081233445566',
      jadwal_tanggal: '2026-09-27',
      jadwal_jam: '09:00 WITA',
      status_ruang: 'Aktif Berlangsung',
      nama_petugas: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
      jabatan_petugas: 'Panitera Pengadilan Militer Tinggi V Makassar',
      notulensi_ringkasan: 'Pemohon berkonsultasi secara virtual mengenai tenggang waktu penyerahan memori kasasi setelah akta permohonan kasasi ditandatangani serta mekanisme pengiriman berkas elektronik melalui SIPP dan e-Berpadu.',
      notulensi_rekomendasi: '1. Memori kasasi wajib diajukan dalam tenggang waktu 14 (empat belas) hari setelah pernyataan kasasi.\n2. Berkas softcopy PDF diunggah melalui Meja 1 PTSP Online atau diserahkan melalui kepaniteraan pengadilan pengaju.',
      notulensi_signed: true,
      notulensi_signed_at: '27 September 2026, 09:25 WITA',
      notulensi_qr_hash: 'BA-KONSUL-VPTSP101-BSRE-2026',
      created_at: '2026-09-27 08:50 WITA'
    },
    {
      id: 'cons-102',
      room_code: 'V-PTSP-102',
      meja_id: 6,
      meja_nama: 'Meja 6: Informasi, Pengaduan & Posbakum',
      topik_konsultasi: 'Konsultasi Hukum Gratis Posbakum & Hak Bantuan Hukum Prajurit',
      nama_pemohon: 'Serda Inf Muh. Akbar',
      kategori_pemohon: 'Prajurit TNI',
      nrp_nip_nik: '21190044550399',
      kesatuan_instansi: 'Yonif 700/Wira Yudha Cakti',
      no_wa: '085344556677',
      jadwal_tanggal: '2026-09-27',
      jadwal_jam: '10:30 WITA',
      status_ruang: 'Aktif Berlangsung',
      nama_petugas: 'Afni Syafaatun, S.A.P., M.A.P.',
      jabatan_petugas: 'Kasubbag Kepegawaian dan Teknologi Informasi',
      notulensi_ringkasan: 'Konsultasi mengenai tata cara permohonan pendampingan hukum cuma-cuma (Posbakum) dan persyaratan administrasi yang harus disiapkan oleh prajurit.',
      notulensi_rekomendasi: 'Pemohon dapat melampirkan Surat Pengantar Kesatuan dan identitas KTA TNI melalui formulir pengajuan layanan Meja 6 PTSP Online.',
      notulensi_signed: false,
      created_at: '2026-09-27 10:15 WITA'
    }
  ],
  ptsp_room_streams: {
    'V-PTSP-101': {
      room_code: 'V-PTSP-101',
      callerFrame: null,
      callerMicOn: true,
      callerCamOn: true,
      callerName: 'Lettu Laut (KH) Budi Santoso, S.H.',
      callerUpdatedAt: 0,
      officerFrame: null,
      officerMicOn: true,
      officerCamOn: true,
      officerName: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
      officerUpdatedAt: 0
    }
  },
  ptsp_room_chats: [
    {
      id: 'chat-101',
      room_code: 'V-PTSP-101',
      sender_role: 'sistem',
      sender_name: 'Sistem e-PTSP Dilmilti V Makassar',
      message: 'Ruang Konsultasi Tatap Muka Online (Kode: V-PTSP-101) telah terhubung. Sinkronisasi Video 2 Arah & Riwayat Chat disimpan secara permanen di database.',
      timestamp: '09:00 WITA',
      created_at: '2026-09-27T01:00:00.000Z'
    },
    {
      id: 'chat-102',
      room_code: 'V-PTSP-101',
      sender_role: 'petugas',
      sender_name: 'Kolonel Kum M. Nirwan Said, S.H., M.H. (Petugas PTSP)',
      message: 'Selamat pagi Lettu Laut (KH) Budi Santoso. Selamat datang di layanan Konsultasi Virtual PTSP Pengadilan Militer Tinggi V Makassar. Kamera dan mikrofon kami sudah aktif, silakan sampaikan perihal yang ingin dikonsultasikan.',
      timestamp: '09:01 WITA',
      created_at: '2026-09-27T01:01:00.000Z'
    },
    {
      id: 'chat-103',
      room_code: 'V-PTSP-101',
      sender_role: 'pemohon',
      sender_name: 'Lettu Laut (KH) Budi Santoso, S.H. (Pemohon)',
      message: 'Selamat pagi Bapak Panitera. Terima kasih atas respons cepatnya. Izin berkonsultasi terkait batas akhir penyerahan memori kasasi dan tata cara pemeriksaan berkas (inzage) untuk perkara banding asal Dilmil III-16 Makassar.',
      timestamp: '09:02 WITA',
      created_at: '2026-09-27T01:02:00.000Z'
    },
    {
      id: 'chat-104',
      room_code: 'V-PTSP-101',
      sender_role: 'petugas',
      sender_name: 'Kolonel Kum M. Nirwan Said, S.H., M.H. (Petugas PTSP)',
      message: 'Baik Lettu Budi. Sesuai ketentuan UU No. 31 Tahun 1997 tentang Peradilan Militer, memori kasasi diserahkan selambat-lambatnya 14 hari sejak akta permohonan kasasi ditandatangani. Untuk Berita Acara Konsultasi hari ini juga telah kami buatkan dan tandatangani secara elektronik, silakan dicetak melalui tombol Cetak Berita Acara di samping.',
      timestamp: '09:04 WITA',
      created_at: '2026-09-27T01:04:00.000Z'
    },
    {
      id: 'chat-201',
      room_code: 'V-PTSP-102',
      sender_role: 'sistem',
      sender_name: 'Sistem e-PTSP Dilmilti V Makassar',
      message: 'Ruang Konsultasi Posbakum (Kode: V-PTSP-102) siap digunakan.',
      timestamp: '10:30 WITA',
      created_at: '2026-09-27T02:30:00.000Z'
    }
  ],
  tbl_users: [
    {
      id: 'u-1',
      username: 'superadmin',
      password: '123',
      nama_lengkap: 'Kolonel Chk Sultan, S.H.',
      nip_nrp: '11980017760771',
      pangkat_gol: 'Kolonel Chk',
      role: 'super_admin',
      meja_assigned: 0,
      jabatan: 'Wakadilmilti V Makassar',
      no_wa: '08114441010',
      status_aktif: true
    },
    {
      id: 'u-2',
      username: 'meja1',
      password: '123',
      nama_lengkap: 'Mayor Chk Mahpul Saepuloh, S.H.',
      nip_nrp: '21940135670972',
      pangkat_gol: 'Mayor Chk',
      role: 'petugas_meja',
      meja_assigned: 1,
      jabatan: 'Panmud Pidana (Meja 1: Kepaniteraan Pidana Militer)',
      no_wa: '08124445501',
      status_aktif: true
    },
    {
      id: 'u-3',
      username: 'meja2',
      password: '123',
      nama_lengkap: 'Kapten Chk Rusjana, S.H.',
      nip_nrp: '21020041120782',
      pangkat_gol: 'Kapten Chk',
      role: 'petugas_meja',
      meja_assigned: 2,
      jabatan: 'Panitera Pengganti (Meja 2: Kepaniteraan Hukum)',
      no_wa: '08124445502',
      status_aktif: true
    },
    {
      id: 'u-4',
      username: 'meja3',
      password: '123',
      nama_lengkap: 'Andi Adzan Mirzan, S.Kom., M.M.',
      nip_nrp: '198503092009041001',
      pangkat_gol: 'Pembina / Golongan IV/a',
      role: 'petugas_meja',
      meja_assigned: 3,
      jabatan: 'Kasubbag Tata Usaha dan Rumah Tangga (Meja 3)',
      no_wa: '08124445503',
      status_aktif: true
    },
    {
      id: 'u-5',
      username: 'meja4',
      password: '123',
      nama_lengkap: 'Afni Syafaatun, S.A.P., M.A.P.',
      nip_nrp: '199609182020122005',
      pangkat_gol: 'Penata Muda Tingkat I / Golongan III/b',
      role: 'petugas_meja',
      meja_assigned: 4,
      jabatan: 'Kasubbag Kepegawaian dan Teknologi Informasi (Meja 4)',
      no_wa: '08124445504',
      status_aktif: true
    },
    {
      id: 'u-6',
      username: 'meja5',
      password: '123',
      nama_lengkap: 'Muhammad Imam S, S.H.',
      nip_nrp: '199205302019031006',
      pangkat_gol: 'Penata Muda Tingkat I / Golongan III/b',
      role: 'petugas_meja',
      meja_assigned: 5,
      jabatan: 'Kasubbag Rencana Program dan Anggaran (Meja 5)',
      no_wa: '08124445505',
      status_aktif: true
    },
    {
      id: 'u-7',
      username: 'meja6',
      password: '123',
      nama_lengkap: 'Muhammad Faisal',
      nip_nrp: '31170636711196',
      pangkat_gol: 'Pratu',
      role: 'petugas_meja',
      meja_assigned: 6,
      jabatan: 'Pengadministrasi Perkantoran Sub Bagian Kepegawaian dan TI (Meja 6)',
      no_wa: '08124445506',
      status_aktif: true
    },
    {
      id: 'u-8',
      username: 'panitera',
      password: '123',
      nama_lengkap: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
      nip_nrp: '524418',
      pangkat_gol: 'Kolonel Kum',
      role: 'pejabat_struktural',
      meja_assigned: 0,
      jabatan: 'Panitera Pengadilan Militer Tinggi V Makassar',
      no_wa: '08124445566',
      status_aktif: true
    }
  ],
  tbl_satker: [
    {
      id: 'sat-1',
      kode_satker: '401988',
      nama_satker: 'Pengadilan Militer Tinggi V Makassar',
      tingkat: 'Tingkat Banding (Satker Induk)',
      wilayah_hukum: 'Sulawesi, Maluku, Maluku Utara, seluruh Tanah Papua',
      alamat: 'Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar Sulawesi Selatan 90122',
      telepon: '(0411) 441234',
      kepala_satker: 'Kolonel Chk Sultan, S.H.',
      status_koneksi: 'Server Utama Aktif'
    },
    {
      id: 'sat-2',
      kode_satker: '663112',
      nama_satker: 'Pengadilan Militer III-16 Makassar',
      tingkat: 'Tingkat Pertama',
      wilayah_hukum: 'Sulawesi Selatan, Sulawesi Barat, Sulawesi Tenggara',
      alamat: 'Jl. Urip Sumoharjo KM. 7 Makassar, Sulawesi Selatan',
      telepon: '(0411) 442345',
      kepala_satker: 'Kolonel Chk Muhammad Saleh, S.H., M.H.',
      status_koneksi: 'Terhubung Online'
    },
    {
      id: 'sat-3',
      kode_satker: '663129',
      nama_satker: 'Pengadilan Militer III-17 Manado',
      tingkat: 'Tingkat Pertama',
      wilayah_hukum: 'Sulawesi Utara, Sulawesi Tengah, Gorontalo',
      alamat: 'Jl. Raya Manado - Bitung, Minahasa Utara, Sulawesi Utara',
      telepon: '(0431) 881234',
      kepala_satker: 'Letkol Chk Dedi Setiawan, S.H., M.H.',
      status_koneksi: 'Terhubung Online'
    },
    {
      id: 'sat-4',
      kode_satker: '663133',
      nama_satker: 'Pengadilan Militer III-18 Ambon',
      tingkat: 'Tingkat Pertama',
      wilayah_hukum: 'Provinsi Maluku dan Maluku Utara',
      alamat: 'Jl. Dr. Malaihollo Air Salobar, Nusaniwe, Kota Ambon',
      telepon: '(0911) 341567',
      kepala_satker: 'Letkol Laut (H) Hendro Wibowo, S.H.',
      status_koneksi: 'Terhubung Online'
    },
    {
      id: 'sat-5',
      kode_satker: '663140',
      nama_satker: 'Pengadilan Militer III-19 Jayapura',
      tingkat: 'Tingkat Pertama',
      wilayah_hukum: 'Provinsi Papua, Papua Barat, Papua Tengah, Papua Selatan, Papua Pegunungan, Papua Barat Daya',
      alamat: 'Jl. Sam Ratulangi No. 19 Dok V Atas, Kota Jayapura',
      telepon: '(0967) 532198',
      kepala_satker: 'Kolonel Chk Kurniawan, S.H., M.H.',
      status_koneksi: 'Terhubung Online'
    }
  ],
  tbl_pejabat: [
    {
      id: 'pej-1',
      urutan: 1,
      nama_pejabat: 'Sultan, S.H.',
      pangkat_korps: 'Kolonel Chk',
      nrp_nip: '11980017760771',
      jabatan: 'Wakadilmilti V Makassar',
      kategori: 'Pimpinan',
      matra: 'TNI AD',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-2',
      urutan: 2,
      nama_pejabat: 'Sugeng Aryanto, S.H., M.H.',
      pangkat_korps: 'Kolonel Chk',
      nrp_nip: '11980058680275',
      jabatan: 'Hakim Militer Tinggi',
      kategori: 'Hakim Militer Tinggi',
      matra: 'TNI AD',
      status_kehadiran: 'Sidang Majelis'
    },
    {
      id: 'pej-3',
      urutan: 3,
      nama_pejabat: 'Agus Husin, S.H., M.H.',
      pangkat_korps: 'Kolonel Chk',
      nrp_nip: '636562',
      jabatan: 'Hakim Militer Tinggi',
      kategori: 'Hakim Militer Tinggi',
      matra: 'TNI AD',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-4',
      urutan: 4,
      nama_pejabat: 'Mustofa, S.H., M.H.',
      pangkat_korps: 'Kolonel Kum',
      nrp_nip: '524423',
      jabatan: 'Hakim Militer Tinggi',
      kategori: 'Hakim Militer Tinggi',
      matra: 'TNI AU',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-5',
      urutan: 5,
      nama_pejabat: 'M. Nirwan Said, S.H., M.H.',
      pangkat_korps: 'Kolonel Kum',
      nrp_nip: '524418',
      jabatan: 'Panitera',
      kategori: 'Kepaniteraan',
      matra: 'TNI AU',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-6',
      urutan: 6,
      nama_pejabat: 'Mahpul Saepuloh, S.H.',
      pangkat_korps: 'Mayor Chk',
      nrp_nip: '21940135670972',
      jabatan: 'Panmud Pidana',
      kategori: 'Kepaniteraan',
      matra: 'TNI AD',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-7',
      urutan: 7,
      nama_pejabat: 'Rusjana, S.H.',
      pangkat_korps: 'Kapten Chk',
      nrp_nip: '21020041120782',
      jabatan: 'Panitera Pengganti',
      kategori: 'Kepaniteraan',
      matra: 'TNI AD',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-8',
      urutan: 8,
      nama_pejabat: 'Muhammad Arfah Afendi, S.E., M.M.',
      pangkat_korps: 'Pembina Tingkat I / Golongan IV/b',
      nrp_nip: '197611302006041002',
      jabatan: 'Kabag Perencanaan dan Kepegawaian',
      kategori: 'Kesekretariatan',
      matra: 'ASN MA-RI',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-9',
      urutan: 9,
      nama_pejabat: 'Herna Dian Prihatiny Napan, S.T.',
      pangkat_korps: 'Pembina / Golongan IV/a',
      nrp_nip: '198509022009122004',
      jabatan: 'Kabag Umum dan Keuangan',
      kategori: 'Kesekretariatan',
      matra: 'ASN MA-RI',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-10',
      urutan: 10,
      nama_pejabat: 'Andi Adzan Mirzan, S.Kom., M.M.',
      pangkat_korps: 'Pembina / Golongan IV/a',
      nrp_nip: '198503092009041001',
      jabatan: 'Kasubbag Tata Usaha dan Rumah Tangga',
      kategori: 'Kesekretariatan',
      matra: 'ASN MA-RI',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-11',
      urutan: 11,
      nama_pejabat: 'Muhammad Imam S, S.H.',
      pangkat_korps: 'Penata Muda Tingkat I / Golongan III/b',
      nrp_nip: '199205302019031006',
      jabatan: 'Kasubbag Rencana Program dan Anggaran',
      kategori: 'Kesekretariatan',
      matra: 'ASN MA-RI',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-12',
      urutan: 12,
      nama_pejabat: 'Allen Farlianso, S.E.',
      pangkat_korps: 'Penata Muda Tingkat I / Golongan III/b',
      nrp_nip: '199406232020121004',
      jabatan: 'Kasubbag Keuangan dan Pelaporan',
      kategori: 'Kesekretariatan',
      matra: 'ASN MA-RI',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-13',
      urutan: 13,
      nama_pejabat: 'Afni Syafaatun, S.A.P., M.A.P.',
      pangkat_korps: 'Penata Muda Tingkat I / Golongan III/b',
      nrp_nip: '199609182020122005',
      jabatan: 'Kasubbag Kepegawaian dan Teknologi Informasi',
      kategori: 'Kesekretariatan',
      matra: 'ASN MA-RI',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-14',
      urutan: 14,
      nama_pejabat: 'Muhammad Adib Hadriansyah, S.E.',
      pangkat_korps: 'Penata Muda Tingkat I / Golongan III/b',
      nrp_nip: '199207192020121006',
      jabatan: 'Pranata Keuangan APBN Mahir',
      kategori: 'Kesekretariatan',
      matra: 'ASN MA-RI',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-15',
      urutan: 15,
      nama_pejabat: 'Nasriani',
      pangkat_korps: 'Penata Muda Tingkat I / Golongan III/b',
      nrp_nip: '197510131998032001',
      jabatan: 'Pengadministrasi Perkantoran Sub Bagian Keuangan dan Pelaporan',
      kategori: 'Kesekretariatan',
      matra: 'ASN MA-RI',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    },
    {
      id: 'pej-16',
      urutan: 16,
      nama_pejabat: 'Muhammad Faisal',
      pangkat_korps: 'Pratu',
      nrp_nip: '31170636711196',
      jabatan: 'Pengadministrasi Perkantoran Sub Bagian Kepegawaian dan Teknologi Informasi',
      kategori: 'Kesekretariatan',
      matra: 'TNI AD',
      status_kehadiran: 'Siap Dinas (Di Kantor)'
    }
  ]
};

class PTSPHybridDatabaseService {
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('dilmilti_db_updated', () => {
        this.notifyListeners();
      });
      window.addEventListener('storage', (e) => {
        if (e.key === PTSP_STORAGE_KEY) {
          this.notifyListeners();
        }
      });
    }
  }

  public getState(): PTSPDatabaseState {
    try {
      const raw = localStorage.getItem(PTSP_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(PTSP_STORAGE_KEY, JSON.stringify(INITIAL_PTSP_DB_STATE));
        return INITIAL_PTSP_DB_STATE;
      }
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_PTSP_DB_STATE,
        ...parsed,
        ptsp_applications: parsed.ptsp_applications?.length ? parsed.ptsp_applications : INITIAL_PTSP_DB_STATE.ptsp_applications,
        reply_documents: parsed.reply_documents?.length ? parsed.reply_documents : INITIAL_PTSP_DB_STATE.reply_documents,
        queue_tickets: parsed.queue_tickets?.length ? parsed.queue_tickets : INITIAL_PTSP_DB_STATE.queue_tickets,
        online_consultations: parsed.online_consultations?.length ? parsed.online_consultations : INITIAL_PTSP_DB_STATE.online_consultations,
        ptsp_room_streams: parsed.ptsp_room_streams || INITIAL_PTSP_DB_STATE.ptsp_room_streams,
        ptsp_room_chats: parsed.ptsp_room_chats?.length ? parsed.ptsp_room_chats : INITIAL_PTSP_DB_STATE.ptsp_room_chats,
        tbl_users: parsed.tbl_users?.length ? parsed.tbl_users : INITIAL_PTSP_DB_STATE.tbl_users,
        tbl_satker: parsed.tbl_satker?.length ? parsed.tbl_satker : INITIAL_PTSP_DB_STATE.tbl_satker,
        tbl_pejabat: parsed.tbl_pejabat?.length ? parsed.tbl_pejabat : INITIAL_PTSP_DB_STATE.tbl_pejabat
      };
    } catch {
      return INITIAL_PTSP_DB_STATE;
    }
  }

  public saveState(updater: (prev: PTSPDatabaseState) => PTSPDatabaseState, skipRemotePush = false): PTSPDatabaseState {
    const prev = this.getState();
    const next = updater(prev);
    next.version = (prev.version || 1) + 1;
    next.lastSyncAt = new Date().toISOString();

    try {
      localStorage.setItem(PTSP_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('[PTSP DB] LocalStorage quota warning:', e);
    }

    this.notifyListeners();

    if (!skipRemotePush) {
      this.pushToHybridBackend(next);
    }
    return next;
  }

  public async pushToHybridBackend(state: PTSPDatabaseState): Promise<void> {
    const payload = {
      key: PTSP_STORAGE_KEY,
      value: state,
      version: Date.now()
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      await queuePtspBackgroundSync(
        'SYNC_DB_STATE',
        `Sinkronisasi Offline Database PTSP (Versi #${state.version})`,
        payload,
        '/api/court-db'
      );
      return;
    }

    // 1. Push to Central CourtDB REST API (/api/court-db) for cross-device sync (PC Petugas <-> HP Pemohon)
    try {
      const res = await fetch('/api/court-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        await queuePtspBackgroundSync(
          'SYNC_DB_STATE',
          `Sinkronisasi Latar Belakang Database PTSP (Versi #${state.version})`,
          payload,
          '/api/court-db'
        );
      }
    } catch {
      await queuePtspBackgroundSync(
        'SYNC_DB_STATE',
        `Sinkronisasi Offline Database PTSP (Versi #${state.version})`,
        payload,
        '/api/court-db'
      );
    }

    // 2. If XAMPP / MySQL PHP Bridge is enabled, also push to sync.php
    if (state.mysqlBridgeEnabled && state.mysqlBridgeUrl) {
      try {
        await fetch(state.mysqlBridgeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'push_state',
            state: {
              applications: state.ptsp_applications,
              replyDocuments: state.reply_documents,
              queueTickets: state.queue_tickets,
              consultations: state.online_consultations,
              roomStreams: state.ptsp_room_streams,
              roomChats: state.ptsp_room_chats,
              users: state.tbl_users,
              satker: state.tbl_satker,
              pejabat: state.tbl_pejabat
            }
          })
        });
      } catch {
        // Ignore if local XAMPP is not reachable from current client
      }
    }
  }

  private lastPullTime = 0;

  public async pullFromHybridBackend(force = false): Promise<boolean> {
    const now = Date.now();
    if (!force && now - this.lastPullTime < 60000) {
      return false;
    }
    this.lastPullTime = now;
    try {
      const res = await fetch('/api/court-db');
      if (res.ok) {
        const json = await res.json();
        const remoteState = json?.data?.[PTSP_STORAGE_KEY] as PTSPDatabaseState | undefined;
        if (remoteState && typeof remoteState === 'object') {
          const local = this.getState();
          if ((remoteState.version || 0) >= (local.version || 0) || remoteState.lastSyncAt !== local.lastSyncAt) {
            localStorage.setItem(PTSP_STORAGE_KEY, JSON.stringify(remoteState));
            this.notifyListeners();
            return true;
          }
        }
      }
    } catch {
      // Fallback to local
    }
    return false;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  // ============================================================================
  // HELPER CRUD OPERATIONS FOR ALL 9 TABLES
  // ============================================================================

  public createApplication(input: Omit<PTSPApplicationItem, 'id' | 'ticket_no' | 'status' | 'tahap_verifikasi' | 'created_at' | 'updated_at'>): PTSPApplicationItem {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const ticketNo = `PTSP-${dateStr}-${rand}`;
    const timeFormatted = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)} WITA`;

    const newItem: PTSPApplicationItem = {
      ...input,
      id: `app-${Date.now()}`,
      ticket_no: ticketNo,
      status: 'Diajukan',
      tahap_verifikasi: 1,
      created_at: timeFormatted,
      updated_at: timeFormatted
    };

    this.saveState((prev) => ({
      ...prev,
      ptsp_applications: [newItem, ...prev.ptsp_applications]
    }));

    // Also sync to legacy CourtDB PTSP tickets so existing widgets see it
    try {
      CourtDB.addPTSPTicket({
        jenisLayanan: 'Inovasi Custom PTSP',
        namaPemohon: input.nama_pemohon,
        instansiKesatuan: input.kesatuan_instansi,
        nomorIdentitas: input.nrp_nip_nik,
        nomorWA: input.no_wa,
        emailPemohon: input.email,
        nomorPerkaraTerkait: input.nomor_perkara !== '-' ? input.nomor_perkara : undefined,
        catatanKeperluan: `[${input.meja_nama} - ${input.jenis_layanan}] ${input.uraian_permohonan}`
      });
    } catch {}

    return newItem;
  }

  public updateApplicationStatus(
    appId: string,
    status: PTSPApplicationItem['status'],
    catatanPetugas: string,
    petugasVerifikator: string,
    replyDoc?: Omit<PTSPReplyDocumentItem, 'id' | 'created_at'>
  ): void {
    const now = new Date();
    const timeFormatted = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)} WITA`;
    const tahapMap: Record<PTSPApplicationItem['status'], 1 | 2 | 3 | 4> = {
      'Diajukan': 1,
      'Verifikasi Berkas': 2,
      'Sedang Diproses': 3,
      'Selesai': 4,
      'Ditolak': 4
    };

    this.saveState((prev) => {
      let createdReplyId: string | undefined = undefined;
      let nextReplies = [...prev.reply_documents];

      if (replyDoc) {
        createdReplyId = `rep-${Date.now()}`;
        const newReply: PTSPReplyDocumentItem = {
          ...replyDoc,
          id: createdReplyId,
          created_at: timeFormatted
        };
        nextReplies = [newReply, ...nextReplies.filter((r) => r.ticket_no !== replyDoc.ticket_no)];
      }

      const nextApps = prev.ptsp_applications.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status,
          tahap_verifikasi: tahapMap[status] || 2,
          catatan_petugas: catatanPetugas,
          petugas_verifikator: petugasVerifikator,
          reply_doc_id: createdReplyId || app.reply_doc_id,
          updated_at: timeFormatted
        };
      });

      return {
        ...prev,
        ptsp_applications: nextApps,
        reply_documents: nextReplies
      };
    });
  }

  public createQueueTicket(input: {
    meja_id: number;
    nama_pemohon: string;
    kategori_pemohon: string;
    kesatuan_instansi: string;
    no_wa: string;
    keperluan: string;
  }): PTSPQueueTicketItem {
    const meja = KATALOG_6_MEJA_PTSP.find((m) => m.mejaId === input.meja_id) || KATALOG_6_MEJA_PTSP[0];
    const state = this.getState();
    const existingForMeja = state.queue_tickets.filter((q) => q.meja_id === meja.mejaId);
    const nextNum = existingForMeja.length + 1;
    const nomorAntrean = `${meja.kodeAntrean}-${String(nextNum).padStart(3, '0')}`;

    const now = new Date();
    const waktuAmbil = `${now.toTimeString().slice(0, 5)} WITA`;
    const estDate = new Date(now.getTime() + 10 * 60000);
    const estimasiPanggil = `${estDate.toTimeString().slice(0, 5)} WITA`;

    const ticket: PTSPQueueTicketItem = {
      id: `q-${Date.now()}`,
      nomor_antrean: nomorAntrean,
      kode_loket: meja.kodeAntrean,
      meja_id: meja.mejaId,
      meja_nama: meja.namaMeja,
      nama_pemohon: input.nama_pemohon,
      kategori_pemohon: input.kategori_pemohon,
      kesatuan_instansi: input.kesatuan_instansi || 'Umum / TNI',
      no_wa: input.no_wa || '-',
      keperluan: input.keperluan,
      waktu_ambil: waktuAmbil,
      estimasi_panggil: estimasiPanggil,
      status: 'Menunggu',
      loket_tujuan: `Loket Meja ${meja.mejaId}`,
      called_count: 0,
      updated_at: now.toISOString()
    };

    this.saveState((prev) => ({
      ...prev,
      queue_tickets: [ticket, ...prev.queue_tickets]
    }));

    return ticket;
  }

  public updateQueueStatus(
    queueId: string,
    status: PTSPQueueTicketItem['status'],
    petugasPanggil?: string
  ): PTSPQueueTicketItem | null {
    let updatedItem: PTSPQueueTicketItem | null = null;
    this.saveState((prev) => ({
      ...prev,
      queue_tickets: prev.queue_tickets.map((q) => {
        if (q.id !== queueId) return q;
        updatedItem = {
          ...q,
          status,
          petugas_panggil: petugasPanggil || q.petugas_panggil,
          called_count: status === 'Dipanggil' ? (q.called_count || 0) + 1 : q.called_count,
          updated_at: new Date().toISOString()
        };
        return updatedItem;
      })
    }));
    return updatedItem;
  }

  public createConsultationRoom(input: {
    meja_id: number;
    topik_konsultasi: string;
    nama_pemohon: string;
    kategori_pemohon: string;
    nrp_nip_nik: string;
    kesatuan_instansi: string;
    no_wa: string;
    jadwal_tanggal: string;
    jadwal_jam: string;
  }): PTSPOnlineConsultationItem {
    const meja = KATALOG_6_MEJA_PTSP.find((m) => m.mejaId === input.meja_id) || KATALOG_6_MEJA_PTSP[5];
    const randCode = Math.floor(103 + Math.random() * 890);
    const roomCode = `V-PTSP-${randCode}`;
    const now = new Date();

    const newRoom: PTSPOnlineConsultationItem = {
      id: `cons-${Date.now()}`,
      room_code: roomCode,
      meja_id: meja.mejaId,
      meja_nama: meja.namaMeja,
      topik_konsultasi: input.topik_konsultasi,
      nama_pemohon: input.nama_pemohon,
      kategori_pemohon: input.kategori_pemohon,
      nrp_nip_nik: input.nrp_nip_nik || '-',
      kesatuan_instansi: input.kesatuan_instansi || 'Umum / TNI',
      no_wa: input.no_wa,
      jadwal_tanggal: input.jadwal_tanggal,
      jadwal_jam: input.jadwal_jam,
      status_ruang: 'Aktif Berlangsung',
      nama_petugas: meja.petugasJaga,
      jabatan_petugas: `Petugas ${meja.namaMeja}`,
      notulensi_signed: false,
      created_at: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)} WITA`
    };

    const sysChat: PTSPRoomChatItem = {
      id: `chat-${Date.now()}`,
      room_code: roomCode,
      sender_role: 'sistem',
      sender_name: 'Sistem e-PTSP Dilmilti V Makassar',
      message: `Ruang Konsultasi Virtual (${roomCode}) untuk ${meja.namaMeja} telah dibuat atas nama ${input.nama_pemohon}. Silakan aktifkan kamera atau kirim pesan chat.`,
      timestamp: `${now.toTimeString().slice(0, 5)} WITA`,
      created_at: now.toISOString()
    };

    this.saveState((prev) => ({
      ...prev,
      online_consultations: [newRoom, ...prev.online_consultations],
      ptsp_room_chats: [...prev.ptsp_room_chats, sysChat],
      ptsp_room_streams: {
        ...prev.ptsp_room_streams,
        [roomCode]: {
          room_code: roomCode,
          callerFrame: null,
          callerMicOn: true,
          callerCamOn: true,
          callerName: input.nama_pemohon,
          callerUpdatedAt: Date.now(),
          officerFrame: null,
          officerMicOn: true,
          officerCamOn: true,
          officerName: meja.petugasJaga,
          officerUpdatedAt: 0
        }
      }
    }));

    return newRoom;
  }

  public addRoomChat(roomCode: string, senderRole: 'pemohon' | 'petugas' | 'sistem', senderName: string, message: string): PTSPRoomChatItem {
    const now = new Date();
    const chat: PTSPRoomChatItem = {
      id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      room_code: roomCode.toUpperCase(),
      sender_role: senderRole,
      sender_name: senderName,
      message,
      timestamp: `${now.toTimeString().slice(0, 5)} WITA`,
      created_at: now.toISOString()
    };

    this.saveState((prev) => ({
      ...prev,
      ptsp_room_chats: [...prev.ptsp_room_chats, chat]
    }));

    return chat;
  }

  public updateRoomStream(
    roomCode: string,
    role: 'pemohon' | 'petugas',
    payload: { frame?: string | null; micOn?: boolean; camOn?: boolean; participantName?: string }
  ): void {
    const code = roomCode.toUpperCase();
    this.saveState((prev) => {
      const existing = prev.ptsp_room_streams[code] || {
        room_code: code,
        callerFrame: null,
        callerMicOn: true,
        callerCamOn: true,
        callerUpdatedAt: 0,
        officerFrame: null,
        officerMicOn: true,
        officerCamOn: true,
        officerUpdatedAt: 0
      };

      const nextStream: PTSPRoomStreamState =
        role === 'pemohon'
          ? {
              ...existing,
              callerFrame: payload.frame !== undefined ? payload.frame : existing.callerFrame,
              callerMicOn: payload.micOn !== undefined ? payload.micOn : existing.callerMicOn,
              callerCamOn: payload.camOn !== undefined ? payload.camOn : existing.callerCamOn,
              callerName: payload.participantName || existing.callerName,
              callerUpdatedAt: Date.now()
            }
          : {
              ...existing,
              officerFrame: payload.frame !== undefined ? payload.frame : existing.officerFrame,
              officerMicOn: payload.micOn !== undefined ? payload.micOn : existing.officerMicOn,
              officerCamOn: payload.camOn !== undefined ? payload.camOn : existing.officerCamOn,
              officerName: payload.participantName || existing.officerName,
              officerUpdatedAt: Date.now()
            };

      return {
        ...prev,
        ptsp_room_streams: {
          ...prev.ptsp_room_streams,
          [code]: nextStream
        }
      };
    });
  }

  public saveConsultationMinutes(
    roomCode: string,
    ringkasan: string,
    rekomendasi: string,
    namaPetugas: string,
    jabatanPetugas: string
  ): void {
    const now = new Date();
    const signedAt = `${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}, ${now.toTimeString().slice(0, 5)} WITA`;
    const qrHash = `BA-KONSUL-${roomCode.replace(/[^A-Z0-9]/g, '')}-BSRE-${Date.now().toString().slice(-5)}`;

    this.saveState((prev) => ({
      ...prev,
      online_consultations: prev.online_consultations.map((c) => {
        if (c.room_code.toUpperCase() !== roomCode.toUpperCase()) return c;
        return {
          ...c,
          status_ruang: 'Selesai & Berita Acara Terbit',
          nama_petugas: namaPetugas,
          jabatan_petugas: jabatanPetugas,
          notulensi_ringkasan: ringkasan,
          notulensi_rekomendasi: rekomendasi,
          notulensi_signed: true,
          notulensi_signed_at: signedAt,
          notulensi_qr_hash: qrHash
        };
      })
    }));
  }
}

export const PTSPDB = new PTSPHybridDatabaseService();
