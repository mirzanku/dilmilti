import React, { useEffect, useState } from 'react';
import {
  Wifi,
  WifiOff,
  HardDriveDownload,
  RefreshCw,
  FileCheck2,
  Printer,
  Eye,
  Trash2,
  CheckCircle2,
  CloudUpload,
  Smartphone,
  BookOpen,
  X,
  ShieldCheck
} from 'lucide-react';
import {
  OfflineCachedOfficialDoc,
  PendingBackgroundSyncItem,
  getOfflineCachedDocuments,
  getOfflineDocumentHtml,
  removeOfflineCachedDocument,
  getPendingBackgroundSyncQueue,
  flushBackgroundSyncQueueNow,
  registerPtspServiceWorker,
  subscribeToOfflineVault,
  useOnlineStatus,
  usePWAInstall
} from '../../utils/ptspServiceWorkerSync';
import {
  openPrintPopup,
  printBukuIISopPtspDocument,
  prefetchAllOfficialDocsForOffline
} from './PtspPrintHelper';
import { PTSPDB } from '../../data/ptspDatabase';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Install Aplikasi PTSP</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="px-3 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install di iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border-2 border-amber-400 p-6 text-white shadow-2xl space-y-3">
              <h3 className="text-base font-black text-amber-300">
                Install Portal PTSP di iPhone / iPad
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                1. Ketuk tombol <strong>Bagikan (Share)</strong> pada bilah Safari.
                <br />
                2. Pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC<{ simulatedOffline?: boolean }> = ({
  simulatedOffline = false
}) => {
  const browserOnline = useOnlineStatus();
  const isOnline = browserOnline && !simulatedOffline;

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-black text-slate-950 shadow-2xl border-2 border-slate-950">
      <span className="h-2.5 w-2.5 rounded-full bg-slate-950 animate-ping" />
      <WifiOff className="w-4 h-4" />
      <span>
        Mode Offline Aktif — Dokumen Resmi Buku II MA-RI disajikan dari Cache Service Worker.
      </span>
    </div>
  );
};

export default function PtspOfflineSyncPanel() {
  const browserOnline = useOnlineStatus();
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const isEffectiveOnline = browserOnline && !simulatedOffline;

  const [swRegistered, setSwRegistered] = useState(false);
  const [cachedDocs, setCachedDocs] = useState<OfflineCachedOfficialDoc[]>(() =>
    getOfflineCachedDocuments()
  );
  const [syncQueue, setSyncQueue] = useState<PendingBackgroundSyncItem[]>(() =>
    getPendingBackgroundSyncQueue()
  );
  const [isSyncingNow, setIsSyncingNow] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{
    doc: OfflineCachedOfficialDoc;
    html: string;
  } | null>(null);

  useEffect(() => {
    registerPtspServiceWorker().then((reg) => {
      if (reg) setSwRegistered(true);
    });

    // Ensure initial official documents & Buku II SOP are pre-cached in Service Worker
    const state = PTSPDB.getState();
    if (getOfflineCachedDocuments().length === 0) {
      prefetchAllOfficialDocsForOffline(
        state.ptsp_applications,
        state.reply_documents,
        state.online_consultations
      );
    }

    const refresh = () => {
      setCachedDocs(getOfflineCachedDocuments());
      setSyncQueue(getPendingBackgroundSyncQueue());
    };
    refresh();

    const unsub = subscribeToOfflineVault(refresh);
    return unsub;
  }, []);

  const handleOpenPreview = async (doc: OfflineCachedOfficialDoc) => {
    const html = (await getOfflineDocumentHtml(doc.docId)) || doc.htmlContent;
    setPreviewDoc({ doc, html });
  };

  const handlePrefetchAll = () => {
    setIsSyncingNow(true);
    const state = PTSPDB.getState();
    prefetchAllOfficialDocsForOffline(
      state.ptsp_applications,
      state.reply_documents,
      state.online_consultations
    );
    flushBackgroundSyncQueueNow().finally(() => {
      setTimeout(() => setIsSyncingNow(false), 500);
    });
  };

  const pendingSyncCount = syncQueue.filter((q) => q.status !== 'SYNCED').length;

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-900/20 p-5 sm:p-6 shadow-sm space-y-4 text-xs">
      <OfflineIndicator simulatedOffline={simulatedOffline} />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase flex items-center gap-1.5 ${
                isEffectiveOnline
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-400 text-slate-950'
              }`}
            >
              {isEffectiveOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-700" />
                  <span>ONLINE • SERVICE WORKER BACKGROUND SYNC AKTIF</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span>MODE OFFLINE • MENAMPILKAN DOKUMEN DARI CACHE LOKAL</span>
                </>
              )}
            </span>

            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
              {swRegistered ? 'SW: /sw-ptsp.js Terdaftar' : 'Cache Storage Vault Aktif'} •{' '}
              {cachedDocs.length} Dokumen Tersimpan Offline
            </span>

            {pendingSyncCount > 0 && (
              <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px]">
                {pendingSyncCount} Antrean Background Sync Menunggu Jaringan
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-black text-slate-900">
            Brankas Dokumen Resmi Offline &amp; Sinkronisasi Latar Belakang (Standar Buku II Mahkamah Agung RI)
          </h3>
          <p className="text-xs text-slate-600">
            Seluruh dokumen resmi yang pernah dibuka atau diunduh (Surat Balasan Ber-TTE, Tanda Terima Registrasi, Berita Acara Konsultasi, dan SOP PTSP Buku II MA-RI) otomatis disimpan oleh <strong>Service Worker</strong> agar tetap dapat dilihat dan dicetak meskipun perangkat sedang <strong>Offline</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <PWAInstallButton />

          <button
            type="button"
            onClick={() => printBukuIISopPtspDocument()}
            className="px-3.5 py-2 rounded-xl bg-[#0D4A2B] hover:bg-emerald-800 text-amber-300 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cetak SOP PTSP Buku II MA-RI</span>
          </button>

          <button
            type="button"
            onClick={handlePrefetchAll}
            disabled={isSyncingNow}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncingNow ? 'animate-spin' : ''}`} />
            <span>{isSyncingNow ? 'Menyinkronkan...' : 'Sinkronkan & Cache Semua Dokumen'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSimulatedOffline((prev) => !prev)}
            className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer border ${
              simulatedOffline
                ? 'bg-amber-400 text-slate-950 border-amber-500 font-black'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title="Uji coba membuka dokumen resmi saat perangkat tidak memiliki koneksi internet"
          >
            {simulatedOffline ? <WifiOff className="w-3.5 h-3.5" /> : <HardDriveDownload className="w-3.5 h-3.5" />}
            <span>{simulatedOffline ? 'Matikan Simulasi Offline' : 'Uji Mode Offline'}</span>
          </button>
        </div>
      </div>

      {/* Daftar Dokumen Resmi yang Tersimpan di Service Worker Cache (Dapat Dibuka Offline) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {cachedDocs.map((doc) => (
          <div
            key={doc.docId}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-600 transition-all flex flex-col justify-between gap-2.5"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-1.5">
                <span className="px-2 py-0.5 rounded bg-emerald-900 text-amber-300 font-mono font-bold text-[9.5px]">
                  {doc.kodeFormulirBukuII}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Tersedia Offline</span>
                </span>
              </div>

              <div className="font-black text-slate-900 text-xs line-clamp-2">{doc.title}</div>

              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>
                  Nomor: <span className="font-mono font-semibold text-slate-800">{doc.nomorDokumen}</span>
                </div>
                <div className="truncate">Pemohon/Subjek: {doc.pemohonNama}</div>
                <div className="text-[10px] text-slate-400">Di-cache: {doc.cachedAt}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenPreview(doc)}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#0D4A2B] hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span>Buka Offline</span>
              </button>

              <button
                type="button"
                onClick={() => openPrintPopup(doc.htmlContent, doc.docId)}
                className="py-1.5 px-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak</span>
              </button>

              <button
                type="button"
                onClick={() => removeOfflineCachedDocument(doc.docId)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Hapus dari Cache Offline"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Antrean Background Sync jika ada pengajuan saat Offline */}
      {syncQueue.length > 0 && (
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CloudUpload className="w-4 h-4 text-emerald-800" />
            <span className="font-bold text-emerald-950">
              Riwayat Background Sync Service Worker ({syncQueue.length} Aktivitas):
            </span>
            <span className="text-emerald-800">
              {syncQueue[0]?.summary} — Status:{' '}
              <strong>
                {syncQueue[0]?.status === 'SYNCED'
                  ? 'Tersinkronisasi ke Server'
                  : 'Menunggu Koneksi (Queued)'}
              </strong>
            </span>
          </div>
        </div>
      )}

      {/* Modal Pembaca Dokumen Resmi Offline (Tetap Berfungsi 100% Tanpa Internet) */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl border-2 border-amber-400 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#041E11] to-[#0D4A2B] text-white px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-[10px]">
                    {previewDoc.doc.kodeFormulirBukuII}
                  </span>
                  <span className="text-[11px] text-emerald-200 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>Disajikan dari Service Worker Offline Cache</span>
                  </span>
                </div>
                <h4 className="font-black text-sm text-white truncate mt-0.5">
                  {previewDoc.doc.title}
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openPrintPopup(previewDoc.html, previewDoc.doc.docId)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Unduh PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-3 sm:p-5 overflow-y-auto">
              <iframe
                title={previewDoc.doc.title}
                srcDoc={previewDoc.html.replace('<script>setTimeout(() => window.print(), 400);</script>', '')}
                className="w-full h-[68vh] bg-white rounded-xl border border-slate-300 shadow-inner"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
