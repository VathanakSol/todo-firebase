"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { CanvasTexture, Group } from "three";
import { useLanguage } from "@/lib/i18n";

// When open, the book slides right by half its width so the open spread is
// centred on the point it rotates around.
const OPEN_SHIFT = 0.75;
// Camera distances at which the closed book and the open spread fit inside the
// frame at any rotation (their bounding sphere fits the 40° field of view).
const CAMERA_CLOSED = 4;
const CAMERA_OPEN = 5.9;

// The writable page is drawn on a 2D canvas and used as a texture.
const PAGE_WIDTH = 520;
const PAGE_HEIGHT = 680;
const PAGE_LEFT = 70;
const PAGE_TEXT_WIDTH = 420;
const PAGE_FIRST_LINE = 110;
const PAGE_LINE_GAP = 76;
const PAGE_LINES = 8;
const NOTE_MAX_LENGTH = 140;
// Where the page sits inside the book, used to place the pen on the canvas-drawn text.
const PAGE_PLANE = { x: 0.04, z: 0.122, width: 1.38, height: 1.78 };
// How long the pen keeps scribbling after each keystroke.
const STROKE_MS = 420;
// The pen rests beside the book, lying flat and almost upright (position of its tip, then its lean).
const PEN_REST = { x: 1.0, y: -0.7, z: 0.02, lean: 0, turn: -0.1 };
// While writing it is held like a pen: leaning toward the viewer, down and to the right.
const PEN_WRITING = { lean: 2.3, turn: 0.9 };
const PEN_SCALE = 1.5;

// Move a value toward its target a little each frame (or jump when motion is reduced).
function ease(current: number, target: number, delta: number, rate: number, instant: boolean) {
  const difference = target - current;
  return instant || Math.abs(difference) < 0.001 ? target : current + difference * (1 - Math.exp(-rate * delta));
}

// Break the note into lines that fit the page width.
function wrapText(context: CanvasRenderingContext2D, text: string) {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(" ")) {
      let next = line ? `${line} ${word}` : word;
      if (line && context.measureText(next).width > PAGE_TEXT_WIDTH) {
        lines.push(line);
        next = word;
      }
      // A single word longer than the line is split letter by letter.
      while (context.measureText(next).width > PAGE_TEXT_WIDTH && next.length > 1) {
        let cut = next.length - 1;
        while (cut > 1 && context.measureText(next.slice(0, cut)).width > PAGE_TEXT_WIDTH) cut -= 1;
        lines.push(next.slice(0, cut));
        next = next.slice(cut);
      }
      line = next;
    }
    lines.push(line);
  }
  return lines;
}

// Draws the page and returns where the text ends (in canvas pixels), which is where the pen writes.
const FIRST_CARET = { x: PAGE_LEFT, y: PAGE_FIRST_LINE - 14 };

function drawPage(canvas: HTMLCanvasElement, text: string, writing: boolean, placeholder: string) {
  const context = canvas.getContext("2d");
  if (!context) return FIRST_CARET;
  context.fillStyle = "#f5f0df";
  context.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  context.fillStyle = "#c7d2c1";
  for (let index = 0; index < PAGE_LINES; index += 1) {
    context.fillRect(PAGE_LEFT, PAGE_FIRST_LINE + index * PAGE_LINE_GAP, PAGE_TEXT_WIDTH, 3);
  }
  context.font = `44px ${getComputedStyle(document.body).fontFamily}`;
  if (!text && !writing) {
    context.fillStyle = "#a9b3a6";
    context.fillText(placeholder, PAGE_LEFT, PAGE_FIRST_LINE - 14);
    return FIRST_CARET;
  }
  const lines = wrapText(context, text).slice(0, PAGE_LINES);
  context.fillStyle = "#34493a";
  lines.forEach((line, index) => context.fillText(line, PAGE_LEFT, PAGE_FIRST_LINE - 14 + index * PAGE_LINE_GAP));
  const last = lines.length - 1;
  const caretX = PAGE_LEFT + context.measureText(lines[last]).width + 4;
  if (writing) {
    context.fillStyle = "#527c5e";
    context.fillRect(caretX, PAGE_FIRST_LINE - 58 + last * PAGE_LINE_GAP, 3, 50);
  }
  return { x: caretX, y: PAGE_FIRST_LINE - 14 + last * PAGE_LINE_GAP };
}

function Notebook({ reducedMotion, rotation, interacted, open, note, writing, placeholder }: { reducedMotion: boolean; rotation: [number, number]; interacted: boolean; open: boolean; note: string; writing: boolean; placeholder: string }) {
  const sculpture = useRef<Group>(null);
  const body = useRef<Group>(null);
  const cover = useRef<Group>(null);
  const pageTexture = useRef<CanvasTexture>(null);
  const pen = useRef<Group>(null);
  const penTurn = useRef<Group>(null);
  const penLean = useRef<Group>(null);
  const caret = useRef(FIRST_CARET);
  const strokeUntil = useRef(0);
  const invalidate = useThree((state) => state.invalidate);
  const [pageCanvas] = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = PAGE_WIDTH;
    canvas.height = PAGE_HEIGHT;
    return canvas;
  });

  useEffect(() => {
    invalidate();
  }, [invalidate, rotation, open, reducedMotion]);

  // Redraw the page whenever the note changes, then ask three.js to re-upload it.
  useEffect(() => {
    caret.current = drawPage(pageCanvas, note, writing, placeholder);
    if (pageTexture.current) pageTexture.current.needsUpdate = true;
    invalidate();
  }, [pageCanvas, note, writing, placeholder, invalidate]);

  // Each keystroke makes the pen scribble for a moment.
  useEffect(() => {
    strokeUntil.current = performance.now() + STROKE_MS;
    invalidate();
  }, [note, invalidate]);

  useFrame(({ clock, camera }, delta) => {
    if (sculpture.current && !reducedMotion && !interacted) {
      sculpture.current.rotation.y = 0.35 + Math.sin(clock.elapsedTime * 0.5) * 0.12;
    }
    let moving = false;
    // Pull the camera back for the wider open spread. It moves faster than the
    // cover so the frame has already grown by the time the cover swings out.
    const cameraTarget = open ? CAMERA_OPEN : CAMERA_CLOSED;
    camera.position.z = ease(camera.position.z, cameraTarget, delta, open ? 14 : 5, reducedMotion);
    if (camera.position.z !== cameraTarget) moving = true;
    if (body.current) {
      const target = open ? OPEN_SHIFT : 0;
      body.current.position.x = ease(body.current.position.x, target, delta, 7, reducedMotion);
      if (body.current.position.x !== target) moving = true;
    }
    if (cover.current) {
      const target = open ? -Math.PI * 0.88 : 0;
      cover.current.rotation.y = ease(cover.current.rotation.y, target, delta, 7, reducedMotion);
      if (cover.current.rotation.y !== target) moving = true;
    }
    if (pen.current && penTurn.current && penLean.current) {
      // The pen rests beside the book, and moves to the end of the text while the user is typing.
      const active = open && writing;
      const stroking = active && !reducedMotion && performance.now() < strokeUntil.current;
      const time = clock.elapsedTime;
      // While scribbling the tip touches the page and jitters like handwriting; otherwise it hovers just above.
      const targetX = active ? PAGE_PLANE.x + (caret.current.x / PAGE_WIDTH - 0.5) * PAGE_PLANE.width + (stroking ? Math.sin(time * 34) * 0.014 : 0) : PEN_REST.x;
      const targetY = active ? (0.5 - caret.current.y / PAGE_HEIGHT) * PAGE_PLANE.height + (stroking ? 0.012 + Math.cos(time * 27) * 0.016 : 0) : PEN_REST.y;
      const targetZ = active ? PAGE_PLANE.z + (stroking ? 0.004 : 0.05) : PEN_REST.z;
      const targetLean = active ? PEN_WRITING.lean : PEN_REST.lean;
      const targetTurn = active ? PEN_WRITING.turn : PEN_REST.turn;
      const position = pen.current.position;
      // Following the text is quick; picking the pen up and putting it down is slower.
      const rate = active && penLean.current.rotation.x === targetLean ? 16 : 7;
      position.x = ease(position.x, targetX, delta, rate, reducedMotion);
      position.y = ease(position.y, targetY, delta, rate, reducedMotion);
      position.z = ease(position.z, targetZ, delta, rate, reducedMotion);
      penLean.current.rotation.x = ease(penLean.current.rotation.x, targetLean, delta, 7, reducedMotion);
      penTurn.current.rotation.z = ease(penTurn.current.rotation.z, targetTurn, delta, 7, reducedMotion);
      pen.current.rotation.z = ease(pen.current.rotation.z, stroking ? Math.sin(time * 34) * 0.06 : 0, delta, 20, reducedMotion);
      if (stroking || position.x !== targetX || position.y !== targetY || position.z !== targetZ || penLean.current.rotation.x !== targetLean || penTurn.current.rotation.z !== targetTurn || pen.current.rotation.z !== 0) moving = true;
    }
    if (moving) invalidate();
  });

  return (
    <group ref={sculpture} rotation={[rotation[0], rotation[1], -0.12]}>
      <group ref={body}>
        {/* The back cover and the cream page block sit behind the front cover. */}
        <mesh position={[0, 0, -0.16]}>
          <boxGeometry args={[1.5, 1.9, 0.08]} />
          <meshStandardMaterial color="#527762" roughness={0.8} />
        </mesh>
        <mesh position={[0.04, 0, 0]}>
          <boxGeometry args={[1.38, 1.78, 0.24]} />
          <meshStandardMaterial color="#f5f0df" roughness={0.95} />
        </mesh>
        {/* The top page: ruled lines and the user's note, drawn on a canvas. */}
        <mesh position={[0.04, 0, 0.122]}>
          <planeGeometry args={[1.38, 1.78]} />
          <meshStandardMaterial roughness={0.95}>
            <canvasTexture ref={pageTexture} attach="map" args={[pageCanvas]} colorSpace="srgb" anisotropy={8} />
          </meshStandardMaterial>
        </mesh>
        {/* The pen. Its origin is the tip, so positioning it places the tip; the two inner
            groups turn and lean the barrel, and are animated between resting and writing. */}
        <group ref={pen} position={[PEN_REST.x, PEN_REST.y, PEN_REST.z]}>
          <group ref={penTurn} rotation={[0, 0, PEN_REST.turn]}>
            <group ref={penLean} rotation={[PEN_REST.lean, 0, 0]} scale={PEN_SCALE}>
              <mesh position={[0, 0.025, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.012, 0.05, 16]} />
                <meshStandardMaterial color="#253029" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.095, 0]} rotation={[Math.PI, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.012, 0.09, 20]} />
                <meshStandardMaterial color="#d7bd86" metalness={0.65} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.47, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.66, 20]} />
                <meshStandardMaterial color="#345f4c" roughness={0.45} />
              </mesh>
              <mesh position={[0, 0.82, 0]}>
                <cylinderGeometry args={[0.032, 0.032, 0.04, 20]} />
                <meshStandardMaterial color="#d7bd86" metalness={0.65} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.88, 0]}>
                <cylinderGeometry args={[0.022, 0.03, 0.08, 20]} />
                <meshStandardMaterial color="#345f4c" roughness={0.45} />
              </mesh>
            </group>
          </group>
        </group>
        {/* The cover pivots around the left edge like a real notebook. */}
        <group ref={cover} position={[-0.75, 0, 0.16]}>
          <mesh position={[0.75, 0, 0]}>
            <boxGeometry args={[1.5, 1.9, 0.08]} />
            <meshStandardMaterial color="#789b82" roughness={0.65} />
          </mesh>
          <mesh position={[0.79, 0, -0.045]}>
            <boxGeometry args={[1.34, 1.74, 0.01]} />
            <meshStandardMaterial color="#e9e3cf" roughness={0.95} />
          </mesh>
          <mesh position={[0.87, 0.24, 0.045]}>
            <boxGeometry args={[0.7, 0.025, 0.01]} />
            <meshStandardMaterial color="#d9c8a3" />
          </mesh>
          <mesh position={[0.87, 0.12, 0.045]}>
            <boxGeometry args={[0.46, 0.015, 0.01]} />
            <meshStandardMaterial color="#d9c8a3" />
          </mesh>
        </group>
        {/* Gold binding. */}
        {[-0.65, -0.33, 0, 0.33, 0.65].map((y) => (
          <mesh key={y} position={[-0.66, y, 0.19]}>
            <torusGeometry args={[0.085, 0.018, 10, 32]} />
            <meshStandardMaterial color="#d7bd86" metalness={0.65} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// The frame is wider than it is tall so the open spread has room on both sides.
const frameSizes = {
  md: "h-56 w-64 sm:h-64 sm:w-80",
  lg: "h-64 w-72 sm:h-[420px] sm:w-[480px]",
};

export default function TaskOrb({ reducedMotion, size = "md" }: { reducedMotion: boolean; size?: keyof typeof frameSizes }) {
  const [rotation, setRotation] = useState<[number, number]>([0.12, 0.35]);
  const [interacted, setInteracted] = useState(false);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [writing, setWriting] = useState(false);
  const pointer = useRef<{ id: number; x: number; y: number; moved: number } | null>(null);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const { t } = useLanguage();

  function rotate(dx: number, dy: number) {
    setInteracted(true);
    setRotation(([x, y]) => [Math.max(-1.2, Math.min(1.2, x + dy)), y + dx]);
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
    <div
      role="group"
      tabIndex={0}
      aria-label={t.orb.label}
      className={`${frameSizes[size]} shrink-0 touch-none cursor-grab rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#739c7c] active:cursor-grabbing`}
      onPointerDown={(event) => {
        if (event.button !== 0 || pointer.current) return;
        pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: 0 };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const previous = pointer.current;
        if (!previous || previous.id !== event.pointerId) return;
        const dx = event.clientX - previous.x;
        const dy = event.clientY - previous.y;
        rotate(dx * 0.01, dy * 0.01);
        pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: previous.moved + Math.abs(dx) + Math.abs(dy) };
      }}
      onPointerUp={(event) => {
        const current = pointer.current;
        if (current?.id !== event.pointerId) return;
        pointer.current = null;
        // A click without dragging on the open book starts writing.
        if (open && current.moved < 6) noteInput.current?.focus();
      }}
      onPointerCancel={() => { pointer.current = null; }}
      onLostPointerCapture={() => { pointer.current = null; }}
      onKeyDown={(event) => {
        const directions: Record<string, [number, number]> = {
          ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0],
          ArrowUp: [0, -0.15], ArrowDown: [0, 0.15],
        };
        const direction = directions[event.key];
        if (direction) {
          event.preventDefault();
          rotate(...direction);
        }
      }}
    >
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0, CAMERA_CLOSED], fov: 40 }}
        dpr={[1, 1.5]}
        frameloop={reducedMotion || interacted ? "demand" : "always"}
        fallback={null}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[3, 4, 5]} intensity={2.5} />
        <directionalLight position={[-3, -1, -2]} color="#c9dec9" intensity={1.5} />
        <Notebook reducedMotion={reducedMotion} rotation={rotation} interacted={interacted} open={open} note={note} writing={writing} placeholder={t.orb.placeholder} />
      </Canvas>
    </div>
    {/* The real text field behind the 3D page: it receives the typing, and
        screen readers and keyboards use it directly. */}
    {open && <textarea
      ref={noteInput}
      className="sr-only"
      aria-label={t.orb.pageLabel}
      value={note}
      maxLength={NOTE_MAX_LENGTH}
      onChange={(event) => setNote(event.target.value)}
      onFocus={() => setWriting(true)}
      onBlur={() => setWriting(false)}
    />}
    <button
      type="button"
      onClick={() => setOpen((current) => !current)}
      className="rounded-full border border-[#dce7dc] bg-[#fbfcf8] px-3 py-1 text-xs font-medium text-[#426b50] transition-colors hover:bg-[#e9f1e7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#739c7c]"
    >
      {open ? t.orb.close : t.orb.open}
    </button>
    <p className="h-4 text-[11px] text-[#8a998d]" aria-hidden="true">{open ? (writing ? t.orb.typing : t.orb.clickToType) : ""}</p>
    </div>
  );
}
