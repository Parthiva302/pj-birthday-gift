import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CONFIG } from "../config";

/* ─── Typewriter Hook ─── */
function useTypewriter(text: string, speed: number = 30, startTyping: boolean = false) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!startTyping) {
      setDisplayed("");
      setIsDone(false);
      return;
    }

    let index = 0;
    setDisplayed("");
    setIsDone(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, startTyping]);

  return { displayed, isDone };
}

/* ─── Floating sparkle particles ─── */
function Sparkles() {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
    size: Math.random() * 4 + 2,
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {sparkles.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: "#fff",
            borderRadius: "50%",
            animation: `sparkleFloat ${s.duration}s ease-in-out ${s.delay}s infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Message Section ─── */
export default function Message() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });
  const { displayed, isDone } = useTypewriter(CONFIG.message, 25, isInView);

  return (
    <div ref={sectionRef} style={{ position: "relative", width: "100%" }}>
      <Sparkles />

      <motion.div
        className="message-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ margin: "0 auto" }}
      >
        <motion.h2
          className="message-greeting"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {CONFIG.greeting}
        </motion.h2>

        <p className="message-body">
          {displayed}
          {!isDone && <span className="message-cursor" />}
        </p>

        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ textAlign: "center", marginTop: "2rem" }}
          >
            <button
              className="btn-neon"
              onClick={() =>
                document
                  .getElementById("finale")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              🎆 The Grand Finale
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
