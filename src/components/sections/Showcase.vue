<script setup lang="ts">
/**
 * Showcase — the finished work, and the first thing the page argues.
 *
 * It sits above `Signal` because a stranger has no reason to care about a
 * commit count before they know anything shipped. Evidence first, metrics as
 * corroboration.
 *
 * Layout: a woven 12-column grid rather than a uniform card set. Items 1 and 4
 * take seven columns, items 2 and 3 take five, so the reading line shifts on
 * every row and the section never settles into a repeating template. Each plate
 * carries its own outlined numeral, and the result line — the only sentence in
 * the section that states an outcome — is pinned to the bottom edge behind an
 * accent tick.
 *
 * Copy lives in `t.showcase.items`; names, links and status do not get
 * translated, so they live here.
 */
import { computed } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { useSpotlight } from '@/composables/useSpotlight';
import SectionHead from '@/components/shared/SectionHead.vue';

const { t } = useLanguage();
const { onPointerMove, onPointerLeave } = useSpotlight();

const INVITE_BASE = 'https://discord.com/oauth2/authorize';

interface ShippedProject {
  /** Indexes into `t.showcase.items`. */
  id: 'nekobuckets' | 'nekomusics' | 'coffoxmc' | 'fujiwara';
  name: string;
  /** Outbound link, or null for client work with nothing public to visit. */
  href: string | null;
  /** Whether the thing is publicly reachable right now. */
  live: boolean;
  /** Column span on the 12-column grid — this is what breaks the template. */
  span: 7 | 5;
}

const projects: ShippedProject[] = [
  {
    id: 'nekobuckets',
    name: 'NekoBuckets',
    href: `${INVITE_BASE}?client_id=1372420632628822057&permissions=8&integration_type=0&scope=bot`,
    live: true,
    span: 7,
  },
  {
    id: 'nekomusics',
    name: 'NekoMusics',
    href: `${INVITE_BASE}?client_id=1427516379912994816&permissions=8&integration_type=0&scope=bot`,
    live: true,
    span: 5,
  },
  {
    id: 'coffoxmc',
    name: 'CoffoxMC',
    href: 'https://langbangvn.net',
    live: true,
    span: 5,
  },
  { id: 'fujiwara', name: 'Fujiwara Shin', href: null, live: false, span: 7 },
];

const items = computed(() =>
  projects.map((p, i) => ({
    ...p,
    index: String(i + 1).padStart(2, '0'),
    ...t.value.showcase.items[p.id],
  }))
);
</script>

<template>
  <section id="showcase" class="sc section" aria-labelledby="sc-heading">
    <div class="container">
      <SectionHead
        :label="t.showcase.label"
        :heading="t.showcase.heading"
        :lede="t.showcase.lede"
        heading-id="sc-heading"
        index="01"
      />

      <ul class="sc__grid" role="list">
        <li
          v-for="(p, i) in items"
          :key="p.id"
          class="sc__item"
          :data-span="p.span"
          data-reveal
          :style="{ '--i': i }"
        >
          <component
            :is="p.href ? 'a' : 'div'"
            v-bind="
              p.href
                ? { href: p.href, target: '_blank', rel: 'noreferrer noopener' }
                : {}
            "
            class="sc__plate"
            :class="{ 'sc__plate--linked': p.href }"
            @pointermove="onPointerMove"
            @pointerleave="onPointerLeave"
          >
            <span class="sc__glow" aria-hidden="true"></span>
            <span class="sc__numeral" aria-hidden="true">{{ p.index }}</span>

            <div class="sc__top">
              <span class="sc__tag">{{ p.tag }}</span>
              <span v-if="p.live" class="sc__live">
                <span class="sc__live-dot" aria-hidden="true"></span>
                {{ t.showcase.liveLabel }}
              </span>
            </div>

            <h3 class="sc__name">{{ p.name }}</h3>
            <p class="sc__summary">{{ p.summary }}</p>

            <p class="sc__result">
              <span class="sc__result-label">{{ t.showcase.resultLabel }}</span>
              <span class="sc__result-text">{{ p.result }}</span>
            </p>

            <span v-if="p.href" class="sc__go">
              {{ t.showcase.viewLabel }}
              <span aria-hidden="true">↗</span>
              <span class="sr-only">({{ t.a11y.externalLink }})</span>
            </span>
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* ── Grid ──────────────────────────────────────────────────────────────── */
.sc__grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-6);
}

/* The span is data on the item, not a nth-child rule, so reordering the array
   reorders the weave without touching CSS. */
.sc__item[data-span="7"] { grid-column: span 7; }
.sc__item[data-span="5"] { grid-column: span 5; }

/* ── Plate ─────────────────────────────────────────────────────────────── */
.sc__plate {
  --mx: 50%;
  --my: 50%;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
  padding: clamp(1.5rem, 2.6vw, 2.25rem);
  /* Not a flat surface: the plate is lit from its top-left corner, which is
     what stops four of these in a row from reading as four identical boxes. */
  background:
    linear-gradient(
      152deg,
      oklch(0.150 0 0) 0%,
      oklch(0.115 0 0) 46%,
      oklch(0.092 0 0) 100%
    );
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition:
    border-color var(--duration-base) ease,
    transform var(--duration-base) var(--ease-out-quart),
    box-shadow var(--duration-base) ease;
}

.sc__plate--linked:hover {
  border-color: var(--border-strong);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.sc__glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(
    22rem circle at var(--mx) var(--my),
    oklch(0.36 0 0 / 0.5),
    transparent 68%
  );
  transition: opacity var(--duration-base) ease;
}

.sc__plate:hover .sc__glow { opacity: 1; }

/* Outlined numeral, bled off the top-right corner. Outline rather than fill so
   it stays scenery: it is the only thing at that size on the plate. */
.sc__numeral {
  position: absolute;
  z-index: -1;
  top: -0.28em;
  right: 0.1em;
  font-family: var(--font-display);
  font-size: clamp(5rem, 11vw, 9rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
  color: transparent;
  -webkit-text-stroke: 1px oklch(1 0 0 / 0.055);
  pointer-events: none;
  user-select: none;
  transition:
    -webkit-text-stroke-color var(--duration-slow) ease,
    transform var(--duration-slow) var(--ease-cinematic);
}

.sc__plate--linked:hover .sc__numeral {
  -webkit-text-stroke-color: oklch(1 0 0 / 0.10);
  transform: translate(-0.06em, 0.04em);
}

/* ── Meta row ──────────────────────────────────────────────────────────── */
.sc__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.sc__tag {
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--muted);
}

.sc__live {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--ok);
  white-space: nowrap;
}

.sc__live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
  animation: sc-pulse 2.6s var(--ease-cinematic) infinite;
}

@keyframes sc-pulse {
  0%, 100% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
  70% { box-shadow: 0 0 0 5px transparent; opacity: 0.7; }
}

/* ── Copy ──────────────────────────────────────────────────────────────── */
.sc__name {
  font-size: var(--text-2xl);
  letter-spacing: -0.032em;
  transition: transform var(--duration-base) var(--ease-out-quart);
}

.sc__plate--linked:hover .sc__name { transform: translateX(2px); }

.sc__summary {
  font-size: var(--text-sm);
  font-weight: 300;
  color: var(--ink-dim);
  max-width: 52ch;
  /* Pushes the result line to the bottom edge whatever the summary length —
     the whole point of the woven grid is that the plates are not the same
     height, so the outcome has to be anchored rather than flow. */
  flex: 1;
}

/* ── Result ────────────────────────────────────────────────────────────── */
.sc__result {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  flex-wrap: wrap;
  padding-top: var(--space-4);
  border-top: 1px solid var(--hairline);
  max-width: none;
}

.sc__result-label {
  position: relative;
  padding-left: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--ink-faint);
  white-space: nowrap;
}

/* The section's single accent: a tick before the outcome, nothing else. */
.sc__result-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.42em;
  width: 5px;
  height: 5px;
  background: var(--accent);
}

.sc__result-text {
  font-size: var(--text-sm);
  color: var(--ink);
  font-weight: 400;
}

/* ── Link affordance ───────────────────────────────────────────────────── */
.sc__go {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  align-self: flex-start;
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--muted);
  transition: color var(--duration-fast) ease, gap var(--duration-base) var(--ease-out-quart);
}

.sc__plate--linked:hover .sc__go { color: var(--accent); gap: var(--space-3); }

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 1000px) {
  /* Two even columns: the weave needs the full 12 to be legible, and a
     6/6 split at least keeps two per row. */
  .sc__item[data-span="7"],
  .sc__item[data-span="5"] { grid-column: span 6; }
}

@media (max-width: 700px) {
  .sc__item[data-span="7"],
  .sc__item[data-span="5"] { grid-column: span 12; }
  .sc__name { font-size: var(--text-xl); }
}

@media (prefers-reduced-motion: reduce) {
  .sc__glow { display: none; }
  .sc__live-dot { animation: none; }
  .sc__plate--linked:hover { transform: none; }
}
</style>
