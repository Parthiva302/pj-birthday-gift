import React, { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/* ─── Candle Flame ─── */
function Flame({
  position,
  lit,
}: {
  position: [number, number, number];
  lit: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    if (!meshRef.current || !lit) return;
    const flicker = Math.sin(state.clock.elapsedTime * 8 + position[0] * 5) * 0.04;
    meshRef.current.scale.y = 1 + flicker;
    meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.03;
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + flicker * 5;
    }
  });

  if (!lit) return null;

  return (
    <group position={position}>
      {/* Flame glow */}
      <mesh ref={meshRef} position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffaa33" transparent opacity={0.9} />
      </mesh>
      {/* Inner bright core */}
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
      {/* Point light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.2, 0]}
        color="#ff8800"
        intensity={0.8}
        distance={3}
        decay={2}
      />
    </group>
  );
}

/* ─── Single Candle ─── */
function Candle({
  position,
  lit,
}: {
  position: [number, number, number];
  lit: boolean;
}) {
  return (
    <group position={position}>
      {/* Candle body */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
        <meshStandardMaterial color="#ffeedd" roughness={0.3} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Flame */}
      <Flame position={[0, 0.33, 0]} lit={lit} />
    </group>
  );
}

/* ─── 3D Cake Model ─── */
function CakeModel({
  candlesLit,
  onClick,
}: {
  candlesLit: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  // Candle positions on top of cake
  const candlePositions: [number, number, number][] = useMemo(
    () => [
      [0, 2.15, 0],
      [0.35, 2.15, 0.15],
      [-0.35, 2.15, -0.1],
      [0.15, 2.15, -0.35],
      [-0.2, 2.15, 0.3],
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.003;
    // Mouse tilt
    groupRef.current.rotation.x = state.pointer.y * 0.08;
    groupRef.current.rotation.z = state.pointer.x * -0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} onClick={onClick} position={[0, -0.5, 0]}>
        {/* === Cake plate === */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[2.2, 2.3, 0.1, 32]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* === Bottom tier === */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 0.9, 32]} />
          <meshStandardMaterial color="#f8a4c0" roughness={0.4} />
        </mesh>
        {/* Bottom tier frosting ring */}
        <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.08, 8, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>

        {/* === Middle tier === */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 0.7, 32]} />
          <meshStandardMaterial color="#ffc0d0" roughness={0.4} />
        </mesh>
        {/* Middle tier frosting */}
        <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.3, 0.07, 8, 32]} />
          <meshStandardMaterial color="#fff5f5" roughness={0.3} />
        </mesh>

        {/* === Top tier === */}
        <mesh position={[0, 1.9, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.5, 32]} />
          <meshStandardMaterial color="#ffe0ea" roughness={0.35} />
        </mesh>
        {/* Top tier frosting */}
        <mesh position={[0, 2.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.85, 0.06, 8, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>

        {/* === Decorative dots on bottom tier === */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={`dot-${i}`}
              position={[
                Math.cos(angle) * 1.82,
                0.45,
                Math.sin(angle) * 1.82,
              ]}
            >
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#ff2d55" : "#d4af37"}
                emissive={i % 2 === 0 ? "#ff2d55" : "#d4af37"}
                emissiveIntensity={0.3}
              />
            </mesh>
          );
        })}

        {/* === Decorative dots on middle tier === */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={`mid-dot-${i}`}
              position={[
                Math.cos(angle) * 1.32,
                1.25,
                Math.sin(angle) * 1.32,
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color="#d4af37"
                emissive="#d4af37"
                emissiveIntensity={0.4}
                metalness={0.6}
              />
            </mesh>
          );
        })}

        {/* === Candles === */}
        {candlePositions.map((pos, i) => (
          <Candle key={i} position={pos} lit={candlesLit} />
        ))}
      </group>
    </Float>
  );
}

/* ─── Cake Section Component ─── */
export default function Cake3D({ onBlowOut }: { onBlowOut: () => void }) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [blown, setBlown] = useState(false);

  const handleBlowOut = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setBlown(true);
    onBlowOut();
  };

  return (
    <>
      <motion.div
        className="cake-canvas-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Canvas
          camera={{ position: [0, 2, 6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
          shadows
        >
          <color attach="background" args={["#0a0a0f"]} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 8, 5]} intensity={0.5} color="#ffeedd" />
          <spotLight
            position={[0, 6, 0]}
            angle={0.4}
            penumbra={0.8}
            intensity={candlesLit ? 1.5 : 0.3}
            color={candlesLit ? "#ff8844" : "#334"}
          />
          <Suspense fallback={null}>
            <CakeModel candlesLit={candlesLit} onClick={handleBlowOut} />
          </Suspense>
        </Canvas>
      </motion.div>

      <AnimatePresence mode="wait">
        {!blown ? (
          <motion.p
            key="instruction"
            className="cake-instruction"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            🎂 Click the cake to blow out the candles!
          </motion.p>
        ) : (
          <motion.div
            key="blown"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <p className="cake-blown-text">🎉 Make a Wish! 🎉</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
