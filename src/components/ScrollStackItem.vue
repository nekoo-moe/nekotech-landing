<script setup lang="ts">
const props = withDefaults(defineProps<{
  itemClassName?: string;
}>(), {
  itemClassName: ''
});
</script>

<template>
  <div class="scroll-stack-card" :class="props.itemClassName">
    <slot />
  </div>
</template>
