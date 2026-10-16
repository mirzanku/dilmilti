import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Download,
  AlertCircle,
  HelpCircle,
  Scale,
  Award,
  Layers,
  ChevronRight,
  Search,
  LogIn,
  Ticket,
  Video,
  QrCode,
  FileCheck,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { KATALOG_6_MEJA_PTSP, PTSPMejaCatalogItem } from '../data/ptspDatabase';
import { UserAccount } from '../types';
import PtspInfografisAlurSection from './ptsp/PtspInfografisAlurSection';

interface PtspInfoMenuSectionProps {
  onNavigate?: (section: any, subTab?: string) => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
  onOpenPtspOnline?: (initialTab?: string, serviceName?: string) => void;
}

export default function PtspInfoMenuSection({
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenPtspOnline
}: PtspInfoMenuSectionProps) {
  const [selectedMejaId, setSelectedMejaId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeMeja = KATALOG_6_MEJA_PTSP.find((m) => m.mejaId === selectedMejaId) || KATALOG_6_MEJA_PTSP[0];

  const handleGoToPtspOnline = (tab?: string, serviceName?: string) => {
    window.open(`/?tab=ptsp-online&sub=${tab || 'app-viewer'}${serviceName ? `&service=${encodeURIComponent(serviceName)}` : ''}`, '_blank');
  };

  // Filtered services across all desks if user searches
  const isSearching = searchQuery.trim().length > 0;
  const filteredServices = isSearching
    ? KATALOG_6_MEJA_PTSP.flatMap((meja) =>
        meja.layananList
          .filter(
            (srv) =>
              srv.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
              srv.syarat.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
              meja.namaMeja.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((srv) => ({ ...srv, meja }))
      )
    : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Breadcrumb Ringkas */}
      <div className="bg-gradient-to-r from-[#072414] via-[#0B3A23] to-[#04160D] text-white rounded-2xl px-4 py-3 sm:px-6 sm:py-3.5 border border-emerald-500/30 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('beranda')}
            className="text-emerald-300 hover:text-amber-300 font-bold transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <span className="text-emerald-500 font-bold">/</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('publik', 'jenis-layanan')}
            className="text-emerald-300 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
          >
            Layanan Publik
          </button>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-amber-300 font-black tracking-wide">
            Keterangan Jenis & Syarat Pelayanan PTSP
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Biaya: Rp 0,- (Bebas Biaya)
          </span>
          <span className="text-[11px] font-mono text-emerald-200/80 hidden sm:inline">
            Dilmilti V Makassar
          </span>
        </div>
      </div>

      {/* 2. HERO CALL-TO-ACTION BANNER MENUJU APLIKASI PTSP ONLINE (SUBDOMAIN) */}
      <div className="bg-gradient-to-br from-[#052012] via-[#0D4A2B] to-[#052615] rounded-3xl p-6 sm:p-8 text-white border-2 border-amber-400/80 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SUBDOMAIN RESMI: ptsp.dilmilti5-makassar.go.id</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Ingin Mengajukan Permohonan Mandiri Secara Online?
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Halaman ini memuat <strong>seluruh keterangan jenis layanan dan syarat-syarat pelayanan PTSP</strong>. 
              Untuk melakukan pengajuan permohonan berkas online, melacak status tiket, mengambil nomor antrean digital, monitor TV, atau konsultasi tatap muka virtual, silakan masuk ke aplikasi PTSP Online melalui tombol di bawah.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Upload Berkas & Tiket Real-time</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Antrean Online & Suara TTS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Surat Balasan Ber-TTE BSrE</span>
              </div>
            </div>
          </div>

          {/* Action Button & Login Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleGoToPtspOnline('permohonan')}
              className="px-6 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all hover:scale-102 cursor-pointer group"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Buka Aplikasi PTSP Online</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleGoToPtspOnline('login')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-amber-300 font-bold text-xs rounded-2xl border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Halaman Login Petugas / Admin PTSP</span>
            </button>
          </div>
        </div>

        {/* Quick Shortcut Buttons to Subdomain Features */}
        <div className="pt-4 border-t border-emerald-500/20 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => handleGoToPtspOnline('permohonan')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer flex items-center gap-2 text-emerald-100 hover:text-amber-300"
          >
            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">Formulir Online</span>
          </button>
          <button
            type="button"
            onClick={() => handleGoToPtspOnline('lacak')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer flex items-center gap-2 text-emerald-100 hover:text-amber-300"
          >
            <Search className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">Lacak Berkas & TTE</span>
          </button>
          <button
            type="button"
            onClick={() => handleGoToPtspOnline('antrean')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer flex items-center gap-2 text-emerald-100 hover:text-amber-300"
          >
            <Ticket className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">Antrean Digital</span>
          </button>
          <button
            type="button"
            onClick={() => handleGoToPtspOnline('konsultasi')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer flex items-center gap-2 text-emerald-100 hover:text-amber-300"
          >
            <Video className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">Konsultasi Virtual</span>
          </button>
        </div>
      </div>

      {/* 3. Operational Standards & Jam Layanan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#0D4A2B] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Jam Pelayanan Loket</div>
            <div className="font-black text-slate-900 text-xs mt-0.5">Senin - Kamis: 08:00 - 16:30 WITA</div>
            <div className="text-[11px] text-slate-600">Jumat: 08:00 - 17:00 WITA (Istirahat 11:30 - 13:00)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Standar Biaya Layanan</div>
            <div className="font-black text-emerald-700 text-sm mt-0.5">Rp 0,- (100% BEBAS BIAYA)</div>
            <div className="text-[11px] text-slate-600">Pasal 248 UU No. 31/1997 & Beban Negara</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Maklumat Pelayanan</div>
            <div className="font-bold text-slate-900 text-xs mt-0.5">Pelayanan Cepat, Tepat & Transparan</div>
            <div className="text-[11px] text-slate-600">SK KMA No. 026/KMA/SK/II/2012</div>
          </div>
        </div>
      </div>

      {/* 4. PENCARIAN CEPAT PERSYARATAN LAYANAN */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jenis layanan atau syarat (contoh: SKTPD, banding, kasasi, legalisasi)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="text-xs text-slate-500 text-right w-full sm:w-auto">
          Menampilkan seluruh keterangan resmi <strong>6 Meja Layanan PTSP</strong>
        </div>
      </div>

      {/* JIKA USER MENCARI */}
      {isSearching ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Hasil Pencarian: "{searchQuery}" ({filteredServices.length} jenis layanan ditemukan)
            </h3>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900">
                      {srv.meja.namaMeja}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-1.5">{srv.nama}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 whitespace-nowrap">
                    {srv.biaya}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Syarat-Syarat Pelayanan:</span>
                  </div>
                  <ul className="space-y-1 pl-4 text-xs text-slate-700 list-disc">
                    {srv.syarat.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500 text-[11px]">
                    SLA: <strong className="text-slate-800">{srv.sla}</strong> • Output: {srv.outputDokumen}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGoToPtspOnline('permohonan', srv.nama)}
                    className="px-3 py-1.5 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ajukan Online</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TAMPILAN NORMAL: 6 MEJA SELECTOR & RINCIAN LENGKAP */
        <div className="space-y-6">
          {/* Desk Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {KATALOG_6_MEJA_PTSP.map((meja) => {
              const isSelected = meja.mejaId === selectedMejaId;
              return (
                <button
                  key={meja.mejaId}
                  type="button"
                  onClick={() => setSelectedMejaId(meja.mejaId)}
                  className={`p-3 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0D4A2B] text-white border-amber-400 shadow-md ring-2 ring-amber-400/50'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono font-black text-xs px-2 py-0.5 rounded ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {meja.kodeAntrean}
                    </span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                      {meja.layananList.length} Layanan
                    </span>
                  </div>

                  <div className="mt-2 font-black text-xs line-clamp-1">{meja.namaMeja.split(':')[0]}</div>
                  <div className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {meja.subNama}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Desk Profile */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header of Active Meja */}
            <div className="bg-gradient-to-r from-slate-900 via-[#072414] to-[#0D4A2B] text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 font-mono">
                    KODE ANTREAN: {activeMeja.kodeAntrean}
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">{activeMeja.subNama}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">{activeMeja.namaMeja}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">{activeMeja.deskripsi}</p>
              </div>

              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 text-xs shrink-0 space-y-1">
                <div className="text-emerald-300 text-[10px] uppercase font-bold">Penanggung Jawab & Petugas:</div>
                <div className="font-black text-white">{activeMeja.penanggungJawab}</div>
                <div className="text-[11px] text-amber-300">Petugas Meja: {activeMeja.petugasJaga}</div>
                <div className="text-[11px] text-slate-300">SLA: {activeMeja.estimasiWaktu}</div>
              </div>
            </div>

            {/* List of Services and Requirements */}
            <div className="p-5 sm:p-7 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Daftar Jenis Layanan & Syarat-Syarat Pelayanan Pada {activeMeja.namaMeja.split(':')[0]}</span>
                </h4>
                <span className="text-xs font-bold text-slate-500">
                  Total: {activeMeja.layananList.length} Jenis Layanan
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {activeMeja.layananList.map((service, index) => (
                  <div
                    key={service.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-500 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#0D4A2B] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <h5 className="font-extrabold text-slate-900 text-sm leading-snug">
                            {service.nama}
                          </h5>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 shrink-0">
                          {service.biaya}
                        </span>
                      </div>

                      {/* Syarat-Syarat Pelayanan */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Syarat-Syarat Pelayanan / Berkas Dokumen:</span>
                        </div>
                        <ul className="space-y-1.5 pl-5 text-xs text-slate-700 list-disc">
                          {service.syarat.map((syaratItem, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {syaratItem}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Meta Waktu & Output */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                          <div className="text-[10px] font-bold text-slate-500 uppercase">Waktu Penyelesaian:</div>
                          <div className="font-black text-emerald-900 mt-0.5">{service.sla}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                          <div className="text-[10px] font-bold text-slate-500 uppercase">Output Dokumen:</div>
                          <div className="font-bold text-blue-900 mt-0.5 text-[11px] truncate" title={service.outputDokumen}>
                            {service.outputDokumen}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Ajukan Online via Subdomain */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Tersedia di PTSP Online</span>
                      <button
                        type="button"
                        onClick={() => handleGoToPtspOnline('permohonan', service.nama)}
                        className="px-3.5 py-1.5 bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-102"
                      >
                        <span>Ajukan Layanan Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Infografis Langkah-demi-Langkah Alur Pelayanan 6 Meja PTSP */}
      <PtspInfografisAlurSection
        onNavigateToPtspOnline={handleGoToPtspOnline}
        onNavigateToSection={onNavigate}
      />

      {/* 6. Dasar Hukum & SK SOP Penyelenggaraan PTSP */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-black text-white">Dasar Hukum & Regulasi Resmi PTSP</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-extrabold text-amber-300">Undang-Undang Nomor 31 Tahun 1997</div>
            <div className="text-slate-400 text-[11px]">Tentang Peradilan Militer (Pasal 248 mengenai biaya perkara peradilan militer yang dibebankan kepada negara).</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-extrabold text-amber-300">SK KMA No. 026/KMA/SK/II/2012</div>
            <div className="text-slate-400 text-[11px]">Tentang Standar Pelayanan Peradilan pada Mahkamah Agung Republik Indonesia dan Badan Peradilan di Bawahnya.</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-extrabold text-amber-300">SK KMA No. 2-144/KMA/SK/VIII/2022</div>
            <div className="text-slate-400 text-[11px]">Tentang Standar Pelayanan Informasi Publik di Pengadilan & Pedoman Pengelolaan PPID.</div>
          </div>
        </div>

        {/* Download Dokumen SK & SOP */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-300 text-[11px]">
            Dokumen SK Pengelola PTSP dan SOP 6 Meja TA 2026 telah ditandatangani dan berlaku efektif.
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/SK_PTSP_DILMILTI_V_MAKASSAR.pdf"
              download="SK_PTSP_DILMILTI_V_MAKASSAR.pdf"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh SK PTSP 2026 (PDF)</span>
            </a>
            <a
              href="/SOP_PELAYANAN_6_MEJA_PTSP.pdf"
              download="SOP_PELAYANAN_6_MEJA_PTSP.pdf"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh SOP 6 Meja (PDF)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
