import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Newspaper, 
  Calendar, 
  ArrowRight, 
  Eye, 
  Image as ImageIcon, 
  Video, 
  BookOpen, 
  Download, 
  ExternalLink, 
  Megaphone, 
  FileText, 
  Play, 
  MessageSquare, 
  Send, 
  User, 
  CheckCircle2, 
  X, 
  Maximize2, 
  Share2, 
  Copy, 
  Check, 
  Scale, 
  Sparkles, 
  Shield, 
  Compass, 
  Award,
  Rss,
  Headphones
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { NewsItem, CourtIdentityData } from '../types';
import { syncRouteToUrl } from '../utils/urlRouter';
import RssFeedModal from './RssFeedModal';
import ArticleTextToSpeechPlayer from './ArticleTextToSpeechPlayer';
import { GaleriFotoSection } from './GaleriFotoSection';

interface BeritaSectionProps {
  initialSubTab?: string;
  onNavigate?: (tab: string, subTab?: string) => void;
}

interface NewsCardItemProps {
  key?: React.Key;
  news: NewsItem;
  index: number;
  defaultThumbnail: string;
  itemComments: any[];
  formState: { name: string; role: string; text: string };
  isSuccess: boolean;
  onSelect: () => void;
  onShare: () => void;
  onUpdateComment: (field: 'name' | 'role' | 'text', val: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
}

function NewsCardItem({
  news,
  index,
  defaultThumbnail,
  itemComments,
  formState,
  isSuccess,
  onSelect,
  onShare,
  onUpdateComment,
  onSubmitComment
}: NewsCardItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const staggerMs = (index % 6) * 110;

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, staggerMs + 650);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasAnimated, staggerMs]);

  return (
    <div
      ref={cardRef}
      style={!hasAnimated ? {
        transitionDelay: `${staggerMs}ms`
      } : undefined}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between group cursor-pointer will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-[0.98]'
      } ${
        hasAnimated
          ? 'transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.025] active:scale-[0.99] hover:shadow-2xl hover:border-emerald-600/80 hover:ring-2 hover:ring-emerald-500/25'
          : 'transition-all duration-650 cubic-bezier(0.16, 1, 0.3, 1)'
      }`}
    >
      {/* Thumbnail Image Header with Enhanced Zoom and Hover Overlay */}
      <div 
        className="relative h-48 overflow-hidden bg-slate-100"
        onClick={onSelect}
      >
        <img
          src={news.gambarUrl || defaultThumbnail}
          alt={news.judul}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
          <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20">
            <span>Baca Berita Selengkapnya</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-900/85 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-sm group-hover:scale-105 transition-transform duration-300">
            {news.kategori}
          </span>
        </div>

        {/* Tombol Bagikan Cepat pada Gambar */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            aria-label="Bagikan Berita"
            title="Bagikan Berita ini"
            className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-emerald-700 text-amber-300 hover:text-white backdrop-blur-md border border-white/25 transition-all shadow-md hover:scale-110 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-2 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-600" />
              {news.tanggal}
            </span>
            <div className="flex items-center gap-2">
              {news.views && <span>{news.views}</span>}
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <MessageSquare className="w-3 h-3" />
                {itemComments.length}
              </span>
            </div>
          </div>

          <h3 
            className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-[#0A3D24] transition-colors cursor-pointer line-clamp-2"
            onClick={onSelect}
          >
            {news.judul}
          </h3>

          <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
            {news.ringkasan}
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
            <span className="text-[11px] text-slate-600 font-medium truncate max-w-[110px]" title={news.penulis}>
              {news.penulis}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                title="Dengarkan berita ini dengan Text-to-Speech Player"
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
              >
                <Headphones className="w-3 h-3 text-slate-950" />
                <span>Audio</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                title="Bagikan tautan atau ke media sosial"
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <Share2 className="w-3 h-3 text-emerald-700" />
                <span>Bagikan</span>
              </button>
              <button
                type="button"
                onClick={onSelect}
                className="text-[#0E29CD] hover:text-blue-800 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <span>Baca</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Komentar & Diskusi Singkat pada Setiap Item Berita */}
        <div className="pt-3 border-t border-slate-200/80 bg-slate-50/70 -mx-5 -mb-5 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#0A3D24] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Komentar &amp; Diskusi ({itemComments.length})</span>
            </span>
            {isSuccess && (
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Terkirim
              </span>
            )}
          </div>

          {/* Daftar Komentar Singkat */}
          {itemComments.length > 0 ? (
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {itemComments.slice(-2).map((cmt) => (
                <div
                  key={cmt.id}
                  className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] space-y-0.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 truncate">{cmt.authorName}</span>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{cmt.createdAt}</span>
                  </div>
                  <p className="text-slate-600 leading-snug line-clamp-2">{cmt.content}</p>
                </div>
              ))}
              {itemComments.length > 2 && (
                <button
                  type="button"
                  onClick={onSelect}
                  className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Lihat semua {itemComments.length} komentar →
                </button>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic">
              Belum ada masukan. Tulis komentar singkat Anda di bawah:
            </p>
          )}

          {/* Form Input Komentar Singkat */}
          <form
            onSubmit={onSubmitComment}
            className="space-y-1.5 pt-1"
          >
            <input
              type="text"
              placeholder="Nama Anda (Opsional)"
              value={formState.name}
              onChange={(e) => onUpdateComment('name', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px] text-slate-800 focus:outline-none focus:border-emerald-700"
            />
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                required
                placeholder="Tulis komentar / masukan singkat..."
                value={formState.text}
                onChange={(e) => onUpdateComment('text', e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px] text-slate-800 focus:outline-none focus:border-emerald-700"
              />
              <button
                type="submit"
                aria-label="Kirim Komentar"
                className="px-3 py-1.5 rounded-lg bg-[#0A3D24] hover:bg-emerald-900 text-amber-300 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Kirim</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BeritaSection({ initialSubTab = 'berita-terkini', onNavigate }: BeritaSectionProps) {
  const [courtIdentity, setCourtIdentity] = useState<CourtIdentityData>(() => CourtDB.getCourtIdentity());
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab || 'berita-terkini');
  const [isRssModalOpen, setIsRssModalOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, { name: string; role: string; text: string }>>({});
  const [commentSuccessMap, setCommentSuccessMap] = useState<Record<string, boolean>>({});
  const [sharingArticle, setSharingArticle] = useState<NewsItem | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
  const [shareNotification, setShareNotification] = useState<string | null>(null);

  // Auto-open article if newsId query param exists
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const targetNewsId = urlParams.get('newsId') || urlParams.get('id');
      if (targetNewsId && newsList.length > 0) {
        const match = newsList.find((n) => String(n.id) === String(targetNewsId));
        if (match) {
          setSelectedArticle(match);
        }
      }
    } catch {
      // ignore
    }
  }, [newsList]);

  const getShareUrl = (newsItem: NewsItem) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?tab=berita&newsId=${newsItem.id}`;
  };

  const handleCopyLink = async (newsItem: NewsItem) => {
    const url = getShareUrl(newsItem);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedShareId(String(newsItem.id));
      setShareNotification(`Tautan "${newsItem.judul.slice(0, 32)}..." berhasil disalin ke clipboard!`);
      setTimeout(() => {
        setCopiedShareId(null);
      }, 2500);
      setTimeout(() => {
        setShareNotification(null);
      }, 3500);
    } catch (err) {
      console.error('Gagal menyalin link berita:', err);
    }
  };

  const handleNativeShare = async (newsItem: NewsItem) => {
    const url = getShareUrl(newsItem);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${newsItem.judul} — Dilmilti V Makassar`,
          text: newsItem.ringkasan,
          url
        });
      } catch {
        // user dismiss
      }
    } else {
      handleCopyLink(newsItem);
    }
  };

  useEffect(() => {
    const fresh = CourtDB.getNews();
    setNewsList(fresh);
    const handleUpdate = () => {
      setCourtIdentity(CourtDB.getCourtIdentity());
      const updatedList = CourtDB.getNews();
      setNewsList(updatedList);
      setSelectedArticle((prev) => {
        if (!prev) return null;
        return updatedList.find((n) => String(n.id) === String(prev.id)) || prev;
      });
    };
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    const unsubscribe = CourtDB.subscribe(handleUpdate);
    return () => {
      window.removeEventListener('dilmilti_db_updated', handleUpdate);
      unsubscribe();
    };
  }, []);

  const getCommentForm = (newsId: string | number) => {
    const key = String(newsId);
    return commentInputs[key] || { name: '', role: 'Masyarakat Umum', text: '' };
  };

  const updateCommentForm = (newsId: string | number, field: 'name' | 'role' | 'text', value: string) => {
    const key = String(newsId);
    setCommentInputs((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { name: '', role: 'Masyarakat Umum', text: '' }),
        [field]: value
      }
    }));
  };

  const handleSubmitComment = (e: React.FormEvent, newsId: string | number) => {
    e.preventDefault();
    const key = String(newsId);
    const form = getCommentForm(newsId);
    if (!form.text.trim()) return;

    const currentUser = CourtDB.getCurrentSession();
    const authorName = form.name.trim() || currentUser?.nama || 'Pengunjung Portal';
    const authorRole = form.role.trim() || currentUser?.instansi || 'Masyarakat Umum';

    CourtDB.addNewsComment(newsId, {
      authorName,
      authorRole,
      content: form.text.trim()
    });

    const updatedList = CourtDB.getNews();
    setNewsList(updatedList);
    if (selectedArticle && String(selectedArticle.id) === key) {
      const updatedArticle = updatedList.find((n) => String(n.id) === key);
      if (updatedArticle) setSelectedArticle(updatedArticle);
    }

    setCommentInputs((prev) => ({
      ...prev,
      [key]: { name: form.name, role: form.role, text: '' }
    }));
    setCommentSuccessMap((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCommentSuccessMap((prev) => ({ ...prev, [key]: false }));
    }, 3000);
  };

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
      setSelectedArticle(null);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (activeSubTab) {
      syncRouteToUrl('berita', activeSubTab, true);
    }
  }, [activeSubTab]);

  const filteredNews = newsList.filter((item) => {
    if (activeSubTab === 'berita-terkini' || activeSubTab === 'semua') {
      return true;
    }
    if (activeSubTab === 'pengumuman') {
      return item.kategori.toLowerCase().includes('pengumuman') || item.judul.toLowerCase().includes('pengumuman');
    }
    if (activeSubTab === 'artikel-hukum') {
      return item.kategori.toLowerCase().includes('artikel') || item.kategori.toLowerCase().includes('hukum');
    }
    return true;
  });

  const defaultThumbnail = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';

  const videoGallery = [
    {
      id: 'vid-1',
      title: 'Video Profil Pengadilan Militer Tinggi V Makassar Tahun 2026',
      duration: '04:35',
      date: 'September 2026',
      youtubeUrl: 'https://www.youtube.com/@MahkamahAgungRI',
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
      desc: 'Profil lengkap sejarah, wilayah yurisdiksi, inovasi pelayanan digital, dan komitmen Zona Integritas Dilmilti V Makassar.'
    },
    {
      id: 'vid-2',
      title: 'Panduan Lengkap Pendaftaran Perkara & Layanan Meja PTSP / e-Berpadu',
      duration: '03:20',
      date: 'Agustus 2026',
      youtubeUrl: 'https://www.youtube.com/@MahkamahAgungRI',
      thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=80',
      desc: 'Tutorial langkah demi langkah prosedur pendaftaran perkara di Meja PTSP dan pelimpahan berkas e-Berpadu bagi Oditur Militer, Penasihat Hukum, dan masyarakat.'
    },
    {
      id: 'vid-3',
      title: 'Sarana & Fasilitas Ramah Penyandang Disabilitas pada PTSP Dilmilti V Makassar',
      duration: '02:50',
      date: 'Agustus 2026',
      youtubeUrl: 'https://www.youtube.com/@MahkamahAgungRI',
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
      desc: 'Komitmen kesetaraan akses keadilan melalui penyediaan jalur pemandu, kursi roda, loket prioritas, dan juru bahasa isyarat.'
    }
  ];

  const eBrosurList = [
    {
      id: 'eb-1',
      title: 'E-Brosur Standar Pelayanan Terpadu Satu Pintu (PTSP)',
      code: 'BROSUR-PTSP-2026',
      category: 'Layanan PTSP',
      desc: 'Ringkasan persyaratan, prosedur, waktu penyelesaian, dan jaminan biaya Rp 0,- pada Meja Kepaniteraan & PPID.'
    },
    {
      id: 'eb-2',
      title: 'E-Brosur Layanan Bantuan Hukum Gratis (Posbakum) & Sidang Prodeo',
      code: 'BROSUR-POSBAKUM-2026',
      category: 'Layanan Hukum',
      desc: 'Panduan syarat dan tata cara memperoleh layanan konsultasi hukum gratis sesuai PERMA Nomor 1 Tahun 2014.'
    },
    {
      id: 'eb-3',
      title: 'E-Brosur Tata Cara Permohonan Informasi Publik (PPID SK KMA 2-144/2022)',
      code: 'BROSUR-PPID-2026',
      category: 'Informasi Publik',
      desc: 'Alur pengajuan informasi publik, jangka waktu tanggapan 10 hari kerja, dan prosedur keberatan informasi.'
    },
    {
      id: 'eb-4',
      title: 'E-Brosur Tata Cara Pengaduan Masyarakat (SIWAS MA-RI & SP4N-LAPOR!)',
      code: 'BROSUR-SIWAS-2026',
      category: 'Pengawasan',
      desc: 'Saluran resmi pengaduan pelanggaran kode etik hakim/aparatur beserta jaminan perlindungan kerahasiaan pelapor.'
    },
    {
      id: 'eb-5',
      title: 'E-Brosur Sistem Manajemen Anti Penyuapan (SMAP) & Kampanye Anti Gratifikasi',
      code: 'BROSUR-SMAP-2026',
      category: 'Zona Integritas',
      desc: 'Edukasi publik menolak segala bentuk suap, gratifikasi, dan pungutan liar di lingkungan peradilan militer.'
    },
    {
      id: 'eb-6',
      title: 'E-Brosur Alur Berperkara Tingkat Pertama, Banding, Kasasi & PK Militer',
      code: 'BROSUR-PERKARA-2026',
      category: 'Kepaniteraan Pidana',
      desc: 'Skema tahapan pemeriksaan perkara pidana militer dan tata usaha militer sesuai UU No. 31 Tahun 1997.'
    }
  ];

  const handleDownloadBrosur = (item: typeof eBrosurList[0]) => {
    const content = `E-BROSUR RESMI PENGADILAN MILITER TINGGI V MAKASSAR
====================================================================
Judul Brosur : ${item.title}
Kode Dokumen : ${item.code}
Kategori     : ${item.category}

Ringkasan Materi Edukasi Publik:
${item.desc}

Informasi Layanan:
- Alamat  : Jl. Perintis Kemerdekaan KM. 13, Daya, Biringkanaya, Kota Makassar
- Telepon : (0411) 515088
- Email   : dilmiti5makassar@gmail.com
- Prinsip : Cepat, Sederhana, Biaya Ringan (Rp 0,- untuk Perkara Pidana Militer)`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getActiveSubTitle = () => {
    switch (activeSubTab) {
      case 'berita-terkini':
      case 'berita':
        return 'Berita Terkini & Rilis Pers';
      case 'pengumuman':
        return 'Pengumuman Resmi';
      case 'artikel-hukum':
      case 'artikel':
        return 'Artikel & Opini Hukum Militer';
      case 'galeri-foto':
      case 'video-galeri':
      case 'galeri':
        return 'Galeri Foto & Dokumentasi Video';
      case 'e-brosur':
      case 'brosur':
        return 'E-Brosur & Publikasi Digital';
      default:
        return 'Berita & Publikasi';
    }
  };

  return (
    <section id="berita-informasi-section" className="space-y-6">
      
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
          <span className="text-emerald-200 font-semibold">Berita & Publikasi</span>
          <span className="text-emerald-500 font-bold">/</span>
          <span className="text-amber-300 font-black tracking-wide">{getActiveSubTitle()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRssModalOpen(true)}
            className="px-3 py-1 rounded-lg font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-sm active:scale-95"
            title="Langganan RSS Feed Berita & Pengumuman Otomatis"
          >
            <Rss className="w-3 h-3 stroke-[2.5] text-slate-950" />
            <span>RSS Feed</span>
          </button>
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs hidden sm:inline">
            HUMAS
          </span>
        </div>
      </div>

      {/* SUBMENU GALERI FOTO & VIDEO */}
      {(activeSubTab === 'galeri-foto' || activeSubTab === 'video-galeri') && (
        <div className="space-y-6">
          {/* Komponen Galeri Foto Dokumentasi Kegiatan Dinas & Kunjungan Resmi dengan Fitur Lightbox */}
          <GaleriFotoSection onNavigate={onNavigate} />

          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-700" />
                <span>Video Galeri & Siaran Edukasi Hukum Militer</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tayangan video profil satuan kerja, sosialisasi pendaftaran perkara dan keterbukaan informasi, serta fasilitas ramah disabilitas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {videoGallery.map((vid, vIdx) => (
                <div 
                  key={vid.id} 
                  style={{ animationDelay: `${vIdx * 100}ms` }}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white flex flex-col justify-between shadow-2xs hover:shadow-md transition-all animate-fadeInUp"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-900 group">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                      {vid.duration}
                    </span>
                  </div>
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-emerald-700 font-bold">{vid.date}</div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">{vid.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{vid.desc}</p>
                    </div>
                    <a
                      href={vid.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-[#0A3D24] hover:bg-emerald-900 text-amber-300 font-bold text-xs inline-flex items-center justify-center gap-1.5"
                    >
                      <span>Tonton di Kanal Resmi</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBMENU E-BROSUR (ditampilkan bersama Artikel Hukum atau E-Brosur) */}
      {(activeSubTab === 'e-brosur' || activeSubTab === 'artikel-hukum') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>Katalog E-Brosur Layanan Pengadilan Militer Tinggi V Makassar</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unduh brosur informasi layanan digital (PTSP, Posbakum, PPID, SIWAS, SMAP, dan Alur Berperkara) secara gratis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eBrosurList.map((eb) => (
              <div key={eb.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
                      {eb.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{eb.code}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{eb.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{eb.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadBrosur(eb)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0A3D24] hover:bg-emerald-900 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh E-Brosur Resmi</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMENU 1, 2, 3: BERITA TERKINI, PENGUMUMAN, ARTIKEL HUKUM */}
      {['berita-terkini', 'pengumuman', 'artikel-hukum', 'semua'].includes(activeSubTab) && (
        selectedArticle ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 animate-in fade-in">
          <button
            type="button"
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-bold text-[#0E29CD] hover:underline flex items-center gap-1 cursor-pointer mb-2"
          >
            ← Kembali ke Daftar Berita
          </button>

          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
            {selectedArticle.kategori}
          </span>

          <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight">
            {selectedArticle.judul}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-3">
            <span className="flex items-center gap-1 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              {selectedArticle.tanggal}
            </span>
            <span>Oleh: <strong className="text-slate-800">{selectedArticle.penulis}</strong></span>
            {selectedArticle.views && (
              <span className="flex items-center gap-1 text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                {selectedArticle.views}
              </span>
            )}
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <MessageSquare className="w-3.5 h-3.5" />
              {(selectedArticle.comments || []).length} Komentar &amp; Masukan
            </span>
          </div>

          {/* Share Bar in Article Detail View */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5 my-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0A3D24] text-amber-300 flex items-center justify-center shadow-xs">
                <Share2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black text-slate-800">Bagikan Berita Ini:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyLink(selectedArticle)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-emerald-600 text-slate-800 hover:text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                {copiedShareId === String(selectedArticle.id) ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*${selectedArticle.judul}*\n\n${selectedArticle.ringkasan}\n\nBaca selengkapnya di portal resmi Pengadilan Militer Tinggi V Makassar:\n${getShareUrl(selectedArticle)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(selectedArticle))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#1877F2] hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>Facebook</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.judul)}&url=${encodeURIComponent(getShareUrl(selectedArticle))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-black hover:bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>X</span>
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(getShareUrl(selectedArticle))}&text=${encodeURIComponent(selectedArticle.judul)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#229ED9] hover:bg-sky-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>Telegram</span>
              </a>
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={() => handleNativeShare(selectedArticle)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Lainnya</span>
                </button>
              )}
            </div>
          </div>

          {/* AUDIO TEXT-TO-SPEECH PLAYER FOR ACCESSIBILITY & DIFABEL */}
          <ArticleTextToSpeechPlayer
            article={selectedArticle}
            courtName={courtIdentity.name}
          />

          {/* Hero Thumbnail Image */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 my-4 shadow-sm max-h-96">
            <img
              src={selectedArticle.gambarUrl || defaultThumbnail}
              alt={selectedArticle.judul}
              className="w-full h-auto object-cover max-h-96"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
              Dokumentasi Humas Dilmilti V Makassar
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pt-2">
            <p className="font-semibold text-slate-800 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-xl border-l-4 border-[#0E29CD]">
              {selectedArticle.ringkasan}
            </p>
            {selectedArticle.isi ? (
              <div className="whitespace-pre-line space-y-3">
                {selectedArticle.isi}
              </div>
            ) : (
              <>
                <p>
                  MAKASSAR — Kepala Pengadilan Militer Tinggi V Makassar menegaskan bahwa seluruh jajaran peradilan militer di bawah yurisdiksi Dilmilti V Makassar wajib terus mengedepankan profesionalitas, integritas, dan kecepatan dalam memproses administrasi persidangan perkara.
                </p>
                <p>
                  "Transformasi digital melalui sistem informasi penelusuran perkara (SIPP) dan keterbukaan informasi peradilan bukan lagi pilihan, melainkan keharusan untuk memastikan tidak ada lagi perkara yang terhambat proses penyelesaiannya. Prajurit TNI yang mencari keadilan berhak atas kepastian hukum yang tuntas," tegas pimpinan dalam arahannya.
                </p>
                <p>
                  Sistem notifikasi otomatis WhatsApp yang diluncurkan hari ini membuktikan komitmen nyata Pengadilan Militer Tinggi V Makassar dalam memberikan kemudahan pemantauan langsung bagi para oditur militer, perwira staf personil satuan (Ankum), dan penasihat hukum di lapangan.
                </p>
              </>
            )}
          </div>

          {/* KOLOM KOMENTAR & DISKUSI PUBLIK (DETAIL BERITA) */}
          <div className="mt-6 pt-6 border-t-2 border-emerald-900/15 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0A3D24] text-amber-300 flex items-center justify-center shadow-2xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    Kolom Komentar &amp; Diskusi Publik ({(selectedArticle.comments || []).length})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Berikan masukan, tanggapan, atau diskusi singkat yang santun mengenai topik berita ini.
                  </p>
                </div>
              </div>
              {commentSuccessMap[String(selectedArticle.id)] && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Komentar &amp; masukan berhasil dikirim
                </span>
              )}
            </div>

            {/* Daftar Komentar */}
            <div className="space-y-3">
              {(selectedArticle.comments || []).length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  Belum ada komentar pada berita ini. Jadilah yang pertama memberikan masukan atau tanggapan.
                </div>
              ) : (
                (selectedArticle.comments || []).map((cmt) => (
                  <div
                    key={cmt.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center text-[11px] font-black">
                          <User className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">{cmt.authorName}</span>
                        {cmt.authorRole && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {cmt.authorRole}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{cmt.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed pl-8">{cmt.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Form Tambah Komentar */}
            <form
              onSubmit={(e) => handleSubmitComment(e, selectedArticle.id)}
              className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-900/15 space-y-3"
            >
              <div className="text-xs font-extrabold text-[#0A3D24] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Tulis Komentar / Masukan Singkat</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama Anda (Opsional)"
                  value={getCommentForm(selectedArticle.id).name}
                  onChange={(e) => updateCommentForm(selectedArticle.id, 'name', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-emerald-700"
                />
                <select
                  value={getCommentForm(selectedArticle.id).role}
                  onChange={(e) => updateCommentForm(selectedArticle.id, 'role', e.target.value)}
                  aria-label="Kategori Pengirim Komentar"
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-emerald-700"
                >
                  <option value="Masyarakat Umum">Masyarakat Umum</option>
                  <option value="Prajurit TNI / Kesatuan">Prajurit TNI / Kesatuan</option>
                  <option value="Advokat / Praktisi Hukum">Advokat / Praktisi Hukum</option>
                  <option value="Akademisi / Mahasiswa">Akademisi / Mahasiswa</option>
                  <option value="Aparatur Peradilan">Aparatur Peradilan</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <textarea
                  rows={2}
                  required
                  placeholder="Tulis masukan atau diskusi singkat mengenai topik berita ini..."
                  value={getCommentForm(selectedArticle.id).text}
                  onChange={(e) => updateCommentForm(selectedArticle.id, 'text', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-emerald-700 resize-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-[#0A3D24] hover:bg-emerald-900 text-amber-300 font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors self-end sm:self-stretch"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Komentar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Grid of news */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredNews.map((news, index) => (
            <NewsCardItem
              key={news.id}
              news={news}
              index={index}
              defaultThumbnail={defaultThumbnail}
              itemComments={news.comments || []}
              formState={getCommentForm(news.id)}
              isSuccess={!!commentSuccessMap[String(news.id)]}
              onSelect={() => setSelectedArticle(news)}
              onShare={() => setSharingArticle(news)}
              onUpdateComment={(field, val) => updateCommentForm(news.id, field, val)}
              onSubmitComment={(e) => handleSubmitComment(e, news.id)}
            />
          ))}
        </div>
      ))}

      {/* MODAL BAGIKAN BERITA INTERAKTIF */}
      {sharingArticle && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSharingArticle(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-2xl border border-emerald-600/30 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0A3D24] via-[#0D4A2B] to-[#166534] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Share2 className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 id="share-modal-title" className="text-base font-black text-white">Bagikan Berita / Publikasi</h3>
                  <p className="text-[11px] text-emerald-200">Pengadilan Militer Tinggi V Makassar</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSharingArticle(null)}
                aria-label="Tutup Dialog Bagikan"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Article Preview Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex gap-3 items-center">
                <img
                  src={sharingArticle.gambarUrl || defaultThumbnail}
                  alt={sharingArticle.judul}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
                />
                <div className="space-y-1 min-w-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                    {sharingArticle.kategori}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {sharingArticle.judul}
                  </h4>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {sharingArticle.tanggal} • {sharingArticle.penulis}
                  </div>
                </div>
              </div>

              {/* Salin Tautan Langsung */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 text-[11px] flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Salin Tautan / Link Berita</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl(sharingArticle)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 font-mono text-[11px] select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyLink(sharingArticle)}
                    className="px-4 py-2 rounded-xl bg-[#0A3D24] hover:bg-emerald-900 text-amber-300 font-bold text-xs inline-flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {copiedShareId === String(sharingArticle.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bagikan ke Media Sosial */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-800 text-[11px] block">
                  Bagikan Langsung ke Media Sosial & Pesan Instan:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*${sharingArticle.judul}*\n\n${sharingArticle.ringkasan}\n\nBaca selengkapnya di portal resmi Pengadilan Militer Tinggi V Makassar:\n${getShareUrl(sharingArticle)}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex flex-col items-center justify-center gap-1 shadow-2xs transition-all hover:scale-[1.03]"
                  >
                    <span className="text-sm font-black">WhatsApp</span>
                    <span className="text-[10px] text-emerald-100">Kirim Chat / Grup</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(sharingArticle))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-700 text-white font-bold flex flex-col items-center justify-center gap-1 shadow-2xs transition-all hover:scale-[1.03]"
                  >
                    <span className="text-sm font-black">Facebook</span>
                    <span className="text-[10px] text-blue-100">Bagikan Beranda</span>
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(sharingArticle.judul)}&url=${encodeURIComponent(getShareUrl(sharingArticle))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-black hover:bg-slate-900 text-white font-bold flex flex-col items-center justify-center gap-1 shadow-2xs transition-all hover:scale-[1.03]"
                  >
                    <span className="text-sm font-black">X (Twitter)</span>
                    <span className="text-[10px] text-slate-300">Posting Tweet</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(getShareUrl(sharingArticle))}&text=${encodeURIComponent(sharingArticle.judul)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#229ED9] hover:bg-sky-600 text-white font-bold flex flex-col items-center justify-center gap-1 shadow-2xs transition-all hover:scale-[1.03]"
                  >
                    <span className="text-sm font-black">Telegram</span>
                    <span className="text-[10px] text-sky-100">Kirim Pesan</span>
                  </a>
                </div>

                {/* Native Web Share API jika didukung perangkat (misal HP / Tablet) */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    type="button"
                    onClick={() => handleNativeShare(sharingArticle)}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Bagikan Menggunakan Aplikasi Sistem (Menu Perangkat)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Portal Resmi Dilmilti V Makassar</span>
              <button
                type="button"
                onClick={() => setSharingArticle(null)}
                className="font-bold text-slate-700 hover:text-slate-950 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFIKASI TAUTAN TERSALIN */}
      {shareNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold leading-snug">{shareNotification}</p>
        </div>
      )}

      {/* MODAL RSS FEED & AUTO SYNDICATION */}
      <RssFeedModal
        isOpen={isRssModalOpen}
        onClose={() => setIsRssModalOpen(false)}
        onNavigate={onNavigate}
      />

    </section>
  );
}
