import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Laptop, 
  BookOpen, 
  ShieldAlert, 
  CalendarClock, 
  BarChart3, 
  CheckCircle2, 
  FileText, 
  Info, 
  MessageSquareCode, 
  HeartHandshake,
  Shield,
  Crosshair,
  Swords,
  Target,
  Award,
  ExternalLink,
  Globe,
  ListFilter,
  X,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  SlidersHorizontal,
  Check,
  Smartphone,
  Eye
} from 'lucide-react';
import { NavSection, QuickAccessItem } from '../types';
import { CourtDB, INITIAL_QUICK_ACCESS_ITEMS } from '../data/courtDatabase';

interface QuickAccessGridProps {
  onNavigate?: (section: NavSection, subTab?: string) => void;
  onOpenExternalLink?: (url: string, name: string) => void;
  hide?: boolean;
}

const ICON_MAP: Record<string, any> = {
  Swords,
  Scale,
  Laptop,
  BookOpen,
  ShieldAlert,
  CalendarClock,
  BarChart3,
  CheckCircle2,
  FileText,
  Info,
  HeartHandshake,
  Shield,
  Crosshair,
  Target,
  Award,
  Smartphone,
  MessageSquareCode,
  Globe
};

const COLOR_PRESETS = [
  {
    name: 'Tactical Emerald Dark (Standar)',
    color: 'from-[#072617] via-[#0D4227] to-[#051B10]',
    borderColor: 'border-amber-400'
  },
  {
    name: 'Deep Forest Green',
    color: 'from-[#072617] via-[#0B3A23] to-[#04170E]',
    borderColor: 'border-amber-400/50'
  },
  {
    name: 'Midnight Gold',
    color: 'from-[#141C16] via-[#1E2E22] to-[#0A120D]',
    borderColor: 'border-amber-400/70'
  },
  {
    name: 'Royal Navy Marine',
    color: 'from-[#061826] via-[#0C2D48] to-[#051420]',
    borderColor: 'border-amber-400/60'
  },
  {
    name: 'Crimson Command',
    color: 'from-[#2A0E12] via-[#48181E] to-[#1E090C]',
    borderColor: 'border-amber-400/60'
  }
];

export default function QuickAccessGrid({ onNavigate, hide }: QuickAccessGridProps) {
  const [items, setItems] = useState<QuickAccessItem[]>(() => CourtDB.getQuickAccessList());
  const [showAllLinksModal, setShowAllLinksModal] = useState(false);
  const [showCrudModal, setShowCrudModal] = useState(false);
  const [editingItem, setEditingItem] = useState<QuickAccessItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formLabel, setFormLabel] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formSection, setFormSection] = useState<NavSection>('layanan-publik');
  const [formSubTab, setFormSubTab] = useState('');
  const [formExternalUrl, setFormExternalUrl] = useState('');
  const [formDomain, setFormDomain] = useState('');
  const [formInstansi, setFormInstansi] = useState('');
  const [formIconName, setFormIconName] = useState('Swords');
  const [formMilitaryIconName, setFormMilitaryIconName] = useState('Swords');
  const [formColor, setFormColor] = useState(COLOR_PRESETS[0].color);
  const [formBorderColor, setFormBorderColor] = useState(COLOR_PRESETS[0].borderColor);
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  useEffect(() => {
    setItems(CourtDB.getQuickAccessList());
    const handleUpdate = () => {
      setItems(CourtDB.getQuickAccessList());
    };
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsCreatingNew(true);
    setFormLabel('');
    setFormFullName('');
    setFormDesc('');
    setFormBadge('LAYANAN RESMI');
    setFormSection('layanan-publik');
    setFormSubTab('');
    setFormExternalUrl('https://');
    setFormDomain('dilmilti5-makassar.go.id');
    setFormInstansi('Pengadilan Militer Tinggi V Makassar');
    setFormIconName('Swords');
    setFormMilitaryIconName('Swords');
    setFormColor(COLOR_PRESETS[0].color);
    setFormBorderColor(COLOR_PRESETS[0].borderColor);
    setFormStatus('Aktif');
    setShowCrudModal(true);
  };

  const handleOpenEditModal = (item: QuickAccessItem) => {
    setEditingItem(item);
    setIsCreatingNew(false);
    setFormLabel(item.label);
    setFormFullName(item.fullName);
    setFormDesc(item.desc);
    setFormBadge(item.badge);
    setFormSection(item.section);
    setFormSubTab(item.subTab || '');
    setFormExternalUrl(item.externalUrl);
    setFormDomain(item.domain);
    setFormInstansi(item.instansi);
    setFormIconName(item.iconName || 'Swords');
    setFormMilitaryIconName(item.militaryIconName || 'Swords');
    setFormColor(item.color);
    setFormBorderColor(item.borderColor);
    setFormStatus(item.status || 'Aktif');
    setShowCrudModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formFullName.trim()) return;

    if (isCreatingNew) {
      CourtDB.addQuickAccessItem({
        label: formLabel.trim(),
        fullName: formFullName.trim(),
        desc: formDesc.trim(),
        badge: formBadge.trim().toUpperCase() || 'LAYANAN',
        section: formSection,
        subTab: formSubTab.trim() || undefined,
        externalUrl: formExternalUrl.trim() || '#',
        domain: formDomain.trim() || 'dilmilti5-makassar.go.id',
        instansi: formInstansi.trim() || 'Pengadilan Militer Tinggi V Makassar',
        iconName: formIconName,
        militaryIconName: formMilitaryIconName,
        color: formColor,
        borderColor: formBorderColor,
        status: formStatus
      });
      showToast(`Berhasil menambahkan ikon Quick Access "${formLabel}"`);
    } else if (editingItem) {
      CourtDB.updateQuickAccessItem(editingItem.id, {
        label: formLabel.trim(),
        fullName: formFullName.trim(),
        desc: formDesc.trim(),
        badge: formBadge.trim().toUpperCase() || 'LAYANAN',
        section: formSection,
        subTab: formSubTab.trim() || undefined,
        externalUrl: formExternalUrl.trim() || '#',
        domain: formDomain.trim() || 'dilmilti5-makassar.go.id',
        instansi: formInstansi.trim() || 'Pengadilan Militer Tinggi V Makassar',
        iconName: formIconName,
        militaryIconName: formMilitaryIconName,
        color: formColor,
        borderColor: formBorderColor,
        status: formStatus
      });
      showToast(`Berhasil memperbarui ikon Quick Access "${formLabel}"`);
    }

    setShowCrudModal(false);
    setEditingItem(null);
    setIsCreatingNew(false);
  };

  const handleDeleteItem = (id: string, label: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ikon Quick Access "${label}"?`)) {
      CourtDB.deleteQuickAccessItem(id);
      showToast(`Ikon "${label}" berhasil dihapus.`);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset seluruh daftar Quick Access ke 13 ikon standar SK Dirjen Badilmiltun No. 593/2026?')) {
      CourtDB.resetQuickAccessList();
      showToast('Quick Access berhasil dikembalikan ke standar bawaan SK 593/2026.');
    }
  };

  const handleCardClick = (item: QuickAccessItem) => {
    // If it's an internal route that we have onNavigate handler for
    if (onNavigate) {
      if (item.id === 'btn-quick-ptsp' || item.section === 'ptsp-inovasi') {
        window.open(`/?tab=ptsp-online&sub=${item.subTab || 'app-viewer'}`, '_blank');
        return;
      }
      if (item.section === 'sipp') {
        onNavigate('sipp');
        return;
      }
      if (item.section === 'jadwal-sidang' || item.section === 'jadwal') {
        onNavigate('jadwal');
        return;
      }
      if (item.section === 'informasi-publik' || item.section === 'ppid') {
        onNavigate('ppid', item.subTab || 'berkala');
        return;
      }
      if (item.section === 'layanan-publik' || item.section === 'publik' || item.section === 'survey') {
        onNavigate('publik', item.subTab || 'jenis-layanan');
        return;
      }
      if (item.section === 'layanan-hukum' || item.section === 'hukum') {
        onNavigate('hukum', item.subTab || 'posbakum');
        return;
      }
      if (item.section === 'dokumen-laporan' || item.section === 'dokumen' || item.section === 'template-dokumen') {
        onNavigate('dokumen', item.subTab || 'arsip-dokumen');
        return;
      }
    }

    // Default external fallback
    if (item.externalUrl && item.externalUrl !== '#') {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (hide) return null;

  return (
    <section 
      id="quick-access-section" 
      aria-label="Quick Access (Ikon Layanan Utama)"
      className="bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 rounded-2xl shadow-md border-2 border-emerald-900/20 p-4 sm:p-5 relative overflow-hidden tactical-corners"
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#0D4A2B] text-amber-300 px-4 py-2.5 rounded-xl shadow-2xl border border-amber-400 font-bold text-xs flex items-center gap-2 animate-scaleUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b-2 border-amber-500/30 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 shadow-sm border border-amber-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 font-serif">
              <span>Quick Access (Ikon Layanan Utama)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                SK 593/2026
              </span>
            </h3>
            <p className="text-[10px] text-slate-600 font-medium">
              Akses cepat pelayanan publik terpadu, persidangan, keterbukaan informasi, dan aplikasi inovasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* CRUD Management Button */}
          <button
            type="button"
            id="btn-crud-quick-access"
            onClick={handleOpenCreateModal}
            className="text-[11px] font-bold text-emerald-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 px-3 py-1.5 rounded-xl border border-amber-500/70 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Tambah Ikon Layanan Baru ke Quick Access"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-950 font-black" />
            <span>Tambah Layanan (CRUD)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAllLinksModal(true)}
            className="text-[11px] font-mono font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Lihat daftar seluruh tautan resmi layanan dalam satu tabel"
          >
            <ListFilter className="w-3.5 h-3.5 text-slate-700" />
            <span>Daftar Direktori ({items.length})</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-[11px] text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            title="Reset ke Standar Bawaan SK 593/2026"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Interactive Service Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {items.filter((i) => i.status !== 'Nonaktif').map((item, index) => {
          const IconComponent = ICON_MAP[item.iconName] || ICON_MAP[item.militaryIconName] || Swords;
          const MilitaryIcon = ICON_MAP[item.militaryIconName] || IconComponent;

          return (
            <div
              key={item.id}
              id={item.id}
              className={`group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-xl text-left bg-gradient-to-br ${item.color} text-white border-2 ${item.borderColor} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1`}
              onClick={() => handleCardClick(item)}
            >
              {/* Background tactical camouflage overlay */}
              <div className="absolute inset-0 bg-military-camo-pattern opacity-10 pointer-events-none"></div>
              
              {/* Dynamic Radial Ambient Light Glow */}
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-amber-400/10 group-hover:bg-amber-400/30 blur-2xl transition-all duration-500 pointer-events-none"></div>

              {/* Large Dynamic Ambient Watermark Icon filling the card */}
              <div className="absolute -right-2 -bottom-2 sm:-right-4 sm:-bottom-4 pointer-events-none opacity-15 group-hover:opacity-35 transition-all duration-500 transform group-hover:scale-125 group-hover:-rotate-12 text-amber-300 z-0">
                <IconComponent className="w-24 h-24 sm:w-28 sm:h-28 stroke-[1.1]" />
              </div>

              {/* Hover Military Target Corner Markers */}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditModal(item);
                  }}
                  className="p-1 rounded bg-slate-900/90 text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-colors cursor-pointer"
                  title="Edit Ikon Quick Access Ini"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                {item.isCustomCreated && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id, item.label);
                    }}
                    className="p-1 rounded bg-slate-900/90 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                    title="Hapus Ikon Ini"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Top Icons & Badges Row */}
              <div className="relative z-10 flex items-center justify-between gap-1.5 mb-2.5">
                <div className="relative group/icon">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-[1.5px] shadow-[0_4px_16px_rgba(245,158,11,0.4)] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(251,191,36,0.7)] transition-all duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-[#09331D] via-[#051C10] to-slate-950 rounded-[14px] flex items-center justify-center text-amber-300 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-amber-500 group-hover:text-slate-950 transition-all duration-300">
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2] drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                  <div className="absolute -inset-1 rounded-2xl bg-amber-400/35 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10"></div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                    {item.badge}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-300/80">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="relative z-10 w-full">
                <div className="text-sm font-black tracking-wide leading-tight text-white group-hover:text-amber-300 transition-colors font-serif">
                  {item.label}
                </div>
                <div className="text-[11px] text-amber-200/90 font-medium mt-0.5 line-clamp-1">
                  {item.fullName}
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed font-normal mt-1">
                  {item.desc}
                </p>

                {/* Domain indicator / Link Hint */}
                <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-[9px] font-mono text-emerald-300/90">
                  <div className="flex items-center gap-1 truncate">
                    <Globe className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{item.domain}</span>
                  </div>
                  <span className="shrink-0 flex items-center gap-1 text-[9px] font-sans font-bold text-amber-300 group-hover:translate-x-0.5 transition-transform">
                    <span>Akses</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CRUD MODAL DRAWER (Create & Update Quick Access Items) */}
      {showCrudModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowCrudModal(false)}
        >
          <div 
            className="bg-slate-900 border-2 border-amber-400/80 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative text-white my-8 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
                  {isCreatingNew ? <Plus className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-base font-black text-white font-serif">
                    {isCreatingNew ? 'Tambah Ikon Quick Access Baru' : `Edit Ikon Quick Access: ${formLabel}`}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Kelola tautan cepat layanan pengadilan sesuai SK 593/2026
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCrudModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Label Ikon (Singkat): *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="misal: PTSP Online, SIPP, e-Court"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Badge Kategori / Tag: *
                  </label>
                  <input
                    type="text"
                    required
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="misal: PTSP MILITER, REAL-TIME"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Nama Lengkap Layanan: *
                </label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  placeholder="misal: Pelayanan Terpadu Satu Pintu Elektronik"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Deskripsi Singkat:
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Keterangan singkat fungsi layanan yang ditampilkan pada kartu..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Bagian / Target Navigasi:
                  </label>
                  <select
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value as NavSection)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="ptsp-inovasi">PTSP &amp; Inovasi</option>
                    <option value="sipp">SIPP (Perkara)</option>
                    <option value="jadwal">Jadwal Sidang</option>
                    <option value="ppid">PPID &amp; Informasi</option>
                    <option value="layanan-publik">Layanan Publik</option>
                    <option value="layanan-hukum">Layanan Hukum</option>
                    <option value="dokumen">Dokumen &amp; Template</option>
                    <option value="reformasi">Reformasi Birokrasi</option>
                    <option value="berita">Berita &amp; Galeri</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Sub-Tab Internal (Opsional):
                  </label>
                  <input
                    type="text"
                    value={formSubTab}
                    onChange={(e) => setFormSubTab(e.target.value)}
                    placeholder="misal: app-viewer, posbakum, survei"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    URL Tujuan Eksternal:
                  </label>
                  <input
                    type="url"
                    value={formExternalUrl}
                    onChange={(e) => setFormExternalUrl(e.target.value)}
                    placeholder="https://sipp.mahkamahagung.go.id/"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Label Domain / Instansi:
                  </label>
                  <input
                    type="text"
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value)}
                    placeholder="sipp.mahkamahagung.go.id"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Icon & Color Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Pilih Ikon:
                  </label>
                  <select
                    value={formIconName}
                    onChange={(e) => {
                      setFormIconName(e.target.value);
                      setFormMilitaryIconName(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {Object.keys(ICON_MAP).map((iconKey) => (
                      <option key={iconKey} value={iconKey}>{iconKey}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    Status Layanan:
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="Aktif">Aktif (Ditampilkan di Beranda)</option>
                    <option value="Nonaktif">Nonaktif (Disembunyikan)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCrudModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreatingNew ? 'Simpan Ikon Baru' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Directory Modal / Drawer for All Official Links */}
      {showAllLinksModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAllLinksModal(false)}
        >
          <div 
            className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl max-w-2xl w-full p-5 shadow-2xl relative text-white max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-serif">
                    Direktori Seluruh Tautan Resmi Layanan ({items.length})
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Sesuai Standarisasi Website SK Ditjen Badilmiltun No. 593/2026
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAllLinksModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Links Table */}
            <div className="overflow-y-auto mt-4 space-y-2 pr-1 flex-1">
              {items.map((item, idx) => (
                <div 
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-[10px] font-mono flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">{item.label}</span>
                        <span className="text-[10px] text-slate-400">&bull; {item.fullName}</span>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                        {item.externalUrl}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Instansi: {item.instansi}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCardClick(item)}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>Buka</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Ikon Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAllLinksModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
