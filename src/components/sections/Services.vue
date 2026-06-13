<script setup lang="ts">
import { computed } from 'vue';
import styles from './styles.module.scss';
import SectionTitle from '@/components/shared/SectionTitle.vue';
import ScrollStack from '@/components/ScrollStack.vue';
import ScrollStackItem from '@/components/ScrollStackItem.vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';

const { t } = useLanguage();

const services = computed(() => [
  {
    title: t.value.services.items.web.title,
    description: t.value.services.items.web.description,
    color: '#8aadf4'
  },
  {
    title: t.value.services.items.mobile.title,
    description: t.value.services.items.mobile.description,
    color: '#f5a97f'
  },
  {
    title: t.value.services.items.fullstack.title,
    description: t.value.services.items.fullstack.description,
    color: '#ff6000'
  },
  {
    title: t.value.services.items.minecraft.title,
    description: t.value.services.items.minecraft.description,
    color: '#a6da95'
  }
]);
</script>

<template>
  <div id="services" :class="styles.servicesSection">
    <div :class="styles.header">
      <SectionTitle>{{ t.services.title }}</SectionTitle>
      <div :class="styles.subtitle">
        {{ t.services.subtitle }}
      </div>
    </div>

    <div style="width: 100%; max-width: 1400px; position: relative;">
      <ScrollStack
        :itemDistance="25"
        :itemStackDistance="10"
        stackPosition="20%"
        :useWindowScroll="true"
      >
        <ScrollStackItem v-for="(service, index) in services" :key="index">
          <div
            :style="{
              backgroundColor: '#1E1E1E',
              color: 'white',
              borderRadius: '2rem',
              padding: '2rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: `0 0 20px ${service.color}20`
            }"
          >
            <h3 style="font-size: 2.5rem; margin-bottom: 0.5rem; color: white; font-weight: bold;">
              {{ service.title }}
            </h3>
            <p style="font-size: 1.2rem; line-height: 1.6rem; margin-top: 0.5rem;">
              {{ service.description }}
            </p>
          </div>
        </ScrollStackItem>
      </ScrollStack>
    </div>
  </div>
</template>
