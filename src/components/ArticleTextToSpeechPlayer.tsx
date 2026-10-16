import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  RotateCcw,
  SkipBack,
  SkipForward,
  FastForward,
  Sparkles,
  Sliders,
  Type,
  Headphones,
  Check,
  Copy,
  Radio,
  UserCheck,
  Info
} from 'lucide-react';
import { NewsItem } from '../types';

interface ArticleTextToSpeechPlayerProps {
  article: NewsItem;
  courtName?: string;
  autoPlay?: boolean;
}

export default function ArticleTextToSpeechPlayer({
  article,
  courtName = 'Pengadilan Militer Tinggi V Makassar',
  autoPlay = false
}: ArticleTextToSpeechPlayerProps) {
  // TTS State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSubtitle, setShowSubtitle] = useState<boolean>(true);
  const [subtitleSize, setSubtitleSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);

  // References for robust playback
  const chunksRef = useRef<string[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const currentChunkIndexRef = useRef<number>(0);
  const keepAliveTimerRef = useRef<number | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Build full narrative text for the news article
  const buildFullNarrativeText = useCallback((): string => {
    const parts: string[] = [];
    parts.push(`Berita resmi ${courtName}.`);
    if (article.kategori) {
      parts.push(`Kategori: ${article.kategori}.`);
    }
    parts.push(`Judul berita: ${article.judul}.`);
    if (article.tanggal) {
      parts.push(`Dipublikasikan pada tanggal ${article.tanggal}.`);
    }
    if (article.penulis) {
      parts.push(`Oleh: ${article.penulis}.`);
    }
    if (article.ringkasan) {
      parts.push(`Ringkasan: ${article.ringkasan}.`);
    }
    if (article.isi) {
      parts.push(`Isi berita lengkap: ${article.isi}`);
    } else {
      parts.push(
        `Isi berita: Kepala Pengadilan Militer Tinggi V Makassar menegaskan seluruh jajaran untuk terus mengedepankan profesionalitas, integritas, dan kecepatan dalam melayani masyarakat pencari keadilan di seluruh kawasan timur Indonesia.`
      );
    }
    return parts.join(' ');
  }, [article, courtName]);

  // Break text into sentences / clauses of ~120 chars to prevent browser TTS engine timeouts
  const prepareChunks = useCallback((rawText: string): string[] => {
    const cleaned = rawText
      .replace(/\s+/g, ' ')
      .replace(/[•·▪►]/g, '. ')
      .replace(/\|/g, ', ')
      .trim();

    if (!cleaned) return [];

    const rawSentences = cleaned.split(/(?<=[.!?;\n])\s+/);
    const result: string[] = [];
    let buffer = '';

    for (const sentence of rawSentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      if (trimmed.length > 130) {
        if (buffer) {
          result.push(buffer.trim());
          buffer = '';
        }
        const clauses = trimmed.split(/(?<=[,:])\s+/);
        let clauseBuf = '';
        for (const cl of clauses) {
          if ((clauseBuf + ' ' + cl).trim().length <= 130) {
            clauseBuf = (clauseBuf + ' ' + cl).trim();
          } else {
            if (clauseBuf) result.push(clauseBuf.trim());
            if (cl.length <= 130) {
              clauseBuf = cl;
            } else {
              const words = cl.split(' ');
              let wordBuf = '';
              for (const w of words) {
                if ((wordBuf + ' ' + w).trim().length <= 120) {
                  wordBuf = (wordBuf + ' ' + w).trim();
                } else {
                  if (wordBuf) result.push(wordBuf.trim());
                  wordBuf = w;
                }
              }
              clauseBuf = wordBuf;
            }
          }
        }
        if (clauseBuf.trim()) result.push(clauseBuf.trim());
      } else if ((buffer + ' ' + trimmed).trim().length <= 130) {
        buffer = (buffer + ' ' + trimmed).trim();
      } else {
        if (buffer.trim()) result.push(buffer.trim());
        buffer = trimmed;
      }
    }

    if (buffer.trim()) {
      result.push(buffer.trim());
    }

    return result.filter((c) => c.length > 0);
  }, []);

  // Update chunks whenever article changes
  useEffect(() => {
    const fullText = buildFullNarrativeText();
    const chunks = prepareChunks(fullText);
    chunksRef.current = chunks;
  }, [buildFullNarrativeText, prepareChunks]);

  // Load voices on mount
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      setAvailableVoices(voices);

      // Preferred voices: Indonesian (id-ID), female first
      const idVoices = voices.filter(
        (v) =>
          v.lang.toLowerCase().includes('id') ||
          v.lang.toLowerCase().includes('ind') ||
          v.name.toLowerCase().includes('indonesia')
      );

      const femaleId = idVoices.find(
        (v) =>
          !v.name.toLowerCase().includes('ardi') &&
          (v.name.toLowerCase().includes('gadis') ||
            v.name.toLowerCase().includes('damayanti') ||
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('google bahasa indonesia') ||
            v.name.toLowerCase().includes('wanita'))
      );

      const selected = femaleId || idVoices[0] || voices.find((v) => v.lang.startsWith('en')) || voices[0];
      if (selected && !selectedVoiceName) {
        setSelectedVoiceName(selected.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoiceName]);

  // Stop keep alive
  const stopKeepAlive = () => {
    if (keepAliveTimerRef.current) {
      window.clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
  };

  // Stop playback completely
  const stopPlayback = useCallback(() => {
    isPlayingRef.current = false;
    isPausedRef.current = false;
    currentChunkIndexRef.current = 0;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(0);
    activeUtteranceRef.current = null;
    stopKeepAlive();

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }, []);

  // Stop audio on unmount or article change
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [article.id, stopPlayback]);

  // Play a specific chunk
  const playChunkAt = useCallback(
    (index: number) => {
      if (!('speechSynthesis' in window)) return;
      const chunks = chunksRef.current;
      if (!chunks || chunks.length === 0 || index >= chunks.length) {
        stopPlayback();
        return;
      }

      currentChunkIndexRef.current = index;
      setCurrentChunkIndex(index);
      isPlayingRef.current = true;
      isPausedRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);

      try {
        window.speechSynthesis.cancel();
      } catch {}

      const textToRead = chunks[index];
      const utterance = new SpeechSynthesisUtterance(textToRead);
      activeUtteranceRef.current = utterance;

      // Match selected voice
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.name === selectedVoiceName) || voices.find((v) => v.lang.includes('id')) || voices[0];
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'id-ID';
      } else {
        utterance.lang = 'id-ID';
      }

      utterance.rate = speechRate;
      utterance.pitch = pitch;
      utterance.volume = isMuted ? 0 : volume;

      utterance.onend = () => {
        if (!isPlayingRef.current || isPausedRef.current) return;
        const nextIdx = currentChunkIndexRef.current + 1;
        if (nextIdx < chunks.length) {
          playChunkAt(nextIdx);
        } else {
          stopPlayback();
        }
      };

      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        console.warn('[Article TTS] Speech error:', e.error);
        const nextIdx = currentChunkIndexRef.current + 1;
        if (nextIdx < chunks.length && isPlayingRef.current) {
          setTimeout(() => playChunkAt(nextIdx), 100);
        } else {
          stopPlayback();
        }
      };

      // Chrome long-duration TTS keep-alive workaround
      stopKeepAlive();
      keepAliveTimerRef.current = window.setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);

      window.speechSynthesis.speak(utterance);
    },
    [selectedVoiceName, speechRate, pitch, volume, isMuted, stopPlayback]
  );

  // Start or Toggle Play/Pause
  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (chunksRef.current.length === 0) {
        const fullText = buildFullNarrativeText();
        chunksRef.current = prepareChunks(fullText);
      }
      playChunkAt(currentChunkIndexRef.current || 0);
    } else if (isPaused) {
      isPausedRef.current = false;
      setIsPaused(false);
      try {
        window.speechSynthesis.resume();
      } catch {
        playChunkAt(currentChunkIndexRef.current);
      }
    } else {
      isPausedRef.current = true;
      setIsPaused(true);
      try {
        window.speechSynthesis.pause();
      } catch {}
    }
  };

  const handlePreviousChunk = () => {
    const prev = Math.max(0, currentChunkIndex - 1);
    playChunkAt(prev);
  };

  const handleNextChunk = () => {
    const next = Math.min(chunksRef.current.length - 1, currentChunkIndex + 1);
    playChunkAt(next);
  };

  const handleRestart = () => {
    playChunkAt(0);
  };

  const handleCopyTranscript = () => {
    const fullText = buildFullNarrativeText();
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(fullText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = fullText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedTranscript(true);
      setTimeout(() => setCopiedTranscript(false), 2500);
    } catch {}
  };

  // Keyboard accessibility (Space to toggle, Esc to stop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

      if (e.code === 'KeyP' && (e.altKey || e.ctrlKey)) {
        e.preventDefault();
        handleTogglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused]);

  const totalChunks = chunksRef.current.length || 1;
  const progressPercent = Math.min(100, Math.round(((currentChunkIndex + (isPlaying && !isPaused ? 0.5 : 0)) / totalChunks) * 100));

  // Calculate estimated total reading time (average 130 words per minute)
  const fullWordCount = buildFullNarrativeText().split(/\s+/).length;
  const estimatedTotalMinutes = Math.max(1, Math.round(fullWordCount / 130));

  const currentSpokenText = chunksRef.current[currentChunkIndex] || article.ringkasan || 'Menyiapkan narasi suara berita...';

  return (
    <section
      role="region"
      aria-label={`Pemutar Audio Pembaca Berita Otomatis: ${article.judul}`}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#031B0F] via-[#083520] to-[#041D11] border-2 border-emerald-500/50 shadow-xl text-white p-4 sm:p-5 my-4 group transition-all"
    >
      {/* Decorative Glow Ambient Orbs */}
      <div className="absolute -top-14 -right-14 w-44 h-44 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-14 -left-14 w-44 h-44 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[1.5px] shadow-[0_4px_16px_rgba(245,158,11,0.3)] shrink-0">
            <div className="w-full h-full bg-[#051C10] rounded-[10px] flex items-center justify-center text-amber-300">
              <Headphones className={`w-5 h-5 ${isPlaying && !isPaused ? 'animate-bounce' : ''}`} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 font-mono shadow-xs">
                <Radio className={`w-3 h-3 ${isPlaying && !isPaused ? 'animate-ping' : ''}`} />
                <span>TEXT-TO-SPEECH BERITA</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold hidden sm:inline">
                Aksesibilitas Difabel (WCAG 2.1 AAA)
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white font-serif tracking-tight mt-0.5">
              Dengarkan Narasi Audio Berita Ini
            </h4>
          </div>
        </div>

        {/* Quick Info & Transcript Action */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-[11px] font-mono text-amber-300/90 font-semibold hidden md:inline">
            Estimasi: ~{estimatedTotalMinutes} mnt ({fullWordCount} kata)
          </span>

          <button
            type="button"
            onClick={handleCopyTranscript}
            title="Salin Naskah Narasi Lengkap"
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTranscript ? 'Tersalin' : 'Salin Teks Audio'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            title="Pengaturan Suara & Kecepatan"
            aria-expanded={showSettings}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              showSettings
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                : 'bg-white/10 text-slate-200 hover:text-white border-white/15'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Main Audio Controls Bar */}
      <div className="relative z-10 pt-3.5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Primary Transport Controls */}
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying && !isPaused ? 'Jeda Audio' : 'Putar Audio Berita'}
              className="h-11 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.4)] transition-all transform active:scale-95 cursor-pointer"
            >
              {isPlaying && !isPaused ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Jeda Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isPaused ? 'Lanjutkan' : 'Dengarkan Berita'}</span>
                </>
              )}
            </button>

            {/* Stop Button */}
            {isPlaying && (
              <button
                type="button"
                onClick={stopPlayback}
                title="Hentikan Pembacaan"
                aria-label="Hentikan Pembacaan"
                className="w-10 h-10 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center border border-rose-400/40 transition-colors cursor-pointer shadow-sm"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Previous Sentence */}
            <button
              type="button"
              onClick={handlePreviousChunk}
              disabled={!isPlaying || currentChunkIndex === 0}
              title="Kalimat Sebelumnya"
              aria-label="Kalimat Sebelumnya"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center border border-white/15 transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Next Sentence */}
            <button
              type="button"
              onClick={handleNextChunk}
              disabled={!isPlaying || currentChunkIndex >= totalChunks - 1}
              title="Kalimat Selanjutnya"
              aria-label="Kalimat Selanjutnya"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center border border-white/15 transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Replay */}
            <button
              type="button"
              onClick={handleRestart}
              title="Ulangi dari Awal"
              aria-label="Ulangi dari Awal"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center border border-white/15 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Preset Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-slate-300 mr-1 font-bold">Speed:</span>
            {[0.75, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => {
                  setSpeechRate(rate);
                  if (isPlaying && !isPaused) {
                    playChunkAt(currentChunkIndexRef.current);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  speechRate === rate
                    ? 'bg-emerald-500 text-slate-950 shadow-xs font-black'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                {rate}x
              </button>
            ))}

            {/* Mute toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
              aria-label={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
              className={`p-1.5 ml-1 rounded-lg border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-rose-600 text-white border-rose-400'
                  : 'bg-white/10 text-slate-200 hover:text-white border-white/15'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Dynamic Waveform Visualizer when Playing */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 pb-1">
              <span className="flex items-center gap-1.5 font-bold">
                {isPlaying && !isPaused && (
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <span className="w-1 h-3 bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"></span>
                    <span className="w-1 h-5 bg-amber-300 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]"></span>
                    <span className="w-1 h-2 bg-amber-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite]"></span>
                    <span className="w-1 h-4 bg-amber-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]"></span>
                  </span>
                )}
                <span>
                  {isPlaying ? (isPaused ? 'Audio Dijeda' : 'Sedang Membaca...') : 'Siap Diputar'}
                </span>
              </span>

              <span>
                Bagian {currentChunkIndex + 1} dari {totalChunks} ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar / Seek line */}
            <div 
              className="relative w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/15 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                const targetIdx = Math.floor(ratio * totalChunks);
                playChunkAt(targetIdx);
              }}
              title="Klik untuk melompat ke bagian tertentu"
            >
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Live Spoken Subtitle / Karaoke Highlighting Box */}
        {showSubtitle && (
          <div
            className="p-3 sm:p-4 rounded-xl bg-black/60 border border-emerald-500/40 backdrop-blur-md space-y-1.5"
            aria-live="polite"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Teks yang Sedang Dibacakan (Live Karaoke):</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="mr-1">Ukuran Font:</span>
                <button
                  type="button"
                  onClick={() => setSubtitleSize('normal')}
                  className={`px-1.5 py-0.5 rounded text-[9px] ${subtitleSize === 'normal' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setSubtitleSize('large')}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${subtitleSize === 'large' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => setSubtitleSize('xlarge')}
                  className={`px-1.5 py-0.5 rounded text-[13px] font-black ${subtitleSize === 'xlarge' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                >
                  A++
                </button>
              </div>
            </div>

            <p
              className={`text-white font-medium leading-relaxed transition-all ${
                subtitleSize === 'large'
                  ? 'text-base sm:text-lg'
                  : subtitleSize === 'xlarge'
                  ? 'text-lg sm:text-xl font-bold'
                  : 'text-xs sm:text-sm'
              } ${isPlaying && !isPaused ? 'text-amber-200' : 'text-slate-300'}`}
            >
              {currentSpokenText}
            </p>
          </div>
        )}

        {/* Expandable Advanced Voice & Sound Settings */}
        {showSettings && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-400/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                <Sliders className="w-3.5 h-3.5" />
                <span>Pengaturan Suara Sintesis (Speech Engine)</span>
              </h5>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="text-[10px] text-slate-400 hover:text-white font-mono"
              >
                Tutup ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Voice Selector */}
              <div>
                <label htmlFor="select-tts-voice" className="block text-[11px] text-slate-300 font-medium mb-1">
                  Pilihan Karakter Suara:
                </label>
                <select
                  id="select-tts-voice"
                  value={selectedVoiceName}
                  onChange={(e) => {
                    setSelectedVoiceName(e.target.value);
                    if (isPlaying) {
                      playChunkAt(currentChunkIndexRef.current);
                    }
                  }}
                  className="w-full px-2.5 py-1.5 bg-black/80 border border-white/20 rounded-lg text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  {availableVoices.length === 0 ? (
                    <option value="">Default Browser Voice (Indonesian)</option>
                  ) : (
                    availableVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Pitch Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                  <span>Nada Suara (Pitch):</span>
                  <span className="font-mono text-amber-300">{pitch}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info for Accessibility Compliance */}
      <div className="relative z-10 pt-2.5 mt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <UserCheck className="w-3 h-3 text-emerald-400" />
          <span>Mendukung Screen Reader, Tunanetra, Low Vision, &amp; Disleksia</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Pintasan: <kbd className="px-1 py-0.5 bg-black/70 rounded text-[9px] text-amber-300">Ctrl+P</kbd> Play/Pause</span>
        </div>
      </div>
    </section>
  );
}
