<script setup lang="ts">
import styles from './SectionTitle.module.scss';
</script>

<template>
  <div :class="styles.wrapper">
    <div :class="styles.shadow">
      <slot />
    </div>
    <div :class="styles.title">
      <slot />
    </div>
  </div>
</template>
