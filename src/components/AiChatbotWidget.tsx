import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, 
  X, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  RefreshCw, 
  Copy, 
  Check, 
  Scale, 
  FileText, 
  Clock, 
  HelpCircle, 
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  User,
  MessageSquareText,
  PhoneCall,
  Globe,
  ExternalLink,
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { generateSmartSipintarReply, SipintarContextData } from '../utils/sipintarKnowledgeBase';
import { TniCartoonAvatar } from './TniCartoonAvatar';
import { FAQ_CATEGORIES, FAQ_ITEMS, POPULAR_QUICK_CHIPS, FaqItem } from '../data/chatbotFaqData';
import { searchRegulatoryDatabase } from '../data/regulatoryDatabase';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sources?: { title: string; url: string }[];
  isSearchQuery?: boolean;
  searchCategory?: string;
}

export const SEARCH_ENGINE_CHIPS = [
  { label: '⚖️ UU No. 31/1997 Peradilan Militer', query: 'UU Nomor 31 Tahun 1997 tentang Peradilan Militer wewenang dan susunan pengadilan' },
  { label: '⏳ Batas Banding 7 Hari Ps. 225', query: 'Tenggang waktu permohonan banding 7 hari Pasal 225 UU 31 Tahun 1997' },
  { label: '📜 Sengketa STUM KTUAB Ps. 268', query: 'Sengketa Tata Usaha Militer STUM KTUAB Pasal 268 tenggang waktu 90 hari' },
  { label: '🎖️ Desersi Prajurit Ps. 87 KUHDPM', query: 'Tindak pidana desersi prajurit Pasal 87 KUHDPM dan persidangan in absentia' },
  { label: '🏛️ Wewenang Mengadili Mayor Ke Atas', query: 'Wewenang Pengadilan Militer Tinggi memeriksa Mayor ke atas Pasal 41 UU 31/1997' },
  { label: '💰 Biaya Sidang Pidana Rp 0', query: 'Biaya perkara pidana militer dibebankan kepada negara Pasal 248 UU 31/1997' },
  { label: '📅 Jadwal Sidang Dilmilti V', query: 'Jadwal sidang Pengadilan Militer Tinggi V Makassar' }
];

interface AiChatbotWidgetProps {
  onNavigate?: (section: string, subTab?: string) => void;
  hide?: boolean;
}

export const AiChatbotWidget: React.FC<AiChatbotWidgetProps> = ({ onNavigate, hide }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chat Mode: Assistant vs Search Engine Mode
  const [chatMode, setChatMode] = useState<'assistant' | 'search'>('assistant');
  const [searchCategory, setSearchCategory] = useState<'semua' | 'regulasi' | 'perkara' | 'tni'>('semua');

  // FAQ System States
  const [isFaqCatalogOpen, setIsFaqCatalogOpen] = useState(false);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('semua');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Quick Chips
  const quickChips = POPULAR_QUICK_CHIPS;

  // Audio / Speech States
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: '🏛️ **Selamat Datang di PETA DILMILTI**\n*(Perangkat Tanya-Jawab Pengadilan Militer Tinggi V Makassar)*\n\n🌐 **Kini Terhubung Langsung dengan Google Search & Basis Data Hukum Nasional!**\nSaya dapat menjawab **SEMUA PERTANYAAN** Anda dengan mengambil referensi dari Google Search dan sumber luar resmi terpercaya—mulai dari penelusuran perkara SIPP, jadwal sidang, banding militer, sengketa STUM, UU 31/1997, KUHDPM/KUHP Baru, struktur Mabes TNI, hingga pertanyaan pengetahuan umum lainnya.\n\n📚 **Topik Rekomendasi (Katalog FAQ Resmi):**\n- 🌐 **Google & Informasi Terbuka** (Pencarian Google, Struktur Mabes TNI, Informasi Umum)\n- 📚 **Hukum & Regulasi** (UU 31/1997, KUHDPM, KUHP Baru, PERMA/SEMA MA-RI)\n- ⚖️ **Banding Militer & Prosedur SIPP** (Tenggang 7 Hari, Syarat Berkas, Pelacakan)\n- 📜 **Sengketa Tata Usaha Militer (STUM)** (Objek KTUAB & Batas Waktu 90 Hari)\n- 💻 **Download Template Dokumen & Formulir** (Format Banding, Surat Kuasa, Format Resmi)\n- 🤝 **Bantuan Posbakum Bebas Biaya (Rp 0)** & Hak Terdakwa Prajurit\n- 🕒 **Jam Meja PTSP, WhatsApp Resmi & Kanal Pengaduan SIWAS MA-RI**\n\n💡 *Gunakan tombol "Katalog FAQ" di pojok kanan atas, klik rekomendasi cepat di bawah, atau ketik langsung pertanyaan Anda!*',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Listen for external open triggers (e.g. from Layanan Hukum & Website sections)
  useEffect(() => {
    const handleOpenChat = (event: any) => {
      setIsOpen(true);
      if (event?.detail?.mode === 'search') {
        setChatMode('search');
      }
      if (event?.detail?.prompt) {
        setInputMessage(event.detail.prompt);
      }
    };
    window.addEventListener('open_peta_dilmilti_chat', handleOpenChat);
    return () => window.removeEventListener('open_peta_dilmilti_chat', handleOpenChat);
  }, []);

  // Clean SpeechSynthesis on unmount or close
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputMessage(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setVoiceNotice('Fitur Perekam Suara (Speech Recognition) memerlukan browser modern seperti Google Chrome atau Microsoft Edge.');
      setTimeout(() => setVoiceNotice(null), 5000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Failed to start recognition:', err);
        setIsListening(false);
      }
    }
  };

  const handleSpeakMessage = async (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMsgId(null);
      return;
    }

    setSpeakingMsgId(msgId);

    // Try server-side Gemini TTS endpoint first
    try {
      const res = await fetch('/api/chat/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data && data.success && data.audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
        audio.onended = () => setSpeakingMsgId(null);
        audio.onerror = () => fallbackBrowserSpeech(msgId, text);
        await audio.play();
        return;
      }
    } catch {
      // Fall back to browser SpeechSynthesis
    }

    fallbackBrowserSpeech(msgId, text);
  };

  const fallbackBrowserSpeech = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~[\]()]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customText?: string, forceSearchMode?: boolean) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const lower = textToSend.toLowerCase();
    const isSearch = forceSearchMode !== undefined 
      ? forceSearchMode 
      : (
          chatMode === 'search' ||
          /^(cari|search|telusuri|pencarian|temukan|cek)\b/i.test(textToSend) ||
          lower.includes('uu 31') ||
          lower.includes('pasal') ||
          lower.includes('putusan') ||
          lower.includes('jadwal sidang') ||
          lower.includes('sipp') ||
          lower.includes('banding') ||
          lower.includes('stum') ||
          lower.includes('google')
        );

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSearchQuery: isSearch,
      searchCategory: isSearch ? searchCategory : undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    const contextData: SipintarContextData = {
      courtIdentity: CourtDB.getCourtIdentity(),
      personnelList: CourtDB.getPersonnel(),
      sippList: CourtDB.getSippList(),
      jadwalList: CourtDB.getJadwalList(),
      dipList: CourtDB.getDIP(),
      newsList: CourtDB.getNewsList(),
      jurisdictionCourts: CourtDB.getJurisdictionCourts()
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages,
          contextData,
          isSearchMode: isSearch,
          searchCategory: isSearch ? searchCategory : undefined
        })
      });

      const data = await response.json();
      if (!response.ok || !data.reply || data.error) {
        throw new Error(data.error || 'AI service fallback');
      }
      const botReply = data.reply;

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: Array.isArray(data.sources) ? data.sources : [],
        isSearchQuery: isSearch
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error fetching AI response:', err);
      const regMatches = searchRegulatoryDatabase(textToSend, 3);
      const fallbackText = generateSmartSipintarReply(textToSend, contextData, undefined, regMatches, isSearch);
      const regSources = regMatches.map((r) => ({
        title: `📜 ${r.document.nomor}`,
        url: r.document.tautanResmi
      }));

      const errorMsg: Message = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          ...regSources,
          { title: 'Google Search Nasional', url: `https://www.google.com/search?q=${encodeURIComponent(textToSend)}` },
          { title: 'Portal Mahkamah Agung RI', url: 'https://www.mahkamahagung.go.id' }
        ],
        isSearchQuery: isSearch
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: '🏛️ **PETA DILMILTI Siap Membantu**\n*(Perangkat Tanya-Jawab Pengadilan Militer Tinggi V)*\n\nRiwayat obrolan telah dibersihkan. Silakan ajukan pertanyaan mengenai unduh template dokumen, penelusuran perkara SIPP, jadwal sidang, referensi UU 31/1997, maupun layanan Meja PTSP.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Rich Formatting Parser for Markdown
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-1.5" />;
      }

      // Format bold text **word**
      const parts = line.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);

      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-extrabold text-amber-300">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={pIdx} className="px-1.5 py-0.5 bg-slate-950 text-emerald-300 font-mono text-[11px] rounded border border-emerald-500/30">
              {part.slice(1, -1)}
            </code>
          );
        }
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          const isHttp = linkMatch[2].startsWith('http');
          return (
            <a
              key={pIdx}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 underline font-bold inline-flex items-center gap-1 bg-amber-950/60 hover:bg-amber-900/80 px-2 py-0.5 rounded-lg border border-amber-400/40 my-0.5 transition-all text-[11px]"
              title={`Buka tautan resmi: ${linkMatch[2]}`}
            >
              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{linkMatch[1]}</span>
              <ExternalLink className="w-2.5 h-2.5 text-amber-400 shrink-0" />
            </a>
          );
        }
        return part;
      });

      // Check if bullet point or list
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 pl-2 my-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <div className="flex-1">{formattedParts}</div>
          </div>
        );
      }

      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 pl-2 my-1">
            <span className="px-1.5 py-0.2 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-black rounded shrink-0 mt-0.5">
              {numMatch[1]}
            </span>
            <div className="flex-1">{formattedParts}</div>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="my-0.5">
          {formattedParts}
        </p>
      );
    });
  };

  const filteredFaqItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchCategory = selectedFaqCategory === 'semua' || item.category === selectedFaqCategory;
      const matchQuery = !faqSearchQuery.trim() || 
        item.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
        item.badge.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
        item.shortDesc.toLowerCase().includes(faqSearchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [selectedFaqCategory, faqSearchQuery]);

  if (hide) return null;

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div id="ai-chatbot-widget" className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2">
          {/* Main PETA DILMILTI Assistant Launcher */}
          <button
            type="button"
            id="btn-floating-ai-chatbot"
            onClick={() => setIsOpen(true)}
            className="group relative px-4 py-2.5 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 hover:from-emerald-900 hover:to-slate-900 text-white font-bold rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-3 cursor-pointer ring-4 ring-amber-400/90 border-2 border-amber-300 hover:scale-105"
            title="Tanya Chat AI PETA DILMILTI — Pengadilan Militer Tinggi V Makassar"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden text-slate-950 flex items-center justify-center font-black shadow-md border-2 border-amber-300 bg-emerald-900 shrink-0">
              <TniCartoonAvatar size={36} className="w-9 h-9" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-ping"></span>
            </div>
            
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-amber-300 uppercase">PETA DILMILTI AI</span>
                <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 text-[9px] font-extrabold rounded-full">ONLINE</span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium">Asisten Hukum Resmi 24 Jam</p>
            </div>

            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform shrink-0" />
          </button>
        </div>
      )}

      {/* Interactive AI Chat Drawer Window */}
      {isOpen && (
        <div 
          id="ai-chatbot-widget-window"
          className={`no-print fixed z-50 transition-all duration-300 ease-in-out flex flex-col bg-slate-950 text-slate-100 border-2 border-amber-400/80 rounded-2xl shadow-2xl overflow-hidden ${
            isExpanded 
              ? 'inset-3 sm:inset-10 max-w-5xl mx-auto' 
              : 'bottom-4 right-4 w-[92vw] sm:w-[450px] h-[640px] max-h-[92vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 px-4 py-3 border-b border-amber-400/40 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-amber-400 shadow-lg bg-emerald-950 flex items-center justify-center shrink-0">
                <TniCartoonAvatar size={40} className="w-10 h-10" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-amber-300 tracking-wide">PETA DILMILTI</h3>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold rounded">ONLINE</span>
                </div>
                <p className="text-[10px] text-slate-300 flex items-center gap-1.5 flex-wrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Dilmilti V Makassar</span>
                  <span className="hidden sm:inline text-slate-500">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-emerald-300 bg-emerald-950/70 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    <Globe className="w-2.5 h-2.5 text-emerald-400" />
                    Google Search Aktif
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsFaqCatalogOpen(!isFaqCatalogOpen)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isFaqCatalogOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-xs'
                    : 'bg-slate-800/90 text-amber-300 hover:bg-slate-700 hover:text-white border-slate-700'
                }`}
                title="Buka Katalog FAQ Resmi & Rekomendasi Pertanyaan"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Katalog FAQ</span>
              </button>

              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Reset Obrolan"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer hidden sm:block"
                title={isExpanded ? 'Kecilkan Window' : 'Perbesar Window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                  setSpeakingMsgId(null);
                  setIsOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Tutup ChatBot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat AI Status Header Sub-bar */}
          <div className="bg-slate-900/95 border-b border-amber-400/30 px-3 py-1.5 flex items-center justify-between gap-2 shadow-xs shrink-0">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-800/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs border border-emerald-500/40">
                <MessageSquareText className="w-3.5 h-3.5 text-amber-300" />
                <span>💬 Chat AI — PETA DILMILTI</span>
              </div>
              <span className="text-[10px] text-slate-300 hidden sm:inline">
                Konsultasi Hukum, Regulasi UU 31/1997, SIPP, Putusan &amp; Google Search
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>Google Grounding Aktif</span>
            </div>
          </div>

          {/* Quick Nav Bar Shortcuts */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex items-center gap-2 overflow-x-auto text-[11px] font-bold scrollbar-none">
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('hukum', 'uu-31-1997');
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Scale className="w-3 h-3 text-emerald-400" />
              <span>UU No. 31/1997</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('ppid');
              }}
              className="px-2.5 py-1 rounded-lg bg-sky-950/70 hover:bg-sky-900 text-sky-300 border border-sky-500/30 shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3 h-3 text-sky-400" />
              <span>PPID & Templates</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('jadwal');
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-500/30 shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Jadwal Sidang</span>
            </button>

            <a
              href="https://wa.me/628114567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-teal-950/70 hover:bg-teal-900 text-teal-300 border border-teal-500/30 shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <PhoneCall className="w-3 h-3 text-teal-400" />
              <span>WA Helpdesk</span>
            </a>
          </div>

          {/* Voice Notice Alert */}
          {voiceNotice && (
            <div className="bg-amber-900/90 text-amber-100 px-3.5 py-2 text-[11px] border-b border-amber-500/40 flex items-center justify-between gap-2">
              <span>{voiceNotice}</span>
              <button
                type="button"
                onClick={() => setVoiceNotice(null)}
                className="text-amber-300 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main Chat & FAQ View Area */}
          <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Interactive FAQ Catalog Drawer / Overlay Panel */}
            {isFaqCatalogOpen && (
              <div className="absolute inset-0 z-30 bg-slate-950 flex flex-col animate-in fade-in duration-200">
                {/* FAQ Header */}
                <div className="bg-slate-900 border-b border-amber-400/40 p-3 flex items-center justify-between shadow-md shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/40">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-300">Katalog FAQ Resmi & Topik AI PETA DILMILTI</h4>
                      <p className="text-[10px] text-slate-400">Pilih pertanyaan untuk dijawab langsung oleh AI & Google Search</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFaqCatalogOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Tutup Katalog FAQ"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* FAQ Search & Category Filters */}
                <div className="p-3 bg-slate-900/80 border-b border-slate-800 space-y-2 shrink-0">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={faqSearchQuery}
                      onChange={(e) => setFaqSearchQuery(e.target.value)}
                      placeholder="Cari kata kunci FAQ (contoh: banding, STUM, kasasi, Google, TNI)..."
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl pl-8.5 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                    {faqSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setFaqSearchQuery('')}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-white cursor-pointer text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Horizontal Category Filter Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                    {FAQ_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedFaqCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all border cursor-pointer ${
                          selectedFaqCategory === cat.id
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-amber-300'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FAQ Items Accordion Feed */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {filteredFaqItems.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs space-y-2">
                      <p>Tidak ada pertanyaan yang sesuai dengan kata kunci "{faqSearchQuery}".</p>
                      <button
                        type="button"
                        onClick={() => {
                          setFaqSearchQuery('');
                          setSelectedFaqCategory('semua');
                        }}
                        className="px-3 py-1 bg-slate-800 text-amber-300 hover:bg-slate-700 rounded-lg text-[11px] font-bold border border-slate-700 cursor-pointer"
                      >
                        Reset Pencarian
                      </button>
                    </div>
                  ) : (
                    filteredFaqItems.map((item) => {
                      const isExpanded = expandedFaqId === item.id;
                      return (
                        <div
                          key={item.id}
                          className="bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-xl overflow-hidden transition-all shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedFaqId(isExpanded ? null : item.id)}
                            className="w-full p-3 text-left flex items-start justify-between gap-2.5 cursor-pointer"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-bold">
                                  {item.badge}
                                </span>
                                <span className="text-[10px] text-slate-400">• {item.categoryLabel}</span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-100 leading-snug">{item.question}</h5>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{item.shortDesc}</p>
                            </div>
                            <div className="shrink-0 mt-1 text-slate-400">
                              {isExpanded ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-3 pb-3 pt-1 border-t border-slate-800/80 bg-slate-950/60 space-y-2.5">
                              <div className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                                <strong className="text-amber-300 block mb-1">💡 Intisari Jawaban Resmi:</strong>
                                <p>{item.previewAnswer}</p>
                              </div>

                              <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInputMessage(item.question);
                                    setIsFaqCatalogOpen(false);
                                  }}
                                  className="px-2.5 py-1 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 cursor-pointer"
                                >
                                  Salin ke Input
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsFaqCatalogOpen(false);
                                    handleSendMessage(item.question);
                                  }}
                                  className="px-3 py-1 text-[10px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shadow-sm border border-amber-300 cursor-pointer"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Tanyakan ke AI (Google)</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full border border-amber-400/80 bg-emerald-950 flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-md overflow-hidden">
                      <TniCartoonAvatar size={32} className="w-8 h-8" />
                    </div>
                  )}

                  <div className={`max-w-[88%] rounded-2xl p-3.5 space-y-2 relative shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-tr-xs border border-emerald-500/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs'
                  }`}>
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-1 text-[10px] text-slate-400 font-mono">
                      <span className="font-bold flex items-center gap-1.5 flex-wrap">
                        {msg.sender === 'user' ? (
                          <>
                            <User className="w-3 h-3 text-emerald-300" />
                            <span>Pengguna</span>
                            {msg.isSearchQuery && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[9px] flex items-center gap-1">
                                <Search className="w-2.5 h-2.5 stroke-[2.5]" />
                                <span>Pencarian AI</span>
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <TniCartoonAvatar size={14} className="w-3.5 h-3.5 inline-block" />
                            <span className="text-amber-300 font-bold">PETA DILMILTI</span>
                            {msg.isSearchQuery && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold flex items-center gap-1">
                                <Globe className="w-2.5 h-2.5" />
                                <span>Penelusuran Regulasi &amp; Web</span>
                              </span>
                            )}
                          </>
                        )}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Formatted Text Content */}
                    <div className="text-xs leading-relaxed space-y-1 font-sans">
                      {renderFormattedContent(msg.text)}
                    </div>

                    {msg.sender === 'bot' && (
                      <div className="space-y-2 pt-2 border-t border-slate-800/40 text-[10px]">
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="space-y-1 pb-1">
                            <div className="text-amber-300 font-bold flex items-center gap-1 text-[10px]">
                              <Globe className="w-3 h-3 text-emerald-400" />
                              <span>Sumber & Referensi Terkait:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {msg.sources.map((src, sIdx) => (
                                <a
                                  key={sIdx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-300 hover:text-amber-300 bg-slate-950/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/80 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors text-[10px]"
                                >
                                  <span className="truncate max-w-[200px]">{src.title}</span>
                                  <ExternalLink className="w-2.5 h-2.5 shrink-0 text-amber-400" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Website Navigation & Google Search Shortcuts */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(msg.text.slice(0, 80))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded-md bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-200 text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Globe className="w-3 h-3 text-blue-400" />
                            <span>Buka di Google</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          {onNavigate && (
                            <button
                              type="button"
                              onClick={() => onNavigate('hukum', 'referensi-uu31')}
                              className="px-2 py-1 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Scale className="w-3 h-3 text-emerald-400" />
                              <span>Naskah UU 31/1997</span>
                            </button>
                          )}

                          {onNavigate && (
                            <button
                              type="button"
                              onClick={() => onNavigate('publik', 'sipp')}
                              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <FileText className="w-3 h-3 text-amber-300" />
                              <span>Lacak SIPP</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => handleSpeakMessage(msg.id, msg.text)}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all cursor-pointer ${
                              speakingMsgId === msg.id
                                ? 'bg-amber-400 text-slate-950 font-bold animate-pulse'
                                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                            }`}
                            title={speakingMsgId === msg.id ? 'Hentikan Suara' : 'Dengarkan Suara AI (TTS)'}
                          >
                            {speakingMsgId === msg.id ? (
                              <>
                                <VolumeX className="w-3 h-3" />
                                <span>Stop Suara</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-amber-400" />
                                <span>Dengarkan</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                            title="Salin Jawaban"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 mt-1 shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 justify-start items-center">
                  <div className="w-8 h-8 rounded-full border border-amber-400 bg-emerald-950 flex items-center justify-center font-bold shrink-0 shadow-md overflow-hidden animate-pulse">
                    <TniCartoonAvatar size={32} status="thinking" className="w-8 h-8" />
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-xs p-3 flex items-center gap-2 text-amber-300 text-xs shadow-md">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span>
                      Chat AI sedang memproses jawaban dari Google &amp; pangkalan data hukum...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Preset Quick Question / Search Chips */}
          <div className="bg-slate-900/90 border-t border-slate-800 p-2.5 space-y-1.5">
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-amber-400" />
                <span>Rekomendasi Pertanyaan &amp; Penelusuran Cepat:</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFaqCatalogOpen(!isFaqCatalogOpen)}
                className="text-[9px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer hover:underline"
              >
                <BookOpen className="w-2.5 h-2.5" />
                <span>Buka Semua FAQ ({FAQ_ITEMS.length})</span>
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickChips.map((chip: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip.query || chip.text)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer border disabled:opacity-50 flex items-center gap-1 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 border-slate-700"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar with Voice Button */}
          <div className="p-3 bg-slate-950 border-t border-amber-400/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-400 animate-pulse ring-2 ring-rose-400'
                    : 'bg-slate-900 text-slate-300 hover:text-amber-300 border-slate-700 hover:border-amber-400'
                }`}
                title={isListening ? 'Merekam Suara (Klik untuk Stop)' : 'Bicara Lewat Mikrofon (Speech-To-Text)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-400" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isListening
                    ? 'Mendengarkan suara Anda...'
                    : 'Tanyakan atau cari info (regulasi UU 31/1997, perkara SIPP, putusan, jadwal, hukum)...'
                }
                disabled={isLoading}
                className={`flex-1 bg-slate-900 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  isListening
                    ? 'border-rose-500 bg-rose-950/20'
                    : 'border-slate-700 focus:border-amber-400'
                }`}
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-md border border-amber-300 gap-1.5"
                title="Kirim pesan ke Chat AI"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[9px] text-slate-500 text-center mt-1.5 flex items-center justify-center gap-1">
              <span>Powered by Google Gemini 3.8 Flash &amp; Search Grounding</span>
              <span>•</span>
              <span>Pengadilan Militer Tinggi V Makassar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChatbotWidget;
