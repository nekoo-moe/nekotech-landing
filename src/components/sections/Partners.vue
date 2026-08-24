<script setup lang="ts">
/**
 * Partners — two, both real, both current.
 *
 * The old version hardcoded Vietnamese copy here, so the EN toggle left this
 * section untranslated. Everything textual now comes from `t.partners`; only
 * the URLs and logo assets live in the component.
 *
 * Two cards side by side is a layout with nowhere to hide, so the cards carry
 * the weight: a cursor-tracked light, a lift on hover, and a slow sheen that
 * crosses the logo lockup. Without those this was the emptiest plate on the
 * page.
 */
import { computed } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { scrollToHash } from '@/composables/useSectionNav';
import { useSpotlight } from '@/composables/useSpotlight';
import SectionHead from '@/components/shared/SectionHead.vue';
import langbangIcon from '@/assets/langbangvnicon.png';
import langbangText from '@/assets/textlangbangvn.png';

const { t } = useLanguage();
const { onPointerMove, onPointerLeave } = useSpotlight();

const links = {
  langbangvn: { site: 'https://langbangvn.net', discord: 'https://discord.langbangvn.net' },
  nekostudio: { site: 'https://dsc.gg/nekostudio', discord: 'https://dsc.gg/nekostudio' },
} as const;

const ids = ['langbangvn', 'nekostudio'] as const;

const partners = computed(() =>
  ids.map(id => ({ id, ...t.value.partners.items[id], ...links[id] }))
);
</script>

<template>
  <section id="partners" class="pt section section--ruled" aria-labelledby="pt-heading">
    <div class="container">
      <SectionHead
        :label="t.partners.label"
        :heading="t.partners.heading"
        :lede="t.partners.lede"
        heading-id="pt-heading"
        index="05"
      />

      <ul class="pt__grid" role="list">
        <li
          v-for="(p, i) in partners"
          :key="p.id"
          class="pt__card"
          data-reveal
          :style="{ '--i': i }"
          @pointermove="onPointerMove"
          @pointerleave="onPointerLeave"
        >
          <span class="pt__glow" aria-hidden="true"></span>

          <div class="pt__logo">
            <span class="pt__sheen" aria-hidden="true"></span>
            <template v-if="p.id === 'langbangvn'">
              <img :src="langbangIcon" alt="" class="pt__logo-mark" aria-hidden="true" />
              <img :src="langbangText" alt="" class="pt__logo-text" aria-hidden="true" />
            </template>
            <!-- NekoStudio has no logo asset; a wordmark is honest, a
                 placeholder box is not. -->
            <span v-else class="pt__logo-word">NekoStudio</span>
          </div>

          <div class="pt__meta">
            <span class="pt__tag">{{ p.tag }}</span>
            <span class="pt__badge">{{ p.badge }}</span>
          </div>

          <h3 class="pt__name">{{ p.name }}</h3>
          <p class="pt__summary">{{ p.summary }}</p>

          <div class="pt__actions">
            <a class="pt__action link-u" :href="p.site" target="_blank" rel="noreferrer noopener">
              {{ t.partners.visit }}
              <span aria-hidden="true">↗</span>
              <span class="sr-only">({{ t.a11y.externalLink }})</span>
            </a>
            <a class="pt__action link-u" :href="p.discord" target="_blank" rel="noreferrer noopener">
              {{ t.partners.discord }}
              <span aria-hidden="true">↗</span>
              <span class="sr-only">({{ t.a11y.externalLink }})</span>
            </a>
          </div>
        </li>
      </ul>

      <p class="pt__cta" data-reveal>
        {{ t.partners.ctaLead }}
        <a class="link-u" href="#contact" @click.prevent="scrollToHash('#contact')">
          {{ t.partners.ctaLink }}
          <span aria-hidden="true">→</span>
        </a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.pt__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);
}

.pt__card {
  --mx: 50%;
  --my: 50%;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-8);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition:
    border-color var(--duration-base) ease,
    background var(--duration-base) ease,
    transform var(--duration-base) var(--ease-out-quart),
    box-shadow var(--duration-base) ease;
}

.pt__card:hover {
  border-color: var(--border-strong);
  background: var(--surface-2);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.pt__glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(
    18rem circle at var(--mx) var(--my),
    oklch(0.42 0 0 / 0.45),
    transparent 66%
  );
  transition: opacity var(--duration-base) ease;
}

.pt__card:hover .pt__glow { opacity: 1; }

/* ── Logo lockup ───────────────────────────────────────────────────────── */
.pt__logo {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 42px;
  margin-bottom: var(--space-2);
}

/* A single pass of light across the lockup on hover. Fires once per hover
   rather than looping — a looping shine on a partner logo reads as an advert. */
.pt__sheen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -40%;
  width: 40%;
  pointer-events: none;
  background: linear-gradient(
    100deg,
    transparent,
    oklch(1 0 0 / 0.13) 50%,
    transparent
  );
}

.pt__card:hover .pt__sheen {
  animation: pt-sweep var(--duration-slower) var(--ease-cinematic);
}

@keyframes pt-sweep {
  from { left: -40%; }
  to { left: 110%; }
}

.pt__logo-mark { height: 36px; width: auto; object-fit: contain; }
.pt__logo-text { height: 22px; width: auto; object-fit: contain; }

.pt__logo-word {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--ink);
}

/* ── Meta row ──────────────────────────────────────────────────────────── */
.pt__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.pt__tag,
.pt__badge {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.13em;
}

.pt__tag { color: var(--muted); }

.pt__badge {
  color: var(--ink-dim);
  padding: 0.28em 0.7em;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

/* ── Copy ──────────────────────────────────────────────────────────────── */
.pt__name {
  font-size: var(--text-xl);
  letter-spacing: -0.028em;
}

.pt__summary {
  font-size: var(--text-sm);
  color: var(--ink-dim);
  font-weight: 300;
  flex: 1;
}

.pt__actions {
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
  padding-top: var(--space-2);
}

.pt__action { font-size: var(--text-sm); }

/* ── Closing line ──────────────────────────────────────────────────────── */
.pt__cta {
  margin-top: var(--space-10);
  font-size: var(--text-base);
  color: var(--muted);
}

.pt__cta .link-u { margin-left: var(--space-2); }

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 800px) {
  .pt__grid { grid-template-columns: 1fr; }
  .pt__card { padding: var(--space-6); }
}

@media (prefers-reduced-motion: reduce) {
  .pt__glow, .pt__sheen { display: none; }
  .pt__card:hover { transform: none; }
}
</style>
