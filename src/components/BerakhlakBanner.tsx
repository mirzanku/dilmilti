import React from 'react';

interface BerakhlakBannerProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const BerakhlakBanner: React.FC<BerakhlakBannerProps> = ({ 
  className = '',
  size = 'sm' 
}) => {
  return (
    <div 
      className={`inline-flex items-center gap-2 sm:gap-2.5 bg-white/95 hover:bg-white text-slate-900 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-amber-400/90 shadow-md backdrop-blur-md select-none transition-all duration-200 shrink-0 ${className}`}
      title="Core Values ASN: BerAKHLAK & #bangga melayani bangsa"
    >
      {/* 1. BerAKHLAK Logo & Subtitle */}
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center gap-0.5 leading-none">
          <span className="text-[#C81E1E] font-black tracking-tight text-xs sm:text-sm font-sans">
            Ber
          </span>
          <span className="text-[#8B1010] font-black tracking-tight text-xs sm:text-sm font-sans">
            AKHLAK
          </span>
          {/* Red Chevron Accent */}
          <span className="text-[#C81E1E] font-black text-[9px] sm:text-[10px] ml-0.5 -mt-1">
            ❯
          </span>
        </div>
        
        {/* Subtitle */}
        <div className="text-[6px] sm:text-[7px] leading-[1.1] font-bold text-slate-800 tracking-tighter mt-0.5 whitespace-nowrap">
          <div>
            <span className="text-[#C81E1E] font-black">B</span>erorientasi Pelayanan{' '}
            <span className="text-[#C81E1E] font-black">A</span>kuntabel{' '}
            <span className="text-[#C81E1E] font-black">K</span>ompeten
          </div>
          <div>
            <span className="text-[#C81E1E] font-black">H</span>armonis{' '}
            <span className="text-[#C81E1E] font-black">L</span>oyal{' '}
            <span className="text-[#C81E1E] font-black">A</span>daptif{' '}
            <span className="text-[#C81E1E] font-black">K</span>olaboratif
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-5 sm:h-6 w-[1px] bg-slate-300 rounded-full"></div>

      {/* 2. #bangga melayani bangsa Logo */}
      <div className="flex items-center gap-1.5">
        {/* Hashtag Icon */}
        <div className="flex items-center justify-center font-black text-base sm:text-lg text-[#C81E1E] italic font-sans select-none leading-none">
          #
        </div>

        {/* Text */}
        <div className="flex flex-col text-left leading-[1.05] font-black tracking-tighter">
          <span className="text-slate-900 text-[8.5px] sm:text-[9.5px] font-extrabold font-sans">
            bangga
          </span>
          <span className="text-slate-900 text-[8.5px] sm:text-[9.5px] font-extrabold font-sans">
            melayani
          </span>
          <span className="text-slate-900 text-[8.5px] sm:text-[9.5px] font-extrabold font-sans">
            bangsa
          </span>
        </div>
      </div>
    </div>
  );
};

export default BerakhlakBanner;
