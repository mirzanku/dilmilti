import React from 'react';

export const logoTransparent = '/images/dilmilti_v_logo_transparent.png';
export const logoHijau = '/images/logo_ma_ri.png';

export const cleanCanonicalMediaUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('/api/upload')) {
    // Strip ephemeral ?t= or &t= or &_t= cache-busters from immutable /api/upload?id=... URLs
    return url
      .replace(/([?&])_?t=[^&]+(&|$)/g, (_match, prefix, suffix) => (suffix === '&' ? prefix : ''))
      .replace(/[?&]$/, '');
  }
  return url;
};

export const appendCacheBuster = (url: string | undefined, timestamp?: number | string): string => {
  if (!url) return '';
  // Data URLs, Blobs, and SVG data don't need query params
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const canonical = cleanCanonicalMediaUrl(url);
  
  // If no timestamp, return canonical
  if (!timestamp) {
    return canonical;
  }
  
  // Always append new timestamp
  const separator = canonical.includes('?') ? '&' : '?';
  return `${canonical}${separator}v=${timestamp}`;
};

export const getAssetUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return cleanCanonicalMediaUrl(url);
  }
  // Standardize leading slash
  const withSlash = url.startsWith('/') ? url : '/' + url;
  return cleanCanonicalMediaUrl(withSlash);
};

/**
 * High-resolution, zero-network SVG fallback portrait in official military judiciary palette
 * (Deep Emerald #0D4A2B + Amber/Gold #D4AF37) for personnel photos.
 * 100% self-contained so it loads in 0ms offline, on flaky networks, or when remote CDNs fail.
 */
export const DEFAULT_OFFICIAL_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#062314" />
      <stop offset="50%" stop-color="#0D4A2B" />
      <stop offset="100%" stop-color="#03140B" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="avatarShade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#bg)"/>
  <!-- Decorative Framing Lines -->
  <rect x="12" y="12" width="376" height="476" rx="16" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.4" />
  <circle cx="200" cy="180" r="76" fill="url(#avatarShade)" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.3))"/>
  <path d="M96 430 C96 300, 304 300, 304 430 Z" fill="url(#avatarShade)" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.3))"/>
  <!-- Gold Officer Collar Accent -->
  <path d="M182 300 L200 328 L218 300 Z" fill="url(#gold)"/>
  <!-- Judicial / Court Subtitle -->
  <text x="200" y="468" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="#FDE68A" letter-spacing="2.5" opacity="0.9">PENGADILAN MILITER TINGGI V</text>
</svg>
`)}`;

/**
 * Robust image error handler to prevent flashing, disappearing photos, or broken image frames.
 * Gracefully swaps broken or rate-limited URLs to the official dignified fallback.
 */
export const handleImageFallback = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  customFallback?: string
) => {
  const target = e.currentTarget;
  if (target.dataset.hasFailed === 'true') {
    return;
  }
  target.dataset.hasFailed = 'true';
  target.src = customFallback || DEFAULT_OFFICIAL_AVATAR;
};

/**
 * Returns a deterministic, normalized image URL that stays stable across React re-renders
 * so browsers, Service Workers, and Vercel's CDN can cache it without aborting in-flight requests.
 */
export const getFreshImageUrl = (url: string | undefined, customTimestamp?: number | string): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return DEFAULT_OFFICIAL_AVATAR;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  const normalized = getAssetUrl(trimmed);
  return appendCacheBuster(normalized, customTimestamp);
};

export const getSafePersonnelPhotoUrl = (url?: string | null, customFallback?: string): string => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return customFallback || DEFAULT_OFFICIAL_AVATAR;
  }
  return getFreshImageUrl(url.trim());
};

/**
 * High-performance image compressor.
 * Compresses any user-selected image to a sharp, compact JPEG Data URI (20-60KB).
 * This ensures images are 100% self-contained, permanent, never revert, and never trigger 404s.
 */
export const compressImage = (file: File, maxWidth = 900, maxHeight = 1200, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If SVG, return as data URI directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
