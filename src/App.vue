<script setup lang="ts">
import ThemeProvider from '@/components/providers/ThemeProvider.vue';
import LanguageProvider from '@/components/providers/LanguageProvider.vue';
import SmoothScroll from '@/components/utils/SmoothScroll.vue';
</script>

<template>
  <ThemeProvider>
    <LanguageProvider>
      <SmoothScroll>
        <router-view />
      </SmoothScroll>
    </LanguageProvider>
  </ThemeProvider>
</template>
