import React, { useState } from 'react';
import { 
  Scale, 
  Calculator, 
  FileText, 
  ChevronRight, 
  Download, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  BookOpen,
  Sparkles,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import PedomanBukuII from './PedomanBukuII';

interface PanduanHukumSectionProps {
  onNavigate?: (section: any, subTab?: string) => void;
}

export default function PanduanHukumSection({ onNavigate }: PanduanHukumSectionProps) {
  const [activeTab, setActiveTab] = useState<'kasasi' | 'banding'>('banding');
  const [showInteractiveDetail, setShowInteractiveDetail] = useState(false);
  const [verdictDate, setVerdictDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Helper date formatting in Indonesian
  const formatIndonesianDate = (d: Date): string => {
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const parsedVerdictDate = new Date(verdictDate + 'T00:00:00');
  
  // Kasasi deadlines: 14 days calendar for petition, 14 days for memori
  const kasasiPermohonanDeadline = new Date(parsedVerdictDate);
  kasasiPermohonanDeadline.setDate(kasasiPermohonanDeadline.getDate() + 14);

  const kasasiMemoriDeadline = new Date(parsedVerdictDate);
  kasasiMemoriDeadline.setDate(kasasiMemoriDeadline.getDate() + 28);

  // Banding deadlines: 7 days calendar for declaration, 14 days for memori
  const bandingPernyataanDeadline = new Date(parsedVerdictDate);
  bandingPernyataanDeadline.setDate(bandingPernyataanDeadline.getDate() + 7);

  const bandingMemoriDeadline = new Date(parsedVerdictDate);
  bandingMemoriDeadline.setDate(bandingMemoriDeadline.getDate() + 14);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Diff days for current active tab
  const activeDeadline = activeTab === 'kasasi' ? kasasiPermohonanDeadline : bandingPernyataanDeadline;
  const diffTime = activeDeadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isPeriodActive = diffDays >= 0;

  const handleDownloadTemplate = (templateType: 'banding' | 'kasasi') => {
    const isKasasi = templateType === 'kasasi';
    const textContent = `================================================================================
MAHKAMAH AGUNG REPUBLIK INDONESIA
PENGADILAN MILITER TINGGI V MAKASSAR
Kepaniteraan Pidana Militer
================================================================================
FORMAT RESMI BLANGKO BERKAS PERKARA PIDANA MILITER (${isKasasi ? 'TINGKAT KASASI' : 'TINGKAT BANDING'})
Dasar Hukum: UU No. 31 Tahun 1997 & Pedoman Buku II SK KMA 159/KMA/SK.HK2/VIII/2026
================================================================================

Nama Terdakwa      : [Pangkat, Nama, NRP, Kesatuan]
Nomor Putusan Asal : [Nomor Register Putusan Pengadilan Militer]
Tanggal Diberitahukan: ${formatIndonesianDate(parsedVerdictDate)}

I. CHECKLIST KELENGKAPAN BERKAS:
1. Akta Permohonan / Pernyataan (${isKasasi ? 'Batas 14 Hari Kalender' : 'Batas 7 Hari Kalender'})
2. Relaas / Surat Pemberitahuan Putusan Sah
3. Naskah Memori Upaya Hukum (${isKasasi ? 'Memori Kasasi - Wajib' : 'Memori Banding'})
4. Tanda Terima Penyerahan Memori
5. Pemberitahuan Memori kepada Termohon / Oditur Militer
6. Hak Mempelajari Berkas Perkara (Inzage)
7. Berkas Bundel A & Bundel B terverifikasi

II. KETENTUAN SANKSI LEWAT WAKTU:
- Apabila tenggang waktu ${isKasasi ? '14' : '7'} hari kalender terlampaui tanpa pernyataan resmi, hak upaya hukum dinyatakan gugur dan putusan berkekuatan hukum tetap (BHT).

Dikeluarkan oleh Kepaniteraan Pengadilan Militer Tinggi V Makassar.`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Format_Resmi_Berkas_${isKasasi ? 'Kasasi' : 'Banding'}_Militer.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Format berkas resmi ${isKasasi ? 'Kasasi' : 'Banding'} berhasil diunduh.`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  if (showInteractiveDetail) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto pb-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#041C10] p-4 rounded-2xl border border-emerald-500/40 shadow-md">
          <div className="text-white text-xs">
            <span className="font-bold text-amber-300">PANDUAN LENGKAP:</span> Pedoman Buku II SK KMA 159/2026 (Alur Banding Pidana Militer)
          </div>
          <button
            type="button"
            onClick={() => setShowInteractiveDetail(false)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer transition-all shadow-md active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Ringkasan Panduan</span>
          </button>
        </div>
        <PedomanBukuII onNavigate={() => setShowInteractiveDetail(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#062013] via-[#0B3A23] to-[#04160D] text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              PORTAL PANDUAN HUKUM
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-mono border border-emerald-400/30">
              UU NO. 31 TAHUN 1997 &amp; SK KMA 159/2026
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white font-serif tracking-wide">
            Panduan Hak Upaya Hukum, Alur &amp; Tenggat Waktu Perkara Pidana Militer
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-3xl leading-relaxed">
            Panduan komprehensif bagi Prajurit TNI Terdakwa, Oditur Militer, Penasihat Hukum, dan Perwira Hukum mengenai perhitungan batas waktu banding (7 hari) dan kasasi (14 hari).
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-400 text-emerald-900 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Main Tab Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          <button 
            type="button"
            onClick={() => setActiveTab('banding')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'banding' 
                ? 'bg-emerald-800 text-amber-300 shadow-md ring-2 ring-amber-400/80 scale-102' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Batas 7 Hari: Banding Militer</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('kasasi')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'kasasi' 
                ? 'bg-emerald-800 text-amber-300 shadow-md ring-2 ring-amber-400/80 scale-102' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Batas 14 Hari: Kasasi Pidana Militer</span>
          </button>
        </div>

        {/* TAB 1: BANDING MILITER (7 HARI) */}
        {activeTab === 'banding' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  Batas 7 Hari
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  Infografis &amp; Kalkulator Tenggat Banding Militer
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Hitung batas akhir pernyataan banding, syarat memori banding, dan unduh format resmi berkas perkara.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInteractiveDetail(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
              >
                <span>Buka Infografis Interaktif</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Infografis Banding Card */}
              <div className="md:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Ketentuan Baku Banding Militer</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Pasal 225 UU 31/1997
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Pengajuan Pernyataan Banding:</strong> 7 hari kalender sesudah putusan dibacakan atau diberitahukan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Syarat Memori Banding:</strong> Oditur wajib melengkapi memori banding dalam 7 hari (lewat waktu gugur). Terdakwa berhak menyerahkan memori banding.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Hak Inzage:</strong> Mempelajari berkas perkara selama 7 hari kalender sebelum berkas dikirim ke Dilmilti V.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Biaya Perkara Banding:</strong> Rp 0,- (Dibiayai Negara).</span>
                  </li>
                </ul>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('banding')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Format Resmi Berkas Perkara</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowInteractiveDetail(true)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Infografis Alur Banding SK KMA 159</span>
                    <ChevronRight className="w-3 h-3 text-emerald-600" />
                  </button>
                </div>
              </div>

              {/* Kalkulator Banding Card */}
              <div className="md:col-span-6 bg-amber-50/60 p-5 rounded-2xl border-2 border-amber-300 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-amber-950 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-600" />
                    <span>Kalkulator Tenggat Waktu Banding (7 Hari)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded font-bold">
                    Hari Kalender
                  </span>
                </div>

                <div>
                  <label htmlFor="input-verdict-banding" className="block text-[11px] font-black text-slate-800 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tanggal Putusan Tingkat Pertama Dibacakan:</span>
                  </label>
                  <input
                    id="input-verdict-banding"
                    type="date"
                    value={verdictDate}
                    onChange={(e) => setVerdictDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-amber-200/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      1. Batas Akhir Pernyataan Banding:
                    </span>
                    <strong className="text-sm text-slate-900 font-black block mt-0.5">
                      {formatIndonesianDate(bandingPernyataanDeadline)}
                    </strong>
                    <span className="text-[10px] text-emerald-700 font-semibold">Tenggang waktu 7 hari kalender</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      2. Batas Penyerahan Memori Banding:
                    </span>
                    <strong className="text-sm text-slate-900 font-black block mt-0.5">
                      {formatIndonesianDate(bandingMemoriDeadline)}
                    </strong>
                    <span className="text-[10px] text-slate-600 font-semibold">Maksimal 14 hari sejak putusan</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  isPeriodActive ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950' : 'bg-rose-100 border-rose-300 text-rose-950'
                }`}>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block">Status Hak Banding:</span>
                    <span className="text-xs font-black">
                      {isPeriodActive ? (diffDays === 0 ? 'Hari Ini Batas Terakhir!' : `Tersisa ${diffDays} Hari Lagi`) : 'Tenggat Waktu Lewat (BHT)'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPeriodActive ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'
                  }`}>
                    {isPeriodActive ? 'Hak Aktif' : 'Kedaluwarsa'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KASASI MILITER (14 HARI) */}
        {activeTab === 'kasasi' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                Batas 14 Hari Kalender
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                Alur &amp; Tenggat Waktu Pengajuan Kasasi Pidana Militer (14 Hari Kalender)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Berdasarkan Pasal 244-246 UU No. 31 Tahun 1997 tentang Peradilan Militer ke Mahkamah Agung RI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Infografis Kasasi Card */}
              <div className="md:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Infografis Alur Permohonan Kasasi</span>
                  </h4>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Mahkamah Agung RI
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-slate-900 block">Pemberitahuan Sah Putusan Banding</strong>
                      <span className="text-[11px] text-slate-600">Putusan Dilmilti V diberitahukan resmi kepada Terdakwa &amp; Oditur Militer.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-slate-900 block">Akta Permohonan Kasasi (Maks. 14 Hari)</strong>
                      <span className="text-[11px] text-slate-600">Ditandatangani di Kepaniteraan pengadilan militer yang memutus tingkat pertama.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-slate-900 block">Penyerahan Memori Kasasi (14 Hari Berikutnya)</strong>
                      <span className="text-[11px] text-slate-600">Memori kasasi WAJIB diserahkan. Jika tidak, permohonan kasasi gugur demi hukum.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                    <div>
                      <strong className="text-slate-900 block">Pengiriman Berkas ke Mahkamah Agung</strong>
                      <span className="text-[11px] text-slate-600">Berkas perkara dikirim selambat-lambatnya 14 hari setelah memori diterima.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('kasasi')}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Format Akta &amp; Memori Kasasi</span>
                  </button>
                </div>
              </div>

              {/* Kalkulator Kasasi Card */}
              <div className="md:col-span-6 bg-amber-50/60 p-5 rounded-2xl border-2 border-amber-300 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-amber-950 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-600" />
                    <span>Kalkulator Tenggat Waktu Kasasi (14 Hari)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded font-bold">
                    Pasal 244 UU 31/1997
                  </span>
                </div>

                <div>
                  <label htmlFor="input-verdict-kasasi" className="block text-[11px] font-black text-slate-800 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tanggal Putusan Banding Diberitahukan Sah:</span>
                  </label>
                  <input
                    id="input-verdict-kasasi"
                    type="date"
                    value={verdictDate}
                    onChange={(e) => setVerdictDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-amber-200/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      1. Batas Permohonan Akta Kasasi:
                    </span>
                    <strong className="text-sm text-slate-900 font-black block mt-0.5">
                      {formatIndonesianDate(kasasiPermohonanDeadline)}
                    </strong>
                    <span className="text-[10px] text-emerald-700 font-semibold">Tenggang waktu 14 hari kalender</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      2. Batas Akhir Penyerahan Memori Kasasi:
                    </span>
                    <strong className="text-sm text-slate-900 font-black block mt-0.5">
                      {formatIndonesianDate(kasasiMemoriDeadline)}
                    </strong>
                    <span className="text-[10px] text-slate-600 font-semibold">Maksimal 14 hari setelah pernyataan kasasi</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  isPeriodActive ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950' : 'bg-rose-100 border-rose-300 text-rose-950'
                }`}>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block">Status Hak Kasasi:</span>
                    <span className="text-xs font-black">
                      {isPeriodActive ? (diffDays === 0 ? 'Hari Ini Batas Terakhir!' : `Tersisa ${diffDays} Hari Lagi`) : 'Tenggat Waktu Lewat (BHT)'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPeriodActive ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'
                  }`}>
                    {isPeriodActive ? 'Hak Aktif' : 'Kedaluwarsa'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
