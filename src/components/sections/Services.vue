<script setup lang="ts">
/**
 * Services — the commercial section, and the only place on this page that
 * sells something rather than reporting it.
 *
 * It is a slideshow because the pitch has four distinct claims and stacking
 * them as four paragraphs makes each one weaker: the reader skims and takes
 * none. One panel at a time means one claim at a time.
 *
 * The mechanics worth knowing:
 *   · autoplay with a visible progress bar, so the movement is explained
 *     rather than surprising. Any interaction stops it permanently — a
 *     carousel that resumes after the reader took control is a carousel
 *     fighting the reader.
 *   · panels cross-fade with a slight scale and slide. Each panel parks on the
 *     side it belongs to — `--dir` is derived from its index relative to the
 *     active one, not from the direction of the last click — so the outgoing
 *     panel always leaves the way the strip is moving without any extra state.
 *   · the outgoing panel is still in the DOM during the transition; every panel
 *     is absolutely positioned inside a stage whose height comes from an
 *     invisible measuring stack, so nothing reflows mid-fade.
 *   · keyboard is a real target: arrows move panels when the stage has focus.
 *   · reduced motion drops autoplay and the transform, keeping the fade.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { scrollToHash } from '@/composables/useSectionNav';
import { prefersReducedMotion } from '@/composables/useCanvasScene';
import SectionHead from '@/components/shared/SectionHead.vue';

const { t } = useLanguage();

const slides = computed(() => t.value.services.slides);
const count = computed(() => slides.value.length);

const active = ref(0);
/** Set once the reader touches anything; autoplay never comes back. */
const taken = ref(false);

const reduced = prefersReducedMotion();
const AUTOPLAY_MS = 7000;

let timer = 0;

const stop = () => {
  if (timer) { clearInterval(timer); timer = 0; }
};

const start = () => {
  if (reduced || taken.value || timer) return;
  timer = window.setInterval(() => { step(1); }, AUTOPLAY_MS);
};

/** Move `delta` panels, wrapping. */
function step(delta: 1 | -1) {
  active.value = (active.value + delta + count.value) % count.value;
}

/** Any deliberate move by the reader: take over and stop the clock. */
function take(delta: 1 | -1) {
  taken.value = true;
  stop();
  step(delta);
}

function goTo(index: number) {
  if (index === active.value) return;
  taken.value = true;
  stop();
  active.value = index;
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight') { event.preventDefault(); take(1); }
  else if (event.key === 'ArrowLeft') { event.preventDefault(); take(-1); }
};

/* Autoplay only runs while the section is actually on screen — a carousel
   advancing in a scrolled-past section is pure wasted work, and the reader
   would come back to a panel they never saw start. */
const root = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (reduced || !root.value) return;
  observer = new IntersectionObserver(
    entries => { entries.some(e => e.isIntersecting) ? start() : stop(); },
    { threshold: 0.35 }
  );
  observer.observe(root.value);
});

onBeforeUnmount(() => {
  stop();
  observer?.disconnect();
});

const dotLabel = (i: number) => t.value.services.goTo.replace('{n}', String(i + 1));
</script>

<template>
  <section
    id="services"
    ref="root"
    class="sv section section--ruled"
    aria-labelledby="sv-heading"
  >
    <div class="container">
      <SectionHead
        :label="t.services.label"
        :heading="t.services.heading"
        :lede="t.services.lede"
        heading-id="sv-heading"
        index="05"
      />

      <!-- ── Product lockup + the pitch ───────────────────────────────────── -->
      <div class="sv__lockup" data-reveal>
        <div class="sv__product">
          <span class="sv__product-name">{{ t.services.productName }}</span>
          <span class="sv__product-tag">{{ t.services.productTag }}</span>
        </div>
        <p class="sv__pitch">{{ t.services.pitch }}</p>
      </div>

      <!-- ── Slideshow ────────────────────────────────────────────────────── -->
      <div
        class="sv__show"
        data-reveal
        style="--i: 1"
        tabindex="0"
        role="group"
        :aria-roledescription="t.services.label"
        :aria-label="t.services.productName"
        @keydown="onKeydown"
        @pointerenter="stop"
        @pointerleave="start"
      >
        <div class="sv__stage">
          <!-- Invisible measuring stack: every panel stacked into one grid cell,
               so the stage is as tall as the tallest panel and never resizes as
               panels change. -->
          <div class="sv__measure" aria-hidden="true">
            <article v-for="(s, i) in slides" :key="`m-${i}`" class="sv__panel sv__panel--ghost">
              <p class="sv__kicker">{{ s.kicker }}</p>
              <h3 class="sv__title">{{ s.title }}</h3>
              <p class="sv__body">{{ s.body }}</p>
            </article>
          </div>

          <article
            v-for="(s, i) in slides"
            :key="i"
            :id="`sv-panel-${i}`"
            class="sv__panel"
            :class="{ 'is-active': i === active }"
            :style="{ '--dir': i < active ? -1 : 1 }"
            role="tabpanel"
            :aria-labelledby="`sv-tab-${i}`"
            :aria-hidden="i !== active"
            :inert="i !== active ? '' : undefined"
          >
            <p class="sv__kicker">
              <span class="sv__kicker-idx num">{{ String(i + 1).padStart(2, '0') }}</span>
              {{ s.kicker }}
            </p>
            <h3 class="sv__title">{{ s.title }}</h3>
            <p class="sv__body">{{ s.body }}</p>
          </article>

          <!-- Panel-count numeral, bled into the corner of the stage. -->
          <span class="sv__counter num" aria-hidden="true">
            {{ String(active + 1).padStart(2, '0') }}<span>/{{ String(count).padStart(2, '0') }}</span>
          </span>
        </div>

        <!-- ── Controls ───────────────────────────────────────────────────── -->
        <div class="sv__controls">
          <div class="sv__dots" role="tablist" :aria-label="t.services.productName">
            <button
              v-for="(s, i) in slides"
              :key="i"
              :id="`sv-tab-${i}`"
              class="sv__dot"
              :class="{ 'is-on': i === active }"
              type="button"
              role="tab"
              :aria-selected="i === active"
              :aria-controls="`sv-panel-${i}`"
              :aria-label="dotLabel(i)"
              @click="goTo(i)"
            >
              <!-- Only the live dot runs the timer bar, and only while
                   autoplay is still in charge. -->
              <span
                class="sv__dot-fill"
                :class="{ 'is-running': i === active && !taken && !reduced }"
                aria-hidden="true"
              ></span>
            </button>
          </div>

          <div class="sv__arrows">
            <button
              class="sv__arrow"
              type="button"
              :aria-label="t.services.prev"
              @click="take(-1)"
            >←</button>
            <button
              class="sv__arrow"
              type="button"
              :aria-label="t.services.next"
              @click="take(1)"
            >→</button>
          </div>
        </div>
      </div>

      <!-- ── CTA ──────────────────────────────────────────────────────────── -->
      <div class="sv__cta" data-reveal style="--i: 2">
        <button class="btn btn--solid" type="button" @click="scrollToHash('#contact')">
          {{ t.services.cta }}
          <span aria-hidden="true">→</span>
        </button>
        <p class="sv__cta-note">{{ t.services.ctaNote }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Lockup ────────────────────────────────────────────────────────────── */
.sv__lockup {
  display: grid;
  grid-template-columns: minmax(0, 0.42fr) minmax(0, 1fr);
  gap: var(--space-8) var(--space-16);
  align-items: start;
  padding-bottom: clamp(2rem, 4vw, 3rem);
  border-bottom: 1px solid var(--border);
  margin-bottom: clamp(2rem, 4vw, 3rem);
}

.sv__product { display: flex; flex-direction: column; gap: var(--space-2); }

.sv__product-name {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.045em;
  color: var(--ink);
}

.sv__product-tag {
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--accent);
}

.sv__pitch {
  font-size: var(--text-lg);
  font-weight: 300;
  line-height: 1.55;
  color: var(--ink-dim);
  max-width: 56ch;
}

/* ── Show shell ────────────────────────────────────────────────────────── */
.sv__show { position: relative; }

.sv__show:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 6px;
  border-radius: var(--radius-lg);
}

.sv__stage {
  position: relative;
  overflow: hidden;
  padding: clamp(2rem, 4.5vw, 3.75rem);
  /* Lit from the top-left like the showcase plates, so the two sections read
     as the same material. */
  background:
    linear-gradient(
      152deg,
      oklch(0.155 0 0) 0%,
      oklch(0.115 0 0) 48%,
      oklch(0.090 0 0) 100%
    );
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

/* An accent rail down the left edge of the stage — the one accent fill in the
   section, and the thing that marks this plate as the commercial one. */
.sv__stage::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--accent), transparent 72%);
}

/* The measuring stack sets the height; it is never seen. Every ghost shares
   one grid cell, so the row resolves to the tallest of them — stacking them in
   flow would have measured their sum, and `:first-child` only their first. */
.sv__measure {
  display: grid;
  visibility: hidden;
  pointer-events: none;
}

.sv__measure .sv__panel--ghost {
  position: static;
  inset: auto;
  grid-area: 1 / 1;
  opacity: 1;
  transform: none;
  transition: none;
}

/* Every real panel is layered over the measured box. */
.sv__panel {
  position: absolute;
  inset: clamp(2rem, 4.5vw, 3.75rem);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  opacity: 0;
  /* Leans in from the direction of travel. `--dir` is written by the script. */
  transform: translate3d(calc(var(--dir, 1) * 2.5rem), 0, 0) scale(0.985);
  transition:
    opacity var(--duration-slow) var(--ease-cinematic),
    transform var(--duration-slower) var(--ease-cinematic);
  pointer-events: none;
}

.sv__panel.is-active {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}

.sv__kicker {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
}

.sv__kicker-idx { color: var(--accent); letter-spacing: 0.08em; }

.sv__title {
  font-size: var(--text-2xl);
  letter-spacing: -0.035em;
  max-width: 22ch;
}

.sv__body {
  font-size: var(--text-base);
  font-weight: 300;
  color: var(--ink-dim);
  max-width: 54ch;
}

.sv__counter {
  position: absolute;
  top: clamp(1.25rem, 2.5vw, 2rem);
  right: clamp(1.25rem, 2.5vw, 2rem);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
  pointer-events: none;
}

.sv__counter span { color: var(--ink-faint); font-weight: 500; }

/* ── Controls ──────────────────────────────────────────────────────────── */
.sv__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  margin-top: var(--space-5);
}

.sv__dots { display: flex; align-items: center; gap: var(--space-3); flex: 1; }

/* Dots are bars, not circles: a bar can carry the autoplay timer, which is
   what makes the movement feel scheduled instead of random. */
.sv__dot {
  position: relative;
  flex: 1;
  max-width: 5.5rem;
  height: 2px;
  padding: 0;
  background: var(--border);
  overflow: hidden;
  transition: background var(--duration-fast) ease;
}

/* The hit target is 2px tall; give it a real one without moving the bar. */
.sv__dot::after {
  content: '';
  position: absolute;
  inset: -0.75rem 0;
}

.sv__dot:hover { background: var(--border-strong); }

.sv__dot-fill {
  position: absolute;
  inset: 0;
  background: var(--ink-dim);
  transform: scaleX(0);
  transform-origin: left;
}

.sv__dot.is-on .sv__dot-fill { transform: scaleX(1); background: var(--ink); }

/* While autoplay owns the panel, the bar fills over the dwell time. Keyed off
   a class so restarting the animation is a class toggle, not a style write. */
.sv__dot-fill.is-running {
  background: var(--accent);
  animation: sv-timer 7000ms linear both;
}

@keyframes sv-timer {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.sv__arrows { display: flex; gap: var(--space-2); flex-shrink: 0; }

.sv__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  font-size: var(--text-sm);
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition:
    color var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    background var(--duration-fast) ease;
}

.sv__arrow:hover {
  color: var(--ink);
  border-color: var(--border-strong);
  background: var(--bg-raised);
}

/* ── CTA ───────────────────────────────────────────────────────────────── */
.sv__cta {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex-wrap: wrap;
  margin-top: clamp(2rem, 4vw, 3rem);
}

.sv__cta-note {
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--ink-faint);
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .sv__lockup { grid-template-columns: 1fr; }
  .sv__pitch { font-size: var(--text-base); }
}

@media (max-width: 620px) {
  .sv__title { font-size: var(--text-xl); max-width: none; }
  .sv__counter { display: none; }
  .sv__controls { flex-direction: column; align-items: stretch; }
  .sv__arrows { justify-content: flex-end; }
}

@media (prefers-reduced-motion: reduce) {
  /* Keep the cross-fade, drop the travel — and the timer bar never runs
     because autoplay is off. */
  .sv__panel { transform: none; }
  .sv__dot-fill.is-running { animation: none; }
}
</style>
