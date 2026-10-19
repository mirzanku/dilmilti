import { useState, useEffect } from 'react';
import { 
  Building, 
  Clock, 
  Accessibility, 
  ShieldAlert, 
  MessageSquareWarning, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Send,
  Gift,
  FileCheck,
  ShieldCheck,
  BookOpen,
  Download,
  Eye,
  X,
  Paperclip,
  Edit3,
  Camera,
  Upload
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { SakipDipaDocumentItem, UserAccount } from '../types';
import { isStaffUser } from '../utils/rbac';
import MenuContentEditModal from './admin/MenuContentEditModal';
import PtspInfoMenuSection from './PtspInfoMenuSection';
import PtspInovasiSection from './PtspInovasiSection';
import PtspInfografisAlurSection from './ptsp/PtspInfografisAlurSection';
import { compressImage } from '../utils/imageHelper';
import { syncRouteToUrl } from '../utils/urlRouter';

interface LayananPublikSectionProps {
  onNavigateToPTSPInovasi?: () => void;
  onNavigate?: (section: any, subTab?: string) => void;
  initialSubTab?: string;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

export default function LayananPublikSection({ onNavigateToPTSPInovasi, onNavigate, initialSubTab = 'jenis-layanan', currentUser, onOpenAuth }: LayananPublikSectionProps) {
  const [activeSub, setActiveSub] = useState<string>(initialSubTab || 'jenis-layanan');

  useEffect(() => {
    if (initialSubTab) {
      setActiveSub(initialSubTab);
      if (initialSubTab === 'statistik-perkara') {
        setReportFilterCategory('LAPORAN_PERKARA');
      } else if (initialSubTab === 'lhkpn' || initialSubTab === 'lhkan') {
        setReportFilterCategory('LHKPN');
      } else if (initialSubTab === 'sakip') {
        setReportFilterCategory('SAKIP');
      } else if (initialSubTab === 'dipa') {
        setReportFilterCategory('DIPA');
      } else if (initialSubTab === 'ringkasan-laporan' || initialSubTab === 'laporan') {
        setReportFilterCategory('Semua');
      }
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (activeSub) {
      syncRouteToUrl('publik', activeSub, true);
    }
  }, [activeSub]);

  // Reactive state ticker to trigger re-render on cross-device / database updates
  const [, setDbTick] = useState(0);
  useEffect(() => {
    const handleDbUpdate = () => setDbTick(t => t + 1);
    window.addEventListener('dilmilti_db_updated', handleDbUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleDbUpdate);
  }, []);

  const isAdminOrStaff = isStaffUser(currentUser);
  const allMenus = CourtDB.getAllMenuContents();
  const courtIdentity = CourtDB.getCourtIdentity();

  const menuLp1 = allMenus.find(m => m.id === 'lp1') || CourtDB.getMenuContentById('lp1');
  const menuLp2 = allMenus.find(m => m.id === 'lp2') || CourtDB.getMenuContentById('lp2');
  const menuLp3 = allMenus.find(m => m.id === 'lp3') || CourtDB.getMenuContentById('lp3');
  const menuLp4 = allMenus.find(m => m.id === 'lp4') || CourtDB.getMenuContentById('lp4');
  const menuLp5 = allMenus.find(m => m.id === 'lp5') || CourtDB.getMenuContentById('lp5');
  const menuLp6 = allMenus.find(m => m.id === 'lp6') || CourtDB.getMenuContentById('lp6');
  const menuLp7 = allMenus.find(m => m.id === 'lp7') || CourtDB.getMenuContentById('lp7');
  const menuLp8 = allMenus.find(m => m.id === 'lp8') || CourtDB.getMenuContentById('lp8');

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  
  // Preview modal state for physical documents
  const [previewDoc, setPreviewDoc] = useState<SakipDipaDocumentItem | null>(null);
  const [reportFilterCategory, setReportFilterCategory] = useState<string>('Semua');
  const [reportSearchQuery, setReportSearchQuery] = useState<string>('');

  const handleDownloadDoc = (doc: SakipDipaDocumentItem) => {
    if (doc.fileUrl && doc.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = doc.fileUrl;
      a.download = doc.fileName || `${doc.judul}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create official text/blob document
      const content = `PENGADILAN MILITER TINGGI V MAKASSAR
DOKUMEN RESMI AKUNTABILITAS & TRANSPARANSI PUBLIK

Judul Dokumen  : ${doc.judul}
Kategori       : ${doc.kategori} ${doc.subKategori ? `(${doc.subKategori})` : ''}
Nomor Dokumen  : ${doc.nomorDokumen || '-'}
Tahun Anggaran : ${doc.tahun}
Unit Penanggung Jawab: ${doc.penanggungJawab}
Tanggal Upload : ${doc.tanggalUpload}
Format File    : ${doc.fileType} (${doc.fileSize})
${doc.nilaiAnggaran ? `Nilai DIPA/Anggaran: ${doc.nilaiAnggaran}\n` : ''}${doc.persentaseKepatuhan ? `Tingkat Kepatuhan: ${doc.persentaseKepatuhan}\n` : ''}
Deskripsi Uraian:
${doc.deskripsi}

Dokumen ini diterbitkan secara sah oleh Sistem Informasi Layanan Publik Pengadilan Militer Tinggi V Makassar sesuai Standar Keterbukaan Informasi MA-RI dan SK 593/2026.`;

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

  // Survey form state
  const [ikmRating, setIkmRating] = useState<number>(5);
  const [ipakRating, setIpakRating] = useState<number>(5);
  const [saran, setSaran] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // Complaint simulation
  const [pengaduanSub, setPengaduanSub] = useState({
    nama: '',
    kontak: '',
    uraian: '',
    terkirim: false
  });

  const getActiveSubTitle = () => {
    switch (activeSub) {
      case 'ptsp':
      case 'ptsp-inovasi':
      case 'jenis-layanan':
      case 'app-viewer':
      case 'informasi-perkara':
      case 'direktori-putusan':
        return 'Pelayanan Terpadu Satu Pintu (PTSP)';
      case 'ptsp-permohonan':
      case 'permohonan':
        return 'Permohonan Online 6 Meja PTSP';
      case 'ptsp-lacak':
      case 'lacak':
        return 'Lacak Status Tiket & Dokumen TTE';
      case 'ptsp-antrean':
      case 'antrean':
        return 'Antrean Digital & Kios Loket PTSP';
      case 'ptsp-monitor':
      case 'monitor':
        return 'Layar Monitor Display Antrean TV';
      case 'ptsp-konsultasi':
      case 'konsultasi':
        return 'Konsultasi Virtual (Video Call & Chat)';
      case 'ptsp-validasi-tte':
      case 'validasi-tte':
        return 'Scanner Validasi Dokumen Ber-TTE';
      case 'ptsp-offline':
      case 'offline':
        return 'Brankas Dokumen Offline & PWA Sync';
      case 'ptsp-admin':
      case 'pengaturan':
        return 'Panel Petugas PTSP & Sinkronisasi MySQL';
      case 'standar-pelayanan':
      case 'maklumat':
      case 'maklumat-pelayanan':
        return 'Standar & Maklumat Pelayanan';
      case 'kompensasi':
      case 'jam-kerja':
        return 'Kompensasi Pelayanan & Jam Kerja';
      case 'disabilitas':
      case 'layanan-disabilitas':
      case 'fasilitas-disabilitas':
      case 'sarpras':
        return 'Fasilitas & Layanan Disabilitas';
      case 'siwas':
      case 'sp4n-lapor':
      case 'pengaduan':
        return 'Pengaduan SIWAS & SP4N LAPOR';
      case 'survei':
      case 'ikm':
      case 'ipak':
        return 'Survei Kepuasan (IKM & IPAK)';
      case 'lhkpn':
      case 'lhkan':
        return 'Laporan LHKPN & LHKASN';
      case 'laporan':
      case 'statistik-perkara':
      case 'sakip':
      case 'dipa':
        return 'Laporan SAKIP, DIPA & Perkara';
      default:
        return 'Layanan Publik & PTSP';
    }
  };

  const isPtspSubTab = [
    'ptsp', 'ptsp-inovasi', 'jenis-layanan', 'app-viewer', 'informasi-perkara', 'direktori-putusan',
    'infografis', 'infografis-ptsp', 'alur-layanan', 'alur-ptsp',
    'ptsp-permohonan', 'permohonan',
    'ptsp-lacak', 'lacak',
    'ptsp-antrean', 'antrean',
    'ptsp-monitor', 'monitor',
    'ptsp-konsultasi', 'konsultasi',
    'ptsp-validasi-tte', 'validasi-tte',
    'ptsp-offline', 'offline',
    'ptsp-admin', 'pengaturan'
  ].includes(activeSub);

  const getMappedPtspTab = () => {
    if (activeSub === 'permohonan' || activeSub === 'ptsp-permohonan') return 'permohonan';
    if (activeSub === 'lacak' || activeSub === 'ptsp-lacak') return 'lacak';
    if (activeSub === 'antrean' || activeSub === 'ptsp-antrean') return 'antrean';
    if (activeSub === 'monitor' || activeSub === 'ptsp-monitor') return 'monitor';
    if (activeSub === 'konsultasi' || activeSub === 'ptsp-konsultasi') return 'konsultasi';
    if (activeSub === 'validasi-tte' || activeSub === 'ptsp-validasi-tte') return 'validasi-tte';
    if (activeSub === 'offline' || activeSub === 'ptsp-offline') return 'offline';
    if (activeSub === 'pengaturan' || activeSub === 'ptsp-admin' || activeSub === 'admin') return 'pengaturan';
    return 'app-viewer';
  };

  return (
    <section id="layanan-publik-section" className="space-y-6">
      
      {/* Header Breadcrumb Ringkas untuk sub-layanan non-PTSP */}
      {!isPtspSubTab && (
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
            <span className="text-emerald-200 font-semibold">Layanan Publik</span>
            <span className="text-emerald-500 font-bold">/</span>
            <span className="text-amber-300 font-black tracking-wide">{getActiveSubTitle()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
              LAYANAN
            </span>
            <span className="text-[11px] font-mono text-emerald-200/80 hidden sm:inline">
              Pengadilan Militer Tinggi V Makassar
            </span>
          </div>
        </div>
      )}

      {/* SUB 1: PELAYANAN TERPADU SATU PINTU (PTSP) & 6 MEJA */}
      {isPtspSubTab && (
        <div className="space-y-6">
          {activeSub === 'infografis' || activeSub === 'infografis-ptsp' || activeSub === 'alur-layanan' || activeSub === 'alur-ptsp' ? (
            <PtspInfografisAlurSection
              onNavigateToPtspOnline={(tab, service) => {
                window.open(`/?tab=ptsp-online&sub=${tab || 'app-viewer'}${service ? `&service=${encodeURIComponent(service)}` : ''}`, '_blank');
              }}
              onNavigateToSection={onNavigate}
            />
          ) : activeSub === 'jenis-layanan' || activeSub === 'ptsp' || activeSub === 'informasi-perkara' ? (
            <PtspInfoMenuSection
              onNavigate={onNavigate}
              currentUser={currentUser}
              onOpenAuth={onOpenAuth}
              onOpenPtspOnline={(tab, serviceName) => {
                window.open(`/?tab=ptsp-online&sub=${tab || 'app-viewer'}${serviceName ? `&service=${encodeURIComponent(serviceName)}` : ''}`, '_blank');
              }}
            />
          ) : (
            <PtspInovasiSection
              currentUser={currentUser}
              onNavigateToSection={onNavigate}
              initialTab={getMappedPtspTab()}
            />
          )}

          {/* Dokumen SK & SOP Layanan PTSP */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Dokumen Resmi SK & SOP Pelayanan Terpadu Satu Pintu (PTSP)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  id: 'doc-sk-ptsp-2026',
                  judul: 'Keputusan Kepala Pengadilan Militer Tinggi V Makassar tentang Penyelenggaraan PTSP TA 2026',
                  kategori: 'PPID' as const,
                  subKategori: 'SK PTSP',
                  tahun: '2026',
                  nomorDokumen: 'W5-Mil.01/SK.OT1.6/I/2026/01',
                  deskripsi: 'Pedoman penyelenggaraan Pelayanan Terpadu Satu Pintu (PTSP), struktur pengelola PTSP, dan standar operasional layanan 6 meja pada Pengadilan Militer Tinggi V Makassar.',
                  fileUrl: '',
                  fileName: 'SK_Penyelenggaraan_PTSP_Dilmilti_V_Makassar_2026.pdf',
                  fileSize: '1.8 MB',
                  fileType: 'PDF' as const,
                  tanggalUpload: '2026-01-05',
                  penanggungJawab: 'Panitera & Sekretaris Dilmilti V Makassar'
                },
                {
                  id: 'doc-sop-ptsp-2026',
                  judul: 'Standar Operasional Prosedur (SOP) Pelayanan 6 Meja PTSP & PTSP Mandiri Online',
                  kategori: 'PPID' as const,
                  subKategori: 'SOP PTSP',
                  tahun: '2026',
                  nomorDokumen: 'W5-Mil.01/SOP.PTSP/I/2026/02',
                  deskripsi: 'Dokumen SOP alur penerimaan berkas perkara banding, sengketa TUN Militer, permohonan informasi PPID, legalisasi putusan, dan persuratan elektronik.',
                  fileUrl: '',
                  fileName: 'SOP_Pelayanan_PTSP_Dilmilti_V_Makassar_2026.pdf',
                  fileSize: '2.1 MB',
                  fileType: 'PDF' as const,
                  tanggalUpload: '2026-01-05',
                  penanggungJawab: 'Pejabat Pengelola PTSP'
                }
              ].map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-emerald-800 font-bold">{doc.nomorDokumen}</div>
                    <div className="font-bold text-slate-900 text-xs truncate">{doc.judul}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{doc.fileType} ({doc.fileSize}) • {doc.penanggungJawab}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer"
                      title="Pratinjau Dokumen"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(doc)}
                      className="px-3 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB 2: MAKLUMAT & STANDAR PELAYANAN */}
      {(activeSub === 'maklumat' || activeSub === 'standar-pelayanan' || activeSub === 'maklumat-pelayanan') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900 uppercase text-xs">Maklumat Standar Pelayanan Publik</span>
            {isAdminOrStaff && (
              <button
                type="button"
                onClick={() => { setEditingMenuId('lp2'); setIsMenuModalOpen(true); }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Maklumat (Role Admin)</span>
              </button>
            )}
          </div>

          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-xl border-2 border-amber-400 text-center space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
              {menuLp2?.customFields?.nomorSKMaklumat || 'MAKLUMAT PELAYANAN PENGADILAN MILITER TINGGI V MAKASSAR'}
            </span>
            <blockquote className="text-sm sm:text-base font-serif font-bold italic leading-relaxed text-blue-50 max-w-2xl mx-auto">
              "{menuLp2?.kontenUtama || courtIdentity.maklumatPelayanan || 'Dengan ini, kami pimpinan dan seluruh aparatur Pengadilan Militer Tinggi V Makassar menyatakan sanggup menyelenggarakan pelayanan peradilan sesuai standar pelayanan yang telah ditetapkan, dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai dengan peraturan perundang-undangan yang berlaku.'}"
            </blockquote>
            <div className="text-[11px] text-slate-300">
              Tertanda: {menuLp2?.customFields?.penandatangan || 'Kepala Pengadilan Militer Tinggi V Makassar'}
            </div>
          </div>

          {/* Uploaded Piagam Maklumat Gambar if available */}
          {menuLp2?.customFields?.gambarMaklumatUrl && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
              <span className="font-bold text-amber-300 text-xs block">Piagam Maklumat Pelayanan Resmi</span>
              <img src={menuLp2.customFields.gambarMaklumatUrl} alt="Piagam Maklumat" className="max-h-96 mx-auto rounded-lg shadow-md" />
            </div>
          )}

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 space-y-2">
            <h4 className="font-bold text-amber-900 text-xs uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-700" />
              <span>Kompensasi Layanan Jika Terjadi Keterlambatan:</span>
            </h4>
            <p className="text-[11px] text-amber-950 leading-relaxed">
              Apabila petugas PTSP tidak menyelesaikan permohonan informasi atau legalisasi putusan sesuai tenggat Standar Pelayanan (SLA) tanpa alasan force majeure, pemohon berhak memperoleh kompensasi berupa:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-900">
              <li>Permohonan maaf tertulis resmi dari Pejabat Pengelola Meja Pelayanan;</li>
              <li>Pengantaran dokumen langsung ke alamat dinas/kesatuan pemohon tanpa dipungut biaya antar (Courier Service Gratis);</li>
              <li>Cinderamata resmi zona integritas Pengadilan Militer Tinggi V Makassar.</li>
            </ul>
          </div>

          {/* Dokumen SK Standar Pelayanan & Maklumat Pelayanan */}
          <div className="pt-3 border-t border-slate-200 space-y-2.5">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Unduh Dokumen Resmi Standar Pelayanan & Maklumat Pelayanan</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  id: 'doc-sk-standar-pelayanan-2026',
                  judul: 'SK Standar Pelayanan Peradilan pada Pengadilan Militer Tinggi V Makassar (SK KMA 026/KMA/SK/II/2012)',
                  kategori: 'PPID' as const,
                  subKategori: 'Standar Pelayanan',
                  tahun: '2026',
                  nomorDokumen: 'W5-Mil.01/SK.HK1.2.5/I/2026/03',
                  deskripsi: 'Memuat komponen Service Delivery dan Manufacturing meliputi dasar hukum, persyaratan, prosedur, jangka waktu penyelesaian, biaya/tarif Rp 0,-, produk layanan, dan penanganan pengaduan.',
                  fileUrl: '',
                  fileName: 'SK_Standar_Pelayanan_Peradilan_Dilmilti_V_2026.pdf',
                  fileSize: '2.4 MB',
                  fileType: 'PDF' as const,
                  tanggalUpload: '2026-01-06',
                  penanggungJawab: 'Kepala Pengadilan Militer Tinggi V Makassar'
                },
                {
                  id: 'doc-piagam-maklumat-2026',
                  judul: 'Piagam & Keputusan Maklumat Pelayanan Publik Pengadilan Militer Tinggi V Makassar TA 2026',
                  kategori: 'PPID' as const,
                  subKategori: 'Maklumat Pelayanan',
                  tahun: '2026',
                  nomorDokumen: 'W5-Mil.01/SK.OT1.6/I/2026/04',
                  deskripsi: 'Pernyataan kesanggupan tertulis Pimpinan, Hakim Militer Tinggi, dan seluruh Aparatur dalam menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan.',
                  fileUrl: '',
                  fileName: 'Piagam_Maklumat_Pelayanan_Dilmilti_V_2026.pdf',
                  fileSize: '1.2 MB',
                  fileType: 'PDF' as const,
                  tanggalUpload: '2026-01-06',
                  penanggungJawab: 'Kepala Pengadilan Militer Tinggi V Makassar'
                }
              ].map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-emerald-800 font-bold">{doc.nomorDokumen}</div>
                    <div className="font-bold text-slate-900 text-xs truncate">{doc.judul}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{doc.fileType} ({doc.fileSize})</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer"
                      title="Pratinjau Dokumen"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(doc)}
                      className="px-3 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB 3: DISABILITAS (LAYANAN, FASILITAS & AKSESIBILITAS WEBSITE) */}
      {(activeSub === 'disabilitas' || activeSub === 'layanan-disabilitas' || activeSub === 'fasilitas-disabilitas' || activeSub === 'aksesibilitas-website' || activeSub === 'aksesibilitas-web' || activeSub === 'sarpras') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs text-slate-700">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-emerald-600" />
                <span>{menuLp4?.judul || 'Fasilitas & Layanan Ramah Penyandang Disabilitas (SK Dirjen Badilmiltun)'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {menuLp4?.subJudul || 'Aksesibilitas penuh bagi penyandang disabilitas fisik, sensorik, dan kaum rentan (lansia/ibu hamil)'}
              </p>
            </div>
            {isAdminOrStaff && (
              <button
                type="button"
                onClick={() => { setEditingMenuId('lp4'); setIsMenuModalOpen(true); }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Layanan Disabilitas (Role Admin)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block mb-1 text-xs">♿ Sarana Fisik:</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Ramp bidang miring di pintu masuk</li>
                <li>Toilet khusus disabilitas</li>
                <li>Kursi roda & tongkat kruk gratis</li>
                <li>Guiding block ubin pemandu tunanetra</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block mb-1 text-xs">👁️ Sarana Informasi:</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Brosur & formulir berhuruf Braille</li>
                <li>Fitur screen reader audio pada website</li>
                <li>Mode kontras tinggi dan font disleksia</li>
                <li>Display running text digital audio visual</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block mb-1 text-xs">🤝 Petugas Pendamping:</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Petugas bersertifikasi Bahasa Isyarat ({menuLp4?.customFields?.petugasPendampingKhusus || 'PNS Reski Ramadhani, S.Kom.'})</li>
                <li>Pendampingan persidangan ramah anak</li>
                <li>Prioritas antrean khusus di loket PTSP</li>
              </ul>
            </div>
          </div>

          {/* Dokumen SK Layanan Disabilitas & MoU Juru Bahasa Isyarat */}
          <div className="pt-3 border-t border-slate-200 space-y-2.5">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Unduh Dokumen Resmi SK Layanan Disabilitas, SOP & MoU Juru Bahasa Isyarat</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  id: 'doc-sk-disabilitas-2026',
                  judul: 'SK Standar Pelayanan Ramah Penyandang Disabilitas & Kelompok Rentan TA 2026',
                  kategori: 'PPID' as const,
                  subKategori: 'Layanan Disabilitas',
                  tahun: '2026',
                  nomorDokumen: 'W5-Mil.01/SK.OT1.6/I/2026/08',
                  deskripsi: 'Keputusan Kepala Pengadilan Militer Tinggi V Makassar tentang penyediaan sarana prasarana aksesibilitas fisik/non-fisik dan penunjukan petugas pendamping khusus disabilitas.',
                  fileUrl: '',
                  fileName: 'SK_Layanan_Ramah_Disabilitas_Dilmilti_V_2026.pdf',
                  fileSize: '1.7 MB',
                  fileType: 'PDF' as const,
                  tanggalUpload: '2026-01-08',
                  penanggungJawab: 'Sekretaris & Panitera Dilmilti V Makassar'
                },
                {
                  id: 'doc-mou-slb-2026',
                  judul: 'Nota Kesepahaman (MoU) Penyediaan Juru Bahasa Isyarat & Pendampingan Disabilitas Sensorik TA 2026',
                  kategori: 'PPID' as const,
                  subKategori: 'MoU Disabilitas',
                  tahun: '2026',
                  nomorDokumen: 'W5-Mil.01/HM.01.1/MOU-SLB/I/2026',
                  deskripsi: 'Perjanjian kerja sama layanan juru bahasa isyarat dan pendampingan persidangan maupun layanan PTSP bagi penyandang disabilitas rungu/wicara tanpa biaya.',
                  fileUrl: '',
                  fileName: 'MoU_Juru_Bahasa_Isyarat_Disabilitas_2026.pdf',
                  fileSize: '1.5 MB',
                  fileType: 'PDF' as const,
                  tanggalUpload: '2026-01-12',
                  penanggungJawab: 'Subbag Kepegawaian, Ortala & PTSP'
                }
              ].map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-emerald-800 font-bold">{doc.nomorDokumen}</div>
                    <div className="font-bold text-slate-900 text-xs truncate">{doc.judul}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{doc.fileType} ({doc.fileSize})</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer"
                      title="Pratinjau Dokumen"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(doc)}
                      className="px-3 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB 2.5: KOMPENSASI & JAM KERJA PELAYANAN (SK 593/2026 PAGE 22) */}
      {(activeSub === 'kompensasi' || activeSub === 'jam-kerja') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                MAKLUMAT & STANDARDISASI
              </span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <Gift className="w-4 h-4 text-[#0E29CD]" />
                <span>{menuLp3?.judul || 'Kompensasi Pelayanan PTSP Pengadilan Militer Tinggi V Makassar'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {menuLp3?.subJudul || 'Bentuk komitmen penjaminan mutu sesuai Keputusan Ketua Pengadilan Militer Tinggi V Makassar'}
              </p>
            </div>
            {isAdminOrStaff && (
              <button
                type="button"
                onClick={() => { setEditingMenuId('lp3'); setIsMenuModalOpen(true); }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Kompensasi (Role Admin)</span>
              </button>
            )}
          </div>

          <div className="bg-amber-50/80 border-2 border-amber-300 p-4 rounded-xl space-y-2">
            <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wide">
              STANDAR DAN JANJI KOMPENSASI PELAYANAN
            </h4>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              {menuLp3?.kontenUtama || 'Apabila petugas PTSP Pengadilan Militer Tinggi V Makassar tidak memberikan pelayanan sesuai dengan Standar Pelayanan Publik yang telah ditetapkan (terlambat melebihi SOP atau tidak sopan), masyarakat penerima layanan berhak menerima Kompensasi Pelayanan secara langsung tanpa dipungut biaya apapun.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const comp = CourtDB.getPublicCompensationInfo();
              const durasi = menuLp3?.customFields?.waktuKeterlambatanStandar || comp.waktuKeterlambatanStandar;
              const bentuk = menuLp3?.customFields?.bentukKompensasi || comp.bentukKompensasi;
              return (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 shadow-xs sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Standar Keterlambatan: {durasi}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{comp.skNomor} ({comp.skTanggal})</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">{comp.deskripsiAturan}</p>
                  <div className="p-3 bg-white rounded-lg border border-amber-300 text-amber-950 font-extrabold text-[11px] flex items-center gap-1.5 shadow-2xs">
                    <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Bentuk Kompensasi Resmi: {bentuk}</span>
                  </div>
                </div>
              );
            })()}

            {/* Jam Kerja Pelayanan Resmi */}
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2 sm:col-span-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-800" />
                <strong className="text-emerald-950 font-black text-xs uppercase">Ketentuan Jam Kerja & Jam Pelayanan PTSP</strong>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <strong className="text-slate-900 block">Senin s/d Kamis:</strong>
                  <span className="text-emerald-800 font-bold">08.00 – 16.30 WITA</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">Istirahat: 12.00 – 13.00 WITA (Loket PTSP tetap buka sistem piket bergilir)</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <strong className="text-slate-900 block">Hari Jumat:</strong>
                  <span className="text-emerald-800 font-bold">08.00 – 17.00 WITA</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">Istirahat: 11.30 – 13.00 WITA</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <strong className="text-slate-900 block">Layanan Elektronik (e-Court / SIPP):</strong>
                  <span className="text-emerald-800 font-bold">24 Jam Online</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">Verifikasi berkas dilakukan pada jam kerja efektif</div>
                </div>
              </div>
            </div>
          </div>

          {/* Unduh SK Kompensasi & Jam Kerja */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 text-xs">
                SK Kepala Pengadilan Militer Tinggi V Makassar tentang Kompensasi Pelayanan & Jam Kerja PTSP TA 2026
              </div>
              <div className="text-[10px] font-mono text-slate-500">Nomor: W5-Mil.01/SK.OT1.6/I/2026/05 • PDF (1.4 MB)</div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleDownloadDoc({
                  id: 'doc-sk-kompensasi-2026',
                  judul: 'SK Kompensasi Pelayanan Publik & Penetapan Jam Kerja Pelayanan PTSP TA 2026',
                  kategori: 'PPID',
                  subKategori: 'Kompensasi Layanan',
                  tahun: '2026',
                  nomorDokumen: 'W5-Mil.01/SK.OT1.6/I/2026/05',
                  deskripsi: 'Keputusan resmi mengenai mekanisme pemberian kompensasi keterlambatan layanan PTSP serta jadwal jam pelayanan dan piket istirahat.',
                  fileUrl: '',
                  fileName: 'SK_Kompensasi_Dan_Jam_Pelayanan_PTSP_2026.pdf',
                  fileSize: '1.4 MB',
                  fileType: 'PDF',
                  tanggalUpload: '2026-01-07',
                  penanggungJawab: 'Kepala Pengadilan Militer Tinggi V Makassar'
                })
              }
              className="px-4 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh SK Kompensasi & Jam Kerja</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB 3.5: LAPORAN PUBLIK, STATISTIK PERKARA, KEUANGAN, SAKIP & LHKPN */}
      {['laporan', 'statistik-perkara', 'lhkpn', 'lhkan', 'sakip', 'dipa', 'realisasi-anggaran', 'ringkasan', 'ringkasan-laporan'].includes(activeSub) && (() => {
        const allDocs = CourtDB.getSakipDipaDocuments();
        const sakipDocs = allDocs.filter(d => d.kategori === 'SAKIP');
        const dipaDocs = allDocs.filter(d => d.kategori === 'DIPA');
        const lhkpnDocs = allDocs.filter(d => d.kategori === 'LHKPN');

        const categoriesList = [
          { key: 'Semua', label: 'Semua Laporan' },
          { key: 'LHKPN', label: 'LHKPN & LHKASN' },
          { key: 'SAKIP', label: 'Kinerja (SAKIP)' },
          { key: 'DIPA', label: 'Keuangan (DIPA & LRA)' },
          { key: 'LAPORAN_PERKARA', label: 'Statistik Perkara' },
          { key: 'LAPORAN_SURVEI', label: 'Survei IKM / IPAK' },
          { key: 'LAPORAN_POSBAKUM', label: 'Posbakum & Prodeo' },
          { key: 'LAPORAN_EVIDEN_ZI', label: 'Eviden ZI (WBBM)' },
          { key: 'PPID', label: 'PPID & SOP' },
        ];

        const filteredDocs = allDocs.filter((doc) => {
          const matchCategory = reportFilterCategory === 'Semua' || doc.kategori === reportFilterCategory;
          const matchQuery = 
            doc.judul.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
            (doc.nomorDokumen && doc.nomorDokumen.toLowerCase().includes(reportSearchQuery.toLowerCase())) ||
            doc.deskripsi.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
            doc.penanggungJawab.toLowerCase().includes(reportSearchQuery.toLowerCase());
          return matchCategory && matchQuery;
        });

        const isLhkpnFocused = reportFilterCategory === 'LHKPN' || activeSub === 'lhkpn' || activeSub === 'lhkan';

        return (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs text-slate-700">
            <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 uppercase tracking-wider">
                  {isLhkpnFocused ? 'TRANSPARANSI HARTA KEKAYAAN APARATUR (LHKPN & LHKASN)' : 'AKUNTABILITAS & KINERJA PERADILAN'}
                </span>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                  <FileCheck className="w-4 h-4 text-[#0E29CD]" />
                  <span>
                    {isLhkpnFocused
                      ? 'Unduh Laporan Kepatuhan LHKPN KPK & LHKASN Aparatur Pengadilan Militer Tinggi V Makassar'
                      : 'Data Laporan Publik, Kinerja (SAKIP), Keuangan DIPA, LHKPN & Statistik Perkara'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isLhkpnFocused
                    ? 'Daftar resmi laporan kepatuhan LHKPN KPK (Pimpinan, Hakim Tinggi, Panitera, Sekretaris) dan LHKASN/SPT seluruh aparatur yang dapat dipratinjau dan diunduh langsung.'
                    : 'Publikasi lengkap data laporan berkala, metrik pencapaian kinerja, transparansi DIPA, LHKPN, statistik perkara, serta lampiran dokumen fisik resmi.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                {isAdminOrStaff && (
                  <button
                    type="button"
                    onClick={() => { setEditingMenuId('lp5'); setIsMenuModalOpen(true); }}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Laporan Kinerja (Role Admin)</span>
                  </button>
                )}
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{filteredDocs.length} Dokumen Laporan Tersedia</span>
                </div>
              </div>
            </div>

            {/* SUMMARY CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setReportFilterCategory('LHKPN')}
                className={`p-4 rounded-xl border space-y-2 cursor-pointer transition-all ${
                  reportFilterCategory === 'LHKPN'
                    ? 'bg-amber-100/80 border-amber-500 ring-2 ring-amber-400/40'
                    : 'bg-amber-50/60 border-amber-200 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between text-amber-900 font-bold text-xs">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Laporan LHKPN & LHKASN</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-mono text-[10px]">
                    {lhkpnDocs.length} Berkas (100% Tuntas)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Klik untuk menyaring dan mengunduh Laporan Rekapitulasi LHKPN KPK Pejabat & LHKASN Aparatur.
                </p>
              </div>

              <div
                onClick={() => setReportFilterCategory('SAKIP')}
                className={`p-4 rounded-xl border space-y-2 cursor-pointer transition-all ${
                  reportFilterCategory === 'SAKIP'
                    ? 'bg-emerald-100/80 border-emerald-500 ring-2 ring-emerald-400/40'
                    : 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between text-emerald-900 font-bold text-xs">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Dokumen SAKIP & Kinerja</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 font-mono text-[10px]">
                    {sakipDocs.length} Berkas
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Rencana Strategis (Renstra), LKjIP, IKU, RKT, dan Perjanjian Kinerja Pimpinan Pengadilan.
                </p>
              </div>

              <div
                onClick={() => setReportFilterCategory('DIPA')}
                className={`p-4 rounded-xl border space-y-2 cursor-pointer transition-all ${
                  reportFilterCategory === 'DIPA'
                    ? 'bg-blue-100/80 border-blue-500 ring-2 ring-blue-400/40'
                    : 'bg-blue-50/60 border-blue-200 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between text-blue-900 font-bold text-xs">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-700" />
                    <span>Keuangan DIPA 01 & 05</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-950 font-mono text-[10px]">
                    {dipaDocs.length} Berkas
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  DIPA BUA MA-RI, DIPA Ditjen Badilmiltun, LRA Bulanan/Tahunan, dan Catatan Atas Laporan Keuangan (CALK).
                </p>
              </div>
            </div>

            {/* TABEL DATA LAPORAN INTERAKTIF & SEARCH */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-600 mr-1">Kategori:</span>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setReportFilterCategory(cat.key)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        reportFilterCategory === cat.key
                          ? 'bg-[#0E29CD] text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative shrink-0 w-full md:w-64">
                  <input
                    type="text"
                    value={reportSearchQuery}
                    onChange={(e) => setReportSearchQuery(e.target.value)}
                    placeholder="Cari judul / nomor laporan..."
                    className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FileText className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                </div>
              </div>

              {/* DATA LAPORAN TABLE */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wide text-[10px]">
                    <tr>
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3">Judul Laporan & Nomor Surat/SK</th>
                      <th className="p-3 w-36">Kategori</th>
                      <th className="p-3">Ringkasan Data / Metrik Capaian</th>
                      <th className="p-3 w-32 text-center">Tahun / File</th>
                      <th className="p-3 w-36 text-center">Lampiran & Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          Tidak ada data laporan yang sesuai dengan kriteria pencarian "{reportSearchQuery}".
                        </td>
                      </tr>
                    ) : (
                      filteredDocs.map((doc, idx) => (
                        <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                          <td className="p-3 space-y-0.5">
                            <div className="font-bold text-slate-900 text-xs leading-snug">{doc.judul}</div>
                            {doc.nomorDokumen && (
                              <div className="text-[10px] text-blue-900 font-mono font-medium">
                                No: {doc.nomorDokumen}
                              </div>
                            )}
                            <div className="text-[10px] text-slate-500">
                              PJ: {doc.penanggungJawab}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-50 text-blue-900 border border-blue-200 uppercase">
                              {doc.kategori.replace('LAPORAN_', '')}
                            </span>
                            {doc.subKategori && (
                              <div className="text-[10px] text-slate-500 mt-1 font-medium">
                                {doc.subKategori}
                              </div>
                            )}
                          </td>
                          <td className="p-3 space-y-1">
                            <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                              {doc.deskripsi}
                            </p>
                            {doc.nilaiAnggaran && (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 text-[10px] font-mono font-bold">
                                Anggaran: {doc.nilaiAnggaran}
                              </span>
                            )}
                            {doc.persentaseKepatuhan && (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 text-[10px] font-mono font-bold">
                                Capaian: {doc.persentaseKepatuhan}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center space-y-1 font-mono text-[11px]">
                            <span className="font-bold text-slate-800">TA {doc.tahun}</span>
                            <div className="text-[10px] text-slate-500">
                              <span className="font-bold text-emerald-700">{doc.fileType}</span> ({doc.fileSize})
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(doc)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                title="Pratinjau Rincian Laporan & Dokumen Fisik"
                              >
                                <Eye className="w-3 h-3 text-slate-600" />
                                <span>Pratinjau</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadDoc(doc)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                title="Unduh Lampiran Berkas Fisik"
                              >
                                <Download className="w-3 h-3" />
                                <span>Unduh</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SUB 3.8: E-BROSUR DIGITAL (SK 593/2026 PAGE 22) */}
      {(activeSub as string) === 'ebrosur' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 uppercase tracking-wider">
                INOVASI LAYANAN
              </span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <BookOpen className="w-4 h-4 text-purple-700" />
                <span>{menuLp8?.judul || 'Pusat Brosur Digital & Panduan Pelayanan Publik'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {menuLp8?.subJudul || 'Brosur digital interaktif yang dapat diunduh dan dibaca dalam format ramah lingkungan'}
              </p>
            </div>
            {isAdminOrStaff && (
              <button
                type="button"
                onClick={() => { setEditingMenuId('lp8'); setIsMenuModalOpen(true); }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit e-Brosur (Role Admin)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CourtDB.getBrosurDigital().map((b) => (
              <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-purple-400 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                    {b.kategori}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">PDF Digital</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">{b.judulBrosur}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{b.deskripsi}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-mono">Resmi Dilmilti V</span>
                  <a
                    href={b.filePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-[10px] transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh Brosur</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB 4: PENGADUAN (SIWAS, SP4N-LAPOR & LAPORAN PENGADUAN) */}
      {(activeSub === 'pengaduan' || activeSub === 'siwas' || activeSub === 'sp4n-lapor' || activeSub === 'form-pengaduan' || activeSub === 'laporan-pengaduan') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{menuLp6?.judul || 'Kanal Resmi Pengaduan Masyarakat & Laporan Penanganan Pengaduan'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {menuLp6?.subJudul || 'Laporan dugaan pelanggaran kode etik hakim/aparatur dijamin kerahasiaan identitas pelapornya'}
              </p>
            </div>
            {isAdminOrStaff && (
              <button
                type="button"
                onClick={() => { setEditingMenuId('lp6'); setIsMenuModalOpen(true); }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Kanal Pengaduan (Role Admin)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2">
              <strong className="text-rose-950 font-black text-xs block">SIWAS Mahkamah Agung RI (Sistem Informasi Pengawasan)</strong>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Portal resmi Badan Pengawasan MA-RI untuk melaporkan perilaku korupsi, suap, pemerasan, atau pelanggaran disiplin aparatur pengadilan secara anonim.
              </p>
              <a
                href={menuLp6?.customFields?.urlSiwas || 'https://siwas.mahkamahagung.go.id'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0E29CD] font-bold text-xs hover:underline mt-1"
              >
                <span>Buka Portal SIWAS MA-RI</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
              <strong className="text-blue-950 font-black text-xs block">SP4N-LAPOR! Nasional</strong>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Kanal aduan terintegrasi Kementerian PAN-RB dan Ombudsman Republik Indonesia untuk pengaduan mutu pelayanan publik instansi pemerintah.
              </p>
              <a
                href={menuLp6?.customFields?.urlLapor || 'https://www.lapor.go.id'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0E29CD] font-bold text-xs hover:underline mt-1"
              >
                <span>Buka Portal SP4N-LAPOR!</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Dedicated Downloadable Laporan Pengaduan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  Laporan Pengaduan Masyarakat
                </span>
                <span className="text-[10px] font-mono text-slate-500">W5-Mil.01/PW.01/LAP-ADUAN/2026</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">
                Laporan Rekapitulasi Penanganan Pengaduan Masyarakat (Meja Pengaduan, SIWAS & SP4N-LAPOR!) TA 2026
              </h4>
              <p className="text-[11px] text-slate-600">
                Rekapitulasi jumlah pengaduan masuk (0 pengaduan pelanggaran kode etik), status penyelesaian tindak lanjut, dan evaluasi pengawasan internal.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleDownloadDoc({
                  id: 'doc-lap-pengaduan-2026',
                  judul: 'Laporan Rekapitulasi Penanganan Pengaduan Masyarakat (SIWAS & Meja Pengaduan) TA 2026',
                  kategori: 'PPID',
                  subKategori: 'Laporan Pengaduan',
                  tahun: '2026',
                  nomorDokumen: 'W5-Mil.01/PW.01/LAP-ADUAN/2026',
                  deskripsi: 'Laporan rekapitulasi berkala penanganan pengaduan masyarakat melalui Meja Pengaduan PTSP, Aplikasi SIWAS MA-RI, dan SP4N-LAPOR! pada Pengadilan Militer Tinggi V Makassar.',
                  fileUrl: '',
                  fileName: 'Laporan_Rekapitulasi_Pengaduan_Masyarakat_2026.pdf',
                  fileSize: '1.5 MB',
                  fileType: 'PDF',
                  tanggalUpload: '2026-09-15',
                  penanggungJawab: 'Hakim Pengawas Bidang Pengawasan & Panitera Muda Hukum'
                })
              }
              className="px-4 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Laporan Pengaduan</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB 5: SURVEI IKM & IPAK */}
      {(activeSub === 'survei' || activeSub === 'ikm' || activeSub === 'ipak') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0E29CD]" />
                <span>{menuLp7?.judul || 'Survei Kepuasan Masyarakat (IKM) & Indeks Persepsi Anti Korupsi (IPAK)'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {menuLp7?.subJudul || 'Bantu kami terus meningkatkan kualitas pelayanan peradilan militer melalui evaluasi objektif Anda'}
              </p>
            </div>
            {isAdminOrStaff && (
              <button
                type="button"
                onClick={() => { setEditingMenuId('lp7'); setIsMenuModalOpen(true); }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Skor & Link Survei (Role Admin)</span>
              </button>
            )}
          </div>

          {/* Scores Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-emerald-950 text-white rounded-xl border border-emerald-700 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Indeks Kepuasan Masyarakat (IKM)</span>
                <span className="text-2xl font-black text-amber-300">{menuLp7?.customFields?.nilaiIKMTerbaru || courtIdentity.profIkmSkor || '3.92 / 4.00'}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-800 text-emerald-100 font-bold text-xs rounded-lg">Sangat Baik (A)</span>
            </div>
            <div className="p-4 bg-blue-950 text-white rounded-xl border border-blue-700 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">Indeks Persepsi Anti Korupsi (IPAK)</span>
                <span className="text-2xl font-black text-amber-300">{menuLp7?.customFields?.nilaiIPAKTerbaru || courtIdentity.profIpakSkor || '3.96 / 4.00'}</span>
              </div>
              <span className="px-2.5 py-1 bg-blue-800 text-blue-100 font-bold text-xs rounded-lg">Sangat Bersih (A)</span>
            </div>
          </div>

          {/* PROMINENT OFFICIAL SURVEY GATEWAY CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/20 to-white border-2 border-emerald-300 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                  Portal Resmi E-Survei Badilmiltun MA-RI
                </h4>
                <p className="text-[11px] text-emerald-850 leading-relaxed font-medium">
                  Sesuai ketentuan, pengisian Survei Indeks Kepuasan Masyarakat (IKM) & Indeks Persepsi Anti Korupsi (IPAK) secara formal untuk Pengadilan Militer Tinggi V Makassar dikelola langsung secara elektronik melalui sistem pusat Direktorat Jenderal Peradilan Militer dan Peradilan Tata Usaha Negara.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/85 rounded-xl border border-emerald-200 text-[11px] text-slate-700 leading-relaxed space-y-1">
              <div>📍 <strong>Tautan Survei Resmi:</strong> <a href={menuLp7?.customFields?.linkSurveiOnline || courtIdentity.profSurveiUrl || 'https://survei.badilmiltun.mahkamahagung.go.id'} target="_blank" rel="noopener noreferrer" className="text-[#0E29CD] hover:underline font-bold break-all">{menuLp7?.customFields?.linkSurveiOnline || courtIdentity.profSurveiUrl || 'https://survei.badilmiltun.mahkamahagung.go.id'}</a></div>
              <div>🕒 <strong>Estimasi Waktu:</strong> Kurang dari 3 menit (Anonim & Rahasia)</div>
            </div>

            <div className="pt-1 flex flex-wrap gap-2.5">
              <a
                href={menuLp7?.customFields?.linkSurveiOnline || courtIdentity.profSurveiUrl || 'https://survei.badilmiltun.mahkamahagung.go.id'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 text-xs"
              >
                <span>Buka Portal Survei Resmi</span>
                <ExternalLink className="w-4 h-4 text-white shrink-0" />
              </a>
              <button
                type="button"
                onClick={() => {
                  window.open(menuLp7?.customFields?.linkSurveiOnline || courtIdentity.profSurveiUrl || 'https://survei.badilmiltun.mahkamahagung.go.id', '_blank', 'noopener,noreferrer');
                }}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl transition-all flex items-center gap-1.5 text-xs border border-emerald-300 cursor-pointer"
              >
                <span>Buka di Tab Baru</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Atau Berikan Rating Cepat Lokal</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {surveySubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-850 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Terima kasih atas penilaian cepat Anda!</strong> Penilaian lokal Anda telah berhasil dicatat dalam data simulasi internal secara anonim. Silakan pastikan juga untuk mengisi formulir resmi di atas.
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSurveySubmitted(true);
              }}
              className="space-y-4 max-w-xl"
            >
              <div>
                <label className="block font-bold text-slate-850 mb-1">
                  1. Bagaimana penilaian Anda terhadap kecepatan dan keramahan layanan petugas PTSP? (IKM):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setIkmRating(val)}
                      className={`flex-1 py-2 rounded-lg font-bold border transition-colors cursor-pointer text-xs ${
                        ikmRating === val
                          ? 'bg-[#0E29CD] text-white border-[#0E29CD]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {val} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  2. Apakah seluruh layanan bebas dari pungutan liar, suap, dan gratifikasi? (IPAK):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setIpakRating(val)}
                      className={`flex-1 py-2 rounded-lg font-bold border transition-colors cursor-pointer text-xs ${
                        ipakRating === val
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {val} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Kritik dan Saran Perbaikan:
                </label>
                <textarea
                  rows={3}
                  value={saran}
                  onChange={(e) => setSaran(e.target.value)}
                  placeholder="Tuliskan masukan Anda demi kemajuan Pengadilan Militer Tinggi V Makassar..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0E29CD] hover:bg-blue-800 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs"
              >
                Kirim Hasil Survei Evaluasi
              </button>
            </form>
          )}

          {/* Specific Downloadable Laporan Survei IKM & IPAK */}
          {(() => {
            const surveiDocs = CourtDB.getSakipDipaDocuments().filter(d => d.kategori === 'LAPORAN_SURVEI');
            if (surveiDocs.length === 0) return null;
            return (
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Unduh Dokumen Laporan Hasil Survei Kepuasan Masyarakat (IKM) & IPAK</span>
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {surveiDocs.map((doc) => (
                    <div key={doc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{doc.judul}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{doc.deskripsi}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">
                          No: {doc.nomorDokumen} • {doc.fileType} ({doc.fileSize})
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadDoc(doc)}
                        className="px-4 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Laporan Survei</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/30 text-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase shrink-0">
                  {previewDoc.kategori}
                </span>
                <h3 className="font-bold text-sm text-white truncate">{previewDoc.judul}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content / Preview Container */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-mono">Nomor Dokumen / SK</p>
                    <p className="font-bold text-emerald-400 text-xs">{previewDoc.nomorDokumen || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-mono">Tahun / Tanggal</p>
                    <p className="font-bold text-amber-300 text-xs">{previewDoc.tahun} ({previewDoc.tanggalUpload})</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400">Nama File:</span>
                    <p className="font-mono text-slate-200 truncate">{previewDoc.fileName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Ukuran & Format:</span>
                    <p className="font-mono text-slate-200">{previewDoc.fileSize} ({previewDoc.fileType})</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Penanggung Jawab:</span>
                    <p className="font-semibold text-slate-200">{previewDoc.penanggungJawab}</p>
                  </div>
                </div>

                {previewDoc.nilaiAnggaran && (
                  <div className="p-2.5 bg-blue-950/40 rounded-lg border border-blue-500/30 flex items-center justify-between">
                    <span className="text-blue-300 font-bold">Alokasi Anggaran DIPA:</span>
                    <span className="font-mono font-black text-amber-300 text-sm">{previewDoc.nilaiAnggaran}</span>
                  </div>
                )}

                {previewDoc.persentaseKepatuhan && (
                  <div className="p-2.5 bg-amber-950/40 rounded-lg border border-amber-500/30 flex items-center justify-between">
                    <span className="text-amber-300 font-bold">Tingkat Kepatuhan LHKPN:</span>
                    <span className="font-mono font-black text-amber-300 text-sm">{previewDoc.persentaseKepatuhan}</span>
                  </div>
                )}
              </div>

              {/* Physical File Viewer OR Interactive Content Preview */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Pratinjau Isi Dokumen Fisik</span>
                </h4>

                {previewDoc.fileUrl && previewDoc.fileUrl.startsWith('data:image') ? (
                  <div className="flex justify-center bg-black/50 p-2 rounded-lg">
                    <img src={previewDoc.fileUrl} alt={previewDoc.judul} className="max-h-[350px] object-contain rounded" />
                  </div>
                ) : previewDoc.fileUrl && previewDoc.fileUrl.startsWith('data:application/pdf') ? (
                  <iframe src={previewDoc.fileUrl} className="w-full h-[350px] rounded-lg border border-slate-800" title={previewDoc.judul} />
                ) : (
                  <div className="p-4 bg-slate-900/90 rounded-lg border border-slate-800/80 space-y-2 text-slate-300 font-sans leading-relaxed text-xs">
                    <p className="font-semibold text-emerald-300">Uraian & Ringkasan Eksekutif:</p>
                    <p>{previewDoc.deskripsi || 'Dokumen fisik resmi tersimpan secara aman dalam format digital.'}</p>
                    <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                      Catatan: Untuk mengunduh salinan fisik lengkap dalam format {previewDoc.fileType}, klik tombol "Unduh File Fisik" di bawah ini.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-mono">Dilmilti V Makassar • Document Archive System</span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(previewDoc)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File Fisik</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Content Edit Modal for Public Services (Admin Role) */}
      <MenuContentEditModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        menuId={editingMenuId}
      />

    </section>
  );
}
