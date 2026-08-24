<script setup lang="ts">
/**
 * TerrainField — the hero scene.
 *
 * A wireframe topographic field scrolling toward the camera. Built from a
 * hand-indexed line grid (not WireframeGeometry, which would add triangle
 * diagonals) so every stroke is a clean 1px hairline. Height comes from
 * fBm noise evaluated in the vertex shader, so the CPU never touches
 * geometry after setup.
 *
 * Colour discipline: the grid is monochrome everywhere except the highest
 * ridges, which pick up vermilion. That is the one accent in the viewport.
 */
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  Scene, PerspectiveCamera, WebGLRenderer, BufferGeometry, BufferAttribute,
  LineSegments, ShaderMaterial, AdditiveBlending, Color, Vector2,
} from 'three';
import {
  hasWebGL, prefersReducedMotion, useSceneActive, damp, cappedDPR,
} from '@/composables/useCanvasScene';

const props = withDefaults(defineProps<{
  /** Ridge tint. Defaults to the brand vermilion. */
  accent?: string;
  /** Horizontal grid divisions. Scaled down automatically on small screens. */
  density?: number;
  /** How fast the terrain flows toward the viewer. */
  speed?: number;
  /** Peak height in world units. */
  amplitude?: number;
}>(), {
  accent: '#e8543a',
  density: 96,
  speed: 1,
  amplitude: 20,
});

const host = ref<HTMLDivElement | null>(null);
const { active } = useSceneActive(host);

const supported = hasWebGL();

/* ── Shaders ─────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform vec2  uSpan;        // world half-extent (x, z)
  uniform float uScrollTilt;  // 0..1, driven by page scroll

  varying float vFade;
  varying float vHeight;
  varying float vSweep;

  /* Ashima 2D simplex noise — the standard implementation. */
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x  = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  /* Ridged fBm: folding the first octaves through abs() carves creases
     that read as mountain spines rather than rolling dunes. */
  float terrain(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      float n = snoise(p * freq);
      if (i < 2) n = (1.0 - abs(n)) * 2.0 - 1.0;
      sum += n * amp;
      amp *= 0.48;
      freq *= 2.07;
    }
    return sum;
  }

  void main() {
    vec3 pos = position;

    // Flow: sample the noise field with a moving Z offset instead of
    // moving the mesh, so the grid stays put and the landscape travels.
    vec2 sampleAt = vec2(pos.x * 0.0090, pos.z * 0.0090 - uTime * 0.030);
    float h = terrain(sampleAt);

    // Taper the amplitude toward every edge so the slab never shows a
    // hard boundary; the far edge flattens into the horizon.
    float edgeX = 1.0 - smoothstep(0.55, 1.0, abs(pos.x) / uSpan.x);
    float zNorm = (pos.z + uSpan.y) / (2.0 * uSpan.y);   // 0 = far, 1 = near
    float edgeZ = smoothstep(0.0, 0.22, zNorm) * (1.0 - smoothstep(0.86, 1.0, zNorm));

    float height = h * uAmplitude * edgeX * edgeZ;
    pos.y += height;

    vHeight = clamp(height / uAmplitude, -1.0, 1.0);

    // A slow band of light crossing the field. One pass every ~60s.
    float sweepPos = sin(uTime * 0.10) * uSpan.x * 1.15;
    vSweep = exp(-pow((pos.x - sweepPos) / (uSpan.x * 0.30), 2.0));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Depth fade at both ends: dissolves into the horizon, and again at
    // the very front, so the field reads as a lit slab rather than a rug
    // with visible edges.
    float dist = -mv.z;
    float far  = 1.0 - smoothstep(160.0, 470.0, dist);
    float near = smoothstep(24.0, 92.0, dist);
    vFade = far * near;

    // Scrolling the page pitches the field away — the horizon drops as
    // the hero leaves.
    mv.y -= uScrollTilt * 26.0;

    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec3  uAccent;
  uniform float uOpacity;

  varying float vFade;
  varying float vHeight;
  varying float vSweep;

  void main() {
    if (vFade <= 0.001) discard;

    float lift = smoothstep(-0.35, 0.85, vHeight);

    // Monochrome base: valleys barely register, ridges go near-white.
    vec3 col = mix(vec3(0.24, 0.25, 0.27), vec3(0.92, 0.93, 0.95), lift);

    // The single accent — only the top slice of elevation earns it.
    float crest = smoothstep(0.72, 1.0, vHeight);
    col = mix(col, uAccent, crest * 0.85);

    // Light sweep brightens what it passes over without shifting hue.
    col += vec3(0.16, 0.16, 0.18) * vSweep * (0.35 + lift * 0.65);

    float alpha = vFade * uOpacity * (0.16 + lift * 0.84);
    alpha *= 0.55 + vSweep * 0.45;

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ── Scene ───────────────────────────────────────────────────────────── */

const SPAN_X = 300;
const SPAN_Z = 260;

let renderer: WebGLRenderer | null = null;
let scene: Scene | null = null;
let camera: PerspectiveCamera | null = null;
let geometry: BufferGeometry | null = null;
let material: ShaderMaterial | null = null;
let lines: LineSegments | null = null;
let raf = 0;
let clockStart = 0;
let lastFrame = 0;

// Pointer parallax + scroll, both damped toward a target.
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
let scrollTilt = 0;
let scrollTiltTarget = 0;
let opacity = 0;   // fades in on first frames, so nothing pops

/**
 * A quad grid of line segments. Rows connect along X, columns along Z.
 * Indexing it by hand avoids the triangle diagonals that
 * WireframeGeometry would add.
 */
function buildGrid(nx: number, nz: number): BufferGeometry {
  const vertsX = nx + 1;
  const vertsZ = nz + 1;
  const positions = new Float32Array(vertsX * vertsZ * 3);

  for (let iz = 0; iz < vertsZ; iz++) {
    for (let ix = 0; ix < vertsX; ix++) {
      const o = (iz * vertsX + ix) * 3;
      positions[o]     = (ix / nx) * 2 * SPAN_X - SPAN_X;
      positions[o + 1] = 0;
      positions[o + 2] = (iz / nz) * 2 * SPAN_Z - SPAN_Z;
    }
  }

  const segments = vertsZ * nx + vertsX * nz;
  const indices = new Uint32Array(segments * 2);
  let k = 0;

  for (let iz = 0; iz < vertsZ; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      indices[k++] = iz * vertsX + ix;
      indices[k++] = iz * vertsX + ix + 1;
    }
  }
  for (let ix = 0; ix < vertsX; ix++) {
    for (let iz = 0; iz < nz; iz++) {
      indices[k++] = iz * vertsX + ix;
      indices[k++] = (iz + 1) * vertsX + ix;
    }
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(positions, 3));
  geo.setIndex(new BufferAttribute(indices, 1));
  return geo;
}

function resize() {
  if (!renderer || !camera || !host.value) return;
  const { clientWidth: w, clientHeight: h } = host.value;
  if (!w || !h) return;
  renderer.setPixelRatio(cappedDPR());
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function onPointerMove(e: PointerEvent) {
  if (!host.value) return;
  const r = host.value.getBoundingClientRect();
  pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
  pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
}

function onScroll() {
  if (!host.value) return;
  const r = host.value.getBoundingClientRect();
  // 0 while the hero fills the viewport, 1 once it has scrolled away.
  scrollTiltTarget = Math.min(1, Math.max(0, -r.top / Math.max(r.height, 1)));
}

function frame(now: number) {
  raf = requestAnimationFrame(frame);
  if (!renderer || !scene || !camera || !material) return;

  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  pointer.x = damp(pointer.x, pointer.tx, 0.045, dt);
  pointer.y = damp(pointer.y, pointer.ty, 0.045, dt);
  scrollTilt = damp(scrollTilt, scrollTiltTarget, 0.12, dt);
  opacity = damp(opacity, 1, 0.035, dt);

  material.uniforms.uTime.value = ((now - clockStart) / 1000) * props.speed;
  material.uniforms.uScrollTilt.value = scrollTilt;
  material.uniforms.uOpacity.value = opacity;

  // Parallax is deliberately small — the terrain should feel heavy, and
  // a camera that chases the cursor reads as a toy.
  camera.position.x = pointer.x * 16;
  camera.position.y = 34 - pointer.y * 5;
  camera.lookAt(pointer.x * 5, 2 - scrollTilt * 4, -170);

  renderer.render(scene, camera);
}

function drawOnce() {
  if (!renderer || !scene || !camera || !material) return;
  material.uniforms.uOpacity.value = 1;
  material.uniforms.uTime.value = 12;   // a frame with interesting relief
  camera.lookAt(0, 2, -170);
  renderer.render(scene, camera);
}

onMounted(() => {
  if (!supported || !host.value) return;

  const narrow = window.innerWidth < 760;
  const nx = Math.round(props.density * (narrow ? 0.62 : 1));
  const nz = Math.round(props.density * (narrow ? 0.70 : 1.12));

  scene = new Scene();

  camera = new PerspectiveCamera(58, 1, 1, 900);
  camera.position.set(0, 34, 118);

  geometry = buildGrid(nx, nz);

  material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime:       { value: 0 },
      uAmplitude:  { value: props.amplitude },
      uSpan:       { value: new Vector2(SPAN_X, SPAN_Z) },
      uScrollTilt: { value: 0 },
      uAccent:     { value: new Color(props.accent) },
      uOpacity:    { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  lines = new LineSegments(geometry, material);
  scene.add(lines);

  renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  host.value.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  resize();
  window.addEventListener('resize', resize, { passive: true });

  if (prefersReducedMotion()) {
    drawOnce();
    return;
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  clockStart = performance.now();
  lastFrame = clockStart;
  if (active.value) raf = requestAnimationFrame(frame);
});

// Off-screen or backgrounded: stop the loop entirely.
watch(active, isActive => {
  if (prefersReducedMotion() || !supported) return;
  if (isActive && !raf) {
    lastFrame = performance.now();
    raf = requestAnimationFrame(frame);
  } else if (!isActive && raf) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
});

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf);
  window.removeEventListener('resize', resize);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('scroll', onScroll);
  geometry?.dispose();
  material?.dispose();
  renderer?.dispose();
  renderer?.domElement.remove();
  renderer = null; scene = null; camera = null; lines = null;
});
</script>

<template>
  <div class="terrain" ref="host" :class="{ 'terrain--fallback': !supported }">
    <!-- Static stand-in for no-WebGL devices: the same composition, drawn
         with a gradient and an SVG horizon grid. -->
    <svg
      v-if="!supported"
      class="terrain__static"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tf-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0" />
          <stop offset="55%" stop-color="white" stop-opacity="0.30" />
          <stop offset="100%" stop-color="white" stop-opacity="0.06" />
        </linearGradient>
        <mask id="tf-mask">
          <rect width="1200" height="600" fill="url(#tf-fade)" />
        </mask>
      </defs>
      <g mask="url(#tf-mask)" fill="none" stroke="currentColor" stroke-width="1">
        <path v-for="n in 14" :key="`h${n}`"
          :d="`M0 ${300 + n * n * 1.5} L1200 ${300 + n * n * 1.5}`" />
        <path v-for="n in 25" :key="`v${n}`"
          :d="`M${n * 50} 300 L${(n - 12.5) * 190 + 600} 600`" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.terrain {
  position: absolute;
  inset: 0;
  overflow: hidden;
  /* The scene is decoration; never let it eat a click meant for the CTA. */
  pointer-events: none;
}

.terrain :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.terrain__static {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--ink-faint);
}
</style>
