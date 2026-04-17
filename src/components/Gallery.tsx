import React, { useState } from "react";
import { motion } from "framer-motion";
import { CONFIG } from "../config";

/* ─── Gallery Section — Featured Photo Layout ─── */
export default function Gallery() {
  const [imgError, setImgError] = useState(false);
  const image = CONFIG.galleryImages[0];

  return (
    <>
      <motion.h2
        className="gallery-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        ✨ A Special Moment ✨
      </motion.h2>

      {/* Featured single photo */}
      <motion.div
        className="gallery-featured"
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="gallery-featured-frame">
          <div className="gallery-featured-inner">
            {!imgError ? (
              <img
                src={image.src}
                alt={CONFIG.name}
                className="gallery-featured-image"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="gallery-card-placeholder" style={{
                background: "linear-gradient(135deg, #ff2d55, #6c5ce7)",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
              }}>
                <span>💖</span>
              </div>
            )}
          </div>
          <motion.p
            className="gallery-featured-caption"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {image.caption}
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        style={{ textAlign: "center", padding: "60px 0 40px" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <button
          className="btn-neon"
          onClick={() =>
            document.getElementById("message")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          💌 Read Your Message
        </button>
      </motion.div>
    </>
  );
}
