import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  KeyRound, 
  Building2, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Scale
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { UserRole, UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onLoginSuccess?: (user: UserAccount) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onLoginSuccess,
  initialMode = 'login' 
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regNama, setRegNama] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regNipNrp, setRegNipNrp] = useState('');
  const [regInstansi, setRegInstansi] = useState('');
  const [regNomorWA, setRegNomorWA] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('editor_humas');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = CourtDB.login(loginEmail, loginPassword);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          if (res.user && onLoginSuccess) {
            onLoginSuccess(res.user);
          }
          if (onSuccess) onSuccess();
          onClose();
        }, 800);
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regNama || !regEmail || !regPassword) {
      setErrorMsg('Harap lengkapi semua kolom bertanda bintang (*)!');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter!');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = CourtDB.register({
        nama: regNama,
        email: regEmail,
        password: regPassword,
        role: regRole,
        nipNrp: regNipNrp || '-',
        instansi: regInstansi || 'Pengadilan Militer Tinggi V Makassar',
        nomorWA: regNomorWA || '0812-3456-7890',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
      });
      setLoading(false);

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          if (res.user && onLoginSuccess) {
            onLoginSuccess(res.user);
          }
          if (onSuccess) onSuccess();
          onClose();
        }, 1000);
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  // Quick Demo Login
  const handleQuickLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setLoading(true);
    setTimeout(() => {
      const res = CourtDB.login(email, pass);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          if (res.user && onLoginSuccess) {
            onLoginSuccess(res.user);
          }
          if (onSuccess) onSuccess();
          onClose();
        }, 600);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0A2318] text-slate-100 rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow & Decorative Pattern */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-emerald-500/20 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0D4A2B] to-emerald-600 flex items-center justify-center shadow-lg border border-amber-400/60 text-amber-300">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-950 text-amber-300 border border-amber-400/40 tracking-wider">
                  PORTAL OTENTIKASI SISTEM
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">DILMILTI V</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-tight">
                {mode === 'login' ? 'Masuk Pengelola Website' : 'Pendaftaran Pengguna Baru'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950/60 border-b border-emerald-500/20 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-md border border-emerald-400/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>Masuk (Login)</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-md border border-emerald-400/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-amber-300" />
            <span>Daftar User Baru</span>
          </button>
        </div>

        {/* Alerts */}
        <div className="px-6 pt-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Alamat Email Akun
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="contoh: admin@dilmilti5.go.id"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Memverifikasi Akses...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard Pengelola</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Instant Quick Demo Buttons with Role Badges */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Pilih Role untuk Pengujian Sistem (1-Click Switch)
                  </span>
                  <span className="text-[9px] text-slate-400">Pemisahan RBAC & Hak Akses</span>
                </div>

                {/* Section A: Admin & Petugas (Full / Division CRUD) */}
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Aparatur Pengadilan (Akses CRUD Sesuai Bidang / Divisi)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('admin@dilmilti5.go.id', 'admin123')}
                      className="p-2.5 bg-slate-900/90 hover:bg-amber-950/40 border border-amber-500/50 hover:border-amber-400 rounded-xl text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-amber-300 group-hover:text-amber-200">Super Admin</span>
                        <span className="text-[8px] bg-amber-400/20 text-amber-300 font-mono px-1 rounded font-bold">ALL CRUD</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-semibold mt-0.5">Wakadilmilti V</div>
                      <div className="text-[9px] text-slate-400 leading-tight mt-0.5">Semua modul & database</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('kepaniteraan@dilmilti5.go.id', 'panitera123')}
                      className="p-2.5 bg-slate-900/90 hover:bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-300 rounded-xl text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-emerald-300 group-hover:text-emerald-200">Kepaniteraan</span>
                        <span className="text-[8px] bg-emerald-400/20 text-emerald-300 font-mono px-1 rounded font-bold">YUDISIAL</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-semibold mt-0.5">Panitera / Panmud</div>
                      <div className="text-[9px] text-slate-400 leading-tight mt-0.5">CRUD SIPP & Jadwal Sidang</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('kesekretariatan@dilmilti5.go.id', 'sekretaris123')}
                      className="p-2.5 bg-slate-900/90 hover:bg-sky-950/40 border border-sky-500/40 hover:border-sky-300 rounded-xl text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sky-300 group-hover:text-sky-200">Kesekretariatan</span>
                        <span className="text-[8px] bg-sky-400/20 text-sky-300 font-mono px-1 rounded font-bold">SDM & ZI</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-semibold mt-0.5">Kabag & Kepegawaian</div>
                      <div className="text-[9px] text-slate-400 leading-tight mt-0.5">Data Personel & Eviden ZI</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('humas@dilmilti5.go.id', 'humas123')}
                      className="p-2.5 bg-slate-900/90 hover:bg-purple-950/40 border border-purple-500/40 hover:border-purple-300 rounded-xl text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-purple-300 group-hover:text-purple-200">Editor Humas</span>
                        <span className="text-[8px] bg-purple-400/20 text-purple-300 font-mono px-1 rounded font-bold">HUMAS</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-semibold mt-0.5">Pranata Humas & TI</div>
                      <div className="text-[9px] text-slate-400 leading-tight mt-0.5">Kelola Berita & Tautan MA</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('ptsp@dilmilti5.go.id', 'ptsp123')}
                      className="p-2.5 bg-slate-900/90 hover:bg-teal-950/40 border border-teal-500/40 hover:border-teal-300 rounded-xl text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-teal-300 group-hover:text-teal-200">Petugas PTSP</span>
                        <span className="text-[8px] bg-teal-400/20 text-teal-300 font-mono px-1 rounded font-bold">PTSP</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-semibold mt-0.5">Meja 1-6 Layanan</div>
                      <div className="text-[9px] text-slate-400 leading-tight mt-0.5">Tiket Layanan & PPID</div>
                    </button>
                  </div>
                </div>

                {/* Section B: Publik & Tamu (No Master CRUD, Self Service) */}
                <div>
                  <div className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Publik / Pengunjung / Masyarakat Pencari Keadilan (Mode Tamu)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('user@tamu.id', 'tamu123')}
                      className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-600/60 hover:border-slate-400 rounded-xl text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-200 group-hover:text-white">Pengunjung / Advokat Terdaftar</span>
                        <span className="text-[8px] bg-slate-700 text-slate-300 font-mono px-1 rounded font-bold">NON-ADMIN</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Advokat M. Ramli Syam, S.H.</div>
                      <div className="text-[9px] text-slate-500 leading-tight mt-0.5">Akses Layanan Mandiri PTSP, Cek Tiket, Tanpa CRUD Master Data</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        CourtDB.logout();
                        setSuccessMsg('Beralih ke mode Pengunjung Publik (Anonim).');
                        setTimeout(() => {
                          if (onSuccess) onSuccess();
                          onClose();
                        }, 500);
                      }}
                      className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-dashed border-slate-600 hover:border-slate-400 rounded-xl text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-300 group-hover:text-white">Pengunjung Publik Anonim</span>
                        <span className="text-[8px] bg-amber-500/20 text-amber-300 font-mono px-1 rounded font-bold">GUEST</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Tanpa Login (Masyarakat Umum)</div>
                      <div className="text-[9px] text-slate-500 leading-tight mt-0.5">Hanya melihat informasi publik & layanan permohonan mandiri</div>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Mayor Chk Anwar, S.H."
                    value={regNama}
                    onChange={(e) => setRegNama(e.target.value)}
                    className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    NRP / NIP / No. KTP
                  </label>
                  <input
                    type="text"
                    placeholder="NRP TNI / NIP ASN / KTP Advokat"
                    value={regNipNrp}
                    onChange={(e) => setRegNipNrp(e.target.value)}
                    className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Alamat Email Resmi *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@instansi.go.id"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={regNomorWA}
                    onChange={(e) => setRegNomorWA(e.target.value)}
                    className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Instansi / Kesatuan / Kantor
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dilmilti V / Kodam / Kantor Hukum"
                    value={regInstansi}
                    onChange={(e) => setRegInstansi(e.target.value)}
                    className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Peran & Hak Akses (Role)
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950/90 border border-emerald-500/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="editor_humas">Editor Humas & Berita</option>
                    <option value="admin_kepaniteraan">Staf Kepaniteraan (SIPP & Jadwal)</option>
                    <option value="admin_kesekretariatan">Staf Kesekretariatan & Personel</option>
                    <option value="petugas_ptsp">Petugas PTSP & Meja Layanan</option>
                    <option value="user_tamu">User Tamu / Advokat / Publik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kata Sandi (Password) *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Ulangi Kata Sandi *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Ketik ulang password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                Dengan mendaftar, Anda menyatakan bahwa data yang diisi adalah benar untuk keperluan pengelolaan portal informasi dan layanan publik Pengadilan Militer Tinggi V Makassar.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {loading ? <span>Mendaftarkan Pengguna...</span> : <span>Daftar & Masuk Sekarang</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
