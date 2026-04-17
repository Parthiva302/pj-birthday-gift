import React, { useRef, useState, useEffect } from "react";
import { CONFIG } from "../config";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [interacted, setInteracted] = useState(false);

  // Smooth volume fade
  const fadeVolume = (target: number, duration: number = 2000) => {
    const audio = audioRef.current;
    if (!audio) return;

    const start = audio.volume;
    const diff = target - start;
    const steps = 40;
    const stepDuration = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      audio.volume = Math.max(0, Math.min(1, start + (diff * step) / steps));
      if (step >= steps) clearInterval(interval);
    }, stepDuration);
  };

  const startPlayback = async () => {
    const audio = audioRef.current;
    if (!audio || playing) return;

    try {
      await audio.play();
      fadeVolume(0.5, 2000);
      setPlaying(true);
      setInteracted(true);
    } catch (err) {
      console.log("Autoplay blocked, waiting for interaction:", err);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio.loop = true;

    // Attempt to play on mount (might be blocked)
    startPlayback();

    // Standard workaround for autoplay: Play on first interaction
    const handleFirstInteraction = () => {
      if (!interacted) {
        startPlayback();
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
        document.removeEventListener("keydown", handleFirstInteraction);
      }
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [interacted]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      fadeVolume(0, 500);
      setTimeout(() => {
        audio.pause();
        setPlaying(false);
      }, 500);
    } else {
      try {
        await audio.play();
        fadeVolume(0.5, 1000);
        setPlaying(true);
      } catch (err) {
        console.log("Playback failed:", err);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src={CONFIG.musicPath} preload="auto" loop />

      <button
        className={`music-player ${!playing ? "paused" : ""}`}
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        title={playing ? "Pause music" : "Play music"}
      >
        {playing ? (
          <div className="music-bars">
            <div className="music-bar" />
            <div className="music-bar" />
            <div className="music-bar" />
            <div className="music-bar" />
          </div>
        ) : (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        )}
      </button>
    </>
  );
}
