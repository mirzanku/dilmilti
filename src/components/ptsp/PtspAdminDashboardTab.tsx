import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Volume2,
  Video,
  Database,
  Download,
  RefreshCw,
  Building2,
  Users,
  Award,
  FileCheck,
  Plus,
  Trash2,
  Printer,
  Send
} from 'lucide-react';
import {
  PTSPDB,
  KATALOG_6_MEJA_PTSP,
  PTSPUserItem,
  PTSPApplicationItem,
  PTSPQueueTicketItem
} from '../../data/ptspDatabase';
import { printOfficialReplyDocument } from './PtspPrintHelper';
import { sendWhatsAppMessage } from '../../utils/whatsappHelper';

interface PtspAdminDashboardTabProps {
  onOpenVideoRoom: (roomCode: string, officerName: string) => void;
  onAnnounceQueueVoice: (ticket: PTSPQueueTicketItem) => void;
  currentOfficer?: PTSPUserItem | null;
  onLogout?: () => void;
}

export default function PtspAdminDashboardTab({
  onOpenVideoRoom,
  onAnnounceQueueVoice,
  currentOfficer,
  onLogout
}: PtspAdminDashboardTabProps) {
  const [dbState, setDbState] = useState(() => PTSPDB.getState());
  const [activeOfficer, setActiveOfficer] = useState<PTSPUserItem>(() => currentOfficer || PTSPDB.getState().tbl_users[0]);
  const [subMenu, setSubMenu] = useState<
    'verifikasi' | 'antrean' | 'konsultasi' | 'master-satker' | 'master-pejabat' | 'master-users' | 'hybrid-db'
  >('verifikasi');

  // Verification Modal / Form state
  const [selectedApp, setSelectedApp] = useState<PTSPApplicationItem | null>(null);
  const [verifyForm, setVerifyForm] = useState({
    status: 'Selesai' as PTSPApplicationItem['status'],
    catatan_petugas: '',
    nomor_surat_balasan: 'W5-Mil/165/PTSP/IX/2026',
    judul_dokumen: '',
    isi_ringkas: '',
    tte_signer_nama: 'Letkol Chk S. Haryanto, S.H., M.H.',
    tte_signer_pangkat_nrp: 'Letkol Chk NRP 11020023410882',
    tte_signer_jabatan: 'Panitera Pengadilan Militer Tinggi V Makassar',
    file_name: '',
    file_url: 'TTE-GENERATED-DOC'
  });
  const [savedNotice, setSavedNotice] = useState('');

  // Master Data Forms
  const [newSatker, setNewSatker] = useState({
    kode_satker: '',
    nama_satker: '',
    tingkat: 'Tingkat Pertama',
    wilayah_hukum: '',
    alamat: '',
    telepon: '',
    kepala_satker: ''
  });

  const [newPejabat, setNewPejabat] = useState({
    nama_pejabat: '',
    pangkat_korps: '',
    nrp_nip: '',
    jabatan: '',
    kategori: 'Hakim Militer Tinggi' as const,
    matra: 'TNI AD' as const
  });

  const [newUser, setNewUser] = useState({
    username: '',
    nama_lengkap: '',
    nip_nrp: '',
    pangkat_gol: '',
    role: 'petugas_meja' as const,
    meja_assigned: 1,
    jabatan: '',
    no_wa: ''
  });

  // Hybrid MySQL Bridge Config
  const [bridgeUrl, setBridgeUrl] = useState(dbState.mysqlBridgeUrl);
  const [bridgeEnabled, setBridgeEnabled] = useState(dbState.mysqlBridgeEnabled);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  useEffect(() => {
    const unsub = PTSPDB.subscribe(() => {
      setDbState(PTSPDB.getState());
    });
    return unsub;
  }, []);

  // Filter applications & queues based on role (Super Admin & Pejabat see all 6 Meja; Petugas Meja sees their assigned Meja or all if 0)
  const filteredApplications = dbState.ptsp_applications.filter((app) => {
    if (activeOfficer.role === 'super_admin' || activeOfficer.role === 'pejabat_struktural' || activeOfficer.meja_assigned === 0) {
      return true;
    }
    return app.meja_id === activeOfficer.meja_assigned;
  });

  const filteredQueues = dbState.queue_tickets.filter((q) => {
    if (activeOfficer.role === 'super_admin' || activeOfficer.role === 'pejabat_struktural' || activeOfficer.meja_assigned === 0) {
      return true;
    }
    return q.meja_id === activeOfficer.meja_assigned;
  });

  const handleSelectAppForVerify = (app: PTSPApplicationItem) => {
    setSelectedApp(app);
    setVerifyForm({
      status: app.status === 'Diajukan' ? 'Selesai' : app.status,
      catatan_petugas:
        app.catatan_petugas ||
        `Berkas permohonan pada ${app.meja_nama} telah diverifikasi lengkap dan disetujui. Dokumen balasan resmi ber-TTE siap diunduh.`,
      nomor_surat_balasan: `W5-Mil/${Math.floor(110 + Math.random() * 850)}/PTSP/IX/2026`,
      judul_dokumen: `Surat Balasan / Hasil Layanan: ${app.jenis_layanan}`,
      isi_ringkas: `Menerangkan bahwa permohonan layanan Nomor Tiket ${app.ticket_no} atas nama ${app.nama_pemohon} (${app.kesatuan_instansi}) telah selesai diproses dan disahkan secara elektronik oleh Pengadilan Militer Tinggi V Makassar.`,
      tte_signer_nama: 'Letkol Chk S. Haryanto, S.H., M.H.',
      tte_signer_pangkat_nrp: 'Letkol Chk NRP 11020023410882',
      tte_signer_jabatan: 'Panitera Pengadilan Militer Tinggi V Makassar',
      file_name: `Dokumen_Resmi_TTE_${app.ticket_no}.pdf`,
      file_url: 'TTE-GENERATED-DOC'
    });
  };

  const handleReplyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setVerifyForm((prev) => ({
          ...prev,
          file_name: file.name,
          file_url: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const qrHash = `BSRE-BSSN-DILMILTI5-${selectedApp.ticket_no}-${Date.now().toString().slice(-4)}`;

    PTSPDB.updateApplicationStatus(
      selectedApp.id,
      verifyForm.status,
      verifyForm.catatan_petugas,
      activeOfficer.nama_lengkap,
      verifyForm.status === 'Selesai'
        ? {
            ticket_no: selectedApp.ticket_no,
            nomor_surat_balasan: verifyForm.nomor_surat_balasan,
            judul_dokumen: verifyForm.judul_dokumen,
            isi_ringkas: verifyForm.isi_ringkas,
            file_name: verifyForm.file_name || `Balasan_Resmi_${selectedApp.ticket_no}.pdf`,
            file_url: verifyForm.file_url || 'TTE-GENERATED-DOC',
            tte_signer_nama: verifyForm.tte_signer_nama,
            tte_signer_pangkat_nrp: verifyForm.tte_signer_pangkat_nrp,
            tte_signer_jabatan: verifyForm.tte_signer_jabatan,
            tte_qr_hash: qrHash,
            uploaded_by: activeOfficer.nama_lengkap
          }
        : undefined
    );

    setSavedNotice(`Tiket ${selectedApp.ticket_no} berhasil diperbarui menjadi "${verifyForm.status}"!`);
    setSelectedApp(null);
    setTimeout(() => setSavedNotice(''), 3500);
  };

  const handleAddSatker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSatker.nama_satker || !newSatker.kode_satker) return;
    PTSPDB.saveState((prev) => ({
      ...prev,
      tbl_satker: [
        ...prev.tbl_satker,
        {
          id: `sat-${Date.now()}`,
          ...newSatker,
          status_koneksi: 'Terhubung Online'
        }
      ]
    }));
    setNewSatker({
      kode_satker: '',
      nama_satker: '',
      tingkat: 'Tingkat Pertama',
      wilayah_hukum: '',
      alamat: '',
      telepon: '',
      kepala_satker: ''
    });
  };

  const handleAddPejabat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPejabat.nama_pejabat || !newPejabat.nrp_nip) return;
    PTSPDB.saveState((prev) => ({
      ...prev,
      tbl_pejabat: [
        ...prev.tbl_pejabat,
        {
          id: `pej-${Date.now()}`,
          urutan: prev.tbl_pejabat.length + 1,
          ...newPejabat,
          status_kehadiran: 'Siap Dinas (Di Kantor)'
        }
      ]
    }));
    setNewPejabat({
      nama_pejabat: '',
      pangkat_korps: '',
      nrp_nip: '',
      jabatan: '',
      kategori: 'Hakim Militer Tinggi',
      matra: 'TNI AD'
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.nama_lengkap) return;
    PTSPDB.saveState((prev) => ({
      ...prev,
      tbl_users: [
        ...prev.tbl_users,
        {
          id: `u-${Date.now()}`,
          ...newUser,
          status_aktif: true
        }
      ]
    }));
    setNewUser({
      username: '',
      nama_lengkap: '',
      nip_nrp: '',
      pangkat_gol: '',
      role: 'petugas_meja',
      meja_assigned: 1,
      jabatan: '',
      no_wa: ''
    });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Multi-Role Active Officer Switcher Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#072617] to-slate-900 text-white rounded-2xl p-5 border-2 border-amber-400/70 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
              MODUL 6 & 7 : DASHBOARD MULTI-ROLE PETUGAS & DATABASE HYBRID
            </span>
            <span className="text-[11px] font-mono text-emerald-300">
              Peran Aktif: {activeOfficer.role.toUpperCase()}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            {activeOfficer.nama_lengkap} — <span className="text-amber-300">{activeOfficer.jabatan}</span>
          </h3>
          <p className="text-xs text-slate-300">
            NRP/NIP: {activeOfficer.nip_nrp} • Akses Loket:{' '}
            <strong>
              {activeOfficer.meja_assigned === 0
                ? 'Seluruh 6 Meja PTSP (Full Access)'
                : `Meja ${activeOfficer.meja_assigned}`}
            </strong>
          </p>
        </div>

        {/* Role / Officer Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="text-[11px] font-bold text-amber-300 shrink-0">Pilih Akun Petugas / Role:</label>
          <select
            value={activeOfficer.id}
            onChange={(e) => {
              const found = dbState.tbl_users.find((u) => u.id === e.target.value);
              if (found) setActiveOfficer(found);
            }}
            className="p-2.5 rounded-xl bg-slate-900 border border-amber-400/60 text-white font-bold text-xs"
          >
            {dbState.tbl_users.map((u) => (
              <option key={u.id} value={u.id}>
                [{u.role === 'super_admin' ? 'SUPER ADMIN' : u.role === 'pejabat_struktural' ? 'PEJABAT' : `MEJA ${u.meja_assigned}`}] {u.nama_lengkap}
              </option>
            ))}
          </select>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
              title="Keluar dari sesi Petugas PTSP"
            >
              <span>Logout Petugas</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Bar */}
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {[
          { id: 'verifikasi', label: `1. Verifikasi Permohonan & TTE (${filteredApplications.length})`, icon: FileCheck },
          { id: 'antrean', label: `2. Panggil Antrean Loket (${filteredQueues.length})`, icon: Volume2 },
          { id: 'konsultasi', label: `3. Ruang Konsultasi Video (${dbState.online_consultations.length})`, icon: Video },
          { id: 'master-satker', label: `4. Data Satker (${dbState.tbl_satker.length})`, icon: Building2 },
          { id: 'master-pejabat', label: `5. Daftar Pejabat/Hakim (${dbState.tbl_pejabat.length})`, icon: Award },
          { id: 'master-users', label: `6. Manajemen Pengguna (${dbState.tbl_users.length})`, icon: Users },
          { id: 'hybrid-db', label: '7. Sinkronisasi MySQL (sync.php & SQL)', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = subMenu === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubMenu(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                active
                  ? 'bg-[#0D4A2B] text-amber-300 shadow-xs border border-emerald-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 1. VERIFIKASI PERMOHONAN & UNGGAH DOKUMEN BALASAN RESMI (TTE) */}
      {subMenu === 'verifikasi' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                Daftar Permohonan Masuk (`ptsp_applications`) & Penerbitan Dokumen Balasan (`reply_documents`)
              </h4>
              <p className="text-xs text-slate-500">
                Klik tombol <strong>Verifikasi & Upload Balasan TTE</strong> untuk memproses berkas pemohon.
              </p>
            </div>
          </div>

          {selectedApp && (
            <form
              onSubmit={handleSaveVerification}
              className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-600 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">
                    FORMULIR VERIFIKASI PETUGAS & PENERBITAN TTE
                  </span>
                  <h5 className="text-sm font-black text-slate-900">
                    Tiket: {selectedApp.ticket_no} — {selectedApp.nama_pemohon} ({selectedApp.kesatuan_instansi})
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Ubah Status Permohonan: *</label>
                  <select
                    value={verifyForm.status}
                    onChange={(e) => setVerifyForm({ ...verifyForm, status: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="Diajukan">1. Diajukan</option>
                    <option value="Verifikasi Berkas">2. Verifikasi Berkas</option>
                    <option value="Sedang Diproses">3. Sedang Diproses Pejabat</option>
                    <option value="Selesai">4. Selesai (Terbitkan Dokumen Balasan TTE)</option>
                    <option value="Ditolak">Ditolak (Berkas Tidak Lengkap)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Nomor Surat / Dokumen Balasan:</label>
                  <input
                    type="text"
                    value={verifyForm.nomor_surat_balasan}
                    onChange={(e) => setVerifyForm({ ...verifyForm, nomor_surat_balasan: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Pejabat Penandatangan TTE (BSrE):</label>
                  <input
                    type="text"
                    value={verifyForm.tte_signer_nama}
                    onChange={(e) => setVerifyForm({ ...verifyForm, tte_signer_nama: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Judul Dokumen Balasan Resmi:</label>
                  <input
                    type="text"
                    value={verifyForm.judul_dokumen}
                    onChange={(e) => setVerifyForm({ ...verifyForm, judul_dokumen: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Unggah File PDF/Gambar Balasan (Opsional, Otomatis TTE jika kosong):
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleReplyFileUpload}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Catatan Verifikasi Petugas PTSP:</label>
                <textarea
                  rows={2}
                  value={verifyForm.catatan_petugas}
                  onChange={(e) => setVerifyForm({ ...verifyForm, catatan_petugas: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-black rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simpan Verifikasi & Terbitkan Dokumen Balasan TTE</span>
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {filteredApplications.map((app) => {
              const replyDoc = dbState.reply_documents.find((r) => r.ticket_no === app.ticket_no);
              return (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-[#0D4A2B] bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                        {app.ticket_no}
                      </span>
                      <span className="font-bold text-slate-800">{app.meja_nama}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded font-bold text-[10px] uppercase ${
                          app.status === 'Selesai'
                            ? 'bg-emerald-600 text-white'
                            : app.status === 'Ditolak'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{app.jenis_layanan}</div>
                    <div className="text-slate-600">
                      Pemohon: <strong>{app.nama_pemohon}</strong> ({app.kategori_pemohon} - {app.kesatuan_instansi}) • NRP/NIK: {app.nrp_nip_nik}
                    </div>
                    <div className="text-slate-500 italic">Uraian: &ldquo;{app.uraian_permohonan}&rdquo;</div>
                    {app.berkas_nama && (
                      <div className="text-[11px] text-emerald-800 font-semibold">
                        📎 Lampiran Berkas Pemohon: {app.berkas_nama}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSelectAppForVerify(app)}
                      className="px-3.5 py-2 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Verifikasi & Upload Balasan</span>
                    </button>

                    {app.status === 'Selesai' && (
                      <button
                        type="button"
                        onClick={() => printOfficialReplyDocument(app, replyDoc)}
                        className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl cursor-pointer flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Dokumen TTE</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const msg = `📢 *UPDATE STATUS LAYANAN PTSP DILMILTI V MAKASSAR*\n\n• *Nomor Tiket:* ${app.ticket_no}\n• *Nama Pemohon:* ${app.nama_pemohon}\n• *Layanan:* ${app.jenis_layanan}\n• *Status Saat Ini:* *${app.status}*\n• *Catatan Petugas:* ${app.catatan_petugas || 'Sedang diproses sesuai SOP.'}\n\nSilakan cek & unduh dokumen balasan resmi ber-TTE melalui Portal PTSP Online.`;
                        sendWhatsAppMessage(app.no_wa, msg);
                      }}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Notif WA</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. KONTROL ANTREAN LOKET & PEMANGGIL SUARA OTOMATIS (TTS) */}
      {subMenu === 'antrean' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h4 className="text-sm sm:text-base font-black text-slate-900">
            Manajemen Panggilan Antrean 6 Meja PTSP (`queue_tickets`)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredQueues.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-lg text-[#0D4A2B] bg-amber-200 px-2.5 py-0.5 rounded">
                      {q.nomor_antrean}
                    </span>
                    <span className="font-bold text-slate-900">{q.meja_nama}</span>
                  </div>
                  <div className="font-semibold text-slate-700 mt-1">
                    {q.nama_pemohon} ({q.kesatuan_instansi})
                  </div>
                  <div className="text-[11px] text-slate-500">{q.keperluan}</div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = PTSPDB.updateQueueStatus(q.id, 'Dipanggil', activeOfficer.nama_lengkap);
                      if (updated) onAnnounceQueueVoice(updated);
                    }}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Panggil Suara (TTS)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => PTSPDB.updateQueueStatus(q.id, 'Selesai', activeOfficer.nama_lengkap)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-center cursor-pointer"
                  >
                    Tandai Selesai
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DAFTAR RUANG KONSULTASI VIDEO & CHAT */}
      {subMenu === 'konsultasi' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h4 className="text-sm sm:text-base font-black text-slate-900">
            Daftar Ruang Konsultasi Tatap Muka Online (`online_consultations`)
          </h4>
          <div className="space-y-3">
            {dbState.online_consultations.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded">
                      {c.room_code}
                    </span>
                    <span className="font-bold text-slate-900">{c.meja_nama}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {c.status_ruang}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{c.topik_konsultasi}</div>
                  <div className="text-slate-600">
                    Pemohon: <strong>{c.nama_pemohon}</strong> ({c.kesatuan_instansi}) • Jadwal: {c.jadwal_tanggal} {c.jadwal_jam}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenVideoRoom(c.room_code, activeOfficer.nama_lengkap)}
                  className="px-4 py-2.5 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-black rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Video className="w-4 h-4" />
                  <span>Layani Video Call & Chat</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DATA MASTER SATUAN KERJA (tbl_satker) */}
      {subMenu === 'master-satker' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h4 className="text-sm sm:text-base font-black text-slate-900">
            Manajemen Data Master Satuan Kerja Jajaran (`tbl_satker`)
          </h4>

          <form onSubmit={handleAddSatker} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <input
              type="text"
              required
              placeholder="Kode Satker (e.g. 663155)"
              value={newSatker.kode_satker}
              onChange={(e) => setNewSatker({ ...newSatker, kode_satker: e.target.value })}
              className="p-2 bg-white border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              required
              placeholder="Nama Satuan Kerja"
              value={newSatker.nama_satker}
              onChange={(e) => setNewSatker({ ...newSatker, nama_satker: e.target.value })}
              className="p-2 bg-white border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Kepala Satker"
              value={newSatker.kepala_satker}
              onChange={(e) => setNewSatker({ ...newSatker, kepala_satker: e.target.value })}
              className="p-2 bg-white border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#0D4A2B] text-amber-300 font-black rounded-lg flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Satker</span>
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Kode</th>
                  <th className="py-2.5 px-3">Nama Satuan Kerja</th>
                  <th className="py-2.5 px-3">Wilayah Hukum</th>
                  <th className="py-2.5 px-3">Kepala Satker</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dbState.tbl_satker.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5 px-3 font-mono font-bold">{s.kode_satker}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{s.nama_satker}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.wilayah_hukum}</td>
                    <td className="py-2.5 px-3">{s.kepala_satker}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {s.status_koneksi}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        type="button"
                        onClick={() =>
                          PTSPDB.saveState((prev) => ({
                            ...prev,
                            tbl_satker: prev.tbl_satker.filter((item) => item.id !== s.id)
                          }))
                        }
                        className="text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DATA MASTER PEJABAT & HAKIM MILITER (tbl_pejabat) */}
      {subMenu === 'master-pejabat' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h4 className="text-sm sm:text-base font-black text-slate-900">
            Manajemen Daftar Pejabat & Hakim Militer Tinggi (`tbl_pejabat`)
          </h4>

          <form onSubmit={handleAddPejabat} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <input
              type="text"
              required
              placeholder="Nama Lengkap & Gelar"
              value={newPejabat.nama_pejabat}
              onChange={(e) => setNewPejabat({ ...newPejabat, nama_pejabat: e.target.value })}
              className="p-2 bg-white border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              required
              placeholder="Pangkat / Korps"
              value={newPejabat.pangkat_korps}
              onChange={(e) => setNewPejabat({ ...newPejabat, pangkat_korps: e.target.value })}
              className="p-2 bg-white border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              required
              placeholder="NRP / NIP"
              value={newPejabat.nrp_nip}
              onChange={(e) => setNewPejabat({ ...newPejabat, nrp_nip: e.target.value })}
              className="p-2 bg-white border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#0D4A2B] text-amber-300 font-black rounded-lg flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pejabat</span>
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dbState.tbl_pejabat.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">{p.nama_pejabat}</div>
                  <div className="text-slate-600">
                    {p.pangkat_korps} • NRP/NIP: {p.nrp_nip}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-800 mt-0.5">{p.jabatan}</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                  {p.status_kehadiran}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MANAJEMEN PENGGUNA & PETUGAS MEJA (tbl_users) */}
      {subMenu === 'master-users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h4 className="text-sm sm:text-base font-black text-slate-900">
            Manajemen Pengguna & Petugas 6 Meja PTSP (`tbl_users`)
          </h4>

          <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <input
              type="text"
              required
              placeholder="Username Login"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="p-2 bg-white border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              required
              placeholder="Nama Lengkap Petugas"
              value={newUser.nama_lengkap}
              onChange={(e) => setNewUser({ ...newUser, nama_lengkap: e.target.value })}
              className="p-2 bg-white border border-slate-300 rounded-lg"
            />
            <select
              value={newUser.meja_assigned}
              onChange={(e) => setNewUser({ ...newUser, meja_assigned: Number(e.target.value) })}
              className="p-2 bg-white border border-slate-300 rounded-lg font-bold"
            >
              <option value={0}>Semua Meja (Super Admin / Pejabat)</option>
              {KATALOG_6_MEJA_PTSP.map((m) => (
                <option key={m.mejaId} value={m.mejaId}>
                  Petugas {m.namaMeja}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0D4A2B] text-amber-300 font-black rounded-lg flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Petugas</span>
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dbState.tbl_users.map((u) => (
              <div key={u.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">
                    {u.nama_lengkap} <span className="font-mono text-emerald-700">(@{u.username})</span>
                  </div>
                  <div className="text-slate-600">{u.jabatan}</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-[10px] uppercase">
                  {u.role} {u.meja_assigned > 0 ? `• Meja ${u.meja_assigned}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SINKRONISASI DATABASE HYBRID (MYSQL / XAMPP sync.php & db_ptsp_dilmilti5.sql) */}
      {subMenu === 'hybrid-db' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-extrabold text-emerald-800 uppercase">
                HYBRID DATABASE ENGINE (MYSQL XAMPP BRIDGE + CLOUD REST API + LOCALSTORAGE)
              </span>
              <h4 className="text-base font-black text-slate-900 mt-0.5">
                Sinkronisasi Database `db_ptsp_dilmilti5` & File Bridge `sync.php`
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Menjamin seluruh perangkat (PC Petugas PTSP dan Smartphone Pemohon) tersinkronisasi secara real-time.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="/sync.php"
                download="sync.php"
                className="px-4 py-2.5 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-black rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File sync.php</span>
              </a>
              <a
                href="/db_ptsp_dilmilti5.sql"
                download="db_ptsp_dilmilti5.sql"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Skema db_ptsp_dilmilti5.sql</span>
              </a>
            </div>
          </div>

          {/* 9 MySQL Tables Status Grid */}
          <div>
            <h5 className="font-bold text-slate-800 mb-2.5">
              Status 9 Tabel Skema Otomatis (`db_ptsp_dilmilti5`):
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'ptsp_applications', count: dbState.ptsp_applications.length, desc: 'Permohonan Layanan 6 Meja & Berkas' },
                { name: 'online_consultations', count: dbState.online_consultations.length, desc: 'Jadwal & Berita Acara Konsultasi' },
                { name: 'ptsp_room_streams', count: Object.keys(dbState.ptsp_room_streams).length, desc: 'Video Streaming 2 Arah HTTP/WebRTC' },
                { name: 'ptsp_room_chats', count: dbState.ptsp_room_chats.length, desc: 'Riwayat Chat Real-Time Permanen' },
                { name: 'queue_tickets', count: dbState.queue_tickets.length, desc: 'Tiket Antrean Loket & Pemanggil TTS' },
                { name: 'reply_documents', count: dbState.reply_documents.length, desc: 'Dokumen Balasan Resmi Ber-TTE' },
                { name: 'tbl_users', count: dbState.tbl_users.length, desc: 'Akun Multi-Role Petugas & Admin' },
                { name: 'tbl_satker', count: dbState.tbl_satker.length, desc: 'Data Master Satuan Kerja Jajaran' },
                { name: 'tbl_pejabat', count: dbState.tbl_pejabat.length, desc: 'Daftar Pejabat & Hakim Militer' }
              ].map((t) => (
                <div key={t.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-black text-emerald-900 text-xs">{t.name}</div>
                    <div className="text-[11px] text-slate-500">{t.desc}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-mono font-black">
                    {t.count} baris
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* XAMPP / PHP Bridge Configuration */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h5 className="font-black text-amber-400 text-sm">
                  Konfigurasi Koneksi XAMPP / MySQL PHP Bridge (`sync.php`)
                </h5>
                <p className="text-xs text-slate-300">
                  Secara default sistem menyinkronkan perangkat lewat Cloud/LAN REST API (`/api/court-db`). Aktifkan opsi di bawah jika Anda menjalankan MySQL lokal via XAMPP.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bridgeEnabled}
                  onChange={(e) => setBridgeEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-400"
                />
                <span className="font-bold text-amber-300">Aktifkan XAMPP MySQL Bridge</span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={bridgeUrl}
                onChange={(e) => setBridgeUrl(e.target.value)}
                placeholder="http://localhost/ptsp_dilmilti5/sync.php"
                className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs"
              />
              <button
                type="button"
                onClick={async () => {
                  const next = PTSPDB.saveState((prev) => ({
                    ...prev,
                    mysqlBridgeUrl: bridgeUrl,
                    mysqlBridgeEnabled: bridgeEnabled
                  }));
                  await PTSPDB.pushToHybridBackend(next);
                  setSyncStatusMsg(
                    `Tersinkronisasi penuh pada ${new Date().toLocaleTimeString('id-ID')} WITA (Versi DB v${next.version})`
                  );
                }}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Simpan & Sinkronkan Sekarang</span>
              </button>
            </div>

            {syncStatusMsg && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 font-mono text-xs">
                ✓ {syncStatusMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
