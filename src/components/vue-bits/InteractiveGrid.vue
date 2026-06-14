<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);

// Mouse state
const mouse = {
  x: -1000,
  y: -1000,
  targetX: -1000,
  targetY: -1000,
  isActive: false,
  activeWeight: 0, // for smooth fade-in/fade-out of mouse influence
};

let animationFrameId = 0;
let points: { baseX: number; baseY: number; phase: number }[] = [];
let width = 0;
let height = 0;
const SPACING = 42; // Grid cell size
const POINT_RADIUS = 1.25; // Default dot radius
const MAX_INFLUENCE_RADIUS = 180; // Distance of mouse attraction
const ATTRACT_FORCE = 0.4; // Magnetic pull factor
const BREATHING_SPEED = 0.0018; // Speed of idle wave animation
const BREATHING_AMPLITUDE = 3.5; // Pixels of offset

// Base & target colors
// Faint color: light grey/white at low opacity
const faintColor = { r: 255, g: 255, b: 255, a: 0.08 };
// Accent color: NekoTech Vermilion (#e84430)
const accentColor = { r: 232, g: 68, b: 48, a: 0.9 };

const initGrid = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
  width = rect.width;
  height = rect.height;

  // Adapt for high DPI screens
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
  }

  points = [];
  
  // Align columns and rows cleanly
  const cols = Math.ceil(width / SPACING) + 1;
  const rows = Math.ceil(height / SPACING) + 1;
  
  const startX = (width - (cols - 1) * SPACING) / 2;
  const startY = (height - (rows - 1) * SPACING) / 2;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      points.push({
        baseX: startX + c * SPACING,
        baseY: startY + r * SPACING,
        phase: Math.random() * Math.PI * 2, // randomized starting offset for organic wave feel
      });
    }
  }
};

const handleMouseMove = (e: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  mouse.targetX = e.clientX - rect.left;
  mouse.targetY = e.clientY - rect.top;
  mouse.isActive = true;
};

const handleMouseLeave = () => {
  mouse.isActive = false;
};

const draw = (timestamp: number) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  // Smoothly lerp mouse coordinates
  if (mouse.isActive) {
    if (mouse.x < -500) {
      // Snap on first entry to avoid warping from offscreen
      mouse.x = mouse.targetX;
      mouse.y = mouse.targetY;
    }
    mouse.x += (mouse.targetX - mouse.x) * 0.12;
    mouse.y += (mouse.targetY - mouse.y) * 0.12;
    mouse.activeWeight += (1 - mouse.activeWeight) * 0.08;
  } else {
    mouse.activeWeight += (0 - mouse.activeWeight) * 0.08;
    // Keep target far off when inactive
    mouse.targetX = -1000;
    mouse.targetY = -1000;
    mouse.x += (mouse.targetX - mouse.x) * 0.12;
    mouse.y += (mouse.targetY - mouse.y) * 0.12;
  }

  const len = points.length;
  for (let i = 0; i < len; i++) {
    const p = points[i];

    // 1. Idle breathing wave
    const waveX = Math.sin(timestamp * BREATHING_SPEED + p.phase) * BREATHING_AMPLITUDE;
    const waveY = Math.cos(timestamp * BREATHING_SPEED + p.phase) * BREATHING_AMPLITUDE;
    
    let currentX = p.baseX + waveX;
    let currentY = p.baseY + waveY;

    // 2. Mouse attraction force
    const dx = mouse.x - currentX;
    const dy = mouse.y - currentY;
    const dist = Math.hypot(dx, dy);
    
    let force = 0;
    let dispX = 0;
    let dispY = 0;

    if (dist < MAX_INFLUENCE_RADIUS) {
      // Smooth sigmoid curve for proximity force
      const proximity = (MAX_INFLUENCE_RADIUS - dist) / MAX_INFLUENCE_RADIUS;
      force = proximity * mouse.activeWeight;
      
      // Pull dots towards the cursor
      dispX = dx * force * ATTRACT_FORCE;
      dispY = dy * force * ATTRACT_FORCE;
      
      currentX += dispX;
      currentY += dispY;
    }

    // 3. Size and color interpolation
    const radius = POINT_RADIUS + force * 1.5;
    
    const r = Math.round(faintColor.r + (accentColor.r - faintColor.r) * force);
    const g = Math.round(faintColor.g + (accentColor.g - faintColor.g) * force);
    const b = Math.round(faintColor.b + (accentColor.b - faintColor.b) * force);
    const a = faintColor.a + (accentColor.a - faintColor.a) * force;

    // Render dot
    ctx.beginPath();
    ctx.arc(currentX, currentY, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.fill();
  }

  animationFrameId = requestAnimationFrame(draw);
};

const handleResize = () => {
  initGrid();
};

onMounted(() => {
  initGrid();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Draw static grid once and skip loops
    const canvas = canvasRef.value;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(${faintColor.r}, ${faintColor.g}, ${faintColor.b}, ${faintColor.a})`;
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.baseX, p.baseY, POINT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    return;
  }

  // Bind event listeners
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });

  animationFrameId = requestAnimationFrame(draw);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="interactive-grid-container">
    <canvas ref="canvasRef" class="interactive-grid-canvas" />
  </div>
</template>

<style scoped>
.interactive-grid-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 0; /* behind all text and graphics, but in the parent layer */
}

.interactive-grid-canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
