<script lang="ts">
import { ref, provide, computed, onMounted, inject, Ref, ComputedRef } from 'vue';
import { Translation } from '@/locales/types';
import en from '@/locales/en';
import vi from '@/locales/vi';

export type Language = 'en' | 'vi';

export interface LanguageContextType {
  language: Ref<Language>;
  setLanguage: (lang: Language) => void;
  t: ComputedRef<Translation>;
}

export function useLanguage() {
  const context = inject<LanguageContextType>('languageContext');
  if (!context) {
    // If not found (e.g. during static build or testing), return a fallback default context
    // to prevent crashes, but ideally it should throw or warn.
    return {
      language: ref('en') as Ref<Language>,
      setLanguage: () => {},
      t: computed(() => en)
    };
  }
  return context;
}
</script>

<script setup lang="ts">
import { watchEffect } from 'vue';

/**
 * English is the default. A Vietnamese browser does not silently flip the
 * page — the visitor's own choice, once made, is the only thing that
 * overrides it, so a shared link always looks the same to everyone.
 */
const language = ref<Language>('en');

onMounted(() => {
  const saved = localStorage.getItem('language');
  if (saved === 'en' || saved === 'vi') language.value = saved;
});

const setLanguage = (lang: Language) => {
  language.value = lang;
  localStorage.setItem('language', lang);
};

const t = computed<Translation>(() => (language.value === 'vi' ? vi : en));

// Keep the document in sync: <html lang> matters for screen readers and
// hyphenation, and the title/description are copy like any other.
watchEffect(() => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = language.value;
  document.title = `NekoTech Foundation — ${t.value.meta.tagline}`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', t.value.meta.description);
});

provide('languageContext', {
  language,
  setLanguage,
  t
});
</script>

<template>
  <slot />
</template>
