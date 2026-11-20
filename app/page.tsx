'use client';

import { useState, useRef, useEffect } from 'react';
import DomeGallery from '@/components/DomeGallery';
import InteractionFlow from '@/components/InteractionFlow';

export default function Home() {
  const [showGallery, setShowGallery] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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
    '/15.jpeg', // Ubah ke '/15.mp4' jika file ke-15 berupa video
  ];

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 1.0;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.log('Audio playback prevented:', err);
      });
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  // Memutar lagu saat interaksi pertama pengguna di layar
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        playAudio();
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    return () => window.removeEventListener('pointerdown', handleFirstInteraction);
  }, []);

  // Menghentikan lagu otomatis saat keluar dari browser, pindah tab, atau layar mati
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAudio();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', pauseAudio);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', pauseAudio);
    };
  }, []);

  const handleFlowComplete = () => {
    setShowGallery(true);
    playAudio();
  };

  const toggleAudio = () => {
    if (audioRef.current?.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  };

  return (
    <main className="relative w-screen h-screen bg-[#060010] overflow-hidden">
      {/* Samakan nama file ini dengan file asli di folder public */}
      <audio
        ref={audioRef}
        src="/tattooed-heart.mp3"
        loop
        preload="auto"
      />

      <button
        type="button"
        onClick={toggleAudio}
        className="fixed bottom-5 right-5 z-50 px-3.5 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-xs border border-white/20 hover:bg-white/25 transition"
      >
        {isPlaying ? '🔊 Music On' : '🔇 Play Music'}
      </button>

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