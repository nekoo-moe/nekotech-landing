<script setup lang="ts">
/**
 * Signal — the org's numbers, taken from a build-time GitHub snapshot.
 *
 * Layout note: the old version stacked five full-width blocks and read as a
 * dashboard. This is a 12-column plate instead — three figures across the top,
 * the commit band and the busiest repo sharing a row beneath — so the whole
 * section is one glance rather than five scrolls.
 */
import { computed } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { useOrgStats, langColor } from '@/composables/useOrgStats';
import { ORG } from '@/configs/app.config';
import SectionHead from '@/components/shared/SectionHead.vue';

const { t } = useLanguage();
const { stats, loading, commitLevels, commitTotal } = useOrgStats();

const figures = computed(() => [
  { value: stats.value.members, label: t.value.signal.members, note: '' },
  {
    value: stats.value.repos,
    label: t.value.signal.repositories,
    note: stats.value.privateRepos
      ? `${stats.value.privateRepos} ${t.value.signal.privateSuffix}`
      : '',
  },
  { value: stats.value.totalStars, label: t.value.signal.stars, note: '' },
]);

const acrossRepos = computed(() =>
  t.value.signal.acrossRepos.replace('{n}', String(stats.value.repos))
);
</script>

<template>
  <section id="signal" class="sig section section--ruled" aria-labelledby="sig-heading">
    <div class="container">
      <SectionHead
        :label="t.signal.label"
        :heading="t.signal.heading"
        :lede="t.signal.lede"
        heading-id="sig-heading"
        index="01"
      />

      <!-- ── Three figures ──────────────────────────────────────────────── -->
      <ul class="sig__figures" role="list">
        <li
          v-for="(fig, i) in figures"
          :key="fig.label"
          class="sig__figure"
          data-reveal
          :style="{ '--i': i }"
        >
          <span v-if="loading" class="sig__skeleton" aria-hidden="true"></span>
          <span v-else class="sig__value num">{{ fig.value }}</span>
          <span class="sig__figure-label">
            {{ fig.label }}
            <span v-if="fig.note && !loading" class="sig__note num">{{ fig.note }}</span>
          </span>
        </li>
      </ul>

      <!-- ── Commit band + busiest repo ─────────────────────────────────── -->
      <div class="sig__row">
        <div class="sig__panel sig__panel--commits" data-reveal>
          <div class="sig__panel-head">
            <span class="sig__panel-title">
              <span class="num">{{ commitTotal.toLocaleString() }}</span>
              {{ t.signal.commits }}
            </span>
            <span class="sig__panel-meta">{{ t.signal.commitsWindow }}</span>
          </div>

          <div
            class="sig__band"
            role="img"
            :aria-label="`${commitTotal} ${t.signal.commits} — ${t.signal.commitsWindow}`"
          >
            <span
              v-for="(w, i) in commitLevels"
              :key="i"
              class="sig__week"
              :data-level="w.level"
              :style="{ '--i': i }"
              :title="`${t.signal.weekLabel} ${w.week}: ${w.count}`"
            ></span>
          </div>

          <div class="sig__legend" aria-hidden="true">
            <span>{{ t.signal.less }}</span>
            <span v-for="l in [0, 1, 2, 3, 4]" :key="l" class="sig__key" :data-level="l"></span>
            <span>{{ t.signal.more }}</span>
          </div>
        </div>

        <a
          class="sig__panel sig__panel--repo"
          :href="stats.topProject.url"
          target="_blank"
          rel="noreferrer noopener"
          data-reveal
          style="--i: 1"
        >
          <div class="sig__panel-head">
            <span class="sig__panel-title">{{ t.signal.busiestRepo }}</span>
            <span class="sig__panel-meta num">{{ acrossRepos }}</span>
          </div>

          <h3 class="sig__repo-name">{{ stats.topProject.name }}</h3>

          <div class="sig__repo-figures">
            <span class="sig__repo-figure">
              <span class="num">{{ stats.topProject.commits }}</span>
              {{ t.signal.commits }}
            </span>
            <span class="sig__repo-figure">
              <span
                class="sig__dot"
                :style="{ background: langColor(stats.topProject.language) }"
                aria-hidden="true"
              ></span>
              {{ stats.topProject.language }}
            </span>
          </div>

          <div
            v-if="stats.topProject.languages.length"
            class="sig__bar"
            aria-hidden="true"
          >
            <span
              v-for="lang in stats.topProject.languages"
              :key="lang.name"
              class="sig__bar-seg"
              :style="{ width: `${lang.percent}%`, background: langColor(lang.name) }"
            ></span>
          </div>

          <span class="sig__repo-cta" aria-hidden="true">↗</span>
        </a>
      </div>

      <!-- ── Language mix ───────────────────────────────────────────────── -->
      <div class="sig__langs" data-reveal>
        <div class="sig__panel-head">
          <span class="sig__panel-title">{{ t.signal.languages }}</span>
          <span class="sig__panel-meta">{{ t.signal.stale }}</span>
        </div>

        <div
          class="sig__bar sig__bar--wide"
          role="img"
          :aria-label="stats.languages.map(l => `${l.name} ${l.percent}%`).join(', ')"
        >
          <span
            v-for="lang in stats.languages"
            :key="lang.name"
            class="sig__bar-seg"
            :style="{ width: `${lang.percent}%`, background: langColor(lang.name) }"
            :title="`${lang.name} · ${lang.percent}%`"
          ></span>
        </div>

        <ul class="sig__lang-keys" role="list">
          <li v-for="lang in stats.languages" :key="lang.name" class="sig__lang-key">
            <span
              class="sig__dot"
              :style="{ background: langColor(lang.name) }"
              aria-hidden="true"
            ></span>
            {{ lang.name }}
            <span class="num sig__lang-pct">{{ lang.percent }}%</span>
          </li>
        </ul>
      </div>

      <a
        class="sig__org link-u"
        :href="ORG.github"
        target="_blank"
        rel="noreferrer noopener"
        data-reveal
      >
        {{ t.signal.orgLink }}
        <span aria-hidden="true">↗</span>
        <span class="sr-only">({{ t.a11y.externalLink }})</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
/* ── Figures ───────────────────────────────────────────────────────────── */
.sig__figures {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-8);
  padding-bottom: var(--space-12);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-12);
}

.sig__figure {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  /* A hairline between columns rather than boxes — fewer edges, same reading. */
  padding-left: var(--space-6);
  border-left: 1px solid var(--hairline);
}

.sig__figure:first-child { padding-left: 0; border-left: none; }

.sig__value {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.045em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.sig__figure-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--muted);
}

.sig__note {
  text-transform: none;
  letter-spacing: 0.02em;
  color: var(--ink-faint);
  padding: 0.15em 0.5em;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.sig__skeleton {
  width: 3.2em;
  height: var(--text-4xl);
  border-radius: var(--radius-sm);
  background: var(--surface);
  animation: sig-pulse 1.5s ease-in-out infinite;
}

@keyframes sig-pulse { 0%, 100% { opacity: 0.45; } 50% { opacity: 0.9; } }

/* ── Panels ────────────────────────────────────────────────────────────── */
.sig__row {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

.sig__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-6);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.sig__panel--repo {
  transition: border-color var(--duration-base) ease, background var(--duration-base) ease;
}

.sig__panel--repo:hover {
  border-color: var(--border-strong);
  background: var(--surface-2);
}

.sig__panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
}

.sig__panel-title {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--ink-dim);
}

.sig__panel-title .num { color: var(--ink); font-weight: 500; }

.sig__panel-meta {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  text-align: right;
}

/* ── Commit band ───────────────────────────────────────────────────────── */
.sig__band {
  display: grid;
  grid-template-columns: repeat(52, minmax(0, 1fr));
  gap: 2px;
  margin-top: auto;
}

.sig__week {
  height: 34px;
  border-radius: 1px;
  transform: scaleY(0.25);
  transform-origin: bottom;
  transition:
    transform var(--duration-slow) var(--ease-cinematic),
    filter var(--duration-fast) ease;
  transition-delay: calc(var(--i) * 9ms);
}

.is-in .sig__week { transform: scaleY(1); }

.sig__week:hover { filter: brightness(1.6); }

.sig__week[data-level="0"], .sig__key[data-level="0"] { background: var(--surface-2); }
.sig__week[data-level="1"], .sig__key[data-level="1"] { background: oklch(0.30 0 0); }
.sig__week[data-level="2"], .sig__key[data-level="2"] { background: oklch(0.45 0 0); }
.sig__week[data-level="3"], .sig__key[data-level="3"] { background: oklch(0.68 0 0); }
/* The single accent in this section: only the busiest weeks earn it. */
.sig__week[data-level="4"], .sig__key[data-level="4"] { background: var(--accent); }

.sig__legend {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.1em;
  color: var(--ink-faint);
}

.sig__legend > span:first-child { margin-right: var(--space-1); }
.sig__legend > span:last-child { margin-left: var(--space-1); }

.sig__key { width: 11px; height: 11px; border-radius: 1px; }

/* ── Busiest repo ──────────────────────────────────────────────────────── */
.sig__repo-name {
  font-size: var(--text-xl);
  letter-spacing: -0.025em;
  word-break: break-word;
}

.sig__repo-figures {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--muted);
}

.sig__repo-figure { display: inline-flex; align-items: center; gap: var(--space-2); }
.sig__repo-figure .num { color: var(--ink); font-size: var(--text-sm); }

.sig__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

.sig__repo-cta {
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
  font-size: var(--text-sm);
  color: var(--ink-faint);
  transition: color var(--duration-fast) ease, transform var(--duration-base) var(--ease-out-quart);
}

.sig__panel--repo:hover .sig__repo-cta {
  color: var(--accent);
  transform: translate(2px, -2px);
}

/* ── Bars ──────────────────────────────────────────────────────────────── */
.sig__bar {
  display: flex;
  gap: 1px;
  height: 5px;
  margin-top: auto;
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.sig__bar--wide { height: 8px; margin-top: 0; }

.sig__bar-seg {
  height: 100%;
  min-width: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-slower) var(--ease-cinematic);
}

.is-in .sig__bar-seg { transform: scaleX(1); }

/* ── Language mix ──────────────────────────────────────────────────────── */
.sig__langs {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-10);
}

.sig__lang-keys {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3) var(--space-6);
}

.sig__lang-key {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--ink-dim);
}

.sig__lang-pct { color: var(--muted); font-size: var(--text-xs); }

.sig__org { font-size: var(--text-sm); }

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .sig__row { grid-template-columns: 1fr; }
  .sig__week { height: 28px; }
}

@media (max-width: 620px) {
  .sig__figures {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  .sig__figure {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    padding-left: 0;
    border-left: none;
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--hairline);
  }
  .sig__figures > .sig__figure:last-child { border-bottom: none; padding-bottom: 0; }
  .sig__value { font-size: var(--text-3xl); }
  /* 52 two-pixel columns is a smear on a phone; halve the resolution. */
  .sig__band { grid-template-columns: repeat(26, minmax(0, 1fr)); }
  .sig__week:nth-child(even) { display: none; }
}
</style>
