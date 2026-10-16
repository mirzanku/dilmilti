import React, { useState, useEffect } from 'react';
import { 
  Rss, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Code, 
  Newspaper, 
  Megaphone, 
  FileText, 
  Scale, 
  Radio, 
  Info,
  Calendar,
  User,
  ArrowRight,
  Download
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { NewsItem, CourtIdentityData } from '../types';

interface RssFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string, subTab?: string) => void;
}

export default function RssFeedModal({ isOpen, onClose, onNavigate }: RssFeedModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'channels' | 'preview' | 'xml'>('channels');
  const [newsList, setNewsList] = useState<NewsItem[]>(() => CourtDB.getNewsList());
  const [courtId, setCourtId] = useState<CourtIdentityData>(() => CourtDB.getCourtIdentity());
  const [xmlContent, setXmlContent] = useState<string>('');
  const [loadingXml, setLoadingXml] = useState<boolean>(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dilmilti5-makassar.go.id';

  const feedChannels = [
    {
      id: 'main',
      title: 'Feed Berita & Publikasi Utama',
      desc: 'Seluruh siaran pers resmi, kegiatan kedinasan, dan dokumentasi yustisial terkini.',
      url: `${origin}/rss.xml`,
      badge: 'FEED UTAMA',
      icon: Newspaper,
      color: 'from-amber-400 to-amber-500'
    },
    {
      id: 'pengumuman',
      title: 'Feed Pengumuman & Maklumat',
      desc: 'Maklumat resmi pimpinan, seleksi, lelang, dan informasi kepaniteraan.',
      url: `${origin}/api/rss/pengumuman.xml`,
      badge: 'PENGUMUMAN',
      icon: Megaphone,
      color: 'from-emerald-400 to-emerald-500'
    },
    {
      id: 'artikel',
      title: 'Feed Analisis & Artikel Hukum',
      desc: 'Kajian yustisial militer, ulasan yurisprudensi, dan artikel ilmiah hukum.',
      url: `${origin}/api/rss/artikel.xml`,
      badge: 'ARTIKEL HUKUM',
      icon: FileText,
      color: 'from-sky-400 to-sky-500'
    },
    {
      id: 'json',
      title: 'JSON Feed v1.1 (Developer API)',
      desc: 'Format terstruktur JSON Feed untuk integrasi bot, dashboard, & mobile app.',
      url: `${origin}/api/rss/json`,
      badge: 'JSON API',
      icon: Code,
      color: 'from-purple-400 to-indigo-500'
    }
  ];

  useEffect(() => {
    const handleUpdate = () => {
      setNewsList(CourtDB.getNewsList());
      setCourtId(CourtDB.getCourtIdentity());
    };
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleUpdate);
  }, []);

  // Fetch live XML when user switches to XML tab
  useEffect(() => {
    if (activeTab === 'xml' && isOpen) {
      setLoadingXml(true);
      fetch('/rss.xml')
        .then((res) => res.text())
        .then((text) => {
          setXmlContent(text);
          setLoadingXml(false);
        })
        .catch(() => {
          // Fallback generate simple XML if offline
          const fallback = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>RSS Feed — ${courtId.name}</title>\n    <link>${origin}</link>\n    <description>${courtId.slogan}</description>\n  </channel>\n</rss>`;
          setXmlContent(fallback);
          setLoadingXml(false);
        });
    }
  }, [activeTab, isOpen, origin, courtId.name, courtId.slogan]);

  const handleCopy = (text: string, key: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {}
  };

  const handleOpenReader = (reader: 'feedly' | 'inoreader' | 'netnewswire', feedUrl: string) => {
    let target = '';
    if (reader === 'feedly') {
      target = `https://feedly.com/i/subscription/feed/${encodeURIComponent(feedUrl)}`;
    } else if (reader === 'inoreader') {
      target = `https://www.inoreader.com/?add_feed=${encodeURIComponent(feedUrl)}`;
    } else if (reader === 'netnewswire') {
      target = `feed:${feedUrl.replace(/^https?:\/\//, '')}`;
    }
    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 md:p-6 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-3xl rounded-[28px] p-[1.5px] bg-gradient-to-b from-amber-400 via-emerald-500/50 to-amber-500 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.2)] overflow-hidden text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full bg-gradient-to-b from-[#082215]/95 via-[#04190F]/95 to-[#020E07]/98 backdrop-blur-2xl rounded-[26px] overflow-hidden flex flex-col">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Header */}
          <div className="relative z-10 px-5 sm:px-7 pt-5 sm:pt-6 pb-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[1.5px] shadow-[0_4px_16px_rgba(245,158,11,0.4)] flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-[#09331D] via-[#051C10] to-slate-950 rounded-[14px] flex items-center justify-center text-amber-300">
                  <Rss className="w-6 h-6 stroke-[2.2] animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-mono shadow-xs">
                    <Radio className="w-3 h-3 animate-ping" />
                    <span>SINDIKASI RSS 2.0 &amp; ATOM</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-300 font-bold hidden sm:inline">
                    OTOMATIS
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white font-serif tracking-tight mt-0.5">
                  Langganan RSS Feed Berita &amp; Maklumat Pengadilan
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-500 hover:text-white text-slate-300 flex items-center justify-center transition-all duration-300 cursor-pointer border border-white/15 hover:rotate-90 shadow-sm"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader Tab Navigation */}
          <div className="relative z-10 px-5 sm:px-7 pt-3 pb-2 flex items-center gap-2 border-b border-white/10 bg-black/30">
            <button
              type="button"
              onClick={() => setActiveTab('channels')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'channels'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Rss className="w-3.5 h-3.5" />
              <span>Saluran Feed ({feedChannels.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Pratinjau Live Feed ({newsList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('xml')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'xml'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Source XML Raw</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="relative z-10 px-5 sm:px-7 py-5 max-h-[64vh] overflow-y-auto space-y-4">
            
            {/* TAB 1: SALURAN FEED & ONE-CLICK READER INTENTS */}
            {activeTab === 'channels' && (
              <div className="space-y-4">
                
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs text-slate-200 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Salin URL Feed di bawah ini dan tempelkan ke aplikasi pembaca berita (RSS Reader) favorit Anda seperti <strong>Feedly, Inoreader, NewsBlur, NetNewsWire, Outlook, Mozilla Thunderbird</strong>, atau bot Telegram/WhatsApp untuk mendapatkan notifikasi instan saat berita baru dipublikasikan.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {feedChannels.map((feed) => {
                    const IconComp = feed.icon;
                    const isCopied = copiedKey === feed.id;

                    return (
                      <div
                        key={feed.id}
                        className="group p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#072416]/90 to-slate-900/90 border border-emerald-500/30 hover:border-amber-400/80 shadow-md transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${feed.color} text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-white text-sm font-serif">{feed.title}</h4>
                                <span className="text-[9px] font-mono px-2 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                                  {feed.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-0.5">{feed.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleCopy(feed.url, feed.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                                isCopied
                                  ? 'bg-emerald-500 text-slate-950 font-black'
                                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                              }`}
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{isCopied ? 'Tersalin!' : 'Salin URL'}</span>
                            </button>

                            <a
                              href={feed.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 transition-colors cursor-pointer"
                              title="Buka XML Langsung di Browser"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>

                        {/* URL Box */}
                        <div className="p-2 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-amber-300 truncate flex items-center justify-between gap-2">
                          <span className="truncate select-all">{feed.url}</span>
                          <span className="text-[9px] text-slate-400 shrink-0 uppercase">XML/RSS 2.0</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 1-Click Subscribe Buttons */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C301D] to-[#071F13] border border-amber-400/40 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider font-mono">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Buka Langsung di Pembaca RSS:</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenReader('feedly', `${origin}/rss.xml`)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 border border-emerald-400/40 transition-colors cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                      <span>Buka di Feedly</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenReader('inoreader', `${origin}/rss.xml`)}
                      className="px-3.5 py-2 rounded-xl bg-blue-700/80 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 border border-blue-400/40 transition-colors cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                      <span>Buka di Inoreader</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenReader('netnewswire', `${origin}/rss.xml`)}
                      className="px-3.5 py-2 rounded-xl bg-purple-700/80 hover:bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 border border-purple-400/40 transition-colors cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                      <span>Apple / NetNewsWire (feed://)</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: PRATINJAU LIVE FEED ITEMS */}
            {activeTab === 'preview' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Menampilkan {newsList.length} artikel terbaru yang disindikasikan dalam feed:</span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">Terupdate Real-Time</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {newsList.slice(0, 10).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold px-2 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            {item.kategori || 'Berita'}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-emerald-400" />
                            {item.tanggal}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{item.judul}</h4>
                        <p className="text-[11px] text-slate-300 line-clamp-1">{item.ringkasan}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onNavigate) onNavigate('berita', 'berita-terkini');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-slate-200 text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Baca</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SOURCE XML RAW */}
            {activeTab === 'xml' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-mono">Dokumen XML RSS 2.0 (/rss.xml):</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(xmlContent, 'xml-raw')}
                    className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'xml-raw' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'xml-raw' ? 'Tersalin' : 'Salin XML'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-black/80 border border-white/15 font-mono text-[11px] text-emerald-300 max-h-80 overflow-auto whitespace-pre leading-relaxed select-all">
                  {loadingXml ? 'Memuat dokumen XML RSS...' : xmlContent}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="relative z-10 px-5 sm:px-7 py-4 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Standar Keterbukaan Informasi Mahkamah Agung RI</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
