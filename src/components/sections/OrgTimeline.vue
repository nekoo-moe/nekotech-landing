<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import story1 from '@/assets/figures/story-1.png';
import story2 from '@/assets/figures/story-2.jpg';
import storyExtra from '@/assets/figures/8idet6.png';

const { t } = useLanguage();

const milestones = [
  {
    date: 'SEP 26, 2025',
    dateVi: '26 TH09, 2025',
    title: 'NekoTech Founded',
    body: 'Started as a small Discord group by akk1to with a single goal: recreate a manga reader. Three developers, one shared obsession with building.',
    accent: true,
    image: story1,
    imageAlt: 'NekoTech Foundation — origin screenshot',
  },
  {
    date: 'DEC 18, 2025',
    dateVi: '18 TH12, 2025',
    title: 'First Projects Ship',
    body: 'NekoComics, NekoBuckets, and NekoMusics go live. The org grows from a Discord group into a team building real products used by real people.',
    accent: false,
    image: story2,
    imageAlt: 'NekoTech early project — team working together',
  },
  {
    date: '2026',
    dateVi: '2026',
    title: 'Growing the org',
    body: 'NekoAI, NekoStream, and Fujiwara enter active development. The team expands, open-source contributions increase, and the first contributors from outside the core team join.',
    accent: false,
    image: storyExtra,
    imageAlt: 'NekoTech org growth — milestone graphic',
  },
];

const activeIndex = ref(0);
const itemRefs = ref<HTMLElement[]>([]);
const imageVisible = ref(true);

let observer: IntersectionObserver | null = null;

const switchImage = (i: number) => {
  if (i === activeIndex.value) return;
  imageVisible.value = false;
  setTimeout(() => {
    activeIndex.value = i;
    imageVisible.value = true;
  }, 250);
};

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        const idx = itemRefs.value.indexOf(entry.target as HTMLElement);
        if (idx !== -1) switchImage(idx);
      } else {
        // Only remove dot active state; keep text visible
      }
    });
  }, { threshold: 0.45, rootMargin: '0px 0px -100px 0px' });

  itemRefs.value.forEach((el, i) => {
    if (!el) return;
    if (!prefersReduced) {
      el.style.transitionDelay = `${i * 120}ms`;
    } else {
      el.classList.add('is-visible');
    }
    observer!.observe(el);
  });
});

onUnmounted(() => { observer?.disconnect(); });
</script>

<template>
  <section id="story" class="timeline section">
    <div class="container">
      <!-- Section header -->
      <header class="timeline__header">
        <h2 class="timeline__heading">{{ t.story.title }}</h2>
        <p class="timeline__sub">{{ t.story.subtitle }}</p>
      </header>

      <div class="timeline__layout">
        <!-- Left: milestone list -->
        <ol class="timeline__list" role="list">
          <li
            v-for="(item, i) in milestones"
            :key="item.date"
            class="timeline__item"
            :class="{
              'timeline__item--accent': item.accent,
              'timeline__item--active': i === activeIndex
            }"
            :ref="el => { if (el) itemRefs[i] = el as HTMLElement }"
            @click="switchImage(i)"
            role="listitem"
          >
            <div class="timeline__marker" aria-hidden="true">
              <span class="timeline__dot"></span>
              <span class="timeline__line" v-if="i < milestones.length - 1"></span>
            </div>
            <div class="timeline__content">
              <time class="timeline__date">{{ item.date }}</time>
              <h3 class="timeline__title">{{ item.title }}</h3>
              <p class="timeline__body">{{ item.body }}</p>
            </div>
          </li>
        </ol>

        <!-- Right: sticky image panel -->
        <div class="timeline__media">
          <div class="timeline__media-inner">
            <Transition name="scene">
              <img
                v-if="imageVisible"
                :key="activeIndex"
                :src="milestones[activeIndex].image"
                :alt="milestones[activeIndex].imageAlt"
                class="timeline__image"
                loading="lazy"
              />
            </Transition>
            <div class="timeline__media-label">
              <span class="timeline__media-dot" aria-hidden="true"></span>
              {{ milestones[activeIndex].date }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Header ── */
.timeline__header {
  margin-bottom: var(--space-16);
}

.timeline__heading {
  font-size: var(--text-3xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin-bottom: var(--space-3);
}

.timeline__sub {
  font-size: var(--text-base);
  color: var(--muted);
}

/* ── Two-column layout ── */
.timeline__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: start;
}

/* ── Timeline list ── */
.timeline__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Item entrance ── */
.timeline__item {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: var(--space-5);
  position: relative;
  cursor: pointer;
  opacity: 0;
  transform: translateX(-24px);
  transition: opacity 600ms var(--ease-out-quart),
              transform 600ms var(--ease-out-quart);
}

.timeline__item.is-visible {
  opacity: 1;
  transform: translateX(0);
}

/* ── Dot ── */
.timeline__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
}

.timeline__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border);
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 2px var(--border);
  flex-shrink: 0;
  transition: background 300ms ease,
              box-shadow 300ms ease,
              transform 300ms var(--ease-out-quart);
}

.timeline__item--accent .timeline__dot {
  background: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-dim), 0 0 16px var(--accent-dim);
}

/* Active dot pulse */
.timeline__item--active .timeline__dot {
  transform: scale(1.4);
  background: var(--ink);
  box-shadow: 0 0 0 3px oklch(0.96 0 0 / 0.1);
}

.timeline__item--accent.timeline__item--active .timeline__dot {
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim), 0 0 20px var(--accent-dim);
}

.timeline__line {
  flex: 1;
  width: 1px;
  background: var(--border);
  margin-top: var(--space-2);
  min-height: 60px;
  transition: background 300ms ease;
}

.timeline__item--active .timeline__line {
  background: oklch(0.35 0 0);
}

/* ── Content ── */
.timeline__content {
  padding-bottom: var(--space-12);
}

.timeline__date {
  display: block;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  margin-bottom: var(--space-3);
  transition: color 300ms ease;
}

.timeline__item--accent .timeline__date {
  color: var(--accent);
}

.timeline__item--active .timeline__date {
  color: var(--ink);
}

.timeline__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink-dim);
  margin-bottom: var(--space-3);
  transition: color 300ms ease;
}

.timeline__item--active .timeline__title {
  color: var(--ink);
}

.timeline__body {
  font-size: var(--text-base);
  color: var(--muted);
  line-height: 1.7;
  max-width: 480px;
  transition: color 300ms ease;
}

.timeline__item--active .timeline__body {
  color: var(--ink-dim);
}

/* ── Right: media panel ── */
.timeline__media {
  position: sticky;
  top: 100px;
}

.timeline__media-inner {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  aspect-ratio: 4 / 3;
}

.timeline__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Date label overlay ── */
.timeline__media-label {
  position: absolute;
  bottom: var(--space-4);
  left: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink);
  background: oklch(0.06 0 0 / 0.75);
  backdrop-filter: blur(8px);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}

.timeline__media-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.7); }
}

/* ── Scene transition ── */
.scene-enter-active {
  transition: opacity 300ms ease, transform 300ms var(--ease-out-quart);
}

.scene-leave-active {
  transition: opacity 200ms ease, transform 200ms var(--ease-in-quart);
  position: absolute;
  inset: 0;
}

.scene-enter-from {
  opacity: 0;
  transform: scale(1.04);
}

.scene-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .timeline__layout {
    grid-template-columns: 1fr;
  }

  .timeline__media {
    position: relative;
    top: 0;
    order: -1;
    margin-bottom: var(--space-8);
  }
}

@media (max-width: 640px) {
  .timeline__item {
    grid-template-columns: 24px 1fr;
    gap: var(--space-3);
  }
}
</style>
