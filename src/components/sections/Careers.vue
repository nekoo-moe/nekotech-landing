<script setup lang="ts">
import { computed } from 'vue';
import styles from './sections.module.scss';
import SectionTitle from '@/components/shared/SectionTitle.vue';
import CareerItem from '@/components/sections/CareerItem.vue';
import ScrollReveal from '@/components/utils/ScrollReveal.vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { ArrowRight } from 'lucide-vue-next';

const { t } = useLanguage();

const positions = computed(() => [
  {
    id: '0',
    title: 'NekoAI',
    slots: 1,
    contestlink: 'https://github.com/NekoTech-Foundation',
    description: t.value.careers.items.nekoai.description,
    website: 'ai.neko.tech',
    mailadress: 'nekoai@neko.tech',
    websiteLink: 'https://github.com/NekoTech-Foundation',
    mailadressLink: 'mailto:works.nekotech@proton.me'
  },
  {
    id: '1',
    title: 'NekoComics',
    slots: 1,
    contestlink: 'https://github.com/NekoTech-Foundation',
    description: t.value.careers.items.nekocomics.description,
    website: 'comics.nekowibu.xyz',
    mailadress: 'contact@nekowibu.xyz',
    websiteLink: 'https://github.com/NekoTech-Foundation',
    mailadressLink: 'mailto:works.nekotech@proton.me'
  },
  {
    id: '2',
    title: 'NekoAnime',
    slots: 1,
    contestlink: 'https://github.com/NekoTech-Foundation',
    description: t.value.careers.items.nekoanime.description,
    website: 'anime.nekowibu.xyz',
    mailadress: 'contact@nekowibu.xyz',
    websiteLink: 'https://github.com/NekoTech-Foundation',
    mailadressLink: 'mailto:works.nekotech@proton.me'
  }
]);
</script>

<template>
  <div :class="styles.section" id="career">
    <div :class="styles.sectionContent">
      <ScrollReveal>
        <SectionTitle>{{ t.careers.title }}</SectionTitle>
        <div>
          {{ t.careers.subtitle }}
        </div>

        <CareerItem
          v-for="pos in positions"
          :key="pos.id"
          :title="pos.title"
          :description="pos.description"
          :contestlink="pos.contestlink"
          :website="pos.website"
          :mailadress="pos.mailadress"
          :websiteLink="pos.websiteLink"
          :mailadressLink="pos.mailadressLink"
        />

        <div style="margin-top: 2rem; display: flex; justify-content: center;">
          <router-link
            to="/projects"
            style="
              display: inline-flex; 
              align-items: center; 
              gap: 0.5rem; 
              padding: 1rem 2rem; 
              background-color: white; 
              color: black; 
              border-radius: 99px; 
              text-decoration: none;
              font-weight: bold;
              font-size: 1.1rem;
              transition: transform 0.2s ease;
            "
            @mouseenter="(e: any) => e.currentTarget.style.transform = 'scale(1.05)'"
            @mouseleave="(e: any) => e.currentTarget.style.transform = 'scale(1.0)'"
          >
            <span>{{ t.sideProjects.title }}</span>
            <ArrowRight :size="20" />
          </router-link>
        </div>
      </ScrollReveal>
    </div>
  </div>
</template>
