import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar, 
  Scale, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  BookOpen, 
  ShieldCheck, 
  Send, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface PedomanBukuIIProps {
  onNavigate?: (section: any, subTab?: string) => void;
}

export default function PedomanBukuII({ onNavigate }: PedomanBukuIIProps) {
  // Calculator state
  const [verdictDate, setVerdictDate] = useState<string>(() => {
    // Default to today or a realistic current date
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  // Helper date formatting in Indonesian
  const formatIndonesianDate = (d: Date): string => {
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculations for Banding deadlines
  const parsedVerdictDate = new Date(verdictDate + 'T00:00:00');
  const bandingDeadlineDate = new Date(parsedVerdictDate);
  bandingDeadlineDate.setDate(bandingDeadlineDate.getDate() + 7);

  const memoriDeadlineDate = new Date(parsedVerdictDate);
  memoriDeadlineDate.setDate(memoriDeadlineDate.getDate() + 14);

  // Status calculation based on current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = bandingDeadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isBandingActive = diffDays >= 0;

  // Download generator
  const handleDownloadDoc = (fileName: string, title: string, code: string, desc: string) => {
    const textContent = `================================================================================
MAHKAMAH AGUNG REPUBLIK INDONESIA
DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA
PENGADILAN MILITER TINGGI V MAKASSAR
Jl. Perintis Kemerdekaan KM. 13, Daya, Biringkanaya, Kota Makassar 90243
================================================================================
DOKUMEN RESMI PEDOMAN BUKU II & STANDAR OPERASIONAL PROSEDUR (SOP)
Nomor Regulasi : ${code}
Nama Dokumen   : ${title}
Satuan Kerja   : Pengadilan Militer Tinggi V Makassar (PMT.V)
Tahun          : 2026
================================================================================

SUBSTANSI & URAIAN:
${desc}

I. KETENTUAN TENGGANG WAKTU (UU 31/1997 & SK KMA 159/KMA/SK.HK2/VIII/2026)
- Pembacaan Putusan: Hari ke-0
- Batas Pernyataan Akta Banding: Maksimal 7 Hari Kalender sejak putusan dibacakan/diberitahukan.
- Memori Banding & Hak Inzage: Maksimal 14 Hari sejak permohonan banding.
- Bundel A (24 Item) & Bundel B (11 Item): Dikirim maksimal 14 Hari ke PMT.V Makassar.
- Sikap Penahanan oleh Ketua Majelis Banding: Maksimal 3 Hari sejak berkas diterima.
- Minutasi Putusan Banding: Maksimal 14 Hari.
- Publikasi Putusan Banding: One Day Publish di portal direktori putusan.
- Biaya Perkara Tingkat Banding: Rp 0,- (Dibiayai Negara).

II. REGISTRASI & PENOMORAN PERKARA TINGKAT BANDING (PMT.V):
- Perkara Pidana Biasa/Kejahatan: Nomor 01-K/PMT.V/BDG/AD/I/2026
- Perkara Pidana Khusus (Koneksitas/Restitusi): Nomor 01-Sus/PMT.V/BDG/I/2026

Disahkan untuk kepentingan pelayanan hukum para pihak berperkara di lingkungan Pengadilan Militer Tinggi V Makassar.`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadFeedback(`Dokumen "${title}" berhasil diunduh.`);
    setTimeout(() => setDownloadFeedback(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Back button & breadcrumbs */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('panduan-hukum')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Panduan Hukum</span>
        </button>

        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          PMT.V • BUKU II MAHKAMAH AGUNG RI
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#062013] via-[#0B3A23] to-[#04160D] text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              PEDOMAN BUKU II RESMI
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-mono border border-emerald-400/30">
              SK KMA NOMOR 159/KMA/SK.HK2/VIII/2026
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 text-[10px] font-mono border border-slate-700">
              Format Berkas &amp; Putusan
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-3xl font-black text-white font-serif tracking-wide leading-tight">
              Alur Permohonan Banding Perkara Pidana Militer
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-2 max-w-4xl leading-relaxed">
              Berdasarkan Lampiran III Keputusan Ketua Mahkamah Agung RI Nomor 159/KMA/SK.HK2/VIII/2026 
              (Halaman 935–996 &amp; 1029–1033). Pedoman teknis administrasi dan yudisial penanganan perkara tingkat banding di Pengadilan Militer Tinggi V Makassar.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {downloadFeedback && (
        <div className="p-4 bg-emerald-100 border border-emerald-400 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{downloadFeedback}</span>
        </div>
      )}

      {/* Section 1: INFOGRAFIS RESMI PENGADILAN */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                INFOGRAFIS RESMI PENGADILAN
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Batas 7 Hari Kalender
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-2 flex items-center gap-2">
              <Scale className="w-6 h-6 text-emerald-700" />
              Alur &amp; Tenggat Waktu Pengajuan Banding Pidana Militer (7 Hari Kalender)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Panduan hak hukum bagi Prajurit TNI Terdakwa, Penasihat Hukum / Perwira Hukum, dan Oditur Militer.
            </p>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-600/40 rounded-2xl p-4 shrink-0 flex items-center gap-4 shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Biaya Perkara Banding</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-800">
                Rp 0,- <span className="text-xs font-semibold text-emerald-700">(Dibiayai Negara)</span>
              </div>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        {/* 5-Step Process Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {/* Step 1 */}
          <div className="bg-gradient-to-b from-slate-50 to-white p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-800/40">01</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">Hari ke-0</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 mt-1">Pembacaan Putusan</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                Putusan diucapkan dalam sidang terbuka di Pengadilan Militer (Dilmil) atau diberitahukan sah.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>Titik Awal Hitungan</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-b from-amber-50/50 to-white p-4 rounded-2xl border-2 border-amber-300 hover:border-amber-500 transition-all space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-500/50">02</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">Maks. 7 Hari</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 mt-1">Akta Banding</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                Pernyataan banding ditandatangani di Meja Kepaniteraan Dilmil pengaju / portal e-Court.
              </p>
            </div>
            <div className="pt-2 border-t border-amber-100 text-[10px] font-bold text-amber-900 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Lewat waktu = BHT</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-b from-slate-50 to-white p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-800/40">03</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">Maks. 14 Hari</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 mt-1">Memori &amp; Inzage</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                Penyerahan Memori Banding &amp; hak mempelajari berkas perkara (Inzage) oleh para pihak.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-700 flex items-center gap-1">
              <FileText className="w-3 h-3 text-emerald-600" />
              <span>Hak Membela Diri</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-b from-slate-50 to-white p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-800/40">04</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">Maks. 14 Hari</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 mt-1">Kirim ke Dilmilti V</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                Pengiriman Bundel A (24 item) &amp; Bundel B (11 item) ke Dilmilti V Makassar terintegrasi SIPP.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-700 flex items-center gap-1">
              <Send className="w-3 h-3 text-emerald-600" />
              <span>Caraka / e-Berpadu</span>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-gradient-to-b from-emerald-50/50 to-white p-4 rounded-2xl border-2 border-emerald-300 hover:border-emerald-500 transition-all space-y-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-800/40">05</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-700 text-white">Maks. 3 Bulan</span>
              </div>
              <h4 className="font-black text-sm text-slate-900 mt-1">Sidang &amp; Putusan</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                Pemeriksaan Majelis Hakim Tinggi, musyawarah, dan pembacaan putusan (One Day Publish).
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-100 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
              <Scale className="w-3 h-3 text-emerald-600" />
              <span>One Day Publish</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: SIMULASI & KALKULATOR HITUNG TENGGAT BANDING MILITER */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-emerald-50/30 rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-amber-200/80 pb-4">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>FITUR SIMULASI RESMI</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            Simulasi &amp; Kalkulator Hitung Tenggat Banding Militer
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Masukkan tanggal putusan tingkat pertama dibacakan untuk melihat batas akhir hak banding Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Date input form */}
          <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <label htmlFor="input-verdict-date" className="block text-xs font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Tanggal Putusan Dibacakan / Diberitahukan:</span>
              </label>
              <input
                id="input-verdict-date"
                type="date"
                value={verdictDate}
                onChange={(e) => setVerdictDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-sm font-semibold text-slate-900 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Putusan diucapkan dalam sidang terbuka atau diterima jurusita/caraka resmi.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Dasar Perhitungan Hukum:</span>
              <p>• Hari pembacaan/pemberitahuan dihitung sebagai Hari ke-0.</p>
              <p>• Tenggang waktu dihitung berdasarkan hari kalender (termasuk hari libur nasional/Sabtu-Minggu).</p>
            </div>
          </div>

          {/* Right: Results Display */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box 1: Batas Akhir Akta Banding */}
            <div className="bg-white p-5 rounded-2xl border-2 border-emerald-600/30 shadow-2xs space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                1. Batas Akhir Pernyataan Banding
              </span>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {formatIndonesianDate(bandingDeadlineDate)}
              </div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                Tenggang waktu 7 hari kalender
              </span>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                Harus menandatangani Akta Pernyataan Banding di Meja Banding Dilmil atau e-Court sebelum tanggal ini berakhir.
              </p>
            </div>

            {/* Box 2: Batas Penyerahan Memori Banding */}
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                2. Batas Penyerahan Memori Banding
              </span>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {formatIndonesianDate(memoriDeadlineDate)}
              </div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold">
                Maksimal 14 hari sejak putusan
              </span>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                Oditur Militer wajib menyerahkan memori banding (lewat waktu gugur). Terdakwa/PH sangat dianjurkan menyerahkan memori.
              </p>
            </div>

            {/* Box 3: Status Tenggat Waktu (Span 2) */}
            <div className={`sm:col-span-2 p-5 rounded-2xl border-2 shadow-2xs flex items-center justify-between gap-4 ${
              isBandingActive
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Status Tenggat Waktu
                </span>
                <div className="text-xl sm:text-2xl font-black">
                  {isBandingActive ? (
                    diffDays === 0 ? 'Hari Ini Batas Terakhir!' : `Tersisa ${diffDays} Hari Lagi`
                  ) : (
                    `Telah Lewat ${Math.abs(diffDays)} Hari (Kadaluwarsa)`
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {isBandingActive 
                    ? 'Hak upaya hukum banding masih aktif dan sah untuk didaftarkan.' 
                    : 'Batas 7 hari telah berakhir. Putusan Dilmil tingkat pertama memperoleh kekuatan hukum tetap (BHT).'}
                </p>
              </div>

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isBandingActive ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {isBandingActive ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: A. Penerimaan Berkas Elektronik vs B. Manual */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* A. e-Berpadu */}
        <div className="bg-white rounded-3xl border-2 border-emerald-900/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 font-black text-sm flex items-center justify-center shadow-xs">
              A
            </span>
            <div>
              <h3 className="font-black text-base text-slate-900">
                Penerimaan Berkas Secara Elektronik (e-Berpadu)
              </h3>
              <span className="text-[11px] font-mono text-emerald-800 font-bold">
                PERMA 8/2022 &amp; SK KMA 365/2022
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-emerald-700">1.</span>
              <p>Panitera Muda Pidana menerima berkas perkara pidana secara elektronik melalui aplikasi e-Berpadu;</p>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-emerald-700">2.</span>
              <p>Melakukan verifikasi kelengkapan berkas perkara elektronik sesuai dengan daftar periksa (checklist);</p>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-emerald-700">3.</span>
              <p>Terhadap berkas yang belum lengkap, Panmud Pidana memberikan notifikasi jenis dokumen yang harus dilengkapi oleh Oditur Militer/Tinggi atau Tim Tetap Koneksitas untuk dilimpahkan kembali.</p>
            </div>
          </div>
        </div>

        {/* B. Manual PTSP & e-Simpan */}
        <div className="bg-white rounded-3xl border-2 border-emerald-900/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 font-black text-sm flex items-center justify-center shadow-xs">
              B
            </span>
            <div>
              <h3 className="font-black text-base text-slate-900">
                Penerimaan Berkas Secara Manual (PTSP &amp; e-Simpan)
              </h3>
              <span className="text-[11px] font-mono text-emerald-800 font-bold">
                Hal. 935–936 &amp; 988
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-emerald-700">1.</span>
              <p>Petugas PTSP (Kepaniteraan) menerima berkas dan memeriksa checklist kelengkapan; jika belum lengkap dikembalikan kepada pengadilan pengaju / Caraka Oditurat;</p>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-emerald-700">2.</span>
              <p>Jika lengkap, diserahkan ke Petugas Kesekretariatan untuk diagendakan di buku agenda (manual) dan aplikasi e-Simpan terintegrasi;</p>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-emerald-700">3.</span>
              <p>Diserahkan ke Panitera untuk pengecekan formil, diteruskan ke Kepala Pengadilan Militer Tinggi, dan diregister oleh Panmud Pidana ke dalam SIPP &amp; e-Register Tingkat Banding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Format Baku Penomoran e-Register Perkara & Putusan */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/80 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              STANDARISASI MAHKAMAH AGUNG
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1">
              Format Baku Penomoran e-Register Perkara &amp; Putusan pada Pengadilan Militer Tinggi (Hal. 989 &amp; 1033)
            </h3>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold shrink-0">
            Kode Satker: PMT.V (Dilmilti V Makassar)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Item 1: Perkara Pidana Kejahatan */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-amber-300">1. Perkara Pidana Kejahatan Tingkat Banding:</h4>
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px]">Tingkat Banding</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl font-mono text-emerald-300 font-black text-sm border border-emerald-500/30">
              Nomor 01-K/PMT.V/BDG/AD/I/2026
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
              <strong className="text-white">01:</strong> Nomor Urut Register • <strong className="text-white">K:</strong> Kode Kejahatan • <strong className="text-white">PMT.V:</strong> Pengadilan Militer Tinggi V Makassar • <strong className="text-white">BDG:</strong> Banding • <strong className="text-white">AD/AL/AU:</strong> Matra Personel TNI • <strong className="text-white">I:</strong> Bulan (Romawi) • <strong className="text-white">2026:</strong> Tahun.
            </p>
          </div>

          {/* Item 2: Perkara Khusus */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-amber-300">2. Perkara Khusus (Koneksitas / Restitusi / Keberatan Pihak Ketiga):</h4>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">Perkara Khusus</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl font-mono text-emerald-300 font-black text-sm border border-emerald-500/30">
              Nomor 01-Sus/PMT.V/BDG/I/2026
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
              <strong className="text-white">Sus:</strong> Kode Perkara Khusus (Koneksitas, Permohonan Kompensasi/Restitusi, atau Keberatan Pihak Ketiga Beriktikad Baik atas Perampasan Barang Tipikor). Pangkat Lokal Hakim ditulis &ldquo;Lok&rdquo; &amp; Tituler ditulis &ldquo;Tit&rdquo;.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: 4 Pilar Prosedur Banding */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center">
            1
          </div>
          <h4 className="font-black text-sm text-slate-900">
            Pernyataan &amp; Memori Banding (7 Hari)
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Diajukan maks. 7 hari sesudah putusan diucapkan/diberitahukan (atau 14 hari elektronik keadaan khusus). Oditur wajib menyerahkan memori banding dalam 7 hari (jika lewat waktu gugur).
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center">
            2
          </div>
          <h4 className="font-black text-sm text-slate-900">
            Inzage (7 Hari) &amp; Bundel A + B (14 Hari)
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Kesempatan mempelajari berkas (Inzage) 7 hari dengan tembusan Ankum. Berkas Bundel A (24 item) &amp; Bundel B (11 item) dikirim dalam 14 hari sejak permohonan banding.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center">
            3
          </div>
          <h4 className="font-black text-sm text-slate-900">
            Sikap Penahanan (3 Hari) &amp; Pemeriksaan
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Kewenangan penahanan beralih ke Dilmilti. Ketua Majelis dalam 3 hari wajib menentukan sikap penahanan Terdakwa. Penyelesaian perkara tingkat banding maksimal 3 bulan.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center">
            4
          </div>
          <h4 className="font-black text-sm text-slate-900">
            One Day Publish, Minutasi (14 Hari) &amp; Kirim (7 Hari)
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Publikasi putusan wajib di hari yang sama (One Day Publish), minutasi selesai maks. 14 hari, dan pengiriman salinan putusan + Bundel A ke Dilmil pengaju maks. 7 hari.
          </p>
        </div>
      </section>

      {/* Section 6: UNDUH DOKUMEN RESMI */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            PUSAT UNDUHAN BERKAS
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2 flex items-center gap-2">
            <Download className="w-6 h-6 text-emerald-700" />
            Unduh Dokumen Resmi Pedoman Tata Cara Berperkara &amp; Pemeriksaan Banding
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            File resmi berformat digital untuk panduan instansi militer, caraka oditurat, dan perwira hukum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Doc 1 */}
          <div className="p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all space-y-3 flex flex-col justify-between bg-slate-50/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-emerald-800">159/KMA/SK.HK2/VIII/2026 • PDF (4.2 MB)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">Buku II MA RI</span>
              </div>
              <h4 className="font-black text-sm text-slate-900">
                Pedoman Teknis Administrasi &amp; Teknis Peradilan Militer (Buku II SK KMA 159/KMA/SK.HK2/VIII/2026)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pedoman resmi Mahkamah Agung RI tentang penerimaan berkas perkara elektronik (e-Berpadu) dan manual (PTSP), format penomoran register PMT.V, serta tenggang waktu pemeriksaan banding.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleDownloadDoc(
                'Pedoman_Buku_II_SK_KMA_159_2026.txt',
                'Pedoman Teknis Administrasi & Teknis Peradilan Militer (Buku II)',
                '159/KMA/SK.HK2/VIII/2026',
                'Pedoman resmi Mahkamah Agung RI tentang penerimaan berkas perkara elektronik (e-Berpadu) dan manual (PTSP), format penomoran register PMT.V, serta tenggang waktu pemeriksaan banding.'
              )}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Dokumen Buku II</span>
            </button>
          </div>

          {/* Doc 2 */}
          <div className="p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all space-y-3 flex flex-col justify-between bg-slate-50/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-emerald-800">W5-Mil.01/SOP.PID/I/2026/01 • PDF (1.8 MB)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">SOP Kepaniteraan</span>
              </div>
              <h4 className="font-black text-sm text-slate-900">
                SOP Penerimaan Berkas Perkara Banding &amp; Checklist Kelengkapan Bundel A (24 Item) &amp; Bundel B (11 Item)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standar Operasional Prosedur verifikasi kelengkapan berkas perkara tingkat banding, penentuan sikap penahanan 3 hari, dan minutasi putusan 14 hari.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleDownloadDoc(
                'SOP_Penerimaan_Berkas_Banding_Bundel_A_B.txt',
                'SOP Penerimaan Berkas Perkara Banding & Checklist Bundel A & B',
                'W5-Mil.01/SOP.PID/I/2026/01',
                'Standar Operasional Prosedur verifikasi kelengkapan berkas perkara tingkat banding, penentuan sikap penahanan 3 hari, checklist Bundel A (24 item) dan Bundel B (11 item), serta minutasi putusan 14 hari.'
              )}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh SOP &amp; Checklist Bundel A &amp; B</span>
            </button>
          </div>
        </div>

        {/* Prosedur Kasasi Link */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-amber-700 shrink-0" />
            <div className="text-xs text-slate-700">
              <span className="font-bold text-slate-900">Perkara Tingkat Kasasi?</span> Untuk tenggat waktu dan alur pengajuan Kasasi Militer ke Mahkamah Agung RI (14 hari kalender).
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate('panduan-hukum');
              }
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Unduh untuk prosedur kasasi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
