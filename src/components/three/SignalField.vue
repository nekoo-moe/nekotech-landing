<script setup lang="ts">
/**
 * SignalField — background for the closing CTA.
 *
 * One fullscreen fragment shader on an OGL triangle: a lattice of dots
 * lit by a slow travelling wave, with a single accent thread crossing it.
 * Deliberately quieter than the hero — this sits behind a call to action,
 * so it has to hold still enough to read over.
 *
 * OGL rather than three.js here: no geometry, no camera, no scene graph
 * needed, and it keeps this scene at a couple of kilobytes.
 */
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';
import {
  hasWebGL, prefersReducedMotion, useSceneActive, cappedDPR,
} from '@/composables/useCanvasScene';

const props = withDefaults(defineProps<{ accent?: string }>(), {
  accent: '#e8543a',
});

const host = ref<HTMLDivElement | null>(null);
const { active } = useSceneActive(host);
const supported = hasWebGL();

const VERT = /* glsl */ `#version 300 es
  in vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `#version 300 es
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec3  uAccent;

  out vec4 fragColor;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = frag / uResolution;

    // Fixed 26px lattice, so density stays constant across viewport sizes.
    float cell = 26.0;
    vec2 grid = frag / cell;
    vec2 cellUV = fract(grid) - 0.5;
    vec2 cellId = floor(grid);

    // Travelling wave: a diagonal band of activity crossing the field.
    float wave = noise(cellId * 0.11 + vec2(uTime * 0.075, uTime * 0.028));
    float band = sin((uv.x + uv.y) * 2.4 - uTime * 0.28) * 0.5 + 0.5;
    float energy = smoothstep(0.42, 0.95, wave * 0.65 + band * 0.45);

    // Dot radius breathes with the energy; the dimmest dots stay visible
    // so the lattice never fully disappears.
    float radius = 0.055 + energy * 0.085;
    float dot_ = smoothstep(radius, radius - 0.045, length(cellUV));

    vec3 col = vec3(0.62, 0.63, 0.66) * (0.10 + energy * 0.90);

    // The accent thread: one horizontal row, drifting, tinted. This is the
    // section's single accent — nothing else here uses it.
    float threadRow = floor(uResolution.y / cell * 0.5 + sin(uTime * 0.06) * 3.0);
    float onThread = 1.0 - smoothstep(0.0, 0.9, abs(cellId.y - threadRow));
    col = mix(col, uAccent, onThread * (0.35 + energy * 0.45));

    // Vignette so the lattice dissolves into the section edges instead of
    // stopping at them.
    float vig = smoothstep(1.02, 0.30, length((uv - 0.5) * vec2(1.35, 1.05)) * 1.4);

    float alpha = dot_ * vig * (0.14 + energy * 0.50);
    fragColor = vec4(col, alpha);
  }
`;

let renderer: Renderer | null = null;
let program: Program | null = null;
let mesh: Mesh | null = null;
let raf = 0;
let start = 0;

function resize() {
  if (!renderer || !host.value || !program) return;
  const { clientWidth: w, clientHeight: h } = host.value;
  if (!w || !h) return;
  renderer.setSize(w, h);
  const dpr = renderer.dpr;
  program.uniforms.uResolution.value = [w * dpr, h * dpr];
}

function frame(now: number) {
  raf = requestAnimationFrame(frame);
  if (!renderer || !program || !mesh) return;
  program.uniforms.uTime.value = (now - start) / 1000;
  renderer.render({ scene: mesh });
}

onMounted(() => {
  if (!supported || !host.value) return;

  renderer = new Renderer({ alpha: true, dpr: cappedDPR(1.75) });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  host.value.appendChild(gl.canvas);
  gl.canvas.setAttribute('aria-hidden', 'true');

  program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime:       { value: 0 },
      uResolution: { value: [1, 1] },
      uAccent:     { value: new Color(props.accent) },
    },
    transparent: true,
    depthTest: false,
  });

  mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  resize();
  window.addEventListener('resize', resize, { passive: true });

  if (prefersReducedMotion()) {
    program.uniforms.uTime.value = 8;
    renderer.render({ scene: mesh });
    return;
  }

  start = performance.now();
  if (active.value) raf = requestAnimationFrame(frame);
});

watch(active, isActive => {
  if (prefersReducedMotion() || !supported) return;
  if (isActive && !raf) raf = requestAnimationFrame(frame);
  else if (!isActive && raf) { cancelAnimationFrame(raf); raf = 0; }
});

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf);
  window.removeEventListener('resize', resize);
  const canvas = renderer?.gl.canvas as HTMLCanvasElement | undefined;
  renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext();
  canvas?.remove();
  renderer = null; program = null; mesh = null;
});
</script>

<template>
  <div class="signal" ref="host" aria-hidden="true"></div>
</template>

<style scoped>
.signal {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.signal :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
