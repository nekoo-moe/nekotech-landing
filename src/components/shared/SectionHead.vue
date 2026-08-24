<script setup lang="ts">
/**
 * The section opener, used by every section on the home page.
 *
 * The previous version was a static two-column block: label, heading, lede,
 * all arriving in one fade. Six of those in a row is what made the page read
 * like a slide deck — every section played the same one-shot animation and
 * then sat still.
 *
 * This one is built from three moving parts:
 *   · a meter rule that tracks scroll position continuously, so the section
 *     is visibly *being* read rather than having been revealed
 *   · a heading that arrives word by word from behind a mask
 *   · an oversized index numeral that drifts against the scroll
 *
 * No accent colour is spent here. The design rule is that accent belongs to
 * state and interaction, so the life in this header has to come from motion,
 * scale and depth instead — which is also what the reference sites do.
 */
import { ref, computed } from 'vue';
import { useScrollProgress } from '@/composables/useScrollProgress';

const props = withDefaults(
  defineProps<{
    /** Eyebrow text, e.g. "Work". */
    label: string;
    /** Heading sentence. Split per word for the staggered mask reveal. */
    heading: string;
    /** Supporting paragraph. Optional — some sections lead with the heading. */
    lede?: string;
    /** Anchor id so the parent section can point `aria-labelledby` at it. */
    headingId: string;
    /** Two-digit section index, drawn oversized behind the label row. */
    index?: string;
    /** Heading level. Home sections are h2; the side-projects page uses h1. */
    as?: 'h1' | 'h2';
  }>(),
  { as: 'h2' }
);

const root = ref<HTMLElement | null>(null);
useScrollProgress(root, { start: 0.95, end: 0.45 });

/**
 * Words carry their own trailing space so the mask boxes can be inline-block
 * without collapsing the gaps between them.
 */
const words = computed(() => props.heading.split(/\s+/).filter(Boolean));
</script>

<template>
  <!-- `data-reveal="head"` only asks the shared observer for the `.is-in`
       flag; the word animation itself is defined below, not by the global
       reveal rules. -->
  <header ref="root" class="sh" data-reveal="head">
    <div class="sh__top">
      <p class="label label--accent sh__label" data-reveal>{{ label }}</p>

      <!-- Scroll meter: not decorative, it shows how far into the section the
           reader is. Aria-hidden because it duplicates no information. -->
      <span class="sh__meter" aria-hidden="true">
        <span class="sh__meter-fill"></span>
      </span>

      <span v-if="index" class="sh__index num" aria-hidden="true">{{ index }}</span>
    </div>

    <component :is="as" :id="headingId" class="sh__heading">
      <span
        v-for="(w, i) in words"
        :key="`${w}-${i}`"
        class="sh__word"
        :style="{ '--w': i }"
      >
        <span>{{ w }}</span>
      </span>
    </component>

    <p v-if="lede" class="sh__lede" data-reveal style="--i: 2">{{ lede }}</p>
  </header>
</template>

<style scoped>
.sh {
  --sp: 0;
  position: relative;
  margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
}

/* ── Top row: label · meter · index ────────────────────────────────────── */
.sh__top {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding-bottom: var(--space-5);
}

.sh__label { flex-shrink: 0; }

.sh__meter {
  position: relative;
  flex: 1;
  height: 1px;
  background: var(--border);
  overflow: hidden;
}

/* Driven by scroll, not by a transition — this is the one element on the page
   that keeps moving while the reader moves. */
.sh__meter-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, var(--border-strong), var(--ink-dim));
  transform: scaleX(var(--sp));
  transform-origin: left;
}

/* Oversized, low-contrast, and drifts up as the section is read. */
.sh__index {
  flex-shrink: 0;
  font-size: var(--text-lg);
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  line-height: 1;
  transform: translateY(calc((1 - var(--sp)) * 0.55rem));
  opacity: calc(0.35 + var(--sp) * 0.65);
}

/* ── Heading ───────────────────────────────────────────────────────────── */
.sh__heading {
  font-size: var(--text-3xl);
  max-width: 26ch;
}

/* One mask box per word. The padding/margin pair keeps descenders (g, y, p)
   from being clipped by the overflow. */
.sh__word {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.14em;
  margin-bottom: -0.14em;
  vertical-align: bottom;
}

/* Preserve the space between words: the boxes are inline-block, so the
   collapsed whitespace has to come back as a margin. */
.sh__word + .sh__word { margin-left: 0.26em; }

.sh__word > span {
  display: block;
  transform: translateY(105%);
  transition: transform var(--duration-slower) var(--ease-cinematic);
  /* Stagger runs on the word index, so a long heading unrolls rather than
     landing all at once. */
  transition-delay: calc(var(--w) * 55ms);
}

.sh.is-in .sh__word > span { transform: none; }

/* ── Lede ──────────────────────────────────────────────────────────────── */
.sh__lede {
  margin-top: var(--space-6);
  margin-left: auto;
  font-size: var(--text-lg);
  font-weight: 300;
  color: var(--muted);
  max-width: 46ch;
}

@media (max-width: 860px) {
  .sh__heading { max-width: none; }
  .sh__lede { font-size: var(--text-base); margin-left: 0; }
  .sh__index { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .sh__word > span { transform: none !important; }
  .sh__index { transform: none; opacity: 1; }
}
</style>
