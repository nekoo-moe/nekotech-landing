<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import styles from './sections.module.scss';
import SectionTitle from '@/components/shared/SectionTitle.vue';
import StoryCarousel from '@/components/carousels/StoryCarousel/index.vue';
import Story01 from '@/assets/figures/story-1.png';
import Story02 from '@/assets/figures/8idet6.png';
import ScrollReveal from '@/components/utils/ScrollReveal.vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';

const activated = ref(false);
const index = ref(0);
const outerRef = ref<HTMLDivElement | null>(null);
const { t } = useLanguage();

const handleScroll = () => {
  if (outerRef.value?.offsetTop && outerRef.value.offsetTop - window.scrollY < 300) {
    activated.value = true;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger check initially
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const slides = computed(() => [
  {
    image: Story01,
    date: t.value.story.slides.slide1.date,
    titleHtml: `<h3>${t.value.story.slides.slide1.title}</h3><span>${t.value.story.slides.slide1.subtitle}</span>`,
    contentHtml: `<p>${t.value.story.slides.slide1.p1}</p><p>${t.value.story.slides.slide1.p2}</p>`
  },
  {
    image: Story02,
    date: t.value.story.slides.slide2.date,
    titleHtml: `<h3>${t.value.story.slides.slide2.title}</h3><span>${t.value.story.slides.slide2.subtitle}</span>`,
    contentHtml: `<p>${t.value.story.slides.slide2.p1}</p><p>${t.value.story.slides.slide2.p2}</p><p>${t.value.story.slides.slide2.p3}</p>`
  }
]);

const nextSlide = () => {
  if (index.value < slides.value.length - 1) {
    index.value++;
  }
};

const prevSlide = () => {
  if (index.value > 0) {
    index.value--;
  }
};
</script>

<template>
  <div
    ref="outerRef"
    id="story"
    :class="styles.section"
  >
    <div :class="styles.sectionContent">
      <ScrollReveal>
        <SectionTitle>{{ t.story.title }}</SectionTitle>
        <div>
          {{ t.story.subtitle }}
        </div>

        <StoryCarousel
          :slides="slides"
          :index="index"
          :date="slides[index].date"
          :activated="activated"
          :image="slides[index].image"
          :canGoNext="index < slides.length - 1"
          :canGoPrev="index > 0"
          @next="nextSlide"
          @prev="prevSlide"
        />

        <div v-if="activated" :class="styles.storyText" :key="index">
          <div :class="styles.storyTextContent" v-html="slides[index].contentHtml" />
          <div :class="styles.storyTextTitle" v-html="slides[index].titleHtml" />
        </div>
      </ScrollReveal>
    </div>
  </div>
</template>
