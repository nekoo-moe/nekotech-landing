<script setup lang="ts">
/**
 * Trajectory — the org's history and its schedule as one line.
 *
 * The old build had these as two sections (OrgTimeline for the past, a
 * scroll-jacking OrgRoadmap for the future) using two different metaphors for
 * the same idea. They are one thing: a sequence of dated milestones. So this
 * is one vertical spine, split only by a "shipped / next" marker at the point
 * where history ends and the plan begins.
 *
 * The spine is drawn by the scroll rather than being a static border: the line
 * advances as the reader descends, which is the whole point of a timeline and
 * was the thing missing when it was just a 1px column. The threshold between
 * shipped and planned is the one moment in the section that gets held — a
 * labelled full-width rule, not a hairline.
 *
 * `shipped` is not translated copy — it is a fact about each milestone — so it
 * lives here, not in the locale.
 *
 * The section sits on a `DotWaveField` — a contained dot lattice with a wave
 * crossing it. A timeline is a measured sequence, so graph paper with time
 * moving through it is the honest background for one; it also stops the
 * section reading as copy floating on the bare page canvas.
 */
import { computed, ref } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { useScrollProgress } from '@/composables/useScrollProgress';
import SectionHead from '@/components/shared/SectionHead.vue';
import DotWaveField from '@/components/shared/DotWaveField.vue';

const { t } = useLanguage();

const order = [
  { id: 'founded', shipped: true },
  { id: 'firstShip', shipped: true },
  { id: 'growth', shipped: true },
  { id: 'nekoaiBeta', shipped: false },
  { id: 'nekostreamLaunch', shipped: false },
  { id: 'platform', shipped: false },
] as const;

const milestones = computed(() =>
  order.map((m, i) => {
    const data = t.value.trajectory.items[m.id];
    // The divider prints once, on the first future milestone.
    const prevShipped = i > 0 ? order[i - 1].shipped : true;
    return {
      ...m,
      ...data,
      isFirstNext: m.shipped === false && prevShipped === true,
    };
  })
);

/* The travelling spine is measured against the milestone list, so it reaches
   the bottom exactly as the last milestone is read. */
const spine = ref<HTMLElement | null>(null);
useScrollProgress(spine, { start: 0.8, end: 0.5 });
</script>

<template>
  <section id="trajectory" class="tj section section--ruled" aria-labelledby="tj-heading">
    <DotWaveField :gap="28" :intensity="0.46" />

    <div class="container tj__inner">
      <SectionHead
        :label="t.trajectory.label"
        :heading="t.trajectory.heading"
        :lede="t.trajectory.lede"
        heading-id="tj-heading"
        index="07"
      />

      <ol ref="spine" class="tj__spine" role="list">
        <!-- One continuous rail behind every node, with a fill that advances on
             scroll. Drawing it here rather than per-item is what lets it run
             unbroken through the divider. -->
        <span class="tj__rail" aria-hidden="true">
          <span class="tj__rail-fill"></span>
        </span>

        <template v-for="m in milestones" :key="m.id">
          <li v-if="m.isFirstNext" class="tj__divider" aria-hidden="true">
            <span class="tj__divider-label">{{ t.trajectory.next }}</span>
          </li>

          <li class="tj__item" :class="{ 'tj__item--next': !m.shipped }" data-reveal>
            <div class="tj__marker" aria-hidden="true">
              <span class="tj__node"></span>
            </div>

            <div class="tj__content">
              <div class="tj__meta">
                <span class="tj__date num">{{ m.date }}</span>
                <span class="tj__flag">{{ m.shipped ? t.trajectory.shipped : t.trajectory.next }}</span>
              </div>
              <h3 class="tj__title">{{ m.title }}</h3>
              <p class="tj__body">{{ m.body }}</p>
            </div>
          </li>
        </template>
      </ol>
    </div>
  </section>
</template>

<style scoped>
/* The field is absolutely positioned against this, and the copy has to sit
   over it — hence the explicit stacking rather than relying on source order. */
.tj { position: relative; isolation: isolate; }
.tj__inner { position: relative; z-index: 1; }

.tj__spine {
  --sp: 0;
  position: relative;
  margin-left: var(--space-2);
}

/* ── Travelling rail ───────────────────────────────────────────────────── */
.tj__rail {
  position: absolute;
  /* Aligned to the centre of the 15px marker column. */
  left: 7px;
  top: 0.55em;
  bottom: 0.55em;
  width: 1px;
  background: var(--border);
  overflow: hidden;
}

.tj__rail-fill {
  position: absolute;
  inset: 0;
  /* Fades to accent at the leading edge — the tip of the line is the "now". */
  background: linear-gradient(to bottom, var(--ink-dim) 0%, var(--ink-dim) 82%, var(--accent) 100%);
  transform: scaleY(var(--sp));
  transform-origin: top;
}

.tj__item {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-8);
  padding-bottom: clamp(2.25rem, 4vw, 3.5rem);
}

.tj__item:last-child { padding-bottom: 0; }

/* ── Node ──────────────────────────────────────────────────────────────── */
.tj__marker {
  position: relative;
  width: 15px;
  display: flex;
  justify-content: center;
}

.tj__node {
  position: relative;
  z-index: 1;
  width: 11px;
  height: 11px;
  margin-top: 0.5em;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--border-strong);
  transition: border-color var(--duration-base) ease, background var(--duration-base) ease;
}

/* Shipped milestones read as filled; upcoming ones as hollow accent. */
.tj__item:not(.tj__item--next) .tj__node {
  background: var(--ink-dim);
  border-color: var(--ink-dim);
}

.tj__item--next .tj__node {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-wash);
}

/* Future milestones breathe — the section's one looping animation, and the
   only thing on the page that says "not done yet" without words. */
.tj__item--next .tj__node { animation: tj-breathe 3.2s var(--ease-cinematic) infinite; }

@keyframes tj-breathe {
  0%, 100% { box-shadow: 0 0 0 3px var(--accent-wash); }
  50% { box-shadow: 0 0 0 7px transparent; }
}

.is-in .tj__node { animation: tj-arrive var(--duration-slow) var(--ease-spring) both; }

@keyframes tj-arrive {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

/* ── Content ───────────────────────────────────────────────────────────── */
.tj__content {
  padding-top: 0.1em;
  transition: transform var(--duration-slow) var(--ease-out-quart);
}

/* Content slides in from the spine rather than simply fading — the reveal
   reads as the milestone docking onto the line. */
[data-reveal].tj__item .tj__content { transform: translateX(var(--space-4)); }
[data-reveal].tj__item.is-in .tj__content { transform: none; }

.tj__meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-2);
}

.tj__date {
  font-size: var(--text-2xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.tj__flag {
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--ink-faint);
}

.tj__item--next .tj__flag { color: var(--accent); }

.tj__title {
  font-size: var(--text-xl);
  letter-spacing: -0.025em;
  margin-bottom: var(--space-3);
}

.tj__body {
  font-size: var(--text-base);
  color: var(--ink-dim);
  max-width: 60ch;
  font-weight: 300;
}

/* ── Divider between shipped and next ──────────────────────────────────── */
.tj__divider {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) 0 clamp(2.25rem, 4vw, 3.5rem);
  margin-left: calc(-1 * var(--space-2));
}

/* A short accent tick that lines up with the rail, marking exactly where the
   past ends. The rail passes behind it. */
.tj__divider::before {
  content: '';
  width: 15px;
  height: 1px;
  background: var(--accent);
  flex-shrink: 0;
}

.tj__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, var(--accent-line), transparent);
}

.tj__divider-label {
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
  white-space: nowrap;
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .tj__item { gap: var(--space-5); }
  .tj__title { font-size: var(--text-lg); }
}

@media (prefers-reduced-motion: reduce) {
  .tj__item--next .tj__node { animation: none; }
  [data-reveal].tj__item .tj__content { transform: none; }
}
</style>
