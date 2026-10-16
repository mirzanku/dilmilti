import { useState, useEffect } from 'react';
import { CalendarClock, Calendar, Clock, MapPin, User, Scale, MessageSquareCode, Filter } from 'lucide-react';
import { JadwalSidangItem } from '../types';
import { CourtDB } from '../data/courtDatabase';
import { requestServiceWorkerHighPrioritySync } from '../utils/serviceWorkerRegistration';

interface JadwalSidangProps {
  onRegisterWA?: (nomorPerkara: string) => void;
}

export default function JadwalSidangSection({ onRegisterWA }: JadwalSidangProps) {
  const [jadwalList, setJadwalList] = useState<JadwalSidangItem[]>(() => CourtDB.getJadwal());
  const [filterRuang, setFilterRuang] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  useEffect(() => {
    setJadwalList(CourtDB.getJadwal());
    // Trigger Network-First fetch with Service Worker cache fallback for Jadwal Sidang
    CourtDB.fetchHighPrioritySection('jadwal-sidang');

    const handleUpdate = () => {
      setJadwalList(CourtDB.getJadwal());
    };
    const handleOnline = () => {
      CourtDB.fetchHighPrioritySection('jadwal-sidang');
    };

    window.addEventListener('dilmilti_db_updated', handleUpdate);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('dilmilti_db_updated', handleUpdate);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const filteredJadwal = jadwalList.filter((item) => {
    const matchRuang = filterRuang === 'Semua' || item.ruangSidang.includes(filterRuang);
    const matchStatus = filterStatus === 'Semua' || item.status === filterStatus;
    return matchRuang && matchStatus;
  });

  return (
    <section id="jadwal-sidang-section" className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-[#0E29CD] text-white rounded-xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-blue-950 uppercase tracking-wider">
                AGENDA PERSIDANGAN REAL-TIME
              </span>
              <span className="text-xs text-indigo-200">Terbuka Untuk Umum</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <CalendarClock className="w-6 h-6 text-amber-300" />
              <span>Jadwal Sidang Pengadilan Militer Tinggi V Makassar</span>
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-2xl leading-relaxed">
              Daftar perkara yang sedang dan akan disidangkan. Sidang militer terbuka untuk umum kecuali perkara kesusilaan atau rahasia pertahanan negara tertentu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://sipp.dilmilti-makassar.go.id/list_jadwal_sidang"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs border border-amber-300 flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
              title="Buka Sub-Website Jadwal Sidang Resmi Dilmilti V Makassar di Tab Baru"
            >
              <CalendarClock className="w-4 h-4 text-slate-950" />
              <span>Buka Sub-Website Jadwal Sidang Resmi →</span>
            </a>
            <div className="bg-white/10 border border-white/20 px-3.5 py-2 rounded-xl text-xs shrink-0 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>sipp.dilmilti-makassar.go.id/list_jadwal_sidang</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Filter className="w-4 h-4 text-[#0E29CD]" />
          <span>Filter Agenda:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Ruang Sidang:</span>
            <select
              value={filterRuang}
              onChange={(e) => setFilterRuang(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium"
            >
              <option value="Semua">Semua Ruang</option>
              <option value="Kartika">Ruang Utama Kartika</option>
              <option value="Garuda">Ruang Garuda</option>
              <option value="Teleconference">Ruang Teleconference</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium"
            >
              <option value="Semua">Semua Status</option>
              <option value="Sedang Berlangsung">Sedang Berlangsung</option>
              <option value="Akan Datang">Akan Datang</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards of hearings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJadwal.map((item) => (
          <div
            key={item.id}
            id={`card-sidang-${item.id}`}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.status === 'Sedang Berlangsung'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    : item.status === 'Akan Datang'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  ● {item.status}
                </span>

                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {item.ruangSidang}
                </span>
              </div>

              <h3 className="text-sm font-black text-[#0E29CD] leading-snug">
                {item.nomorPerkara}
              </h3>

              <div className="mt-2 text-xs space-y-1 text-slate-700">
                <div className="flex items-center gap-1 font-semibold text-slate-900">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.terdakwa}</span>
                </div>
                <div className="text-[11px] text-slate-500 pl-4.5">
                  Kesatuan: <strong className="text-slate-700">{item.kesatuan}</strong>
                </div>
              </div>

              {/* Agenda box */}
              <div className="mt-3 bg-amber-50 border border-amber-200/80 p-3 rounded-lg text-xs">
                <div className="text-[10px] font-bold text-amber-800 uppercase">Agenda Sidang:</div>
                <div className="font-semibold text-slate-900 mt-0.5">{item.agenda}</div>
              </div>

              <div className="mt-3 text-[11px] text-slate-600 space-y-1">
                <div>Ketua Majelis: <strong className="text-slate-800">{item.majelisHakim}</strong></div>
                <div>Oditur Militer: <strong className="text-slate-800">{item.oditur}</strong></div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                <Clock className="w-3.5 h-3.5 text-[#0E29CD]" />
                <span>{item.tanggal} • {item.waktu}</span>
              </div>

              {onRegisterWA && (
                <button
                  type="button"
                  onClick={() => onRegisterWA(item.nomorPerkara)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Aktifkan Notifikasi WhatsApp untuk Sidang Ini"
                >
                  <MessageSquareCode className="w-3 h-3" />
                  <span>Notifikasi WA</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
