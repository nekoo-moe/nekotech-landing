<script setup lang="ts">
import styles from './CareerItem/styles.module.scss';
import LocationPin from '@/components/icons/LocationPin.vue';
import MoneyCheck from '@/components/icons/MoneyCheck.vue';

const props = defineProps<{
  title: string;
  description: string;
  contestlink: string;
  website: string;
  mailadress: string;
  websiteLink: string;
  mailadressLink: string;
}>();
</script>

<template>
  <div :class="styles.outer">
    <div :class="styles.inner">
      <div :class="styles.title">
        {{ props.title }}
      </div>
      <div :class="styles.description">
        {{ props.description }}
      </div>
      <div :class="styles.controls">
        <div :class="styles.btn">
          <a :href="props.contestlink" :class="styles.contest">Check out the project</a>
        </div>
      </div>
      <div :class="styles.meta">
        <div :class="styles.salary">
          <MoneyCheck />
          <a :href="props.mailadressLink" :class="styles.contesttime">{{ props.mailadress }}</a>
        </div>
        <div :class="styles.location">
          <LocationPin />
          <a :href="props.websiteLink" :class="styles.contesttime">{{ props.website }}</a>
        </div>
      </div>
      <div :class="styles.positionHaunted">
        {{ props.title.split('(')[0].trim() }}
      </div>
    </div>
  </div>
</template>
