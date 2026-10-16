import { useState, useEffect, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, Contrast, Moon, Sun, RotateCcw, Volume2, VolumeX, Eye, Pause, Play, Rss } from 'lucide-react';

interface AccessibilityProps {
  onHighContrastToggle?: (active: boolean) => void;
  isHighContrast?: boolean;
  onDarkModeToggle?: (active: boolean) => void;
  isDarkMode?: boolean;
  onTextScaleChange?: (scale: number) => void;
  textScale?: number;
  onDyslexicToggle?: (active: boolean) => void;
  isDyslexic?: boolean;
}

export default function AccessibilityBar({
  onHighContrastToggle,
  isHighContrast: propHighContrast,
  onDarkModeToggle,
  isDarkMode: propDarkMode,
  onTextScaleChange,
  textScale: propTextScale,
  onDyslexicToggle,
  isDyslexic: propDyslexic
}: AccessibilityProps) {
  const [localHighContrast, setLocalHighContrast] = useState(false);
  const [localDarkMode, setLocalDarkMode] = useState(false);
  const [localTextScale, setLocalTextScale] = useState(100);
  const [localDyslexic, setLocalDyslexic] = useState(false);

  const isHighContrast = propHighContrast ?? localHighContrast;
  const isDarkMode = propDarkMode ?? localDarkMode;
  const textScale = propTextScale ?? localTextScale;
  const isDyslexic = propDyslexic ?? localDyslexic;

  const triggerHighContrast = (val: boolean) => {
    setLocalHighContrast(val);
    onHighContrastToggle?.(val);
    if (val) {
      document.documentElement.classList.add('contrast-more');
      document.body.classList.add('contrast-more');
    } else {
      document.documentElement.classList.remove('contrast-more');
      document.body.classList.remove('contrast-more');
    }
  };

  const triggerDarkMode = (val: boolean) => {
    setLocalDarkMode(val);
    onDarkModeToggle?.(val);
    if (val) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  const triggerTextScale = (val: number) => {
    const clamped = Math.min(150, Math.max(80, val));
    setLocalTextScale(clamped);
    onTextScaleChange?.(clamped);
    document.documentElement.style.fontSize = `${(clamped / 100) * 16}px`;
    document.documentElement.style.setProperty('--text-scale', `${clamped / 100}`);
  };

  const triggerDyslexic = (val: boolean) => {
    setLocalDyslexic(val);
    onDyslexicToggle?.(val);
    if (val) {
      document.documentElement.classList.add('dyslexic-font');
      document.body.classList.add('dyslexic-font');
      document.body.style.fontFamily = "'OpenDyslexic', 'Comic Sans MS', sans-serif";
    } else {
      document.documentElement.classList.remove('dyslexic-font');
      document.body.classList.remove('dyslexic-font');
      document.body.style.fontFamily = '';
    }
  };

  // Persistent Long-Duration Female Screen Reader State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [chunkProgress, setChunkProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(null);

  const isSpeakingRef = useRef(false);
  const isPausedRef = useRef(false);
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef(0);
  const keepAliveTimerRef = useRef<number | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Select Indonesian Female Voice
  const selectFemaleIndonesianVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const idVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().includes('id') ||
        v.lang.toLowerCase().includes('ind') ||
        v.name.toLowerCase().includes('indonesia') ||
        v.name.toLowerCase().includes('gadis') ||
        v.name.toLowerCase().includes('damayanti')
    );

    const femaleKeywords = [
      'gadis',
      'damayanti',
      'google bahasa indonesia',
      'female',
      'perempuan',
      'wanita',
      'siti',
      'kartika',
      'putri',
      'natural'
    ];

    // 1. Look for explicit female Indonesian voice (excluding male 'ardi')
    const explicitFemaleId = idVoices.find((v) => {
      const n = v.name.toLowerCase();
      if (n.includes('ardi') || n.includes('male') || n.includes('pria')) return false;
      return femaleKeywords.some((kw) => n.includes(kw));
    });
    if (explicitFemaleId) return explicitFemaleId;

    // 2. Any Indonesian voice that is not male ('ardi')
    const nonMaleId = idVoices.find((v) => !v.name.toLowerCase().includes('ardi'));
    if (nonMaleId) return nonMaleId;

    // 3. Fallback to any Indonesian voice or female voice
    if (idVoices.length > 0) return idVoices[0];

    const fallbackFemale = voices.find((v) =>
      ['female', 'zira', 'samantha', 'victoria', 'google'].some((kw) =>
        v.name.toLowerCase().includes(kw)
      )
    );
    return fallbackFemale || voices[0] || null;
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const chosen = selectFemaleIndonesianVoice();
      if (chosen) setFemaleVoice(chosen);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectFemaleIndonesianVoice]);

  // Split long text into ~135 character sentence chunks so browser TTS never cuts off
  const buildSpeechChunks = (rawText: string): string[] => {
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

      if (trimmed.length > 140) {
        if (buffer) {
          result.push(buffer.trim());
          buffer = '';
        }
        // Further split long clauses by comma or words
        const clauses = trimmed.split(/(?<=[,:])\s+/);
        let clauseBuf = '';
        for (const cl of clauses) {
          if ((clauseBuf + ' ' + cl).trim().length <= 140) {
            clauseBuf = (clauseBuf + ' ' + cl).trim();
          } else {
            if (clauseBuf) result.push(clauseBuf);
            if (cl.length <= 140) {
              clauseBuf = cl;
            } else {
              const words = cl.split(' ');
              let wordBuf = '';
              for (const w of words) {
                if ((wordBuf + ' ' + w).trim().length <= 130) {
                  wordBuf = (wordBuf + ' ' + w).trim();
                } else {
                  if (wordBuf) result.push(wordBuf);
                  wordBuf = w;
                }
              }
              clauseBuf = wordBuf;
            }
          }
        }
        if (clauseBuf) result.push(clauseBuf);
      } else if ((buffer + ' ' + trimmed).trim().length <= 140) {
        buffer = (buffer + ' ' + trimmed).trim();
      } else {
        if (buffer) result.push(buffer.trim());
        buffer = trimmed;
      }
    }

    if (buffer.trim()) {
      result.push(buffer.trim());
    }

    return result;
  };

  const stopKeepAlive = () => {
    if (keepAliveTimerRef.current) {
      window.clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
  };

  const stopReading = useCallback(() => {
    isSpeakingRef.current = false;
    isPausedRef.current = false;
    setIsSpeaking(false);
    setIsPaused(false);
    setChunkProgress({ current: 0, total: 0 });
    chunksRef.current = [];
    chunkIndexRef.current = 0;
    activeUtteranceRef.current = null;
    stopKeepAlive();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakChunkAt = useCallback(
    (index: number) => {
      if (!('speechSynthesis' in window) || !isSpeakingRef.current) return;
      const chunks = chunksRef.current;

      if (index >= chunks.length) {
        // Loop back to the beginning of the page so screen reader stays active as long as needed
        chunkIndexRef.current = 0;
        setChunkProgress({ current: 1, total: chunks.length });
      } else {
        chunkIndexRef.current = index;
        setChunkProgress({ current: index + 1, total: chunks.length });
      }

      const textToRead = chunks[chunkIndexRef.current];
      if (!textToRead) {
        stopReading();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToRead);
      const voice = femaleVoice || selectFemaleIndonesianVoice();
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = 'id-ID';
      // Natural Indonesian female cadence and pitch
      utterance.rate = 0.98;
      utterance.pitch = 1.15;
      utterance.volume = 1.0;

      utterance.onend = () => {
        if (!isSpeakingRef.current || isPausedRef.current) return;
        const nextIdx = chunkIndexRef.current + 1;
        if (nextIdx < chunksRef.current.length) {
          window.setTimeout(() => {
            if (isSpeakingRef.current && !isPausedRef.current) {
              speakChunkAt(nextIdx);
            }
          }, 80);
        } else {
          // Completed full page reading; restart after a brief pause so it can read continuously
          window.setTimeout(() => {
            if (isSpeakingRef.current && !isPausedRef.current) {
              speakChunkAt(0);
            }
          }, 800);
        }
      };

      utterance.onerror = (ev) => {
        if (ev.error === 'canceled' || ev.error === 'interrupted') return;
        if (isSpeakingRef.current && !isPausedRef.current) {
          const nextIdx = chunkIndexRef.current + 1;
          if (nextIdx < chunksRef.current.length) {
            window.setTimeout(() => speakChunkAt(nextIdx), 150);
          } else {
            stopReading();
          }
        }
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [femaleVoice, selectFemaleIndonesianVoice, stopReading]
  );

  const startReadingPage = useCallback(
    (customPrefix?: string) => {
      if (!('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      stopKeepAlive();

      const mainEl = document.querySelector('main') || document.body;
      const rawContent = mainEl.innerText || '';
      const prefix =
        customPrefix ||
        'Pembaca Layar Aktif. Portal Resmi Pengadilan Militer Tinggi V Makassar. ';

      const chunks = buildSpeechChunks(prefix + rawContent);
      if (chunks.length === 0) return;

      chunksRef.current = chunks;
      chunkIndexRef.current = 0;
      isSpeakingRef.current = true;
      isPausedRef.current = false;
      setIsSpeaking(true);
      setIsPaused(false);
      setChunkProgress({ current: 1, total: chunks.length });

      speakChunkAt(0);

      // Keep-alive interval to prevent Chrome/WebKit 15-second SpeechSynthesis freeze
      keepAliveTimerRef.current = window.setInterval(() => {
        if (!isSpeakingRef.current || isPausedRef.current) return;
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else if (!window.speechSynthesis.speaking && !isPausedRef.current && chunksRef.current.length > 0) {
          // Recover automatically if browser dropped utterance
          const nextIdx = (chunkIndexRef.current + 1) % chunksRef.current.length;
          speakChunkAt(nextIdx);
        }
      }, 4500);
    },
    [speakChunkAt]
  );

  const handleToggleReadScreen = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      stopReading();
    } else {
      startReadingPage();
    }
  };

  const handleTogglePauseResume = () => {
    if (!('speechSynthesis' in window) || !isSpeaking) return;
    if (isPaused) {
      isPausedRef.current = false;
      setIsPaused(false);
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        speakChunkAt(chunkIndexRef.current);
      }
    } else {
      isPausedRef.current = true;
      setIsPaused(true);
      window.speechSynthesis.pause();
    }
  };

  // Re-read new page content automatically if user navigates to another menu while screen reader is active
  useEffect(() => {
    if (!isSpeaking) return;

    const handleClickNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('button, a');
      if (!btn) return;
      if (btn.id === 'btn-read-screen' || btn.id === 'btn-pause-screen' || btn.id === 'btn-reset-accessibility') {
        return;
      }
      const label = (btn as HTMLElement).innerText?.trim();
      if (label && label.length > 1 && label.length < 100) {
        window.setTimeout(() => {
          if (isSpeakingRef.current) {
            startReadingPage(`Membuka halaman ${label}. `);
          }
        }, 350);
      }
    };

    document.addEventListener('click', handleClickNavigation);
    return () => {
      document.removeEventListener('click', handleClickNavigation);
    };
  }, [isSpeaking, startReadingPage]);

  useEffect(() => {
    return () => {
      stopReading();
    };
  }, [stopReading]);

  const resetAll = () => {
    triggerHighContrast(false);
    triggerDarkMode(false);
    triggerTextScale(100);
    triggerDyslexic(false);
    stopReading();
  };

  return (
    <aside
      id="accessibility-toolbar"
      aria-label="Fitur Aksesibilitas Disabilitas"
      className="bg-slate-900 text-slate-100 text-xs py-1.5 px-3 border-b border-slate-700/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 font-mono text-[11px]">
            PORTAL RESMI DILMILTI V MAKASSAR
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Aksesibilitas Ramah Disabilitas (WAI-ARIA & WCAG):</span>
          </span>
          {isSpeaking ? (
            <span className="text-[11px] font-medium text-amber-300">
              Pembaca Layar Aktif ({chunkProgress.current}/{chunkProgress.total} bagian)
            </span>
          ) : (
            <span className="hidden md:inline text-slate-400">
              Standar Keterbukaan Informasi Mahkamah Agung RI
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Text Size adjustments */}
          <div className="flex items-center bg-slate-800 rounded px-1 border border-slate-700">
            <button
              type="button"
              id="btn-zoom-out"
              onClick={() => triggerTextScale(textScale - 10)}
              title="Perkecil Ukuran Teks"
              aria-label="Perkecil Ukuran Teks"
              className="p-1 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] font-mono text-slate-300">
              {Math.round(textScale)}%
            </span>
            <button
              type="button"
              id="btn-zoom-in"
              onClick={() => triggerTextScale(textScale + 10)}
              title="Perbesar Ukuran Teks (Hingga 150%)"
              aria-label="Perbesar Ukuran Teks"
              className="p-1 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* High Contrast */}
          <button
            type="button"
            id="btn-toggle-contrast"
            onClick={() => triggerHighContrast(!isHighContrast)}
            aria-pressed={isHighContrast}
            title="Mode Kontras Tinggi (WCAG 4.5:1)"
            className={`px-2 py-1 rounded flex items-center gap-1 border transition-colors cursor-pointer ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Contrast className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kontras Tinggi</span>
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            id="btn-toggle-dark"
            onClick={() => triggerDarkMode(!isDarkMode)}
            aria-pressed={isDarkMode}
            title="Mode Gelap / Terang"
            className={`px-2 py-1 rounded flex items-center gap-1 border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-indigo-700 text-white border-indigo-500'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
          </button>

          {/* Screen Reader Voice */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              id="btn-read-screen"
              onClick={handleToggleReadScreen}
              aria-pressed={isSpeaking}
              title="Pembaca Layar (Non-Stop Seluruh Halaman)"
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 border transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isSpeaking ? 'Matikan Pembaca Layar' : 'Pembaca Layar'}</span>
            </button>

            {isSpeaking && (
              <button
                type="button"
                id="btn-pause-screen"
                onClick={handleTogglePauseResume}
                title={isPaused ? 'Lanjutkan Membaca' : 'Jeda Membaca'}
                className="px-2 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-1 cursor-pointer"
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                <span>{isPaused ? 'Lanjut' : 'Jeda'}</span>
              </button>
            )}
          </div>

          {/* Dyslexia friendly font */}
          <button
            type="button"
            id="btn-toggle-dyslexic"
            onClick={() => triggerDyslexic(!isDyslexic)}
            aria-pressed={isDyslexic}
            title="Font Ramah Disleksia"
            className={`px-2 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
              isDyslexic
                ? 'bg-amber-600 text-white border-amber-400 font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Dyslexia Font
          </button>

          {/* RSS Feed Button */}
          <button
            type="button"
            id="btn-open-rss"
            onClick={() => window.dispatchEvent(new CustomEvent('dilmilti_open_rss_feed'))}
            title="Sindikasi & Langganan RSS Feed 2.0"
            className="px-2 py-1 rounded bg-amber-400/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-amber-400/50 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Rss className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">RSS Feed</span>
          </button>

          {/* Reset */}
          {(textScale !== 100 || isHighContrast || isDarkMode || isDyslexic || isSpeaking) && (
            <button
              type="button"
              id="btn-reset-accessibility"
              onClick={resetAll}
              title="Kembalikan Tampilan Normal"
              className="px-2 py-1 bg-red-950/60 text-red-300 border border-red-800/80 rounded hover:bg-red-900 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
