"use client";

import { useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

export type FeatureKind = "priority" | "progress" | "reorder";

// Turns its children slowly, and faster while the card is hovered.
function Spin({ reducedMotion, active, children }: { reducedMotion: boolean; active: boolean; children: ReactNode }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current && !reducedMotion) group.current.rotation.y += delta * (active ? 1.6 : 0.4);
  });
  return <group ref={group} rotation={[0.2, 0.4, 0]}>{children}</group>;
}

// Priorities: three bars, low to high.
const BARS = [
  { x: -0.55, height: 0.6, color: "#9fbfa6" },
  { x: 0, height: 1.0, color: "#d7bd86" },
  { x: 0.55, height: 1.4, color: "#c9785f" },
];

function PriorityBars() {
  return (
    <>
      {BARS.map((bar) => (
        <mesh key={bar.x} position={[bar.x, bar.height / 2 - 0.7, 0]}>
          <boxGeometry args={[0.4, bar.height, 0.4]} />
          <meshStandardMaterial color={bar.color} roughness={0.6} />
        </mesh>
      ))}
    </>
  );
}

// Progress: a pale ring with a thicker arc covering 70% of it.
function ProgressRing() {
  return (
    <>
      <mesh>
        <torusGeometry args={[0.7, 0.09, 16, 64]} />
        <meshStandardMaterial color="#dce7dc" roughness={0.8} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.7, 0.12, 16, 64, Math.PI * 1.4]} />
        <meshStandardMaterial color="#527c5e" roughness={0.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#d7bd86" metalness={0.65} roughness={0.3} />
      </mesh>
    </>
  );
}

// Reordering: three task cards; the top two keep swapping places.
function ReorderCards({ reducedMotion }: { reducedMotion: boolean }) {
  const top = useRef<Mesh>(null);
  const middle = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (reducedMotion || !top.current || !middle.current) return;
    const swap = (Math.sin(clock.elapsedTime * 1.2) + 1) / 2; // goes 0 → 1 → 0
    top.current.position.y = 0.5 - swap * 0.5;
    middle.current.position.y = swap * 0.5;
    // The moving card lifts toward the viewer so the two do not pass through each other.
    top.current.position.z = Math.sin(swap * Math.PI) * 0.3;
  });
  return (
    <>
      <mesh ref={top} position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.36, 0.08]} />
        <meshStandardMaterial color="#789b82" roughness={0.65} />
      </mesh>
      <mesh ref={middle} position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.36, 0.08]} />
        <meshStandardMaterial color="#f5f0df" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.5, 0.36, 0.08]} />
        <meshStandardMaterial color="#f5f0df" roughness={0.9} />
      </mesh>
    </>
  );
}

export default function FeatureObject({ kind, reducedMotion, active }: { kind: FeatureKind; reducedMotion: boolean; active: boolean }) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 4], fov: 40 }}
      dpr={[1, 1.5]}
      frameloop={reducedMotion ? "demand" : "always"}
      fallback={null}
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 4, 5]} intensity={2.5} />
      <directionalLight position={[-3, -1, -2]} color="#c9dec9" intensity={1.5} />
      <Spin reducedMotion={reducedMotion} active={active}>
        {kind === "priority" && <PriorityBars />}
        {kind === "progress" && <ProgressRing />}
        {kind === "reorder" && <ReorderCards reducedMotion={reducedMotion} />}
      </Spin>
    </Canvas>
  );
}
