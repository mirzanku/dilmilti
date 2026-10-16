import React, { useState, useEffect } from 'react';
import {
  DoorOpen,
  CalendarCheck,
  MessageSquareCode,
  Laptop,
  FileText,
  ShieldCheck,
  Sparkles,
  Globe,
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  Swords,
  Settings,
  Send,
  Printer
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { InovasiQuickAccessItem, NavSection, UserAccount } from '../types';
import { isStaffUser } from '../utils/rbac';

interface InovasiQuickAccessSectionProps {
  currentUser?: UserAccount | null;
  onNavigate?: (section: NavSection, subTab?: string) => void;
  onOpenAuth?: () => void;
}

const ICON_MAP: Record<InovasiQuickAccessItem['iconName'], any> = {
  DoorOpen,
  CalendarCheck,
  MessageSquareCode,
  Laptop,
  FileText,
  ShieldCheck,
  Sparkles,
  Globe
};

export default function InovasiQuickAccessSection({
  currentUser,
  onNavigate,
  onOpenAuth
}: InovasiQuickAccessSectionProps) {
  const [items, setItems] = useState<InovasiQuickAccessItem[]>(() =>
    CourtDB.getInovasiQuickAccess()
  );
  const isAdmin = isStaffUser(currentUser);

  // CRUD Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isTableManagerOpen, setIsTableManagerOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<InovasiQuickAccessItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive Cuti Online Modal State
  const [isCutiModalOpen, setIsCutiModalOpen] = useState(false);
  const [cutiForm, setCutiForm] = useState({
    namaPegawai: currentUser?.nama || 'Mayor Chk Mahpul Saepuloh, S.H.',
    nipNrp: currentUser?.nipNrp || '21940135670972',
    jabatan: 'Panitera Muda Pidana',
    jenisCuti: 'Cuti Tahunan',
    tanggalMulai: '2026-10-01',
    tanggalSelesai: '2026-10-05',
    lamaHari: '5 Hari Kerja',
    alasanCuti: 'Keperluan keluarga di Makassar',
    alamatSelamaCuti: 'Jl. Perintis Kemerdekaan KM 13, Makassar',
    nomorWA: currentUser?.nomorWA || '0812-7766-5544',
    atasanLangsung: 'Kolonel Kum M. Nirwan Said, S.H., M.H. (Panitera)',
    pejabatBerwenang: 'Kolonel Chk Sultan, S.H. (Wakadilmilti V Makassar)'
  });
  const [cutiSubmittedTicket, setCutiSubmittedTicket] = useState<string | null>(null);

  // Form fields for Create / Edit Inovasi Quick Access
  const [namaAplikasi, setNamaAplikasi] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [badge, setBadge] = useState('');
  const [kategori, setKategori] = useState('Pelayanan Publik Terpadu');
  const [urlTujuan, setUrlTujuan] = useState('https://');
  const [domainLabel, setDomainLabel] = useState('');
  const [instansi, setInstansi] = useState('Pengadilan Militer Tinggi V Makassar');
  const [internalSection, setInternalSection] = useState<string>('');
  const [internalSubTab, setInternalSubTab] = useState<string>('');
  const [bukaTabBaru, setBukaTabBaru] = useState<boolean>(true);
  const [iconName, setIconName] = useState<InovasiQuickAccessItem['iconName']>('Sparkles');
  const [status, setStatus] = useState<'Aktif' | 'Maintenance'>('Aktif');
  const [urutan, setUrutan] = useState<number>(1);

  useEffect(() => {
    const syncData = () => {
      setItems(CourtDB.getInovasiQuickAccess());
    };
    syncData();
    window.addEventListener('dilmilti_db_updated', syncData);
    return () => window.removeEventListener('dilmilti_db_updated', syncData);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCreateModal = () => {
    setFormMode('create');
    setEditingId(null);
    setNamaAplikasi('');
    setNamaLengkap('');
    setDeskripsi('');
    setBadge('INOVASI DIGITAL');
    setKategori('Pelayanan Publik Terpadu');
    setUrlTujuan('https://');
    setDomainLabel('dilmilti5-makassar.go.id');
    setInstansi('Pengadilan Militer Tinggi V Makassar');
    setInternalSection('');
    setInternalSubTab('');
    setBukaTabBaru(true);
    setIconName('Sparkles');
    setStatus('Aktif');
    setUrutan(items.length + 1);
    setIsFormModalOpen(true);
  };

  const openEditModal = (item: InovasiQuickAccessItem) => {
    setFormMode('edit');
    setEditingId(item.id);
    setNamaAplikasi(item.namaAplikasi);
    setNamaLengkap(item.namaLengkap);
    setDeskripsi(item.deskripsi);
    setBadge(item.badge);
    setKategori(item.kategori);
    setUrlTujuan(item.urlTujuan);
    setDomainLabel(item.domainLabel);
    setInstansi(item.instansi);
    setInternalSection(item.internalSection || '');
    setInternalSubTab(item.internalSubTab || '');
    setBukaTabBaru(item.bukaTabBaru);
    setIconName(item.iconName || 'Sparkles');
    setStatus(item.status || 'Aktif');
    setUrutan(item.urutan || 1);
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAplikasi.trim()) return;

    const payload: Omit<InovasiQuickAccessItem, 'id'> = {
      namaAplikasi: namaAplikasi.trim(),
      namaLengkap: namaLengkap.trim() || namaAplikasi.trim(),
      deskripsi: deskripsi.trim(),
      badge: badge.trim() || 'INOVASI',
      kategori: kategori.trim() || 'Inovasi Pengadilan',
      urlTujuan: urlTujuan.trim() || 'https://dilmilti5-makassar.go.id',
      domainLabel: domainLabel.trim() || 'dilmilti5-makassar.go.id',
      instansi: instansi.trim() || 'Pengadilan Militer Tinggi V Makassar',
      internalSection: internalSection ? (internalSection as NavSection) : undefined,
      internalSubTab: internalSubTab.trim() || undefined,
      bukaTabBaru,
      iconName,
      status,
      urutan: Number(urutan) || 1
    };

    if (formMode === 'create') {
      CourtDB.addInovasiQuickAccess(payload);
      showToast(`Aplikasi Inovasi "${payload.namaAplikasi}" berhasil ditambahkan!`);
    } else if (editingId) {
      CourtDB.updateInovasiQuickAccess(editingId, payload);
      showToast(`Aplikasi Inovasi "${payload.namaAplikasi}" berhasil diperbarui!`);
    }

    setItems(CourtDB.getInovasiQuickAccess());
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;
    const name = deleteConfirmItem.namaAplikasi;
    CourtDB.deleteInovasiQuickAccess(deleteConfirmItem.id);
    setItems(CourtDB.getInovasiQuickAccess());
    setDeleteConfirmItem(null);
    showToast(`Aplikasi Inovasi "${name}" telah dihapus.`);
  };

  const handleResetDefault = () => {
    const restored = CourtDB.resetInovasiQuickAccess();
    setItems(restored);
    showToast('Daftar Quick Access Aplikasi Inovasi berhasil dikembalikan ke pengaturan awal.');
  };

  const handlePrimaryAccess = (item: InovasiQuickAccessItem) => {
    const lowerName = item.namaAplikasi.toLowerCase();
    // Jika Cuti Online diklik, buka portal interaktif e-Cuti sekaligus sediakan opsi ke SIKEP
    if (lowerName.includes('cuti')) {
      setIsCutiModalOpen(true);
      return;
    }

    if (!item.bukaTabBaru && item.internalSection && onNavigate) {
      onNavigate(item.internalSection, item.internalSubTab);
      return;
    }

    if (item.bukaTabBaru && item.urlTujuan) {
      window.open(item.urlTujuan, '_blank', 'noopener,noreferrer');
      return;
    }

    if (item.internalSection && onNavigate) {
      onNavigate(item.internalSection, item.internalSubTab);
    } else if (item.urlTujuan) {
      window.open(item.urlTujuan, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePrintSuratCuti = () => {
    const ticketNo = cutiSubmittedTicket || `ECUTI/W5-Mil.01/${new Date().getFullYear()}/089`;
    const printWin = window.open('', '_blank', 'width=900,height=750');
    if (!printWin) return;
    printWin.document.write(`
      <html>
        <head>
          <title>Formulir Cuti Online - ${cutiForm.namaPegawai}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 36px; color: #111; line-height: 1.5; }
            .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 20px; }
            .kop h2 { margin: 0; font-size: 16pt; text-transform: uppercase; }
            .kop p { margin: 2px 0; font-size: 10pt; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
            th, td { border: 1px solid #222; padding: 6px 10px; font-size: 11pt; text-align: left; }
            .ttd { margin-top: 28px; display: flex; justify-content: space-between; text-align: center; }
          </style>
        </head>
        <body>
          <div class="kop">
            <h2>MAHKAMAH AGUNG REPUBLIK INDONESIA</h2>
            <h2>PENGADILAN MILITER TINGGI V MAKASSAR</h2>
            <p>Jl. Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar Sulawesi Selatan 90122</p>
          </div>
          <h3 style="text-align:center; text-decoration:underline; margin-bottom:4px;">FORMULIR PERMINTAAN DAN PEMBERIAN CUTI ELEKTRONIK (E-CUTI)</h3>
          <p style="text-align:center; margin-top:0; font-family:monospace;">Nomor Registrasi: ${ticketNo}</p>
          <table>
            <tr><th colspan="4">I. DATA PEGAWAI / PRAJURIT</th></tr>
            <tr><td>Nama</td><td><strong>${cutiForm.namaPegawai}</strong></td><td>NIP / NRP</td><td>${cutiForm.nipNrp}</td></tr>
            <tr><td>Jabatan</td><td>${cutiForm.jabatan}</td><td>Satuan Kerja</td><td>Pengadilan Militer Tinggi V Makassar</td></tr>
          </table>
          <table>
            <tr><th colspan="4">II. JENIS &amp; ALASAN CUTI YANG DIAMBIL</th></tr>
            <tr><td>Jenis Cuti</td><td><strong>${cutiForm.jenisCuti}</strong></td><td>Selama</td><td><strong>${cutiForm.lamaHari}</strong></td></tr>
            <tr><td>Mulai Tanggal</td><td>${cutiForm.tanggalMulai}</td><td>s/d Tanggal</td><td>${cutiForm.tanggalSelesai}</td></tr>
            <tr><td>Alasan Cuti</td><td colspan="3">${cutiForm.alasanCuti}</td></tr>
            <tr><td>Alamat Selama Cuti</td><td colspan="2">${cutiForm.alamatSelamaCuti}</td><td>Telp/WA: ${cutiForm.nomorWA}</td></tr>
          </table>
          <div class="ttd">
            <div>
              <p>Mengetahui Atasan Langsung,</p>
              <br/><br/>
              <p><strong>${cutiForm.atasanLangsung}</strong></p>
            </div>
            <div>
              <p>Makassar, ${new Date().toLocaleDateString('id-ID')}<br/>Pejabat Yang Berwenang Memberikan Cuti,</p>
              <br/><br/>
              <p><strong>${cutiForm.pejabatBerwenang}</strong></p>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <section
      id="inovasi-quick-access-section"
      aria-label="Quick Access Khusus Aplikasi Inovasi"
      className="bg-gradient-to-r from-[#041A0F] via-[#09321E] to-[#041A0F] rounded-2xl shadow-xl border-2 border-amber-400/80 p-4 sm:p-6 text-white relative overflow-hidden tactical-corners"
    >
      {/* Background tactical pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-15 bg-military-camo-pattern" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="relative z-20 mb-4 p-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 rounded hover:bg-black/10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Bar + Admin CRUD Toolbar */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-5 border-b border-amber-400/30">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg border-2 border-amber-200 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Swords className="w-3 h-3" />
                <span>QUICK ACCESS KHUSUS APLIKASI INOVASI</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-300 font-bold">
                PTSP Online • Cuti Online • Notifikasi WhatsApp • Inovasi Digital
              </span>
            </div>
            <h3 className="text-sm sm:text-lg font-black text-white tracking-tight font-serif">
              Akses Cepat Aplikasi Inovasi Pengadilan Militer Tinggi V Makassar
            </h3>
            <p className="text-[11px] text-emerald-100/85">
              Portal pintasan khusus menuju aplikasi inovasi pelayanan publik, administrasi kepegawaian (Cuti Online), PTSP Online, dan Notifikasi Persidangan WhatsApp.
            </p>
          </div>
        </div>

        {/* CRUD Action Buttons for Admin Role */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isAdmin ? (
            <div className="flex flex-wrap items-center gap-2 bg-black/40 p-2 rounded-xl border border-amber-400/60">
              <span className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono font-black text-[10px] uppercase">
                CRUD ADMIN ({currentUser?.role.replace('_', ' ')})
              </span>
              <button
                type="button"
                id="btn-crud-create-inovasi"
                onClick={openCreateModal}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Inovasi</span>
              </button>
              <button
                type="button"
                id="btn-crud-manage-inovasi"
                onClick={() => setIsTableManagerOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-200 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Kelola CRUD ({items.length})</span>
              </button>
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                title="Reset ke Aplikasi Inovasi Default"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth()}
              className="px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-amber-300 border border-amber-400/50 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Login sebagai Admin/Petugas untuk mengelola (CRUD) Quick Access Aplikasi Inovasi"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Login Admin (CRUD Inovasi)</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Quick Access Aplikasi Inovasi */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const IconComp = ICON_MAP[item.iconName] || Sparkles;
          const isLowerCuti = item.namaAplikasi.toLowerCase().includes('cuti');
          const isLowerPtsp = item.namaAplikasi.toLowerCase().includes('ptsp');
          const isLowerWa =
            item.namaAplikasi.toLowerCase().includes('whatsapp') ||
            item.namaAplikasi.toLowerCase().includes('wa');

          return (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-gradient-to-b from-slate-900/95 via-[#072617] to-slate-950 border-2 border-amber-400/60 hover:border-amber-300 p-3 sm:p-4 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between gap-2 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
              onClick={() => handlePrimaryAccess(item)}
            >
              {/* Dynamic Radial Ambient Light Glow */}
              <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-amber-400/10 group-hover:bg-amber-400/25 blur-2xl transition-all duration-500 pointer-events-none"></div>

              {/* Large Dynamic Ambient Watermark Icon filling the card box */}
              <div className="absolute -right-3 -bottom-3 sm:-right-4 sm:-bottom-4 pointer-events-none opacity-12 group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-125 group-hover:-rotate-12 text-amber-300 z-0">
                <IconComp className="w-28 h-28 sm:w-32 sm:h-32 stroke-[1.1]" />
              </div>

              {/* Top Row: Icon, Status & Badge */}
              <div className="relative z-10 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="relative group/icon">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[1.5px] shadow-[0_4px_16px_rgba(245,158,11,0.4)] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(251,191,36,0.65)] transition-all duration-300">
                      <div className="w-full h-full bg-gradient-to-br from-[#09331D] via-[#051C10] to-slate-950 rounded-[10px] flex items-center justify-center text-amber-300 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-amber-500 group-hover:text-slate-950 transition-all duration-300">
                        <IconComp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>
                    <div className="absolute -inset-1 rounded-2xl bg-amber-400/35 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10"></div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-[9px] uppercase tracking-wider shadow-2xs">
                      {item.badge}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.status === 'Aktif'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      ● {item.status}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-emerald-300 font-semibold block">
                    {item.kategori}
                  </span>
                  <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors font-serif leading-snug mt-0.5">
                    {item.namaAplikasi}
                  </h4>
                  <div className="text-[11px] font-bold text-amber-200/90 mt-0.5 line-clamp-1">
                    {item.namaLengkap}
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                  {item.deskripsi}
                </p>
              </div>

              {/* Action Buttons & Admin Card CRUD Controls */}
              <div className="pt-3 border-t border-white/15 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300/90 truncate">
                  <Globe className="w-3 h-3 shrink-0 text-amber-400" />
                  <span className="truncate">{item.domainLabel}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePrimaryAccess(item)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <span>
                      {isLowerCuti
                        ? 'Buka Aplikasi Cuti Online'
                        : isLowerPtsp
                        ? 'Buka Aplikasi PTSP Online'
                        : isLowerWa
                        ? 'Buka Notifikasi WhatsApp'
                        : `Buka ${item.namaAplikasi}`}
                    </span>
                    {item.bukaTabBaru && !isLowerCuti ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Secondary contextual shortcut if applicable */}
                  {isLowerPtsp && onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('ptsp-inovasi', 'app-viewer')}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 border border-white/15 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Lihat Standar 6 Meja PTSP</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {isLowerCuti && (
                    <a
                      href={item.urlTujuan || 'https://sikep.mahkamahagung.go.id/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 border border-white/15 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Portal SIKEP MA-RI (Tab Baru)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {isLowerWa && (
                    <a
                      href={item.urlTujuan || 'https://wa.me/628114455668'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/15 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Chat Hotline WA Resmi</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Direct Admin CRUD Buttons on Card */}
                {isAdmin && (
                  <div className="pt-2 mt-2 border-t border-amber-400/30 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title={`Edit ${item.namaAplikasi}`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmItem(item)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title={`Hapus ${item.namaAplikasi}`}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          MODAL 1: CREATE / EDIT QUICK ACCESS APLIKASI INOVASI (ROLE ADMIN)
         ===================================================================== */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            className="bg-slate-900 border-2 border-amber-400 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  {formMode === 'create' ? <Plus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white font-serif">
                    {formMode === 'create'
                      ? 'Tambah Quick Access Aplikasi Inovasi Baru'
                      : `Edit Aplikasi Inovasi: ${namaAplikasi}`}
                  </h4>
                  <p className="text-[11px] text-amber-300">
                    Manajemen CRUD Role Admin • Quick Access Khusus Aplikasi Inovasi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-amber-300 mb-1">
                    Nama Aplikasi Inovasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaAplikasi}
                    onChange={(e) => setNamaAplikasi(e.target.value)}
                    placeholder="Contoh: PTSP Online / Cuti Online / Notifikasi WhatsApp"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-300 mb-1">
                    Badge Label Kartu *
                  </label>
                  <input
                    type="text"
                    required
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Contoh: PTSP ONLINE / E-CUTI / WA REAL-TIME"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Nama Lengkap / Subjudul Aplikasi
                  </label>
                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="Contoh: Pelayanan Terpadu Satu Pintu Online"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Kategori Inovasi
                  </label>
                  <input
                    type="text"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    placeholder="Contoh: Inovasi Kepegawaian & SDM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Deskripsi Layanan Inovasi *
                </label>
                <textarea
                  rows={2}
                  required
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan fungsi utama aplikasi inovasi ini..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-300 mb-1">
                    URL Tujuan Aplikasi (Eksternal / Portal) *
                  </label>
                  <input
                    type="text"
                    required
                    value={urlTujuan}
                    onChange={(e) => setUrlTujuan(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Label Domain / Tampilan URL
                  </label>
                  <input
                    type="text"
                    value={domainLabel}
                    onChange={(e) => setDomainLabel(e.target.value)}
                    placeholder="ptsp.dilmilti5-makassar.go.id"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Pilih Ikon Kartu
                  </label>
                  <select
                    value={iconName}
                    onChange={(e) =>
                      setIconName(e.target.value as InovasiQuickAccessItem['iconName'])
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="DoorOpen">DoorOpen (PTSP)</option>
                    <option value="CalendarCheck">CalendarCheck (Cuti Online)</option>
                    <option value="MessageSquareCode">MessageSquareCode (WhatsApp)</option>
                    <option value="Laptop">Laptop (Aplikasi Digital)</option>
                    <option value="FileText">FileText (Dokumen)</option>
                    <option value="ShieldCheck">ShieldCheck (Integritas)</option>
                    <option value="Sparkles">Sparkles (Inovasi)</option>
                    <option value="Globe">Globe (Portal Web)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Halaman Internal (Opsional)
                  </label>
                  <select
                    value={internalSection}
                    onChange={(e) => setInternalSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">-- Tidak Ada / Eksternal --</option>
                    <option value="ptsp-inovasi">Halaman Informasi PTSP</option>
                    <option value="whatsapp">Halaman Notifikasi WhatsApp</option>
                    <option value="sipp">Halaman SIPP Perkara</option>
                    <option value="hukum">Halaman Layanan Hukum &amp; UU 31/1997</option>
                    <option value="jadwal">Halaman Jadwal Sidang</option>
                    <option value="ppid">Halaman PPID</option>
                    <option value="publik">Halaman Layanan Publik</option>
                    <option value="dokumen">Halaman Template Dokumen</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Status &amp; Urutan
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Maintenance')}
                      className="flex-1 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={urutan}
                      onChange={(e) => setUrutan(Number(e.target.value))}
                      className="w-16 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-center font-mono"
                      title="Nomor Urutan Tampil"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="chk-buka-tab-baru"
                  type="checkbox"
                  checked={bukaTabBaru}
                  onChange={(e) => setBukaTabBaru(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-400"
                />
                <label htmlFor="chk-buka-tab-baru" className="text-xs text-slate-200 cursor-pointer">
                  Buka URL Aplikasi pada <strong>Tab Baru</strong> saat tombol utama diklik
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{formMode === 'create' ? 'Simpan Aplikasi Inovasi' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: TABEL MANAGER CRUD SELURUH APLIKASI INOVASI (ROLE ADMIN)
         ===================================================================== */}
      {isTableManagerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsTableManagerOpen(false)}
        >
          <div
            className="bg-slate-900 border-2 border-amber-400 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700">
              <div>
                <h4 className="text-base font-black text-white font-serif">
                  Manajemen Tabel CRUD Quick Access Aplikasi Inovasi
                </h4>
                <p className="text-[11px] text-slate-400">
                  Tambah, ubah, atau hapus daftar aplikasi inovasi (PTSP Online, Cuti Online, Notifikasi WhatsApp, dll.)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsTableManagerOpen(false);
                    openCreateModal();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Aplikasi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsTableManagerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-amber-300 uppercase text-[10px] font-mono border-b border-slate-700">
                  <tr>
                    <th className="p-2.5">Urut</th>
                    <th className="p-2.5">Nama Aplikasi Inovasi</th>
                    <th className="p-2.5">Kategori &amp; Badge</th>
                    <th className="p-2.5">URL / Target</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {items.map((it) => (
                    <tr key={it.id} className="hover:bg-slate-800/60">
                      <td className="p-2.5 font-mono font-bold text-amber-300">#{it.urutan}</td>
                      <td className="p-2.5">
                        <div className="font-black text-white">{it.namaAplikasi}</div>
                        <div className="text-[10px] text-slate-400">{it.namaLengkap}</div>
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold">
                          {it.badge}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{it.kategori}</div>
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-emerald-300 max-w-[200px] truncate">
                        {it.urlTujuan}
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {it.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsTableManagerOpen(false);
                              openEditModal(it);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmItem(it)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default (PTSP Online, Cuti Online, Notif WA)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsTableManagerOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: KONFIRMASI HAPUS ITEM INOVASI (ROLE ADMIN)
         ===================================================================== */}
      {deleteConfirmItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmItem(null)}
        >
          <div
            className="bg-slate-900 border-2 border-rose-500 rounded-2xl max-w-md w-full p-5 shadow-2xl text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">
                  Hapus Aplikasi Inovasi?
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Anda yakin ingin menghapus <strong>{deleteConfirmItem.namaAplikasi}</strong> dari Quick Access?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: PORTAL PENGAJUAN CUTI ONLINE (E-CUTI DILMILTI V MAKASSAR)
         ===================================================================== */}
      {isCutiModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsCutiModalOpen(false)}
        >
          <div
            className="bg-slate-900 border-2 border-amber-400 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    INOVASI KEPEGAWAIAN • E-CUTI &amp; SIKEP MA-RI
                  </span>
                  <h4 className="text-base font-black text-white font-serif mt-0.5">
                    Aplikasi Cuti Online &amp; Izin Pegawai (Pengadilan Militer Tinggi V Makassar)
                  </h4>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCutiModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {cutiSubmittedTicket && (
              <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-400 text-emerald-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-amber-300 block">
                    Permohonan Cuti Online Berhasil Diregistrasi!
                  </strong>
                  <span>
                    Nomor Tiket e-Cuti: <strong className="font-mono">{cutiSubmittedTicket}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handlePrintSuratCuti}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Formulir Cuti</span>
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const ticket = `ECUTI/W5-Mil.01/${new Date().getFullYear()}/${Math.floor(
                  100 + Math.random() * 900
                )}`;
                setCutiSubmittedTicket(ticket);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-amber-300 mb-1">
                    Nama Lengkap Hakim / Prajurit / ASN *
                  </label>
                  <input
                    type="text"
                    required
                    value={cutiForm.namaPegawai}
                    onChange={(e) => setCutiForm({ ...cutiForm, namaPegawai: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-amber-300 mb-1">
                    NIP / NRP *
                  </label>
                  <input
                    type="text"
                    required
                    value={cutiForm.nipNrp}
                    onChange={(e) => setCutiForm({ ...cutiForm, nipNrp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Jabatan / Satuan Kerja
                  </label>
                  <input
                    type="text"
                    value={cutiForm.jabatan}
                    onChange={(e) => setCutiForm({ ...cutiForm, jabatan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Jenis Cuti / Izin *
                  </label>
                  <select
                    value={cutiForm.jenisCuti}
                    onChange={(e) => setCutiForm({ ...cutiForm, jenisCuti: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Cuti Tahunan">Cuti Tahunan</option>
                    <option value="Cuti Sakit">Cuti Sakit</option>
                    <option value="Cuti Karena Alasan Penting">Cuti Karena Alasan Penting</option>
                    <option value="Cuti Besar">Cuti Besar</option>
                    <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                    <option value="Izin Keluar Kantor">Izin Keluar Kantor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={cutiForm.tanggalMulai}
                    onChange={(e) => setCutiForm({ ...cutiForm, tanggalMulai: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={cutiForm.tanggalSelesai}
                    onChange={(e) => setCutiForm({ ...cutiForm, tanggalSelesai: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Durasi Hari Kerja
                  </label>
                  <input
                    type="text"
                    value={cutiForm.lamaHari}
                    onChange={(e) => setCutiForm({ ...cutiForm, lamaHari: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Alasan Cuti &amp; Alamat Selama Menjalankan Cuti
                </label>
                <input
                  type="text"
                  value={cutiForm.alasanCuti}
                  onChange={(e) => setCutiForm({ ...cutiForm, alasanCuti: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <a
                  href="https://sikep.mahkamahagung.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold flex items-center gap-1.5"
                >
                  <span>Buka Portal SIKEP MA-RI (Tab Baru)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintSuratCuti}
                    className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Blanko Cuti</span>
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ajukan Cuti Online</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
