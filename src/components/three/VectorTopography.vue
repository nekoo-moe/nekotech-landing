<script setup lang="ts">
/**
 * VectorTopography — the page's 3D background.
 *
 * Ported from the contour field in `heiznerd.is-a.dev`
 * (`AnimatedVectorTopography.vue`), recoloured for this palette and given a
 * pointer reaction, a scroll drift and a frame budget.
 *
 * ── Why this replaced the hero terrain ─────────────────────────────────────
 * The old hero scene drew ~15k additive hairlines from a real vertex grid:
 * every vertex ran an fBm, every line overdrew the ones behind it, and the
 * geometry cost scaled with the grid. This draws *two triangles*. All the
 * work is per pixel in one fragment pass, which means:
 *
 *   · no geometry, no indices, no attribute upload, no transform hierarchy;
 *   · no additive overdraw — each pixel is shaded exactly once;
 *   · cost scales only with resolution, so capping DPR caps the whole scene.
 *
 * The relief is domain-warped fBm sliced into contour lines, so it still
 * reads as a landscape without ever being one.
 *
 * ── Budget ─────────────────────────────────────────────────────────────────
 *   · DPR capped at 1.4 (1.1 on phones). Fill scales with DPR², so this is
 *     the single biggest lever.
 *   · Frame-capped to 30fps (24 on phones). The field drifts at 0.035× time;
 *     nobody can see the difference, and it halves GPU work against a 60Hz
 *     panel and quarters it against 120Hz.
 *   · fBm octaves compiled in per tier (4 desktop / 3 phone). The 5th octave
 *     of the original contributes 0.03 amplitude to a contour test — invisible.
 *   · `low-power` GPU hint, no MSAA, no depth or stencil buffer.
 *   · Parked entirely while the tab is backgrounded.
 *   · A governor drops to 0.75× resolution once if measured frame cost stays
 *     bad. It never steps back up: oscillating is more visible than sitting low.
 *
 * Nothing in the frame loop reads layout. The viewport box and the document
 * height are cached on resize, and scroll is read from `scrollY` alone —
 * Lenis fires `scroll` every frame, so a `getBoundingClientRect()` there
 * would be a forced layout per frame for the life of the page.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  Scene, Camera, WebGLRenderer, Mesh, PlaneGeometry, ShaderMaterial,
  Color, Vector2, Vector4,
} from 'three';
import { hasWebGL, prefersReducedMotion, cappedDPR, damp } from '@/composables/useCanvasScene';

const props = withDefaults(defineProps<{ accent?: string }>(), { accent: '#e8543a' });

const host = ref<HTMLDivElement | null>(null);
const supported = hasWebGL();
const reduced = prefersReducedMotion();

/** Concurrent shockwaves. Fixed pool — an idle slot carries strength 0 and
    multiplies out, which is cheaper than branching in the shader. */
const MAX_RINGS = 3;

/* ── Tier ──────────────────────────────────────────────────────────────────
   One decision, from signals available before the first frame. `deviceMemory`
   and `hardwareConcurrency` are absent on Safari, so they can only demote. */
const small = typeof window !== 'undefined' && window.innerWidth < 760;
const nav = (typeof navigator !== 'undefined' ? navigator : {}) as Navigator & { deviceMemory?: number };
const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
const OCTAVES = small || weak ? 3 : 4;
const DPR_CAP = small ? 1.1 : weak ? 1.2 : 1.4;
const FPS = small || weak ? 24 : 30;

/** Only a real cursor gets the vortex — on touch, `pointermove` *is* a scroll. */
const fine = typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const vertexShader = /* glsl */`
  void main() { gl_Position = vec4(position, 1.0); }
`;

const fragmentShader = /* glsl */`
  precision highp float;

  #define OCTAVES ${OCTAVES}
  /* The warp is a low-frequency displacement of the sample position — octaves
     above the second move it by less than a contour width, so they cost fill
     and change nothing. Two thirds of the noise work in this shader used to go
     into the two warp calls. */
  #define WARP_OCTAVES 2
  #define MAX_RINGS ${MAX_RINGS}

  uniform vec2  uResolution;
  uniform float uTime;
  uniform vec2  uPointer;   // aspect-corrected, centre-origin, y up
  uniform float uGrip;      // 0..1 how present the cursor is
  uniform float uScroll;    // 0..1 document progress
  uniform vec3  uAccent;
  uniform vec4  uRings[MAX_RINGS];  // xy origin, z radius, w strength

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 local = fract(p);
    local = local * local * (3.0 - 2.0 * local);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), local.x),
      local.y
    );
  }

  /* Rotated-lattice fBm. The rotation between octaves is what stops the
     lattice of the value noise showing through as a visible grid. */
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.52;
    mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);
    for (int octave = 0; octave < OCTAVES; octave++) {
      value += amplitude * noise(p);
      p = rotation * p * 2.02 + vec2(17.7, 9.2);
      amplitude *= 0.5;
    }
    return value;
  }

  /* Same construction, fixed at two octaves, for the warp only. */
  float fbmWarp(vec2 p) {
    float value = 0.0;
    float amplitude = 0.52;
    mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);
    for (int octave = 0; octave < WARP_OCTAVES; octave++) {
      value += amplitude * noise(p);
      p = rotation * p * 2.02 + vec2(17.7, 9.2);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 point = uv - 0.5;
    point.x *= uResolution.x / uResolution.y;

    /* Vortex. The sample position is rotated around the cursor, so the
       contours curl into it — rotating the *field* rather than the pixel is
       what keeps this from reading as a smeared image. */
    vec2 rel = point - uPointer;
    float grip = uGrip * exp(-dot(rel, rel) * 3.2);
    float angle = grip * 1.35;
    float ca = cos(angle), sa = sin(angle);
    vec2 sampled = uPointer + mat2(ca, -sa, sa, ca) * rel;

    float time = uTime * 0.035;
    /* Scroll drifts the landscape rather than the layer: descending the page
       moves you *through* the terrain instead of sliding a texture past. */
    vec2 domain = sampled * 2.35 + vec2(0.0, uScroll * 1.15);

    vec2 warp = vec2(
      fbmWarp(domain + vec2(time, -time * 0.6)),
      fbmWarp(domain + vec2(5.2 - time * 0.5, 1.3 + time * 0.8))
    );
    /* Two octaves reach ~0.78 of the amplitude four do, so the displacement is
       rescaled to keep the relief the same shape it had. */
    warp *= 1.28;
    float field = fbm(domain + (warp - 0.5) * 2.15 + vec2(time * 0.3, -time * 0.22));

    /* Shockwaves. A travelling Gaussian added to the *elevation*, so the
       contour lines bunch and bow as the ring passes instead of a ring being
       drawn over them. */
    float shock = 0.0;
    for (int i = 0; i < MAX_RINGS; i++) {
      vec4 r = uRings[i];
      float d = length(point - r.xy) - r.z;
      shock += exp(-d * d * 240.0) * r.w;
    }
    field += shock * 0.26;

    /* Contours: minor lines every 1/13 of the range, major every 4th. */
    float levels = 13.0;
    float scaled = field * levels;
    float edge = min(fract(scaled), 1.0 - fract(scaled));
    float minorLine = 1.0 - smoothstep(0.014, 0.035, edge);

    float majorScaled = field * (levels / 4.0);
    float majorEdge = min(fract(majorScaled), 1.0 - fract(majorScaled));
    float majorLine = 1.0 - smoothstep(0.012, 0.030, majorEdge);

    float vignette = smoothstep(0.95, 0.18, length(point * vec2(0.78, 0.9)));
    float breathe = 0.92 + sin(uTime * 0.22) * 0.08;

    /* Monochrome, with accent reserved for interaction — a ring passing and
       the cursor's own pull. Ambient accent would make it decoration. */
    vec3 color = mix(vec3(0.60, 0.61, 0.65), vec3(0.86, 0.87, 0.90), majorLine * 0.72);
    float hot = clamp(abs(shock) * 1.5 + grip * 0.55, 0.0, 1.0);
    color = mix(color, uAccent, hot * 0.85);

    float alpha = (minorLine * 0.115 + majorLine * 0.085) * vignette * breathe;
    alpha += (minorLine + majorLine) * hot * 0.16 * vignette;

    gl_FragColor = vec4(color, min(alpha, 1.0));
  }
`;

let renderer: WebGLRenderer | null = null;
let scene: Scene | null = null;
let camera: Camera | null = null;
let geometry: PlaneGeometry | null = null;
let material: ShaderMaterial | null = null;
let raf = 0;
let contextLost = false;

/* ── Frame budget ─────────────────────────────────────────────────────────
   `nextDue` is a wall-clock gate rather than a frame counter, so the cap is
   honoured identically on 60, 90 and 144Hz panels. The 0.92 slack keeps a
   frame that lands a hair early from being pushed a whole interval late. */
let frameBudget = 1000 / FPS;
let nextDue = 0;
let lastFrame = 0;

/** 0 = full resolution; 1 = 0.75×. Never decreases. */
let degrade = 0;
let costMean = 0;
let costSamples = 0;

/* ── Cached geometry of the page. Read here, never in the loop. ─────────── */
let vw = 1;
let vh = 1;
/** Total scrollable distance, for scroll progress. */
let scrollSpan = 1;

/* ── Interaction state. Targets are set by listeners; the loop damps. ───── */
const pointer = new Vector2(0, 0);
const pointerTarget = new Vector2(0, 0);
let grip = 0;
let gripTarget = 0;
let scrollP = 0;
let scrollTarget = 0;
/** Raw client coords, consumed once per frame — a 1000Hz mouse costs the
    same as a 60Hz one because the listener only writes two numbers. */
let ptrX = 0;
let ptrY = 0;
let ptrDirty = false;

interface Ring { x: number; y: number; radius: number; strength: number }
const rings: Ring[] = Array.from({ length: MAX_RINGS }, () => ({ x: 0, y: 0, radius: 0, strength: 0 }));
const ringUniform: Vector4[] = Array.from({ length: MAX_RINGS }, () => new Vector4(0, 0, 0, 0));
let ringCursor = 0;

function measure() {
  vw = window.innerWidth || 1;
  vh = window.innerHeight || 1;
  scrollSpan = Math.max(1, document.documentElement.scrollHeight - vh);
}

/** Client pixels → the shader's aspect-corrected, centre-origin space. */
function toField(clientX: number, clientY: number, out: Vector2) {
  out.set(((clientX / vw) - 0.5) * (vw / vh), 0.5 - clientY / vh);
}

function spawnRing(clientX: number, clientY: number) {
  if (reduced) return;
  const r = rings[ringCursor];
  ringCursor = (ringCursor + 1) % MAX_RINGS;
  toField(clientX, clientY, pointerTarget);
  r.x = pointerTarget.x;
  r.y = pointerTarget.y;
  r.radius = 0;
  r.strength = 1;
}

function onPointerMove(e: PointerEvent) { ptrX = e.clientX; ptrY = e.clientY; ptrDirty = true; gripTarget = 1; }
/** `pointerleave` does not bubble to window — the documentElement is where
    "the cursor left the page" is observable. */
function onPointerLeave() { gripTarget = 0; ptrDirty = false; }
function onPointerDown(e: PointerEvent) { spawnRing(e.clientX, e.clientY); }
/** Touch uses `click`, not `pointerdown`: a swipe *begins* with a pointerdown,
    so binding that would fire a ring on every scroll gesture. */
function onTap(e: MouseEvent) { spawnRing(e.clientX, e.clientY); }
function onScroll() { scrollTarget = Math.min(1, Math.max(0, window.scrollY / scrollSpan)); }

function resize() {
  if (!host.value || !renderer || !material) return;
  measure();
  const w = Math.max(host.value.clientWidth, 1);
  const h = Math.max(host.value.clientHeight, 1);
  const scale = degrade >= 1 ? 0.75 : 1;

  renderer.setPixelRatio(cappedDPR(DPR_CAP) * scale);
  // `false` — never let three write width/height back onto the style, the
  // stylesheet owns the element's box.
  renderer.setSize(w, h, false);
  const dpr = renderer.getPixelRatio();
  material.uniforms.uResolution.value.set(w * dpr, h * dpr);
  renderer.render(scene!, camera!);
}

/** Rebuilding the drawing buffer is expensive; a drag across a window edge
    would otherwise do it on every intermediate size. */
let resizeTimer = 0;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(resize, 120);
}

function frame(now: number) {
  raf = requestAnimationFrame(frame);
  if (!renderer || !material || !scene || !camera || contextLost) return;
  if (now < nextDue) return;
  nextDue = now + frameBudget * 0.92;

  // Measured *inside* the body: `now` is the rAF timestamp, so timing from it
  // would bill this scene for Lenis and every other loop that ran first.
  const t0 = degrade < 1 ? performance.now() : 0;
  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  if (ptrDirty) { toField(ptrX, ptrY, pointerTarget); ptrDirty = false; }

  const u = material.uniforms;
  pointer.x = damp(pointer.x, pointerTarget.x, 6, dt);
  pointer.y = damp(pointer.y, pointerTarget.y, 6, dt);
  grip = damp(grip, gripTarget, 4, dt);
  scrollP = damp(scrollP, scrollTarget, 5, dt);

  for (let i = 0; i < MAX_RINGS; i++) {
    const r = rings[i];
    if (r.strength > 0.001) {
      r.radius += dt * 0.62;
      // Exponential in dt, so the decay is frame-rate independent.
      r.strength *= Math.pow(0.22, dt);
      if (r.radius > 2.2) r.strength = 0;
    } else {
      r.strength = 0;
    }
    ringUniform[i].set(r.x, r.y, r.radius, r.strength);
  }

  u.uTime.value = now / 1000;
  u.uPointer.value.copy(pointer);
  u.uGrip.value = grip;
  u.uScroll.value = scrollP;

  renderer.render(scene, camera);

  if (degrade < 1) {
    // Slow EMA over a long window — one janky frame during a font swap is not
    // a reason to permanently drop resolution.
    costMean += (performance.now() - t0 - costMean) * 0.05;
    if (++costSamples > 150 && costMean > frameBudget * 0.5) {
      degrade = 1;
      resize();
    }
  }
}

function start() {
  if (raf || reduced || contextLost) return;
  lastFrame = performance.now();
  nextDue = 0;
  measure();
  onScroll();
  raf = requestAnimationFrame(frame);
}

function stop() {
  if (!raf) return;
  cancelAnimationFrame(raf);
  raf = 0;
}

/** Reduced motion keeps the landscape and drops the drift: deleting the layer
    would leave those readers the flat page this exists to fix. */
function drawStill() {
  if (!renderer || !material || !scene || !camera) return;
  material.uniforms.uTime.value = 6;
  material.uniforms.uScroll.value = 0;
  renderer.render(scene, camera);
}

function onVisibility() {
  if (document.hidden) stop();
  else if (reduced) drawStill();
  else start();
}

function onContextLost(e: Event) {
  e.preventDefault();
  contextLost = true;
  stop();
  host.value?.classList.add('is-fallback');
}

function onContextRestored() {
  contextLost = false;
  host.value?.classList.remove('is-fallback');
  resize();
  start();
}

onMounted(() => {
  if (!supported || !host.value) {
    host.value?.classList.add('is-fallback');
    return;
  }

  try {
    renderer = new WebGLRenderer({
      alpha: true,
      // No MSAA: there is no geometry edge to alias. The contour lines are
      // smoothstep-antialiased in the shader already.
      antialias: false,
      // Nothing here needs the discrete GPU spun up.
      powerPreference: 'low-power',
      depth: false,
      stencil: false,
    });
  } catch {
    host.value.classList.add('is-fallback');
    return;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = 'vt__canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.value.appendChild(renderer.domElement);

  scene = new Scene();
  // A bare Camera, not Perspective: the vertex shader writes clip space
  // directly, so there is no projection to compute and no matrix to update.
  camera = new Camera();
  geometry = new PlaneGeometry(2, 2);
  material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uResolution: { value: new Vector2(1, 1) },
      uTime:       { value: 0 },
      uPointer:    { value: new Vector2(0, 0) },
      uGrip:       { value: 0 },
      uScroll:     { value: 0 },
      uAccent:     { value: new Color(props.accent) },
      uRings:      { value: ringUniform },
    },
  });
  scene.add(new Mesh(geometry, material));

  resize();

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  // Webfonts and the reveal animations both change document height after load.
  window.addEventListener('load', measure, { once: true, passive: true });
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

  if (fine) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('blur', onPointerLeave);
  } else {
    window.addEventListener('click', onTap, { passive: true });
  }

  if (reduced) drawStill();
  else start();
});

onBeforeUnmount(() => {
  stop();
  clearTimeout(resizeTimer);
  document.removeEventListener('visibilitychange', onVisibility);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('load', measure);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerdown', onPointerDown);
  window.removeEventListener('click', onTap);
  window.removeEventListener('blur', onPointerLeave);
  document.documentElement.removeEventListener('pointerleave', onPointerLeave);

  const canvas = renderer?.domElement;
  renderer?.domElement.removeEventListener('webglcontextlost', onContextLost);
  renderer?.domElement.removeEventListener('webglcontextrestored', onContextRestored);
  geometry?.dispose();
  material?.dispose();
  renderer?.dispose();
  canvas?.remove();
  renderer = null; scene = null; camera = null; geometry = null; material = null;
});
</script>

<template>
  <div ref="host" class="vt" aria-hidden="true">
    <!-- Shown only when WebGL is unavailable or the context is lost. -->
    <div class="vt__fallback"></div>
  </div>
</template>

<style scoped>
/**
 * `z-index: -1` rather than 0: the root background propagates to the canvas
 * and is painted behind even negative layers, so this sits above the flat
 * near-black and below every scrap of content without content having to opt
 * into a stacking context.
 */
.vt {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  /* Two faint pools so the frame is never uniformly black where the contour
     alpha falls to nothing. */
  background:
    radial-gradient(ellipse 72% 68% at 16% 14%, oklch(0.30 0.020 250 / 0.16), transparent 68%),
    radial-gradient(ellipse 64% 58% at 86% 80%, oklch(0.26 0.030 30 / 0.11), transparent 72%);
  contain: strict;
}

.vt :deep(.vt__canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.vt__fallback {
  position: absolute;
  inset: 0;
  display: none;
  opacity: 0.26;
  background:
    repeating-radial-gradient(ellipse at 27% 34%, transparent 0 24px, oklch(0.72 0 0 / 0.10) 25px 26px, transparent 27px 45px),
    repeating-radial-gradient(ellipse at 73% 68%, transparent 0 32px, oklch(0.66 0 0 / 0.08) 33px 34px, transparent 35px 58px);
}

.vt.is-fallback .vt__fallback { display: block; }

/* Phones: the field is scenery behind dense copy on a small screen, so it is
   pulled back rather than removed. */
@media (max-width: 640px) {
  .vt :deep(.vt__canvas) { opacity: 0.72; }
}
</style>
