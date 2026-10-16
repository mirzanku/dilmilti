import { 
  OFFICIAL_PERSONNEL_INITIAL, 
  INITIAL_USER_ACCOUNTS, 
  INITIAL_SLIDES,
  INITIAL_SATKER_STRUCTURE,
  INITIAL_REFORMASI_EVIDEN,
  DEFAULT_POPUP_CONFIG,
  DEFAULT_WHATSAPP_FOONTE_CONFIG,
  DEFAULT_ECOURT_CONTENT,
  INITIAL_AUDIT_LOGS,
  INITIAL_PTSP_QUEUE,
  INITIAL_PTSP_TICKETS,
  INITIAL_PTSP_APP_CONFIG,
  INITIAL_COURT_IDENTITY,
  DEFAULT_SAKIP_DIPA_DOCS
} from './courtDatabase';
import { INITIAL_PERKARA_SIPP, INITIAL_JADWAL_SIDANG } from './sippData';
import { 
  SAMPLE_DIP_ITEMS, 
  SAMPLE_NEWS_ITEMS,
  JURISDICTION_COURTS as DEFAULT_JURISDICTION_COURTS,
  RELATED_WEBSITES as DEFAULT_RELATED_WEBSITES
} from './contentData';
import { DEFAULT_MENU_CONTENTS } from './defaultMenuContents';
import { DEFAULT_DOCUMENT_TEMPLATES } from './defaultTemplatesData';

const DEFAULT_ROLE_MODEL_AGENTS = [
  {
    id: 'rm-1',
    tipe: 'Role Model',
    nama: 'Kolonel Chk Sultan, S.H.',
    jabatan: 'Wakil Kepala Pengadilan Militer Tinggi V Makassar',
    pangkatNip: 'Kolonel Chk / NRP 11980017760771',
    komitmenKerja: 'Menjadi teladan integritas, kepemimpinan transformatif, penegakan disiplin prajurit, dan transparansi publik.',
    kontribusiReformasi: 'Memimpin pembangunan Zona Integritas (ZI) menuju WBBM dan implementasi Sistem Manajemen Anti Penyuapan (SMAP ISO 37001).',
    rencanaProgramKerja: 'Penguatan pengawasan internal, peningkatan kepuasan masyarakat pencari keadilan, dan digitalisasi layanan peradilan.',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ap-1',
    tipe: 'Agen Perubahan',
    nama: 'Letkol Chk S. Haryanto, S.H., M.H.',
    jabatan: 'Panitera Pengadilan Militer Tinggi V Makassar',
    pangkatNip: 'Letkol Chk / NRP 11020023410882',
    komitmenKerja: 'Mendorong inovasi layanan kepaniteraan digital berbasis e-Court, MonEksTUN, dan PTSP Online.',
    kontribusiReformasi: 'Penyusunan SOP PTSP 6 Meja dan percepatan penyelesaian perkara banding.',
    rencanaProgramKerja: 'Pengembangan Portal E-Brosur interaktif, layanan publik inklusif disabilitas, dan edukasi publik.',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  }
];

const DEFAULT_PUBLIC_COMPENSATION_INFO = {
  judul: 'Kompensasi Pelayanan Apabila Tidak Sesuai Maklumat Standar Layanan',
  deskripsi: 'Pengadilan Militer Tinggi V Makassar memberikan kompensasi berupa permohonan maaf tertulis, prioritas pendampingan khusus, dan souvenir layanan jika standar jam pelayanan terlewati.',
  syaratKlaim: [
    'Petugas melebih batasan waktu standar pelayanan tanpa alasan teknis resmi.',
    'Pemohon menyampaikan keluhan resmi ke Petugas Meja Pengaduan / PTSP.'
  ],
  bentukKompensasi: [
    'Surat Permohonan Maaf Resmi dari Kepala Satuan Kerja.',
    'Souvernir / Merchandise Resmi Pengadilan Militer Tinggi V Makassar.',
    'Pengayoman dan Jalur Bebas Hambatan (Fast-Track) pada kunjungan berikutnya.'
  ]
};

const DEFAULT_SIDANG_LUAR_GEDUNG_INFO = {
  judul: 'Pelaksanaan Sidang di Luar Gedung / Sidang Keliling Peradilan Militer',
  deskripsi: 'Penyelenggaraan persidangan perkara militer di wilayah hukum luar kota (Ambon, Jayapura, Manado) guna mendekatkan keadilan bagi satuan tugas TNI.',
  jadwalDanLokasi: [
    { lokasi: 'Pengadilan Militer III-16 Makassar', periode: 'Triwulan I & III', keterangan: 'Pemeriksaan saksi & terdakwa daerah perbatasan.' },
    { lokasi: 'Pengadilan Militer III-18 Ambon', periode: 'Triwulan II & IV', keterangan: 'Sidang keliling perkara perbatasan laut.' }
  ]
};

const DEFAULT_BROSUR_DIGITAL = [
  {
    id: 'brosur-1',
    judul: 'E-Brosur Standar Pelayanan PTSP Dilmilti V Makassar',
    kategori: 'Pelayanan Publik',
    deskripsi: 'Panduan lengkap jam kerja, syarat permohonan, biaya e-Court, dan kontak pengaduan.',
    fileUrl: 'https://dilmilti5-makassar.go.id/dokumen/e-brosur-ptsp-2026.pdf',
    coverUrl: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&auto=format&fit=crop&q=80',
    tanggalUpdate: '2026-09-20'
  },
  {
    id: 'brosur-2',
    judul: 'Panduan Hak-Hak Tersangka, Terdakwa & Terpidana Militer',
    kategori: 'Bantuan Hukum',
    deskripsi: 'Brosur edukasi hak pendampingan hukum Posbakum, pengajuan upaya hukum banding & PK.',
    fileUrl: 'https://dilmilti5-makassar.go.id/dokumen/e-brosur-hak-terdakwa.pdf',
    coverUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400&auto=format&fit=crop&q=80',
    tanggalUpdate: '2026-09-20'
  }
];

const DEFAULT_WEBSITE_MONEV_REPORTS = [
  {
    id: 'monev-tw3-2026',
    judulLaporan: 'Laporan Monitoring dan Evaluasi Website Triwulan III Tahun 2026',
    periode: 'Triwulan III',
    tahun: '2026',
    satker: 'Pengadilan Militer Tinggi V Makassar',
    tanggalLaporan: '10 Oktober 2026',
    ketuaSatker: 'Kolonel Chk Sultan, S.H. (Wakadilmilti V)',
    pembuatLaporan: 'Prada / Staf TIK Dilmilti V',
    jabatanPembuat: 'Pengelola Teknologi Informasi',
    pendahuluanUmum: 'Dalam rangka memenuhi prinsip transparansi dan keterbukaan informasi publik sebagaimana diatur dalam SK Dirjen Badilmiltun No. 593/DJMT/SK.TI2.1.1/VII/2026, Pengadilan Militer Tinggi V Makassar melaksanakan Monitoring dan Evaluasi Website secara berkala.',
    pendahuluanDasar: '1. UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik;\n2. SK KMA No. 2-144/KMA/SK/VIII/2022 tentang Standar Pelayanan Informasi Publik;\n3. SK Dirjen Badilmiltun No. 593/DJMT/SK.TI2.1.1/VII/2026.',
    pendahuluanTujuan: 'Memastikan keterbukaan informasi, kecepatan akses (uptime >= 99%), kelengkapan menu standar, dan aksesibilitas bagi masyarakat pencari keadilan dan difabel.',
    pendahuluanRuangLingkup: 'Pemantauan harian, bulanan, dan triwulanan terhadap ketersediaan server, fungsionalitas tautan, pemutakhiran berita, fitur disabilitas, dan kepatuhan standar W3C/WCAG.',
    kegiatanLaksana: '1. Pemeriksaan harian uptime website dan server Cloud Run (100% aktif).\n2. Verifikasi tautan SIPP, e-Court, Dirput, SIWAS, dan MonEksTUN.\n3. Pengujian fitur aksesibilitas tunanetra & low vision (screen reader, high contrast).\n4. Pemutakhiran konten berita resmi dan agenda persidangan.',
    temuanMonev: 'Seluruh menu standar sesuai SK 593/2026 telah diimplementasikan dengan baik. Kecepatan muat halaman rata-rata 1.2 detik (dibawah standar batas 3 detik). Uptime mencapai 99.98%.',
    tindakLanjut: 'Secara rutin melakukan pemutakhiran konten berita pelayanan, pemeliharaan cadangan database bulanan, dan pemantauan tautan eksternal.',
    hasilDiCapai: 'Website Pengadilan Militer Tinggi V Makassar telah 100% mematuhi pedoman standardisasi SK Dirjen Badilmiltun No. 593/DJMT/SK.TI2.1.1/VII/2026.',
    penutup: 'Demikian Laporan Monitoring dan Evaluasi Website Triwulan III Tahun 2026 disampaikan sebagai bahan pertimbangan dan evaluasi keberlanjutan.',
    status: 'Final / Terkirim'
  }
];

const DEFAULT_SURVEI_REPORTS = [
  {
    id: 'survei-ikm-tw3',
    jenisSurvei: 'IKM',
    periode: 'Triwulan III',
    tahun: '2026',
    nilaiSkor: 3.94,
    jumlahResponden: 185,
    linkPengisian: 'https://survei.djmt.id/dilmilti_makassar',
    fileReportUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Hasil_Survei_IKM_IPAK_TW1_2026.pdf',
    fileTindakLanjutUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Hasil_Survei_IKM_IPAK_TW1_2026.pdf'
  },
  {
    id: 'survei-ipak-tw3',
    jenisSurvei: 'IPAK',
    periode: 'Triwulan III',
    tahun: '2026',
    nilaiSkor: 3.97,
    jumlahResponden: 185,
    linkPengisian: 'https://survei.djmt.id/dilmilti_makassar',
    fileReportUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Hasil_Survei_IKM_IPAK_TW1_2026.pdf',
    fileTindakLanjutUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Hasil_Survei_IKM_IPAK_TW1_2026.pdf'
  }
];

export function getInitialCentralDb(): Record<string, any> {
  return {
    dilmilti5_db_personnel_v2: OFFICIAL_PERSONNEL_INITIAL,
    dilmilti5_db_users_v2: INITIAL_USER_ACCOUNTS,
    dilmilti5_db_news_v2: SAMPLE_NEWS_ITEMS,
    dilmilti5_db_sipp_v2: INITIAL_PERKARA_SIPP,
    dilmilti5_db_jadwal_v2: INITIAL_JADWAL_SIDANG,
    dilmilti5_db_dip_v2: SAMPLE_DIP_ITEMS,
    dilmilti5_db_audit_logs_v2: INITIAL_AUDIT_LOGS,
    dilmilti5_db_ptsp_queue_v2: INITIAL_PTSP_QUEUE,
    dilmilti5_db_ptsp_tickets_v2: INITIAL_PTSP_TICKETS,
    dilmilti5_db_ptsp_config_v2: INITIAL_PTSP_APP_CONFIG,
    dilmilti5_db_satker_structure_v2: INITIAL_SATKER_STRUCTURE,
    dilmilti5_db_related_websites_v2: DEFAULT_RELATED_WEBSITES,
    dilmilti5_db_court_identity_v2: INITIAL_COURT_IDENTITY,
    dilmilti5_db_jurisdiction_courts_v2: DEFAULT_JURISDICTION_COURTS,
    dilmilti5_db_reformasi_eviden_v2: INITIAL_REFORMASI_EVIDEN,
    dilmilti5_db_popup_config_v2: DEFAULT_POPUP_CONFIG,
    dilmilti5_db_whatsapp_config_v2: DEFAULT_WHATSAPP_FOONTE_CONFIG,
    dilmilti5_db_slides_v2: INITIAL_SLIDES,
    dilmilti5_db_ecourt_content_v2: DEFAULT_ECOURT_CONTENT,
    dilmilti5_db_role_models_v2: DEFAULT_ROLE_MODEL_AGENTS,
    dilmilti5_db_compensation_info_v2: DEFAULT_PUBLIC_COMPENSATION_INFO,
    dilmilti5_db_sidang_luar_v2: DEFAULT_SIDANG_LUAR_GEDUNG_INFO,
    dilmilti5_db_brosur_digital_v2: DEFAULT_BROSUR_DIGITAL,
    dilmilti5_db_menu_contents_v2: DEFAULT_MENU_CONTENTS,
    dilmilti5_db_sakip_dipa_docs_v2: DEFAULT_SAKIP_DIPA_DOCS,
    dilmilti5_db_document_templates_v2: DEFAULT_DOCUMENT_TEMPLATES,
    dilmilti5_db_website_monev_v2: DEFAULT_WEBSITE_MONEV_REPORTS,
    dilmilti5_db_survei_reports_v2: DEFAULT_SURVEI_REPORTS
  };
}

