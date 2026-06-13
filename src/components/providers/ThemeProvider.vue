<script lang="ts">
import { ref, provide, inject, Ref } from 'vue';

export interface ThemeColors {
  text: string;
  background: string;
}

export interface ThemeContextType {
  heroColors: Ref<ThemeColors>;
  setHeroColors: (colors: ThemeColors) => void;
}

export function useThemeContext() {
  const context = inject<ThemeContextType>('themeContext');
  if (!context) {
    return {
      heroColors: ref({ text: '#ffffff', background: '#000000' }),
      setHeroColors: () => {}
    };
  }
  return context;
}
</script>

<script setup lang="ts">
const heroColors = ref<ThemeColors>({
  text: '#ffffff',
  background: '#000000'
});

const setHeroColors = (colors: ThemeColors) => {
  heroColors.value = colors;
};

provide('themeContext', {
  heroColors,
  setHeroColors
});
</script>

<template>
  <slot />
</template>
