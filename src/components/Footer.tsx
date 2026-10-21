import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck, Facebook, Instagram, Rss } from 'lucide-react';
import { CourtDB } from '../data/courtDatabase';
import { CourtIdentityData, RelatedWebsiteItem } from '../types';
import { getFreshImageUrl } from '../utils/imageHelper';

const logoTransparent = '/images/dilmilti_v_logo_transparent.png';

interface FooterProps {
  onNavigate: (tab: string, subTab?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [identity, setIdentity] = useState<CourtIdentityData>(() => CourtDB.getCourtIdentity());
  const [relatedLinks, setRelatedLinks] = useState<RelatedWebsiteItem[]>(() => CourtDB.getRelatedWebsites());

  useEffect(() => {
    setIdentity(CourtDB.getCourtIdentity());
    setRelatedLinks(CourtDB.getRelatedWebsites());
    const handleUpdate = () => {
      setIdentity(CourtDB.getCourtIdentity());
      setRelatedLinks(CourtDB.getRelatedWebsites());
    };
    window.addEventListener('dilmilti_db_updated', handleUpdate);
    return () => window.removeEventListener('dilmilti_db_updated', handleUpdate);
  }, []);

  return (
    <footer className="bg-[#071F13] text-slate-100 border-t-4 border-amber-400 pt-12 pb-8 text-xs relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 pointer-events-none opacity-15 bg-military-camo-pattern"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-500/30">
          
          {/* Col 1: Identity & Contacts */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[63px] rounded-[50%] border-2 border-amber-400 ring-1 ring-amber-300/80 shadow-md overflow-hidden bg-[#1b6b2d] flex items-center justify-center shrink-0 p-0">
                <img
                  src={getFreshImageUrl(identity.logoUrl || logoTransparent, identity.lastUpdated)}
                  alt="Logo Dilmilti V Makassar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-[1.01] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = logoTransparent;
                  }}
                />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm sm:text-base tracking-wide leading-tight drop-shadow-sm">
                  {identity.name || 'PENGADILAN MILITER TINGGI V MAKASSAR'}
                </h3>
                <span className="text-xs text-amber-300 font-bold block mt-0.5">
                  Badan Peradilan Militer & TUN MA-RI
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              Lembaga peradilan militer tingkat banding penegak hukum dan keadilan bagi prajurit TNI di seluruh Kawasan Timur Indonesia.
            </p>

            <div className="space-y-2.5 text-xs text-slate-100">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span className="text-white font-medium">{identity.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-white font-medium">{identity.phone} • WA: {identity.whatsapp}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-white font-medium">{identity.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-white font-medium">{identity.jamOperasional || 'Senin - Jumat: 08.00 - 16.30 WITA'}</span>
              </div>

              {/* Social Media Links */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={identity.facebookUrl || 'https://facebook.com/dilmilti5.makassar'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-700/80 hover:bg-blue-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 border border-blue-400/40 transition-all shadow-sm"
                  title="Facebook Resmi Pengadilan Militer Tinggi V Makassar"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current text-white" />
                  <span>Facebook</span>
                </a>

                <a
                  href={identity.instagramUrl || 'https://instagram.com/dilmilti5.makassar'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 border border-pink-400/40 transition-all shadow-sm"
                  title="Instagram Resmi Pengadilan Militer Tinggi V Makassar"
                >
                  <Instagram className="w-3.5 h-3.5 text-white" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation & Standard Public Access */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-amber-300 text-xs sm:text-sm uppercase tracking-wider border-l-3 border-amber-400 pl-2.5">
              Menu Standar Mahkamah Agung
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('beranda')}
                  className="text-slate-100 hover:text-amber-300 font-medium transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-amber-400">•</span>
                  <span>Beranda Utama</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('tentang')}
                  className="text-slate-100 hover:text-amber-300 font-medium transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-amber-400">•</span>
                  <span>Profil, Visi Misi & Yurisdiksi</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('publik', 'jenis-layanan')}
                  className="text-amber-300 hover:text-white font-bold transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-amber-400">•</span>
                  <span>Informasi & Syarat Pelayanan PTSP</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => window.open('/?tab=ptsp-online&sub=app-viewer', '_blank')}
                  className="text-emerald-300 hover:text-amber-300 font-bold transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-emerald-400">•</span>
                  <span>Aplikasi PTSP Online (Subdomain)</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400 shrink-0" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => window.open('/?tab=ptsp-online&sub=login', '_blank')}
                  className="text-slate-200 hover:text-amber-300 font-semibold transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-amber-400">•</span>
                  <span>Login Petugas / Admin PTSP</span>
                  <ExternalLink className="w-3 h-3 text-amber-300 shrink-0" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('sipp')}
                  className="text-slate-100 hover:text-amber-300 font-medium transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-amber-400">•</span>
                  <span>Penelusuran Perkara (SIPP)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('jadwal')}
                  className="text-slate-100 hover:text-amber-300 font-medium transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-amber-400">•</span>
                  <span>Jadwal Sidang Hari Ini</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hukum', 'uu-31-1997')}
                  className="text-slate-100 hover:text-amber-300 font-medium transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-amber-400">•</span>
                  <span>Referensi UU No. 31/1997</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('whatsapp')}
                  className="text-emerald-300 hover:text-emerald-200 font-bold transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-emerald-400">•</span>
                  <span>Notifikasi WhatsApp Real-Time</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('ppid')}
                  className="text-slate-100 hover:text-amber-300 font-medium transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-amber-400">•</span>
                  <span>Keterbukaan Informasi Publik (PPID)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('reformasi-birokrasi')}
                  className="text-amber-300 hover:text-amber-200 font-bold transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-amber-400">•</span>
                  <span>Zona Integritas WBK / WBBM & Eviden</span>
                </button>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('dilmilti_open_rss_feed'))}
                  className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-amber-400/40 font-black transition-all text-left cursor-pointer flex items-center gap-1.5 text-xs shadow-xs"
                  title="Buka Sindikasi & Saluran RSS Feed Pengadilan"
                >
                  <Rss className="w-3.5 h-3.5" />
                  <span>Langganan RSS Feed Berita</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Resmi Eksternal (Dynamic from CourtDB) */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-amber-300 text-xs sm:text-sm uppercase tracking-wider border-l-3 border-amber-400 pl-2.5">
              Situs Terkait & Pengawasan
            </h4>
            <ul className="space-y-2.5 text-xs">
              {relatedLinks.map((link) => (
                <li key={link.id || link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-100 hover:text-amber-300 font-medium flex items-center justify-between group py-0.5 transition-colors"
                    title={link.role}
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Kunjungi Kami & Lokasi Gedung */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-amber-300 text-xs sm:text-sm uppercase tracking-wider border-l-3 border-amber-400 pl-2.5">
              Lokasi Gedung Pengadilan
            </h4>
            
            {/* Interactive Map Visual Mockup */}
            <div className="bg-slate-900/95 rounded-xl p-3.5 border-2 border-emerald-500/40 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Makassar, Sulawesi Selatan
                </span>
                <span className="text-xs text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">KM. 13 Daya</span>
              </div>
              <div className="w-full h-24 bg-slate-950 rounded-lg border border-emerald-500/30 relative overflow-hidden flex items-center justify-center text-center p-2">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]"></div>
                <div className="relative z-10">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto mb-1 text-xs font-bold shadow-lg animate-bounce">
                    📍
                  </div>
                  <span className="text-xs font-extrabold text-white block">
                    Gedung Pengadilan Militer Tinggi V
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">{identity.address || 'Jl. Perintis Kemerdekaan KM. 13, Kel. Daya, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90243'}</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Pengadilan+Militer+Tinggi+V+Makassar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              </a>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-emerald-500/40 text-xs text-slate-100 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-slate-100">Sertifikasi Standar Penyelenggaraan Situs Web MA No. 593/2026</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimer with High-Contrast Bright Font */}
        <div className="mt-8 pt-5 border-t border-emerald-500/40 bg-black/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-white text-xs sm:text-sm font-semibold shadow-inner">
          <div className="text-center md:text-left leading-relaxed">
            <span className="text-slate-100">© {new Date().getFullYear()} </span>
            <strong className="text-amber-300 font-black tracking-wide">Pengadilan Militer Tinggi V Makassar</strong>
            <span className="text-slate-200"> — Seluruh Hak Cipta Dilindungi Undang-Undang.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('dilmilti_open_rss_feed'))}
              className="text-amber-300 bg-black/80 hover:bg-amber-400 hover:text-slate-950 px-3 py-1 rounded-lg border border-amber-400/70 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Langganan RSS Feed & Sindikasi XML"
            >
              <Rss className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />
              <span>RSS 2.0 Feed</span>
            </button>
            <span className="text-emerald-300 bg-emerald-950/90 px-3 py-1 rounded-lg border border-emerald-400/60 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SK KMA & SK Dirjen Badilmiltun 2026</span>
            </span>
            <span className="text-amber-300 bg-amber-950/90 px-3 py-1 rounded-lg border border-amber-400/60 shadow-xs">
              Wilayah Yurisdiksi Kawasan Timur Indonesia
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
