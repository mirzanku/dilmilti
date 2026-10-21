export type NavSection =
  | 'beranda'
  | 'tentang'
  | 'layanan-publik'
  | 'publik'
  | 'layanan-hukum'
  | 'hukum'
  | 'informasi-publik'
  | 'berita'
  | 'reformasi-birokrasi'
  | 'reformasi'
  | 'dokumen-laporan'
  | 'dokumen'
  | 'hubungi-kami'
  | 'kontak'
  | 'sipp'
  | 'ecourt'
  | 'jadwal-sidang'
  | 'jadwal'
  | 'ppid'
  | 'notifikasi-wa'
  | 'whatsapp'
  | 'ptsp-inovasi'
  | 'ptsp-online'
  | 'ptsp'
  | 'survey'
  | 'zi'
  | 'inovasi'
  | 'standar-pelayanan'
  | 'template-dokumen'
  | 'panduan-hukum'
  | 'admin-portal'
  | 'auth';

export type UserRole = 
  | 'super_admin'
  | 'admin_kepaniteraan'
  | 'admin_kesekretariatan'
  | 'editor_humas'
  | 'petugas_ptsp'
  | 'user_tamu';

export interface UserAccount {
  id: string;
  nama: string;
  email: string;
  password?: string;
  role: UserRole;
  nipNrp?: string;
  instansi: string;
  nomorWA: string;
  status: 'aktif' | 'nonaktif';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface PersonnelItem {
  id: string;
  no: number;
  nama: string;
  nipNrp: string;
  pangkatGol: string;
  jabatan: string;
  kategori: 'Pimpinan' | 'Hakim Militer Tinggi' | 'Kepaniteraan' | 'Kesekretariatan';
  isMutasiMasuk: boolean;
  matra?: 'TNI AD' | 'TNI AL' | 'TNI AU' | 'ASN MA-RI';
  pendidikan?: string;
  riwayatSingkat?: string;
  fotoUrl?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'REGISTER' | 'BACKUP' | 'RESTORE' | 'SYNC';
  module: 'PERSONEL' | 'BERITA' | 'SIPP' | 'JADWAL_SIDANG' | 'PPID' | 'USERS' | 'SISTEM' | 'REFORMASI' | 'SLIDER' | 'MONEV' | 'ROLE_MODEL' | 'KOMPENSASI' | 'SIDANG_LUAR' | 'SURVEI' | 'BROSUR';
  details: string;
}

export interface PerkaraSIPP {
  id: string;
  nomorPerkara: string;
  nomorRegisterOditurat: string;
  jenisPerkara: string;
  klasifikasi: 'Pelanggaran Disiplin/Desersi' | 'Tindak Pidana Khusus Militer' | 'Tindak Pidana Umum' | 'Sengketa Kepegawaian TNI/TUN';
  tingkatPerkara: 'Banding' | 'Tingkat Pertama';
  tanggalDaftar: string;
  statusPerkara: 'Pemeriksaan' | 'Tuntutan Oditur' | 'Pledoi' | 'Putusan Diucapkan' | 'Minutasi' | 'BHT (Inkracht)' | 'Pengiriman Berkas Kasasi';
  terdakwa: {
    nama: string;
    pangkat: string;
    korps: string;
    nrp: string;
    kesatuan: string;
    matra: 'TNI AD' | 'TNI AL' | 'TNI AU' | 'Mabes TNI';
  };
  oditurMiliter: string;
  majelisHakim: {
    ketua: string;
    anggota1: string;
    anggota2: string;
  };
  paniteraPengganti: string;
  jadwalSidangBerikutnya?: {
    tanggal: string;
    jam: string;
    ruang: string;
    agenda: string;
  };
  amarPutusan?: string;
  tanggalPutusan?: string;
  petikanUrl?: string;
  tahapanPerkara: Array<{
    tanggal: string;
    agenda: string;
    keterangan: string;
    selesai: boolean;
  }>;
}

export interface JadwalSidangItem {
  id: string;
  nomorPerkara: string;
  terdakwa: string;
  kesatuan: string;
  tanggal: string;
  waktu: string;
  ruangSidang: string;
  agenda: string;
  majelisHakim: string;
  oditur: string;
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai' | 'Ditunda';
}

export interface WANotificationSubscriber {
  id: string;
  nomorPerkara: string;
  namaLengkap: string;
  nomorWA: string;
  peran: 'Penasihat Hukum' | 'Oditur Militer' | 'Ankum / Perwira Kesatuan' | 'Keluarga Terdakwa' | 'Saksi / Masyarakat';
  tanggalDaftar: string;
  terakhirTerkirim?: string;
  statusAktif: boolean;
}

export interface WAMessageLog {
  id: string;
  nomorWA: string;
  nomorPerkara: string;
  waktu: string;
  pesan: string;
  status: 'Terkirim' | 'Gagal' | 'Pending';
  kategori: 'Reminder H-1' | 'Update Status Persidangan' | 'Pemberitahuan Putusan' | 'Panggilan Sidang';
}

export interface DIPItem {
  id: string;
  no: number;
  namaInformasi: string;
  ringkasan: string;
  unitKerja: string;
  penanggungJawab: string;
  waktuTempat: string;
  bentukTersedia: 'Elektronik (PDF)' | 'Cetak Hardcopy';
  retensiAktif: string;
  retensiInaktif: string;
  kategori: 'Berkala' | 'Serta Merta' | 'Setiap Saat';
  ukuranFile: string;
  downloadUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface SakipDipaDocumentItem {
  id: string;
  judul: string;
  kategori: 'SAKIP' | 'DIPA' | 'LHKPN' | 'PPID' | 'STANDAR_PELAYANAN' | 'MAKLUMAT' | 'SK_SOP' | 'E_BROSUR' | 'LAPORAN_PERKARA' | 'LAPORAN_SURVEI' | 'LAPORAN_POSBAKUM' | 'LAPORAN_EVIDEN_ZI';
  subKategori?: string; // e.g. 'Renstra', 'LKjIP', 'IKU', 'RKT', 'PK', 'DIPA 01', 'DIPA 05', 'LRA', 'CALK', 'LHKPN', 'Perkara Bulanan', 'IKM/IPAK'
  tahun: string;
  nomorDokumen?: string;
  deskripsi: string;
  fileUrl: string; // Base64 Data URL or HTTP Link
  fileName: string;
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'JPG' | 'PNG';
  nilaiAnggaran?: string; // for DIPA e.g. 'Rp 4,8 M'
  persentaseKepatuhan?: string; // for LHKPN e.g. '100%'
  tanggalUpload: string;
  penanggungJawab: string;
}

export interface PermohonanInformasi {
  ticketId: string;
  tanggalPengajuan: string;
  namaPemohon: string;
  nomorKTP: string;
  nomorWA: string;
  email: string;
  instansi: string;
  rincianInformasi: string;
  tujuanPenggunaan: string;
  caraPerolehan: 'Salinan Elektronik (Cuma-cuma / Gratis)' | 'Salinan Cetak (Dikenakan Biaya Penggandaan)';
  status: 'Diajukan' | 'Verifikasi Dokumen' | 'Disetujui' | 'Tersedia Diunduh' | 'Ditolak';
  tanggapanPetugas?: string;
  dokumenBalasanUrl?: string;
}

export interface ECourtCaseTypeItem {
  id: string;
  tingkat: string;
  nama: string;
  deskripsi: string;
}

export interface CustomNavMenuItem {
  id: string;
  type: 'menu_utama' | 'sub_menu';
  title: string;
  category: 'tentang' | 'layanan' | 'hukum' | 'informasi' | 'beranda' | 'lainnya';
  parentMenuId?: string; // ID parent menu jika bertipe sub_menu
  targetSection: string; // e.g. 'publik', 'hukum', 'tentang', 'reformasi', 'jadwal'
  targetSubTab?: string; // e.g. 'visimisi', 'profil', 'ptsp', 'ebrosur'
  externalUrl?: string; // e.g. 'https://ecourt.mahkamahagung.go.id'
  deskripsi: string;
  iconName?: string; // 'Building2', 'Users', 'Scale', 'FileText', 'Shield', 'Link', 'Sparkles'
  orderNumber: number;
  isActive: boolean;
  isCustomCreated?: boolean;
}

export interface ECourtDocRequirementItem {
  id: string;
  urutan: number;
  nama: string;
  deskripsi: string;
  format: string;
}

export interface ECourtProcedureStepItem {
  id: string;
  stepNumber: number;
  judul: string;
  deskripsi: string;
  urlLink?: string;
}

export interface ECourtLegalBasisItem {
  id: string;
  nomorRegulasi: string;
  tentang: string;
}

export interface ECourtPrincipleItem {
  id: string;
  judul: string;
  deskripsi: string;
}

export interface ECourtPaymentRuleItem {
  id: string;
  kategori: string;
  judul: string;
  deskripsi: string;
}

export interface ECourtPartnerBankItem {
  id: string;
  namaBank: string;
  layananVa: string;
}

export interface ECourtLitigationStepItem {
  id: string;
  tahap: string;
  judul: string;
  deskripsi: string;
}

export interface ECourtPageContent {
  header: {
    badge: string;
    dasarHukum: string;
    instansi: string;
    judul: string;
    deskripsi: string;
    portalUrl: string;
    portalButtonText: string;
    panduanUrl: string;
    panduanButtonText: string;
    pemberitahuanResmi: string;
    badgeTerpusat: string;
  };
  overview: {
    judul: string;
    subjudul: string;
    penjelasanUmum: string;
    dasarHukumList: ECourtLegalBasisItem[];
    prinsipList: ECourtPrincipleItem[];
  };
  efiling: {
    judul: string;
    subjudul: string;
    urlDaftarPortal: string;
    daftarJenisPerkara: ECourtCaseTypeItem[];
    daftarDokumen: ECourtDocRequirementItem[];
    alurLangkah: ECourtProcedureStepItem[];
  };
  epayment: {
    judul: string;
    subjudul: string;
    ketentuanBiaya: ECourtPaymentRuleItem[];
    daftarBank: ECourtPartnerBankItem[];
    catatanOtomatisasi: string;
  };
  esummons: {
    judul: string;
    subjudul: string;
    poinPanggilan: { id: string; judul: string; deskripsi: string }[];
    ketentuanPanggilan: string;
  };
  elitigation: {
    judul: string;
    subjudul: string;
    tahapanPersidangan: ECourtLitigationStepItem[];
    ruangSidangVirtual: {
      judul: string;
      deskripsi: string;
      fasilitas: string[];
      catatanTeleconference: string;
    };
  };
  bantuan: {
    judul: string;
    subjudul: string;
    urlBukuPanduan: string;
    kategoriAkun: { id: string; judul: string; deskripsi: string }[];
    mejaEcourt: {
      lokasi: string;
      alamat: string;
      jamLayananSeninKamis: string;
      jamLayananJumat: string;
      noWhatsapp: string;
      namaHelpdesk: string;
    };
  };
  updatedAt: string;
}

export interface ECourtFiling {
  nomorPendaftaran: string;
  jenisPermohonan: 'Banding Pidana Militer' | 'Sengketa Tata Usaha Militer (TUN)' | 'Permohonan Grasi/PK Militer';
  namaPemohon: string;
  kesatuanPemohon: string;
  kuasaHukum?: string;
  nomorSuratKuasa?: string;
  tanggalPengajuan: string;
  nomorPerkaraTingkatPertama?: string;
  pengadilanAsal?: string;
  status: 'Draft' | 'Menunggu Verifikasi Meja 1' | 'SKUM Diterbitkan' | 'Menunggu Pembayaran e-Payment' | 'Nomor Perkara Register Diterbitkan';
  panjarBiaya: number;
  virtualAccount: string;
  dokumenTerunggah: string[];
}

export interface SatkerStructureItem {
  id: string;
  kelompok: 'Kepaniteraan' | 'Kesekretariatan' | 'Pimpinan';
  jabatan: string;
  namaPejabat: string;
  pangkatNip?: string;
  tugasFungsi?: string;
  no: number;
}

export interface NewsCommentItem {
  id: string;
  authorName: string;
  authorRole?: string;
  content: string;
  createdAt: string;
}

export interface NewsItem {
  id: string | number;
  judul: string;
  tanggal: string;
  kategori: string;
  ringkasan: string;
  isi?: string;
  penulis: string;
  views?: string;
  isFeatured?: boolean;
  gambarUrl?: string;
  comments?: NewsCommentItem[];
  // Kepatuhan SK Sekma No. 14106/SEK/SK.HM1.1/X/2026
  leadBerita?: string;
  ekorBerita?: string;
  editorPenyunting?: string;
  isAiGenerated?: boolean;
  aiWatermarkText?: string;
  referensiHukum?: string[];
  riwayatKoreksi?: Array<{
    tanggal: string;
    keterangan: string;
    perbaikan: string;
    perbandinganSebelum?: string;
    perbandinganSesudah?: string;
  }>;
  siaranPersPdfUrl?: string;
}

export interface PTSPQueueItem {
  id: string;
  nomorAntrean: string;
  mejaLoket: 'Meja 1 (Pidana)' | 'Meja 2 (TUN)' | 'Meja 3 (Hukum & PPID)' | 'Meja 4 (Umum & Surat)' | 'Loket Posbakum' | 'Loket Disabilitas';
  namaPemohon: string;
  instansiKesatuan: string;
  nomorWA: string;
  keperluan: string;
  waktuDaftar: string;
  estimasiPanggil: string;
  status: 'Menunggu' | 'Dipanggil' | 'Melayani' | 'Selesai' | 'Batal';
  petugasMelayani?: string;
}

export interface PTSPServiceTicket {
  ticketId: string;
  jenisLayanan: 'Izin Besuk Tahanan Militer' | 'Legalisasi Salinan Putusan' | 'Surat Ket. Tidak Dicabut Hak Pilih' | 'Salinan Amar Putusan / Risalah' | 'Permohonan Informasi PPID' | 'Konsultasi Posbakum Gratis' | 'Inovasi Custom PTSP';
  namaPemohon: string;
  instansiKesatuan: string;
  nomorIdentitas: string;
  nomorWA: string;
  emailPemohon: string;
  nomorPerkaraTerkait?: string;
  berkasSyaratUrl?: string;
  catatanKeperluan: string;
  tanggalPengajuan: string;
  status: 'Diajukan' | 'Verifikasi Dokumen' | 'Proses Petugas' | 'Selesai (Siap Ambil/Unduh)' | 'Ditolak';
  catatanPetugas?: string;
  linkUnduhHasil?: string;
}

export interface PTSPInnovationAppConfig {
  appName: string;
  appDescription: string;
  externalUrl: string;
  isExternalEmbedActive: boolean;
  lastUpdated: string;
}

export interface RelatedWebsiteItem {
  id: string;
  name: string;
  url: string;
  role: string;
  category?: 'Mahkamah Agung' | 'Ditjen Badilmiltun' | 'Pengawasan' | 'Layanan Publik' | 'Lainnya';
}

export interface CourtIdentityData {
  name: string;
  parent: string;
  subParent: string;
  skStandardisasi: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  jamOperasional: string;
  yurisdiksi: string;
  logoUrl?: string;
  bannerUrl?: string;
  slogan?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentGold?: string;
  ikmSkor?: number;
  ikmPredikat?: string;
  ikmResponden?: number;
  ipakSkor?: number;
  ipakPredikat?: string;
  ipakResponden?: number;
  surveiIkmUrl?: string;
  surveiIpakUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  // Sambutan Pimpinan
  sambutanNama?: string;
  sambutanJabatan?: string;
  sambutanPangkatNrp?: string;
  sambutanQuote?: string;
  sambutanParagraph1?: string;
  sambutanParagraph2?: string;
  // Visi & Misi
  visiText?: string;
  misi1Title?: string;
  misi1Desc?: string;
  misi2Title?: string;
  misi2Desc?: string;
  misi3Title?: string;
  misi3Desc?: string;
  misi4Title?: string;
  misi4Desc?: string;
  // Sejarah
  sejarahIntro?: string;
  sejarahParagraph?: string;
  // Dynamic sync fields from Menu Contents
  namaKadilmil?: string;
  pangkatKadilmil?: string;
  nrpKadilmil?: string;
  fotoKadilmil?: string;
  sambutanKadilmil?: string;
  visi?: string;
  misi?: string[];
  sejarahSingkat?: string;
  denahLantai1Url?: string;
  denahLantai2Url?: string;
  baganStrukturUrl?: string;
  googleMapsEmbedUrl?: string;
  jamLayananUmum?: string;
  jamLayananJumat?: string;
  hotlinePTSP?: string;
  profIkmSkor?: string;
  profIpakSkor?: string;
  profSurveiUrl?: string;
  sistemPengelolaan?: string;
  standarISO?: string;
  maklumatPelayanan?: string;
}

export interface JurisdictionCourtItem {
  code: string;
  name: string;
  wilayah: string;
  address: string;
  phone: string;
}

export interface ReformasiEvidenItem {
  id: string;
  areaId: number; // 0: LKE / Umum, 1: Area I, 2: Area II, 3: Area III, 4: Area IV, 5: Area V, 6: Area VI
  areaName: string;
  judulDokumen: string;
  nomorSurat: string;
  tahun: string;
  tanggalUpload: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: 'PDF' | 'XLSX' | 'DOCX' | 'ZIP' | 'IMAGE';
  keterangan: string;
  statusVerifikasi: 'Terverifikasi' | 'Dalam Proses' | 'Revisi';
  diuploadOleh: string;
}

export interface WhatsAppFoonteConfig {
  isActive: boolean;
  foonteApiToken: string;
  senderNumber: string;
  deviceStatus: 'Terhubung' | 'Terputus' | 'Dalam Pengujian';
  autoNotifSidangH1: boolean;
  autoNotifStatusPerkara: boolean;
  autoNotifAmarPutusan: boolean;
  autoNotifPermohonanPpid: boolean;
  autoNotifPengaduanSiwas: boolean;
  customHeaderTemplate: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface PopupAnnouncementConfig {
  id: string;
  isActive: boolean;
  badge: string;
  title: string;
  subtitle: string;
  content: string;
  bulletPoints?: string[];
  imageUrl?: string;
  buttonText: string;
  buttonLinkTab?: string;
  externalLink?: string;
  showOnlyOncePerSession: boolean;
  priority: 'Tinggi' | 'Normal' | 'Penting';
  updatedAt: string;
  updatedBy?: string;
}

export interface MakassarSlide {
  id: string;
  badge: string;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  actionText: string;
  targetSection: string; // NavSection value
  makassarHighlight: string;
  iconType: 'pinisi' | 'losari' | 'ptsp' | 'perma';
  bgImage: string;
}

// ====================================================================
// SK DIREKTUR JENDERAL BADILMILTUN NO 593/DJMT/SK.TI2.1.1/VII/2026
// ====================================================================

export interface WebsiteMonevReportItem {
  id: string;
  periode: 'Triwulan I' | 'Triwulan II' | 'Triwulan III' | 'Triwulan IV';
  tahun: string;
  satker: string;
  tanggalLaporan: string;
  ketuaSatker: string;
  pembuatLaporan: string;
  jabatanPembuat: string;
  pendahuluanUmum: string;
  pendahuluanDasar: string;
  pendahuluanTujuan: string;
  pendahuluanRuangLingkup: string;
  kegiatanLaksana: string;
  temuanMonev: string;
  tindakLanjut: string;
  hasilDiCapai: string;
  penutup: string;
  status: 'Draft' | 'Final / Terkirim';
}

export interface RoleModelAndAgentItem {
  id: string;
  tipe: 'Role Model' | 'Agen Perubahan';
  nama: string;
  jabatan: string;
  pangkatNip: string;
  komitmenKerja: string;
  kontribusiReformasi: string;
  rencanaProgramKerja: string;
  fotoUrl: string;
}

export interface PublicCompensationInfo {
  skNomor: string;
  skTanggal: string;
  deskripsiAturan: string;
  waktuKeterlambatanStandar: string;
  bentukKompensasi: string;
}

export interface SidangLuarGedungInfo {
  skNomor: string;
  deskripsi: string;
  persyaratan: string[];
  lokasiPelaksanaan: string[];
  jadwalRencana: string;
}

export interface SurveiReportItem {
  id: string;
  jenisSurvei: 'IKM' | 'IPAK';
  periode: string;
  tahun: string;
  nilaiSkor: number;
  jumlahResponden: number;
  linkPengisian: string;
  fileReportUrl: string;
  fileTindakLanjutUrl: string;
}

export interface BrosurDigitalItem {
  id: string;
  judulBrosur: string;
  kategori: string;
  deskripsi: string;
  filePdfUrl: string;
  coverImageUrl: string;
}

export interface MenuContentItem {
  id: string; // 'm1'..'m9', 'lp1'..'lp8', 'lh1'..'lh6', or custom ID e.g. 'custom-menu-17823'
  kategori: 'tentang' | 'layanan' | 'hukum' | 'informasi' | 'beranda' | 'lainnya';
  type?: 'menu_utama' | 'sub_menu';
  parentMenuId?: string;
  targetSection?: string; // e.g. 'tentang', 'publik', 'hukum', 'reformasi', 'jadwal', 'perkara'
  targetSubTab?: string; // e.g. 'sambutan', 'visimisi', 'ptsp', 'ebrosur'
  nomorUrut: number;
  judul: string;
  subJudul: string;
  dasarHukum: string;
  skNomor?: string;
  kontenUtama: string;
  poinPoin: string[];
  linkDokumen?: string;
  linkEksternal?: string;
  petugasPenanggungJawab?: string;
  tanggalUpdate: string;
  status: 'Aktif' | 'Draft';
  badge: string;
  iconName?: string;
  customFields?: Record<string, string>;
  isCustomCreated?: boolean;
}

export interface DocumentTemplateItem {
  id: string;
  kodeDoc: string;
  judul: string;
  kategori: 'PPID & Informasi' | 'Pengaduan & SIWAS' | 'Posbakum & Prodeo' | 'SAKIP & Laporan' | 'Persidangan & Perkara' | 'Umum & Izin' | string;
  deskripsi: string;
  format: 'DOCX' | 'PDF' | 'Form Fillable' | string;
  fileUrl: string;
  ukuranFile: string;
  jumlahDiunduh: number;
  teksTemplate?: string;
  tanggalUpdate: string;
}

export interface InovasiQuickAccessItem {
  id: string;
  namaAplikasi: string;
  namaLengkap: string;
  deskripsi: string;
  badge: string;
  kategori: string;
  urlTujuan: string;
  domainLabel: string;
  instansi: string;
  internalSection?: NavSection;
  internalSubTab?: string;
  bukaTabBaru: boolean;
  iconName:
    | 'DoorOpen'
    | 'CalendarCheck'
    | 'MessageSquareCode'
    | 'Laptop'
    | 'FileText'
    | 'ShieldCheck'
    | 'Sparkles'
    | 'Globe';
  status: 'Aktif' | 'Maintenance';
  urutan: number;
  updatedAt?: string;
}

export interface QuickAccessItem {
  id: string;
  label: string;
  fullName: string;
  desc: string;
  color: string;
  borderColor: string;
  iconName: string;
  militaryIconName: string;
  badge: string;
  section: NavSection;
  subTab?: string;
  externalUrl: string;
  domain: string;
  instansi: string;
  isCustomCreated?: boolean;
  urutan?: number;
  status?: 'Aktif' | 'Nonaktif';
}


