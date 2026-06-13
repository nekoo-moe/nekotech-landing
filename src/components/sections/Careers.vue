<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';

const { t } = useLanguage();
const cardRefs = ref<HTMLElement[]>([]);

const STATUS = {
  active:      { label: 'Active',  color: 'oklch(0.75 0.15 155)' },
  development: { label: 'In Dev',  color: 'oklch(0.75 0.15 55)'  },
  planned:     { label: 'Planned', color: 'var(--muted)'          },
} as const;

const projects = computed(() => [
  {
    id: 'nekoai',
    title: 'NekoAI',
    description: t.value.careers.items.nekoai.description,
    status: 'development' as const,
    featured: true,
    tag: 'AI · 2D Agent',
  },
  {
    id: 'nekocomics',
    title: 'NekoComics',
    description: t.value.careers.items.nekocomics.description,
    status: 'development' as const,
    featured: false,
    tag: 'Web · Mobile',
  },
  {
    id: 'nekostream',
    title: 'NekoStream',
    description: t.value.careers.items.nekostream.description,
    status: 'planned' as const,
    featured: false,
    tag: 'Streaming',
  },
  {
    id: 'nekostream-cli',
    title: 'NekoStream CLI',
    description: t.value.careers.items.nekostreamCli.description,
    status: 'planned' as const,
    featured: false,
    tag: 'CLI · Terminal',
  },
  {
    id: 'fujiwara',
    title: 'Fujiwara Shin',
    description: t.value.careers.items.fujiwara.description,
    status: 'active' as const,
    featured: false,
    tag: 'Discord Bot · SaaS',
  },
]);

onMounted(async () => {
  await nextTick();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    cardRefs.value.forEach(el => el?.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cardRefs.value.forEach((el, i) => {
    if (!el) return;
    el.style.transitionDelay = `${i * 80}ms`;
    observer.observe(el);
  });
});
</script>

<template>
  <section id="career" class="projects section">
    <div class="container">
      <header class="projects__header reveal-heading">
        <h2 class="projects__heading">{{ t.careers.title }}</h2>
        <p class="projects__sub">{{ t.careers.subtitle }}</p>
      </header>

      <div class="projects__bento">
        <article
          v-for="(project, i) in projects"
          :key="project.id"
          class="projects__card"
          :class="{ 'projects__card--featured': project.featured }"
          :ref="el => { if (el) cardRefs[i] = el as HTMLElement }"
        >
          <div class="projects__card-inner">
            <header class="projects__card-header">
              <div class="projects__card-titles">
                <h3 class="projects__card-title">{{ project.title }}</h3>
                <span class="projects__card-tag">{{ project.tag }}</span>
              </div>
              <span
                class="projects__status"
                :style="{ '--status-color': STATUS[project.status].color }"
              >
                <span class="projects__status-dot" aria-hidden="true"></span>
                {{ STATUS[project.status].label }}
              </span>
            </header>
            <p class="projects__card-desc">{{ project.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects__header {
  margin-bottom: var(--space-12);
}

.projects__heading {
  font-size: var(--text-3xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin-bottom: var(--space-3);
}

.projects__sub {
  font-size: var(--text-base);
  color: var(--muted);
}

/* ── Bento grid ── */
.projects__bento {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.projects__card--featured {
  grid-column: 1 / -1;
}

/* ── Card entrance ── */
.projects__card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 500ms var(--ease-out-quart),
              transform 500ms var(--ease-out-quart),
              border-color var(--duration-base) ease;
}

.projects__card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.projects__card:hover {
  border-color: var(--muted);
}

.projects__card-inner {
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
}

.projects__card--featured .projects__card-inner {
  padding: var(--space-10);
}

/* ── Card header ── */
.projects__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.projects__card-titles {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.projects__card-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
  line-height: 1.1;
}

.projects__card--featured .projects__card-title {
  font-size: var(--text-3xl);
}

.projects__card-tag {
  font-size: var(--text-xs);
  color: var(--muted);
  font-weight: 500;
  letter-spacing: 0.04em;
}

/* ── Status badge ── */
.projects__status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--status-color, var(--muted));
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;
}

.projects__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--status-color, var(--muted));
  flex-shrink: 0;
}

/* ── Description ── */
.projects__card-desc {
  font-size: var(--text-sm);
  color: var(--ink-dim);
  line-height: 1.65;
  flex: 1;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .projects__bento {
    grid-template-columns: 1fr;
  }

  .projects__card--featured {
    grid-column: 1;
  }

  .projects__card--featured .projects__card-inner {
    padding: var(--space-6);
  }
}
</style>
