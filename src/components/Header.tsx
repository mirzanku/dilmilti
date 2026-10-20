import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Compass } from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { UserAccount, CourtIdentityData } from '../types';
import { getFreshImageUrl } from '../utils/imageHelper';
import BerakhlakBanner from './BerakhlakBanner';

const bannerMakassar = '/images/makassar_court_banner_1789442426023.jpg';
const logoTransparent = '/images/dilmilti_v_logo_transparent.png';

interface HeaderProps {
  onSearchSubmit?: (query: string) => void;
  onNavigate: (section: any) => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [courtIdentity, setCourtIdentity] = useState<CourtIdentityData>(() => CourtDB.getCourtIdentity());

  useEffect(() => {
    const handleUpdate = () => {
      setCourtIdentity(CourtDB.getCourtIdentity());
    };
    handleUpdate();
    const unsubscribe = CourtDB.subscribe(handleUpdate);
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('dilmilti_db_updated', handleUpdate);
    };
  }, []);

  const bannerSource = courtIdentity.bannerUrl?.trim() || bannerMakassar;
  const logoSource = courtIdentity.logoUrl?.trim() || logoTransparent;

  return (
    <header id="site-header" className="relative overflow-hidden bg-[#041A0F] text-white border-b-2 border-amber-400 shadow-2xl">
      
      {/* Background Graphic: Banner Header Utama (Foto / Gedung / Pinisi) yang jelas dan responsif */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          key={`header-banner-${bannerSource}`}
          src={getFreshImageUrl(bannerSource)}
          alt="Banner Utama Pengadilan Militer Tinggi V Makassar"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-75 sm:opacity-85 scale-100 transition-opacity duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== bannerMakassar) {
              target.src = bannerMakassar;
            }
          }}
        />
        {/* Layered Gradient: Menjamin keterbacaan teks kiri tanpa mengaburkan keindahan gambar */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03150B]/95 via-[#062414]/80 md:via-[#062414]/70 to-[#03150B]/45"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#03150B]/85 via-transparent to-black/20"></div>
        {/* Camo Tactical Vector Overlay Accent */}
        <div className="absolute inset-0 opacity-10 bg-military-camo-pattern mix-blend-overlay"></div>
      </div>

      {/* Header Banner Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4 sm:py-5">
        
        {/* Top-Right Corner: BerAKHLAK & Bangga Melayani Bangsa Compact Official Banner */}
        <div className="absolute top-2.5 right-4 sm:top-3 sm:right-6 lg:top-3.5 lg:right-6 z-20 hidden md:block">
          <BerakhlakBanner size="sm" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
          
          {/* Left Brand & Court Identity */}
          <div className="flex items-center gap-3.5 sm:gap-4.5 w-full lg:w-auto flex-1 min-w-0 pr-0 md:pr-48 lg:pr-56">
            
            {/* Official Seal / Crest with Elegant Oval Gold Frame */}
            <div 
              id="court-logo-container"
              onClick={() => onNavigate('beranda')}
              className="cursor-pointer flex-shrink-0 relative group"
              title="Lambang Resmi Pengadilan Militer Tinggi V Makassar"
            >
              <div className="relative w-20 h-[105px] sm:w-24 sm:h-[126px] md:w-26 md:h-[137px] lg:w-28 lg:h-[147px] transition-all duration-300 transform group-hover:scale-105 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                <div className="w-full h-full rounded-[50%] border-3 sm:border-4 border-amber-400 ring-2 ring-amber-300/80 shadow-2xl overflow-hidden bg-[#1b6b2d] flex items-center justify-center p-0">
                  <img
                    key={`header-logo-${logoSource}`}
                    src={getFreshImageUrl(logoSource)}
                    alt="Lambang Resmi Pengadilan Militer Tinggi V Makassar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] scale-[1.01] animate-logo-glow"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== logoTransparent) {
                        target.src = logoTransparent;
                      }
                    }}
                  />
                </div>
                <div className="absolute -inset-1 rounded-[50%] bg-amber-400/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10"></div>
              </div>
            </div>

            {/* Title & Contact Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black tracking-wider text-amber-300 uppercase font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {courtIdentity.parent || 'MAHKAMAH AGUNG REPUBLIK INDONESIA'}
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[11px] sm:text-xs md:text-sm px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-emerald-100 border-2 border-emerald-400/80 font-black rounded-lg shadow-md tracking-wider">
                    BADILMILTUN
                  </span>
                  <span className="text-[11px] sm:text-xs md:text-sm px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-lg flex items-center gap-1.5 shadow-lg tracking-wider border border-amber-300">
                    <Compass className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                    <span>KOTA DAENG</span>
                  </span>
                </div>
              </div>
              
              {/* Unbroken single line title */}
              <h1 
                onClick={() => onNavigate('beranda')}
                className="text-lg sm:text-2xl md:text-3xl lg:text-[26px] xl:text-[32px] font-black text-white leading-tight tracking-tight cursor-pointer hover:text-amber-300 transition-colors drop-shadow-xl font-serif mt-1 whitespace-nowrap overflow-x-auto scrollbar-none"
                title={courtIdentity.name}
              >
                {courtIdentity.name}
              </h1>
              
              {/* Address and contact snippet with email under phone line */}
              <div className="mt-2 flex flex-col gap-1 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-emerald-200">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{courtIdentity.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>PTSP & WA: {courtIdentity.whatsapp}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-100">
                  <Mail className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{courtIdentity.email || 'dilmiti5makassar@gmail.com'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile fallback for BerAKHLAK Banner */}
          <div className="flex items-center justify-center shrink-0 w-full md:hidden mt-1">
            <BerakhlakBanner size="xs" />
          </div>

        </div>
      </div>
    </header>
  );
}
