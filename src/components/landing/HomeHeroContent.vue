<script setup lang="ts">
import styles from './HomeHeroContent.module.scss';
import FlowerFigure from '@/components/landing/FlowerFigure.vue';
import { HeroItem } from '@/components/landing/HomeHero.vue';

const props = defineProps<{
  item: HeroItem;
}>();
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.figure">
      <FlowerFigure
        :image1="props.item.meta.images[0]"
        :image2="props.item.meta.images[1]"
        :bgColor="props.item.txtColor"
      />
    </div>
    <div :class="styles.metaInfo">
      <div :class="styles.title">
        {{ props.item.meta.title }}
      </div>
      <div :class="styles.description">
        {{ props.item.meta.description }}
      </div>
    </div>
  </div>
</template>
