import React, { useRef, useState } from "react";
import Hero from "./components/Hero";
import Cake3D from "./components/Cake3D";
import Gallery from "./components/Gallery";
import Message from "./components/Message";
import Finale from "./components/Finale";
import MusicPlayer from "./components/MusicPlayer";
import ScrollProgress from "./components/ScrollProgress";
import FloatingBalloons from "./components/FloatingBalloons";
import Confetti from "./components/Confetti";

const SECTION_IDS = ["hero", "cake", "gallery", "message", "finale"];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [balloonsActive, setBalloonsActive] = useState(true);

  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 4000);
  };

  return (
    <div ref={containerRef}>
      {/* Fixed UI overlays */}
      <MusicPlayer />
      <ScrollProgress sectionIds={SECTION_IDS} />
      <FloatingBalloons active={balloonsActive} />
      <Confetti active={confettiActive} />

      {/* Scroll sections */}
      <section id="hero" className="section hero">
        <Hero />
      </section>

      <section id="cake" className="section cake-section">
        <Cake3D onBlowOut={triggerConfetti} />
      </section>

      <section id="gallery" className="gallery-section">
        <Gallery />
      </section>

      <section id="message" className="section message-section">
        <Message />
      </section>

      <section id="finale" className="section finale-section">
        <Finale onCelebrate={triggerConfetti} />
      </section>
    </div>
  );
}
