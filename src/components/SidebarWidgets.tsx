import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Users, 
  BarChart, 
  ShieldCheck, 
  Activity, 
  Globe,
  Shield,
  Swords,
  Crosshair,
  Target,
  Award,
  Star,
  Sparkles,
  Rss,
  Radio,
  Copy,
  Check,
  Camera
} from 'lucide-react';
import { OPERATING_HOURS, PUBLIC_SURVEY_DATA } from '../data/contentData';
import { CourtDB } from '../data/courtDatabase';
import { NavSection, RelatedWebsiteItem } from '../types';

const bannerMaklumat = '/images/maklumat_banner_1789442457863.jpg';

interface SidebarWidgetsProps {
  onSearch: (query: string) => void;
  onNavigate: (section: NavSection, subTab?: string) => void;
}

export default function SidebarWidgets({ onSearch, onNavigate }: SidebarWidgetsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [relatedLinks, setRelatedLinks] = useState<RelatedWebsiteItem[]>(() => CourtDB.getRelatedWebsites());
  const [courtIdentity, setCourtIdentity] = useState(() => CourtDB.getCourtIdentity());
  const [quickRating, setQuickRating] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
  const [rssCopied, setRssCopied] = useState<boolean>(false);

  const handleCopyRssUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/rss.xml`;
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setRssCopied(true);
      setTimeout(() => setRssCopied(false), 2500);
    } catch {}
  };

  const handleOpenRssFeedModal = () => {
    window.dispatchEvent(new CustomEvent('dilmilti_open_rss_feed'));
  };

  useEffect(() => {
    setRelatedLinks(CourtDB.getRelatedWebsites());
    setCourtIdentity(CourtDB.getCourtIdentity());
    const handleUpdate = () => {
      setRelatedLinks(CourtDB.getRelatedWebsites());
      setCourtIdentity(CourtDB.getCourtIdentity());
    };
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Makassar is WITA (UTC+8).
      // Standard court hours: Mon-Thu 08:00 - 16:30, Fri 08:00 - 17:00
      const day = now.getDay(); // 0 Sun, 1 Mon, ... 5 Fri, 6 Sat
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeInMinutes = hours * 60 + minutes;

      const isWeekday = day >= 1 && day <= 5;
      const startMinutes = 8 * 60; // 08:00
      const endMinutes = day === 5 ? 17 * 60 : 16 * 60 + 30; // 17:00 or 16:30

      setIsOpenNow(isWeekday && timeInMinutes >= startMinutes && timeInMinutes <= endMinutes);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const filteredRelatedLinks = relatedLinks.filter(
    (link) =>
      !link.url?.toLowerCase().includes('ecourt') &&
      !link.name?.toLowerCase().includes('ecourt') &&
      !link.name?.toLowerCase().includes('e-court')
  );

  return (
    <aside id="sidebar-widgets" aria-label="Widget Informasi Beranda" className="space-y-4">
      
      {/* 1. SEARCH BAR WIDGET (Pencarian Cepat Taktis Global) */}
      <div 
        id="widget-search-bar" 
        style={{ animationDelay: '60ms' }}
        className="animate-sidebar-widget bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 rounded-2xl shadow-md border-2 border-emerald-900/20 p-4 relative overflow-hidden tactical-corners hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="input-search-sidebar" className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-serif">
            <Crosshair className="w-4 h-4 text-emerald-800" />
            <span>Pencarian Cepat Taktis</span>
          </label>
        </div>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            id="input-search-sidebar"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Dokumen PPID, Template, Perkara, Motto REWAKO, Berita..."
            className="w-full pl-3 pr-24 py-2.5 text-xs bg-white border-2 border-emerald-900/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-all text-slate-900 placeholder-slate-400 font-medium"
          />
          <button
            type="submit"
            id="btn-search-sidebar-submit"
            className="absolute right-1 px-3.5 py-1.5 bg-gradient-to-r from-[#0D4A2B] to-[#062416] hover:from-emerald-800 hover:to-emerald-950 text-amber-300 rounded-lg text-xs font-black flex items-center gap-1 transition-colors cursor-pointer border border-emerald-500/40 shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Cari</span>
          </button>
        </form>
      </div>

      {/* BANNER MAKLUMAT PELAYANAN & ZONA INTEGRITAS (Military Styling) */}
      <div 
        id="widget-banner-maklumat"
        style={{ animationDelay: '140ms' }}
        onClick={() => onNavigate('tentang', 'maklumat')}
        className="animate-sidebar-widget relative overflow-hidden rounded-2xl border-2 border-amber-400/70 shadow-lg cursor-pointer group bg-[#0A3D24] tactical-corners hover:shadow-xl transition-all duration-300"
        title="Klik untuk membuka Maklumat Pelayanan Resmi Pengadilan Militer Tinggi V Makassar"
      >
        <img
          src={bannerMaklumat}
          alt="Banner Maklumat Pelayanan dan Zona Integritas WBBM Dilmilti V Makassar"
          referrerPolicy="no-referrer"
          className="w-full h-38 object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02140B] via-[#0A3D24]/70 to-transparent flex flex-col justify-end p-3.5 text-white">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-2 py-0.5 rounded shadow-xs font-mono flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-950" />
              MAKLUMAT RESMI
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-white bg-emerald-800/80 px-2 py-0.5 rounded border border-emerald-400/30">
              WBBM 2026
            </span>
          </div>
          <h5 className="text-xs sm:text-sm font-black leading-tight text-white drop-shadow font-serif">
            Maklumat Pelayanan & Zona Integritas WBBM
          </h5>
          <span className="text-[10px] text-amber-200 mt-0.5 font-medium">
            Keputusan Kadilmilti V Makassar • Zero Pungli & Transparan
          </span>
        </div>
      </div>

      {/* 2. JAM KERJA PENGADILAN DAN PTSP (Military Styling) */}
      <div 
        id="widget-jam-kerja" 
        style={{ animationDelay: '220ms' }}
        className="animate-sidebar-widget bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 rounded-2xl shadow-md border-2 border-emerald-900/20 p-4 relative overflow-hidden tactical-corners hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex items-center justify-between pb-2 border-b-2 border-amber-500/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0D4A2B] text-amber-300 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide font-serif">
              Jam Operasional & PTSP
            </h4>
          </div>
          {/* Live Status indicator */}
          <span 
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              isOpenNow ? 'bg-emerald-100 text-emerald-900 border border-emerald-400' : 'bg-rose-100 text-rose-900 border border-rose-400'
            }`}
          >
            {isOpenNow ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> BUKA
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 text-rose-700" /> TUTUP
              </>
            )}
          </span>
        </div>

        <div className="mt-3 space-y-2 text-xs text-slate-700">
          <div className="bg-white p-2.5 rounded-xl border border-emerald-900/15 shadow-xs">
            <div className="font-bold text-slate-900 text-[11px] mb-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-800" />
              <span>Operasional Kantor:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              • <strong className="text-slate-900">Senin - Kamis:</strong> 08.00 - 16.30 WITA<br />
              • <strong className="text-slate-900">Jumat:</strong> 08.00 - 17.00 WITA
            </p>
          </div>

          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-300 text-[11px]">
            <div className="font-bold text-[#0D4A2B] mb-1 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-[#0D4A2B]" />
              <span>Pendaftaran & Meja PTSP:</span>
            </div>
            <p className="leading-relaxed text-slate-800 font-medium">
              • Tutup Loket: <strong className="text-amber-900 font-bold">15.00 WITA</strong> (Jumat 15.30 WITA)<br />
              • Istirahat: 12.00 - 13.00 WITA (Jumat 11.30 - 13.30)
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 font-mono">
            <span className="font-bold text-slate-800">
              {(() => {
                const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                const months = [
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ];
                const now = currentTime;
                return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
              })()}
            </span>
            <span>
              WITA: <strong className="text-emerald-900 font-black">{currentTime.toLocaleTimeString('id-ID')}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3. INDEKS PELAYANAN PUBLIK (IKM & IPAK) (Military Styling) */}
      <div 
        id="widget-indeks-pelayanan" 
        style={{ animationDelay: '300ms' }}
        className="animate-sidebar-widget bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 rounded-2xl shadow-md border-2 border-emerald-900/20 p-4 relative overflow-hidden tactical-corners hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex items-center justify-between pb-2 border-b-2 border-amber-500/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <BarChart className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide font-serif">
              Indeks Pelayanan Publik
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
            TW II 2026
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {/* IKM */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-emerald-900 to-emerald-950 border border-emerald-500 text-center text-white shadow-xs">
            <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider font-mono">
              IKM (Kepuasan)
            </div>
            <div className="text-xl font-black text-white my-0.5 font-serif">
              {courtIdentity.ikmSkor !== undefined ? courtIdentity.ikmSkor : PUBLIC_SURVEY_DATA.ikm.skor}
              <span className="text-xs font-normal text-emerald-200">/4.00</span>
            </div>
            <div className="text-[9px] font-bold text-slate-950 bg-amber-400 rounded py-0.5 font-mono">
              {courtIdentity.ikmPredikat || PUBLIC_SURVEY_DATA.ikm.predikat}
            </div>
            <div className="text-[9px] text-emerald-200 mt-1">
              {courtIdentity.ikmResponden || PUBLIC_SURVEY_DATA.ikm.totalResponden} Responden
            </div>
          </div>

          {/* IPAK */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-amber-900 to-slate-950 border border-amber-500 text-center text-white shadow-xs">
            <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider font-mono">
              IPAK (Anti Korupsi)
            </div>
            <div className="text-xl font-black text-white my-0.5 font-serif">
              {courtIdentity.ipakSkor !== undefined ? courtIdentity.ipakSkor : PUBLIC_SURVEY_DATA.ipak.skor}
              <span className="text-xs font-normal text-amber-200">/4.00</span>
            </div>
            <div className="text-[9px] font-bold text-slate-950 bg-amber-400 rounded py-0.5 font-mono">
              {courtIdentity.ipakPredikat || PUBLIC_SURVEY_DATA.ipak.predikat}
            </div>
            <div className="text-[9px] text-amber-200 mt-1">
              {courtIdentity.ipakResponden || PUBLIC_SURVEY_DATA.ipak.totalResponden} Responden
            </div>
          </div>
        </div>

        {/* Akses Cepat Rating Kepuasan Pelayanan Hari Ini */}
        <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-white space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-amber-300 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>Beri Nilai Cepat Hari Ini</span>
            </span>
            <span className="text-[9px] text-emerald-300 font-mono">1-Klik</span>
          </div>

          {ratingSubmitted ? (
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-[10px] text-center space-y-0.5 animate-fadeIn">
              <div className="font-extrabold flex items-center justify-center gap-1 text-amber-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terima Kasih!</span>
              </div>
              <p>Penilaian {quickRating} bintang Anda telah dicatat untuk peningkatan mutu layanan.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setQuickRating(star);
                      setRatingSubmitted(true);
                      setTimeout(() => setRatingSubmitted(false), 6000);
                    }}
                    title={`Nilai ${star} dari 5 bintang`}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer group"
                  >
                    <Star className="w-5 h-5 text-amber-400 fill-current opacity-70 group-hover:opacity-100 group-hover:text-amber-300" />
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-400 text-center">
                Pilih bintang 1 (kurang) s.d. 5 (sangat puas)
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNavigate('layanan-publik', 'survei')}
          className="w-full mt-3 py-2 px-3 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-amber-300 rounded-xl text-[11px] font-black transition-colors text-center block cursor-pointer border border-emerald-600 shadow-xs"
        >
          Lihat Rincian Laporan & Isi E-Survei Lengkap →
        </button>
      </div>

      {/* 5. WIDGET DOKUMENTASI KEGIATAN & KUNJUNGAN */}
      <div 
        id="widget-galeri-kegiatan" 
        style={{ animationDelay: '420ms' }}
        className="animate-sidebar-widget bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 rounded-2xl shadow-md border-2 border-emerald-900/20 p-4 relative overflow-hidden tactical-corners hover:shadow-lg transition-shadow duration-300 group"
      >
        <div className="flex items-center justify-between pb-2 border-b-2 border-amber-500/30">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5 font-serif">
            <Camera className="w-4 h-4 text-emerald-800" />
            <span>Dokumentasi Dinas &amp; Kunjungan</span>
          </h4>
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Foto HD
          </span>
        </div>

        <div className="mt-2.5 relative rounded-xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80"
            alt="Kunjungan Resmi Dilmilti V Makassar"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
            <p className="text-[10px] font-bold text-white line-clamp-1 leading-tight">
              Kunjungan Kerja Pimpinan MA &amp; Kodam XIV/Hasanuddin
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('berita', 'galeri-foto')}
          className="w-full mt-2.5 py-1.5 px-3 bg-emerald-900 hover:bg-emerald-800 text-amber-300 rounded-xl text-[11px] font-black transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Buka Galeri Foto &amp; Lightbox →</span>
        </button>
      </div>

      {/* 6. TAUTAN WEBSITE TERKAIT (Military Styling) */}
      <div 
        id="widget-tautan-website" 
        style={{ animationDelay: '460ms' }}
        className="animate-sidebar-widget bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 rounded-2xl shadow-md border-2 border-emerald-900/20 p-4 relative overflow-hidden tactical-corners hover:shadow-lg transition-shadow duration-300"
      >
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide pb-2 border-b-2 border-amber-500/30 flex items-center gap-2 font-serif">
          <Globe className="w-4 h-4 text-[#0D4A2B]" />
          <span>Tautan Website Resmi Mahkamah Agung</span>
        </h4>
        
        <ul className="mt-2.5 space-y-1.5 text-xs">
          {filteredRelatedLinks.map((link, idx) => (
            <li key={link.id || idx} className="border-b border-slate-200/80 last:border-0 pb-1.5 last:pb-0">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-slate-800 hover:text-[#0D4A2B] transition-colors group text-[11px]"
              >
                <div>
                  <span className="font-bold text-slate-900 group-hover:text-[#0D4A2B] block">
                    {link.name}
                  </span>
                  <span className="text-[10px] text-slate-600">{link.role}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700 group-hover:text-amber-600 shrink-0 ml-1" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 7. WIDGET RSS FEED & SINDIKASI OTOMATIS */}
      <div 
        id="widget-rss-feed" 
        style={{ animationDelay: '380ms' }}
        className="animate-sidebar-widget bg-gradient-to-b from-[#082215] via-[#04190F] to-[#020E07] rounded-2xl shadow-lg border-2 border-amber-400/40 p-4 text-white relative overflow-hidden tactical-corners group hover:shadow-xl transition-all duration-300"
      >
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Rss className="w-4 h-4 stroke-[2.2] animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-serif">
                Langganan RSS Feed
              </h4>
              <span className="text-[10px] text-amber-300 font-mono">Sindikasi Berita Otomatis</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            <Radio className="w-2.5 h-2.5 animate-ping" />
            <span>LIVE</span>
          </span>
        </div>

        <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed">
          Dapatkan siaran pers, jadwal sidang, maklumat pimpinan, dan artikel hukum militer terkini langsung di RSS Reader / Bot Anda.
        </p>

        <div className="mt-3 space-y-2">
          <div className="p-2 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-1.5 text-[11px] font-mono text-amber-300">
            <span className="truncate">/rss.xml</span>
            <button
              type="button"
              onClick={handleCopyRssUrl}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                rssCopied
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
              }`}
              title="Salin URL Feed RSS"
            >
              {rssCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{rssCopied ? 'Tersalin' : 'Salin URL'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenRssFeedModal}
            className="w-full py-2 px-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 rounded-xl text-xs font-black transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98"
          >
            <Rss className="w-3.5 h-3.5" />
            <span>Buka Saluran &amp; Pembaca RSS →</span>
          </button>
        </div>
      </div>

      {/* 6. STATISTIK SITUS (Military Styling) */}
      <div 
        id="widget-statistik-situs" 
        style={{ animationDelay: '540ms' }}
        className="animate-sidebar-widget bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 rounded-2xl shadow-md border-2 border-emerald-900/20 p-4 relative overflow-hidden tactical-corners hover:shadow-lg transition-shadow duration-300"
      >
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide pb-2 border-b-2 border-amber-500/30 flex items-center gap-2 font-serif">
          <Activity className="w-4 h-4 text-[#0D4A2B]" />
          <span>Statistik Kunjungan Portal Taktis</span>
        </h4>

        <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-600 block">Hari Ini:</span>
            <span className="font-black text-slate-900 text-sm font-mono">418 Hits</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-600 block">Kemarin:</span>
            <span className="font-black text-slate-900 text-sm font-mono">1,289 Hits</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-600 block">Bulan Ini:</span>
            <span className="font-black text-slate-900 text-sm font-mono">28,450 Hits</span>
          </div>
          <div className="bg-emerald-100/80 p-2 rounded-xl border border-emerald-300">
            <span className="text-[10px] text-emerald-900 block font-bold">Online Live:</span>
            <span className="font-black text-emerald-900 text-sm flex items-center gap-1 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              24 Aktif
            </span>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-700 text-center font-mono font-medium">
          Total Akumulasi: <strong className="text-slate-950 font-bold">482,910 Pengunjung</strong>
        </div>
      </div>

    </aside>
  );
}

