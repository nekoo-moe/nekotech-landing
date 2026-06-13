<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

onMounted(() => {
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Expose to window so other components can call lenis.scrollTo
  (window as any).__lenis = lenisInstance;

  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});

onBeforeUnmount(() => {
  lenisInstance?.destroy();
  lenisInstance = null;
  delete (window as any).__lenis;
});
</script>

<template>
  <slot />
</template>
