'use client';

import { useState, useRef, useEffect } from 'react';
import DomeGallery from '@/components/DomeGallery';
import InteractionFlow from '@/components/InteractionFlow';

export default function Home() {
  const [showGallery, setShowGallery] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const userImages = [
    '/1.jpeg',
    '/2.jpeg',
    '/3.jpeg',
    '/4.jpeg',
    '/5.jpeg',
    '/6.jpeg',
    '/7.jpeg',
    '/8.jpeg',
    '/9.jpeg',
    '/10.jpeg',
    '/11.jpeg',
    '/12.jpeg',
    '/13.jpeg',
    '/14.jpeg',
    '/15.jpeg',
  ];

  // Hentikan audio otomatis saat keluar dari browser, pindah tab, atau layar mati
  useEffect(() => {
    const pauseAudio = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAudio();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', pauseAudio);
    window.addEventListener('blur', pauseAudio);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', pauseAudio);
      window.removeEventListener('blur', pauseAudio);
    };
  }, []);

  const handleFlowComplete = () => {
    setShowGallery(true);
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log('Audio playback prevented:', err);
      });
    }
  };

  return (
    <main className="w-screen h-screen bg-[#060010]">
      {/* Elemen audio diletakkan di luar kondisi agar siap diputar saat klik terakhir */}
      <audio
        ref={audioRef}
        src="/tattoed-heart.mp3"
        loop
        preload="auto"
        className="hidden"
      />

      {!showGallery ? (
        <InteractionFlow onFlowComplete={handleFlowComplete} />
      ) : (
        <DomeGallery
          images={userImages}
          fit={0.8}
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale={false}
          autoRotationSpeed={0.1}
        />
      )}
    </main>
  );
}