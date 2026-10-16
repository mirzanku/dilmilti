import React, { useState, useEffect } from 'react';
import {
  Building2,
  Ticket,
  FileText,
  Search,
  Tv,
  Video,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Shield,
  Swords,
  QrCode,
  Printer,
  Send,
  Volume2,
  AlertCircle,
  Upload,
  Download,
  Award,
  UserCheck,
  Database,
  ArrowRight,
  PhoneCall,
  Sparkles,
  Smartphone,
  Layers,
  MapPin,
  Phone,
  Globe,
  Lock,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import {
  PTSPDB,
  KATALOG_6_MEJA_PTSP,
  PTSPApplicationItem,
  PTSPQueueTicketItem,
  PTSPUserItem
} from '../data/ptspDatabase';
import { sendWhatsAppMessage } from '../utils/whatsappHelper';
import { UserAccount } from '../types';
import { syncRouteToUrl } from '../utils/urlRouter';
import {
  printApplicationReceipt,
  printOfficialReplyDocument,
  printQueueTicketSlip,
  printBukuIISopPtspDocument,
  getBukuIIRegisterMetadata
} from './ptsp/PtspPrintHelper';
import PtspVideoCallTab from './ptsp/PtspVideoCallTab';
import PtspAdminDashboardTab from './ptsp/PtspAdminDashboardTab';
import PtspAdminLoginPage from './ptsp/PtspAdminLoginPage';
import PtspTteValidatorTab from './ptsp/PtspTteValidatorTab';
import PtspOfflineSyncPanel, { PWAInstallButton } from './ptsp/PtspOfflineSyncPanel';

export type PtspTabId =
  | 'app-viewer'
  | 'permohonan'
  | 'lacak'
  | 'validasi-tte'
  | 'antrean'
  | 'monitor'
  | 'konsultasi'
  | 'pengaturan'
  | 'login'
  | 'offline';

interface PtspInovasiSectionProps {
  currentUser?: UserAccount | null;
  onNavigateToWA?: () => void;
  onNavigateToSIPP?: () => void;
  onNavigateToSection?: (section: any, subTab?: string) => void;
  initialTab?: string;
  initialServiceType?: string;
}

export default function PtspInovasiSection({
  currentUser,
  onNavigateToWA,
  onNavigateToSIPP,
  onNavigateToSection,
  initialTab,
  initialServiceType
}: PtspInovasiSectionProps) {
  const [activeTab, setActiveTab] = useState<PtspTabId>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab === 'login') return 'login';
      if (urlTab) return urlTab as PtspTabId;
    }
    return (initialTab as PtspTabId) || 'app-viewer';
  });

  const [loggedOfficer, setLoggedOfficer] = useState<PTSPUserItem | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ptsp_logged_officer_session');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return null;
  });

  const [dbState, setDbState] = useState(() => PTSPDB.getState());
  const courtIdentity = CourtDB.getCourtIdentity();

  // Katalog 6 Meja Active Filter
  const [selectedMejaId, setSelectedMejaId] = useState<number>(1);

  // Video Consultation Room target
  const [targetVideoRoom, setTargetVideoRoom] = useState<string>('V-PTSP-101');
  const [videoRole, setVideoRole] = useState<'pemohon' | 'petugas'>('pemohon');
  const [videoOfficerName, setVideoOfficerName] = useState<string | undefined>(undefined);

  // Form Pengajuan Layanan Online (Tab 2)
  const [appForm, setAppForm] = useState({
    meja_id: 1,
    jenis_layanan: KATALOG_6_MEJA_PTSP[0].layananList[0].nama,
    kategori_pemohon: 'Prajurit TNI' as PTSPApplicationItem['kategori_pemohon'],
    nama_pemohon: '',
    nrp_nip_nik: '',
    pangkat_golongan: '',
    kesatuan_instansi: '',
    no_wa: '',
    email: '',
    nomor_perkara: '',
    uraian_permohonan: '',
    berkas_nama: '',
    berkas_url: '',
    berkas_size: ''
  });
  const [createdAppReceipt, setCreatedAppReceipt] = useState<PTSPApplicationItem | null>(null);

  // Tracking State (Tab 3)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackedApp, setSelectedTrackedApp] = useState<PTSPApplicationItem | null>(
    () => PTSPDB.getState().ptsp_applications[0] || null
  );
  const [initialValidatorHash, setInitialValidatorHash] = useState<string>('');

  // Queue Form State (Tab 4)
  const [queueForm, setQueueForm] = useState({
    meja_id: 1,
    nama_pemohon: '',
    kategori_pemohon: 'Prajurit TNI',
    kesatuan_instansi: '',
    no_wa: '',
    keperluan: ''
  });
  const [issuedQueueTicket, setIssuedQueueTicket] = useState<PTSPQueueTicketItem | null>(null);
  const [announcingQueueId, setAnnouncingQueueId] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as PtspTabId);
    }
  }, [initialTab]);

  useEffect(() => {
    if (activeTab && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('portal') === 'ptsp-online' || params.get('app') === 'ptsp') {
        const nextUrl = `/?portal=ptsp-online&tab=${activeTab}`;
        window.history.replaceState({ portal: 'ptsp-online', tab: activeTab }, '', nextUrl);
      } else {
        syncRouteToUrl('ptsp-inovasi', activeTab, true);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (initialServiceType) {
      setAppForm((prev) => ({ ...prev, jenis_layanan: initialServiceType }));
    }
  }, [initialServiceType]);

  // Subscribe to real-time updates + hybrid pull
  useEffect(() => {
    PTSPDB.pullFromHybridBackend();
    const unsub = PTSPDB.subscribe(() => {
      setDbState(PTSPDB.getState());
    });
    const timer = setInterval(() => {
      PTSPDB.pullFromHybridBackend();
    }, 60000);
    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  // Text-to-Speech (TTS) Indonesian Queue Voice Caller with Chime
  const handleAnnounceQueueVoice = (ticket: PTSPQueueTicketItem) => {
    setAnnouncingQueueId(ticket.id);
    PTSPDB.updateQueueStatus(
      ticket.id,
      'Dipanggil',
      currentUser?.nama || ticket.petugas_panggil || `Petugas Meja ${ticket.meja_id}`
    );

    const text = `Perhatian. Nomor antrean ${ticket.nomor_antrean.replace('-', ' ')}, atas nama ${ticket.nama_pemohon}, silakan menuju ke ${ticket.loket_tujuan}, ${ticket.meja_nama}. Terima kasih.`;

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.92;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }

    setTimeout(() => {
      setAnnouncingQueueId(null);
    }, 4500);
  };

  // Handle File Upload for Application Requirements
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKb = `${Math.max(1, Math.round(file.size / 1024))} KB`;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAppForm((prev) => ({
          ...prev,
          berkas_nama: file.name,
          berkas_url: reader.result as string,
          berkas_size: sizeKb
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Online Application
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appForm.nama_pemohon || !appForm.nrp_nip_nik || !appForm.no_wa || !appForm.uraian_permohonan) {
      return;
    }
    const mejaObj = KATALOG_6_MEJA_PTSP.find((m) => m.mejaId === appForm.meja_id) || KATALOG_6_MEJA_PTSP[0];
    const created = PTSPDB.createApplication({
      meja_id: mejaObj.mejaId,
      meja_nama: mejaObj.namaMeja,
      jenis_layanan: appForm.jenis_layanan,
      kategori_pemohon: appForm.kategori_pemohon,
      nama_pemohon: appForm.nama_pemohon,
      nrp_nip_nik: appForm.nrp_nip_nik,
      pangkat_golongan: appForm.pangkat_golongan || '-',
      kesatuan_instansi: appForm.kesatuan_instansi || 'Umum / TNI',
      no_wa: appForm.no_wa,
      email: appForm.email || '-',
      nomor_perkara: appForm.nomor_perkara || '-',
      uraian_permohonan: appForm.uraian_permohonan,
      berkas_nama: appForm.berkas_nama || 'Dokumen_Persyaratan_Pemohon.pdf',
      berkas_url: appForm.berkas_url || undefined,
      berkas_size: appForm.berkas_size || '250 KB'
    });

    setCreatedAppReceipt(created);
    setSelectedTrackedApp(created);
    setAppForm((prev) => ({
      ...prev,
      nama_pemohon: '',
      nrp_nip_nik: '',
      pangkat_golongan: '',
      kesatuan_instansi: '',
      no_wa: '',
      email: '',
      nomor_perkara: '',
      uraian_permohonan: '',
      berkas_nama: '',
      berkas_url: '',
      berkas_size: ''
    }));
  };

  // Submit Queue Ticket
  const handleTakeQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queueForm.nama_pemohon || !queueForm.keperluan) return;
    const ticket = PTSPDB.createQueueTicket(queueForm);
    setIssuedQueueTicket(ticket);
    setQueueForm((prev) => ({
      ...prev,
      nama_pemohon: '',
      kesatuan_instansi: '',
      no_wa: '',
      keperluan: ''
    }));
  };

  // Kiosk 1-Click Quick Queue
  const handleQuickKioskQueue = (mejaId: number) => {
    const meja = KATALOG_6_MEJA_PTSP.find((m) => m.mejaId === mejaId) || KATALOG_6_MEJA_PTSP[0];
    const ticket = PTSPDB.createQueueTicket({
      meja_id: meja.mejaId,
      nama_pemohon: 'Pengunjung Kios Mandiri PTSP',
      kategori_pemohon: 'Prajurit TNI / Masyarakat',
      kesatuan_instansi: 'Pengunjung Langsung Dilmilti V',
      no_wa: '-',
      keperluan: meja.subNama
    });
    setIssuedQueueTicket(ticket);
  };

  // Filter Applications for Real-Time Tracking
  const matchingTrackedApps = dbState.ptsp_applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      app.ticket_no.toLowerCase().includes(q) ||
      app.nama_pemohon.toLowerCase().includes(q) ||
      app.nrp_nip_nik.toLowerCase().includes(q) ||
      app.kesatuan_instansi.toLowerCase().includes(q)
    );
  });

  const activeMejaObj =
    KATALOG_6_MEJA_PTSP.find((m) => m.mejaId === selectedMejaId) || KATALOG_6_MEJA_PTSP[0];

  const getActiveTabLabel = () => {
    switch (activeTab) {
      case 'app-viewer':
        return 'Katalog 6 Meja & Prosedur';
      case 'permohonan':
        return 'Formulir Permohonan Online';
      case 'lacak':
        return 'Lacak Status & Unduh Balasan TTE';
      case 'validasi-tte':
        return 'Scanner Validasi Dokumen TTE';
      case 'antrean':
        return 'Pengambilan Antrean Loket';
      case 'monitor':
        return 'Layar Monitor Antrean TV';
      case 'konsultasi':
        return 'Konsultasi Virtual (Video & Chat)';
      case 'pengaturan':
      case 'login':
        return loggedOfficer ? `Panel Petugas (${loggedOfficer.nama_lengkap})` : 'Halaman Login Petugas / Admin PTSP';
      case 'offline':
        return 'Brankas Dokumen Offline & PWA';
      default:
        return 'Aplikasi PTSP Online Subdomain';
    }
  };

  return (
    <section id="ptsp-inovasi-section" className="space-y-4">
      {/* =====================================================================
          SUBDOMAIN APP HEADER & BROWSER ADDRESS SIMULATOR (ptsp.dilmilti5-makassar.go.id)
         ===================================================================== */}
      <div className="bg-gradient-to-r from-slate-950 via-[#072414] to-slate-900 text-white rounded-2xl p-3 sm:p-4 border-2 border-emerald-500/60 shadow-xl space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigateToSection && onNavigateToSection('publik', 'jenis-layanan')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/15"
              title="Kembali ke Keterangan PTSP di Portal Utama"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Kembali ke Website Utama</span>
            </button>

            {/* Subdomain URL indicator */}
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-mono text-emerald-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-bold text-amber-300">https://ptsp.dilmilti5-makassar.go.id</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">/{activeTab}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SUBDOMAIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            {loggedOfficer ? (
              <div className="flex items-center gap-2 bg-emerald-950/80 px-2.5 py-1.5 rounded-xl border border-emerald-500/40">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-200">
                  {loggedOfficer.nama_lengkap.split(' ')[0]} ({loggedOfficer.meja_assigned === 0 ? 'Admin' : `Meja ${loggedOfficer.meja_assigned}`})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLoggedOfficer(null);
                    if (typeof window !== 'undefined') localStorage.removeItem('ptsp_logged_officer_session');
                    setActiveTab('login');
                  }}
                  className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer ml-1"
                  title="Logout Petugas PTSP"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login Petugas / Admin PTSP</span>
              </button>
            )}

            <PWAInstallButton />
            <a
              href="/db_ptsp_dilmilti5.sql"
              download="db_ptsp_dilmilti5.sql"
              className="px-2.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-amber-300 border border-amber-400/40 font-mono text-[10px] font-bold hidden sm:flex items-center gap-1 cursor-pointer"
              title="Unduh File Skema MySQL db_ptsp_dilmilti5.sql"
            >
              <Database className="w-3 h-3 text-amber-400" />
              <span>db_ptsp_dilmilti5.sql</span>
            </a>
          </div>
        </div>
      </div>

      {/* 9 MAIN SUBDOMAIN NAVIGATION TABS */}
      <div className="bg-[#071F13] text-white rounded-xl p-1.5 shadow-md border border-emerald-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        {[
          { id: 'app-viewer', label: '1. Katalog Cepat & Alur', icon: Building2 },
          { id: 'permohonan', label: '2. Permohonan Online', icon: FileText },
          { id: 'lacak', label: '3. Lacak Status & TTE', icon: Search },
          { id: 'validasi-tte', label: '4. Validasi QR TTE', icon: QrCode },
          { id: 'antrean', label: '5. Antrean Digital', icon: Ticket },
          { id: 'monitor', label: '6. Monitor Display TV', icon: Tv },
          { id: 'konsultasi', label: '7. Konsultasi Virtual', icon: Video },
          {
            id: 'pengaturan',
            label: loggedOfficer
              ? `8. Panel Petugas (${loggedOfficer.nama_lengkap.split(' ')[0]})`
              : '8. Login Petugas / Admin PTSP',
            icon: loggedOfficer ? UserCheck : Lock
          },
          { id: 'offline', label: '9. Brankas Offline & PWA', icon: Smartphone }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'pengaturan' && activeTab === 'login');
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as PtspTabId)}
              className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md border border-amber-300'
                  : tab.id === 'pengaturan' && !loggedOfficer
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/50'
                  : 'bg-white/5 text-emerald-100 hover:bg-white/15 hover:text-amber-300 border border-white/10'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span className="text-[11px] whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1: BERANDA & KATALOG 6 MEJA LAYANAN PTSP
         ===================================================================== */}
      {activeTab === 'app-viewer' && (
        <div className="space-y-6">
          {/* Profil Resmi, Maklumat Pelayanan, Standar Biaya & Jam Operasional */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D4A2B]">
                    PROFIL RESMI & MAKLUMAT PELAYANAN PTSP
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {courtIdentity.name}
                  </h3>
                </div>
                <Award className="w-8 h-8 text-amber-500 shrink-0" />
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-[#072617] to-[#0D4A2B] text-white border border-amber-400/50 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                  MAKLUMAT PELAYANAN PENGADILAN MILITER TINGGI V MAKASSAR
                </div>
                <p className="text-xs sm:text-sm font-serif italic leading-relaxed text-emerald-50">
                  &ldquo;Dengan ini kami Pimpinan dan Seluruh Aparatur Pengadilan Militer Tinggi V Makassar menyatakan sanggup menyelenggarakan pelayanan sesuai Standar Pelayanan yang telah ditetapkan, dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku serta memberikan kompensasi pelayanan kepada pengguna layanan.&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block">Alamat Kantor & Wilayah Hukum:</strong>
                  <span className="text-slate-600 text-[11px] block mt-0.5">{courtIdentity.address}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <strong className="text-emerald-950 block">Standar Biaya Layanan PTSP:</strong>
                  <span className="text-emerald-800 text-[11px] font-semibold block mt-0.5">
                    Rp 0,- (Gratis) untuk seluruh layanan perkara pidana militer, SKTPD kedinasan TNI, informasi PPID, dan konsultasi Posbakum.
                  </span>
                </div>
              </div>
            </div>

            {/* Ringkasan Statistik Real-Time PTSP */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#072617] to-slate-950 text-white rounded-2xl border-2 border-amber-400/60 p-6 shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase">
                  MONITORING REAL-TIME DATABASE PTSP
                </span>
                <h4 className="text-base font-black text-white mt-0.5">
                  Status Operasional 6 Meja PTSP Hari Ini
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {dbState.ptsp_applications.length}
                  </div>
                  <div className="text-[11px] text-slate-200 font-semibold">Permohonan Layanan</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {dbState.reply_documents.length}
                  </div>
                  <div className="text-[11px] text-slate-200 font-semibold">Dokumen Balasan TTE</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-2xl font-black text-sky-400 font-mono">
                    {dbState.queue_tickets.length}
                  </div>
                  <div className="text-[11px] text-slate-200 font-semibold">Antrean Loket Aktif</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-2xl font-black text-amber-300 font-mono">
                    {dbState.online_consultations.length}
                  </div>
                  <div className="text-[11px] text-slate-200 font-semibold">Ruang Video Call V-PTSP</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('permohonan')}
                  className="flex-1 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ajukan Permohonan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('konsultasi')}
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Buka Video Call PTSP</span>
                </button>
              </div>
            </div>
          </div>

          {/* ALUR & PROSEDUR STANDAR 4 TAHAP PTSP */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D4A2B]">
                  PROSEDUR &amp; ALUR PELAYANAN SATU PINTU (STANDAR MA-RI)
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                  Tahapan Standar Pelayanan pada Loket PTSP Pengadilan Militer Tinggi V Makassar
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-[10px] self-start sm:self-auto">
                Sederhana • Cepat • Biaya Bebas (Rp 0,-)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  step: 'TAHAP 01',
                  title: 'Kedatangan & Pengambilan Antrean Loket',
                  desc: 'Pengguna layanan melapor ke petugas jaga/meja informasi Ruang PTSP Lantai 1 atau ambil antrean digital (Loket A s.d. Loket F). Tersedia jalur khusus prioritas bagi penyandang disabilitas, lansia, dan ibu hamil.',
                  waktu: '± 2 - 5 Menit'
                },
                {
                  step: 'TAHAP 02',
                  title: 'Penyerahan & Verifikasi Kelengkapan Berkas',
                  desc: 'Petugas Meja PTSP memanggil nomor antrean dan memeriksa kelengkapan persyaratan administrasi. Jika lengkap, petugas menerbitkan Tanda Terima Berkas resmi ber-QR Code.',
                  waktu: '± 5 - 15 Menit'
                },
                {
                  step: 'TAHAP 03',
                  title: 'Pencatatan Register & Pengesahan Dokumen',
                  desc: 'Petugas Back-Office memproses permohonan, mencatat ke dalam Buku Register Induk perkara/layanan, dan mengajukan tanda tangan atau pengesahan TTE BSrE-BSSN pejabat berwenang.',
                  waktu: 'Sesuai SLA Layanan'
                },
                {
                  step: 'TAHAP 04',
                  title: 'Penyerahan Produk Layanan & Survei Kepuasan',
                  desc: 'Produk layanan (Salinan Putusan, Akta Kasasi/Banding, SKTPD, Surat Keterangan) diserahkan di Loket PTSP tanpa biaya pungutan (Rp 0,-) disertai pengisian Survei IKM & IPAK.',
                  waktu: '± 5 Menit'
                }
              ].map((alur) => (
                <div
                  key={alur.step}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-700/50 transition-all flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-[#0D4A2B] text-amber-300 font-mono font-black text-[9px]">
                        {alur.step}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {alur.waktu}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-xs leading-snug">
                      {alur.title}
                    </h4>
                    <p className="text-[10px] text-slate-600 leading-relaxed">{alur.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-1 text-[9px] font-bold text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>SOP PTSP Dilmilti V Makassar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KATALOG INTERAKTIF 6 MEJA LAYANAN PTSP */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D4A2B]">
                  KATALOG INTERAKTIF & SOP 6 MEJA LAYANAN PTSP
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Pilih Meja Layanan PTSP Pengadilan Militer Tinggi V Makassar
                </h3>
                <p className="text-xs text-slate-500">
                  Seluruh format akta, buku register induk (Bundel A/B), dan SOP layanan di bawah ini telah disesuaikan dengan <strong>Buku II Mahkamah Agung RI Edisi Terbaru</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => printBukuIISopPtspDocument()}
                className="px-4 py-2.5 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen SOP 6 Meja (Buku II MA-RI)</span>
              </button>
            </div>

            {/* 6 Meja Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {KATALOG_6_MEJA_PTSP.map((meja) => {
                const isSelected = meja.mejaId === selectedMejaId;
                return (
                  <div
                    key={meja.mejaId}
                    onClick={() => setSelectedMejaId(meja.mejaId)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#072617] to-[#0D4A2B] text-white border-amber-400 shadow-lg'
                        : 'bg-slate-50 hover:bg-emerald-50/50 text-slate-800 border-slate-200 hover:border-emerald-500'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-0.5 rounded font-mono font-black text-[11px] ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-emerald-900 text-amber-300'
                          }`}
                        >
                          LOKET {meja.kodeAntrean} • MEJA {meja.mejaId}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            isSelected ? 'text-emerald-200' : 'text-emerald-700'
                          }`}
                        >
                          {meja.layananList.length} Layanan Utama
                        </span>
                      </div>
                      <h4 className="font-black text-sm leading-snug">{meja.namaMeja}</h4>
                      <p
                        className={`text-[11px] leading-relaxed ${
                          isSelected ? 'text-amber-200 font-medium' : 'text-slate-600'
                        }`}
                      >
                        {meja.subNama}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
                      <span className={isSelected ? 'text-emerald-200' : 'text-slate-500'}>
                        Petugas: <strong>{meja.petugasJaga}</strong>
                      </span>
                      <span className="font-bold underline">Lihat Layanan &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Meja Details & Service Items */}
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-emerald-900/20 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#0D4A2B] text-amber-300 font-mono font-black text-xs">
                      KODE ANTREAN LOKET {activeMejaObj.kodeAntrean}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-[11px]">
                      {getBukuIIRegisterMetadata(activeMejaObj.mejaId, activeMejaObj.subNama).kodeFormulir}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      Standar Biaya: {activeMejaObj.standarBiaya}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    {activeMejaObj.namaMeja}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">{activeMejaObj.deskripsi}</p>
                  <div className="text-[11px] text-emerald-900 font-semibold mt-1">
                    <strong>Buku Register Induk (Buku II MA-RI):</strong>{' '}
                    {getBukuIIRegisterMetadata(activeMejaObj.mejaId, activeMejaObj.subNama).bukuRegister}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => printBukuIISopPtspDocument(activeMejaObj.mejaId)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-emerald-950 border border-emerald-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-4 h-4 text-emerald-700" />
                    <span>SOP Buku II Meja {activeMejaObj.mejaId}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQueueForm((prev) => ({
                        ...prev,
                        meja_id: activeMejaObj.mejaId,
                        keperluan: activeMejaObj.subNama
                      }));
                      setActiveTab('antrean');
                    }}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Ambil Antrean Meja {activeMejaObj.mejaId}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('konsultasi')}
                    className="px-3.5 py-2 bg-[#0D4A2B] hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Video className="w-4 h-4 text-amber-300" />
                    <span>Konsultasi Video Call</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeMejaObj.layananList.map((lay) => (
                  <div
                    key={lay.id}
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          SLA: {lay.sla} • Biaya: {lay.biaya}
                        </span>
                      </div>
                      <h5 className="font-black text-slate-900 text-xs sm:text-sm">{lay.nama}</h5>
                      <div className="text-[11px] text-slate-600">
                        <strong className="text-slate-800 block mb-1">Persyaratan Berkas:</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {lay.syarat.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-[11px] text-emerald-900 bg-emerald-50/70 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                        <strong>Output Dokumen:</strong> {lay.outputDokumen}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setAppForm((prev) => ({
                            ...prev,
                            meja_id: activeMejaObj.mejaId,
                            jenis_layanan: lay.nama
                          }));
                          setActiveTab('permohonan');
                        }}
                        className="px-4 py-2 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-black rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Ajukan Layanan Ini Secara Online</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BRANKAS DOKUMEN RESMI OFFLINE & SERVICE WORKER BACKGROUND SYNC */}
          <PtspOfflineSyncPanel />
        </div>
      )}

      {/* =====================================================================
          TAB 2: FORMULIR PENGAJUAN LAYANAN ONLINE & UNGGAH BERKAS
         ===================================================================== */}
      {activeTab === 'permohonan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D4A2B]">
                MODUL 2 : PENGAJUAN LAYANAN PTSP DARING & UNGGAH PERSYARATAN
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                Formulir Permohonan Layanan 6 Meja PTSP Online
              </h3>
              <p className="text-xs text-slate-500">
                Terbuka bagi Prajurit TNI, Oditur Militer, Penasihat Hukum / Advokat, maupun Masyarakat Umum. Menghasilkan Nomor Tiket & Bukti Tanda Terima Elektronik ber-QR Code.
              </p>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    1. Pilih Meja PTSP Tujuan (1 - 6): *
                  </label>
                  <select
                    value={appForm.meja_id}
                    onChange={(e) => {
                      const mId = Number(e.target.value);
                      const mObj = KATALOG_6_MEJA_PTSP.find((m) => m.mejaId === mId) || KATALOG_6_MEJA_PTSP[0];
                      setAppForm({
                        ...appForm,
                        meja_id: mId,
                        jenis_layanan: mObj.layananList[0].nama
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    {KATALOG_6_MEJA_PTSP.map((m) => (
                      <option key={m.mejaId} value={m.mejaId}>
                        {m.namaMeja}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    2. Pilih Jenis Layanan Spesifik: *
                  </label>
                  <select
                    value={appForm.jenis_layanan}
                    onChange={(e) => setAppForm({ ...appForm, jenis_layanan: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                  >
                    {(
                      KATALOG_6_MEJA_PTSP.find((m) => m.mejaId === appForm.meja_id) ||
                      KATALOG_6_MEJA_PTSP[0]
                    ).layananList.map((lay) => (
                      <option key={lay.id} value={lay.nama}>
                        {lay.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Kategori Pemohon: *</label>
                  <select
                    value={appForm.kategori_pemohon}
                    onChange={(e) =>
                      setAppForm({ ...appForm, kategori_pemohon: e.target.value as any })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Prajurit TNI">Prajurit TNI</option>
                    <option value="Oditur Militer">Oditur Militer</option>
                    <option value="Penasihat Hukum">Penasihat Hukum / Advokat</option>
                    <option value="Masyarakat Umum">Masyarakat Umum / Keluarga</option>
                    <option value="Instansi / Satker">Instansi / Satuan Kerja</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Nama Lengkap Pemohon: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kapten Inf Andi Baso, S.H."
                    value={appForm.nama_pemohon}
                    onChange={(e) => setAppForm({ ...appForm, nama_pemohon: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">NRP / NIP / NIK KTP: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nomor Identitas Resmi"
                    value={appForm.nrp_nip_nik}
                    onChange={(e) => setAppForm({ ...appForm, nrp_nip_nik: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Pangkat / Golongan / Profesi:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Mayor Chk / Penata III-c / Advokat"
                    value={appForm.pangkat_golongan}
                    onChange={(e) => setAppForm({ ...appForm, pangkat_golongan: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Kesatuan / Instansi / Alamat: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kodam XIV/Hasanuddin / Otmilti IV"
                    value={appForm.kesatuan_instansi}
                    onChange={(e) => setAppForm({ ...appForm, kesatuan_instansi: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Nomor WhatsApp Aktif: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081241008899"
                    value={appForm.no_wa}
                    onChange={(e) => setAppForm({ ...appForm, no_wa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Alamat Email Pemohon:</label>
                  <input
                    type="email"
                    placeholder="nama@tni.mil.id / email@gmail.com"
                    value={appForm.email}
                    onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Nomor Perkara Terkait (Jika Ada):
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 24-K/PMT.V/BDG/AD/VIII/2026"
                    value={appForm.nomor_perkara}
                    onChange={(e) => setAppForm({ ...appForm, nomor_perkara: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Uraian Lengkap Permohonan Layanan / Keperluan: *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan rincian permohonan layanan, tujuan penggunaan surat keterangan, atau dokumen yang dimohonkan..."
                  value={appForm.uraian_permohonan}
                  onChange={(e) => setAppForm({ ...appForm, uraian_permohonan: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Unggah Berkas Persyaratan (PDF / Gambar) */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border-2 border-dashed border-emerald-500/60 space-y-2">
                <label className="block font-black text-emerald-950">
                  Lampiran Berkas Persyaratan (PDF / Gambar JPG, PNG):
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-bold file:bg-[#0D4A2B] file:text-amber-300 hover:file:bg-emerald-800 cursor-pointer"
                />
                {appForm.berkas_nama && (
                  <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Berkas Siap Diunggah: {appForm.berkas_nama} ({appForm.berkas_size})
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-black rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Permohonan & Terbitkan Nomor Tiket Registrasi QR Code</span>
              </button>
            </form>
          </div>

          {/* Right Panel: Electronic Receipt & QR Code */}
          <div className="lg:col-span-4 space-y-4">
            {createdAppReceipt ? (
              <div className="bg-gradient-to-br from-slate-900 via-[#072617] to-slate-950 text-white rounded-2xl border-2 border-amber-400 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-amber-400/30 pb-3">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-amber-400" />
                    <span className="font-black text-amber-300 uppercase">
                      TANDA TERIMA ELEKTRONIK
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">
                    TERDAFTAR
                  </span>
                </div>

                <div className="text-center p-4 rounded-xl bg-black/40 border border-amber-400/30 space-y-2">
                  <span className="text-[10px] text-slate-300 uppercase block">
                    NOMOR TIKET REGISTRASI UNIK
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                    {createdAppReceipt.ticket_no}
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                      createdAppReceipt.ticket_no
                    )}`}
                    alt="QR Code Tiket"
                    className="w-28 h-28 mx-auto rounded-lg border-2 border-amber-400 bg-white p-1.5"
                  />
                  <span className="text-[11px] text-emerald-300 block font-semibold">
                    {createdAppReceipt.meja_nama}
                  </span>
                </div>

                <div className="space-y-1 text-slate-200 text-xs">
                  <div>
                    <strong>Pemohon:</strong> {createdAppReceipt.nama_pemohon} ({createdAppReceipt.kategori_pemohon})
                  </div>
                  <div>
                    <strong>NRP/NIK:</strong> {createdAppReceipt.nrp_nip_nik}
                  </div>
                  <div>
                    <strong>Layanan:</strong> {createdAppReceipt.jenis_layanan}
                  </div>
                  <div>
                    <strong>Waktu:</strong> {createdAppReceipt.created_at}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => printApplicationReceipt(createdAppReceipt)}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak / Unduh Bukti Tanda Terima (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrackedApp(createdAppReceipt);
                      setActiveTab('lacak');
                    }}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Lacak Status Tiket Ini</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3 shadow-xs">
                <QrCode className="w-12 h-12 text-[#0D4A2B] mx-auto" />
                <h4 className="font-black text-slate-900 text-sm">
                  Bukti Tanda Terima Elektronik (QR Code)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Setelah Anda mengisi dan mengirim formulir permohonan di samping, sistem otomatis menerbitkan Nomor Tiket unik beserta QR Code Tanda Terima Resmi yang dapat dicetak atau diunduh.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: LACAK STATUS PERMOHONAN & UNDUH DOKUMEN BALASAN RESMI (TTE)
         ===================================================================== */}
      {activeTab === 'lacak' && (
        <div className="space-y-6 text-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D4A2B]">
                  MODUL 3 : PELACAKAN TRANSPARAN & UNDUH DOKUMEN BALASAN RESMI (TTE BSrE)
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  Lacak Status Permohonan & Unduh Dokumen Jawaban Resmi Pengadilan
                </h3>
                <p className="text-xs text-slate-500">
                  Pencarian real-time menggunakan <strong>Nomor Tiket</strong>, <strong>Nama Pemohon</strong>, atau <strong>NRP / NIP / NIK</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik Nomor Tiket, Nama, atau NRP/NIP..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('validasi-tte')}
                  className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scanner Validasi QR TTE</span>
                </button>
              </div>
            </div>

            {/* List of Matching Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
                {matchingTrackedApps.map((app) => {
                  const isSelected = selectedTrackedApp?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedTrackedApp(app)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-emerald-50 border-2 border-[#0D4A2B] shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-[#0D4A2B] bg-white px-2 py-0.5 rounded border border-emerald-300">
                          {app.ticket_no}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase ${
                            app.status === 'Selesai'
                              ? 'bg-emerald-600 text-white'
                              : app.status === 'Ditolak'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-400 text-slate-950'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900">{app.nama_pemohon}</div>
                      <div className="text-[11px] text-slate-600">
                        NRP/NIK: <span className="font-mono">{app.nrp_nip_nik}</span> • {app.kesatuan_instansi}
                      </div>
                      <div className="text-[11px] text-emerald-800 font-semibold truncate">
                        {app.meja_nama} — {app.jenis_layanan}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Detailed Verification Stages & Official TTE Reply Download */}
              <div className="lg:col-span-7">
                {selectedTrackedApp ? (
                  (() => {
                    const replyDoc = dbState.reply_documents.find(
                      (r) => r.ticket_no === selectedTrackedApp.ticket_no
                    );
                    return (
                      <div className="p-6 rounded-2xl bg-slate-50 border-2 border-emerald-900/20 space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                              DETAIL PELACAKAN BERKAS PERMOHONAN
                            </span>
                            <div className="text-lg font-black text-[#0D4A2B] font-mono">
                              {selectedTrackedApp.ticket_no}
                            </div>
                            <div className="font-bold text-slate-900 text-sm">
                              {selectedTrackedApp.jenis_layanan}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => printApplicationReceipt(selectedTrackedApp)}
                            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Cetak Bukti Registrasi</span>
                          </button>
                        </div>

                        {/* 4 Transparent Verification Steps */}
                        <div>
                          <strong className="block text-slate-800 uppercase mb-2.5">
                            Tahapan Verifikasi Berkas Transparan:
                          </strong>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {[
                              { step: 1, label: '1. Permohonan Diterima' },
                              { step: 2, label: '2. Verifikasi Meja PTSP' },
                              { step: 3, label: '3. Proses Kepaniteraan/Pejabat' },
                              { step: 4, label: '4. Selesai & TTE Terbit' }
                            ].map((st) => {
                              const passed = selectedTrackedApp.tahap_verifikasi >= st.step;
                              return (
                                <div
                                  key={st.step}
                                  className={`p-3 rounded-xl border text-center ${
                                    passed
                                      ? 'bg-[#0D4A2B] text-white border-emerald-700 font-bold shadow-xs'
                                      : 'bg-white text-slate-400 border-slate-200'
                                  }`}
                                >
                                  <CheckCircle2
                                    className={`w-4 h-4 mx-auto mb-1 ${
                                      passed ? 'text-amber-400' : 'text-slate-300'
                                    }`}
                                  />
                                  <span className="text-[11px] block">{st.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Applicant Info Box */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-slate-500 block">Nama Pemohon & Kategori:</span>
                            <strong className="text-slate-900">
                              {selectedTrackedApp.nama_pemohon} ({selectedTrackedApp.kategori_pemohon})
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block">NRP / NIP / NIK:</span>
                            <strong className="text-slate-900 font-mono">
                              {selectedTrackedApp.nrp_nip_nik}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Kesatuan / Instansi:</span>
                            <strong className="text-slate-900">
                              {selectedTrackedApp.kesatuan_instansi}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Meja PTSP Melayani:</span>
                            <strong className="text-emerald-800">{selectedTrackedApp.meja_nama}</strong>
                          </div>
                        </div>

                        {selectedTrackedApp.catatan_petugas && (
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-1">
                            <strong className="block">
                              Catatan Verifikasi Petugas ({selectedTrackedApp.petugas_verifikator || 'Petugas PTSP'}):
                            </strong>
                            <p>{selectedTrackedApp.catatan_petugas}</p>
                          </div>
                        )}

                        {/* Official Reply Document with Electronic Signature (TTE / QR Code Validation) */}
                        {selectedTrackedApp.status === 'Selesai' && (
                          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#052917] via-[#0A3D24] to-slate-900 text-white border-2 border-amber-400 shadow-lg space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                                    DOKUMEN BALASAN RESMI TERSEDIA (TTE BSrE-BSSN)
                                  </span>
                                </div>
                                <h4 className="font-black text-sm sm:text-base text-amber-300">
                                  {replyDoc?.judul_dokumen ||
                                    `Surat Jawaban / Hasil Layanan ${selectedTrackedApp.jenis_layanan}`}
                                </h4>
                                <div className="text-[11px] text-emerald-200 font-mono">
                                  Nomor Surat: {replyDoc?.nomor_surat_balasan || 'W5-Mil/150/PTSP/IX/2026'} • Penandatangan TTE:{' '}
                                  {replyDoc?.tte_signer_nama || 'Letkol Chk S. Haryanto, S.H., M.H.'}
                                </div>
                              </div>

                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
                                  replyDoc?.tte_qr_hash || `TTE-${selectedTrackedApp.ticket_no}`
                                )}`}
                                alt="QR Validasi TTE"
                                className="w-20 h-20 rounded-lg bg-white p-1.5 border-2 border-amber-400 shrink-0"
                              />
                            </div>

                            <div className="flex flex-wrap gap-2.5 pt-2 border-t border-emerald-700/60">
                              <button
                                type="button"
                                onClick={() => printOfficialReplyDocument(selectedTrackedApp, replyDoc)}
                                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                              >
                                <Download className="w-4 h-4" />
                                <span>Unduh / Cetak Dokumen Balasan Resmi Ber-TTE (PDF)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setInitialValidatorHash(
                                    replyDoc?.tte_qr_hash ||
                                      selectedTrackedApp.tte_signature_hash ||
                                      selectedTrackedApp.ticket_no
                                  );
                                  setActiveTab('validasi-tte');
                                }}
                                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl flex items-center gap-2 cursor-pointer shadow-md border border-emerald-400/50"
                              >
                                <QrCode className="w-4 h-4 text-amber-300" />
                                <span>Verifikasi Keaslian TTE dengan Scanner QR Code</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : null}
              </div>
            </div>
          </div>

          {/* BRANKAS DOKUMEN RESMI OFFLINE & SERVICE WORKER BACKGROUND SYNC */}
          <PtspOfflineSyncPanel />
        </div>
      )}

      {/* =====================================================================
          TAB 3B: SCANNER VALIDASI TANDA TANGAN ELEKTRONIK (TTE BSrE & QR CODE)
         ===================================================================== */}
      {activeTab === 'validasi-tte' && (
        <PtspTteValidatorTab initialHashOrTicket={initialValidatorHash} />
      )}

      {/* =====================================================================
          TAB 4: AMBIL ANTREAN DIGITAL 6 MEJA & KIOS MANDIRI
         ===================================================================== */}
      {activeTab === 'antrean' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D4A2B]">
                  MODUL 4A : PENGAMBILAN ANTREAN DARING & KIOS MANDIRI (6 MEJA)
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  Ambil Nomor Antrean Loket 6 Meja PTSP
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('monitor')}
                className="px-3 py-2 bg-slate-900 text-amber-300 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Buka Layar Monitor TTS</span>
              </button>
            </div>

            {/* Mode Kios Mandiri 1-Klik */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <strong className="text-slate-800 block">
                Mode Kios Mandiri (Touch-Screen 1-Klik Langsung Cetak Tiket):
              </strong>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {KATALOG_6_MEJA_PTSP.map((m) => (
                  <button
                    key={m.mejaId}
                    type="button"
                    onClick={() => handleQuickKioskQueue(m.mejaId)}
                    className="p-3 rounded-xl bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-600 text-left transition-all cursor-pointer"
                  >
                    <span className="font-mono font-black text-xs text-[#0D4A2B] block">
                      LOKET {m.kodeAntrean} (MEJA {m.mejaId})
                    </span>
                    <span className="font-bold text-slate-900 text-[11px] line-clamp-1">
                      {m.namaMeja.replace(`Meja ${m.mejaId}: `, '')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulir Antrean Daring */}
            <form onSubmit={handleTakeQueue} className="space-y-3.5 pt-2">
              <strong className="text-slate-800 block">
                Atau Isi Formulir Antrean Daring (Dengan Notifikasi WhatsApp):
              </strong>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Meja Loket PTSP:</label>
                <select
                  value={queueForm.meja_id}
                  onChange={(e) => setQueueForm({ ...queueForm, meja_id: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {KATALOG_6_MEJA_PTSP.map((m) => (
                    <option key={m.mejaId} value={m.mejaId}>
                      Loket {m.kodeAntrean} — {m.namaMeja}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Pemohon *"
                  value={queueForm.nama_pemohon}
                  onChange={(e) => setQueueForm({ ...queueForm, nama_pemohon: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Kesatuan / Instansi"
                  value={queueForm.kesatuan_instansi}
                  onChange={(e) => setQueueForm({ ...queueForm, kesatuan_instansi: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nomor WhatsApp"
                  value={queueForm.no_wa}
                  onChange={(e) => setQueueForm({ ...queueForm, no_wa: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
                <input
                  type="text"
                  required
                  placeholder="Keperluan Layanan *"
                  value={queueForm.keperluan}
                  onChange={(e) => setQueueForm({ ...queueForm, keperluan: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Ticket className="w-4 h-4" />
                <span>Ambil & Cetak Nomor Antrean Digital</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {issuedQueueTicket ? (
              <div className="bg-gradient-to-br from-slate-900 via-[#072617] to-slate-950 text-white rounded-2xl border-2 border-amber-400 p-6 shadow-xl space-y-4 text-center">
                <span className="px-3 py-1 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                  STRUK ANTREAN DIGITAL RESMI
                </span>
                <div className="text-xs font-bold text-emerald-300">{issuedQueueTicket.meja_nama}</div>
                <div className="text-5xl font-black text-amber-400 font-mono tracking-wider">
                  {issuedQueueTicket.nomor_antrean}
                </div>
                <div className="text-xs text-slate-300">
                  Pemohon: <strong>{issuedQueueTicket.nama_pemohon}</strong> • Ambil: {issuedQueueTicket.waktu_ambil}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => printQueueTicketSlip(issuedQueueTicket)}
                    className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Struk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnnounceQueueVoice(issuedQueueTicket)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Uji Panggil TTS</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="font-black text-slate-900 uppercase">
                Antrean Hari Ini ({dbState.queue_tickets.length} Tiket)
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {dbState.queue_tickets.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-black text-[#0D4A2B] bg-amber-200 px-2 py-0.5 rounded mr-2">
                        {q.nomor_antrean}
                      </span>
                      <strong className="text-slate-900">{q.nama_pemohon}</strong>
                      <div className="text-[11px] text-slate-500 mt-0.5">{q.meja_nama}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAnnounceQueueVoice(q)}
                      className="px-2.5 py-1.5 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Panggil</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: LAYAR MONITOR ANTREAN REAL-TIME & PEMANGGIL SUARA OTOMATIS (TTS)
         ===================================================================== */}
      {activeTab === 'monitor' && (
        <div className="bg-slate-950 text-white rounded-2xl border-2 border-amber-400 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-black tracking-widest text-amber-400 uppercase">
                  MODUL 4B : DISPLAY MONITOR ANTREAN 6 MEJA & PEMANGGIL SUARA OTOMATIS (TTS)
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                Layar Monitor Panggilan Antrean PTSP Pengadilan Militer Tinggi V Makassar
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Active Called Ticket Big Screen */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#042415] via-[#093822] to-slate-900 p-8 rounded-2xl border-2 border-amber-400 text-center space-y-4 shadow-xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                NOMOR ANTREAN YANG SEDANG DIPANGGIL
              </span>
              {(() => {
                const activeCall =
                  dbState.queue_tickets.find((q) => q.status === 'Dipanggil') ||
                  dbState.queue_tickets[0];
                if (!activeCall) return <div className="text-3xl font-mono text-slate-500">STANDBY</div>;
                return (
                  <div className="space-y-3">
                    <div className="text-6xl sm:text-7xl font-black text-amber-400 font-mono tracking-widest">
                      {activeCall.nomor_antrean}
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white uppercase">
                      {activeCall.loket_tujuan} — {activeCall.meja_nama}
                    </div>
                    <div className="text-sm text-emerald-300 font-bold">
                      Pemohon: {activeCall.nama_pemohon} ({activeCall.kesatuan_instansi})
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleAnnounceQueueVoice(activeCall)}
                        className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-lg"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Panggil Suara Otomatis Bahasa Indonesia (TTS)</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Queue Calling List for All 6 Desks */}
            <div className="lg:col-span-5 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-black text-amber-400 uppercase">
                Daftar Antrean 6 Meja Loket (Klik Panggil untuk Suara TTS)
              </h4>
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {dbState.queue_tickets.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-400 text-sm">
                          {q.nomor_antrean}
                        </span>
                        <span className="font-bold text-white">{q.meja_nama}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {q.nama_pemohon} • {q.status}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAnnounceQueueVoice(q)}
                      disabled={announcingQueueId === q.id}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{announcingQueueId === q.id ? 'Memanggil...' : 'Panggil TTS'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: PORTAL KONSULTASI TATAP MUKA ONLINE (VIDEO CALL & CHAT REAL-TIME)
         ===================================================================== */}
      {activeTab === 'konsultasi' && (
        <PtspVideoCallTab
          initialRoomCode={targetVideoRoom}
          defaultRole={videoRole}
          currentOfficerName={videoOfficerName || currentUser?.nama}
        />
      )}

      {/* =====================================================================
          TAB 8: HALAMAN LOGIN PETUGAS/ADMIN ATAU DASHBOARD PETUGAS MEJA PTSP
         ===================================================================== */}
      {(activeTab === 'pengaturan' || activeTab === 'login') && (
        loggedOfficer ? (
          <PtspAdminDashboardTab
            currentOfficer={loggedOfficer}
            onLogout={() => {
              setLoggedOfficer(null);
              if (typeof window !== 'undefined') {
                localStorage.removeItem('ptsp_logged_officer_session');
              }
              setActiveTab('login');
            }}
            onOpenVideoRoom={(roomCode, officerName) => {
              setTargetVideoRoom(roomCode);
              setVideoRole('petugas');
              setVideoOfficerName(officerName);
              setActiveTab('konsultasi');
            }}
            onAnnounceQueueVoice={(ticket) => {
              handleAnnounceQueueVoice(ticket);
            }}
          />
        ) : (
          <PtspAdminLoginPage
            currentOfficer={loggedOfficer}
            onLogout={() => {
              setLoggedOfficer(null);
              if (typeof window !== 'undefined') {
                localStorage.removeItem('ptsp_logged_officer_session');
              }
            }}
            onLoginSuccess={(officer) => {
              setLoggedOfficer(officer);
              if (typeof window !== 'undefined') {
                localStorage.setItem('ptsp_logged_officer_session', JSON.stringify(officer));
              }
              setActiveTab('pengaturan');
            }}
          />
        )
      )}

      {/* =====================================================================
          TAB 9: BRANKAS DOKUMEN RESMI OFFLINE & SERVICE WORKER BACKGROUND SYNC
         ===================================================================== */}
      {activeTab === 'offline' && (
        <div className="space-y-4">
          <PtspOfflineSyncPanel />
        </div>
      )}
    </section>
  );
}
