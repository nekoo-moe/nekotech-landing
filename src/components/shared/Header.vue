<script setup lang="ts">
import styles from './Header.module.scss';
import { useThemeContext } from '@/components/providers/ThemeProvider.vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import Hamburger from '@/components/icons/Hamburger.vue';
import { NavigationConfig } from '@/configs/app.config';

const { heroColors } = useThemeContext();
const { t, language, setLanguage } = useLanguage();

const handleNavClick = (e: MouseEvent, url: string) => {
  if (!url.includes('#')) return;
  e.preventDefault();
  const id = url.split('#').pop();
  if (!id) return;
  document.querySelector(`#${id}`)?.scrollIntoView({
    behavior: 'smooth'
  });
};

const toggleLanguage = () => {
  const newLang = language.value === 'en' ? 'vi' : 'en';
  setLanguage(newLang);
  window.location.reload();
};
</script>

<template>
  <div
    :class="styles.container"
    :style="{
      color: heroColors.text,
      background: 'transparent'
    }"
  >
    <div :class="styles.headerContent">
      <div :class="styles.links">
        <a
          v-for="item in NavigationConfig"
          :key="item.key"
          :href="item.url"
          :style="{ color: heroColors.text }"
          @click="(e) => handleNavClick(e, item.url)"
        >
          {{ (t.navigation as any)[item.key] }}
        </a>
        <button
          @click="toggleLanguage"
          :style="{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '5px 15px',
            color: heroColors.text,
            cursor: 'pointer',
            marginLeft: '20px',
            fontSize: '0.9rem',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.3s ease'
          }"
        >
          {{ language === 'en' ? '🇺🇸 EN' : '🇻🇳 VN' }}
        </button>
        <a :class="styles.hamburgerBtn">
          <Hamburger :color="heroColors.text" />
        </a>
      </div>
    </div>
  </div>
</template>
