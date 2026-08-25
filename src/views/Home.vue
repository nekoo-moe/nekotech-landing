<script setup lang="ts">
/**
 * Home. Section order is the argument the page makes: what we finished, who
 * vouches for us, the numbers behind it, what is being built, what we sell,
 * what we can be hired for, how we got here, who we are, how to reach us.
 *
 * `Showcase` leads because a stranger has no reason to care about a commit
 * count before they know something shipped — evidence first, metrics as
 * corroboration. `Services` sits directly under `Work` so the pitch lands
 * while the reader still has NekoAI in view.
 *
 * This order must match `NAV` in app.config.ts: the header's scroll-spy walks
 * that array in document order.
 */
import AppHeader from '@/components/shared/Header.vue';
import HomeHero from '@/components/landing/HomeHero.vue';
import Showcase from '@/components/sections/Showcase.vue';
import Partners from '@/components/sections/Partners.vue';
import Signal from '@/components/sections/Signal.vue';
import Work from '@/components/sections/Work.vue';
import Services from '@/components/sections/Services.vue';
import Capabilities from '@/components/sections/Capabilities.vue';
import Trajectory from '@/components/sections/Trajectory.vue';
import Team from '@/components/sections/Team.vue';
import Contact from '@/components/sections/Contact.vue';
</script>

<template>
  <AppHeader />

  <main id="main">
    <HomeHero />
    <Showcase />
    <Partners />
    <Signal />
    <Work />
    <Services />
    <Capabilities />
    <Trajectory />
    <Team />
    <Contact />
  </main>
</template>
