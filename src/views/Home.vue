<script setup lang="ts">
import AppHeader from '@/components/shared/Header.vue';
import HomeHero from '@/components/landing/HomeHero.vue';
import Services from '@/components/sections/Services.vue';
import Team from '@/components/sections/Team.vue';
import Story from '@/components/sections/Story.vue';
import Careers from '@/components/sections/Careers.vue';
import Contact from '@/components/sections/Contact.vue';
</script>

<template>
  <main>
    <AppHeader />
    <HomeHero />
    <Services />
    <Team />
    <Story />
    <Careers />
    <Contact />
  </main>
</template>
