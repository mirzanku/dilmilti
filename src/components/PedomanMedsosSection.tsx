import React, { useState } from 'react';
import {
  FileText,
  Share2,
  Download,
  ExternalLink,
  ShieldCheck,
  Users,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Camera,
  Layers,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Scale,
  Lock,
  Compass,
  Building2,
  X,
  FileCheck,
  Copy,
  Check
} from 'lucide-react';

interface PedomanMedsosSectionProps {
  onNavigate?: (tab: string, subTab?: string) => void;
}

export default function PedomanMedsosSection({ onNavigate }: PedomanMedsosSectionProps) {
  const [activeTab, setActiveTab] = useState<'struktur' | 'sop' | 'ai' | 'etika' | 'penulisan' | 'keamanan'>('struktur');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const pdfPath = '/assets/aistudio/2026sk-sekma14106_a0e8391d.pdf';

  const handleCopyLink = () => {
    const fullUrl = window.location.origin + window.location.pathname + '?tab=berita&subTab=pedoman-medsos';
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // SOP Steps based on Lampiran II SK Sekma 14106/2026
  const sopSteps = [
    {
      no: 1,
      kegiatan: 'Melakukan Perencanaan konten sesuai dengan kalender konten',
      pelaksana: 'Penyusun Konten, Koordinator, Penanggung Jawab',
      kelengkapan: 'Rencana konten dan kalender konten',
      waktu: '2 Hari',
      output: 'Rancangan konten'
    },
    {
      no: 2,
      kegiatan: 'Memberikan instruksi pembuatan konten',
      pelaksana: 'Koordinator ke Penyusun Konten',
      kelengkapan: 'Draf arahan konten',
      waktu: '1 Hari',
      output: 'Draf konten terarah'
    },
    {
      no: 3,
      kegiatan: 'Membuat konsep konten',
      pelaksana: 'Penyusun Konten & Administrator',
      kelengkapan: 'Brief & naskah awal',
      waktu: '1 Hari',
      output: 'Konsep naskah/visual'
    },
    {
      no: 4,
      kegiatan: 'Menyiapkan bahan konten berupa grafis/foto/video',
      pelaksana: 'Fotografer / Videografer & Perancang Grafis',
      kelengkapan: 'Materi foto, video, stock shoot',
      waktu: '1 Hari',
      output: 'Aset visual mentah'
    },
    {
      no: 5,
      kegiatan: 'Memproduksi konten (desain grafis / video editing)',
      pelaksana: 'Perancang Infografis & Videografis',
      kelengkapan: 'Aset desain & software produksi',
      waktu: '3 Hari',
      output: 'Konten Medsos Siap Review'
    },
    {
      no: 6,
      kegiatan: 'Melakukan penyuntingan naskah & akurasi konten (PUEBI/5W1H)',
      pelaksana: 'Editor Naskah & Penyusun Konten',
      kelengkapan: 'Konten Medsos',
      waktu: '1 Hari',
      output: 'Konten terverifikasi bahasa'
    },
    {
      no: 7,
      kegiatan: 'Memperbaiki konten (apabila terdapat catatan koreksi)',
      pelaksana: 'Perancang Infografis/Videografis & Penulis',
      kelengkapan: 'Catatan koreksi verifikator',
      waktu: '2 Hari',
      output: 'Konten final revisi'
    },
    {
      no: 8,
      kegiatan: 'Menyetujui konten untuk publikasi resmi',
      pelaksana: 'Penanggung Jawab (Sekretaris) & Pembina (Hakim/Jubir)',
      kelengkapan: 'Lembar persetujuan naskah',
      waktu: '1 Hari',
      output: 'Dokumen Persetujuan Publikasi'
    },
    {
      no: 9,
      kegiatan: 'Memposting konten pada platform media sosial & media massa resmi',
      pelaksana: 'Administrator Media Sosial & Media Massa',
      kelengkapan: 'Akun dinas terverifikasi 2FA',
      waktu: '1 Hari',
      output: 'Konten Tayang & Tautan URL'
    },
    {
      no: 10,
      kegiatan: 'Membuat laporan tentang publikasi konten pada media sosial',
      pelaksana: 'Administrator Media Sosial ke Koordinator',
      kelengkapan: 'Data analitik & tautan unggahan',
      waktu: '1 Hari',
      output: 'Laporan Publikasi'
    },
    {
      no: 11,
      kegiatan: 'Melakukan evaluasi konten berkala (analitik, jangkauan, respon)',
      pelaksana: 'Koordinator & Penanggung Jawab',
      kelengkapan: 'Metrik interaksi & engagement',
      waktu: '1 Hari',
      output: 'Laporan Evaluasi Bulanan'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner Regulasi Resmi */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#041A0F] via-[#09321E] to-[#041A0F] border-2 border-amber-400 p-6 text-white shadow-2xl">
        <div className="absolute inset-0 bg-military-camo-pattern opacity-15 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Scale className="w-3.5 h-3.5 text-slate-950" />
                <span>REGULASI RESMI MAHKAMAH AGUNG RI</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/50 text-emerald-200 font-mono text-[11px] font-bold">
                NOMOR : 14106/SEK/SK.HM1.1/X/2026
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                Ditetapkan: 9 Oktober 2026
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-serif tracking-tight leading-snug">
              Pedoman Pengelolaan Media Massa dan Media Sosial
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans">
              Keputusan Sekretaris Mahkamah Agung RI tentang Standar Pengelolaan Media Massa, Akun Media Sosial Dinas, 
              SOP Publikasi 11 Langkah, Etika Interaksi & Komentar SIWAS, serta Tata Kelola Pemanfaatan Kecerdasan Buatan (Artificial Intelligence) 
              di Lingkungan Mahkamah Agung dan 4 Lingkungan Badan Peradilan Termasuk Pengadilan Militer Tinggi V Makassar.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/90 pt-1">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Ditandatangani oleh Plt. Sekretaris Mahkamah Agung RI (<strong>Sobandi</strong>)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sertifikasi Elektronik BSrE BSSN</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Eye className="w-4 h-4 text-slate-950" />
              <span>Baca Dokumen SK Asli</span>
            </button>

            <a
              href={pdfPath}
              download="SK_Sekma_14106_2026_Pedoman_Medsos_Mahkamah_Agung.pdf"
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-emerald-400/50 shadow-md transition-all"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>Unduh PDF (418 KB)</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-amber-400/30 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedLink ? 'Tautan Disalin!' : 'Salin Tautan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-md">
        {[
          { id: 'struktur', label: 'Struktur Tim Pengelola', icon: Users },
          { id: 'sop', label: 'SOP Publikasi 11 Langkah', icon: Clock },
          { id: 'ai', label: 'Tata Kelola Kecerdasan Buatan (AI)', icon: Sparkles },
          { id: 'etika', label: 'Etika Komentar & SIWAS', icon: MessageSquare },
          { id: 'penulisan', label: 'Standar 5W+1H & Koreksi', icon: BookOpen },
          { id: 'keamanan', label: 'Akun Medsos & 2FA', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: STRUKTUR TIM PENGELOLA (BAB D) */}
      {activeTab === 'struktur' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
              LAMPIRAN I BAB D SK SEKMA NO. 14106/2026
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <span>Struktur Tim Pengelola Media Massa & Medsos Pengadilan Militer Tinggi V Makassar</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Berdasarkan Lampiran I Bab D angka 1 huruf b dan angka 2 huruf b, struktur tim pengelola pada pengadilan tingkat banding ditetapkan melalui Keputusan Kepala Pengadilan Militer Tinggi V Makassar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pembina */}
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                <h4 className="text-sm font-extrabold text-slate-900">PEMBINA</h4>
              </div>
              <p className="text-xs font-bold text-amber-900">Hakim / Juru Bicara Pengadilan</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Ditunjuk oleh Kepala Pengadilan Militer Tinggi V Makassar. Bertugas memberikan arahan, mengawasi kepatuhan hukum acara/independensi peradilan, serta verifikasi konten yudisial.
              </p>
            </div>

            {/* Penanggung Jawab */}
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">2</span>
                <h4 className="text-sm font-extrabold text-slate-900">PENANGGUNG JAWAB</h4>
              </div>
              <p className="text-xs font-bold text-emerald-900">Sekretaris Pengadilan</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Memastikan akurasi dan objektivitas informasi, melakukan verifikasi dan persetujuan publikasi (approval), pemantauan krisis komunikasi, serta penyediaan sarana prasarana.
              </p>
            </div>

            {/* Koordinator */}
            <div className="p-4 rounded-xl border border-sky-300 bg-sky-50/60 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center">3</span>
                <h4 className="text-sm font-extrabold text-slate-900">KOORDINATOR PENGELOLA</h4>
              </div>
              <p className="text-xs font-bold text-sky-900">Kepala Bagian (Perencanaan & Kepegawaian)</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Mengoordinasikan kalender konten bulanan, mengarahkan produksi konten visual/naskah, mengelola respon interaksi publik, dan menyusun evaluasi berkala bulanan.
              </p>
            </div>
          </div>

          {/* Tim Pelaksana Teknis */}
          <div className="pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
              Divisi Teknis Pelaksana Pengelolaan Konten (Bab D angka 4, 5, 6)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-extrabold text-slate-900 block">Perancang Infografis & Video</span>
                <span className="text-[11px] text-slate-600 block">Menyiapkan desain visual, infografis layanan, layout feed, dan penyuntingan video dinas.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-extrabold text-slate-900 block">Fotografer & Videografer</span>
                <span className="text-[11px] text-slate-600 block">Mendokumentasikan kegiatan persidangan, stock shoot pejabat, audio latar, dan voice over.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-extrabold text-slate-900 block">Penulis & Editor Naskah</span>
                <span className="text-[11px] text-slate-600 block">Menyusun naskah 5W+1H, takarir (caption), memastikan kaidah PUEBI, SEO, dan tagar terindeks.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-extrabold text-slate-900 block">Administrator Medsos & Media</span>
                <span className="text-[11px] text-slate-600 block">Mengoperasikan akun resmi (2FA aktif), publikasi rilis pers, tanggapan komentar, dan laporan analitik.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STANDAR OPERASIONAL PROSEDUR (LAMPIRAN II) */}
      {activeTab === 'sop' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
                LAMPIRAN II SK SEKMA NO. 14106/2026
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <span>Standar Operasional Prosedur (SOP) Publikasi Media Sosial — 11 Langkah Kerja Baku</span>
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Total SLA: 16 Hari Kerja Maksimal
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-mono text-[11px]">
                  <th className="py-2.5 px-3 rounded-l-lg text-center w-10">No</th>
                  <th className="py-2.5 px-3">Tahapan Kegiatan Publikasi</th>
                  <th className="py-2.5 px-3">Pelaksana Terlibat</th>
                  <th className="py-2.5 px-3">Kelengkapan Input</th>
                  <th className="py-2.5 px-3 text-center">Waktu Maks.</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Output Hasil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {sopSteps.map((s, idx) => (
                  <tr key={s.no} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70 hover:bg-amber-50/40'}>
                    <td className="py-2.5 px-3 font-bold text-center text-slate-900">{s.no}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{s.kegiatan}</td>
                    <td className="py-2.5 px-3 text-emerald-800 font-medium">{s.pelaksana}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.kelengkapan}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-700 bg-amber-50/50">
                      {s.waktu}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{s.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TATA KELOLA KECERDASAN BUATAN (BAB K) */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
              LAMPIRAN I BAB K SK SEKMA NO. 14106/2026
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Tata Kelola Pemanfaatan Kecerdasan Buatan (Artificial Intelligence) di Peradilan</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Prinsip etika ketat pemanfaatan AI generatif untuk produksi media massa dan media sosial lembaga peradilan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kewajiban & Prinsip */}
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kewajiban Tata Kelola AI (Bab K angka 1, 5, 6, 7)</span>
              </h4>
              <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
                <li>
                  <strong>Hanya Sebagai Alat Bantu:</strong> AI generatif hanya alat bantu operasional dan <em>tidak menggantikan kewenangan serta tanggung jawab pejabat</em>.
                </li>
                <li>
                  <strong>Human-in-the-Loop Wajib:</strong> Setiap naskah, gambar, audio, atau video AI wajib diperiksa dan disetujui koordinator sebelum dipublikasikan.
                </li>
                <li>
                  <strong>Watermark / Keterangan Konten AI:</strong> Materi visual yang sepenuhnya dihasilkan AI wajib mencantumkan keterangan: <br />
                  <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-900 font-mono text-[10px] rounded border border-amber-300">
                    "Konten ini dibuat dengan bantuan Kecerdasan Buatan (AI)"
                  </span>
                </li>
                <li>
                  <strong>Pengaburan Wajah (Blurring):</strong> Wajah pihak berperkara, pencari keadilan, dan anak-anak wajib dikaburkan bila diolah teknologi visual AI.
                </li>
              </ul>
            </div>

            {/* Larangan Keras */}
            <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/50 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Larangan Pemanfaatan AI (Bab K angka 2, 4, 9)</span>
              </h4>
              <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
                <li>
                  <strong>Dilarang Rekayasa Logo & Pimpinan:</strong> Dilarang keras memanipulasi atau merekayasa logo Mahkamah Agung / Satker serta foto pimpinan dan hakim agung yang mengubah identitas, bentuk, konteks, atau maknanya.
                </li>
                <li>
                  <strong>Perlindungan Data Pribadi (UU 77/2022):</strong> Foto pimpinan/aparatur yang belum dipublikasikan dilarang diunggah ke platform AI publik pihak ketiga.
                </li>
                <li>
                  <strong>Larangan Mutlak Deepfake:</strong> Teknologi AI dilarang keras digunakan untuk membuat konten tiruan (deepfake) yang menyesatkan publik.
                </li>
                <li>
                  <strong>Tanggung Jawab Hukum:</strong> Pengelola media massa dan media sosial tetap bertanggung jawab penuh atas keakuratan dan isi informasi.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ETIKA KOMENTAR & KANAL SIWAS (BAB I) */}
      {activeTab === 'etika' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
              LAMPIRAN I BAB I SK SEKMA NO. 14106/2026
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              <span>Etika Interaksi, Tanggapan Resmi, dan Kanal Pengaduan SIWAS Mahkamah Agung</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Panduan etis berinteraksi di ruang publik daring, format jawaban resmi, dan tata kelola moderasi kolom komentar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Format Jawaban */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">Format Resmi</span>
              <h4 className="text-sm font-extrabold text-slate-900">Format Tanggapan Dinas</h4>
              <p className="text-xs text-slate-600">
                Semua balasan terhadap pertanyaan publik wajib mencantumkan format:
              </p>
              <div className="p-2 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-800">
                [Jawaban / Tanggapan Resmi Pengadilan Militer Tinggi V Makassar]
              </div>
            </div>

            {/* Kanal Pengaduan SIWAS */}
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 space-y-2">
              <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold uppercase">Kritik Layanan</span>
              <h4 className="text-sm font-extrabold text-slate-900">Kanal SIWAS MA-RI</h4>
              <p className="text-xs text-slate-600">
                Keluhan atau kritik terkait pelayanan wajib diarahkan ke Sistem Pengawasan (SIWAS) Mahkamah Agung RI:
              </p>
              <a
                href="https://siwas.mahkamahagung.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 shadow-xs"
              >
                <span>Buka siwas.mahkamahagung.go.id</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Pokok Perkara */}
            <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/60 space-y-2">
              <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 text-[10px] font-bold uppercase">Independensi</span>
              <h4 className="text-sm font-extrabold text-slate-900">Larangan Bahas Putusan</h4>
              <p className="text-xs text-slate-600">
                Pengelola dilarang memberikan tanggapan mengenai pokok perkara atau substansi putusan hakim. Pengunjung diarahkan ke upaya hukum resmi (banding/kasasi/PK).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs text-slate-700">
            <h4 className="font-extrabold text-slate-900">Ketentuan Moderasi Kolom Komentar (Bab I angka 11, 12, 13):</h4>
            <p>
              Kolom komentar diupayakan tetap terbuka sebagai wujud transparansi. Komentar hanya dapat disembunyikan atau dihapus bila: 
              mengandung ujaran kebencian, fitnah, SARA, hoax, pornografi, spam/bot, atau membocorkan data pribadi/rahasia perkara yang dilindungi undang-undang.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: STANDAR PENULISAN 5W+1H & MEKANISME KOREKSI (BAB E & H) */}
      {activeTab === 'penulisan' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
              LAMPIRAN I BAB E & H SK SEKMA NO. 14106/2026
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>Standar Penulisan Berita, Artikel Hukum & Transparansi Koreksi Ralat</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Kaidah jurnalistik peradilan dan mekanisme penyandingan informasi jika terjadi perbaikan publikasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-900">Struktur Berita Resmi (Bab E)</h4>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>
                  <strong>1. Lead Berita:</strong> Memuat unsur inti peristiwa 5W+1H (What, Who, When, Where, Why, How) secara akurat dan lugas.
                </li>
                <li>
                  <strong>2. Tubuh Berita:</strong> Memuat fakta persidangan, data kronologi, dan informasi pendukung tanpa opini pribadi penulis.
                </li>
                <li>
                  <strong>3. Ekor Berita:</strong> Memuat informasi penutup, konteks kelembagaan, serta kontak layanan resmi.
                </li>
                <li>
                  <strong>4. Artikel Hukum:</strong> Minimal 800 - 1.500 kata, orisinal, serta didukung paling kurang 2 (dua) referensi ilmiah/jurnal.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 space-y-3">
              <h4 className="text-xs font-black uppercase text-amber-900">Mekanisme Koreksi & Ralat Transparan (Bab H)</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Bila ditemukan kekeliruan dalam materi publikasi, koordinator wajib melakukan koreksi terbuka dengan salah satu bentuk:
              </p>
              <div className="p-2.5 rounded bg-white border border-amber-300 text-[11px] font-mono text-slate-800 space-y-1">
                <span className="font-bold text-amber-800 block">Contoh Catatan Ralat:</span>
                <span>"Koreksi: Terdapat perubahan informasi terkait waktu pelaksanaan persidangan yang sebelumnya tercantum tanggal 10 Juni 2026 dan telah diperbaiki menjadi 12 Juni 2026."</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Penyandingan informasi sebelum vs sesudah dilakukan secara terbuka demi akuntabilitas publikasi peradilan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: KEAMANAN AKUN RESMI & 2FA (BAB F.6) */}
      {activeTab === 'keamanan' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
              LAMPIRAN I BAB F.6 SK SEKMA NO. 14106/2026
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-700" />
              <span>Registrasi, Identitas Resmi, dan Standar Keamanan Akun Media Sosial (Wajib 2FA)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Seluruh kanal komunikasi media sosial resmi Pengadilan Militer Tinggi V Makassar wajib memenuhi protokol keamanan institusional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-extrabold text-slate-900 block">1. Identitas Akun Resmi</span>
              <p className="text-slate-600">
                Nama akun mencerminkan institusi resmi: <strong>Pengadilan Militer Tinggi V Makassar</strong>. Foto profil wajib menggunakan lambang resmi atau foto gedung kantor dinas.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-extrabold text-slate-900 block">2. Surel & Telepon Kedinasan</span>
              <p className="text-slate-600">
                Wajib didaftarkan menggunakan alamat surel resmi instansi (<code>dilmiti5makassar@gmail.com</code> / go.id) dan nomor kontak kantor (<code>0811-4440-5554</code>). Dilarang akun pribadi.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/70 space-y-2">
              <span className="font-extrabold text-emerald-900 block flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>3. Wajib Autentikasi 2 Langkah (2FA)</span>
              </span>
              <p className="text-slate-700">
                Semua akun resmi (Instagram, YouTube, Facebook, Twitter/X) wajib mengaktifkan 2FA / Passkey serta prosedur pemulihan akun (account recovery) terdokumentasi rapi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Viewer PDF Interaktif */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 rounded-2xl border-2 border-amber-400 flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-amber-400/40 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-400 text-slate-950">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black font-serif">
                    SK Sekretaris Mahkamah Agung RI No. 14106/SEK/SK.HM1.1/X/2026
                  </h4>
                  <p className="text-[11px] text-amber-300">
                    Pedoman Pengelolaan Media Massa & Media Sosial di Lingkungan MA-RI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={pdfPath}
                  download="SK_Sekma_14106_2026_Pedoman_Medsos.pdf"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF iframe */}
            <div className="flex-1 w-full h-full bg-slate-800 relative">
              <iframe
                src={`${pdfPath}#toolbar=1&navpanes=0`}
                title="Salinan Keputusan Sekretaris Mahkamah Agung RI No. 14106/SEK/SK.HM1.1/X/2026"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
