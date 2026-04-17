import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { CONFIG } from "../config";

/* ─── Firework Particle ─── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  gravity: number;
}

/* ─── Fireworks Canvas ─── */
function FireworksCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  const COLORS = [
    "rgba(255, 45, 85,",
    "rgba(212, 175, 55,",
    "rgba(108, 92, 231,",
    "rgba(0, 184, 148,",
    "rgba(253, 203, 110,",
    "rgba(255, 255, 255,",
    "rgba(255, 107, 107,",
    "rgba(72, 219, 251,",
  ];

  const createBurst = useCallback(
    (x: number, y: number) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        const speed = Math.random() * 4 + 1.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: Math.random() * 3 + 1,
          decay: Math.random() * 0.015 + 0.008,
          gravity: 0.03,
        });
      }
    },
    []
  );

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const launchInterval = setInterval(() => {
      const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const y = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
      createBurst(x, y);
    }, 600);

    const animate = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.01);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.vx *= 0.99;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(launchInterval);
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [active, createBurst]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="finale-canvas"
      style={{ position: "absolute", inset: 0 }}
    />
  );
}

/* ─── Finale Section ─── */
export default function Finale({
  onCelebrate,
}: {
  onCelebrate: () => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const [fireworksActive, setFireworksActive] = useState(false);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !triggered) {
      setTriggered(true);
      setFireworksActive(true);
      onCelebrate();
    }
  }, [isInView, triggered, onCelebrate]);

  return (
    <div
      ref={sectionRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <FireworksCanvas active={fireworksActive} />

      <div className="finale-content">
        {/* Profile photo at the end */}
        <motion.div
          className="finale-photo-container"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="finale-photo-ring">
            <img
              src={CONFIG.profilePhoto}
              alt={CONFIG.name}
              className="finale-photo"
            />
          </div>
        </motion.div>

        <motion.h1
          className="finale-title"
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            delay: 0.3,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          🎉 Happy Birthday! 🎉
        </motion.h1>

        <motion.p
          className="finale-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Here&apos;s to another amazing year, {CONFIG.name}! 🥳
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn-neon"
            onClick={() => {
              onCelebrate();
              setFireworksActive(true);
            }}
          >
            🎆 More Fireworks!
          </button>
          <button
            className="btn-neon"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            🔄 Replay The Magic
          </button>
        </motion.div>
      </div>
    </div>
  );
}
