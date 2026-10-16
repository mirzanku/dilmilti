import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Eye, 
  FileCode, 
  ShieldCheck, 
  X,
  BookOpen,
  Award,
  Compass,
  Calendar,
  FileCheck,
  Wallet,
  BarChart3,
  FolderOpen,
  ArrowUpRight,
  Filter,
  RotateCcw,
  Tag,
  CalendarDays,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Stamp,
  LayoutTemplate,
  Wifi,
  WifiOff,
  Database,
  HardDriveDownload,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Target
} from 'lucide-react';
import { DocumentTemplateItem, SakipDipaDocumentItem } from '../types';
import { CourtDB } from '../data/courtDatabase';
import { syncRouteToUrl } from '../utils/urlRouter';
import {
  IkuMiliterIndicator,
  IkuDataSourceFile,
  SK_SEKMA_INFO,
  INITIAL_IKU_MILITER_LIST,
  INITIAL_DATA_SOURCE_FILES
} from '../data/ikuMiliterData';
import {
  getStoredIkuList,
  saveStoredIkuList,
  getStoredIkuFiles,
  saveStoredIkuFiles,
  parseUploadedIkuFile,
  parseDocumentTextToIku,
  generateSampleIkuTemplate,
  resetIkuToOfficialBenchmark,
  ParseFileResult
} from '../utils/ikuFileParser';
import {
  cacheTemplateToIndexedDb,
  cacheTemplatesBatchToIndexedDb,
  cacheSakipDocToIndexedDb,
  cacheSakipDocsBatchToIndexedDb,
  getAllCachedTemplatesFromIndexedDb,
  getAllCachedReportsFromIndexedDb,
  getTemplateCacheStats,
  TemplateCacheStats
} from '../utils/templateIndexedDbCache';

interface DocumentTemplatesSectionProps {
  onNavigate?: (section: any, subTab?: string) => void;
  initialSubTab?: string;
}

export const DocumentTemplatesSection: React.FC<DocumentTemplatesSectionProps> = ({
  onNavigate,
  initialSubTab = 'laporan-tahunan'
}) => {
  const [activeSubMenu, setActiveSubMenu] = useState<string>(initialSubTab || 'laporan-tahunan');
  const [templates, setTemplates] = useState<DocumentTemplateItem[]>([]);
  const [sakipDocs, setSakipDocs] = useState<SakipDipaDocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>('Semua');
  const [searchScope, setSearchScope] = useState<'semua' | 'tab-aktif'>('semua');
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplateItem | null>(null);
  const [previewMode, setPreviewMode] = useState<'visual' | 'raw'>('visual');
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // IKU state
  const [ikuList, setIkuList] = useState<IkuMiliterIndicator[]>(() => getStoredIkuList());
  const [selectedYear, setSelectedYear] = useState<'2025' | '2026' | '2027' | '2028' | '2029'>('2026');
  const [selectedKategori, setSelectedKategori] = useState<'SEMUA' | 'Kepaniteraan' | 'Kesekretariatan'>('SEMUA');
  const [selectedTujuan, setSelectedTujuan] = useState<'SEMUA' | '1' | '2'>('SEMUA');
  const [searchQueryIku, setSearchQueryIku] = useState<string>('');

  // Offline & IndexedDB Caching States
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [cacheStats, setCacheStats] = useState<TemplateCacheStats>({
    isSupported: true,
    templateCount: 0,
    reportCount: 0,
    totalCached: 0,
    frequentlyDownloadedCount: 0,
    lastSyncTime: null
  });
  const [isSyncingCache, setIsSyncingCache] = useState<boolean>(false);
  const [offlineFilterMode, setOfflineFilterMode] = useState<'semua' | 'sering-diunduh' | 'tersimpan-offline'>('semua');

  const openVisualPreview = (template: DocumentTemplateItem) => {
    setPreviewTemplate(template);
    setPreviewMode('visual');
    setPreviewZoom(100);
  };

  const openReportVisualPreview = (doc: SakipDipaDocumentItem) => {
    const syntheticTemplate: DocumentTemplateItem = {
      id: doc.id,
      kodeDoc: doc.nomorDokumen || `DOK-${doc.kategori}-${doc.tahun}`,
      judul: doc.judul,
      kategori: `${doc.kategori}${doc.subKategori ? ` • ${doc.subKategori}` : ''}`,
      deskripsi: doc.deskripsi,
      format: doc.fileType || 'PDF',
      fileUrl: doc.fileUrl || '',
      ukuranFile: doc.fileSize || '2.0 MB',
      jumlahDiunduh: 120,
      tanggalUpdate: doc.tanggalUpload || `${doc.tahun}-01-10`,
      teksTemplate: `DOKUMEN AKUNTABILITAS & LAPORAN RESMI
PENGADILAN MILITER TINGGI V MAKASSAR
====================================================================

Judul Dokumen     : ${doc.judul}
Nomor Registrasi  : [${doc.nomorDokumen || 'W5-Mil.01/REG/2026'}]
Kategori / Sub    : ${doc.kategori} / ${doc.subKategori || '-'}
Tahun Anggaran    : [TA ${doc.tahun}]
Unit Penanggung   : [${doc.penanggungJawab}]
Tanggal Publikasi : [${doc.tanggalUpload}]
${doc.nilaiAnggaran ? `Pagu / Anggaran   : [${doc.nilaiAnggaran}]\n` : ''}${doc.persentaseKepatuhan ? `Tingkat Kepatuhan : [${doc.persentaseKepatuhan}]\n` : ''}
I. RINGKASAN EKSEKUTIF & SUBSTANSI DOKUMEN
${doc.deskripsi}

II. STANDAR KETERBUKAAN INFORMASI PUBLIK
[ ] Telah diverifikasi oleh Pejabat Pengelola Informasi dan Dokumentasi (PPID)
[ ] Sesuai SK KMA Nomor 2-144/KMA/SK/VIII/2022
[ ] Sesuai Pedoman Standarisasi Website Badilmiltun SK Nomor 593/DJMT/SK.TI2.1.1/VII/2026

Makassar, ${doc.tanggalUpload || `Tahun ${doc.tahun}`}
Pejabat Penanggung Jawab,
${doc.penanggungJawab}

(________________________)
[Tanda Tangan Elektronik BSrE BSSN]`
    };
    openVisualPreview(syntheticTemplate);
  };

  const syncAllToIndexedDb = async (userTriggered = false) => {
    try {
      if (userTriggered) setIsSyncingCache(true);
      const allTemplates = CourtDB.getAllDocumentTemplates();
      const allReports = CourtDB.getSakipDipaDocuments();

      await Promise.all([
        cacheTemplatesBatchToIndexedDb(allTemplates),
        cacheSakipDocsBatchToIndexedDb(allReports)
      ]);

      const stats = await getTemplateCacheStats();
      setCacheStats(stats);

      if (userTriggered) {
        showToast(`Berhasil menyimpan ${stats.totalCached} template & dokumen resmi ke IndexedDB untuk akses offline!`);
      }
    } catch (e) {
      console.warn('Sync IndexedDB error:', e);
    } finally {
      if (userTriggered) setIsSyncingCache(false);
    }
  };

  const loadData = async () => {
    let tList = CourtDB.getAllDocumentTemplates();
    let rList = CourtDB.getSakipDipaDocuments();

    // If offline or data is empty, read directly from IndexedDB
    if ((!tList || tList.length === 0 || (typeof navigator !== 'undefined' && !navigator.onLine))) {
      try {
        const cachedT = await getAllCachedTemplatesFromIndexedDb();
        const cachedR = await getAllCachedReportsFromIndexedDb();
        if (cachedT && cachedT.length > 0) tList = cachedT;
        if (cachedR && cachedR.length > 0) rList = cachedR;
      } catch (err) {
        console.warn('Gagal membaca cache IndexedDB saat loadData:', err);
      }
    }

    setTemplates(tList || []);
    setSakipDocs(rList || []);

    // Refresh cache stats
    getTemplateCacheStats().then(setCacheStats).catch(() => {});
  };

  useEffect(() => {
    loadData();

    // Initial background sync to IndexedDB
    syncAllToIndexedDb(false);

    const handleOnline = () => {
      setIsOnline(true);
      showToast('Koneksi internet kembali online. Data disinkronkan dengan server.');
      loadData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('Koneksi internet offline. Beralih ke Cache Dokumen Resmi di IndexedDB.');
      loadData();
    };

    const handleDbSync = () => {
      loadData();
      syncAllToIndexedDb(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('dilmilti_db_updated', handleDbSync);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('dilmilti_db_updated', handleDbSync);
    };
  }, []);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubMenu(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (activeSubMenu) {
      syncRouteToUrl('dokumen', activeSubMenu, true);
    }
  }, [activeSubMenu]);

  const menu7SubMenus = [
    {
      id: 'buku-saku',
      label: 'Buku Saku Resmi',
      icon: BookOpen,
      badge: 'Panduan Saku Standar 2026',
      title: 'Buku Saku Resmi & Panduan Praktis Pengadilan Militer Tinggi V Makassar',
      desc: 'Buku saku digital resmi komprehensif memuat pedoman pelayanan peradilan militer, alur banding, PTSP 6 meja, hak pencari keadilan, serta aturan Zona Integritas WBBM berdasarkan SK 593/2026.'
    },
    {
      id: 'iku',
      label: 'Indikator Kinerja Utama',
      icon: Target,
      badge: 'Target & Realisasi Kinerja',
      title: 'Indikator Kinerja Utama (IKU) & Perjanjian Kinerja (PK) 2025-2029',
      desc: 'Pemantauan capaian Indikator Kinerja Utama (IKU) dan Perjanjian Kinerja (PK) Pengadilan Militer Tinggi V Makassar secara real-time berdasarkan data yudisial dan administratif.'
    },
    {
      id: 'laporan-tahunan',
      label: 'Laporan Tahunan',
      icon: BookOpen,
      badge: 'Laptah Pengadilan',
      title: 'Laporan Tahunan Pelaksanaan Tugas (Laptah) Dilmilti V Makassar',
      desc: 'Dokumen pertanggungjawaban pelaksanaan tugas pokok dan fungsi yustisial, kepaniteraan, serta kesekretariatan selama satu tahun anggaran penuh.'
    },
    {
      id: 'lkjip',
      label: 'LKJIP',
      icon: Award,
      badge: 'Akuntabilitas Kinerja',
      title: 'Laporan Kinerja Instansi Pemerintah (LKjIP / LAKIP)',
      desc: 'Laporan akuntabilitas capaian kinerja tahunan berdasarkan Indikator Kinerja Utama (IKU) dan evaluasi SAKIP dengan predikat Sangat Memuaskan (A).'
    },
    {
      id: 'renstra',
      label: 'Renstra',
      icon: Compass,
      badge: 'Periode 2025–2029',
      title: 'Rencana Strategis (Renstra) Lima Tahunan (2025–2029)',
      desc: 'Dokumen perencanaan jangka menengah 5 tahunan Pengadilan Militer Tinggi V Makassar yang selaras dengan Cetak Biru Pembaruan Peradilan MA-RI 2010–2035.'
    },
    {
      id: 'rkt',
      label: 'RKT',
      icon: Calendar,
      badge: 'Rencana Kerja Tahunan',
      title: 'Rencana Kerja Tahunan (RKT) & Indikator Kinerja Utama (IKU)',
      desc: 'Penjabaran operasional tahunan dari sasaran strategis Renstra yang memuat target kinerja kuantitatif penyelesaian perkara dan layanan publik.'
    },
    {
      id: 'perjanjian-kinerja',
      label: 'Perjanjian Kinerja',
      icon: FileCheck,
      badge: 'PK Pimpinan & Pejabat',
      title: 'Dokumen Perjanjian Kinerja (PK) Tahunan',
      desc: 'Komitmen tertulis antara Kepala Pengadilan Militer Tinggi V Makassar dengan Dirjen Badilmiltun/Sekretaris MA RI serta berjenjang kepada Panitera dan Sekretaris.'
    },
    {
      id: 'realisasi-anggaran',
      label: 'Realisasi Anggaran',
      icon: Wallet,
      badge: 'DIPA 01 & DIPA 05',
      title: 'Laporan Realisasi Anggaran (LRA), DIPA 01 & DIPA 05, dan Neraca Keuangan',
      desc: 'Publikasi transparan pengelolaan anggaran DIPA Badan Urusan Administrasi (01) dan Ditjen Badilmiltun (05) beserta realisasi penyerapan anggaran bulanan/triwulanan.'
    },
    {
      id: 'statistik-perkara',
      label: 'Statistik Perkara',
      icon: BarChart3,
      badge: 'Rasio Penanganan Perkara',
      title: 'Laporan Statistik Perkara Masuk, Diputus, dan Berjalan',
      desc: 'Rekapitulasi data perkara pidana militer tingkat banding, tingkat pertama perwira menengah, serta perkara koneksitas di wilayah hukum Kawasan Timur Indonesia.'
    },
    {
      id: 'arsip-dokumen',
      label: 'Arsip Dokumen',
      icon: FolderOpen,
      badge: 'SK KMA 159/2026, SOP & Template',
      title: 'Arsip Dokumen Resmi, Format Buku II SK KMA 159/KMA/SK.HK2/VIII/2026, SOP & Template Formulir',
      desc: 'Repositori arsip Surat Keputusan (SK), Format Dokumen Teknis Administrasi & Teknis Peradilan Militer (Buku II SK KMA 159/2026), SOP, serta template formulir layanan masyarakat yang siap diunduh.'
    }
  ];

  const currentSubObj = menu7SubMenus.find(m => m.id === activeSubMenu) || menu7SubMenus[0];

  // Extract available fiscal years dynamically from reports & templates
  const availableFiscalYears = useMemo(() => {
    const yearSet = new Set<string>(['2026', '2025', '2024']);
    sakipDocs.forEach((doc) => {
      if (doc.tahun && /^\d{4}$/.test(String(doc.tahun).trim())) {
        yearSet.add(String(doc.tahun).trim());
      }
      const matchUpload = doc.tanggalUpload?.match(/\b(20\d{2})\b/);
      if (matchUpload) yearSet.add(matchUpload[1]);
    });
    templates.forEach((t) => {
      const matchUpdate = t.tanggalUpdate?.match(/\b(20\d{2})\b/);
      if (matchUpdate) yearSet.add(matchUpdate[1]);
    });
    return ['Semua', ...Array.from(yearSet).sort((a, b) => Number(b) - Number(a))];
  }, [sakipDocs, templates]);

  // Unified categories covering both Official Reports (SAKIP/DIPA/PPID) and Document Templates
  const categories = [
    'Semua',
    'SAKIP & Laporan',
    'DIPA & Anggaran',
    'PPID & Informasi',
    'Persidangan & Perkara',
    'Pengaduan & SIWAS',
    'Posbakum & Prodeo',
    'Standar Pelayanan & SOP',
    'Umum & Izin'
  ];

  const getTemplateFiscalYear = (t: DocumentTemplateItem): string => {
    const fromUpdate = t.tanggalUpdate?.match(/\b(20\d{2})\b/);
    if (fromUpdate) return fromUpdate[1];
    const fromTitle = t.judul?.match(/\b(20\d{2})\b/);
    if (fromTitle) return fromTitle[1];
    return '2026';
  };

  const matchesReportCategory = (doc: SakipDipaDocumentItem, cat: string): boolean => {
    if (cat === 'Semua') return true;
    const docKat = (doc.kategori || '').toUpperCase();
    const docSub = (doc.subKategori || '').toLowerCase();
    const docTitle = (doc.judul || '').toLowerCase();

    switch (cat) {
      case 'SAKIP & Laporan':
        return (
          docKat === 'SAKIP' ||
          docKat === 'LAPORAN_EVIDEN_ZI' ||
          docKat === 'LAPORAN_SURVEI' ||
          docKat === 'LHKPN' ||
          ['renstra', 'lkjip', 'iku', 'rkt', 'pk'].some(k => docSub.includes(k) || docTitle.includes(k))
        );
      case 'DIPA & Anggaran':
        return (
          docKat === 'DIPA' ||
          ['dipa', 'lra', 'calk', 'rkakl', 'anggaran'].some(k => docSub.includes(k) || docTitle.includes(k))
        );
      case 'PPID & Informasi':
        return (
          docKat === 'PPID' ||
          docKat === 'E_BROSUR' ||
          docSub.includes('ppid') ||
          docSub.includes('tahunan') ||
          docTitle.includes('ppid') ||
          docTitle.includes('informasi publik') ||
          docTitle.includes('laporan tahunan')
        );
      case 'Persidangan & Perkara':
        return (
          docKat === 'LAPORAN_PERKARA' ||
          docSub.includes('perkara') ||
          docSub.includes('putusan') ||
          docTitle.includes('perkara') ||
          docTitle.includes('putusan')
        );
      case 'Pengaduan & SIWAS':
        return (
          docKat === 'LHKPN' ||
          docSub.includes('siwas') ||
          docSub.includes('pengaduan') ||
          docTitle.includes('pengaduan') ||
          docTitle.includes('lhkpn')
        );
      case 'Posbakum & Prodeo':
        return (
          docKat === 'LAPORAN_POSBAKUM' ||
          docSub.includes('posbakum') ||
          docSub.includes('prodeo') ||
          docTitle.includes('posbakum') ||
          docTitle.includes('prodeo')
        );
      case 'Standar Pelayanan & SOP':
        return (
          docKat === 'STANDAR_PELAYANAN' ||
          docKat === 'MAKLUMAT' ||
          docKat === 'SK_SOP' ||
          docSub.includes('standar') ||
          docSub.includes('maklumat') ||
          docSub.includes('sop') ||
          docTitle.includes('standar pelayanan') ||
          docTitle.includes('maklumat')
        );
      case 'Umum & Izin':
        return (
          docSub.includes('umum') ||
          docTitle.includes('umum') ||
          docTitle.includes('kepegawaian')
        );
      default:
        return doc.kategori === cat || doc.subKategori === cat;
    }
  };

  const matchesTemplateCategory = (t: DocumentTemplateItem, cat: string): boolean => {
    if (cat === 'Semua') return true;
    if (t.kategori === cat) return true;
    const tTitle = t.judul.toLowerCase();
    const tDesc = t.deskripsi.toLowerCase();
    if (cat === 'DIPA & Anggaran') {
      return t.kategori === 'SAKIP & Laporan' && (tTitle.includes('anggaran') || tTitle.includes('lra') || tTitle.includes('dipa') || tDesc.includes('dipa'));
    }
    if (cat === 'Standar Pelayanan & SOP') {
      return tTitle.includes('sop') || tTitle.includes('standar') || tDesc.includes('standar');
    }
    return false;
  };

  const hasActiveFilter =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'Semua' ||
    selectedFiscalYear !== 'Semua';

  const matchesSubMenu = (doc: SakipDipaDocumentItem): boolean => {
    if (activeSubMenu === 'laporan-tahunan') {
      return Boolean(doc.subKategori?.toLowerCase().includes('tahunan') || doc.judul.toLowerCase().includes('tahunan') || doc.kategori === 'PPID');
    }
    if (activeSubMenu === 'lkjip') {
      return Boolean(doc.subKategori === 'LKjIP' || doc.judul.toLowerCase().includes('lkjip') || doc.judul.toLowerCase().includes('lakip'));
    }
    if (activeSubMenu === 'renstra') {
      return Boolean(doc.subKategori === 'Renstra' || doc.judul.toLowerCase().includes('renstra') || doc.subKategori === 'IKU');
    }
    if (activeSubMenu === 'rkt') {
      return Boolean(doc.subKategori === 'RKT' || doc.judul.toLowerCase().includes('rkt') || doc.judul.toLowerCase().includes('rencana kerja'));
    }
    if (activeSubMenu === 'perjanjian-kinerja') {
      return Boolean(doc.subKategori === 'PK' || doc.judul.toLowerCase().includes('perjanjian kinerja') || doc.subKategori === 'Rencana Aksi');
    }
    if (activeSubMenu === 'realisasi-anggaran') {
      return Boolean(doc.kategori === 'DIPA' || doc.subKategori?.includes('DIPA') || doc.subKategori === 'LRA' || doc.subKategori === 'RKAKL' || doc.subKategori === 'CALK');
    }
    return true;
  };

  const filteredSakipDocs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return sakipDocs.filter((doc) => {
      // 1. Keyword Search
      const matchQuery =
        !q ||
        doc.judul.toLowerCase().includes(q) ||
        (doc.nomorDokumen || '').toLowerCase().includes(q) ||
        doc.deskripsi.toLowerCase().includes(q) ||
        (doc.kategori || '').toLowerCase().includes(q) ||
        (doc.subKategori || '').toLowerCase().includes(q) ||
        (doc.penanggungJawab || '').toLowerCase().includes(q) ||
        String(doc.tahun || '').toLowerCase().includes(q);

      if (!matchQuery) return false;

      // 2. Fiscal Year Filter
      if (selectedFiscalYear !== 'Semua') {
        const docYearMatch =
          String(doc.tahun).trim() === selectedFiscalYear ||
          (doc.tanggalUpload && doc.tanggalUpload.includes(selectedFiscalYear)) ||
          doc.judul.includes(selectedFiscalYear);
        if (!docYearMatch) return false;
      }

      // 3. Category Filter
      if (selectedCategory !== 'Semua') {
        if (!matchesReportCategory(doc, selectedCategory)) return false;
      }

      // 4. Submenu filter (unless user is actively filtering across all documents)
      if (!hasActiveFilter || searchScope === 'tab-aktif') {
        return matchesSubMenu(doc);
      }

      return true;
    });
  }, [sakipDocs, searchQuery, selectedFiscalYear, selectedCategory, activeSubMenu, hasActiveFilter, searchScope]);

  // Only fallback to all sakipDocs when no active filter is set and a submenu has 0 items
  const displayedSakipDocs = hasActiveFilter
    ? filteredSakipDocs
    : (filteredSakipDocs.length > 0 ? filteredSakipDocs : sakipDocs);

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return templates.filter((t) => {
      // 1. Offline Filter Mode
      if (offlineFilterMode === 'sering-diunduh') {
        if ((t.jumlahDiunduh || 0) < 50) return false;
      }

      // 2. Category Filter
      if (!matchesTemplateCategory(t, selectedCategory)) return false;

      // 3. Fiscal Year Filter
      if (selectedFiscalYear !== 'Semua') {
        const tYear = getTemplateFiscalYear(t);
        const yearInText =
          tYear === selectedFiscalYear ||
          t.judul.includes(selectedFiscalYear) ||
          (t.teksTemplate && t.teksTemplate.includes(selectedFiscalYear));
        if (!yearInText) return false;
      }

      // 4. Keyword Search
      if (q) {
        const matchesQuery =
          t.judul.toLowerCase().includes(q) ||
          t.kodeDoc.toLowerCase().includes(q) ||
          t.deskripsi.toLowerCase().includes(q) ||
          t.kategori.toLowerCase().includes(q) ||
          getTemplateFiscalYear(t).includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [templates, selectedCategory, selectedFiscalYear, searchQuery, offlineFilterMode]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedFiscalYear('Semua');
    setSearchScope('semua');
    setOfflineFilterMode('semua');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyText = (t: DocumentTemplateItem) => {
    if (!t.teksTemplate) return;
    navigator.clipboard.writeText(t.teksTemplate);
    setCopiedId(t.id);
    
    // Auto-cache to IndexedDB on copy
    cacheTemplateToIndexedDb(t, true).then(() => {
      getTemplateCacheStats().then(setCacheStats).catch(() => {});
    });

    showToast(`Draf teks template '${t.kodeDoc}' berhasil disalin & tersimpan di IndexedDB!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const OFFICIAL_KOP_SURAT_TEXT = `MAHKAMAH AGUNG REPUBLIK INDONESIA
DIREKTORAT JENDERAL BADAN PERADILAN MILITER
DAN PERADILAN TATA USAHA NEGARA
PENGADILAN MILITER UTAMA
PENGADILAN MILITER TINGGI V MAKASSAR
Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar Sulawesi Selatan 90121
Email : dilmiti5makassar@gmail.com
========================================================================================`;

  const handleDownloadFile = (t: DocumentTemplateItem) => {
    let textContent = t.teksTemplate || `DOKUMEN RESMI PENGADILAN MILITER TINGGI V MAKASSAR\n${t.kodeDoc} - ${t.judul}\n\n${t.deskripsi}`;
    
    if (!textContent.includes('PENGADILAN MILITER UTAMA')) {
      textContent = `${OFFICIAL_KOP_SURAT_TEXT}\n\n${textContent}`;
    }

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${t.kodeDoc}_${t.judul.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    t.jumlahDiunduh += 1;
    CourtDB.saveDocumentTemplate(t);

    // Save/update in IndexedDB with incremented download count
    cacheTemplateToIndexedDb(t, true).then(() => {
      getTemplateCacheStats().then(setCacheStats).catch(() => {});
    });

    showToast(`File template '${t.kodeDoc}' berhasil diunduh & tersimpan di IndexedDB untuk akses offline!`);
  };

  const handleDownloadSakipDoc = (doc: SakipDipaDocumentItem) => {
    const content = `${OFFICIAL_KOP_SURAT_TEXT}

DOKUMEN RESMI AKUNTABILITAS & LAPORAN PENGADILAN MILITER TINGGI V MAKASSAR
==============================================================================
Judul Dokumen     : ${doc.judul}
Nomor Dokumen     : ${doc.nomorDokumen || '-'}
Kategori / Sub    : ${doc.kategori} / ${doc.subKategori}
Tahun Anggaran    : ${doc.tahun}
Penanggung Jawab  : ${doc.penanggungJawab}
Tanggal Publikasi : ${doc.tanggalUpload}

Uraian Substansi Dokumen:
${doc.deskripsi}

Dokumen ini dipublikasikan secara resmi sesuai Standar Keterbukaan Informasi Publik SK KMA Nomor 2-144/KMA/SK/VIII/2022.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName || `${doc.judul.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Save in IndexedDB
    cacheSakipDocToIndexedDb(doc, true).then(() => {
      getTemplateCacheStats().then(setCacheStats).catch(() => {});
    });

    showToast(`Dokumen '${doc.judul}' berhasil diunduh & di-cache di IndexedDB!`);
  };

  const sippCases = CourtDB.getSIPP();
  const diputusCount = sippCases.filter(c => (c as any).statusSidang === 'Putus' || (c as any).statusSidang === 'Minutasi' || (c.statusPerkara as string) === 'Putus' || c.statusPerkara === 'Minutasi').length;
  const berjalanCount = sippCases.length - diputusCount;

  const getActiveSubTitle = () => {
    switch (activeSubMenu) {
      case 'laporan-tahunan':
        return 'Laporan Tahunan & LKJIP';
      case 'lkjip':
        return 'LKJIP (Laporan Akuntabilitas Kinerja)';
      case 'renstra':
        return 'Rencana Strategis (Renstra 2025-2029)';
      case 'rkt':
        return 'Rencana Kerja Tahunan (RKT)';
      case 'perjanjian-kinerja':
        return 'Perjanjian Kinerja (PK)';
      case 'realisasi-anggaran':
      case 'dipa':
        return 'DIPA 01/05 & Realisasi Anggaran';
      case 'statistik-perkara':
        return 'Statistik Penanganan Perkara';
      case 'iku':
        return 'Indikator Kinerja Utama (IKU 2025-2029)';
      case 'buku-saku':
      case 'template-dokumen':
      case 'arsip-dokumen':
        return 'Buku Saku, SOP & Template Formulir';
      default:
        return 'Dokumen & Laporan Akuntabilitas';
    }
  };

  return (
    <section id="pusat-template-dokumen" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl border-2 border-emerald-300 flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 text-slate-950" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

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
          <span className="text-emerald-200 font-semibold">Dokumen &amp; Laporan</span>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-amber-300 font-black tracking-wide">{getActiveSubTitle()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('ppid', 'berkala')}
            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
            title="Buka Portal PPID Resmi"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portal PPID</span>
          </button>
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs hidden sm:inline">
            DOKUMEN
          </span>
        </div>
      </div>

      {/* IndexedDB Offline Cache & Resilience Status Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 rounded-2xl border-2 border-emerald-500/40 p-4 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-400/50 flex items-center justify-center shrink-0 text-amber-300 shadow-inner">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wide flex items-center gap-1.5">
                <span>IndexedDB Offline Storage Cache</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                  v1.0
                </span>
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                isOnline
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/50 animate-pulse'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
                <span>{isOnline ? 'Online (Terhubung)' : 'Mode Offline Aktif'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Tersimpan <strong>{cacheStats.templateCount} Template Formulir</strong> & <strong>{cacheStats.reportCount} Laporan Resmi</strong> di IndexedDB lokal browser Anda untuk akses cepat tanpa internet.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* Quick Offline Mode Filter Pills */}
          <div className="inline-flex items-center rounded-xl bg-slate-900 p-1 border border-slate-700 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setOfflineFilterMode('semua')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                offlineFilterMode === 'semua'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setOfflineFilterMode('sering-diunduh')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                offlineFilterMode === 'sering-diunduh'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'text-amber-300 hover:text-amber-200'
              }`}
              title="Filter template formulir yang paling sering diunduh"
            >
              <Sparkles className="w-3 h-3" />
              <span>Sering Diunduh</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => syncAllToIndexedDb(true)}
            disabled={isSyncingCache}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1.5 border border-emerald-400/40 disabled:opacity-50"
            title="Simpan atau perbarui seluruh arsip template ke IndexedDB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCache ? 'animate-spin' : ''}`} />
            <span>{isSyncingCache ? 'Menyimpan...' : 'Sinkronkan ke Offline'}</span>
          </button>
        </div>
      </div>

      {/* Dedicated Search & Filter Bar (Kategori & Tahun Anggaran) */}
      <div className="bg-white rounded-2xl border-2 border-emerald-800/20 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0A3D24] text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                Pencarian & Filter Terpadu Laporan & Template Dokumen
              </h3>
              <p className="text-[11px] text-slate-500">
                Saring dokumen akuntabilitas, laporan kinerja, realisasi DIPA, dan formulir berdasarkan kata kunci, kategori, atau tahun anggaran.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSearchScope('semua')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  searchScope === 'semua'
                    ? 'bg-[#0A3D24] text-amber-300 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Sub-Menu
              </button>
              <button
                type="button"
                onClick={() => setSearchScope('tab-aktif')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  searchScope === 'tab-aktif'
                    ? 'bg-[#0A3D24] text-amber-300 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sub-Menu Aktif
              </button>
            </div>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search Input */}
          <div className="md:col-span-6 relative">
            <label htmlFor="doc-template-search" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Kata Kunci Dokumen / Nomor SK / Kode Formulir
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="doc-template-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik judul laporan, LKJIP, DIPA, Renstra, nomor surat, atau kode..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0A3D24] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  title="Hapus kata kunci"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <label htmlFor="doc-category-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Filter Kategori Dokumen
            </label>
            <div className="relative">
              <Tag className="w-3.5 h-3.5 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="doc-category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0A3D24] focus:bg-white cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'Semua' ? 'Semua Kategori' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fiscal Year Dropdown */}
          <div className="md:col-span-3">
            <label htmlFor="doc-year-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Filter Tahun Anggaran (TA)
            </label>
            <div className="relative">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="doc-year-select"
                value={selectedFiscalYear}
                onChange={(e) => setSelectedFiscalYear(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0A3D24] focus:bg-white cursor-pointer"
              >
                {availableFiscalYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr === 'Semua' ? 'Semua Tahun Anggaran' : `Tahun Anggaran ${yr}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Fiscal Year Chips & Filter Status Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 mr-1">Tahun Anggaran:</span>
            {availableFiscalYears.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedFiscalYear(yr)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedFiscalYear === yr
                    ? 'bg-[#0A3D24] text-amber-300 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {yr === 'Semua' ? 'Semua Tahun' : `TA ${yr}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
              Laporan Resmi: <strong>{displayedSakipDocs.length}</strong> berkas
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
              Template & Arsip: <strong>{filteredTemplates.length}</strong> formulir
            </span>
          </div>
        </div>
      </div>

      {/* Active Submenu Banner Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {currentSubObj.badge}
              </span>
              {selectedCategory !== 'Semua' && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                  Kategori: {selectedCategory}
                </span>
              )}
              {selectedFiscalYear !== 'Semua' && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                  TA {selectedFiscalYear}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              {currentSubObj.title}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-3xl">
              {currentSubObj.desc}
            </p>
          </div>
        </div>

        {/* SUBMENU IKU: INDIKATOR KINERJA UTAMA */}
        {/* SUBMENU BUKU SAKU RESMI */}
        {activeSubMenu === 'buku-saku' ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#072414] via-[#0D4A2B] to-[#041B10] rounded-2xl border-2 border-amber-400/80 p-6 sm:p-8 text-white shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-military-camo-pattern opacity-15 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/20">
                <div className="space-y-2 text-center md:text-left">
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider shadow">
                    BUKU SAKU RESMI STANDAR 2026
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight">
                    Buku Saku Panduan Praktis & Pelayanan Peradilan Militer Tinggi V Makassar
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                    Dokumen panduan resmi digital komprehensif mengacu pada UU No. 31 Tahun 1997, PP No. 22 & 23 Tahun 2025, SK KMA No. 2-144, dan SK Dirjen Badilmiltun No. 593/2026.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const content = `MAHKAMAH AGUNG REPUBLIK INDONESIA
PENGADILAN MILITER TINGGI V MAKASSAR
======================================================================
BUKU SAKU RESMI & PANDUAN PRAKTIS LAYANAN PERADILAN MILITER (STANDAR 2026)

BAB I: PENDAHULUAN & DASAR HUKUM
- PP No. 22 Tahun 2025: Pembentukan Dilmilti V Makassar dan Dilmilti IV Balikpapan.
- Peresmian Operasional: Kamis, 9 Juli 2026 oleh Ketua Mahkamah Agung RI Prof. Dr. H. Sunarto, S.H., M.H.
- Motto: REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif) & Nilai Sulapa Eppa.

BAB II: WILAYAH YURISDIKSI (12 PROVINSI & 6 DILMIL)
1. Dilmil V-17 Makassar (Sulsel & Sulbar)
2. Dilmil V-18 Kendari (Sultra)
3. Dilmil V-19 Manado (Sulut, Sulteng & Gorontalo)
4. Dilmil V-20 Ambon (Maluku & Maluku Utara)
5. Dilmil V-21 Manokwari (Papua Barat & Papua Barat Daya)
6. Dilmil V-22 Jayapura (Papua, Papua Tengah, Papua Selatan & Papua Pegunungan)

BAB III: PELAYANAN TERPADU SATU PINTU (PTSP 6 MEJA)
- Meja 1: Pelayanan Pendaftaran Perkara Banding & Sengketa TUN
- Meja 2: Pelayanan Administrasi Persidangan & e-Court
- Meja 3: Pelayanan Produk Hukum (Salinan Putusan & Akta)
- Meja 4: Pelayanan Pos Bantuan Hukum (Posbakum & Prodeo)
- Meja 5: Pelayanan Pengaduan & Whistleblowing System (SIWAS)
- Meja 6: Pelayanan Informasi Publik (PPID & SK KMA 2-144)

BAB IV: PROSEDUR UPAYA HUKUM BANDING MILITER (SEMA & BUKU II)
- Batas Waktu Permohonan Banding: 7 hari terhitung sejak putusan dibacakan atau diberitahukan sah.
- Pendaftaran melalui e-Court / PTSP Dilmilti V Makassar.

BAB V: ZONA INTEGRITAS WBBM & PENGATURAN ANTI KORUPSI
- Komitmen 100% Bebas Pungli & Gratifikasi.
- Penilaian Survei IKM & IPAK Triwulanan melalui portal resmi survei.djmt.id/dilmilti_makassar.
`;
                      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'Buku_Saku_Resmi_Dilmilti_V_Makassar_2026.txt';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      showToast('Buku Saku Resmi berhasil diunduh!');
                    }}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Buku Saku (TXT/PDF)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer border border-white/20"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>Cetak Panduan</span>
                  </button>
                </div>
              </div>

              {/* Chapters Grid */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    chap: 'BAB I',
                    title: 'Pendahuluan & Dasar Hukum',
                    desc: 'PP No. 22 Tahun 2025, peresmian oleh Ketua MA RI Sunarto pada 9 Juli 2026, serta filosofi Motto REWAKO & Sulapa Eppa.',
                    icon: Compass,
                    color: 'from-emerald-900 to-emerald-950 border-emerald-500/50'
                  },
                  {
                    chap: 'BAB II',
                    title: 'Wilayah Yurisdiksi 12 Provinsi',
                    desc: 'Cakupan yurisdiksi peradilan militer tingkat banding di Kawasan Timur Indonesia serta pembinaan 6 Pengadilan Militer Tingkat Pertama.',
                    icon: ShieldCheck,
                    color: 'from-slate-900 to-emerald-950 border-amber-500/50'
                  },
                  {
                    chap: 'BAB III',
                    title: 'Standar 6 Meja PTSP',
                    desc: 'Panduan lengkap pelayanan pendaftaran banding, informasi perkara, e-Court, Posbakum, pengaduan SIWAS, dan PPID.',
                    icon: BookOpen,
                    color: 'from-emerald-950 to-slate-900 border-emerald-400/50'
                  },
                  {
                    chap: 'BAB IV',
                    title: 'Alur & Tenggat Banding Militer',
                    desc: 'Ketentuan tenggang waktu permohonan banding 7 hari, tata cara e-Filing, pembayaran e-Payment, dan e-Litigation.',
                    icon: Award,
                    color: 'from-slate-950 to-slate-900 border-amber-400/50'
                  },
                  {
                    chap: 'BAB V',
                    title: 'SIWAS & Whistleblowing',
                    desc: 'Mekanisme pengaduan dugaan pelanggaran kode etik dan disiplin hakim/aparatur secara rahasia dan aman melalui SIWAS MA-RI.',
                    icon: Target,
                    color: 'from-emerald-900 to-slate-950 border-emerald-500/50'
                  },
                  {
                    chap: 'BAB VI',
                    title: 'Zona Integritas WBBM',
                    desc: 'Komitmen pelayanan bebas dari korupsi, gratifikasi, serta partisipasi pengisian survei IKM & IPAK triwulanan.',
                    icon: Sparkles,
                    color: 'from-amber-950/80 to-slate-950 border-amber-500/60'
                  }
                ].map((item, i) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border-2 shadow-lg space-y-3 relative overflow-hidden group hover:-translate-y-1 transition-transform`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-amber-400 text-slate-950">
                          {item.chap}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                          <IconComp className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-sm font-black text-white font-serif group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-300 font-bold">
                        <span>Standar Resmi 2026</span>
                        <span className="font-mono">Hal. {i * 8 + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeSubMenu === 'iku' ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {(['SEMUA', 'Kepaniteraan', 'Kesekretariatan'] as const).map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setSelectedKategori(kat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedKategori === kat
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {kat}
                </button>
              ))}
              <input
                type="text"
                placeholder="Cari indikator..."
                value={searchQueryIku}
                onChange={(e) => setSearchQueryIku(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ikuList
                .filter((item) => {
                  const matchKategori = selectedKategori === 'SEMUA' || item.kategori === selectedKategori;
                  const matchQuery = !searchQueryIku.trim() || item.namaIndikator.toLowerCase().includes(searchQueryIku.toLowerCase());
                  return matchKategori && matchQuery;
                })
                .map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-sm">{item.namaIndikator}</h4>
                    <p className="text-xs text-slate-600 mt-1">{item.penjelasan}</p>
                    <div className="mt-2 text-xs font-mono font-bold">
                      Target: {item[`target${selectedYear}` as keyof IkuMiliterIndicator]} {item.satuan}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : activeSubMenu !== 'arsip-dokumen' ? (
          /* SUBMENU 1..6: TABEL DOKUMEN RESMI SAKIP / DIPA / LAPTAH */
          displayedSakipDocs.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Judul Dokumen & Laporan Resmi</th>
                    <th className="p-3.5">Nomor Dokumen</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Uraian & Substansi</th>
                    <th className="p-3.5 text-center">Tahun & Berkas</th>
                    <th className="p-3.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {displayedSakipDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => openReportVisualPreview(doc)}
                      className="hover:bg-emerald-50/60 transition-colors cursor-pointer group"
                    >
                      <td className="p-3.5 font-bold text-slate-900 group-hover:text-emerald-800">
                        <div className="flex items-center gap-1.5">
                          <span>{doc.judul}</span>
                          <Eye className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                          Penanggung Jawab: {doc.penanggungJawab}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-emerald-900 font-semibold">
                        {doc.nomorDokumen || '-'}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {doc.subKategori || doc.kategori}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 max-w-md leading-relaxed">
                        {doc.deskripsi}
                      </td>
                      <td className="p-3.5 text-center font-mono text-[11px]">
                        <strong className="text-slate-900">TA {doc.tahun}</strong>
                        <div className="text-[10px] text-emerald-700 font-bold">{doc.fileType} ({doc.fileSize})</div>
                        <div className="inline-flex items-center gap-0.5 text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-0.5">
                          <Database className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Offline</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openReportVisualPreview(doc);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Pratinjau</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadSakipDoc(doc);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#0A3D24] hover:bg-emerald-900 text-amber-300 font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
              <p className="text-xs font-bold text-slate-700">
                Tidak ditemukan laporan resmi yang sesuai dengan filter pencarian saat ini.
              </p>
              <p className="text-[11px] text-slate-500">
                Coba ubah pilihan Kategori, Tahun Anggaran, atau tekan tombol di bawah untuk menampilkan seluruh dokumen.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-1 px-3.5 py-1.5 rounded-lg bg-[#0A3D24] text-amber-300 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tampilkan Semua Dokumen</span>
              </button>
            </div>
          )
        ) : null}

        {/* SUBMENU 8 (OR ALWAYS AVAILABLE BELOW): ARSIP DOKUMEN & TEMPLATE FORMULIR */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-700" />
                <span>Arsip Dokumen Standar, SOP & Template Formulir Layanan Masyarakat</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik Pratinjau untuk membaca isi dokumen, Salin untuk menyalin draf surat, atau Unduh berkas resmi:
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0A3D24] text-amber-300 shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const templateYear = getTemplateFiscalYear(template);
                return (
                  <div
                    key={template.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openVisualPreview(template)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openVisualPreview(template);
                      }
                    }}
                    className="bg-slate-50/70 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-white transition-all p-4 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md group cursor-pointer text-left"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md uppercase">
                          {template.kategori}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(template.jumlahDiunduh || 0) >= 60 && (
                            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded flex items-center gap-1 shadow-2xs">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Sering Diunduh</span>
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300/80 text-[10px] font-bold rounded flex items-center gap-1" title="Tersimpan di IndexedDB browser lokal">
                            <Database className="w-2.5 h-2.5 text-emerald-600" />
                            <span>IndexedDB Ready</span>
                          </span>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">
                            TA {templateYear}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-mono font-bold rounded">
                            {template.kodeDoc}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                          {template.judul}
                        </h3>
                        <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" title="Klik untuk Pratinjau Visual">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {template.deskripsi}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-200/80">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />
                          <strong>{template.format}</strong> ({template.ukuranFile})
                        </span>
                        <span>{template.jumlahDiunduh}x diunduh</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openVisualPreview(template);
                          }}
                          className="px-2.5 py-2 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 border border-slate-200 hover:border-emerald-300"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Pratinjau</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyText(template);
                          }}
                          className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 border border-emerald-200"
                        >
                          {copiedId === template.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile(template);
                          }}
                          className="px-2.5 py-2 bg-[#0A3D24] hover:bg-emerald-900 text-amber-300 font-black text-[11px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
              <p className="text-xs font-bold text-slate-700">
                Tidak ada template formulir yang cocok dengan filter Kategori / Tahun Anggaran yang dipilih.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-1 px-3.5 py-1.5 rounded-lg bg-[#0A3D24] text-amber-300 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter Template</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visual Document & Template Preview Modal */}
      {previewTemplate && (() => {
        const currentTemplateIdx = filteredTemplates.findIndex(t => t.id === previewTemplate.id);
        const hasPrev = currentTemplateIdx > 0;
        const hasNext = currentTemplateIdx >= 0 && currentTemplateIdx < filteredTemplates.length - 1;
        const rawBody = previewTemplate.teksTemplate || previewTemplate.deskripsi;
        const placeholderMatches = Array.from(
          new Set((rawBody.match(/\[[^\]]+\]/g) || []).filter(m => m.trim() !== '[ ]'))
        );

        const renderFormattedVisualLine = (line: string, lineIdx: number) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={lineIdx} className="h-3" />;
          }
          if (/^={5,}$/.test(trimmed) || /^-{5,}$/.test(trimmed)) {
            return <hr key={lineIdx} className="border-slate-300 my-2" />;
          }

          // Split line by bracketed placeholders e.g. [Nama Pemohon] or [ ]
          const parts = line.split(/(\[[^\]]*\])/g);
          const isHeading =
            lineIdx === 0 ||
            /^(SURAT|FORMULIR|LAPORAN|TEMPLATE|DOKUMEN|BAB\s+[IVX]+|[IVX]+\.\s+[A-Z]|[A-Z]\.\s+[A-Z])/.test(trimmed);

          return (
            <div
              key={lineIdx}
              className={`${
                isHeading
                  ? 'font-black text-slate-900 tracking-tight mt-2 mb-1'
                  : 'text-slate-800'
              } leading-relaxed`}
            >
              {parts.map((part, pIdx) => {
                if (part === '[ ]') {
                  return (
                    <span
                      key={pIdx}
                      className="inline-flex items-center justify-center w-3.5 h-3.5 border border-slate-500 rounded-xs bg-white mx-1 align-middle"
                    />
                  );
                }
                if (part.startsWith('[') && part.endsWith(']')) {
                  return (
                    <span
                      key={pIdx}
                      className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-mono text-[11px] font-bold shadow-2xs"
                    >
                      {part}
                    </span>
                  );
                }
                return <span key={pIdx}>{part}</span>;
              })}
            </div>
          );
        };

        return (
          <div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
            onClick={() => setPreviewTemplate(null)}
          >
            <div
              className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Header & Toolbar */}
              <div className="bg-gradient-to-r from-[#0A3D24] via-[#0D4A2B] to-slate-950 px-5 py-4 border-b border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-md">
                    <LayoutTemplate className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono uppercase tracking-wider font-bold">
                        {previewTemplate.kodeDoc}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 text-[10px] font-bold">
                        {previewTemplate.kategori}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-slate-200 text-[10px] font-mono">
                        TA {getTemplateFiscalYear(previewTemplate)}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white mt-1 leading-snug">
                      {previewTemplate.judul}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* View Mode Switcher */}
                  <div className="inline-flex rounded-xl bg-slate-950/80 p-1 border border-white/15 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('visual')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        previewMode === 'visual'
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lembar Visual A4</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('raw')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        previewMode === 'raw'
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Teks Draf</span>
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  {previewMode === 'visual' && (
                    <div className="hidden md:inline-flex items-center rounded-xl bg-slate-950/80 p-1 border border-white/15 text-slate-300 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setPreviewZoom(z => Math.max(85, z - 10))}
                        className="p-1 hover:text-amber-300 cursor-pointer"
                        title="Perkecil tampilan"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-1.5 font-mono font-bold text-[10px]">{previewZoom}%</span>
                      <button
                        type="button"
                        onClick={() => setPreviewZoom(z => Math.min(125, z + 10))}
                        className="p-1 hover:text-amber-300 cursor-pointer"
                        title="Perbesar tampilan"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(null)}
                    className="p-2 text-slate-300 hover:text-white rounded-xl bg-white/10 hover:bg-rose-600/80 transition-colors cursor-pointer"
                    title="Tutup Pratinjau"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Visual A4 Paper Sheet + Metadata Sidebar */}
              <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Main Preview Area */}
                <div className="lg:col-span-8 flex flex-col items-center">
                  {previewMode === 'visual' ? (
                    <div
                      className={`w-full bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 relative overflow-hidden transition-all ${
                        previewZoom <= 90
                          ? 'text-[11px]'
                          : previewZoom >= 110
                          ? 'text-sm sm:text-base'
                          : 'text-xs sm:text-[13px]'
                      }`}
                    >
                      {/* Official Court Kop Surat Header */}
                      <div className="border-b-4 border-double border-slate-900 pb-3 mb-4 flex items-center gap-4 text-slate-900 font-serif">
                        <img 
                          src="/images/dilmilti_v_logo_transparent.png" 
                          alt="Logo Pengadilan Militer Tinggi V Makassar" 
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0" 
                        />
                        <div className="text-center flex-1 space-y-0.5">
                          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900 leading-tight">
                            MAHKAMAH AGUNG REPUBLIK INDONESIA
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-bold uppercase text-slate-900 leading-tight">
                            DIREKTORAT JENDERAL BADAN PERADILAN MILITER
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-bold uppercase text-slate-900 leading-tight">
                            DAN PERADILAN TATA USAHA NEGARA
                          </div>
                          <div className="text-xs sm:text-sm font-bold uppercase text-slate-900 leading-tight">
                            PENGADILAN MILITER UTAMA
                          </div>
                          <div className="text-sm sm:text-base font-black uppercase text-[#0A3D24] tracking-tight leading-tight">
                            PENGADILAN MILITER TINGGI V MAKASSAR
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-slate-800 pt-0.5 leading-tight font-sans">
                            Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar Sulawesi Selatan 90121
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-slate-800 leading-tight font-sans font-medium">
                            Email : <a href="mailto:dilmiti5makassar@gmail.com" className="text-blue-800 underline">dilmiti5makassar@gmail.com</a>
                          </div>
                        </div>
                      </div>

                      {/* Document Metadata Banner inside A4 Sheet */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500">Kode Dokumen:</span>{' '}
                          <strong className="font-mono text-slate-900">{previewTemplate.kodeDoc}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Kategori:</span>{' '}
                          <strong className="text-emerald-800">{previewTemplate.kategori}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Pemutakhiran:</span>{' '}
                          <strong className="text-slate-800">{previewTemplate.tanggalUpdate || 'TA 2026'}</strong>
                        </div>
                      </div>

                      {/* Formatted Document Lines */}
                      <div className="font-serif text-xs sm:text-[13px] space-y-1 pt-1">
                        {rawBody.split('\n').map((line, idx) => renderFormattedVisualLine(line, idx))}
                      </div>

                      {/* Official Stamp & Verification Footer */}
                      <div className="pt-6 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] text-slate-500">
                        <div className="flex items-center gap-2">
                          <Stamp className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>
                            Dokumen Standar Pelayanan Pengadilan Militer Tinggi V Makassar • SK Dirjen Badilmiltun Nomor 593/2026
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold shrink-0">
                          TERVERIFIKASI PTSP
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner border-l-4 border-l-amber-400">
                      {rawBody}
                    </div>
                  )}
                </div>

                {/* Right Metadata & Interactive Fields Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Informasi & Spesifikasi Dokumen</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {previewTemplate.deskripsi}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Format Berkas</span>
                        <strong className="text-white font-mono">{previewTemplate.format}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Ukuran File</span>
                        <strong className="text-white font-mono">{previewTemplate.ukuranFile}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Tahun Anggaran</span>
                        <strong className="text-amber-300 font-mono">TA {getTemplateFiscalYear(previewTemplate)}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Total Diunduh</span>
                        <strong className="text-emerald-400 font-mono">{previewTemplate.jumlahDiunduh}x</strong>
                      </div>
                    </div>
                  </div>

                  {/* Detected Fillable Placeholders */}
                  {placeholderMatches.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                          Kolom Isian Formulir ({placeholderMatches.length})
                        </h4>
                        <span className="text-[10px] text-slate-400">Otomatis Disorot</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Bagian bertanda kuning pada lembar pratinjau dapat disesuaikan saat pengajuan di meja PTSP atau setelah diunduh:
                      </p>
                      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                        {placeholderMatches.map((ph, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 font-mono text-[10px]"
                          >
                            {ph}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions Box */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Tindakan Cepat Dokumen
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(previewTemplate)}
                      className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Dokumen ({previewTemplate.format})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyText(previewTemplate)}
                      className="w-full py-2.5 px-4 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-500/40"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Salin Draf Teks ke Clipboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak Lembar Pratinjau</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer with Prev/Next Template Navigation */}
              <div className="bg-slate-950 px-5 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {currentTemplateIdx >= 0 && (
                    <>
                      <button
                        type="button"
                        disabled={!hasPrev}
                        onClick={() => hasPrev && openVisualPreview(filteredTemplates[currentTemplateIdx - 1])}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 border transition-all ${
                          hasPrev
                            ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700 cursor-pointer'
                            : 'bg-slate-900/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Sebelumnya</span>
                      </button>
                      <span className="text-[11px] text-slate-400 font-mono px-2">
                        {currentTemplateIdx + 1} / {filteredTemplates.length}
                      </span>
                      <button
                        type="button"
                        disabled={!hasNext}
                        onClick={() => hasNext && openVisualPreview(filteredTemplates[currentTemplateIdx + 1])}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 border transition-all ${
                          hasNext
                            ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700 cursor-pointer'
                            : 'bg-slate-900/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
                        }`}
                      >
                        <span>Berikutnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  Klik di luar jendela atau tombol <strong className="text-white">X</strong> untuk menutup pratinjau visual
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};

export default DocumentTemplatesSection;
