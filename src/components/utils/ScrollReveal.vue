<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = withDefaults(defineProps<{
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}>(), {
  className: '',
  delay: 0,
  duration: 0.6,
  yOffset: 50
});

const revealRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
      } else {
        isVisible.value = false;
      }
    });
  }, {
    threshold: 0.2
  });

  if (revealRef.value) {
    observer.observe(revealRef.value);
  }
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<template>
  <div
    ref="revealRef"
    :class="props.className"
    :style="{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : `translateY(${props.yOffset}px)`,
      transition: `opacity ${props.duration}s ease-out ${props.delay}s, transform ${props.duration}s ease-out ${props.delay}s`
    }"
  >
    <slot />
  </div>
</template>
