<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';

const { t } = useLanguage();
const mounted = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    setTimeout(() => { mounted.value = true; }, 50);
  });
});

const scrollTo = (id: string) => {
  const lenis = (window as any).__lenis;
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { duration: 1.2 });
  else target.scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
  <section id="home" class="hero" aria-labelledby="hero-heading">
    <!-- Spline Background Embed -->
    <div class="hero__spline-container">
      <iframe
        src="https://my.spline.design/reactiveorb-yzTbcr7z0rqU7QJe280Tw1dU/"
        frameborder="0"
        class="hero__spline-iframe"
        title="NekoTech Interactive 3D Spline Reactive Orb"
      ></iframe>
      <div class="hero__spline-overlay" aria-hidden="true"></div>
    </div>

    <div class="hero__accent-line" aria-hidden="true"></div>

    <div class="hero__inner container">
      <!-- Left: text content -->
      <div class="hero__content" :class="{ 'hero__content--visible': mounted }">
        <p class="hero__org">
          <span class="hero__org-dot" aria-hidden="true"></span>
          NekoTech Foundation · Est. Sep 2025
        </p>

        <h1 id="hero-heading" class="hero__heading">
          <span class="hero__line hero__line--1">We build.</span>
          <span class="hero__line hero__line--2">We learn.</span>
          <span class="hero__line hero__line--3">We ship.<span class="hero__cursor" aria-hidden="true">_</span></span>
        </h1>

        <p class="hero__sub">{{ t.hero.landing.slogan }}</p>

        <div class="hero__ctas">
          <button class="hero__cta hero__cta--primary" @click="scrollTo('story')">
            {{ t.navigation.story }}
          </button>
          <button class="hero__cta hero__cta--ghost" @click="scrollTo('career')">
            {{ t.navigation.career }}
          </button>
        </div>
      </div>

      <!-- Right: visual area spacer -->
      <div class="hero__visual-spacer" aria-hidden="true"></div>
    </div>

    <div class="hero__scroll" aria-hidden="true">
      <div class="hero__scroll-line"></div>
    </div>
  </section>
</template>

<style scoped>
/* ── Shell ── */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow: hidden;
}

.hero__accent-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
}

/* ── Inner ── */
.hero__inner {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--space-8);
  padding-top: 96px;
  padding-bottom: var(--space-24);
  min-height: 100svh;
  position: relative;
  z-index: 1;
  pointer-events: none;
}

/* ── Content (left) ── */
.hero__content {
  max-width: 640px;
  pointer-events: none;
}

.hero__content--visible .hero__org {
  opacity: 1; transform: none;
}
.hero__content--visible .hero__line--1 {
  opacity: 1; transform: none; transition-delay: 80ms;
}
.hero__content--visible .hero__line--2 {
  opacity: 1; transform: none; transition-delay: 160ms;
}
.hero__content--visible .hero__line--3 {
  opacity: 1; transform: none; transition-delay: 240ms;
}
.hero__content--visible .hero__sub {
  opacity: 1; transform: none; transition-delay: 340ms;
}
.hero__content--visible .hero__ctas {
  opacity: 1; transform: none; transition-delay: 440ms;
}

.hero__org {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  margin-bottom: var(--space-6);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--duration-slow) var(--ease-out-quart),
              transform var(--duration-slow) var(--ease-out-quart);
}

.hero__org-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

.hero__heading {
  display: flex;
  flex-direction: column;
  font-size: var(--text-hero);
  font-weight: 800;
  line-height: 1.0;
  letter-spacing: -0.03em;
  margin-bottom: var(--space-8);
  color: var(--ink);
}

.hero__line {
  display: block;
  opacity: 0;
  transform: translateY(32px);
  transition: opacity var(--duration-slow) var(--ease-out-quart),
              transform var(--duration-slow) var(--ease-out-quart);
}

.hero__cursor {
  color: var(--accent);
  animation: cursor-blink 1.1s step-end infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.hero__sub {
  font-size: var(--text-lg);
  color: var(--ink-dim);
  font-weight: 300;
  line-height: 1.5;
  margin-bottom: var(--space-12);
  max-width: 480px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--duration-slow) var(--ease-out-quart),
              transform var(--duration-slow) var(--ease-out-quart);
}

.hero__ctas {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--duration-slow) var(--ease-out-quart),
              transform var(--duration-slow) var(--ease-out-quart);
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  font-size: var(--text-sm);
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  pointer-events: auto;
  transition: background var(--duration-fast) ease,
              color var(--duration-fast) ease,
              border-color var(--duration-fast) ease;
}

.hero__cta--primary {
  background: var(--ink);
  color: var(--bg);
  border: none;
}

.hero__cta--primary:hover { background: var(--ink-dim); }

.hero__cta--ghost {
  color: var(--ink-dim);
  border: 1px solid var(--border);
  background: none;
}

.hero__cta--ghost:hover {
  color: var(--ink);
  border-color: var(--muted);
}

/* ── Spline Background ── */
.hero__spline-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  z-index: 0;
  pointer-events: auto;
  overflow: hidden;
}

.hero__spline-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  pointer-events: auto;
}

.hero__spline-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, var(--bg) 0%, transparent 10%, transparent 90%, var(--bg) 100%),
              linear-gradient(to right, var(--bg) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Visual area spacer ── */
.hero__visual-spacer {
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* ── Responsive ── */
@media (max-width: 960px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }

  .hero__visual-spacer {
    display: none;
  }

  .hero__spline-container {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .hero__heading { letter-spacing: -0.025em; }

  .hero__ctas {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero__cta {
    width: 100%;
    justify-content: center;
  }
}
</style>
