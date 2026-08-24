<script setup lang="ts">
/**
 * Home. Section order is the argument the page makes: what we ship, proof it
 * is real, what we can be hired for, how we got here, who vouches for us, who
 * we are, how to reach us.
 *
 * `Signal` sits directly after the hero on purpose — the numbers are the
 * cheapest evidence we have, so they come before any claim that needs them.
 */
import AppHeader from '@/components/shared/Header.vue';
import HomeHero from '@/components/landing/HomeHero.vue';
import Signal from '@/components/sections/Signal.vue';
import Work from '@/components/sections/Work.vue';
import Capabilities from '@/components/sections/Capabilities.vue';
import Trajectory from '@/components/sections/Trajectory.vue';
import Partners from '@/components/sections/Partners.vue';
import Team from '@/components/sections/Team.vue';
import Contact from '@/components/sections/Contact.vue';
</script>

<template>
  <AppHeader />

  <main id="main">
    <HomeHero />
    <Signal />
    <Work />
    <Capabilities />
    <Trajectory />
    <Partners />
    <Team />
    <Contact />
  </main>
</template>
