import { useState, useEffect } from 'react';
import { 
  Scale, 
  Shield, 
  HeartHandshake, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Eye, 
  Paperclip, 
  Building2, 
  Edit3, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Calculator, 
  Sparkles,
  BookOpen,
  Search,
  ExternalLink,
  MessageSquare,
  Gavel,
  Layers
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { UserAccount } from '../types';
import { isStaffUser } from '../utils/rbac';
import MenuContentEditModal from './admin/MenuContentEditModal';
import { syncRouteToUrl } from '../utils/urlRouter';
import PanduanHukumSection from './PanduanHukumSection';

interface LayananHukumSectionProps {
  initialSubTab?: string;
  currentUser?: UserAccount | null;
  onNavigate?: (section: any, subTab?: string) => void;
}

export default function LayananHukumSection({ initialSubTab = 'referensi-uu31', currentUser, onNavigate }: LayananHukumSectionProps) {
  const [activeSub, setActiveSub] = useState<string>(
    initialSubTab || 'referensi-uu31'
  );
  const [verdictDate, setVerdictDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [tataCaraMode, setTataCaraMode] = useState<'semua' | 'banding' | 'kasasi'>('semua');
  const [kasasiVerdictDate, setKasasiVerdictDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  const isAdminOrStaff = isStaffUser(currentUser);

  // States for UU 31/1997 Legal References Explorer
  const [uu31Category, setUu31Category] = useState<'semua' | 'susunan' | 'penyidikan' | 'banding-kasasi' | 'stum' | 'eksekusi'>('semua');
  const [uu31Search, setUu31Search] = useState<string>('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>('ps-9');

  // Menu Content State for Layanan Hukum (lh1 - lh6)
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  // Dynamic contents for Layanan Hukum
  const [menuLh1, setMenuLh1] = useState(() => CourtDB.getMenuContentById('lh1'));
  const [menuLh2, setMenuLh2] = useState(() => CourtDB.getMenuContentById('lh2'));
  const [menuLh3, setMenuLh3] = useState(() => CourtDB.getMenuContentById('lh3'));
  const [menuLh4, setMenuLh4] = useState(() => CourtDB.getMenuContentById('lh4'));
  const [menuLh5, setMenuLh5] = useState(() => CourtDB.getMenuContentById('lh5'));
  const [menuLh6, setMenuLh6] = useState(() => CourtDB.getMenuContentById('lh6'));

  useEffect(() => {
    if (initialSubTab) {
      setActiveSub(initialSubTab as any);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (activeSub) {
      syncRouteToUrl('hukum', activeSub, true);
    }
  }, [activeSub]);

  const handleDownloadLegalDoc = (
    judul: string,
    nomorDokumen: string,
    subKategori: string,
    deskripsi: string,
    fileName: string
  ) => {
    const content = `MAHKAMAH AGUNG REPUBLIK INDONESIA
DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA
PENGADILAN MILITER TINGGI V MAKASSAR
Jl. Perintis Kemerdekaan KM. 13, Daya, Biringkanaya, Kota Makassar 90243
================================================================================
DOKUMEN RESMI LAYANAN HUKUM & KEPANITERAAN PERADILAN MILITER
Pedoman Buku II SK KMA Nomor 159/KMA/SK.HK2/VIII/2026
================================================================================

Judul Dokumen     : ${judul}
Nomor Registrasi  : ${nomorDokumen}
Kategori Layanan  : ${subKategori}
Tahun Anggaran    : 2026
Satuan Kerja      : Pengadilan Militer Tinggi V Makassar (Kode: PMT.V / 690744)

URAIAN & SUBSTANSI REGULASI / PROSEDUR:
${deskripsi}

Diterbitkan secara resmi oleh Kepaniteraan Pengadilan Militer Tinggi V Makassar.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadUu31 = () => {
    const content = `MAHKAMAH AGUNG REPUBLIK INDONESIA
PENGADILAN MILITER TINGGI V MAKASSAR
PANGKALAN DATA REGULASI & PERATURAN PERUNDANG-UNDANGAN
================================================================================
UNDANG-UNDANG REPUBLIK INDONESIA NOMOR 31 TAHUN 1997
TENTANG PERADILAN MILITER
Lembaran Negara Republik Indonesia Tahun 1997 Nomor 84
Tambahan Lembaran Negara Republik Indonesia Nomor 3713
================================================================================

PRESIDEN REPUBLIK INDONESIA,
Menimbang:
a. bahwa Negara Kesatuan Republik Indonesia adalah negara hukum berdasarkan Pancasila dan Undang-Undang Dasar 1945 yang menjunjung tinggi hak dan kewajiban setiap warga negara;
b. bahwa Angkatan Bersenjata Republik Indonesia sebagai kekuatan pertahanan keamanan dan kekuatan sosial politik mengemban tugas menegakkan kedaulatan negara;
c. bahwa untuk mewujudkan keadilan dan kepastian hukum serta memelihara tata tertib dan disiplin prajurit ABRI/TNI, diperlukan Peradilan Militer yang mandiri dan berwibawa;
d. bahwa Undang-Undang Nomor 31 Tahun 1997 merupakan penyempurnaan hukum acara dan peradilan militer yang komprehensif.

Mengingat:
1. Pasal 5 ayat (1), Pasal 20 ayat (1), dan Pasal 24 Undang-Undang Dasar 1945;
2. Undang-Undang Nomor 14 Tahun 1985 tentang Mahkamah Agung sebagaimana telah diubah dengan UU Nomor 5 Tahun 2004 dan UU Nomor 3 Tahun 2009;
3. Undang-Undang Nomor 48 Tahun 2009 tentang Kekuasaan Kehakiman.

BAB I: KETENTUAN UMUM (Pasal 1)
1. Peradilan Militer adalah pelaksana kekuasaan kehakiman di lingkungan Angkatan Bersenjata.
2. Pengadilan Militer adalah badan pelaksana kekuasaan kehakiman di lingkungan Peradilan Militer.
3. Oditurat adalah badan pelaksana kekuasaan pemerintahan negara di bidang penuntutan dan penyidikan di lingkungan Angkatan Bersenjata berdasarkan pelimpahan wewenang dari Panglima.
4. Oditur adalah pejabat yang diberi wewenang untuk bertindak sebagai penuntut umum, sebagai penyidik, dan sebagai pelaksana putusan atau penetapan pengadilan militer.
5. Atasan Yang Berhak Menghukum (Ankum) adalah atasan yang diberi wewenang menjatuhkan hukuman disiplin prajurit.
6. Perwira Penyerah Perkara (Papera) adalah perwira yang diberi wewenang menyerahkan perkara kepada pengadilan.
7. Sengketa Tata Usaha Militer (STUM) adalah sengketa yang timbul dalam bidang Tata Usaha Angkatan Bersenjata akibat diterbitkannya Keputusan Tata Usaha Angkatan Bersenjata (KTUAB).

BAB II: SUSUNAN DAN KEKUASAAN PENGADILAN
Pasal 9 (Kewenangan Absolut Peradilan Militer):
Pengadilan dalam lingkungan peradilan militer mengadili tindak pidana yang dilakukan oleh seseorang yang pada waktu melakukan tindak pidana adalah:
a. Prajurit;
b. yang berdasarkan undang-undang dipersamakan dengan prajurit;
c. anggota suatu jawatan atau golongan yang dipersamakan atau dianggap sebagai prajurit berdasarkan undang-undang;
d. seseorang yang tidak masuk golongan a, b, dan c tetapi atas penetapan Panglima harus diadili oleh Pengadilan Militer.

Pasal 12 (Susunan Badan Peradilan Militer):
a. Pengadilan Militer (Dilmil);
b. Pengadilan Militer Tinggi (Dilmilti);
c. Pengadilan Militer Utama (Dilmiltama); dan
d. Pengadilan Militer Pertempuran (Dilmilpur).

Pasal 40 (Wewenang Pengadilan Militer):
Pengadilan Militer memeriksa dan memutus pada tingkat pertama perkara pidana yang Terdakwanya adalah prajurit berpangkat Kapten ke bawah.

Pasal 41 & 42 (Wewenang Pengadilan Militer Tinggi):
(1) Pengadilan Militer Tinggi memeriksa dan memutus pada tingkat pertama perkara pidana yang Terdakwanya adalah prajurit berpangkat Mayor ke atas (Perwira Menengah dan Perwira Tinggi).
(2) Memeriksa dan memutus pada tingkat banding perkara pidana yang telah diputus pada tingkat pertama oleh Pengadilan Militer dalam daerah hukumnya yang dimintakan banding.
(3) Memutus pada tingkat pertama dan terakhir sengketa kewenangan mengadili antar-Pengadilan Militer dalam daerah hukumnya.

BAB III: HUKUM ACARA PIDANA MILITER
Pasal 69: Penyidik di lingkungan peradilan militer adalah Ankum, Polisi Militer, dan Oditur.
Pasal 75-84: Wewenang Penahanan Bertingkat:
- Penahanan oleh Ankum: 20 hari.
- Perpanjangan penahanan oleh Papera: paling lama 180 hari (Tahap I s.d. VI).
- Penahanan oleh Hakim Ketua Majelis di pengadilan: 30 hari, perpanjangan Kepala Pengadilan 60 hari.

Pasal 122-124 (Penyerahan Perkara oleh Papera):
Papera mengambil keputusan untuk:
a. menyerahkan perkara kepada Pengadilan Militer / Pengadilan Militer Tinggi dengan Keputusan Penyerahan Perkara (SKEP Pera);
b. menyelesaikan perkara menurut hukum disiplin prajurit; atau
c. menutup perkara demi kepentingan hukum atau dinas militer.

Pasal 225 (Tenggang Waktu Permohonan Banding):
Permohonan banding dapat diajukan oleh Terdakwa atau Oditur Militer dalam tenggang waktu 7 (tujuh) hari sesudah putusan diucapkan atau diberitahukan kepada Terdakwa yang tidak hadir.
Pasal 227-230: Akta Permohonan Banding, Memori Banding, dan hak mempelajari berkas (Inzage) selama 7 hari sebelum berkas dikirim.

Pasal 244-246 (Upaya Hukum Kasasi):
Permohonan kasasi ke Mahkamah Agung diajukan dalam tenggang waktu 14 (empat belas) hari sesudah putusan pengadilan diberitahukan sah, dan memori kasasi diserahkan dalam tenggang waktu 14 hari berikutnya.

Pasal 259 (Peninjauan Kembali / PK):
Terhadap putusan pengadilan yang telah berkekuatan hukum tetap (BHT), Terpidana atau ahli warisnya dapat mengajukan PK kepada Mahkamah Agung atas dasar novum, kekhilafan hakim, atau pertentangan putusan.

BAB IV: SENGKETA TATA USAHA MILITER (STUM)
Pasal 268: Objek sengketa adalah Keputusan Tata Usaha Angkatan Bersenjata (KTUAB) yang konkret, individual, dan final.
Pasal 273: Tenggang waktu pengajuan gugatan adalah 90 (sembilan puluh) hari sejak diterimanya KTUAB.

BAB V: EKSEKUSI & BIAYA PERKARA
Pasal 248: Biaya pemeriksaan perkara pidana militer pada tingkat pertama dan banding dibebankan kepada Negara (Rp 0,-).
Pasal 336: Pelaksanaan putusan yang telah memperoleh kekuatan hukum tetap dilaksanakan oleh Oditur Militer.

================================================================================
Diterbitkan secara resmi oleh Pengadilan Militer Tinggi V Makassar
Sumber Resmi JDIHN: https://jdihn.go.id & Mahkamah Agung RI: https://jdih.mahkamahagung.go.id`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'UU_Nomor_31_Tahun_1997_Peradilan_Militer.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAskAiAboutUu31 = (topic?: string) => {
    const prompt = topic 
      ? `Jelaskan ketentuan ${topic} menurut UU Nomor 31 Tahun 1997 tentang Peradilan Militer`
      : 'Jelaskan ringkasan lengkap susunan, wewenang, dan hukum acara dalam UU Nomor 31 Tahun 1997 tentang Peradilan Militer';
    window.dispatchEvent(new CustomEvent('open_peta_dilmilti_chat', { detail: { prompt, mode: 'assistant' } }));
  };

  // Reactive state ticker to trigger re-render on cross-device / database updates
  const [, setDbTick] = useState(0);
  useEffect(() => {
    const handleDbUpdate = () => {
      setDbTick(t => t + 1);
      setMenuLh1(CourtDB.getMenuContentById('lh1'));
      setMenuLh2(CourtDB.getMenuContentById('lh2'));
      setMenuLh3(CourtDB.getMenuContentById('lh3'));
      setMenuLh4(CourtDB.getMenuContentById('lh4'));
      setMenuLh5(CourtDB.getMenuContentById('lh5'));
      setMenuLh6(CourtDB.getMenuContentById('lh6'));
    };
    window.addEventListener('dilmilti_db_updated', handleDbUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleDbUpdate);
  }, []);

  const getActiveSubTitle = () => {
    let menuId = '';
    switch (activeSub) {
      case 'posbakum':
      case 'prodeo': menuId = 'lh1'; break;
      case 'tata-cara':
      case 'alur-banding': menuId = 'lh2'; break;
      case 'upaya-hukum':
      case 'alur-tun': menuId = 'lh3'; break;
      case 'sidang-luar': menuId = 'lh4'; break;
      case 'eksekusi': menuId = 'lh5'; break;
      case 'tatatertib': menuId = 'lh6'; break;
      default: break;
    }
    if (menuId) {
      const found = CourtDB.getMenuContentById(menuId);
      if (found?.judul) return found.judul;
    }

    switch (activeSub) {
      case 'referensi-uu31':
      case 'regulasi':
      case 'uu31':
      case 'uu-31-1997':
        return 'Referensi UU No. 31 Tahun 1997';
      case 'panduan-hukum':
      case 'panduan':
      case 'kalkulator':
      case 'tenggat':
      case 'kasasi':
        return 'Panduan Hukum & Kalkulator Tenggat';
      case 'posbakum':
      case 'prodeo':
        return 'Layanan Posbakum & Sidang Prodeo';
      case 'tata-cara':
      case 'alur-banding':
        return 'Tata Cara & Prosedur Berperkara';
      case 'upaya-hukum':
      case 'alur-tun':
        return 'Upaya Hukum & Perkara TUN Militer';
      case 'biaya-perkara':
        return 'Transparansi Biaya Perkara';
      case 'eksekusi':
        return 'Eksekusi Putusan Berkekuatan Hukum Tetap';
      case 'sidang-luar':
        return 'Pelayanan Sidang di Luar Gedung';
      case 'tatatertib':
        return 'Tata Tertib Persidangan Militer';
      case 'faq':
        return 'Tanya Jawab Layanan Hukum (FAQ)';
      default:
        return 'Layanan Hukum & Posbakum';
    }
  };

  return (
    <section id="layanan-hukum-section" className="space-y-6">
      
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
          <span className="text-emerald-200 font-semibold">Layanan Hukum</span>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-amber-300 font-black tracking-wide">{getActiveSubTitle()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
            HUKUM
          </span>
          <span className="text-[11px] font-mono text-emerald-200/80 hidden sm:inline">
            Pengadilan Militer Tinggi V Makassar
          </span>
        </div>
      </div>

      {/* SUB: PANDUAN HUKUM & KALKULATOR TENGGAT WAKTU (BANDING 7 HARI & KASASI 14 HARI) */}
      {(activeSub === 'panduan-hukum' || activeSub === 'panduan' || activeSub === 'kalkulator' || activeSub === 'tenggat' || activeSub === 'kasasi') && (
        <PanduanHukumSection onNavigate={onNavigate} />
      )}

      {/* SUB 0: REFERENSI UU NOMOR 31 TAHUN 1997 TENTANG PERADILAN MILITER */}
      {(activeSub === 'referensi-uu31' || activeSub === 'regulasi' || activeSub === 'uu31' || activeSub === 'uu-31-1997') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 text-xs text-slate-700">
          
          {/* Header Showcase Banner */}
          <div className="bg-gradient-to-br from-[#072414] via-[#0B3A22] to-slate-950 text-white rounded-2xl p-5 sm:p-6 border-2 border-amber-400 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-emerald-500/30 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    PANGKALAN DATA REGULASI ORGANIK RESMI
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 text-[10px] font-mono border border-emerald-400/40">
                    LNRI 1997 No. 84 • TLNRI No. 3713
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black text-white mt-1.5 font-serif tracking-wide">
                  Undang-Undang Republik Indonesia Nomor 31 Tahun 1997 tentang Peradilan Militer
                </h3>
                <p className="text-xs text-emerald-200/90 mt-1 max-w-3xl leading-relaxed">
                  Landasan hukum tertinggi yang mengatur pembentukan, kedudukan, susunan kekuasaan kehakiman di lingkungan peradilan militer, Oditurat Militer, tata cara penahanan oleh Ankum &amp; Papera, hukum acara pidana militer, tenggang waktu banding 7 hari kalender (Pasal 225), kasasi MA 14 hari (Pasal 244), dan Sengketa Tata Usaha Militer (Pasal 268).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadUu31}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Naskah UU 31/1997 (.TXT)</span>
                </button>
                <a
                  href="https://jdihn.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>JDIHN Resmi</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleAskAiAboutUu31()}
                  className="px-3 py-2 rounded-xl bg-[#0E29CD] hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  title="Tanya Chat AI PETA DILMILTI untuk menelusuri ketentuan UU 31/1997"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tanya Chat AI</span>
                </button>
              </div>
            </div>

            {/* 4 Highlight Metric Boxes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">4 Badan Peradilan Militer</div>
                <div className="text-xs font-black text-white">Dilmil, Dilmilti, Dilmiltama, Dilmilpur</div>
                <div className="text-[10px] text-slate-300 font-mono">Pasal 12 &amp; 40–45 UU 31/1997</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Tenggang Waktu Banding</div>
                <div className="text-xs font-black text-white">7 Hari Kalender</div>
                <div className="text-[10px] text-emerald-300 font-mono">Pasal 225 UU 31/1997</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Gugatan Sengketa STUM</div>
                <div className="text-xs font-black text-white">90 Hari Kalender</div>
                <div className="text-[10px] text-amber-300 font-mono">Pasal 268 &amp; 273 (Objek KTUAB)</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Biaya Perkara Pidana</div>
                <div className="text-xs font-black text-white">Rp 0,- (Beban Negara)</div>
                <div className="text-[10px] text-emerald-300 font-mono">Pasal 248 UU 31/1997</div>
              </div>
            </div>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari pasal atau kata kunci UU 31/1997 (misal: banding, penahanan, Mayor, STUM, Papera, Oditur, kasasi)..."
                  value={uu31Search}
                  onChange={(e) => setUu31Search(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50"
                />
              </div>
              {uu31Search && (
                <button
                  type="button"
                  onClick={() => setUu31Search('')}
                  className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'semua', label: 'Semua Bab & Pasal' },
                { id: 'susunan', label: '1. Susunan & Yurisdiksi (Ps. 9–45)' },
                { id: 'penyidikan', label: '2. Penyidikan & Penahanan (Ps. 69–124)' },
                { id: 'upaya-hukum', label: '3. Banding, Kasasi & PK (Ps. 225–267)' },
                { id: 'stum', label: '4. Sengketa STUM (Ps. 268–335)' },
                { id: 'eksekusi', label: '5. Biaya & Eksekusi (Ps. 248 & 336)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setUu31Category(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uu31Category === cat.id
                      ? 'bg-[#0A3D24] text-amber-300 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Articles Breakdown List */}
          {(() => {
            const articlesList = [
              {
                id: 'ps-1',
                category: 'susunan',
                pasal: 'Pasal 1 Angka 1–7',
                bab: 'BAB I : KETENTUAN UMUM',
                judul: 'Definisi Peradilan Militer, Oditurat, Ankum, Papera, & Sengketa STUM',
                substansi: 'Peradilan Militer adalah pelaksana kekuasaan kehakiman di lingkungan Angkatan Bersenjata. Oditurat adalah badan pelaksana kekuasaan pemerintahan di bidang penuntutan dan penyidikan. Ankum adalah atasan berwenang menjatuhkan hukuman disiplin. Papera adalah perwira yang berwenang menyerahkan perkara kepada pengadilan. Sengketa Tata Usaha Militer (STUM) adalah sengketa yang timbul dalam bidang Tata Usaha Angkatan Bersenjata akibat diterbitkannya Keputusan Tata Usaha Angkatan Bersenjata (KTUAB).',
                urgensi: 'Menjadi definisi resmi seluruh terminologi peradilan militer di Indonesia.'
              },
              {
                id: 'ps-9',
                category: 'susunan',
                pasal: 'Pasal 9 & 10',
                bab: 'BAB II : SUSUNAN DAN KEKUASAAN PENGADILAN',
                judul: 'Yurisdiksi Absolut Peradilan Militer atas Tindak Pidana Prajurit TNI',
                substansi: 'Pengadilan dalam lingkungan peradilan militer mengadili tindak pidana yang dilakukan oleh seseorang yang pada waktu melakukan tindak pidana adalah: (a) Prajurit TNI (AD, AL, AU); (b) yang berdasarkan undang-undang dipersamakan dengan prajurit; (c) anggota jawatan atau golongan yang dipersamakan atau dianggap sebagai prajurit berdasarkan undang-undang; atau (d) orang yang atas penetapan Panglima harus diadili oleh Pengadilan Militer.',
                urgensi: 'Landasan yuridis utama kompetensi absolut pengadilan militer.'
              },
              {
                id: 'ps-12',
                category: 'susunan',
                pasal: 'Pasal 12',
                bab: 'BAB II : SUSUNAN DAN KEKUASAAN PENGADILAN',
                judul: 'Empat Tingkatan & Susunan Badan Peradilan Militer',
                substansi: 'Pengadilan dalam lingkungan peradilan militer terdiri dari: 1. Pengadilan Militer (Dilmil); 2. Pengadilan Militer Tinggi (Dilmilti); 3. Pengadilan Militer Utama (Dilmiltama); dan 4. Pengadilan Militer Pertempuran (Dilmilpur).',
                urgensi: 'Struktur baku hierarki peradilan militer di Indonesia di bawah Mahkamah Agung RI.'
              },
              {
                id: 'ps-40',
                category: 'susunan',
                pasal: 'Pasal 40',
                bab: 'BAB II : KEKUASAAN PENGADILAN MILITER',
                judul: 'Wewenang Pengadilan Militer Mengadili Prajurit Berpangkat Kapten ke Bawah',
                substansi: 'Pengadilan Militer memeriksa dan memutus pada tingkat pertama perkara pidana yang Terdakwanya adalah prajurit berpangkat Kapten ke bawah (Tamtama, Bintara, dan Perwira Pertama).',
                urgensi: 'Kompetensi relatif dan absolut Dilmil tingkat pertama.'
              },
              {
                id: 'ps-41-42',
                category: 'susunan',
                pasal: 'Pasal 41 & 42',
                bab: 'BAB II : KEKUASAAN PENGADILAN MILITER TINGGI',
                judul: 'Kewenangan Pengadilan Militer Tinggi: Mengadili Mayor ke Atas & Tingkat Banding',
                substansi: '(1) Pengadilan Militer Tinggi memeriksa dan memutus pada tingkat pertama perkara pidana yang Terdakwanya adalah prajurit berpangkat Mayor ke atas (Perwira Menengah dan Perwira Tinggi). (2) Memeriksa dan memutus pada tingkat banding perkara pidana yang telah diputus oleh Pengadilan Militer di daerah hukumnya yang dimintakan banding. (3) Memutus pada tingkat pertama dan terakhir sengketa kewenangan mengadili antar-Pengadilan Militer di daerah hukumnya.',
                urgensi: 'Tupoksi pokok operasional Pengadilan Militer Tinggi V Makassar atas 12 provinsi Indonesia Timur.'
              },
              {
                id: 'ps-46',
                category: 'susunan',
                pasal: 'Pasal 46–60',
                bab: 'BAB II : SUSUNAN DAN KEKUASAAN ODITURAT',
                judul: 'Kedudukan & Wewenang Oditurat Militer (Otmil, Otmilti, Orjen TNI)',
                substansi: 'Oditurat Militer menyelenggarakan fungsi penuntutan perkara pidana militer, melakukan penyidikan bersama Polisi Militer, serta melaksanakan eksekusi penetapan dan putusan hakim militer yang telah inkracht.',
                urgensi: 'Diferensiasi tegas fungsi penuntutan Oditurat dan yudisial Pengadilan.'
              },
              {
                id: 'ps-69-84',
                category: 'penyidikan',
                pasal: 'Pasal 69 & 75–84',
                bab: 'BAB III : PENYIDIKAN, PENANGKAPAN & PENAHANAN',
                judul: 'Wewenang Penangkapan (1 Hari) & Penahanan Bertingkat (Ankum 20 Hari, Papera 180 Hari)',
                substansi: 'Penyidik peradilan militer adalah Ankum, Polisi Militer, dan Oditur. Perintah penangkapan berlaku maks. 1 hari. Penahanan oleh Ankum berlaku maks. 20 hari. Perpanjangan penahanan oleh Papera dapat diberikan bertahap (Tahap I s.d. VI) hingga total 180 hari. Di pengadilan, Ketua Majelis berwenang menahan 30 hari dan diperpanjang Kepala Pengadilan 60 hari.',
                urgensi: 'Perlindungan hak asasi prajurit atas batas legalitas penahanan.'
              },
              {
                id: 'ps-122',
                category: 'penyidikan',
                pasal: 'Pasal 122–124',
                bab: 'BAB III : PENYERAHAN PERKARA OLEH PAPERA',
                judul: 'Keputusan Penyerahan Perkara (SKEP Pera) oleh Papera',
                substansi: 'Setelah menerima berkas dari Oditur Militer, Papera mengambil keputusan untuk: (a) menyerahkan perkara kepada Pengadilan Militer / Pengadilan Militer Tinggi dengan Keputusan Penyerahan Perkara (SKEP Pera); (b) menyelesaikan perkara menurut hukum disiplin militer; atau (c) menutup perkara demi kepentingan dinas / hukum.',
                urgensi: 'Syarat mutlak pelimpahan perkara pidana prajurit ke pengadilan.'
              },
              {
                id: 'ps-137',
                category: 'penyidikan',
                pasal: 'Pasal 137 & 141',
                bab: 'BAB III : ACARA PEMERIKSAAN DI SIDANG PENGADILAN',
                judul: 'Asas Sidang Terbuka untuk Umum & Kehadiran Terdakwa (In Absentia)',
                substansi: 'Sidang pengadilan terbuka untuk umum, kecuali perkara kesusilaan atau rahasia militer. Terdakwa wajib hadir di persidangan. Terhadap perkara desersi di mana Terdakwa melarikan diri dan tidak dapat dihadirkan setelah dipanggil secara sah 3 kali, persidangan dapat diputus secara in absentia.',
                urgensi: 'Transparansi peradilan militer & kepastian hukum perkara desersi.'
              },
              {
                id: 'ps-225',
                category: 'upaya-hukum',
                pasal: 'Pasal 225',
                bab: 'BAB III : UPAYA HUKUM BIASA - BANDING',
                judul: 'Tenggang Waktu Permohonan Banding: 7 (Tujuh) Hari Kalender',
                substansi: 'Permohonan banding dapat diajukan oleh Terdakwa atau Oditur Militer dalam tenggang waktu 7 (tujuh) hari kalender sesudah putusan diucapkan di sidang terbuka, atau 7 hari sesudah putusan diberitahukan kepada Terdakwa yang tidak hadir.',
                urgensi: 'Ketentuan baku tenggang waktu banding di Dilmilti V Makassar.'
              },
              {
                id: 'ps-227',
                category: 'upaya-hukum',
                pasal: 'Pasal 227–230',
                bab: 'BAB III : PROSEDUR BANDING & HAK INZAGE',
                judul: 'Akta Banding, Memori Banding & Hak Mempelajari Berkas (Inzage 7 Hari)',
                substansi: 'Panitera membuat Akta Permohonan Banding. Pemohon berhak menyerahkan Memori Banding (wajib bagi Oditur Militer). Sebelum berkas dikirim ke Dilmilti, Terdakwa/Penasihat Hukum dan Oditur Militer berhak mempelajari berkas perkara (Inzage) selama 7 hari kalender di kepaniteraan.',
                urgensi: 'Jaminan hak pembelaan hukum terdakwa prajurit TNI.'
              },
              {
                id: 'ps-244',
                category: 'upaya-hukum',
                pasal: 'Pasal 244–246',
                bab: 'BAB III : UPAYA HUKUM KASASI KE MAHKAMAH AGUNG',
                judul: 'Tenggang Waktu Permohonan Kasasi: 14 (Empat Belas) Hari Kalender',
                substansi: 'Permohonan kasasi ke Mahkamah Agung RI diajukan dalam tenggang waktu 14 hari sesudah putusan banding diberitahukan sah, dan memori kasasi wajib diserahkan dalam tenggang waktu 14 hari berikutnya melalui Kepaniteraan Dilmilti.',
                urgensi: 'Upaya hukum tertinggi ke Mahkamah Agung RI di Jakarta.'
              },
              {
                id: 'ps-259',
                category: 'upaya-hukum',
                pasal: 'Pasal 259–267',
                bab: 'BAB III : PENINJAUAN KEMBALI (PK)',
                judul: 'Upaya Hukum Luar Biasa Peninjauan Kembali (PK) atas Putusan BHT',
                substansi: 'Terhadap putusan yang telah berkekuatan hukum tetap (BHT), Terpidana atau ahli warisnya dapat mengajukan PK kepada Mahkamah Agung atas dasar adanya novum (keadaan baru), pertentangan putusan, atau kekhilafan hakim nyata.',
                urgensi: 'Koreksi yuridis luar biasa terhadap vonis yang telah inkracht.'
              },
              {
                id: 'ps-268',
                category: 'stum',
                pasal: 'Pasal 268 & 273',
                bab: 'BAB IV : SENGKETA TATA USAHA MILITER (STUM)',
                judul: 'Objek Gugatan KTUAB & Tenggang Waktu Gugatan 90 Hari Kalender',
                substansi: 'Sengketa Tata Usaha Militer adalah sengketa atas Keputusan Tata Usaha Angkatan Bersenjata (KTUAB) yang bersifat konkret, individual, dan final yang menimbulkan akibat hukum bagi prajurit/PNS TNI (seperti SK Pemecatan/PDTH, mutasi, penurunan pangkat). Gugatan diajukan dalam waktu 90 hari setelah upaya administratif.',
                urgensi: 'Perlindungan hak aparatur militer dari keputusan administratif yang cacat hukum.'
              },
              {
                id: 'ps-248',
                category: 'eksekusi',
                pasal: 'Pasal 248',
                bab: 'BAB V : BIAYA PERKARA PIDANA MILITER',
                judul: 'Pembebanan Biaya Perkara Pidana Militer kepada Negara (Rp 0,-)',
                substansi: 'Seluruh biaya pemeriksaan perkara pidana militer pada tingkat pertama maupun tingkat banding dibebankan kepada Negara, kecuali putusan hakim menentukan lain. Pendaftaran banding perkara pidana militer bebas panjar biaya.',
                urgensi: 'Prinsip keadilan bebas biaya perkara pidana bagi prajurit TNI.'
              },
              {
                id: 'ps-336',
                category: 'eksekusi',
                pasal: 'Pasal 336',
                bab: 'BAB V : PELAKSANAAN PUTUSAN (EKSEKUSI)',
                judul: 'Eksekusi Putusan BHT Dilaksanakan oleh Oditur Militer',
                substansi: 'Pelaksanaan putusan pengadilan yang telah memperoleh kekuatan hukum tetap (BHT) dilakukan oleh Oditur Militer / Oditur Militer Tinggi setelah menerima salinan putusan resmi dari Panitera Pengadilan.',
                urgensi: 'Kepastian eksekusi pidana penjara, denda, ganti rugi, dan pemecatan dinas.'
              }
            ];

            const filteredArticles = articlesList.filter((art) => {
              const matchCat = uu31Category === 'semua' || art.category === uu31Category;
              const matchQ = !uu31Search || 
                art.pasal.toLowerCase().includes(uu31Search.toLowerCase()) ||
                art.judul.toLowerCase().includes(uu31Search.toLowerCase()) ||
                art.substansi.toLowerCase().includes(uu31Search.toLowerCase()) ||
                art.bab.toLowerCase().includes(uu31Search.toLowerCase());
              return matchCat && matchQ;
            });

            return (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Menampilkan {filteredArticles.length} dari {articlesList.length} pasal kunci UU No. 31 Tahun 1997</span>
                  <span className="text-emerald-700 font-bold">Kepaniteraan Dilmilti V Makassar</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredArticles.map((art) => {
                    const isExpanded = expandedArticle === art.id;
                    return (
                      <div
                        key={art.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isExpanded
                            ? 'bg-emerald-50/50 border-emerald-500 shadow-md ring-1 ring-emerald-400/40'
                            : 'bg-slate-50/80 border-slate-200 hover:border-emerald-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-black bg-emerald-800 text-white">
                                {art.pasal}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">{art.bab}</span>
                            </div>
                            <h4 className="text-xs font-black text-slate-900 mt-1.5 leading-snug">
                              {art.judul}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpandedArticle(isExpanded ? null : art.id)}
                            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 p-1 rounded hover:bg-emerald-100 shrink-0 cursor-pointer"
                          >
                            {isExpanded ? 'Tutup' : 'Rinci'}
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-700 mt-2 leading-relaxed">
                          {art.substansi}
                        </p>

                        <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] gap-2">
                          <span className="text-slate-500 italic">💡 {art.urgensi}</span>
                          <button
                            type="button"
                            onClick={() => handleAskAiAboutUu31(art.pasal)}
                            className="font-bold text-[#0E29CD] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Tanya AI</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Hubungan Hierarkis UU 31/1997 dengan Kebijakan Mahkamah Agung */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white border border-amber-400/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4 text-amber-300" />
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wide">
                  Harmonisasi &amp; Hubungan Hirarki UU No. 31/1997 dengan Regulasi Mahkamah Agung RI
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-300">Asas Lex Superior Derogat Legi Inferiori</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-amber-300 block">1. Buku II SK KMA 159/2026:</strong>
                <p className="text-slate-300 leading-relaxed text-[10px]">
                  Mengoperasionalkan Pasal 225–243 UU 31/1997 ke dalam 29 komponen baku putusan banding, susunan berkas Bundel A (24 dok) &amp; Bundel B (11 dok), batasan penahanan banding 30+60 hari, serta hak Inzage 7 hari.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-emerald-300 block">2. Modernisasi e-Court (PERMA 7/2022):</strong>
                <p className="text-slate-300 leading-relaxed text-[10px]">
                  Mengintegrasikan pendaftaran perkara gugatan STUM (Pasal 268) dan pelimpahan berkas banding pidana militer melalui sistem peradilan elektronik paperless dan aplikasi e-Berpadu.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-blue-300 block">3. Posbakum Cuma-cuma (PERMA 1/2014):</strong>
                <p className="text-slate-300 leading-relaxed text-[10px]">
                  Menjamin hak terdakwa prajurit TNI (khususnya Tamtama &amp; Bintara) memperoleh bantuan penasihat hukum dan pembebasan biaya prodeo sesuai amanat Pasal 248 UU 31/1997.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB 1: POSBAKUM & PRODEO */}
      {(activeSub === 'posbakum' || activeSub === 'prodeo') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#0E29CD]" />
                <span>{menuLh1?.judul || 'Pos Bantuan Hukum (Posbakum) & Perkara Cuma-Cuma (Prodeo)'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {menuLh1?.subJudul || 'Penyediaan advokat dan konsultasi hukum gratis sesuai PERMA No. 1 Tahun 2014'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isAdminOrStaff && (
                <button
                  type="button"
                  onClick={() => { setEditingMenuId('lh1'); setIsMenuModalOpen(true); }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Posbakum (Role Admin)</span>
                </button>
              )}
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Bebas Biaya (100% Cuma-Cuma)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold block text-xs">1. Bentuk Layanan Posbakum & Prodeo:</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Pemberian konsultasi hukum dan informasi hukum cuma-cuma;</li>
                <li>Bantuan pembuatan dokumen hukum (Memori/Kontra Memori Banding, Memori Kasasi, Eksepsi, Pleidoi/Clementie, Replik, Duplik);</li>
                <li>Penyusunan alasan Kasasi/PK oleh Panitera apabila Terdakwa kurang memahami hukum (Hal. 946 & 953 SK KMA 159/2026);</li>
                <li>Bantuan permohonan pembebasan biaya perkara (Prodeo).</li>
              </ul>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
              <strong className="text-emerald-950 font-bold block text-xs">2. Kewajiban Bantuan Hukum (SK KMA 159/2026 Hal. 961 & 1033):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                <li><strong>Wajib Didampingi Penasihat Hukum:</strong> Apabila Terdakwa didakwa melakukan tindak pidana yang diancam dengan <strong>pidana mati</strong> atau <strong>pidana penjara 15 (lima belas) tahun atau lebih</strong>, Papera wajib menunjuk Penasihat Hukum/Advokat;</li>
                <li>Apabila pada saat penyidikan tidak didampingi Penasihat Hukum, berkas perkara dikembalikan kepada Oditur Militer dengan Penetapan untuk dilakukan pemeriksaan ulang dengan didampingi Penasihat Hukum.</li>
              </ul>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
              <strong className="text-amber-950 font-bold block text-xs">3. Format Dokumen Kuasa & Izin Penasihat Hukum (Hal. 962):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                <li><strong>Prajurit TNI Aktif (Dinas Hukum TNI):</strong> Wajib dilengkapi <em>Surat Perintah dari Papera</em>/pejabat yang ditunjuk dan <em>Surat Kuasa Khusus</em> dari Terdakwa;</li>
                <li><strong>Prajurit TNI Aktif (Advokat Luar TNI):</strong> Wajib dilengkapi <em>Surat Izin Papera</em>/Dinas Hukum Angkatan dan <em>Surat Kuasa Khusus</em> dari Terdakwa;</li>
                <li><strong>Terdakwa Purnawirawan:</strong> Tidak perlu izin dari Papera; bagi Penasihat Hukum luar institusi TNI wajib melampirkan <em>Surat Izin Beracara</em>.</li>
              </ul>
            </div>
          </div>

          {/* DATA LAPORAN REALISASI POSBAKUM & PRODEO */}
          {(() => {
            const allDocs = CourtDB.getSakipDipaDocuments();
            const posbakumDocs = allDocs.filter(d => d.kategori === 'LAPORAN_POSBAKUM' || d.subKategori?.includes('Posbakum') || d.subKategori?.includes('Prodeo'));

            const handleDownload = (doc: any) => {
              const content = `PENGADILAN MILITER TINGGI V MAKASSAR
LAPORAN REALISASI BANTUAN HUKUM (POSBAKUM) & PRODEO

Judul Dokumen  : ${doc.judul}
Nomor Dokumen  : ${doc.nomorDokumen || '-'}
Tahun Anggaran : ${doc.tahun}
PenanggungJawab: ${doc.penanggungJawab}
Uraian Laporan :
${doc.deskripsi}

Diterbitkan secara resmi oleh Panitera Muda Hukum Dilmilti V Makassar.`;
              const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = doc.fileName || 'Laporan_Posbakum_2026.txt';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            };

            return (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase">
                      <FileText className="w-4 h-4 text-[#0E29CD]" />
                      <span>Data Laporan Realisasi Layanan Posbakum & Anggaran Prodeo</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Statistik pencapaian pemberian konsultasi hukum cuma-cuma dan penyerapan DIPA Bantuan Hukum.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 text-[10px] font-bold border border-blue-200">
                    Transparansi Layanan Hukum
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Judul Laporan Realisasi</th>
                        <th className="p-2.5">Nomor SK / Surat</th>
                        <th className="p-2.5">Ringkasan Data & Capaian</th>
                        <th className="p-2.5 text-center">Tahun / File</th>
                        <th className="p-2.5 text-center">Lampiran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {posbakumDocs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-500">
                            Belum ada dokumen laporan Posbakum.
                          </td>
                        </tr>
                      ) : (
                        posbakumDocs.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900 leading-snug">
                              {doc.judul}
                              <div className="text-[10px] text-slate-500 font-normal">PJ: {doc.penanggungJawab}</div>
                            </td>
                            <td className="p-2.5 font-mono text-[11px] text-blue-900">{doc.nomorDokumen || '-'}</td>
                            <td className="p-2.5 text-[11px] text-slate-600">{doc.deskripsi}</td>
                            <td className="p-2.5 text-center font-mono text-[10px]">
                              <strong>TA {doc.tahun}</strong>
                              <div className="text-emerald-700">{doc.fileType} ({doc.fileSize})</div>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleDownload(doc)}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] inline-flex items-center gap-1 cursor-pointer transition-colors"
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

      {/* SUB 2: TATA CARA BERPERKARA & ALUR BANDING / KASASI (SK KMA 159/KMA/SK.HK2/VIII/2026) */}
      {(activeSub === 'alur-banding' || activeSub === 'tata-cara') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  PEDOMAN BUKU II • SK KMA NOMOR 159/KMA/SK.HK2/VIII/2026
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono border border-emerald-300 hidden sm:inline">
                  UU 31/1997 Pasal 225 &amp; 244
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <Scale className="w-4 h-4 text-[#0E29CD]" />
                <span>Teknis Administrasi Penerimaan Berkas, Format Register &amp; Prosedur Berperkara (Banding &amp; Kasasi)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Panduan tata cara peradilan pidana militer: Pemeriksaan Tingkat Banding di Pengadilan Militer Tinggi V Makassar (7 Hari) &amp; Permohonan Kasasi ke Mahkamah Agung RI (14 Hari).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('dokumen', 'arsip-dokumen')}
                  className="px-3 py-1.5 bg-[#0D4A2B] hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Format Berkas &amp; Putusan</span>
                </button>
              )}
              {isAdminOrStaff && (
                <button
                  type="button"
                  onClick={() => { setEditingMenuId('lh2'); setIsMenuModalOpen(true); }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Prosedur (Role Admin)</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-tab Pill Filter Switcher: Semua / Banding / Kasasi */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setTataCaraMode('semua')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                tataCaraMode === 'semua'
                  ? 'bg-[#0A3D24] text-amber-300 shadow-md font-black ring-1 ring-amber-400/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semua Prosedur (Banding &amp; Kasasi)</span>
            </button>
            <button
              type="button"
              onClick={() => setTataCaraMode('banding')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                tataCaraMode === 'banding'
                  ? 'bg-[#0A3D24] text-amber-300 shadow-md font-black ring-1 ring-amber-400/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>1. Alur Pemeriksaan Banding (7 Hari Kalender)</span>
            </button>
            <button
              type="button"
              onClick={() => setTataCaraMode('kasasi')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                tataCaraMode === 'kasasi'
                  ? 'bg-[#0A3D24] text-amber-300 shadow-md font-black ring-1 ring-amber-400/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>2. Alur Permohonan Kasasi MA RI (14 Hari Kalender)</span>
            </button>
          </div>

          {/* BAGIAN A: TATA CARA & PEMERIKSAAN BANDING (7 HARI) */}
          {(tataCaraMode === 'semua' || tataCaraMode === 'banding') && (
            <div className="space-y-5 border-l-4 border-emerald-600 pl-3 sm:pl-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-xs">
                  A
                </span>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Prosedur Pemeriksaan Perkara Tingkat Banding (Dilmilti V Makassar)
                </h4>
              </div>

              {/* INFOGRAFIS VISUAL & INTERAKTIF: ALUR BANDING PERKARA PIDANA MILITER */}
              <div className="bg-gradient-to-br from-emerald-950 via-[#072414] to-slate-950 text-white rounded-2xl p-5 sm:p-6 border-2 border-amber-400/80 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-emerald-500/30 gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      INFOGRAFIS TINGKAT BANDING
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white mt-1 font-serif tracking-wide">
                      Alur &amp; Tenggat Waktu Pengajuan Banding Pidana Militer (7 Hari Kalender)
                    </h4>
                    <p className="text-xs text-emerald-200/90 mt-0.5">
                      Panduan hak hukum bagi Prajurit TNI Terdakwa, Penasihat Hukum / Perwira Hukum, dan Oditur Militer.
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-900/80 border border-emerald-400/50 text-right shrink-0">
                    <div className="text-[10px] text-amber-300 font-bold uppercase">Biaya Perkara Banding</div>
                    <div className="text-xs font-black text-white font-mono">Rp 0,- (Dibiayai Negara)</div>
                  </div>
                </div>

                {/* Visual Step-by-Step Cards Banding */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    {
                      step: '01',
                      title: 'Pembacaan Putusan',
                      time: 'Hari ke-0',
                      desc: 'Putusan diucapkan dalam sidang terbuka di Pengadilan Militer (Dilmil) atau diberitahukan sah.',
                      color: 'border-emerald-400/60 bg-emerald-900/30'
                    },
                    {
                      step: '02',
                      title: 'Akta Banding',
                      time: 'Maks. 7 Hari',
                      desc: 'Pernyataan banding ditandatangani di Meja Kepaniteraan Dilmil pengaju / portal e-Court.',
                      color: 'border-amber-400/60 bg-amber-950/40 text-amber-200'
                    },
                    {
                      step: '03',
                      title: 'Memori & Inzage',
                      time: 'Maks. 14 Hari',
                      desc: 'Penyerahan Memori Banding & hak mempelajari berkas perkara (Inzage) oleh para pihak.',
                      color: 'border-sky-400/60 bg-sky-950/40'
                    },
                    {
                      step: '04',
                      title: 'Kirim ke Dilmilti V',
                      time: 'Maks. 14 Hari',
                      desc: 'Pengiriman Bundel A (24 item) & Bundel B (11 item) ke Dilmilti V Makassar terintegrasi SIPP.',
                      color: 'border-teal-400/60 bg-teal-950/40'
                    },
                    {
                      step: '05',
                      title: 'Sidang & Putusan',
                      time: 'Maks. 3 Bulan',
                      desc: 'Pemeriksaan Majelis Hakim Tinggi, musyawarah, dan pembacaan putusan (One Day Publish).',
                      color: 'border-emerald-400/80 bg-emerald-900/50 text-amber-300'
                    }
                  ].map((item) => (
                    <div 
                      key={item.step} 
                      className={`p-3.5 rounded-xl border ${item.color} flex flex-col justify-between space-y-2 backdrop-blur-xs relative`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center font-mono">
                          {item.step}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded">
                          {item.time}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-white">{item.title}</h5>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* KALKULATOR TENGGAT BANDING INTERAKTIF */}
                {(() => {
                  const baseDate = new Date(verdictDate || new Date().toISOString().split('T')[0]);
                  const deadlineAppeal = new Date(baseDate);
                  deadlineAppeal.setDate(baseDate.getDate() + 7);

                  const deadlineMemory = new Date(baseDate);
                  deadlineMemory.setDate(baseDate.getDate() + 14);

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  deadlineAppeal.setHours(0, 0, 0, 0);

                  const diffTime = deadlineAppeal.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  const formatDate = (date: Date) => {
                    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                    const months = [
                      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                    ];
                    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
                  };

                  return (
                    <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-amber-400/50 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                            <Calculator className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-xs sm:text-sm font-black text-white uppercase tracking-wide font-serif">
                              Simulasi &amp; Kalkulator Hitung Tenggat Banding Militer (7 Hari)
                            </h5>
                            <p className="text-[11px] text-slate-300">
                              Masukkan tanggal putusan tingkat pertama dibacakan untuk melihat batas akhir hak banding Anda.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label htmlFor="input-verdict-date" className="text-xs font-bold text-amber-300 shrink-0">
                            Tanggal Putusan Tingkat Pertama:
                          </label>
                          <input
                            id="input-verdict-date"
                            type="date"
                            value={verdictDate}
                            onChange={(e) => setVerdictDate(e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-amber-400/70 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">1. Batas Akhir Pernyataan Banding</span>
                          <div className="font-extrabold text-amber-300 font-mono text-xs">{formatDate(deadlineAppeal)}</div>
                          <div className="text-[10px] text-emerald-300 font-medium">Tenggang waktu 7 hari kalender</div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">2. Batas Penyerahan Memori Banding</span>
                          <div className="font-extrabold text-white font-mono text-xs">{formatDate(deadlineMemory)}</div>
                          <div className="text-[10px] text-slate-400">Maksimal 14 hari sejak putusan</div>
                        </div>

                        <div className={`p-3 rounded-lg border space-y-1 ${
                          diffDays > 2 
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' 
                            : diffDays >= 0 
                            ? 'bg-amber-950/60 border-amber-500/50 text-amber-200 animate-pulse' 
                            : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                        }`}>
                          <span className="text-[10px] font-bold uppercase">Status Tenggat Waktu Banding</span>
                          <div className="font-extrabold font-mono text-xs">
                            {diffDays > 0 ? (
                              <span>Tersisa {diffDays} Hari Lagi</span>
                            ) : diffDays === 0 ? (
                              <span>HARI INI BATAS AKHIR!</span>
                            ) : (
                              <span>Lewat Tenggat ({Math.abs(diffDays)} hari lalu)</span>
                            )}
                          </div>
                          <div className="text-[10px]">
                            {diffDays >= 0 ? 'Hak upaya hukum banding masih aktif' : 'Putusan telah berkekuatan hukum tetap (BHT)'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 1. Prosedur Penerimaan Berkas Elektronik (e-Berpadu) & Manual (PTSP + e-Simpan) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-emerald-950 font-black text-xs uppercase">A. Penerimaan Berkas Secara Elektronik (e-Berpadu)</strong>
                    <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold">PERMA 8/2022 &amp; SK KMA 365/2022</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-700">
                    <li><strong>Panitera Muda Pidana</strong> menerima berkas perkara pidana secara elektronik melalui aplikasi <strong>e-Berpadu</strong>;</li>
                    <li>Melakukan verifikasi kelengkapan berkas perkara elektronik sesuai dengan <strong>daftar periksa (checklist)</strong>;</li>
                    <li>Terhadap berkas yang belum lengkap, Panmud Pidana memberikan notifikasi jenis dokumen yang harus dilengkapi oleh Oditur Militer/Tinggi atau Tim Tetap Koneksitas untuk dilimpahkan kembali.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-blue-950 font-black text-xs uppercase">B. Penerimaan Berkas Secara Manual (PTSP &amp; e-Simpan)</strong>
                    <span className="px-2 py-0.5 rounded bg-blue-800 text-white text-[10px] font-bold">Hal. 935–936 &amp; 988</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-700">
                    <li><strong>Petugas PTSP (Kepaniteraan)</strong> menerima berkas dan memeriksa <em>checklist</em> kelengkapan; jika belum lengkap dikembalikan kepada pengadilan pengaju / Caraka Oditurat;</li>
                    <li>Jika lengkap, diserahkan ke <strong>Petugas Kesekretariatan</strong> untuk diagendakan di buku agenda (manual) dan aplikasi <strong>e-Simpan terintegrasi</strong>;</li>
                    <li>Diserahkan ke <strong>Panitera</strong> untuk pengecekan formil, diteruskan ke <strong>Kepala Pengadilan Militer Tinggi</strong>, dan diregister oleh Panmud Pidana ke dalam <strong>SIPP &amp; e-Register Tingkat Banding</strong>.</li>
                  </ol>
                </div>
              </div>

              {/* 2. Format Baku Penomoran Register Perkara & Putusan Banding */}
              <div className="p-4 rounded-xl bg-slate-900 text-white border border-amber-400/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <strong className="text-amber-300 font-black text-xs uppercase">
                    Format Baku Penomoran e-Register Perkara &amp; Putusan Banding PMT.V (Hal. 989 &amp; 1033)
                  </strong>
                  <span className="text-[10px] font-mono text-emerald-300">Kode Satker: PMT.V (Dilmilti V Makassar)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-amber-300 font-bold">1. Perkara Pidana Kejahatan Tingkat Banding:</div>
                    <div className="font-mono text-xs font-black text-emerald-300 bg-emerald-950/60 px-2.5 py-1.5 rounded border border-emerald-500/40">
                      Nomor 01-K/PMT.V/BDG/AD/I/2026
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      <strong>01</strong>: Nomor Urut Register • <strong>K</strong>: Kode Kejahatan • <strong>PMT.V</strong>: Pengadilan Militer Tinggi V Makassar • <strong>BDG</strong>: Banding • <strong>AD/AL/AU</strong>: Matra Personel TNI • <strong>I</strong>: Bulan (Romawi) • <strong>2026</strong>: Tahun.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-amber-300 font-bold">2. Perkara Khusus (Koneksitas / Restitusi / Keberatan Tipikor):</div>
                    <div className="font-mono text-xs font-black text-amber-300 bg-amber-950/60 px-2.5 py-1.5 rounded border border-amber-500/40">
                      Nomor 01-Sus/PMT.V/BDG/I/2026
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      <strong>Sus</strong>: Kode Perkara Khusus (Koneksitas, Permohonan Kompensasi/Restitusi, atau Keberatan Pihak Ketiga Beriktikad Baik atas Perampasan Barang Tipikor). Pangkat Lokal Hakim ditulis <strong>&ldquo;Lok&rdquo;</strong> &amp; Tituler ditulis <strong>&ldquo;Tit&rdquo;</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Tahapan & Tenggang Waktu Baku Pemeriksaan Banding */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200">
                  <div className="w-7 h-7 bg-[#0E29CD] text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2 text-xs">
                    1
                  </div>
                  <strong className="text-slate-900 block text-xs mb-1">Pernyataan &amp; Memori Banding (7 Hari)</strong>
                  <p className="text-[11px] text-slate-600">
                    Diajukan maks. <strong>7 hari</strong> sesudah putusan diucapkan/diberitahukan. Oditur wajib menyerahkan memori banding dalam 7 hari (jika lewat waktu gugur).
                  </p>
                </div>

                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200">
                  <div className="w-7 h-7 bg-[#0E29CD] text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2 text-xs">
                    2
                  </div>
                  <strong className="text-slate-900 block text-xs mb-1">Inzage (7 Hari) &amp; Bundel A + B (14 Hari)</strong>
                  <p className="text-[11px] text-slate-600">
                    Kesempatan mempelajari berkas (<em>Inzage</em>) <strong>7 hari</strong> dengan tembusan Ankum. Berkas <strong>Bundel A (24 item)</strong> &amp; <strong>Bundel B (11 item)</strong> dikirim dalam <strong>14 hari</strong> sejak permohonan banding.
                  </p>
                </div>

                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200">
                  <div className="w-7 h-7 bg-[#0E29CD] text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2 text-xs">
                    3
                  </div>
                  <strong className="text-slate-900 block text-xs mb-1">Sikap Penahanan (3 Hari) &amp; Pemeriksaan</strong>
                  <p className="text-[11px] text-slate-600">
                    Kewenangan penahanan beralih ke Dilmilti. Ketua Majelis dalam <strong>3 hari</strong> wajib menentukan sikap penahanan Terdakwa. Penyelesaian perkara tingkat banding maksimal <strong>3 bulan</strong>.
                  </p>
                </div>

                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200">
                  <div className="w-7 h-7 bg-[#0E29CD] text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2 text-xs">
                    4
                  </div>
                  <strong className="text-slate-900 block text-xs mb-1">One Day Publish, Minutasi &amp; Kirim</strong>
                  <p className="text-[11px] text-slate-600">
                    Publikasi putusan wajib di hari yang sama (<em>One Day Publish</em>), minutasi selesai maks. <strong>14 hari</strong>, dan pengiriman salinan putusan + Bundel A ke Dilmil pengaju maks. <strong>7 hari</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BAGIAN B: TATA CARA & ALUR PERMOHONAN KASASI KE MAHKAMAH AGUNG RI (14 HARI) */}
          {(tataCaraMode === 'semua' || tataCaraMode === 'kasasi') && (
            <div className="space-y-5 border-l-4 border-amber-500 pl-3 sm:pl-4 pt-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  B
                </span>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Tata Cara &amp; Prosedur Permohonan Kasasi (Mahkamah Agung RI)
                </h4>
              </div>

              {/* INFOGRAFIS VISUAL KASASI CARD */}
              <div className="bg-gradient-to-br from-slate-950 via-[#071F13] to-slate-900 text-white rounded-2xl p-5 sm:p-6 border-2 border-amber-400 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-emerald-500/30 gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        TINGKAT KASASI MAHKAMAH AGUNG RI
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 text-[10px] font-mono border border-emerald-400/40">
                        PASAL 244–248 UU 31/1997 • BUKU II SK KMA 159/2026
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white mt-1.5 font-serif tracking-wide">
                      Alur &amp; Tenggat Waktu Permohonan Kasasi Pidana Militer (14 Hari Kalender)
                    </h4>
                    <p className="text-xs text-emerald-200/90 mt-0.5 max-w-2xl leading-relaxed">
                      Prosedur resmi pengajuan upaya hukum Kasasi bagi Terdakwa Prajurit TNI, Penasihat Hukum / Perwira Hukum, dan Oditur Militer terhadap Putusan Banding Pengadilan Militer Tinggi V Makassar.
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-900/80 border border-emerald-400/50 text-right shrink-0">
                    <div className="text-[10px] text-amber-300 font-bold uppercase">Biaya Perkara Kasasi</div>
                    <div className="text-xs font-black text-white font-mono">Rp 0,- (Dibiayai Negara)</div>
                  </div>
                </div>

                {/* Visual Step-by-Step 6 Cards for Kasasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                  {[
                    {
                      step: '01',
                      title: 'Putusan Banding',
                      time: 'Hari ke-0',
                      desc: 'Putusan diucapkan dalam sidang terbuka Dilmilti V Makassar atau diberitahukan resmi kepada pihak.',
                      color: 'border-emerald-400/60 bg-emerald-950/40'
                    },
                    {
                      step: '02',
                      title: 'Akta Kasasi',
                      time: 'Maks. 14 Hari',
                      desc: 'Pernyataan Kasasi ditandatangani di Kepaniteraan Dilmilti V Makassar (Pasal 244 UU 31/1997).',
                      color: 'border-amber-400/80 bg-amber-950/50 text-amber-200'
                    },
                    {
                      step: '03',
                      title: 'Memori Kasasi',
                      time: 'Wajib 14 Hari',
                      desc: 'Wajib diserahkan dalam 14 hari sejak pernyataan kasasi. Jika tidak diserahkan, kasasi GUGUR.',
                      color: 'border-rose-400/80 bg-rose-950/50 text-rose-200'
                    },
                    {
                      step: '04',
                      title: 'Kontra Memori',
                      time: 'Tenggang 14 Hari',
                      desc: 'Salinan memori disampaikan kepada Termohon untuk hak membuat Kontra Memori Kasasi.',
                      color: 'border-sky-400/60 bg-sky-950/40'
                    },
                    {
                      step: '05',
                      title: 'Kirim ke MA RI',
                      time: 'Maks. 14 Hari',
                      desc: 'Pengiriman Bundel A & Bundel B kasasi ke Panitera Mahkamah Agung RI terintegrasi e-Court.',
                      color: 'border-teal-400/60 bg-teal-950/40'
                    },
                    {
                      step: '06',
                      title: 'Putusan Kasasi',
                      time: 'Mahkamah Agung',
                      desc: 'Pemeriksaan oleh Majelis Hakim Agung Militer MA RI dan pembacaan Putusan Kasasi (BHT).',
                      color: 'border-emerald-400/80 bg-emerald-900/60 text-amber-300'
                    }
                  ].map((item) => (
                    <div 
                      key={item.step} 
                      className={`p-3.5 rounded-xl border ${item.color} flex flex-col justify-between space-y-2 backdrop-blur-xs relative`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center font-mono">
                          {item.step}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/50 px-2 py-0.5 rounded">
                          {item.time}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-white">{item.title}</h5>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* KALKULATOR TENGGAT KASASI INTERAKTIF (14 HARI) */}
                {(() => {
                  const baseDate = new Date(kasasiVerdictDate || new Date().toISOString().split('T')[0]);
                  const deadlineAppeal = new Date(baseDate);
                  deadlineAppeal.setDate(baseDate.getDate() + 14);

                  const deadlineMemory = new Date(deadlineAppeal);
                  deadlineMemory.setDate(deadlineAppeal.getDate() + 14);

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  deadlineAppeal.setHours(0, 0, 0, 0);

                  const diffTime = deadlineAppeal.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  const formatIndoDate = (date: Date) => {
                    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                    const months = [
                      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                    ];
                    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
                  };

                  return (
                    <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-amber-400/50 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                            <Calculator className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-xs sm:text-sm font-black text-white uppercase tracking-wide font-serif">
                              Simulasi &amp; Kalkulator Hitung Tenggat Kasasi Mahkamah Agung (14 Hari)
                            </h5>
                            <p className="text-[11px] text-slate-300">
                              Masukkan tanggal putusan banding Pengadilan Militer Tinggi diberitahukan/dibacakan.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label htmlFor="input-kasasi-verdict-date" className="text-xs font-bold text-amber-300 shrink-0">
                            Tanggal Putusan Banding:
                          </label>
                          <input
                            id="input-kasasi-verdict-date"
                            type="date"
                            value={kasasiVerdictDate}
                            onChange={(e) => setKasasiVerdictDate(e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-amber-400/70 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">1. Batas Pendaftaran Akta Kasasi</span>
                          <div className="font-extrabold text-amber-300 font-mono text-xs">{formatIndoDate(deadlineAppeal)}</div>
                          <div className="text-[10px] text-emerald-300 font-medium">Tenggang waktu 14 hari kalender (Pasal 244)</div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">2. Batas Akhir Penyerahan Memori Kasasi</span>
                          <div className="font-extrabold text-white font-mono text-xs">{formatIndoDate(deadlineMemory)}</div>
                          <div className="text-[10px] text-amber-300 font-medium">Wajib 14 hari sejak permohonan (Pasal 246)</div>
                        </div>

                        <div className={`p-3 rounded-lg border space-y-1 ${
                          diffDays > 3 
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' 
                            : diffDays >= 0 
                            ? 'bg-amber-950/60 border-amber-500/50 text-amber-200 animate-pulse' 
                            : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                        }`}>
                          <span className="text-[10px] font-bold uppercase">Status Tenggat Waktu Kasasi</span>
                          <div className="font-extrabold font-mono text-xs">
                            {diffDays > 0 ? (
                              <span>Tersisa {diffDays} Hari Kalender</span>
                            ) : diffDays === 0 ? (
                              <span>HARI INI BATAS TERAKHIR!</span>
                            ) : (
                              <span>Tenggat Lewat ({Math.abs(diffDays)} hari lalu)</span>
                            )}
                          </div>
                          <div className="text-[10px]">
                            {diffDays >= 0 ? 'Hak upaya hukum kasasi masih aktif' : 'Putusan telah inkracht / BHT'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 4 Kartu Regulasi & Pedoman Teknis Kasasi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-2">
                    <strong className="text-amber-300 font-bold uppercase block text-xs">
                      A. Dasar &amp; Alasan Kasasi (Pasal 248 UU 31/1997 jo. UU MA)
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Pemeriksaan kasasi oleh Mahkamah Agung hanya menyangkut penerapan hukum (<em>Judex Juris</em>) berdasarkan alasan:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                      <li>Peraturan hukum tidak diterapkan atau diterapkan tidak sebagaimana mestinya;</li>
                      <li>Cara mengadili tidak dilaksanakan menurut ketentuan peraturan perundang-undangan;</li>
                      <li>Pengadilan telah melampaui batas kewenangannya (<em>ultra vires</em>).</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-2">
                    <strong className="text-amber-300 font-bold uppercase block text-xs">
                      B. Kasasi atas Putusan Bebas (Buku II SK KMA 159/2026 Hal. 1052)
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Berdasarkan <strong>Putusan Mahkamah Konstitusi No. 114/PUU-X/2012</strong> jo. Buku II SK KMA 159/2026:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                      <li>Terhadap putusan bebas di tingkat peradilan militer, Terdakwa maupun Oditur berhak mengajukan permohonan kasasi ke Mahkamah Agung;</li>
                      <li>Memori kasasi harus menguraikan kekeliruan penerapan pembuktian dan penafsiran hukum oleh hakim <em>Judex Factie</em>.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-2">
                    <strong className="text-amber-300 font-bold uppercase block text-xs">
                      C. Kewajiban Memori Kasasi &amp; Sanksi Gugur (Pasal 246 UU 31/1997)
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Berbeda dengan banding di mana memori bersifat opsional bagi terdakwa, pada tingkat <strong>KASASI</strong>:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                      <li>Penyerahan Memori Kasasi adalah <strong>syarat mutlak (wajib)</strong> dalam waktu 14 hari kalender;</li>
                      <li>Apabila lewat 14 hari memori kasasi tidak diserahkan, Panitera menerbitkan Akta Gugur Kasasi dan berkas tidak dikirim ke MA RI.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-2">
                    <strong className="text-amber-300 font-bold uppercase block text-xs">
                      D. Kasasi Demi Kepentingan Hukum (KDKH - Hal. 948 Buku II)
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Upaya hukum istimewa terhadap putusan peradilan militer yang telah berkekuatan hukum tetap (BHT):
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                      <li>Hanya dapat diajukan oleh <strong>Oditur Jenderal TNI (Orjen TNI)</strong> sebanyak 1 (satu) kali;</li>
                      <li>Diajukan tertulis disertai Risalah Kasasi kepada Mahkamah Agung RI dan putusannya tidak boleh merugikan terpidana.</li>
                    </ul>
                  </div>
                </div>

                {/* Unduh Formulir & Format Resmi Kasasi */}
                <div className="pt-3 border-t border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="text-xs text-slate-200">
                      Unduh draf resmi Akta Permohonan Kasasi, Format Memori Kasasi, dan Kontra Memori Kasasi Standar Buku II MA RI.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadLegalDoc(
                      'Format Resmi Akta Permohonan & Memori Kasasi Pidana Militer (Buku II SK KMA 159/2026)',
                      'W5-Mil.01/KASASI/2026',
                      'Upaya Hukum Kasasi',
                      'Format resmi akta permohonan kasasi 14 hari, checklist naskah memori kasasi wajib Pasal 246 UU 31/1997, kontra memori, dan tanda terima penyerahan berkas.',
                      'Format_Resmi_Akta_dan_Memori_Kasasi_Militer_2026.txt'
                    )}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Format Akta &amp; Memori Kasasi</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Unduh Dokumen Resmi Tata Cara Berperkara: Banding & Kasasi */}
          <div className="pt-3 border-t border-slate-200 space-y-2.5">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Unduh Dokumen Resmi Pedoman Tata Cara Berperkara, Pemeriksaan Banding &amp; Permohonan Kasasi</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  judul: 'Pedoman Teknis Administrasi & Teknis Peradilan Militer (Buku II SK KMA 159/2026)',
                  nomor: '159/KMA/SK.HK2/VIII/2026',
                  sub: 'Buku II Peradilan Militer',
                  desc: 'Pedoman resmi Mahkamah Agung RI tentang penerimaan berkas perkara e-Berpadu/PTSP, format register PMT.V, pemeriksaan banding (7 hari), dan kasasi (14 hari).',
                  file: 'Buku_II_SK_KMA_159_2026_Peradilan_Militer.txt',
                  size: '4.2 MB'
                },
                {
                  judul: 'SOP Penerimaan Berkas Perkara Banding & Checklist Bundel A (24 Item) & B (11 Item)',
                  nomor: 'W5-Mil.01/SOP.PID/I/2026/01',
                  sub: 'SOP Kepaniteraan Pidana',
                  desc: 'Standar Operasional Prosedur verifikasi kelengkapan berkas perkara tingkat banding, penentuan sikap penahanan 3 hari, dan minutasi putusan 14 hari.',
                  file: 'SOP_Pemeriksaan_Perkara_Banding_Bundel_AB_2026.txt',
                  size: '1.8 MB'
                },
                {
                  judul: 'SOP Administrasi Permohonan Kasasi ke Mahkamah Agung RI & Naskah Memori Kasasi',
                  nomor: 'W5-Mil.01/SOP.KASASI/I/2026/02',
                  sub: 'SOP Upaya Hukum Kasasi',
                  desc: 'Tata cara permohonan kasasi 14 hari, pendaftaran akta, penyerahan memori kasasi wajib (Pasal 246 UU 31/1997), dan pengiriman berkas ke Mahkamah Agung RI.',
                  file: 'SOP_Administrasi_Kasasi_MA_RI_2026.txt',
                  size: '1.9 MB'
                }
              ].map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2.5">
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-emerald-800 font-bold">{doc.nomor} • PDF ({doc.size})</div>
                    <div className="font-bold text-slate-900 text-xs line-clamp-1">{doc.judul}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{doc.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadLegalDoc(doc.judul, doc.nomor, doc.sub, doc.desc, doc.file)}
                    className="w-full py-1.5 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Dokumen</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB 3: UPAYA HUKUM (KASASI, PK, GRASI, KEBERATAN PIHAK KETIGA) & SENGKETA TUN */}
      {(activeSub === 'alur-tun' || activeSub === 'upaya-hukum') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white uppercase tracking-wider">
                UPAYA HUKUM & KEWENANGAN KHUSUS • SK KMA 159/2026
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <FileText className="w-4 h-4 text-[#0E29CD]" />
                <span>{menuLh3?.judul || 'Prosedur Kasasi, Peninjauan Kembali (PK), Grasi, Keberatan Pihak Ketiga & Sengketa Militer'}</span>
              </h3>
            </div>
            {isAdminOrStaff && (
              <button
                type="button"
                onClick={() => { setEditingMenuId('lh3'); setIsMenuModalOpen(true); }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Upaya Hukum (Role Admin)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Kasasi & Kasasi Demi Kepentingan Hukum */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <strong className="text-slate-900 block text-xs uppercase">1. Permohonan Kasasi & Kasasi Demi Kepentingan Hukum (Hal. 944–950 & 1052):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li><strong>Tenggang Waktu Kasasi:</strong> Diajukan dalam waktu <strong>14 hari</strong> setelah putusan diberitahukan/dibacakan, dan wajib menyerahkan <em>Memori Kasasi</em> dalam <strong>14 hari</strong> berikutnya;</li>
                <li><strong>Kasasi atas Putusan Bebas (Hal. 1052):</strong> Terhadap putusan bebas di tingkat <em>Judex Factie</em>, Terdakwa atau Oditur dapat mengajukan permohonan kasasi ke Mahkamah Agung (Pasal 231 UU 31/1997 jo. Putusan MK 114/PUU-X/2012);</li>
                <li><strong>Pengiriman Berkas Kasasi:</strong> Dikirim ke Ketua MA paling lambat <strong>14 hari</strong> setelah tenggang waktu memori kasasi dengan tembusan Dirjen Badilmiltun, Kadilmiltama, dan Kadilmilti;</li>
                <li><strong>Kasasi Demi Kepentingan Hukum:</strong> Diajukan 1 kali secara tertulis oleh <strong>Oditur Jenderal TNI (Orjen TNI)</strong> disertai Risalah Kasasi terhadap putusan yang telah BHT.</li>
              </ul>
            </div>

            {/* 2. Peninjauan Kembali (PK) & Grasi */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <strong className="text-slate-900 block text-xs uppercase">2. Peninjauan Kembali (PK) & Permohonan Grasi (Hal. 950–958):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li><strong>Peninjauan Kembali (PK):</strong> Diajukan oleh Terpidana/ahli waris atas dasar keadaan baru (<em>novum</em>), kekhilafan hakim/kekeliruan nyata, atau pertentangan putusan. Berkas PK beserta <em>Berita Acara Pemeriksaan</em> dan <em>Berita Acara Pendapat</em> dikirim ke MA dalam waktu <strong>30 hari</strong> setelah pemeriksaan persidangan selesai;</li>
                <li><strong>Permohonan Grasi kepada Presiden:</strong> Dapat diajukan terhadap putusan <strong>pidana mati, pidana seumur hidup, atau pidana penjara paling rendah 2 (dua) tahun</strong>;</li>
                <li>Berkas perkara Grasi (disusun berurutan 21 dokumen huruf a s/d u) dikirimkan ke Mahkamah Agung paling lambat <strong>20 (dua puluh) hari</strong> sejak penerimaan salinan permohonan grasi.</li>
              </ul>
            </div>

            {/* 3. Keberatan Pihak Ketiga Beriktikad Baik & Gugatan Ganti Rugi */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
              <strong className="text-emerald-950 block text-xs uppercase">3. Penggabungan Ganti Rugi/Restitusi & Keberatan Pihak Ketiga (Hal. 1036 & 1047–1051):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                <li><strong>Penggabungan Gugatan Ganti Rugi / Restitusi (Perma 1/2022):</strong> Diajukan oleh saksi korban atau melalui LPSK paling lambat sebelum Oditur Militer mengajukan tuntutan pidana;</li>
                <li><strong>Keberatan Pihak Ketiga Beriktikad Baik (Perkara Tipikor - SEMA 2/2022):</strong> Diregister dengan kode <strong>Sus</strong>, diperiksa dalam sidang terbuka tanpa replik/duplik, dan diputus dalam bentuk <strong>Penetapan paling lama 60 hari</strong> sejak sidang pertama;</li>
                <li>Kasasi atas Penetapan Keberatan diajukan paling lambat <strong>14 hari</strong> beserta memori kasasi (<em>softcopy &amp; hardcopy</em>).</li>
              </ul>
            </div>

            {/* 4. Sengketa Kewenangan Mengadili & Sengketa TUN Militer */}
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
              <strong className="text-amber-950 block text-xs uppercase">4. Sengketa Kewenangan Mengadili & Sengketa Tata Usaha Militer (Hal. 996–999):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                <li><strong>Sengketa Kewenangan Mengadili:</strong> Pengadilan Militer Tinggi memeriksa dan memutus pada tingkat pertama dan terakhir sengketa kewenangan mengadili antar Pengadilan Militer di daerah hukumnya (penerimaan berkas via PTSP manual atau aplikasi <strong>e-Berpadu</strong>);</li>
                <li><strong>Gugatan Sengketa Tata Usaha Militer:</strong> Diajukan setelah menempuh Upaya Administratif melalui PTSP/e-Court, dilanjutkan Pemeriksaan Dismissal, Pemeriksaan Persiapan, Pemeriksaan Pokok Perkara, dan Putusan.</li>
              </ul>
            </div>
          </div>

          {/* Unduh Dokumen Resmi Upaya Hukum & Sengketa TUN Militer */}
          <div className="pt-3 border-t border-slate-200 space-y-2.5">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Unduh Dokumen SOP & Formulir Upaya Hukum (Kasasi, PK, Grasi & Sengketa TUN Militer)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  judul: 'SOP Administrasi Permohonan Kasasi, Peninjauan Kembali (PK), dan Grasi Peradilan Militer',
                  nomor: 'W5-Mil.01/SOP.PID/I/2026/03',
                  sub: 'Upaya Hukum Kasasi / PK / Grasi',
                  desc: 'Prosedur penerimaan akta permohonan kasasi (14 hari), memori kasasi, penyusunan 21 item berkas Grasi (20 hari), serta pengiriman berkas PK ke Mahkamah Agung RI (30 hari).',
                  file: 'SOP_Kasasi_PK_Grasi_Dilmilti_V_2026.txt',
                  size: '1.9 MB'
                },
                {
                  judul: 'SOP Pendaftaran & Pemeriksaan Gugatan Sengketa Tata Usaha Militer (e-Court & Dismissal)',
                  nomor: 'W5-Mil.01/SOP.TUN/I/2026/04',
                  sub: 'Kepaniteraan Tata Usaha Militer',
                  desc: 'Pedoman pengajuan gugatan sengketa kepegawaian/keputusan TUN Militer setelah upaya administratif, penelitian berkas, proses dismissal, pemeriksaan persiapan, dan persidangan.',
                  file: 'SOP_Sengketa_Tata_Usaha_Militer_2026.txt',
                  size: '1.6 MB'
                }
              ].map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-emerald-800 font-bold">{doc.nomor} • PDF ({doc.size})</div>
                    <div className="font-bold text-slate-900 text-xs truncate">{doc.judul}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{doc.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadLegalDoc(doc.judul, doc.nomor, doc.sub, doc.desc, doc.file)}
                    className="px-3 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB 4: SIDANG DI LUAR GEDUNG PENGADILAN (SK 593/2026 PAGE 22) */}
      {(activeSub as string) === 'sidang-luar' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs text-slate-700">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                PELAYANAN KELILING & INKLUSIF
              </span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <Scale className="w-4 h-4 text-[#0E29CD]" />
                <span>{menuLh4?.judul || 'Sidang di Luar Gedung Pengadilan Militer Tinggi V Makassar'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {menuLh4?.subJudul || 'Berdasarkan PERMA No. 1/2014 & SK Dirjen Badilmiltun SK 593/2026'}
              </p>
            </div>
            {isAdminOrStaff && (
              <button
                type="button"
                onClick={() => { setEditingMenuId('lh4'); setIsMenuModalOpen(true); }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Sidang Keliling (Role Admin)</span>
              </button>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed">
            {menuLh4?.kontenUtama || 'Pengadilan Militer Tinggi V Makassar menyelenggarakan Sidang di Luar Gedung (Sidang Keliling) untuk mendekatkan keadilan kepada prajurit dan masyarakat di wilayah hukum perbatasan dan pangkalan militer terluar di Sulawesi Selatan, Sulawesi Tengah, Sulawesi Tenggara, Gorontalo, dan Sulawesi Utara.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold block text-xs">Jadwal & Lokasi Sidang Keliling:</strong>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <span>Sidang Keliling Oditurat Militer IV-16 Manado</span>
                  <span className="font-bold text-emerald-700">Triwulan I & III</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <span>Sidang Keliling Ruang Sidang Dilmil III-16 Makassar</span>
                  <span className="font-bold text-emerald-700">Berkala / Sesuai Perkara</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <span>Sidang Keliling Wilayah Sulawesi Tenggara (Korem 143/HO)</span>
                  <span className="font-bold text-emerald-700">Triwulan II & IV</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold block text-xs">Persyaratan & Fasilitas Tambahan:</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Bebas biaya pendaftaran dan administrasi sidang bagi pemohon;</li>
                <li>Disediakan Layanan PTSP Keliling & Konsultasi Posbakum di lokasi;</li>
                <li>Fasilitas persidangan e-Court Hybrid untuk pemanggilan saksi jarak jauh.</li>
              </ul>
            </div>
          </div>

          {/* Unduh SK & SOP Sidang di Luar Gedung */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 text-xs">
                SK Penetapan Program Kerja & Jadwal Sidang di Luar Gedung Pengadilan (Sidang Keliling) TA 2026
              </div>
              <div className="text-[10px] font-mono text-slate-500">Nomor: W5-Mil.01/SK.HK2/I/2026/09 • PDF (1.5 MB)</div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleDownloadLegalDoc(
                  'SK Penetapan Program Kerja & Jadwal Sidang di Luar Gedung Pengadilan TA 2026',
                  'W5-Mil.01/SK.HK2/I/2026/09',
                  'Sidang di Luar Gedung',
                  'Keputusan Kepala Pengadilan Militer Tinggi V Makassar tentang jadwal pelaksanaan sidang keliling dan layanan PTSP keliling di wilayah hukum Indonesia Timur berdasarkan PERMA No. 1 Tahun 2014.',
                  'SK_Sidang_Luar_Gedung_Dilmilti_V_2026.txt'
                )
              }
              className="px-4 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh SK Sidang di Luar Gedung</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB 5: PROSEDUR EKSEKUSI & MONEKSTUN (SK 593/2026 PAGE 22) */}
      {(activeSub as string) === 'eksekusi' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs text-slate-700">
          <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white uppercase tracking-wider">
                PELAKSANAAN PUTUSAN & MON-EKSTUN
              </span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{menuLh5?.judul || 'Prosedur Eksekusi Putusan & Portal Pengawasan MonEksTUN'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {menuLh5?.subJudul || 'Kepastian hukum pelaksanaan putusan pidana militer & sengketa Tata Usaha Militer berkekuatan hukum tetap (Inkracht)'}
              </p>
            </div>
            {isAdminOrStaff && (
              <button
                type="button"
                onClick={() => { setEditingMenuId('lh5'); setIsMenuModalOpen(true); }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Eksekusi (Role Admin)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold block text-xs">1. Pelaksanaan Putusan Pidana, Denda & Ganti Rugi (SK KMA 159/2026 Hal. 1038–1039):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Pelaksanaan putusan BHT dilakukan oleh <strong>Oditur Militer / Oditur Militer Tinggi</strong> setelah menerima salinan putusan dari Panitera;</li>
                <li><strong>Pidana Denda:</strong> Terpidana diberi tenggang waktu <strong>1 (satu) bulan</strong> untuk melunasi denda (kecuali acara cepat dilunasi seketika), dan dapat diperpanjang paling lama 1 bulan;</li>
                <li><strong>Putusan Ganti Rugi:</strong> Pelaksanaannya dilakukan oleh <strong>Panitera sebagai Juru Sita</strong> menurut tata cara putusan perdata;</li>
                <li><strong>Penetapan Keberatan Pihak Ketiga:</strong> Dilaksanakan oleh Oditur Militer/Tinggi dan Kementerian Keuangan dalam waktu <strong>30 (tiga puluh) hari</strong> sejak BHT.</li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
              <strong className="text-emerald-950 font-bold block text-xs">2. Pengawasan & Pengamatan Putusan (Kimwasmat - Hal. 1039–1040):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                <li><strong>Hakim Pengawas dan Pengamat (Kimwasmat)</strong> ditunjuk oleh Kepala Pengadilan berdasarkan surat perintah untuk paling lama <strong>2 (dua) tahun</strong>;</li>
                <li>Mengawasi kepastian pelaksanaan putusan pidana perampasan kemerdekaan, pidana bersyarat (bersama Ankum/Dansat), serta pidana tambahan pemecatan dari dinas militer;</li>
                <li><strong>e-Register Pengawasan dan Pengamatan</strong> wajib dikerjakan, ditutup, dan ditandatangani oleh Panitera setiap hari kerja serta diketahui oleh Kimwasmat.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold block text-xs">3. Eksekusi Sengketa TUN & Aplikasi MonEksTUN:</strong>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pengawasan pelaksanaan putusan Sengketa Tata Usaha Militer yang memerintahkan pencabutan atau penerbitan Keputusan TUN Militer dipantau secara langsung melalui aplikasi <strong>MonEksTUN</strong> Badilmiltun MA-RI.
              </p>
              <a
                href={menuLh5?.customFields?.urlMonekstun || 'https://monekstun.mahkamahagung.go.id'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E29CD] hover:bg-blue-800 text-white font-bold rounded-lg text-[10px] transition-colors mt-1"
              >
                <span>Akses Portal MonEksTUN Mahkamah Agung</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Unduh Dokumen SOP Eksekusi & Kimwasmat */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 text-xs">
                SK Penunjukan Hakim Pengawas dan Pengamat (Kimwasmat) & SOP Pengawasan Eksekusi Putusan BHT TA 2026
              </div>
              <div className="text-[10px] font-mono text-slate-500">Nomor: W5-Mil.01/SK.HK2/I/2026/11 • PDF (1.7 MB)</div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleDownloadLegalDoc(
                  'SK Penunjukan Hakim Pengawas dan Pengamat (Kimwasmat) & SOP Eksekusi Putusan Inkracht TA 2026',
                  'W5-Mil.01/SK.HK2/I/2026/11',
                  'Pengawasan Eksekusi & Kimwasmat',
                  'Pedoman teknis pelaksanaan putusan pidana berkekuatan hukum tetap (BHT), tenggang pelunasan pidana denda 1 bulan, eksekusi putusan ganti rugi, pengawasan Kimwasmat, dan pelaporan MonEksTUN sesuai SK KMA 159/KMA/SK.HK2/VIII/2026.',
                  'SK_Kimwasmat_Dan_SOP_Eksekusi_Putusan_2026.txt'
                )
              }
              className="px-4 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh SK Kimwasmat & SOP Eksekusi</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB 6: TATA TERTIB PERSIDANGAN (SK KMA 159/KMA/SK.HK2/VIII/2026 HAL. 1007-1011) */}
      {activeSub === 'tatatertib' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                PEDOMAN TEKNIS PERSIDANGAN • SK KMA NOMOR 159/KMA/SK.HK2/VIII/2026 (HAL. 1007–1011)
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4 text-[#0E29CD]" />
                <span>{menuLh6?.judul || 'Tata Ruang, Waktu, Pakaian Sidang (PDU IV & Tali Kur) dan Tata Tertib Persidangan'}</span>
              </h3>
            </div>
            {isAdminOrStaff && (
              <button
                type="button"
                onClick={() => { setEditingMenuId('lh6'); setIsMenuModalOpen(true); }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Tata Tertib (Role Admin)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold block text-xs uppercase">1. Pakaian Sidang & Warna Tali Kur (Hal. 1008–1009):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li><strong>Hakim Militer, Oditur &amp; Panitera Pengganti:</strong> Memakai <strong>PDU IV</strong> dengan <strong>Tali Kur di bahu kanan</strong>;</li>
                <li><strong>Hakim Militer:</strong> Tali kur warna <strong>Merah kombinasi Hitam</strong>;</li>
                <li><strong>Oditur Militer / Oditur Militer Tinggi:</strong> Tali kur warna <strong>Merah kombinasi Kuning</strong>;</li>
                <li><strong>Panitera Pengganti:</strong> Tali kur warna <strong>Merah kombinasi Biru</strong>;</li>
                <li><strong>Penasihat Hukum (PNS TNI / Luar Dinas Hukum TNI):</strong> Mengenakan pakaian <strong>Toga</strong>;</li>
                <li><strong>Terdakwa Militer Aktif:</strong> Mengenakan <strong>PDH</strong> dengan tutup kepala <strong>muts harian angkatan</strong> tanpa tanda jasa, tanda kehormatan &amp; tanda keahlian (Purnawirawan dilarang memakai atribut militer aktif).</li>
              </ul>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2">
              <strong className="text-emerald-950 font-bold block text-xs uppercase">2. Tata Ruang & Waktu Sidang (Hal. 1007–1008):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                <li>Sidang pengadilan dimulai pukul <strong>09.00 waktu setempat</strong>;</li>
                <li>Meja dan kursi Hakim serta Panitera Pengganti terletak lebih tinggi <strong>20 cm</strong> dari tempat Oditur, Terdakwa, Saksi, Ahli, Penasihat Hukum, dan pengunjung;</li>
                <li>Meja Oditur di sisi kanan depan Majelis Hakim; Meja Penasihat Hukum di sisi kiri depan Majelis Hakim; Kursi Terdakwa di sisi kanan meja Penasihat Hukum;</li>
                <li>Di samping kanan meja Majelis Hakim ditempatkan Bendera Merah Putih, di samping kiri Bendera Pengadilan, dan di dinding atas belakang Lambang Negara.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 font-bold block text-xs uppercase">3. Pakta Integritas & Ketertiban Sidang (Hal. 1009–1011):</strong>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                <li>Sebelum sidang dimulai, Panitera Pengganti wajib menjelaskan <strong>Pakta Integritas</strong> kepada Terdakwa untuk ditandatangani;</li>
                <li>Hadirin wajib berdiri saat Majelis Hakim memasuki/meninggalkan ruang sidang serta memberi penghormatan militer/membungkuk saat keluar-masuk ruang sidang;</li>
                <li>Dilarang membawa senjata api, senjata tajam, bahan peledak, atau benda berbahaya (wajib dititipkan kepada petugas keamanan sidang);</li>
                <li>Pengambilan foto, rekaman audio/visual harus atas izin Ketua Majelis sebelum sidang dimulai dan dilarang pada sidang tertutup.</li>
              </ul>
            </div>
          </div>

          {/* Unduh SK Tata Tertib Persidangan & Format Pakta Integritas */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 text-xs">
                SK Tata Tertib Persidangan, Protokol Keamanan Ruang Sidang & Format Pakta Integritas (SK KMA 159/2026)
              </div>
              <div className="text-[10px] font-mono text-slate-500">Nomor: W5-Mil.01/SK.HK2/I/2026/12 • PDF (1.4 MB)</div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleDownloadLegalDoc(
                  'SK Tata Tertib Persidangan, Pakaian Dinas Sidang (PDU IV) & Pakta Integritas TA 2026',
                  'W5-Mil.01/SK.HK2/I/2026/12',
                  'Tata Tertib Persidangan',
                  'Ketentuan resmi tata ruang sidang, waktu mulai sidang pukul 09.00, pemakaian PDU IV beserta warna tali kur (Hakim, Oditur, Panitera Pengganti), penandatanganan Pakta Integritas sebelum sidang, dan larangan membawa senjata ke ruang sidang sesuai Hal. 1007-1011 SK KMA 159/2026.',
                  'SK_Tata_Tertib_Persidangan_PDU_IV_2026.txt'
                )
              }
              className="px-4 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh SK Tata Tertib Sidang</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB 7: BIAYA PERKARA */}
      {activeSub === 'biaya-perkara' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="pb-3 border-b border-slate-100">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 uppercase tracking-wider">
              TRANSPARANSI BIAYA PERKARA & PNBP
            </span>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
              <Scale className="w-4 h-4 text-[#0D4A2B]" />
              <span>Ketentuan Biaya Perkara Pidana Militer & Tata Usaha Militer</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Berdasarkan UU No. 31 Tahun 1997 tentang Peradilan Militer & PP Nomor 5 Tahun 2019 tentang PNBP Mahkamah Agung RI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-emerald-950 font-black text-xs">1. Perkara Pidana Militer (Pertama, Banding, Kasasi, PK)</strong>
                <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-[10px]">RP 0,- (BEBAN NEGARA)</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Sesuai Pasal 248 UU No. 31 Tahun 1997, seluruh biaya pemeriksaan perkara pidana militer pada tingkat pertama maupun tingkat banding dibebankan kepada Negara, kecuali putusan hakim menentukan lain. Pendaftaran upaya hukum banding pidana militer <strong>tidak dipungut panjar biaya perkara</strong>.
              </p>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-amber-950 font-black text-xs">2. Perkara Sengketa Tata Usaha Militer (TUN TNI)</strong>
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px]">SESUAI TAKSIRAN e-SKUM</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Untuk gugatan Sengketa Tata Usaha Militer, panjar biaya perkara dihitung secara otomatis melalui sistem <strong>e-Court (e-SKUM)</strong> dan disetorkan langsung ke Rekening Virtual Account Bank Mitra resmi tanpa transaksi tunai (Cashless).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px]">
                  <th className="p-3 font-bold">Komponen Penerimaan Negara Bukan Pajak (PNBP)</th>
                  <th className="p-3 font-bold">Dasar Regulasi</th>
                  <th className="p-3 font-bold text-right">Tarif Resmi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Pendaftaran Gugatan Sengketa Tata Usaha Militer Tk. Pertama</td>
                  <td className="p-3 text-slate-500">PP No. 5 Tahun 2019</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-800">Rp 30.000,-</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Pendaftaran Permohonan Kasasi Sengketa TUN Militer</td>
                  <td className="p-3 text-slate-500">PP No. 5 Tahun 2019</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-800">Rp 50.000,-</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Redaksi Putusan / Penetapan Pengadilan</td>
                  <td className="p-3 text-slate-500">PP No. 5 Tahun 2019</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-800">Rp 10.000,-</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Penyerahan Turunan / Salinan Putusan (per halaman)</td>
                  <td className="p-3 text-slate-500">PP No. 5 Tahun 2019</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-800">Rp 500,- / Lembar</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Unduh SK Panjar Biaya Perkara & Tarif PNBP */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 text-xs">
                SK Penetapan Panjar Biaya Perkara Sengketa TUN Militer & Tarif Resmi PNBP (PP No. 5 Tahun 2019) TA 2026
              </div>
              <div className="text-[10px] font-mono text-slate-500">Nomor: W5-Mil.01/SK.HK2/I/2026/06 • PDF (1.6 MB)</div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleDownloadLegalDoc(
                  'SK Penetapan Panjar Biaya Perkara & Tarif PNBP Pengadilan Militer Tinggi V Makassar TA 2026',
                  'W5-Mil.01/SK.HK2/I/2026/06',
                  'Biaya Perkara & PNBP',
                  'Keputusan Kepala Pengadilan Militer Tinggi V Makassar tentang pembebanan biaya perkara pidana militer kepada Negara (Rp 0,-) sesuai Pasal 248 UU No. 31 Tahun 1997 serta rincian panjar biaya perkara Sengketa Tata Usaha Militer dan tarif PNBP sesuai PP No. 5 Tahun 2019.',
                  'SK_Biaya_Perkara_Dan_Tarif_PNBP_2026.txt'
                )
              }
              className="px-4 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh SK Biaya Perkara & PNBP</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB 8: FAQ MASYARAKAT */}
      {activeSub === 'faq' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs text-slate-700">
          <div className="pb-3 border-b border-slate-100">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              TANYA JAWAB LAYANAN HUKUM
            </span>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 mt-1">
              <FileText className="w-4 h-4 text-[#0D4A2B]" />
              <span>FAQ Masyarakat (Pertanyaan yang Sering Diajukan)</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Panduan cepat bagi prajurit TNI, keluarga, penasihat hukum, dan masyarakat pencari keadilan di Dilmilti V Makassar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                q: '1. Perkara apa saja yang menjadi kewenangan Pengadilan Militer Tinggi V Makassar?',
                a: 'Pengadilan Militer Tinggi V Makassar berwenang memeriksa dan memutus: (a) Perkara pidana militer tingkat banding dari 6 Pengadilan Militer tingkat pertama di Indonesia Timur; (b) Perkara pidana militer tingkat pertama dengan Terdakwa berpangkat Mayor ke atas; dan (c) Gugatan Sengketa Tata Usaha Militer.'
              },
              {
                q: '2. Apakah pengajuan upaya hukum banding pidana militer dikenakan biaya?',
                a: 'Tidak. Seluruh proses pemeriksaan perkara pidana militer di Pengadilan Militer Tinggi V Makassar dibebankan kepada Negara (Rp 0,-) dan bebas dari pungutan liar.'
              },
              {
                q: '3. Bagaimana cara mengecek status perkara banding dan jadwal sidang?',
                a: 'Anda dapat mengakses menu SIPP atau Jadwal Sidang pada website ini secara real-time 24 jam, atau mendaftarkan nomor WhatsApp pada fitur Notifikasi Sidang Otomatis.'
              },
              {
                q: '4. Apakah keluarga prajurit atau masyarakat kurang mampu bisa mendapat bantuan hukum gratis?',
                a: 'Ya. Pengadilan Militer Tinggi V Makassar menyediakan Pos Bantuan Hukum (Posbakum) gratis untuk konsultasi hukum, pembuatan dokumen hukum (memori/kontra memori banding), serta layanan berperkara secara Prodeo (cuma-cuma).'
              },
              {
                q: '5. Bagaimana prosedur permohonan salinan putusan atau informasi publik?',
                a: 'Permohonan dapat diajukan langsung melalui Meja 3 PTSP (Hukum & PPID) atau secara daring melalui menu PTSP Online / e-PPID dengan melampirkan identitas resmi.'
              },
              {
                q: '6. Ke mana masyarakat melapor jika menemukan indikasi pelanggaran kode etik atau pungli?',
                a: 'Laporan dapat disampaikan secara rahasia melalui aplikasi SIWAS MA-RI (siwas.mahkamahagung.go.id), SP4N-LAPOR!, atau Form Pengaduan resmi pada website ini.'
              },
              {
                q: '7. Berapa lama tenggang waktu pengajuan Banding dan Kasasi dalam perkara pidana militer?',
                a: 'Sesuai Buku II SK KMA 159/2026, permohonan Banding diajukan paling lambat 7 (tujuh) hari setelah putusan diucapkan/diberitahukan, sedangkan permohonan Kasasi diajukan paling lambat 14 (empat belas) hari disertai memori kasasi dalam 14 hari berikutnya.'
              },
              {
                q: '8. Bagaimana tata cara pengajuan izin besuk tahanan militer pada tingkat banding?',
                a: 'Pemohon (keluarga/penasihat hukum/kesatuan) dapat mengajukan permohonan izin besuk tahanan secara online melalui menu PTSP Online atau langsung di Meja 1 PTSP Kepaniteraan Pidana dengan melampirkan identitas resmi (KTP/KTA TNI).'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 font-extrabold block text-xs">{item.q}</strong>
                <p className="text-[11px] text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          {/* Unduh Buku Saku FAQ Layanan Hukum */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-900 text-xs">
                Buku Saku Panduan & Tanya Jawab (FAQ) Layanan Hukum Pengadilan Militer Tinggi V Makassar TA 2026
              </div>
              <div className="text-[10px] font-mono text-slate-500">Nomor: W5-Mil.01/HM.01/FAQ/2026 • PDF (1.5 MB)</div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleDownloadLegalDoc(
                  'Buku Saku Panduan & Tanya Jawab (FAQ) Layanan Hukum Pengadilan Militer Tinggi V Makassar TA 2026',
                  'W5-Mil.01/HM.01/FAQ/2026',
                  'Panduan & FAQ Masyarakat',
                  'Ringkasan tanya jawab lengkap mengenai kewenangan mengadili Dilmilti V Makassar, prosedur upaya hukum banding/kasasi/PK/grasi, layanan Posbakum & Prodeo gratis, e-Court, e-Berpadu, dan keterbukaan informasi publik.',
                  'Buku_Saku_FAQ_Layanan_Hukum_Dilmilti_V_2026.txt'
                )
              }
              className="px-4 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Buku Saku FAQ</span>
            </button>
          </div>
        </div>
      )}

      {/* Menu Content Edit Modal for Legal Services (Admin Role) */}
      <MenuContentEditModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        menuId={editingMenuId}
      />

    </section>
  );
}
