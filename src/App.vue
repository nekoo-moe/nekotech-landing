<script setup lang="ts">
import ThemeProvider from '@/components/providers/ThemeProvider.vue';
import LanguageProvider from '@/components/providers/LanguageProvider.vue';
import SmoothScroll from '@/components/utils/SmoothScroll.vue';
import VectorTopography from '@/components/three/VectorTopography.vue';
</script>

<template>
  <ThemeProvider>
    <LanguageProvider>
      <SmoothScroll>
        <!-- The page's one 3D layer: fixed, behind everything, and outside
             <router-view> so it survives navigation instead of restarting its
             drift on every route change. It replaces both the CSS backdrop and
             the hero's terrain scene — one fragment pass for the whole page
             costs less than either did alone. -->
        <VectorTopography />
        <router-view />
      </SmoothScroll>
    </LanguageProvider>
  </ThemeProvider>
</template>
