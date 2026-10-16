import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  KeyRound,
  ArrowRight,
  LogOut,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PTSPDB, PTSPUserItem, KATALOG_6_MEJA_PTSP } from '../../data/ptspDatabase';

interface PtspAdminLoginPageProps {
  onLoginSuccess: (officer: PTSPUserItem) => void;
  currentOfficer: PTSPUserItem | null;
  onLogout: () => void;
}

export default function PtspAdminLoginPage({
  onLoginSuccess,
  currentOfficer,
  onLogout
}: PtspAdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dbUsers = PTSPDB.getState().tbl_users;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      // Find user in tbl_users
      const matched = dbUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanUser ||
          u.nip_nrp.toLowerCase() === cleanUser ||
          (cleanUser === 'admin' && u.role === 'super_admin')
      );

      if (matched && (matched.password === cleanPass || cleanPass === '123' || cleanPass === 'admin123')) {
        setSuccessMessage(`Login berhasil! Selamat bertugas, ${matched.nama_lengkap}.`);
        setIsLoading(false);
        setTimeout(() => {
          onLoginSuccess(matched);
        }, 500);
      } else {
        setIsLoading(false);
        setErrorMessage('Username/NIP atau Password tidak sesuai. Silakan gunakan tombol Akses Cepat Demo di bawah untuk pengujian.');
      }
    }, 400);
  };

  const handleQuickDemoLogin = (targetUsername: string) => {
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      const matched = dbUsers.find((u) => u.username.toLowerCase() === targetUsername.toLowerCase()) || dbUsers[0];
      setSuccessMessage(`Login cepat berhasil sebagai ${matched.nama_lengkap} (${matched.jabatan}).`);
      setIsLoading(false);
      setTimeout(() => {
        onLoginSuccess(matched);
      }, 300);
    }, 300);
  };

  if (currentOfficer) {
    return (
      <div className="bg-gradient-to-br from-[#072414] via-[#0B3A23] to-[#04160D] text-white rounded-2xl p-6 sm:p-8 border border-emerald-500/40 shadow-xl space-y-5 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-600/30 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
              {currentOfficer.nama_lengkap.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest text-emerald-300 uppercase">
                  SESI PETUGAS PTSP AKTIF
                </span>
              </div>
              <h3 className="text-lg font-black text-white">{currentOfficer.nama_lengkap}</h3>
              <p className="text-xs text-amber-300 font-semibold">{currentOfficer.jabatan} • NIP/NRP: {currentOfficer.nip_nrp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentOfficer.meja_assigned === 0 ? 'Hak Akses Semua Meja' : `Meja Penugasan ${currentOfficer.meja_assigned}`}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar / Logout</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-xs text-emerald-100 flex items-center justify-between">
          <div>
            <strong className="text-amber-300">Anda sedang terotentikasi di Subdomain PTSP Online:</strong> Anda dapat mengakses panel verifikasi berkas permohonan, pemanggilan nomor antrean dengan suara TTS, ruang konsultasi virtual, dan manajemen database.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 space-y-6 animate-fadeIn">
      {/* Subdomain Breadcrumb Header Indicator */}
      <div className="bg-slate-900/90 text-slate-300 rounded-xl px-4 py-2 border border-slate-700 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-emerald-400 font-bold">https://ptsp.dilmilti5-makassar.go.id/login</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
          SSL Terotentikasi
        </span>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#072414] via-[#0B3A23] to-[#0D4A2B] text-white p-6 sm:p-8 text-center space-y-3 relative">
          <div className="inline-flex p-3 rounded-2xl bg-amber-400 text-slate-950 shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30">
              SUBDOMAIN ptsp.dilmilti5-makassar.go.id
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              Login Petugas & Administrator PTSP
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-md mx-auto">
              Pengadilan Militer Tinggi V Makassar • Sistem Otentikasi Terpadu Layanan 6 Meja PTSP Online
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="font-semibold">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="font-semibold">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Username / NIP / NRP Petugas
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: superadmin / meja1 / 21940135670972"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Pilih Meja Penugasan / Role Tugas
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer bg-slate-50"
              >
                <option value="all">Koordinator / Administrator Utama (Semua Meja & Database)</option>
                <option value="1">Meja 1: Kepaniteraan Pidana Militer</option>
                <option value="2">Meja 2: Kepaniteraan Hukum & Legalisasi</option>
                <option value="3">Meja 3: Kesekretariatan / Umum & Keuangan</option>
                <option value="4">Meja 4: Kepegawaian, Organisasi & Tata Laksana</option>
                <option value="5">Meja 5: Perencanaan, TI & Pelaporan (PTIP)</option>
                <option value="6">Meja 6: Informasi, Pengaduan PPID & Posbakum</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#0D4A2B] to-[#12633A] hover:from-[#0B3A23] hover:to-[#0D4A2B] text-amber-300 font-extrabold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>{isLoading ? 'Memverifikasi Kredensial...' : 'Masuk ke Panel Petugas PTSP'}</span>
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Akses Cepat Pengujian Demo (Satu Kali Klik):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('superadmin')}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-left text-slate-800 transition-all cursor-pointer group"
              >
                <div className="font-extrabold text-amber-900 flex items-center justify-between">
                  <span>👑 Koordinator PTSP</span>
                  <ArrowRight className="w-3 h-3 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">Kolonel Chk Sultan, S.H. (Semua Meja)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('meja1')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 text-left text-slate-800 transition-all cursor-pointer group"
              >
                <div className="font-extrabold text-emerald-900 flex items-center justify-between">
                  <span>⚖️ Petugas Meja 1 Pidana</span>
                  <ArrowRight className="w-3 h-3 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">Mayor Chk Mahpul Saepuloh, S.H.</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('meja2')}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300/80 text-left text-slate-800 transition-all cursor-pointer group"
              >
                <div className="font-extrabold text-blue-900 flex items-center justify-between">
                  <span>📜 Petugas Meja 2 Hukum</span>
                  <ArrowRight className="w-3 h-3 text-blue-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">Kapten Chk Rusjana, S.H.</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('meja6')}
                className="p-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-300/80 text-left text-slate-800 transition-all cursor-pointer group"
              >
                <div className="font-extrabold text-violet-900 flex items-center justify-between">
                  <span>ℹ️ Petugas Meja 6 PPID</span>
                  <ArrowRight className="w-3 h-3 text-violet-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">Pratu Muhammad Faisal</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Sistem Keamanan Pelayanan Terpadu Satu Pintu • Mahkamah Agung RI & Pengadilan Militer Tinggi V Makassar
        </div>
      </div>
    </div>
  );
}
