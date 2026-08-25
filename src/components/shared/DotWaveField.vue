<script setup lang="ts">
/**
 * DotWaveField — a contained dot lattice with a wave running through it.
 *
 * Built for `Trajectory`, which had no background layer at all and read as
 * copy floating on the page canvas. A dot grid is the right metaphor there:
 * a timeline is a measured sequence, and the lattice is literally graph paper
 * with time moving across it.
 *
 * Why canvas-2D rather than a third WebGL context: the page already runs
 * three.js in the hero and again in `Contact`. A few hundred dots is a
 * trivial 2D fill, and 2D avoids the context-count problem entirely.
 *
 * Cost control, in order of how much they save:
 *   · the loop only ticks while the section is on screen and the tab is
 *     foregrounded (`useSceneActive`),
 *   · dots are drawn as squares via `fillRect`, not arcs — no path per dot,
 *   · under `prefers-reduced-motion` exactly one frame is drawn: the lattice
 *     is still there, it just holds still.
 *
 * The wave is two summed sine terms travelling on different periods, so the
 * pattern does not visibly repeat on the ~10s scale a reader spends here.
 * `intensity` scales brightness only, never the geometry.
 */
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { prefersReducedMotion, useSceneActive, cappedDPR } from '@/composables/useCanvasScene';

const props = withDefaults(
  defineProps<{
    /** Lattice pitch in CSS pixels. */
    gap?: number;
    /** Dot edge in CSS pixels. */
    dot?: number;
    /** Peak dot opacity at a wave crest. */
    intensity?: number;
  }>(),
  { gap: 26, dot: 1.5, intensity: 0.5 }
);

const host = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const reduced = prefersReducedMotion();
const { active } = useSceneActive(host, '200px');

let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let observer: ResizeObserver | null = null;
/** CSS-pixel size of the host, cached so draw() never reads layout. */
let w = 0;
let h = 0;
/** Wall-clock origin of the current run. */
let t0 = 0;
/** Animated milliseconds banked from previous runs, so pausing off-screen
    resumes the wave where it stopped instead of jumping forward. */
let banked = 0;

function resize() {
  const el = host.value;
  const cv = canvas.value;
  if (!el || !cv) return;

  const rect = el.getBoundingClientRect();
  w = rect.width;
  h = rect.height;
  if (w === 0 || h === 0) return;

  const dpr = cappedDPR(2);
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  cv.style.width = `${w}px`;
  cv.style.height = `${h}px`;

  ctx = cv.getContext('2d');
  // One transform, set here rather than per-frame, so draw() works in CSS px.
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

  draw(reduced ? 0 : elapsed());
}

/** Animated time in ms, excluding every interval the loop was parked. */
function elapsed(): number {
  return raf ? banked + (performance.now() - t0) : banked;
}

function draw(elapsed: number) {
  if (!ctx || w === 0 || h === 0) return;

  ctx.clearRect(0, 0, w, h);

  const time = elapsed / 1000;
  const { gap, dot, intensity } = props;
  const half = dot / 2;

  /* Falls off towards the right edge so the field never competes with the
     milestone copy, which is right of the spine. */
  const fade = 1 / Math.max(w, 1);

  for (let y = gap; y < h; y += gap) {
    for (let x = gap; x < w; x += gap) {
      const wave =
        Math.sin(x * 0.014 + y * 0.021 - time * 0.55) * 0.5 +
        Math.sin(x * 0.006 - y * 0.010 + time * 0.31) * 0.5;

      // wave ∈ [-1, 1] → crest-weighted, so most dots sit near-invisible and
      // only the crests read. A linear map would make the whole field grey.
      const lit = Math.max(0, wave) ** 1.8;
      const alpha = lit * intensity * (1 - x * fade * 0.55);
      if (alpha < 0.012) continue;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.fillRect(x - half, y - half, dot, dot);
    }
  }
}

function tick() {
  draw(banked + (performance.now() - t0));
  raf = requestAnimationFrame(tick);
}

function start() {
  if (raf) return;
  t0 = performance.now();
  raf = requestAnimationFrame(tick);
}

function stop() {
  if (!raf) return;
  banked += performance.now() - t0;
  cancelAnimationFrame(raf);
  raf = 0;
}

watch(active, on => {
  if (reduced) return;
  on ? start() : stop();
});

onMounted(() => {
  resize();
  if (host.value && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(resize);
    observer.observe(host.value);
  }
});

onBeforeUnmount(() => {
  stop();
  observer?.disconnect();
});
</script>

<template>
  <div ref="host" class="dwf" aria-hidden="true">
    <canvas ref="canvas" class="dwf__canvas"></canvas>
    <!-- Masks the lattice into the section instead of letting it end on a hard
         line at the section boundary. -->
    <span class="dwf__veil"></span>
  </div>
</template>

<style scoped>
.dwf {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  /* The canvas is the section's own layer — keep its paint out of the page. */
  contain: strict;
}

.dwf__canvas {
  display: block;
  width: 100%;
  height: 100%;
  /* The lattice is scenery; it never competes with the copy over it. */
  opacity: 0.55;
  mask-image: radial-gradient(
    115% 85% at 12% 30%,
    oklch(0 0 0) 0%,
    oklch(0 0 0 / 0.55) 52%,
    transparent 88%
  );
}

/* A faint pool of light behind the top of the spine, so the wave appears to be
   lit from where the timeline starts. */
.dwf__veil {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    38rem circle at 6% 8%,
    oklch(0.30 0.02 250 / 0.20),
    transparent 70%
  );
}

@media (max-width: 720px) {
  /* On a phone the copy fills the column; the field would only add noise. */
  .dwf__canvas { opacity: 0.3; }
  .dwf__veil { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  /* Single frame is drawn by the script — nothing to disable here, but the
     lattice is dimmed further since a static grid reads stronger than a
     moving one. */
  .dwf__canvas { opacity: 0.32; }
}
</style>
