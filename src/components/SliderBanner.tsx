import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Compass, 
  Sparkles, 
  Newspaper, 
  Calendar, 
  User, 
  Eye, 
  Layers, 
  Play, 
  Pause, 
  Bookmark, 
  ExternalLink,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { NavSection, MakassarSlide, NewsItem } from '../types';
import { CourtDB } from '../data/courtDatabase';
import { getFreshImageUrl } from '../utils/imageHelper';

interface SliderBannerProps {
  onNavigate: (section: NavSection, subTab?: string) => void;
  onOpenAuth?: () => void;
}

export type SliderFilterMode = 'all' | 'news' | 'services';

export interface UnifiedSlideItem {
  id: string;
  type: 'news' | 'service';
  title: string;
  subtitle: string;
  desc: string;
  badge: string;
  tag: string;
  bgImage: string;
  actionText: string;
  targetSection?: NavSection;
  targetSubTab?: string;
  newsId?: string | number;
  date?: string;
  author?: string;
  views?: string;
  isFeatured?: boolean;
}

const DEFAULT_BANNER_IMAGE = '/images/makassar_court_banner_1789442426023.jpg';
const SLIDE_INTERVAL_MS = 7500;

export default function SliderBanner({ onNavigate, onOpenAuth }: SliderBannerProps) {
  const [dbSlides, setDbSlides] = useState<MakassarSlide[]>(() => CourtDB.getSlides());
  const [dbNews, setDbNews] = useState<NewsItem[]>(() => CourtDB.getNewsList());
  const [filterMode, setFilterMode] = useState<SliderFilterMode>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  
  // Touch swipe support
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Subscribe to central CourtDB updates
  useEffect(() => {
    const handleDbUpdate = () => {
      setDbSlides(CourtDB.getSlides());
      setDbNews(CourtDB.getNewsList());
    };

    const unsubscribe = CourtDB.subscribe(handleDbUpdate);
    window.addEventListener('dilmilti_db_updated', handleDbUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('dilmilti_db_updated', handleDbUpdate);
    };
  }, []);

  // Build unified slide items combining official Satker slides and News headlines
  const allSlides: UnifiedSlideItem[] = useMemo(() => {
    const serviceSlides: UnifiedSlideItem[] = dbSlides.slice(0, 5).map((s, idx) => ({
      id: `service-${s.id || idx}`,
      type: 'service',
      title: s.title,
      subtitle: s.subtitle,
      desc: s.desc,
      badge: s.badge || 'LAYANAN UNGGULAN',
      tag: s.tag || 'INOVASI MA-RI',
      bgImage: s.bgImage || DEFAULT_BANNER_IMAGE,
      actionText: s.actionText || 'Lihat Detail Layanan',
      targetSection: (s.targetSection || 'layanan-publik') as NavSection,
      isFeatured: idx === 0
    }));

    const newsSlides: UnifiedSlideItem[] = dbNews.slice(0, 4).map((n, idx) => ({
      id: `news-${n.id || idx}`,
      type: 'news',
      title: n.judul,
      subtitle: `${n.kategori} • ${n.tanggal}`,
      desc: n.ringkasan,
      badge: 'HEADLINE BERITA',
      tag: n.kategori,
      bgImage: n.gambarUrl || DEFAULT_BANNER_IMAGE,
      actionText: 'Baca Berita Selengkapnya',
      targetSection: 'berita',
      targetSubTab: 'berita-terkini',
      newsId: n.id,
      date: n.tanggal,
      author: n.penulis || 'Humas Dilmilti V Makassar',
      views: n.views || '1.4k',
      isFeatured: false
    }));

    // Interleave slides prioritizing custom configured Satker banner slides first
    const combined: UnifiedSlideItem[] = [];
    const maxLen = Math.max(serviceSlides.length, newsSlides.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < serviceSlides.length) combined.push(serviceSlides[i]);
      if (i < newsSlides.length) combined.push(newsSlides[i]);
    }

    return combined.length > 0 ? combined : serviceSlides;
  }, [dbNews, dbSlides]);

  // Filtered slide list according to selected mode
  const displayedSlides = useMemo(() => {
    if (filterMode === 'news') {
      const filtered = allSlides.filter((s) => s.type === 'news');
      return filtered.length > 0 ? filtered : allSlides;
    }
    if (filterMode === 'services') {
      const filtered = allSlides.filter((s) => s.type === 'service');
      return filtered.length > 0 ? filtered : allSlides;
    }
    return allSlides;
  }, [allSlides, filterMode]);

  // Safe index within bounds
  const safeIndex = Math.min(currentIndex, Math.max(0, displayedSlides.length - 1));
  const activeSlide = displayedSlides[safeIndex] || displayedSlides[0];

  // Reset index if filter changes and safeIndex exceeds bounds
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [filterMode]);

  // Smooth Auto-Progress Timer & Progress Bar (Runs at 50ms interval)
  useEffect(() => {
    if (displayedSlides.length <= 1 || isPaused) return;

    const stepMs = 50;
    const progressIncrement = (stepMs / SLIDE_INTERVAL_MS) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setDirection('next');
          setCurrentIndex((idx) => (idx + 1) % displayedSlides.length);
          return 0;
        }
        return prev + progressIncrement;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [displayedSlides.length, isPaused]);

  const handleNext = useCallback(() => {
    if (displayedSlides.length <= 1) return;
    setDirection('next');
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % displayedSlides.length);
  }, [displayedSlides.length]);

  const handlePrev = useCallback(() => {
    if (displayedSlides.length <= 1) return;
    setDirection('prev');
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + displayedSlides.length) % displayedSlides.length);
  }, [displayedSlides.length]);

  const handleSelectSlide = (idx: number) => {
    if (idx === safeIndex) return;
    setDirection(idx > safeIndex ? 'next' : 'prev');
    setProgress(0);
    setCurrentIndex(idx);
  };

  const handleActionClick = (slide: UnifiedSlideItem) => {
    if (slide.type === 'news' && slide.newsId) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'berita');
        url.searchParams.set('newsId', String(slide.newsId));
        window.history.pushState({}, '', url.toString());
      } catch {}
      onNavigate('berita', 'berita-terkini');
    } else if (slide.targetSection) {
      onNavigate(slide.targetSection, slide.targetSubTab);
    } else {
      onNavigate('layanan-publik');
    }
  };

  // Touch Swipe Handlers for mobile navigation
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  if (displayedSlides.length === 0 || !activeSlide) {
    return (
      <section 
        id="slider-pengadilan-makassar"
        className="relative overflow-hidden bg-[#05120B] text-white shadow-xl py-16 text-center border-b border-[#E0AF82]/40 rounded-2xl"
      >
        <p className="text-amber-400 font-medium">Belum ada slide banner yang dipublikasikan.</p>
      </section>
    );
  }

  return (
    <section 
      id="slider-pengadilan-makassar"
      aria-label="Hero Carousel Banner Pengadilan Militer Tinggi V Makassar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#05140C] text-white shadow-2xl border-2 border-amber-400/70 select-none group/slider tactical-corners slider-banner-container"
    >
      {/* 1. KEN BURNS PHOTO BACKGROUND WITH SMOOTH DISSOLVE */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          key={`bg-slide-${activeSlide.id}-${activeSlide.bgImage}`}
          src={getFreshImageUrl(activeSlide.bgImage || DEFAULT_BANNER_IMAGE)}
          alt={activeSlide.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-95 animate-slider-bg transition-opacity duration-700 ease-out slider-banner-image brightness-105 contrast-105"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (!target.src.includes('makassar_court_banner')) {
              target.src = DEFAULT_BANNER_IMAGE;
            }
          }}
        />
        {/* Layered Brighter & Clearer Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#042614]/75 via-transparent to-black/20"></div>
        <div className="absolute inset-0 bg-military-camo-pattern opacity-10 mix-blend-overlay"></div>
      </div>

      {/* 2. TOP SLIDER TOOLBAR: SLIDE COUNTER & CONTROLS */}
      <div className="relative z-20 px-4 sm:px-8 pt-4 sm:pt-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/15">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
              {activeSlide.badge}
            </span>
          </div>

          {/* Controls: Play/Pause, Slide Counter & Arrow Nav */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Putar Otomatis' : 'Jeda Rotasi Slide'}
              aria-label={isPaused ? 'Putar Otomatis' : 'Jeda Rotasi Slide'}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <span className="text-[11px] font-mono font-bold text-amber-300 bg-black/50 px-2.5 py-1 rounded-lg border border-amber-400/40">
              {safeIndex + 1} / {displayedSlides.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Slide Sebelumnya"
                title="Slide Sebelumnya"
                className="w-8 h-8 rounded-xl bg-slate-900/85 hover:bg-amber-400 text-slate-100 hover:text-slate-950 border border-slate-700 hover:border-amber-300 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Slide Berikutnya"
                title="Slide Berikutnya"
                className="w-8 h-8 rounded-xl bg-slate-900/85 hover:bg-amber-400 text-slate-100 hover:text-slate-950 border border-slate-700 hover:border-amber-300 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Smooth Linear Progress Bar */}
        <div className="w-full bg-white/15 h-1 rounded-full overflow-hidden mt-1.5">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 3. MAIN SLIDE CONTENT */}
      <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-12">
        {/* Ambient Glowing Background Accent */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div 
          key={`content-slide-${activeSlide.id}-${direction}`}
          className={direction === 'next' ? 'animate-slider-next space-y-4 relative z-10' : 'animate-slider-prev space-y-4 relative z-10'}
        >
          {/* Sub-tag or Category Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-300 tracking-wide uppercase flex items-center gap-2 bg-emerald-950/90 px-3.5 py-1.5 rounded-xl border border-amber-400/50 shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span>{activeSlide.tag}</span>
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-xl max-w-4xl font-serif">
            {activeSlide.title}
          </h2>

          {/* Subtitle Accent */}
          <div className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping opacity-75"></span>
            <span className="bg-black/40 px-3 py-1 rounded-lg border border-amber-400/30 backdrop-blur-sm">{activeSlide.subtitle}</span>
          </div>

          {/* Summary / Excerpt */}
          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed max-w-3xl line-clamp-3 md:line-clamp-2 bg-black/30 p-3.5 rounded-xl border border-white/10 backdrop-blur-sm">
            {activeSlide.desc}
          </p>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleActionClick(activeSlide)}
              aria-label={activeSlide.actionText}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-amber-400/50 border border-amber-200 transition-all cursor-pointer group/btn active:scale-95"
            >
              <span>{activeSlide.actionText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1.5" />
            </button>
          </div>

        </div>
      </div>

      {/* 4. CLEAN MINIMALIST DOT INDICATORS */}
      <div className="relative z-20 px-4 sm:px-8 pb-6 pt-2 flex items-center justify-center gap-2">
        {displayedSlides.map((slide, idx) => {
          const isActive = idx === safeIndex;
          return (
            <button
              key={`dot-${slide.id}-${idx}`}
              type="button"
              onClick={() => handleSelectSlide(idx)}
              aria-label={`Pilih slide ${idx + 1}`}
              className={`transition-all duration-300 cursor-pointer rounded-full ${
                isActive
                  ? 'w-8 h-2 bg-amber-400 shadow-md'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          );
        })}
      </div>

    </section>
  );
}
