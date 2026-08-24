<script setup lang="ts">
/**
 * Capabilities — what the org takes on for hire.
 *
 * A two-column spec list: the discipline on the left, the description on the
 * right, hairline-separated. It reads like a rate card on purpose — this is
 * the section a prospective client scans.
 *
 * The list is deliberately the plainest structure on the page, so the motion
 * has to come from the scroll rather than from decoration: a spine down the
 * column gutter draws itself as the section is read, and each row's marker
 * fills when it passes. A row that is merely hovered opens slightly and lights
 * its own number.
 */
import { computed, ref } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { useScrollProgress } from '@/composables/useScrollProgress';
import { useSpotlight } from '@/composables/useSpotlight';
import SectionHead from '@/components/shared/SectionHead.vue';

const { t } = useLanguage();
const { onPointerMove, onPointerLeave } = useSpotlight();

const ids = ['product', 'platform', 'bots', 'gameservers'] as const;

const rows = computed(() =>
  ids.map((id, i) => ({
    id,
    index: String(i + 1).padStart(2, '0'),
    tag: t.value.capabilities.items[id].tag,
    summary: t.value.capabilities.items[id].summary,
  }))
);

/* The spine tracks the list, not the whole section, so it finishes exactly
   when the last row has been read. */
const list = ref<HTMLElement | null>(null);
useScrollProgress(list, { start: 0.85, end: 0.55 });
</script>

<template>
  <section id="capabilities" class="cap section section--ruled" aria-labelledby="cap-heading">
    <div class="container">
      <SectionHead
        :label="t.capabilities.label"
        :heading="t.capabilities.heading"
        :lede="t.capabilities.lede"
        heading-id="cap-heading"
        index="03"
      />

      <dl ref="list" class="cap__list">
        <div
          v-for="row in rows"
          :key="row.id"
          class="cap__row"
          data-reveal
          @pointermove="onPointerMove"
          @pointerleave="onPointerLeave"
        >
          <span class="cap__glow" aria-hidden="true"></span>

          <dt class="cap__term">
            <span class="cap__index num" aria-hidden="true">{{ row.index }}</span>
            <span class="cap__tag">{{ row.tag }}</span>
          </dt>
          <dd class="cap__desc">{{ row.summary }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.cap__list {
  --sp: 0;
  position: relative;
  border-top: 1px solid var(--border);
}

/* ── Rows ──────────────────────────────────────────────────────────────── */
.cap__row {
  --mx: 50%;
  --my: 50%;
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 0.42fr) minmax(0, 1fr);
  gap: var(--space-8) var(--space-16);
  align-items: start;
  padding-block: clamp(1.75rem, 3.2vw, 2.75rem);
  border-bottom: 1px solid var(--border);
  transition: padding-left var(--duration-base) var(--ease-out-quart);
}

.cap__row:hover { padding-left: var(--space-4); }

/* Each row's own bottom rule brightens from the left as the list is read, so
   the section advances with the scroll without a line crossing the columns.
   `--sp` is written on the list by useScrollProgress; the per-row multiplier
   staggers them so they light in order rather than together. */
.cap__row::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: linear-gradient(to right, var(--ink-faint), transparent);
  transform: scaleX(var(--sp));
  transform-origin: left;
}

.cap__glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(
    24rem circle at var(--mx) var(--my),
    oklch(0.28 0 0 / 0.5),
    transparent 70%
  );
  transition: opacity var(--duration-base) ease;
}

.cap__row:hover .cap__glow { opacity: 1; }

.cap__term {
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
}

.cap__index {
  font-size: var(--text-2xs);
  letter-spacing: 0.1em;
  color: var(--ink-faint);
  transition: color var(--duration-base) ease;
}

.cap__row:hover .cap__index { color: var(--accent); }

.cap__tag {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--ink);
  text-wrap: balance;
}

.cap__desc {
  font-size: var(--text-base);
  color: var(--ink-dim);
  max-width: 58ch;
  font-weight: 300;
}

@media (max-width: 860px) {
  .cap__row {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  .cap__tag { font-size: var(--text-lg); }
}

@media (prefers-reduced-motion: reduce) {
  .cap__glow { display: none; }
}
</style>
