import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Camera,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Share2,
  Check,
  Eye,
  Grid,
  Briefcase,
  Scale,
  GraduationCap,
  Award,
  Sparkles,
  ExternalLink,
  Layers,
  Play,
  Pause,
  Clock
} from 'lucide-react';
import { GalleryPhoto, GALLERY_CATEGORIES, INITIAL_GALLERY_PHOTOS } from '../data/galleryData';

interface GaleriFotoSectionProps {
  initialCategory?: string;
  onNavigate?: (section: string, subTab?: string) => void;
}

export const GaleriFotoSection: React.FC<GaleriFotoSectionProps> = ({
  initialCategory = 'semua',
  onNavigate
}) => {
  const [photos] = useState<GalleryPhoto[]>(INITIAL_GALLERY_PHOTOS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'terbaru' | 'terlama' | 'populer'>('terbaru');
  const [gridColumns, setGridColumns] = useState<'normal' | 'compact'>('normal');

  // Lightbox States
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [slideDelay, setSlideDelay] = useState<number>(3000);

  // Auto-play interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAutoPlaying && lightboxIndex !== null) {
      interval = setInterval(() => {
        handleNext();
      }, slideDelay);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, lightboxIndex, slideDelay]);

  // Filter & Sort Photos
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchCat = selectedCategory === 'semua' || photo.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        photo.title.toLowerCase().includes(q) ||
        photo.desc.toLowerCase().includes(q) ||
        photo.location.toLowerCase().includes(q) ||
        photo.categoryLabel.toLowerCase().includes(q) ||
        photo.officials.some((off) => off.toLowerCase().includes(q));
      return matchCat && matchQuery;
    }).sort((a, b) => {
      if (sortBy === 'populer') return b.views - a.views;
      if (sortBy === 'terlama') return a.id.localeCompare(b.id);
      return b.id.localeCompare(a.id); // 'terbaru'
    });
  }, [photos, selectedCategory, searchQuery, sortBy]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  // Open Lightbox
  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setZoomLevel(1);
  };

  // Close Lightbox
  const handleCloseLightbox = useCallback(() => {
    setLightboxIndex(null);
    setZoomLevel(1);
    setIsAutoPlaying(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreen(false);
  }, []);

  // Navigation handlers for Lightbox
  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredPhotos.length - 1));
    setZoomLevel(1);
  }, [lightboxIndex, filteredPhotos.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    setLightboxIndex((prev) => (prev! < filteredPhotos.length - 1 ? prev! + 1 : 0));
    setZoomLevel(1);
  }, [lightboxIndex, filteredPhotos.length]);

  // Zoom Controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Download Photo
  const handleDownloadPhoto = (photo: GalleryPhoto) => {
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.target = '_blank';
    link.download = `Dilmilti-Makassar-${photo.category}-${photo.date.replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Photo Link / Info
  const handleSharePhoto = (photo: GalleryPhoto) => {
    const shareText = `Dokumentasi Resmi Pengadilan Militer Tinggi V Makassar\n"${photo.title}"\nTanggal: ${photo.date}\nLokasi: ${photo.location}\nKategori: ${photo.categoryLabel}`;
    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Keyboard navigation inside lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleCloseLightbox, handlePrev, handleNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'kunjungan':
        return <Users className="w-4 h-4 text-amber-400" />;
      case 'kegiatan-dinas':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'sidang':
        return <Scale className="w-4 h-4 text-sky-400" />;
      case 'pembinaan':
        return <GraduationCap className="w-4 h-4 text-violet-400" />;
      case 'upacara':
        return <Award className="w-4 h-4 text-rose-400" />;
      default:
        return <Grid className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <section id="galeri-foto-section" className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-900 border-2 border-emerald-600/50 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <Camera className="w-4 h-4 text-amber-400" />
            <span>DOKUMENTASI VISUAL RESMI</span>
            <span>•</span>
            <span>PENGADILAN MILITER TINGGI V MAKASSAR</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
            Galeri Kegiatan Dinas &amp; Kunjungan Kerja Resmi
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Pusat dokumentasi fotografi kegiatan apel kedinasan, kunjungan kehormatan pimpinan Mahkamah Agung RI, audiensi Komando Daerah Militer, persidangan militer, dan pembinaan satuan kerja di wilayah hukum Indonesia Timur.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-200">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-bold">
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>{photos.length} Dokumentasi Terarsip</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
              <span>Resolusi HD</span>
              <span>•</span>
              <span>Fitur Lightbox Interaktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter, Search & Layout Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {GALLERY_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'semua'
                ? photos.length
                : photos.filter((p) => p.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-900 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort & Grid Toggle Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kegiatan, pejabat, kunjungan, atau lokasi..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="text-[11px] font-bold text-slate-500 hidden md:inline">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="populer">Paling Banyak Dilihat</option>
              </select>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setGridColumns('normal')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  gridColumns === 'normal' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Grid Standar (3 Kolom)"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setGridColumns('compact')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  gridColumns === 'compact' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Grid Rapat (4 Kolom)"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Tidak ada dokumentasi foto yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tidak ditemukan foto untuk kata kunci "{searchQuery}" pada kategori yang dipilih. Silakan reset filter atau gunakan kata kunci lain.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('semua');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Tampilkan Semua Foto
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-5 ${
            gridColumns === 'compact'
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {filteredPhotos.map((photo, index) => (
            <article
              key={photo.id}
              onClick={() => handleOpenLightbox(index)}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-600 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Photo Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-300 backdrop-blur-xs border border-amber-400/30">
                    {photo.categoryLabel}
                  </span>

                  <div className="flex items-center gap-1 text-[10px] font-mono bg-black/60 text-slate-200 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    <Eye className="w-3 h-3 text-emerald-400" />
                    <span>{photo.views}</span>
                  </div>
                </div>

                {/* Hover Maximize Overlay Icon */}
                <div className="absolute inset-0 bg-emerald-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs pointer-events-none">
                  <div className="p-2.5 rounded-full bg-amber-400 text-slate-950 shadow-lg transform group-hover:scale-110 transition-transform">
                    <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-white drop-shadow-md">Klik untuk Perbesar</span>
                </div>

                {/* Bottom Overlay Date & Location snippet */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] flex items-center justify-between font-mono drop-shadow-md pointer-events-none">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    {photo.date}
                  </span>
                  <span className="truncate max-w-[50%] text-right text-slate-300">
                    {photo.location.split('&')[0]}
                  </span>
                </div>
              </div>

              {/* Photo Caption & Metadata */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                    {photo.title}
                  </h3>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {photo.desc}
                  </p>
                </div>

                {/* Attending Officials preview */}
                {photo.officials && photo.officials.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 space-y-0.5">
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <Users className="w-3 h-3 text-emerald-700" />
                      <span>Hadir: {photo.officials[0]}</span>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan Lightbox Foto"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-in fade-in duration-200"
          onClick={handleCloseLightbox}
        >
          {/* Top Bar Navigation & Controls */}
          <header
            className="w-full bg-slate-950/80 border-b border-white/10 px-4 py-3 flex items-center justify-between text-white shrink-0 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Counter & Title */}
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-xs font-mono">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white truncate max-w-md">
                  {activePhoto.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {activePhoto.categoryLabel} • {activePhoto.date}
                </div>
              </div>
            </div>

            {/* Right: Zoom, Slideshow & Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`p-2 rounded-lg ${isAutoPlaying ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white'} hover:bg-white/20 transition-colors cursor-pointer`}
                title={isAutoPlaying ? 'Jeda Slideshow' : 'Mulai Slideshow'}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <div className="relative flex items-center">
                <Clock className="w-4 h-4 text-slate-400 mr-2" />
                <select
                  value={slideDelay}
                  onChange={(e) => setSlideDelay(Number(e.target.value))}
                  className="bg-white/10 text-white text-[10px] rounded px-1 py-0.5 border border-white/20 cursor-pointer"
                >
                  <option value="2000">2s</option>
                  <option value="3000">3s</option>
                  <option value="5000">5s</option>
                </select>
              </div>

              <div className="w-px h-5 bg-white/20 mx-1"></div>

              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition-colors cursor-pointer"
                title="Perkecil (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-mono px-2 text-slate-300">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition-colors cursor-pointer"
                title="Perbesar (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {zoomLevel > 1 && (
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Reset Zoom (0)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <div className="w-px h-5 bg-white/20 mx-1"></div>

              <button
                type="button"
                onClick={() => handleDownloadPhoto(activePhoto)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Unduh Foto Resmi"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSharePhoto(activePhoto)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Salin Rincian &amp; Tautan Foto"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer hidden sm:block"
                title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleCloseLightbox}
                className="p-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer ml-1"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Main Photo Viewing Area */}
          <div
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Navigation Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto Sebelumnya"
              className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-amber-400 text-white hover:text-slate-950 border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Display Image with Scale Animation */}
            <div
              className="relative max-w-full max-h-[68vh] sm:max-h-[72vh] flex items-center justify-center transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-w-full max-h-[68vh] sm:max-h-[72vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />
            </div>

            {/* Next Navigation Arrow */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto Berikutnya"
              className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-amber-400 text-white hover:text-slate-950 border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Bottom Information Drawer & Thumbnail Bar */}
          <footer
            className="w-full bg-slate-950/95 border-t border-white/10 p-4 sm:p-5 text-white shrink-0 z-20 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              {/* Event Details */}
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-emerald-300">
                  <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 font-bold">
                    {activePhoto.categoryLabel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {activePhoto.date} {activePhoto.time ? `• ${activePhoto.time}` : ''}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {activePhoto.location}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  {activePhoto.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  {activePhoto.desc}
                </p>

                {activePhoto.officials && activePhoto.officials.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Users className="w-3 h-3" /> Pejabat / Pihak Hadir:
                    </span>
                    {activePhoto.officials.map((off, oIdx) => (
                      <span key={oIdx} className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-200">
                        {off}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Photographer Info */}
              <div className="text-right text-[10px] font-mono text-slate-400 shrink-0 self-end md:self-center">
                <div>Dokumentasi: {activePhoto.photographer}</div>
                <div className="text-emerald-400">{activePhoto.views}x Dilihat</div>
              </div>
            </div>

            {/* Thumbnail Strip for Quick Hopping */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {filteredPhotos.map((thumb, tIdx) => (
                <button
                  key={thumb.id}
                  type="button"
                  onClick={() => {
                    setLightboxIndex(tIdx);
                    setZoomLevel(1);
                  }}
                  className={`relative w-14 sm:w-16 h-10 sm:h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    tIdx === lightboxIndex
                      ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/30'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                  title={thumb.title}
                >
                  <img
                    src={thumb.imageUrl}
                    alt={thumb.title}
                    className="w-full h-full object-cover"
                  />
                  {tIdx === lightboxIndex && (
                    <div className="absolute inset-0 bg-amber-400/20 pointer-events-none"></div>
                  )}
                </button>
              ))}
            </div>
          </footer>
        </div>
      )}
    </section>
  );
};
