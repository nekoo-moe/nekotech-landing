<script lang="ts">
export interface HeroItem {
  title: string;
  bgColor: string;
  txtColor: string;
  meta: {
    images: string[];
    title: string;
    description: string;
  }
}
</script>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import styles from './styles.module.scss';
import NekoTechLogo from '@/assets/nekotech-logo.png';
import HomeHeroContent from '@/components/landing/HomeHeroContent.vue';
import { useThemeContext } from '@/components/providers/ThemeProvider.vue';
import Aurora from '@/components/vue-bits/Aurora.vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';

import section1img01 from '@/assets/homepage/section1/img01.jpeg';
import section1img02 from '@/assets/homepage/section1/img02.png';
import section2img01 from '@/assets/homepage/section2/img01.jpeg';
import section2img02 from '@/assets/homepage/section2/img02.png';
import section3img01 from '@/assets/homepage/section3/img01.jpeg';
import section3img02 from '@/assets/homepage/section3/img02.png';

const textColor = ref('#ffffff');
const locked = ref(false);
const bgColor = ref('black');
const isLight = ref(true);
const showContent = ref(false);
const { setHeroColors } = useThemeContext();
const { t } = useLanguage();

const items = computed<HeroItem[]>(() => [
  {
    title: t.value.hero.learn.title,
    bgColor: '#8aadf4',
    txtColor: '#ffffff',
    meta: {
      images: [section1img01, section1img02],
      title: t.value.hero.learn.metaTitle,
      description: t.value.hero.learn.description
    }
  },
  {
    title: t.value.hero.inspire.title,
    bgColor: '#ff6000',
    txtColor: '#ffffff',
    meta: {
      images: [section2img01, section2img02],
      title: t.value.hero.inspire.metaTitle,
      description: t.value.hero.inspire.description
    }
  },
  {
    title: t.value.hero.grow.title,
    bgColor: '#232323',
    txtColor: '#ffffff',
    meta: {
      images: [section3img01, section3img02],
      title: t.value.hero.grow.metaTitle,
      description: t.value.hero.grow.description
    }
  }
]);

const selectedItem = ref<HeroItem>(items.value[0]);

// Update selected item when language changes
watch(t, () => {
  selectedItem.value = items.value[0];
});

const reset = () => {
  if (locked.value) return;
  textColor.value = '#ffffff';
  bgColor.value = 'black';
  isLight.value = true;
  showContent.value = false;
};

watch([bgColor, textColor], () => {
  if (setHeroColors) {
    setHeroColors({
      text: textColor.value,
      background: bgColor.value
    });
  }
});

let lockTimeoutId: number | null = null;
watch(locked, () => {
  if (lockTimeoutId) window.clearTimeout(lockTimeoutId);
  if (locked.value) {
    lockTimeoutId = window.setTimeout(() => {
      locked.value = false;
    }, 30000);
  }
});

const handleItemEnter = (item: HeroItem) => {
  if (!locked.value) {
    bgColor.value = item.bgColor;
    textColor.value = item.txtColor;
    showContent.value = true;
    selectedItem.value = item;
  }
};

const handleItemClick = (item: HeroItem) => {
  bgColor.value = item.bgColor;
  textColor.value = item.txtColor;
  showContent.value = true;
  selectedItem.value = item;
  locked.value = !(locked.value && selectedItem.value.title === item.title);
};
</script>

<template>
  <div
    id="home"
    :class="styles.homeHero"
    :style="{
      backgroundColor: bgColor,
      color: textColor,
      overflow: 'hidden'
    }"
  >
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;">
      <Aurora
        :colorStops="['#3A29FF', '#FF94B4', '#FF3232']"
        :blend="0.5"
        :amplitude="1.0"
        :speed="1"
      />
    </div>
    <div style="position: relative; z-index: 1; width: 100%; height: 100%; display: flex; flex-direction: column;">
      <div :class="styles.homeHeroMeta">
        <HomeHeroContent
          v-if="showContent"
          :item="selectedItem"
        />
        <div v-else :class="styles.logoWrapper">
          <img
            :src="NekoTechLogo"
            alt="NekoTech Logo"
            :class="styles.icon"
          />
          <div :class="styles.companyMeta">
            <div :class="styles.companyName">
              NekoTech Foundation
            </div>
            <div :class="styles.slogan">
              {{ t.hero.landing.slogan }}
            </div>
          </div>
        </div>
      </div>

      <div :class="styles.companyKeyPoints">
        <div
          v-for="item in items"
          :key="item.title"
          @mouseenter="handleItemEnter(item)"
          @mouseleave="reset"
          @click="handleItemClick(item)"
          :class="(selectedItem.title === item.title && locked) ? styles.pickerSelected : undefined"
          :style="{
            backgroundColor: showContent ? textColor : 'rgba(255, 255, 255, 0.1)',
            color: showContent ? bgColor : 'white',
            backdropFilter: !showContent ? 'blur(4px)' : undefined,
            border: !showContent ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
          }"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>
