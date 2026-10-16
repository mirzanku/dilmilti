import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Scale, 
  Calendar, 
  User, 
  Shield, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  X, 
  Download, 
  MessageSquareCode, 
  AlertCircle, 
  Printer 
} from 'lucide-react';
import { PerkaraSIPP } from '../types';
import { CourtDB } from '../data/courtDatabase';

interface SippSectionProps {
  onRegisterWA?: (nomorPerkara: string) => void;
  initialSearchQuery?: string;
}

export default function SippSection({ onRegisterWA, initialSearchQuery = '' }: SippSectionProps) {
  const [perkaraList, setPerkaraList] = useState<PerkaraSIPP[]>(() => CourtDB.getSIPP());
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedTingkat, setSelectedTingkat] = useState<string>('Semua');
  const [selectedKlasifikasi, setSelectedKlasifikasi] = useState<string>('Semua');
  const [selectedMatra, setSelectedMatra] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [activeModalPerkara, setActiveModalPerkara] = useState<PerkaraSIPP | null>(null);
  const [notificationSuccess, setNotificationSuccess] = useState<string | null>(null);

  useEffect(() => {
    setPerkaraList(CourtDB.getSIPP());
    const handleUpdate = () => {
      setPerkaraList(CourtDB.getSIPP());
    };
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleUpdate);
  }, []);

  // Filtered cases
  const filteredPerkara = useMemo(() => {
    return perkaraList.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        item.nomorPerkara.toLowerCase().includes(q) ||
        item.terdakwa.nama.toLowerCase().includes(q) ||
        item.terdakwa.kesatuan.toLowerCase().includes(q) ||
        item.terdakwa.nrp.toLowerCase().includes(q) ||
        item.oditurMiliter.toLowerCase().includes(q) ||
        item.nomorRegisterOditurat.toLowerCase().includes(q);

      const matchesTingkat = selectedTingkat === 'Semua' || item.tingkatPerkara === selectedTingkat;
      const matchesKlasifikasi = selectedKlasifikasi === 'Semua' || item.klasifikasi === selectedKlasifikasi;
      const matchesMatra = selectedMatra === 'Semua' || item.terdakwa.matra === selectedMatra;
      const matchesStatus = selectedStatus === 'Semua' || item.statusPerkara.toLowerCase().includes(selectedStatus.toLowerCase());

      return matchesSearch && matchesTingkat && matchesKlasifikasi && matchesMatra && matchesStatus;
    });
  }, [perkaraList, searchQuery, selectedTingkat, selectedKlasifikasi, selectedMatra, selectedStatus]);

  const handlePrint = () => {
    window.print();
  };

  const handleTriggerWA = (nomorPerkara: string) => {
    if (onRegisterWA) {
      onRegisterWA(nomorPerkara);
    } else {
      setNotificationSuccess(`Nomor perkara ${nomorPerkara} diteruskan ke modul notifikasi WhatsApp.`);
      setTimeout(() => setNotificationSuccess(null), 4000);
    }
  };

  return (
    <section id="sipp-database-section" className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A3D24] via-[#0D4A2B] to-[#166534] text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-emerald-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
                SIPP TERINTEGRASI PUSAT
              </span>
              <span className="text-xs text-emerald-100 font-mono">Mahkamah Agung RI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Sistem Informasi Penelusuran Perkara (SIPP)
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              Layanan penelusuran perkara militer tingkat banding (Sulawesi, Maluku, Papua) dan tingkat pertama perwira menengah/tinggi di lingkungan Pengadilan Militer Tinggi V Makassar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://sipp.dilmilti-makassar.go.id/list_perkara/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs border border-amber-300 flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
              title="Buka Sub-Website SIPP Resmi Dilmilti V Makassar di Tab Baru"
            >
              <Scale className="w-4 h-4 text-slate-950" />
              <span>Buka Sub-Website SIPP Resmi →</span>
            </a>
            <button
              type="button"
              id="btn-sipp-print"
              onClick={handlePrint}
              className="px-3 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Hasil</span>
            </button>
            <div className="bg-emerald-500/20 border border-emerald-400/40 px-3 py-2 rounded-lg text-xs text-emerald-200 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live: sipp.dilmilti-makassar.go.id</span>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-5 relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="input-sipp-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik Nomor Perkara (contoh: 24-K), Nama Terdakwa, Pangkat/NRP, Kesatuan, atau Oditur Militer..."
              className="w-full pl-11 pr-24 py-3 bg-white text-slate-800 rounded-lg text-xs sm:text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
                aria-label="Hapus Pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-[#0E29CD]" />
          <span>Filter Database Perkara:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Tingkat Perkara */}
          <div>
            <label htmlFor="filter-tingkat" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Tingkat Perkara
            </label>
            <select
              id="filter-tingkat"
              value={selectedTingkat}
              onChange={(e) => setSelectedTingkat(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0E29CD] focus:outline-none"
            >
              <option value="Semua">Semua Tingkat</option>
              <option value="Banding">Banding (Peradilan Tingkat II)</option>
              <option value="Tingkat Pertama">Tingkat Pertama (Pamen/Pati TNI)</option>
            </select>
          </div>

          {/* Klasifikasi */}
          <div>
            <label htmlFor="filter-klasifikasi" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Klasifikasi Tindak Pidana
            </label>
            <select
              id="filter-klasifikasi"
              value={selectedKlasifikasi}
              onChange={(e) => setSelectedKlasifikasi(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0E29CD] focus:outline-none"
            >
              <option value="Semua">Semua Klasifikasi</option>
              <option value="Pelanggaran Disiplin/Desersi">Desersi & Disiplin Militer</option>
              <option value="Tindak Pidana Khusus Militer">Tindak Pidana Khusus Militer</option>
              <option value="Tindak Pidana Umum">Tindak Pidana Umum</option>
              <option value="Sengketa Kepegawaian TNI/TUN">Sengketa TUN Militer</option>
            </select>
          </div>

          {/* Matra */}
          <div>
            <label htmlFor="filter-matra" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kesatuan / Matra TNI
            </label>
            <select
              id="filter-matra"
              value={selectedMatra}
              onChange={(e) => setSelectedMatra(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0E29CD] focus:outline-none"
            >
              <option value="Semua">Semua Matra</option>
              <option value="TNI AD">TNI Angkatan Darat (AD)</option>
              <option value="TNI AL">TNI Angkatan Laut (AL)</option>
              <option value="TNI AU">TNI Angkatan Udara (AU)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="filter-status" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Status Penyelesaian
            </label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#0E29CD] focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Pemeriksaan">Dalam Pemeriksaan Sidang</option>
              <option value="Tuntutan">Tuntutan Oditur</option>
              <option value="Putusan">Putusan Diucapkan</option>
              <option value="BHT">Berkekuatan Hukum Tetap (Inkracht)</option>
            </select>
          </div>
        </div>

        {/* Status result summary */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan <strong className="text-slate-800">{filteredPerkara.length}</strong> perkara dari total <strong className="text-slate-800">{perkaraList.length}</strong> perkara terdaftar di SIPP
          </span>
          {(selectedTingkat !== 'Semua' || selectedKlasifikasi !== 'Semua' || selectedMatra !== 'Semua' || selectedStatus !== 'Semua' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedTingkat('Semua');
                setSelectedKlasifikasi('Semua');
                setSelectedMatra('Semua');
                setSelectedStatus('Semua');
                setSearchQuery('');
              }}
              className="text-[#0E29CD] hover:underline font-semibold text-[11px]"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {notificationSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationSuccess}</span>
        </div>
      )}

      {/* Case Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredPerkara.length === 0 ? (
          <div className="text-center py-12 px-4">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Tidak ada perkara yang sesuai kriteria pencarian.</p>
            <p className="text-xs text-slate-500 mt-1">Periksa kembali penulisan nomor perkara atau kata kunci Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3 w-12 text-center">No</th>
                  <th className="p-3">Nomor Perkara & Tanggal</th>
                  <th className="p-3">Terdakwa / Tergugat</th>
                  <th className="p-3">Kesatuan & Matra</th>
                  <th className="p-3">Klasifikasi</th>
                  <th className="p-3">Status Terkini</th>
                  <th className="p-3">Jadwal Sidang</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPerkara.map((perkara, idx) => (
                  <tr 
                    key={perkara.id}
                    id={`row-perkara-${perkara.id}`}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-3 text-center text-slate-400 font-mono font-medium">
                      {idx + 1}
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-[#0E29CD] text-xs leading-snug">
                        {perkara.nomorPerkara}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Reg: {perkara.tanggalDaftar}</span>
                      </div>
                      <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                        {perkara.tingkatPerkara}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{perkara.terdakwa.nama}</div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        NRP: {perkara.terdakwa.nrp} ({perkara.terdakwa.pangkat} {perkara.terdakwa.korps})
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-700 font-medium">{perkara.terdakwa.kesatuan}</div>
                      <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded ${
                        perkara.terdakwa.matra === 'TNI AD'
                          ? 'bg-emerald-100 text-emerald-800'
                          : perkara.terdakwa.matra === 'TNI AL'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {perkara.terdakwa.matra}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="text-slate-700 font-medium block">{perkara.klasifikasi}</span>
                      <span className="text-[10px] text-slate-500">{perkara.jenisPerkara}</span>
                    </td>

                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                        perkara.statusPerkara.includes('BHT') 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : perkara.statusPerkara.includes('Putusan')
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : perkara.statusPerkara.includes('Tuntutan')
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {perkara.statusPerkara}
                      </span>
                    </td>

                    <td className="p-3">
                      {perkara.jadwalSidangBerikutnya ? (
                        <div className="text-[11px]">
                          <div className="font-bold text-slate-800 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#0E29CD]" />
                            <span>{perkara.jadwalSidangBerikutnya.tanggal}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {perkara.jadwalSidangBerikutnya.jam} • {perkara.jadwalSidangBerikutnya.ruang}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Sidang telah selesai</span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          id={`btn-detail-${perkara.id}`}
                          onClick={() => setActiveModalPerkara(perkara)}
                          className="px-2.5 py-1.5 bg-[#0E29CD] hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          title="Lihat Rincian Perkara Lengkap"
                        >
                          <span>Rincian</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                        
                        <button
                          type="button"
                          id={`btn-wa-shortcut-${perkara.id}`}
                          onClick={() => handleTriggerWA(perkara.nomorPerkara)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
                          title="Pantau Perkara Ini via WhatsApp"
                          aria-label={`Pantau perkara ${perkara.nomorPerkara} via WhatsApp`}
                        >
                          <MessageSquareCode className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED CASE MODAL */}
      {activeModalPerkara && (
        <div 
          id="modal-detail-perkara" 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0E29CD] to-[#176CEA] text-white p-4 sm:p-5 flex items-start justify-between shrink-0">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-blue-950 uppercase tracking-wider">
                  {activeModalPerkara.tingkatPerkara} • SIPP Dilmilti V Makassar
                </span>
                <h3 className="text-base sm:text-lg font-black mt-1">
                  Perkara: {activeModalPerkara.nomorPerkara}
                </h3>
                <p className="text-xs text-blue-100">
                  Register Oditurat: {activeModalPerkara.nomorRegisterOditurat} | Terdaftar: {activeModalPerkara.tanggalDaftar}
                </p>
              </div>
              <button
                type="button"
                id="btn-close-modal-perkara"
                onClick={() => setActiveModalPerkara(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Tutup Detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1">
              
              {/* Terdakwa Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#0E29CD]" />
                  <span>Identitas Terdakwa / Pihak Berperkara</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Nama Lengkap:</span>
                    <strong className="text-slate-900 text-sm">{activeModalPerkara.terdakwa.nama}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Pangkat / Korps / NRP:</span>
                    <span className="font-semibold text-slate-800">
                      {activeModalPerkara.terdakwa.pangkat} {activeModalPerkara.terdakwa.korps} - NRP {activeModalPerkara.terdakwa.nrp}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Kesatuan Militer:</span>
                    <span className="font-medium text-slate-800">{activeModalPerkara.terdakwa.kesatuan}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Matra / Angkatan:</span>
                    <span className="font-bold text-[#0E29CD]">{activeModalPerkara.terdakwa.matra}</span>
                  </div>
                </div>
              </div>

              {/* Majelis Hakim & Penuntut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#0E29CD]" />
                    <span>Susunan Majelis Hakim</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    <li>
                      <span className="text-[10px] text-slate-500 block">Ketua Majelis:</span>
                      <strong className="text-slate-900">{activeModalPerkara.majelisHakim.ketua}</strong>
                    </li>
                    <li>
                      <span className="text-[10px] text-slate-500 block">Hakim Anggota 1:</span>
                      <span className="text-slate-800">{activeModalPerkara.majelisHakim.anggota1}</span>
                    </li>
                    <li>
                      <span className="text-[10px] text-slate-500 block">Hakim Anggota 2:</span>
                      <span className="text-slate-800">{activeModalPerkara.majelisHakim.anggota2}</span>
                    </li>
                    <li className="pt-1 border-t border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Panitera Pengganti:</span>
                      <span className="text-slate-800 font-medium">{activeModalPerkara.paniteraPengganti}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#0E29CD]" />
                    <span>Penuntut / Oditur Militer</span>
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Oditur Militer Tinggi:</span>
                      <strong className="text-slate-900 leading-snug block">{activeModalPerkara.oditurMiliter}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Klasifikasi Dakwaan:</span>
                      <span className="text-slate-800 font-medium">{activeModalPerkara.klasifikasi}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Status Perkara Terkini:</span>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {activeModalPerkara.statusPerkara}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jadwal Sidang Mendatang */}
              {activeModalPerkara.jadwalSidangBerikutnya && (
                <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold mb-1">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>Jadwal Sidang Berikutnya:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <div>
                      <span className="text-[10px] text-amber-700 block">Waktu Sidang:</span>
                      <span className="font-bold text-slate-900">{activeModalPerkara.jadwalSidangBerikutnya.tanggal} ({activeModalPerkara.jadwalSidangBerikutnya.jam})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 block">Ruang Sidang:</span>
                      <span className="font-bold text-slate-900">{activeModalPerkara.jadwalSidangBerikutnya.ruang}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 block">Agenda Persidangan:</span>
                      <span className="font-bold text-slate-900">{activeModalPerkara.jadwalSidangBerikutnya.agenda}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amar Putusan */}
              {activeModalPerkara.amarPutusan && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs">
                  <h4 className="font-bold text-[#0E29CD] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Amar Putusan Pengadilan Militer Tinggi V</span>
                  </h4>
                  {activeModalPerkara.tanggalPutusan && (
                    <div className="text-[11px] text-slate-500 mb-2">
                      Diputus pada: <strong className="text-slate-800">{activeModalPerkara.tanggalPutusan}</strong>
                    </div>
                  )}
                  <p className="italic bg-white p-3 rounded-lg border border-blue-100 text-slate-800 leading-relaxed font-serif">
                    "{activeModalPerkara.amarPutusan}"
                  </p>
                </div>
              )}

              {/* Tahapan Perkara Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#0E29CD]" />
                  <span>Riwayat Tahapan Persidangan & Administrasi</span>
                </h4>
                <div className="border-l-2 border-blue-500 ml-2 space-y-3.5 pl-4">
                  {activeModalPerkara.tahapanPerkara.map((tahap, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        tahap.selesai ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
                      }`} />
                      <div className="font-bold text-slate-900 text-xs">{tahap.agenda}</div>
                      <div className="text-[10px] text-blue-700 font-mono">{tahap.tanggal}</div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{tahap.keterangan}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 px-5 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-modal-wa-track"
                  onClick={() => {
                    handleTriggerWA(activeModalPerkara.nomorPerkara);
                    setActiveModalPerkara(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquareCode className="w-4 h-4" />
                  <span>Daftarkan Notifikasi WhatsApp</span>
                </button>

                <button
                  type="button"
                  id="btn-modal-download-petikan"
                  onClick={() => {
                    alert(`Simulasi Unduh Petikan Putusan Resmi Perkara ${activeModalPerkara.nomorPerkara} format PDF bertanda tangan elektronik (BSrE BSSN).`);
                  }}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Petikan (PDF)</span>
                </button>
              </div>

              <button
                type="button"
                id="btn-modal-close-bottom"
                onClick={() => setActiveModalPerkara(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
