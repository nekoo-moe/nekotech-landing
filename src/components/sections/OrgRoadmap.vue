<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const phaseRefs = ref<HTMLElement[]>([]);
const lineRef = ref<HTMLElement | null>(null);

const phases = [
  {
    label: 'Q2 2026',
    title: 'NekoComics Reborn',
    description: 'Full rewrite of NekoComics with better performance, chapter navigation, and bookmark sync.',
    status: 'current' as const,
  },
  {
    label: 'Q3 2026',
    title: 'NekoAI Beta',
    description: 'Public beta of our 2D AI Agent. Open for community testing and feedback.',
    status: 'upcoming' as const,
  },
  {
    label: 'Q4 2026',
    title: 'NekoStream Launch',
    description: 'NekoStream goes live — ad-free, community-first Vietnamese streaming platform.',
    status: 'upcoming' as const,
  },
  {
    label: '2027',
    title: 'Platform Expansion',
    description: 'Unified NekoTech platform: SSO across all products, public API for third-party integration.',
    status: 'future' as const,
  },
];

onMounted(async () => {
  await nextTick();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    phaseRefs.value.forEach(el => el?.classList.add('is-visible'));
    if (lineRef.value) lineRef.value.style.setProperty('--progress', '1');
    return;
  }

  // Animate the connector line fill on scroll
  const sectionEl = phaseRefs.value[0]?.closest('section');
  const lineObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateLine();
        lineObs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (sectionEl) lineObs.observe(sectionEl);

  // Stagger phase cards
  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  phaseRefs.value.forEach((el, i) => {
    if (!el) return;
    el.style.transitionDelay = `${i * 120}ms`;
    cardObs.observe(el);
  });
});

const animateLine = () => {
  const el = lineRef.value;
  if (!el) return;
  let start: number | null = null;
  const duration = 900;
  const step = (ts: number) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    el.style.setProperty('--progress', String(progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
</script>

<template>
  <section id="roadmap" class="roadmap section">
    <div class="container">
      <header class="roadmap__header reveal-heading">
        <h2 class="roadmap__heading">Roadmap</h2>
        <p class="roadmap__sub">Where we're going, in order.</p>
      </header>

      <div class="roadmap__track" role="list">
        <!-- Animated progress line (desktop only) -->
        <div class="roadmap__line-track" aria-hidden="true">
          <div class="roadmap__line-fill" ref="lineRef"></div>
        </div>

        <div
          v-for="(phase, i) in phases"
          :key="phase.label"
          class="roadmap__phase"
          :class="`roadmap__phase--${phase.status}`"
          role="listitem"
          :ref="el => { if (el) phaseRefs[i] = el as HTMLElement }"
        >
          <div class="roadmap__phase-marker" aria-hidden="true">
            <span class="roadmap__phase-dot"></span>
          </div>
          <div class="roadmap__phase-body">
            <time class="roadmap__phase-label">{{ phase.label }}</time>
            <h3 class="roadmap__phase-title">{{ phase.title }}</h3>
            <p class="roadmap__phase-desc">{{ phase.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.roadmap__header {
  margin-bottom: var(--space-12);
}

.roadmap__heading {
  font-size: var(--text-3xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin-bottom: var(--space-3);
}

.roadmap__sub {
  font-size: var(--text-base);
  color: var(--muted);
}

/* ── Horizontal track ── */
.roadmap__track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

/* ── Progress line ── */
.roadmap__line-track {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  height: 1px;
  background: var(--border);
  z-index: 0;
}

.roadmap__line-fill {
  height: 100%;
  background: var(--accent);
  transform-origin: left;
  transform: scaleX(var(--progress, 0));
  transition: transform 0.1s linear;
  width: calc(1 / 4 * 100%); /* stops at current phase */
}

/* ── Phase card ── */
.roadmap__phase {
  position: relative;
  z-index: 1;
  padding: 0 var(--space-4);
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 500ms var(--ease-out-quart),
              transform 500ms var(--ease-out-quart);
}

.roadmap__phase:first-child { padding-left: 0; }
.roadmap__phase:last-child  { padding-right: 0; }

.roadmap__phase.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Dot ── */
.roadmap__phase-marker {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-4);
}

.roadmap__phase-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
  transition: border-color 300ms ease,
              box-shadow 300ms ease,
              transform 300ms var(--ease-out-quart);
}

/* Current phase — pulsing accent dot */
.roadmap__phase--current .roadmap__phase-dot {
  border-color: var(--accent);
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-dim);
  animation: dot-pulse 2s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { box-shadow: 0 0 0 4px var(--accent-dim); }
  50%       { box-shadow: 0 0 0 8px oklch(0.65 0.22 24 / 0.05); }
}

/* Upcoming */
.roadmap__phase--upcoming .roadmap__phase-dot {
  border-color: var(--muted);
}

/* Future */
.roadmap__phase--future .roadmap__phase-dot {
  border-color: oklch(0.25 0 0);
}

/* ── Phase content ── */
.roadmap__phase-label {
  display: block;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  margin-bottom: var(--space-2);
}

.roadmap__phase--current .roadmap__phase-label {
  color: var(--accent);
}

.roadmap__phase-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin-bottom: var(--space-2);
  line-height: 1.2;
}

.roadmap__phase--upcoming .roadmap__phase-title,
.roadmap__phase--future .roadmap__phase-title {
  color: var(--ink-dim);
}

.roadmap__phase-desc {
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.6;
  max-width: 240px;
}

/* ── Mobile: vertical ── */
@media (max-width: 900px) {
  .roadmap__track {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .roadmap__line-track {
    display: none;
  }

  .roadmap__phase {
    padding: 0 0 var(--space-8) var(--space-8);
    border-left: 1px solid var(--border);
    margin-left: 10px;
  }

  .roadmap__phase:last-child {
    border-left-color: transparent;
  }

  .roadmap__phase-marker {
    position: absolute;
    left: calc(-1px - 10px);
    top: 0;
  }

  .roadmap__phase-dot {
    position: relative;
    left: -9px;
  }

  .roadmap__phase-desc { max-width: 100%; }

  .roadmap__phase:first-child { padding-left: var(--space-8); }
}
</style>
