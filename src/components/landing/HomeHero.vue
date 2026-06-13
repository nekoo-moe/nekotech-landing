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

      <!-- Right: pixel/isometric 3-D graphic -->
      <div class="hero__visual" aria-hidden="true" :class="{ 'hero__visual--visible': mounted }">
        <div class="pixel-scene">
          <!-- Floating cubes -->
          <div class="cube cube--a">
            <div class="cube__face cube__face--front"></div>
            <div class="cube__face cube__face--top"></div>
            <div class="cube__face cube__face--side"></div>
          </div>
          <div class="cube cube--b">
            <div class="cube__face cube__face--front"></div>
            <div class="cube__face cube__face--top"></div>
            <div class="cube__face cube__face--side"></div>
          </div>
          <div class="cube cube--c">
            <div class="cube__face cube__face--front"></div>
            <div class="cube__face cube__face--top"></div>
            <div class="cube__face cube__face--side"></div>
          </div>
          <div class="cube cube--d">
            <div class="cube__face cube__face--front"></div>
            <div class="cube__face cube__face--top"></div>
            <div class="cube__face cube__face--side"></div>
          </div>
          <div class="cube cube--e">
            <div class="cube__face cube__face--front"></div>
            <div class="cube__face cube__face--top"></div>
            <div class="cube__face cube__face--side"></div>
          </div>

          <!-- Accent grid lines -->
          <div class="pixel-grid">
            <div class="pixel-grid__line" v-for="i in 6" :key="i" :style="{ '--i': i }"></div>
          </div>

          <!-- Code terminal mockup -->
          <div class="terminal">
            <div class="terminal__bar">
              <span class="terminal__dot terminal__dot--r"></span>
              <span class="terminal__dot terminal__dot--y"></span>
              <span class="terminal__dot terminal__dot--g"></span>
            </div>
            <div class="terminal__body">
              <div class="terminal__line"><span class="terminal__prompt">$</span> <span class="terminal__cmd">git push origin main</span></div>
              <div class="terminal__line terminal__line--output">↳ Deployed to production</div>
              <div class="terminal__line"><span class="terminal__prompt">$</span> <span class="terminal__cmd typing">npm run ship</span><span class="terminal__cursor-blink">▋</span></div>
            </div>
          </div>

          <!-- Floating tags -->
          <span class="pixel-tag pixel-tag--1">TypeScript</span>
          <span class="pixel-tag pixel-tag--2">Vue 3</span>
          <span class="pixel-tag pixel-tag--3">Go</span>
          <span class="pixel-tag pixel-tag--4">Python</span>
        </div>
      </div>
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
}

/* ── Content (left) ── */
.hero__content { max-width: 640px; }

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

/* ── Right visual ── */
.hero__visual {
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateX(32px);
  transition: opacity 800ms var(--ease-out-quart) 400ms,
              transform 800ms var(--ease-out-quart) 400ms;
}

.hero__visual--visible {
  opacity: 1;
  transform: translateX(0);
}

/* ── Pixel scene container ── */
.pixel-scene {
  position: relative;
  width: 420px;
  height: 420px;
}

/* ── Isometric cube base ── */
.cube {
  position: absolute;
  width: 64px;
  height: 64px;
  transform-style: preserve-3d;
  animation: float-bob 4s ease-in-out infinite;
}

.cube__face {
  position: absolute;
  width: 100%;
  height: 100%;
}

/* Isometric illusion via clip-path + transforms */
.cube__face--front {
  background: var(--surface);
  border: 1px solid var(--border);
  clip-path: polygon(0 50%, 50% 100%, 100% 50%, 50% 0);
}

.cube__face--top {
  background: oklch(0.18 0.000 0);
  clip-path: polygon(0 25%, 50% 0, 100% 25%, 50% 50%);
  top: -25%;
}

.cube__face--side {
  background: oklch(0.09 0.000 0);
  clip-path: polygon(100% 25%, 100% 75%, 50% 100%, 50% 50%);
  left: 25%;
  top: 25%;
  width: 50%;
}

/* Accent cube */
.cube--a .cube__face--top { background: var(--accent); }

/* Positions */
.cube--a { top: 60px;  left: 160px; width: 80px; height: 80px; animation-delay: 0s; }
.cube--b { top: 160px; left: 60px;  width: 56px; height: 56px; animation-delay: 0.7s; }
.cube--c { top: 220px; left: 240px; width: 48px; height: 48px; animation-delay: 1.2s; }
.cube--d { top: 100px; left: 300px; width: 40px; height: 40px; animation-delay: 0.4s; }
.cube--e { top: 300px; left: 140px; width: 36px; height: 36px; animation-delay: 1.8s; }

@keyframes float-bob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}

/* ── Grid overlay ── */
.pixel-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.12;
}

.pixel-grid__line {
  position: absolute;
  background: var(--muted);
  animation: grid-pulse 3s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.4s);
}

.pixel-grid__line:nth-child(odd) {
  width: 1px;
  height: 100%;
  left: calc(var(--i) * 16.66%);
  top: 0;
}

.pixel-grid__line:nth-child(even) {
  width: 100%;
  height: 1px;
  top: calc(var(--i) * 16.66%);
  left: 0;
}

@keyframes grid-pulse {
  0%, 100% { opacity: 0.3; }
  50%       { opacity: 1; }
}

/* ── Terminal mockup ── */
.terminal {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 40px;
  background: oklch(0.10 0 0);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 24px 48px oklch(0 0 0 / 0.6);
}

.terminal__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.terminal__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal__dot--r { background: #ff5f57; }
.terminal__dot--y { background: #febc2e; }
.terminal__dot--g { background: #28c840; }

.terminal__body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.terminal__line {
  font-family: 'Courier New', monospace;
  font-size: 0.72rem;
  display: flex;
  gap: 8px;
  color: oklch(0.8 0 0);
}

.terminal__line--output {
  color: oklch(0.65 0.15 155);
  padding-left: 4px;
}

.terminal__prompt {
  color: var(--accent);
  flex-shrink: 0;
}

.terminal__cmd {
  color: oklch(0.9 0 0);
}

.terminal__cursor-blink {
  color: oklch(0.7 0 0);
  animation: cursor-blink 1s step-end infinite;
}

/* ── Floating tech tags ── */
.pixel-tag {
  position: absolute;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--muted);
  animation: tag-float 5s ease-in-out infinite;
}

.pixel-tag--1 { top: 30px;  right: 80px;  animation-delay: 0s; }
.pixel-tag--2 { top: 80px;  right: 20px;  animation-delay: 1s; color: oklch(0.75 0.17 155); border-color: oklch(0.30 0.10 155); }
.pixel-tag--3 { top: 180px; right: 10px;  animation-delay: 2s; color: oklch(0.70 0.15 210); border-color: oklch(0.30 0.08 210); }
.pixel-tag--4 { top: 240px; right: 60px;  animation-delay: 0.5s; }

@keyframes tag-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33%       { transform: translateY(-6px) rotate(-1deg); }
  66%       { transform: translateY(4px) rotate(1deg); }
}

/* ── Scroll indicator ── */
.hero__scroll {
  position: absolute;
  bottom: var(--space-8);
  left: clamp(1rem, 5vw, 3rem);
}

.hero__scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, var(--border), transparent);
  animation: scroll-pulse 2s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50%       { opacity: 1;   transform: scaleY(0.7) translateY(8px); }
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .hero__line, .hero__org, .hero__sub, .hero__ctas {
    opacity: 1 !important; transform: none !important; transition: none !important;
  }
  .hero__cursor, .terminal__cursor-blink { animation: none; }
  .hero__scroll-line { animation: none; opacity: 0.4; }
  .cube { animation: none; }
  .pixel-tag { animation: none; }
  .pixel-grid__line { animation: none; }
  .hero__visual { opacity: 1; transform: none; }
}

/* ── Responsive ── */
@media (max-width: 960px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }

  .hero__visual {
    display: none;
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
