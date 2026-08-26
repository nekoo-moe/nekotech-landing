<script setup lang="ts">
/**
 * Contact — the closing plate.
 *
 * This replaces `OpenSourceCTA.vue`, which embedded a Spline iframe
 * (`boxeshover-…`) as its background.
 *
 * It used to own a second WebGL context (`SignalField`, an OGL dot lattice).
 * That is gone: the page now has one background, the fixed `VectorTopography`
 * field, and this section reads it through a veil like every other section.
 * Two contexts meant two GPU programs alive at once and a hand-off between
 * them mid-scroll, for two variations on "lattice with a wave in it".
 *
 * The footer lives here rather than in its own component because it shares
 * this section's veil — splitting them would mean two stacking contexts
 * fighting over one gradient. That shared backdrop is also what the footer's
 * closing wordmark is for: the type is knocked out to transparent so the
 * contour field reads *through* the letterforms. It is the last thing on the
 * page, so it is the one place a large gesture costs nothing that follows.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { NAV, ORG, SITE_REPO } from '@/configs/app.config';
import { scrollToHash } from '@/composables/useSectionNav';
import { useScrollProgress } from '@/composables/useScrollProgress';
import { prefersReducedMotion } from '@/composables/useCanvasScene';

const { t } = useLanguage();

const channels = [
  { key: 'github' as const, href: ORG.github, value: ORG.github.replace('https://', '') },
  { key: 'discord' as const, href: ORG.discord, value: ORG.discord.replace('https://', '') },
];

const year = new Date().getFullYear();

/* The wordmark rises and settles as the footer is reached — the payoff for
   scrolling the whole page. */
const footer = ref<HTMLElement | null>(null);
useScrollProgress(footer, { start: 1, end: 0.72 });

/**
 * A running clock in the footer. It is the cheapest possible proof that the
 * page is live rather than a screenshot, and it costs one interval.
 */
const clock = ref('');
let timer = 0;

const tickClock = () => {
  clock.value = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
  }).format(new Date());
};

onMounted(() => {
  tickClock();
  // Reduced motion means no second-by-second flicker; the time still shows.
  if (!prefersReducedMotion()) timer = window.setInterval(tickClock, 1000);
});

onBeforeUnmount(() => { if (timer) clearInterval(timer); });
</script>

<template>
  <section id="contact" class="ct" aria-labelledby="ct-heading">
    <div class="ct__stage" aria-hidden="true">
      <div class="ct__veil"></div>
    </div>

    <div class="ct__inner container">
      <p class="label label--accent" data-reveal>{{ t.contact.label }}</p>

      <h2 id="ct-heading" class="ct__heading" data-reveal="mask">
        <span v-for="(line, i) in t.contact.heading" :key="i" class="line">
          <span>{{ line }}</span>
        </span>
      </h2>

      <p class="ct__lede" data-reveal style="--i: 1">{{ t.contact.lede }}</p>

      <ul class="ct__channels" role="list">
        <li
          v-for="(c, i) in channels"
          :key="c.key"
          class="ct__channel"
          data-reveal
          :style="{ '--i': i }"
        >
          <a class="ct__channel-link" :href="c.href" target="_blank" rel="noreferrer noopener">
            <span class="ct__channel-label">{{ t.contact[c.key] }}</span>
            <span class="ct__channel-value num">{{ c.value }}</span>
            <span class="ct__channel-arrow" aria-hidden="true">↗</span>
            <span class="sr-only">({{ t.a11y.externalLink }})</span>
          </a>
        </li>

        <li class="ct__channel" data-reveal style="--i: 2">
          <a class="ct__channel-link" :href="`mailto:${ORG.email}`">
            <span class="ct__channel-label">Email</span>
            <span class="ct__channel-value num">{{ t.contact.email }}</span>
            <span class="ct__channel-arrow" aria-hidden="true">→</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- ── Footer ─────────────────────────────────────────────────────────── -->
    <footer ref="footer" class="ft" role="contentinfo">
      <div class="ft__body container">
        <div class="ft__top">
          <div class="ft__brand">
            <p class="ft__wordmark">NekoTech<span>Foundation</span></p>
            <p class="ft__tagline">{{ t.meta.tagline }}</p>

            <!-- Live status: a running clock is the one thing here that cannot
                 be a static screenshot. -->
            <p class="ft__status num" aria-live="off">
              <span class="ft__status-dot" aria-hidden="true"></span>
              {{ t.footer.status }}
              <span class="ft__clock">{{ clock }}</span>
              <span class="ft__tz">{{ t.footer.timezone }}</span>
            </p>
          </div>

          <nav class="ft__nav" :aria-label="t.footer.sections">
            <p class="ft__nav-label">{{ t.footer.sections }}</p>
            <ul role="list">
              <li v-for="item in NAV" :key="item.key">
                <a :href="item.hash" @click.prevent="scrollToHash(item.hash)">
                  {{ t.nav[item.key] }}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div class="ft__bottom">
          <p class="ft__legal num">
            © {{ year }} {{ t.footer.rights }} · {{ ORG.foundedYear }}
          </p>
          <p class="ft__built">
            {{ t.footer.builtWith }} ·
            <a :href="SITE_REPO" target="_blank" rel="noreferrer noopener" class="link-u">
              {{ t.footer.sourceLink }}
            </a>
          </p>
        </div>
      </div>

      <!-- Closing wordmark. The letterforms are knocked out to transparent so
           the page's contour field shows through them; it is decorative, and
           the real wordmark is already above. -->
      <p class="ft__mark" aria-hidden="true">NEKOTECH</p>
    </footer>
  </section>
</template>

<style scoped>
.ct {
  position: relative;
  overflow: clip;
  border-top: 1px solid var(--border);
  padding-top: clamp(5rem, 12vw, 10rem);
}

/* ── Canvas ────────────────────────────────────────────────────────────── */
.ct__stage {
  position: absolute;
  inset: 0;
  z-index: var(--z-canvas);
  pointer-events: none;
}

/* Holds the page's contour field back under the type. Lighter than the version
   that veiled the old local lattice: that canvas sat inside this section and
   could be dimmed to nothing, whereas this one runs the length of the document
   — an opaque `var(--bg)` stop here would punch a flat rectangle into a field
   that is continuous everywhere else. So the seams stay translucent and only
   the middle, where the heading is, is genuinely held down. */
.ct__veil {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 80% at 50% 40%, oklch(0.055 0 0 / 0.30) 0%, oklch(0.055 0 0 / 0.62) 62%, oklch(0.055 0 0 / 0.42) 100%);
}

/* ── CTA ───────────────────────────────────────────────────────────────── */
.ct__inner {
  position: relative;
  z-index: var(--z-base);
  padding-bottom: clamp(4rem, 9vw, 7rem);
}

.ct__heading {
  font-size: var(--text-4xl);
  font-weight: 800;
  line-height: 0.96;
  letter-spacing: -0.04em;
  margin: var(--space-6) 0 var(--space-6);
  max-width: 20ch;
}

/* The one accent mark in this viewport. */
.ct__heading .line:last-child > span::after {
  content: '';
  display: inline-block;
  width: 0.3em;
  height: 0.3em;
  margin-left: 0.2em;
  vertical-align: 0.1em;
  background: var(--accent);
}

.ct__lede {
  font-size: var(--text-lg);
  font-weight: 300;
  color: var(--ink-dim);
  max-width: 48ch;
  margin-bottom: var(--space-12);
}

/* ── Channels ──────────────────────────────────────────────────────────── */
.ct__channels {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
  max-width: 720px;
}

.ct__channel { border-bottom: 1px solid var(--border); }

.ct__channel-link {
  display: grid;
  grid-template-columns: minmax(0, 0.5fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-4);
  padding-block: var(--space-5);
  transition: padding-left var(--duration-base) var(--ease-out-quart);
}

.ct__channel-link:hover { padding-left: var(--space-3); }

.ct__channel-label {
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--muted);
}

.ct__channel-value {
  font-size: var(--text-base);
  color: var(--ink);
  overflow-wrap: anywhere;
}

.ct__channel-arrow {
  font-size: var(--text-sm);
  color: var(--ink-faint);
  transition: color var(--duration-fast) ease, transform var(--duration-base) var(--ease-out-quart);
}

.ct__channel-link:hover .ct__channel-arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

/* ── Footer ────────────────────────────────────────────────────────────── */
.ft {
  --sp: 0;
  position: relative;
  z-index: var(--z-base);
  border-top: 1px solid var(--border);
  padding-top: var(--space-12);
}

.ft__body { padding-bottom: var(--space-10); }

.ft__top {
  display: flex;
  justify-content: space-between;
  gap: var(--space-12);
  flex-wrap: wrap;
  margin-bottom: var(--space-12);
}

.ft__wordmark {
  display: flex;
  flex-direction: column;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--ink);
}

.ft__wordmark span {
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--ink-faint);
}

.ft__tagline {
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--muted);
  max-width: 34ch;
}

/* ── Live status ───────────────────────────────────────────────────────── */
.ft__status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-top: var(--space-5);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--muted);
}

.ft__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ok);
  flex-shrink: 0;
  animation: ft-pulse 2.4s var(--ease-cinematic) infinite;
}

@keyframes ft-pulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--ok); opacity: 1; }
  70% { box-shadow: 0 0 0 5px transparent; opacity: 0.6; }
}

.ft__clock {
  color: var(--ink);
  letter-spacing: 0.08em;
  /* Tabular figures are already on via .num; this keeps the seconds digit from
     nudging the timezone label as it counts. */
  font-variant-numeric: tabular-nums;
}

.ft__tz { color: var(--ink-faint); }

.ft__nav-label {
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--ink-faint);
  margin-bottom: var(--space-4);
}

.ft__nav ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, auto));
  gap: var(--space-2) var(--space-8);
}

.ft__nav a {
  font-size: var(--text-sm);
  color: var(--muted);
  transition: color var(--duration-fast) ease;
}

.ft__nav a:hover { color: var(--ink); }

.ft__bottom {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  padding-top: var(--space-6);
  border-top: 1px solid var(--hairline);
}

.ft__legal,
.ft__built {
  font-size: var(--text-xs);
  color: var(--ink-faint);
}

.ft__built .link-u { color: var(--muted); font-weight: 400; }

/* ── Closing wordmark ──────────────────────────────────────────────────── */
.ft__mark {
  max-width: none;
  margin: 0;
  padding: 0 var(--gutter);
  /* Fills the footer's width so the letterforms are as large as they can be
     without overflowing. */
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(3.5rem, 21vw, 20rem);
  line-height: 0.82;
  letter-spacing: -0.04em;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  /* Ghosted mass rather than solid type: the fill fades out toward the
     baseline, so the word reads as rising out of the page edge instead of
     sitting on it. The stroke keeps the letterforms legible where the fill has
     gone to nothing. */
  background: linear-gradient(
    to bottom,
    oklch(0.30 0 0) 0%,
    oklch(0.16 0 0) 55%,
    transparent 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-stroke: 1px oklch(1 0 0 / 0.05);
  /* Rises into place with scroll, and fades up from nothing. */
  transform: translateY(calc((1 - var(--sp)) * 2.5rem));
  opacity: calc(0.25 + var(--sp) * 0.75);
  transition: opacity var(--duration-base) ease;
}

@media (prefers-reduced-motion: reduce) {
  .ft__mark { transform: none; opacity: 1; }
  .ft__status-dot { animation: none; }
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .ct__channel-link {
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: var(--space-1);
  }
  /* Label above value instead of a squeezed two-column row. */
  .ct__channel-label { grid-column: 1 / -1; }
  .ct__heading { max-width: none; }
  .ft__nav ul { grid-template-columns: 1fr; }
}
</style>
