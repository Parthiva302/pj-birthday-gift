import React, { useState, useEffect } from "react";

interface ScrollProgressProps {
  sectionIds: string[];
}

export default function ScrollProgress({ sectionIds }: ScrollProgressProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && scrollY >= el.offsetTop) {
          setActiveIndex(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="scroll-progress" aria-label="Section navigation">
      {sectionIds.map((id, i) => (
        <button
          key={id}
          className={`scroll-dot ${i === activeIndex ? "active" : ""}`}
          onClick={() => scrollTo(id)}
          aria-label={`Go to ${id} section`}
          title={id.charAt(0).toUpperCase() + id.slice(1)}
        />
      ))}
    </nav>
  );
}
