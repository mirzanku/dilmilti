import React, { useState, useEffect } from 'react';
import { 
  Info, 
  FileText, 
  Search, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  FileCheck, 
  HelpCircle,
  Building2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Briefcase,
  Wallet,
  Award,
  Compass,
  ShoppingBag,
  UserCheck,
  Scale,
  BarChart3,
  Layers,
  BookOpen
} from 'lucide-react';
import { PermohonanInformasi, DIPItem, SakipDipaDocumentItem } from '../types';
import { CourtDB } from '../data/courtDatabase';
import { OFFICIAL_PORTAL_URLS } from '../data/officialPortalUrls';
import { syncRouteToUrl } from '../utils/urlRouter';

interface PpidSectionProps {
  onNavigateToPTSP?: (serviceType?: string) => void;
  onNavigate?: (section: any, subTab?: string) => void;
  initialSubTab?: string;
}

export default function PpidSection({ onNavigateToPTSP, onNavigate, initialSubTab }: PpidSectionProps = {}) {
  const [activeTab, setActiveTab] = useState<'berkala' | 'setiap-saat' | 'dip' | 'permohonan' | 'tracking' | 'keberatan' | 'dikecualikan' | 'lhkpn' | 'laporan-ppid'>('berkala');
  const [activeBerkalaSub, setActiveBerkalaSub] = useState<string>('profil-pengadilan');
  const [activeSetiapSaatSub, setActiveSetiapSaatSub] = useState<string>('dip');
  const [dipFilter, setDipFilter] = useState<'Semua' | 'Berkala' | 'Serta Merta' | 'Setiap Saat'>('Semua');
  const [dipSearch, setDipSearch] = useState('');
  const [dipList, setDipList] = useState<DIPItem[]>(() => CourtDB.getDIP());

  useEffect(() => {
    setDipList(CourtDB.getDIP());
    const handleUpdate = () => {
      setDipList(CourtDB.getDIP());
    };
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (!initialSubTab) return;
    const berkalaKeys = ['profil-pengadilan', 'program-kerja', 'keuangan', 'lakip', 'renstra', 'pengadaan'];
    const setiapSaatKeys = ['dip', 'putusan', 'statistik', 'sop', 'standar-pelayanan'];

    if (initialSubTab === 'berkala') {
      setActiveTab('berkala');
    } else if (initialSubTab === 'lhkpn' || initialSubTab === 'lhkan') {
      setActiveTab('lhkpn');
    } else if (berkalaKeys.includes(initialSubTab)) {
      setActiveTab('berkala');
      setActiveBerkalaSub(initialSubTab);
    } else if (initialSubTab === 'setiap-saat') {
      setActiveTab('setiap-saat');
    } else if (setiapSaatKeys.includes(initialSubTab)) {
      if (initialSubTab === 'dip') {
        setActiveTab('dip');
      } else {
        setActiveTab('setiap-saat');
        setActiveSetiapSaatSub(initialSubTab);
      }
    } else if (initialSubTab === 'prosedur-permohonan' || initialSubTab === 'permohonan') {
      setActiveTab('permohonan');
    } else if (['tracking', 'keberatan', 'dikecualikan', 'laporan-ppid'].includes(initialSubTab)) {
      setActiveTab(initialSubTab as any);
    } else if (initialSubTab === 'serta-merta') {
      setActiveTab('dip');
      setDipFilter('Serta Merta');
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (activeTab === 'berkala' && activeBerkalaSub && activeBerkalaSub !== 'profil-pengadilan') {
      syncRouteToUrl('ppid', activeBerkalaSub, true);
    } else if (activeTab) {
      syncRouteToUrl('ppid', activeTab, true);
    }
  }, [activeTab, activeBerkalaSub]);

  const berkalaItems = [
    {
      id: 'profil-pengadilan',
      label: 'Profil Pengadilan',
      icon: Building2,
      regulasi: 'SK KMA 2-144/2022 Lampiran I A.1',
      desc: 'Informasi kedudukan, domisili, alamat lengkap, struktur organisasi, wilayah hukum yurisdiksi Kawasan Timur Indonesia, serta profil pimpinan dan hakim militer tinggi.',
      highlights: [
        'Kedudukan & Wilayah Hukum Yurisdiksi Kawasan Timur Indonesia (Sulawesi, Maluku, Papua)',
        'Struktur Organisasi Pengadilan Militer Tinggi V Makassar sesuai Perma No. 7 Tahun 2015',
        'Profil Pimpinan, Hakim Militer Tinggi, Panitera, dan Sekretaris'
      ],
      actionLabel: 'Buka Profil Lengkap Pengadilan',
      onAction: () => onNavigate && onNavigate('tentang', 'sambutan')
    },
    {
      id: 'program-kerja',
      label: 'Program Kerja',
      icon: Briefcase,
      regulasi: 'SK KMA 2-144/2022 Lampiran I A.2',
      desc: 'Rencana Kerja Tahunan (RKT), Program Kerja Kepaniteraan dan Kesekretariatan, kalender kegiatan tahun berjalan, serta target kinerja tahun anggaran 2026.',
      highlights: [
        'Rencana Kerja Tahunan (RKT) Tahun Anggaran 2026 & Perjanjian Kinerja (PK)',
        'Program Kerja Prioritas Penyelesaian Perkara Pidana Militer Banding & Koneksitas',
        'Target Pembangunan Zona Integritas Menuju WBBM & Pelaksanaan Sidang Keliling'
      ],
      actionLabel: 'Lihat Dokumen RKT & Program Kerja',
      onAction: () => onNavigate && onNavigate('dokumen', 'rkt')
    },
    {
      id: 'keuangan',
      label: 'Keuangan',
      icon: Wallet,
      regulasi: 'SK KMA 2-144/2022 Lampiran I A.3',
      desc: 'Ringkasan DIPA BUA (01) & Badilmiltun (05), Laporan Realisasi Anggaran (LRA), Neraca, Catatan atas Laporan Keuangan (CaLK), dan Pengelolaan PNBP.',
      highlights: [
        'DIPA 01 (Badan Urusan Administrasi) & DIPA 05 (Ditjen Badilmiltun) TA 2026',
        'Laporan Realisasi Anggaran (LRA) Triwulanan dan Semesteran secara transparan',
        'Rekapitulasi Penerimaan Negara Bukan Pajak (PNBP) Kepaniteraan dan Keuangan Perkara'
      ],
      actionLabel: 'Lihat Dokumen Realisasi Anggaran',
      onAction: () => onNavigate && onNavigate('dokumen', 'realisasi-anggaran')
    },
    {
      id: 'lakip',
      label: 'LAKIP / LKJIP',
      icon: Award,
      regulasi: 'Perpres No. 29/2014 & SK KMA 2-144/2022',
      desc: 'Laporan Kinerja Instansi Pemerintah (LKjIP / LAKIP) tahunan yang memuat capaian Indikator Kinerja Utama (IKU) dan akuntabilitas kinerja satuan kerja.',
      highlights: [
        'Capaian Rasio Penyelesaian Perkara Tingkat Banding & Tingkat Pertama mencapai >98%',
        'Evaluasi Akuntabilitas Kinerja Instansi Pemerintah (SAKIP) dengan Predikat "A"',
        'Analisis Efisiensi Penggunaan Anggaran terhadap Capaian Kinerja Peradilan'
      ],
      actionLabel: 'Buka Dokumen LKJIP / LAKIP',
      onAction: () => onNavigate && onNavigate('dokumen', 'lkjip')
    },
    {
      id: 'renstra',
      label: 'Renstra',
      icon: Compass,
      regulasi: 'SK KMA 2-144/2022 Lampiran I',
      desc: 'Rencana Strategis (Renstra) lima tahunan Pengadilan Militer Tinggi V Makassar periode 2025–2029 beserta Indikator Kinerja Utama (IKU).',
      highlights: [
        'Dokumen Renstra Dilmilti V Makassar Periode 2025–2029 Selaras Cetak Biru MA-RI 2010–2035',
        'Penetapan Sasaran Strategis Terwujudnya Badan Peradilan Militer yang Agung dan Modern',
        'Matriks Target Kinerja Jangka Menengah 5 Tahunan'
      ],
      actionLabel: 'Buka Dokumen Renstra 2025–2029',
      onAction: () => onNavigate && onNavigate('dokumen', 'renstra')
    },
    {
      id: 'pengadaan',
      label: 'Pengadaan Barang dan Jasa',
      icon: ShoppingBag,
      regulasi: 'Perpres Pengadaan Barang/Jasa & SK KMA 2-144/2022',
      desc: 'Rencana Umum Pengadaan (RUP) pada aplikasi SIRUP LKPP, pengumuman pengadaan, e-Purchasing / e-Katalog, dan laporan realisasi pengadaan barang/jasa.',
      highlights: [
        'Publikasi Rencana Umum Pengadaan (RUP) melalui portal resmi SIRUP LKPP RI',
        'Transparansi e-Purchasing / e-Katalog V6 untuk Belanja Modal dan Operasional',
        'Pakta Integritas Anti Korupsi & Anti Penyuapan (SMAP) bersama Penyedia Barang/Jasa'
      ],
      actionLabel: 'Buka Portal SIRUP / LPSE MA RI',
      externalUrl: 'https://lpse.mahkamahagung.go.id'
    },
    {
      id: 'lhkpn',
      label: 'LHKPN',
      icon: UserCheck,
      regulasi: 'UU No. 28/1999 & SEMA Kewajiban LHKPN',
      desc: 'Bukti tanda terima dan ringkasan Laporan Harta Kekayaan Penyelenggara Negara (LHKPN) KPK bagi Kepala, Wakil, Hakim Tinggi, Panitera, dan Sekretaris.',
      highlights: [
        '100% Wajib Lapor LHKPN (Kadilmilti, Wakadilmilti, Hakim Militer Tinggi, Panitera, Sekretaris) Tepat Waktu',
        'Publikasi Ringkasan Harta Kekayaan (Pengumuman LHKPN KPK) Terverifikasi',
        'Wujud Nyata Transparansi dan Integritas Pejabat Peradilan Militer'
      ],
      actionLabel: 'Lihat Semua Laporan LHKPN & LHKASN',
      onAction: () => onNavigate && onNavigate('publik', 'lhkpn')
    },
    {
      id: 'lhkan',
      label: 'LHKAN',
      icon: ShieldCheck,
      regulasi: 'SE MenPAN-RB & Kebijakan Bawas MA-RI',
      desc: 'Laporan Harta Kekayaan Aparatur Negara (LHKAN) dan pelaporan SPT Tahunan bagi seluruh aparatur dan prajurit non-wajib LHKPN.',
      highlights: [
        '100% Kepatuhan Pelaporan LHKAN dan SPT Tahunan Pajak bagi Seluruh Aparatur & ASN/TNI',
        'Terintegrasi dengan Sistem Informasi Kepegawaian (SIKEP) Mahkamah Agung RI',
        'Pengawasan Kepatuhan Internal oleh Subbagian Kepegawaian & TI'
      ],
      actionLabel: 'Lihat Semua Laporan LHKPN & LHKASN',
      onAction: () => onNavigate && onNavigate('publik', 'lhkpn')
    }
  ];

  const setiapSaatItems = [
    {
      id: 'dip',
      label: 'DIP (Daftar Informasi Publik)',
      icon: BookOpen,
      desc: 'Katalog lengkap Daftar Informasi Publik (DIP) yang berada di bawah penguasaan Pengadilan Militer Tinggi V Makassar sesuai Lampiran II SK KMA 2-144/2022.'
    },
    {
      id: 'putusan',
      label: 'Putusan Pengadilan',
      icon: Scale,
      desc: 'Akses terbuka terhadap seluruh naskah putusan dan penetapan Pengadilan Militer Tinggi V Makassar yang telah dianonimisasi pada Direktori Putusan MA RI.'
    },
    {
      id: 'statistik',
      label: 'Statistik Perkara & Layanan',
      icon: BarChart3,
      desc: 'Rekapitulasi rasio penanganan perkara masuk, diputus, sisa perkara berjalan, serta indeks survei kepuasan masyarakat (IKM & IPAK).'
    },
    {
      id: 'sop',
      label: 'SOP (Standar Operasional Prosedur)',
      icon: Layers,
      desc: 'Dokumen Standar Operasional Prosedur (SOP) Kepaniteraan Pidana, Kepaniteraan Hukum, dan Kesekretariatan yang menjadi pedoman kerja baku.'
    },
    {
      id: 'standar-pelayanan',
      label: 'Standar Pelayanan',
      icon: FileCheck,
      desc: 'SK Ketua Pengadilan tentang Standar Pelayanan Peradilan (persyaratan, prosedur, jangka waktu, biaya Rp0, produk layanan, dan kompensasi pelayanan).'
    }
  ];

  const selectedBerkalaInfo = berkalaItems.find(b => b.id === activeBerkalaSub) || berkalaItems[0];

  // Form State Permohonan Informasi
  const [namaPemohon, setNamaPemohon] = useState('');
  const [nomorKTP, setNomorKTP] = useState('');
  const [nomorWA, setNomorWA] = useState('');
  const [email, setEmail] = useState('');
  const [instansi, setInstansi] = useState('');
  const [rincianInformasi, setRincianInformasi] = useState('');
  const [tujuanPenggunaan, setTujuanPenggunaan] = useState('');
  const [caraPerolehan, setCaraPerolehan] = useState<PermohonanInformasi['caraPerolehan']>('Salinan Elektronik (Cuma-cuma / Gratis)');
  const [createdTicket, setCreatedTicket] = useState<PermohonanInformasi | null>(null);

  // Tracking Ticket State
  const [trackingId, setTrackingId] = useState('');
  const [trackedItem, setTrackedItem] = useState<PermohonanInformasi | null>(null);
  const [trackError, setTrackError] = useState('');

  const [existingRequests, setExistingRequests] = useState<PermohonanInformasi[]>([
    {
      ticketId: 'PPID-MIL-2026-0042',
      tanggalPengajuan: '10 September 2026',
      namaPemohon: 'M. Syahrul Ramadhan, S.H.',
      nomorKTP: '7371120901920003',
      nomorWA: '0812-4455-8899',
      email: 'syahrul.law@gmail.com',
      instansi: 'Lembaga Bantuan Hukum (LBH) Pengayoman',
      rincianInformasi: 'Data Statistik Penyelesaian Perkara Desersi Militer Semester I Tahun 2026',
      tujuanPenggunaan: 'Penelitian dan Karya Tulis Ilmiah Hukum Pidana Militer',
      caraPerolehan: 'Salinan Elektronik (Cuma-cuma / Gratis)',
      status: 'Tersedia Diunduh',
      tanggapanPetugas: 'Permohonan disetujui PPID Dilmilti V. Dokumen data statistik telah dilampirkan dalam format PDF resmi bertanda tangan elektronik.',
      dokumenBalasanUrl: '#unduh-statistik-semester-1'
    }
  ]);

  const handleDownloadBerkalaDoc = (doc: SakipDipaDocumentItem) => {
    if (doc.fileUrl && doc.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = doc.fileUrl;
      a.download = doc.fileName || `${doc.judul}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const content = `PENGADILAN MILITER TINGGI V MAKASSAR
DOKUMEN RESMI PPID / TRANSPARANSI PUBLIK

Judul Dokumen  : ${doc.judul}
Nomor Dokumen  : ${doc.nomorDokumen || '-'}
Tahun Anggaran : ${doc.tahun}
Kategori       : ${doc.kategori}
Penanggung Jawab: ${doc.penanggungJawab}
Tanggal Upload : ${doc.tanggalUpload}

Deskripsi:
${doc.deskripsi}`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || `${doc.judul.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const filteredDIP = dipList.filter((item) => {
    const matchCategory = dipFilter === 'Semua' || item.kategori === dipFilter;
    const matchSearch = 
      item.namaInformasi.toLowerCase().includes(dipSearch.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(dipSearch.toLowerCase()) ||
      item.unitKerja.toLowerCase().includes(dipSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handlePermohonanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPemohon || !nomorKTP || !rincianInformasi) return;

    const newTicketId = `PPID-MIL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: PermohonanInformasi = {
      ticketId: newTicketId,
      tanggalPengajuan: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      namaPemohon,
      nomorKTP,
      nomorWA,
      email,
      instansi: instansi || 'Perorangan',
      rincianInformasi,
      tujuanPenggunaan,
      caraPerolehan,
      status: 'Diajukan',
      tanggapanPetugas: 'Permohonan telah dicatat dalam Register Informasi PPID Dilmilti V Makassar dan sedang diteliti oleh Pejabat Pengelola Informasi dan Dokumentasi.'
    };

    setExistingRequests([newRequest, ...existingRequests]);
    setCreatedTicket(newRequest);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    const found = existingRequests.find((r) => r.ticketId.toLowerCase() === trackingId.trim().toLowerCase());
    if (found) {
      setTrackedItem(found);
    } else {
      setTrackedItem(null);
      setTrackError(`Nomor tiket "${trackingId}" tidak ditemukan dalam sistem PPID. Pastikan format penulisan benar.`);
    }
  };

  const getActiveSubTitle = () => {
    switch (activeTab) {
      case 'berkala':
        if (activeBerkalaSub === 'profil-pengadilan') return 'Informasi Berkala - Profil Pengadilan';
        if (activeBerkalaSub === 'program-kerja') return 'Informasi Berkala - Program Kerja & Strategis';
        if (activeBerkalaSub === 'keuangan') return 'Informasi Berkala - Ringkasan Laporan Keuangan';
        if (activeBerkalaSub === 'lakip') return 'Informasi Berkala - Laporan Akuntabilitas Kinerja (LKjIP)';
        if (activeBerkalaSub === 'renstra') return 'Informasi Berkala - Rencana Strategis (Renstra)';
        if (activeBerkalaSub === 'pengadaan') return 'Informasi Berkala - Pengadaan Barang & Jasa (LPSE)';
        return 'Informasi Berkala';
      case 'setiap-saat':
        if (activeSetiapSaatSub === 'putusan') return 'Informasi Setiap Saat - Putusan & Yurisprudensi';
        if (activeSetiapSaatSub === 'statistik') return 'Informasi Setiap Saat - Statistik Perkara';
        if (activeSetiapSaatSub === 'sop') return 'Informasi Setiap Saat - SOP Pelayanan Peradilan';
        if (activeSetiapSaatSub === 'standar-pelayanan') return 'Informasi Setiap Saat - Standar Pelayanan';
        return 'Informasi Setiap Saat';
      case 'dip':
        return 'Daftar Informasi Publik (DIP)';
      case 'permohonan':
        return 'Prosedur & Formulir Permohonan Informasi';
      case 'tracking':
        return 'Lacak Status Tiket PPID';
      case 'keberatan':
        return 'Prosedur Pengajuan Keberatan Informasi';
      case 'dikecualikan':
        return 'Uji Konsekuensi & Informasi Dikecualikan';
      case 'lhkpn':
        return 'Kepatuhan LHKPN & LHKASN Pegawai';
      case 'laporan-ppid':
        return 'Laporan Layanan & Akses PPID';
      default:
        return 'Pejabat Pengelola Informasi & Dokumentasi (PPID)';
    }
  };

  return (
    <section id="ppid-informasi-section" className="space-y-6">
      
      {/* Header Breadcrumb Ringkas: Pengunjung langsung melihat halaman yang dituju tanpa terhalang menu besar */}
      <div className="bg-gradient-to-r from-[#072414] via-[#0B3A23] to-[#04160D] text-white rounded-2xl px-4 py-3 sm:px-6 sm:py-3.5 border border-emerald-500/30 shadow-md flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('beranda')}
            className="text-emerald-300 hover:text-amber-300 font-bold transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-emerald-200 font-semibold">PPID &amp; Informasi</span>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-amber-300 font-black tracking-wide">{getActiveSubTitle()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
            PPID
          </span>
          <span className="text-[11px] font-mono text-emerald-200/80 hidden sm:inline">
            SK KMA No. 2-144/2022
          </span>
        </div>
      </div>

      {/* TAB BERKALA: 8 SUBMENU INFORMASI BERKALA SK KMA 2-144/2022 */}
      {activeTab === 'berkala' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              FOKUS UTAMA SK KMA 2-144/KMA/SK/VIII/2022 • PASAL 9 UU KIP
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1.5">
              Informasi yang Wajib Diumumkan Secara Berkala (8 Submenu Utama)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kategori informasi berkala di bawah ini untuk meninjau rincian pemenuhan keterbukaan informasi publik:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {berkalaItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeBerkalaSub === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveBerkalaSub(item.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isActive
                      ? 'bg-[#0A3D24] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-slate-50 hover:bg-emerald-50/60 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isActive ? 'bg-white/15 text-amber-300' : 'bg-slate-200/70 text-slate-600'
                    }`}>
                      Berkala
                    </span>
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm leading-snug">{item.label}</div>
                    <div className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-emerald-200' : 'text-slate-500'}`}>
                      {item.regulasi}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Card for Selected Berkala Item */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl border border-emerald-200 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#0A3D24] text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                  {React.createElement(selectedBerkalaInfo.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">
                    {selectedBerkalaInfo.regulasi}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">
                    Informasi Berkala: {selectedBerkalaInfo.label}
                  </h4>
                </div>
              </div>

              {selectedBerkalaInfo.externalUrl ? (
                <a
                  href={selectedBerkalaInfo.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#0A3D24] hover:bg-emerald-900 text-amber-300 font-bold text-xs flex items-center gap-2 shadow-xs shrink-0"
                >
                  <span>{selectedBerkalaInfo.actionLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={selectedBerkalaInfo.onAction}
                  className="px-4 py-2.5 rounded-xl bg-[#0A3D24] hover:bg-emerald-900 text-amber-300 font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
                >
                  <span>{selectedBerkalaInfo.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedBerkalaInfo.desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedBerkalaInfo.highlights.map((hl, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-800 leading-relaxed">{hl}</span>
                </div>
              ))}
            </div>

            {/* Specific Downloadable Reports for Selected Berkala Submenu */}
            {(() => {
              const allDocs = CourtDB.getSakipDipaDocuments();
              const matchedDocs = allDocs.filter((doc) => {
                if (activeBerkalaSub === 'lhkpn' || activeBerkalaSub === 'lhkan') {
                  return doc.kategori === 'LHKPN';
                }
                if (activeBerkalaSub === 'keuangan') {
                  return doc.kategori === 'DIPA';
                }
                if (activeBerkalaSub === 'lakip') {
                  return doc.kategori === 'SAKIP' && (doc.subKategori === 'LKjIP' || doc.judul.toLowerCase().includes('lkjip'));
                }
                if (activeBerkalaSub === 'renstra') {
                  return doc.kategori === 'SAKIP' && (doc.subKategori === 'Renstra' || doc.subKategori === 'IKU');
                }
                if (activeBerkalaSub === 'program-kerja') {
                  return doc.kategori === 'SAKIP' && (doc.subKategori === 'RKT' || doc.subKategori === 'PK');
                }
                return false;
              });

              if (matchedDocs.length === 0) return null;

              const handleDownloadBerkalaDoc = (doc: any) => {
                const content = `PENGADILAN MILITER TINGGI V MAKASSAR
DOKUMEN RESMI KETERBUKAAN INFORMASI BERKALA (${selectedBerkalaInfo.label.toUpperCase()})

Judul Dokumen  : ${doc.judul}
Kategori       : ${doc.kategori}${doc.subKategori ? ` (${doc.subKategori})` : ''}
Nomor Dokumen  : ${doc.nomorDokumen || '-'}
Tahun Anggaran : ${doc.tahun}
PenanggungJawab: ${doc.penanggungJawab}
${doc.persentaseKepatuhan ? `Tingkat Kepatuhan: ${doc.persentaseKepatuhan}\n` : ''}${doc.nilaiAnggaran ? `Nilai Anggaran : ${doc.nilaiAnggaran}\n` : ''}
Uraian Dokumen :
${doc.deskripsi}

Diterbitkan secara resmi oleh Pejabat Pengelola Informasi dan Dokumentasi (PPID) Dilmilti V Makassar.`;
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = doc.fileName || `${doc.judul.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              };

              return (
                <div className="pt-3 border-t border-emerald-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#0A3D24]" />
                      <span>Unduh Berkas Laporan {selectedBerkalaInfo.label} Resmi:</span>
                    </h5>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {matchedDocs.length} Dokumen Tersedia
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {matchedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-900 uppercase">
                              {doc.subKategori || doc.kategori}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              No: {doc.nomorDokumen || '-'} • TA {doc.tahun}
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 text-xs">{doc.judul}</div>
                          <p className="text-[11px] text-slate-600">{doc.deskripsi}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownloadBerkalaDoc(doc)}
                          className="px-3.5 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Laporan ({doc.fileType})</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500">
                Seluruh dokumen pendukung terintegrasi dengan katalog Daftar Informasi Publik (DIP).
              </span>
              <button
                type="button"
                onClick={() => {
                  setDipFilter('Berkala');
                  setActiveTab('dip');
                }}
                className="text-emerald-800 hover:text-emerald-950 font-black flex items-center gap-1 cursor-pointer underline"
              >
                <span>Lihat Seluruh Tabel Dokumen Informasi Berkala di DIP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB SETIAP SAAT: 5 SUBMENU INFORMASI SETIAP SAAT SK KMA 2-144/2022 */}
      {activeTab === 'setiap-saat' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              INFORMASI TERSEDIA SETIAP SAAT • SK KMA 2-144/KMA/SK/VIII/2022
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1.5">
              5 Kategori Informasi yang Wajib Tersedia Setiap Saat
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih salah satu dari 5 kategori Informasi Setiap Saat di bawah ini untuk mengakses data dan dokumen secara langsung:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {setiapSaatItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSetiapSaatSub === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSetiapSaatSub(item.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isActive
                      ? 'bg-[#0A3D24] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-slate-50 hover:bg-emerald-50/60 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-extrabold text-xs leading-snug">{item.label}</div>
                </button>
              );
            })}
          </div>

          {activeSetiapSaatSub === 'dip' && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-slate-900 text-sm sm:text-base">Daftar Informasi Publik (DIP) Lengkap</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Memuat seluruh daftar informasi yang berada di bawah penguasaan Pengadilan Militer Tinggi V Makassar sesuai format Lampiran II SK KMA 2-144/2022.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('dip')}
                className="px-4 py-2.5 rounded-xl bg-[#0A3D24] text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Buka Tabel Lengkap DIP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeSetiapSaatSub === 'putusan' && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-slate-900 text-sm sm:text-base">Direktori Putusan & Penetapan Pengadilan</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Seluruh putusan Pengadilan Militer Tinggi V Makassar dipublikasikan melalui Direktori Putusan Mahkamah Agung RI dan SIPP lokal.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('sipp')}
                  className="px-4 py-2.5 rounded-xl bg-[#0A3D24] text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Telusuri di SIPP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href={OFFICIAL_PORTAL_URLS.direktoriPutusan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Direktori Putusan MA RI</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {activeSetiapSaatSub === 'statistik' && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-slate-900 text-sm sm:text-base">Statistik Perkara & Kinerja Penyelesaian Perkara</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Data real-time jumlah perkara masuk, perkara diputus, perkara berjalan, rasio minutasi, serta nilai survei IKM & IPAK.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('dokumen', 'statistik-perkara')}
                className="px-4 py-2.5 rounded-xl bg-[#0A3D24] text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Buka Statistik Perkara</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeSetiapSaatSub === 'sop' && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-slate-900 text-sm sm:text-base">Standar Operasional Prosedur (SOP)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Kumpulan dokumen SOP Kepaniteraan Pidana, Kepaniteraan Hukum, dan Kesekretariatan Dilmilti V Makassar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('dokumen', 'arsip-dokumen')}
                className="px-4 py-2.5 rounded-xl bg-[#0A3D24] text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Buka Dokumen SOP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeSetiapSaatSub === 'standar-pelayanan' && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-slate-900 text-sm sm:text-base">Standar Pelayanan Pengadilan & Maklumat Pelayanan</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Keputusan Ketua Pengadilan tentang Standar Pelayanan Peradilan Terpadu Satu Pintu (PTSP) dan kompensasi pelayanan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('publik', 'standar-pelayanan')}
                className="px-4 py-2.5 rounded-xl bg-[#0A3D24] text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Lihat Standar Pelayanan PTSP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Direct Downloadable Documents for Informasi Setiap Saat */}
          {(() => {
            const allDocs = CourtDB.getSakipDipaDocuments();
            const setiapSaatDocs = allDocs.filter((d) => {
              if (activeSetiapSaatSub === 'dip') return d.kategori === 'PPID';
              if (activeSetiapSaatSub === 'statistik') return d.kategori === 'LAPORAN_PERKARA' || d.kategori === 'LAPORAN_SURVEI';
              if (activeSetiapSaatSub === 'sop') return d.subKategori?.includes('SOP') || (d.kategori as string) === 'LAINNYA';
              if (activeSetiapSaatSub === 'standar-pelayanan') return d.kategori === 'PPID' || d.kategori === 'LAPORAN_SURVEI';
              return d.kategori === 'LAPORAN_PERKARA' || d.kategori === 'PPID';
            });
            if (setiapSaatDocs.length === 0) return null;
            return (
              <div className="pt-3 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-xs uppercase flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Unduh Dokumen Resmi Informasi Setiap Saat</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {setiapSaatDocs.length} Dokumen Tersedia
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {setiapSaatDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-500 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono text-emerald-800 font-bold">
                          {doc.nomorDokumen || 'SK KMA 2-144/2022'} • TA {doc.tahun}
                        </div>
                        <div className="font-bold text-slate-900 text-xs truncate">{doc.judul}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{doc.deskripsi}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadBerkalaDoc(doc)}
                        className="px-3 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 1: DAFTAR INFORMASI PUBLIK (DIP SK KMA 2-144/2022) */}
      {activeTab === 'dip' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0E29CD]" />
                <span>Daftar Informasi Publik (DIP) Resmi Sesuai Lampiran II SK KMA 2-144/2022</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ditandatangani oleh PPID Pengadilan Militer Tinggi V Makassar • Terbuka & Dapat Diunduh
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              {(['Semua', 'Berkala', 'Serta Merta', 'Setiap Saat'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setDipFilter(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                    dipFilter === cat
                      ? 'bg-[#0E29CD] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar inside DIP */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={dipSearch}
              onChange={(e) => setDipSearch(e.target.value)}
              placeholder="Cari nama dokumen, DIPA, LAKIP, SOP, atau unit kerja..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#0E29CD] focus:outline-none"
            />
          </div>

          {/* Standardized DIP Table according to SK KMA 2-144/2022 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5 text-center w-10">No</th>
                  <th className="p-2.5">Nama Informasi & Ringkasan</th>
                  <th className="p-2.5">Unit Kerja / Penanggung Jawab</th>
                  <th className="p-2.5">Waktu & Tempat Pembuatan</th>
                  <th className="p-2.5">Bentuk Tersedia</th>
                  <th className="p-2.5 text-center">Retensi Arsip</th>
                  <th className="p-2.5 text-center">Unduh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDIP.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="p-2.5 text-center font-bold text-slate-400">{item.no}</td>
                    <td className="p-2.5 max-w-xs">
                      <strong className="text-slate-900 block leading-tight">{item.namaInformasi}</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.ringkasan}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                        Informasi {item.kategori}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="font-semibold text-slate-800 block">{item.unitKerja}</span>
                      <span className="text-[10px] text-slate-500">{item.penanggungJawab}</span>
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-600">{item.waktuTempat}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {item.bentukTersedia}
                      </span>
                    </td>
                    <td className="p-2.5 text-center text-[10px] text-slate-500">
                      Aktif: {item.retensiAktif}<br />
                      Inaktif: {item.retensiInaktif}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const content = `MAHKAMAH AGung REPUBLIK INDONESIA
DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA
PENGADILAN MILITER TINGGI V MAKASSAR
Jl. Perintis Kemerdekaan KM. 13, Daya, Biringkanaya, Kota Makassar 90243
================================================================================
DOKUMEN RESMI DAFTAR INFORMASI PUBLIK (DIP)
Berdasarkan SK KMA Nomor 2-144/KMA/SK/VIII/2022
================================================================================

Nomor Urut DIP     : ${item.no}
Nama Informasi     : ${item.namaInformasi}
Kategori Informasi : Informasi ${item.kategori}
Ringkasan Isi      : ${item.ringkasan}
Unit Penguasa      : ${item.unitKerja}
Penanggung Jawab   : ${item.penanggungJawab}
Waktu & Tempat     : ${item.waktuTempat}
Bentuk Tersedia    : ${item.bentukTersedia}
Jangka Retensi     : Aktif ${item.retensiAktif} / Inaktif ${item.retensiInaktif}
Ukuran Berkas      : ${item.ukuranFile}

Dokumen ini merupakan salinan informasi publik resmi yang berada di bawah penguasaan
Pejabat Pengelola Informasi dan Dokumentasi (PPID) Pengadilan Militer Tinggi V Makassar.`;
                          const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `DIP_${item.no}_${item.namaInformasi.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-[#0E29CD] text-[#0E29CD] hover:text-white rounded text-[11px] font-bold transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                        title="Unduh Dokumen Publik"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PENGALIHAN FORMULIR KE APLIKASI PTSP ONLINE */}
      {activeTab === 'permohonan' && (
        <div className="bg-white rounded-2xl border border-blue-200/80 p-5 sm:p-7 shadow-xs space-y-6 text-xs animate-in fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-900 uppercase tracking-wider border border-blue-200">
                  Layanan Terintegrasi Terpadu
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  Meja 3: Hukum & PPID
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0E29CD]" />
                <span>Pengalihan Formulir Permohonan Informasi Publik (PPID)</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pengisian formulir permohonan sesuai ketentuan Pasal 10 SK KMA No. 2-144/KMA/SK/VIII/2022 kini dilayani secara terpusat melalui Aplikasi PTSP Online Pengadilan Militer Tinggi V Makassar.
              </p>
            </div>
            <div className="shrink-0 flex sm:flex-col items-end gap-1">
              <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-300">
                SLA Respon: Maks. 10 Hari Kerja
              </span>
            </div>
          </div>

          {/* Transition Notice Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0E29CD] text-white rounded-xl shadow-md space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  Pemberitahuan Resmi: Formulir Telah Dialihkan ke Aplikasi PTSP Online
                </h4>
                <p className="text-xs text-blue-100/95 leading-relaxed">
                  Sesuai dengan standarisasi Pelayanan Terpadu Satu Pintu (PTSP) Mahkamah Agung Republik Indonesia dan ketentuan SK KMA No. 2-144/KMA/SK/VIII/2022, seluruh alur pendaftaran permohonan informasi publik Pengadilan Militer Tinggi V Makassar dilayani secara terpadu melalui <strong>Aplikasi PTSP Online (Meja 3 Hukum & PPID)</strong>.
                </p>
                <p className="text-xs text-blue-100/95 leading-relaxed">
                  Melalui sistem terpadu ini, pemohon akan secara otomatis memperoleh <strong>Nomor Tiket Antrean & Layanan Digital</strong>, bukti tanda terima resmi ber-QR Code, notifikasi WhatsApp Foonte ke nomor aktif, serta pemantauan SLA respon maksimal 10 hari kerja secara transparan.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateToPTSP ? onNavigateToPTSP('Permohonan Informasi PPID') : (window.location.hash = 'ptsp-inovasi-section')}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer text-xs sm:text-sm active:scale-98"
              >
                <span>Ajukan Permohonan di Aplikasi PTSP Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={CourtDB.getPTSPAppConfig().externalUrl || 'https://ptsp-inovasi.dilmilti-makassar.go.id'}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all border border-white/20 flex items-center gap-2 text-xs"
              >
                <ExternalLink className="w-4 h-4 text-amber-300" />
                <span>Buka Portal PTSP Online Eksternal</span>
              </a>
            </div>
          </div>

          {/* Form Requirement Summary Card */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Ketentuan & Data yang Perlu Disiapkan (Pasal 10 SK KMA No. 2-144/2022)</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-500">Layanan Meja 3 PTSP</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0E29CD] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-bold text-slate-800">Nama Pemohon (Sesuai KTP/KTA):</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Contoh: Lettu Inf Kurnia Ramadhan / Andi Baso S.H. (Perorangan / Advokat / Babinkum TNI)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0E29CD] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-bold text-slate-800">Nomor Induk KTP / NRP TNI:</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    NIK 16 digit KTP atau NRP Prajurit TNI aktif untuk keperluan verifikasi identitas resmi
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0E29CD] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-bold text-slate-800">Nomor WhatsApp Aktif & Email:</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Nomor WhatsApp Aktif (0812-xxxx-xxxx) & Alamat Email (pemohon@domain.com) untuk notifikasi berkas
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0E29CD] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <div className="font-bold text-slate-800">Instansi / Lembaga (Opsional):</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Universitas / LBH / Kesatuan Militer / Lembaga Penelitian
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5 md:col-span-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0E29CD] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <div className="font-bold text-slate-800">Rincian Informasi Publik yang Dibutuhkan:</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Jelaskan secara spesifik dokumen informasi publik yang diminta, periode tahun, dan rincian data terkait...
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0E29CD] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  6
                </div>
                <div>
                  <div className="font-bold text-slate-800">Tujuan Penggunaan Informasi:</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Contoh: Skripsi/Tesis, Kepentingan Pembelaan Hukum, Penelitian Ilmiah
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  7
                </div>
                <div>
                  <div className="font-bold text-slate-800">Cara Memperoleh Informasi:</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    <strong className="text-emerald-700">Salinan Elektronik (Cuma-cuma / Gratis melalui email & portal)</strong> atau Salinan Cetak (biaya fotokopi riil)
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Seluruh permohonan diverifikasi langsung oleh Petugas Meja 3 (Hukum & PPID) Dilmilti V Makassar</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('tracking')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Lacak Tiket Sebelumnya
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToPTSP ? onNavigateToPTSP('Permohonan Informasi PPID') : (window.location.hash = 'ptsp-inovasi-section')}
                  className="px-4 py-2 bg-[#0E29CD] hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Buka di Aplikasi PTSP Online</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRACKING TIKET PERMOHONAN */}
      {activeTab === 'tracking' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0E29CD]" />
              <span>Lacak Status Permohonan Informasi Publik</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan nomor tiket permohonan yang Anda peroleh saat mengajukan informasi
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-xl">
            <input
              type="text"
              required
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Contoh: PPID-MIL-2026-0042"
              className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs uppercase font-mono font-bold"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0E29CD] hover:bg-blue-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Lacak Tiket
            </button>
          </form>

          {trackError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{trackError}</span>
            </div>
          )}

          {trackedItem && (
            <div className="bg-blue-50/70 border border-blue-200 p-5 rounded-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-800 uppercase">TIKET RESMI PPID</span>
                  <h4 className="text-base font-black text-slate-900 font-mono">{trackedItem.ticketId}</h4>
                  <div className="text-[11px] text-slate-500">Diajukan: {trackedItem.tanggalPengajuan}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                  {trackedItem.status}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-blue-100 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Pemohon:</span>
                  <strong className="text-slate-900">{trackedItem.namaPemohon} ({trackedItem.instansi})</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Rincian Informasi yang Diminta:</span>
                  <p className="text-slate-800 font-medium">{trackedItem.rincianInformasi}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-500 text-[11px] block">Tanggapan / Catatan Petugas PPID:</span>
                  <p className="text-blue-950 font-semibold bg-slate-50 p-2.5 rounded border border-slate-200">
                    {trackedItem.tanggapanPetugas}
                  </p>
                </div>
              </div>

              {trackedItem.dokumenBalasanUrl && (
                <button
                  type="button"
                  onClick={() => alert('Simulasi Mengunduh Berkas Hasil Permohonan Informasi Format PDF Bersegel Elektronik.')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Dokumen Salinan Informasi (PDF Bebas Biaya)</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: KEBERATAN */}
      {activeTab === 'keberatan' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-4 h-4 text-[#0E29CD]" />
            <span>Tata Cara Pengajuan Keberatan Informasi Publik</span>
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Pemohon informasi berhak mengajukan keberatan kepada Atasan PPID (Ketua Pengadilan Militer Tinggi V Makassar) apabila:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Permohonan informasi ditolak tanpa alasan yang sah menurut undang-undang;</li>
            <li>Informasi berkala tidak disediakan;</li>
            <li>Permohonan informasi tidak ditanggapi dalam waktu 10 (sepuluh) hari kerja;</li>
            <li>Permohonan informasi ditanggapi tidak sebagaimana yang diminta;</li>
            <li>Biaya yang dikenakan melebihi standar biaya yang wajar.</li>
          </ul>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <strong>Kontak Meja Keberatan PPID:</strong>
            <p className="mt-1 text-slate-600">
              Surat keberatan ditujukan kepada Atasan PPID Dilmilti V Makassar, Jl. Perintis Kemerdekaan KM. 13, Kel. Daya, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90243. Email: dilmiti5makassar@gmail.com
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: INFORMASI YANG DIKECUALIKAN */}
      {activeTab === 'dikecualikan' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 text-xs">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-rose-700 uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Daftar Informasi yang Dikecualikan (Pasal 17 UU No. 14/2008 & SK KMA 2-144/2022)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Informasi yang tidak dapat diakses publik demi keamanan pertahanan negara dan kerahasiaan peradilan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
              <strong className="text-rose-900 block mb-1">1. Rahasia Pertahanan & Militer:</strong>
              <p className="text-[11px] leading-relaxed">
                Informasi strategi militer, penempatan alutsista rahasia negara, sandi intelijen militer yang terungkap dalam persidangan tertutup.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
              <strong className="text-rose-900 block mb-1">2. Musyawarah Majelis Hakim (Advisblaad):</strong>
              <p className="text-[11px] leading-relaxed">
                Catatan musyawarah rahasia para hakim sebelum pengucapan putusan bersifat tertutup selamanya.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
              <strong className="text-rose-900 block mb-1">3. Perlindungan Saksi & Korban:</strong>
              <p className="text-[11px] leading-relaxed">
                Identitas saksi yang dilindungi LPSK/Babinkum serta data perkara asusila militer disamarkan demi kehormatan pribadi.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
              <strong className="text-rose-900 block mb-1">4. Berkas Mediasi Militer:</strong>
              <p className="text-[11px] leading-relaxed">
                Catatan dan resume selama proses perdamaian atau mediasi di pengadilan tidak dapat dijadikan alat bukti publik.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB LHKPN & LHKASN */}
      {activeTab === 'lhkpn' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                TRANSPARANSI HARTA KEKAYAAN PENYELENGGARA NEGARA
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Laporan Harta Kekayaan Penyelenggara Negara (LHKPN) & LHKASN TA 2026</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kepatuhan pelaporan 100% Hakim Militer Tinggi, Panitera, Sekretaris, dan Aparatur Sipil Negara (e-LHKPN KPK & SPT Tahunan)
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black shrink-0">
              Kepatuhan Pelaporan: 100% Tepat Waktu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-800">Wajib Lapor e-LHKPN KPK</span>
              <div className="text-xl font-black text-slate-900">100% Terverifikasi</div>
              <p className="text-[11px] text-slate-600">Seluruh Hakim Militer Tinggi, Panitera, dan Sekretaris telah menyampaikan LHKPN Periodik ke KPK RI.</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-blue-800">Wajib Lapor LHKASN / SPT</span>
              <div className="text-xl font-black text-slate-900">100% Lengkap</div>
              <p className="text-[11px] text-slate-600">Seluruh Pejabat Struktural, Panitera Muda, Kasubbag, dan Staf telah melaporkan LHKASN & SPT Pajak.</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-900">Dasar Regulasi</span>
              <div className="text-sm font-black text-slate-900">SK KMA No. 2-144/2022</div>
              <p className="text-[11px] text-slate-600">UU No. 28 Tahun 1999 & Peraturan KPK Nomor 2 Tahun 2020 tentang Pelaporan LHKPN.</p>
            </div>
          </div>

          {(() => {
            const allDocs = CourtDB.getSakipDipaDocuments();
            const lhkpnDocs = allDocs.filter((d) => d.kategori === 'LHKPN' || d.subKategori?.includes('LHKPN') || d.subKategori?.includes('LHKASN'));
            return (
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Daftar Dokumen Tanda Terima & Rekapitulasi LHKPN / LHKASN Resmi</span>
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {lhkpnDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[10px] uppercase">
                            {doc.subKategori || 'LHKPN / LHKASN'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Nomor: {doc.nomorDokumen || '-'} • Tahun {doc.tahun}
                          </span>
                          {doc.persentaseKepatuhan && (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Kepatuhan: {doc.persentaseKepatuhan}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{doc.judul}</div>
                        <p className="text-[11px] text-slate-600">{doc.deskripsi}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadBerkalaDoc(doc)}
                        className="px-4 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Bukti Lapor ({doc.fileType})</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 6: DATA LAPORAN LAYANAN INFORMASI & PPID */}
      {activeTab === 'laporan-ppid' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 uppercase">
                Transparansi & Akuntabilitas PPID
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <FileCheck className="w-4 h-4 text-[#0E29CD]" />
                <span>Data Laporan Tahunan Layanan Informasi Publik & Ringkasan DIP</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Publikasi resmi rekapitulasi permohonan informasi, SLA penyelesaian, serta dokumen berkas fisik Laporan PPID.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0E29CD]" />
              <span>SK KMA No. 2-144/KMA/SK/VIII/2022</span>
            </div>
          </div>

          {/* METRIC HIGHLIGHTS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-2xl font-black text-[#0E29CD] font-mono">100%</div>
              <div className="text-[10px] font-bold text-slate-700">Tingkat Permohonan Dikabulkan</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-2xl font-black text-emerald-700 font-mono">2 Hari</div>
              <div className="text-[10px] font-bold text-slate-700">Rata-rata Waktu Respon (SLA 10 Hari)</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-2xl font-black text-amber-600 font-mono">0 Sengketa</div>
              <div className="text-[10px] font-bold text-slate-700">Sengketa Informasi Publik di Komisi Informasi</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-2xl font-black text-purple-700 font-mono">Gratis</div>
              <div className="text-[10px] font-bold text-slate-700">Biaya Pengadaan Informasi Elektronik</div>
            </div>
          </div>

          {/* TABLE LAPORAN PPID */}
          {(() => {
            const allDocs = CourtDB.getSakipDipaDocuments();
            const ppidDocs = allDocs.filter(d => d.kategori === 'PPID' || d.subKategori?.includes('PPID'));

            const handleDownload = (doc: any) => {
              const content = `PENGADILAN MILITER TINGGI V MAKASSAR
LAPORAN TAHUNAN LAYANAN INFORMASI PUBLIK (PPID)

Judul Dokumen  : ${doc.judul}
Nomor Dokumen  : ${doc.nomorDokumen || '-'}
Tahun Anggaran : ${doc.tahun}
PenanggungJawab: ${doc.penanggungJawab}
Uraian Laporan :
${doc.deskripsi}

Diterbitkan secara resmi oleh Pejabat Pengelola Informasi dan Dokumentasi (PPID) Dilmilti V Makassar.`;
              const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = doc.fileName || 'Laporan_Tahunan_PPID_Dilmilti5.txt';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            };

            return (
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0E29CD]" />
                  <span>Daftar Berkas Laporan Layanan Informasi PPID & Lampiran</span>
                </h4>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Judul Dokumen Laporan</th>
                        <th className="p-3">Nomor Dokumen</th>
                        <th className="p-3">Uraian & Substansi</th>
                        <th className="p-3 text-center">Tahun / Berkas</th>
                        <th className="p-3 text-center">Lampiran Fisik</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {ppidDocs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-500">
                            Belum ada dokumen laporan PPID.
                          </td>
                        </tr>
                      ) : (
                        ppidDocs.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">
                              {doc.judul}
                              <div className="text-[10px] text-slate-500 font-normal">PJ: {doc.penanggungJawab}</div>
                            </td>
                            <td className="p-3 font-mono text-[11px] text-blue-900">{doc.nomorDokumen || '-'}</td>
                            <td className="p-3 text-[11px] text-slate-600">{doc.deskripsi}</td>
                            <td className="p-3 text-center font-mono text-[10px]">
                              <strong>TA {doc.tahun}</strong>
                              <div className="text-emerald-700">{doc.fileType} ({doc.fileSize})</div>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDownload(doc)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Download className="w-3 h-3" />
                                <span>Unduh Lampiran</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </section>
  );
}
