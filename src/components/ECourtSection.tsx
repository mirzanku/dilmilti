import { useState, useEffect } from 'react';
import { 
  Laptop, 
  FileUp, 
  CreditCard, 
  Mail, 
  Video, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck, 
  BookOpen,
  HelpCircle,
  PhoneCall,
  Info,
  Scale,
  Building2,
  Users,
  FileCheck2,
  Lock,
  Plus,
  Pencil,
  Trash2,
  Sliders,
  RotateCcw,
  Check,
  Sparkles
} from 'lucide-react';
import { CourtDB, DEFAULT_ECOURT_CONTENT } from '../data/courtDatabase';
import { 
  ECourtPageContent, 
  ECourtCaseTypeItem, 
  ECourtDocRequirementItem, 
  ECourtProcedureStepItem,
  ECourtLegalBasisItem,
  ECourtPartnerBankItem
} from '../types';
import { ECourtCrudModal } from './ecourt/ECourtCrudModal';
import { isStaffUser } from '../utils/rbac';
import { 
  CaseTypeModal, 
  DocRequirementModal, 
  ProcedureStepModal,
  LegalBasisModal,
  PartnerBankModal
} from './ecourt/ECourtItemModals';

export default function ECourtSection() {
  const sessionUser = CourtDB.getCurrentSession();
  const isStaff = isStaffUser(sessionUser);
  const [content, setContent] = useState<ECourtPageContent>(() => CourtDB.getECourtContent());
  const [activeTab, setActiveTab] = useState<'overview' | 'efiling' | 'epayment' | 'esummons' | 'elitigation' | 'bantuan'>('overview');
  const [isCrudMode, setIsCrudMode] = useState<boolean>(isStaff);
  
  // Modals state
  const [isFullCrudOpen, setIsFullCrudOpen] = useState(false);
  
  // Sub-item modals
  const [caseTypeModalOpen, setCaseTypeModalOpen] = useState(false);
  const [editingCaseType, setEditingCaseType] = useState<ECourtCaseTypeItem | null>(null);

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ECourtDocRequirementItem | null>(null);

  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<ECourtProcedureStepItem | null>(null);

  const [legalBasisModalOpen, setLegalBasisModalOpen] = useState(false);
  const [editingLegalBasis, setEditingLegalBasis] = useState<ECourtLegalBasisItem | null>(null);

  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<ECourtPartnerBankItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Subscribe to DB updates
  useEffect(() => {
    const syncContent = () => {
      setContent(CourtDB.getECourtContent());
    };
    const unsubscribe = CourtDB.subscribe(syncContent);
    window.addEventListener('dilmilti_db_updated', syncContent);
    return () => {
      unsubscribe();
      window.removeEventListener('dilmilti_db_updated', syncContent);
    };
  }, []);

  // Handlers for Full CRUD Modal
  const handleSaveFullContent = (newContent: ECourtPageContent) => {
    CourtDB.saveECourtContent(newContent);
    setContent(newContent);
    showToast('Seluruh konfigurasi e-Court berhasil disimpan ke database!');
  };

  const handleResetContent = () => {
    const res = CourtDB.resetECourtContent();
    setContent(res);
    showToast('Konten e-Court telah direset ke standar resmi Mahkamah Agung RI!');
  };

  // Case Type CRUD
  const handleSaveCaseType = (item: ECourtCaseTypeItem) => {
    if (editingCaseType) {
      CourtDB.updateECourtCaseType(item);
      showToast(`Jenis perkara "${item.nama}" berhasil diperbarui!`);
    } else {
      CourtDB.addECourtCaseType(item);
      showToast(`Jenis perkara baru "${item.nama}" berhasil ditambahkan!`);
    }
    setContent(CourtDB.getECourtContent());
  };

  const handleDeleteCaseType = (id: string, name: string) => {
    if (window.confirm(`Hapus jenis perkara "${name}"?`)) {
      CourtDB.deleteECourtCaseType(id);
      setContent(CourtDB.getECourtContent());
      showToast(`Jenis perkara "${name}" telah dihapus.`);
    }
  };

  // Doc Requirement CRUD
  const handleSaveDoc = (item: ECourtDocRequirementItem) => {
    if (editingDoc) {
      CourtDB.updateECourtDocRequirement(item);
      showToast(`Dokumen persyaratan "${item.nama}" berhasil diperbarui!`);
    } else {
      CourtDB.addECourtDocRequirement(item);
      showToast(`Dokumen persyaratan "${item.nama}" berhasil ditambahkan!`);
    }
    setContent(CourtDB.getECourtContent());
  };

  const handleDeleteDoc = (id: string, name: string) => {
    if (window.confirm(`Hapus dokumen "${name}"?`)) {
      CourtDB.deleteECourtDocRequirement(id);
      setContent(CourtDB.getECourtContent());
      showToast(`Dokumen "${name}" telah dihapus.`);
    }
  };

  // Procedure Step CRUD
  const handleSaveStep = (item: ECourtProcedureStepItem) => {
    if (editingStep) {
      CourtDB.updateECourtProcedureStep(item);
      showToast(`Langkah "${item.judul}" berhasil diperbarui!`);
    } else {
      CourtDB.addECourtProcedureStep(item);
      showToast(`Langkah baru "${item.judul}" berhasil ditambahkan!`);
    }
    setContent(CourtDB.getECourtContent());
  };

  const handleDeleteStep = (id: string, name: string) => {
    if (window.confirm(`Hapus alur langkah "${name}"?`)) {
      CourtDB.deleteECourtProcedureStep(id);
      setContent(CourtDB.getECourtContent());
      showToast(`Alur langkah "${name}" telah dihapus.`);
    }
  };

  // Legal Basis CRUD
  const handleSaveLegalBasis = (item: ECourtLegalBasisItem) => {
    const cur = CourtDB.getECourtContent();
    if (editingLegalBasis) {
      const idx = cur.overview.dasarHukumList.findIndex(x => x.id === item.id);
      if (idx !== -1) cur.overview.dasarHukumList[idx] = item;
    } else {
      cur.overview.dasarHukumList.push(item);
    }
    CourtDB.saveECourtContent(cur);
    setContent(cur);
    showToast(`Dasar hukum "${item.nomorRegulasi}" berhasil disimpan!`);
  };

  const handleDeleteLegalBasis = (id: string, name: string) => {
    if (window.confirm(`Hapus dasar hukum "${name}"?`)) {
      const cur = CourtDB.getECourtContent();
      cur.overview.dasarHukumList = cur.overview.dasarHukumList.filter(x => x.id !== id);
      CourtDB.saveECourtContent(cur);
      setContent(cur);
      showToast(`Dasar hukum "${name}" telah dihapus.`);
    }
  };

  // Bank Partner CRUD
  const handleSaveBank = (item: ECourtPartnerBankItem) => {
    const cur = CourtDB.getECourtContent();
    if (editingBank) {
      const idx = cur.epayment.daftarBank.findIndex(x => x.id === item.id);
      if (idx !== -1) cur.epayment.daftarBank[idx] = item;
    } else {
      cur.epayment.daftarBank.push(item);
    }
    CourtDB.saveECourtContent(cur);
    setContent(cur);
    showToast(`Bank mitra "${item.namaBank}" berhasil disimpan!`);
  };

  const handleDeleteBank = (id: string, name: string) => {
    if (window.confirm(`Hapus bank mitra "${name}"?`)) {
      const cur = CourtDB.getECourtContent();
      cur.epayment.daftarBank = cur.epayment.daftarBank.filter(x => x.id !== id);
      CourtDB.saveECourtContent(cur);
      setContent(cur);
      showToast(`Bank mitra "${name}" telah dihapus.`);
    }
  };

  return (
    <section id="ecourt-integrated-section" className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* CRUD Management Toolbar (Khusus Aparatur Pengadilan) */}
      {isStaff && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                  MODUL CRUD AKTIF
                </span>
                <span className="text-xs font-bold text-slate-800">
                  Pengelolaan Halaman Layanan Perkara Elektronik
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Ubah teks, tambah/edit/hapus kartu informasi perkara, dokumen, alur pendaftaran, dan bank mitra secara real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsCrudMode(!isCrudMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isCrudMode 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              title="Sembunyikan atau tampilkan tombol aksi edit langsung di halaman"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{isCrudMode ? 'Mode Edit: Aktif' : 'Mode Edit: Nonaktif'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullCrudOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-300" />
              <span>Kelola Lengkap (CRUD)</span>
            </button>

            <button
              type="button"
              onClick={handleResetContent}
              className="p-1.5 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors cursor-pointer"
              title="Reset ke konten standar Mahkamah Agung RI"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-sky-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full opacity-10 bg-military-grid pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs">
                {content.header.badge}
              </span>
              <span className="text-xs text-sky-200 font-medium flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full">
                <Scale className="w-3 h-3 text-amber-300" />
                {content.header.dasarHukum}
              </span>
              <span className="text-xs text-sky-300 font-medium hidden sm:inline">
                • {content.header.instansi}
              </span>
              {isCrudMode && (
                <button
                  type="button"
                  onClick={() => setIsFullCrudOpen(true)}
                  className="px-2 py-0.5 rounded-md bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 text-[10px] font-bold transition-all flex items-center gap-1 border border-amber-400/40 cursor-pointer ml-auto sm:ml-0"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit Header</span>
                </button>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3 font-serif">
              <Laptop className="w-7 h-7 text-amber-300 shrink-0" />
              <span>{content.header.judul}</span>
            </h2>

            <p className="text-xs sm:text-sm text-sky-100/90 mt-2 leading-relaxed">
              {content.header.deskripsi}
            </p>
          </div>

          {/* Quick Direct Link CTA to Official Supreme Court Portal */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href={content.header.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <span>{content.header.portalButtonText}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={content.header.panduanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{content.header.panduanButtonText}</span>
            </a>
          </div>
        </div>

        {/* Official Banner Alert */}
        <div className="relative z-10 mt-6 pt-4 border-t border-sky-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-sky-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {content.header.pemberitahuanResmi}
            </span>
          </div>
          <span className="text-[11px] font-mono bg-sky-950/60 text-sky-300 px-2.5 py-1 rounded-md border border-sky-400/20 shrink-0">
            {content.header.badgeTerpusat}
          </span>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#0D4A2B] text-amber-300 shadow-md border border-amber-400/50 font-black'
              : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#0D4A2B] border border-slate-200'
          }`}
        >
          <Info className="w-4 h-4 text-amber-500" />
          <span>Informasi Umum & Dasar Hukum</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('efiling')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'efiling'
              ? 'bg-[#0D4A2B] text-amber-300 shadow-md border border-amber-400/50 font-black'
              : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#0D4A2B] border border-slate-200'
          }`}
        >
          <FileUp className="w-4 h-4 text-amber-500" />
          <span>1. e-Filing (Pendaftaran Perkara)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('epayment')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'epayment'
              ? 'bg-[#0D4A2B] text-amber-300 shadow-md border border-amber-400/50 font-black'
              : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#0D4A2B] border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-500" />
          <span>2. e-Payment (SKUM Elektronik)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('esummons')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'esummons'
              ? 'bg-[#0D4A2B] text-amber-300 shadow-md border border-amber-400/50 font-black'
              : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#0D4A2B] border border-slate-200'
          }`}
        >
          <Mail className="w-4 h-4 text-amber-500" />
          <span>3. e-Summons (Panggilan Resmi)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('elitigation')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'elitigation'
              ? 'bg-[#0D4A2B] text-amber-300 shadow-md border border-amber-400/50 font-black'
              : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#0D4A2B] border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4 text-amber-500" />
          <span>4. e-Litigation (Sidang Daring)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bantuan')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'bantuan'
              ? 'bg-[#0D4A2B] text-amber-300 shadow-md border border-amber-400/50 font-black'
              : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#0D4A2B] border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>Bantuan & Meja e-Court</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & DASAR HUKUM */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {content.overview.judul}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {content.overview.subjudul}
                </p>
              </div>

              {isCrudMode && (
                <button
                  type="button"
                  onClick={() => setIsFullCrudOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200 self-start sm:self-auto cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Teks Overview</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {content.overview.penjelasanUmum}
            </p>

            {/* Dasar Hukum Section with CRUD */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-900" />
                  <span>Dasar Hukum & Regulasi Mahkamah Agung RI</span>
                </h4>
                {isCrudMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLegalBasis(null);
                      setLegalBasisModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Dasar Hukum</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.overview.dasarHukumList.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 group hover:border-blue-400 transition-colors">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-950 block">
                        {item.nomorRegulasi}
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {item.tentang}
                      </p>
                    </div>
                    {isCrudMode && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLegalBasis(item);
                            setLegalBasisModalOpen(true);
                          }}
                          className="p-1 rounded bg-white hover:bg-blue-50 text-blue-900 border border-slate-200 cursor-pointer"
                          title="Edit regulasi"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLegalBasis(item.id, item.nomorRegulasi)}
                          className="p-1 rounded bg-white hover:bg-red-50 text-red-600 border border-slate-200 cursor-pointer"
                          title="Hapus regulasi"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Pilar Prinsip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
              {content.overview.prinsipList.map((prinsip) => (
                <div key={prinsip.id} className="p-4 rounded-xl bg-blue-950 text-white border border-blue-900 flex flex-col justify-between">
                  <div>
                    <h5 className="font-extrabold text-xs text-amber-300 mb-1">{prinsip.judul}</h5>
                    <p className="text-[11px] text-blue-200/90 leading-relaxed">{prinsip.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: E-FILING (PENDAFTARAN PERKARA) */}
      {activeTab === 'efiling' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-blue-900" />
                  <span>{content.efiling.judul}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {content.efiling.subjudul}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={content.efiling.urlDaftarPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
                >
                  <span>Daftar Melalui Portal MA</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Jenis Perkara with CRUD */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-900" />
                  <span>Jenis Upaya Hukum & Gugatan Militer (e-Filing)</span>
                </h4>
                {isCrudMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCaseType(null);
                      setCaseTypeModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Jenis Perkara</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {content.efiling.daftarJenisPerkara.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-950">
                          {item.tingkat}
                        </span>
                        {isCrudMode && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCaseType(item);
                                setCaseTypeModalOpen(true);
                              }}
                              className="p-1 rounded hover:bg-blue-100 text-blue-900 cursor-pointer"
                              title="Edit jenis perkara"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCaseType(item.id, item.nama)}
                              className="p-1 rounded hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Hapus jenis perkara"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900">{item.nama}</h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.deskripsi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dokumen Persyaratan with CRUD */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-blue-900" />
                  <span>Persyaratan Dokumen Elektronik Wajib (Format PDF Maks. 10MB)</span>
                </h4>
                {isCrudMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDoc(null);
                      setDocModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Dokumen</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {content.efiling.daftarDokumen.map((dok) => (
                  <div key={dok.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 group hover:border-blue-400 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-slate-900">{dok.nama}</span>
                        {isCrudMode && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingDoc(dok);
                                setDocModalOpen(true);
                              }}
                              className="p-1 rounded hover:bg-blue-100 text-blue-900 cursor-pointer"
                              title="Edit dokumen"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDoc(dok.id, dok.nama)}
                              className="p-1 rounded hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Hapus dokumen"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mb-2">{dok.deskripsi}</p>
                    </div>
                    <span className="text-[10px] font-mono text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 self-start">
                      {dok.format}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alur Langkah Pendaftaran with CRUD */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-900" />
                  <span>Tahapan Pendaftaran e-Filing Banding Militer</span>
                </h4>
                {isCrudMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStep(null);
                      setStepModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Langkah</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {content.efiling.alurLangkah.map((step) => (
                  <div key={step.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 group hover:border-blue-400 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-950 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {step.stepNumber}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">{step.judul}</h5>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.deskripsi}</p>
                        {step.urlLink && (
                          <a
                            href={step.urlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 hover:underline mt-1"
                          >
                            <span>Buka portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {isCrudMode && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStep(step);
                            setStepModalOpen(true);
                          }}
                          className="p-1.5 rounded bg-white hover:bg-blue-50 text-blue-900 border border-slate-200 cursor-pointer"
                          title="Edit langkah"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStep(step.id, step.judul)}
                          className="p-1.5 rounded bg-white hover:bg-red-50 text-red-600 border border-slate-200 cursor-pointer"
                          title="Hapus langkah"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: E-PAYMENT (SKUM ELEKTRONIK) */}
      {activeTab === 'epayment' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-900" />
                  <span>{content.epayment.judul}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {content.epayment.subjudul}
                </p>
              </div>

              {isCrudMode && (
                <button
                  type="button"
                  onClick={() => setIsFullCrudOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200 self-start sm:self-auto cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Teks e-Payment</span>
                </button>
              )}
            </div>

            {/* Aturan Biaya Perkara Militer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.epayment.ketentuanBiaya.map((rule) => (
                <div key={rule.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-black text-xs sm:text-sm text-slate-900 mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-900" />
                    <span>{rule.judul}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rule.deskripsi}
                  </p>
                </div>
              ))}
            </div>

            {/* Bank Mitra with CRUD */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-900" />
                  <span>Mitra Bank Resmi Virtual Account Mahkamah Agung RI</span>
                </h4>
                {isCrudMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBank(null);
                      setBankModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Bank Mitra</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {content.epayment.daftarBank.map((bank) => (
                  <div key={bank.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 transition-all group flex items-center justify-between">
                    <div>
                      <span className="font-black text-xs sm:text-sm text-slate-900 block">{bank.namaBank}</span>
                      <span className="text-[11px] font-medium text-slate-500">{bank.layananVa}</span>
                    </div>
                    {isCrudMode && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBank(bank);
                            setBankModalOpen(true);
                          }}
                          className="p-1 rounded hover:bg-blue-100 text-blue-900 cursor-pointer"
                          title="Edit bank"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBank(bank.id, bank.namaBank)}
                          className="p-1 rounded hover:bg-red-100 text-red-600 cursor-pointer"
                          title="Hapus bank"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Automatic SIPP synchronization note */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {content.epayment.catatanOtomatisasi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: E-SUMMONS */}
      {activeTab === 'esummons' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-900" />
                  <span>{content.esummons.judul}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {content.esummons.subjudul}
                </p>
              </div>

              {isCrudMode && (
                <button
                  type="button"
                  onClick={() => setIsFullCrudOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200 self-start sm:self-auto cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Teks e-Summons</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.esummons.poinPanggilan.map((point) => (
                <div key={point.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 mb-1.5">{point.judul}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{point.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-950 leading-relaxed">
                {content.esummons.ketentuanPanggilan}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: E-LITIGATION */}
      {activeTab === 'elitigation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-900" />
                  <span>{content.elitigation.judul}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {content.elitigation.subjudul}
                </p>
              </div>

              {isCrudMode && (
                <button
                  type="button"
                  onClick={() => setIsFullCrudOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200 self-start sm:self-auto cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Teks e-Litigation</span>
                </button>
              )}
            </div>

            {/* Tahapan Persidangan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {content.elitigation.tahapanPersidangan.map((tahap) => (
                <div key={tahap.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md mb-2 inline-block">
                      {tahap.tahap}
                    </span>
                    <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 mb-1">{tahap.judul}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{tahap.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ruang Sidang Virtual Kartika */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white border border-slate-800 space-y-3">
              <h4 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-300" />
                <span>{content.elitigation.ruangSidangVirtual.judul}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {content.elitigation.ruangSidangVirtual.deskripsi}
              </p>
              <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside">
                {content.elitigation.ruangSidangVirtual.fasilitas.map((fas, i) => (
                  <li key={i}>{fas}</li>
                ))}
              </ul>
              <div className="text-[11px] text-amber-200/90 pt-2 border-t border-white/10 font-mono">
                {content.elitigation.ruangSidangVirtual.catatanTeleconference}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BANTUAN & MEJA E-COURT */}
      {activeTab === 'bantuan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-900" />
                  <span>{content.bantuan.judul}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {content.bantuan.subjudul}
                </p>
              </div>

              {isCrudMode && (
                <button
                  type="button"
                  onClick={() => setIsFullCrudOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200 self-start sm:self-auto cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Meja e-Court</span>
                </button>
              )}
            </div>

            {/* Kategori Akun Pengguna */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.bantuan.kategoriAkun.map((akun) => (
                <div key={akun.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 mb-1.5 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-900" />
                    <span>{akun.judul}</span>
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{akun.deskripsi}</p>
                </div>
              ))}
            </div>

            {/* Meja e-Court PTSP Info Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950 to-indigo-950 text-white border border-blue-900 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                    LAYANAN MEJA KHUSUS PTSP
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white mt-1.5">
                    Meja e-Court & Helpdesk Terpadu Dilmilti V Makassar
                  </h4>
                  <p className="text-xs text-blue-200 mt-0.5">
                    {content.bantuan.mejaEcourt.lokasi} • {content.bantuan.mejaEcourt.alamat}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${content.bantuan.mejaEcourt.noWhatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Konsultasi WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Jam Kerja Senin - Kamis:</span>
                  <span className="font-bold text-white">{content.bantuan.mejaEcourt.jamLayananSeninKamis}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Jam Kerja Jumat:</span>
                  <span className="font-bold text-white">{content.bantuan.mejaEcourt.jamLayananJumat}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Unit Penanggung Jawab:</span>
                  <span className="font-bold text-white">{content.bantuan.mejaEcourt.namaHelpdesk}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-item CRUD Modals */}
      <CaseTypeModal
        isOpen={caseTypeModalOpen}
        onClose={() => setCaseTypeModalOpen(false)}
        initialData={editingCaseType}
        onSave={handleSaveCaseType}
      />

      <DocRequirementModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        initialData={editingDoc}
        onSave={handleSaveDoc}
      />

      <ProcedureStepModal
        isOpen={stepModalOpen}
        onClose={() => setStepModalOpen(false)}
        initialData={editingStep}
        onSave={handleSaveStep}
      />

      <LegalBasisModal
        isOpen={legalBasisModalOpen}
        onClose={() => setLegalBasisModalOpen(false)}
        initialData={editingLegalBasis}
        onSave={handleSaveLegalBasis}
      />

      <PartnerBankModal
        isOpen={bankModalOpen}
        onClose={() => setBankModalOpen(false)}
        initialData={editingBank}
        onSave={handleSaveBank}
      />

      {/* Full e-Court Management Modal */}
      <ECourtCrudModal
        isOpen={isFullCrudOpen}
        onClose={() => setIsFullCrudOpen(false)}
        content={content}
        onSave={handleSaveFullContent}
        onReset={handleResetContent}
      />

    </section>
  );
}
