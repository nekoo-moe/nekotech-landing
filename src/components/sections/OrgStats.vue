<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrgStats } from '@/composables/useOrgStats';
import { useScrollReveal } from '@/composables/useScrollReveal';

const { stats, loading } = useOrgStats();
const { reveal } = useScrollReveal();

const sectionRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (sectionRef.value) reveal(sectionRef.value);
});

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  Vue: '#41b883',
  CSS: '#563d7c',
  HTML: '#e34c26',
};
</script>

<template>
  <section id="org-stats" class="org-stats section" ref="sectionRef">
    <div class="container">
      <div class="org-stats__grid">
        <!-- Stat: Members -->
        <div class="org-stats__item">
          <template v-if="loading">
            <div class="org-stats__skeleton org-stats__skeleton--num"></div>
          </template>
          <template v-else>
            <span class="org-stats__num">{{ stats.members }}</span>
          </template>
          <span class="org-stats__label">Members</span>
        </div>

        <!-- Divider -->
        <div class="org-stats__divider" aria-hidden="true"></div>

        <!-- Stat: Repos -->
        <div class="org-stats__item">
          <template v-if="loading">
            <div class="org-stats__skeleton org-stats__skeleton--num"></div>
          </template>
          <template v-else>
            <span class="org-stats__num">{{ stats.repos }}</span>
          </template>
          <span class="org-stats__label">
            Repositories
            <span v-if="!loading && stats.privateRepos" class="org-stats__badge">
              {{ stats.privateRepos }} private
            </span>
          </span>
        </div>

        <!-- Divider -->
        <div class="org-stats__divider" aria-hidden="true"></div>

        <!-- Stat: Stars -->
        <div class="org-stats__item">
          <template v-if="loading">
            <div class="org-stats__skeleton org-stats__skeleton--num"></div>
          </template>
          <template v-else>
            <span class="org-stats__num">{{ stats.totalStars }}</span>
          </template>
          <span class="org-stats__label">Stars</span>
        </div>
      </div>

      <!-- Language bar -->
      <div class="org-stats__langs" v-if="!loading && stats.languages.length">
        <div class="org-stats__lang-label">Languages</div>
        <div class="org-stats__lang-list">
          <span
            v-for="lang in stats.languages"
            :key="lang"
            class="org-stats__lang"
          >
            <span
              class="org-stats__lang-dot"
              :style="{ background: LANG_COLORS[lang] ?? 'var(--muted)' }"
              aria-hidden="true"
            ></span>
            {{ lang }}
          </span>
        </div>
      </div>

      <!-- GitHub link -->
      <a
        href="https://github.com/NekoTech-Foundation"
        target="_blank"
        rel="noopener noreferrer"
        class="org-stats__gh-link"
      >
        github.com/NekoTech-Foundation
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

/* ── Stats grid ── */
.org-stats__grid {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
  flex-wrap: wrap;
  margin-bottom: var(--space-8);
}

.org-stats__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

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

/* Vertical divider between stats */
.org-stats__divider {
  width: 1px;
  height: clamp(3rem, 7vw, 5.5rem);
  background: var(--border);
  align-self: flex-start;
  flex-shrink: 0;
}

/* ── Skeleton loading ── */
.org-stats__skeleton {
  border-radius: var(--radius-sm);
  background: var(--surface);
  animation: skeleton-pulse 1.4s ease-in-out infinite;
}

.org-stats__skeleton--num {
  width: 120px;
  height: clamp(3rem, 7vw, 5.5rem);
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1;   }
}

/* ── Languages ── */
.org-stats__langs {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.org-stats__lang-label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  flex-shrink: 0;
}

.org-stats__lang-list {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.org-stats__lang {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--ink-dim);
}

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
}

.org-stats__gh-link:hover {
  color: var(--ink);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .org-stats__grid {
    gap: var(--space-6);
  }

  .org-stats__divider {
    display: none;
  }
}
</style>
