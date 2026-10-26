import React from 'react';
import { useImageLoader } from '../hooks/useImageLoader';
import { DEFAULT_OFFICIAL_AVATAR } from '../utils/imageHelper';

interface OfficerProfileImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const OfficerProfileImage: React.FC<OfficerProfileImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = ''
}) => {
  const { src: imageSrc, isLoading, handleError, handleLoad } = useImageLoader(src, {
    fallbackUrl: DEFAULT_OFFICIAL_AVATAR,
    maxRetries: 2,
    retryDelayMs: 1200
  });

  return (
    <div className={`relative w-full h-full overflow-hidden ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-2xs animate-pulse flex items-center justify-center z-10">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
};

export default OfficerProfileImage;
