<script setup lang="ts">
import AppHeader from '@/components/shared/Header.vue';
import HomeHero from '@/components/landing/HomeHero.vue';
import OrgStats from '@/components/sections/OrgStats.vue';
import Services from '@/components/sections/Services.vue';
import OrgTimeline from '@/components/sections/OrgTimeline.vue';
import OrgRoadmap from '@/components/sections/OrgRoadmap.vue';
import Partners from '@/components/sections/Partners.vue';
import Team from '@/components/sections/Team.vue';
import Careers from '@/components/sections/Careers.vue';
import OpenSourceCTA from '@/components/sections/OpenSourceCTA.vue';
</script>

<template>
  <main>
    <AppHeader />
    <HomeHero />
    <OrgStats />
    <Services />
    <OrgTimeline />
    <OrgRoadmap />
    <Partners />
    <Team />
    <Careers />
    <OpenSourceCTA />
  </main>
</template>
