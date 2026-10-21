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
 * Returns a deterministic, normalized image URL that stays stable across React re-renders
 * so browsers, Service Workers, and Vercel's CDN can cache it without aborting in-flight requests.
 */
export const getFreshImageUrl = (url: string | undefined, customTimestamp?: number | string): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const normalized = getAssetUrl(url);
  return appendCacheBuster(normalized, customTimestamp);
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
