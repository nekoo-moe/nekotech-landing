<script setup lang="ts">
import styles from './styles.module.scss';

const props = defineProps<{
  date: string;
  index: number;
  activated: boolean;
  image: string;
  canGoNext: boolean;
  canGoPrev: boolean;
  slides: any[];
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'prev'): void;
}>();
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.figureContainer">
      <div
        :class="styles.figure"
        :style="{
          backgroundImage: `url('${props.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }"
        :key="props.index"
      >
        <div :class="styles.figureMeta">
          <div>
            {{ props.date }}
          </div>
        </div>
      </div>
    </div>
    <div :class="styles.controls">
      <div :class="styles.navigation">
        <div v-if="props.canGoPrev" :class="styles.btn" @click="emit('prev')">
          ← Previous
        </div>
        <div v-if="props.canGoNext" :class="styles.btn" @click="emit('next')">
          Next →
        </div>
      </div>
      <div :class="styles.dotsContainer">
        <div v-for="(slide, i) in props.slides" :key="i" :class="styles.dot">
          <div v-if="i === props.index" :class="styles.dotSelected" />
        </div>
      </div>
    </div>
  </div>
</template>
