import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Loader2, 
  CheckCircle2, 
  WifiOff, 
  RefreshCw, 
  CloudCheck, 
  ShieldCheck, 
  Smartphone, 
  HardDrive
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { getSyncStatus, hydrateFromFirestore, pushAllToFirestore, SyncStatus } from '../services/firestoreSync';

interface SyncStatusIndicatorProps {
  variant?: 'card' | 'badge' | 'full';
  showControls?: boolean;
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  variant = 'card',
  showControls = true,
  onToast
}) => {
  const [status, setStatus] = useState(() => CourtDB.getSyncStatus());
  const [cloudStatus, setCloudStatus] = useState<SyncStatus>(() => getSyncStatus());
  const [isManualFetching, setIsManualFetching] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setStatus(CourtDB.getSyncStatus());
      setCloudStatus(getSyncStatus());
    };

    const handleSyncStatusEvent = (e: Event) => {
      const custom = e as CustomEvent<{ status: SyncStatus }>;
      if (custom.detail?.status) {
        setCloudStatus(custom.detail.status);
      }
    };

    handleUpdate();
    const unsubscribe = CourtDB.subscribe(handleUpdate);
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    window.addEventListener('dilmilti_sync_status_changed', handleSyncStatusEvent);
    const interval = setInterval(handleUpdate, 2000);

    return () => {
      unsubscribe();
      window.removeEventListener('dilmilti_db_updated', handleUpdate);
      window.removeEventListener('dilmilti_sync_status_changed', handleSyncStatusEvent);
      clearInterval(interval);
    };
  }, []);

  const handleForceRefresh = async () => {
    if (status.isSyncing || isManualFetching) return;
    setIsManualFetching(true);
    try {
      // 1. Pull from Firestore Cloud
      await hydrateFromFirestore();
      // 2. Also sync local DB state
      await CourtDB.fetchFromCentralServer(true);
      const updated = CourtDB.getSyncStatus();
      setStatus(updated);
      setCloudStatus(getSyncStatus());
      if (onToast) {
        onToast(`Pembaruan data (v${updated.version}) berhasil disinkronkan dengan Cloud Firestore!`, 'success');
      }
    } catch {
      if (onToast) {
        onToast('Gagal sinkronisasi data cloud', 'error');
      }
    } finally {
      setIsManualFetching(false);
    }
  };

  const formatSnapshotTime = (ts: number | null) => {
    if (!ts) return 'Tersedia';
    try {
      return new Date(ts).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Baru saja';
    }
  };

  // 1. Sleek Navbar/Header Badge Variant
  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold border transition-all duration-300 bg-slate-900/90 shadow-xs">
        {status.isSyncing || isManualFetching || cloudStatus === 'syncing' ? (
          <div className="flex items-center gap-1.5 text-amber-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span className="font-extrabold tracking-wide uppercase text-[10px]">MENYINKRONKAN...</span>
          </div>
        ) : cloudStatus === 'quota_paused' ? (
          <div className="flex items-center gap-1.5 text-amber-300">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-slate-200">Database Lokal (v{status.version})</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-200">Cloud Sync:</span>
            <span className="px-1.5 py-0.2 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-black rounded-full">
              v{status.version}
            </span>
          </div>
        )}
      </div>
    );
  }

  // 2. Full Dashboard Card Variant
  return (
    <div className="bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-950 border-2 border-amber-400/70 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Real-time Status Badge & Title */}
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-xl p-0.5 shadow-lg shrink-0 flex items-center justify-center ${
            status.isSyncing || isManualFetching || cloudStatus === 'syncing'
              ? 'bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 animate-pulse'
              : cloudStatus === 'quota_paused'
              ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950'
              : 'bg-gradient-to-tr from-emerald-500 to-amber-300 text-slate-950'
          }`}>
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              {status.isSyncing || isManualFetching || cloudStatus === 'syncing' ? (
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              ) : cloudStatus === 'quota_paused' ? (
                <HardDrive className="w-6 h-6 text-amber-400" />
              ) : (
                <Database className="w-6 h-6 text-emerald-400" />
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide flex items-center gap-2">
                <span>INDIKATOR SINKRONISASI CLOUD FIRESTORE & DATABASE</span>
              </h3>

              {status.isSyncing || isManualFetching || cloudStatus === 'syncing' ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/60 text-[10px] font-black tracking-wider uppercase animate-pulse flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>SINKRONISASI AKTIF</span>
                </span>
              ) : cloudStatus === 'quota_paused' ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/60 text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-amber-400" />
                  <span>MODUS DATABASE LOKAL RESILIEN</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>TERHUBUNG CLOUD FIRESTORE</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {cloudStatus === 'quota_paused' ? (
                <span className="text-amber-300 font-medium">
                  Database berjalan normal menggunakan media lokal yang aman. Sinkronisasi cloud Firestore akan aktif kembali setelah reset kuota harian.
                </span>
              ) : (
                <span>
                  Sistem otomatis mencadangkan dan menyinkronkan data ke Cloud Firestore. Data Anda tetap tersimpan dan tidak akan terhapus saat melakukan publish ke GitHub.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Version Badge & Manual Refresh Control */}
        {showControls && (
          <div className="flex flex-wrap sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800 shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Versi Database:</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-black text-xs shadow-inner">
                v{status.version}
              </span>
            </div>

            <button
              type="button"
              onClick={handleForceRefresh}
              disabled={status.isSyncing || isManualFetching}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 shadow-md cursor-pointer border ${
                status.isSyncing || isManualFetching
                  ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-800 to-slate-900 hover:from-emerald-700 hover:to-slate-800 text-amber-300 border-amber-400/60 hover:border-amber-300 hover:shadow-emerald-500/20'
              }`}
              title="Sinkronkan data dengan Cloud Firestore dan perangkat lain"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${status.isSyncing || isManualFetching ? 'animate-spin text-amber-400' : 'text-amber-300'}`} />
              <span>
                {status.isSyncing || isManualFetching ? 'Menyinkronkan...' : 'Sinkronkan Cloud'}
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            Cache Snapshot ({formatSnapshotTime(status.snapshotTimestamp ?? null)}) • Multi-Perangkat Real-time
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Keamanan Data Terjamin (Cloud Firestore & Backup)</span>
        </div>
      </div>
    </div>
  );
};

export default SyncStatusIndicator;
