<script setup lang="ts">
/**
 * Work — the four products.
 *
 * Editorial rows rather than a bento grid. Four items do not fill a grid
 * evenly, and a grid forces every summary into the same box height, which
 * means padding the short ones. Rows let each item be as long as it is.
 *
 * The rows carry a cursor-tracked highlight and an oversized ghost numeral
 * that slides in behind the name. A static list of four rows was the flattest
 * thing on the page; the point of both effects is that the row the reader is
 * pointing at is visibly the live one.
 *
 * Copy lives in `t.work.items`; everything non-translatable (names, status,
 * links) lives here, because a product name is not a translation.
 */
import { computed } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { useSpotlight } from '@/composables/useSpotlight';
import SectionHead from '@/components/shared/SectionHead.vue';

const { t } = useLanguage();
const { onPointerMove, onPointerLeave } = useSpotlight();

type Status = 'active' | 'development' | 'planned';

interface Product {
  /** Indexes into `t.work.items` — the compiler catches a typo here. */
  id: 'nekoai' | 'nekostream' | 'nekostreamCli' | 'fujiwara';
  name: string;
  status: Status;
  href: string | null;
}

const products: Product[] = [
  { id: 'nekoai', name: 'NekoAI', status: 'development', href: null },
  { id: 'nekostream', name: 'NekoStream', status: 'planned', href: null },
  {
    id: 'nekostreamCli',
    name: 'NekoStream CLI',
    status: 'development',
    href: 'https://github.com/nekoo-moe/NekoStream-CLI',
  },
  { id: 'fujiwara', name: 'Fujiwara Shin', status: 'active', href: null },
];

const rows = computed(() =>
  products.map((p, i) => ({
    ...p,
    index: String(i + 1).padStart(2, '0'),
    tag: t.value.work.items[p.id].tag,
    summary: t.value.work.items[p.id].summary,
    statusLabel: t.value.work.statuses[p.status],
  }))
);
</script>

<template>
  <section id="work" class="wk section section--ruled" aria-labelledby="wk-heading">
    <div class="container">
      <SectionHead
        :label="t.work.label"
        :heading="t.work.heading"
        :lede="t.work.lede"
        heading-id="wk-heading"
        index="02"
      />

      <ol class="wk__list" role="list">
        <li
          v-for="row in rows"
          :key="row.id"
          class="wk__row"
          :class="{ 'wk__row--linked': row.href }"
          data-reveal
          @pointermove="onPointerMove"
          @pointerleave="onPointerLeave"
        >
          <span class="wk__glow" aria-hidden="true"></span>
          <span class="wk__ghost num" aria-hidden="true">{{ row.index }}</span>

          <component
            :is="row.href ? 'a' : 'div'"
            v-bind="row.href ? { href: row.href, target: '_blank', rel: 'noreferrer noopener' } : {}"
            class="wk__inner"
          >
            <span class="wk__index num" aria-hidden="true">{{ row.index }}</span>

            <div class="wk__body">
              <div class="wk__title-line">
                <h3 class="wk__name">{{ row.name }}</h3>
                <span class="wk__tag">{{ row.tag }}</span>
              </div>
              <p class="wk__summary">{{ row.summary }}</p>
            </div>

            <div class="wk__meta">
              <span class="wk__status" :data-status="row.status">
                <span class="wk__status-dot" aria-hidden="true"></span>
                {{ row.statusLabel }}
              </span>
              <span v-if="row.href" class="wk__arrow" aria-hidden="true">↗</span>
              <span v-if="row.href" class="sr-only">({{ t.a11y.externalLink }})</span>
            </div>
          </component>

          <span class="wk__rule" aria-hidden="true"></span>
        </li>
      </ol>

      <router-link to="/projects" class="wk__side link-u" data-reveal>
        {{ t.work.sideProjectsCta }}
        <span aria-hidden="true">→</span>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.wk__list { border-top: 1px solid var(--border); }

.wk__row {
  --mx: 50%;
  --my: 50%;
  position: relative;
  isolation: isolate;
}

/* Cursor-tracked wash. Sits below the content (z-index on .wk__inner) and is
   wide and soft enough to read as light rather than as a shape. */
.wk__glow {
  position: absolute;
  inset: 0;
  z-index: -2;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(
    26rem circle at var(--mx) var(--my),
    oklch(0.30 0 0 / 0.55),
    transparent 68%
  );
  transition: opacity var(--duration-base) ease;
}

.wk__row:hover .wk__glow { opacity: 1; }

/* Oversized index sitting behind the row, pinned to the right. It slides in
   from further right on hover — the depth cue that makes the row feel like a
   plate with something behind it. */
.wk__ghost {
  position: absolute;
  z-index: -1;
  top: 50%;
  right: var(--space-4);
  font-size: clamp(4rem, 9vw, 7.5rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
  color: oklch(1 0 0 / 0.028);
  pointer-events: none;
  user-select: none;
  transform: translate(1.5rem, -50%);
  opacity: 0;
  transition:
    transform var(--duration-slow) var(--ease-cinematic),
    opacity var(--duration-slow) ease;
}

.wk__row:hover .wk__ghost { transform: translate(0, -50%); opacity: 1; }

.wk__inner {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--space-6) var(--space-8);
  align-items: start;
  padding-block: clamp(1.75rem, 3.2vw, 2.75rem);
}

/* The whole row lifts on hover, not just the link text — the row *is* the
   target, so the affordance has to cover it. */
.wk__row--linked .wk__inner {
  transition: padding-left var(--duration-base) var(--ease-out-quart);
}

.wk__row--linked:hover .wk__inner { padding-left: var(--space-3); }

.wk__index {
  font-size: var(--text-2xs);
  letter-spacing: 0.1em;
  color: var(--ink-faint);
  padding-top: 0.55em;
  transition: color var(--duration-base) ease;
}

.wk__row--linked:hover .wk__index { color: var(--accent); }

.wk__body { display: flex; flex-direction: column; gap: var(--space-3); }

.wk__title-line {
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.wk__name {
  font-size: var(--text-2xl);
  letter-spacing: -0.032em;
  transition: transform var(--duration-base) var(--ease-out-quart);
}

.wk__row--linked:hover .wk__name { transform: translateX(2px); }

.wk__tag {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--muted);
  padding: 0.28em 0.7em;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  white-space: nowrap;
}

.wk__summary {
  font-size: var(--text-base);
  color: var(--ink-dim);
  max-width: 62ch;
  font-weight: 300;
}

.wk__meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-top: 0.5em;
}

.wk__status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.13em;
  white-space: nowrap;
  color: var(--muted);
}

.wk__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
}

/* Status is data, so it gets the status hues rather than the brand accent. */
.wk__status[data-status="active"] { color: var(--ok); }
.wk__status[data-status="development"] { color: var(--warn); }
.wk__status[data-status="planned"] { color: var(--idle); }

/* Live means live: the only looping animation in this section. */
.wk__status[data-status="active"] .wk__status-dot {
  animation: wk-pulse 2.4s var(--ease-cinematic) infinite;
}

@keyframes wk-pulse {
  0%, 100% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
  70% { box-shadow: 0 0 0 5px transparent; opacity: 0.75; }
}

.wk__arrow {
  font-size: var(--text-sm);
  color: var(--ink-faint);
  transition: color var(--duration-fast) ease, transform var(--duration-base) var(--ease-out-quart);
}

.wk__row--linked:hover .wk__arrow { color: var(--accent); transform: translate(2px, -2px); }

/* Rule under each row, drawn from the left on hover in accent. */
.wk__rule {
  display: block;
  height: 1px;
  background: var(--border);
  position: relative;
}

.wk__rule::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent-line);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-slow) var(--ease-out-quart);
}

.wk__row--linked:hover .wk__rule::after { transform: scaleX(1); }

.wk__side {
  display: inline-flex;
  margin-top: var(--space-10);
  font-size: var(--text-sm);
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 860px) {
  .wk__inner {
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--space-4) var(--space-5);
  }
  /* Status moves under the copy rather than squeezing a third column. */
  .wk__meta { grid-column: 2; padding-top: 0; }
  .wk__name { font-size: var(--text-xl); }
}

@media (prefers-reduced-motion: reduce) {
  .wk__status[data-status="active"] .wk__status-dot { animation: none; }
  /* Both hover effects are pure motion, so they go rather than snap. */
  .wk__ghost, .wk__glow { display: none; }
}
</style>
