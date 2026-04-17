import React, { useEffect, useRef, useCallback } from "react";

const BALLOON_COLORS = [
  ["#ff2d55", "#800020"],
  ["#74b9ff", "#0984e3"],
  ["#55efc4", "#00b894"],
  ["#ffeaa7", "#fdcb6e"],
  ["#a29bfe", "#6c5ce7"],
  ["#ff9ff3", "#f368e0"],
  ["#fd79a8", "#e84393"],
  ["#fab1a0", "#e17055"],
];

export default function FloatingBalloons({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const spawnBalloon = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const balloon = document.createElement("div");
    balloon.className = "balloon";

    const shine = document.createElement("div");
    shine.className = "balloon-shine";
    balloon.appendChild(shine);

    const gradient = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const size = 40 + Math.random() * 30;
    const left = Math.random() * 95;
    const duration = 8 + Math.random() * 6;
    const drift = (Math.random() - 0.5) * 80;
    const rotate = (Math.random() - 0.5) * 30;

    balloon.style.left = `${left}vw`;
    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.3}px`;
    balloon.style.background = `radial-gradient(circle at 65% 30%, ${gradient[0]}, ${gradient[1]})`;
    balloon.style.boxShadow = `inset -8px -8px 15px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)`;
    balloon.style.animationDuration = `${duration}s`;
    balloon.style.setProperty("--drift", `${drift}px`);
    balloon.style.setProperty("--rotate", `${rotate}deg`);

    container.appendChild(balloon);
    setTimeout(() => balloon.remove(), duration * 1000);
  }, []);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Spawn initial batch
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnBalloon(), i * 300);
    }

    // Continuous spawn
    intervalRef.current = setInterval(spawnBalloon, 2500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, spawnBalloon]);

  return <div ref={containerRef} className="balloon-container" />;
}
