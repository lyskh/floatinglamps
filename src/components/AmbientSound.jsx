import { useEffect, useRef } from "react";

export default function AmbientSound({ url, enabled = true }) {
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.2;
    audioRef.current = audio;

    const handleUserInteraction = () => {
      if (enabled && !isPlayingRef.current) {
        audio.play().catch((err) => {
          console.warn("Audio playback prevented:", err);
        });
        isPlayingRef.current = true;
      }
    };

    // Try to autoplay
    if (enabled) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlayingRef.current = true;
        }).catch(() => {
          // Autoplay prevented, add click listener
          document.addEventListener("click", handleUserInteraction, { once: true });
        });
      }
    }

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [url, enabled]);

  // Handle enable/disable
  useEffect(() => {
    if (!audioRef.current) return;

    if (enabled && !isPlayingRef.current) {
      audioRef.current.play().catch(() => {
        console.warn("Audio play failed");
      });
      isPlayingRef.current = true;
    } else if (!enabled && isPlayingRef.current) {
      audioRef.current.pause();
      isPlayingRef.current = false;
    }
  }, [enabled]);

  return null;
}
