<script setup lang="ts">
/**
 * Lenis wrapper. Two things worth noting:
 *
 * 1. Reduced motion opts out entirely — hijacking the scroll wheel is the
 *    single most motion-sensitive thing on the page.
 * 2. The RAF loop is cancelled on unmount. Scheduling the next frame
 *    unconditionally would keep it alive for the life of the tab.
 */
import { onMounted, onBeforeUnmount } from 'vue';
import Lenis from 'lenis';
import { prefersReducedMotion } from '@/composables/useCanvasScene';

let lenis: Lenis | null = null;
let raf = 0;

onMounted(() => {
  if (prefersReducedMotion()) return;

  lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Published so scrollToHash() can hand off to it without importing the
  // instance through the component tree.
  (window as any).__lenis = lenis;

  const tick = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
});

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf);
  lenis?.destroy();
  lenis = null;
  delete (window as any).__lenis;
});
</script>

<template>
  <slot />
</template>
