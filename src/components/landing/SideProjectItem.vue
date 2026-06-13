<script setup lang="ts">
import styles from './SideProjectItem.module.scss';
import { ExternalLink, Github } from 'lucide-vue-next';

interface SideProjectAction {
  label: string;
  url: string;
  type: 'primary' | 'secondary' | 'github';
}

const props = defineProps<{
  title: string;
  description: string;
  actions: SideProjectAction[];
}>();
</script>

<template>
  <div :class="styles.outer">
    <div :class="styles.inner">
      <h3 :class="styles.title">{{ props.title }}</h3>
      <p :class="styles.description">{{ props.description }}</p>
      
      <div :class="styles.controls" style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.8rem;">
        <a
          v-for="(action, index) in props.actions"
          :key="index"
          :href="action.url"
          target="_blank"
          rel="noopener noreferrer"
          :class="styles.btn"
          :style="{
            backgroundColor: action.type === 'primary' ? '#ffffff' : 'rgba(255,255,255,0.1)',
            color: action.type === 'primary' ? '#000000' : '#ffffff',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '99px',
            fontSize: '0.9rem',
            fontWeight: 500
          }"
        >
          <Github v-if="action.type === 'github'" :size="16" />
          <span>{{ action.label }}</span>
          <ExternalLink v-if="action.type !== 'github'" :size="16" />
        </a>
      </div>
    </div>
  </div>
</template>
