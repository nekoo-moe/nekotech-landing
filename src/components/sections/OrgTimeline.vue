<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import story1 from '@/assets/figures/story-1.png';
import storyExtra from '@/assets/figures/8idet6.png';

const { t } = useLanguage();

// Milestone 2 has NO image — intentionally blank
const milestones = [
  {
    date: 'SEP 26, 2025',
    title: 'NekoTech Founded',
    body: 'Started as a small Discord group by akk1to with a single goal: recreate a manga reader. Three developers, one shared obsession with building.',
    accent: true,
    image: story1,
    imageAlt: 'NekoTech Foundation — origin screenshot',
    hasImage: true,
  },
  {
    date: 'DEC 18, 2025',
    title: 'First Projects Ship',
    body: 'NekoComics, NekoBuckets, and NekoMusics go live. The org grows from a Discord group into a team building real products used by real people.',
    accent: false,
    image: null,
    imageAlt: '',
    hasImage: false,
  },
  {
    date: '2026',
    title: 'Growing the org',
    body: 'NekoAI, NekoStream, and Fujiwara enter active development. The team expands, open-source contributions increase, and the first contributors from outside the core team join.',
    accent: false,
    image: storyExtra,
    imageAlt: 'NekoTech org growth — milestone graphic',
    hasImage: true,
  },
];

const wrapperRef = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const prevIndex = ref(0);
const imageVisible = ref(true);
const sectionProgress = ref(0); // 0..1 across the entire scroll zone

// Each milestone takes 80vh of scroll height
const SCROLL_PER_STEP = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600;

const setActive = (i: number) => {
  if (i === activeIndex.value) return;
  prevIndex.value = activeIndex.value;
  imageVisible.value = false;
  setTimeout(() => {
    activeIndex.value = i;
    imageVisible.value = true;
  }, 220);
};

const onScroll = () => {
  if (!wrapperRef.value) return;
  const rect = wrapperRef.value.getBoundingClientRect();
  // Distance scrolled into the scroll zone (positive = in view)
  const scrolled = -rect.top;
  const totalScroll = wrapperRef.value.offsetHeight - window.innerHeight;
  sectionProgress.value = Math.max(0, Math.min(1, scrolled / totalScroll));

  // Determine active milestone from scroll position
  const zone = wrapperRef.value.offsetHeight - window.innerHeight;
  const newIndex = Math.min(
    milestones.length - 1,
    Math.floor(scrolled / (zone / milestones.length))
  );
  if (newIndex >= 0) setActive(newIndex);
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});

const currentMilestone = computed(() => milestones[activeIndex.value]);
</script>

<template>
  <section id="story" class="timeline">
    <div class="container">
      <header class="timeline__header reveal-heading">
        <h2 class="timeline__heading">{{ t.story.title }}</h2>
        <p class="timeline__sub">{{ t.story.subtitle }}</p>
      </header>
    </div>

    <!--
      Scrollytelling wrapper:
      Height = (milestones.count × 100vh) so each milestone gets
      a full viewport of scroll distance before advancing.
    -->
    <div
      class="timeline__scroll-wrapper"
      ref="wrapperRef"
      :style="{ height: `${milestones.length * 100}vh` }"
    >
      <!-- Sticky panel — stays in view while wrapper scrolls -->
      <div class="timeline__sticky">
        <div class="container timeline__sticky-inner">

          <!-- Left: milestone list -->
          <ol class="timeline__list" role="list">
            <li
              v-for="(item, i) in milestones"
              :key="item.date"
              class="timeline__item"
              :class="{
                'timeline__item--accent': item.accent,
                'timeline__item--active': i === activeIndex,
                'timeline__item--past': i < activeIndex,
              }"
              @click="wrapperRef && (window as any).__lenis?.scrollTo(
                wrapperRef, {
                  offset: Math.round(i * (wrapperRef.offsetHeight - window.innerHeight) / (milestones.length - 1)) - 1,
                  duration: 1.4
                }
              )"
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
              <!-- Empty state for milestone 2 -->
              <div v-if="!currentMilestone.hasImage" class="timeline__media-empty">
                <div class="timeline__media-empty-lines">
                  <span v-for="n in 5" :key="n" class="timeline__empty-line" :style="{ '--n': n }"></span>
                </div>
                <p class="timeline__media-empty-label">Dec 2025</p>
              </div>

              <Transition name="scene">
                <img
                  v-if="imageVisible && currentMilestone.hasImage"
                  :key="activeIndex"
                  :src="currentMilestone.image!"
                  :alt="currentMilestone.imageAlt"
                  class="timeline__image"
                  loading="lazy"
                />
              </Transition>

              <!-- Date label overlay -->
              <div class="timeline__media-label">
                <span class="timeline__media-dot" aria-hidden="true"></span>
                {{ currentMilestone.date }}
              </div>
            </div>

            <!-- Progress bar -->
            <div class="timeline__progress">
              <div
                class="timeline__progress-fill"
                :style="{ transform: `scaleX(${(activeIndex + 1) / milestones.length})` }"
              ></div>
            </div>

            <!-- Step indicators -->
            <div class="timeline__steps" aria-hidden="true">
              <span
                v-for="(_, i) in milestones"
                :key="i"
                class="timeline__step"
                :class="{ 'timeline__step--active': i === activeIndex, 'timeline__step--past': i < activeIndex }"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Section shell ── */
.timeline {
  padding-block: 0;
}

.timeline__header {
  padding-top: clamp(4rem, 8vw, 8rem);
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

/* ── Scrollytelling wrapper ── */
.timeline__scroll-wrapper {
  position: relative;
  /* Height is set inline based on milestone count */
}

/* Sticky panel — fills the viewport while parent scrolls */
.timeline__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.timeline__sticky-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
  width: 100%;
}

/* ── List ── */
.timeline__list {
  list-style: none;
}

.timeline__item {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: var(--space-5);
  position: relative;
  cursor: pointer;
  transition: opacity 500ms var(--ease-out-quart);
}

.timeline__item:not(.timeline__item--active):not(.timeline__item--past) {
  opacity: 0.3;
}

.timeline__item--past {
  opacity: 0.55;
}

.timeline__item--active {
  opacity: 1;
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
  transition: background 350ms ease,
              box-shadow 350ms ease,
              transform 350ms var(--ease-out-quart);
}

.timeline__item--accent .timeline__dot {
  background: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-dim), 0 0 16px var(--accent-dim);
}

.timeline__item--active .timeline__dot {
  transform: scale(1.5);
  background: var(--ink);
  box-shadow: 0 0 0 3px oklch(0.96 0 0 / 0.12);
}

.timeline__item--accent.timeline__item--active .timeline__dot {
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim), 0 0 24px var(--accent-dim);
}

.timeline__item--past .timeline__dot {
  background: oklch(0.35 0 0);
  box-shadow: none;
}

.timeline__line {
  flex: 1;
  width: 1px;
  background: var(--border);
  margin-top: var(--space-2);
  min-height: 56px;
  transition: background 350ms ease;
}

.timeline__item--past .timeline__line {
  background: oklch(0.35 0 0);
}

/* ── Content ── */
.timeline__content {
  padding-bottom: var(--space-10);
}

.timeline__date {
  display: block;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  margin-bottom: var(--space-3);
  transition: color 350ms ease;
}

.timeline__item--accent .timeline__date { color: var(--accent); }
.timeline__item--active .timeline__date { color: var(--ink); }

.timeline__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink-dim);
  margin-bottom: var(--space-3);
  transition: color 350ms ease, font-size 350ms var(--ease-out-quart);
}

.timeline__item--active .timeline__title {
  color: var(--ink);
  font-size: var(--text-2xl);
}

.timeline__body {
  font-size: var(--text-base);
  color: var(--muted);
  line-height: 1.7;
  max-width: 480px;
  transition: color 350ms ease;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 400ms var(--ease-out-quart),
              opacity 400ms ease,
              color 350ms ease;
}

.timeline__item--active .timeline__body {
  max-height: 10rem;
  opacity: 1;
  color: var(--ink-dim);
}

/* ── Right media panel ── */
.timeline__media {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
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

/* ── Empty panel (milestone 2) ── */
.timeline__media-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
}

.timeline__media-empty-lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 60%;
}

.timeline__empty-line {
  height: 2px;
  background: var(--border);
  border-radius: 2px;
  width: calc(100% - var(--n) * 12%);
  animation: skeleton-pulse 2s ease-in-out infinite;
  animation-delay: calc(var(--n) * 0.15s);
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.3; }
  50%       { opacity: 0.8; }
}

.timeline__media-empty-label {
  font-size: var(--text-xs);
  color: var(--muted);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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
  animation: dot-pulse 2s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.6); }
}

/* ── Progress bar ── */
.timeline__progress {
  height: 2px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.timeline__progress-fill {
  height: 100%;
  background: var(--accent);
  transform-origin: left;
  transition: transform 400ms var(--ease-out-quart);
}

/* ── Step dots ── */
.timeline__steps {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.timeline__step {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border);
  transition: background 300ms ease, transform 300ms ease;
  flex-shrink: 0;
}

.timeline__step--past { background: oklch(0.4 0 0); }
.timeline__step--active {
  background: var(--accent);
  transform: scale(1.4);
  box-shadow: 0 0 8px var(--accent-dim);
}

/* ── Scene transition ── */
.scene-enter-active {
  transition: opacity 300ms ease, transform 300ms var(--ease-out-quart);
}
.scene-leave-active {
  transition: opacity 200ms ease;
  position: absolute;
  inset: 0;
}
.scene-enter-from { opacity: 0; transform: scale(1.04); }
.scene-leave-to   { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .timeline__sticky-inner {
    grid-template-columns: 1fr;
    gap: var(--space-8);
    padding-top: 80px;
    align-items: start;
  }

  .timeline__media {
    order: -1;
  }

  .timeline__sticky {
    height: auto;
    min-height: 100vh;
    align-items: flex-start;
    padding-bottom: var(--space-8);
  }
}

@media (max-width: 640px) {
  .timeline__item {
    grid-template-columns: 24px 1fr;
    gap: var(--space-3);
  }
}
</style>
