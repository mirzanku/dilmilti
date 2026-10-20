import { 
  PersonnelItem, 
  UserAccount, 
  NewsItem, 
  NewsCommentItem,
  PerkaraSIPP, 
  JadwalSidangItem, 
  DIPItem, 
  AuditLogItem,
  PTSPQueueItem,
  PTSPServiceTicket,
  PTSPInnovationAppConfig,
  SatkerStructureItem,
  RelatedWebsiteItem,
  CourtIdentityData,
  JurisdictionCourtItem,
  ReformasiEvidenItem,
  PopupAnnouncementConfig,
  WhatsAppFoonteConfig,
  MakassarSlide,
  ECourtPageContent,
  ECourtCaseTypeItem,
  ECourtDocRequirementItem,
  ECourtProcedureStepItem,
  ECourtLegalBasisItem,
  ECourtPrincipleItem,
  ECourtPaymentRuleItem,
  ECourtPartnerBankItem,
  ECourtLitigationStepItem,
  WebsiteMonevReportItem,
  RoleModelAndAgentItem,
  PublicCompensationInfo,
  SidangLuarGedungInfo,
  SurveiReportItem,
  BrosurDigitalItem,
  MenuContentItem,
  SakipDipaDocumentItem,
  DocumentTemplateItem,
  InovasiQuickAccessItem,
  QuickAccessItem
} from '../types';
import { DEFAULT_MENU_CONTENTS } from './defaultMenuContents';
import { DEFAULT_DOCUMENT_TEMPLATES } from './defaultTemplatesData';
import { compressImage } from '../utils/imageHelper';
const bannerMakassar = '/images/makassar_court_banner_1789442426023.jpg';
const bannerPtsp = '/images/ptsp_makassar_banner_1789442442546.jpg';
const bannerMaklumat = '/images/maklumat_banner_1789442457863.jpg';
import { INITIAL_PERKARA_SIPP, INITIAL_JADWAL_SIDANG } from './sippData';
import { 
  SAMPLE_DIP_ITEMS, 
  SAMPLE_NEWS_ITEMS,
  COURT_IDENTITY as DEFAULT_COURT_IDENTITY,
  JURISDICTION_COURTS as DEFAULT_JURISDICTION_COURTS,
  RELATED_WEBSITES as DEFAULT_RELATED_WEBSITES
} from './contentData';

export function cleanPageNumberReferences(text: string | undefined): string {
  if (!text) return '';
  return text
    // Remove phrases like "(24 DOKUMEN WAJIB - HAL. 975-976)" -> "(24 DOKUMEN WAJIB)"
    .replace(/\s*\(\s*(\d+\s+DOKUMEN\s+WAJIB)\s*-\s*(?:HAL|Halaman)\.?\s*[\d\s\-,&]+\)/gi, ' ($1)')
    // Remove phrases like "(HAL. 940 & 991)" or "(Halaman 935, 975-980 & 988-993)"
    .replace(/\s*\(\s*(?:HAL|Halaman)\.?\s*[\d\s\-,&]+\)/gi, '')
    // Remove standalone "HAL. 975-976" or "Hal. 985 & 993" or "Halaman 935-940"
    .replace(/\s*(?:HAL|Halaman)\.?\s*\d+[\d\s\-,&]*/gi, '')
    .trim();
}

// KUNCI STORAGE LOKAL
const STORAGE_KEYS = {
  PERSONNEL: 'dilmilti5_db_personnel_v2',
  USERS: 'dilmilti5_db_users_v2',
  CURRENT_USER: 'dilmilti5_auth_session_v2',
  NEWS: 'dilmilti5_db_news_v2',
  SIPP: 'dilmilti5_db_sipp_v2',
  JADWAL: 'dilmilti5_db_jadwal_v2',
  DIP: 'dilmilti5_db_dip_v2',
  AUDIT: 'dilmilti5_db_audit_logs_v2',
  PTSP_QUEUE: 'dilmilti5_db_ptsp_queue_v2',
  PTSP_TICKETS: 'dilmilti5_db_ptsp_tickets_v2',
  PTSP_APP_CONFIG: 'dilmilti5_db_ptsp_config_v2',
  SATKER_STRUCTURE: 'dilmilti5_db_satker_structure_v2',
  RELATED_WEBSITES: 'dilmilti5_db_related_websites_v2',
  COURT_IDENTITY: 'dilmilti5_db_court_identity_v2',
  JURISDICTION_COURTS: 'dilmilti5_db_jurisdiction_courts_v2',
  REFORMASI_EVIDEN: 'dilmilti5_db_reformasi_eviden_v2',
  POPUP_CONFIG: 'dilmilti5_db_popup_config_v2',
  WHATSAPP_CONFIG: 'dilmilti5_db_whatsapp_config_v2',
  SLIDES: 'dilmilti5_db_slides_v2',
  ECOURT_CONTENT: 'dilmilti5_db_ecourt_content_v2',
  WEBSITE_MONEV: 'dilmilti5_db_website_monev_v2',
  ROLE_MODEL_AGENTS: 'dilmilti5_db_role_models_v2',
  COMPENSATION_INFO: 'dilmilti5_db_compensation_info_v2',
  SIDANG_LUAR_GEDUNG: 'dilmilti5_db_sidang_luar_v2',
  SURVEI_REPORTS: 'dilmilti5_db_survei_reports_v2',
  BROSUR_DIGITAL: 'dilmilti5_db_brosur_digital_v2',
  MENU_CONTENTS: 'dilmilti5_db_menu_contents_v2',
  SAKIP_DIPA_DOCS: 'dilmilti5_db_sakip_dipa_docs_v2',
  DOCUMENT_TEMPLATES: 'dilmilti5_db_document_templates_v2',
  INOVASI_QUICK_ACCESS: 'dilmilti5_db_inovasi_quick_access_v1',
  QUICK_ACCESS_MAIN: 'dilmilti5_db_quick_access_main_v2'
};

export const INITIAL_QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: 'btn-quick-ptsp',
    label: 'PTSP Online',
    fullName: 'Pelayanan Terpadu Satu Pintu Elektronik',
    desc: 'Layanan 6 Meja PTSP, permohonan informasi, SKTPD, antrean & konsultasi',
    color: 'from-[#072617] via-[#0D4227] to-[#051B10]',
    borderColor: 'border-amber-400',
    iconName: 'Swords',
    militaryIconName: 'Swords',
    badge: 'PTSP MILITER',
    section: 'ptsp-inovasi',
    subTab: 'app-viewer',
    externalUrl: 'https://dilmilti5-makassar.go.id/?portal=ptsp-online',
    domain: 'ptsp.dilmilti5-makassar.go.id',
    instansi: 'PTSP Pengadilan Militer Tinggi V Makassar',
    urutan: 1,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-sipp',
    label: 'SIPP',
    fullName: 'Sistem Informasi Penelusuran Perkara',
    desc: 'Penelusuran berkas, status perkara & amar putusan',
    color: 'from-[#072617] via-[#0B3A23] to-[#04170E]',
    borderColor: 'border-amber-400/50',
    iconName: 'Scale',
    militaryIconName: 'Swords',
    badge: 'LAYANAN UTAMA',
    section: 'sipp',
    externalUrl: 'https://sipp.dilmilti-makassar.go.id/list_perkara/',
    domain: 'sipp.dilmilti-makassar.go.id',
    instansi: 'Pengadilan Militer Tinggi V Makassar',
    urutan: 2,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-uu31',
    label: 'UU No. 31/1997',
    fullName: 'Undang-Undang Peradilan Militer (UU No. 31 Tahun 1997)',
    desc: 'Pedoman Hukum Acara Pidana Militer, Kompetensi & Prosedur Sidang',
    color: 'from-[#072617] via-[#0D4227] to-[#051B10]',
    borderColor: 'border-amber-400/50',
    iconName: 'BookOpen',
    militaryIconName: 'Crosshair',
    badge: 'UU 31/1997',
    section: 'hukum',
    subTab: 'uu-31-1997',
    externalUrl: '#',
    domain: 'dilmilti5-makassar.go.id',
    instansi: 'Pengadilan Militer Tinggi V Makassar',
    urutan: 3,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-dirput',
    label: 'Direktori Putusan',
    fullName: 'Direktori Putusan Mahkamah Agung RI',
    desc: 'Publikasi salinan resmi putusan perkara pidana militer',
    color: 'from-[#072617] via-[#0B3A23] to-[#04170E]',
    borderColor: 'border-amber-400/50',
    iconName: 'BookOpen',
    militaryIconName: 'Shield',
    badge: 'PUTUSAN',
    section: 'informasi-publik',
    subTab: 'putusan',
    externalUrl: 'https://putusan3.mahkamahagung.go.id/',
    domain: 'putusan3.mahkamahagung.go.id',
    instansi: 'Kepaniteraan Mahkamah Agung RI',
    urutan: 4,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-siwas',
    label: 'SIWAS MA RI',
    fullName: 'Sistem Informasi Pengawasan MA RI',
    desc: 'Whistleblowing System pengaduan kode etik & disiplin',
    color: 'from-[#072617] via-[#0D4227] to-[#051B10]',
    borderColor: 'border-amber-400/50',
    iconName: 'ShieldAlert',
    militaryIconName: 'ShieldAlert',
    badge: 'WBS MA-RI',
    section: 'layanan-publik',
    subTab: 'siwas',
    externalUrl: 'https://siwas.mahkamahagung.go.id/',
    domain: 'siwas.mahkamahagung.go.id',
    instansi: 'Badan Pengawasan MA-RI',
    urutan: 5,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-jadwal',
    label: 'Jadwal Sidang',
    fullName: 'Informasi Agenda Persidangan Harian',
    desc: 'Jadwal sidang perkara militer, ruang sidang & majelis hakim',
    color: 'from-[#072617] via-[#0B3A23] to-[#04170E]',
    borderColor: 'border-amber-400/50',
    iconName: 'CalendarClock',
    militaryIconName: 'Target',
    badge: 'REAL-TIME',
    section: 'jadwal-sidang',
    externalUrl: 'https://sipp.dilmilti-makassar.go.id/list_jadwal_sidang',
    domain: 'sipp.dilmilti-makassar.go.id',
    instansi: 'Pengadilan Militer Tinggi V Makassar',
    urutan: 6,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-esurvei',
    label: 'E-Survei',
    fullName: 'Portal E-Survei Ditjen Badilmiltun',
    desc: 'Survei IKM & IPAK elektronik mandiri masyarakat pencari keadilan',
    color: 'from-[#072617] via-[#0B3A23] to-[#04170E]',
    borderColor: 'border-amber-400/50',
    iconName: 'BarChart3',
    militaryIconName: 'Award',
    badge: 'E-SURVEI',
    section: 'layanan-publik',
    subTab: 'survei',
    externalUrl: 'https://survei.djmt.id/dilmilti_makassar',
    domain: 'survei.djmt.id/dilmilti_makassar',
    instansi: 'Ditjen Badilmiltun MA-RI',
    urutan: 7,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-jdih',
    label: 'JDIH',
    fullName: 'Jaringan Dokumentasi & Informasi Hukum',
    desc: 'Database regulasi, Perma, SEMA, SK KMA dan yurisprudensi',
    color: 'from-[#072617] via-[#0B3A23] to-[#04170E]',
    borderColor: 'border-amber-400/50',
    iconName: 'BookOpen',
    militaryIconName: 'Shield',
    badge: 'JDIH MA-RI',
    section: 'layanan-hukum',
    subTab: 'tata-cara',
    externalUrl: 'https://jdih.mahkamahagung.go.id/',
    domain: 'jdih.mahkamahagung.go.id',
    instansi: 'Biro Hukum & Humas MA-RI',
    urutan: 9,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-ppid',
    label: 'PPID',
    fullName: 'Pejabat Pengelola Informasi & Dokumentasi',
    desc: 'Layanan keterbukaan informasi publik sesuai SK KMA 2-144',
    color: 'from-[#072617] via-[#0B3A23] to-[#04170E]',
    borderColor: 'border-amber-400/50',
    iconName: 'Info',
    militaryIconName: 'Shield',
    badge: 'SK KMA 2-144',
    section: 'informasi-publik',
    subTab: 'ppid',
    externalUrl: 'https://ppid.mahkamahagung.go.id/',
    domain: 'ppid.mahkamahagung.go.id',
    instansi: 'PPID Pengadilan Militer Tinggi V Makassar',
    urutan: 10,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-eberpadu',
    label: 'e-Berpadu',
    fullName: 'Elektronik Berkas Pidana Terpadu',
    desc: 'Pelimpahan berkas perkara elektronik Oditurat Militer ke Pengadilan',
    color: 'from-[#072617] via-[#0D4227] to-[#051B10]',
    borderColor: 'border-amber-400/50',
    iconName: 'Laptop',
    militaryIconName: 'Crosshair',
    badge: 'E-BERPADU',
    section: 'layanan-publik',
    subTab: 'jenis-layanan',
    externalUrl: 'https://eberpadu.mahkamahagung.go.id/',
    domain: 'eberpadu.mahkamahagung.go.id',
    instansi: 'Mahkamah Agung RI & TNI',
    urutan: 11,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-posbakum',
    label: 'Posbakum',
    fullName: 'Pos Bantuan Hukum Pengadilan',
    desc: 'Konsultasi hukum gratis, pembuatan dokumen & layanan prodeo',
    color: 'from-[#072617] via-[#0D4227] to-[#051B10]',
    borderColor: 'border-amber-400/50',
    iconName: 'HeartHandshake',
    militaryIconName: 'Shield',
    badge: 'BEBAS BIAYA',
    section: 'layanan-hukum',
    subTab: 'posbakum',
    externalUrl: 'https://ditjenmiltun.mahkamahagung.go.id/',
    domain: 'ditjenmiltun.mahkamahagung.go.id',
    instansi: 'Posbakum Dilmilti V Makassar',
    urutan: 12,
    status: 'Aktif'
  },
  {
    id: 'btn-quick-dokumen',
    label: 'Template Dokumen',
    fullName: 'Unduh Formulir & Template Surat Permohonan',
    desc: 'Format surat permohonan informasi, keberatan, posbakum & Buku II MA-RI',
    color: 'from-[#072617] via-[#0D4227] to-[#051B10]',
    borderColor: 'border-amber-400/50',
    iconName: 'FileText',
    militaryIconName: 'Crosshair',
    badge: 'BUKU II MA-RI',
    section: 'dokumen',
    subTab: 'arsip-dokumen',
    externalUrl: 'https://badilmiltun.mahkamahagung.go.id/',
    domain: 'Arsip Formulir & SOP Pengadilan',
    instansi: 'Pengadilan Militer Tinggi V Makassar',
    urutan: 13,
    status: 'Aktif'
  }
];

export const INITIAL_INOVASI_QUICK_ACCESS: InovasiQuickAccessItem[] = [
  {
    id: 'inovasi-qa-ptsp-online',
    namaAplikasi: 'PTSP Online',
    namaLengkap: 'Pelayanan Terpadu Satu Pintu (PTSP) Online Dilmilti V',
    deskripsi: 'Layanan mandiri pengajuan permohonan informasi, legalisasi salinan putusan, SKTPD, izin penelitian, serta informasi 6 Meja PTSP.',
    badge: 'PTSP ONLINE',
    kategori: 'Pelayanan Publik Terpadu',
    urlTujuan: 'https://ptsp.dilmilti5-makassar.go.id',
    domainLabel: 'ptsp.dilmilti5-makassar.go.id',
    instansi: 'PTSP Pengadilan Militer Tinggi V Makassar',
    internalSection: 'ptsp-online' as any,
    internalSubTab: 'app-viewer',
    bukaTabBaru: false,
    iconName: 'DoorOpen',
    status: 'Aktif',
    urutan: 1,
    updatedAt: '2026-09-27'
  },
  {
    id: 'inovasi-qa-cuti-online',
    namaAplikasi: 'Cuti Online',
    namaLengkap: 'Sistem Pengajuan Cuti & Izin Pegawai Elektronik (e-Cuti / SIKEP)',
    deskripsi: 'Aplikasi pengajuan cuti tahunan, cuti sakit, cuti alasan penting, dan izin keluar kantor secara elektronik berjenjang bagi Hakim, Prajurit TNI & ASN.',
    badge: 'E-CUTI & SDM',
    kategori: 'Inovasi Kepegawaian & SDM',
    urlTujuan: 'https://sikep.mahkamahagung.go.id/',
    domainLabel: 'sikep.mahkamahagung.go.id / e-cuti',
    instansi: 'Subbag Kepegawaian & TI Dilmilti V Makassar',
    internalSection: 'tentang',
    internalSubTab: 'profil-pegawai',
    bukaTabBaru: true,
    iconName: 'CalendarCheck',
    status: 'Aktif',
    urutan: 2,
    updatedAt: '2026-09-27'
  },
  {
    id: 'inovasi-qa-notif-wa',
    namaAplikasi: 'Notifikasi WhatsApp',
    namaLengkap: 'Sistem Notifikasi Perkara & Sidang Real-Time via WhatsApp (WA REWAKO)',
    deskripsi: 'Notifikasi otomatis jadwal sidang H-1, panggilan persidangan, status perkara banding militer, dan info amar putusan langsung ke WhatsApp.',
    badge: 'WA REAL-TIME',
    kategori: 'Inovasi Kepaniteraan & Sidang',
    urlTujuan: 'https://wa.me/6281144405554',
    domainLabel: 'Notifikasi WA Gateway Dilmilti V',
    instansi: 'Kepaniteraan Pengadilan Militer Tinggi V Makassar',
    internalSection: 'whatsapp',
    bukaTabBaru: false,
    iconName: 'MessageSquareCode',
    status: 'Aktif',
    urutan: 3,
    updatedAt: '2026-09-27'
  },
  {
    id: 'inovasi-qa-eberpadu',
    namaAplikasi: 'e-BERPADU',
    namaLengkap: 'Elektronik Berkas Pidana Terpadu Mahkamah Agung RI',
    deskripsi: 'Integrasi pelimpahan berkas perkara pidana militer elektronik, izin penyitaan/penggeledahan, perpanjangan penahanan & izin besuk tahanan.',
    badge: 'E-BERPADU MA-RI',
    kategori: 'Inovasi Administrasi Pidana',
    urlTujuan: 'https://eberpadu.mahkamahagung.go.id/',
    domainLabel: 'eberpadu.mahkamahagung.go.id',
    instansi: 'Mahkamah Agung RI & Aparat Penegak Hukum Militer',
    internalSection: 'publik',
    bukaTabBaru: true,
    iconName: 'Laptop',
    status: 'Aktif',
    urutan: 4,
    updatedAt: '2026-09-27'
  }
];

export const DEFAULT_ECOURT_CONTENT: ECourtPageContent = {
  header: {
    badge: 'LAYANAN PERKARA ELEKTRONIK',
    dasarHukum: 'Perma No. 1/2019 jo Perma No. 7/2022',
    instansi: 'Mahkamah Agung Republik Indonesia',
    judul: 'Layanan e-Court Terintegrasi Penuh',
    deskripsi: 'Mempermudah alur administrasi perkara hukum militer: Pendaftaran Permohonan Banding (e-Filing), Pembayaran Panjar (e-Payment), Panggilan Elektronik ke Kesatuan (e-Summons), dan Persidangan Elektronik (e-Litigation).',
    portalUrl: 'https://ecourt.mahkamahagung.go.id/',
    portalButtonText: 'Portal Resmi e-Court MA-RI',
    panduanUrl: 'https://ecourt.mahkamahagung.go.id/panduan',
    panduanButtonText: 'Buku Panduan Pengguna',
    pemberitahuanResmi: 'Pemberitahuan Resmi: Aplikasi e-Court dikelola dan berpusat secara nasional di Mahkamah Agung Republik Indonesia. Seluruh proses pendaftaran perkara, pembayaran, panggilan sidang, dan persidangan elektronik diselenggarakan langsung melalui sistem terpusat ecourt.mahkamahagung.go.id.',
    badgeTerpusat: 'Terpusat MA-RI'
  },
  overview: {
    judul: 'Mengenal Aplikasi e-Court Mahkamah Agung Republik Indonesia',
    subjudul: 'Transformasi peradilan modern berbasis teknologi informasi menuju peradilan berkelas dunia',
    penjelasanUmum: 'e-Court adalah layanan bagi Pengguna Terdaftar dan Pengguna Lainnya untuk pendaftaran perkara secara online, mendapatkan taksiran panjar biaya perkara secara online, pembayaran secara online, pemanggilan yang dilakukan dengan saluran elektronik, dan persidangan secara online yang diselenggarakan oleh Mahkamah Agung Republik Indonesia untuk seluruh 4 (empat) lingkungan peradilan di Indonesia, termasuk Lingkungan Peradilan Militer.',
    dasarHukumList: [
      { id: 'hukum-1', nomorRegulasi: 'Perma No. 1 Tahun 2019', tentang: 'Administrasi Perkara dan Persidangan di Pengadilan Secara Elektronik.' },
      { id: 'hukum-2', nomorRegulasi: 'Perma No. 7 Tahun 2022', tentang: 'Perubahan atas Perma No. 1 Tahun 2019 tentang Administrasi Perkara dan Persidangan Elektronik.' },
      { id: 'hukum-3', nomorRegulasi: 'SK KMA No. 129/KMA/SK/VIII/2019', tentang: 'Petunjuk Teknis Administrasi Perkara dan Persidangan Secara Elektronik.' },
      { id: 'hukum-4', nomorRegulasi: 'SK KMA No. 359/KMA/SK/XII/2022', tentang: 'Petunjuk Teknis Administrasi dan Persidangan Elektronik Pengadilan.' }
    ],
    prinsipList: [
      { id: 'prinsip-1', judul: 'Cepat, Sederhana, dan Biaya Ringan', deskripsi: 'Memangkas jarak geografis wilayah hukum militer Indonesia Timur.' },
      { id: 'prinsip-2', judul: 'Transparansi & Akuntabilitas', deskripsi: 'Berkas perkara dan jadwal tersinkronisasi otomatis dengan SIPP.' },
      { id: 'prinsip-3', judul: 'Keamanan Data Kedinasan', deskripsi: 'Pengamanan relaas dan dokumen resmi dengan sertifikat digital BSrE BSSN.' },
      { id: 'prinsip-4', judul: 'Aksesibilitas Prajurit', deskripsi: 'Memudahkan satuan tugas operasi TNI dalam pemeriksaan saksi jarak jauh.' }
    ]
  },
  efiling: {
    judul: 'e-Filing: Pendaftaran Perkara Secara Elektronik',
    subjudul: 'Panduan pengajuan perkara hukum banding militer, peninjauan kembali, dan sengketa TUN melalui sistem terpusat Mahkamah Agung RI',
    urlDaftarPortal: 'https://ecourt.mahkamahagung.go.id/',
    daftarJenisPerkara: [
      {
        id: 'jp-1',
        tingkat: 'Tingkat Banding',
        nama: 'Permohonan Banding Pidana Militer',
        deskripsi: 'Pemeriksaan ulang putusan pengadilan militer tingkat pertama asal: Dilmil III-16 Makassar, Dilmil III-17 Manado, Dilmil III-18 Ambon, dan Dilmil III-19 Jayapura.'
      },
      {
        id: 'jp-2',
        tingkat: 'Tingkat Pertama',
        nama: 'Sengketa Tata Usaha Militer (TUN)',
        deskripsi: 'Gugatan terhadap Keputusan Tata Usaha Militer (KTUM) pejabat militer yang merugikan prajurit di wilayah hukum Makassar dan Indonesia Timur.'
      },
      {
        id: 'jp-3',
        tingkat: 'Upaya Luar Biasa',
        nama: 'Permohonan Peninjauan Kembali (PK)',
        deskripsi: 'Penerimaan berkas permohonan PK militer berdasarkan novum (bukti baru) untuk diteruskan ke Mahkamah Agung Republik Indonesia di Jakarta.'
      }
    ],
    daftarDokumen: [
      {
        id: 'dok-1',
        urutan: 1,
        nama: '1. Akta / Permohonan',
        deskripsi: 'Akta permohonan banding resmi dari pengadilan militer asal atau surat gugatan TUN.',
        format: 'PDF (Maks. 10MB)'
      },
      {
        id: 'dok-2',
        urutan: 2,
        nama: '2. Memori Banding / Gugatan',
        deskripsi: 'Dokumen memori banding pemohon atau replik/posita gugatan yang ditandatangani.',
        format: 'PDF (Maks. 10MB)'
      },
      {
        id: 'dok-3',
        urutan: 3,
        nama: '3. Salinan Putusan Tk. I',
        deskripsi: 'Salinan resmi putusan Pengadilan Militer tingkat pertama yang diajukan upaya hukum.',
        format: 'PDF (Maks. 10MB)'
      },
      {
        id: 'dok-4',
        urutan: 4,
        nama: '4. Surat Kuasa / Perintah',
        deskripsi: 'Surat Kuasa Khusus Advokat atau Surat Perintah Penugasan Babinkum/Kumdam TNI.',
        format: 'PDF (Maks. 10MB)'
      }
    ],
    alurLangkah: [
      {
        id: 'step-1',
        stepNumber: 1,
        judul: 'Login ke Akun e-Court',
        deskripsi: 'Buka https://ecourt.mahkamahagung.go.id/ lalu masuk menggunakan email dan kata sandi akun terverifikasi.',
        urlLink: 'https://ecourt.mahkamahagung.go.id/'
      },
      {
        id: 'step-2',
        stepNumber: 2,
        judul: 'Pilih Menu Pendaftaran Perkara & Satuan Kerja Tujuan',
        deskripsi: 'Pilih kategori lingkungan peradilan militer, lalu pilih satuan kerja tujuan PENGADILAN MILITER TINGGI V MAKASSAR.'
      },
      {
        id: 'step-3',
        stepNumber: 3,
        judul: 'Isi Data Para Pihak & Unggah Dokumen',
        deskripsi: 'Lengkapi identitas pemohon, kesatuan kedinasan militer, kuasa hukum, serta unggah dokumen berkas elektronik bertandatangan format PDF.'
      },
      {
        id: 'step-4',
        stepNumber: 4,
        judul: 'Penerbitan Nomor Registrasi & Verifikasi Meja 1',
        deskripsi: 'Sistem menerbitkan nomor pendaftaran online. Petugas Meja 1 Kepaniteraan Dilmilti V Makassar memverifikasi kelengkapan administrasi dalam SLA 1x24 jam.'
      }
    ]
  },
  epayment: {
    judul: 'e-Payment: Pembayaran Panjar Biaya Perkara Secara Elektronik',
    subjudul: 'Mekanisme Surat Kuasa Untuk Membayar (e-SKUM) dan Nomor Virtual Account bank mitra Mahkamah Agung RI',
    ketentuanBiaya: [
      {
        id: 'biaya-1',
        kategori: 'Perkara Pidana Militer Murni (Banding / PK)',
        judul: 'Perkara Pidana Militer Murni (Banding / PK):',
        deskripsi: 'Sesuai Pasal 248 UU No. 31 Tahun 1997 tentang Peradilan Militer dan prinsip hukum acara militer, biaya perkara pidana militer pada dasarnya dibebankan kepada negara (beban dinas), kecuali putusan akhir hakim menentukan lain. Tidak dipungut panjar biaya pendaftaran awal.'
      },
      {
        id: 'biaya-2',
        kategori: 'Perkara Sengketa Tata Usaha Militer (TUN)',
        judul: 'Perkara Sengketa Tata Usaha Militer (TUN):',
        deskripsi: 'Penggugat dikenakan panjar biaya perkara sesuai taksiran elektronik e-SKUM yang mencakup biaya pendaftaran PNBP, biaya pemberitahuan/panggilan para pihak, meterai elektronik, dan hak redaksi putusan.'
      }
    ],
    daftarBank: [
      { id: 'bank-1', namaBank: 'Bank BRI', layananVa: 'BRIVA e-Court' },
      { id: 'bank-2', namaBank: 'Bank BNI', layananVa: 'Virtual Account BNI' },
      { id: 'bank-3', namaBank: 'Bank Mandiri', layananVa: 'Mandiri Bill Payment' }
    ],
    catatanOtomatisasi: 'Setelah pembayaran Virtual Account berhasil, status pembayaran pada sistem SIPP otomatis berubah menjadi "Lunas" tanpa perlu mengunggah bukti transfer manual.'
  },
  esummons: {
    judul: 'e-Summons: Panggilan Sidang Secara Elektronik',
    subjudul: 'Pengiriman relaas panggilan resmi ke alamat surat elektronik kedinasan militer dan domisili elektronik terdaftar',
    poinPanggilan: [
      { id: 'summons-1', judul: 'Panggilan Cepat & Tepat Sasaran', deskripsi: 'Relaas panggilan dikirim langsung melalui sistem e-Court ke alamat surat elektronik (email) yang telah disetujui saat pendaftaran perkara.' },
      { id: 'summons-2', judul: 'Keabsahan Hukum & Keamanan', deskripsi: 'Setiap relaas panggilan dilengkapi dengan kode QR dan barcode verifikasi sertifikat elektronik resmi Badan Siber dan Sandi Negara (BSrE BSSN).' },
      { id: 'summons-3', judul: 'Pemberitahuan ke Kesatuan TNI', deskripsi: 'Untuk terdakwa prajurit TNI, surat pemberitahuan dan panggilan sidang diteruskan secara resmi kepada Komandan Satuan / Ankum bersangkutan.' }
    ],
    ketentuanPanggilan: 'Berdasarkan ketentuan Pasal 17 Perma No. 7 Tahun 2022, panggilan yang dikirimkan ke domisili elektronik para pihak dianggap telah diterima secara sah seketika setelah sistem mencatat riwayat pengiriman berhasil, tanpa terhalang kendala geografis antar-pulau di wilayah hukum Indonesia Timur.'
  },
  elitigation: {
    judul: 'e-Litigation: Persidangan Elektronik & Teleconference Jarak Jauh',
    subjudul: 'Proses beracara daring mencakup pertukaran dokumen persidangan hingga teleconference pemeriksaan saksi tugas operasi',
    tahapanPersidangan: [
      { id: 'lit-1', tahap: 'Tahap 1', judul: '1. Penyampaian Jawaban & Replik', deskripsi: 'Para pihak mengunggah berkas jawaban, tanggapan memori banding, atau replik sesuai jadwal kalender sidang.' },
      { id: 'lit-2', tahap: 'Tahap 2', judul: '2. Penyampaian Duplik & Pembuktian Dokumen', deskripsi: 'Pengunggahan duplik dan daftar alat bukti surat berformat PDF yang telah dilegalisasi e-Meterai.' },
      { id: 'lit-3', tahap: 'Tahap 3', judul: '3. Penyampaian Kesimpulan Akhir', deskripsi: 'Para pihak mengunggah kesimpulan akhir sebelum majelis hakim mengadakan musyawarah putusan.' },
      { id: 'lit-4', tahap: 'Tahap 4', judul: '4. Pembacaan & Penyampaian Salinan Putusan', deskripsi: 'Amar putusan dibacakan dan salinan resmi putusan elektronik dapat diunduh langsung para pihak.' }
    ],
    ruangSidangVirtual: {
      judul: 'Ruang Sidang Virtual Kartika (Dilmilti V Makassar)',
      deskripsi: 'Pengadilan Militer Tinggi V Makassar menyediakan ruang sidang teleconference berstandar Mahkamah Agung untuk memfasilitasi:',
      fasilitas: [
        'Pemeriksaan saksi militer yang sedang bertugas di daerah operasi (Papua, Maluku, perbatasan).',
        'Pemeriksaan terdakwa yang ditahan di instalasi tahanan militer di luar kota Makassar.',
        'Koordinasi persidangan antar-satuan kerja peradilan militer tingkat pertama se-Indonesia Timur.'
      ],
      catatanTeleconference: 'Tautan ruang teleconference (Zoom/Cisco Webex resmi MA-RI) dikirimkan secara aman oleh panitera pengganti kepada para pihak melalui surat panggilan resmi.'
    }
  },
  bantuan: {
    judul: 'Pusat Bantuan, Registrasi Akun & Meja e-Court',
    subjudul: 'Layanan pendampingan langsung bagi prajurit, advokat, dan masyarakat di kantor Dilmilti V Makassar',
    urlBukuPanduan: 'https://ecourt.mahkamahagung.go.id/panduan',
    kategoriAkun: [
      { id: 'akun-1', judul: 'Pengguna Terdaftar (Advokat):', deskripsi: 'Advokat yang telah memiliki KTA aktif dari organisasi advokat yang diakui dan telah diverifikasi oleh Pengadilan Tinggi / Mahkamah Agung RI. Pendaftaran akun dilakukan mandiri melalui portal e-Court MA-RI.' },
      { id: 'akun-2', judul: 'Pengguna Lainnya (Satker TNI / Odil / Perorangan):', deskripsi: 'Dinas Hukum Angkatan (Babinkum TNI, Kumdam, Diskumau, Diskumal), Oditur Militer (Otmilti / Otmil), perorangan prajurit, atau badan hukum. Aktivasi akun dapat dibantu di Meja e-Court PTSP Dilmilti V Makassar.' }
    ],
    mejaEcourt: {
      lokasi: 'Ruang PTSP Dilmilti V Makassar',
      alamat: 'Jl. Urip Sumoharjo KM 7, Makassar',
      jamLayananSeninKamis: 'Senin – Kamis: 08.00 – 16.30 WITA',
      jamLayananJumat: 'Jumat: 08.00 – 17.00 WITA',
      noWhatsapp: '0811-4440-5554',
      namaHelpdesk: 'Kepaniteraan Dilmilti V Makassar'
    }
  },
  updatedAt: new Date().toLocaleDateString('id-ID')
};

export const DEFAULT_WHATSAPP_FOONTE_CONFIG: WhatsAppFoonteConfig = {
  isActive: true,
  foonteApiToken: 'f3k8_Foonte_Token_DILMILTI5_2026_xYz987',
  senderNumber: '081245678900 (Foonte Official Gateway Dilmilti V)',
  deviceStatus: 'Terhubung',
  autoNotifSidangH1: true,
  autoNotifStatusPerkara: true,
  autoNotifAmarPutusan: true,
  autoNotifPermohonanPpid: true,
  autoNotifPengaduanSiwas: true,
  customHeaderTemplate: '*[PENGADILAN MILITER TINGGI V MAKASSAR - NOTIFIKASI OTOMATIS]*',
  updatedAt: new Date().toLocaleDateString('id-ID')
};

export const DEFAULT_POPUP_CONFIG: PopupAnnouncementConfig = {
  id: 'popup-main-1',
  isActive: true,
  badge: 'PENGUMUMAN RESMI & MAKLUMAT PELAYANAN',
  title: 'Selamat Datang di Portal Resmi Pengadilan Militer Tinggi V Makassar',
  subtitle: 'Pembangunan Zona Integritas: Wilayah Bebas dari Korupsi (WBK) & WBBM',
  content: 'Pengadilan Militer Tinggi V Makassar berkomitmen memberikan pelayanan peradilan banding militer yang prima, transparan, berkeadilan, dan bebas dari praktik korupsi, gratifikasi, serta percaloan. Seluruh proses peradilan berpedoman pada asas cepat, sederhana, dan berbiaya ringan.',
  bulletPoints: [
    'Layanan PTSP & Meja Informasi dibuka Senin - Jumat pukul 08.00 - 16.30 WITA',
    'Penelusuran Perkara Banding dapat diakses 24 Jam secara real-time melalui Menu SIPP Terintegrasi',
    'Pengaduan Pelanggaran Aparatur dapat diajukan secara rahasia melalui Saluran Resmi SIWAS MA-RI',
    'Inovasi Notifikasi Persidangan via WhatsApp gratis bagi Advokat, Oditur, dan Pihak Berperkara'
  ],
  imageUrl: bannerMakassar,
  buttonText: 'Jelajahi Layanan PTSP Online',
  buttonLinkTab: 'layanan-publik',
  showOnlyOncePerSession: true,
  priority: 'Penting',
  updatedAt: '2026-09-15 08:00',
  updatedBy: 'Administrator Pengadilan'
};

// DOKUMEN EVIDEN RESMI ZONA INTEGRITAS (WBK MENUJU WBBM) PERMENPAN-RB
export const INITIAL_REFORMASI_EVIDEN: ReformasiEvidenItem[] = [
  {
    id: 'ev-1',
    areaId: 1,
    areaName: 'Area I: Manajemen Perubahan',
    judulDokumen: 'Surat Keputusan Pembentukan Tim Kerja Pembangunan ZI Menuju WBBM 2026',
    nomorSurat: 'W5-Mil.01/OT.01.1/SK/01/I/2026',
    tahun: '2026',
    tanggalUpload: '2026-01-10',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/SK_Tim_Kerja_ZI_2026.pdf',
    fileName: 'SK_Tim_Kerja_ZI_2026.pdf',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    keterangan: 'SK penetapan susunan tim kerja 6 area pengungkit pembangunan Zona Integritas menuju WBBM.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Koordinator Area I (Letkol Chk Mustofa)'
  },
  {
    id: 'ev-2',
    areaId: 1,
    areaName: 'Area I: Manajemen Perubahan',
    judulDokumen: 'Dokumen Rencana Kerja Pembangunan ZI Menuju WBBM & Piagam Pakta Integritas',
    nomorSurat: 'W5-Mil.01/OT.01.1/SK/04/I/2026',
    tahun: '2026',
    tanggalUpload: '2026-01-18',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Rencana_Kerja_ZI_Pakta_Integritas_2026.pdf',
    fileName: 'Rencana_Kerja_ZI_Pakta_Integritas_2026.pdf',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    keterangan: 'Pakta integritas ditandatangani 100% prajurit & aparatur serta matriks target kinerja triwulan.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Sekretariat Tim ZI'
  },
  {
    id: 'ev-3',
    areaId: 1,
    areaName: 'Area I: Manajemen Perubahan',
    judulDokumen: 'SK Penetapan Role Model & Agen Perubahan Dilmilti V Makassar Tahun 2026',
    nomorSurat: 'W5-Mil.01/KP.01.2/SK/08/I/2026',
    tahun: '2026',
    tanggalUpload: '2026-01-22',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/SK_Role_Model_Agen_Perubahan_2026.pdf',
    fileName: 'SK_Role_Model_Agen_Perubahan_2026.pdf',
    fileSize: '1.9 MB',
    fileType: 'PDF',
    keterangan: 'Penetapan Hakim Militer Tinggi dan ASN Panitera Pengganti sebagai Agen Perubahan Integritas.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Subbag Kepegawaian & TI'
  },
  {
    id: 'ev-4',
    areaId: 2,
    areaName: 'Area II: Penataan Tatalaksana',
    judulDokumen: 'Standar Operasional Prosedur (SOP) Terpadu Kepaniteraan & Kesekretariatan 2026',
    nomorSurat: 'W5-Mil.01/OT.01.3/SOP/II/2026',
    tahun: '2026',
    tanggalUpload: '2026-02-05',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Buku_SOP_Terpadu_Dilmilti5_2026.pdf',
    fileName: 'Buku_SOP_Terpadu_Dilmilti5_2026.pdf',
    fileSize: '5.8 MB',
    fileType: 'PDF',
    keterangan: 'Kumpulan 48 SOP teknis peradilan militer tingkat banding dan administrasi umum berbasis digital.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Koordinator Area II'
  },
  {
    id: 'ev-5',
    areaId: 2,
    areaName: 'Area II: Penataan Tatalaksana',
    judulDokumen: 'Laporan Implementasi Sistem Pemerintahan Berbasis Elektronik (SPBE) & e-Court',
    nomorSurat: 'W5-Mil.01/TI.01.2/L-SPBE/III/2026',
    tahun: '2026',
    tanggalUpload: '2026-03-02',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Laporan_SPBE_eCourt_2026.pdf',
    fileName: 'Laporan_SPBE_eCourt_2026.pdf',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    keterangan: 'Inovasi e-Court banding, SIPP web interaktif, dan notifikasi persidangan real-time WhatsApp.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Subbag Kepegawaian & TI'
  },
  {
    id: 'ev-6',
    areaId: 3,
    areaName: 'Area III: Manajemen SDM Aparatur',
    judulDokumen: 'Peta Kebutuhan Pegawai, Pola Mutasi Internal & Rencana Pengembangan Kompetensi 2026',
    nomorSurat: 'W5-Mil.01/KP.04.1/DOK/I/2026',
    tahun: '2026',
    tanggalUpload: '2026-01-29',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Pola_Karier_SDM_2026.pdf',
    fileName: 'Pola_Karier_SDM_2026.pdf',
    fileSize: '2.7 MB',
    fileType: 'PDF',
    keterangan: 'Analisis beban kerja (ABK), pola penugasan berkeadilan, dan pelatihan militer berkelanjutan.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Koordinator Area III'
  },
  {
    id: 'ev-7',
    areaId: 3,
    areaName: 'Area III: Manajemen SDM Aparatur',
    judulDokumen: 'Laporan Rekapitulasi Penilaian SKP & Pengawasan Disiplin Prajurit Triwulan I-2026',
    nomorSurat: 'W5-Mil.01/KP.05.2/LAP/IV/2026',
    tahun: '2026',
    tanggalUpload: '2026-04-08',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Rekap_Disiplin_SKP_TW1_2026.xlsx',
    fileName: 'Rekap_Disiplin_SKP_TW1_2026.xlsx',
    fileSize: '1.2 MB',
    fileType: 'XLSX',
    keterangan: 'Matriks rekapitulasi penilaian kinerja SKP online e-Kinerja BKN dan zero-violation prajurit TNI.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Subbag Kepegawaian & TI'
  },
  {
    id: 'ev-8',
    areaId: 4,
    areaName: 'Area IV: Penguatan Akuntabilitas',
    judulDokumen: 'Laporan Kinerja Instansi Pemerintah (LKjIP) Dilmilti V Makassar Tahun 2025/2026',
    nomorSurat: 'W5-Mil.01/OT.01.2/LKjIP/I/2026',
    tahun: '2026',
    tanggalUpload: '2026-01-25',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/LKjIP_Dilmilti_V_Makassar_2025.pdf',
    fileName: 'LKjIP_Dilmilti_V_Makassar_2025.pdf',
    fileSize: '4.9 MB',
    fileType: 'PDF',
    keterangan: 'Laporan pertanggungjawaban pencapaian IKU dan sasaran strategis lembaga peradilan militer.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Subbag Perencanaan, TI, & Pelaporan'
  },
  {
    id: 'ev-9',
    areaId: 4,
    areaName: 'Area IV: Penguatan Akuntabilitas',
    judulDokumen: 'Penetapan Perjanjian Kinerja (PK) Tahun 2026 & Matriks Rencana Aksi Peradilan',
    nomorSurat: 'W5-Mil.01/OT.01.1/PK/I/2026',
    tahun: '2026',
    tanggalUpload: '2026-01-30',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Perjanjian_Kinerja_2026.pdf',
    fileName: 'Perjanjian_Kinerja_2026.pdf',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    keterangan: 'Perjanjian kinerja berjenjang dari Kepala Pengadilan, Hakim Militer Tinggi, hingga Pejabat Struktural.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Koordinator Area IV'
  },
  {
    id: 'ev-10',
    areaId: 5,
    areaName: 'Area V: Penguatan Pengawasan',
    judulDokumen: 'Sertifikasi ISO 37001:2016 Sistem Manajemen Anti Penyuapan (SMAP) & Kebijakan Anti-Pungli',
    nomorSurat: 'W5-Mil.01/PW.01.1/SMAP/SK/II/2026',
    tahun: '2026',
    tanggalUpload: '2026-02-14',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Sertifikat_SMAP_ISO37001_Dilmilti.pdf',
    fileName: 'Sertifikat_SMAP_ISO37001_Dilmilti.pdf',
    fileSize: '3.6 MB',
    fileType: 'PDF',
    keterangan: 'Dokumen audit surveillance ISO 37001 SMAP dengan hasil kepatuhan 100% tanpa temuan mayor.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Koordinator Area V'
  },
  {
    id: 'ev-11',
    areaId: 5,
    areaName: 'Area V: Penguatan Pengawasan',
    judulDokumen: 'Laporan Kinerja Unit Pengendalian Gratifikasi (UPG) & Rekapitulasi SIWAS MA Triwulan I-2026',
    nomorSurat: 'W5-Mil.01/PW.02.2/L-UPG/IV/2026',
    tahun: '2026',
    tanggalUpload: '2026-04-05',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Laporan_UPG_SIWAS_TW1_2026.pdf',
    fileName: 'Laporan_UPG_SIWAS_TW1_2026.pdf',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    keterangan: 'Nihil laporan gratifikasi dan pelanggaran kode etik hakim/aparatur militer di wilayah Dilmilti V.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Koordinator Area V'
  },
  {
    id: 'ev-12',
    areaId: 6,
    areaName: 'Area VI: Kualitas Pelayanan Publik',
    judulDokumen: 'Standar Pelayanan Publik Terpadu Satu Pintu (PTSP 6 Meja) & Maklumat Layanan 2026',
    nomorSurat: 'W5-Mil.01/HK.05.1/SP-PTSP/II/2026',
    tahun: '2026',
    tanggalUpload: '2026-02-18',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Standar_Pelayanan_PTSP_2026.pdf',
    fileName: 'Standar_Pelayanan_PTSP_2026.pdf',
    fileSize: '3.9 MB',
    fileType: 'PDF',
    keterangan: 'Standar pelayanan 6 loket PTSP, maklumat pelayanan, dan kompensasi layanan ramah disabilitas.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Koordinator Area VI'
  },
  {
    id: 'ev-13',
    areaId: 6,
    areaName: 'Area VI: Kualitas Pelayanan Publik',
    judulDokumen: 'Laporan Hasil Survei Kepuasan Masyarakat (IKM) & Indeks Persepsi Anti Korupsi (IPAK) TW-I 2026',
    nomorSurat: 'W5-Mil.01/HM.02.1/IKM/IV/2026',
    tahun: '2026',
    tanggalUpload: '2026-04-10',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Hasil_Survei_IKM_IPAK_TW1_2026.pdf',
    fileName: 'Hasil_Survei_IKM_IPAK_TW1_2026.pdf',
    fileSize: '2.5 MB',
    fileType: 'PDF',
    keterangan: 'Hasil IKM: 98.42% (Sangat Baik), IPAK: 99.10% (Sangat Bersih) dari 145 responden pencari keadilan.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Tim Survei IKM'
  },
  {
    id: 'ev-14',
    areaId: 0,
    areaName: 'Dokumen LKE & SK Tim Kerja',
    judulDokumen: 'Lembar Kerja Evaluasi (LKE) PMPRB Mandiri Pembangunan ZI Menuju WBBM 2026',
    nomorSurat: 'W5-Mil.01/OT.01.1/LKE-WBBM/V/2026',
    tahun: '2026',
    tanggalUpload: '2026-05-12',
    fileUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/LKE_PMPRB_WBBM_Dilmilti_V_2026.xlsx',
    fileName: 'LKE_PMPRB_WBBM_Dilmilti_V_2026.xlsx',
    fileSize: '4.7 MB',
    fileType: 'XLSX',
    keterangan: 'Matriks lengkap pemenuhan pengungkit dan hasil LKE ZI KemenPAN-RB dengan capaian nilai 96.85.',
    statusVerifikasi: 'Terverifikasi',
    diuploadOleh: 'Ketua Tim ZI (Kolonel Chk Sugeng Aryanto, S.H., M.H.)'
  }
];

export const INITIAL_RELATED_WEBSITES: RelatedWebsiteItem[] = DEFAULT_RELATED_WEBSITES.map((w, idx) => ({
  id: `rw-${idx + 1}`,
  name: w.name,
  url: w.url,
  role: w.role,
  category: idx < 3 ? 'Mahkamah Agung' : idx === 3 ? 'Pengawasan' : idx === 4 ? 'Mahkamah Agung' : 'Layanan Publik'
}));

export const INITIAL_COURT_IDENTITY: CourtIdentityData = {
  ...DEFAULT_COURT_IDENTITY,
  phone: '081144405554',
  whatsapp: '0811-4440-5554',
  address: 'Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar Sulawesi Selatan 90122',
  email: 'dilmiti5makassar@gmail.com',
  jamOperasional: 'Senin - Jumat: 08.00 - 16.30 WITA',
  slogan: 'REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif)',
  fotoKadilmil: '/uploads/Screenshot_2026-09-16_093219_1790213987956.jpg',
  logoUrl: '/images/dilmilti_v_logo_transparent.png',
  bannerUrl: '/images/makassar_court_banner_1789442426023.jpg',
  // Sambutan Pimpinan Resmi
  sambutanNama: 'Kolonel Chk Sultan, S.H.',
  sambutanJabatan: 'Wakil Kepala Pengadilan Militer Tinggi V Makassar',
  sambutanPangkatNrp: 'Wakil Kepala Pengadilan Militer Tinggi V Makassar • NRP: 11980017760771',
  sambutanQuote: "Assalamu'alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera bagi Kita Semua, Om Swastiastu, Namo Buddhaya, Salam Kebajikan. Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas hadirnya pembaruan situs resmi Pengadilan Militer Tinggi V Makassar sesuai Pedoman Standarisasi Website Ditjen Badilmiltun MA-RI SK No. 593/DJMT/SK.TI2.1.1/VII/2026 dan PERMA No. 1 Tahun 2017.",
  sambutanParagraph1: 'Pengadilan Militer Tinggi V Makassar yang berkedudukan di Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar Sulawesi Selatan 90122, berkomitmen penuh menyelenggarakan proses peradilan militer yang agung, independen, transparan, dan akuntabel di Kawasan Timur Indonesia.',
  sambutanParagraph2: 'Dengan semangat kearifan bahari Sulawesi Selatan dan filosofi luhur Sulapa Eppa (Kejujuran, Kecerdasan, Keberanian, dan Keteguhan Hukum) serta Motto REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif), kami siap memberikan pelayanan hukum terbaik bebas dari gratifikasi menuju predikat Wilayah Birokrasi Bersih dan Melayani (WBBM).',
  // Visi & Misi
  visiText: 'Terwujudnya Pengadilan Militer Tinggi V Makassar yang Agung, Modern, Akuntabel dan Berkeadilan',
  misi1Title: '1. Menjaga Kemandirian Peradilan Militer:',
  misi1Desc: 'Menjaga independensi lembaga peradilan militer bebas dari intervensi pihak manapun dalam memeriksa dan memutus perkara banding & pamen.',
  misi2Title: '2. Pelayanan Hukum Berkeadilan:',
  misi2Desc: 'Memberikan pelayanan hukum yang adil, cepat, sederhana, dan berbiaya ringan bagi prajurit dan seluruh pencari keadilan.',
  misi3Title: '3. Integritas dan Kepemimpinan:',
  misi3Desc: 'Meningkatkan kualitas sumber daya manusia aparatur peradilan militer yang berintegritas tinggi, profesional, dan berwibawa.',
  misi4Title: '4. Keterbukaan dan Transformasi Digital:',
  misi4Desc: 'Meningkatkan transparansi dan kredibilitas badan peradilan melalui implementasi SPBE, SIPP, dan e-Court terintegrasi.',
  // Sejarah
  sejarahIntro: 'Berdasarkan Undang-Undang Nomor 31 Tahun 1997 tentang Peradilan Militer, Pengadilan Militer Tinggi V Makassar berkedudukan di Makassar dan merupakan Pengadilan Militer Tingkat Banding yang membawahi 6 (enam) Pengadilan Militer Tingkat Pertama di Kawasan Timur Indonesia:',
  sejarahParagraph: 'Pembentukan satuan kerja ini berlandaskan Peraturan Pemerintah Nomor 22 Tahun 2025 dan Peraturan Pemerintah Nomor 23 Tahun 2025. Diresmikan serentak bersama 5 Satuan Kerja Baru (Pengadilan Militer Tinggi V Makassar, Pengadilan Militer Tinggi IV Balikpapan, Pengadilan Militer I-03 Pekanbaru, Pengadilan Militer V-18 Kendari, dan Pengadilan Militer V-21 Manokwari). Daerah hukum Pengadilan Militer Tinggi V Makassar berdasarkan Pasal 2 ayat (2) PP No. 22/2025 meliputi 12 Provinsi di Indonesia Timur: Sulawesi Utara, Gorontalo, Sulawesi Tengah, Sulawesi Barat, Sulawesi Tenggara, Sulawesi Selatan, Maluku Utara, Maluku, Papua Barat Daya, Papua Barat, Papua Tengah, Papua Pegunungan, Papua, dan Papua Selatan.'
};

export const INITIAL_JURISDICTION_COURTS: JurisdictionCourtItem[] = [...DEFAULT_JURISDICTION_COURTS];

export const INITIAL_SATKER_STRUCTURE: SatkerStructureItem[] = [
  // Kepaniteraan (Teknis Perkara) PERMA 1/2017
  {
    id: 'st-1',
    no: 1,
    kelompok: 'Kepaniteraan',
    jabatan: 'Panitera',
    namaPejabat: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
    pangkatNip: 'NRP: 524418',
    tugasFungsi: 'Pimpinan Kepaniteraan, Administrasi Teknis Perkara Banding & Minutasi'
  },
  {
    id: 'st-2',
    no: 2,
    kelompok: 'Kepaniteraan',
    jabatan: 'Panmud Pidana',
    namaPejabat: 'Mayor Chk Mahpul Saepuloh, S.H.',
    pangkatNip: 'NRP: 21940135670972',
    tugasFungsi: 'Pengelolaan Register Perkara Pidana Militer & Laporan Perkara'
  },
  {
    id: 'st-3',
    no: 3,
    kelompok: 'Kepaniteraan',
    jabatan: 'Panitera Pengganti',
    namaPejabat: 'Kapten Chk Rusjana, S.H.',
    pangkatNip: 'NRP: 21020041120782',
    tugasFungsi: 'Pendamping Persidangan Majelis Hakim & Penyusunan Berita Acara'
  },
  {
    id: 'st-4',
    no: 4,
    kelompok: 'Kepaniteraan',
    jabatan: 'Pengelolaan Register SIPP & Minutasi Perkara Banding',
    namaPejabat: 'Tim Kepaniteraan Dilmilti V Makassar',
    pangkatNip: 'Staf Administrasi SIPP',
    tugasFungsi: 'Input Data SIPP Live, Minutasi Perkara Inkracht & Pengiriman Berkas'
  },
  // Kesekretariatan (Non-Teknis & Operasional) PERMA 1/2017
  {
    id: 'st-5',
    no: 5,
    kelompok: 'Kesekretariatan',
    jabatan: 'Bagian Perencanaan & Kepegawaian',
    namaPejabat: 'Muhammad Arfah Afendi, S.E., M.M.',
    pangkatNip: 'NIP: 197611302006041002',
    tugasFungsi: 'Koordinator Bagian Perencanaan, Kepegawaian, TI & Ortala'
  },
  {
    id: 'st-6',
    no: 6,
    kelompok: 'Kesekretariatan',
    jabatan: 'Bagian Umum & Keuangan',
    namaPejabat: 'Herna Dian Prihatiny Napan, S.T.',
    pangkatNip: 'NIP: 198509022009122004',
    tugasFungsi: 'Koordinator Bagian Umum, Pengelolaan Keuangan DIPA & BMN'
  },
  {
    id: 'st-7',
    no: 7,
    kelompok: 'Kesekretariatan',
    jabatan: 'Subbag TU & Rumah Tangga',
    namaPejabat: 'Andi Adzan Mirzan, S.Kom., M.M.',
    pangkatNip: 'NIP: 198503092009041001',
    tugasFungsi: 'Pelayanan Tata Usaha, Surat Masuk/Keluar, Protokoler & Rumah Tangga'
  },
  {
    id: 'st-8',
    no: 8,
    kelompok: 'Kesekretariatan',
    jabatan: 'Subbag Rencana Program & Anggaran',
    namaPejabat: 'Muhammad Imam S, S.H.',
    pangkatNip: 'NIP: 199205302019031006',
    tugasFungsi: 'Penyusunan Rencana Kerja, Program DIPA & Evaluasi Anggaran'
  },
  {
    id: 'st-9',
    no: 9,
    kelompok: 'Kesekretariatan',
    jabatan: 'Subbag Keuangan & Pelaporan',
    namaPejabat: 'Allen Farlianso, S.E.',
    pangkatNip: 'NIP: 199406232020121004',
    tugasFungsi: 'Pengelolaan Perbendaharaan, SP2D & Pelaporan Keuangan'
  },
  {
    id: 'st-10',
    no: 10,
    kelompok: 'Kesekretariatan',
    jabatan: 'Subbag Kepegawaian & TI',
    namaPejabat: 'Afni Syafaatun, S.A.P., M.A.P.',
    pangkatNip: 'NIP: 199609182020122005',
    tugasFungsi: 'Pengelolaan Kepegawaian, Diklat, TI & Public Relations Website'
  }
];

export const DEFAULT_SAKIP_DIPA_DOCS: SakipDipaDocumentItem[] = [
  {
    id: 'doc-sakip-1',
    judul: 'Rencana Strategis (Renstra) 2020-2024 & 2025-2029',
    kategori: 'SAKIP',
    subKategori: 'Renstra',
    tahun: '2026',
    nomorDokumen: 'SK-KMA/RENSTRA/2025/01',
    deskripsi: 'Dokumen Rencana Strategis Pengadilan Militer Tinggi V Makassar periode 2020-2024 dan pembaruan 2025-2029.',
    fileUrl: '',
    fileName: 'Renstra_2025_2029_Dilmilti5_Makassar.pdf',
    fileSize: '3.2 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-01-10',
    penanggungJawab: 'Subbagian Perencanaan, TI & Pelaporan'
  },
  {
    id: 'doc-sakip-2',
    judul: 'Laporan Kinerja Instansi Pemerintah (LKjIP) TA 2025 & TA 2026',
    kategori: 'SAKIP',
    subKategori: 'LKjIP',
    tahun: '2026',
    nomorDokumen: 'LKJIP/DILMILTI-V/2026',
    deskripsi: 'Laporan Kinerja Instansi Pemerintah sebagai wujud pertanggungjawaban pencapaian target kinerja.',
    fileUrl: '',
    fileName: 'LKjIP_TA_2025_2026_Dilmilti5.pdf',
    fileSize: '4.8 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-01-25',
    penanggungJawab: 'Subbagian Perencanaan, TI & Pelaporan'
  },
  {
    id: 'doc-sakip-3',
    judul: 'Indikator Kinerja Utama (IKU) Dilmilti V Makassar',
    kategori: 'SAKIP',
    subKategori: 'IKU',
    tahun: '2026',
    nomorDokumen: 'SK-KADILMILTI/IKU/2026',
    deskripsi: 'Ukuran keberhasilan organisasi dalam mencapai tujuan dan sasaran strategis.',
    fileUrl: '',
    fileName: 'IKU_2026_Dilmilti5_Makassar.pdf',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-01-15',
    penanggungJawab: 'Subbagian Perencanaan, TI & Pelaporan'
  },
  {
    id: 'doc-sakip-4',
    judul: 'Rencana Kinerja Tahunan (RKT) TA 2026',
    kategori: 'SAKIP',
    subKategori: 'RKT',
    tahun: '2026',
    nomorDokumen: 'RKT/DILMILTI-V/2026',
    deskripsi: 'Penetapan sasaran dan program kerja tahunan instansi.',
    fileUrl: '',
    fileName: 'RKT_TA_2026_Dilmilti5.pdf',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-01-18',
    penanggungJawab: 'Subbagian Perencanaan, TI & Pelaporan'
  },
  {
    id: 'doc-sakip-5',
    judul: 'Perjanjian Kinerja (PK) Pimpinan TA 2026',
    kategori: 'SAKIP',
    subKategori: 'PK',
    tahun: '2026',
    nomorDokumen: 'PK-PIMPINAN/DILMILTI-V/2026',
    deskripsi: 'Komitmen kinerja antara Kadilmilti V Makassar dengan Dirjen Badilmiltun MA-RI.',
    fileUrl: '',
    fileName: 'Perjanjian_Kinerja_Pimpinan_2026.pdf',
    fileSize: '1.5 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-01-20',
    penanggungJawab: 'Pimpinan & Subbag Perencanaan'
  },
  {
    id: 'doc-dipa-1',
    judul: 'DIPA 01 (Badan Urusan Administrasi Mahkamah Agung RI)',
    kategori: 'DIPA',
    subKategori: 'DIPA 01',
    tahun: '2026',
    nomorDokumen: 'DIPA-005.01.2.400123/2026',
    deskripsi: 'Daftar Isian Pelaksanaan Anggaran untuk operasional dan belanja pegawai BUA MA-RI.',
    fileUrl: '',
    fileName: 'DIPA_01_BUA_TA_2026_Dilmilti5.pdf',
    fileSize: '2.9 MB',
    fileType: 'PDF',
    nilaiAnggaran: 'Rp 4,8 M',
    tanggalUpload: '2026-01-05',
    penanggungJawab: 'Subbagian Keuangan & Umum'
  },
  {
    id: 'doc-dipa-2',
    judul: 'DIPA 05 (Direktorat Jenderal Badan Peradilan Militer & TUN)',
    kategori: 'DIPA',
    subKategori: 'DIPA 05',
    tahun: '2026',
    nomorDokumen: 'DIPA-005.05.2.400124/2026',
    deskripsi: 'Daftar Isian Pelaksanaan Anggaran untuk kegiatan teknis yustisial peradilan militer.',
    fileUrl: '',
    fileName: 'DIPA_05_Badilmiltun_TA_2026_Dilmilti5.pdf',
    fileSize: '2.2 MB',
    fileType: 'PDF',
    nilaiAnggaran: 'Rp 1,2 M',
    tanggalUpload: '2026-01-05',
    penanggungJawab: 'Subbagian Keuangan & Umum'
  },
  {
    id: 'doc-dipa-3',
    judul: 'Laporan Realisasi Anggaran (LRA) Bulanan 2026',
    kategori: 'DIPA',
    subKategori: 'LRA',
    tahun: '2026',
    nomorDokumen: 'LRA/BULANAN/IX/2026',
    deskripsi: 'Laporan bulanan penyerapan dan realisasi anggaran DIPA 01 & DIPA 05.',
    fileUrl: '',
    fileName: 'LRA_Bulanan_September_2026.pdf',
    fileSize: '1.7 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-09-05',
    penanggungJawab: 'Subbagian Keuangan & Umum'
  },
  {
    id: 'doc-dipa-4',
    judul: 'Catatan Atas Laporan Keuangan (CALK) Semesteran',
    kategori: 'DIPA',
    subKategori: 'CALK',
    tahun: '2026',
    nomorDokumen: 'CALK/SEMESTER-1/2026',
    deskripsi: 'Catatan rinci atas pencapaian dan laporan keuangan semester I tahun 2026.',
    fileUrl: '',
    fileName: 'CALK_Semester_I_2026_Dilmilti5.pdf',
    fileSize: '3.5 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-07-10',
    penanggungJawab: 'Subbagian Keuangan & Umum'
  },
  {
    id: 'doc-lhkpn-1',
    judul: 'Laporan Rekapitulasi Kepatuhan LHKPN KPK Hakim & Pejabat Struktural TA 2026 (100% Tuntas)',
    kategori: 'LHKPN',
    subKategori: 'LHKPN KPK',
    tahun: '2026',
    nomorDokumen: 'LHKPN/100/DILMILTI-V/2026',
    deskripsi: 'Laporan rekapitulasi dan bukti tanda terima pelaporan LHKPN KPK seluruh Pimpinan, Hakim Militer Tinggi, Panitera, dan Sekretaris Dilmilti V Makassar (100% tuntas tepat waktu).',
    fileUrl: '',
    fileName: 'Laporan_Rekapitulasi_Kepatuhan_LHKPN_KPK_2026.pdf',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    persentaseKepatuhan: '100%',
    tanggalUpload: '2026-03-31',
    penanggungJawab: 'Subbagian Kepegawaian & TI'
  },
  {
    id: 'doc-lhkpn-2',
    judul: 'Pengumuman Ringkasan Harta Kekayaan Penyelenggara Negara (LHKPN) Pimpinan & Hakim Tinggi TA 2026',
    kategori: 'LHKPN',
    subKategori: 'Pengumuman LHKPN',
    tahun: '2026',
    nomorDokumen: 'LHKPN/PENGUMUMAN/KPK/2026',
    deskripsi: 'Dokumen resmi pengumuman LHKPN KPK yang telah terverifikasi bagi Kepala, Wakil Kepala, Hakim Militer Tinggi, Panitera, dan Sekretaris.',
    fileUrl: '',
    fileName: 'Pengumuman_Resmi_LHKPN_Pimpinan_Hakim_2026.pdf',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    persentaseKepatuhan: '100%',
    tanggalUpload: '2026-03-31',
    penanggungJawab: 'Subbagian Kepegawaian & TI'
  },
  {
    id: 'doc-lhkpn-3',
    judul: 'Laporan Kepatuhan LHKASN & SPT Tahunan Aparatur Sipil Negara & Prajurit TNI TA 2026',
    kategori: 'LHKPN',
    subKategori: 'LHKASN & SPT',
    tahun: '2026',
    nomorDokumen: 'LHKASN/SPT/DILMILTI-V/2026',
    deskripsi: 'Laporan rekapitulasi bukti pelaporan Harta Kekayaan Aparatur Negara (LHKASN) melalui SIKEP MA-RI dan SPT Tahunan Pajak bagi seluruh aparatur (100% tuntas).',
    fileUrl: '',
    fileName: 'Laporan_Kepatuhan_LHKASN_SPT_Aparatur_2026.pdf',
    fileSize: '1.4 MB',
    fileType: 'PDF',
    persentaseKepatuhan: '100%',
    tanggalUpload: '2026-03-31',
    penanggungJawab: 'Subbagian Kepegawaian & TI'
  },
  {
    id: 'doc-sp-1',
    judul: 'SK Standar Pelayanan Publik PTSP Terpadu SK 593/2026',
    kategori: 'STANDAR_PELAYANAN',
    subKategori: 'Standar Pelayanan',
    tahun: '2026',
    nomorDokumen: 'SK-KADILMILTI/SP/2026',
    deskripsi: 'Standar Layanan Publik mencakup persyaratan, prosedur, waktu, biaya, dan pengelolaan pengaduan.',
    fileUrl: '',
    fileName: 'SK_Standar_Pelayanan_PTSP_Dilmilti5_2026.pdf',
    fileSize: '2.8 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-01-10',
    penanggungJawab: 'Panitera & Petugas PTSP'
  },
  {
    id: 'doc-maklumat-1',
    judul: 'Maklumat Pelayanan Resmi Pengadilan Militer Tinggi V Makassar',
    kategori: 'MAKLUMAT',
    subKategori: 'Maklumat',
    tahun: '2026',
    nomorDokumen: 'MAKLUMAT/01/2026',
    deskripsi: 'Pernyataan kesanggupan pimpinan dan seluruh aparatur memberikan pelayanan sesuai standar yang ditetapkan.',
    fileUrl: '',
    fileName: 'Maklumat_Pelayanan_Dilmilti5_2026.pdf',
    fileSize: '1.1 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-01-02',
    penanggungJawab: 'Kepala Pengadilan Militer Tinggi V'
  },
  {
    id: 'doc-lap-perkara-1',
    judul: 'Laporan Keadaan Perkara Bulanan (Masuk, Putus & Minutasi) 2026',
    kategori: 'LAPORAN_PERKARA',
    subKategori: 'Perkara Bulanan',
    tahun: '2026',
    nomorDokumen: 'LAP-PERK/BULANAN/IX/2026',
    deskripsi: 'Data laporan statistik rekapitulasi perkara masuk, perkara diputus, sisa perkara, dan penyelesaian minutasi perkara tepat waktu.',
    fileUrl: '',
    fileName: 'Laporan_Keadaan_Perkara_Bulanan_September_2026.pdf',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-09-10',
    penanggungJawab: 'Kepaniteraan Pidana & TUN'
  },
  {
    id: 'doc-lap-perkara-2',
    judul: 'Laporan Statistik Putusan Banding Pidana Militer & Sengketa TUN',
    kategori: 'LAPORAN_PERKARA',
    subKategori: 'Statistik Putusan',
    tahun: '2026',
    nomorDokumen: 'LAP-STAT/DILMILTI-V/2026',
    deskripsi: 'Laporan analisis statistik perkara banding pidana militer, pasal sangkaan, jenis hukuman, dan sengketa TUN TNI.',
    fileUrl: '',
    fileName: 'Statistik_Putusan_Banding_2026_Dilmilti5.pdf',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-08-15',
    penanggungJawab: 'Panitera Pengadilan'
  },
  {
    id: 'doc-lap-survei-1',
    judul: 'Laporan Hasil Survei IKM (98.40 / Sangat Baik) & IPAK (99.10) Triwulan III 2026',
    kategori: 'LAPORAN_SURVEI',
    subKategori: 'IKM/IPAK',
    tahun: '2026',
    nomorDokumen: 'LAP-SURVEI/TW3/2026',
    deskripsi: 'Laporan analisis hasil survei Indeks Kepuasan Masyarakat (IKM) dan Indeks Persepsi Anti Korupsi (IPAK) beserta rekomendasi tindak lanjut.',
    fileUrl: '',
    fileName: 'Laporan_Hasil_Survei_IKM_IPAK_TW3_2026.pdf',
    fileSize: '2.0 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-09-15',
    penanggungJawab: 'Tim Evaluasi Survei & Tim ZI'
  },
  {
    id: 'doc-lap-posbakum-1',
    judul: 'Laporan Realisasi Layanan Posbakum & Pendampingan Prodeo TA 2026',
    kategori: 'LAPORAN_POSBAKUM',
    subKategori: 'Posbakum/Prodeo',
    tahun: '2026',
    nomorDokumen: 'LAP-POSBAKUM/IX/2026',
    deskripsi: 'Laporan pelaksanaan pemberian bantuan hukum cuma-cuma, jumlah pemohon, konsultasi, dan penyerapan anggaran prodeo.',
    fileUrl: '',
    fileName: 'Laporan_Realisasi_Posbakum_Prodeo_2026.pdf',
    fileSize: '1.6 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-09-01',
    penanggungJawab: 'Panitera Muda Hukum & Petugas Posbakum'
  },
  {
    id: 'doc-lap-eviden-zi-1',
    judul: 'Laporan Penilaian Mandiri Pembangunan ZI WBBM (LKE 6 Area Perubahan)',
    kategori: 'LAPORAN_EVIDEN_ZI',
    subKategori: 'WBBM / ZI',
    tahun: '2026',
    nomorDokumen: 'LKE-ZI/WBBM/DILMILTI-V/2026',
    deskripsi: 'Laporan Lembar Kerja Evaluasi (LKE) pembangunan Zona Integritas menuju Wilayah Birokrasi Bersih dan Melayani (WBBM).',
    fileUrl: '',
    fileName: 'Laporan_LKE_Pembangunan_ZI_WBBM_2026.pdf',
    fileSize: '5.2 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-08-20',
    penanggungJawab: 'Tim Kerja Pembangunan ZI'
  },
  {
    id: 'doc-lap-ppid-1',
    judul: 'Laporan Tahunan Layanan Informasi Publik PPID Dilmilti V Makassar',
    kategori: 'PPID',
    subKategori: 'Laporan PPID',
    tahun: '2026',
    nomorDokumen: 'LAP-PPID/TAHUNAN/2026',
    deskripsi: 'Laporan rekapitulasi jumlah permohonan informasi publik, waktu penyelesaian, permohonan dikabulkan, dan laporan keberatan.',
    fileUrl: '',
    fileName: 'Laporan_Tahunan_PPID_Dilmilti5_Makassar.pdf',
    fileSize: '2.7 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-01-30',
    penanggungJawab: 'PPID Utama & Atasan PPID'
  },
  {
    id: 'doc-laptah-2025',
    judul: 'Laporan Tahunan Pelaksanaan Kegiatan (Laptah) Dilmilti V Makassar TA 2025',
    kategori: 'PPID',
    subKategori: 'Laporan Tahunan',
    tahun: '2025',
    nomorDokumen: 'W5-Mil.01/OT.01.2/LAPTAH/XII/2025',
    deskripsi: 'Laporan pertanggungjawaban pelaksanaan tugas pokok dan fungsi teknis yustisial, kepaniteraan, dan kesekretariatan Tahun Anggaran 2025.',
    fileUrl: '',
    fileName: 'Laporan_Tahunan_Dilmilti5_Makassar_TA_2025.pdf',
    fileSize: '5.4 MB',
    fileType: 'PDF',
    tanggalUpload: '2025-12-29',
    penanggungJawab: 'Panitera & Sekretaris Dilmilti V'
  },
  {
    id: 'doc-sakip-lkjip-2025',
    judul: 'Laporan Kinerja Instansi Pemerintah (LKjIP / LAKIP) TA 2025',
    kategori: 'SAKIP',
    subKategori: 'LKjIP',
    tahun: '2025',
    nomorDokumen: 'W5-Mil.01/OT.01.2/LKJIP/XII/2025',
    deskripsi: 'Laporan akuntabilitas capaian Indikator Kinerja Utama (IKU) dan evaluasi SAKIP Tahun Anggaran 2025.',
    fileUrl: '',
    fileName: 'LKjIP_Dilmilti5_Makassar_TA_2025.pdf',
    fileSize: '4.5 MB',
    fileType: 'PDF',
    tanggalUpload: '2025-12-22',
    penanggungJawab: 'Subbagian Perencanaan, TI & Pelaporan'
  },
  {
    id: 'doc-dipa-lra-2025',
    judul: 'Laporan Realisasi Anggaran (LRA) Tahunan DIPA 01 & DIPA 05 TA 2025',
    kategori: 'DIPA',
    subKategori: 'LRA',
    tahun: '2025',
    nomorDokumen: 'W5-Mil.01/KU.01.1/LRA/XII/2025',
    deskripsi: 'Rekapitulasi akhir penyerapan anggaran DIPA 01 (BUA) sebesar 99,42% dan DIPA 05 (Badilmiltun) sebesar 99,80% Tahun Anggaran 2025.',
    fileUrl: '',
    fileName: 'LRA_Tahunan_DIPA01_DIPA05_TA_2025.pdf',
    fileSize: '2.6 MB',
    fileType: 'PDF',
    nilaiAnggaran: 'Rp 5,8 M',
    tanggalUpload: '2025-12-30',
    penanggungJawab: 'Subbagian Keuangan & Pelaporan'
  },
  {
    id: 'doc-sakip-renstra-2024',
    judul: 'Evaluasi Akhir Rencana Strategis (Renstra) & Laporan Kinerja TA 2024',
    kategori: 'SAKIP',
    subKategori: 'Renstra',
    tahun: '2024',
    nomorDokumen: 'W5-Mil.01/OT.01.1/RENSTRA-EVAL/XII/2024',
    deskripsi: 'Dokumen evaluasi capaian akhir Renstra periode 2020-2024 dan transisi pembentukan satuan kerja baru PP No. 22 Tahun 2025.',
    fileUrl: '',
    fileName: 'Evaluasi_Renstra_Laporan_Kinerja_2024.pdf',
    fileSize: '3.9 MB',
    fileType: 'PDF',
    tanggalUpload: '2024-12-20',
    penanggungJawab: 'Subbagian Perencanaan, TI & Pelaporan'
  },
  {
    id: 'doc-buku2-sk-kma-159-2026',
    judul: 'Buku II Pedoman Pelaksanaan Teknis Administrasi dan Teknis Peradilan Militer (Lampiran III SK KMA No. 159/KMA/SK.HK2/VIII/2026)',
    kategori: 'SK_SOP',
    subKategori: 'Buku II Peradilan Militer',
    tahun: '2026',
    nomorDokumen: '159/KMA/SK.HK2/VIII/2026',
    deskripsi: 'Keputusan Ketua Mahkamah Agung RI tanggal 19 Agustus 2026 tentang Pemberlakuan Buku II Pedoman Pelaksanaan Teknis Administrasi dan Teknis Peradilan (Lampiran III Peradilan Militer Hal. 935-1052) yang menggantikan KMA/032/SK/IV/2006.',
    fileUrl: '',
    fileName: 'SK_KMA_159_2026_Buku_II_Pedoman_Teknis_Peradilan_Militer.pdf',
    fileSize: '6.8 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-08-19',
    penanggungJawab: 'Kepaniteraan & Hukum Dilmilti V Makassar'
  },
  {
    id: 'doc-eregister-laporan-berkala-2026',
    judul: 'Laporan Berkala Keadaan Perkara Tingkat Banding, Kinerja Hakim & Panitera Pengganti, serta Penutupan e-Register SIPP TA 2026',
    kategori: 'LAPORAN_PERKARA',
    subKategori: 'Laporan Perkara & e-Register',
    tahun: '2026',
    nomorDokumen: 'W5-Mil.01/HK.01/LAP-PERKARA/IX/2026',
    deskripsi: 'Laporan bulanan, triwulan, dan tahunan keadaan perkara tingkat banding, kinerja majelis hakim & panitera pengganti, penyelesaian perkara Restorative Justice, Kimwasmat, serta rekapitulasi 10 rincian penutupan e-Register SIPP sesuai SK KMA No. 159/KMA/SK.HK2/VIII/2026.',
    fileUrl: '',
    fileName: 'Laporan_Berkala_Keadaan_Perkara_dan_Penutupan_eRegister_SIPP_2026.pdf',
    fileSize: '3.4 MB',
    fileType: 'PDF',
    tanggalUpload: '2026-09-05',
    penanggungJawab: 'Panitera & Kepaniteraan Muda Hukum Dilmilti V'
  }
];

export const INITIAL_PTSP_QUEUE: PTSPQueueItem[] = [
  {
    id: 'ptsp-q-1',
    nomorAntrean: 'A-001',
    mejaLoket: 'Meja 1 (Pidana)',
    namaPemohon: 'Mayor Chk Handoko, S.H.',
    instansiKesatuan: 'Kumdam XIV/Hasanuddin',
    nomorWA: '0812-3456-7890',
    keperluan: 'Penyampaian Memori Banding Perkara 24-K/PMT.V/BDG/AD/VIII/2026',
    waktuDaftar: '08:15 WITA',
    estimasiPanggil: '08:30 WITA',
    status: 'Dipanggil',
    petugasMelayani: 'Mayor Chk Mahpul Saepuloh, S.H.'
  },
  {
    id: 'ptsp-q-2',
    nomorAntrean: 'B-002',
    mejaLoket: 'Meja 2 (TUN)',
    namaPemohon: 'Letda Laut (S) Danang Kurniawan',
    instansiKesatuan: 'Lantamal VI Makassar',
    nomorWA: '0813-9988-7711',
    keperluan: 'Pendaftaran Gugatan Sengketa TUN Prajurit (e-Filing)',
    waktuDaftar: '08:40 WITA',
    estimasiPanggil: '09:00 WITA',
    status: 'Menunggu'
  },
  {
    id: 'ptsp-q-3',
    nomorAntrean: 'C-003',
    mejaLoket: 'Meja 3 (Hukum & PPID)',
    namaPemohon: 'Advokat M. Ramli Syam, S.H.',
    instansiKesatuan: 'Kantor Hukum Phinisi',
    nomorWA: '0852-9900-1122',
    keperluan: 'Permohonan Salinan Putusan Resmi BHT untuk Eksekusi',
    waktuDaftar: '09:05 WITA',
    estimasiPanggil: '09:20 WITA',
    status: 'Menunggu'
  }
];

export const INITIAL_PTSP_TICKETS: PTSPServiceTicket[] = [
  {
    ticketId: 'PTSP-20260915-0101',
    jenisLayanan: 'Izin Besuk Tahanan Militer',
    namaPemohon: 'Ibu Ratna Kumala',
    instansiKesatuan: 'Keluarga Terdakwa / Sipil',
    nomorIdentitas: '7371104509880002',
    nomorWA: '0812-4455-6677',
    emailPemohon: 'ratna.kumala@gmail.com',
    nomorPerkaraTerkait: '18-K/PMT.V/BDG/AL/VII/2026',
    catatanKeperluan: 'Izin besuk rutin tahanan militer di Lemasmiltar III Makassar.',
    tanggalPengajuan: '2026-09-15 08:30:00',
    status: 'Selesai (Siap Ambil/Unduh)',
    catatanPetugas: 'Surat Izin Besuk Resmi telah ditandatangani Panitera Muda Pidana. Kode Barcode terverifikasi.',
    linkUnduhHasil: 'https://dilmilti5.go.id/docs/Surat_Izin_Besuk_PTSP_0101.pdf'
  },
  {
    ticketId: 'PTSP-20260915-0102',
    jenisLayanan: 'Legalisasi Salinan Putusan',
    namaPemohon: 'Kapten Chk Bambang S.',
    instansiKesatuan: 'Oditurat Militer IV-16 Makassar',
    nomorIdentitas: '21010045550882',
    nomorWA: '0813-2233-4455',
    emailPemohon: 'otmil.makassar@tnad.mil.id',
    nomorPerkaraTerkait: '24-K/PMT.V/BDG/AD/VIII/2026',
    catatanKeperluan: 'Permohonan legalisasi 5 eksemplar petikan amar putusan banding untuk arsip Otmil.',
    tanggalPengajuan: '2026-09-15 09:10:00',
    status: 'Verifikasi Dokumen',
    catatanPetugas: 'Sedang diverifikasi oleh Petugas Meja Hukum & PPID.'
  }
];

export const INITIAL_PTSP_APP_CONFIG: PTSPInnovationAppConfig = {
  appName: 'Aplikasi Inovasi PTSP Online Dilmilti V Makassar',
  appDescription: 'Portal Inovasi Pelayanan Terpadu Satu Pintu Digital Terintegrasi SIPP, Notifikasi WA, dan Sistem Antrean Taktis Peradilan Militer',
  externalUrl: 'https://ptsp-inovasi.dilmilti-makassar.go.id',
  isExternalEmbedActive: true,
  lastUpdated: '2026-09-15 08:00:00'
};

// PERSONEL RESMI DILMILTI V MAKASSAR (SESUAI DOKUMEN RESMI PDF MA-RI)
export const OFFICIAL_PERSONNEL_INITIAL: PersonnelItem[] = [
  {
    id: 'pers-1',
    no: 1,
    nama: 'Sultan, S.H.',
    nipNrp: '11980017760771',
    pangkatGol: 'Kolonel Chk',
    jabatan: 'Wakadilmilti V Makassar',
    kategori: 'Pimpinan',
    isMutasiMasuk: false,
    matra: 'TNI AD',
    pendidikan: 'Sarjana Hukum (S.H.)',
    riwayatSingkat: 'Pimpinan tertinggi operasional Pengadilan Militer Tinggi V Makassar.',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-2',
    no: 2,
    nama: 'Sugeng Aryanto, S.H., M.H.',
    nipNrp: '11980058680275',
    pangkatGol: 'Kolonel Chk',
    jabatan: 'Hakim Militer Tinggi',
    kategori: 'Hakim Militer Tinggi',
    isMutasiMasuk: false,
    matra: 'TNI AD',
    pendidikan: 'Magister Hukum (M.H.)',
    riwayatSingkat: 'Hakim Militer Tinggi Majelis A membidangi perkara banding tindak pidana militer berat.',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-3',
    no: 3,
    nama: 'Agus Husin, S.H., M.H.',
    nipNrp: '636562',
    pangkatGol: 'Kolonel Chk',
    jabatan: 'Hakim Militer Tinggi',
    kategori: 'Hakim Militer Tinggi',
    isMutasiMasuk: false,
    matra: 'TNI AD',
    pendidikan: 'Magister Hukum (M.H.)',
    riwayatSingkat: 'Hakim Militer Tinggi anggota Majelis Penguji Perkara Banding & Pengawasan Daerah.',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-4',
    no: 4,
    nama: 'Mustofa, S.H., M.H.',
    nipNrp: '524423',
    pangkatGol: 'Kolonel Kum',
    jabatan: 'Hakim Militer Tinggi',
    kategori: 'Hakim Militer Tinggi',
    isMutasiMasuk: false,
    matra: 'TNI AU',
    pendidikan: 'Magister Hukum (M.H.)',
    riwayatSingkat: 'Hakim Militer Tinggi Matra Udara (Kum), Hakim Pengawas Bidang Kepaniteraan.',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-5',
    no: 5,
    nama: 'M. Nirwan Said, S.H., M.H.',
    nipNrp: '524418',
    pangkatGol: 'Kolonel Kum',
    jabatan: 'Panitera',
    kategori: 'Kepaniteraan',
    isMutasiMasuk: false,
    matra: 'TNI AU',
    pendidikan: 'Magister Hukum (M.H.)',
    riwayatSingkat: 'Kepala Kepaniteraan Peradilan Militer Tinggi V Makassar.',
    fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-6',
    no: 6,
    nama: 'Mahpul Saepuloh, S.H.',
    nipNrp: '21940135670972',
    pangkatGol: 'Mayor Chk',
    jabatan: 'Panmud Pidana',
    kategori: 'Kepaniteraan',
    isMutasiMasuk: false,
    matra: 'TNI AD',
    pendidikan: 'Sarjana Hukum (S.H.)',
    riwayatSingkat: 'Panitera Muda Pidana mengelola register perkara pidana militer & minutasi.',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-7',
    no: 7,
    nama: 'Rusjana, S.H.',
    nipNrp: '21020041120782',
    pangkatGol: 'Kapten Chk',
    jabatan: 'Panitera Pengganti',
    kategori: 'Kepaniteraan',
    isMutasiMasuk: false,
    matra: 'TNI AD',
    pendidikan: 'Sarjana Hukum (S.H.)',
    riwayatSingkat: 'Panitera Pengganti bertugas mendampingi Majelis Hakim pada setiap persidangan.',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-8',
    no: 8,
    nama: 'Muhammad Arfah Afendi, S.E., M.M.',
    nipNrp: '197611302006041002',
    pangkatGol: 'Pembina Tingkat I / Golongan IV/b',
    jabatan: 'Kabag Perencanaan dan Kepegawaian',
    kategori: 'Kesekretariatan',
    isMutasiMasuk: false,
    matra: 'ASN MA-RI',
    pendidikan: 'Magister Manajemen (M.M.)',
    riwayatSingkat: 'Kepala Bagian Perencanaan, TI, Organisasi, dan Kepegawaian.',
    fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-9',
    no: 9,
    nama: 'Herna Dian Prihatiny Napan, S.T.',
    nipNrp: '198509022009122004',
    pangkatGol: 'Pembina / Golongan IV/a',
    jabatan: 'Kabag Umum dan Keuangan',
    kategori: 'Kesekretariatan',
    isMutasiMasuk: false,
    matra: 'ASN MA-RI',
    pendidikan: 'Sarjana Teknik (S.T.)',
    riwayatSingkat: 'Kepala Bagian Umum, Keuangan, Rumah Tangga, dan Pengelolaan BMN.',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-10',
    no: 10,
    nama: 'Andi Adzan Mirzan, S.Kom., M.M.',
    nipNrp: '198503092009041001',
    pangkatGol: 'Pembina / Golongan IV/a',
    jabatan: 'Kasubbag Tata Usaha dan Rumah Tangga',
    kategori: 'Kesekretariatan',
    isMutasiMasuk: false,
    matra: 'ASN MA-RI',
    pendidikan: 'Magister Manajemen (M.M.)',
    riwayatSingkat: 'Kepala Sub Bagian Tata Usaha, Protokoler, dan Rumah Tangga Kedinasan.',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-11',
    no: 11,
    nama: 'Muhammad Imam S, S.H.',
    nipNrp: '199205302019031006',
    pangkatGol: 'Penata Muda Tingkat I / Golongan III/b',
    jabatan: 'Kasubbag Rencana Program dan Anggaran',
    kategori: 'Kesekretariatan',
    isMutasiMasuk: false,
    matra: 'ASN MA-RI',
    pendidikan: 'Sarjana Hukum (S.H.)',
    riwayatSingkat: 'Kepala Sub Bagian Rencana Kerja, Program, DIPA, dan Anggaran.',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-12',
    no: 12,
    nama: 'Allen Farlianso, S.E.',
    nipNrp: '199406232020121004',
    pangkatGol: 'Penata Muda Tingkat I / Golongan III/b',
    jabatan: 'Kasubbag Keuangan dan Pelaporan',
    kategori: 'Kesekretariatan',
    isMutasiMasuk: false,
    matra: 'ASN MA-RI',
    pendidikan: 'Sarjana Ekonomi (S.E.)',
    riwayatSingkat: 'Kepala Sub Bagian Keuangan, Perbendaharaan, dan Pelaporan LKjIP/SAIBA.',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-13',
    no: 13,
    nama: 'Afni Syafaatun, S.A.P., M.A.P.',
    nipNrp: '199609182020122005',
    pangkatGol: 'Penata Muda Tingkat I / Golongan III/b',
    jabatan: 'Kasubbag Kepegawaian dan Teknologi Informasi',
    kategori: 'Kesekretariatan',
    isMutasiMasuk: false,
    matra: 'ASN MA-RI',
    pendidikan: 'Magister Administrasi Publik (M.A.P.)',
    riwayatSingkat: 'Kepala Sub Bagian Kepegawaian, Diklat, TI, dan Pengelolaan Website Peradilan.',
    fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-14',
    no: 14,
    nama: 'Muhammad Adib Hadriansyah, S.E.',
    nipNrp: '199207192020121006',
    pangkatGol: 'Penata Muda Tingkat I / Golongan III/b',
    jabatan: 'Pranata Keuangan APBN Mahir',
    kategori: 'Kesekretariatan',
    isMutasiMasuk: true,
    matra: 'ASN MA-RI',
    pendidikan: 'Sarjana Ekonomi (S.E.)',
    riwayatSingkat: 'Pranata Keuangan APBN Mahir Sub Bagian Keuangan dan Pelaporan (Status: Mutasi Masuk).',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-15',
    no: 15,
    nama: 'Nasriani',
    nipNrp: '197510131998032001',
    pangkatGol: 'Penata Muda Tingkat I / Golongan III/b',
    jabatan: 'Pengadministrasi Perkantoran Sub Bagian Keuangan dan Pelaporan',
    kategori: 'Kesekretariatan',
    isMutasiMasuk: true,
    matra: 'ASN MA-RI',
    pendidikan: 'Diploma Administrasi Perkantoran',
    riwayatSingkat: 'Pelaksana Pengadministrasi Perkantoran Subbag Keuangan dan Pelaporan (Status: Mutasi Masuk).',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'pers-16',
    no: 16,
    nama: 'Muhammad Faisal',
    nipNrp: '31170636711196',
    pangkatGol: 'Pratu',
    jabatan: 'Pengadministrasi Perkantoran Sub Bagian Kepegawaian dan Teknologi Informasi',
    kategori: 'Kesekretariatan',
    isMutasiMasuk: true,
    matra: 'TNI AD',
    pendidikan: 'Sekolah Kejuruan Militer',
    riwayatSingkat: 'Pelaksana Pengadministrasi Perkantoran Subbag Kepegawaian & TI (Status: Mutasi Masuk).',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
  }
];

// USER ACCOUNTS SEED
export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-1',
    nama: 'Sultan, S.H. (Wakadilmilti V)',
    email: 'admin@dilmilti5.go.id',
    password: 'admin123',
    role: 'super_admin',
    nipNrp: '11980017760771',
    instansi: 'Pengadilan Militer Tinggi V Makassar',
    nomorWA: '0811-4440-5554',
    status: 'aktif',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01 08:00:00',
    lastLogin: '2026-09-15 08:30:00'
  },
  {
    id: 'user-2',
    nama: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
    email: 'kepaniteraan@dilmilti5.go.id',
    password: 'panitera123',
    role: 'admin_kepaniteraan',
    nipNrp: '524418',
    instansi: 'Kepaniteraan Dilmilti V',
    nomorWA: '0812-3456-7891',
    status: 'aktif',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10 09:00:00',
    lastLogin: '2026-09-14 14:15:00'
  },
  {
    id: 'user-3',
    nama: 'Muhammad Arfah Afendi, S.E., M.M.',
    email: 'kesekretariatan@dilmilti5.go.id',
    password: 'sekretaris123',
    role: 'admin_kesekretariatan',
    nipNrp: '197611302006041002',
    instansi: 'Kesekretariatan Dilmilti V',
    nomorWA: '0813-9876-5432',
    status: 'aktif',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
    createdAt: '2026-01-12 10:00:00',
    lastLogin: '2026-09-14 16:45:00'
  },
  {
    id: 'user-4',
    nama: 'Afni Syafaatun, S.A.P., M.A.P.',
    email: 'humas@dilmilti5.go.id',
    password: 'humas123',
    role: 'editor_humas',
    nipNrp: '199609182020122005',
    instansi: 'Subbag Kepegawaian & TI (Humas)',
    nomorWA: '0811-9988-7766',
    status: 'aktif',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01 11:30:00',
    lastLogin: '2026-09-15 09:10:00'
  },
  {
    id: 'user-5',
    nama: 'Mayor Chk Mahpul Saepuloh (Petugas PTSP)',
    email: 'ptsp@dilmilti5.go.id',
    password: 'ptsp123',
    role: 'petugas_ptsp',
    nipNrp: '21940135670972',
    instansi: 'Pelayanan Terpadu Satu Pintu',
    nomorWA: '0812-7766-5544',
    status: 'aktif',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    createdAt: '2026-02-15 13:00:00',
    lastLogin: '2026-09-13 11:20:00'
  },
  {
    id: 'user-6',
    nama: 'Advokat M. Ramli Syam, S.H.',
    email: 'user@tamu.id',
    password: 'tamu123',
    role: 'user_tamu',
    nipNrp: 'KTP: 7371101508890001',
    instansi: 'Kantor Advokat & Konsultan Hukum Phinisi',
    nomorWA: '0852-9900-1122',
    status: 'aktif',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    createdAt: '2026-03-01 10:00:00',
    lastLogin: '2026-09-15 07:45:00'
  }
];

// INITIAL AUDIT LOGS
export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-15 08:30:12',
    userName: 'Sultan, S.H.',
    userRole: 'Super Admin',
    action: 'LOGIN',
    module: 'SISTEM',
    details: 'Login sistem melalui Portal Otentikasi Terenkripsi'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-14 16:45:30',
    userName: 'Muhammad Arfah Afendi',
    userRole: 'Admin Kesekretariatan',
    action: 'UPDATE',
    module: 'PERSONEL',
    details: 'Sinkronisasi data Personel resmi DILMILTI V Makassar'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-14 14:20:05',
    userName: 'M. Nirwan Said',
    userRole: 'Admin Kepaniteraan',
    action: 'UPDATE',
    module: 'SIPP',
    details: 'Pembaruan amar putusan perkara 24-K/PMT.V/BDG/AD/VIII/2026'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-13 11:15:40',
    userName: 'Afni Syafaatun',
    userRole: 'Editor Humas',
    action: 'CREATE',
    module: 'BERITA',
    details: 'Publikasi artikel: Sosialisasi Standardisasi SK Badilmiltun 593/2026'
  }
];

export const INITIAL_SLIDES: MakassarSlide[] = [
  {
    id: 'slide-1',
    badge: 'Pelayanan Prima',
    tag: 'PTSP Terpadu & Layanan Ramah Disabilitas • DILMILTI V MAKASSAR',
    title: 'Pelayanan Prima Terpadu Satu Pintu (PTSP) yang Cepat, Sederhana & Berbiaya Ringan',
    subtitle: 'Standar Pelayanan Peradilan Militer Berkelas Dunia & Bebas Pungutan Liar',
    desc: 'Pengadilan Militer Tinggi V Makassar berkomitmen menghadirkan pelayanan publik prima melalui meja PTSP terpadu, layanan Posbakum gratis, serta fasilitas ramah penyandang disabilitas.',
    actionText: 'Akses Layanan PTSP',
    targetSection: 'layanan-publik',
    makassarHighlight: 'Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar',
    iconType: 'losari',
    bgImage: bannerPtsp
  },
  {
    id: 'slide-2',
    badge: 'Zona Integritas',
    tag: 'Pembangunan ZI Menuju WBK / WBBM & SMAP ISO 37001',
    title: 'Komitmen Zona Integritas: Wilayah Bebas dari Korupsi (WBK) & Birokrasi Bersih Melayani',
    subtitle: 'Filosofi Sulapa Eppa & Motto REWAKO: Teguh Menjaga Kemandirian Peradilan',
    desc: 'Menjunjung tinggi integritas aparatur peradilan militer, pakta integritas, pengendalian gratifikasi, dan Sistem Manajemen Anti Penyuapan (SMAP) di seluruh wilayah hukum Indonesia Timur.',
    actionText: 'Lihat Eviden Zona Integritas',
    targetSection: 'reformasi-birokrasi',
    makassarHighlight: 'Predikat WBK / WBBM • Akuntabilitas 100%',
    iconType: 'pinisi',
    bgImage: bannerMakassar
  },
  {
    id: 'slide-3',
    badge: 'Informasi Sidang',
    tag: 'SIPP & Agenda Persidangan Real-Time • DILMILTI V MAKASSAR',
    title: 'Keterbukaan Informasi Sidang Harian & Penelusuran Perkara (SIPP) Transparan',
    subtitle: 'Pantau Jadwal Sidang Ruang Utama, Majelis Hakim & Status Perkara Secara Langsung',
    desc: 'Kemudahan akses publik dalam memantau jadwal persidangan perkara pidana militer tingkat banding, perkara tingkat pertama, dan sengketa Tata Usaha Militer secara akurat.',
    actionText: 'Cek Jadwal Sidang Hari Ini',
    targetSection: 'jadwal-sidang',
    makassarHighlight: 'Ruang Sidang Utama Dilmilti V Makassar',
    iconType: 'pinisi',
    bgImage: bannerMaklumat
  },
  {
    id: 'slide-4',
    badge: 'Inovasi Digital',
    tag: 'Transformasi Peradilan Modern • e-Court & Inovasi Layanan',
    title: 'Inovasi Digital Peradilan: e-Court, PTSP Online & Notifikasi Perkara Real-Time',
    subtitle: 'Mendekatkan Akses Keadilan di 12 Provinsi Wilayah Hukum Indonesia Timur',
    desc: 'Integrasi layanan e-Filing, e-Payment, e-Summons, dan e-Litigation bersama inovasi layanan digital Pengadilan Militer Tinggi V Makassar untuk efisiensi pencari keadilan.',
    actionText: 'Jelajahi Inovasi Layanan',
    targetSection: 'ptsp-inovasi',
    makassarHighlight: 'Sistem Informasi Peradilan Digital Terpadu',
    iconType: 'perma',
    bgImage: bannerPtsp
  },
  {
    id: 'slide-5',
    badge: 'Pengumuman Penting',
    tag: 'Maklumat Pelayanan & Informasi Publik SK KMA 2-144/2022',
    title: 'Pengumuman Penting & Keterbukaan Informasi Publik (PPID) Dilmilti V Makassar',
    subtitle: 'Informasi Resmi Pengadilan, Pengumuman Persidangan & Layanan Pengaduan SIWAS',
    desc: 'Waspada penipuan mengatasnamakan pejabat pengadilan. Seluruh informasi biaya perkara, pengumuman resmi, dan Daftar Informasi Publik (DIP) tersedia secara terbuka.',
    actionText: 'Baca Pengumuman Resmi',
    targetSection: 'berita',
    makassarHighlight: 'Keterbukaan Informasi Publik SK KMA 2-144',
    iconType: 'pinisi',
    bgImage: bannerMakassar
  }
];

export const DEFAULT_ROLE_MODEL_AGENTS: RoleModelAndAgentItem[] = [
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
    nama: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
    jabatan: 'Panitera Pengadilan Militer Tinggi V Makassar',
    pangkatNip: 'Kolonel Kum / NRP 524418',
    komitmenKerja: 'Mendorong inovasi layanan kepaniteraan digital berbasis e-Court, MonEksTUN, dan PTSP Online.',
    kontribusiReformasi: 'Penyusunan SOP PTSP 6 Meja dan percepatan penyelesaian perkara banding.',
    rencanaProgramKerja: 'Pengembangan Portal E-Brosur interaktif, layanan publik inklusif disabilitas, dan edukasi publik.',
    fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80'
  }
];

export const DEFAULT_PUBLIC_COMPENSATION_INFO: PublicCompensationInfo = {
  skNomor: 'SK KADILMILTI V NO. W5-MIL/SK.PTSP/0102/2026',
  skTanggal: '15 Januari 2026',
  deskripsiAturan: 'Pemberian kompensasi pelayanan merupakan bentuk jaminan kepastian dan akuntabilitas apabila petugas PTSP terlambat memberikan layanan melebihi Standar Operasional Prosedur (SOP) yang ditetapkan.',
  waktuKeterlambatanStandar: 'Lebih dari 30 menit dari SOP estimasi pendaftaran/legalisasi.',
  bentukKompensasi: 'Pemberian souvenir/souvenir dinas resmi, prioritas bebas antrean langsung pada kunjungan berikutnya, dan penyampaian permohonan maaf tertulis dari Pejabat Pembina PTSP.'
};

export const DEFAULT_SIDANG_LUAR_GEDUNG_INFO: SidangLuarGedungInfo = {
  skNomor: 'SK DIRJEN BADILMILTUN NO. 80/DJMT/KEP/OT.01.1/V/2024',
  deskripsi: 'Sidang di Luar Gedung Pengadilan dilaksanakan untuk memperluas jangkauan keadilan bagi prajurit TNI dan masyarakat yang berada di lokasi jauh dari Markas Pengadilan Militer Tinggi V Makassar.',
  persyaratan: [
    'Permohonan resmi dari Pangkalan/Kesatuan Militer setempat',
    'Pemeriksaan perkara dengan jumlah saksi/terdakwa lebih dari 5 orang di luar Kota Makassar',
    'Pertimbangan efisiensi waktu, biaya, dan keamanan persidangan'
  ],
  lokasiPelaksanaan: [
    'Wilayah Hukum Makassar & Sekitarnya (Kodam XIV/Hasanuddin)',
    'Pangkalan TNI AL / Lanud Sultan Hasanuddin',
    'Wilayah Hukum Pengadilan Militer Bawahan (Ambon, Manado, Jayapura, Kendari, Manokwari)'
  ],
  jadwalRencana: 'Triwulanan / Sesuai Penetapan Majelis Hakim'
};

export const DEFAULT_SURVEI_REPORTS: SurveiReportItem[] = [
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

export const DEFAULT_BROSUR_DIGITAL: BrosurDigitalItem[] = [
  {
    id: 'brosur-1',
    judulBrosur: 'Panduan Layanan PTSP Online & Hak-Hak Pengguna Peradilan',
    kategori: 'Pelayanan Publik & PTSP',
    deskripsi: 'Brosur informasi lengkap alur pendaftaran perkara, permohonan izin besuk, dan layanan bebas biaya.',
    filePdfUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Standar_Pelayanan_PTSP_2026.pdf',
    coverImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'brosur-2',
    judulBrosur: 'Brosur Layanan Disabilitas & Ramah Inklusi SK Dirjen 256/2021',
    kategori: 'Layanan Disabilitas',
    deskripsi: 'Petunjuk fasilitas sarana prasarana dan pendampingan khusus bagi pengguna layanan difabel.',
    filePdfUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Buku_SOP_Terpadu_Dilmilti5_2026.pdf',
    coverImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  }
];

export const DEFAULT_WEBSITE_MONEV_REPORTS: WebsiteMonevReportItem[] = [
  {
    id: 'monev-2026-t3',
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

export interface VersionVectorNode {
  version: number;
  timestamp: number;
  isoTimestamp: string;
}

export interface CourtVersionVector {
  version: number;
  timestamp: number;
  isoTimestamp: string;
  baseServerVersion: number;
  baseServerTimestamp: number;
  keys: Record<string, VersionVectorNode>;
}

export interface CourtDbSnapshot {
  version: number;
  timestamp: number;
  isoTimestamp: string;
  source: 'server' | 'local_mutation' | 'seed';
  versionVector?: CourtVersionVector;
  data: Record<string, any>;
}

const SNAPSHOT_CACHE_KEY = 'dilmilti5_db_snapshot_cache_v1';
const SNAPSHOT_META_KEY = 'dilmilti5_db_snapshot_meta_v1';
const VERSION_VECTOR_KEY = 'dilmilti5_db_version_vector_v1';

export type SyncTaskType =
  | 'SYNC_PUSH'
  | 'SYNC_PULL'
  | 'HIGH_PRIORITY_PULL'
  | 'VERSION_CHECK'
  | 'RECONCILE_SW_PAYLOAD'
  | 'BUILD_SNAPSHOT'
  | 'RESOLVE_MEDIA';

export interface SyncWorkerRequest {
  taskId: string;
  type: SyncTaskType;
  origin: string;
  timeoutMs?: number;
  payload: Record<string, any>;
}

export interface SyncWorkerResponse {
  taskId: string;
  type: SyncTaskType;
  ok: boolean;
  durationMs: number;
  executedInWorker: boolean;
  result?: any;
  error?: string;
}

export interface SyncManagerMetrics {
  workerActive: boolean;
  tasksCompleted: number;
  tasksFailed: number;
  inFlightTasks: number;
  lastDurationMs: number;
  networkQuality: '4g' | '3g' | '2g' | 'slow-2g' | 'offline' | 'unknown';
}

const COURT_SYNC_WORKER_SOURCE = `
  const CURRENT_USER_KEY = 'dilmilti5_current_user';

  async function fetchWithAdaptiveTimeout(url, options, timeoutMs = 12000, maxRetries = 1) {
    let lastErr = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
      try {
        const res = await fetch(url, {
          ...options,
          signal: controller ? controller.signal : undefined
        });
        if (timer) clearTimeout(timer);
        return res;
      } catch (err) {
        if (timer) clearTimeout(timer);
        lastErr = err;
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 350 * (attempt + 1)));
        }
      }
    }
    throw lastErr || new Error('Network request failed in SyncWorker');
  }

  function parseRawEntries(rawEntries) {
    const parsed = {};
    if (!rawEntries || typeof rawEntries !== 'object') return parsed;
    const keys = Object.keys(rawEntries);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (k === CURRENT_USER_KEY) continue;
      const rawVal = rawEntries[k];
      if (typeof rawVal === 'string') {
        try {
          parsed[k] = JSON.parse(rawVal);
        } catch {
          parsed[k] = rawVal;
        }
      } else if (rawVal !== undefined) {
        parsed[k] = rawVal;
      }
    }
    return parsed;
  }

  function computeChangedEntries(serverData, rawEntries) {
    const changedEntries = {};
    let hasChanges = false;
    if (!serverData || typeof serverData !== 'object') {
      return { changedEntries, hasChanges };
    }
    const entries = Object.entries(serverData);
    for (let i = 0; i < entries.length; i++) {
      const [key, val] = entries[i];
      if (!key.startsWith('dilmilti5_') || key === CURRENT_USER_KEY) continue;
      const strVal = typeof val === 'string' ? val : JSON.stringify(val);
      if (!rawEntries || rawEntries[key] !== strVal) {
        changedEntries[key] = strVal;
        hasChanges = true;
      }
    }
    return { changedEntries, hasChanges };
  }

  function buildSerializedSnapshotArtifacts(dataObj, version, source, versionVector, nowTs) {
    const now = nowTs || Date.now();
    const iso = new Date(now).toISOString();
    const snapshot = {
      version,
      timestamp: now,
      isoTimestamp: iso,
      source,
      versionVector,
      data: dataObj
    };
    const meta = {
      version,
      timestamp: now,
      isoTimestamp: iso,
      source,
      keysCount: dataObj ? Object.keys(dataObj).length : 0
    };
    return {
      snapshot,
      snapshotJson: JSON.stringify(snapshot),
      metaJson: JSON.stringify(meta),
      versionVectorJson: versionVector ? JSON.stringify(versionVector) : null,
      timestamp: now,
      isoTimestamp: iso
    };
  }

  async function prewarmCacheInWorker(origin, relativeUrl, dataUrl) {
    try {
      if (typeof caches === 'undefined' || !relativeUrl || !dataUrl || !dataUrl.startsWith('data:')) return;
      const blobRes = await fetch(dataUrl);
      const blob = await blobRes.blob();
      const cache = await caches.open('dilmilti5-static-v3');
      const fullUrl = relativeUrl.startsWith('http') ? relativeUrl : origin + (relativeUrl.startsWith('/') ? relativeUrl : '/' + relativeUrl);
      await cache.put(
        new Request(fullUrl, { method: 'GET' }),
        new Response(blob, {
          status: 200,
          headers: {
            'Content-Type': blob.type || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        })
      );
    } catch {}
  }

  async function uploadBase64InWorker(origin, dataUrl, originalFilename, folder, timeoutMs) {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return dataUrl || '';
    }
    try {
      const res = await fetchWithAdaptiveTimeout(
        origin + '/api/upload',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: originalFilename || 'media_upload',
            dataUrl,
            folder: folder || 'uploads'
          })
        },
        timeoutMs || 15000,
        1
      );
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.url) {
          await prewarmCacheInWorker(origin, json.url, dataUrl);
          return json.url;
        }
      }
    } catch {}
    return dataUrl;
  }

  async function resolveEmbeddedMediaInWorker(origin, obj, folder, timeoutMs) {
    if (!obj) return obj;
    if (typeof obj === 'string') {
      if (obj.startsWith('data:')) {
        return await uploadBase64InWorker(origin, obj, 'media_upload', folder, timeoutMs);
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      let arrModified = false;
      const arr = new Array(obj.length);
      for (let i = 0; i < obj.length; i++) {
        const updatedItem = await resolveEmbeddedMediaInWorker(origin, obj[i], folder, timeoutMs);
        if (updatedItem !== obj[i]) arrModified = true;
        arr[i] = updatedItem;
      }
      return arrModified ? arr : obj;
    }
    if (typeof obj === 'object') {
      let objModified = false;
      const resObj = {};
      const entries = Object.entries(obj);
      for (let i = 0; i < entries.length; i++) {
        const [k, v] = entries[i];
        let updatedVal = v;
        if (typeof v === 'string' && v.startsWith('data:')) {
          updatedVal = await uploadBase64InWorker(origin, v, k, folder, timeoutMs);
        } else if (typeof v === 'object' && v !== null) {
          updatedVal = await resolveEmbeddedMediaInWorker(origin, v, folder, timeoutMs);
        }
        if (updatedVal !== v) objModified = true;
        resObj[k] = updatedVal;
      }
      return objModified ? resObj : obj;
    }
    return obj;
  }

  async function executeSyncPull(origin, payload, timeoutMs) {
    const queryUrl = payload.priorityUrl
      ? origin + payload.priorityUrl
      : origin + '/api/court-db?_t=' + Date.now();
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      ...(payload.headers || {})
    };
    const res = await fetchWithAdaptiveTimeout(
      queryUrl,
      { cache: 'no-store', headers },
      timeoutMs || 12000,
      1
    );
    if (!res.ok) {
      return { success: false, status: res.status };
    }
    const json = await res.json();
    if (!json || !json.success || !json.data) {
      return { success: false, status: 200 };
    }

    const serverVer = Math.max(typeof json.version === 'number' ? json.version : 85, 85);
    const parsedServerTs = json.lastUpdated ? Date.parse(json.lastUpdated) : NaN;
    const serverTs = !Number.isNaN(parsedServerTs) && parsedServerTs > 0 ? parsedServerTs : Date.now();

    const currentVector = payload.versionVector || {
      version: serverVer,
      timestamp: serverTs,
      isoTimestamp: new Date(serverTs).toISOString(),
      baseServerVersion: serverVer,
      baseServerTimestamp: serverTs,
      keys: {}
    };

    const syncedVector = {
      ...currentVector,
      version: Math.max(currentVector.version || 0, serverVer),
      timestamp: Math.max(currentVector.timestamp || 0, serverTs),
      isoTimestamp: new Date(Math.max(currentVector.timestamp || 0, serverTs)).toISOString(),
      baseServerVersion: serverVer,
      baseServerTimestamp: serverTs
    };

    const rawEntries = payload.rawEntries || {};
    const { changedEntries, hasChanges } = computeChangedEntries(json.data, rawEntries);

    const mergedData = { ...parseRawEntries(rawEntries) };
    Object.entries(json.data).forEach(([k, v]) => {
      if (k.startsWith('dilmilti5_') && k !== CURRENT_USER_KEY) {
        if (typeof v === 'string') {
          try {
            mergedData[k] = JSON.parse(v);
          } catch {
            mergedData[k] = v;
          }
        } else {
          mergedData[k] = v;
        }
      }
    });

    const artifacts = buildSerializedSnapshotArtifacts(
      mergedData,
      serverVer,
      'server',
      syncedVector,
      Date.now()
    );

    return {
      success: true,
      version: serverVer,
      serverTimestamp: serverTs,
      lastUpdated: json.lastUpdated,
      hasChanges,
      changedEntries,
      syncedVector,
      ...artifacts
    };
  }

  async function executeSyncPush(origin, payload, timeoutMs) {
    const syncStartTime = payload.syncStartTime || Date.now();
    const localVer = payload.localVer || 85;
    const localVector = payload.localVector || {
      version: localVer,
      timestamp: syncStartTime,
      isoTimestamp: new Date(syncStartTime).toISOString(),
      baseServerVersion: localVer,
      baseServerTimestamp: syncStartTime,
      keys: {}
    };
    const localWriteTs = payload.localWriteTs || syncStartTime;
    const modifiedKeys = Array.isArray(payload.modifiedKeys) ? payload.modifiedKeys : [];
    const remoteVersion = payload.lastSyncedServerVersion || 0;
    const remoteTimestamp = payload.lastSyncedServerTimestamp || 0;

    // 1. Parse local entries and prepare delta payload off the main thread
    const allData = parseRawEntries(payload.rawEntries || {});
    const reconciledEntriesForLocal = {};

    // Send only mutated keys (delta sync) when specific keys were modified so Vercel POST payload is tiny (<20KB)
    let dataToSend = allData;
    if (modifiedKeys.length > 0 && !payload.forceFullSync) {
      const deltaData = {};
      for (let i = 0; i < modifiedKeys.length; i++) {
        const item = modifiedKeys[i];
        if (item && item.key && allData[item.key] !== undefined) {
          deltaData[item.key] = allData[item.key];
        }
      }
      if (allData['dilmilti5_db_audit_v5'] !== undefined) {
        deltaData['dilmilti5_db_audit_v5'] = allData['dilmilti5_db_audit_v5'];
      }
      if (Object.keys(deltaData).length > 0) {
        dataToSend = deltaData;
      }
    }

    // Offload any embedded base64 strings in dataToSend to /api/upload before POSTing to /api/court-db
    for (const [k, val] of Object.entries(dataToSend)) {
      const resolvedVal = await resolveEmbeddedMediaInWorker(origin, val, k, timeoutMs || 12000);
      if (resolvedVal !== val && resolvedVal !== undefined) {
        dataToSend[k] = resolvedVal;
        allData[k] = resolvedVal;
        reconciledEntriesForLocal[k] = JSON.stringify(resolvedVal);
      }
    }

    const nextVer = Math.max(localVer, remoteVersion, 85) + 1;
    const iso = new Date(syncStartTime).toISOString();
    const updatedVector = {
      version: Math.max(localVector.version || 0, nextVer),
      timestamp: syncStartTime,
      isoTimestamp: iso,
      baseServerVersion: payload.lastSyncedServerVersion || localVector.baseServerVersion || remoteVersion || nextVer,
      baseServerTimestamp: payload.lastSyncedServerTimestamp || localVector.baseServerTimestamp || remoteTimestamp || syncStartTime,
      keys: { ...(localVector.keys || {}) }
    };

    const postRes = await fetchWithAdaptiveTimeout(
      origin + '/api/court-db',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: dataToSend,
          version: nextVer,
          baseVersion: payload.lastSyncedServerVersion || localVector.baseServerVersion || remoteVersion,
          clientTimestamp: localWriteTs,
          versionVector: updatedVector
        })
      },
      timeoutMs || 15000,
      0
    );

    if (!postRes.ok) {
      return { success: false, status: postRes.status };
    }

    const json = await postRes.json();
    if (json && json.success) {
      const serverVer = typeof json.version === 'number' ? json.version : nextVer;
      const validatedVer = Math.max(serverVer, nextVer);
      const parsedServerTs = json.lastUpdated ? Date.parse(json.lastUpdated) : NaN;
      const serverTs = !Number.isNaN(parsedServerTs) && parsedServerTs > 0 ? parsedServerTs : Date.now();

      const syncedVector = {
        ...updatedVector,
        version: Math.max(updatedVector.version, validatedVer),
        timestamp: Math.max(updatedVector.timestamp || 0, serverTs),
        isoTimestamp: new Date(Math.max(updatedVector.timestamp || 0, serverTs)).toISOString(),
        baseServerVersion: validatedVer,
        baseServerTimestamp: serverTs
      };

      const artifacts = buildSerializedSnapshotArtifacts(
        allData,
        validatedVer,
        'local_mutation',
        syncedVector,
        Date.now()
      );

      return {
        success: true,
        version: validatedVer,
        serverTimestamp: serverTs,
        lastUpdated: json.lastUpdated,
        reconciledEntriesForLocal,
        syncedVector,
        ...artifacts
      };
    }

    return { success: false, response: json };
  }

  let pushQueue = Promise.resolve();

  self.onmessage = async function (event) {
    const req = event.data;
    if (!req || !req.taskId || !req.type) return;
    const startTime = Date.now();
    const origin = req.origin || '';
    const timeoutMs = req.timeoutMs || 12000;
    const payload = req.payload || {};

    const sendResult = (ok, result, error) => {
      self.postMessage({
        taskId: req.taskId,
        type: req.type,
        ok,
        durationMs: Math.max(0, Date.now() - startTime),
        executedInWorker: true,
        result,
        error
      });
    };

    try {
      if (req.type === 'SYNC_PUSH') {
        pushQueue = pushQueue
          .then(() => executeSyncPush(origin, payload, timeoutMs))
          .then((res) => sendResult(true, res))
          .catch((err) => sendResult(false, null, err?.message || String(err)));
        return;
      }

      if (req.type === 'SYNC_PULL' || req.type === 'HIGH_PRIORITY_PULL') {
        const res = await executeSyncPull(origin, payload, timeoutMs);
        sendResult(true, res);
        return;
      }

      if (req.type === 'VERSION_CHECK') {
        const verRes = await fetchWithAdaptiveTimeout(
          origin + '/api/court-db/version?_t=' + Date.now(),
          {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          },
          Math.min(timeoutMs, 8000),
          0
        );
        if (!verRes.ok) {
          sendResult(true, { connected: false, needsPull: false, status: verRes.status });
          return;
        }
        const verJson = await verRes.json();
        const serverVer = typeof verJson?.version === 'number' ? verJson.version : 0;
        const knownVer = Math.max(payload.serverVersion || 0, payload.localVersion || 0);
        const needsPull =
          serverVer > 0 &&
          (!payload.hasInitialFetched || serverVer > knownVer);

        if (needsPull && payload.rawEntries) {
          const pullResult = await executeSyncPull(origin, payload, timeoutMs);
          sendResult(true, {
            connected: true,
            serverVersion: serverVer,
            needsPull: true,
            pullResult
          });
          return;
        }

        sendResult(true, {
          connected: true,
          serverVersion: serverVer,
          needsPull
        });
        return;
      }

      if (req.type === 'RECONCILE_SW_PAYLOAD') {
        const json = payload.swPayload;
        if (!json || !json.success || !json.data) {
          sendResult(true, { success: false });
          return;
        }
        const serverVer = Math.max(typeof json.version === 'number' ? json.version : 85, 85);
        const parsedServerTs = json.lastUpdated ? Date.parse(json.lastUpdated) : NaN;
        const serverTs = !Number.isNaN(parsedServerTs) && parsedServerTs > 0 ? parsedServerTs : Date.now();
        const currentVector = payload.versionVector || {};
        const syncedVector = {
          ...currentVector,
          version: Math.max(currentVector.version || 0, serverVer),
          timestamp: Math.max(currentVector.timestamp || 0, serverTs),
          isoTimestamp: new Date(Math.max(currentVector.timestamp || 0, serverTs)).toISOString(),
          baseServerVersion: serverVer,
          baseServerTimestamp: serverTs
        };

        const rawEntries = payload.rawEntries || {};
        const { changedEntries, hasChanges } = computeChangedEntries(json.data, rawEntries);
        const mergedData = { ...parseRawEntries(rawEntries), ...json.data };
        const artifacts = buildSerializedSnapshotArtifacts(
          mergedData,
          serverVer,
          'server',
          syncedVector,
          Date.now()
        );

        sendResult(true, {
          success: true,
          version: serverVer,
          serverTimestamp: serverTs,
          hasChanges,
          changedEntries,
          syncedVector,
          ...artifacts
        });
        return;
      }

      if (req.type === 'BUILD_SNAPSHOT') {
        const allData = payload.allData || parseRawEntries(payload.rawEntries || {});
        const artifacts = buildSerializedSnapshotArtifacts(
          allData,
          payload.version || 85,
          payload.source || 'server',
          payload.versionVector,
          payload.timestamp || Date.now()
        );
        sendResult(true, { success: true, ...artifacts });
        return;
      }

      if (req.type === 'RESOLVE_MEDIA') {
        const resolvedData = await resolveEmbeddedMediaInWorker(
          origin,
          payload.data,
          payload.folder || 'uploads',
          timeoutMs
        );
        const serializedData =
          typeof resolvedData === 'string' ? resolvedData : JSON.stringify(resolvedData);
        sendResult(true, {
          success: true,
          resolvedData,
          serializedData
        });
        return;
      }

      sendResult(false, null, 'Unknown SyncTaskType: ' + req.type);
    } catch (err) {
      sendResult(false, null, err?.message || String(err));
    }
  };
`;

/**
 * SYNC MANAGER (WEB WORKER OFF-MAIN-THREAD SYNCHRONIZATION ENGINE)
 * Moves intensive data serialization, version-vector conflict resolution,
 * base64 media upload, payload diffing, and network I/O onto a dedicated Web Worker
 * so the UI remains 60fps responsive on mobile devices regardless of network conditions.
 */
export class SyncManager {
  private worker: Worker | null = null;
  private workerBlobUrl: string | null = null;
  private pendingTasks: Map<
    string,
    {
      resolve: (res: SyncWorkerResponse) => void;
      reject: (err: any) => void;
      timer: any;
    }
  > = new Map();
  private taskCounter: number = 0;
  private tasksCompleted: number = 0;
  private tasksFailed: number = 0;
  private lastDurationMs: number = 0;
  private activePullPromise: Promise<SyncWorkerResponse> | null = null;
  private activeVersionCheckPromise: Promise<SyncWorkerResponse> | null = null;

  constructor() {
    this.initWorker();
  }

  private initWorker(): void {
    if (typeof window === 'undefined' || typeof Worker === 'undefined' || typeof Blob === 'undefined') {
      return;
    }
    try {
      const blob = new Blob([COURT_SYNC_WORKER_SOURCE], { type: 'application/javascript' });
      this.workerBlobUrl = URL.createObjectURL(blob);
      this.worker = new Worker(this.workerBlobUrl);

      this.worker.onmessage = (event: MessageEvent<SyncWorkerResponse>) => {
        const data = event.data;
        if (!data || !data.taskId) return;
        const pending = this.pendingTasks.get(data.taskId);
        if (!pending) return;

        clearTimeout(pending.timer);
        this.pendingTasks.delete(data.taskId);
        this.lastDurationMs = data.durationMs || 0;

        if (data.ok) {
          this.tasksCompleted++;
        } else {
          this.tasksFailed++;
        }
        pending.resolve(data);
      };

      this.worker.onerror = (err) => {
        console.warn('[SyncManager - Worker Error] Falling back / restarting worker:', err);
        this.flushPendingWithFallback();
        this.restartWorker();
      };
    } catch (err) {
      console.warn('[SyncManager] Web Worker initialization unavailable, using async fallback:', err);
      this.worker = null;
    }
  }

  private flushPendingWithFallback(): void {
    this.pendingTasks.forEach((pending, taskId) => {
      clearTimeout(pending.timer);
      this.tasksFailed++;
      pending.resolve({
        taskId,
        type: 'SYNC_PULL',
        ok: false,
        durationMs: 0,
        executedInWorker: false,
        error: 'Worker restarted during operation'
      });
    });
    this.pendingTasks.clear();
  }

  private restartWorker(): void {
    try {
      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }
      if (this.workerBlobUrl) {
        URL.revokeObjectURL(this.workerBlobUrl);
        this.workerBlobUrl = null;
      }
    } catch {}
    setTimeout(() => {
      this.initWorker();
    }, 250);
  }

  public getNetworkQuality(): SyncManagerMetrics['networkQuality'] {
    if (typeof navigator === 'undefined') return 'unknown';
    if (navigator.onLine === false) return 'offline';
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn && typeof conn.effectiveType === 'string') {
      const eff = conn.effectiveType as SyncManagerMetrics['networkQuality'];
      if (eff === '4g' || eff === '3g' || eff === '2g' || eff === 'slow-2g') {
        return eff;
      }
    }
    return '4g';
  }

  public getAdaptiveTimeoutMs(baseMs: number = 12000): number {
    const quality = this.getNetworkQuality();
    if (quality === 'slow-2g' || quality === '2g') return Math.max(baseMs, 22000);
    if (quality === '3g') return Math.max(baseMs, 16000);
    return baseMs;
  }

  public getMetrics(): SyncManagerMetrics {
    return {
      workerActive: Boolean(this.worker),
      tasksCompleted: this.tasksCompleted,
      tasksFailed: this.tasksFailed,
      inFlightTasks: this.pendingTasks.size,
      lastDurationMs: this.lastDurationMs,
      networkQuality: this.getNetworkQuality()
    };
  }

  public isWorkerActive(): boolean {
    return Boolean(this.worker);
  }

  /**
   * Dispatches a synchronization task to the Web Worker off the main thread.
   * Coalesces concurrent pull requests so mobile devices on slow connections
   * never stampede the network with duplicate full-database downloads.
   */
  public dispatchTask(type: SyncTaskType, payload: Record<string, any>, customTimeoutMs?: number): Promise<SyncWorkerResponse> {
    if ((type === 'SYNC_PULL' || type === 'HIGH_PRIORITY_PULL') && this.activePullPromise) {
      return this.activePullPromise;
    }
    if (type === 'VERSION_CHECK' && (this.activeVersionCheckPromise || this.activePullPromise)) {
      return this.activeVersionCheckPromise || this.activePullPromise!;
    }

    const timeoutMs = this.getAdaptiveTimeoutMs(customTimeoutMs || 12000);
    const taskPromise = this.executeInWorkerOrFallback(type, payload, timeoutMs);

    if (type === 'SYNC_PULL' || type === 'HIGH_PRIORITY_PULL') {
      this.activePullPromise = taskPromise.finally(() => {
        this.activePullPromise = null;
      });
      return this.activePullPromise;
    }

    if (type === 'VERSION_CHECK') {
      this.activeVersionCheckPromise = taskPromise.finally(() => {
        this.activeVersionCheckPromise = null;
      });
      return this.activeVersionCheckPromise;
    }

    return taskPromise;
  }

  private executeInWorkerOrFallback(
    type: SyncTaskType,
    payload: Record<string, any>,
    timeoutMs: number
  ): Promise<SyncWorkerResponse> {
    const taskId = `sync_task_${++this.taskCounter}_${Date.now()}`;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    if (this.worker) {
      return new Promise<SyncWorkerResponse>((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pendingTasks.delete(taskId);
          this.tasksFailed++;
          resolve({
            taskId,
            type,
            ok: false,
            durationMs: timeoutMs,
            executedInWorker: true,
            error: `SyncWorker task ${type} timed out after ${timeoutMs}ms`
          });
        }, timeoutMs + 2500);

        this.pendingTasks.set(taskId, { resolve, reject, timer });

        try {
          const message: SyncWorkerRequest = {
            taskId,
            type,
            origin,
            timeoutMs,
            payload
          };
          this.worker!.postMessage(message);
        } catch (postErr: any) {
          clearTimeout(timer);
          this.pendingTasks.delete(taskId);
          this.executeMainThreadFallback(taskId, type, origin, payload).then(resolve).catch(reject);
        }
      });
    }

    return this.executeMainThreadFallback(taskId, type, origin, payload);
  }

  /**
   * Non-blocking async fallback if Web Workers are disabled in a restricted environment.
   */
  private async executeMainThreadFallback(
    taskId: string,
    type: SyncTaskType,
    origin: string,
    payload: Record<string, any>
  ): Promise<SyncWorkerResponse> {
    const start = Date.now();
    try {
      await new Promise((r) => setTimeout(r, 0));
      if (type === 'SYNC_PULL' || type === 'HIGH_PRIORITY_PULL') {
        const queryUrl = payload.priorityUrl
          ? `${origin}${payload.priorityUrl}`
          : `${origin}/api/court-db?_t=${Date.now()}`;
        const res = await fetch(queryUrl, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            ...(payload.headers || {})
          }
        });
        if (!res.ok) {
          return {
            taskId,
            type,
            ok: true,
            durationMs: Date.now() - start,
            executedInWorker: false,
            result: { success: false, status: res.status }
          };
        }
        const json = await res.json();
        if (!json?.success || !json?.data) {
          return {
            taskId,
            type,
            ok: true,
            durationMs: Date.now() - start,
            executedInWorker: false,
            result: { success: false }
          };
        }
        const serverVer = Math.max(typeof json.version === 'number' ? json.version : 85, 85);
        const rawEntries = payload.rawEntries || {};
        const changedEntries: Record<string, string> = {};
        let hasChanges = false;
        Object.entries(json.data).forEach(([k, v]) => {
          if (!k.startsWith('dilmilti5_') || k === STORAGE_KEYS.CURRENT_USER) return;
          const strVal = typeof v === 'string' ? v : JSON.stringify(v);
          if (rawEntries[k] !== strVal) {
            changedEntries[k] = strVal;
            hasChanges = true;
          }
        });
        return {
          taskId,
          type,
          ok: true,
          durationMs: Date.now() - start,
          executedInWorker: false,
          result: {
            success: true,
            version: serverVer,
            lastUpdated: json.lastUpdated,
            hasChanges,
            changedEntries
          }
        };
      }

      if (type === 'RESOLVE_MEDIA') {
        const serializedData =
          typeof payload.data === 'string' ? payload.data : JSON.stringify(payload.data);
        return {
          taskId,
          type,
          ok: true,
          durationMs: Date.now() - start,
          executedInWorker: false,
          result: {
            success: true,
            resolvedData: payload.data,
            serializedData
          }
        };
      }

      return {
        taskId,
        type,
        ok: false,
        durationMs: Date.now() - start,
        executedInWorker: false,
        error: 'Fallback defer to caller'
      };
    } catch (err: any) {
      return {
        taskId,
        type,
        ok: false,
        durationMs: Date.now() - start,
        executedInWorker: false,
        error: err?.message || String(err)
      };
    }
  }
}

export const courtSyncManager = new SyncManager();

// DATABASE STATE SERVICE (PERSISTENT ENGINE WITH WEB WORKER SYNC MANAGER, TIMESTAMPED SNAPSHOT CACHE & VERSION-VECTOR CHECK)
class CourtDatabaseEngine {
  public readonly syncManager: SyncManager = courtSyncManager;
  private listeners: Array<() => void> = [];
  private serverVersion: number = 0;
  private lastSyncedServerVersion: number = 0;
  private lastSyncedServerTimestamp: number = 0;
  private modifiedKeysVector: Map<string, VersionVectorNode> = new Map();
  private hasInitialFetched: boolean = false;
  private syncTimer: any = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private isServerConnected: boolean = false;
  private lastLocalWriteTime: number = 0;
  private lastSyncCompleteTime: number = 0;
  private lastCentralFetchTime: number = 0;
  private lastVersionCheckTime: number = 0;
  private isLocalSyncInProgress: boolean = false;
  private isBackgroundRevalidating: boolean = false;
  private loadedFromSnapshot: boolean = false;
  private lastSnapshotTimestamp: number | null = null;
  private lastSnapshotIso: string | null = null;
  private syncPromiseChain: Promise<any> = Promise.resolve();

  constructor() {
    this.initDatabase();
  }

  /**
   * Quota-safe localStorage writer: if browser 5MB quota is reached, clears
   * redundant snapshot cache and trims old audit entries before retrying.
   */
  private safeSetLocalStorage(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      try {
        localStorage.removeItem(SNAPSHOT_CACHE_KEY);
        const rawAudit = localStorage.getItem(STORAGE_KEYS.AUDIT);
        if (rawAudit) {
          const parsedAudit = JSON.parse(rawAudit);
          if (Array.isArray(parsedAudit) && parsedAudit.length > 15) {
            localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(parsedAudit.slice(0, 15)));
          }
        }
        localStorage.setItem(key, value);
      } catch (err) {
        console.warn(`[CourtDB] localStorage quota tight for key ${key}:`, err);
      }
    }
  }

  /**
   * Collects raw string values from localStorage in <0.2ms without calling JSON.parse
   * on the main thread, allowing the Web Worker to handle parsing, diffing, and serialization.
   */
  public getAllRawLocalEntries(): Record<string, string> {
    const rawEntries: Record<string, string> = {};
    if (typeof window === 'undefined') return rawEntries;
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k === STORAGE_KEYS.CURRENT_USER) return;
      const item = localStorage.getItem(k);
      if (item !== null) {
        rawEntries[k] = item;
      }
    });
    return rawEntries;
  }

  /**
   * Applies pre-serialized snapshot & key updates returned by the SyncManager Web Worker
   * so the main thread never blocks on large JSON.stringify calls.
   */
  private applyWorkerSerializedArtifacts(result: any): boolean {
    if (typeof window === 'undefined' || !result) return false;
    let hasChanges = Boolean(result.hasChanges);

    if (result.changedEntries && typeof result.changedEntries === 'object') {
      Object.entries(result.changedEntries).forEach(([key, strVal]) => {
        if (!key.startsWith('dilmilti5_') || key === STORAGE_KEYS.CURRENT_USER) return;
        if (typeof strVal === 'string') {
          this.safeSetLocalStorage(key, strVal);
          hasChanges = true;
        }
      });
    }

    if (result.reconciledEntriesForLocal && typeof result.reconciledEntriesForLocal === 'object') {
      Object.entries(result.reconciledEntriesForLocal).forEach(([key, strVal]) => {
        if (!key.startsWith('dilmilti5_') || key === STORAGE_KEYS.CURRENT_USER) return;
        if (typeof strVal === 'string') {
          this.safeSetLocalStorage(key, strVal);
          hasChanges = true;
        }
      });
    }

    try {
      if (typeof result.versionVectorJson === 'string') {
        localStorage.setItem(VERSION_VECTOR_KEY, result.versionVectorJson);
      }
      if (typeof result.metaJson === 'string') {
        localStorage.setItem(SNAPSHOT_META_KEY, result.metaJson);
      }
      if (typeof result.snapshotJson === 'string') {
        try {
          localStorage.setItem(SNAPSHOT_CACHE_KEY, result.snapshotJson);
        } catch {
          localStorage.removeItem(SNAPSHOT_CACHE_KEY);
        }
      }
      if (typeof result.timestamp === 'number') {
        this.lastSnapshotTimestamp = result.timestamp;
        this.lastSnapshotIso = result.isoTimestamp || new Date(result.timestamp).toISOString();
        this.loadedFromSnapshot = true;
      }
    } catch {}

    return hasChanges;
  }

  private initDatabase() {
    if (typeof window === 'undefined') return;

    // 1. STALE-WHILE-REVALIDATE: Hydrate immediately from timestamped localStorage snapshot if present
    // This allows mobile devices on cellular networks to render the latest known state in <2ms without waiting for network I/O.
    const hydrated = this.hydrateFromLocalSnapshot();

    if (!localStorage.getItem(STORAGE_KEYS.PERSONNEL)) {
      localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(OFFICIAL_PERSONNEL_INITIAL));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USER_ACCOUNTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(SAMPLE_NEWS_ITEMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SIPP)) {
      localStorage.setItem(STORAGE_KEYS.SIPP, JSON.stringify(INITIAL_PERKARA_SIPP));
    }
    if (!localStorage.getItem(STORAGE_KEYS.JADWAL)) {
      localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(INITIAL_JADWAL_SIDANG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DIP)) {
      localStorage.setItem(STORAGE_KEYS.DIP, JSON.stringify(SAMPLE_DIP_ITEMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PTSP_QUEUE)) {
      localStorage.setItem(STORAGE_KEYS.PTSP_QUEUE, JSON.stringify(INITIAL_PTSP_QUEUE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PTSP_TICKETS)) {
      localStorage.setItem(STORAGE_KEYS.PTSP_TICKETS, JSON.stringify(INITIAL_PTSP_TICKETS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PTSP_APP_CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.PTSP_APP_CONFIG, JSON.stringify(INITIAL_PTSP_APP_CONFIG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SATKER_STRUCTURE)) {
      localStorage.setItem(STORAGE_KEYS.SATKER_STRUCTURE, JSON.stringify(INITIAL_SATKER_STRUCTURE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REFORMASI_EVIDEN)) {
      localStorage.setItem(STORAGE_KEYS.REFORMASI_EVIDEN, JSON.stringify(INITIAL_REFORMASI_EVIDEN));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SLIDES)) {
      localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(INITIAL_SLIDES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RELATED_WEBSITES)) {
      localStorage.setItem(STORAGE_KEYS.RELATED_WEBSITES, JSON.stringify(INITIAL_RELATED_WEBSITES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURT_IDENTITY)) {
      localStorage.setItem(STORAGE_KEYS.COURT_IDENTITY, JSON.stringify(INITIAL_COURT_IDENTITY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.JURISDICTION_COURTS)) {
      localStorage.setItem(STORAGE_KEYS.JURISDICTION_COURTS, JSON.stringify(INITIAL_JURISDICTION_COURTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POPUP_CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.POPUP_CONFIG, JSON.stringify(DEFAULT_POPUP_CONFIG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WHATSAPP_CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(DEFAULT_WHATSAPP_FOONTE_CONFIG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ECOURT_CONTENT)) {
      localStorage.setItem(STORAGE_KEYS.ECOURT_CONTENT, JSON.stringify(DEFAULT_ECOURT_CONTENT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MENU_CONTENTS)) {
      localStorage.setItem(STORAGE_KEYS.MENU_CONTENTS, JSON.stringify(DEFAULT_MENU_CONTENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAKIP_DIPA_DOCS)) {
      localStorage.setItem(STORAGE_KEYS.SAKIP_DIPA_DOCS, JSON.stringify(DEFAULT_SAKIP_DIPA_DOCS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENT_TEMPLATES)) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENT_TEMPLATES, JSON.stringify(DEFAULT_DOCUMENT_TEMPLATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROLE_MODEL_AGENTS)) {
      localStorage.setItem(STORAGE_KEYS.ROLE_MODEL_AGENTS, JSON.stringify(DEFAULT_ROLE_MODEL_AGENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPENSATION_INFO)) {
      localStorage.setItem(STORAGE_KEYS.COMPENSATION_INFO, JSON.stringify(DEFAULT_PUBLIC_COMPENSATION_INFO));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SIDANG_LUAR_GEDUNG)) {
      localStorage.setItem(STORAGE_KEYS.SIDANG_LUAR_GEDUNG, JSON.stringify(DEFAULT_SIDANG_LUAR_GEDUNG_INFO));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SURVEI_REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.SURVEI_REPORTS, JSON.stringify(DEFAULT_SURVEI_REPORTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BROSUR_DIGITAL)) {
      localStorage.setItem(STORAGE_KEYS.BROSUR_DIGITAL, JSON.stringify(DEFAULT_BROSUR_DIGITAL));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WEBSITE_MONEV)) {
      localStorage.setItem(STORAGE_KEYS.WEBSITE_MONEV, JSON.stringify(DEFAULT_WEBSITE_MONEV_REPORTS));
    }

    // Save initial seed snapshot if no snapshot existed yet
    if (!hydrated) {
      this.saveLocalSnapshot('seed');
    }

    // 2. Revalidate in the background against Central Cloud Database
    this.startServerPolling();
  }

  /**
   * Hydrates `localStorage` keys synchronously from the timestamped local snapshot cache.
   * Enables instant 0ms UI startup on mobile cellular networks before background fetch completes.
   */
  public hydrateFromLocalSnapshot(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem(SNAPSHOT_CACHE_KEY);
      if (!raw) return false;
      const snapshot: CourtDbSnapshot = JSON.parse(raw);
      if (!snapshot || typeof snapshot !== 'object' || !snapshot.data) return false;

      if (typeof snapshot.version === 'number' && snapshot.version > 0) {
        this.serverVersion = Math.max(this.serverVersion, snapshot.version);
        this.setLocalVersion(this.serverVersion);
      }
      if (typeof snapshot.timestamp === 'number') {
        this.lastSnapshotTimestamp = snapshot.timestamp;
        this.lastSnapshotIso = snapshot.isoTimestamp || new Date(snapshot.timestamp).toISOString();
      }

      Object.entries(snapshot.data).forEach(([key, val]) => {
        if (!key.startsWith('dilmilti5_')) return;
        if (key === STORAGE_KEYS.CURRENT_USER) return;
        const strVal = typeof val === 'string' ? val : JSON.stringify(val);
        localStorage.setItem(key, strVal);
      });

      this.loadedFromSnapshot = true;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Offloads snapshot construction and serialization to the Web Worker so local mutations
   * never block the mobile UI thread with full-database JSON.parse + JSON.stringify calls.
   */
  public saveLocalSnapshotAsync(source: 'server' | 'local_mutation' | 'seed' = 'server'): void {
    if (typeof window === 'undefined') return;
    const now = Date.now();
    const version = Math.max(this.serverVersion, this.getLocalVersion(), 85);
    const rawEntries = this.getAllRawLocalEntries();
    const versionVector = this.getVersionVector();

    if (this.syncManager.isWorkerActive()) {
      this.syncManager
        .dispatchTask('BUILD_SNAPSHOT', {
          rawEntries,
          version,
          source,
          versionVector,
          timestamp: now
        })
        .then((res) => {
          if (res.ok && res.result?.success) {
            this.applyWorkerSerializedArtifacts(res.result);
          } else {
            this.saveLocalSnapshot(source);
          }
        })
        .catch(() => {
          this.saveLocalSnapshot(source);
        });
      return;
    }

    this.saveLocalSnapshot(source);
  }

  /**
   * Persists a timestamped local snapshot of all active CourtDB keys to localStorage.
   */
  public saveLocalSnapshot(source: 'server' | 'local_mutation' | 'seed' = 'server'): CourtDbSnapshot | null {
    if (typeof window === 'undefined') return null;
    try {
      const now = Date.now();
      const iso = new Date(now).toISOString();
      const version = Math.max(this.serverVersion, this.getLocalVersion(), 85);
      const allData = this.getAllLocalData();

      const snapshot: CourtDbSnapshot = {
        version,
        timestamp: now,
        isoTimestamp: iso,
        source,
        versionVector: this.getVersionVector(),
        data: allData
      };

      localStorage.setItem(SNAPSHOT_CACHE_KEY, JSON.stringify(snapshot));
      localStorage.setItem(
        SNAPSHOT_META_KEY,
        JSON.stringify({
          version,
          timestamp: now,
          isoTimestamp: iso,
          source,
          keysCount: Object.keys(allData).length
        })
      );

      this.lastSnapshotTimestamp = now;
      this.lastSnapshotIso = iso;
      this.loadedFromSnapshot = true;
      return snapshot;
    } catch {
      // Even if full snapshot exceeds quota on constrained devices, save lightweight metadata
      try {
        const now = Date.now();
        const iso = new Date(now).toISOString();
        const version = Math.max(this.serverVersion, this.getLocalVersion(), 85);
        localStorage.setItem(
          SNAPSHOT_META_KEY,
          JSON.stringify({
            version,
            timestamp: now,
            isoTimestamp: iso,
            source
          })
        );
        this.lastSnapshotTimestamp = now;
        this.lastSnapshotIso = iso;
      } catch {}
      return null;
    }
  }

  public getLocalSnapshot(): CourtDbSnapshot | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(SNAPSHOT_CACHE_KEY);
      return raw ? (JSON.parse(raw) as CourtDbSnapshot) : null;
    } catch {
      return null;
    }
  }

  public getSnapshotAgeSeconds(): number | null {
    if (!this.lastSnapshotTimestamp) {
      try {
        const metaRaw = typeof window !== 'undefined' ? localStorage.getItem(SNAPSHOT_META_KEY) : null;
        if (metaRaw) {
          const meta = JSON.parse(metaRaw);
          if (meta?.timestamp) {
            this.lastSnapshotTimestamp = meta.timestamp;
            this.lastSnapshotIso = meta.isoTimestamp || null;
          }
        }
      } catch {}
    }
    if (!this.lastSnapshotTimestamp) return null;
    return Math.max(0, Math.floor((Date.now() - this.lastSnapshotTimestamp) / 1000));
  }

  private isLocalDirty: boolean = false;
  private syncQueuePending: boolean = false;

  // Version-Vector & Local version tracking helpers
  public getVersionVector(): CourtVersionVector {
    const fallbackNow = Date.now();
    const fallbackVer = Math.max(this.serverVersion, this.getLocalVersion(), 85);
    if (typeof window === 'undefined') {
      return {
        version: fallbackVer,
        timestamp: fallbackNow,
        isoTimestamp: new Date(fallbackNow).toISOString(),
        baseServerVersion: this.lastSyncedServerVersion || fallbackVer,
        baseServerTimestamp: this.lastSyncedServerTimestamp || fallbackNow,
        keys: {}
      };
    }
    try {
      const raw = localStorage.getItem(VERSION_VECTOR_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CourtVersionVector;
        if (parsed && typeof parsed === 'object' && typeof parsed.version === 'number') {
          return {
            version: Math.max(parsed.version, fallbackVer),
            timestamp: parsed.timestamp || fallbackNow,
            isoTimestamp: parsed.isoTimestamp || new Date(fallbackNow).toISOString(),
            baseServerVersion: parsed.baseServerVersion || this.lastSyncedServerVersion || fallbackVer,
            baseServerTimestamp: parsed.baseServerTimestamp || this.lastSyncedServerTimestamp || fallbackNow,
            keys: parsed.keys || {}
          };
        }
      }
    } catch {}
    return {
      version: fallbackVer,
      timestamp: this.lastLocalWriteTime || fallbackNow,
      isoTimestamp: new Date(this.lastLocalWriteTime || fallbackNow).toISOString(),
      baseServerVersion: this.lastSyncedServerVersion || fallbackVer,
      baseServerTimestamp: this.lastSyncedServerTimestamp || fallbackNow,
      keys: {}
    };
  }

  private updateVersionVectorOnMutation(key: string | undefined, version: number, timestamp: number): CourtVersionVector {
    const iso = new Date(timestamp).toISOString();
    const currentVector = this.getVersionVector();
    const updatedKeys = { ...(currentVector.keys || {}) };

    if (key) {
      const node: VersionVectorNode = { version, timestamp, isoTimestamp: iso };
      updatedKeys[key] = node;
      this.modifiedKeysVector.set(key, node);
    }

    const updatedVector: CourtVersionVector = {
      version: Math.max(currentVector.version, version),
      timestamp,
      isoTimestamp: iso,
      baseServerVersion: this.lastSyncedServerVersion || currentVector.baseServerVersion || version,
      baseServerTimestamp: this.lastSyncedServerTimestamp || currentVector.baseServerTimestamp || timestamp,
      keys: updatedKeys
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(VERSION_VECTOR_KEY, JSON.stringify(updatedVector));
      } catch {}
    }
    return updatedVector;
  }

  private syncVersionVectorWithServer(serverVer: number, serverLastUpdatedIso?: string): void {
    const parsedServerTs = serverLastUpdatedIso ? Date.parse(serverLastUpdatedIso) : NaN;
    const serverTs = !Number.isNaN(parsedServerTs) && parsedServerTs > 0 ? parsedServerTs : Date.now();
    this.lastSyncedServerVersion = serverVer;
    this.lastSyncedServerTimestamp = serverTs;

    const currentVector = this.getVersionVector();
    const syncedVector: CourtVersionVector = {
      ...currentVector,
      version: Math.max(currentVector.version, serverVer),
      timestamp: Math.max(currentVector.timestamp || 0, serverTs),
      isoTimestamp: new Date(Math.max(currentVector.timestamp || 0, serverTs)).toISOString(),
      baseServerVersion: serverVer,
      baseServerTimestamp: serverTs
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(VERSION_VECTOR_KEY, JSON.stringify(syncedVector));
      } catch {}
    }
  }

  private getLocalVersion(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const v = localStorage.getItem('dilmilti5_db_local_version');
      const parsed = v ? parseInt(v, 10) : 0;
      return parsed > 0 ? parsed : 0;
    } catch {
      return 0;
    }
  }

  private setLocalVersion(v: number): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('dilmilti5_db_local_version', String(v));
    } catch {}
  }

  private scheduleDebouncedSync(delayMs: number = 300) {
    if (typeof window === 'undefined') return;
    this.lastLocalWriteTime = Date.now();
    this.isLocalDirty = true;

    if (this.syncTimer) {
      clearTimeout(this.syncTimer);
    }

    this.syncTimer = setTimeout(() => {
      this.syncAllData();
    }, delayMs);
  }

  // Helper called by individual update methods - uses debounced queued sync engine
  private syncKeyToServer(key?: string, value?: any) {
    if (typeof window === 'undefined') return;
    if (key && value !== undefined) {
      this.commitAtomicTransaction(key, value);
    } else {
      this.scheduleDebouncedSync(300);
    }
  }

  /**
   * Dispatches UI update notifications to local React components without
   * marking local state dirty or triggering a server POST loop.
   */
  private emitUIChange() {
    this.listeners.forEach(l => l());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dilmilti_db_updated'));
    }
  }

  /**
   * WEB WORKER OFF-MAIN-THREAD SYNC QUEUE WITH VERSION-VECTOR TIMESTAMP CHECK:
   * 1. Chains every syncAllData operation onto a sequential Promise queue.
   * 2. Delegates pre-flight Version-Vector & Timestamp checks, conflict reconciliation,
   *    full-database JSON parsing/serialization, and POST network I/O to the SyncManager Web Worker.
   * 3. Applies pre-serialized snapshot & reconciled key artifacts returned by the Worker
   *    in <1ms so mobile UI frames remain responsive regardless of network conditions.
   */
  public async syncAllData(forceFullSync: boolean = false): Promise<any> {
    if (typeof window === 'undefined') {
      return Promise.resolve({ success: true });
    }

    const executeTransaction = async (): Promise<any> => {
      const syncStartTime = Date.now();
      this.isLocalSyncInProgress = true;
      this.emitUIChange();

      try {
        const localVer = Math.max(this.serverVersion, this.getLocalVersion(), 85);
        const localVector = this.getVersionVector();
        const localWriteTs = this.lastLocalWriteTime || localVector.timestamp || syncStartTime;
        const rawEntries = this.getAllRawLocalEntries();
        const modifiedKeys = Array.from(this.modifiedKeysVector.entries()).map(([key, node]) => ({
          key,
          version: node.version,
          timestamp: node.timestamp,
          isoTimestamp: node.isoTimestamp
        }));

        // Delegate serialization, media upload, and POST sync to Web Worker
        if (this.syncManager.isWorkerActive()) {
          const workerRes = await this.syncManager.dispatchTask(
            'SYNC_PUSH',
            {
              syncStartTime,
              localVer,
              localVector,
              localWriteTs,
              lastSyncedServerVersion: this.lastSyncedServerVersion,
              lastSyncedServerTimestamp: this.lastSyncedServerTimestamp,
              isLocalDirty: this.isLocalDirty,
              forceFullSync,
              modifiedKeys,
              rawEntries
            },
            15000
          );

          if (workerRes.ok && workerRes.result) {
            const resData = workerRes.result;

            if (resData.success) {
              const validatedVer = Math.max(resData.version || localVer + 1, 85);
              this.serverVersion = validatedVer;
              this.setLocalVersion(validatedVer);
              this.lastSyncedServerVersion = validatedVer;
              this.lastSyncedServerTimestamp = resData.serverTimestamp || Date.now();
              this.lastSyncCompleteTime = Date.now();
              this.hasInitialFetched = true;
              this.isServerConnected = true;

              try {
                if (typeof navigator !== 'undefined' && navigator.serviceWorker?.controller) {
                  navigator.serviceWorker.controller.postMessage({ type: 'INVALIDATE_API_CACHE' });
                }
              } catch {}

              if (this.lastLocalWriteTime <= syncStartTime) {
                this.isLocalDirty = false;
                this.modifiedKeysVector.clear();
              }

              // Apply pre-serialized snapshot & reconciled entries from Web Worker
              this.applyWorkerSerializedArtifacts(resData);

              try {
                if (this.broadcastChannel) {
                  this.broadcastChannel.postMessage({ type: 'DB_UPDATED', version: validatedVer });
                }
              } catch {}

              this.emitUIChange();
              return { success: true, version: validatedVer, executedInWorker: true };
            }

            this.isServerConnected = false;
            return { success: false, status: resData.status };
          }
        }

        // Fallback path if Web Worker is unavailable
        const remoteVersion = this.lastSyncedServerVersion || 0;
        const allData = this.getAllLocalData();
        let dataToSend: Record<string, any> = allData;

        if (modifiedKeys.length > 0 && !forceFullSync) {
          const deltaData: Record<string, any> = {};
          modifiedKeys.forEach((item) => {
            if (item.key && allData[item.key] !== undefined) {
              deltaData[item.key] = allData[item.key];
            }
          });
          if (allData[STORAGE_KEYS.AUDIT] !== undefined) {
            deltaData[STORAGE_KEYS.AUDIT] = allData[STORAGE_KEYS.AUDIT];
          }
          if (Object.keys(deltaData).length > 0) {
            dataToSend = deltaData;
          }
        }

        const nextVer = Math.max(localVer, remoteVersion, 85) + 1;
        const updatedVector = this.updateVersionVectorOnMutation(undefined, nextVer, syncStartTime);

        const res = await fetch('/api/court-db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: dataToSend,
            version: nextVer,
            baseVersion: this.lastSyncedServerVersion || localVector.baseServerVersion || remoteVersion,
            clientTimestamp: localWriteTs,
            versionVector: updatedVector
          })
        });

        if (!res.ok) {
          this.isServerConnected = false;
          return { success: false, status: res.status };
        }

        const json = await res.json();
        if (json && json.success) {
          const serverVer = typeof json.version === 'number' ? json.version : nextVer;
          const validatedVer = Math.max(serverVer, nextVer);
          this.serverVersion = validatedVer;
          this.setLocalVersion(validatedVer);
          this.lastSyncedServerVersion = validatedVer;
          this.lastSyncCompleteTime = Date.now();
          this.hasInitialFetched = true;
          this.syncVersionVectorWithServer(validatedVer, json.lastUpdated);
          this.isServerConnected = true;

          try {
            if (typeof navigator !== 'undefined' && navigator.serviceWorker?.controller) {
              navigator.serviceWorker.controller.postMessage({ type: 'INVALIDATE_API_CACHE' });
            }
          } catch {}

          if (this.lastLocalWriteTime <= syncStartTime) {
            this.isLocalDirty = false;
            this.modifiedKeysVector.clear();
          }

          this.saveLocalSnapshotAsync('local_mutation');

          try {
            if (this.broadcastChannel) {
              this.broadcastChannel.postMessage({ type: 'DB_UPDATED', version: validatedVer });
            }
          } catch {}

          this.emitUIChange();

          return { success: true, version: validatedVer };
        }
        return json;
      } catch (err) {
        console.warn('[CourtDB - Promise Queue] Sync execution error:', err);
        this.isServerConnected = false;
        return { success: false, error: err };
      } finally {
        this.isLocalSyncInProgress = false;
        this.emitUIChange();
      }
    };

    // Chain execution sequentially on the Promise queue
    this.syncPromiseChain = this.syncPromiseChain
      .then(() => executeTransaction())
      .catch((err) => {
        console.warn('[CourtDB - Queue Recovery]', err);
        return executeTransaction();
      });

    return this.syncPromiseChain;
  }

  public async syncAllToServer(forceFullSync: boolean = true): Promise<any> {
    return this.syncAllData(forceFullSync);
  }

  public async fetchFromCentralServer(force: boolean = false) {
    if (typeof window === 'undefined') return;

    // Self-heal stale dirty flag if more than 5 seconds have elapsed since last local write
    if (this.isLocalDirty && (Date.now() - this.lastLocalWriteTime > 5000) && !this.isLocalSyncInProgress) {
      this.isLocalDirty = false;
    }

    // Protect active in-flight or very recent uncommitted local edits or just-completed syncs on THIS device
    if (this.isLocalSyncInProgress) {
      return;
    }
    // Prevent duplicate concurrent pulls or pulls within 3.5s of the last pull
    if (this.isBackgroundRevalidating) {
      return;
    }
    if (Date.now() - this.lastCentralFetchTime < 3500) {
      return;
    }
    if (Date.now() - this.lastSyncCompleteTime < 3500) {
      return;
    }
    if (!force && (this.isLocalDirty || (Date.now() - this.lastLocalWriteTime < 3500))) {
      return;
    }
    if (force && (this.isLocalDirty || (Date.now() - this.lastLocalWriteTime < 2500))) {
      return;
    }

    this.isBackgroundRevalidating = true;
    this.lastCentralFetchTime = Date.now();
    this.lastVersionCheckTime = Date.now();
    try {
      const rawEntries = this.getAllRawLocalEntries();
      const versionVector = this.getVersionVector();

      // Offload network GET, JSON parsing, key diffing, and snapshot serialization to Web Worker
      const workerRes = await this.syncManager.dispatchTask('SYNC_PULL', {
        rawEntries,
        versionVector
      });

      if (!workerRes.ok || !workerRes.result?.success) {
        this.isServerConnected = false;
        return;
      }

      // If user made a local edit while this Worker pull was in flight, do not overwrite their edit
      if (this.isLocalDirty || this.isLocalSyncInProgress) {
        return;
      }

      const result = workerRes.result;
      this.isServerConnected = true;
      const serverVer = typeof result.version === 'number' ? result.version : 85;
      if (this.lastSyncedServerVersion > 0 && serverVer < this.lastSyncedServerVersion) {
        return;
      }
      this.serverVersion = Math.max(serverVer, 85);
      this.setLocalVersion(this.serverVersion);
      this.lastSyncedServerVersion = this.serverVersion;
      this.lastSyncedServerTimestamp = result.serverTimestamp || Date.now();
      this.lastSyncCompleteTime = Date.now();
      this.hasInitialFetched = true;

      const hasChanges = this.applyWorkerSerializedArtifacts(result);
      if (!result.snapshotJson) {
        this.saveLocalSnapshotAsync('server');
      }

      if (hasChanges || force) {
        this.emitUIChange();
      }
    } catch {
      this.isServerConnected = false;
    } finally {
      this.isBackgroundRevalidating = false;
    }
  }

  /**
   * Applies fresh API payload broadcast by the Service Worker after a background
   * Stale-While-Revalidate fetch completes on slow mobile connections.
   * Uses the SyncManager Web Worker to diff and serialize off the main thread.
   */
  public applyBackgroundRevalidatedPayload(json: any) {
    if (typeof window === 'undefined' || !json || !json.success || !json.data) return;
    if (this.isLocalDirty || this.isLocalSyncInProgress) return;
    if (Date.now() - this.lastSyncCompleteTime < 4500 || Date.now() - this.lastLocalWriteTime < 4500) return;
    const incomingVer = typeof json.version === 'number' ? json.version : 0;
    if (incomingVer > 0 && (incomingVer < this.lastSyncedServerVersion || incomingVer < this.serverVersion)) {
      return;
    }

    const rawEntries = this.getAllRawLocalEntries();
    const versionVector = this.getVersionVector();

    if (this.syncManager.isWorkerActive()) {
      this.syncManager
        .dispatchTask('RECONCILE_SW_PAYLOAD', {
          swPayload: json,
          rawEntries,
          versionVector
        })
        .then((workerRes) => {
          if (!workerRes.ok || !workerRes.result?.success) return;
          if (this.isLocalDirty || this.isLocalSyncInProgress) return;

          const result = workerRes.result;
          this.isServerConnected = true;
          this.serverVersion = Math.max(result.version || 85, 85);
          this.setLocalVersion(this.serverVersion);
          this.lastSyncedServerVersion = this.serverVersion;
          this.lastSyncedServerTimestamp = result.serverTimestamp || Date.now();
          this.hasInitialFetched = true;

          const hasChanges = this.applyWorkerSerializedArtifacts(result);
          if (hasChanges) {
            this.emitUIChange();
          }
        })
        .catch(() => {});
      return;
    }

    this.isServerConnected = true;
    const serverVer = typeof json.version === 'number' ? json.version : 85;
    this.serverVersion = Math.max(serverVer, 85);
    this.setLocalVersion(this.serverVersion);
    this.syncVersionVectorWithServer(this.serverVersion, json.lastUpdated);
    this.hasInitialFetched = true;

    let hasChanges = false;
    Object.entries(json.data).forEach(([key, val]) => {
      if (!key.startsWith('dilmilti5_')) return;
      if (key === STORAGE_KEYS.CURRENT_USER) return;
      const current = localStorage.getItem(key);
      const strVal = typeof val === 'string' ? val : JSON.stringify(val);
      if (current !== strVal) {
        localStorage.setItem(key, strVal);
        hasChanges = true;
      }
    });

    this.saveLocalSnapshot('server');
    if (hasChanges) {
      this.emitUIChange();
    }
  }

  /**
   * Executes a Network-First request (with Service Worker cache fallback) via the
   * Web Worker SyncManager for high-priority sections such as 'Jadwal Sidang'
   * or immediately upon network reconnection.
   */
  public async fetchHighPrioritySection(sectionName: string = 'jadwal-sidang'): Promise<void> {
    if (typeof window === 'undefined') return;
    if (this.isLocalSyncInProgress || this.isBackgroundRevalidating) return;
    if (Date.now() - this.lastCentralFetchTime < 3500) return;
    if (this.isLocalDirty && (Date.now() - this.lastLocalWriteTime < 1500)) return;

    this.isBackgroundRevalidating = true;
    this.lastCentralFetchTime = Date.now();
    this.lastVersionCheckTime = Date.now();
    try {
      const rawEntries = this.getAllRawLocalEntries();
      const versionVector = this.getVersionVector();
      const priorityUrl = `/api/court-db?priority=network-first&section=${encodeURIComponent(sectionName)}&_t=${Date.now()}`;

      const workerRes = await this.syncManager.dispatchTask('HIGH_PRIORITY_PULL', {
        priorityUrl,
        headers: {
          'X-Priority-Strategy': 'network-first',
          'X-Court-Section': sectionName
        },
        rawEntries,
        versionVector
      });

      if (!workerRes.ok || !workerRes.result?.success) {
        this.isServerConnected = false;
        return;
      }

      if (this.isLocalDirty || this.isLocalSyncInProgress) return;

      const result = workerRes.result;
      this.isServerConnected = true;
      this.serverVersion = Math.max(result.version || 85, 85);
      this.setLocalVersion(this.serverVersion);
      this.lastSyncedServerVersion = this.serverVersion;
      this.lastSyncedServerTimestamp = result.serverTimestamp || Date.now();
      this.hasInitialFetched = true;

      const hasChanges = this.applyWorkerSerializedArtifacts(result);
      if (hasChanges) {
        this.emitUIChange();
      }
    } catch {
      this.isServerConnected = false;
    } finally {
      this.isBackgroundRevalidating = false;
    }
  }

  private startServerPolling() {
    if (typeof window === 'undefined') return;
    
    // BroadcastChannel & local storage listener for instant cross-tab sync
    try {
      window.addEventListener('storage', (e) => {
        if (e.key && Object.values(STORAGE_KEYS).includes(e.key)) {
          this.listeners.forEach(l => l());
          window.dispatchEvent(new CustomEvent('dilmilti_db_updated'));
        }
      });

      if ('BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel('dilmilti_db_channel');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'DB_UPDATED') {
            this.fetchFromCentralServer(true);
          }
        };
      }
    } catch (e) {}

    // Initial fetch from central server on app startup
    this.fetchFromCentralServer(true);

    // Periodic check every 120 seconds (2 minutes) when tab is visible for changes made on other devices
    // Prevents frequent 15-second polling noise on Vercel Serverless Functions while keeping cross-device sync active
    setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
      this.checkServerVersionAndUpdate();
    }, 120000);

    // Lightweight version check when user switches back to this tab/window, unlocks phone, or closes a file dialog
    // Only downloads full /api/court-db if server version actually changed on another device
    window.addEventListener('focus', () => {
      this.checkServerVersionAndUpdate();
    });

    window.addEventListener('pageshow', () => {
      this.checkServerVersionAndUpdate();
    });

    window.addEventListener('online', () => {
      this.fetchHighPrioritySection('jadwal-sidang');
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkServerVersionAndUpdate();
      }
    });

    // Only sync on page unload if user on THIS device made unsaved local edits
    window.addEventListener('beforeunload', () => {
      if (this.isLocalDirty) {
        this.syncAllToServer();
      }
    });

    window.addEventListener('pagehide', () => {
      if (this.isLocalDirty) {
        this.syncAllToServer();
      }
    });
  }

  private isVersionCheckInFlight: boolean = false;

  private async checkServerVersionAndUpdate() {
    if (typeof window === 'undefined') return;
    if (this.isVersionCheckInFlight || this.isBackgroundRevalidating) return;
    // Enforce minimum 20-second cooldown between version checks so focus/pageshow/visibilitychange/interval don't spam Vercel
    const now = Date.now();
    if (now - this.lastVersionCheckTime < 20000 || now - this.lastCentralFetchTime < 15000) {
      return;
    }
    // Self-heal stale dirty flag if more than 5 seconds have elapsed since last local write
    if (this.isLocalDirty && (now - this.lastLocalWriteTime > 5000) && !this.isLocalSyncInProgress) {
      this.isLocalDirty = false;
    }
    // Don't poll if local sync is in progress or local edits/sync occurred in the last 4s
    if (
      this.isLocalSyncInProgress ||
      (now - this.lastLocalWriteTime < 4000) ||
      (now - this.lastSyncCompleteTime < 4000) ||
      this.isLocalDirty
    ) {
      return;
    }
    this.isVersionCheckInFlight = true;
    this.lastVersionCheckTime = now;
    try {
      if (this.syncManager.isWorkerActive()) {
        const localVer = this.getLocalVersion();
        const workerRes = await this.syncManager.dispatchTask(
          'VERSION_CHECK',
          {
            serverVersion: this.serverVersion,
            localVersion: localVer,
            hasInitialFetched: this.hasInitialFetched,
            rawEntries: this.getAllRawLocalEntries(),
            versionVector: this.getVersionVector()
          },
          10000
        );

        if (!workerRes.ok || !workerRes.result?.connected) {
          this.isServerConnected = false;
          return;
        }

        this.isServerConnected = true;
        if (workerRes.result.needsPull && workerRes.result.pullResult?.success) {
          if (this.isLocalDirty || this.isLocalSyncInProgress) return;
          const pullRes = workerRes.result.pullResult;
          const serverVer = Math.max(pullRes.version || 85, 85);
          if (this.lastSyncedServerVersion > 0 && serverVer < this.lastSyncedServerVersion) {
            return;
          }
          this.serverVersion = serverVer;
          this.setLocalVersion(serverVer);
          this.lastSyncedServerVersion = serverVer;
          this.lastSyncedServerTimestamp = pullRes.serverTimestamp || Date.now();
          this.hasInitialFetched = true;

          const hasChanges = this.applyWorkerSerializedArtifacts(pullRes);
          if (hasChanges) {
            this.emitUIChange();
          }
        }
        return;
      }

      const res = await fetch(`/api/court-db/version?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) {
        this.isServerConnected = false;
        return;
      }
      const json = await res.json();
      this.isServerConnected = true;
      const serverVer = typeof json?.version === 'number' ? json.version : 0;
      const localVer = this.getLocalVersion();
      const knownVer = Math.max(this.serverVersion, localVer);

      // Pull from server if server version is newer than cached local version or on initial fetch
      if (serverVer > 0 && (!this.hasInitialFetched || serverVer > knownVer)) {
        await this.fetchFromCentralServer(true);
      }
    } catch {
      this.isServerConnected = false;
    } finally {
      this.isVersionCheckInFlight = false;
    }
  }

  public getSyncStatus() {
    const ageSeconds = this.getSnapshotAgeSeconds();
    const workerMetrics = this.syncManager.getMetrics();
    return {
      connected: this.isServerConnected,
      version: Math.max(this.serverVersion, this.getLocalVersion(), 85),
      hasFetched: this.hasInitialFetched,
      isSyncing: this.isLocalSyncInProgress,
      isRevalidating: this.isBackgroundRevalidating,
      isDirty: this.isLocalDirty,
      lastWriteTime: this.lastLocalWriteTime,
      loadedFromSnapshot: this.loadedFromSnapshot,
      snapshotTimestamp: this.lastSnapshotTimestamp,
      snapshotIso: this.lastSnapshotIso,
      snapshotAgeSeconds: ageSeconds,
      workerActive: workerMetrics.workerActive,
      workerTasksCompleted: workerMetrics.tasksCompleted,
      workerLastDurationMs: workerMetrics.lastDurationMs,
      networkQuality: workerMetrics.networkQuality
    };
  }

  // Subscribe to changes
  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public notify(specificKey?: string, _specificValue?: any) {
    const now = Date.now();
    this.lastLocalWriteTime = now;
    this.isLocalDirty = true;
    const nextVer = Math.max(this.serverVersion, this.getLocalVersion(), 85) + 1;
    this.serverVersion = nextVer;
    this.setLocalVersion(nextVer);
    this.updateVersionVectorOnMutation(specificKey, nextVer, now);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dilmilti5_last_local_write', String(now));
      } catch {}
    }

    // Update local timestamped snapshot off the main thread via Web Worker so UI stays 60fps
    this.saveLocalSnapshotAsync('local_mutation');

    this.emitUIChange();

    if (typeof window !== 'undefined') {
      try {
        if (this.broadcastChannel) {
          this.broadcastChannel.postMessage({ type: 'DB_UPDATED', version: this.serverVersion });
        }
      } catch (e) {}

      // Debounce sync to central backend server
      this.scheduleDebouncedSync(250);
    }
  }

  public getAllLocalData(): Record<string, any> {
    const allData: Record<string, any> = {};
    if (typeof window === 'undefined') return allData;

    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k === STORAGE_KEYS.CURRENT_USER) return;
      const item = localStorage.getItem(k);
      if (item) {
        try {
          allData[k] = JSON.parse(item);
        } catch {
          allData[k] = item;
        }
      }
    });
    return allData;
  }

  private async resolveAndUploadEmbeddedMedia(obj: any): Promise<any> {
    if (!obj) return obj;

    if (this.syncManager.isWorkerActive()) {
      const workerRes = await this.syncManager.dispatchTask(
        'RESOLVE_MEDIA',
        { data: obj, folder: 'uploads' },
        20000
      );
      if (workerRes.ok && workerRes.result?.success && workerRes.result.resolvedData !== undefined) {
        return workerRes.result.resolvedData;
      }
    }

    if (typeof obj === 'string') {
      if (obj.startsWith('data:')) {
        return await this.uploadBase64ToServer(obj, 'media_upload');
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      const arr = [];
      for (const item of obj) {
        arr.push(await this.resolveAndUploadEmbeddedMedia(item));
      }
      return arr;
    }

    if (typeof obj === 'object') {
      const resObj: Record<string, any> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string' && v.startsWith('data:')) {
          resObj[k] = await this.uploadBase64ToServer(v, k);
        } else if (typeof v === 'object' && v !== null) {
          resObj[k] = await this.resolveAndUploadEmbeddedMedia(v);
        } else {
          resObj[k] = v;
        }
      }
      return resObj;
    }

    return obj;
  }

  /**
   * FORCED ATOMICITY TRANSACTION PATTERN:
   * Ensures image-related updates and data changes are committed as a single,
   * fully-awaited transaction block. Resolves embedded media blobs to server URLs first
   * (offloaded to the Web Worker), updates local storage, and syncs the unified database
   * state to `/api/court-db` to prevent partial state mismatches across devices and sessions.
   */
  public async commitAtomicTransaction(
    key: string,
    updatedData: any,
    auditLogMeta?: { action: AuditLogItem['action']; module: AuditLogItem['module']; details: string }
  ): Promise<boolean> {
    if (typeof window === 'undefined') return true;

    const startTime = Date.now();
    this.lastLocalWriteTime = startTime;
    this.isLocalDirty = true;

    try {
      // 1. Await media upload & URL resolution + pre-serialization in Web Worker
      let processedData = updatedData;
      let storageValue: string | null = null;

      if (this.syncManager.isWorkerActive()) {
        const workerRes = await this.syncManager.dispatchTask(
          'RESOLVE_MEDIA',
          { data: updatedData, folder: 'uploads' },
          20000
        );
        if (workerRes.ok && workerRes.result?.success) {
          processedData = workerRes.result.resolvedData;
          storageValue = workerRes.result.serializedData;
        }
      }

      if (storageValue === null) {
        processedData = await this.resolveAndUploadEmbeddedMedia(updatedData);
        storageValue = typeof processedData === 'string' ? processedData : JSON.stringify(processedData);
      }

      // 2. Write pre-serialized string to localStorage
      this.safeSetLocalStorage(key, storageValue);

      // 3. Increment version
      const nextVer = Math.max(this.serverVersion, this.getLocalVersion(), 85) + 1;
      this.serverVersion = nextVer;
      this.setLocalVersion(nextVer);

      // 4. Audit Log
      if (auditLogMeta) {
        const user = this.getCurrentUser();
        const newLog: AuditLogItem = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toLocaleString('sv-SE').replace('T', ' '),
          userName: user ? user.nama : 'Pengguna Publik',
          userRole: user ? user.role.toUpperCase() : 'TAMU',
          action: auditLogMeta.action,
          module: auditLogMeta.module,
          details: auditLogMeta.details
        };
        const logs = this.getAuditLogs();
        const updatedLogs = [newLog, ...logs].slice(0, 100);
        localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updatedLogs));
      }

      // 4. Notify local UI components & schedule queue-locked debounced sync
      this.notify(key, processedData);
      return true;
    } catch (err) {
      console.error(`[CourtDB - Atomic Transaction Error] Key: ${key}:`, err);
      this.notify(key, updatedData);
      return false;
    }
  }

  // UPLOAD FILE/IMAGE HELPER (Self-contained, permanent storage with forced atomicity)
  public async uploadBase64ToServer(dataUrl: string, originalFilename: string = 'image', folder: 'uploads' | 'images' = 'uploads'): Promise<string> {
    if (!dataUrl) {
      return '';
    }
    // If already a public URL or asset path, return directly
    if (!dataUrl.startsWith('data:')) {
      return dataUrl;
    }

    // Mark local write active so window.focus (when OS file picker closes) does not trigger a background pull
    this.lastLocalWriteTime = Date.now();
    this.isLocalDirty = true;

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: originalFilename,
          dataUrl,
          folder
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.url) {
          this.lastLocalWriteTime = Date.now();
          this.prewarmBrowserMediaCache(json.url, dataUrl);
          return json.url;
        }
      }
    } catch (e: any) {
      console.warn('[CourtDB] Atomic media upload warning:', e?.message || e);
    }

    this.lastLocalWriteTime = Date.now();
    return dataUrl;
  }

  public async uploadMediaFile(file: File, folder: 'uploads' | 'images' = 'uploads'): Promise<string> {
    this.lastLocalWriteTime = Date.now();
    this.isLocalDirty = true;
    if (file.type.startsWith('image/')) {
      try {
        const compressed = await compressImage(file, 900, 1200, 0.82);
        return await this.uploadBase64ToServer(compressed, file.name || 'image', folder);
      } catch (e) {
        console.warn('[CourtDB] Image compression failed:', e);
      }
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name || 'file',
              dataUrl: base64,
              folder
            })
          });
          const json = await res.json();
          if (json && json.success && json.url) {
            this.prewarmBrowserMediaCache(json.url, base64);
            resolve(json.url);
            return;
          }
        } catch (err) {
          console.warn('[CourtDB] uploadMediaFile server fallback:', err);
        }
        resolve(base64);
      };
      reader.onerror = () => {
        resolve('');
      };
      reader.readAsDataURL(file);
    });
  }

  private prewarmBrowserMediaCache(relativeUrl: string, dataUrl: string): void {
    if (typeof window === 'undefined' || !('caches' in window)) return;
    if (!relativeUrl || !dataUrl || !dataUrl.startsWith('data:')) return;
    (async () => {
      try {
        const blobRes = await fetch(dataUrl);
        const blob = await blobRes.blob();
        const cache = await caches.open('dilmilti5-static-v3');
        const fullUrl = relativeUrl.startsWith('http')
          ? relativeUrl
          : window.location.origin + (relativeUrl.startsWith('/') ? relativeUrl : '/' + relativeUrl);
        await cache.put(
          new Request(fullUrl, { method: 'GET' }),
          new Response(blob, {
            status: 200,
            headers: {
              'Content-Type': blob.type || 'image/jpeg',
              'Cache-Control': 'public, max-age=31536000, immutable'
            }
          })
        );
      } catch {}
    })();
  }

  // LOG AUDIT HELPER
  public addAuditLog(action: AuditLogItem['action'], module: AuditLogItem['module'], details: string) {
    const user = this.getCurrentUser();
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString('sv-SE').replace('T', ' '),
      userName: user ? user.nama : 'Pengguna Publik',
      userRole: user ? user.role.toUpperCase() : 'TAMU',
      action,
      module,
      details
    };
    const logs = this.getAuditLogs();
    const updated = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));
    this.emitUIChange();
  }

  public getAuditLogs(): AuditLogItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  // --- AUTH METHODS ---
  public getCurrentUser(): UserAccount | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public getCurrentSession(): UserAccount | null {
    return this.getCurrentUser();
  }

  public login(email: string, pass: string): { success: boolean; message: string; user?: UserAccount } {
    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (!found) {
      return { success: false, message: 'Email akun tidak terdaftar dalam database pengelola!' };
    }
    if (found.status === 'nonaktif') {
      return { success: false, message: 'Akun Anda sedang dinonaktifkan oleh Super Admin!' };
    }
    if (found.password && found.password !== pass) {
      return { success: false, message: 'Kata sandi / password yang dimasukkan salah!' };
    }

    // Update lastLogin
    found.lastLogin = new Date().toLocaleString('sv-SE').replace('T', ' ');
    this.updateUser(found.id, { lastLogin: found.lastLogin }, false);

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));
    this.addAuditLog('LOGIN', 'USERS', `Pengguna ${found.nama} (${found.role}) berhasil masuk.`);
    this.notify();
    return { success: true, message: `Selamat datang kembali, ${found.nama}!`, user: found };
  }

  public logout() {
    const user = this.getCurrentUser();
    if (user) {
      this.addAuditLog('LOGIN', 'USERS', `Pengguna ${user.nama} keluar dari sistem.`);
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.notify();
  }

  public register(userData: Omit<UserAccount, 'id' | 'createdAt' | 'status'>): { success: boolean; message: string; user?: UserAccount } {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.trim().toLowerCase())) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk!' };
    }

    const newUser: UserAccount = {
      ...userData,
      id: `usr-${Date.now()}`,
      status: 'aktif',
      createdAt: new Date().toLocaleString('sv-SE').replace('T', ' '),
      lastLogin: new Date().toLocaleString('sv-SE').replace('T', ' ')
    };

    const updated = [...users, newUser];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    this.addAuditLog('REGISTER', 'USERS', `Pendaftaran user baru: ${newUser.nama} (${newUser.role})`);
    this.notify(STORAGE_KEYS.USERS, updated);
    return { success: true, message: 'Pendaftaran berhasil! Akun Anda telah aktif dan masuk.', user: newUser };
  }

  public createUser(userData: Omit<UserAccount, 'id' | 'createdAt'>): { success: boolean; message: string; user?: UserAccount } {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.trim().toLowerCase())) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain!' };
    }

    const newUser: UserAccount = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toLocaleString('sv-SE').replace('T', ' '),
      lastLogin: '-'
    };

    const updated = [...users, newUser];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    this.addAuditLog('CREATE', 'USERS', `Admin membuat akun pengguna baru: ${newUser.nama} (${newUser.role})`);
    this.notify(STORAGE_KEYS.USERS, updated);
    return { success: true, message: `Akun pengguna ${newUser.nama} berhasil dibuat!`, user: newUser };
  }

  // --- USER MANAGEMENT ---
  public getUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USER_ACCOUNTS;
    } catch {
      return INITIAL_USER_ACCOUNTS;
    }
  }

  public updateUser(id: string, updates: Partial<UserAccount>, log = true): boolean {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return false;

    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Update current user if editing self
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[idx]));
    }

    if (log) {
      this.addAuditLog('UPDATE', 'USERS', `Memperbarui data pengguna: ${users[idx].nama}`);
    }
    this.notify(STORAGE_KEYS.USERS, users);
    return true;
  }

  public deleteUser(id: string): boolean {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (!target) return false;

    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
    this.addAuditLog('DELETE', 'USERS', `Menghapus akun pengguna: ${target.nama} (${target.email})`);
    this.notify(STORAGE_KEYS.USERS, filtered);
    return true;
  }

  // --- PERSONNEL CRUD (OFFICIAL EMPLOYEES & OFFICIALS) ---
  public getPersonnel(): PersonnelItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PERSONNEL);
      return data ? JSON.parse(data) : OFFICIAL_PERSONNEL_INITIAL;
    } catch {
      return OFFICIAL_PERSONNEL_INITIAL;
    }
  }

  private savePersonnelStorage(list: PersonnelItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(list));
    } catch (quotaErr) {
      console.warn("Storage quota hit in savePersonnelStorage, clearing old audit logs...");
      try {
        const audit = this.getAuditLogs();
        if (audit.length > 20) {
          localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(audit.slice(0, 10)));
        }
        localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(list));
      } catch {
        // Fallback write if quota still tight
        localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(list));
      }
    }
  }

  public addPersonnel(item: Omit<PersonnelItem, 'id' | 'no'>): PersonnelItem {
    const personnel = this.getPersonnel();
    const newItem: PersonnelItem = {
      ...item,
      id: `pers-${Date.now()}`,
      no: personnel.length + 1
    };
    const updated = [...personnel, newItem];
    this.savePersonnelStorage(updated);
    this.addAuditLog('CREATE', 'PERSONEL', `Menambahkan data personel baru: ${newItem.nama} (${newItem.jabatan})`);
    this.notify(STORAGE_KEYS.PERSONNEL, updated);
    return newItem;
  }

  public updatePersonnel(id: string, updates: Partial<PersonnelItem>): boolean {
    try {
      const personnel = this.getPersonnel();
      const targetIdStr = String(id || '').trim();
      const targetIdLower = targetIdStr.toLowerCase();
      
      // 1. Exact ID match (case-insensitive)
      let idx = personnel.findIndex(p => p && p.id && (p.id === id || p.id.toLowerCase() === targetIdLower));
      
      // 2. Exact match on normalized ID prefix (pers-)
      if (idx === -1 && targetIdStr) {
        const cleanTargetId = targetIdStr.replace(/^pers-/, '');
        idx = personnel.findIndex(p => p && p.id && p.id.replace(/^pers-/, '') === cleanTargetId);
      }

      // 3. Fallback matching by NIP / NRP
      if (idx === -1 && updates.nipNrp && updates.nipNrp !== '-') {
        const cleanUpdateNip = updates.nipNrp.replace(/[^a-zA-Z0-9]/g, '');
        idx = personnel.findIndex(p => {
          if (!p.nipNrp || p.nipNrp === '-') return false;
          const cleanPNip = p.nipNrp.replace(/[^a-zA-Z0-9]/g, '');
          return cleanPNip === cleanUpdateNip || p.nipNrp.trim().toLowerCase() === updates.nipNrp?.trim().toLowerCase();
        });
      }

      // 4. Fallback matching by Nama
      if (idx === -1 && updates.nama) {
        const updateNamaClean = updates.nama.trim().toLowerCase();
        idx = personnel.findIndex(p => {
          if (!p.nama) return false;
          const pNamaClean = p.nama.trim().toLowerCase();
          return pNamaClean === updateNamaClean;
        });
      }

      // 5. Fallback matching by sequential number 'no' ONLY if targetId is an integer <= 100
      if (idx === -1 && /^\d{1,3}$/.test(targetIdStr)) {
        const parsedNo = parseInt(targetIdStr, 10);
        if (!isNaN(parsedNo) && parsedNo >= 1) {
          idx = personnel.findIndex(p => p.no === parsedNo);
        }
      }

      // 6. Fallback matching by Jabatan if specified
      if (idx === -1 && updates.jabatan) {
        const updateJabatanClean = updates.jabatan.trim().toLowerCase();
        idx = personnel.findIndex(p => p.jabatan && p.jabatan.trim().toLowerCase() === updateJabatanClean);
      }

      if (idx === -1) {
        // If still not found, add as new record with provided updates
        if (updates.nama && updates.jabatan) {
          const newItem: PersonnelItem = {
            id: id || `pers-${Date.now()}`,
            no: personnel.length + 1,
            nama: updates.nama,
            nipNrp: updates.nipNrp || '-',
            pangkatGol: updates.pangkatGol || '-',
            jabatan: updates.jabatan,
            kategori: updates.kategori || 'Kesekretariatan',
            isMutasiMasuk: updates.isMutasiMasuk || false,
            matra: updates.matra || 'ASN MA-RI',
            pendidikan: updates.pendidikan || '',
            riwayatSingkat: updates.riwayatSingkat || '',
            fotoUrl: updates.fotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
            ...updates
          };
          const updated = [...personnel, newItem];
          this.savePersonnelStorage(updated);
          this.addAuditLog('CREATE', 'PERSONEL', `Menambahkan data personel: ${newItem.nama} (${newItem.jabatan})`);
          this.notify(STORAGE_KEYS.PERSONNEL, updated);
          return true;
        }
        return false;
      }

      personnel[idx] = { 
        ...personnel[idx], 
        ...updates,
        id: personnel[idx].id || id
      };
      this.savePersonnelStorage(personnel);
      this.addAuditLog('UPDATE', 'PERSONEL', `Memperbarui data & foto personel: ${personnel[idx].nama}`);
      this.notify(STORAGE_KEYS.PERSONNEL, personnel);
      return true;
    } catch (e) {
      console.error("Database error in updatePersonnel:", e);
      return false;
    }
  }

  public deletePersonnel(id: string): boolean {
    const personnel = this.getPersonnel();
    const targetIdStr = String(id || '').trim();
    const idx = personnel.findIndex(p => 
      p.id === id || 
      String(p.id).trim() === targetIdStr ||
      (p.id && targetIdStr && p.id.replace('pers-', '') === targetIdStr.replace('pers-', '')) ||
      String(p.no) === targetIdStr ||
      String(p.no) === targetIdStr.replace('pers-', '')
    );
    if (idx === -1) return false;

    const target = personnel[idx];
    const filtered = personnel.filter((_, i) => i !== idx).map((p, index) => ({ ...p, no: index + 1 }));
    this.savePersonnelStorage(filtered);
    this.addAuditLog('DELETE', 'PERSONEL', `Menghapus personel: ${target.nama}`);
    this.notify(STORAGE_KEYS.PERSONNEL, filtered);
    return true;
  }

  // --- SLIDER CRUD ---
  public getSlides(): MakassarSlide[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SLIDES);
      if (!data) return [...INITIAL_SLIDES];
      
      const slides: MakassarSlide[] = JSON.parse(data);
      slides.forEach(s => {
        if (s.bgImage) {
          const defaultSlide = INITIAL_SLIDES.find(def => def.id === s.id);
          s.bgImage = this.migrateAssetUrl(s.bgImage, defaultSlide?.bgImage || '');
        }
      });
      return slides;
    } catch {
      return [...INITIAL_SLIDES];
    }
  }

  public addSlide(item: Omit<MakassarSlide, 'id'>): MakassarSlide | null {
    try {
      const slides = this.getSlides();
      const newItem: MakassarSlide = {
        ...item,
        id: `slide-${Date.now()}`
      };
      const updated = [...slides, newItem];
      try {
        localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(updated));
      } catch {
        const audit = this.getAuditLogs();
        if (audit.length > 20) {
          localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(audit.slice(0, 20)));
        }
        localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(updated));
      }
      this.addAuditLog('CREATE', 'SLIDER', `Menambahkan slide baru: "${newItem.title.substring(0, 40)}..."`);
      this.notify(STORAGE_KEYS.SLIDES, updated);
      return newItem;
    } catch (e) {
      console.error("Database error in addSlide:", e);
      return null;
    }
  }

  public updateSlide(id: string, updates: Partial<MakassarSlide>): boolean {
    try {
      const slides = this.getSlides();
      const idx = slides.findIndex(s => String(s.id) === String(id));
      if (idx === -1) return false;

      slides[idx] = { ...slides[idx], ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(slides));
      } catch {
        const audit = this.getAuditLogs();
        if (audit.length > 20) {
          localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(audit.slice(0, 20)));
        }
        localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(slides));
      }
      this.addAuditLog('UPDATE', 'SLIDER', `Memperbarui slide: "${slides[idx].title.substring(0, 40)}..."`);
      this.notify(STORAGE_KEYS.SLIDES, slides);
      return true;
    } catch (e) {
      console.error("Database error in updateSlide:", e);
      return false;
    }
  }

  public deleteSlide(id: string): boolean {
    const slides = this.getSlides();
    const target = slides.find(s => String(s.id) === String(id));
    if (!target) return false;

    const filtered = slides.filter(s => String(s.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(filtered));
    this.addAuditLog('DELETE', 'SLIDER', `Menghapus slide: "${target.title.substring(0, 40)}..."`);
    this.notify(STORAGE_KEYS.SLIDES, filtered);
    return true;
  }

  // --- NEWS CRUD ---
  public getNews(): NewsItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NEWS);
      return data ? JSON.parse(data) : SAMPLE_NEWS_ITEMS;
    } catch {
      return SAMPLE_NEWS_ITEMS;
    }
  }

  public addNews(item: Omit<NewsItem, 'id'>): NewsItem {
    const news = this.getNews();
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`,
      views: '1 kali dibaca'
    };
    const updated = [newItem, ...news];
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updated));
    this.addAuditLog('CREATE', 'BERITA', `Menerbitkan berita baru: "${newItem.judul.substring(0, 40)}..."`);
    this.notify(STORAGE_KEYS.NEWS, updated);
    return newItem;
  }

  public updateNews(id: string | number, updates: Partial<NewsItem>): boolean {
    const news = this.getNews();
    const idx = news.findIndex(n => String(n.id) === String(id));
    if (idx === -1) return false;

    news[idx] = { ...news[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    this.addAuditLog('UPDATE', 'BERITA', `Memperbarui berita: "${news[idx].judul.substring(0, 40)}..."`);
    this.notify(STORAGE_KEYS.NEWS, news);
    return true;
  }

  public deleteNews(id: string | number): boolean {
    const news = this.getNews();
    const target = news.find(n => String(n.id) === String(id));
    if (!target) return false;

    const filtered = news.filter(n => String(n.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(filtered));
    this.addAuditLog('DELETE', 'BERITA', `Menghapus berita: "${target.judul.substring(0, 40)}..."`);
    this.notify(STORAGE_KEYS.NEWS, filtered);
    return true;
  }

  public addNewsComment(newsId: string | number, comment: { authorName: string; authorRole?: string; content: string }): NewsCommentItem | null {
    const news = this.getNews();
    const idx = news.findIndex(n => String(n.id) === String(newsId));
    if (idx === -1) return null;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ' • ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';

    const newComment: NewsCommentItem = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      authorName: comment.authorName.trim() || 'Pengunjung Portal',
      authorRole: comment.authorRole?.trim() || 'Masyarakat Umum',
      content: comment.content.trim(),
      createdAt: formattedDate
    };

    const existingComments = Array.isArray(news[idx].comments) ? news[idx].comments! : [];
    news[idx] = {
      ...news[idx],
      comments: [...existingComments, newComment]
    };

    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    this.addAuditLog('UPDATE', 'BERITA', `Komentar baru oleh ${newComment.authorName} pada berita "${news[idx].judul.substring(0, 35)}..."`);
    this.notify(STORAGE_KEYS.NEWS, news);
    return newComment;
  }

  public deleteNewsComment(newsId: string | number, commentId: string): boolean {
    const news = this.getNews();
    const idx = news.findIndex(n => String(n.id) === String(newsId));
    if (idx === -1) return false;

    const existingComments = Array.isArray(news[idx].comments) ? news[idx].comments! : [];
    news[idx] = {
      ...news[idx],
      comments: existingComments.filter(c => c.id !== commentId)
    };

    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    this.notify(STORAGE_KEYS.NEWS, news);
    return true;
  }

  // --- SIPP PERKARA CRUD ---
  public getSIPP(): PerkaraSIPP[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SIPP);
      return data ? JSON.parse(data) : INITIAL_PERKARA_SIPP;
    } catch {
      return INITIAL_PERKARA_SIPP;
    }
  }

  public addSIPP(item: Omit<PerkaraSIPP, 'id'>): PerkaraSIPP {
    const sipp = this.getSIPP();
    const newItem: PerkaraSIPP = {
      ...item,
      id: `sipp-${Date.now()}`
    };
    const updated = [newItem, ...sipp];
    localStorage.setItem(STORAGE_KEYS.SIPP, JSON.stringify(updated));
    this.addAuditLog('CREATE', 'SIPP', `Mendaftarkan perkara baru: ${newItem.nomorPerkara} (${newItem.terdakwa.nama})`);
    this.notify(STORAGE_KEYS.SIPP, updated);
    return newItem;
  }

  public updateSIPP(id: string, updates: Partial<PerkaraSIPP>): boolean {
    const sipp = this.getSIPP();
    const idx = sipp.findIndex(s => s.id === id);
    if (idx === -1) return false;

    sipp[idx] = { ...sipp[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.SIPP, JSON.stringify(sipp));
    this.addAuditLog('UPDATE', 'SIPP', `Memperbarui status perkara: ${sipp[idx].nomorPerkara} -> ${sipp[idx].statusPerkara}`);
    this.notify(STORAGE_KEYS.SIPP, sipp);
    return true;
  }

  public deleteSIPP(id: string): boolean {
    const sipp = this.getSIPP();
    const target = sipp.find(s => s.id === id);
    if (!target) return false;

    const filtered = sipp.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SIPP, JSON.stringify(filtered));
    this.addAuditLog('DELETE', 'SIPP', `Menghapus perkara register: ${target.nomorPerkara}`);
    this.notify(STORAGE_KEYS.SIPP, filtered);
    return true;
  }

  // --- JADWAL SIDANG CRUD ---
  public getJadwal(): JadwalSidangItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JADWAL);
      return data ? JSON.parse(data) : INITIAL_JADWAL_SIDANG;
    } catch {
      return INITIAL_JADWAL_SIDANG;
    }
  }

  public addJadwal(item: Omit<JadwalSidangItem, 'id'>): JadwalSidangItem {
    const jadwal = this.getJadwal();
    const newItem: JadwalSidangItem = {
      ...item,
      id: `jdw-${Date.now()}`
    };
    const updated = [newItem, ...jadwal];
    localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(updated));
    this.addAuditLog('CREATE', 'JADWAL_SIDANG', `Menambahkan jadwal sidang: ${newItem.nomorPerkara} (${newItem.ruangSidang})`);
    this.notify(STORAGE_KEYS.JADWAL, updated);
    return newItem;
  }

  public updateJadwal(id: string, updates: Partial<JadwalSidangItem>): boolean {
    const jadwal = this.getJadwal();
    const idx = jadwal.findIndex(j => j.id === id);
    if (idx === -1) return false;

    jadwal[idx] = { ...jadwal[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(jadwal));
    this.addAuditLog('UPDATE', 'JADWAL_SIDANG', `Memperbarui jadwal sidang: ${jadwal[idx].nomorPerkara}`);
    this.notify(STORAGE_KEYS.JADWAL, jadwal);
    return true;
  }

  public deleteJadwal(id: string): boolean {
    const jadwal = this.getJadwal();
    const target = jadwal.find(j => j.id === id);
    if (!target) return false;

    const filtered = jadwal.filter(j => j.id !== id);
    localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(filtered));
    this.addAuditLog('DELETE', 'JADWAL_SIDANG', `Menghapus jadwal sidang: ${target.nomorPerkara}`);
    this.notify(STORAGE_KEYS.JADWAL, filtered);
    return true;
  }

  // --- SIPP SYNC FROM LOCALHOST API METHOD ---
  public syncSippFromApiData(syncPayload: any): { success: boolean; countJadwal: number; countPerkara: number; message: string } {
    try {
      if (!syncPayload || !syncPayload.success || !syncPayload.data) {
        return {
          success: false,
          countJadwal: 0,
          countPerkara: 0,
          message: syncPayload?.error || 'Format data payload SIPP tidak valid atau respon gagal.'
        };
      }

      const rawJadwal = Array.isArray(syncPayload.data.jadwal_sidang) ? syncPayload.data.jadwal_sidang : [];
      const rawPerkara = Array.isArray(syncPayload.data.perkara) ? syncPayload.data.perkara : [];
      const rawPihak = Array.isArray(syncPayload.data.pihak) ? syncPayload.data.pihak : [];
      const rawPerkaraPihak = Array.isArray(syncPayload.data.perkara_pihak) ? syncPayload.data.perkara_pihak : [];

      // Create lookup maps
      const perkaraMap = new Map<number, string>();
      rawPerkara.forEach((p: any) => {
        const pid = Number(p.perkara_id || p.id);
        if (pid && p.nomor_perkara) {
          perkaraMap.set(pid, p.nomor_perkara);
        }
      });

      const pihakMap = new Map<number, { nama: string; alamat?: string; nomor_hp?: string }>();
      rawPihak.forEach((ph: any) => {
        const phid = Number(ph.id || ph.pihak_id);
        if (phid) {
          pihakMap.set(phid, {
            nama: ph.nama || 'Tanpa Nama',
            alamat: ph.alamat || '-',
            nomor_hp: ph.nomor_hp || ph.telepon || ''
          });
        }
      });

      // Map perkara_id -> Terdakwa info
      const perkaraTerdakwaMap = new Map<number, { nama: string; kontak?: string }>();
      rawPerkaraPihak.forEach((pp: any) => {
        const pid = Number(pp.perkara_id);
        const phid = Number(pp.pihak_id);
        const jenis = String(pp.jenis_pihak || '').toLowerCase();
        if (pid && phid && (jenis.includes('terdakwa') || jenis.includes('pemohon') || jenis.includes('termohon') || jenis === '')) {
          const info = pihakMap.get(phid);
          if (info) {
            perkaraTerdakwaMap.set(pid, {
              nama: info.nama,
              kontak: info.nomor_hp || '-'
            });
          }
        }
      });

      // Existing SIPP and Jadwal data
      const existingSipp = this.getSIPP();
      const existingJadwal = this.getJadwal();

      let countPerkara = 0;
      let countJadwal = 0;

      const updatedSipp = [...existingSipp];
      const updatedJadwal = [...existingJadwal];

      // 1. Process Perkara
      rawPerkara.forEach((p: any) => {
        const pid = Number(p.perkara_id || p.id);
        const nomorPerkara = p.nomor_perkara || `Perkara #${pid}`;
        const terdakwaInfo = perkaraTerdakwaMap.get(pid) || { nama: 'Terdakwa (Terlampir SIPP)' };

        const existingIdx = updatedSipp.findIndex(s => s.nomorPerkara === nomorPerkara);
        if (existingIdx !== -1) {
          updatedSipp[existingIdx] = {
            ...updatedSipp[existingIdx],
            nomorPerkara,
            terdakwa: {
              ...updatedSipp[existingIdx].terdakwa,
              nama: terdakwaInfo.nama || updatedSipp[existingIdx].terdakwa.nama
            }
          };
        } else {
          updatedSipp.unshift({
            id: `sipp-synced-${pid}-${Date.now()}`,
            nomorPerkara,
            nomorRegisterOditurat: `REG-OD-SIPP-${pid}`,
            jenisPerkara: 'Banding Pidana Militer',
            klasifikasi: 'Pelanggaran Disiplin/Desersi',
            tingkatPerkara: nomorPerkara.includes('BDG') ? 'Banding' : 'Tingkat Pertama',
            tanggalDaftar: new Date().toISOString().split('T')[0],
            terdakwa: {
              nama: terdakwaInfo.nama || 'Terdakwa Militer',
              pangkat: 'Sertu',
              korps: 'Inf',
              nrp: 'NRP-SIPP',
              kesatuan: 'Kodam XIV/Hasanuddin',
              matra: 'TNI AD'
            },
            statusPerkara: 'Pemeriksaan',
            oditurMiliter: 'Oditur Militer Tinggi IV Makassar',
            majelisHakim: {
              ketua: 'Kolonel Chk H. Ahmad, S.H.',
              anggota1: 'Letkol Chk Budi, S.H.',
              anggota2: 'Mayor Chk Candra, S.H.'
            },
            paniteraPengganti: 'Panitera SIPP',
            tahapanPerkara: [
              {
                tanggal: new Date().toISOString().split('T')[0],
                agenda: 'Pemeriksaan Berkas dan Saksi',
                keterangan: 'Disinkronkan otomatis dari Database SIPP Localhost',
                selesai: false
              }
            ]
          });
          countPerkara++;
        }
      });

      // 2. Process Jadwal Sidang
      rawJadwal.forEach((j: any) => {
        const pid = Number(j.perkara_id);
        const nomorPerkara = perkaraMap.get(pid) || `Perkara #${pid}`;
        const terdakwaInfo = perkaraTerdakwaMap.get(pid) || { nama: 'Terdakwa SIPP' };
        const tgl = j.tanggal_sidang || new Date().toISOString().split('T')[0];
        const jam = j.jam_sidang || j.waktu_sidang || '09:00 WITA';
        const ruang = j.ruang_sidang || j.ruang || 'Ruang Kartika';
        const agenda = j.agenda || 'Sidang Perkara SIPP';

        const existingIdx = updatedJadwal.findIndex(jd => jd.nomorPerkara === nomorPerkara && jd.tanggal === tgl);
        if (existingIdx !== -1) {
          updatedJadwal[existingIdx] = {
            ...updatedJadwal[existingIdx],
            waktu: jam,
            ruangSidang: ruang,
            agenda: agenda
          };
        } else {
          updatedJadwal.unshift({
            id: `jdw-synced-${j.id || Date.now()}-${Math.floor(Math.random()*1000)}`,
            tanggal: tgl,
            waktu: jam,
            ruangSidang: ruang,
            nomorPerkara: nomorPerkara,
            terdakwa: terdakwaInfo.nama,
            kesatuan: 'Kodam XIV/Hasanuddin',
            agenda: agenda,
            oditur: 'Oditur Militer Tinggi IV Makassar',
            majelisHakim: 'Kolonel Chk H. Ahmad, S.H. (Ketua)',
            status: 'Akan Datang'
          });
          countJadwal++;
        }
      });

      localStorage.setItem(STORAGE_KEYS.SIPP, JSON.stringify(updatedSipp));
      localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(updatedJadwal));

      this.addAuditLog('SYNC', 'SIPP', `Berhasil menarik & menyinkronkan data SIPP (${countJadwal} jadwal sidang baru, ${countPerkara} perkara baru).`);
      this.notify();

      return {
        success: true,
        countJadwal,
        countPerkara,
        message: `Berhasil menyinkronkan data SIPP! ${countJadwal} jadwal sidang & ${countPerkara} perkara berhasil diperbarui ke database lokal.`
      };
    } catch (err: any) {
      return {
        success: false,
        countJadwal: 0,
        countPerkara: 0,
        message: `Gagal memproses payload SIPP: ${err?.message || 'Error tidak diketahui'}`
      };
    }
  }

  // --- PPID / DIP ITEMS CRUD ---
  public getDIP(): DIPItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIP);
      return data ? JSON.parse(data) : SAMPLE_DIP_ITEMS;
    } catch {
      return SAMPLE_DIP_ITEMS;
    }
  }

  public addDIP(item: Omit<DIPItem, 'id' | 'no'>): DIPItem {
    const list = this.getDIP();
    const newItem: DIPItem = {
      ...item,
      id: `dip-${Date.now()}`,
      no: list.length + 1
    };
    const updated = [...list, newItem];
    localStorage.setItem(STORAGE_KEYS.DIP, JSON.stringify(updated));
    this.addAuditLog('CREATE', 'PPID', `Menambahkan dokumen DIP: ${newItem.namaInformasi}`);
    this.notify(STORAGE_KEYS.DIP, updated);
    return newItem;
  }

  public updateDIP(id: string, updates: Partial<DIPItem>): boolean {
    const list = this.getDIP();
    const idx = list.findIndex(d => d.id === id);
    if (idx === -1) return false;

    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.DIP, JSON.stringify(list));
    this.addAuditLog('UPDATE', 'PPID', `Memperbarui dokumen DIP: ${list[idx].namaInformasi}`);
    this.notify(STORAGE_KEYS.DIP, list);
    return true;
  }

  public deleteDIP(id: string): boolean {
    const list = this.getDIP();
    const target = list.find(d => d.id === id);
    if (!target) return false;

    const filtered = list.filter(d => d.id !== id).map((d, i) => ({ ...d, no: i + 1 }));
    localStorage.setItem(STORAGE_KEYS.DIP, JSON.stringify(filtered));
    this.addAuditLog('DELETE', 'PPID', `Menghapus dokumen DIP: ${target.namaInformasi}`);
    this.notify(STORAGE_KEYS.DIP, filtered);
    return true;
  }

  // --- SAKIP, DIPA, LHKPN & DOKUMEN PUBLIK CRUD ---
  public getSakipDipaDocuments(): SakipDipaDocumentItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAKIP_DIPA_DOCS);
      if (!data) return DEFAULT_SAKIP_DIPA_DOCS;
      const parsed: SakipDipaDocumentItem[] = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_SAKIP_DIPA_DOCS;
      const existingIds = new Set(parsed.map(d => d.id));
      const missingDefaults = DEFAULT_SAKIP_DIPA_DOCS.filter(d => !existingIds.has(d.id));
      if (missingDefaults.length > 0) {
        const merged = [...parsed, ...missingDefaults];
        this.safeSetLocalStorage(STORAGE_KEYS.SAKIP_DIPA_DOCS, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      return DEFAULT_SAKIP_DIPA_DOCS;
    }
  }

  public addSakipDipaDocument(item: Omit<SakipDipaDocumentItem, 'id' | 'tanggalUpload'>): SakipDipaDocumentItem {
    const list = this.getSakipDipaDocuments();
    const newItem: SakipDipaDocumentItem = {
      ...item,
      id: `doc-${Date.now()}`,
      tanggalUpload: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...list];
    localStorage.setItem(STORAGE_KEYS.SAKIP_DIPA_DOCS, JSON.stringify(updated));
    this.syncKeyToServer(STORAGE_KEYS.SAKIP_DIPA_DOCS, updated);
    this.addAuditLog('CREATE', 'SISTEM', `Menambahkan dokumen ${newItem.kategori}: ${newItem.judul}`);
    this.notify(STORAGE_KEYS.SAKIP_DIPA_DOCS, updated);
    return newItem;
  }

  public updateSakipDipaDocument(id: string, updates: Partial<SakipDipaDocumentItem>): boolean {
    const list = this.getSakipDipaDocuments();
    const idx = list.findIndex(d => d.id === id);
    if (idx === -1) return false;

    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.SAKIP_DIPA_DOCS, JSON.stringify(list));
    this.syncKeyToServer(STORAGE_KEYS.SAKIP_DIPA_DOCS, list);
    this.addAuditLog('UPDATE', 'SISTEM', `Memperbarui dokumen ${list[idx].kategori}: ${list[idx].judul}`);
    this.notify(STORAGE_KEYS.SAKIP_DIPA_DOCS, list);
    return true;
  }

  public deleteSakipDipaDocument(id: string): boolean {
    const list = this.getSakipDipaDocuments();
    const target = list.find(d => d.id === id);
    if (!target) return false;

    const filtered = list.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAKIP_DIPA_DOCS, JSON.stringify(filtered));
    this.syncKeyToServer(STORAGE_KEYS.SAKIP_DIPA_DOCS, filtered);
    this.addAuditLog('DELETE', 'SISTEM', `Menghapus dokumen ${target.kategori}: ${target.judul}`);
    this.notify(STORAGE_KEYS.SAKIP_DIPA_DOCS, filtered);
    return true;
  }

  // --- PTSP INOVASI & ANTREAN CRUD ---
  public getPTSPQueue(): PTSPQueueItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PTSP_QUEUE);
      return data ? JSON.parse(data) : INITIAL_PTSP_QUEUE;
    } catch {
      return INITIAL_PTSP_QUEUE;
    }
  }

  public addPTSPQueue(item: Omit<PTSPQueueItem, 'id' | 'nomorAntrean' | 'waktuDaftar' | 'status' | 'estimasiPanggil'>): PTSPQueueItem {
    const queue = this.getPTSPQueue();
    // Count prefix per meja
    let prefix = 'A';
    if (item.mejaLoket.includes('TUN')) prefix = 'B';
    else if (item.mejaLoket.includes('Hukum')) prefix = 'C';
    else if (item.mejaLoket.includes('Umum')) prefix = 'D';
    else if (item.mejaLoket.includes('Posbakum')) prefix = 'E';
    else if (item.mejaLoket.includes('Disabilitas')) prefix = 'F';

    const count = queue.filter(q => q.nomorAntrean.startsWith(prefix)).length + 1;
    const nomorAntrean = `${prefix}-${String(count).padStart(3, '0')}`;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';
    
    // Estimasi +15 min
    const estDate = new Date(now.getTime() + 15 * 60000);
    const estStr = estDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';

    const newItem: PTSPQueueItem = {
      ...item,
      id: `ptsp-q-${Date.now()}`,
      nomorAntrean,
      waktuDaftar: timeStr,
      estimasiPanggil: estStr,
      status: 'Menunggu'
    };

    const updated = [...queue, newItem];
    localStorage.setItem(STORAGE_KEYS.PTSP_QUEUE, JSON.stringify(updated));
    this.addAuditLog('CREATE', 'SISTEM', `Ambil antrean PTSP online: ${newItem.nomorAntrean} (${newItem.mejaLoket})`);
    this.notify();
    return newItem;
  }

  public updatePTSPQueueStatus(id: string, status: PTSPQueueItem['status'], petugasMelayani?: string): boolean {
    const queue = this.getPTSPQueue();
    const idx = queue.findIndex(q => q.id === id);
    if (idx === -1) return false;

    queue[idx].status = status;
    if (petugasMelayani) queue[idx].petugasMelayani = petugasMelayani;
    localStorage.setItem(STORAGE_KEYS.PTSP_QUEUE, JSON.stringify(queue));
    this.addAuditLog('UPDATE', 'SISTEM', `Status antrean ${queue[idx].nomorAntrean} diperbarui menjadi: ${status}`);
    this.notify();
    return true;
  }

  public getPTSPTickets(): PTSPServiceTicket[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PTSP_TICKETS);
      return data ? JSON.parse(data) : INITIAL_PTSP_TICKETS;
    } catch {
      return INITIAL_PTSP_TICKETS;
    }
  }

  public addPTSPTicket(item: Omit<PTSPServiceTicket, 'ticketId' | 'tanggalPengajuan' | 'status'>): PTSPServiceTicket {
    const tickets = this.getPTSPTickets();
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `PTSP-${dateCode}-${randNum}`;

    const newTicket: PTSPServiceTicket = {
      ...item,
      ticketId,
      tanggalPengajuan: new Date().toLocaleString('sv-SE').replace('T', ' '),
      status: 'Diajukan'
    };

    const updated = [newTicket, ...tickets];
    localStorage.setItem(STORAGE_KEYS.PTSP_TICKETS, JSON.stringify(updated));
    this.addAuditLog('CREATE', 'SISTEM', `Pendaftaran permohonan PTSP Online: Tiket ${ticketId} (${item.jenisLayanan})`);
    this.notify();
    return newTicket;
  }

  public updatePTSPTicketStatus(ticketId: string, status: PTSPServiceTicket['status'], catatanPetugas?: string, linkUnduhHasil?: string): boolean {
    const tickets = this.getPTSPTickets();
    const idx = tickets.findIndex(t => t.ticketId === ticketId);
    if (idx === -1) return false;

    tickets[idx].status = status;
    if (catatanPetugas !== undefined) tickets[idx].catatanPetugas = catatanPetugas;
    if (linkUnduhHasil !== undefined) tickets[idx].linkUnduhHasil = linkUnduhHasil;

    localStorage.setItem(STORAGE_KEYS.PTSP_TICKETS, JSON.stringify(tickets));
    this.addAuditLog('UPDATE', 'SISTEM', `Update status tiket PTSP ${ticketId}: ${status}`);
    this.notify();
    return true;
  }

  public getPTSPAppConfig(): PTSPInnovationAppConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PTSP_APP_CONFIG);
      return data ? JSON.parse(data) : INITIAL_PTSP_APP_CONFIG;
    } catch {
      return INITIAL_PTSP_APP_CONFIG;
    }
  }

  public updatePTSPAppConfig(updates: Partial<PTSPInnovationAppConfig>): boolean {
    const current = this.getPTSPAppConfig();
    const updated: PTSPInnovationAppConfig = {
      ...current,
      ...updates,
      lastUpdated: new Date().toLocaleString('sv-SE').replace('T', ' ')
    };
    localStorage.setItem(STORAGE_KEYS.PTSP_APP_CONFIG, JSON.stringify(updated));
    this.addAuditLog('UPDATE', 'SISTEM', `Pengaturan aplikasi inovasi PTSP custom diperbarui.`);
    this.notify();
    return true;
  }

  // --- SATKER STRUCTURE CRUD (PERMA RI NO. 1 TAHUN 2017) ---
  public getSatkerStructure(): SatkerStructureItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SATKER_STRUCTURE);
      if (!data) return INITIAL_SATKER_STRUCTURE;
      const parsed: SatkerStructureItem[] = JSON.parse(data);
      let modified = false;
      const normalized = parsed.map(item => {
        if (item.namaPejabat === 'M. Arfah Afendi, S.E., M.M.') {
          modified = true;
          return { ...item, namaPejabat: 'Muhammad Arfah Afendi, S.E., M.M.' };
        }
        if (item.namaPejabat === 'Herna Dian P. Napan, S.T.') {
          modified = true;
          return { ...item, namaPejabat: 'Herna Dian Prihatiny Napan, S.T.' };
        }
        if (item.namaPejabat === 'M. Imam S, S.H.') {
          modified = true;
          return { ...item, namaPejabat: 'Muhammad Imam S, S.H.' };
        }
        return item;
      });
      if (modified) {
        localStorage.setItem(STORAGE_KEYS.SATKER_STRUCTURE, JSON.stringify(normalized));
      }
      return normalized;
    } catch {
      return INITIAL_SATKER_STRUCTURE;
    }
  }

  public addSatkerStructure(item: Omit<SatkerStructureItem, 'id' | 'no'>): SatkerStructureItem {
    const struct = this.getSatkerStructure();
    const newItem: SatkerStructureItem = {
      ...item,
      id: `st-${Date.now()}`,
      no: struct.length + 1
    };
    const updated = [...struct, newItem];
    localStorage.setItem(STORAGE_KEYS.SATKER_STRUCTURE, JSON.stringify(updated));
    this.syncKeyToServer(STORAGE_KEYS.SATKER_STRUCTURE, updated);
    this.addAuditLog('CREATE', 'PERSONEL', `Menambahkan unit/jabatan struktur Satker: ${newItem.jabatan} (${newItem.namaPejabat})`);
    this.notify();
    return newItem;
  }

  public updateSatkerStructure(id: string, updates: Partial<SatkerStructureItem>): boolean {
    const struct = this.getSatkerStructure();
    const idx = struct.findIndex(s => s.id === id);
    if (idx === -1) return false;

    struct[idx] = { ...struct[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.SATKER_STRUCTURE, JSON.stringify(struct));
    this.syncKeyToServer(STORAGE_KEYS.SATKER_STRUCTURE, struct);
    this.addAuditLog('UPDATE', 'PERSONEL', `Memperbarui unit/jabatan struktur Satker: ${struct[idx].jabatan}`);
    this.notify();
    return true;
  }

  public deleteSatkerStructure(id: string): boolean {
    const struct = this.getSatkerStructure();
    const target = struct.find(s => s.id === id);
    if (!target) return false;

    const filtered = struct.filter(s => s.id !== id).map((s, idx) => ({ ...s, no: idx + 1 }));
    localStorage.setItem(STORAGE_KEYS.SATKER_STRUCTURE, JSON.stringify(filtered));
    this.syncKeyToServer(STORAGE_KEYS.SATKER_STRUCTURE, filtered);
    this.addAuditLog('DELETE', 'PERSONEL', `Menghapus unit/jabatan struktur Satker: ${target.jabatan}`);
    this.notify();
    return true;
  }

  public resetSatkerStructure(): void {
    localStorage.setItem(STORAGE_KEYS.SATKER_STRUCTURE, JSON.stringify(INITIAL_SATKER_STRUCTURE));
    this.syncKeyToServer(STORAGE_KEYS.SATKER_STRUCTURE, INITIAL_SATKER_STRUCTURE);
    this.addAuditLog('RESTORE', 'PERSONEL', 'Mereset struktur organisasi satker ke standar PERMA No. 1 Tahun 2017.');
    this.notify();
  }

  // --- RELATED WEBSITES (TAUTAN RESMI MA-RI & PENGAWASAN) ---
  public getRelatedWebsites(): RelatedWebsiteItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RELATED_WEBSITES);
      return data ? JSON.parse(data) : INITIAL_RELATED_WEBSITES;
    } catch {
      return INITIAL_RELATED_WEBSITES;
    }
  }

  public addRelatedWebsite(item: Omit<RelatedWebsiteItem, 'id'>): RelatedWebsiteItem {
    const list = this.getRelatedWebsites();
    const newItem: RelatedWebsiteItem = {
      ...item,
      id: `rw-${Date.now()}`
    };
    const updated = [...list, newItem];
    localStorage.setItem(STORAGE_KEYS.RELATED_WEBSITES, JSON.stringify(updated));
    this.syncKeyToServer(STORAGE_KEYS.RELATED_WEBSITES, updated);
    this.addAuditLog('CREATE', 'SISTEM', `Menambahkan tautan resmi website: ${newItem.name} (${newItem.url})`);
    this.notify();
    return newItem;
  }

  public updateRelatedWebsite(id: string, updates: Partial<RelatedWebsiteItem>): boolean {
    const list = this.getRelatedWebsites();
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return false;

    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.RELATED_WEBSITES, JSON.stringify(list));
    this.syncKeyToServer(STORAGE_KEYS.RELATED_WEBSITES, list);
    this.addAuditLog('UPDATE', 'SISTEM', `Memperbarui tautan resmi website: ${list[idx].name}`);
    this.notify();
    return true;
  }

  public deleteRelatedWebsite(id: string): boolean {
    const list = this.getRelatedWebsites();
    const target = list.find(item => item.id === id);
    if (!target) return false;

    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.RELATED_WEBSITES, JSON.stringify(filtered));
    this.syncKeyToServer(STORAGE_KEYS.RELATED_WEBSITES, filtered);
    this.addAuditLog('DELETE', 'SISTEM', `Menghapus tautan resmi website: ${target.name}`);
    this.notify();
    return true;
  }

  public resetRelatedWebsites(): void {
    localStorage.setItem(STORAGE_KEYS.RELATED_WEBSITES, JSON.stringify(INITIAL_RELATED_WEBSITES));
    this.syncKeyToServer(STORAGE_KEYS.RELATED_WEBSITES, INITIAL_RELATED_WEBSITES);
    this.addAuditLog('RESTORE', 'SISTEM', `Mereset daftar tautan resmi ke standar awal MA-RI.`);
    this.notify();
  }

  private migrateAssetUrl(storedUrl: string | undefined, defaultUrl: string): string {
    if (!storedUrl) return storedUrl === '' ? '' : defaultUrl;
    // Only migrate uncompiled source path references that cannot be served in production
    if (storedUrl.startsWith('/src/assets/') || storedUrl.startsWith('./src/assets/')) {
      return defaultUrl;
    }
    return storedUrl;
  }

  // --- COURT IDENTITY & CONTACT PROFILE ---
  public getCourtIdentity(): CourtIdentityData {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURT_IDENTITY);
      const parsed = data ? JSON.parse(data) : INITIAL_COURT_IDENTITY;
      if (parsed) {
        if (!parsed.phone || parsed.phone.includes('0411') || parsed.phone.includes('512345') || parsed.phone.includes('515088')) {
          parsed.phone = '081144405554';
        }
        if (!parsed.whatsapp || parsed.whatsapp.includes('4567') || parsed.whatsapp.includes('4288') || parsed.whatsapp.includes('4455668') || parsed.whatsapp.includes('0812')) {
          parsed.whatsapp = '0811-4440-5554';
        }
      }
      if (parsed.logoUrl) {
        parsed.logoUrl = this.migrateAssetUrl(parsed.logoUrl, INITIAL_COURT_IDENTITY.logoUrl || '');
      }
      return parsed;
    } catch {
      return INITIAL_COURT_IDENTITY;
    }
  }

  public updateCourtIdentity(updates: Partial<CourtIdentityData>, skipMenuSync: boolean = false): boolean {
    const current = this.getCourtIdentity();
    const updated: CourtIdentityData = {
      ...current,
      ...updates
    };
    this.lastLocalWriteTime = Date.now();
    localStorage.setItem(STORAGE_KEYS.COURT_IDENTITY, JSON.stringify(updated));
    this.syncKeyToServer(STORAGE_KEYS.COURT_IDENTITY, updated);
    this.addAuditLog('UPDATE', 'SISTEM', `Memperbarui profil identitas & kontak resmi pengadilan.`);
    this.notify(STORAGE_KEYS.COURT_IDENTITY, updated);

    // Bilateral sync from court identity updates to menu contents
    if (!skipMenuSync) {
      try {
        const menus = this.getAllMenuContents();
        let menuModified = false;
        const m1 = menus.find(m => m.id === 'm1');
        if (m1) {
          if (
            updates.sambutanNama || 
            updates.sambutanQuote || 
            updates.sambutanParagraph1 || 
            updates.sambutanParagraph2 || 
            updates.sambutanJabatan ||
            updates.fotoKadilmil !== undefined ||
            updates.pangkatKadilmil ||
            updates.nrpKadilmil
          ) {
            m1.customFields = {
              ...m1.customFields,
              namaKadilmil: updates.sambutanNama || updates.namaKadilmil || m1.customFields?.namaKadilmil || 'Kolonel Chk Sultan, S.H.',
              pangkatKadilmil: updates.pangkatKadilmil || m1.customFields?.pangkatKadilmil || 'Kolonel Chk',
              nrpKadilmil: updates.nrpKadilmil || m1.customFields?.nrpKadilmil || '11980017760771',
              fotoKadilmil: updates.fotoKadilmil !== undefined ? updates.fotoKadilmil : (m1.customFields?.fotoKadilmil || updated.fotoKadilmil || ''),
              kutipanQuote: updates.sambutanQuote || m1.customFields?.kutipanQuote
            };
            if (updates.sambutanJabatan) {
              m1.subJudul = updates.sambutanJabatan;
            }
            const p1 = updates.sambutanParagraph1 || '';
            const p2 = updates.sambutanParagraph2 || '';
            const quote = (updates.sambutanQuote || m1.customFields?.kutipanQuote || '').replace(/^"|"$/g, '');
            if (p1 || p2 || quote) {
              m1.kontenUtama = quote ? `"${quote}"\n\n${p1}\n\n${p2}`.trim() : `${p1}\n\n${p2}`.trim();
            }
            menuModified = true;
          }
        }
        // Also sync photo to pimpinan personnel (pers-1) if photo changed
        if (updates.fotoKadilmil) {
          try {
            const persList = this.getPersonnel();
            const pIdx = persList.findIndex(p => p.id === 'pers-1' || p.nipNrp === '11980017760771');
            if (pIdx !== -1) {
              persList[pIdx].fotoUrl = updates.fotoKadilmil;
              localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(persList));
              this.syncKeyToServer(STORAGE_KEYS.PERSONNEL, persList);
            }
          } catch {}
        }
        const m2 = menus.find(m => m.id === 'm2');
        if (m2 && (updates.visiText || updates.slogan)) {
          m2.customFields = {
            ...m2.customFields,
            visiUtama: updates.visiText || m2.customFields?.visiUtama,
            mottoPengadilan: updates.slogan || m2.customFields?.mottoPengadilan
          };
          menuModified = true;
        }
        const m3 = menus.find(m => m.id === 'm3');
        if (m3 && (updates.sejarahIntro || updates.sejarahParagraph)) {
          const sIntro = updates.sejarahIntro || '';
          const sPara = updates.sejarahParagraph || '';
          m3.kontenUtama = `${sIntro}\n\n${sPara}`.trim();
          menuModified = true;
        }
        const m4 = menus.find(m => m.id === 'm4');
        if (m4 && updates.baganStrukturUrl) {
          m4.customFields = {
            ...m4.customFields,
            baganStrukturUrl: updates.baganStrukturUrl,
            linkBaganStruktur: updates.baganStrukturUrl
          };
          menuModified = true;
        }
        const m5 = menus.find(m => m.id === 'm5');
        if (m5 && (updates.denahLantai1Url || updates.denahLantai2Url || updates.googleMapsEmbedUrl)) {
          m5.customFields = {
            ...m5.customFields,
            denahLantai1Url: updates.denahLantai1Url || m5.customFields?.denahLantai1Url,
            denahLantai2Url: updates.denahLantai2Url || m5.customFields?.denahLantai2Url,
            googleMapsEmbedUrl: updates.googleMapsEmbedUrl || m5.customFields?.googleMapsEmbedUrl
          };
          menuModified = true;
        }
        const m8 = menus.find(m => m.id === 'm8');
        if (m8 && (updates.sistemPengelolaan || updates.standarISO)) {
          if (updates.sistemPengelolaan) m8.kontenUtama = updates.sistemPengelolaan;
          if (updates.standarISO) {
            m8.customFields = {
              ...m8.customFields,
              sertifikatSMAP: updates.standarISO
            };
          }
          menuModified = true;
        }
        const lp1 = menus.find(m => m.id === 'lp1');
        if (lp1 && (updates.jamLayananUmum || updates.jamLayananJumat || updates.hotlinePTSP)) {
          lp1.customFields = {
            ...lp1.customFields,
            jamLayananUmum: updates.jamLayananUmum || lp1.customFields?.jamLayananUmum,
            jamLayananJumat: updates.jamLayananJumat || lp1.customFields?.jamLayananJumat,
            hotlinePTSP: updates.hotlinePTSP || lp1.customFields?.hotlinePTSP
          };
          menuModified = true;
        }
        const lp2 = menus.find(m => m.id === 'lp2');
        if (lp2 && updates.maklumatPelayanan) {
          lp2.kontenUtama = updates.maklumatPelayanan;
          menuModified = true;
        }
        const lp7 = menus.find(m => m.id === 'lp7');
        if (lp7 && (updates.profIkmSkor || updates.profIpakSkor || updates.profSurveiUrl)) {
          lp7.customFields = {
            ...lp7.customFields,
            nilaiIKMTerbaru: updates.profIkmSkor || lp7.customFields?.nilaiIKMTerbaru,
            nilaiIPAKTerbaru: updates.profIpakSkor || lp7.customFields?.nilaiIPAKTerbaru,
            linkSurveiOnline: updates.profSurveiUrl || lp7.customFields?.linkSurveiOnline
          };
          menuModified = true;
        }
        if (menuModified) {
          this.lastLocalWriteTime = Date.now();
          localStorage.setItem(STORAGE_KEYS.MENU_CONTENTS, JSON.stringify(menus));
          this.syncKeyToServer(STORAGE_KEYS.MENU_CONTENTS, menus);
        }
      } catch (e) {
        console.warn('Sync court identity to menu contents failed', e);
      }
    }

    return true;
  }

  public resetCourtIdentity(): void {
    localStorage.setItem(STORAGE_KEYS.COURT_IDENTITY, JSON.stringify(INITIAL_COURT_IDENTITY));
    this.addAuditLog('RESTORE', 'SISTEM', `Mereset profil identitas ke data standar resmi.`);
    this.notify();
  }

  // --- JURISDICTION COURTS (6 DILMIL TINGKAT PERTAMA) ---
  public getJurisdictionCourts(): JurisdictionCourtItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JURISDICTION_COURTS);
      return data ? JSON.parse(data) : INITIAL_JURISDICTION_COURTS;
    } catch {
      return INITIAL_JURISDICTION_COURTS;
    }
  }

  public updateJurisdictionCourt(code: string, updates: Partial<JurisdictionCourtItem>): boolean {
    const list = this.getJurisdictionCourts();
    const idx = list.findIndex(c => c.code.toLowerCase() === code.toLowerCase());
    if (idx === -1) return false;

    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.JURISDICTION_COURTS, JSON.stringify(list));
    this.addAuditLog('UPDATE', 'SISTEM', `Memperbarui data yurisdiksi satuan kerja: ${list[idx].name}`);
    this.notify();
    return true;
  }

  public resetJurisdictionCourts(): void {
    localStorage.setItem(STORAGE_KEYS.JURISDICTION_COURTS, JSON.stringify(INITIAL_JURISDICTION_COURTS));
    this.addAuditLog('RESTORE', 'SISTEM', `Mereset data 6 Pengadilan Militer yurisdiksi ke awal.`);
    this.notify();
  }

  // --- REFORMASI BIROKRASI & ZONA INTEGRITAS EVIDEN CRUD ---
  public getReformasiEviden(): ReformasiEvidenItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REFORMASI_EVIDEN);
      return data ? JSON.parse(data) : INITIAL_REFORMASI_EVIDEN;
    } catch {
      return INITIAL_REFORMASI_EVIDEN;
    }
  }

  public addReformasiEviden(item: Omit<ReformasiEvidenItem, 'id' | 'tanggalUpload'>): ReformasiEvidenItem {
    const list = this.getReformasiEviden();
    const newItem: ReformasiEvidenItem = {
      ...item,
      id: `ev-${Date.now()}`,
      tanggalUpload: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...list];
    localStorage.setItem(STORAGE_KEYS.REFORMASI_EVIDEN, JSON.stringify(updated));
    this.addAuditLog('CREATE', 'REFORMASI', `Mengunggah dokumen eviden ZI: "${newItem.judulDokumen.substring(0, 40)}..." (${newItem.areaName})`);
    this.notify();
    return newItem;
  }

  public updateReformasiEviden(id: string, updates: Partial<ReformasiEvidenItem>): boolean {
    const list = this.getReformasiEviden();
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return false;

    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.REFORMASI_EVIDEN, JSON.stringify(list));
    this.addAuditLog('UPDATE', 'REFORMASI', `Memperbarui dokumen eviden ZI: "${list[idx].judulDokumen.substring(0, 40)}..."`);
    this.notify();
    return true;
  }

  public deleteReformasiEviden(id: string): boolean {
    const list = this.getReformasiEviden();
    const target = list.find(e => e.id === id);
    if (!target) return false;

    const filtered = list.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.REFORMASI_EVIDEN, JSON.stringify(filtered));
    this.addAuditLog('DELETE', 'REFORMASI', `Menghapus dokumen eviden ZI: "${target.judulDokumen.substring(0, 40)}..."`);
    this.notify();
    return true;
  }

  public resetReformasiEviden(): void {
    localStorage.setItem(STORAGE_KEYS.REFORMASI_EVIDEN, JSON.stringify(INITIAL_REFORMASI_EVIDEN));
    this.addAuditLog('RESTORE', 'REFORMASI', 'Mereset dokumen eviden ZI ke standar resmi PermenPAN-RB.');
    this.notify();
  }

  // --- CONVENIENCE ALIASES ---
  public getSippList(): PerkaraSIPP[] {
    return this.getSIPP();
  }

  public getJadwalList(): JadwalSidangItem[] {
    return this.getJadwal();
  }

  public getNewsList(): NewsItem[] {
    return this.getNews();
  }

  public getDipList(): DIPItem[] {
    return this.getDIP();
  }

  public getPersonnelList(): PersonnelItem[] {
    return this.getPersonnel();
  }

  public getUserList(): UserAccount[] {
    return this.getUsers();
  }

  public getEvidenList(): ReformasiEvidenItem[] {
    return this.getReformasiEviden();
  }

  // --- POPUP ANNOUNCEMENT WINDOW CONFIGURATION ---
  public getPopupConfig(): PopupAnnouncementConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.POPUP_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POPUP_CONFIG, JSON.stringify(DEFAULT_POPUP_CONFIG));
      return { ...DEFAULT_POPUP_CONFIG };
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed.imageUrl !== undefined) {
        parsed.imageUrl = this.migrateAssetUrl(parsed.imageUrl, DEFAULT_POPUP_CONFIG.imageUrl || '');
      }
      return { ...DEFAULT_POPUP_CONFIG, ...parsed };
    } catch {
      return { ...DEFAULT_POPUP_CONFIG };
    }
  }

  public savePopupConfig(config: PopupAnnouncementConfig, user?: UserAccount | null): boolean {
    try {
      this.lastLocalWriteTime = Date.now();
      this.isLocalDirty = true;
      const updated: PopupAnnouncementConfig = {
        ...config,
        updatedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        updatedBy: user ? `${user.nama} (${user.role})` : 'Administrator'
      };
      this.safeSetLocalStorage(STORAGE_KEYS.POPUP_CONFIG, JSON.stringify(updated));
      this.addAuditLog('UPDATE', 'SISTEM', `Memperbarui konfigurasi Pop-up Pengumuman: "${updated.title}" (Status: ${updated.isActive ? 'Aktif' : 'Nonaktif'})`);
      this.syncKeyToServer(STORAGE_KEYS.POPUP_CONFIG, updated);
      return true;
    } catch (e) {
      console.error("Database error in savePopupConfig:", e);
      this.notify(STORAGE_KEYS.POPUP_CONFIG, config);
      return true;
    }
  }

  public resetPopupConfig(): PopupAnnouncementConfig {
    this.safeSetLocalStorage(STORAGE_KEYS.POPUP_CONFIG, JSON.stringify(DEFAULT_POPUP_CONFIG));
    this.addAuditLog('RESTORE', 'SISTEM', 'Mereset konfigurasi Pop-up Pengumuman ke standar resmi.');
    this.notify(STORAGE_KEYS.POPUP_CONFIG, DEFAULT_POPUP_CONFIG);
    return DEFAULT_POPUP_CONFIG;
  }

  // --- WHATSAPP FOONTE GATEWAY CONFIGURATION ---
  public getWhatsAppConfig(): WhatsAppFoonteConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.WHATSAPP_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(DEFAULT_WHATSAPP_FOONTE_CONFIG));
      return { ...DEFAULT_WHATSAPP_FOONTE_CONFIG };
    }
    try {
      return { ...DEFAULT_WHATSAPP_FOONTE_CONFIG, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_WHATSAPP_FOONTE_CONFIG };
    }
  }

  public saveWhatsAppConfig(config: WhatsAppFoonteConfig, user?: UserAccount | null): void {
    const updated: WhatsAppFoonteConfig = {
      ...config,
      updatedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      updatedBy: user ? `${user.nama} (${user.role})` : 'Administrator'
    };
    this.safeSetLocalStorage(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(updated));
    this.addAuditLog('UPDATE', 'SISTEM', `Memperbarui konfigurasi Foonte WhatsApp Gateway (Status: ${updated.isActive ? 'Aktif' : 'Nonaktif'}, Sender: ${updated.senderNumber})`);
    this.notify(STORAGE_KEYS.WHATSAPP_CONFIG, updated);
  }

  public resetWhatsAppConfig(): WhatsAppFoonteConfig {
    this.safeSetLocalStorage(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(DEFAULT_WHATSAPP_FOONTE_CONFIG));
    this.addAuditLog('RESTORE', 'SISTEM', 'Mereset konfigurasi Foonte WhatsApp Gateway ke standar awal.');
    this.notify(STORAGE_KEYS.WHATSAPP_CONFIG, DEFAULT_WHATSAPP_FOONTE_CONFIG);
    return DEFAULT_WHATSAPP_FOONTE_CONFIG;
  }

  // --- E-COURT CONTENT CRUD METHODS ---
  public getECourtContent(): ECourtPageContent {
    const raw = localStorage.getItem(STORAGE_KEYS.ECOURT_CONTENT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ECOURT_CONTENT, JSON.stringify(DEFAULT_ECOURT_CONTENT));
      return { ...DEFAULT_ECOURT_CONTENT };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_ECOURT_CONTENT,
        ...parsed,
        header: { ...DEFAULT_ECOURT_CONTENT.header, ...(parsed.header || {}) },
        overview: { ...DEFAULT_ECOURT_CONTENT.overview, ...(parsed.overview || {}) },
        efiling: { ...DEFAULT_ECOURT_CONTENT.efiling, ...(parsed.efiling || {}) },
        epayment: { ...DEFAULT_ECOURT_CONTENT.epayment, ...(parsed.epayment || {}) },
        esummons: { ...DEFAULT_ECOURT_CONTENT.esummons, ...(parsed.esummons || {}) },
        elitigation: { ...DEFAULT_ECOURT_CONTENT.elitigation, ...(parsed.elitigation || {}) },
        bantuan: { ...DEFAULT_ECOURT_CONTENT.bantuan, ...(parsed.bantuan || {}) }
      };
    } catch {
      return { ...DEFAULT_ECOURT_CONTENT };
    }
  }

  public saveECourtContent(content: ECourtPageContent, user?: UserAccount | null): void {
    const updated: ECourtPageContent = {
      ...content,
      updatedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    };
    this.safeSetLocalStorage(STORAGE_KEYS.ECOURT_CONTENT, JSON.stringify(updated));
    this.addAuditLog('UPDATE', 'SISTEM', `Memperbarui konten Layanan e-Court Terintegrasi (Oleh: ${user ? user.nama : 'Administrator'})`);
    this.notify(STORAGE_KEYS.ECOURT_CONTENT, updated);
  }

  public resetECourtContent(user?: UserAccount | null): ECourtPageContent {
    this.safeSetLocalStorage(STORAGE_KEYS.ECOURT_CONTENT, JSON.stringify(DEFAULT_ECOURT_CONTENT));
    this.addAuditLog('RESTORE', 'SISTEM', `Mereset konten Layanan e-Court ke standar resmi Mahkamah Agung RI (Oleh: ${user ? user.nama : 'Administrator'})`);
    this.notify(STORAGE_KEYS.ECOURT_CONTENT, DEFAULT_ECOURT_CONTENT);
    return DEFAULT_ECOURT_CONTENT;
  }

  // Sub-item CRUD helpers
  public addECourtCaseType(item: Omit<ECourtCaseTypeItem, 'id'>, user?: UserAccount | null): ECourtCaseTypeItem {
    const content = this.getECourtContent();
    const newItem: ECourtCaseTypeItem = {
      ...item,
      id: `jp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    content.efiling.daftarJenisPerkara.push(newItem);
    this.saveECourtContent(content, user);
    return newItem;
  }

  public updateECourtCaseType(item: ECourtCaseTypeItem, user?: UserAccount | null): void {
    const content = this.getECourtContent();
    const idx = content.efiling.daftarJenisPerkara.findIndex(x => x.id === item.id);
    if (idx !== -1) {
      content.efiling.daftarJenisPerkara[idx] = item;
      this.saveECourtContent(content, user);
    }
  }

  public deleteECourtCaseType(id: string, user?: UserAccount | null): void {
    const content = this.getECourtContent();
    content.efiling.daftarJenisPerkara = content.efiling.daftarJenisPerkara.filter(x => x.id !== id);
    this.saveECourtContent(content, user);
  }

  public addECourtDocRequirement(item: Omit<ECourtDocRequirementItem, 'id'>, user?: UserAccount | null): ECourtDocRequirementItem {
    const content = this.getECourtContent();
    const newItem: ECourtDocRequirementItem = {
      ...item,
      id: `dok-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    content.efiling.daftarDokumen.push(newItem);
    this.saveECourtContent(content, user);
    return newItem;
  }

  public updateECourtDocRequirement(item: ECourtDocRequirementItem, user?: UserAccount | null): void {
    const content = this.getECourtContent();
    const idx = content.efiling.daftarDokumen.findIndex(x => x.id === item.id);
    if (idx !== -1) {
      content.efiling.daftarDokumen[idx] = item;
      this.saveECourtContent(content, user);
    }
  }

  public deleteECourtDocRequirement(id: string, user?: UserAccount | null): void {
    const content = this.getECourtContent();
    content.efiling.daftarDokumen = content.efiling.daftarDokumen.filter(x => x.id !== id);
    this.saveECourtContent(content, user);
  }

  public addECourtProcedureStep(item: Omit<ECourtProcedureStepItem, 'id'>, user?: UserAccount | null): ECourtProcedureStepItem {
    const content = this.getECourtContent();
    const newItem: ECourtProcedureStepItem = {
      ...item,
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    content.efiling.alurLangkah.push(newItem);
    this.saveECourtContent(content, user);
    return newItem;
  }

  public updateECourtProcedureStep(item: ECourtProcedureStepItem, user?: UserAccount | null): void {
    const content = this.getECourtContent();
    const idx = content.efiling.alurLangkah.findIndex(x => x.id === item.id);
    if (idx !== -1) {
      content.efiling.alurLangkah[idx] = item;
      this.saveECourtContent(content, user);
    }
  }

  public deleteECourtProcedureStep(id: string, user?: UserAccount | null): void {
    const content = this.getECourtContent();
    content.efiling.alurLangkah = content.efiling.alurLangkah.filter(x => x.id !== id);
    this.saveECourtContent(content, user);
  }

  // ====================================================================
  // SK 593/DJMT/SK.TI2.1.1/VII/2026 STANDARDIZATION DATA MANAGEMENT
  // ====================================================================

  // 1. Role Model & Agen Perubahan
  public getRoleModelAgents(): RoleModelAndAgentItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROLE_MODEL_AGENTS);
      if (data) {
        const parsed: RoleModelAndAgentItem[] = JSON.parse(data);
        let modified = false;
        const normalized = parsed.map(item => {
          if (item.nama.includes('S. Haryanto')) {
            modified = true;
            return {
              ...item,
              nama: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
              pangkatNip: 'Kolonel Kum / NRP 524418'
            };
          }
          return item;
        });
        if (modified) {
          localStorage.setItem(STORAGE_KEYS.ROLE_MODEL_AGENTS, JSON.stringify(normalized));
        }
        return normalized;
      }
    } catch (e) {
      console.error('Gagal membaca Role Model & Agen Perubahan:', e);
    }
    const defaultItems: RoleModelAndAgentItem[] = [
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
        nama: 'Kolonel Kum M. Nirwan Said, S.H., M.H.',
        jabatan: 'Panitera Pengadilan Militer Tinggi V Makassar',
        pangkatNip: 'Kolonel Kum / NRP 524418',
        komitmenKerja: 'Mendorong inovasi layanan kepaniteraan digital berbasis e-Court, MonEksTUN, dan PTSP Online.',
        kontribusiReformasi: 'Penyusunan SOP PTSP 6 Meja dan percepatan penyelesaian perkara banding.',
        rencanaProgramKerja: 'Pengembangan Portal E-Brosur interaktif, layanan publik inklusif disabilitas, dan edukasi publik.',
        fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ROLE_MODEL_AGENTS, JSON.stringify(defaultItems));
    return defaultItems;
  }

  public saveRoleModelAgents(items: RoleModelAndAgentItem[], user?: UserAccount | null): void {
    localStorage.setItem(STORAGE_KEYS.ROLE_MODEL_AGENTS, JSON.stringify(items));
    this.addAuditLog('UPDATE', 'ROLE_MODEL', 'Memperbarui data Profil Role Model & Agen Perubahan SK 593/2026.');
    this.notify(STORAGE_KEYS.ROLE_MODEL_AGENTS, items);
  }

  public addRoleModelAgent(item: Omit<RoleModelAndAgentItem, 'id'>, user?: UserAccount | null): RoleModelAndAgentItem {
    const list = this.getRoleModelAgents();
    const newItem: RoleModelAndAgentItem = {
      ...item,
      id: `rma-${Date.now()}`
    };
    list.unshift(newItem);
    this.saveRoleModelAgents(list, user);
    return newItem;
  }

  public updateRoleModelAgent(item: RoleModelAndAgentItem, user?: UserAccount | null): void {
    const list = this.getRoleModelAgents();
    const idx = list.findIndex(x => x.id === item.id);
    if (idx !== -1) {
      list[idx] = item;
      this.saveRoleModelAgents(list, user);
    }
  }

  public deleteRoleModelAgent(id: string, user?: UserAccount | null): void {
    const list = this.getRoleModelAgents().filter(x => x.id !== id);
    this.saveRoleModelAgents(list, user);
  }

  // 2. Laporan Monitoring dan Evaluasi Website (Lampiran III SK 593/2026)
  public getWebsiteMonevReports(): WebsiteMonevReportItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEBSITE_MONEV);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca Laporan Monev Website:', e);
    }
    const defaultReports: WebsiteMonevReportItem[] = [
      {
        id: 'monev-2026-t3',
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
    localStorage.setItem(STORAGE_KEYS.WEBSITE_MONEV, JSON.stringify(defaultReports));
    return defaultReports;
  }

  public saveWebsiteMonevReports(reports: WebsiteMonevReportItem[], user?: UserAccount | null): void {
    localStorage.setItem(STORAGE_KEYS.WEBSITE_MONEV, JSON.stringify(reports));
    this.addAuditLog('UPDATE', 'MONEV', 'Memperbarui Laporan Monitoring dan Evaluasi Website (SK 593/2026).');
    this.notify(STORAGE_KEYS.WEBSITE_MONEV, reports);
  }

  public addWebsiteMonevReport(report: Omit<WebsiteMonevReportItem, 'id'>, user?: UserAccount | null): WebsiteMonevReportItem {
    const list = this.getWebsiteMonevReports();
    const newReport: WebsiteMonevReportItem = {
      ...report,
      id: `monev-${Date.now()}`
    };
    list.unshift(newReport);
    this.saveWebsiteMonevReports(list, user);
    return newReport;
  }

  public updateWebsiteMonevReport(report: WebsiteMonevReportItem, user?: UserAccount | null): void {
    const list = this.getWebsiteMonevReports();
    const idx = list.findIndex(x => x.id === report.id);
    if (idx !== -1) {
      list[idx] = report;
      this.saveWebsiteMonevReports(list, user);
    }
  }

  public deleteWebsiteMonevReport(id: string, user?: UserAccount | null): void {
    const list = this.getWebsiteMonevReports().filter(x => x.id !== id);
    this.saveWebsiteMonevReports(list, user);
  }

  // 3. Kompensasi Pelayanan PTSP
  public getPublicCompensationInfo(): PublicCompensationInfo {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPENSATION_INFO);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca Kompensasi Pelayanan:', e);
    }
    const defaultInfo: PublicCompensationInfo = {
      skNomor: 'SK KADILMILTI V NO. W5-MIL/SK.PTSP/0102/2026',
      skTanggal: '15 Januari 2026',
      deskripsiAturan: 'Pemberian kompensasi pelayanan merupakan bentuk jaminan kepastian dan akuntabilitas apabila petugas PTSP terlambat memberikan layanan melebihi Standar Operasional Prosedur (SOP) yang ditetapkan.',
      waktuKeterlambatanStandar: 'Lebih dari 30 menit dari SOP estimasi pendaftaran/legalisasi.',
      bentukKompensasi: 'Pemberian souvenir/souvenir dinas resmi, prioritas bebas antrean langsung pada kunjungan berikutnya, dan penyampaian permohonan maaf tertulis dari Pejabat Pembina PTSP.'
    };
    localStorage.setItem(STORAGE_KEYS.COMPENSATION_INFO, JSON.stringify(defaultInfo));
    return defaultInfo;
  }

  public updatePublicCompensationInfo(info: PublicCompensationInfo, user?: UserAccount | null): void {
    localStorage.setItem(STORAGE_KEYS.COMPENSATION_INFO, JSON.stringify(info));
    this.addAuditLog('UPDATE', 'KOMPENSASI', 'Memperbarui SK Kompensasi Pelayanan PTSP.');
    this.notify(STORAGE_KEYS.COMPENSATION_INFO, info);
  }

  // 4. Sidang di Luar Gedung Pengadilan
  public getSidangLuarGedungInfo(): SidangLuarGedungInfo {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SIDANG_LUAR_GEDUNG);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca Sidang Luar Gedung:', e);
    }
    const defaultInfo: SidangLuarGedungInfo = {
      skNomor: 'SK DIRJEN BADILMILTUN NO. 80/DJMT/KEP/OT.01.1/V/2024',
      deskripsi: 'Sidang di Luar Gedung Pengadilan dilaksanakan untuk memperluas jangkauan keadilan bagi prajurit TNI dan masyarakat yang berada di lokasi jauh dari Markas Pengadilan Militer Tinggi V Makassar.',
      persyaratan: [
        'Permohonan resmi dari Pangkalan/Kesatuan Militer setempat',
        'Pemeriksaan perkara dengan jumlah saksi/terdakwa lebih dari 5 orang di luar Kota Makassar',
        'Pertimbangan efisiensi waktu, biaya, dan keamanan persidangan'
      ],
      lokasiPelaksanaan: [
        'Wilayah Hukum Makassar & Sekitarnya (Kodam XIV/Hasanuddin)',
        'Pangkalan TNI AL / Lanud Sultan Hasanuddin',
        'Wilayah Hukum Pengadilan Militer Bawahan (Ambon, Manado, Jayapura, Kendari, Manokwari)'
      ],
      jadwalRencana: 'Triwulanan / Sesuai Penetapan Majelis Hakim'
    };
    localStorage.setItem(STORAGE_KEYS.SIDANG_LUAR_GEDUNG, JSON.stringify(defaultInfo));
    return defaultInfo;
  }

  public updateSidangLuarGedungInfo(info: SidangLuarGedungInfo, user?: UserAccount | null): void {
    localStorage.setItem(STORAGE_KEYS.SIDANG_LUAR_GEDUNG, JSON.stringify(info));
    this.addAuditLog('UPDATE', 'SIDANG_LUAR', 'Memperbarui Informasi Sidang di Luar Gedung Pengadilan.');
    this.notify(STORAGE_KEYS.SIDANG_LUAR_GEDUNG, info);
  }

  // 5. Laporan Survei IKM & IPAK
  public getSurveiReports(): SurveiReportItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SURVEI_REPORTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca Laporan Survei:', e);
    }
    const defaultSurvei: SurveiReportItem[] = [
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
    localStorage.setItem(STORAGE_KEYS.SURVEI_REPORTS, JSON.stringify(defaultSurvei));
    return defaultSurvei;
  }

  public saveSurveiReports(reports: SurveiReportItem[], user?: UserAccount | null): void {
    localStorage.setItem(STORAGE_KEYS.SURVEI_REPORTS, JSON.stringify(reports));
    this.addAuditLog('UPDATE', 'SURVEI', 'Memperbarui Laporan Survei IKM/IPAK & Tindak Lanjut.');
    this.notify(STORAGE_KEYS.SURVEI_REPORTS, reports);
  }

  public addSurveiReport(report: Omit<SurveiReportItem, 'id'>, user?: UserAccount | null): SurveiReportItem {
    const list = this.getSurveiReports();
    const newItem: SurveiReportItem = { ...report, id: `survei-${Date.now()}` };
    list.unshift(newItem);
    this.saveSurveiReports(list, user);
    return newItem;
  }

  public updateSurveiReport(report: SurveiReportItem, user?: UserAccount | null): void {
    const list = this.getSurveiReports();
    const idx = list.findIndex(x => x.id === report.id);
    if (idx !== -1) {
      list[idx] = report;
      this.saveSurveiReports(list, user);
    }
  }

  public deleteSurveiReport(id: string, user?: UserAccount | null): void {
    const list = this.getSurveiReports().filter(x => x.id !== id);
    this.saveSurveiReports(list, user);
  }

  // 6. Brosur Digital / e-Brosur
  public getBrosurDigital(): BrosurDigitalItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BROSUR_DIGITAL);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca Brosur Digital:', e);
    }
    const defaultBrosur: BrosurDigitalItem[] = [
      {
        id: 'brosur-1',
        judulBrosur: 'Panduan Layanan PTSP Online & Hak-Hak Pengguna Peradilan',
        kategori: 'Pelayanan Publik & PTSP',
        deskripsi: 'Brosur informasi lengkap alur pendaftaran perkara, permohonan izin besuk, dan layanan bebas biaya.',
        filePdfUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Standar_Pelayanan_PTSP_2026.pdf',
        coverImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'brosur-2',
        judulBrosur: 'Brosur Layanan Disabilitas & Ramah Inklusi SK Dirjen 256/2021',
        kategori: 'Layanan Disabilitas',
        deskripsi: 'Petunjuk fasilitas sarana prasarana dan pendampingan khusus bagi pengguna layanan difabel.',
        filePdfUrl: 'https://dilmilti-makassar.go.id/dokumen/zi/Buku_SOP_Terpadu_Dilmilti5_2026.pdf',
        coverImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.BROSUR_DIGITAL, JSON.stringify(defaultBrosur));
    return defaultBrosur;
  }

  public saveBrosurDigital(items: BrosurDigitalItem[], user?: UserAccount | null): void {
    localStorage.setItem(STORAGE_KEYS.BROSUR_DIGITAL, JSON.stringify(items));
    this.addAuditLog('UPDATE', 'BROSUR', 'Memperbarui daftar Brosur Digital / e-Brosur.');
    this.notify(STORAGE_KEYS.BROSUR_DIGITAL, items);
  }

  public addBrosurDigital(item: Omit<BrosurDigitalItem, 'id'>, user?: UserAccount | null): BrosurDigitalItem {
    const list = this.getBrosurDigital();
    const newItem: BrosurDigitalItem = { ...item, id: `brosur-${Date.now()}` };
    list.unshift(newItem);
    this.saveBrosurDigital(list, user);
    return newItem;
  }

  public updateBrosurDigital(item: BrosurDigitalItem, user?: UserAccount | null): void {
    const list = this.getBrosurDigital();
    const idx = list.findIndex(x => x.id === item.id);
    if (idx !== -1) {
      list[idx] = item;
      this.saveBrosurDigital(list, user);
    }
  }

  public deleteBrosurDigital(id: string, user?: UserAccount | null): void {
    const list = this.getBrosurDigital().filter(x => x.id !== id);
    this.saveBrosurDigital(list, user);
  }

  // --- MENU CONTENT CRUD (23 SUB-MENUS PENGADILAN) ---
  public getAllMenuContents(): MenuContentItem[] {
    const sanitizeMenu = (m: MenuContentItem): MenuContentItem => ({
      ...m,
      judul: cleanPageNumberReferences(m.judul),
      subJudul: cleanPageNumberReferences(m.subJudul),
      kontenUtama: cleanPageNumberReferences(m.kontenUtama),
      poinPoin: m.poinPoin ? m.poinPoin.map(cleanPageNumberReferences) : m.poinPoin
    });

    if (typeof window === 'undefined') return DEFAULT_MENU_CONTENTS.map(sanitizeMenu);
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MENU_CONTENTS);
      if (!data) {
        const sanitizedDefaults = DEFAULT_MENU_CONTENTS.map(sanitizeMenu);
        localStorage.setItem(STORAGE_KEYS.MENU_CONTENTS, JSON.stringify(sanitizedDefaults));
        return sanitizedDefaults;
      }
      let parsed: MenuContentItem[] = JSON.parse(data).map(sanitizeMenu);
      let isUpdated = false;

      // Ensure m1 (Pengantar Pimpinan) customFields are populated and legacy unsplash photo is upgraded
      const m1Idx = parsed.findIndex(x => x.id === 'm1');
      if (m1Idx >= 0) {
        const storedIdRaw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.COURT_IDENTITY) : null;
        let storedFoto = '';
        if (storedIdRaw) {
          try {
            const parsedId = JSON.parse(storedIdRaw);
            storedFoto = parsedId.fotoKadilmil || '';
          } catch {}
        }
        const currentFoto = parsed[m1Idx].customFields?.fotoKadilmil || '';
        // If current photo is the stock woman photo from Unsplash, replace with stored/uploaded photo or default
        if (currentFoto.includes('unsplash.com/photo-1573496359142') || !currentFoto) {
          const effectiveFoto = storedFoto || '/uploads/Screenshot_2026-09-16_093219_1790213987956.jpg';
          parsed[m1Idx].customFields = {
            ...parsed[m1Idx].customFields,
            fotoKadilmil: effectiveFoto
          };
          isUpdated = true;
        }
      }

      // Ensure all default items exist
      const existingIds = new Set(parsed.map(x => x.id));
      const missing = DEFAULT_MENU_CONTENTS.filter(d => !existingIds.has(d.id));
      if (missing.length > 0) {
        parsed = [...parsed, ...missing];
        isUpdated = true;
      }

      if (isUpdated) {
        localStorage.setItem(STORAGE_KEYS.MENU_CONTENTS, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return DEFAULT_MENU_CONTENTS;
    }
  }

  public getMenuContentById(id: string): MenuContentItem | undefined {
    const list = this.getAllMenuContents();
    return list.find(x => x.id === id);
  }

  public saveMenuContent(updated: MenuContentItem, user?: UserAccount | null): void {
    if (typeof window === 'undefined') return;
    this.lastLocalWriteTime = Date.now();
    const list = this.getAllMenuContents();
    const idx = list.findIndex(x => x.id === updated.id);
    let newList: MenuContentItem[];
    const now = new Date().toISOString().slice(0, 10);
    const enriched = { ...updated, tanggalUpdate: now };

    if (idx >= 0) {
      newList = [...list];
      newList[idx] = enriched;
    } else {
      newList = [...list, enriched];
    }

    localStorage.setItem(STORAGE_KEYS.MENU_CONTENTS, JSON.stringify(newList));
    this.syncKeyToServer(STORAGE_KEYS.MENU_CONTENTS, newList);

    // Sync to specialized sub-objects where appropriate (skipMenuSync = true so updated menu content is preserved)
    if (updated.id === 'm1') {
      const rawText = updated.kontenUtama || '';
      const paragraphs = rawText.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      const firstIsQuote = paragraphs[0]?.startsWith('"') || Boolean(updated.customFields?.kutipanQuote);
      const quoteText = (updated.customFields?.kutipanQuote || (firstIsQuote ? paragraphs[0].replace(/^"|"$/g, '') : '')).replace(/^"|"$/g, '');
      const p1 = firstIsQuote ? (paragraphs[1] || '') : (paragraphs[0] || '');
      const p2 = firstIsQuote ? (paragraphs[2] || '') : (paragraphs[1] || '');
      const nama = updated.customFields?.namaKadilmil || 'Kolonel Chk Sultan, S.H.';
      const pangkat = updated.customFields?.pangkatKadilmil || 'Kolonel Chk';
      const nrp = updated.customFields?.nrpKadilmil || '11980017760771';
      const jabatan = updated.subJudul || 'Wakil Kepala Pengadilan Militer Tinggi V Makassar';

      const currentIdentity = this.getCourtIdentity();
      const effectivePhoto = updated.customFields?.fotoKadilmil !== undefined && updated.customFields?.fotoKadilmil !== ''
        ? updated.customFields.fotoKadilmil
        : (currentIdentity.fotoKadilmil || '/uploads/Screenshot_2026-09-16_093219_1790213987956.jpg');

      this.updateCourtIdentity({
        namaKadilmil: nama,
        pangkatKadilmil: pangkat,
        nrpKadilmil: nrp,
        fotoKadilmil: effectivePhoto,
        sambutanKadilmil: updated.kontenUtama || '',
        sambutanNama: nama,
        sambutanJabatan: jabatan,
        sambutanPangkatNrp: `${jabatan} • NRP: ${nrp}`,
        sambutanQuote: quoteText || updated.customFields?.kutipanQuote || '',
        sambutanParagraph1: p1 || updated.kontenUtama || '',
        sambutanParagraph2: p2 || ''
      }, true);
    } else if (updated.id === 'm2') {
      const visi = updated.customFields?.visiUtama || updated.kontenUtama || '';
      this.updateCourtIdentity({
        visi: visi,
        visiText: visi,
        misi: updated.poinPoin || [],
        misi1Desc: updated.poinPoin?.[0] || '',
        misi2Desc: updated.poinPoin?.[1] || '',
        misi3Desc: updated.poinPoin?.[2] || '',
        misi4Desc: updated.poinPoin?.[3] || '',
        slogan: updated.customFields?.mottoPengadilan || undefined
      }, true);
    } else if (updated.id === 'm3') {
      const paragraphs = (updated.kontenUtama || '').split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      this.updateCourtIdentity({
        sejarahSingkat: updated.kontenUtama,
        sejarahIntro: paragraphs[0] || updated.kontenUtama,
        sejarahParagraph: paragraphs[1] || ''
      }, true);
    } else if (updated.id === 'm4' && updated.customFields) {
      this.updateCourtIdentity({
        baganStrukturUrl: updated.customFields.baganStrukturUrl || updated.customFields.linkBaganStruktur
      }, true);
    } else if (updated.id === 'm5' && updated.customFields) {
      this.updateCourtIdentity({
        denahLantai1Url: updated.customFields.denahLantai1Url,
        denahLantai2Url: updated.customFields.denahLantai2Url,
        googleMapsEmbedUrl: updated.customFields.googleMapsEmbedUrl
      }, true);
    } else if (updated.id === 'm8') {
      this.updateCourtIdentity({
        sistemPengelolaan: updated.kontenUtama,
        standarISO: updated.customFields?.sertifikatSMAP || 'SNI ISO 37001:2016'
      }, true);
    } else if (updated.id === 'lp1' && updated.customFields) {
      this.updateCourtIdentity({
        jamLayananUmum: updated.customFields.jamLayananUmum,
        jamLayananJumat: updated.customFields.jamLayananJumat,
        hotlinePTSP: updated.customFields.hotlinePTSP
      }, true);
    } else if (updated.id === 'lp2') {
      this.updateCourtIdentity({
        maklumatPelayanan: updated.kontenUtama
      }, true);
    } else if (updated.id === 'lp3') {
      this.updatePublicCompensationInfo({
        skNomor: updated.skNomor || updated.dasarHukum,
        skTanggal: updated.tanggalUpdate || '2026-01-02',
        deskripsiAturan: updated.kontenUtama,
        waktuKeterlambatanStandar: updated.customFields?.waktuKeterlambatanStandar || '15 Menit',
        bentukKompensasi: updated.customFields?.bentukKompensasi || 'Souvenir Resmi Dilmilti V'
      });
    } else if (updated.id === 'lp7' && updated.customFields) {
      this.updateCourtIdentity({
        profIkmSkor: updated.customFields.nilaiIKMTerbaru,
        profIpakSkor: updated.customFields.nilaiIPAKTerbaru,
        profSurveiUrl: updated.customFields.linkSurveiOnline
      }, true);
    } else if (updated.id === 'lh4') {
      this.updateSidangLuarGedungInfo({
        skNomor: updated.skNomor || 'SK-593/2026-SLG',
        deskripsi: updated.kontenUtama,
        persyaratan: updated.poinPoin || [],
        lokasiPelaksanaan: ['Wilayah Hukum Oditurat Militer IV-16 Makassar', 'Pos Pamtas RI-Perbatasan', 'Pangkalan TNI / Satdik Terluar'],
        jadwalRencana: 'Triwulan II & IV Tahun Anggaran 2026'
      });
    }

    const userName = user?.nama || 'Petugas Admin';
    this.addAuditLog('UPDATE', 'SISTEM', `Memperbarui konten halaman menu '${updated.judul}' (${updated.id}) oleh ${userName}`);
    this.notify(STORAGE_KEYS.MENU_CONTENTS, newList);
  }

  public resetMenuContents(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.MENU_CONTENTS, JSON.stringify(DEFAULT_MENU_CONTENTS));
    this.syncKeyToServer(STORAGE_KEYS.MENU_CONTENTS, DEFAULT_MENU_CONTENTS);
    this.addAuditLog('UPDATE', 'SISTEM', 'Mereset seluruh konten 23 menu ke standar resmi SK 593/2026');
    this.notify(STORAGE_KEYS.MENU_CONTENTS, DEFAULT_MENU_CONTENTS);
  }

  public deleteMenuContent(id: string, user?: UserAccount | null): boolean {
    if (typeof window === 'undefined') return false;
    const list = this.getAllMenuContents();
    const itemToDelete = list.find(x => x.id === id);
    const newList = list.filter(x => x.id !== id);
    localStorage.setItem(STORAGE_KEYS.MENU_CONTENTS, JSON.stringify(newList));
    this.syncKeyToServer(STORAGE_KEYS.MENU_CONTENTS, newList);
    const userName = user?.nama || 'Petugas Admin';
    this.addAuditLog('DELETE', 'SISTEM', `Menghapus menu '${itemToDelete?.judul || id}' (${id}) oleh ${userName}`);
    this.notify(STORAGE_KEYS.MENU_CONTENTS, newList);
    return true;
  }

  // --- DOCUMENT TEMPLATES (PUSAT TEMPLATE DOKUMEN & LAPORAN) ---
  public getAllDocumentTemplates(): DocumentTemplateItem[] {
    const sanitizeTemplate = (t: DocumentTemplateItem): DocumentTemplateItem => ({
      ...t,
      judul: cleanPageNumberReferences(t.judul),
      deskripsi: cleanPageNumberReferences(t.deskripsi),
      teksTemplate: t.teksTemplate ? cleanPageNumberReferences(t.teksTemplate) : t.teksTemplate
    });

    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENT_TEMPLATES);
    if (!raw) {
      const sanitizedDefaults = DEFAULT_DOCUMENT_TEMPLATES.map(sanitizeTemplate);
      localStorage.setItem(STORAGE_KEYS.DOCUMENT_TEMPLATES, JSON.stringify(sanitizedDefaults));
      return sanitizedDefaults;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const defaultMap = new Map(DEFAULT_DOCUMENT_TEMPLATES.map(item => [item.id, item]));
        const merged: DocumentTemplateItem[] = DEFAULT_DOCUMENT_TEMPLATES.map(sanitizeTemplate);
        for (const item of parsed) {
          if (item && item.id && !defaultMap.has(item.id)) {
            merged.push(sanitizeTemplate(item));
          }
        }
        return merged;
      }
      return DEFAULT_DOCUMENT_TEMPLATES.map(sanitizeTemplate);
    } catch {
      return DEFAULT_DOCUMENT_TEMPLATES.map(sanitizeTemplate);
    }
  }

  public saveDocumentTemplate(template: DocumentTemplateItem, user?: UserAccount): void {
    const list = this.getAllDocumentTemplates();
    const index = list.findIndex(x => x.id === template.id);
    if (index >= 0) {
      list[index] = template;
    } else {
      list.push(template);
    }
    localStorage.setItem(STORAGE_KEYS.DOCUMENT_TEMPLATES, JSON.stringify(list));
    this.syncKeyToServer(STORAGE_KEYS.DOCUMENT_TEMPLATES, list);
    const userName = user?.nama || 'Petugas Admin';
    this.addAuditLog('UPDATE', 'SISTEM', `Menyimpan template dokumen '${template.judul}' (${template.kodeDoc}) oleh ${userName}`);
    this.notify(STORAGE_KEYS.DOCUMENT_TEMPLATES, list);
  }

  public deleteDocumentTemplate(id: string, user?: UserAccount): boolean {
    const list = this.getAllDocumentTemplates();
    const itemToDelete = list.find(x => x.id === id);
    const newList = list.filter(x => x.id !== id);
    localStorage.setItem(STORAGE_KEYS.DOCUMENT_TEMPLATES, JSON.stringify(newList));
    this.syncKeyToServer(STORAGE_KEYS.DOCUMENT_TEMPLATES, newList);
    const userName = user?.nama || 'Petugas Admin';
    this.addAuditLog('DELETE', 'SISTEM', `Menghapus template dokumen '${itemToDelete?.judul || id}' oleh ${userName}`);
    this.notify(STORAGE_KEYS.DOCUMENT_TEMPLATES, newList);
    return true;
  }

  // --- BACKUP & RESTORE ---
  public exportDatabaseJson(): string {
    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      courtIdentity: this.getCourtIdentity(),
      relatedWebsites: this.getRelatedWebsites(),
      jurisdictionCourts: this.getJurisdictionCourts(),
      satkerStructure: this.getSatkerStructure(),
      personnel: this.getPersonnel(),
      users: this.getUsers(),
      news: this.getNews(),
      sipp: this.getSIPP(),
      jadwal: this.getJadwal(),
      dip: this.getDIP(),
      reformasiEviden: this.getReformasiEviden(),
      ptspConfig: this.getPTSPAppConfig(),
      popupConfig: this.getPopupConfig(),
      ecourtContent: this.getECourtContent(),
      roleModelAgents: this.getRoleModelAgents(),
      websiteMonev: this.getWebsiteMonevReports(),
      publicCompensation: this.getPublicCompensationInfo(),
      sidangLuarGedung: this.getSidangLuarGedungInfo(),
      surveiReports: this.getSurveiReports(),
      brosurDigital: this.getBrosurDigital(),
      sakipDipaDocs: this.getSakipDipaDocuments(),
      audit: this.getAuditLogs()
    };
    this.addAuditLog('BACKUP', 'SISTEM', 'Mengekspor cadangan database JSON lengkap.');
    return JSON.stringify(backup, null, 2);
  }

  public exportDatabaseSql(): string {
    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      courtIdentity: this.getCourtIdentity(),
      slides: this.getSlides(),
      satkerStructure: this.getSatkerStructure(),
      personnel: this.getPersonnel(),
      users: this.getUsers(),
      news: this.getNews(),
      sipp: this.getSIPP(),
      jadwal: this.getJadwal(),
      dip: this.getDIP(),
      reformasiEviden: this.getReformasiEviden(),
      relatedWebsites: this.getRelatedWebsites(),
      jurisdictionCourts: this.getJurisdictionCourts(),
      ptspConfig: this.getPTSPAppConfig(),
      popupConfig: this.getPopupConfig(),
      audit: this.getAuditLogs()
    };

    const sqlLines: string[] = [];
    const timestamp = new Date().toISOString();

    const totalCount = backup.personnel.length + backup.sipp.length + backup.jadwal.length + backup.news.length + backup.users.length + backup.dip.length + backup.reformasiEviden.length + backup.slides.length + backup.satkerStructure.length + backup.relatedWebsites.length + backup.jurisdictionCourts.length + backup.audit.length;

    sqlLines.push(`-- phpMyAdmin SQL Dump`);
    sqlLines.push(`-- version 5.2.1`);
    sqlLines.push(`-- https://www.phpmyadmin.net/`);
    sqlLines.push(`--`);
    sqlLines.push(`-- Host: localhost`);
    sqlLines.push(`-- Waktu Pembuatan: ${new Date().toLocaleString('id-ID')}`);
    sqlLines.push(`-- Versi Server: MySQL 5.7+ / MySQL 8.0+ / MariaDB 10+`);
    sqlLines.push(`-- Instansi: Pengadilan Militer Tinggi V Makassar`);
    sqlLines.push(`-- ====================================================================\n`);

    sqlLines.push(`SET FOREIGN_KEY_CHECKS = 0;`);
    sqlLines.push(`SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";`);
    sqlLines.push(`START TRANSACTION;`);
    sqlLines.push(`SET time_zone = "+08:00";\n`);

    sqlLines.push(`/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;`);
    sqlLines.push(`/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;`);
    sqlLines.push(`/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;`);
    sqlLines.push(`/*!40101 SET NAMES utf8mb4 */;`);
    sqlLines.push(`/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;`);
    sqlLines.push(`/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;\n`);

    sqlLines.push(`-- --------------------------------------------------------------------`);
    sqlLines.push(`-- Basis Data: \`dilmilti_db\``);
    sqlLines.push(`-- --------------------------------------------------------------------`);
    sqlLines.push(`CREATE DATABASE IF NOT EXISTS \`dilmilti_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    sqlLines.push(`USE \`dilmilti_db\`;\n`);

    // Helper function to safely escape SQL values for MySQL / phpMyAdmin
    const escapeSql = (val: any): string => {
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return Number.isFinite(val) ? String(val) : '0';
      if (typeof val === 'boolean') return val ? '1' : '0';
      
      let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      
      // Standard MySQL string escape compliant with phpMyAdmin / mysql_real_escape_string
      str = str
        .replace(/\\/g, '\\\\')
        .replace(/\0/g, '\\0')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/'/g, "\\'")
        .replace(/\x1a/g, '\\Z');
        
      return `'${str}'`;
    };

    // 0. Table: app_backup_meta (Stores metadata safely without single-line overflow)
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`app_backup_meta\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`app_backup_meta\`;`);
    sqlLines.push(`CREATE TABLE \`app_backup_meta\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`exported_at\` VARCHAR(100),
  \`app_version\` VARCHAR(50),
  \`total_records\` INT,
  \`meta_json\` LONGTEXT,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    sqlLines.push(`INSERT INTO \`app_backup_meta\` (\`id\`, \`exported_at\`, \`app_version\`, \`total_records\`, \`meta_json\`) VALUES ('dilmilti_backup', ${escapeSql(timestamp)}, '2.0.0', ${totalCount}, ${escapeSql(backup)});\n`);

    // 1. Table: court_identity
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`court_identity\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`court_identity\`;`);
    sqlLines.push(`CREATE TABLE \`court_identity\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`nama_pengadilan\` VARCHAR(255) NOT NULL,
  \`alamat\` TEXT,
  \`telepon\` VARCHAR(100),
  \`whatsapp\` VARCHAR(100),
  \`email\` VARCHAR(100),
  \`website\` VARCHAR(255),
  \`slogan\` VARCHAR(255),
  \`sambutan_nama\` VARCHAR(255),
  \`sambutan_jabatan\` VARCHAR(255),
  \`logo_url\` TEXT,
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    const identity = backup.courtIdentity;
    sqlLines.push(`INSERT INTO \`court_identity\` (\`id\`, \`nama_pengadilan\`, \`alamat\`, \`telepon\`, \`whatsapp\`, \`email\`,\`website\`, \`slogan\`, \`sambutan_nama\`, \`sambutan_jabatan\`, \`logo_url\`, \`data_json\`) VALUES ('main', ${escapeSql(identity.name)}, ${escapeSql(identity.address)}, ${escapeSql(identity.phone)}, ${escapeSql(identity.whatsapp)}, ${escapeSql(identity.email)}, ${escapeSql(identity.website)}, ${escapeSql(identity.slogan)}, ${escapeSql(identity.sambutanNama)}, ${escapeSql(identity.sambutanJabatan)}, ${escapeSql(identity.logoUrl)}, ${escapeSql(identity)});\n`);

    // 2. Table: slider_banners
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`slider_banners\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`slider_banners\`;`);
    sqlLines.push(`CREATE TABLE \`slider_banners\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`subtitle\` VARCHAR(255),
  \`description\` TEXT,
  \`bg_image\` TEXT,
  \`target_section\` VARCHAR(100),
  \`action_text\` VARCHAR(100),
  \`badge\` VARCHAR(100),
  \`tag\` VARCHAR(100),
  \`icon_type\` VARCHAR(100),
  \`makassar_highlight\` VARCHAR(255),
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.slides.forEach((s) => {
      sqlLines.push(`INSERT INTO \`slider_banners\` (\`id\`, \`title\`, \`subtitle\`, \`description\`, \`bg_image\`, \`target_section\`, \`action_text\`, \`badge\`, \`tag\`, \`icon_type\`, \`makassar_highlight\`, \`is_active\`, \`data_json\`) VALUES (${escapeSql(s.id)}, ${escapeSql(s.title)}, ${escapeSql(s.subtitle)}, ${escapeSql(s.desc)}, ${escapeSql(s.bgImage)}, ${escapeSql(s.targetSection)}, ${escapeSql(s.actionText)}, ${escapeSql(s.badge)}, ${escapeSql(s.tag)}, ${escapeSql(s.iconType)}, ${escapeSql(s.makassarHighlight)}, 1, ${escapeSql(s)});`);
    });
    sqlLines.push(``);

    // 3. Table: satker_structure
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`satker_structure\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`satker_structure\`;`);
    sqlLines.push(`CREATE TABLE \`satker_structure\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`no\` INT DEFAULT 0,
  \`kelompok\` VARCHAR(100),
  \`jabatan\` VARCHAR(255) NOT NULL,
  \`nama_pejabat\` VARCHAR(255) NOT NULL,
  \`pangkat_nip\` VARCHAR(100),
  \`tugas_fungsi\` TEXT,
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.satkerStructure.forEach((st) => {
      sqlLines.push(`INSERT INTO \`satker_structure\` (\`id\`, \`no\`, \`kelompok\`, \`jabatan\`, \`nama_pejabat\`, \`pangkat_nip\`, \`tugas_fungsi\`, \`data_json\`) VALUES (${escapeSql(st.id)}, ${st.no || 0}, ${escapeSql(st.kelompok)}, ${escapeSql(st.jabatan)}, ${escapeSql(st.namaPejabat)}, ${escapeSql(st.pangkatNip)}, ${escapeSql(st.tugasFungsi)}, ${escapeSql(st)});`);
    });
    sqlLines.push(``);

    // 4. Table: personnel
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`personnel\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`personnel\`;`);
    sqlLines.push(`CREATE TABLE \`personnel\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`no\` INT DEFAULT 0,
  \`nama\` VARCHAR(255) NOT NULL,
  \`nip_nrp\` VARCHAR(100),
  \`pangkat_gol\` VARCHAR(100),
  \`jabatan\` VARCHAR(255),
  \`kategori\` VARCHAR(100),
  \`matra\` VARCHAR(100),
  \`pendidikan\` TEXT,
  \`foto_url\` TEXT,
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`),
  KEY \`idx_kategori\` (\`kategori\`),
  KEY \`idx_matra\` (\`matra\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.personnel.forEach((p) => {
      sqlLines.push(`INSERT INTO \`personnel\` (\`id\`, \`no\`, \`nama\`, \`nip_nrp\`, \`pangkat_gol\`, \`jabatan\`, \`kategori\`, \`matra\`, \`pendidikan\`, \`foto_url\`, \`data_json\`) VALUES (${escapeSql(p.id)}, ${p.no || 0}, ${escapeSql(p.nama)}, ${escapeSql(p.nipNrp)}, ${escapeSql(p.pangkatGol)}, ${escapeSql(p.jabatan)}, ${escapeSql(p.kategori)}, ${escapeSql(p.matra)}, ${escapeSql(p.pendidikan)}, ${escapeSql(p.fotoUrl)}, ${escapeSql(p)});`);
    });
    sqlLines.push(``);

    // 5. Table: sipp_cases
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`sipp_cases\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`sipp_cases\`;`);
    sqlLines.push(`CREATE TABLE \`sipp_cases\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`nomor_perkara\` VARCHAR(255) NOT NULL,
  \`klasifikasi\` VARCHAR(255),
  \`tingkat\` VARCHAR(100),
  \`terdakwa_nama\` VARCHAR(255),
  \`terdakwa_pangkat\` VARCHAR(255),
  \`terdakwa_kesatuan\` VARCHAR(255),
  \`majelis_hakim\` TEXT,
  \`oditur\` VARCHAR(255),
  \`status\` VARCHAR(100),
  \`tanggal_daftar\` VARCHAR(50),
  \`tanggal_putusan\` VARCHAR(50),
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`),
  KEY \`idx_nomor_perkara\` (\`nomor_perkara\`),
  KEY \`idx_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.sipp.forEach((s) => {
      sqlLines.push(`INSERT INTO \`sipp_cases\` (\`id\`, \`nomor_perkara\`, \`klasifikasi\`, \`tingkat\`, \`terdakwa_nama\`, \`terdakwa_pangkat\`, \`terdakwa_kesatuan\`, \`majelis_hakim\`, \`oditur\`, \`status\`, \`tanggal_daftar\`, \`tanggal_putusan\`, \`data_json\`) VALUES (${escapeSql(s.id)}, ${escapeSql(s.nomorPerkara)}, ${escapeSql(s.klasifikasi)}, ${escapeSql(s.tingkatPerkara)}, ${escapeSql(s.terdakwa?.nama)}, ${escapeSql(s.terdakwa?.pangkat)}, ${escapeSql(s.terdakwa?.kesatuan)}, ${escapeSql(s.majelisHakim?.ketua)}, ${escapeSql(s.oditurMiliter)}, ${escapeSql(s.statusPerkara)}, ${escapeSql(s.tanggalDaftar)}, ${escapeSql(s.tanggalPutusan)}, ${escapeSql(s)});`);
    });
    sqlLines.push(``);

    // 6. Table: jadwal_sidang
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`jadwal_sidang\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`jadwal_sidang\`;`);
    sqlLines.push(`CREATE TABLE \`jadwal_sidang\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`nomor_perkara\` VARCHAR(255) NOT NULL,
  \`tanggal\` VARCHAR(100),
  \`waktu\` VARCHAR(100),
  \`ruang\` VARCHAR(100),
  \`agenda\` TEXT,
  \`terdakwa\` VARCHAR(255),
  \`kesatuan\` VARCHAR(255),
  \`majelis_hakim\` VARCHAR(255),
  \`oditur\` VARCHAR(255),
  \`status\` VARCHAR(100),
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`),
  KEY \`idx_tanggal\` (\`tanggal\`),
  KEY \`idx_nomor\` (\`nomor_perkara\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.jadwal.forEach((j) => {
      sqlLines.push(`INSERT INTO \`jadwal_sidang\` (\`id\`, \`nomor_perkara\`, \`tanggal\`, \`waktu\`, \`ruang\`, \`agenda\`, \`terdakwa\`, \`kesatuan\`, \`majelis_hakim\`, \`oditur\`, \`status\`, \`data_json\`) VALUES (${escapeSql(j.id)}, ${escapeSql(j.nomorPerkara)}, ${escapeSql(j.tanggal)}, ${escapeSql(j.waktu)}, ${escapeSql(j.ruangSidang)}, ${escapeSql(j.agenda)}, ${escapeSql(j.terdakwa)}, ${escapeSql(j.kesatuan)}, ${escapeSql(j.majelisHakim)}, ${escapeSql(j.oditur)}, ${escapeSql(j.status)}, ${escapeSql(j)});`);
    });
    sqlLines.push(``);

    // 7. Table: news
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`news\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`news\`;`);
    sqlLines.push(`CREATE TABLE \`news\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`judul\` VARCHAR(500) NOT NULL,
  \`kategori\` VARCHAR(100),
  \`tanggal\` VARCHAR(100),
  \`penulis\` VARCHAR(255),
  \`ringkasan\` TEXT,
  \`gambar_url\` TEXT,
  \`views\` VARCHAR(50),
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`),
  KEY \`idx_kategori\` (\`kategori\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.news.forEach((n) => {
      sqlLines.push(`INSERT INTO \`news\` (\`id\`, \`judul\`, \`kategori\`, \`tanggal\`, \`penulis\`, \`ringkasan\`, \`gambar_url\`, \`views\`, \`data_json\`) VALUES (${escapeSql(n.id)}, ${escapeSql(n.judul)}, ${escapeSql(n.kategori)}, ${escapeSql(n.tanggal)}, ${escapeSql(n.penulis)}, ${escapeSql(n.ringkasan)}, ${escapeSql(n.gambarUrl)}, ${escapeSql(n.views || '0')}, ${escapeSql(n)});`);
    });
    sqlLines.push(``);

    // 8. Table: users
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`users\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`users\`;`);
    sqlLines.push(`CREATE TABLE \`users\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`nama\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`role\` VARCHAR(100) NOT NULL,
  \`instansi\` VARCHAR(255),
  \`nomor_wa\` VARCHAR(100),
  \`status\` VARCHAR(50) DEFAULT 'aktif',
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.users.forEach((u) => {
      sqlLines.push(`INSERT INTO \`users\` (\`id\`, \`nama\`, \`email\`, \`role\`, \`instansi\`, \`nomor_wa\`, \`status\`, \`data_json\`) VALUES (${escapeSql(u.id)}, ${escapeSql(u.nama)}, ${escapeSql(u.email)}, ${escapeSql(u.role)}, ${escapeSql(u.instansi)}, ${escapeSql(u.nomorWA)}, ${escapeSql(u.status)}, ${escapeSql(u)});`);
    });
    sqlLines.push(``);

    // 9. Table: dip_ppid
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`dip_ppid\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`dip_ppid\`;`);
    sqlLines.push(`CREATE TABLE \`dip_ppid\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`no\` INT DEFAULT 0,
  \`nama_informasi\` VARCHAR(500) NOT NULL,
  \`ringkasan\` TEXT,
  \`unit_kerja\` VARCHAR(255),
  \`penanggung_jawab\` VARCHAR(255),
  \`waktu_tempat\` VARCHAR(100),
  \`bentuk_tersedia\` VARCHAR(100),
  \`kategori\` VARCHAR(100),
  \`ukuran_file\` VARCHAR(50),
  \`download_url\` TEXT,
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.dip.forEach((d) => {
      sqlLines.push(`INSERT INTO \`dip_ppid\` (\`id\`, \`no\`, \`nama_informasi\`, \`ringkasan\`, \`unit_kerja\`, \`penanggung_jawab\`, \`waktu_tempat\`, \`bentuk_tersedia\`, \`kategori\`, \`ukuran_file\`, \`download_url\`, \`data_json\`) VALUES (${escapeSql(d.id)}, ${d.no || 0}, ${escapeSql(d.namaInformasi)}, ${escapeSql(d.ringkasan)}, ${escapeSql(d.unitKerja)}, ${escapeSql(d.penanggungJawab)}, ${escapeSql(d.waktuTempat)}, ${escapeSql(d.bentukTersedia)}, ${escapeSql(d.kategori)}, ${escapeSql(d.ukuranFile)}, ${escapeSql(d.downloadUrl)}, ${escapeSql(d)});\n`);
    });
    sqlLines.push(``);

    // 10. Table: reformasi_eviden
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`reformasi_eviden\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`reformasi_eviden\`;`);
    sqlLines.push(`CREATE TABLE \`reformasi_eviden\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`area_id\` INT DEFAULT 0,
  \`area_name\` VARCHAR(255),
  \`judul_dokumen\` VARCHAR(500) NOT NULL,
  \`nomor_surat\` VARCHAR(255),
  \`tahun\` VARCHAR(50),
  \`tanggal_upload\` VARCHAR(100),
  \`file_name\` VARCHAR(255),
  \`file_size\` VARCHAR(50),
  \`file_url\` TEXT,
  \`status_verifikasi\` VARCHAR(100),
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.reformasiEviden.forEach((r) => {
      sqlLines.push(`INSERT INTO \`reformasi_eviden\` (\`id\`, \`area_id\`, \`area_name\`, \`judul_dokumen\`, \`nomor_surat\`, \`tahun\`, \`tanggal_upload\`, \`file_name\`, \`file_size\`, \`file_url\`, \`status_verifikasi\`, \`data_json\`) VALUES (${escapeSql(r.id)}, ${r.areaId || 0}, ${escapeSql(r.areaName)}, ${escapeSql(r.judulDokumen)}, ${escapeSql(r.nomorSurat)}, ${escapeSql(r.tahun)}, ${escapeSql(r.tanggalUpload)}, ${escapeSql(r.fileName)}, ${escapeSql(r.fileSize)}, ${escapeSql(r.fileUrl)}, ${escapeSql(r.statusVerifikasi)}, ${escapeSql(r)});`);
    });
    sqlLines.push(``);

    // 11. Table: related_websites
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`related_websites\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`related_websites\`;`);
    sqlLines.push(`CREATE TABLE \`related_websites\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`url\` TEXT NOT NULL,
  \`role\` VARCHAR(255),
  \`category\` VARCHAR(100),
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.relatedWebsites.forEach((w) => {
      sqlLines.push(`INSERT INTO \`related_websites\` (\`id\`, \`name\`, \`url\`, \`role\`, \`category\`, \`data_json\`) VALUES (${escapeSql(w.id)}, ${escapeSql(w.name)}, ${escapeSql(w.url)}, ${escapeSql(w.role)}, ${escapeSql(w.category)}, ${escapeSql(w)});`);
    });
    sqlLines.push(``);

    // 12. Table: jurisdiction_courts
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`jurisdiction_courts\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`jurisdiction_courts\`;`);
    sqlLines.push(`CREATE TABLE \`jurisdiction_courts\` (
  \`code\` VARCHAR(100) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`wilayah\` VARCHAR(255),
  \`address\` TEXT,
  \`phone\` VARCHAR(100),
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.jurisdictionCourts.forEach((c) => {
      sqlLines.push(`INSERT INTO \`jurisdiction_courts\` (\`code\`, \`name\`, \`wilayah\`, \`address\`, \`phone\`, \`data_json\`) VALUES (${escapeSql(c.code)}, ${escapeSql(c.name)}, ${escapeSql(c.wilayah)}, ${escapeSql(c.address)}, ${escapeSql(c.phone)}, ${escapeSql(c)});`);
    });
    sqlLines.push(``);

    // 13. Table: ptsp_config
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`ptsp_config\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`ptsp_config\`;`);
    sqlLines.push(`CREATE TABLE \`ptsp_config\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`app_name\` VARCHAR(255),
  \`app_description\` TEXT,
  \`external_url\` TEXT,
  \`is_external_embed_active\` TINYINT(1) DEFAULT 0,
  \`last_updated\` VARCHAR(100),
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    sqlLines.push(`INSERT INTO \`ptsp_config\` (\`id\`, \`app_name\`, \`app_description\`, \`external_url\`, \`is_external_embed_active\`, \`last_updated\`, \`data_json\`) VALUES ('main', ${escapeSql(backup.ptspConfig?.appName)}, ${escapeSql(backup.ptspConfig?.appDescription)}, ${escapeSql(backup.ptspConfig?.externalUrl)}, ${backup.ptspConfig?.isExternalEmbedActive ? 1 : 0}, ${escapeSql(backup.ptspConfig?.lastUpdated)}, ${escapeSql(backup.ptspConfig)});\n`);

    // 14. Table: popup_config
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`popup_config\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`popup_config\`;`);
    sqlLines.push(`CREATE TABLE \`popup_config\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`title\` TEXT,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    sqlLines.push(`INSERT INTO \`popup_config\` (\`id\`, \`title\`, \`is_active\`, \`data_json\`) VALUES ('main', ${escapeSql(backup.popupConfig.title)}, ${backup.popupConfig.isActive ? 1 : 0}, ${escapeSql(backup.popupConfig)});\n`);

    // 15. Table: audit_logs
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`-- Struktur tabel untuk \`audit_logs\``);
    sqlLines.push(`-- --------------------------------------------------------`);
    sqlLines.push(`DROP TABLE IF EXISTS \`audit_logs\`;`);
    sqlLines.push(`CREATE TABLE \`audit_logs\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`timestamp\` VARCHAR(100) NOT NULL,
  \`user_name\` VARCHAR(255),
  \`user_role\` VARCHAR(100),
  \`action\` VARCHAR(100),
  \`module\` VARCHAR(100),
  \`details\` TEXT,
  \`data_json\` LONGTEXT,
  PRIMARY KEY (\`id\`),
  KEY \`idx_timestamp\` (\`timestamp\`),
  KEY \`idx_action\` (\`action\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n`);
    backup.audit.forEach((a) => {
      sqlLines.push(`INSERT INTO \`audit_logs\` (\`id\`, \`timestamp\`, \`user_name\`, \`user_role\`, \`action\`, \`module\`, \`details\`, \`data_json\`) VALUES (${escapeSql(a.id)}, ${escapeSql(a.timestamp)}, ${escapeSql(a.userName)}, ${escapeSql(a.userRole)}, ${escapeSql(a.action)}, ${escapeSql(a.module)}, ${escapeSql(a.details)}, ${escapeSql(a)});`);
    });
    sqlLines.push(``);

    sqlLines.push(`/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;`);
    sqlLines.push(`/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;`);
    sqlLines.push(`/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;`);
    sqlLines.push(`/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;`);
    sqlLines.push(`SET FOREIGN_KEY_CHECKS = 1;`);
    sqlLines.push(`COMMIT;\n`);
    sqlLines.push(`-- ====================================================================`);
    sqlLines.push(`-- SELESAI EKSPOR DILMILTI V MAKASSAR DATABASE`);
    sqlLines.push(`-- ====================================================================`);

    this.addAuditLog('BACKUP', 'SISTEM', 'Mengekspor cadangan database SQL Dump untuk phpMyAdmin / MySQL.');
    return sqlLines.join('\n');
  }

  public importRestoreDatabaseSql(sqlString: string): { success: boolean; message: string } {
    try {
      if (!sqlString || typeof sqlString !== 'string') {
        return { success: false, message: 'Isi berkas SQL kosong atau tidak valid.' };
      }

      const unescapeSqlString = (str: string): string => {
        return str
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\0/g, '\0')
          .replace(/\\Z/g, '\x1a')
          .replace(/''/g, "'");
      };

      // 1. Check if app_backup_meta table row exists
      const metaRowMatch = sqlString.match(/INSERT\s+INTO\s+`?app_backup_meta`?[\s\S]*?VALUES\s*\([\s\S]*?,\s*'(\{[\s\S]*?\})'\s*\);/i);
      if (metaRowMatch && metaRowMatch[1]) {
        try {
          const rawJson = unescapeSqlString(metaRowMatch[1]);
          const res = this.importRestoreDatabaseJson(rawJson);
          if (res.success) {
            this.addAuditLog('RESTORE', 'SISTEM', 'Memulihkan database dari tabel metadata SQL Dump.');
            return {
              success: true,
              message: `Berhasil memulihkan database dari berkas SQL Dump phpMyAdmin! ${res.message}`
            };
          }
        } catch {
          // fallback
        }
      }

      // 2. Check legacy metadata JSON comment if present
      const matchMeta = sqlString.match(/--\s*DILMILTI_SQL_BACKUP_METADATA:\s*({[\s\S]*?})(?=\n|\r|$)/);
      if (matchMeta && matchMeta[1]) {
        try {
          const res = this.importRestoreDatabaseJson(matchMeta[1]);
          if (res.success) {
            this.addAuditLog('RESTORE', 'SISTEM', 'Memulihkan database dari berkas SQL Dump (metadata komentar).');
            return {
              success: true,
              message: `Berhasil memulihkan database dari berkas SQL Dump! ${res.message}`
            };
          }
        } catch {
          // Fallback to raw SQL parser below
        }
      }

      // 3. Parse individual table INSERT statements
      let restoredCount = 0;
      const jsonMatches = sqlString.matchAll(/INSERT\s+INTO\s+`?([a-z0-9_]+)`?[\s\S]*?VALUES\s*\([\s\S]*?,\s*'(\{[\s\S]*?\})'\s*\);/gi);
      const tableDataMap: Record<string, any[]> = {};
      
      for (const match of jsonMatches) {
        const tableName = match[1].toLowerCase();
        if (tableName === 'app_backup_meta') continue;
        const jsonStr = unescapeSqlString(match[2]);
        try {
          const parsedObj = JSON.parse(jsonStr);
          if (!tableDataMap[tableName]) tableDataMap[tableName] = [];
          tableDataMap[tableName].push(parsedObj);
        } catch {
          // ignore single row error
        }
      }

      // Save to localStorage
      if (tableDataMap['slider_banners']) {
        localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(tableDataMap['slider_banners']));
        restoredCount += tableDataMap['slider_banners'].length;
      }
      if (tableDataMap['satker_structure']) {
        localStorage.setItem(STORAGE_KEYS.SATKER_STRUCTURE, JSON.stringify(tableDataMap['satker_structure']));
        restoredCount += tableDataMap['satker_structure'].length;
      }
      if (tableDataMap['personnel']) {
        localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(tableDataMap['personnel']));
        restoredCount += tableDataMap['personnel'].length;
      }
      if (tableDataMap['sipp_cases']) {
        localStorage.setItem(STORAGE_KEYS.SIPP, JSON.stringify(tableDataMap['sipp_cases']));
        restoredCount += tableDataMap['sipp_cases'].length;
      }
      if (tableDataMap['jadwal_sidang']) {
        localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(tableDataMap['jadwal_sidang']));
        restoredCount += tableDataMap['jadwal_sidang'].length;
      }
      if (tableDataMap['news']) {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(tableDataMap['news']));
        restoredCount += tableDataMap['news'].length;
      }
      if (tableDataMap['users']) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(tableDataMap['users']));
        restoredCount += tableDataMap['users'].length;
      }
      if (tableDataMap['dip_ppid']) {
        localStorage.setItem(STORAGE_KEYS.DIP, JSON.stringify(tableDataMap['dip_ppid']));
        restoredCount += tableDataMap['dip_ppid'].length;
      }
      if (tableDataMap['reformasi_eviden']) {
        localStorage.setItem(STORAGE_KEYS.REFORMASI_EVIDEN, JSON.stringify(tableDataMap['reformasi_eviden']));
        restoredCount += tableDataMap['reformasi_eviden'].length;
      }
      if (tableDataMap['related_websites']) {
        localStorage.setItem(STORAGE_KEYS.RELATED_WEBSITES, JSON.stringify(tableDataMap['related_websites']));
        restoredCount += tableDataMap['related_websites'].length;
      }
      if (tableDataMap['jurisdiction_courts']) {
        localStorage.setItem(STORAGE_KEYS.JURISDICTION_COURTS, JSON.stringify(tableDataMap['jurisdiction_courts']));
        restoredCount += tableDataMap['jurisdiction_courts'].length;
      }
      if (tableDataMap['court_identity'] && tableDataMap['court_identity'][0]) {
        localStorage.setItem(STORAGE_KEYS.COURT_IDENTITY, JSON.stringify(tableDataMap['court_identity'][0]));
        restoredCount++;
      }
      if (tableDataMap['ptsp_config'] && tableDataMap['ptsp_config'][0]) {
        localStorage.setItem(STORAGE_KEYS.PTSP_APP_CONFIG, JSON.stringify(tableDataMap['ptsp_config'][0]));
        restoredCount++;
      }
      if (tableDataMap['popup_config'] && tableDataMap['popup_config'][0]) {
        localStorage.setItem(STORAGE_KEYS.POPUP_CONFIG, JSON.stringify(tableDataMap['popup_config'][0]));
        restoredCount++;
      }
      if (tableDataMap['audit_logs']) {
        localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(tableDataMap['audit_logs']));
        restoredCount += tableDataMap['audit_logs'].length;
      }

      if (restoredCount > 0) {
        this.addAuditLog('RESTORE', 'SISTEM', `Memulihkan database dari script SQL Dump (${restoredCount} entitas data diimpor).`);
        this.notify();
        this.syncAllToServer();
        return { success: true, message: `Berhasil memulihkan database dari berkas SQL Dump! ${restoredCount} entitas data berhasil diimpor.` };
      } else {
        return { 
          success: false, 
          message: 'Gagal mengekstrak data dari skrip SQL. Pastikan berkas SQL dibuat melalui sistem ekspor DILMILTI V atau memiliki format statement INSERT yang sesuai.' 
        };
      }
    } catch (err: any) {
      return { success: false, message: `Gagal membaca berkas SQL: ${err?.message || 'Sintaks tidak dikenal'}` };
    }
  }

  public importRestoreDatabaseFile(content: string, fileName: string = ''): { success: boolean; message: string } {
    const isSql = fileName.toLowerCase().endsWith('.sql') || content.trim().startsWith('--') || content.toLowerCase().includes('create table') || content.toLowerCase().includes('insert into');
    if (isSql) {
      return this.importRestoreDatabaseSql(content);
    } else {
      return this.importRestoreDatabaseJson(content);
    }
  }

  public importRestoreDatabaseJson(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Format file JSON tidak valid atau rusak.' };
      }

      let restoredCount = 0;
      if (data.courtIdentity && typeof data.courtIdentity === 'object') {
        localStorage.setItem(STORAGE_KEYS.COURT_IDENTITY, JSON.stringify(data.courtIdentity));
        restoredCount++;
      }
      if (Array.isArray(data.relatedWebsites)) {
        localStorage.setItem(STORAGE_KEYS.RELATED_WEBSITES, JSON.stringify(data.relatedWebsites));
        restoredCount += data.relatedWebsites.length;
      }
      if (Array.isArray(data.jurisdictionCourts)) {
        localStorage.setItem(STORAGE_KEYS.JURISDICTION_COURTS, JSON.stringify(data.jurisdictionCourts));
        restoredCount += data.jurisdictionCourts.length;
      }
      if (Array.isArray(data.satkerStructure)) {
        localStorage.setItem(STORAGE_KEYS.SATKER_STRUCTURE, JSON.stringify(data.satkerStructure));
        restoredCount += data.satkerStructure.length;
      }
      if (Array.isArray(data.personnel)) {
        localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(data.personnel));
        restoredCount += data.personnel.length;
      }
      if (Array.isArray(data.users)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
        restoredCount += data.users.length;
      }
      if (Array.isArray(data.news)) {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(data.news));
        restoredCount += data.news.length;
      }
      if (Array.isArray(data.sipp)) {
        localStorage.setItem(STORAGE_KEYS.SIPP, JSON.stringify(data.sipp));
        restoredCount += data.sipp.length;
      }
      if (Array.isArray(data.jadwal)) {
        localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(data.jadwal));
        restoredCount += data.jadwal.length;
      }
      if (Array.isArray(data.dip)) {
        localStorage.setItem(STORAGE_KEYS.DIP, JSON.stringify(data.dip));
        restoredCount += data.dip.length;
      }
      if (Array.isArray(data.reformasiEviden)) {
        localStorage.setItem(STORAGE_KEYS.REFORMASI_EVIDEN, JSON.stringify(data.reformasiEviden));
        restoredCount += data.reformasiEviden.length;
      }
      if (data.ptspConfig && typeof data.ptspConfig === 'object') {
        localStorage.setItem(STORAGE_KEYS.PTSP_APP_CONFIG, JSON.stringify(data.ptspConfig));
      }
      if (data.popupConfig && typeof data.popupConfig === 'object') {
        localStorage.setItem(STORAGE_KEYS.POPUP_CONFIG, JSON.stringify(data.popupConfig));
      }
      if (data.ecourtContent && typeof data.ecourtContent === 'object') {
        localStorage.setItem(STORAGE_KEYS.ECOURT_CONTENT, JSON.stringify(data.ecourtContent));
      }
      if (Array.isArray(data.audit)) {
        localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(data.audit));
      }

      this.addAuditLog('RESTORE', 'SISTEM', `Memulihkan database dari file cadangan JSON (${restoredCount} item data diimpor).`);
      this.notify();
      return { success: true, message: `Berhasil memulihkan database! ${restoredCount} entitas data berhasil diimpor.` };
    } catch (err: any) {
      return { success: false, message: `Gagal membaca berkas JSON: ${err?.message || 'Format tidak valid'}` };
    }
  }

  public resetToFactoryDefaults() {
    localStorage.setItem(STORAGE_KEYS.COURT_IDENTITY, JSON.stringify(INITIAL_COURT_IDENTITY));
    localStorage.setItem(STORAGE_KEYS.RELATED_WEBSITES, JSON.stringify(INITIAL_RELATED_WEBSITES));
    localStorage.setItem(STORAGE_KEYS.JURISDICTION_COURTS, JSON.stringify(INITIAL_JURISDICTION_COURTS));
    localStorage.setItem(STORAGE_KEYS.SATKER_STRUCTURE, JSON.stringify(INITIAL_SATKER_STRUCTURE));
    localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(OFFICIAL_PERSONNEL_INITIAL));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USER_ACCOUNTS));
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(SAMPLE_NEWS_ITEMS));
    localStorage.setItem(STORAGE_KEYS.SIPP, JSON.stringify(INITIAL_PERKARA_SIPP));
    localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(INITIAL_JADWAL_SIDANG));
    localStorage.setItem(STORAGE_KEYS.DIP, JSON.stringify(SAMPLE_DIP_ITEMS));
    localStorage.setItem(STORAGE_KEYS.REFORMASI_EVIDEN, JSON.stringify(INITIAL_REFORMASI_EVIDEN));
    localStorage.setItem(STORAGE_KEYS.POPUP_CONFIG, JSON.stringify(DEFAULT_POPUP_CONFIG));
    localStorage.setItem(STORAGE_KEYS.ECOURT_CONTENT, JSON.stringify(DEFAULT_ECOURT_CONTENT));
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(INITIAL_SLIDES));
    localStorage.setItem(STORAGE_KEYS.MENU_CONTENTS, JSON.stringify(DEFAULT_MENU_CONTENTS));
    localStorage.setItem(STORAGE_KEYS.INOVASI_QUICK_ACCESS, JSON.stringify(INITIAL_INOVASI_QUICK_ACCESS));
    this.addAuditLog('RESTORE', 'SISTEM', 'Memulihkan basis data ke kondisi awal pabrik / dokumen resmi.');
    this.notify();
  }

  // ====================================================================
  // CRUD QUICK ACCESS KHUSUS APLIKASI INOVASI (PTSP ONLINE, CUTI ONLINE, WA, DLL)
  // ====================================================================
  public getInovasiQuickAccess(): InovasiQuickAccessItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INOVASI_QUICK_ACCESS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.INOVASI_QUICK_ACCESS, JSON.stringify(INITIAL_INOVASI_QUICK_ACCESS));
        return [...INITIAL_INOVASI_QUICK_ACCESS];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...parsed].sort((a, b) => (a.urutan || 99) - (b.urutan || 99));
      }
      return [...INITIAL_INOVASI_QUICK_ACCESS];
    } catch {
      return [...INITIAL_INOVASI_QUICK_ACCESS];
    }
  }

  public saveInovasiQuickAccess(list: InovasiQuickAccessItem[]): void {
    const sorted = [...list].sort((a, b) => (a.urutan || 99) - (b.urutan || 99));
    localStorage.setItem(STORAGE_KEYS.INOVASI_QUICK_ACCESS, JSON.stringify(sorted));
    this.notify();
  }

  public addInovasiQuickAccess(item: Omit<InovasiQuickAccessItem, 'id'>): InovasiQuickAccessItem {
    const current = this.getInovasiQuickAccess();
    const newItem: InovasiQuickAccessItem = {
      ...item,
      id: `inovasi-qa-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    const updated = [...current, newItem];
    this.saveInovasiQuickAccess(updated);
    this.addAuditLog('CREATE', 'SISTEM', `Menambahkan Inovasi Layanan Publik: ${newItem.namaAplikasi}`);
    return newItem;
  }

  public updateInovasiQuickAccess(id: string, partial: Partial<InovasiQuickAccessItem>): boolean {
    const current = this.getInovasiQuickAccess();
    const idx = current.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    current[idx] = {
      ...current[idx],
      ...partial,
      id,
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    this.saveInovasiQuickAccess(current);
    this.addAuditLog('UPDATE', 'SISTEM', `Memperbarui Inovasi Layanan Publik: ${current[idx].namaAplikasi}`);
    return true;
  }

  public deleteInovasiQuickAccess(id: string): boolean {
    const current = this.getInovasiQuickAccess();
    const target = current.find((item) => item.id === id);
    const filtered = current.filter((item) => item.id !== id);
    if (filtered.length === current.length) return false;
    localStorage.setItem(STORAGE_KEYS.INOVASI_QUICK_ACCESS, JSON.stringify(filtered));
    this.addAuditLog('DELETE', 'SISTEM', `Menghapus Inovasi Layanan Publik: ${target?.namaAplikasi || id}`);
    this.notify();
    return true;
  }

  public resetInovasiQuickAccess(): InovasiQuickAccessItem[] {
    localStorage.setItem(STORAGE_KEYS.INOVASI_QUICK_ACCESS, JSON.stringify(INITIAL_INOVASI_QUICK_ACCESS));
    this.addAuditLog('RESTORE', 'SISTEM', 'Mereset daftar Inovasi Layanan Publik ke bawaan.');
    this.notify();
    return [...INITIAL_INOVASI_QUICK_ACCESS];
  }
  // ====================================================================
  // CRUD QUICK ACCESS UTAMA WEBSITE (10 IKON STANDAR SK 593/2026 + PTSP)
  // ====================================================================
  public getQuickAccessList(): QuickAccessItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUICK_ACCESS_MAIN);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.QUICK_ACCESS_MAIN, JSON.stringify(INITIAL_QUICK_ACCESS_ITEMS));
        return [...INITIAL_QUICK_ACCESS_ITEMS];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out any ecourt item and ensure UU 31/1997 is present
        const cleaned = parsed.filter((item: QuickAccessItem) => 
          item.id !== 'btn-quick-ecourt' && 
          item.section !== 'ecourt' && 
          !item.label?.toLowerCase().includes('ecourt') &&
          !item.externalUrl?.toLowerCase().includes('ecourt')
        );
        const hasUU31 = cleaned.some((item: QuickAccessItem) => item.id === 'btn-quick-uu31' || item.label?.includes('31/1997'));
        if (!hasUU31) {
          const uu31Item = INITIAL_QUICK_ACCESS_ITEMS.find(i => i.id === 'btn-quick-uu31');
          if (uu31Item) cleaned.push(uu31Item);
        }
        return [...cleaned].sort((a, b) => (a.urutan || 99) - (b.urutan || 99));
      }
      return [...INITIAL_QUICK_ACCESS_ITEMS];
    } catch {
      return [...INITIAL_QUICK_ACCESS_ITEMS];
    }
  }

  public saveQuickAccessList(list: QuickAccessItem[]): void {
    const sorted = [...list].sort((a, b) => (a.urutan || 99) - (b.urutan || 99));
    localStorage.setItem(STORAGE_KEYS.QUICK_ACCESS_MAIN, JSON.stringify(sorted));
    this.notify();
  }

  public addQuickAccessItem(item: Omit<QuickAccessItem, 'id'>): QuickAccessItem {
    const current = this.getQuickAccessList();
    const newItem: QuickAccessItem = {
      ...item,
      id: `quick-item-${Date.now()}`,
      urutan: item.urutan || current.length + 1,
      isCustomCreated: true,
      status: item.status || 'Aktif'
    };
    const updated = [...current, newItem];
    this.saveQuickAccessList(updated);
    this.addAuditLog('CREATE', 'SISTEM', `Menambahkan Quick Access Layanan: ${newItem.label}`);
    return newItem;
  }

  public updateQuickAccessItem(id: string, partial: Partial<QuickAccessItem>): boolean {
    const current = this.getQuickAccessList();
    const idx = current.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    current[idx] = {
      ...current[idx],
      ...partial,
      id
    };
    this.saveQuickAccessList(current);
    this.addAuditLog('UPDATE', 'SISTEM', `Memperbarui Quick Access Layanan: ${current[idx].label}`);
    return true;
  }

  public deleteQuickAccessItem(id: string): boolean {
    const current = this.getQuickAccessList();
    const target = current.find((item) => item.id === id);
    const filtered = current.filter((item) => item.id !== id);
    if (filtered.length === current.length) return false;
    this.saveQuickAccessList(filtered);
    this.addAuditLog('DELETE', 'SISTEM', `Menghapus Quick Access Layanan: ${target?.label || id}`);
    return true;
  }

  public resetQuickAccessList(): QuickAccessItem[] {
    localStorage.setItem(STORAGE_KEYS.QUICK_ACCESS_MAIN, JSON.stringify(INITIAL_QUICK_ACCESS_ITEMS));
    this.addAuditLog('RESTORE', 'SISTEM', 'Mereset daftar Quick Access Layanan Utama ke bawaan.');
    this.notify();
    return [...INITIAL_QUICK_ACCESS_ITEMS];
  }
}

export const CourtDB = new CourtDatabaseEngine();
