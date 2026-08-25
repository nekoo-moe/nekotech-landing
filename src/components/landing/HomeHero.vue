<script setup lang="ts">
/**
 * Hero. The terrain sits *behind* the type and is inert to the pointer, so a
 * CTA is never stolen by the canvas — the old Spline iframe had that bug.
 *
 * Reveal is local rather than scroll-driven: the hero is above the fold, so
 * waiting for an IntersectionObserver would mean a frame of empty page.
 */
import { ref, onMounted } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { scrollToHash } from '@/composables/useSectionNav';
import { prefersReducedMotion } from '@/composables/useCanvasScene';
import TerrainField from '@/components/three/TerrainField.vue';

const { t } = useLanguage();

const shown = ref(false);

onMounted(() => {
  // Two frames: one for layout, one so the transition has a start state.
  requestAnimationFrame(() => requestAnimationFrame(() => { shown.value = true; }));
});

const still = prefersReducedMotion();
</script>

<template>
  <section id="home" class="hero" aria-labelledby="hero-heading">
    <div class="hero__stage" aria-hidden="true">
      <TerrainField />
      <div class="hero__veil"></div>
    </div>

    <div class="hero__inner container" :class="{ 'is-shown': shown || still }">
      <p class="hero__eyebrow label label--accent">{{ t.hero.eyebrow }}</p>

      <h1 id="hero-heading" class="hero__heading">
        <span v-for="(line, i) in t.hero.headline" :key="i" class="hero__line">
          <span class="hero__line-in" :style="{ '--i': i }">{{ line }}</span>
        </span>
      </h1>

      <p class="hero__lede">{{ t.hero.lede }}</p>

      <div class="hero__ctas">
        <button class="btn btn--solid" type="button" @click="scrollToHash('#work')">
          {{ t.hero.primaryCta }}
        </button>
        <button class="btn btn--outline" type="button" @click="scrollToHash('#contact')">
          {{ t.hero.secondaryCta }}
        </button>
      </div>
    </div>

    <p class="hero__hint" :class="{ 'is-shown': shown || still }">
      <span class="hero__hint-rail" aria-hidden="true"></span>
      {{ t.a11y.scrollHint }}
    </p>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: clip;
  border-bottom: 1px solid var(--border);
}

/* ── Canvas layer ──────────────────────────────────────────────────────── */
.hero__stage {
  position: absolute;
  inset: 0;
  z-index: var(--z-canvas);
  pointer-events: none;
}

/* Reads the terrain out of the way of the type on the left, and fades it
   into the section seam at the bottom. */
.hero__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right,
      var(--bg) 0%,
      oklch(0.055 0 0 / 0.86) 34%,
      oklch(0.055 0 0 / 0.22) 62%,
      transparent 100%),
    linear-gradient(to bottom, var(--bg) 0%, transparent 22%, transparent 74%, var(--bg) 100%);
}

/* ── Type layer ────────────────────────────────────────────────────────── */
.hero__inner {
  position: relative;
  z-index: var(--z-base);
  width: 100%;
  padding-top: calc(var(--header-h) + var(--space-16));
  padding-bottom: var(--space-24);
}

.hero__eyebrow,
.hero__lede,
.hero__ctas {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity var(--duration-slow) var(--ease-cinematic),
    transform var(--duration-slow) var(--ease-cinematic);
}

.is-shown .hero__eyebrow { opacity: 1; transform: none; }
.is-shown .hero__lede    { opacity: 1; transform: none; transition-delay: 520ms; }
.is-shown .hero__ctas    { opacity: 1; transform: none; transition-delay: 640ms; }

.hero__eyebrow { margin-bottom: var(--space-8); }

.hero__heading {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.035em;
  color: var(--ink);
  margin-bottom: var(--space-10);
  max-width: 18ch;
}

/* Masked line reveal, authored per line so a language switch re-runs it. */
.hero__line {
  display: block;
  overflow: hidden;
  /* Descenders would otherwise be clipped by the mask. */
  padding-bottom: 0.10em;
  margin-bottom: -0.10em;
}

.hero__line-in {
  display: block;
  transform: translateY(105%);
  transition: transform 1s var(--ease-cinematic);
  transition-delay: calc(var(--i) * 110ms + 120ms);
}

.is-shown .hero__line-in { transform: none; }

/* Last line carries the one accent mark in the viewport. */
.hero__line:last-child .hero__line-in::after {
  content: '';
  display: inline-block;
  width: 0.34em;
  height: 0.34em;
  margin-left: 0.22em;
  vertical-align: 0.12em;
  background: var(--accent);
}

.hero__lede {
  font-size: var(--text-lg);
  line-height: 1.5;
  font-weight: 300;
  color: var(--ink-dim);
  max-width: 52ch;
  margin-bottom: var(--space-12);
  text-wrap: pretty;
}

.hero__ctas {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

/* ── Scroll hint ───────────────────────────────────────────────────────── */
.hero__hint {
  position: absolute;
  left: var(--gutter);
  bottom: var(--space-8);
  z-index: var(--z-base);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--ink-faint);
  opacity: 0;
  transition: opacity var(--duration-slower) var(--ease-cinematic) 900ms;
}

.hero__hint.is-shown { opacity: 1; }

.hero__hint-rail {
  width: 46px;
  height: 1px;
  background: linear-gradient(to right, var(--border-strong), transparent);
  position: relative;
  overflow: hidden;
}

.hero__hint-rail::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent);
  transform-origin: left;
  animation: hint-sweep 2.6s var(--ease-cinematic) infinite;
}

@keyframes hint-sweep {
  0%       { transform: scaleX(0); opacity: 0; }
  35%      { transform: scaleX(1); opacity: 1; }
  70%, 100%{ transform: scaleX(1); opacity: 0; transform-origin: right; }
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 960px) {
  .hero__heading { max-width: 14ch; }
  .hero__veil {
    background:
      linear-gradient(to bottom,
        var(--bg) 0%,
        oklch(0.055 0 0 / 0.78) 30%,
        oklch(0.055 0 0 / 0.40) 60%,
        var(--bg) 100%);
  }
}

@media (max-width: 640px) {
  .hero__ctas { flex-direction: column; align-items: stretch; }
  .hero__hint { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero__eyebrow,
  .hero__lede,
  .hero__ctas,
  .hero__line-in {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .hero__hint { opacity: 1; transition: none; }
  .hero__hint-rail::after { animation: none; transform: scaleX(0.4); opacity: 1; }
}
</style>
