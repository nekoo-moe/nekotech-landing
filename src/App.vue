<script setup lang="ts">
import ThemeProvider from '@/components/providers/ThemeProvider.vue';
import LanguageProvider from '@/components/providers/LanguageProvider.vue';
import SmoothScroll from '@/components/utils/SmoothScroll.vue';
import CinematicBackdrop from '@/components/shared/CinematicBackdrop.vue';
</script>

<template>
  <ThemeProvider>
    <LanguageProvider>
      <SmoothScroll>
        <!-- Fixed, behind everything, and outside <router-view> so it survives
             navigation instead of restarting its drift on every route change. -->
        <CinematicBackdrop />
        <router-view />
      </SmoothScroll>
    </LanguageProvider>
  </ThemeProvider>
</template>
