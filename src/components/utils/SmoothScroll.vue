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

  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});

onBeforeUnmount(() => {
  lenisInstance?.destroy();
  lenisInstance = null;
});
</script>

<template>
  <slot />
</template>
