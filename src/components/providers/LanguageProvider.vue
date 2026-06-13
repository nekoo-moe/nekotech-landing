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
const language = ref<Language>('en');

onMounted(() => {
  const savedLang = localStorage.getItem('language') as Language;
  if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
    language.value = savedLang;
  } else {
    const browserLang = navigator.language.startsWith('vi') ? 'vi' : 'en';
    language.value = browserLang;
  }
});

const setLanguage = (lang: Language) => {
  language.value = lang;
  localStorage.setItem('language', lang);
};

const t = computed<Translation>(() => {
  return language.value === 'vi' ? vi : en;
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
