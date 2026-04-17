import React, { useRef, useEffect, useCallback } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  gravity: number;
}

const COLORS = [
  "#ff2d55",
  "#d4af37",
  "#6c5ce7",
  "#00b894",
  "#fdcb6e",
  "#ff6b6b",
  "#48dbfb",
  "#ffffff",
  "#ff9ff3",
  "#ffeaa7",
];

export default function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const animRef = useRef<number>(0);

  const createBurst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.3;

    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      piecesRef.current.push({
        x: cx + (Math.random() - 0.5) * 200,
        y: cy + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        width: Math.random() * 10 + 4,
        height: Math.random() * 6 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        alpha: 1,
        gravity: 0.12 + Math.random() * 0.08,
      });
    }
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initial burst
    createBurst();
    // Second burst
    const t1 = setTimeout(createBurst, 800);
    const t2 = setTimeout(createBurst, 1600);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      piecesRef.current = piecesRef.current.filter((p) => p.alpha > 0.01);

      for (const p of piecesRef.current) {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.alpha -= 0.005;

        // Air resistance wobble
        p.vx += Math.sin(p.rotation * 0.05) * 0.1;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();
      }

      if (piecesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
      piecesRef.current = [];
    };
  }, [active, createBurst]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
    />
  );
}
