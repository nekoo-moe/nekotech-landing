<script setup lang="ts">
import styles from './FlowerFigure.module.scss';

const props = withDefaults(defineProps<{
  image1: string;
  image2: string;
  bgColor?: string;
}>(), {
  bgColor: '#000000'
});
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.col1">
      <div
        :class="styles.image1"
        :style="{
          backgroundImage: `url(${props.image1})`
        }"
      />
    </div>
    <div :class="styles.col2">
      <div
        :class="styles.image2"
        :style="{
          backgroundImage: `url(${props.image2})`
        }"
      />
      <div
        :class="styles.symbol"
        :style="{
          backgroundColor: props.bgColor,
          opacity: 0.1
        }"
      />
    </div>
  </div>
</template>
