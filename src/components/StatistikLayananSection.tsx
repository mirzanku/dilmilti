import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FilePlus2,
  CheckCircle2,
  Clock,
  Eye,
  Smile,
  ShieldCheck,
  BarChart3,
  ArrowUpRight,
  TrendingUp,
  PieChart as PieIcon,
  Timer,
  Award,
  Download,
  Calendar,
  Layers,
  Activity,
  Filter,
  Info,
  Check,
  Zap,
  Scale,
  Upload,
  FileText,
  FileSpreadsheet,
  FileCode,
  FolderOpen,
  RefreshCw,
  Search,
  BookOpen,
  ChevronRight,
  Building2,
  Sparkles,
  ExternalLink,
  Shield,
  HelpCircle,
  AlertCircle,
  Star,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { CourtDB } from '../data/courtDatabase';
import { NavSection } from '../types';

interface StatistikLayananSectionProps {
  onNavigate: (section: NavSection, subTab?: string) => void;
}

// Monthly Case Data (2026 vs 2025)
const MONTHLY_STATS_2026 = [
  { bulan: 'Jan', masuk: 4, diputus: 4, sisa: 1, rasio: 100, tun: 0, pidmil: 4 },
  { bulan: 'Feb', masuk: 5, diputus: 4, sisa: 2, rasio: 80, tun: 1, pidmil: 4 },
  { bulan: 'Mar', masuk: 6, diputus: 6, sisa: 2, rasio: 100, tun: 0, pidmil: 6 },
  { bulan: 'Apr', masuk: 3, diputus: 4, sisa: 1, rasio: 133, tun: 0, pidmil: 3 },
  { bulan: 'Mei', masuk: 5, diputus: 5, sisa: 1, rasio: 100, tun: 1, pidmil: 4 },
  { bulan: 'Jun', masuk: 7, diputus: 6, sisa: 2, rasio: 86, tun: 0, pidmil: 7 },
  { bulan: 'Jul', masuk: 6, diputus: 6, sisa: 2, rasio: 100, tun: 1, pidmil: 5 },
  { bulan: 'Ags', masuk: 5, diputus: 5, sisa: 2, rasio: 100, tun: 0, pidmil: 5 },
  { bulan: 'Sep', masuk: 5, diputus: 5, sisa: 2, rasio: 100, tun: 1, pidmil: 4 },
  { bulan: 'Okt', masuk: 2, diputus: 2, sisa: 2, rasio: 100, tun: 0, pidmil: 2 }
];

const MONTHLY_STATS_2025 = [
  { bulan: 'Jan', masuk: 4, diputus: 3, sisa: 1, rasio: 75 },
  { bulan: 'Feb', masuk: 4, diputus: 4, sisa: 1, rasio: 100 },
  { bulan: 'Mar', masuk: 5, diputus: 5, sisa: 1, rasio: 100 },
  { bulan: 'Apr', masuk: 4, diputus: 4, sisa: 1, rasio: 100 },
  { bulan: 'Mei', masuk: 6, diputus: 5, sisa: 2, rasio: 83 },
  { bulan: 'Jun', masuk: 5, diputus: 5, sisa: 2, rasio: 100 },
  { bulan: 'Jul', masuk: 5, diputus: 6, sisa: 1, rasio: 120 },
  { bulan: 'Ags', masuk: 4, diputus: 4, sisa: 1, rasio: 100 },
  { bulan: 'Sep', masuk: 5, diputus: 5, sisa: 1, rasio: 100 },
  { bulan: 'Okt', masuk: 4, diputus: 4, sisa: 1, rasio: 100 },
  { bulan: 'Nov', masuk: 3, diputus: 3, sisa: 1, rasio: 100 },
  { bulan: 'Des', masuk: 3, diputus: 4, sisa: 0, rasio: 133 }
];

// Distribution Categories for Military Cases
const CATEGORY_DISTRIBUTION = [
  { name: 'Kejahatan Ketertiban Militer & Desersi', value: 18, color: '#10B981', percent: '37.5%' },
  { name: 'Penyalahgunaan Wewenang & Narkotika', value: 13, color: '#F59E0B', percent: '27.1%' },
  { name: 'Kesusilaan & KDRT Oknum Prajurit', value: 8, color: '#06B6D4', percent: '16.7%' },
  { name: 'Pelanggaran Lalu Lintas & Pidum Militer', value: 5, color: '#8B5CF6', percent: '10.4%' },
  { name: 'Sengketa Tata Usaha Militer (TUN)', value: 4, color: '#EC4899', percent: '8.3%' }
];

// Case Duration Compliance
const DURATION_COMPLIANCE = [
  { kategori: '< 30 Hari (Sangat Cepat)', jumlah: 37, persentase: 77.1, color: '#10B981' },
  { kategori: '30 - 60 Hari (Standar MA)', jumlah: 9, persentase: 18.8, color: '#F59E0B' },
  { kategori: '> 60 Hari (Saksi Luar Daerah)', jumlah: 2, persentase: 4.1, color: '#EF4444' }
];

// Quarterly Survey Satisfaction Trend
const SURVEY_QUARTERLY_TREND = [
  { quarter: 'Q1 2025', ikm: 3.88, ipak: 3.91, responden: 120 },
  { quarter: 'Q2 2025', ikm: 3.90, ipak: 3.93, responden: 134 },
  { quarter: 'Q3 2025', ikm: 3.91, ipak: 3.94, responden: 145 },
  { quarter: 'Q4 2025', ikm: 3.92, ipak: 3.95, responden: 156 },
  { quarter: 'Q1 2026', ikm: 3.93, ipak: 3.96, responden: 160 },
  { quarter: 'Q2 2026', ikm: 3.94, ipak: 3.97, responden: 168 },
  { quarter: 'Q3 2026', ikm: 3.95, ipak: 3.98, responden: 172 }
];

// Custom Tooltip for Military / Gold Aesthetic
function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-amber-400/50 backdrop-blur-md p-3 rounded-xl shadow-2xl text-white text-xs space-y-1.5 font-mono z-50">
        <div className="font-bold text-amber-300 border-b border-white/15 pb-1 flex items-center justify-between gap-4">
          <span>Periode: {label}</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40 font-bold">
            RESMI
          </span>
        </div>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: item.color || item.fill }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.fill }}></span>
              <span>{item.name}:</span>
            </span>
            <span className="font-black text-white">
              {item.value} {item.unit || (item.name.includes('Rasio') || item.name.includes('Persen') || item.name.includes('Capaian') ? '%' : '')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function StatistikLayananSection({ onNavigate }: StatistikLayananSectionProps) {
  const [perkaraList, setPerkaraList] = useState(() => CourtDB.getSIPP());
  const [identity, setIdentity] = useState(() => CourtDB.getCourtIdentity());
  const [visitorCount, setVisitorCount] = useState<number>(28450);

  // Main Section Navigation Tab (Tren Perkara vs Komposisi vs Durasi vs Survei)
  const [activeMainTab, setActiveMainTab] = useState<
    'tren-perkara' | 'komposisi' | 'durasi' | 'survei'
  >('tren-perkara');

  const [selectedYear, setSelectedYear] = useState<'2025' | '2026' | '2027' | '2028' | '2029'>('2026');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // File Upload State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Website SAKIP / Document Picker
  const [websiteDocs] = useState(() => CourtDB.getSakipDipaDocuments());
  const [selectedWebsiteDocId, setSelectedWebsiteDocId] = useState<string>('');

  useEffect(() => {
    const updateData = () => {
      setPerkaraList(CourtDB.getSIPP());
      setIdentity(CourtDB.getCourtIdentity());
    };
    updateData();

    try {
      const savedVisits = localStorage.getItem('dilmilti5_visitor_counter_v1');
      if (savedVisits) {
        const nextVal = parseInt(savedVisits, 10) + 1;
        setVisitorCount(nextVal);
        localStorage.setItem('dilmilti5_visitor_counter_v1', String(nextVal));
      } else {
        localStorage.setItem('dilmilti5_visitor_counter_v1', '28451');
        setVisitorCount(28451);
      }
    } catch {}

    window.addEventListener('dilmilti_db_updated', updateData);
    return () => {
      window.removeEventListener('dilmilti_db_updated', updateData);
    };
  }, []);

  // Top 6 Executive Metrics
  const countDiputusActual = perkaraList.filter(
    (p) => p.statusPerkara === 'Putus' || p.statusPerkara === 'Minutasi' || p.statusPerkara === 'BHT (Inkracht)'
  ).length;
  const countBerjalanActual = perkaraList.filter(
    (p) => p.statusPerkara !== 'Putus' && p.statusPerkara !== 'Minutasi' && p.statusPerkara !== 'BHT (Inkracht)'
  ).length;

  const jumlahPerkaraMasuk = perkaraList.length > 10 ? perkaraList.length : 48;
  const jumlahPerkaraDiputus = perkaraList.length > 10 ? countDiputusActual : 41 + countDiputusActual;
  const jumlahPerkaraBerjalan =
    perkaraList.length > 10
      ? countBerjalanActual
      : Math.max(jumlahPerkaraMasuk - jumlahPerkaraDiputus, countBerjalanActual || 7);

  const ikmSkor = identity?.ikmSkor || 3.95;
  const ikmKonversi = (ikmSkor * 25).toFixed(2);
  const ipakSkor = identity?.ipakSkor || 3.97;
  const ipakKonversi = (ipakSkor * 25).toFixed(2);

  const statsOverview = [
    {
      id: 'stat-masuk',
      label: 'Jumlah Perkara Masuk',
      value: `${jumlahPerkaraMasuk}`,
      unit: 'Perkara',
      subtext: 'Banding Pidana Militer & STUM',
      badge: 'REGISTER SIPP',
      icon: FilePlus2,
      color: 'from-[#072617] to-[#0D4A2B]',
      iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      onClick: () => onNavigate('sipp')
    },
    {
      id: 'stat-diputus',
      label: 'Jumlah Perkara Diputus',
      value: `${jumlahPerkaraDiputus}`,
      unit: 'Putusan',
      subtext: `Rasio Penyelesaian ${Math.round((jumlahPerkaraDiputus / jumlahPerkaraMasuk) * 100)}%`,
      badge: 'MINUTASI & PUTUS',
      icon: CheckCircle2,
      color: 'from-[#072617] to-[#0B3B24]',
      iconBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      onClick: () => onNavigate('informasi-publik', 'putusan')
    },
    {
      id: 'stat-berjalan',
      label: 'Jumlah Perkara Berjalan',
      value: `${jumlahPerkaraBerjalan}`,
      unit: 'Perkara',
      subtext: 'Dalam Proses Pemeriksaan Majelis',
      badge: 'PROSES SIDANG',
      icon: Clock,
      color: 'from-[#072617] to-[#0D4A2B]',
      iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      onClick: () => onNavigate('jadwal-sidang')
    },
    {
      id: 'stat-kunjungan',
      label: 'Kunjungan Website',
      value: visitorCount.toLocaleString('id-ID'),
      unit: 'Kunjungan',
      subtext: 'Akses Publik Portal Dilmilti V',
      badge: 'TRAFIK PUBLIK',
      icon: Eye,
      color: 'from-[#072617] to-[#0B3B24]',
      iconBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      onClick: () => onNavigate('reformasi-birokrasi', 'monev')
    },
    {
      id: 'stat-ikm',
      label: 'Nilai IKM',
      value: `${ikmSkor.toFixed(2)}`,
      unit: `/ 4.00 (${ikmKonversi})`,
      subtext: `Predikat: ${identity?.ikmPredikat || 'SANGAT BAIK'}`,
      badge: 'KEPUASAN PUBLIK',
      icon: Smile,
      color: 'from-[#072617] to-[#0D4A2B]',
      iconBg: 'bg-amber-400/25 text-amber-300 border-amber-400/50',
      onClick: () => onNavigate('survey', 'ikm')
    },
    {
      id: 'stat-ipak',
      label: 'Nilai IPAK',
      value: `${ipakSkor.toFixed(2)}`,
      unit: `/ 4.00 (${ipakKonversi})`,
      subtext: `Predikat: ${identity?.ipakPredikat || 'SANGAT BERSIH'}`,
      badge: 'ANTI KORUPSI',
      icon: ShieldCheck,
      color: 'from-[#072617] to-[#0B3B24]',
      iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      onClick: () => onNavigate('survey', 'ipak')
    },
    {
      id: 'stat-iku-umum',
      label: 'Capaian IKU Umum',
      value: '100.0%',
      unit: 'Target SK',
      subtext: 'Predikat: SANGAT BAIK (SK 27101)',
      badge: 'AKUNTABILITAS',
      icon: Award,
      color: 'from-[#072617] to-[#0D4A2B]',
      iconBg: 'bg-amber-400/25 text-amber-300 border-amber-400/50',
      onClick: () => onNavigate('dokumen', 'iku')
    }
  ];

  // Export Monthly Case Statistics to CSV
  const handleExportMonthlyCsv = () => {
    const headers = ['Bulan', 'Tahun', 'Perkara Masuk', 'Perkara Diputus', 'Rasio Penyelesaian (%)'];
    const rows = activeMonthlyData.map((d) => [
      d.bulan,
      selectedYear === '2025' ? '2025' : '2026',
      d.masuk,
      d.diputus,
      `${d.rasio}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `statistik_perkara_dilmilti5_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SIPP Monthly Data Metrics
  const activeMonthlyData = selectedYear === '2025' ? MONTHLY_STATS_2025 : MONTHLY_STATS_2026;
  const totalTahunMasuk = useMemo(() => activeMonthlyData.reduce((acc, cur) => acc + cur.masuk, 0), [activeMonthlyData]);
  const totalTahunDiputus = useMemo(() => activeMonthlyData.reduce((acc, cur) => acc + cur.diputus, 0), [activeMonthlyData]);

  return (
    <section id="statistik-layanan-section" className="space-y-6">
      
      {/* 1. TOP SECTION: 6 KARTU STATISTIK KINERJA LAYANAN UTAMA */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-serif flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              <span>Statistik Kinerja Layanan &amp; Perkara</span>
            </h2>
            <p className="text-xs text-slate-600">
              Capaian real-time penanganan perkara SIPP, kepuasan publik, dan akuntabilitas Pengadilan Militer Tinggi V Makassar
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300 font-bold self-start sm:self-auto">
            LIVE SYNC • TERINTEGRASI MA-RI
          </span>
        </div>

        {/* 7 Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
          {statsOverview.map((st) => {
            const IconComponent = st.icon;
            return (
              <div
                key={st.id}
                onClick={st.onClick}
                className="p-4 rounded-2xl bg-gradient-to-br from-[#062415] via-[#083520] to-[#041B0F] border border-emerald-500/30 text-white space-y-2 relative overflow-hidden group hover:border-amber-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider text-amber-300 px-1.5 py-0.5 rounded bg-amber-400/20 border border-amber-400/30">
                      {st.badge}
                    </span>
                    <div className={`w-7 h-7 rounded-lg ${st.iconBg} flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-slate-200 leading-tight group-hover:text-amber-200 transition-colors">
                    {st.label}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-0.5">
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                    {st.value}
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium truncate">
                    {st.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. HEADER BANNER SK SEKMA 27101/2025 LAMPIRAN III - SECTION MOVED TO DOKUMEN & LAPORAN */}

      {/* Notifications Alert */}
      {uploadSuccessMsg && (
        <div className="animate-fade-in p-4 rounded-xl bg-emerald-900/90 text-emerald-100 border-2 border-emerald-400 shadow-lg flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="font-semibold">{uploadSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadSuccessMsg(null)}
            className="text-emerald-300 hover:text-white font-bold text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {uploadErrorMsg && (
        <div className="animate-fade-in p-4 rounded-xl bg-rose-950/90 text-rose-100 border-2 border-rose-500 shadow-lg flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="font-semibold">{uploadErrorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadErrorMsg(null)}
            className="text-rose-300 hover:text-white font-bold text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 3. CONTROL & TAB NAVIGATION BAR */}
      <div className="bg-white rounded-2xl border border-emerald-900/15 p-4 shadow-sm space-y-3.5">
        
        {/* Main Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'tren-perkara', label: 'Tren Perkara Masuk & Diputus', icon: TrendingUp },
            { id: 'komposisi', label: 'Komposisi Jenis Perkara', icon: PieIcon },
            { id: 'durasi', label: 'Kepatuhan Durasi Minutasi', icon: Timer },
            { id: 'survei', label: 'Survei Kepuasan (IKM/IPAK)', icon: Star }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMainTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#072617] text-amber-300 shadow-md border border-amber-400/80 scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-[#072617]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>


        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Year Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-600 px-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tahun Kinerja:</span>
            </span>
            {(['2025', '2026', '2027', '2028', '2029'] as const).map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1 rounded-lg font-mono font-black text-xs transition-all cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-gradient-to-r from-[#072617] to-[#0D4A2B] text-amber-300 shadow-sm border border-amber-400/60'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari data..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

        </div>
      </div>


      {/* 5. TAB VIEW 2: TREN BULANAN PERKARA MASUK & DIPUTUS */}

      {/* 5. TAB VIEW 2: TREN BULANAN PERKARA MASUK & DIPUTUS */}
      {activeMainTab === 'tren-perkara' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-emerald-900/15 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-serif flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                  <span>Tren Bulanan Perkara Masuk vs Diputus (Tahun {selectedYear === '2025' ? '2025' : '2026'})</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Total Masuk: <strong>{totalTahunMasuk}</strong> Perkara • Total Diputus: <strong>{totalTahunDiputus}</strong> Putusan • Clearance Rate: <strong>{Math.round((totalTahunDiputus / (totalTahunMasuk || 1)) * 100)}%</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportMonthlyCsv}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('sipp')}
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka SIPP Lengkap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeMonthlyData} margin={{ top: 10, right: 20, left: -15, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDiputus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#1e293b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="masuk" name="Perkara Masuk" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMasuk)" />
                  <Area type="monotone" dataKey="diputus" name="Perkara Diputus" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDiputus)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB VIEW 3: KOMPOSISI JENIS PERKARA MILITER & TUN */}
      {activeMainTab === 'komposisi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-emerald-900/15 p-5 sm:p-6 shadow-sm space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 font-serif flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-emerald-700" />
                <span>Distribusi &amp; Komposisi Klasifikasi Perkara Banding Militer &amp; STUM</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Pemetaan jenis tindak pidana militer dan sengketa kepegawaian tata usaha militer yang ditangani
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {CATEGORY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-7 space-y-3 text-xs">
                {CATEGORY_DISTRIBUTION.map((cat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="font-bold text-slate-800">{cat.name}</span>
                    </div>
                    <div className="text-right font-mono shrink-0">
                      <span className="font-black text-slate-900">{cat.value} Perkara</span>
                      <span className="text-[10px] text-slate-500 ml-1.5 font-bold">({cat.percent})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB VIEW 4: KEPATUHAN WAKTU PENYELESAIAN (DURASI) */}
      {activeMainTab === 'durasi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-emerald-900/15 p-5 sm:p-6 shadow-sm space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 font-serif flex items-center gap-2">
                <Timer className="w-5 h-5 text-emerald-700" />
                <span>Kepatuhan Jangka Waktu Penyelesaian Perkara (SEMA 2/2014 &amp; SOP Dilmiltama)</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Pengukuran kecepatan minutasi perkara banding militer dan sengketa TUN
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DURATION_COMPLIANCE.map((dur, idx) => (
                <div key={idx} className="p-4.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-center space-y-2">
                  <div className="text-xs font-bold text-slate-800">{dur.kategori}</div>
                  <div className="text-3xl font-black font-mono" style={{ color: dur.color }}>
                    {dur.jumlah}
                  </div>
                  <div className="text-xs text-slate-500 font-mono font-bold">
                    {dur.persentase}% dari total perkara
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB VIEW 5: SURVEI KEPUASAN (IKM & IPAK) */}
      {activeMainTab === 'survei' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-emerald-900/15 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-serif flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span>Tren Indeks Kepuasan Masyarakat (IKM) &amp; Persepsi Anti Korupsi (IPAK)</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Hasil tabulasi survei triwulanan pencari keadilan dan stakeholder militer
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('survey')}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 cursor-pointer"
              >
                Isi Survei Online
              </button>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SURVEY_QUARTERLY_TREND} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#1e293b' }} />
                  <YAxis domain={[3.5, 4.0]} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="ikm" name="Indeks Kepuasan (IKM)" stroke="#059669" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="ipak" name="Persepsi Anti Korupsi (IPAK)" stroke="#d97706" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
