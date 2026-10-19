import React, { useState, useEffect, useRef, FormEvent } from 'react';
import AccessibilityBar from './components/AccessibilityBar';
import Header from './components/Header';
import Navbar from './components/Navbar';
import SliderBanner from './components/SliderBanner';
import QuickAccessGrid from './components/QuickAccessGrid';
import InovasiQuickAccessSection from './components/InovasiQuickAccessSection';
import SidebarWidgets from './components/SidebarWidgets';
import SippSection from './components/SippSection';
import WhatsAppNotificationSection from './components/WhatsAppNotificationSection';
import ECourtSection from './components/ECourtSection';
import JadwalSidangSection from './components/JadwalSidangSection';
import PpidSection from './components/PpidSection';
import TentangPengadilanSection from './components/TentangPengadilanSection';
import LayananPublikSection from './components/LayananPublikSection';
import PtspInfoMenuSection from './components/PtspInfoMenuSection';
import PtspInovasiSection from './components/PtspInovasiSection';
import LayananHukumSection from './components/LayananHukumSection';
import BeritaSection from './components/BeritaSection';
import ReformasiBirokrasiSection from './components/ReformasiBirokrasiSection';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import PopupAnnouncementModal from './components/PopupAnnouncementModal';
import DocumentTemplatesSection from './components/DocumentTemplatesSection';
import StatistikLayananSection from './components/StatistikLayananSection';
import HubungiKamiSection from './components/HubungiKamiSection';
import AiChatbotWidget from './components/AiChatbotWidget';
import GlobalSearchModal from './components/GlobalSearchModal';
import RssFeedModal from './components/RssFeedModal';
import Footer from './components/Footer';
import { 
  MessageSquareCode, 
  Scale, 
  Sparkles, 
  ArrowRight, 
  CalendarClock, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp,
  FileText,
  Laptop,
  Lock,
  Compass,
  Award,
  Shield,
  Target,
  Crosshair,
  Medal,
  Flag,
  Swords,
  Crown,
  Hexagon,
  ShieldAlert,
  Link2,
  Check,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Home,
  MessageSquare,
  Send,
  Share2,
  Headphones
} from 'lucide-react';
import { CourtDB } from './data/courtDatabase';
import { PerkaraSIPP, JadwalSidangItem, NewsItem, UserAccount, CourtIdentityData } from './types';
import {
  getInitialRouteState,
  syncRouteToUrl,
  parseUrlToRoute,
  buildUrlPath,
  updateDocumentTitleForRoute,
  TAB_LABELS,
  SUBTAB_LABELS,
  RouteState
} from './utils/urlRouter';

export default function App() {
  const [initialRoute] = useState<RouteState>(() => {
    try {
      const resolved = getInitialRouteState();
      if (resolved && resolved.tab) {
        return resolved;
      }
    } catch {}
    return { tab: 'beranda', path: '/beranda' };
  });
  const [isRouteInitializing, setIsRouteInitializing] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(initialRoute.tab || 'beranda');
  const [tentangSubTab, setTentangSubTab] = useState<string>(
    initialRoute.tab === 'tentang' && initialRoute.subTab ? initialRoute.subTab : 'sambutan'
  );
  const [publikSubTab, setPublikSubTab] = useState<string>(
    initialRoute.tab === 'publik' && initialRoute.subTab ? initialRoute.subTab : 'jenis-layanan'
  );
  const [hukumSubTab, setHukumSubTab] = useState<string>(
    initialRoute.tab === 'hukum' && initialRoute.subTab ? initialRoute.subTab : 'referensi-uu31'
  );
  const [ppidSubTab, setPpidSubTab] = useState<string>(
    initialRoute.tab === 'ppid' && initialRoute.subTab ? initialRoute.subTab : 'berkala'
  );
  const [reformasiSubTab, setReformasiSubTab] = useState<string>(
    initialRoute.tab === 'reformasi' && initialRoute.subTab ? initialRoute.subTab : 'zona-integritas'
  );
  const [beritaSubTab, setBeritaSubTab] = useState<string>(
    initialRoute.tab === 'berita' && initialRoute.subTab ? initialRoute.subTab : 'berita-terkini'
  );
  const [dokumenSubTab, setDokumenSubTab] = useState<string>(
    initialRoute.tab === 'dokumen' && initialRoute.subTab ? initialRoute.subTab : 'laporan-tahunan'
  );
  const [hubungiSubTab, setHubungiSubTab] = useState<string>(
    initialRoute.tab === 'hubungi-kami' && initialRoute.subTab ? initialRoute.subTab : 'alamat'
  );
  const [ptspSubTab, setPtspSubTab] = useState<'app-viewer' | 'antrean' | 'permohonan' | 'lacak' | 'validasi-tte' | 'monitor' | 'konsultasi' | 'pengaturan'>(
    initialRoute.tab === 'ptsp-inovasi' && initialRoute.subTab ? (initialRoute.subTab as any) : 'app-viewer'
  );
  const [ptspInitialService, setPtspInitialService] = useState<string | undefined>(undefined);
  const [waPrefilledPerkara, setWaPrefilledPerkara] = useState<string>('24-K/PMT.V/BDG/AD/VIII/2026');
  const [copiedRouteUrl, setCopiedRouteUrl] = useState<boolean>(false);
  
  // Global Search state
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  
  // RSS Feed Modal state
  const [isRssFeedOpen, setIsRssFeedOpen] = useState<boolean>(false);
  
  // Auth state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => CourtDB.getCurrentSession());
  const [courtIdentity, setCourtIdentity] = useState<CourtIdentityData>(() => CourtDB.getCourtIdentity());

  // Reactive data for homepage widgets
  const [perkaraList, setPerkaraList] = useState<PerkaraSIPP[]>(() => CourtDB.getSippList());
  const [jadwalList, setJadwalList] = useState<JadwalSidangItem[]>(() => CourtDB.getJadwalList());
  const [newsList, setNewsList] = useState<NewsItem[]>(() => CourtDB.getNewsList());
  const [homeCommentInputs, setHomeCommentInputs] = useState<Record<string, { name: string; text: string }>>({});
  const [homeCommentSaved, setHomeCommentSaved] = useState<Record<string, boolean>>({});

  const handleHomeNewsComment = (e: React.FormEvent, newsId: string | number) => {
    e.preventDefault();
    const key = String(newsId);
    const input = homeCommentInputs[key] || { name: '', text: '' };
    if (!input.text.trim()) return;

    CourtDB.addNewsComment(newsId, {
      authorName: input.name.trim() || currentUser?.nama || 'Pengunjung Portal',
      authorRole: currentUser?.instansi || 'Masyarakat Umum',
      content: input.text.trim()
    });

    setNewsList(CourtDB.getNewsList());
    setHomeCommentInputs((prev) => ({ ...prev, [key]: { name: input.name, text: '' } }));
    setHomeCommentSaved((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setHomeCommentSaved((prev) => ({ ...prev, [key]: false }));
    }, 2500);
  };

  useEffect(() => {
    setPerkaraList(CourtDB.getSippList());
    setJadwalList(CourtDB.getJadwalList());
    setNewsList(CourtDB.getNewsList());
    setCurrentUser(CourtDB.getCurrentSession());

    // Ensure URL route state is parsed and synchronized safely on initial mount / page refresh
    try {
      const resolved = getInitialRouteState();
      const safeTab = resolved?.tab || 'beranda';
      setActiveTab(safeTab);
      if (resolved?.subTab) {
        if (safeTab === 'tentang') setTentangSubTab(resolved.subTab);
        else if (safeTab === 'publik') setPublikSubTab(resolved.subTab);
        else if (safeTab === 'hukum') setHukumSubTab(resolved.subTab);
        else if (safeTab === 'ppid') setPpidSubTab(resolved.subTab);
        else if (safeTab === 'reformasi') setReformasiSubTab(resolved.subTab);
        else if (safeTab === 'berita') setBeritaSubTab(resolved.subTab);
        else if (safeTab === 'dokumen') setDokumenSubTab(resolved.subTab);
        else if (safeTab === 'hubungi-kami') setHubungiSubTab(resolved.subTab);
        else if (safeTab === 'ptsp-inovasi') setPtspSubTab(resolved.subTab as any);
      }
      updateDocumentTitleForRoute(safeTab, resolved?.subTab);
    } catch {
      setActiveTab('beranda');
    }

    const readyTimer = window.setTimeout(() => {
      setIsRouteInitializing(false);
      try {
        const resolved = getInitialRouteState();
        if (resolved && resolved.tab && resolved.tab !== 'beranda') {
          window.scrollTo({ top: 110, behavior: 'smooth' });
        }
      } catch {}
    }, 180);

    const handleDbUpdate = () => {
      setPerkaraList(CourtDB.getSippList());
      setJadwalList(CourtDB.getJadwalList());
      setNewsList(CourtDB.getNewsList());
      setCurrentUser(CourtDB.getCurrentSession());
      setCourtIdentity(CourtDB.getCourtIdentity());
    };

    window.addEventListener('dilmilti_db_updated', handleDbUpdate);
    return () => {
      window.clearTimeout(readyTimer);
      window.removeEventListener('dilmilti_db_updated', handleDbUpdate);
    };
  }, []);

  // Listen to browser Back/Forward (popstate) and internal sub-tab URL updates
  useEffect(() => {
    const applyRouteState = (route: RouteState) => {
      setActiveTab((prev) => (prev !== route.tab ? route.tab : prev));
      if (route.subTab) {
        if (route.tab === 'tentang') setTentangSubTab((prev) => (prev !== route.subTab ? route.subTab! : prev));
        else if (route.tab === 'publik') setPublikSubTab((prev) => (prev !== route.subTab ? route.subTab! : prev));
        else if (route.tab === 'hukum') setHukumSubTab((prev) => (prev !== route.subTab ? route.subTab! : prev));
        else if (route.tab === 'ppid') setPpidSubTab((prev) => (prev !== route.subTab ? route.subTab! : prev));
        else if (route.tab === 'reformasi') setReformasiSubTab((prev) => (prev !== route.subTab ? route.subTab! : prev));
        else if (route.tab === 'berita') setBeritaSubTab((prev) => (prev !== route.subTab ? route.subTab! : prev));
        else if (route.tab === 'dokumen') setDokumenSubTab((prev) => (prev !== route.subTab ? route.subTab! : prev));
        else if (route.tab === 'hubungi-kami') setHubungiSubTab((prev) => (prev !== route.subTab ? route.subTab! : prev));
        else if (route.tab === 'ptsp-inovasi') setPtspSubTab((prev) => (prev !== route.subTab ? (route.subTab as any) : prev));
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        applyRouteState(event.state as RouteState);
        return;
      }
      const parsed = parseUrlToRoute(
        window.location.pathname,
        window.location.search,
        window.location.hash
      );
      if (parsed) {
        applyRouteState(parsed);
      } else {
        applyRouteState({ tab: 'beranda', path: '/beranda' });
      }
    };

    const handleInternalRouteChange = (event: Event) => {
      const customEvt = event as CustomEvent<RouteState>;
      if (customEvt.detail) {
        applyRouteState(customEvt.detail);
      }
    };

    const handleOpenRssModal = () => {
      setIsRssFeedOpen(true);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('dilmilti_route_changed', handleInternalRouteChange);
    window.addEventListener('dilmilti_open_rss_feed', handleOpenRssModal);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('rss') === 'true' || urlParams.get('feed') === 'true' || urlParams.get('view') === 'rss') {
        setIsRssFeedOpen(true);
      }
    } catch {}

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('dilmilti_route_changed', handleInternalRouteChange);
      window.removeEventListener('dilmilti_open_rss_feed', handleOpenRssModal);
    };
  }, []);

  const getActiveSubTabForTab = (tabName: string): string | undefined => {
    if (tabName === 'tentang') return tentangSubTab;
    if (tabName === 'publik') return publikSubTab;
    if (tabName === 'hukum') return hukumSubTab;
    if (tabName === 'ppid') return ppidSubTab;
    if (tabName === 'reformasi') return reformasiSubTab;
    if (tabName === 'berita') return beritaSubTab;
    if (tabName === 'dokumen') return dokumenSubTab;
    if (tabName === 'hubungi-kami') return hubungiSubTab;
    if (tabName === 'ptsp-inovasi') return ptspSubTab;
    return undefined;
  };

  const handleNavigate = (tab: string, subTab?: string) => {
    setIsRouteInitializing(false);

    if (tab === 'dokumen' && (subTab === 'statistik-perkara' || subTab === 'iku')) {
      setActiveTab('beranda');
      syncRouteToUrl('beranda', undefined, false);
      setTimeout(() => {
        const el = document.getElementById('beranda-statistik-layanan');
        if (el) {
          const yOffset = -85;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
      return;
    }

    let normalizedTab = tab;
    if (tab === 'ptsp-online' || tab === 'ptsp-inovasi') normalizedTab = 'ptsp-online';
    else if (tab === 'ptsp') {
      normalizedTab = 'publik';
      subTab = 'jenis-layanan';
    }
    else if (tab === 'inovasi') normalizedTab = 'ptsp-online';
    else if (tab === 'profil-pegawai') normalizedTab = 'tentang';
    else if (tab === 'layanan-publik' || tab === 'survey' || tab === 'standar-pelayanan') normalizedTab = 'publik';
    else if (tab === 'layanan-hukum') normalizedTab = 'hukum';
    else if (tab === 'informasi-publik') normalizedTab = 'ppid';
    else if (tab === 'reformasi-birokrasi' || tab === 'zi') normalizedTab = 'reformasi';
    else if (tab === 'dokumen-laporan' || tab === 'template-dokumen' || tab === 'laporan') normalizedTab = 'dokumen';
    else if (tab === 'kontak') normalizedTab = 'hubungi-kami';
    else if (tab === 'jadwal-sidang') normalizedTab = 'jadwal';
    else if (tab === 'notifikasi-wa') normalizedTab = 'whatsapp';
    else if (tab === 'panduan-hukum' || tab === 'panduan') {
      normalizedTab = 'hukum';
      subTab = 'panduan-hukum';
    }
    else if (tab === 'ecourt') {
      normalizedTab = 'ecourt';
    }
    else if (tab === 'publik' && subTab === 'sipp') {
      normalizedTab = 'sipp';
      subTab = undefined;
    }
    else if (tab === 'publik' && (subTab === 'jadwal' || subTab === 'jadwal-sidang')) {
      normalizedTab = 'jadwal';
      subTab = undefined;
    }
    else if (tab === 'publik' && (subTab === 'ppid' || subTab === 'dip')) {
      normalizedTab = 'ppid';
      subTab = 'berkala';
    }

    setActiveTab(normalizedTab);

    let resolvedSubTab = subTab;
    if (normalizedTab === 'ptsp-online') {
      resolvedSubTab = subTab || 'app-viewer';
      setPtspSubTab((subTab as any) || 'app-viewer');
    } else if (tab === 'ptsp' && !subTab) {
      resolvedSubTab = 'jenis-layanan';
      setPublikSubTab('jenis-layanan');
    } else if (subTab) {
      if (normalizedTab === 'tentang') setTentangSubTab(subTab);
      else if (normalizedTab === 'publik') {
        setPublikSubTab(subTab);
        setPtspSubTab(subTab as any);
      }
      else if (normalizedTab === 'hukum') setHukumSubTab(subTab);
      else if (normalizedTab === 'ppid') setPpidSubTab(subTab);
      else if (normalizedTab === 'reformasi') setReformasiSubTab(subTab);
      else if (normalizedTab === 'berita') setBeritaSubTab(subTab);
      else if (normalizedTab === 'dokumen') setDokumenSubTab(subTab);
      else if (normalizedTab === 'hubungi-kami') setHubungiSubTab(subTab);
    } else if (tab === 'profil-pegawai') {
      resolvedSubTab = 'profil-hakim';
      setTentangSubTab('profil-hakim');
    } else {
      resolvedSubTab = getActiveSubTabForTab(normalizedTab);
    }

    syncRouteToUrl(normalizedTab, resolvedSubTab, false);
    if (normalizedTab === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 110, behavior: 'smooth' });
    }
  };

  const handleRegisterWA = (nomorPerkara: string) => {
    setWaPrefilledPerkara(nomorPerkara);
    setActiveTab('whatsapp');
    syncRouteToUrl('whatsapp', undefined, false);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
    setActiveTab('admin-portal');
    syncRouteToUrl('admin-portal', undefined, false);
  };

  const handleLogout = () => {
    CourtDB.logout();
    setCurrentUser(null);
    setActiveTab('beranda');
    syncRouteToUrl('beranda', undefined, false);
  };

  const currentSubTab = getActiveSubTabForTab(activeTab);
  const currentUrlPath = buildUrlPath(activeTab, currentSubTab);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const isFirstRenderRef = useRef<boolean>(true);

  // Trigger hardware-accelerated fade-in & slide-up transition on tab or sub-tab navigation
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    const el = stageContainerRef.current;
    if (!el || typeof el.animate !== 'function') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    try {
      el.animate(
        [
          { opacity: 0, transform: 'translate3d(0, 16px, 0) scale(0.995)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
        ],
        {
          duration: 420,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both'
        }
      );
    } catch {
      // Fallback handled by CSS .animate-tab-transition
    }
  }, [activeTab, currentSubTab]);

  return (
    <div className="min-h-screen flex flex-col bg-military-body text-slate-800 antialiased font-sans relative">
      
      {/* 1. Accessibility Utility Bar (WCAG Compliant) */}
      <AccessibilityBar />

      {/* 2. Official Court Header with Branding & Badges */}
      <Header 
        onNavigate={handleNavigate} 
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 3. Main Dropdown Navigation (Simplified & Categorized + Profil Pegawai) */}
      <Navbar 
        activeTab={activeTab} 
        activeTentangSubTab={tentangSubTab}
        onNavigate={handleNavigate} 
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Top Tactical Camo Strip Banner Accent */}
      <div className="w-full bg-gradient-to-r from-[#0a3520] via-[#1b4d2e] via-[#382b13] to-[#0a3520] h-1.5 border-b border-amber-400/80 shadow-xs"></div>

      {/* 4. Main Body Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Dedicated Page URL & Breadcrumb Bar */}
        {activeTab !== 'beranda' && (
          <div
            key={`breadcrumb-${activeTab}-${currentSubTab || 'main'}`}
            className="animate-breadcrumb-in bg-white/95 rounded-xl border border-emerald-900/15 px-4 py-2.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          >
            <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
              <button
                type="button"
                onClick={() => handleNavigate('beranda')}
                className="flex items-center gap-1 font-bold text-[#0D4A2B] hover:underline cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Beranda</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-800">
                {TAB_LABELS[activeTab] || activeTab}
              </span>
              {currentSubTab && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-extrabold text-[#0D4A2B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {SUBTAB_LABELS[currentSubTab] || currentSubTab}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 truncate max-w-[260px] sm:max-w-xs">
                {currentUrlPath}
              </span>
              <button
                type="button"
                onClick={() => {
                  const fullUrl = `${window.location.origin}${currentUrlPath}`;
                  navigator.clipboard?.writeText(fullUrl);
                  setCopiedRouteUrl(true);
                  setTimeout(() => setCopiedRouteUrl(false), 2000);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#0D4A2B] hover:bg-emerald-900 text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                title="Salin URL Halaman Ini"
              >
                {copiedRouteUrl ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" />
                    <span>URL Tersalin</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3 h-3" />
                    <span>Salin URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Initial URL State Parsing Skeleton Screen (Immediate Visual Feedback on Refresh) */}
        {isRouteInitializing && (
          <div
            role="status"
            aria-live="polite"
            className="space-y-6 animate-fade-in"
          >
            {/* Institutional Route Loading Header Banner */}
            <div className="bg-gradient-to-r from-[#041E11] via-[#0A3D24] to-[#041E11] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-amber-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/15 border border-amber-400/50 flex items-center justify-center shrink-0">
                  <Scale className="w-6 h-6 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300/90">
                    Sinkronisasi Rute &amp; Portal Resmi Mahkamah Agung RI
                  </div>
                  <h2 className="text-base sm:text-lg font-bold font-serif text-white mt-0.5">
                    Memuat {TAB_LABELS[activeTab] || 'Beranda Utama'}
                    {currentSubTab && SUBTAB_LABELS[currentSubTab]
                      ? ` — ${SUBTAB_LABELS[currentSubTab]}`
                      : ''}
                  </h2>
                  <p className="text-xs text-emerald-100/80 font-mono mt-0.5">
                    Rute Aktif: {currentUrlPath}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRouteInitializing(false)}
                className="self-start sm:self-center px-3.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tampilkan Langsung
              </button>
            </div>

            {/* Structured Content Skeleton Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl border border-emerald-900/10 p-4 shadow-2xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-900/10 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white rounded-2xl border border-emerald-900/10 p-6 shadow-2xs space-y-4">
                <div className="h-6 w-2/5 rounded bg-emerald-900/10 animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-3/5 rounded bg-slate-100 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
                  <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
                </div>
              </div>
              <div className="lg:col-span-4 bg-white rounded-2xl border border-emerald-900/10 p-6 shadow-2xs space-y-4">
                <div className="h-5 w-1/2 rounded bg-emerald-900/10 animate-pulse" />
                <div className="h-20 rounded-xl bg-slate-100 animate-pulse" />
                <div className="h-20 rounded-xl bg-slate-100 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Animated Tab Stage Container (Fade-In & Slide-Up on Navigation) */}
        <div
          ref={stageContainerRef}
          key={`tab-stage-${activeTab}`}
          className={isRouteInitializing ? 'hidden' : 'animate-tab-transition space-y-6'}
        >
        {/* HOMEPAGE VIEW */}
        {activeTab === 'beranda' && (
          <div className="homepage-scroll-container space-y-8">
            
            {/* Section 1: Carousel Slider Besar & Slogan Marquee */}
            <div id="beranda-hero-slider" className="homepage-scroll-section space-y-8">
              <SliderBanner onNavigate={handleNavigate} onOpenAuth={() => setIsAuthOpen(true)} />

              {/* MARQUEE RUNNING TEXT MOTTO RESMI DILMILTI V MAKASSAR */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#031A0F] via-[#083520] to-[#031A0F] border-2 border-amber-400/90 shadow-xl p-2.5 sm:p-3 text-white flex items-center gap-3 tactical-corners">
                {/* Tactical camouflage accent */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-military-camo-pattern"></div>
                
                {/* Fixed Left Badge: MOTTO RESMI */}
                <div className="relative z-10 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md border border-amber-300">
                  <Sparkles className="w-4 h-4 text-slate-950 fill-amber-300 shrink-0" />
                  <span className="hidden sm:inline font-mono">MOTTO RESMI</span>
                  <span className="sm:hidden font-mono">MOTTO</span>
                </div>

                {/* Scrolling Marquee Container */}
                <div className="relative z-10 overflow-hidden flex-1 select-none">
                  <div className="animate-marquee items-center gap-8 py-0.5 text-xs sm:text-sm font-semibold tracking-wide">
                    {/* Track Part 1 */}
                    <div className="flex items-center gap-6 shrink-0">
                      <span className="text-amber-300 font-extrabold flex items-center gap-2">
                        <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{courtIdentity.slogan || 'REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif)'}</span>
                      </span>
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="text-emerald-100 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Wilayah Bebas dari Korupsi (WBK) &amp; Wilayah Birokrasi Bersih dan Melayani (WBBM)</span>
                      </span>
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="text-amber-200 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Motto Bahari Kota Daeng &amp; Nilai Luhur Sulapa Eppa</span>
                      </span>
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="text-slate-100 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Terwujudnya Pengadilan Militer Tinggi V Makassar yang Agung, Modern, Akuntabel dan Berkeadilan</span>
                      </span>
                      <span className="text-emerald-400 font-bold">•</span>
                    </div>

                    {/* Track Part 2 (Exact duplicate for seamless infinite loop) */}
                    <div className="flex items-center gap-6 shrink-0" aria-hidden="true">
                      <span className="text-amber-300 font-extrabold flex items-center gap-2">
                        <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{courtIdentity.slogan || 'REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif)'}</span>
                      </span>
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="text-emerald-100 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Wilayah Bebas dari Korupsi (WBK) &amp; Wilayah Birokrasi Bersih dan Melayani (WBBM)</span>
                      </span>
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="text-amber-200 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Motto Bahari Kota Daeng &amp; Nilai Luhur Sulapa Eppa</span>
                      </span>
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="text-slate-100 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Terwujudnya Pengadilan Militer Tinggi V Makassar yang Agung, Modern, Akuntabel dan Berkeadilan</span>
                      </span>
                      <span className="text-emerald-400 font-bold">•</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Standard Quick Access Grid (Standarisasi MA & Military Styling) */}
            <div id="beranda-layanan-utama" className="homepage-scroll-section">
              <QuickAccessGrid onNavigate={handleNavigate} />
            </div>

            {/* Section 3: Inovasi Layanan Publik (PTSP Online, Cuti Online, Notifikasi WhatsApp + CRUD Admin) */}
            <div id="beranda-inovasi-ptsp" className="homepage-scroll-section">
              <InovasiQuickAccessSection
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            </div>

            {/* Section 4: Statistik Layanan Utama Beranda (Perkara Masuk, Diputus, Berjalan, Kunjungan Website, Nilai IKM, Nilai IPAK) */}
            <div id="beranda-statistik-layanan" className="homepage-scroll-section">
              <StatistikLayananSection onNavigate={handleNavigate} />
            </div>

            {/* Section 5: Layout with Main Content (8 cols) & Sidebar (4 cols) */}
            <div id="beranda-perkara-sidang" className="homepage-scroll-section">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: SIPP & Sidang Live Feeds */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* SIPP Live Snapshot (Dynamic from CourtDB with Military Army Theme) */}
                <div className="bg-gradient-to-b from-white via-emerald-50/20 to-amber-50/20 rounded-2xl border-2 border-emerald-900/20 shadow-md p-5 space-y-4 relative overflow-hidden tactical-corners">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b-2 border-amber-500/30">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0D4A2B] to-[#062416] flex items-center justify-center text-amber-300 shadow-sm border border-emerald-500/40">
                        <Swords className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 font-serif">
                          <span>Perkara Terkini SIPP Dilmilti V Makassar</span>
                          <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-900 text-[10px] font-mono font-bold border border-amber-500/30">
                            MILITER
                          </span>
                        </h3>
                        <p className="text-[10px] text-emerald-900/80 font-medium">Banding Pidana & Sengketa Tata Usaha Militer</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavigate('sipp')}
                      className="text-xs font-black text-[#0D4A2B] hover:text-emerald-700 flex items-center gap-1 cursor-pointer bg-emerald-100/80 hover:bg-emerald-200/80 px-3 py-1.5 rounded-xl border border-emerald-400/40 transition-colors"
                    >
                      <span>Semua SIPP ({perkaraList.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {perkaraList.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-xl bg-white border border-emerald-900/15 shadow-xs hover:border-amber-500/60 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-[#0D4A2B] text-xs bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                              {p.nomorPerkara}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 font-mono">
                              {p.tingkatPerkara}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                              <Crosshair className="w-3 h-3 text-emerald-700" />
                              {p.klasifikasi}
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 mt-1">
                            <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>{p.terdakwa.nama} ({p.terdakwa.kesatuan})</span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Status: <strong className="text-amber-800 font-bold">{p.statusPerkara}</strong> • Ketua Majelis: {p.majelisHakim.ketua}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRegisterWA(p.nomorPerkara)}
                            className="px-3 py-2 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            title="Aktifkan Notifikasi WhatsApp"
                          >
                            <MessageSquareCode className="w-3.5 h-3.5 text-amber-300" />
                            <span>Notif WA</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNavigate('sipp')}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border border-slate-300"
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Court Hearing Live Widget (Military Theme) */}
                <div className="bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 rounded-2xl border-2 border-emerald-900/20 shadow-md p-5 space-y-4 relative overflow-hidden tactical-corners">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-amber-500/30">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-sm border border-amber-400">
                        <CalendarClock className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 font-serif">
                          <span>Agenda Sidang Hari Ini (Display Ruang Sidang)</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-mono font-bold">
                            KARTIKA & CAKRA
                          </span>
                        </h3>
                        <p className="text-[10px] text-slate-600 font-medium">Pengadilan Militer Tinggi V Makassar</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavigate('jadwal')}
                      className="text-xs font-black text-[#0D4A2B] hover:text-emerald-700 flex items-center gap-1 cursor-pointer bg-emerald-100/80 hover:bg-emerald-200/80 px-3 py-1.5 rounded-xl border border-emerald-400/40 transition-colors"
                    >
                      <span>Agenda Lengkap ({jadwalList.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {jadwalList.slice(0, 2).map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs hover:border-amber-500 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0D4A2B] text-[11px] truncate max-w-[170px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {item.nomorPerkara}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 font-mono">
                            {item.ruangSidang.split(' ')[0]}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{item.terdakwa} ({item.kesatuan})</span>
                        </div>
                        <div className="text-[11px] text-slate-700 bg-emerald-50/50 p-2 rounded-lg border border-emerald-200/80 font-medium">
                          Agenda: <strong>{item.agenda}</strong>
                        </div>
                        <div className="text-[10px] text-slate-600 flex items-center justify-between pt-1 font-mono">
                          <span>{item.tanggal} • {item.waktu}</span>
                          <button
                            type="button"
                            onClick={() => handleRegisterWA(item.nomorPerkara)}
                            className="text-emerald-800 hover:text-emerald-600 font-bold flex items-center gap-1"
                          >
                            <MessageSquareCode className="w-3 h-3 text-amber-600" />
                            <span>+ Notif WA</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Banner Interaktif: Infografis Alur Banding & Survei Kepuasan Online */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div 
                    onClick={() => handleNavigate('hukum', 'tata-cara')}
                    className="p-4 rounded-2xl bg-gradient-to-br from-[#072414] via-[#0A3D24] to-[#041C10] border-2 border-amber-400/70 text-white shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 font-mono flex items-center gap-1">
                          <Scale className="w-3 h-3 text-slate-950" />
                          <span>PANDUAN HUKUM</span>
                        </span>
                        <span className="text-[10px] text-amber-300 font-mono">Batas 7 Hari</span>
                      </div>
                      <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors font-serif leading-tight">
                        Infografis &amp; Kalkulator Tenggat Banding Militer
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        Hitung batas akhir pernyataan banding, syarat memori banding, dan unduh format resmi berkas perkara.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>Buka Infografis Interaktif</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div 
                    onClick={() => handleNavigate('publik', 'survei')}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#072414] to-emerald-950 border-2 border-emerald-500/60 text-white shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 font-mono flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-slate-950" />
                          <span>PARTISIPASI PUBLIK</span>
                        </span>
                        <span className="text-[10px] text-emerald-300 font-mono">IKM / IPAK</span>
                      </div>
                      <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors font-serif leading-tight">
                        Survei Kepuasan Masyarakat &amp; Anti Korupsi
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        Sampaikan penilaian Anda terhadap 6 meja layanan PTSP untuk mewujudkan peradilan militer yang bersih dan melayani.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-300">
                      <span>Isi Survei Kepuasan Sekarang</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* News & Announcements Preview (Military Theme) */}
                <div className="bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 rounded-2xl border-2 border-emerald-900/20 shadow-md p-5 space-y-4 relative overflow-hidden tactical-corners">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-amber-500/30">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-amber-300 shadow-sm border border-emerald-600">
                        <Flag className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 font-serif">
                          <span>Kabar Peradilan & Siaran Pers Resmi</span>
                        </h3>
                        <p className="text-[10px] text-slate-600 font-medium">Humas Badilmiltun & Pengadilan Militer Tinggi V</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavigate('berita')}
                      className="text-xs font-black text-[#0D4A2B] hover:text-emerald-700 flex items-center gap-1 cursor-pointer bg-emerald-100/80 hover:bg-emerald-200/80 px-3 py-1.5 rounded-xl border border-emerald-400/40 transition-colors"
                    >
                      <span>Semua Berita ({newsList.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {newsList.slice(0, 4).map((n) => {
                      const itemComments = n.comments || [];
                      const key = String(n.id);
                      const cmtInput = homeCommentInputs[key] || { name: '', text: '' };
                      const isSaved = homeCommentSaved[key];

                      return (
                        <div key={n.id} className="p-4.5 bg-white rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-emerald-600/70 hover:ring-2 hover:ring-emerald-500/20 transition-all duration-300 ease-out transform hover:-translate-y-2 hover:scale-[1.025] active:scale-[0.99] group">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                                {n.kategori}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                                <span>{n.tanggal}</span>
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                  <MessageSquare className="w-3 h-3" />
                                  {itemComments.length}
                                </span>
                              </div>
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 group-hover:text-[#0D4A2B] transition-colors">
                              {n.judul}
                            </h4>
                            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {n.ringkasan}
                            </p>
                            <div className="pt-2 flex items-center justify-between gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  try {
                                    window.history.pushState(null, '', `?tab=berita&newsId=${n.id}`);
                                  } catch {}
                                  handleNavigate('berita');
                                }}
                                className="text-[#0D4A2B] hover:text-emerald-700 text-[11px] font-black text-left hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <span>Baca artikel lengkap</span>
                                <ArrowRight className="w-3 h-3 text-amber-600" />
                              </button>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    try {
                                      window.history.pushState(null, '', `?tab=berita&newsId=${n.id}`);
                                    } catch {}
                                    handleNavigate('berita');
                                  }}
                                  title="Dengarkan berita ini dengan Text-to-Speech Player"
                                  className="px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                                >
                                  <Headphones className="w-3 h-3 text-slate-950" />
                                  <span>Audio</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    try {
                                      const url = `${window.location.origin}${window.location.pathname}?tab=berita&newsId=${n.id}`;
                                      if (navigator.clipboard?.writeText) {
                                        navigator.clipboard.writeText(url);
                                      }
                                    } catch {}
                                    handleNavigate('berita');
                                  }}
                                  title="Buka dan Bagikan Berita"
                                  className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Share2 className="w-3 h-3 text-emerald-700" />
                                  <span>Bagikan</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Kolom Komentar & Masukan Singkat pada Item Berita */}
                          <div className="pt-2.5 border-t border-slate-100 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-[#0D4A2B] flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-amber-600" />
                                <span>Komentar &amp; Diskusi ({itemComments.length})</span>
                              </span>
                              {isSaved && (
                                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Terkirim
                                </span>
                              )}
                            </div>

                            {itemComments.length > 0 && (
                              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                                {itemComments.slice(-2).map((cmt) => (
                                  <div
                                    key={cmt.id}
                                    className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] space-y-0.5"
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="font-bold text-slate-800 truncate">{cmt.authorName}</span>
                                      <span className="text-[9px] font-mono text-slate-400 shrink-0">{cmt.createdAt}</span>
                                    </div>
                                    <p className="text-slate-600 line-clamp-2">{cmt.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            <form
                              onSubmit={(e) => handleHomeNewsComment(e, n.id)}
                              className="space-y-1.5"
                            >
                              <input
                                type="text"
                                placeholder="Nama Anda (Opsional)"
                                value={cmtInput.name}
                                onChange={(e) =>
                                  setHomeCommentInputs((prev) => ({
                                    ...prev,
                                    [key]: { ...cmtInput, name: e.target.value }
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/70 text-[11px] text-slate-800 focus:outline-none focus:border-emerald-700"
                              />
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  required
                                  placeholder="Tulis masukan / diskusi singkat..."
                                  value={cmtInput.text}
                                  onChange={(e) =>
                                    setHomeCommentInputs((prev) => ({
                                      ...prev,
                                      [key]: { ...cmtInput, text: e.target.value }
                                    }))
                                  }
                                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50/70 text-[11px] text-slate-800 focus:outline-none focus:border-emerald-700"
                                />
                                <button
                                  type="submit"
                                  className="px-2.5 py-1.5 rounded-lg bg-[#0D4A2B] hover:bg-emerald-900 text-amber-300 font-bold text-[10px] inline-flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Kirim</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Standard Sidebar Widgets (4 cols) */}
              <div className="lg:col-span-4">
                <SidebarWidgets 
                  onNavigate={handleNavigate} 
                  onSearch={(query) => {
                    setGlobalSearchQuery(query);
                    setIsGlobalSearchOpen(true);
                  }}
                />
              </div>

            </div>
          </div>

          </div>
        )}

        {/* SIPP FULL DATABASE SECTION */}
        {activeTab === 'sipp' && (
          <SippSection onRegisterWA={handleRegisterWA} />
        )}

        {/* REAL-TIME WHATSAPP NOTIFICATION SUITE */}
        {activeTab === 'whatsapp' && (
          <WhatsAppNotificationSection 
            prefilledNomorPerkara={waPrefilledPerkara} 
            onNavigate={handleNavigate}
          />
        )}

        {/* INTEGRATED E-COURT SECTION */}
        {activeTab === 'ecourt' && (
          <ECourtSection />
        )}

        {/* JADWAL PERSIDANGAN REAL-TIME */}
        {activeTab === 'jadwal' && (
          <JadwalSidangSection onRegisterWA={handleRegisterWA} />
        )}

        {/* MENU 4: PPID & KETERBUKAAN INFORMASI PUBLIK (FOKUS SK KMA 2-144) */}
        {activeTab === 'ppid' && (
          <PpidSection 
            initialSubTab={ppidSubTab}
            onNavigate={handleNavigate}
            onNavigateToPTSP={(serviceType) => {
              setPtspSubTab('permohonan');
              if (serviceType) setPtspInitialService(serviceType);
              handleNavigate('ptsp-inovasi');
            }}
          />
        )}

        {/* MENU 1 & PROFIL PEGAWAI: TENTANG PENGADILAN & PROFIL PEGAWAI */}
        {activeTab === 'tentang' && (
          <TentangPengadilanSection 
            initialSubTab={tentangSubTab} 
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenAdmin={() => {
              if (currentUser) setActiveTab('admin-portal');
              else setIsAuthOpen(true);
            }}
          />
        )}

        {/* SUBDOMAIN RESMI: APLIKASI PTSP ONLINE (ptsp.dilmilti5-makassar.go.id) */}
        {(activeTab === 'ptsp-online' || activeTab === 'ptsp-inovasi') && (
          <PtspInovasiSection
            currentUser={currentUser}
            onNavigateToSection={handleNavigate}
            initialTab={ptspSubTab || 'app-viewer'}
            initialServiceType={ptspInitialService}
          />
        )}

        {/* MENU 2: LAYANAN PUBLIK & PTSP (KETERANGAN SEMUA JENIS & SYARAT LAYANAN 6 MEJA) */}
        {activeTab === 'publik' && (
          <LayananPublikSection 
            initialSubTab={publikSubTab || 'jenis-layanan'}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateToPTSPInovasi={() => handleNavigate('ptsp-online', 'app-viewer')}
          />
        )}

        {/* MENU 3: LAYANAN HUKUM (TERMASUK PANDUAN HUKUM & POSBAKUM) */}
        {(activeTab === 'hukum' || activeTab === 'panduan-hukum') && (
          <LayananHukumSection 
            initialSubTab={activeTab === 'hukum' ? hukumSubTab : 'panduan-hukum'} 
            currentUser={currentUser} 
            onNavigate={handleNavigate} 
          />
        )}

        {/* MENU 6: BERITA & PUBLIKASI / GALERI FOTO */}
        {(activeTab === 'berita' || activeTab === 'galeri' || activeTab === 'galeri-foto') && (
          <BeritaSection 
            initialSubTab={activeTab === 'galeri' || activeTab === 'galeri-foto' ? 'galeri-foto' : beritaSubTab} 
            onNavigate={handleNavigate} 
          />
        )}

        {/* MENU 5: REFORMASI BIROKRASI & WBK/WBBM */}
        {activeTab === 'reformasi' && (
          <ReformasiBirokrasiSection 
            initialSubTab={reformasiSubTab}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onNavigateToAdmin={() => handleNavigate('admin-portal')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {/* MENU 7: DOKUMEN DAN LAPORAN */}
        {(activeTab === 'dokumen' || activeTab === 'template-dokumen') && (
          <DocumentTemplatesSection initialSubTab={dokumenSubTab} onNavigate={handleNavigate} />
        )}

        {/* MENU 8: HUBUNGI KAMI */}
        {activeTab === 'hubungi-kami' && (
          <HubungiKamiSection initialSubTab={hubungiSubTab} />
        )}

        {/* ADMIN & PENGELOLA PORTAL (CRUD + DATABASE MANAGEMENT) */}
        {activeTab === 'admin-portal' && (
          <AdminPortal 
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogout={handleLogout}
            onBackToHome={() => handleNavigate('beranda')}
            onNavigateToSection={(section, subTab) => handleNavigate(section, subTab)}
          />
        )}

        {/* SAFETY FALLBACK FOR UNKNOWN / UNRENDERED TABS */}
        {!['beranda', 'sipp', 'whatsapp', 'ecourt', 'jadwal', 'ppid', 'tentang', 'publik', 'ptsp-online', 'ptsp-inovasi', 'hukum', 'panduan-hukum', 'berita', 'reformasi', 'dokumen', 'template-dokumen', 'hubungi-kami', 'admin-portal'].includes(activeTab) && (
          <div className="space-y-8">
            <QuickAccessGrid onNavigate={handleNavigate} />
            <InovasiQuickAccessSection
              currentUser={currentUser}
              onNavigate={handleNavigate}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
            <StatistikLayananSection onNavigate={handleNavigate} />
          </div>
        )}
        </div>

      </main>

      {/* Floating ChatBot AI Virtual Assistant for Dilmilti V Makassar */}
      <AiChatbotWidget onNavigate={handleNavigate} hide={activeTab === 'beranda'} />

      {/* 5. Official Standardized Footer (4 Columns + Regulatory Badges) */}
      <Footer onNavigate={handleNavigate} />

      {/* 6. Auth Modal (Login & Registration for Website Managers) */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 7. Pop-up Windows Announcement on First Access (Configurable by Admin) */}
      <PopupAnnouncementModal onNavigate={handleNavigate} />

      {/* 8. Global Search Modal (Pencarian Cepat Taktis Seluruh Website & Dokumen) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        initialQuery={globalSearchQuery}
        onNavigate={handleNavigate}
      />

      {/* 9. RSS Feed & Auto Syndication Modal */}
      <RssFeedModal
        isOpen={isRssFeedOpen}
        onClose={() => setIsRssFeedOpen(false)}
        onNavigate={handleNavigate}
      />

    </div>
  );
}
