import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { CONFIG } from "../config";

/* ─── Floating sparkle particles in 3D ─── */
function SparkleField() {
  const count = 200;
  const meshRef = useRef<THREE.Points>(null!);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    meshRef.current.rotation.z = state.pointer.x * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          itemSize={3}
          array={positions}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ff2d55"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Floating hearts in 3D ─── */
function FloatingHearts() {
  const count = 30;
  const groupRef = useRef<THREE.Group>(null!);

  const hearts = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      scale: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 0.3 + 0.1,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const heart = hearts[i];
      child.position.y += heart.speed * 0.01;
      child.position.x +=
        Math.sin(state.clock.elapsedTime * 0.5 + heart.offset) * 0.003;
      child.rotation.z = Math.sin(state.clock.elapsedTime + heart.offset) * 0.3;
      if (child.position.y > 12) child.position.y = -12;
    });
    groupRef.current.rotation.y = state.pointer.x * 0.08;
    groupRef.current.rotation.x = state.pointer.y * 0.05;
  });

  return (
    <group ref={groupRef}>
      {hearts.map((heart, i) => (
        <mesh key={i} position={heart.position} scale={heart.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color="#ff2d55"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── 3D Scene ─── */
function HeroScene() {
  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#0a0a0f"]} />
      <ambientLight intensity={0.3} />
      <Suspense fallback={null}>
        <Stars
          radius={80}
          depth={60}
          count={1500}
          factor={4}
          saturation={0.5}
          fade
          speed={0.5}
        />
        <SparkleField />
        <FloatingHearts />
      </Suspense>
    </Canvas>
  );
}

/* ─── Hero Component ─── */
export default function Hero() {
  return (
    <>
      <HeroScene />

      <div className="hero-content">
        {/* Profile Photo */}
        <motion.div
          className="hero-photo-container"
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="hero-photo-ring">
            <img
              src={CONFIG.profilePhoto}
              alt={CONFIG.name}
              className="hero-photo"
            />
          </div>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          Happy Birthday, {CONFIG.name}!
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
        >
          {CONFIG.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <button
            className="btn-neon"
            onClick={() =>
              document
                .getElementById("cake")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            ✨ Begin The Celebration
          </button>
        </motion.div>
      </div>

      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="chevron" />
      </div>
    </>
  );
}
