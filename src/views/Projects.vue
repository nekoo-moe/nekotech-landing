<script setup lang="ts">
import { computed } from 'vue';
import SectionTitle from '@/components/shared/SectionTitle.vue';
import AppHeader from '@/components/shared/Header.vue';
import Aurora from '@/components/vue-bits/Aurora.vue';
import SideProjectItem from '@/components/landing/SideProjectItem.vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { ArrowLeft } from 'lucide-vue-next';

const { t, language } = useLanguage();

const projects = computed(() => [
  {
    title: "NekoBuckets",
    description: t.value.sideProjects.items.nekobuckets.description,
    actions: [
      {
        label: t.value.sideProjects.actions.invite,
        url: "https://discord.com/oauth2/authorize?client_id=1372420632628822057&permissions=8&integration_type=0&scope=bot",
        type: 'primary' as const
      }
    ]
  },
  {
    title: "NekoMusics",
    description: t.value.sideProjects.items.nekomusics.description,
    actions: [
      {
        label: t.value.sideProjects.actions.invite,
        url: "https://discord.com/oauth2/authorize?client_id=1427516379912994816&permissions=8&integration_type=0&scope=bot",
        type: 'primary' as const
      }
    ]
  }
]);
</script>

<template>
  <div style="min-height: 100vh; background-color: #000; color: #fff; position: relative;">
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;">
      <Aurora
        :colorStops="['#3A29FF', '#FF94B4', '#FF3232']"
        :blend="0.5"
        :amplitude="1.0"
        :speed="1"
      />
    </div>
    
    <div style="position: relative; z-index: 1;">
      <AppHeader />
      
      <div style="padding-top: 150px; padding-bottom: 100px; max-width: 1200px; margin: 0 auto; padding-left: 20px; padding-right: 20px;">
        <div style="margin-bottom: 2rem;">
          <router-link to="/" style="display: inline-flex; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 1rem;">
            <ArrowLeft :size="20" />
            <span>{{ language === 'vi' ? 'Quay lại' : 'Back to Home' }}</span>
          </router-link>
          <SectionTitle>{{ t.sideProjects.title }}</SectionTitle>
          <div style="font-size: 1.2rem; color: rgba(255,255,255,0.6); margin-top: 1rem;">
            {{ t.sideProjects.subtitle }}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <SideProjectItem 
            v-for="(project, index) in projects"
            :key="index"
            :title="project.title"
            :description="project.description"
            :actions="project.actions"
          />
        </div>
      </div>
    </div>
  </div>
</template>
