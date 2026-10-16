import React from 'react';

interface TniCartoonAvatarProps {
  className?: string;
  size?: number;
  animate?: boolean;
  status?: 'idle' | 'thinking' | 'speaking' | 'listening';
}

/**
 * TniCartoonAvatar - Karakter Kartun Prajurit TNI yang Bersahaja & Ramah
 * Dirancang khusus sebagai maskot & ikon AI Chatbot PETA DILMILTI Pengadilan Militer Tinggi V Makassar.
 */
export const TniCartoonAvatar: React.FC<TniCartoonAvatarProps> = ({
  className = 'w-6 h-6',
  size,
  animate = false,
  status = 'idle'
}) => {
  const customStyle = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={customStyle}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="tniFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDDCB8" />
            <stop offset="100%" stopColor="#F5BE8F" />
          </linearGradient>

          <linearGradient id="tniBeretGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E5E3A" />
            <stop offset="40%" stopColor="#13472C" />
            <stop offset="100%" stopColor="#0B2E1C" />
          </linearGradient>

          <linearGradient id="tniUniformGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E6B47" />
            <stop offset="100%" stopColor="#16432B" />
          </linearGradient>

          <linearGradient id="tniGoldBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="tniRedWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* 1. Background Halo/Aura */}
        <circle cx="50" cy="50" r="48" fill="#0A3622" stroke="#FBBF24" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" fill="#0E452C" />

        {/* 2. Badan & Seragam TNI Bersahaja */}
        {/* Bahu & Kerah */}
        <path
          d="M20 92 C20 74, 32 68, 50 68 C68 68, 80 74, 80 92 Z"
          fill="url(#tniUniformGrad)"
          stroke="#092215"
          strokeWidth="1.5"
        />

        {/* Kerah Baju Dinas & Dasi/V-Neck */}
        <path d="M42 68 L50 82 L58 68 Z" fill="#FDDCB8" />
        <path d="M40 68 L50 84 L46 86 L36 71 Z" fill="#1C4F34" stroke="#092215" strokeWidth="1" />
        <path d="M60 68 L50 84 L54 86 L64 71 Z" fill="#25633F" stroke="#092215" strokeWidth="1" />

        {/* Pangkat & Lencana Merah Putih di Dada */}
        <rect x="27" y="78" width="8" height="5" rx="1.5" fill="url(#tniRedWhiteGrad)" stroke="#092215" strokeWidth="0.8" />
        <rect x="65" y="78" width="8" height="4" rx="1" fill="url(#tniGoldBadgeGrad)" stroke="#092215" strokeWidth="0.8" />

        {/* 3. Leher */}
        <rect x="43" y="58" width="14" height="14" rx="3" fill="#E8A878" />

        {/* 4. Telinga Kiri & Kanan */}
        <circle cx="28" cy="48" r="6" fill="#F5BE8F" stroke="#B87346" strokeWidth="1" />
        <circle cx="28" cy="48" r="3" fill="#E89B66" />
        <circle cx="72" cy="48" r="6" fill="#F5BE8F" stroke="#B87346" strokeWidth="1" />
        <circle cx="72" cy="48" r="3" fill="#E89B66" />

        {/* 5. Kepala / Wajah Ramah & Bersahaja */}
        <ellipse cx="50" cy="48" rx="23" ry="22" fill="url(#tniFaceGrad)" stroke="#C88252" strokeWidth="1" />

        {/* Pipi Merona Bersahabat (Blush) */}
        <ellipse cx="36" cy="53" rx="4" ry="2" fill="#FCA5A5" opacity="0.6" />
        <ellipse cx="64" cy="53" rx="4" ry="2" fill="#FCA5A5" opacity="0.6" />

        {/* 6. Rambut Rapi Samping */}
        <path d="M28 42 Q30 35 34 33 Q30 40 30 46 Z" fill="#29180E" />
        <path d="M72 42 Q70 35 66 33 Q70 40 70 46 Z" fill="#29180E" />

        {/* 7. Mata Ramah & Berbinar */}
        {/* Alis Tegas tapi Ramah */}
        <path d="M36 40 Q41 37 45 39" stroke="#3D2415" strokeWidth="2" strokeLinecap="round" />
        <path d="M64 40 Q59 37 55 39" stroke="#3D2415" strokeWidth="2" strokeLinecap="round" />

        {/* Bola Mata */}
        {status === 'thinking' ? (
          <>
            <path d="M38 43 Q41 40 44 43" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M56 43 Q59 40 62 43" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <ellipse cx="41" cy="45" rx="3.5" ry="4" fill="#1E293B" />
            <circle cx="42.5" cy="43.5" r="1.5" fill="#FFFFFF" />
            <ellipse cx="59" cy="45" rx="3.5" ry="4" fill="#1E293B" />
            <circle cx="60.5" cy="43.5" r="1.5" fill="#FFFFFF" />
          </>
        )}

        {/* Hidung Kecil Rapi */}
        <path d="M50 47 Q52 50 49 51" stroke="#C88252" strokeWidth="1.5" strokeLinecap="round" />

        {/* Senyum Hangat & Bersahaja */}
        {status === 'speaking' ? (
          <path d="M43 54 Q50 62 57 54 Z" fill="#881337" stroke="#3D2415" strokeWidth="1.2" />
        ) : (
          <path d="M43 54 Q50 60 57 54" stroke="#3D2415" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* 8. Baret TNI Hijau Gagah nan Bersahaja */}
        {/* Bentuk Baret Khas Miring ke Kiri (sudut pandang kanan pemirsa) */}
        <path
          d="M24 35 C24 20, 42 16, 68 18 C80 19, 82 28, 77 34 C72 40, 65 37, 50 35 C35 33, 26 31, 24 35 Z"
          fill="url(#tniBeretGrad)"
          stroke="#071E12"
          strokeWidth="1.8"
        />
        
        {/* Lipatan & Volume Baret Khas */}
        <path
          d="M27 34 C35 32, 58 33, 75 35 C70 38, 55 37, 30 36 Z"
          fill="#133D25"
          opacity="0.8"
        />

        {/* List Bawah Baret (Leather Band Hitam) */}
        <path
          d="M27 35 Q50 32 72 35"
          stroke="#0F172A"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Emblem Garuda / Bintang Emas Baret TNI */}
        <g transform="translate(36, 23)">
          {/* Sayap / Perisai Emblem */}
          <path d="M-2 4 L4 0 L10 4 L8 9 L4 11 L0 9 Z" fill="url(#tniGoldBadgeGrad)" stroke="#78350F" strokeWidth="0.8" />
          {/* Bintang Tengah */}
          <path
            d="M4 2 L4.8 3.8 L6.8 4 L5.2 5.3 L5.8 7.2 L4 6.2 L2.2 7.2 L2.8 5.3 L1.2 4 L3.2 3.8 Z"
            fill="#FFFBEB"
          />
        </g>
      </svg>

      {/* Pulse / Animation Ring if Active or Speaking */}
      {(status === 'speaking' || status === 'listening') && (
        <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-75 pointer-events-none"></span>
      )}
    </div>
  );
};

export default TniCartoonAvatar;
