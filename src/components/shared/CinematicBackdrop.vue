<script setup lang="ts">
/**
 * The page's atmosphere layer.
 *
 * Every section on this site is a transparent plate over the near-black
 * canvas, which is why the page read as flat between the hero and the footer:
 * the only two places with any light were the two WebGL scenes. This sits
 * behind the entire document and gives the whole scroll a slow, moving key
 * light — the thing that makes a page feel photographed rather than printed.
 *
 * Deliberately *not* WebGL. The hero already owns a three.js scene and the
 * footer owns a second; a third continuous GL context running for the whole
 * page would be the most expensive thing on it. This is four composited
 * layers driven by long CSS keyframes, which the compositor handles on its
 * own thread for free.
 *
 * It is also deliberately monochrome plus one very faint vermilion. The design
 * rule is that accent belongs to state, so the accent here is diluted far past
 * the point where it could be mistaken for one.
 */
import { ref } from 'vue';
import { useScrollProgress } from '@/composables/useScrollProgress';

/* Scroll drives a parallax offset on the light pools, so descending the page
   moves the light rather than just sliding the content past a static wash. */
const root = ref<HTMLElement | null>(null);
useScrollProgress(root, { varName: '--doc', start: 1, end: 0 });
</script>

<template>
  <div ref="root" class="bd" aria-hidden="true">
    <!-- Three drifting pools of light. Different sizes, different periods, so
         they never resynchronise into a visible pulse. -->
    <span class="bd__pool bd__pool--a"></span>
    <span class="bd__pool bd__pool--b"></span>
    <span class="bd__pool bd__pool--c"></span>

    <!-- A single wide beam that crosses the frame every couple of minutes.
         This is the layer that reads as "cinematic" rather than "gradient". -->
    <span class="bd__beam"></span>

    <!-- Held to the frame edges: a vignette, so the centre of the page is
         always the brightest part of it. -->
    <span class="bd__vignette"></span>

    <!-- Grain last, over everything, at the threshold of visible. -->
    <span class="bd__grain"></span>
  </div>
</template>

<style scoped>
/**
 * `z-index: -1` rather than 0: the root background propagates to the canvas
 * and is painted behind even negative layers, so this sits above the flat
 * near-black and below every scrap of content without needing content to opt
 * into a stacking context.
 */
.bd {
  --doc: 0;
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  /* Isolate so the blend modes below cannot reach page content. */
  isolation: isolate;
  contain: strict;
}

.bd__pool {
  position: absolute;
  border-radius: 50%;
  /* A blur this wide is what turns a radial gradient into light. */
  filter: blur(90px);
  will-change: transform;
}

/* Top-left cool key. Largest and slowest — it is the one that sets the mood. */
.bd__pool--a {
  top: -22vh;
  left: -12vw;
  width: 72vw;
  height: 72vh;
  background: radial-gradient(
    circle at 50% 50%,
    oklch(0.34 0.018 250 / 0.55),
    oklch(0.18 0.01 250 / 0.22) 52%,
    transparent 72%
  );
  animation: bd-drift-a 68s var(--ease-cinematic) infinite alternate;
}

/* Right-hand fill, warmer, and the only place accent appears. Parallaxes
   against the scroll twice as fast as the others. */
.bd__pool--b {
  top: 26vh;
  right: -20vw;
  width: 62vw;
  height: 82vh;
  background: radial-gradient(
    circle at 50% 50%,
    oklch(0.655 0.215 26 / 0.10),
    oklch(0.30 0.05 30 / 0.10) 48%,
    transparent 70%
  );
  animation: bd-drift-b 84s var(--ease-cinematic) infinite alternate;
}

/* Low bounce, neutral, keeps the bottom of the frame from going dead. */
.bd__pool--c {
  bottom: -26vh;
  left: 18vw;
  width: 66vw;
  height: 62vh;
  background: radial-gradient(
    circle at 50% 50%,
    oklch(0.40 0 0 / 0.34),
    oklch(0.20 0 0 / 0.16) 55%,
    transparent 74%
  );
  animation: bd-drift-c 96s var(--ease-cinematic) infinite alternate;
}

/*
 * The beam. A very shallow diagonal band of light travelling across the frame,
 * `screen`-blended so it only ever adds. `mix-blend-mode` is why the pools are
 * isolated above — without it this would lift page text too.
 */
.bd__beam {
  position: absolute;
  top: -40vh;
  left: -60vw;
  width: 70vw;
  height: 200vh;
  transform: rotate(14deg);
  mix-blend-mode: screen;
  opacity: 0.5;
  background: linear-gradient(
    90deg,
    transparent,
    oklch(0.62 0.012 250 / 0.055) 42%,
    oklch(0.74 0.012 250 / 0.085) 50%,
    oklch(0.62 0.012 250 / 0.055) 58%,
    transparent
  );
  filter: blur(30px);
  animation: bd-sweep 128s linear infinite;
  will-change: transform;
}

/* Corners down, centre held. Two stops rather than one so the falloff is not
   a visible ring. */
.bd__vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      130% 110% at 50% 42%,
      transparent 0%,
      oklch(0.055 0 0 / 0.35) 62%,
      oklch(0.055 0 0 / 0.78) 100%
    );
}

/* Film grain. Same noise the hero uses, at a lower opacity and animated in
   whole-pixel jumps so it reads as grain rather than as a texture. */
.bd__grain {
  position: absolute;
  inset: -100px;
  opacity: 0.022;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: bd-grain 900ms steps(1, end) infinite;
}

/* ── Motion ──────────────────────────────────────────────────────────────
   Each pool combines its own drift with a scroll-driven `--doc` offset, so
   the light moves both on its own and with the reader. */
@keyframes bd-drift-a {
  from { transform: translate3d(0, calc(var(--doc) * -14vh), 0) scale(1); }
  50%  { transform: translate3d(6vw, calc(var(--doc) * -14vh + 5vh), 0) scale(1.12); }
  to   { transform: translate3d(-3vw, calc(var(--doc) * -14vh - 4vh), 0) scale(1.04); }
}

@keyframes bd-drift-b {
  from { transform: translate3d(0, calc(var(--doc) * -30vh), 0) scale(1.06); }
  50%  { transform: translate3d(-7vw, calc(var(--doc) * -30vh - 6vh), 0) scale(0.94); }
  to   { transform: translate3d(2vw, calc(var(--doc) * -30vh + 7vh), 0) scale(1.1); }
}

@keyframes bd-drift-c {
  from { transform: translate3d(0, calc(var(--doc) * -8vh), 0) scale(1); }
  50%  { transform: translate3d(-9vw, calc(var(--doc) * -8vh - 4vh), 0) scale(1.14); }
  to   { transform: translate3d(5vw, calc(var(--doc) * -8vh + 3vh), 0) scale(1); }
}

@keyframes bd-sweep {
  from { transform: translate3d(0, 0, 0) rotate(14deg); }
  to   { transform: translate3d(240vw, 0, 0) rotate(14deg); }
}

@keyframes bd-grain {
  0%   { transform: translate3d(0, 0, 0); }
  25%  { transform: translate3d(-3%, 2%, 0); }
  50%  { transform: translate3d(2%, -3%, 0); }
  75%  { transform: translate3d(-2%, -2%, 0); }
  100% { transform: translate3d(3%, 1%, 0); }
}

/* Phones get the pools and the vignette but not the beam or the grain: both
   are full-viewport composited layers and neither survives a small screen
   well enough to justify the fill cost. */
@media (max-width: 720px) {
  .bd__beam, .bd__grain { display: none; }
  .bd__pool { filter: blur(64px); }
}

/*
 * Reduced motion keeps the *light* and drops the movement. Deleting the layer
 * entirely would leave those users with the flat page this exists to fix, so
 * the animations stop at their first frame instead.
 */
@media (prefers-reduced-motion: reduce) {
  .bd__pool, .bd__beam, .bd__grain { animation: none; }
  .bd__pool { transform: none; }
}
</style>
