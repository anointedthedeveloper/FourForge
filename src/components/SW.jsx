'use client';
import { useEffect } from 'react';

export default function SW() {
  useEffect(() => {
    if ('serviceWorker' in navigator)
      navigator.serviceWorker.register('/service-worker.js');
  }, []);
  return null;
}
