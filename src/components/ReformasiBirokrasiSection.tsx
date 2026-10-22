import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Lock, 
  Users, 
  FileSpreadsheet, 
  Sparkles,
  FileText,
  Download,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Calendar,
  ExternalLink,
  Building,
  Check,
  Upload,
  X,
  FileCheck,
  Layers,
  AlertCircle,
  Trash2,
  UserCheck,
  User
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { ReformasiEvidenItem, UserAccount } from '../types';
import { isStaffUser, ROLE_CONFIGS } from '../utils/rbac';
import { syncRouteToUrl } from '../utils/urlRouter';
import { getFreshImageUrl, handleImageFallback, DEFAULT_OFFICIAL_AVATAR } from '../utils/imageHelper';

interface ReformasiBirokrasiSectionProps {
  currentUser?: UserAccount | null;
  onNavigateToAdmin?: () => void;
  onOpenAuth?: () => void;
  initialSubTab?: string;
  onNavigate?: (tab: string, subTab?: string) => void;
}

export default function ReformasiBirokrasiSection({
  currentUser,
  onNavigateToAdmin,
  onOpenAuth,
  initialSubTab = 'zona-integritas',
  onNavigate
}: ReformasiBirokrasiSectionProps) {
  const [activeSubMenu, setActiveSubMenu] = useState<string>(initialSubTab || 'zona-integritas');
  const [activeArea, setActiveArea] = useState<number>(1);
  const [evidenList, setEvidenList] = useState<ReformasiEvidenItem[]>(() => CourtDB.getReformasiEviden());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<number | 'ALL'>('ALL');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubMenu(initialSubTab);
      if (initialSubTab === 'role-model' || initialSubTab === 'agen-perubahan') {
        setActiveArea(1);
        setSelectedAreaFilter(1);
      } else if (initialSubTab === 'smap' || initialSubTab === 'manajemen-risiko' || initialSubTab === 'pengawasan') {
        setActiveArea(5);
        setSelectedAreaFilter(5);
      } else if (initialSubTab === 'monev' || initialSubTab === 'akuntabilitas') {
        setActiveArea(4);
        setSelectedAreaFilter(4);
      } else if (initialSubTab === 'pelayanan-publik') {
        setActiveArea(6);
        setSelectedAreaFilter(6);
      } else {
        setSelectedAreaFilter('ALL');
      }
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (activeSubMenu) {
      syncRouteToUrl('reformasi', activeSubMenu, true);
    }
  }, [activeSubMenu]);

  const rbSubMenus = [
    {
      id: 'zona-integritas',
      label: 'Zona Integritas (WBK & WBBM)',
      badge: '6 Area Perubahan • WBK Menuju WBBM',
      title: 'Pembangunan Zona Integritas Menuju WBK & WBBM (PermenPAN-RB No. 90/2021)',
      desc: 'Komitmen menyeluruh Pimpinan, Hakim Militer Tinggi, dan seluruh aparatur Pengadilan Militer Tinggi V Makassar dalam mewujudkan Wilayah Bebas dari Korupsi (WBK) dan Wilayah Birokrasi Bersih & Melayani (WBBM) di 6 Area Perubahan.',
      docTitle: 'SK Pembentukan Tim Pembangunan Zona Integritas & Rencana Aksi WBBM TA 2026',
      docNumber: 'W5-Mil.01/OT.01.1/SK/ZI-01/I/2026',
      points: [
        'Penandatanganan Pakta Integritas & Pencanangan Publik Zona Integritas bersama Forkopimda & Oditurat Militer Tinggi',
        'Zero Tolerance terhadap pungutan liar (Pungli), suap, dan gratifikasi dengan Indeks Kepuasan Masyarakat (IKM) 98.42%',
        'Pemenuhan 100% Lembar Kerja Evaluasi (LKE) Komponen Pengungkit dan Komponen Hasil'
      ]
    },
    {
      id: 'role-model',
      label: 'Role Model Pimpinan',
      badge: 'Area I • Keteladanan Pimpinan',
      title: 'Penetapan Role Model Pimpinan Pengadilan Militer Tinggi V Makassar TA 2026',
      desc: 'Penetapan Role Model Pimpinan sebagai teladan utama integritas, penegakan disiplin militer, anti gratifikasi, serta kepemimpinan strategis menuju Wilayah Birokrasi Bersih dan Melayani (WBBM).',
      docTitle: 'SK Penetapan Role Model Pimpinan Pengadilan Militer Tinggi V Makassar TA 2026',
      docNumber: 'W5-Mil.01/KP.04.6/SK/RM-01/I/2026',
      points: [
        'SK Kepala Pengadilan Militer Tinggi V Makassar tentang Penetapan Role Model Pimpinan Tahun 2026',
        'Keteladanan kepatuhan LHKPN 100%, disiplin kehadiran, serta pembinaan aparatur peradilan militer',
        'Evaluasi berkala keteladanan pimpinan dalam pembangunan Zona Integritas WBK menuju WBBM'
      ]
    },
    {
      id: 'agen-perubahan',
      label: 'Agen Perubahan (Agent of Change)',
      badge: 'Area I • Manajemen Perubahan',
      title: 'Penetapan Agen Perubahan (Agent of Change) & Program Kerja Perubahan TA 2026',
      desc: 'Pemilihan Agen Perubahan secara demokratis dari unsur Hakim Militer, Kepaniteraan, dan Kesekretariatan sebagai katalisator budaya kerja BerAKHLAK dan inovasi pelayanan publik.',
      docTitle: 'SK Penetapan Agen Perubahan beserta Rencana Tindak Program Kerja Perubahan TA 2026',
      docNumber: 'W5-Mil.01/KP.04.6/SK/AOC-02/I/2026',
      points: [
        'SK Kepala Pengadilan Militer Tinggi V Makassar tentang Penetapan Agen Perubahan Tahun 2026',
        'Rencana Tindak Agen Perubahan (Action Plan) pada peningkatan kepatuhan SIPP dan layanan PTSP',
        'Laporan Monitoring dan Evaluasi Bulanan Pelaksanaan Program Budaya Kerja BerAKHLAK'
      ]
    },
    {
      id: 'smap',
      label: 'SMAP (Anti Penyuapan)',
      badge: 'SNI ISO 37001:2016',
      title: 'Sistem Manajemen Anti Penyuapan (SMAP)',
      desc: 'Implementasi standar internasional SNI ISO 37001:2016 untuk mendeteksi, mencegah, dan menangani risiko penyuapan pada seluruh proses bisnis kepaniteraan maupun kesekretariatan.',
      docTitle: 'Pedoman & Kebijakan Sistem Manajemen Anti Penyuapan (SMAP) SNI ISO 37001:2016',
      docNumber: 'W5-Mil.01/OT.01.3/SK/SMAP-05/I/2026',
      points: [
        'Kebijakan Anti Penyuapan yang ditandatangani Kepala Pengadilan dan disosialisasikan kepada seluruh pihak berperkara',
        'Pelaksanaan Uji Kelayakan (Due Diligence) terhadap mitra kerja, penyedia barang/jasa, dan personel',
        'Audit Internal SMAP berkala oleh Fungsi Kepatuhan Anti Penyuapan (FKAP)'
      ]
    },
    {
      id: 'manajemen-risiko',
      label: 'Manajemen Risiko (SPIP)',
      badge: 'SPIP • Register & Peta Risiko',
      title: 'Manajemen Risiko & Sistem Pengendalian Intern Pemerintah (SPIP)',
      desc: 'Identifikasi, analisis, dan mitigasi risiko operasional maupun hukum secara sistematis pada seluruh tahapan penyelesaian perkara dan pengelolaan anggaran satuan kerja.',
      docTitle: 'SK Satgas SPIP & Dokumen Register Risiko (Risk Register) Kepaniteraan dan Kesekretariatan TA 2026',
      docNumber: 'W5-Mil.01/OT.01.1/SK/MR-06/I/2026',
      points: [
        'Penyusunan Register Risiko (Risk Register) dan Peta Risiko Tahunan Kepaniteraan & Kesekretariatan',
        'Rencana Tindak Pengendalian (RTP) atas risiko keterlambatan minutasi dan keamanan persidangan',
        'Pengendalian Benturan Kepentingan (Conflict of Interest) dan Unit Pengendalian Gratifikasi (UPG)'
      ]
    },
    {
      id: 'monev',
      label: 'Monitoring & Evaluasi (Monev) RB',
      badge: 'LKE • Evaluasi Berkala ZI',
      title: 'Monitoring & Evaluasi (Monev) Pelaksanaan Reformasi Birokrasi & Tindak Lanjut Pengawasan',
      desc: 'Evaluasi berkala atas ketercapaian target Rencana Aksi Pembangunan Zona Integritas di 6 Area Perubahan serta tindak lanjut hasil pengawasan internal maupun eksternal.',
      docTitle: 'Laporan Hasil Monitoring dan Evaluasi (Monev) Pembangunan Zona Integritas & TLHP Hawasbid TA 2026',
      docNumber: 'W5-Mil.01/PW.01/LAP/MONEV-ZI/III/2026',
      points: [
        'Laporan Monitoring dan Evaluasi (Monev) Triwulanan Rencana Aksi Pembangunan Zona Integritas',
        'Tindak lanjut 100% atas rekomendasi pengawasan Hakim Pengawas Bidang (Hawasbid) dan Bawas MA RI',
        'Evaluasi Survei Persepsi Anti Korupsi (IPAK) dan Survei Kepuasan Masyarakat (IKM)'
      ]
    }
  ];

  const currentSubMenuObj = rbSubMenus.find(m => m.id === activeSubMenu) || rbSubMenus[0];

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<ReformasiEvidenItem | null>(null);

  // Upload Eviden Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadJudul, setUploadJudul] = useState('');
  const [uploadNomorSurat, setUploadNomorSurat] = useState('');
  const [uploadAreaId, setUploadAreaId] = useState<number>(1);
  const [uploadTahun, setUploadTahun] = useState('2026');
  const [uploadKeterangan, setUploadKeterangan] = useState('');
  const [uploadFileType, setUploadFileType] = useState<'PDF' | 'XLSX' | 'DOCX' | 'ZIP' | 'IMAGE'>('PDF');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileSize, setUploadFileSize] = useState('');
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [uploadDiuploadOleh, setUploadDiuploadOleh] = useState('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setEvidenList(CourtDB.getReformasiEviden());
    };
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleUpdate);
  }, []);

  const areas = [
    {
      id: 1,
      title: 'Area I: Manajemen Perubahan',
      icon: Users,
      desc: 'Pembangunan pola pikir (mindset) dan budaya kerja (culture set) aparatur berakhlak, berintegritas militer tinggi, serta penetapan Role Model dan Agen Perubahan.',
      capaian: '100% Aparatur telah menandatangani Pakta Integritas & Deklarasi Komitmen Bersama WBBM.'
    },
    {
      id: 2,
      title: 'Area II: Penataan Tatalaksana',
      icon: FileSpreadsheet,
      desc: 'Penerapan Sistem Pemerintahan Berbasis Elektronik (SPBE), digitalisasi persuratan, e-Court, dan kepatuhan Standar Operasional Prosedur (SOP) di seluruh unit kerja.',
      capaian: 'Seluruh SOP telah diintegrasikan dengan aplikasi digital dan diaudit berkala per triwulan.'
    },
    {
      id: 3,
      title: 'Area III: Manajemen SDM Aparatur',
      icon: TrendingUp,
      desc: 'Pengembangan kompetensi hakim militer dan aparatur, penegakan disiplin prajurit militer, evaluasi kinerja berbasis SKP, dan pola mutasi transparan.',
      capaian: 'Nol pelanggaran disiplin prajurit militer selama tahun anggaran 2026 berjalan.'
    },
    {
      id: 4,
      title: 'Area IV: Penguatan Akuntabilitas',
      icon: ShieldCheck,
      desc: 'Pengelolaan anggaran DIPA yang transparan dan akuntabel, penyusunan Laporan Kinerja Instansi Pemerintah (LKjIP), serta pencapaian Indikator Kinerja Utama (IKU).',
      capaian: 'Nilai SAKIP predikat "A" (Sangat Memuaskan) dari Badan Pengawasan MA-RI.'
    },
    {
      id: 5,
      title: 'Area V: Penguatan Pengawasan',
      icon: Lock,
      desc: 'Penerapan Sistem Manajemen Anti Penyuapan (SMAP) SNI ISO 37001:2016, penanganan benturan kepentingan, Unit Pengendalian Gratifikasi (UPG), dan Whistleblowing System.',
      capaian: 'Terakreditasi ISO 37001 SMAP dengan predikat Zero Tolerance terhadap gratifikasi & pungli.'
    },
    {
      id: 6,
      title: 'Area VI: Kualitas Pelayanan Publik',
      icon: Sparkles,
      desc: 'Peningkatan sarana PTSP, penyediaan akses ramah disabilitas, inovasi bot notifikasi WhatsApp real-time, dan pemantauan berkala indeks kepuasan masyarakat (IKM).',
      capaian: 'Indeks Kepuasan Masyarakat (IKM) mencapai 98.4% (Sangat Baik).'
    }
  ];

  const getAreaNameById = (id: number) => {
    if (id === 0) return 'Dokumen LKE & SK Tim Kerja';
    const found = areas.find(a => a.id === id);
    return found ? found.title : `Area ${id}`;
  };

  // Filter eviden documents
  const filteredEviden = evidenList.filter(item => {
    // Area Filter
    if (selectedAreaFilter !== 'ALL' && item.areaId !== selectedAreaFilter) {
      return false;
    }
    // Year Filter
    if (selectedYearFilter !== 'ALL' && item.tahun !== selectedYearFilter) {
      return false;
    }
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchJudul = item.judulDokumen.toLowerCase().includes(q);
      const matchNomor = item.nomorSurat.toLowerCase().includes(q);
      const matchKeterangan = item.keterangan.toLowerCase().includes(q);
      const matchArea = item.areaName.toLowerCase().includes(q);
      return matchJudul || matchNomor || matchKeterangan || matchArea;
    }
    return true;
  });

  // Handle local file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    // Format file size
    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb >= 1) {
      setUploadFileSize(`${sizeInMb.toFixed(1)} MB`);
    } else {
      setUploadFileSize(`${Math.max(1, Math.round(file.size / 1024))} KB`);
    }

    // Detect format
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    if (['PDF'].includes(ext)) setUploadFileType('PDF');
    else if (['XLS', 'XLSX', 'CSV'].includes(ext)) setUploadFileType('XLSX');
    else if (['DOC', 'DOCX'].includes(ext)) setUploadFileType('DOCX');
    else if (['ZIP', 'RAR', '7Z'].includes(ext)) setUploadFileType('ZIP');
    else if (['JPG', 'JPEG', 'PNG', 'WEBP'].includes(ext)) setUploadFileType('IMAGE');

    // Read as Data URL so it can be previewed/downloaded
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setUploadFileUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenUploadModal = () => {
    setUploadJudul('');
    setUploadNomorSurat(`W5-Mil.01/OT.01.1/EVIDEN/0${uploadAreaId}/2026`);
    setUploadAreaId(activeArea);
    setUploadTahun('2026');
    setUploadKeterangan('');
    setUploadFileType('PDF');
    setUploadFileName('');
    setUploadFileSize('');
    setUploadFileUrl('');
    setUploadDiuploadOleh(currentUser ? currentUser.nama : 'Sekretariat Tim ZI Dilmilti V Makassar');
    setUploadSuccessMessage(null);
    setIsUploadModalOpen(true);
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadJudul.trim()) {
      alert('Judul dokumen eviden wajib diisi!');
      return;
    }

    const finalFileName = uploadFileName.trim() || `${uploadJudul.replace(/\s+/g, '_').substring(0, 30)}.pdf`;
    const finalFileSize = uploadFileSize || '2.1 MB';
    const finalFileUrl = uploadFileUrl || `https://dilmilti-makassar.go.id/dokumen/zi/${finalFileName}`;

    CourtDB.addReformasiEviden({
      areaId: uploadAreaId,
      areaName: getAreaNameById(uploadAreaId),
      judulDokumen: uploadJudul.trim(),
      nomorSurat: uploadNomorSurat.trim() || 'W5-Mil.01/OT.01.1/SK/2026',
      tahun: uploadTahun,
      fileUrl: finalFileUrl,
      fileName: finalFileName,
      fileSize: finalFileSize,
      fileType: uploadFileType,
      keterangan: uploadKeterangan.trim() || 'Dokumen eviden pendukung lembar kerja evaluasi Zona Integritas.',
      statusVerifikasi: 'Terverifikasi',
      diuploadOleh: uploadDiuploadOleh.trim() || 'Petugas Tim ZI'
    });

    setUploadSuccessMessage('Dokumen eviden berhasil diunggah dan diverifikasi!');
    setTimeout(() => {
      setIsUploadModalOpen(false);
      setUploadSuccessMessage(null);
    }, 1200);
  };

  const canManageEviden = currentUser?.role === 'super_admin' || currentUser?.role === 'admin_kesekretariatan';

  const handleDeleteEviden = (item: ReformasiEvidenItem) => {
    if (!canManageEviden) {
      alert('Akses Ditolak: Hanya Super Admin dan Admin Kesekretariatan yang berwenang menghapus eviden ZI!');
      return;
    }
    if (window.confirm(`Hapus dokumen eviden ZI:\n"${item.judulDokumen}" (${item.nomorSurat})?`)) {
      CourtDB.deleteReformasiEviden(item.id);
      setEvidenList(CourtDB.getReformasiEviden());
    }
  };

  const handleSimulateDownload = (item: ReformasiEvidenItem) => {
    if (item.fileUrl && item.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = item.fileUrl;
      a.download = item.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create a mock blob download for standard demonstration
      const blob = new Blob(
        [
          `PENGADILAN MILITER TINGGI V MAKASSAR\nDOKUMEN EVIDEN ZONA INTEGRITAS (WBK MENUJU WBBM)\n\nJudul: ${item.judulDokumen}\nNomor Surat: ${item.nomorSurat}\nArea: ${item.areaName}\nTahun: ${item.tahun}\nStatus: ${item.statusVerifikasi}\nTanggal Upload: ${item.tanggalUpload}\nDiupload Oleh: ${item.diuploadOleh}\n\nKeterangan:\n${item.keterangan}\n\nDokumen ini merupakan arsip resmi eviden pembangunan Zona Integritas Pengadilan Militer Tinggi V Makassar sesuai PERMENPAN-RB.`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.fileName.endsWith('.pdf') ? item.fileName : `${item.fileName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getActiveSubTitle = () => {
    switch (activeSubMenu) {
      case 'zona-integritas':
        return 'Zona Integritas (WBK & WBBM)';
      case 'role-model':
        return 'Profil Role Model Pimpinan';
      case 'agen-perubahan':
        return 'Profil Agen Perubahan';
      case 'smap':
        return 'SMAP (Anti Penyuapan ISO 37001)';
      case 'manajemen-risiko':
        return 'Manajemen Risiko (SPIP)';
      case 'monev':
        return 'Monitoring & Evaluasi RB';
      default:
        return 'Reformasi Birokrasi';
    }
  };

  return (
    <section id="reformasi-birokrasi-section" className="space-y-6">
      
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
          <span className="text-emerald-200 font-semibold">Reformasi Birokrasi</span>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-amber-300 font-black tracking-wide">{getActiveSubTitle()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenUploadModal}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
            <span>Unggah Eviden</span>
          </button>
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs hidden sm:inline">
            WBK menuju WBBM
          </span>
        </div>
      </div>

      {/* Submenu Content Area */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">

        {/* Highlight Card for Active Submenu */}
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl border border-emerald-200 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-900 text-amber-300">
                {currentSubMenuObj.badge}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-950 mt-1">
                {currentSubMenuObj.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() =>
                handleSimulateDownload({
                  id: `rb-sub-${currentSubMenuObj.id}`,
                  areaId: activeArea,
                  areaName: currentSubMenuObj.label,
                  judulDokumen: currentSubMenuObj.docTitle,
                  nomorSurat: currentSubMenuObj.docNumber,
                  tahun: '2026',
                  fileUrl: '',
                  fileName: `${currentSubMenuObj.docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
                  fileSize: '1.8 MB',
                  fileType: 'PDF',
                  tanggalUpload: '05 Januari 2026',
                  keterangan: `${currentSubMenuObj.desc}\n\nPokok Muatan:\n- ${currentSubMenuObj.points.join('\n- ')}`,
                  statusVerifikasi: 'Terverifikasi',
                  diuploadOleh: 'Sekretariat Tim ZI Dilmilti V Makassar'
                })
              }
              className="px-4 py-2.5 rounded-xl bg-[#072416] hover:bg-emerald-900 text-amber-300 border border-amber-400/50 text-xs font-black flex items-center gap-2 cursor-pointer shadow-sm transition-all shrink-0"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Unduh SK / Dokumen Utama ({currentSubMenuObj.docNumber})</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {currentSubMenuObj.desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentSubMenuObj.points.map((pt, index) => (
              <div key={index} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-800 leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>

          {/* Dedicated Separated Profile Cards when Role Model or Agen Perubahan is selected */}
          {(activeSubMenu === 'role-model' || activeSubMenu === 'agen-perubahan') && (
            <div className="pt-4 border-t border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#072416]" />
                  <span>
                    {activeSubMenu === 'role-model'
                      ? 'Daftar Pejabat Role Model Pimpinan Dilmilti V Makassar'
                      : 'Daftar Pejabat & Aparatur Agen Perubahan Dilmilti V Makassar'}
                  </span>
                </h4>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('tentang', activeSubMenu)}
                    className="text-[11px] font-bold text-emerald-800 hover:text-amber-700 underline cursor-pointer"
                  >
                    Buka Halaman Profil Lengkap →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CourtDB.getRoleModelAgents()
                  .filter((item) =>
                    activeSubMenu === 'role-model'
                      ? item.tipe === 'Role Model'
                      : item.tipe === 'Agen Perubahan'
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-xl border-2 border-emerald-900/15 hover:border-amber-400 transition-all shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4"
                    >
                      <img
                        src={getFreshImageUrl(item.fotoUrl)}
                        alt={item.nama}
                        onError={(e) => handleImageFallback(e, DEFAULT_OFFICIAL_AVATAR)}
                        loading="lazy"
                        decoding="async"
                        className="w-20 h-28 rounded-xl object-cover object-top border-2 border-amber-400 shrink-0 bg-slate-100"
                      />
                      <div className="space-y-1.5 text-center sm:text-left">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase inline-block ${
                          item.tipe === 'Role Model'
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-[#072416] text-amber-300'
                        }`}>
                          {item.tipe}
                        </span>
                        <div className="font-black text-slate-900 text-sm">{item.nama}</div>
                        <div className="text-xs font-bold text-emerald-800">{item.jabatan}</div>
                        <p className="text-[11px] text-slate-600 italic">"{item.komitmenKerja}"</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. 6 Areas of Reform Navigation Grid */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              <span>6 Area Perubahan Reformasi Birokrasi (PermenPAN-RB No. 90/2021)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih area di bawah untuk membaca fokus perubahan dan menyaring dokumen eviden pendukung.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedAreaFilter('ALL');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedAreaFilter === 'ALL'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tampilkan Semua Eviden ({evidenList.length})
            </button>
          </div>
        </div>

        {/* 6 Area Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {areas.map((a) => {
            const Icon = a.icon;
            const isSelected = activeArea === a.id;
            const areaEvidenCount = evidenList.filter(e => e.areaId === a.id).length;

            return (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setActiveArea(a.id);
                  setSelectedAreaFilter(a.id);
                }}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#072416] text-white border-amber-400 shadow-lg ring-2 ring-amber-400/50'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-mono font-black ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                    0{a.id}
                  </span>
                </div>
                
                <div>
                  <div className="text-xs font-bold leading-tight line-clamp-2">
                    {a.title.split(':')[1]}
                  </div>
                  <div className={`text-[10px] mt-1 font-semibold ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`}>
                    {areaEvidenCount} Dokumen
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Area Highlight Detail */}
        {(() => {
          const curr = areas.find((a) => a.id === activeArea) || areas[0];
          const Icon = curr.icon;
          const currEviden = evidenList.filter(e => e.areaId === curr.id);

          return (
            <div className="p-5 bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50/40 border-2 border-emerald-200 rounded-xl space-y-4 text-xs shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#072416] text-amber-300 rounded-xl shadow-md border border-amber-400/40">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-950 text-sm sm:text-base">{curr.title}</h4>
                    <span className="text-[11px] text-emerald-800 font-bold">
                      Komponen Pengungkit Pembangunan Zona Integritas
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedAreaFilter(curr.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter Eviden Area Ini ({currEviden.length})</span>
                  </button>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm font-medium">
                {curr.desc}
              </p>

              <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-slate-800 flex items-start gap-2.5 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-xs uppercase font-extrabold">Capaian Kinerja Utama:</strong>
                  <span className="text-xs text-slate-600 font-medium">{curr.capaian}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 3. Eviden Repository Table & Interactive Explorer */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
        
        {/* Repository Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              <span>Repositori Dokumen Eviden & Lembar Kerja Evaluasi (LKE)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Seluruh berkas SK, SOP, Laporan Kinerja, dan Sertifikat SMAP dapat diunduh untuk verifikasi publik
            </p>
          </div>

          {/* Quick Action Button with Role Enforcement */}
          <div className="flex flex-wrap items-center gap-2">
            {canManageEviden ? (
              <button
                type="button"
                onClick={handleOpenUploadModal}
                className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-emerald-600"
              >
                <Upload className="w-3.5 h-3.5 text-amber-300" />
                <span>Unggah Dokumen Eviden</span>
                <span className="text-[9px] bg-amber-400 text-slate-950 px-1 py-0.5 rounded font-black">CRUD</span>
              </button>
            ) : isStaffUser(currentUser) ? (
              <div 
                className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-500 text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed"
                title="Akses Unggah Dokumen Eviden ZI dibatasi khusus untuk Admin Kesekretariatan & Super Admin"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Unggah (Khusus Kesekretariatan)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Login Petugas Pengadilan untuk mengunggah dokumen eviden"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Login Petugas untuk Unggah</span>
              </button>
            )}

            {onNavigateToAdmin && isStaffUser(currentUser) && (
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Kelola di Admin Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </button>
            )}
          </div>
        </div>

        {/* Public vs Admin Transparent RBAC Notice Banner */}
        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Keterbukaan Informasi Publik:</strong> Seluruh berkas eviden, SK, dan LKE dapat diunduh bebas oleh publik/pencari keadilan untuk verifikasi akuntabilitas.
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 shrink-0 bg-white px-2 py-0.5 rounded border border-emerald-300">
            {canManageEviden ? 'Akses Kelola Aktif' : 'Akses Publik / Tamu (Unduh Bebas)'}
          </span>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari judul dokumen, nomor surat, kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* Filter Area Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedAreaFilter}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedAreaFilter(val === 'ALL' ? 'ALL' : Number(val));
              }}
              className="w-full py-2 px-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="ALL">Semua Area Perubahan ({evidenList.length})</option>
              <option value={1}>Area I: Manajemen Perubahan</option>
              <option value={2}>Area II: Penataan Tatalaksana</option>
              <option value={3}>Area III: Manajemen SDM Aparatur</option>
              <option value={4}>Area IV: Penguatan Akuntabilitas</option>
              <option value={5}>Area V: Penguatan Pengawasan</option>
              <option value={6}>Area VI: Kualitas Pelayanan Publik</option>
              <option value={0}>Dokumen LKE PMPRB & Umum</option>
            </select>
          </div>

          {/* Filter Year Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="w-full py-2 px-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="ALL">Semua Tahun Anggaran</option>
              <option value="2026">Tahun Anggaran 2026</option>
              <option value="2025">Tahun Anggaran 2025</option>
            </select>
          </div>

        </div>

        {/* Filter Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Menampilkan <strong className="text-slate-900 font-bold">{filteredEviden.length}</strong> dokumen eviden
            {selectedAreaFilter !== 'ALL' && (
              <span> • Kategori: <strong className="text-emerald-700">{getAreaNameById(selectedAreaFilter as number)}</strong></span>
            )}
            {selectedYearFilter !== 'ALL' && (
              <span> • Tahun: <strong className="text-slate-800">{selectedYearFilter}</strong></span>
            )}
          </div>

          {(selectedAreaFilter !== 'ALL' || selectedYearFilter !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedAreaFilter('ALL');
                setSelectedYearFilter('ALL');
                setSearchQuery('');
              }}
              className="text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Eviden List (Cards & Table) */}
        {filteredEviden.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-extrabold text-slate-800">Tidak ada dokumen eviden yang cocok</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Silakan ubah filter area, tahun anggaran, atau kata kunci pencarian Anda untuk menampilkan berkas lainnya.
            </p>
            <button
              type="button"
              onClick={handleOpenUploadModal}
              className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors"
            >
              Unggah Dokumen Baru
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#072416] text-white uppercase text-[11px] font-black tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Dokumen Eviden & Nomor Surat</th>
                  <th className="px-4 py-3.5">Area Perubahan</th>
                  <th className="px-4 py-3.5">Tahun / Berkas</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEviden.map((item, idx) => {
                  const isEven = idx % 2 === 0;

                  return (
                    <tr key={item.id} className={`${isEven ? 'bg-white' : 'bg-slate-50/60'} hover:bg-emerald-50/40 transition-colors`}>
                      
                      {/* Title & Letter Number */}
                      <td className="px-4 py-3.5">
                        <div className="font-extrabold text-slate-950 text-xs sm:text-sm">
                          {item.judulDokumen}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600 font-mono">
                          <span className="font-semibold text-slate-800">{item.nomorSurat}</span>
                          <span>•</span>
                          <span>Oleh: {item.diuploadOleh}</span>
                        </div>
                        {item.keterangan && (
                          <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                            {item.keterangan}
                          </div>
                        )}
                      </td>

                      {/* Area */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          item.areaId === 0
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {item.areaName.split(':')[0]}
                        </span>
                      </td>

                      {/* Format & Size */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black ${
                            item.fileType === 'PDF' 
                              ? 'bg-red-100 text-red-800' 
                              : item.fileType === 'XLSX' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.fileType}
                          </span>
                          <span>{item.fileSize}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          T.A. {item.tahun} • {item.tanggalUpload}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{item.statusVerifikasi}</span>
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                            title="Lihat Rincian & Pratinjau Dokumen"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSimulateDownload(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                            title={`Unduh ${item.fileName}`}
                          >
                            <Download className="w-3.5 h-3.5 text-amber-300" />
                            <span>Unduh</span>
                          </button>

                          {/* Delete Action (Restricted to Authorized Admin/Kesekretariatan) */}
                          {canManageEviden && (
                            <button
                              type="button"
                              onClick={() => handleDeleteEviden(item)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-800 border border-rose-200 transition-colors cursor-pointer"
                              title="Hapus Eviden (Khusus Super Admin & Kesekretariatan)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* 4. MODAL: Preview Document Details */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border-2 border-emerald-500/40 space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#072416] text-amber-300 flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Dokumen Eviden Resmi
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                    {previewDoc.judulDokumen}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Nomor Dokumen</span>
                <span className="font-bold text-slate-900 font-mono">{previewDoc.nomorSurat}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Area Perubahan</span>
                <span className="font-bold text-emerald-800">{previewDoc.areaName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tahun Anggaran</span>
                <span className="font-bold text-slate-900">T.A. {previewDoc.tahun}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Format & Ukuran</span>
                <span className="font-bold text-slate-900">{previewDoc.fileType} • {previewDoc.fileSize}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tanggal Pengunggahan</span>
                <span className="font-bold text-slate-900">{previewDoc.tanggalUpload}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Status Validasi</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {previewDoc.statusVerifikasi}
                </span>
              </div>
            </div>

            {/* Document Description */}
            <div className="space-y-1.5 text-xs">
              <label className="font-extrabold text-slate-900 uppercase text-[11px] block">
                Ringkasan / Catatan Pembuktian ZI:
              </label>
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 text-slate-700 leading-relaxed font-medium">
                {previewDoc.keterangan || 'Dokumen ini merupakan eviden resmi pengungkit reformasi birokrasi dan pembangunan zona integritas wilayah Pengadilan Militer Tinggi V Makassar.'}
              </div>
              <div className="text-[11px] text-slate-500">
                Pengunggah: <strong className="text-slate-800">{previewDoc.diuploadOleh}</strong>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => handleSimulateDownload(previewDoc)}
                className="px-4 py-2 rounded-xl bg-[#072416] hover:bg-[#0B3822] text-amber-300 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Unduh Berkas Asli ({previewDoc.fileName})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. MODAL: Upload Eviden Baru */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border-2 border-amber-400 space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                    Unggah Dokumen Eviden Zona Integritas
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Pengadilan Militer Tinggi V Makassar (PermenPAN-RB No. 90/2021)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccessMessage ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-base font-extrabold text-emerald-900">{uploadSuccessMessage}</h4>
                <p className="text-xs text-emerald-700">Data telah disimpan dan disinkronkan ke basis data CourtDB.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitUpload} className="space-y-4 text-xs">
                
                {/* Judul Dokumen */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">
                    Judul Dokumen Eviden <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SK Tim Kerja Pembangunan ZI WBBM 2026"
                    value={uploadJudul}
                    onChange={(e) => setUploadJudul(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                {/* Nomor Surat & Tahun */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">Nomor Surat / SK</label>
                    <input
                      type="text"
                      placeholder="W5-Mil.01/OT.01.1/SK/01/I/2026"
                      value={uploadNomorSurat}
                      onChange={(e) => setUploadNomorSurat(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 block">Tahun Anggaran</label>
                    <select
                      value={uploadTahun}
                      onChange={(e) => setUploadTahun(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    >
                      <option value="2026">2026 (Tahun Berjalan)</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                </div>

                {/* Area Perubahan */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Area Perubahan ZI</label>
                  <select
                    value={uploadAreaId}
                    onChange={(e) => setUploadAreaId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value={1}>Area I: Manajemen Perubahan</option>
                    <option value={2}>Area II: Penataan Tatalaksana</option>
                    <option value={3}>Area III: Manajemen SDM Aparatur</option>
                    <option value={4}>Area IV: Penguatan Akuntabilitas</option>
                    <option value={5}>Area V: Penguatan Pengawasan</option>
                    <option value={6}>Area VI: Kualitas Pelayanan Publik</option>
                    <option value={0}>Dokumen LKE PMPRB & SK Tim Kerja</option>
                  </select>
                </div>

                {/* File Upload Picker */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Pilih Berkas Eviden (PDF, Word, Excel, Gambar)</label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-amber-400 p-4 rounded-xl text-center bg-slate-50 transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.png"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-7 h-7 text-slate-400 mx-auto mb-1" />
                    {uploadFileName ? (
                      <div className="text-xs font-bold text-emerald-700">
                        {uploadFileName} ({uploadFileSize})
                      </div>
                    ) : (
                      <>
                        <div className="text-xs font-bold text-slate-700">Klik atau seret file dokumen ke sini</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Mendukung PDF, XLSX, DOCX (Maks 25MB)</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Keterangan */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Keterangan / Uraian Singkat Pembuktian</label>
                  <textarea
                    rows={2}
                    placeholder="Uraikan kaitan dokumen ini dengan pemenuhan lembar kerja evaluasi ZI..."
                    value={uploadKeterangan}
                    onChange={(e) => setUploadKeterangan(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                {/* Pengunggah */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Nama / Unit Pengunggah</label>
                  <input
                    type="text"
                    value={uploadDiuploadOleh}
                    onChange={(e) => setUploadDiuploadOleh(e.target.value)}
                    placeholder="Tim Kerja ZI Dilmilti V"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Simpan & Terbitkan Eviden</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
