import { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  Scale, 
  Newspaper, 
  ShieldCheck, 
  PhoneCall, 
  ChevronDown, 
  Menu, 
  X, 
  Lock,
  UserCheck,
  FileText,
  FolderOpen,
  ExternalLink,
  Target,
  History,
  MapPin,
  Network,
  Layout,
  Shield,
  Gavel,
  Briefcase,
  Award,
  Sparkles,
  Layers,
  HeartHandshake,
  Accessibility,
  BarChart3,
  Search,
  Laptop,
  Calendar,
  BookOpen,
  AlertTriangle,
  Star,
  CreditCard,
  HelpCircle,
  Megaphone,
  Camera,
  Download,
  ShieldAlert,
  CheckCircle2,
  BarChart2,
  Clock,
  Send,
  FileCheck,
  FileSpreadsheet,
  Archive,
  Phone,
  MessageSquare,
  Ticket,
  Video,
  QrCode,
  Smartphone
} from 'lucide-react';
import { NavSection, UserAccount, MenuContentItem } from '../types';
import { isStaffUser } from '../utils/rbac';
import { CourtDB } from '../data/courtDatabase';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { OFFICIAL_PORTAL_URLS } from '../data/officialPortalUrls';

interface NavbarProps {
  activeSection?: NavSection;
  activeTab?: string;
  activeTentangSubTab?: string;
  onNavigate: (section: any, subTab?: string) => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

export default function Navbar({
  activeSection,
  activeTab,
  onNavigate,
  currentUser,
  onOpenAuth
}: NavbarProps) {
  const currentSection = (activeTab || activeSection || 'beranda') as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('beranda-hero-slider');

  const [menuContents, setMenuContents] = useState<MenuContentItem[]>(() => CourtDB.getAllMenuContents());

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 45);

          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
            setScrollProgress(progress);
          }

          if (currentSection === 'beranda') {
            const sectionIds = [
              'beranda-hero-slider',
              'beranda-layanan-utama',
              'beranda-inovasi-ptsp',
              'beranda-statistik-layanan',
              'beranda-perkara-sidang',
              'beranda-info-layanan'
            ];
            for (let i = sectionIds.length - 1; i >= 0; i--) {
              const el = document.getElementById(sectionIds[i]);
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 140) {
                  setActiveSectionId(sectionIds[i]);
                  break;
                }
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  const handleScrollToSection = (sectionId: string) => {
    if (currentSection !== 'beranda') {
      onNavigate('beranda');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const yOffset = -85;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          setActiveSectionId(sectionId);
        }
      }, 150);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSectionId(sectionId);
    }
  };

  useEffect(() => {
    const handleDbUpdate = () => {
      setMenuContents(CourtDB.getAllMenuContents());
    };
    window.addEventListener('dilmilti_db_updated', handleDbUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleDbUpdate);
  }, []);

  const customTentangMenus = menuContents.filter(m => m.kategori === 'tentang' && m.isCustomCreated);
  const customTopBarMenus = menuContents.filter(m => m.type === 'menu_utama' && m.isCustomCreated);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownClick = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSubItemClick = (section: string, subTab?: string) => {
    if (section === 'ptsp-online') {
      window.open(`/?tab=ptsp-online&sub=${subTab || 'app-viewer'}`, '_blank');
      setOpenDropdown(null);
      setMobileMenuOpen(false);
      return;
    }
    let mapped = section;
    if (section === 'layanan-publik') mapped = 'publik';
    else if (section === 'profil-pegawai') mapped = 'tentang';
    else if (section === 'layanan-hukum') mapped = 'hukum';
    else if (section === 'informasi-publik') mapped = 'ppid';
    else if (section === 'reformasi-birokrasi') mapped = 'reformasi';
    else if (section === 'dokumen-laporan') mapped = 'dokumen';
    else if (section === 'jadwal-sidang') mapped = 'jadwal';
    else if (section === 'notifikasi-wa') mapped = 'whatsapp';
    onNavigate(mapped, subTab);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const isTentangPengadilanActive =
    currentSection === 'tentang' || currentSection === 'profil-pegawai';

  const renderNavIcon = (IconComponent: any, active: boolean) => (
    <span className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
      active 
        ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-[0_2px_10px_rgba(245,158,11,0.5)] ring-2 ring-amber-300/80 scale-105' 
        : 'bg-gradient-to-br from-[#0B3A23]/90 via-[#062013] to-[#04160D] border border-emerald-500/40 text-amber-300 shadow-xs group-hover:scale-115 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-amber-500 group-hover:text-slate-950 group-hover:border-amber-300 group-hover:shadow-[0_0_14px_rgba(251,191,36,0.6)] group-hover:rotate-1'
    }`}>
      <IconComponent className="w-4 h-4 stroke-[2.2]" />
    </span>
  );

  const renderSubMenuIcon = (icon: any) => (
    <span className="w-6.5 h-6.5 rounded-lg bg-gradient-to-br from-[#062415] via-[#04190F] to-slate-950 border border-emerald-500/40 group-hover:border-amber-400 group-hover:from-amber-400/25 group-hover:to-emerald-800/40 flex items-center justify-center shrink-0 transition-all duration-200 shadow-2xs group-hover:shadow-[0_0_10px_rgba(251,191,36,0.35)] group-hover:scale-110">
      {icon}
    </span>
  );

  return (
    <nav 
      ref={navRef}
      id="main-navigation"
      aria-label="Navigasi Utama Standar Mahkamah Agung RI"
      className={`text-white sticky top-0 z-40 relative transition-all duration-300 ${
        isScrolled 
          ? 'navbar-sticky-scrolled' 
          : 'bg-[#071F13] shadow-2xl border-b-2 border-amber-400'
      }`}
    >
      {/* Scroll Progress Indicator Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-black/50 z-50 overflow-hidden pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 transition-all duration-150 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="absolute inset-0 bg-military-camo-pattern opacity-15 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#05170E]/95 via-[#0A2617]/90 to-[#05170E]/95 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 relative z-10">
        <div className="flex items-center justify-between h-13">
          
          {/* Desktop Navigation: Sesuai Pedoman Standardisasi Website SK 593/2026 */}
          <div className="hidden lg:flex items-center space-x-0.5 text-[11px] font-bold tracking-tight">
            
            {/* BERANDA */}
            <button
              type="button"
              id="nav-beranda"
              onClick={() => handleSubItemClick('beranda')}
              className={`group px-2.5 py-2.5 flex items-center gap-1.5 transition-all cursor-pointer rounded-t-lg ${
                currentSection === 'beranda' 
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md border-b-2 border-amber-300' 
                  : 'text-slate-100 hover:text-amber-300 hover:bg-white/10'
              }`}
            >
              {renderNavIcon(Home, currentSection === 'beranda')}
              <span>Beranda</span>
            </button>

            {/* MENU 1 : TENTANG PENGADILAN (Pengantar, Pengelolaan Pengadilan, Kepaniteraan & Profil Pegawai) */}
            <div className="relative">
              <button
                type="button"
                id="nav-tentang"
                onClick={() => handleDropdownClick('tentang')}
                aria-expanded={openDropdown === 'tentang'}
                className={`group px-2.5 py-2.5 flex items-center gap-1.5 transition-all cursor-pointer rounded-t-lg ${
                  isTentangPengadilanActive
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md border-b-2 border-amber-300' 
                    : 'text-slate-100 hover:text-amber-300 hover:bg-white/10'
                }`}
              >
                {renderNavIcon(Building2, isTentangPengadilanActive)}
                <span>Tentang Pengadilan</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === 'tentang' ? 'rotate-180' : ''} ${isTentangPengadilanActive ? 'text-slate-950' : 'text-amber-300'}`} />
              </button>

              {openDropdown === 'tentang' && (
                <div className="animate-dropdown-in absolute left-0 mt-1 w-[540px] bg-[#071F13]/98 backdrop-blur-md text-slate-100 rounded-b-xl shadow-2xl border-2 border-amber-400/70 p-3.5 z-50 text-xs grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 pb-1 border-b border-emerald-800 mb-1 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-amber-400" />
                      <span>Pengantar & Pengelolaan</span>
                    </div>
                    {[
                      { id: 'sambutan', label: 'Sambutan Kepala', icon: <UserCheck className="w-3.5 h-3.5 text-amber-300" /> },
                      { id: 'visimisi', label: 'Visi dan Misi', icon: <Target className="w-3.5 h-3.5 text-emerald-400" /> },
                      { id: 'sejarah', label: 'Sejarah Pengadilan', icon: <History className="w-3.5 h-3.5 text-cyan-300" /> },
                      { id: 'yurisdiksi', label: 'Wilayah Yurisdiksi', icon: <MapPin className="w-3.5 h-3.5 text-rose-400" /> },
                      { id: 'struktur', label: 'Struktur Organisasi', icon: <Network className="w-3.5 h-3.5 text-violet-300" /> },
                      { id: 'denah', label: 'Denah Gedung', icon: <Layout className="w-3.5 h-3.5 text-blue-300" /> },
                      { id: 'pengelolaan', label: 'Sistem Pengelolaan', icon: <Shield className="w-3.5 h-3.5 text-amber-400" /> },
                      { id: 'kepaniteraan', label: 'Kepaniteraan & Tupoksi', icon: <Scale className="w-3.5 h-3.5 text-emerald-300" /> }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSubItemClick('tentang', sub.id)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-100 hover:bg-emerald-900/80 hover:text-amber-300 font-semibold cursor-pointer transition-all flex items-center gap-2 group"
                      >
                        {renderSubMenuIcon(sub.icon)}
                        <span className="text-[11px] leading-tight flex-1">{sub.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 pb-1 border-b border-emerald-800 mb-1 flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-amber-400" />
                      <span>Profil Pegawai</span>
                    </div>
                    {[
                      { id: 'profil-hakim', label: 'Profil Hakim', icon: <Gavel className="w-3.5 h-3.5 text-amber-300" /> },
                      { id: 'profil-kepaniteraan', label: 'Profil Kepaniteraan', icon: <FileText className="w-3.5 h-3.5 text-emerald-300" /> },
                      { id: 'profil-kesekretariatan', label: 'Profil Kesekretariatan', icon: <Briefcase className="w-3.5 h-3.5 text-sky-300" /> },
                      { id: 'profil-pegawai', label: 'Direktori Seluruh Pegawai', icon: <Users className="w-3.5 h-3.5 text-purple-300" /> },
                      { id: 'role-model', label: 'Profil Role Model', icon: <Award className="w-3.5 h-3.5 text-amber-400" /> },
                      { id: 'agen-perubahan', label: 'Profil Agen Perubahan', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSubItemClick('tentang', sub.id)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-100 hover:bg-emerald-900/80 hover:text-amber-300 font-semibold cursor-pointer transition-all flex items-center gap-2 group"
                      >
                        {renderSubMenuIcon(sub.icon)}
                        <span className="text-[11px] leading-tight flex-1">{sub.label}</span>
                      </button>
                    ))}

                    {customTentangMenus.map((cm) => (
                      <button
                        key={cm.id}
                        type="button"
                        onClick={() => handleSubItemClick('tentang', cm.id)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-amber-200 hover:bg-emerald-900/80 hover:text-amber-300 font-semibold cursor-pointer transition-all flex items-center gap-2 group"
                      >
                        {renderSubMenuIcon(<Sparkles className="w-3.5 h-3.5 text-amber-400" />)}
                        <span className="text-[11px] leading-tight flex-1">{cm.judul}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MENU 2 : LAYANAN PUBLIK (SK 593/2026: PTSP, Disabilitas, Laporan, Tata Tertib, Perkara, Informasi, Pengaduan, Jam Kerja, Jadwal Sidang, DIP, Survei, Inovasi, e-Brosur) */}
            <div className="relative">
              <button
                type="button"
                id="nav-layanan-publik"
                onClick={() => handleDropdownClick('layanan-publik')}
                aria-expanded={openDropdown === 'layanan-publik'}
                className={`group px-2.5 py-2.5 flex items-center gap-1.5 transition-all cursor-pointer rounded-t-lg ${
                  ['publik', 'layanan-publik', 'sipp', 'jadwal', 'ptsp'].includes(currentSection)
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md border-b-2 border-amber-300' 
                    : 'text-slate-100 hover:text-amber-300 hover:bg-white/10'
                }`}
              >
                {renderNavIcon(Users, ['publik', 'layanan-publik', 'sipp', 'jadwal', 'ptsp'].includes(currentSection))}
                <span>Layanan Publik</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === 'layanan-publik' ? 'rotate-180' : ''} ${['publik', 'layanan-publik', 'sipp', 'jadwal', 'ptsp'].includes(currentSection) ? 'text-slate-950' : 'text-amber-300'}`} />
              </button>

              {openDropdown === 'layanan-publik' && (
                <div className="animate-dropdown-in absolute left-0 mt-1 w-[620px] bg-[#071F13]/98 backdrop-blur-md text-slate-100 rounded-b-xl shadow-2xl border-2 border-amber-400/70 p-3.5 z-50 text-xs grid grid-cols-2 gap-4">
                  {/* Kolom 1: PTSP & Standar Layanan (Sub 1 - 4) */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 pb-1 border-b border-emerald-800 mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3 h-3 text-amber-400" />
                        <span>PTSP & Standar Layanan</span>
                      </div>
                      <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/40 font-mono">
                        SK 593/2026
                      </span>
                    </div>
                    {[
                      { tab: 'publik', id: 'jenis-layanan', label: 'Informasi & Syarat PTSP (6 Meja)', icon: <Layers className="w-3.5 h-3.5 text-amber-400" />, highlight: false },
                      { tab: 'publik', id: 'standar-pelayanan', label: 'Standar Pelayanan (SK 109/2024)', icon: <Award className="w-3.5 h-3.5 text-emerald-400" />, highlight: false },
                      { tab: 'publik', id: 'maklumat', label: 'Maklumat Pelayanan', icon: <FileCheck className="w-3.5 h-3.5 text-amber-300" />, highlight: false },
                      { tab: 'publik', id: 'kompensasi', label: 'Kompensasi Pelayanan', icon: <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />, highlight: false },
                      { tab: 'publik', id: 'infografis', label: 'Infografis Alur 6 Meja PTSP', icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />, highlight: false },
                      { tab: 'ptsp-online', id: 'app-viewer', label: '🚀 Buka Aplikasi PTSP Online', icon: <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />, highlight: true },
                      { tab: 'publik', id: 'layanan-disabilitas', label: 'Layanan Disabilitas (SK 256/2021)', icon: <Accessibility className="w-3.5 h-3.5 text-blue-400" />, highlight: false },
                      { tab: 'publik', id: 'tatatertib', label: 'Tata Tertib Gedung & Sidang', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />, highlight: false },
                      { tab: 'publik', id: 'jam-kerja', label: 'Jam Kerja & Jam Layanan PTSP', icon: <Clock className="w-3.5 h-3.5 text-cyan-300" />, highlight: false }
                    ].map((sub) => (
                      <button
                        key={`${sub.tab}-${sub.id}`}
                        type="button"
                        onClick={() => handleSubItemClick(sub.tab, sub.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-all flex items-center gap-2 group ${
                          sub.highlight
                            ? 'bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold border border-amber-400/40'
                            : 'text-slate-100 hover:bg-emerald-900/80 hover:text-amber-300'
                        }`}
                      >
                        {renderSubMenuIcon(sub.icon)}
                        <span className="text-[11px] leading-tight flex-1">{sub.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Kolom 2: Perkara, Laporan & Kepuasan (Sub 5 - 13) */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 pb-1 border-b border-emerald-800 mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Search className="w-3 h-3 text-amber-400" />
                        <span>Perkara, Laporan & Kepuasan</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
                        SUB 5-13
                      </span>
                    </div>
                    {[
                      { tab: 'sipp', id: '', label: 'Penelusuran Perkara (SIPP)', icon: <Search className="w-3.5 h-3.5 text-amber-300" /> },
                      { tab: 'jadwal', id: '', label: 'Jadwal Sidang Satker', icon: <Calendar className="w-3.5 h-3.5 text-violet-300" /> },
                      { tab: 'publik', id: 'laporan', label: 'Laporan (Tahunan, SAKIP & DIPA)', icon: <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> },
                      { tab: 'publik', id: 'lhkpn', label: 'Laporan LHKPN & LHKASN', icon: <Shield className="w-3.5 h-3.5 text-emerald-300" /> },
                      { tab: 'ppid', id: 'berkala', label: 'Daftar Informasi Publik (DIP)', icon: <FileText className="w-3.5 h-3.5 text-teal-300" /> },
                      { tab: 'publik', id: 'siwas', label: 'Pengaduan SIWAS & SP4N-LAPOR!', icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" /> },
                      { tab: 'publik', id: 'survei', label: 'Survei Kepuasan (IKM & IPAK)', icon: <Star className="w-3.5 h-3.5 text-amber-400" /> },
                      { tab: 'publik', id: 'ebrosur', label: 'e-Brosur & Inovasi Publik', icon: <BookOpen className="w-3.5 h-3.5 text-purple-300" /> }
                    ].map((sub) => (
                      <button
                        key={`${sub.tab}-${sub.id}`}
                        type="button"
                        onClick={() => handleSubItemClick(sub.tab, sub.id)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-100 hover:bg-emerald-900/80 hover:text-amber-300 font-semibold cursor-pointer transition-all flex items-center gap-2 group"
                      >
                        {renderSubMenuIcon(sub.icon)}
                        <span className="text-[11px] leading-tight flex-1">{sub.label}</span>
                      </button>
                    ))}
                    <a
                      href={OFFICIAL_PORTAL_URLS.direktoriPutusan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-100 hover:bg-emerald-900/80 hover:text-amber-300 font-semibold cursor-pointer transition-all flex items-center gap-2 group"
                    >
                      {renderSubMenuIcon(<BookOpen className="w-3.5 h-3.5 text-sky-300" />)}
                      <span className="text-[11px] leading-tight flex-1">Direktori Putusan MA</span>
                      <ExternalLink className="w-3 h-3 text-amber-300 shrink-0" />
                    </a>
                    <a
                      href={OFFICIAL_PORTAL_URLS.ecourt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-100 hover:bg-emerald-900/80 hover:text-amber-300 font-semibold cursor-pointer transition-all flex items-center gap-2 group"
                    >
                      {renderSubMenuIcon(<Laptop className="w-3.5 h-3.5 text-emerald-400" />)}
                      <span className="text-[11px] leading-tight flex-1">e-Court Mahkamah Agung</span>
                      <ExternalLink className="w-3 h-3 text-amber-300 shrink-0" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* MENU 3 : LAYANAN HUKUM (SK 593/2026: Prodeo, Posbakum, Biaya Perkara, Eksekusi/MonEksTUN, Sidang Luar Gedung) */}
            <div className="relative">
              <button
                type="button"
                id="nav-layanan-hukum"
                onClick={() => handleDropdownClick('layanan-hukum')}
                aria-expanded={openDropdown === 'layanan-hukum'}
                className={`group px-2.5 py-2.5 flex items-center gap-1.5 transition-all cursor-pointer rounded-t-lg ${
                  ['hukum', 'layanan-hukum', 'panduan-hukum'].includes(currentSection)
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md border-b-2 border-amber-300' 
                    : 'text-slate-100 hover:text-amber-300 hover:bg-white/10'
                }`}
              >
                {renderNavIcon(Scale, ['hukum', 'layanan-hukum', 'panduan-hukum'].includes(currentSection))}
                <span>Layanan Hukum</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === 'layanan-hukum' ? 'rotate-180' : ''} ${['hukum', 'layanan-hukum', 'panduan-hukum'].includes(currentSection) ? 'text-slate-950' : 'text-amber-300'}`} />
              </button>

              {openDropdown === 'layanan-hukum' && (
                <div className="animate-dropdown-in absolute left-0 mt-1 w-68 bg-[#071F13]/98 backdrop-blur-md text-slate-100 rounded-b-xl shadow-2xl border-2 border-amber-400/70 p-2 z-50 text-xs space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 pb-1 border-b border-emerald-800 mb-1 flex items-center justify-between px-2">
                    <span>Layanan Hukum SK 593/2026</span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1 rounded">BAG. II.6.d</span>
                  </div>
                  {[
                    { id: 'posbakum', label: 'Pos Bantuan Hukum (Posbakum Gratis)', icon: <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" /> },
                    { id: 'prodeo', label: 'Prosedur Sidang Prodeo (Bebas Biaya)', icon: <Users className="w-3.5 h-3.5 text-amber-300" /> },
                    { id: 'tata-cara', label: 'Prosedur Pengajuan Perkara Banding/Kasasi', icon: <FileText className="w-3.5 h-3.5 text-blue-300" /> },
                    { id: 'biaya-perkara', label: 'Biaya Perkara (Pasal 248 UU 31/1997 Rp 0,-)', icon: <CreditCard className="w-3.5 h-3.5 text-cyan-300" /> },
                    { id: 'eksekusi', label: 'Prosedur Eksekusi & MonEksTUN', icon: <Gavel className="w-3.5 h-3.5 text-amber-400" /> },
                    { id: 'sidang-luar', label: 'Sidang di Luar Gedung (SK 80/2024)', icon: <MapPin className="w-3.5 h-3.5 text-rose-400" /> },
                    { id: 'referensi-uu31', label: 'Referensi UU No. 31/1997 Peradilan Militer', icon: <Scale className="w-3.5 h-3.5 text-amber-300" /> },
                    { id: 'panduan-hukum', label: 'Panduan Hukum & Kalkulator Hak', icon: <HelpCircle className="w-3.5 h-3.5 text-purple-300" /> },
                    { id: 'faq', label: 'Tanya Jawab Hukum (FAQ)', icon: <HelpCircle className="w-3.5 h-3.5 text-teal-300" /> }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubItemClick('hukum', sub.id)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-100 hover:bg-emerald-900/80 hover:text-amber-300 font-semibold cursor-pointer transition-all flex items-center gap-2 group"
                    >
                      {renderSubMenuIcon(sub.icon)}
                      <span className="text-[11px] leading-tight flex-1">{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MENU 4 : BERITA (SK 593/2026: Berita Terkini, Artikel/Karya Tulis, Pengumuman, Video Galeri) */}
            <div className="relative">
              <button
                type="button"
                id="nav-berita"
                onClick={() => handleDropdownClick('berita')}
                aria-expanded={openDropdown === 'berita'}
                className={`group px-2.5 py-2.5 flex items-center gap-1.5 transition-all cursor-pointer rounded-t-lg ${
                  currentSection === 'berita'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md border-b-2 border-amber-300' 
                    : 'text-slate-100 hover:text-amber-300 hover:bg-white/10'
                }`}
              >
                {renderNavIcon(Newspaper, currentSection === 'berita')}
                <span>Berita</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === 'berita' ? 'rotate-180' : ''} ${currentSection === 'berita' ? 'text-slate-950' : 'text-amber-300'}`} />
              </button>

              {openDropdown === 'berita' && (
                <div className="animate-dropdown-in absolute left-0 mt-1 w-64 bg-[#071F13]/98 backdrop-blur-md text-slate-100 rounded-b-xl shadow-2xl border-2 border-amber-400/70 p-2 z-50 text-xs space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 pb-1 border-b border-emerald-800 mb-1 flex items-center justify-between px-2">
                    <span>Publikasi SK 593/2026</span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1 rounded">BAG. II.6.e</span>
                  </div>
                  {[
                    { id: 'berita-terkini', label: 'Berita Terkini & Rilis Pers', icon: <Newspaper className="w-3.5 h-3.5 text-amber-300" /> },
                    { id: 'artikel-hukum', label: 'Artikel / Karya Tulis Hukum', icon: <BookOpen className="w-3.5 h-3.5 text-cyan-300" /> },
                    { id: 'pengumuman', label: 'Pengumuman Resmi Pengadilan', icon: <Megaphone className="w-3.5 h-3.5 text-emerald-300" /> },
                    { id: 'galeri-foto', label: 'Video Galeri (YouTube) & Foto', icon: <Camera className="w-3.5 h-3.5 text-rose-400" /> }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubItemClick('berita', sub.id)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-100 hover:bg-emerald-900/80 hover:text-amber-300 font-semibold cursor-pointer transition-all flex items-center gap-2 group"
                    >
                      {renderSubMenuIcon(sub.icon)}
                      <span className="text-[11px] leading-tight flex-1">{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MENU 5 : REFORMASI BIROKRASI (SK 593/2026: Zona Integritas ZI, SMAP, Role Model, Agen Perubahan) */}
            <div className="relative">
              <button
                type="button"
                id="nav-reformasi"
                onClick={() => handleDropdownClick('reformasi')}
                aria-expanded={openDropdown === 'reformasi'}
                className={`group px-2.5 py-2.5 flex items-center gap-1.5 transition-all cursor-pointer rounded-t-lg ${
                  ['reformasi', 'reformasi-birokrasi', 'zi'].includes(currentSection)
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md border-b-2 border-amber-300' 
                    : 'text-slate-100 hover:text-amber-300 hover:bg-white/10'
                }`}
              >
                {renderNavIcon(ShieldCheck, ['reformasi', 'reformasi-birokrasi', 'zi'].includes(currentSection))}
                <span>Reformasi Birokrasi</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === 'reformasi' ? 'rotate-180' : ''} ${['reformasi', 'reformasi-birokrasi', 'zi'].includes(currentSection) ? 'text-slate-950' : 'text-amber-300'}`} />
              </button>

              {openDropdown === 'reformasi' && (
                <div className="animate-dropdown-in absolute left-0 mt-1 w-64 bg-[#071F13]/98 backdrop-blur-md text-slate-100 rounded-b-xl shadow-2xl border-2 border-amber-400/70 p-2 z-50 text-xs space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 pb-1 border-b border-emerald-800 mb-1 flex items-center justify-between px-2">
                    <span>Reformasi SK 593/2026</span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1 rounded">BAG. II.6.f</span>
                  </div>
                  {[
                    { id: 'zona-integritas', label: 'Zona Integritas (WBK & WBBM)', icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> },
                    { id: 'role-model', label: 'Profil Role Model Pimpinan', icon: <Award className="w-3.5 h-3.5 text-emerald-300" /> },
                    { id: 'agen-perubahan', label: 'Profil Agen Perubahan', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> },
                    { id: 'smap', label: 'SMAP (Sistem Anti Penyuapan)', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> },
                    { id: 'manajemen-risiko', label: 'Manajemen Risiko (SPIP)', icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" /> },
                    { id: 'monev', label: 'Monitoring & Evaluasi RB', icon: <BarChart2 className="w-3.5 h-3.5 text-violet-300" /> }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubItemClick('reformasi', sub.id)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-100 hover:bg-emerald-900/80 hover:text-amber-300 font-semibold cursor-pointer transition-all flex items-center gap-2 group"
                    >
                      {renderSubMenuIcon(sub.icon)}
                      <span className="text-[11px] leading-tight flex-1">{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MENU 6 : HUBUNGI KAMI (SK 593/2026: Alamat Kantor, Kode Pos, Telepon, Email, Media Sosial) */}
            <div className="relative">
              <button
                type="button"
                id="nav-hubungi-kami"
                onClick={() => handleDropdownClick('hubungi-kami')}
                aria-expanded={openDropdown === 'hubungi-kami'}
                className={`group px-2.5 py-2.5 flex items-center gap-1.5 transition-all cursor-pointer rounded-t-lg ${
                  ['hubungi-kami', 'kontak'].includes(currentSection)
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md border-b-2 border-amber-300' 
                    : 'text-slate-100 hover:text-amber-300 hover:bg-white/10'
                }`}
              >
                {renderNavIcon(PhoneCall, ['hubungi-kami', 'kontak'].includes(currentSection))}
                <span>Hubungi Kami</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === 'hubungi-kami' ? 'rotate-180' : ''} ${['hubungi-kami', 'kontak'].includes(currentSection) ? 'text-slate-950' : 'text-amber-300'}`} />
              </button>

              {openDropdown === 'hubungi-kami' && (
                <div className="animate-dropdown-in absolute right-0 mt-1 w-64 bg-[#071F13]/98 backdrop-blur-md text-slate-100 rounded-b-xl shadow-2xl border-2 border-amber-400/70 p-2 z-50 text-xs space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 pb-1 border-b border-emerald-800 mb-1 flex items-center justify-between px-2">
                    <span>Kontak Resmi SK 593/2026</span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1 rounded">BAG. II.6.g</span>
                  </div>
                  {[
                    { id: 'alamat', label: 'Alamat Lengkap & Peta Gedung (KM 13)', icon: <MapPin className="w-3.5 h-3.5 text-rose-400" /> },
                    { id: 'whatsapp', label: 'Hotline WhatsApp PTSP & Telepon', icon: <Phone className="w-3.5 h-3.5 text-emerald-300" /> },
                    { id: 'form-kontak', label: 'Media Sosial & Form Kontak Online', icon: <MessageSquare className="w-3.5 h-3.5 text-amber-300" /> }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubItemClick('hubungi-kami', sub.id)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-100 hover:bg-emerald-900/80 hover:text-amber-300 font-semibold cursor-pointer transition-all flex items-center gap-2 group"
                    >
                      {renderSubMenuIcon(sub.icon)}
                      <span className="text-[11px] leading-tight flex-1">{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Custom Top Bar Menus */}
            {customTopBarMenus.map((cm) => (
              <button
                key={cm.id}
                type="button"
                onClick={() => handleSubItemClick('tentang', cm.id)}
                className="px-2 py-3.5 flex items-center gap-1 transition-all cursor-pointer rounded-t-lg text-amber-300 hover:text-amber-200 hover:bg-white/10"
              >
                <span>{cm.judul}</span>
              </button>
            ))}

          </div>

          {/* Right Side: Compact Admin Login / Portal Button */}
          <div className="hidden lg:flex items-center gap-2">
            {isStaffUser(currentUser) ? (
              <button
                type="button"
                onClick={() => handleSubItemClick('admin-portal')}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth()}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-400/50 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                title="Login Petugas / Admin Pengadilan"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Petugas</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Bar */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-amber-300">
                MENU UTAMA
              </span>
              {isStaffUser(currentUser) ? (
                <button
                  type="button"
                  onClick={() => handleSubItemClick('admin-portal')}
                  className="text-[11px] bg-amber-400 text-slate-950 px-2 py-1 rounded font-black flex items-center gap-1 shadow-sm"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth()}
                  className="text-[11px] bg-slate-900 text-amber-300 border border-amber-400/50 px-2 py-1 rounded font-bold flex items-center gap-1"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Petugas</span>
                </button>
              )}
            </div>
            
            <button
              type="button"
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-white hover:bg-emerald-800"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* SECTION SCROLL-SNAP & SCROLL-SPY NAVIGATOR STRIP (KHUSUS BERANDA) - Removed as requested */}
        {false && (
          <div className="hidden md:flex items-center justify-between py-1.5 border-t border-emerald-500/20 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-wider">NAVIGASI BAGIAN BERANDA:</span>
            </div>
            
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'beranda-hero-slider', label: 'Slider Utama', icon: '🎯' },
                { id: 'beranda-layanan-utama', label: 'Layanan Publik', icon: '⚡' },
                { id: 'beranda-inovasi-ptsp', label: 'Inovasi Layanan Publik', icon: '💡' },
                { id: 'beranda-statistik-layanan', label: 'Statistik Kinerja', icon: '📊' },
                { id: 'beranda-perkara-sidang', label: 'Perkara & Sidang', icon: '⚖️' },
                { id: 'beranda-info-layanan', label: 'Informasi Satker', icon: '🏛️' }
              ].map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleScrollToSection(sec.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeSectionId === sec.id
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-300'
                      : 'text-slate-200 hover:text-amber-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[11px]">{sec.icon}</span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="animate-dropdown-in lg:hidden border-t border-emerald-800 py-3 space-y-2 text-xs bg-[#062416] px-3 rounded-b-xl mb-2 shadow-xl max-h-[82vh] overflow-y-auto">
            <div className="mb-2 bg-[#041C10] border border-emerald-500/40 rounded-lg px-3 py-2 flex items-center justify-between gap-2 text-xs font-bold text-emerald-100">
              <span className="text-amber-400 font-black flex items-center gap-1.5 font-mono text-[11px]">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                PORTAL RESMI DILMILTI V MAKASSAR
              </span>
              <SyncStatusIndicator variant="badge" />
            </div>

            <button
              type="button"
              onClick={() => handleSubItemClick('beranda')}
              className="w-full text-left px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black flex items-center gap-2.5 shadow-md cursor-pointer"
            >
              <span className="w-7 h-7 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center shadow-xs">
                <Home className="w-4 h-4 stroke-[2.2]" />
              </span>
              <span className="text-xs tracking-wide">Beranda Utama</span>
            </button>

            {/* Direct Mobile PTSP Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSubItemClick('publik', 'jenis-layanan')}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#0D4A2B] to-[#08331E] text-amber-300 border border-emerald-500/40 font-bold flex items-center justify-between shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-950 text-amber-400 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-black text-white">Informasi & Syarat PTSP</div>
                    <div className="text-[10px] text-emerald-200">Keterangan Lengkap 6 Meja</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSubItemClick('ptsp-online', 'app-viewer')}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black flex items-center justify-between shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-black text-slate-950">Aplikasi PTSP Online</div>
                    <div className="text-[10px] text-slate-900 font-bold">Subdomain Mandiri</div>
                  </div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 font-mono font-bold">
                  SUBDOMAIN
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {[
                { tab: 'tentang', subTab: 'sambutan', label: 'Tentang Pengadilan', desc: 'Profil, Sejarah & Aparatur (Bag. II.6.b)', icon: Building2 },
                { tab: 'publik', subTab: 'jenis-layanan', label: 'Layanan Publik', desc: 'PTSP, Laporan & Perkara (Bag. II.6.c)', icon: Users },
                { tab: 'hukum', subTab: 'referensi-uu31', label: 'Layanan Hukum', desc: 'Posbakum, Prodeo & Upaya Hukum (Bag. II.6.d)', icon: Scale },
                { tab: 'berita', subTab: 'berita-terkini', label: 'Berita & Publikasi', desc: 'Rilis Pers, Artikel & Galeri (Bag. II.6.e)', icon: Newspaper },
                { tab: 'reformasi', subTab: 'zona-integritas', label: 'Reformasi Birokrasi', desc: 'Zona Integritas WBK/WBBM & SMAP (Bag. II.6.f)', icon: ShieldCheck },
                { tab: 'hubungi-kami', subTab: 'alamat', label: 'Hubungi Kami', desc: 'Alamat, Telepon, Email & Medsos (Bag. II.6.g)', icon: PhoneCall },
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => handleSubItemClick(item.tab, item.subTab)}
                    className="text-left p-2.5 rounded-xl bg-gradient-to-r from-[#041E12] to-[#072917] hover:from-[#0B3A23] hover:to-[#09301B] border border-emerald-600/30 hover:border-amber-400/60 font-bold text-white flex items-center gap-2.5 transition-all shadow-xs group cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#062415] via-[#04190F] to-slate-950 border border-emerald-500/40 group-hover:border-amber-400 group-hover:from-amber-400 group-hover:to-amber-500 group-hover:text-slate-950 text-amber-300 flex items-center justify-center shrink-0 transition-all shadow-xs group-hover:shadow-[0_0_10px_rgba(251,191,36,0.4)] group-hover:scale-105">
                      <IconComp className="w-4 h-4 stroke-[2.2]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-black group-hover:text-amber-300 transition-colors truncate">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-emerald-200/70 group-hover:text-emerald-100 font-normal truncate">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}
