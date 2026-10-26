import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  CheckCircle2, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Upload, 
  Building2, 
  Scale, 
  Users, 
  ShieldCheck, 
  Compass, 
  Clock, 
  Check, 
  ArrowRight,
  Database,
  Award,
  Image as ImageIcon
} from 'lucide-react';
import { CourtDB } from '../../data/courtDatabase';
import { MenuContentItem, RoleModelAndAgentItem } from '../../types';
import { compressImage, getFreshImageUrl, handleImageFallback, DEFAULT_OFFICIAL_AVATAR } from '../../utils/imageHelper';

interface MenuContentEditModalProps {
  isOpen: boolean;
  menuId: string | null;
  onClose: () => void;
  onSaveSuccess?: (savedItem: MenuContentItem) => void;
  onNavigateToLivePage?: (section: string, subTab?: string) => void;
  onOpenSpecificTab?: (tabName: string) => void;
  showToast?: (msg: string, type?: string) => void;
}

export default function MenuContentEditModal({
  isOpen,
  menuId,
  onClose,
  onSaveSuccess,
  onNavigateToLivePage,
  onOpenSpecificTab,
  showToast
}: MenuContentEditModalProps) {
  const [contentItem, setContentItem] = useState<MenuContentItem | null>(null);

  // Form states
  const [judul, setJudul] = useState('');
  const [subJudul, setSubJudul] = useState('');
  const [dasarHukum, setDasarHukum] = useState('');
  const [skNomor, setSkNomor] = useState('');
  const [kontenUtama, setKontenUtama] = useState('');
  const [poinPoin, setPoinPoin] = useState<string[]>([]);
  const [newPointInput, setNewPointInput] = useState('');
  const [linkDokumen, setLinkDokumen] = useState('');
  const [linkEksternal, setLinkEksternal] = useState('');
  const [petugasPenanggungJawab, setPetugasPenanggungJawab] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Draft'>('Aktif');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [roleModelList, setRoleModelList] = useState<RoleModelAndAgentItem[]>([]);

  // Dynamic Navigation CRUD states
  const [selectedKategori, setSelectedKategori] = useState<'tentang' | 'layanan' | 'hukum' | 'informasi' | 'beranda' | 'lainnya'>('layanan');
  const [selectedType, setSelectedType] = useState<'menu_utama' | 'sub_menu'>('sub_menu');
  const [targetSection, setTargetSection] = useState('publik');
  const [targetSubTab, setTargetSubTab] = useState('');
  const [badgeLabel, setBadgeLabel] = useState('NEW');
  const [iconName, setIconName] = useState('Building2');

  const [activeTab, setActiveTab] = useState<'narasi' | 'poin' | 'spesifik' | 'tautan'>('narasi');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Load item on open or menuId change
  useEffect(() => {
    if (isOpen && menuId) {
      setSaveSuccessNotice(false);
      let item = CourtDB.getMenuContentById(menuId);
      if (!item) {
        item = {
          id: menuId.startsWith('cmenu-') || menuId.startsWith('custom-') ? menuId : `cmenu-${Date.now()}`,
          kategori: 'layanan',
          type: 'sub_menu',
          nomorUrut: 99,
          judul: 'Menu / Sub-Menu Baru',
          subJudul: 'Halaman Layanan Baru Pengadilan Militer Tinggi V Makassar',
          dasarHukum: 'SK Kadilmilti V Makassar No. 593/2026',
          skNomor: 'SK-593/2026',
          kontenUtama: 'Tuliskan uraian narasi konten informasi lengkap untuk menu baru ini...',
          poinPoin: ['Layanan publik terpadu', 'Transparansi & Akuntabilitas'],
          tanggalUpdate: new Date().toISOString().slice(0, 10),
          status: 'Aktif',
          badge: 'NEW',
          iconName: 'Building2',
          isCustomCreated: true
        };
      }
      setContentItem(item);
      setJudul(item.judul || '');
      setSubJudul(item.subJudul || '');
      setDasarHukum(item.dasarHukum || '');
      setSkNomor(item.skNomor || '');
      setKontenUtama(item.kontenUtama || '');
      setPoinPoin(item.poinPoin ? [...item.poinPoin] : []);
      setLinkDokumen(item.linkDokumen || '');
      setLinkEksternal(item.linkEksternal || '');
      setPetugasPenanggungJawab(item.petugasPenanggungJawab || '');
      setStatus(item.status || 'Aktif');
      setCustomFields(item.customFields ? { ...item.customFields } : {});
      setSelectedKategori(item.kategori || 'layanan');
      setSelectedType(item.type || 'sub_menu');
      setTargetSection(item.targetSection || (item.kategori === 'tentang' ? 'tentang' : item.kategori === 'hukum' ? 'hukum' : 'publik'));
      setTargetSubTab(item.targetSubTab || '');
      setBadgeLabel(item.badge || 'NEW');
      setIconName(item.iconName || 'Building2');
      setActiveTab('narasi');

      if (menuId === 'm6') {
        setRoleModelList(CourtDB.getRoleModelAgents());
      }
    }
  }, [isOpen, menuId]);

  if (!isOpen || !contentItem) return null;

  // Helper to update custom field
  const updateCustomField = (key: string, value: string) => {
    setCustomFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Add point
  const handleAddPoint = () => {
    if (!newPointInput.trim()) return;
    setPoinPoin(prev => [...prev, newPointInput.trim()]);
    setNewPointInput('');
  };

  // Remove point
  const handleRemovePoint = (index: number) => {
    setPoinPoin(prev => prev.filter((_, i) => i !== index));
  };

  // Update point text
  const handleUpdatePoint = (index: number, text: string) => {
    setPoinPoin(prev => {
      const copy = [...prev];
      copy[index] = text;
      return copy;
    });
  };

  // Handle image upload for customFields like fotoKadilmil or bagan
  const handleImageUpload = async (fieldKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Mengunggah berkas gambar/foto ke server...');
      const compressedBase64 = await compressImage(file, 1200, 1200, 0.85);
      const uploadedUrl = await CourtDB.uploadBase64ToServer(compressedBase64, file.name || 'image', 'uploads');
      updateCustomField(fieldKey, uploadedUrl);
      showToast('Berkas gambar/foto berhasil diunggah!');
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses berkas gambar', 'error');
    }
  };

  // Handle document file upload (PDF/DOCX/ZIP)
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast(`Mengunggah berkas dokumen ${file.name}...`);
      const uploadedUrl = await CourtDB.uploadMediaFile(file, 'uploads');
      if (uploadedUrl) {
        setLinkDokumen(uploadedUrl);
        showToast('Berkas dokumen berhasil diunggah dan tersimpan!');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal mengunggah berkas dokumen', 'error');
    }
  };

  // Role Model & Agen Perubahan handlers
  const handleUpdateRoleModelPhoto = async (id: string, file: File) => {
    if (!file) return;
    try {
      showToast('Mengunggah foto personel ke server...');
      const compressed = await compressImage(file, 800, 1000, 0.85);
      const uploadedUrl = await CourtDB.uploadBase64ToServer(compressed, file.name || 'rolemodel', 'uploads');
      setRoleModelList(prev => prev.map(item => item.id === id ? { ...item, fotoUrl: uploadedUrl } : item));
      showToast('Foto personel Role Model / Agen Perubahan berhasil diunggah!');
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses foto personel', 'error');
    }
  };

  const handleRoleModelChange = (id: string, field: keyof RoleModelAndAgentItem, value: string) => {
    setRoleModelList(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAddRoleModel = () => {
    const newItem: RoleModelAndAgentItem = {
      id: `rm-${Date.now()}`,
      tipe: 'Agen Perubahan',
      nama: 'Personel Baru, S.H.',
      jabatan: 'Staf / Aparatur Dilmilti V Makassar',
      pangkatNip: 'Serma / NIP 1990...',
      komitmenKerja: 'Melayani dengan integritas tinggi dan inovasi digital.',
      kontribusiReformasi: 'Aktif dalam pembangunan Zona Integritas area pelayanan publik.',
      rencanaProgramKerja: 'Pengembangan inovasi sistem antrean digital PTSP.',
      fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    };
    setRoleModelList(prev => [newItem, ...prev]);
    showToast('Daftar personel baru berhasil ditambahkan.');
  };

  const handleDeleteRoleModel = (id: string) => {
    setRoleModelList(prev => prev.filter(item => item.id !== id));
    showToast('Personel dihapus dari daftar.');
  };

  // Save handler
  const handleSave = () => {
    setIsSaving(true);
    try {
      const isCustomItem = contentItem.isCustomCreated ?? (!['m1','m2','m3','m4','m5','m6','m7','m8','m9','lp1','lp2','lp3','lp4','lp5','lp6','lp7','lp8','lh1','lh2','lh3','lh4','lh5','lh6'].includes(contentItem.id));
      const updatedItem: MenuContentItem = {
        ...contentItem,
        judul,
        subJudul,
        dasarHukum,
        skNomor,
        kontenUtama,
        poinPoin,
        linkDokumen,
        linkEksternal,
        petugasPenanggungJawab,
        status,
        customFields,
        kategori: selectedKategori,
        type: selectedType,
        targetSection,
        targetSubTab,
        badge: badgeLabel,
        iconName,
        isCustomCreated: isCustomItem,
        tanggalUpdate: new Date().toISOString().slice(0, 10)
      };

      const currentUser = CourtDB.getCurrentUser();
      CourtDB.saveMenuContent(updatedItem, currentUser);

      if (contentItem.id === 'm6' && roleModelList.length >= 0) {
        CourtDB.saveRoleModelAgents(roleModelList, currentUser);
      }

      setIsSaving(false);
      setSaveSuccessNotice(true);
      showToast(`Data menu '${judul}' berhasil disimpan dan diperbarui!`);

      if (onSaveSuccess) {
        onSaveSuccess(updatedItem);
      }

      // Hide success banner after 4s
      setTimeout(() => {
        setSaveSuccessNotice(false);
      }, 4000);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      showToast('Gagal menyimpan perubahan');
    }
  };

  // Mapping to live preview
  const getLivePreviewTarget = () => {
    switch (contentItem.id) {
      case 'm1': return { section: 'tentang', subTab: 'sambutan' };
      case 'm2': return { section: 'tentang', subTab: 'visimisi' };
      case 'm3': return { section: 'tentang', subTab: 'profil' };
      case 'm4': return { section: 'tentang', subTab: 'struktur' };
      case 'm5': return { section: 'tentang', subTab: 'denah' };
      case 'm6': return { section: 'tentang', subTab: 'rolemodel' };
      case 'm7': return { section: 'tentang', subTab: 'kepaniteraan' };
      case 'm8': return { section: 'tentang', subTab: 'pengelolaan' };
      case 'm9': return { section: 'tentang', subTab: 'pejabat' };
      case 'lp1': return { section: 'publik', subTab: 'ptsp' };
      case 'lp2': return { section: 'publik', subTab: 'maklumat' };
      case 'lp3': return { section: 'publik', subTab: 'kompensasi' };
      case 'lp4': return { section: 'publik', subTab: 'disabilitas' };
      case 'lp5': return { section: 'publik', subTab: 'laporan' };
      case 'lp6': return { section: 'publik', subTab: 'pengaduan' };
      case 'lp7': return { section: 'publik', subTab: 'survei' };
      case 'lp8': return { section: 'publik', subTab: 'ebrosur' };
      case 'lp_tatatertib': return { section: 'publik', subTab: 'tatatertib' };
      case 'lh1': return { section: 'hukum', subTab: 'posbakum' };
      case 'lh2': return { section: 'hukum', subTab: 'alur-banding' };
      case 'lh3': return { section: 'hukum', subTab: 'alur-tun' };
      case 'lh4': return { section: 'hukum', subTab: 'sidang-luar' };
      case 'lh5': return { section: 'hukum', subTab: 'eksekusi' };
      case 'lh6': return { section: 'hukum', subTab: 'tatatertib' };
      default: return { section: 'beranda' };
    }
  };

  // Check if this menu has a specific master table in AdminPortal
  const getSpecificManagerTab = () => {
    switch (contentItem.id) {
      case 'm4': return { tab: 'satker', label: 'Buka Master Struktur Satker' };
      case 'm6': return { tab: 'eviden', label: 'Buka Master Eviden ZI' };
      case 'm7':
      case 'm9': return { tab: 'personel', label: 'Buka Master Personel (CRUD Lengkap)' };
      case 'lp3': return { tab: 'publik', label: 'Buka Pengelola Kompensasi' };
      case 'lp5': return { tab: 'ppid', label: 'Buka Master Dokumen PPID / SAKIP' };
      case 'lp7': return { tab: 'eviden', label: 'Buka Master Laporan Survei' };
      case 'lp8': return { tab: 'publik', label: 'Buka Pengelola e-Brosur' };
      default: return null;
    }
  };

  const specificManager = getSpecificManagerTab();
  const liveTarget = getLivePreviewTarget();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl text-slate-950 font-black flex items-center justify-center ${
              contentItem.kategori === 'tentang' ? 'bg-amber-400' :
              contentItem.kategori === 'layanan' ? 'bg-emerald-400' : 'bg-sky-400'
            }`}>
              {contentItem.kategori === 'tentang' && <Building2 className="w-5 h-5" />}
              {contentItem.kategori === 'layanan' && <Users className="w-5 h-5" />}
              {contentItem.kategori === 'hukum' && <Scale className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  contentItem.kategori === 'tentang' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                  contentItem.kategori === 'layanan' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                }`}>
                  {contentItem.kategori === 'tentang' ? 'Tentang Pengadilan' :
                   contentItem.kategori === 'layanan' ? 'Layanan Publik' : 'Layanan Hukum'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {contentItem.badge || `Menu #${contentItem.nomorUrut}`}
                </span>
                <span className="text-xs text-slate-400">
                  ID: <code className="text-amber-400 font-mono">{contentItem.id}</code>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1 leading-snug">
                Edit Isi Data: {contentItem.judul}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {contentItem.subJudul}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Jendela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUCCESS NOTIFICATION BANNER */}
        {saveSuccessNotice && (
          <div className="mx-4 mt-4 p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-3 text-emerald-300 text-xs animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Perubahan data berhasil disimpan ke Database Pengadilan & live preview aktif!</span>
            </div>
            {onNavigateToLivePage && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToLivePage(liveTarget.section, liveTarget.subTab);
                }}
                className="px-2.5 py-1 bg-emerald-400 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat di Halaman Website</span>
              </button>
            )}
          </div>
        )}

        {/* MODAL TABS */}
        <div className="px-4 sm:px-5 pt-3 border-b border-slate-800 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('narasi')}
            className={`px-3 py-2 font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'narasi'
                ? 'border-amber-400 text-amber-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Judul & Narasi Utama</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('poin')}
            className={`px-3 py-2 font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'poin'
                ? 'border-amber-400 text-amber-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Butir Kebijakan & Poin Layanan ({poinPoin.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('spesifik')}
            className={`px-3 py-2 font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'spesifik'
                ? 'border-amber-400 text-amber-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>3. Pengaturan Khusus Menu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tautan')}
            className={`px-3 py-2 font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tautan'
                ? 'border-amber-400 text-amber-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>4. Dasar Hukum & Unduhan Dokumen</span>
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-300 flex-1">
          {/* TAB 1: JUDUL & NARASI */}
          {activeTab === 'narasi' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Judul Utama Menu / Halaman:
                  </label>
                  <input
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                    placeholder="Masukkan judul menu"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Sub-Judul / Keterangan Singkat:
                  </label>
                  <input
                    type="text"
                    value={subJudul}
                    onChange={(e) => setSubJudul(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                    placeholder="Contoh: Sambutan Resmi Kepala Pengadilan..."
                  />
                </div>
              </div>

              {/* Profil & Foto Pimpinan (Tampil Langsung untuk Menu Sambutan Pimpinan m1) */}
              {contentItem.id === 'm1' && (
                <div className="bg-slate-900/90 border-2 border-amber-400/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Profil & Foto Resmi Pimpinan (Pengantar Pimpinan)</span>
                    </h4>
                    <span className="text-[10px] text-amber-300/80 bg-amber-400/10 px-2 py-0.5 rounded-md font-semibold">
                      Tersinkronisasi Otomatis
                    </span>
                  </div>

                  {/* Foto Upload Card */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="w-20 h-24 bg-slate-900 rounded-lg border-2 border-amber-400 overflow-hidden shrink-0 flex items-center justify-center">
                      {customFields.fotoKadilmil ? (
                        <img 
                          src={getFreshImageUrl(customFields.fotoKadilmil)} 
                          alt="Foto Pimpinan" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-1 text-slate-500 text-[10px]">
                          <span className="text-xl block mb-0.5">🎖️</span>
                          <span>Belum ada foto</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-300">
                        Foto Resmi Pimpinan (URL atau Unggah Berkas):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customFields.fotoKadilmil || ''}
                          onChange={(e) => updateCustomField('fotoKadilmil', e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
                          placeholder="https://... atau /uploads/..."
                        />
                        <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload('fotoKadilmil', e)}
                          />
                        </label>
                        {customFields.fotoKadilmil && (
                          <button
                            type="button"
                            onClick={() => updateCustomField('fotoKadilmil', '')}
                            className="px-2.5 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Foto ini langsung tampil di halaman Sambutan Pimpinan & profil website.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Nama Pimpinan:</label>
                      <input
                        type="text"
                        value={customFields.namaKadilmil || ''}
                        onChange={(e) => updateCustomField('namaKadilmil', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="Kolonel Chk Sultan, S.H."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Pangkat:</label>
                      <input
                        type="text"
                        value={customFields.pangkatKadilmil || ''}
                        onChange={(e) => updateCustomField('pangkatKadilmil', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="Kolonel Chk"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">NRP Pimpinan:</label>
                      <input
                        type="text"
                        value={customFields.nrpKadilmil || ''}
                        onChange={(e) => updateCustomField('nrpKadilmil', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                        placeholder="11980017760771"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Kutipan Utama (Quote Pimpinan):</label>
                    <input
                      type="text"
                      value={customFields.kutipanQuote || ''}
                      onChange={(e) => updateCustomField('kutipanQuote', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="Assalamu'alaikum Warahmatullahi Wabarakatuh..."
                    />
                  </div>
                </div>
              )}

              {/* Dedicated Visual Blocks for m2 to m9, lp1 to lp8, lh1 to lh6 */}
              {contentItem.id === 'm2' && (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 space-y-3">
                  <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Visi & Motto Satker</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Visi Utama Lembaga:</label>
                      <textarea
                        rows={2}
                        value={customFields.visiUtama || ''}
                        onChange={(e) => updateCustomField('visiUtama', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs"
                        placeholder="Terwujudnya Pengadilan Militer Tinggi V Makassar yang Agung..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Motto Pengadilan:</label>
                      <textarea
                        rows={2}
                        value={customFields.mottoPengadilan || ''}
                        onChange={(e) => updateCustomField('mottoPengadilan', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs"
                        placeholder="REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {contentItem.id === 'm3' && (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 space-y-3">
                  <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Foto Gedung & Cakupan Wilayah Yurisdiksi</span>
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-amber-400/80 overflow-hidden bg-slate-950 flex items-center justify-center shrink-0 shadow-md">
                      {customFields.fotoSejarahUrl ? (
                        <img src={customFields.fotoSejarahUrl} alt="Foto Gedung/Sejarah" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-2 text-[10px] text-slate-500">🏛️ Belum ada foto</div>
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300">Foto Gedung / Sejarah (URL atau Unggah):</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customFields.fotoSejarahUrl || ''}
                          onChange={(e) => updateCustomField('fotoSejarahUrl', e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          placeholder="https://... atau /uploads/..."
                        />
                        <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('fotoSejarahUrl', e)} />
                        </label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Cakupan Wilayah:</label>
                          <input
                            type="text"
                            value={customFields.cakupanWilayah || ''}
                            onChange={(e) => updateCustomField('cakupanWilayah', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                            placeholder="6 Dilmil Tingkat I di Kawasan Timur Indonesia"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Kewenangan Yudisial:</label>
                          <input
                            type="text"
                            value={customFields.kewenanganYudisial || ''}
                            onChange={(e) => updateCustomField('kewenanganYudisial', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                            placeholder="Tingkat Banding & Pamen Mayor ke Atas"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {contentItem.id === 'm4' && (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 space-y-3">
                  <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>Gambar Bagan Struktur Organisasi</span>
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-28 h-20 rounded-xl border-2 border-amber-400/80 overflow-hidden bg-slate-950 flex items-center justify-center shrink-0 shadow-md">
                      {customFields.baganStrukturUrl || customFields.linkBaganStruktur ? (
                        <img src={getFreshImageUrl(customFields.baganStrukturUrl || customFields.linkBaganStruktur)} alt="Bagan Struktur" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-2 text-[10px] text-slate-500">📊 Belum ada bagan</div>
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <label className="block text-[11px] font-bold text-slate-300">File Gambar Bagan Struktur (URL atau Unggah):</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customFields.baganStrukturUrl || customFields.linkBaganStruktur || ''}
                          onChange={(e) => {
                            updateCustomField('baganStrukturUrl', e.target.value);
                            updateCustomField('linkBaganStruktur', e.target.value);
                          }}
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          placeholder="https://... atau /uploads/..."
                        />
                        <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah Bagan</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('baganStrukturUrl', e)} />
                        </label>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Dasar Regulasi Struktur:</label>
                        <input
                          type="text"
                          value={customFields.dasarRegulasi || ''}
                          onChange={(e) => updateCustomField('dasarRegulasi', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                          placeholder="PERMA No. 1 Tahun 2017 jo PERMA No. 7 Tahun 2015"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {contentItem.id === 'm5' && (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 space-y-3">
                  <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>Gambar Denah Lantai 1 & 2 serta Lokasi Google Maps</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-300">Gambar Denah Lantai 1:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customFields.denahLantai1Url || ''}
                          onChange={(e) => updateCustomField('denahLantai1Url', e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          placeholder="URL denah L1..."
                        />
                        <label className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('denahLantai1Url', e)} />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-300">Gambar Denah Lantai 2:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customFields.denahLantai2Url || ''}
                          onChange={(e) => updateCustomField('denahLantai2Url', e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          placeholder="URL denah L2..."
                        />
                        <label className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('denahLantai2Url', e)} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Tautan Lokasi / Google Maps Embed URL:</label>
                    <input
                      type="text"
                      value={customFields.googleMapsEmbedUrl || ''}
                      onChange={(e) => updateCustomField('googleMapsEmbedUrl', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              )}

              {contentItem.id === 'lp1' && (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 space-y-3">
                  <h4 className="font-black text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Jam Layanan PTSP & Kontak Hotline</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">Jam Senin - Kamis:</label>
                      <input
                        type="text"
                        value={customFields.jamLayananUmum || ''}
                        onChange={(e) => updateCustomField('jamLayananUmum', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                        placeholder="08.00 - 16.30 WITA"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">Jam Hari Jumat:</label>
                      <input
                        type="text"
                        value={customFields.jamLayananJumat || ''}
                        onChange={(e) => updateCustomField('jamLayananJumat', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                        placeholder="08.00 - 17.00 WITA"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">Hotline / WhatsApp PTSP:</label>
                      <input
                        type="text"
                        value={customFields.hotlinePTSP || ''}
                        onChange={(e) => updateCustomField('hotlinePTSP', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono"
                        placeholder="0811-4455-668"
                      />
                    </div>
                  </div>
                </div>
              )}

              {contentItem.id === 'lp2' && (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 space-y-3">
                  <h4 className="font-black text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Penandatangan, Nomor SK & Berkas Piagam Maklumat</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">Nomor SK Maklumat:</label>
                      <input
                        type="text"
                        value={customFields.nomorSKMaklumat || ''}
                        onChange={(e) => updateCustomField('nomorSKMaklumat', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                        placeholder="SK KADILMILTI NO. W5-Mil.01/OT.01/I/2026"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">Pejabat Penandatangan:</label>
                      <input
                        type="text"
                        value={customFields.penandatangan || ''}
                        onChange={(e) => updateCustomField('penandatangan', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                        placeholder="Kepala Pengadilan Militer Tinggi V Makassar"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1">Gambar / Dokumen Piagam Maklumat (URL atau Unggah):</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customFields.gambarMaklumatUrl || ''}
                        onChange={(e) => updateCustomField('gambarMaklumatUrl', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                        placeholder="https://... atau /uploads/..."
                      />
                      <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('gambarMaklumatUrl', e)} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {contentItem.id === 'lp7' && (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 space-y-3">
                  <h4 className="font-black text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Indeks Kepuasan Masyarakat (IKM) & Integritas (IPAK)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">Nilai IKM (Skala 4.00):</label>
                      <input
                        type="text"
                        value={customFields.nilaiIKMTerbaru || ''}
                        onChange={(e) => updateCustomField('nilaiIKMTerbaru', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono"
                        placeholder="3.92 / 4.00"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">Nilai IPAK (Skala 4.00):</label>
                      <input
                        type="text"
                        value={customFields.nilaiIPAKTerbaru || ''}
                        onChange={(e) => updateCustomField('nilaiIPAKTerbaru', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono"
                        placeholder="3.96 / 4.00"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">Tautan Survei Online:</label>
                      <input
                        type="text"
                        value={customFields.linkSurveiOnline || ''}
                        onChange={(e) => updateCustomField('linkSurveiOnline', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                        placeholder="https://survei.badilmiltun.mahkamahagung.go.id"
                      />
                    </div>
                  </div>
                </div>
              )}

              {contentItem.id === 'lp8' && (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 space-y-3">
                  <h4 className="font-black text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Cover & Berkas e-Brosur PDF</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-300">Gambar Cover e-Brosur:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customFields.coverBrosurUrl || ''}
                          onChange={(e) => updateCustomField('coverBrosurUrl', e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                          placeholder="URL Cover..."
                        />
                        <label className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0">
                          <Upload className="w-3 h-3" />
                          <span>Unggah</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('coverBrosurUrl', e)} />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-300">Dokumen PDF e-Brosur:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customFields.pdfBrosurUrl || ''}
                          onChange={(e) => updateCustomField('pdfBrosurUrl', e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                          placeholder="URL PDF..."
                        />
                        <label className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0">
                          <Upload className="w-3 h-3" />
                          <span>Unggah PDF</span>
                          <input type="file" accept="application/pdf" className="hidden" onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const url = await CourtDB.uploadMediaFile(f, 'uploads');
                              if (url) updateCustomField('pdfBrosurUrl', url);
                            }
                          }} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Konten Narasi Utama / Paragraf Resmi:</span>
                  <span className="text-[10px] text-slate-500">Mendukung format multi-paragraf</span>
                </label>
                <textarea
                  rows={9}
                  value={kontenUtama}
                  onChange={(e) => setKontenUtama(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white font-normal leading-relaxed focus:border-amber-400 focus:outline-none font-sans text-xs"
                  placeholder="Tuliskan teks sambutan, narasi sejarah, ikrar maklumat, atau penjelasan layanan lengkap..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Petugas / Unit Penanggung Jawab:
                  </label>
                  <input
                    type="text"
                    value={petugasPenanggungJawab}
                    onChange={(e) => setPetugasPenanggungJawab(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                    placeholder="Contoh: Kepaniteraan Pidana / Subbag PTIP"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Status Publikasi:
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Aktif">Aktif (Diterbitkan di Website)</option>
                    <option value="Draft">Draft (Arsip Internal)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POIN-POIN */}
          {activeTab === 'poin' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <label className="block text-[11px] font-bold text-slate-300">
                  Tambah Butir Poin Kebijakan / Tahapan SOP:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPointInput}
                    onChange={(e) => setNewPointInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPoint();
                      }
                    }}
                    placeholder="Tuliskan poin kebijakan baru lalu klik Tambah atau tekan Enter..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPoint}
                    className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Poin</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Daftar Poin yang Ditampilkan ({poinPoin.length}):
                </label>
                {poinPoin.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                    Belum ada butir poin. Tambahkan poin kebijakan di atas.
                  </div>
                ) : (
                  poinPoin.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handleUpdatePoint(idx, e.target.value)}
                        className="flex-1 bg-transparent text-slate-200 text-xs border-none focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(idx)}
                        className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-colors cursor-pointer shrink-0"
                        title="Hapus poin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PENGATURAN KHUSUS MENU */}
          {activeTab === 'spesifik' && (
            <div className="space-y-4">
              {/* ATRIBUT KATEGORI & STRUKTUR NAVIGASI (Pengaturan CRUD Menu & Sub-Menu) */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>Konfigurasi Struktur Navigasi Menu & Sub-Menu</span>
                  </h4>
                  {contentItem.isCustomCreated && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 border border-amber-300 uppercase">
                      Menu Kustom
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Kelompok Kategori Induk:</label>
                    <select
                      value={selectedKategori}
                      onChange={(e) => setSelectedKategori(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                    >
                      <option value="tentang">Tentang Pengadilan</option>
                      <option value="layanan">Layanan Publik (PTSP)</option>
                      <option value="hukum">Layanan Hukum & Perkara</option>
                      <option value="informasi">PPID & Keterbukaan Informasi</option>
                      <option value="beranda">Beranda / Utama</option>
                      <option value="lainnya">Lainnya / Kustom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Tipe Navigasi Menu:</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                    >
                      <option value="sub_menu">Sub-Menu (Anak Dropdown Navigasi)</option>
                      <option value="menu_utama">Menu Utama (Top-Bar Navigation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Label Badge Indikator:</label>
                    <input
                      type="text"
                      value={badgeLabel}
                      onChange={(e) => setBadgeLabel(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      placeholder="e.g. NEW, SPESIFIK, ZI, PETA"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Halaman Website (Section):</label>
                    <select
                      value={targetSection}
                      onChange={(e) => setTargetSection(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    >
                      <option value="tentang">Halaman Tentang Pengadilan</option>
                      <option value="publik">Halaman Layanan Publik (PTSP)</option>
                      <option value="hukum">Halaman Layanan Hukum</option>
                      <option value="reformasi">Halaman Reformasi Birokrasi (ZI)</option>
                      <option value="jadwal">Halaman Jadwal Sidang</option>
                      <option value="ppid">Halaman PPID & Informasi</option>
                      <option value="publik">Halaman Layanan Publik & Inovasi</option>
                      <option value="external_link">Tautan Eksternal URL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Sub-Tab ID (Opsional):</label>
                    <input
                      type="text"
                      value={targetSubTab}
                      onChange={(e) => setTargetSubTab(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                      placeholder="e.g. sambutan, visimisi, ptsp, posbakum, ebrosur"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Ikon Navigasi:</label>
                    <select
                      value={iconName}
                      onChange={(e) => setIconName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    >
                      <option value="Building2">Building2 (Gedung Kantor)</option>
                      <option value="Users">Users (Layanan Publik)</option>
                      <option value="Scale">Scale (Hukum & Peradilan)</option>
                      <option value="FileText">FileText (Dokumen / Laporan)</option>
                      <option value="ShieldCheck">ShieldCheck (ZI / Pengawasan)</option>
                      <option value="Sparkles">Sparkles (Inovasi Digital)</option>
                      <option value="Link">Link (Tautan Luar)</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* m6: Role Model & Agen Perubahan */}
              {contentItem.id === 'm6' && (
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
                    <div>
                      <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        <span>Profil Role Model & Agen Perubahan (SK 593/2026)</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Kelola foto, nama, jabatan, komitmen, dan narasi kontribusi Role Model & Agen Perubahan
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddRoleModel}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Personel Baru</span>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {roleModelList.map((item, idx) => (
                      <div key={item.id || idx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                        <div className="flex items-start gap-4 flex-col sm:flex-row">
                          {/* Foto Profile & Upload Button */}
                          <div className="flex flex-col items-center gap-2 shrink-0 w-full sm:w-28">
                            <img
                              src={getFreshImageUrl(item.fotoUrl)}
                              alt={item.nama}
                              onError={(e) => handleImageFallback(e, DEFAULT_OFFICIAL_AVATAR)}
                              loading="lazy"
                              decoding="async"
                              className="w-24 h-28 object-cover rounded-lg border-2 border-amber-400/60 shadow-md bg-slate-950"
                            />
                            <label className="w-full text-center px-2 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1 transition-colors">
                              <Upload className="w-3 h-3" />
                              <span>Unggah Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUpdateRoleModelPhoto(item.id, f);
                                }}
                              />
                            </label>
                          </div>

                          {/* Inputs */}
                          <div className="flex-1 space-y-2.5 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Tipe Personel:</label>
                                <select
                                  value={item.tipe}
                                  onChange={(e) => handleRoleModelChange(item.id, 'tipe', e.target.value as any)}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-bold"
                                >
                                  <option value="Role Model">Role Model (Pimpinan)</option>
                                  <option value="Agen Perubahan">Agen Perubahan (Aparatur)</option>
                                </select>
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Nama Lengkap & Gelar:</label>
                                <input
                                  type="text"
                                  value={item.nama}
                                  onChange={(e) => handleRoleModelChange(item.id, 'nama', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-bold"
                                  placeholder="Kolonel Chk Sultan, S.H."
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Jabatan Resmi:</label>
                                <input
                                  type="text"
                                  value={item.jabatan}
                                  onChange={(e) => handleRoleModelChange(item.id, 'jabatan', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                                  placeholder="Wakil Kepala Pengadilan..."
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Pangkat / NIP / NRP:</label>
                                <input
                                  type="text"
                                  value={item.pangkatNip}
                                  onChange={(e) => handleRoleModelChange(item.id, 'pangkatNip', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                                  placeholder="Kolonel Chk / NRP 1198..."
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Komitmen Kerja / Motto Integritas:</label>
                              <input
                                type="text"
                                value={item.komitmenKerja}
                                onChange={(e) => handleRoleModelChange(item.id, 'komitmenKerja', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                                placeholder="Memberikan keteladanan dalam berdisiplin..."
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Kontribusi Pembangunan ZI & SMAP:</label>
                              <textarea
                                rows={2}
                                value={item.kontribusiReformasi}
                                onChange={(e) => handleRoleModelChange(item.id, 'kontribusiReformasi', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs leading-snug"
                                placeholder="Pelopor pengawasan internal..."
                              />
                            </div>

                            {item.tipe === 'Agen Perubahan' && (
                              <div>
                                <label className="block text-[10px] font-bold text-amber-400 mb-0.5">Rencana Program Kerja Agen Perubahan:</label>
                                <textarea
                                  rows={2}
                                  value={item.rencanaProgramKerja || ''}
                                  onChange={(e) => handleRoleModelChange(item.id, 'rencanaProgramKerja', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs leading-snug"
                                  placeholder="Inovasi sistem digitalisasi berkas persidangan..."
                                />
                              </div>
                            )}

                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteRoleModel(item.id)}
                                className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Hapus Personel Ini</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* m1: Pengantar Pimpinan */}
              {contentItem.id === 'm1' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Data Profil Pimpinan (Kadilmilti V)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Nama Lengkap & Gelar:</label>
                      <input
                        type="text"
                        value={customFields.namaKadilmil || ''}
                        onChange={(e) => updateCustomField('namaKadilmil', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="Brigjen TNI..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Pangkat Militer:</label>
                      <input
                        type="text"
                        value={customFields.pangkatKadilmil || ''}
                        onChange={(e) => updateCustomField('pangkatKadilmil', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="Brigadir Jenderal TNI"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">NRP / NIP:</label>
                      <input
                        type="text"
                        value={customFields.nrpKadilmil || ''}
                        onChange={(e) => updateCustomField('nrpKadilmil', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="1193000..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Kutipan Quote Pimpinan:</label>
                    <input
                      type="text"
                      value={customFields.kutipanQuote || ''}
                      onChange={(e) => updateCustomField('kutipanQuote', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="Keadilan Militer yang Agung Ditegakkan dengan Kejujuran..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">URL Foto Resmi Pimpinan:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customFields.fotoKadilmil || ''}
                        onChange={(e) => updateCustomField('fotoKadilmil', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="https://..."
                      />
                      <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload('fotoKadilmil', e)}
                        />
                      </label>
                    </div>
                    {customFields.fotoKadilmil && (
                      <div className="mt-2 flex items-center gap-2">
                        <img 
                          src={customFields.fotoKadilmil} 
                          alt="Preview Pimpinan" 
                          className="w-12 h-14 object-cover rounded-md border border-amber-400/50"
                        />
                        <span className="text-[11px] text-slate-400">Preview foto pimpinan siap digunakan</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* m2: Visi dan Misi */}
              {contentItem.id === 'm2' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Formulasi Visi & Motto Satker</span>
                  </h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Pernyataan Visi Utama:</label>
                    <textarea
                      rows={2}
                      value={customFields.visiUtama || ''}
                      onChange={(e) => updateCustomField('visiUtama', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                      placeholder="Terwujudnya Pengadilan Militer Tinggi V Makassar yang Agung..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Motto Pelayanan Pengadilan:</label>
                    <input
                      type="text"
                      value={customFields.mottoPengadilan || ''}
                      onChange={(e) => updateCustomField('mottoPengadilan', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="PRIMA - Profesional, Ramah, Integritas, Mandiri, Akuntabel"
                    />
                  </div>
                </div>
              )}

              {/* m3: Sejarah & Yurisdiksi */}
              {contentItem.id === 'm3' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Foto Gedung & Ilustrasi Sejarah</span>
                  </h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">URL / File Foto Gedung / Sejarah Satker:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customFields.fotoSejarahUrl || ''}
                        onChange={(e) => updateCustomField('fotoSejarahUrl', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                        placeholder="https://..."
                      />
                      <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload('fotoSejarahUrl', e)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* m4: Struktur Organisasi */}
              {contentItem.id === 'm4' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>Gambar Bagan Struktur Organisasi</span>
                  </h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">URL / File Gambar Bagan Organisasi:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customFields.baganStrukturUrl || ''}
                        onChange={(e) => updateCustomField('baganStrukturUrl', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                        placeholder="https://..."
                      />
                      <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Bagan</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload('baganStrukturUrl', e)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* m5: Denah & Peta Gedung */}
              {contentItem.id === 'm5' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-amber-400 text-xs uppercase flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>Gambar Denah & Koordinat Google Maps</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">URL / File Denah Lantai 1:</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={customFields.denahLantai1Url || ''}
                          onChange={(e) => updateCustomField('denahLantai1Url', e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          placeholder="https://..."
                        />
                        <label className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload('denahLantai1Url', e)}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">URL / File Denah Lantai 2:</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={customFields.denahLantai2Url || ''}
                          onChange={(e) => updateCustomField('denahLantai2Url', e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          placeholder="https://..."
                        />
                        <label className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload('denahLantai2Url', e)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Tautan Lokasi Google Maps:</label>
                    <input
                      type="text"
                      value={customFields.googleMapsEmbedUrl || ''}
                      onChange={(e) => updateCustomField('googleMapsEmbedUrl', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              )}

              {/* lp8: e-Brosur / Publikasi */}
              {contentItem.id === 'lp8' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>File Gambar Cover & Dokumen e-Brosur PDF</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Gambar Cover e-Brosur:</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={customFields.coverBrosurUrl || ''}
                          onChange={(e) => updateCustomField('coverBrosurUrl', e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          placeholder="https://..."
                        />
                        <label className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload('coverBrosurUrl', e)}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">File Dokumen PDF e-Brosur:</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={customFields.pdfBrosurUrl || ''}
                          onChange={(e) => updateCustomField('pdfBrosurUrl', e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                          placeholder="https://..."
                        />
                        <label className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah PDF</span>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                showToast(`Mengunggah ${f.name}...`);
                                const url = await CourtDB.uploadMediaFile(f, 'uploads');
                                if (url) {
                                  updateCustomField('pdfBrosurUrl', url);
                                  showToast('File PDF e-Brosur berhasil diunggah!');
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* lp1: PTSP & Standar Jam Layanan */}
              {contentItem.id === 'lp1' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Standar Jam Layanan PTSP</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Jam Layanan Senin - Kamis:</label>
                      <input
                        type="text"
                        value={customFields.jamLayananUmum || ''}
                        onChange={(e) => updateCustomField('jamLayananUmum', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="08.00 - 16.30 WITA"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Jam Layanan Hari Jumat:</label>
                      <input
                        type="text"
                        value={customFields.jamLayananJumat || ''}
                        onChange={(e) => updateCustomField('jamLayananJumat', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="08.00 - 17.00 WITA"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Nomor Hotline / WhatsApp PTSP:</label>
                    <input
                      type="text"
                      value={customFields.hotlinePTSP || ''}
                      onChange={(e) => updateCustomField('hotlinePTSP', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="0811-4455-668"
                    />
                  </div>
                </div>
              )}

              {/* lp3: Kompensasi Layanan */}
              {contentItem.id === 'lp3' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Jaminan & Ketentuan Kompensasi PTSP</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Batas Maksimal Toleransi Keterlambatan:</label>
                      <input
                        type="text"
                        value={customFields.waktuKeterlambatanStandar || ''}
                        onChange={(e) => updateCustomField('waktuKeterlambatanStandar', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="Lebih dari 15 Menit di Loket PTSP"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Bentuk Kompensasi Diberikan:</label>
                      <input
                        type="text"
                        value={customFields.bentukKompensasi || ''}
                        onChange={(e) => updateCustomField('bentukKompensasi', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="Souvenir Resmi / Pengantaran Dokumen Bebas Biaya"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* lp7: Survei IKM & IPAK */}
              {contentItem.id === 'lp7' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Nilai Indeks Survei Triwulanan</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Nilai IKM Terkini (Skala 4.00):</label>
                      <input
                        type="text"
                        value={customFields.nilaiIKMTerbaru || ''}
                        onChange={(e) => updateCustomField('nilaiIKMTerbaru', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="3.92 / 4.00"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Nilai IPAK Terkini (Skala 4.00):</label>
                      <input
                        type="text"
                        value={customFields.nilaiIPAKTerbaru || ''}
                        onChange={(e) => updateCustomField('nilaiIPAKTerbaru', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="3.96 / 4.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Tautan Barcode e-Survei Online:</label>
                    <input
                      type="text"
                      value={customFields.linkSurveiOnline || ''}
                      onChange={(e) => updateCustomField('linkSurveiOnline', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="https://survei.badilmiltun.mahkamahagung.go.id"
                    />
                  </div>
                </div>
              )}

              {/* lh4: Sidang Luar Gedung */}
              {contentItem.id === 'lh4' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-sky-400 text-xs uppercase flex items-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    <span>Pengaturan Sidang Keliling & Pos Layanan Perbatasan</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Jadwal Pelaksanaan:</label>
                      <input
                        type="text"
                        value={customFields.jadwalPelaksanaan || ''}
                        onChange={(e) => updateCustomField('jadwalPelaksanaan', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="Triwulan I s.d. IV Sesuai Kebutuhan"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Biaya Pemohon:</label>
                      <input
                        type="text"
                        value={customFields.biayaPelaksanaan || ''}
                        onChange={(e) => updateCustomField('biayaPelaksanaan', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="Dibiayai DIPA 05 (0 Rupiah)"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Lokasi Pangkalan Tujuan Sidang:</label>
                    <input
                      type="text"
                      value={customFields.lokasiSidang || ''}
                      onChange={(e) => updateCustomField('lokasiSidang', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="Sulawesi Tenggara (Korem 143/HO), Manado, Palu..."
                    />
                  </div>
                </div>
              )}

              {/* lh5: MonEksTUN */}
              {contentItem.id === 'lh5' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-sky-400 text-xs uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Portal Pengawasan Eksekusi MonEksTUN MA-RI</span>
                  </h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">URL Portal Resmi MonEksTUN:</label>
                    <input
                      type="text"
                      value={customFields.portalMonEksTUNUrl || ''}
                      onChange={(e) => updateCustomField('portalMonEksTUNUrl', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="https://monekstun.mahkamahagung.go.id"
                    />
                  </div>
                </div>
              )}

              {/* General custom fields for any other menu */}
              {Object.keys(customFields).length > 0 && !['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'lp1', 'lp3', 'lp7', 'lp8', 'lh4', 'lh5'].includes(contentItem.id) && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-black text-slate-300 text-xs uppercase">Parameter Tambahan</h4>
                  {Object.entries(customFields).map(([k, v]) => (
                    <div key={k}>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1 capitalize flex items-center justify-between">
                        <span>{k.replace(/([A-Z])/g, ' $1')}:</span>
                        {(k.toLowerCase().includes('url') || k.toLowerCase().includes('foto') || k.toLowerCase().includes('gambar')) && (
                          <span className="text-[10px] text-amber-400 font-semibold">Tautan Media</span>
                        )}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={v}
                          onChange={(e) => updateCustomField(k, e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                        {(k.toLowerCase().includes('url') || k.toLowerCase().includes('foto') || k.toLowerCase().includes('gambar')) && (
                          <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(k, e)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SHORTCUT TO MASTER TABLE IF AVAILABLE */}
              {specificManager && onOpenSpecificTab && (
                <div className="p-4 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-amber-300 text-xs">Kelola Baris Data Lengkap</h5>
                    <p className="text-[11px] text-slate-400">
                      Menu ini memiliki tabel data terstruktur (CRUD baris/item) di panel admin.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSpecificTab(specificManager.tab);
                    }}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-xs shrink-0"
                  >
                    <span>{specificManager.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DASAR HUKUM & DOKUMEN UNDUHAN */}
          {activeTab === 'tautan' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Dasar Regulasi / Payung Hukum:
                  </label>
                  <input
                    type="text"
                    value={dasarHukum}
                    onChange={(e) => setDasarHukum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                    placeholder="Contoh: UU No. 31/1997 / PERMA No. 1/2014"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Nomor SK Penetapan / Surat Edaran:
                  </label>
                  <input
                    type="text"
                    value={skNomor}
                    onChange={(e) => setSkNomor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                    placeholder="Contoh: SK Kadilmilti V No. 593/2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Tautan File Dokumen PDF / Download Center:
                </label>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <input
                    type="text"
                    value={linkDokumen}
                    onChange={(e) => setLinkDokumen(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none text-xs"
                    placeholder="https://dilmilti5-makassar.go.id/dokumen/..."
                  />
                  <label className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer flex items-center justify-center gap-1.5 font-bold text-xs shrink-0 transition-colors shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah Berkas PDF/Dokumen</span>
                    <input
                      type="file"
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,.zip,.rar"
                      className="hidden"
                      onChange={handleDocumentUpload}
                    />
                  </label>
                  {linkDokumen && (
                    <a
                      href={linkDokumen}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1 font-bold text-xs shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Tes Buka</span>
                    </a>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Pilih berkas dari komputer/laptop Anda (PDF, DOCX, JPG/PNG, ZIP) untuk mengunggah secara langsung dan otomatis menghasilkan tautan unduhan publik.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Tautan Portal Eksternal / Portal Mahkamah Agung:
                </label>
                <input
                  type="text"
                  value={linkEksternal}
                  onChange={(e) => setLinkEksternal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  placeholder="https://badilmiltun.mahkamahagung.go.id"
                />
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-slate-300">Catatan Pembaruan Terakhir:</div>
                <div>Tanggal update data: <span className="font-mono text-amber-400">{contentItem.tanggalUpdate || '2026-09-20'}</span></div>
                <div>Seluruh data tersimpan otomatis di basis data lokal terenkripsi dan disinkronkan ke server web applet.</div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {contentItem.isCustomCreated && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Apakah Anda yakin ingin menghapus menu '${judul}' secara permanen?`)) {
                    CourtDB.deleteMenuContent(contentItem.id);
                    showToast(`Menu '${judul}' berhasil dihapus.`, 'success');
                    onClose();
                    if (onSaveSuccess) onSaveSuccess(contentItem);
                  }
                }}
                className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Hapus Menu Kustom</span>
              </button>
            )}
            {onNavigateToLivePage && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToLivePage(liveTarget.section, liveTarget.subTab);
                }}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Lihat Tampilan Website</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
