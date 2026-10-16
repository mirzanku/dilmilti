import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Share2,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  Navigation,
  ShieldCheck,
  Building2,
  Globe,
  FileText,
  Download
} from 'lucide-react';
import { OFFICIAL_PORTAL_URLS } from '../data/officialPortalUrls';
import { syncRouteToUrl } from '../utils/urlRouter';

interface HubungiKamiSectionProps {
  initialSubTab?: string;
  onNavigate?: (tab: string, subTab?: string) => void;
}

export default function HubungiKamiSection({ initialSubTab = 'alamat', onNavigate }: HubungiKamiSectionProps) {
  const [activeSub, setActiveSub] = useState<string>(initialSubTab || 'alamat');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nomorKontak, setNomorKontak] = useState('');
  const [emailPengirim, setEmailPengirim] = useState('');
  const [kategoriPesan, setKategoriPesan] = useState('Pertanyaan Layanan PTSP / Perkara');
  const [isiPesan, setIsiPesan] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSub(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (activeSub) {
      syncRouteToUrl('hubungi-kami', activeSub, true);
    }
  }, [activeSub]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim() || !isiPesan.trim()) return;
    setSubmittedSuccess(true);
    setNamaLengkap('');
    setNomorKontak('');
    setEmailPengirim('');
    setIsiPesan('');
  };

  const handleDownloadDirectoryDoc = (docTitle: string, docNumber: string, summary: string) => {
    const content = [
      '====================================================================',
      '               MAHKAMAH AGUNG REPUBLIK INDONESIA',
      '            DIREKTORAT JENDERAL BADAN PERADILAN MILITER',
      '               DAN PERADILAN TATA USAHA NEGARA',
      '           PENGADILAN MILITER TINGGI V MAKASSAR',
      '  Jl. Perintis Kemerdekaan KM. 13, Daya, Biringkanaya, Makassar 90243',
      '====================================================================',
      '',
      `JUDUL DOKUMEN  : ${docTitle}`,
      `NOMOR DOKUMEN  : ${docNumber}`,
      'SATUAN KERJA   : Pengadilan Militer Tinggi V Makassar (Kode Satker: 690744)',
      '',
      '--------------------------------------------------------------------',
      'DIREKTORI KONTAK RESMI & JAM OPERASIONAL LAYANAN:',
      '--------------------------------------------------------------------',
      '1. Alamat Kantor    : Jl. Perintis Kemerdekaan KM. 13, Kel. Daya,',
      '                      Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90243',
      '2. Telepon & Fax    : (0411) 515088',
      '3. WhatsApp PTSP    : +62 812-4288-5005',
      '4. Email Kedinasan  : dilmiti5makassar@gmail.com',
      '5. Jam Pelayanan    : Senin - Kamis (08.00 - 16.30 WITA)',
      '                      Jumat (08.00 - 17.00 WITA)',
      '',
      '--------------------------------------------------------------------',
      'URAIAN DOKUMEN:',
      '--------------------------------------------------------------------',
      summary,
      '',
      'Ditetapkan di : Makassar',
      'Pejabat Pengesah : Kepala Pengadilan Militer Tinggi V Makassar',
      '===================================================================='
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const subMenus = [
    { id: 'alamat', label: 'Alamat & Google Maps', icon: MapPin },
    { id: 'whatsapp', label: 'Telepon, WhatsApp & Email', icon: MessageSquare },
    { id: 'form-kontak', label: 'Media Sosial & Form Kontak', icon: Send }
  ];

  const getActiveSubTitle = () => {
    switch (activeSub) {
      case 'alamat':
        return 'Alamat Kantor & Peta Lokasi';
      case 'whatsapp':
        return 'Telepon, WhatsApp & Email Kedinasan';
      case 'form-kontak':
      case 'pesan':
        return 'Media Sosial & Form Kontak Langsung';
      default:
        return 'Kontak Resmi Pengadilan';
    }
  };

  return (
    <section id="hubungi-kami-section" className="space-y-6">
      {/* Header Breadcrumb Ringkas: Pengunjung langsung melihat halaman yang dituju tanpa terhalang menu besar */}
      <div className="bg-gradient-to-r from-[#072414] via-[#0B3A23] to-[#04160D] text-white rounded-2xl px-4 py-3 sm:px-6 sm:py-3.5 border border-emerald-500/30 shadow-md flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('beranda')}
            className="text-emerald-300 hover:text-amber-300 font-bold transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-emerald-200 font-semibold">Hubungi Kami</span>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-amber-300 font-black tracking-wide">{getActiveSubTitle()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
            KONTAK
          </span>
          <span className="text-[11px] font-mono text-emerald-200/80 hidden sm:inline">
            Pengadilan Militer Tinggi V Makassar
          </span>
        </div>
      </div>

      {/* Main Grid: All 7 Contact Elements clearly accessible and highlighted */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Alamat, Telepon, WhatsApp, Email, Media Sosial */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Alamat Lengkap & Jam Operasional */}
          <div className={`bg-white rounded-2xl border-2 p-5 sm:p-6 shadow-xs transition-all ${
            activeSub === 'alamat' ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
          }`}>
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#0A3D24] text-amber-400 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    1. Alamat Lengkap Kantor
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Kode Satker: 690744</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Pengadilan Militer Tinggi V Makassar
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Jl. Perintis Kemerdekaan KM. 13, Kelurahan Daya, Kecamatan Biringkanaya, Kota Makassar, Provinsi Sulawesi Selatan — Kode Pos 90243
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Senin – Kamis:</strong>
                      <span className="text-slate-600">08.00 – 16.30 WITA (Istirahat 12.00 – 13.00)</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Hari Jumat:</strong>
                      <span className="text-slate-600">08.00 – 17.00 WITA (Istirahat 11.30 – 13.00)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Telepon, 3. WhatsApp Layanan, 4. Email Resmi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Telepon */}
            <div className={`bg-white rounded-2xl border-2 p-4 shadow-xs flex flex-col justify-between gap-3 ${
              activeSub === 'telepon' ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
            }`}>
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-black uppercase text-slate-400">Telepon & Fax</div>
                <div className="text-sm font-black text-slate-900">(0411) 515088</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Saluran telepon resmi Meja Informasi & Kepaniteraan pada jam kerja kedinasan.
                </p>
              </div>
              <a
                href="tel:0411515088"
                className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors"
              >
                Hubungi Telepon
              </a>
            </div>

            {/* WhatsApp Layanan */}
            <div className={`bg-white rounded-2xl border-2 p-4 shadow-xs flex flex-col justify-between gap-3 ${
              activeSub === 'whatsapp' ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
            }`}>
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-black uppercase text-emerald-700">WhatsApp Layanan PTSP</div>
                <div className="text-sm font-black text-slate-900">+62 812-4288-5005</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Layanan informasi perkara, antrean PTSP Online, PPID, dan konsultasi Posbakum.
                </p>
              </div>
              <a
                href="https://wa.me/6281242885005?text=Halo%20Petugas%20PTSP%20Dilmilti%20V%20Makassar,%20saya%20ingin%20bertanya%20mengenai%20layanan%20pengadilan."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Chat WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Email Resmi */}
            <div className={`bg-white rounded-2xl border-2 p-4 shadow-xs flex flex-col justify-between gap-3 ${
              activeSub === 'email' ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
            }`}>
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-black uppercase text-amber-800">Email Resmi Satker</div>
                <div className="text-xs font-black text-slate-900 break-all">
                  dilmiti5makassar@gmail.com
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Persuratan elektronik kedinasan, pengiriman berkas PPID, dan koordinasi satker.
                </p>
              </div>
              <a
                href="mailto:dilmiti5makassar@gmail.com"
                className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors"
              >
                Kirim Email
              </a>
            </div>
          </div>

          {/* 5. Google Maps Interactive Embed */}
          <div className={`bg-white rounded-2xl border-2 p-5 shadow-xs space-y-3 ${
            activeSub === 'maps' ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-700" />
                <h4 className="font-black text-slate-900 text-sm">Peta Lokasi Google Maps</h4>
              </div>
              <a
                href="https://maps.google.com/?q=Pengadilan+Militer+Tinggi+V+Makassar+Jl.+Perintis+Kemerdekaan+KM+13+Makassar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>Buka Petunjuk Arah di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 h-60 bg-slate-100">
              <iframe
                title="Peta Lokasi Pengadilan Militer Tinggi V Makassar"
                src="https://www.google.com/maps?q=Jl.+Perintis+Kemerdekaan+KM+13+Daya+Biringkanaya+Makassar&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* 6. Media Sosial Resmi */}
          <div className={`bg-white rounded-2xl border-2 p-5 shadow-xs space-y-3 ${
            activeSub === 'sosmed' ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-700" />
              <h4 className="font-black text-slate-900 text-sm">Kanal Media Sosial Resmi Dilmilti V Makassar</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {[
                { name: 'Instagram', handle: '@dilmilti5makassar', url: 'https://www.instagram.com' },
                { name: 'YouTube', handle: 'Dilmilti V Makassar TV', url: 'https://www.youtube.com/@MahkamahAgungRI' },
                { name: 'Facebook', handle: 'Dilmilti V Makassar', url: 'https://www.facebook.com' },
                { name: 'Portal Badilmiltun', handle: 'badilmiltun.mahkamahagung.go.id', url: OFFICIAL_PORTAL_URLS.badilmiltun }
              ].map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between gap-1"
                >
                  <div className="flex items-center justify-between font-black text-slate-900">
                    <span>{soc.name}</span>
                    <Globe className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <span className="text-[11px] text-slate-500 truncate">{soc.handle}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 7. Dokumen Resmi Direktori Kontak & SOP Komunikasi Publik */}
          <div className="bg-emerald-950 text-white rounded-2xl border border-amber-400/40 p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="font-black text-amber-300 text-xs sm:text-sm uppercase tracking-wider">
                  Dokumen Resmi Direktori Kontak & Standar Komunikasi Layanan
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-300">2 Dokumen Resmi</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                {
                  title: 'Direktori Kontak Resmi, Rute Akses Lokasi & Wilayah Yurisdiksi Dilmilti V Makassar',
                  num: 'W5-Mil.01/HM.01.1/DIR/I/2026',
                  desc: 'Memuat alamat lengkap kantor, titik koordinat Google Maps, nomor telepon & WhatsApp resmi PTSP, serta daftar kontak Pengadilan Militer jajaran.'
                },
                {
                  title: 'SOP Pengelolaan Layanan Meja Informasi, Call Center WhatsApp PTSP & Media Sosial Resmi',
                  num: 'SOP/PTSP-KOM/09/2026',
                  desc: 'Standar waktu tanggap (response time) petugas PTSP terhadap pesan masyarakat melalui WhatsApp, email kedinasan, dan formulir kontak daring.'
                }
              ].map((doc, idx) => (
                <div key={idx} className="bg-white/10 border border-white/15 rounded-xl p-3.5 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-300 block">{doc.num}</span>
                    <div className="font-bold text-white mt-0.5 leading-snug">{doc.title}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadDirectoryDoc(doc.title, doc.num, doc.desc)}
                    className="w-full py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Dokumen</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 7. Form Kontak */}
        <div className="lg:col-span-5">
          <div className={`bg-white rounded-2xl border-2 p-5 sm:p-6 shadow-xs space-y-4 sticky top-24 ${
            activeSub === 'form-kontak' ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200'
          }`}>
            <div className="pb-3 border-b border-slate-100">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                Formulir Kontak Langsung
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-700" />
                <span>Kirim Pesan / Pertanyaan Layanan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sampaikan pertanyaan, saran peningkatan pelayanan, atau konfirmasi persidangan kepada petugas meja informasi.
              </p>
            </div>

            {submittedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1">
                <div className="font-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pesan Anda Berhasil Terkirim!</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Terima kasih. Petugas Meja Informasi PTSP Pengadilan Militer Tinggi V Makassar akan segera menindaklanjuti pesan Anda melalui WhatsApp/Email.
                </p>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap / Pangkat & Kesatuan *
                </label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: Mayor Chk Budi Santoso, S.H. / Masyarakat Umum"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="text"
                    required
                    value={nomorKontak}
                    onChange={(e) => setNomorKontak(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={emailPengirim}
                    onChange={(e) => setEmailPengirim(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Topik / Keperluan Layanan
                </label>
                <select
                  value={kategoriPesan}
                  onChange={(e) => setKategoriPesan(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold text-slate-800 focus:outline-none focus:border-emerald-700"
                >
                  <option value="Pertanyaan Layanan PTSP / Perkara">Pertanyaan Layanan PTSP / Perkara</option>
                  <option value="Konfirmasi Jadwal Sidang & Pemanggilan">Konfirmasi Jadwal Sidang & Pemanggilan</option>
                  <option value="Permohonan Informasi Publik (PPID)">Permohonan Informasi Publik (PPID)</option>
                  <option value="Koordinasi Satker / Oditurat Militer">Koordinasi Satker / Oditurat Militer</option>
                  <option value="Saran & Masukan Pelayanan Publik">Saran & Masukan Pelayanan Publik</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Isi Pesan / Rincian Pertanyaan *
                </label>
                <textarea
                  rows={4}
                  required
                  value={isiPesan}
                  onChange={(e) => setIsiPesan(e.target.value)}
                  placeholder="Tuliskan pesan atau pertanyaan Anda secara jelas..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#0A3D24] hover:bg-emerald-900 text-amber-300 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan ke Meja Informasi PTSP</span>
              </button>

              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Data pengirim dilindungi sesuai kebijakan privasi peradilan.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
