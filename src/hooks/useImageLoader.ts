import { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import { getFreshImageUrl, DEFAULT_OFFICIAL_AVATAR } from '../utils/imageHelper';

export interface UseImageLoaderOptions {
  fallbackUrl?: string;
  maxRetries?: number;
  retryDelayMs?: number;
}

export function useImageLoader(initialUrl?: string | null, options: UseImageLoaderOptions = {}) {
  const {
    fallbackUrl = DEFAULT_OFFICIAL_AVATAR,
    maxRetries = 2,
    retryDelayMs = 1500
  } = options;

  const [currentUrl, setCurrentUrl] = useState<string>(() => getFreshImageUrl(initialUrl || fallbackUrl));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    setCurrentUrl(getFreshImageUrl(initialUrl || fallbackUrl));
  }, [initialUrl, fallbackUrl]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback((e?: SyntheticEvent<HTMLImageElement, Event>) => {
    if (e && e.currentTarget) {
      e.currentTarget.dataset.hasFailed = 'true';
    }

    if (retryCount < maxRetries) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setCurrentUrl(getFreshImageUrl(initialUrl, Date.now()));
      }, retryDelayMs);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setHasError(true);
      setCurrentUrl(fallbackUrl);
    }
  }, [initialUrl, fallbackUrl, maxRetries, retryCount, retryDelayMs]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    setCurrentUrl(getFreshImageUrl(initialUrl, Date.now()));
  }, [initialUrl]);

  return {
    src: currentUrl,
    isLoading,
    hasError,
    retryCount,
    handleLoad,
    handleError,
    retry
  };
}
