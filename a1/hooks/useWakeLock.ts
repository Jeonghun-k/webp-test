import { useEffect, useRef, useState, useCallback } from 'react';

export const useWakeLock = () => {
  const [isLocked, setIsLocked] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        const lock = await navigator.wakeLock.request('screen');
        wakeLockRef.current = lock;
        setIsLocked(true);
        
        lock.addEventListener('release', () => {
          setIsLocked(false);
          wakeLockRef.current = null;
        });
      } catch (err) {
        // Silently ignore NotAllowedError which is common in iframes/webviews
        if ((err as Error).name !== 'NotAllowedError') {
          console.warn('Wake Lock request failed:', err);
        }
        setIsLocked(false);
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch (err) {
        console.warn('Wake Lock release failed:', err);
      }
      wakeLockRef.current = null;
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    // Re-acquire lock if visibility changes (e.g. user switches tabs and comes back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    requestWakeLock(); // Initial request

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [requestWakeLock, releaseWakeLock]);

  return { isLocked, requestWakeLock, releaseWakeLock };
};