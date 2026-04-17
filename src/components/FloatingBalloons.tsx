import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface BalloonData {
  id: number;
  color: string[];
  left: number;
  size: number;
  duration: number;
  drift: number;
  rotate: number;
}

export default function FloatingBalloons({ active }: { active: boolean }) {
  const [balloons, setBalloons] = useState<BalloonData[]>([]);

  useEffect(() => {
    if (!active) {
      setBalloons([]);
      return;
    }

    const spawnBalloon = () => {
      const id = Date.now() + Math.random();
      const newBalloon: BalloonData = {
        id,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        size: 40 + Math.random() * 30,
        left: Math.random() * 95,
        duration: 8 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 100,
        rotate: (Math.random() - 0.5) * 40,
      };

      setBalloons((prev) => [...prev, newBalloon]);

      // Remove balloon from state after animation completes
      setTimeout(() => {
        setBalloons((prev) => prev.filter((b) => b.id !== id));
      }, newBalloon.duration * 1000 + 100);
    };

    // Initial batch
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnBalloon, i * 400);
    }

    const interval = setInterval(spawnBalloon, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [active]);

  return (
    <div className="balloon-container">
      <AnimatePresence>
        {balloons.map((b) => (
          <motion.div
            key={b.id}
            className="balloon"
            initial={{ y: "110vh", x: `${b.left}vw`, opacity: 0 }}
            animate={{ 
              y: "-20vh", 
              x: `${b.left + (b.drift / 10)}vw`, 
              rotate: b.rotate,
              opacity: 1 
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: b.duration, ease: "linear" }}
            style={{
              width: b.size,
              height: b.size * 1.3,
              background: `radial-gradient(circle at 65% 30%, ${b.color[0]}, ${b.color[1]})`,
              boxShadow: `inset -8px -8px 15px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)`,
            }}
          >
            <div className="balloon-shine" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
