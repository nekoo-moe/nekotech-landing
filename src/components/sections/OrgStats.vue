<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

// ── Types ─────────────────────────────────────────────────────────────────────
interface LangEntry { name: string; percent: number; }
interface TopProject {
  name: string; description: string; commits: number;
  stars: number; forks: number; language: string;
  languages: LangEntry[];
  url: string;
}
interface Stats {
  members: number; repos: number; privateRepos: number;
  publicRepos: number; totalStars: number; totalForks: number;
  languages: LangEntry[];
  topProject: TopProject;
  commitActivity: number[]; // 52 weekly totals
  generatedAt: string; isFallback: boolean;
}

// ── State ─────────────────────────────────────────────────────────────────────
const stats = ref<Stats | null>(null);
const loading = ref(true);
const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const barVisible = ref(false); // triggers bar slide-in (delayed after isVisible)

// GitHub language colors (brand-accurate, monochrome fallback for unknown)
const LANG_COLORS: Record<string, string> = {
  TypeScript:  '#3178c6',
  JavaScript:  '#f1e05a',
  Python:      '#3572A5',
  Go:          '#00ADD8',
  Rust:        '#dea584',
  Java:        '#b07219',
  'C++':       '#f34b7d',
  C:           '#555555',
  Vue:         '#41b883',
  CSS:         '#563d7c',
  HTML:        '#e34c26',
  Cuda:        '#3A4E3A',
};

// ── Commit graph helpers ───────────────────────────────────────────────────────
// Build a 7-row × 53-col GitHub-style grid from weekly totals
const commitGrid = computed(() => {
  if (!stats.value) return [];
  const weekly = stats.value.commitActivity;
  // weekly[0] = oldest, weekly[51] = most recent
  // GitHub grid: columns = weeks (left=old, right=new), rows = Mon-Sun (0=Mon)
  const maxVal = Math.max(...weekly, 1);
  return weekly.map((count) => {
    const level = count === 0 ? 0 : Math.ceil((count / maxVal) * 4);
    return { count, level }; // level 0-4
  });
});

const commitTotal = computed(() =>
  stats.value?.commitActivity.reduce((a, b) => a + b, 0) ?? 0
);

const hoveredWeek = ref<{ count: number; idx: number } | null>(null);

// ── Data fetch ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        isVisible.value = true;
        // Bars animate after section fades in
        setTimeout(() => { barVisible.value = true; }, 350);
        io.disconnect();
      }
    });
  }, { threshold: 0.1 });
  if (sectionRef.value) io.observe(sectionRef.value);

  try {
    const res = await fetch('/github-stats.json');
    if (!res.ok) throw new Error('no stats');
    stats.value = await res.json();
  } catch {
    // Minimal fallback
    stats.value = {
      members: 6, repos: 8, privateRepos: 3, publicRepos: 5,
      totalStars: 0, totalForks: 0,
      languages: [
        { name: 'JavaScript', percent: 43 },
        { name: 'Python', percent: 36 },
        { name: 'TypeScript', percent: 10 },
        { name: 'HTML', percent: 8 },
        { name: 'Vue', percent: 2 },
        { name: 'CSS', percent: 1 },
      ],
      topProject: {
        name: 'NekoTech-DiscordBot',
        description: 'Discord bot powering the NekoTech community.',
        commits: 308, stars: 0, forks: 0,
        language: 'JavaScript',
        url: 'https://github.com/nekoo-moe',
      },
      commitActivity: new Array(52).fill(0),
      generatedAt: new Date().toISOString(),
      isFallback: true,
    };
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section id="org-stats" class="org-stats section" ref="sectionRef">
    <div class="container">

      <!-- ── Big stat numbers ───────────────────────────────────────────────── -->
      <div class="org-stats__grid" :class="{ 'is-visible': isVisible }">
        <div class="org-stats__item">
          <template v-if="loading">
            <div class="org-stats__skeleton org-stats__skeleton--num"></div>
          </template>
          <template v-else>
            <span class="org-stats__num">{{ stats!.members }}</span>
          </template>
          <span class="org-stats__label">Members</span>
        </div>

        <div class="org-stats__divider" aria-hidden="true"></div>

        <div class="org-stats__item">
          <template v-if="loading">
            <div class="org-stats__skeleton org-stats__skeleton--num"></div>
          </template>
          <template v-else>
            <span class="org-stats__num">{{ stats!.repos }}</span>
          </template>
          <span class="org-stats__label">
            Repositories
            <span v-if="!loading && stats!.privateRepos" class="org-stats__badge">
              {{ stats!.privateRepos }} private
            </span>
          </span>
        </div>

        <div class="org-stats__divider" aria-hidden="true"></div>

        <div class="org-stats__item">
          <template v-if="loading">
            <div class="org-stats__skeleton org-stats__skeleton--num"></div>
          </template>
          <template v-else>
            <span class="org-stats__num">{{ stats!.totalStars }}</span>
          </template>
          <span class="org-stats__label">Stars</span>
        </div>
      </div>

      <!-- ── Commit graph ──────────────────────────────────────────────────── -->
      <div class="org-stats__commit-section" :class="{ 'is-visible': isVisible }">
        <div class="org-stats__commit-header">
          <span class="org-stats__commit-title">
            <span class="org-stats__commit-count">{{ commitTotal.toLocaleString() }}</span>
            commits · last 52 weeks
          </span>
          <span class="org-stats__commit-hint" v-if="hoveredWeek">
            Week {{ 52 - hoveredWeek.idx }}: {{ hoveredWeek.count }} commits
          </span>
        </div>

        <div class="org-stats__commit-grid" role="img" aria-label="Org commit activity over 52 weeks">
          <div
            v-for="(week, i) in commitGrid"
            :key="i"
            class="org-stats__commit-cell"
            :class="[
              `org-stats__commit-cell--l${week.level}`,
              { 'cell-animated': isVisible }
            ]"
            :style="isVisible ? { animationDelay: `${i * 8}ms` } : {}"
            :title="`${week.count} commits`"
            @mouseenter="hoveredWeek = { count: week.count, idx: i }"
            @mouseleave="hoveredWeek = null"
          ></div>
        </div>

        <div class="org-stats__commit-legend" aria-hidden="true">
          <span>Less</span>
          <span class="org-stats__legend-cell org-stats__commit-cell--l0"></span>
          <span class="org-stats__legend-cell org-stats__commit-cell--l1"></span>
          <span class="org-stats__legend-cell org-stats__commit-cell--l2"></span>
          <span class="org-stats__legend-cell org-stats__commit-cell--l3"></span>
          <span class="org-stats__legend-cell org-stats__commit-cell--l4"></span>
          <span>More</span>
        </div>
      </div>

      <!-- ── Most-committed project ─────────────────────────────────────────── -->
      <div
        v-if="!loading && stats"
        class="org-stats__top"
        :class="{ 'is-visible': isVisible }"
      >
        <div class="org-stats__top-header">
          <span class="org-stats__top-label">Most-committed project</span>
          <a
            :href="`https://github.com/nekoo-moe`"
            target="_blank"
            rel="noopener noreferrer"
            class="org-stats__top-across"
          >across {{ stats.repos }} repos</a>
        </div>
        <a
          :href="stats.topProject.url"
          target="_blank"
          rel="noopener noreferrer"
          class="org-stats__top-card"
        >
          <div class="org-stats__top-card-left">
            <h3 class="org-stats__top-name">{{ stats.topProject.name }}</h3>
            <p class="org-stats__top-desc">{{ stats.topProject.description }}</p>

            <!-- Language bar for top project -->
            <div
              v-if="stats.topProject.languages && stats.topProject.languages.length"
              class="org-stats__top-lang-section"
            >
              <div
                class="org-stats__top-lang-bar"
                role="img"
                :aria-label="`Languages: ${stats.topProject.languages.map(l => `${l.name} ${l.percent}%`).join(', ')}`"
              >
                <div
                  v-for="(lang, idx) in stats.topProject.languages"
                  :key="lang.name"
                  class="org-stats__lang-segment"
                  :class="{ 'seg-animated': barVisible }"
                  :style="{
                    '--seg-target': `${lang.percent}%`,
                    '--seg-delay': `${idx * 120}ms`,
                    background: LANG_COLORS[lang.name] ?? 'var(--muted)',
                  }"
                  :title="`${lang.name}: ${lang.percent}%`"
                ></div>
              </div>
              <div class="org-stats__top-lang-legend">
                <span
                  v-for="(lang, idx) in stats.topProject.languages"
                  :key="lang.name"
                  class="org-stats__lang-item"
                  :class="{ 'item-animated': barVisible }"
                  :style="{ '--item-delay': `${idx * 80 + 300}ms` }"
                >
                  <span
                    class="org-stats__lang-dot"
                    :style="{ background: LANG_COLORS[lang.name] ?? 'var(--muted)' }"
                    aria-hidden="true"
                  ></span>
                  {{ lang.name }} · {{ lang.percent }}%
                </span>
              </div>
            </div>
          </div>
          <div class="org-stats__top-card-right">
            <div class="org-stats__top-stat">
              <span class="org-stats__top-stat-num">{{ stats.topProject.commits }}</span>
              <span class="org-stats__top-stat-lbl">Commits</span>
            </div>
            <div class="org-stats__top-stat">
              <span class="org-stats__top-stat-num">{{ stats.topProject.stars }}</span>
              <span class="org-stats__top-stat-lbl">Stars</span>
            </div>
            <div class="org-stats__top-lang">
              <span
                class="org-stats__top-lang-dot"
                :style="{ background: LANG_COLORS[stats.topProject.language] ?? 'var(--muted)' }"
                aria-hidden="true"
              ></span>
              {{ stats.topProject.language }}
            </div>
          </div>
        </a>
      </div>

      <!-- ── Language progress bar ──────────────────────────────────────────── -->
      <div
        v-if="!loading && stats && stats.languages.length"
        class="org-stats__lang-section"
        :class="{ 'is-visible': isVisible }"
      >
        <div class="org-stats__lang-header">
          <span class="org-stats__lang-label-txt">What we write</span>
          <span class="org-stats__lang-sub">Across org repos</span>
        </div>

        <!-- Stacked bar -->
        <div class="org-stats__lang-bar" role="img" :aria-label="`Language breakdown: ${stats.languages.map(l => `${l.name} ${l.percent}%`).join(', ')}`">
          <div
            v-for="(lang, idx) in stats.languages"
            :key="lang.name"
            class="org-stats__lang-segment"
            :class="{ 'seg-animated': barVisible }"
            :style="{
              '--seg-target': `${lang.percent}%`,
              '--seg-delay': `${idx * 120}ms`,
              background: LANG_COLORS[lang.name] ?? 'var(--muted)',
            }"
            :title="`${lang.name}: ${lang.percent}%`"
          ></div>
        </div>

        <!-- Legend -->
        <div class="org-stats__lang-legend">
          <span
            v-for="(lang, idx) in stats.languages"
            :key="lang.name"
            class="org-stats__lang-item"
            :class="{ 'item-animated': barVisible }"
            :style="{ '--item-delay': `${idx * 80 + 300}ms` }"
          >
            <span
              class="org-stats__lang-dot"
              :style="{ background: LANG_COLORS[lang.name] ?? 'var(--muted)' }"
              aria-hidden="true"
            ></span>
            {{ lang.name }} · {{ lang.percent }}%
          </span>
        </div>
      </div>

      <!-- ── GitHub link ────────────────────────────────────────────────────── -->
      <a
        href="https://github.com/nekoo-moe"
        target="_blank"
        rel="noopener noreferrer"
        class="org-stats__gh-link"
        :class="{ 'is-visible': isVisible }"
      >
        github.com/nekoo-moe
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>
  </section>
</template>

<style scoped>
.org-stats {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

/* ── Stat numbers ── */
.org-stats__grid {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
  flex-wrap: wrap;
  margin-bottom: var(--space-12);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms var(--ease-out-quart), transform 600ms var(--ease-out-quart);
}
.org-stats__grid.is-visible { opacity: 1; transform: none; }

.org-stats__item { display: flex; flex-direction: column; gap: var(--space-2); }

.org-stats__num {
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--ink);
}

.org-stats__label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.org-stats__badge {
  background: var(--surface);
  color: var(--ink-dim);
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: var(--radius-pill);
  letter-spacing: 0.04em;
  text-transform: none;
}

.org-stats__divider {
  width: 1px;
  height: clamp(3rem, 7vw, 5.5rem);
  background: var(--border);
  align-self: flex-start;
  flex-shrink: 0;
}

/* ── Skeleton ── */
.org-stats__skeleton {
  border-radius: var(--radius-sm);
  background: var(--surface);
  animation: sk 1.4s ease-in-out infinite;
}
.org-stats__skeleton--num { width: 120px; height: clamp(3rem, 7vw, 5.5rem); }
@keyframes sk { 0%,100%{opacity:.4} 50%{opacity:.9} }

/* ── Commit graph ── */
.org-stats__commit-section {
  margin-bottom: var(--space-12);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 600ms var(--ease-out-quart) 120ms,
              transform 600ms var(--ease-out-quart) 120ms;
}
.org-stats__commit-section.is-visible { opacity: 1; transform: none; }

.org-stats__commit-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.org-stats__commit-title {
  font-size: var(--text-xs);
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.org-stats__commit-count {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--ink-dim);
  letter-spacing: -0.01em;
}

.org-stats__commit-hint {
  font-size: var(--text-xs);
  color: var(--ink-dim);
}

/* 52 columns × 1 row (simplified linear bar vs full grid for clarity) */
.org-stats__commit-grid {
  display: grid;
  grid-template-columns: repeat(52, 1fr);
  gap: 2px;
  width: 100%;
}

.org-stats__commit-cell {
  height: 12px;
  border-radius: 2px;
  cursor: pointer;
  transform: scaleY(0.3);
  opacity: 0;
  transition:
    transform 120ms ease,
    filter 120ms ease,
    opacity 120ms ease;
  transform-origin: bottom center;
}

/* Wave-in when visible */
.org-stats__commit-cell.cell-animated {
  animation: cell-pop-in 300ms var(--ease-out-quart) both;
}

@keyframes cell-pop-in {
  from { transform: scaleY(0.2); opacity: 0; }
  to   { transform: scaleY(1);   opacity: 1; }
}

.org-stats__commit-cell.cell-animated {
  transform: scaleY(1);
  opacity: 1;
}

/* Hover: taller + brighter */
.org-stats__commit-cell:hover {
  transform: scaleY(1.6) !important;
  filter: brightness(1.5);
}

/* Level 0–4 intensity (monochrome) */
.org-stats__commit-cell--l0 { background: var(--surface); }
.org-stats__commit-cell--l1 { background: oklch(0.25 0 0); }
.org-stats__commit-cell--l2 { background: oklch(0.38 0 0); }
.org-stats__commit-cell--l3 { background: oklch(0.58 0 0); }
.org-stats__commit-cell--l4 { background: var(--ink); }

.org-stats__commit-legend {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: var(--space-2);
  font-size: var(--text-xs);
  color: var(--muted);
}
.org-stats__legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

/* ── Most-committed project ── */
.org-stats__top {
  margin-bottom: var(--space-12);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 600ms var(--ease-out-quart) 200ms,
              transform 600ms var(--ease-out-quart) 200ms;
}
.org-stats__top.is-visible { opacity: 1; transform: none; }

.org-stats__top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.org-stats__top-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.org-stats__top-across {
  font-size: var(--text-xs);
  color: var(--muted);
  transition: color var(--duration-fast) ease;
}
.org-stats__top-across:hover { color: var(--ink-dim); }

.org-stats__top-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-decoration: none;
  transition: border-color var(--duration-base) ease;
}
.org-stats__top-card:hover { border-color: var(--muted); }

.org-stats__top-card-left { flex: 1; }
.org-stats__top-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-3);
  flex-shrink: 0;
}

.org-stats__top-name {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-bottom: var(--space-2);
}

.org-stats__top-desc {
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.6;
  max-width: 480px;
}

.org-stats__top-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.org-stats__top-stat-num {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink);
  line-height: 1;
}
.org-stats__top-stat-lbl {
  font-size: var(--text-xs);
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.org-stats__top-lang {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--muted);
}
.org-stats__top-lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Top project language bar ── */
.org-stats__top-lang-section {
  margin-top: var(--space-4);
}

.org-stats__top-lang-bar {
  display: flex;
  height: 6px;
  border-radius: var(--radius-pill);
  overflow: hidden;
  gap: 1px;
  margin-bottom: var(--space-3);
}

.org-stats__top-lang-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

/* ── Language stacked bar ── */
.org-stats__lang-section {
  margin-bottom: var(--space-12);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 600ms var(--ease-out-quart) 280ms,
              transform 600ms var(--ease-out-quart) 280ms;
}
.org-stats__lang-section.is-visible { opacity: 1; transform: none; }

.org-stats__lang-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.org-stats__lang-label-txt {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.org-stats__lang-sub {
  font-size: var(--text-xs);
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.6;
}

.org-stats__lang-bar {
  display: flex;
  height: 8px;
  border-radius: var(--radius-pill);
  overflow: hidden;
  gap: 1px;
  margin-bottom: var(--space-4);
}

.org-stats__lang-segment {
  height: 100%;
  min-width: 0;
  width: 0;                  /* start collapsed */
  flex-shrink: 0;
  cursor: pointer;
  transition:
    transform 150ms ease,
    filter 180ms ease,
    box-shadow 180ms ease;
  transform-origin: left center;
}

/* Slide-in animation: width 0 → var(--seg-target) */
.org-stats__lang-segment.seg-animated {
  animation: seg-slide-in 700ms var(--ease-out-quart) both;
  animation-delay: var(--seg-delay, 0ms);
}

@keyframes seg-slide-in {
  from { width: 0; }
  to   { width: var(--seg-target, 0%); }
}

/* After animation ends, keep final width */
.org-stats__lang-segment.seg-animated {
  width: var(--seg-target, 0%);
}

/* Hover: lift + glow */
.org-stats__lang-segment:hover {
  transform: scaleY(1.5);
  filter: brightness(1.35) saturate(1.2);
  z-index: 1;
}

.org-stats__lang-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.org-stats__lang-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--muted);
  opacity: 0;
  transform: translateY(6px);
  transition: color 200ms ease;
}

.org-stats__lang-item.item-animated {
  animation: item-fade-up 400ms var(--ease-out-quart) both;
  animation-delay: var(--item-delay, 0ms);
}

@keyframes item-fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

.org-stats__lang-item.item-animated {
  opacity: 1;
  transform: none;
}

.org-stats__lang-item:hover { color: var(--ink-dim); }

.org-stats__lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── GitHub link ── */
.org-stats__gh-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--muted);
  transition: color var(--duration-fast) ease;
  opacity: 0;
  transition: opacity 600ms ease 400ms, color var(--duration-fast) ease;
}
.org-stats__gh-link.is-visible { opacity: 1; }
.org-stats__gh-link:hover { color: var(--ink); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .org-stats__commit-grid { grid-template-columns: repeat(26, 1fr); }
  /* Show last 26 weeks on mobile — handled via CSS, data still full */
}

@media (max-width: 640px) {
  .org-stats__grid { gap: var(--space-6); }
  .org-stats__divider { display: none; }
  .org-stats__top-card { flex-direction: column; }
  .org-stats__top-card-right { align-items: flex-start; flex-direction: row; gap: var(--space-6); }
  .org-stats__commit-grid { grid-template-columns: repeat(26, 1fr); }
}
</style>
