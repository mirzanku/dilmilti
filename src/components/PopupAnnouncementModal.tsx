import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Scale, 
  Compass, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Award,
  BellRing,
  Info,
  ChevronRight
} from 'lucide-react';
import { PopupAnnouncementConfig, NavSection } from '../types';
import { CourtDB } from '../data/courtDatabase';

interface PopupAnnouncementModalProps {
  onNavigate: (section: NavSection) => void;
}

const STORAGE_POPUP_DISMISSED_KEY = 'dilmilti5_popup_dismissed_session_v1';

export default function PopupAnnouncementModal({ onNavigate }: PopupAnnouncementModalProps) {
  const [config, setConfig] = useState<PopupAnnouncementConfig>(() => CourtDB.getPopupConfig());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check database config updates
    const handleDbUpdate = () => {
      setConfig(CourtDB.getPopupConfig());
    };
    window.addEventListener('dilmilti_db_updated', handleDbUpdate);

    // 2. Allow Admin or buttons to trigger a forced preview
    const handleForcePreview = () => {
      const current = CourtDB.getPopupConfig();
      setConfig(current);
      setIsOpen(true);
    };
    window.addEventListener('open_popup_announcement_preview', handleForcePreview);

    // 3. Initial check on first access
    const currentConfig = CourtDB.getPopupConfig();
    if (currentConfig.isActive) {
      const dismissed = sessionStorage.getItem(STORAGE_POPUP_DISMISSED_KEY);
      if (!dismissed) {
        // Small delay for smooth entry after DOM paints
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => {
          clearTimeout(timer);
          window.removeEventListener('dilmilti_db_updated', handleDbUpdate);
          window.removeEventListener('open_popup_announcement_preview', handleForcePreview);
        };
      }
    }

    return () => {
      window.removeEventListener('dilmilti_db_updated', handleDbUpdate);
      window.removeEventListener('open_popup_announcement_preview', handleForcePreview);
    };
  }, []);

  const handleClose = () => {
    if (dontShowAgain || config.showOnlyOncePerSession) {
      sessionStorage.setItem(STORAGE_POPUP_DISMISSED_KEY, 'true');
    }
    setIsOpen(false);
  };

  const handleActionClick = () => {
    handleClose();
    if (config.buttonLinkTab) {
      onNavigate(config.buttonLinkTab as NavSection);
    } else if (config.externalLink) {
      window.open(config.externalLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="popup-announcement-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 md:p-6 bg-slate-950/75 backdrop-blur-xl transition-all duration-300 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Outer Modern Glowing Border Wrapper */}
      <div 
        id="popup-announcement-modal"
        className="relative w-full max-w-2xl rounded-[28px] p-[1.5px] bg-gradient-to-b from-amber-400 via-emerald-500/40 to-amber-500 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.15)] overflow-hidden text-white transform transition-all animate-scaleUp"
      >
        
        {/* Modal Interior Container with Deep Luxury Glass */}
        <div className="relative w-full bg-gradient-to-b from-[#0B2518]/95 via-[#061C12]/95 to-[#020F08]/98 backdrop-blur-2xl rounded-[26px] overflow-hidden flex flex-col">
          
          {/* Ambient Lighting Orbs in Background */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-military-camo-pattern opacity-10 mix-blend-overlay pointer-events-none"></div>

          {/* Top Modern Header Bar */}
          <div className="relative z-10 px-5 sm:px-7 pt-5 sm:pt-6 pb-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* Glowing Icon Emblem */}
              <div className="relative group/emblem">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[1.5px] shadow-[0_4px_16px_rgba(245,158,11,0.4)] flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-[#09331D] via-[#051C10] to-slate-950 rounded-[14px] flex items-center justify-center text-amber-300">
                    <ShieldCheck className="w-6 h-6 stroke-[2.2] drop-shadow-md" />
                  </div>
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-amber-400/40 blur-md opacity-75 pointer-events-none -z-10"></div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                    {config.badge || 'MAKLUMAT RESMI'}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-300/90 font-bold hidden sm:inline">
                    DILMILTI V MAKASSAR
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-100 font-serif tracking-tight mt-0.5">
                  Pengadilan Militer Tinggi V Makassar
                </h3>
              </div>
            </div>

            {/* Circular Close Button with Smooth Rotate */}
            <button
              type="button"
              id="btn-close-popup-header"
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-500 hover:text-white text-slate-300 flex items-center justify-center transition-all duration-300 cursor-pointer border border-white/15 hover:rotate-90 hover:scale-110 shadow-sm"
              title="Tutup Pengumuman"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body Scrollable Content */}
          <div className="relative z-10 px-5 sm:px-7 py-5 max-h-[68vh] overflow-y-auto space-y-4 sm:space-y-5">
            
            {/* Optional Poster / Banner Image */}
            {config.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl group/banner">
                <img 
                  src={
                    config.imageUrl.startsWith('data:')
                      ? config.imageUrl
                      : `${config.imageUrl}${config.imageUrl.includes('?') ? '&' : '?'}v=${encodeURIComponent(config.updatedAt || '1')}`
                  } 
                  alt="Banner Pengumuman" 
                  referrerPolicy="no-referrer"
                  className="w-full h-44 sm:h-52 object-cover object-center group-hover/banner:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-xs font-bold text-amber-300">
                    <div className="flex items-center gap-1.5 drop-shadow-md">
                      <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
                      <span>Pelayanan Berkeadilan, Cepat, Sederhana &amp; Bebas Biaya</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-black/60 text-emerald-300 font-mono text-[10px] border border-emerald-500/40 backdrop-blur-xs">
                      SMAP ISO 37001
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h2 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 font-serif leading-snug">
                {config.title}
              </h2>
              {config.subtitle && (
                <p className="text-xs sm:text-sm font-semibold text-emerald-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{config.subtitle}</span>
                </p>
              )}
            </div>

            {/* Main Content Paragraph with Frosted Glass Container */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs sm:text-sm leading-relaxed text-slate-200 shadow-inner">
              {config.content}
            </div>

            {/* Bullet Points with Modern Pill Cards */}
            {config.bulletPoints && config.bulletPoints.length > 0 && (
              <div className="space-y-2.5">
                <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Poin Utama Maklumat:</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {config.bulletPoints.map((point, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 text-xs sm:text-[13px] text-slate-200 bg-gradient-to-r from-emerald-950/50 to-slate-900/50 p-3 rounded-xl border border-emerald-500/25 shadow-xs hover:border-amber-400/50 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="leading-relaxed font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Maklumat Integritas Trust Seal */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-[#0C301D] via-[#092416] to-[#05170E] border border-amber-400/40 text-xs text-emerald-100 shadow-md">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="font-semibold">Zona Integritas (WBK/WBBM) • Zero Gratifikasi</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black tracking-wider shadow-xs">
                LAYANAN BEBAS PUNGLI
              </span>
            </div>

          </div>

          {/* Modern Footer Actions & Session Checkbox */}
          <div className="relative z-10 px-5 sm:px-7 py-4 bg-black/60 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3.5">
            
            {/* Custom Modern Checkbox */}
            <label className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer select-none transition-colors">
              <input 
                type="checkbox" 
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded-md text-amber-400 focus:ring-amber-400 focus:ring-offset-0 bg-slate-900 border-slate-700 cursor-pointer"
              />
              <span>Jangan tampilkan lagi pada sesi ini</span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                id="btn-dismiss-popup"
                onClick={handleClose}
                className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold hover:text-white transition-all cursor-pointer"
              >
                Tutup
              </button>
              
              <button
                type="button"
                id="btn-action-popup"
                onClick={handleActionClick}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs shadow-lg hover:shadow-amber-400/35 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
              >
                <span>{config.buttonText || 'Buka Layanan'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
