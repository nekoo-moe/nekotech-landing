<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import chuyenTin from '@/assets/chuyentinorz.png';
import northStudio from '@/assets/northstudio-2023.svg';

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

const partners = [
  {
    id: 'chuyentin',
    name: 'Chuyên Tín Orz',
    logoUrl: chuyenTin,
    description: 'Vietnam\'s premier community platform for sharing, reviewing, and discovering the best tech resources.',
    url: '#',
    tag: 'Community',
  },
  {
    id: 'northstudio',
    name: 'North Studio',
    logoUrl: northStudio,
    description: 'Design-forward creative studio. Longtime collaborators on the NekoTech visual identity.',
    url: '#',
    tag: 'Design',
  },
];

onMounted(async () => {
  await nextTick();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { isVisible.value = true; return; }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (sectionRef.value) observer.observe(sectionRef.value);
});
</script>

<template>
  <section id="partners" class="partners section" ref="sectionRef">
    <div class="container">
      <header class="partners__header" :class="{ 'is-visible': isVisible }">
        <p class="partners__eyebrow">Trusted by builders</p>
        <h2 class="partners__heading">With the greatest<br>partners you'll ever see.</h2>
        <p class="partners__sub">
          The people and organizations who bet on us early — and keep betting.
        </p>
      </header>

      <div class="partners__grid">
        <a
          v-for="(partner, i) in partners"
          :key="partner.id"
          :href="partner.url"
          target="_blank"
          rel="noopener noreferrer"
          class="partners__card"
          :class="{ 'is-visible': isVisible }"
          :style="{ transitionDelay: `${i * 120 + 200}ms` }"
        >
          <div class="partners__card-logo">
            <img :src="partner.logoUrl" :alt="`${partner.name} logo`" class="partners__logo-img" loading="lazy" />
          </div>
          <div class="partners__card-body">
            <div class="partners__card-top">
              <h3 class="partners__card-name">{{ partner.name }}</h3>
              <span class="partners__card-tag">{{ partner.tag }}</span>
            </div>
            <p class="partners__card-desc">{{ partner.description }}</p>
          </div>
          <div class="partners__card-arrow" aria-hidden="true">↗</div>
        </a>
      </div>

      <!-- "Become a partner" CTA -->
      <div class="partners__cta" :class="{ 'is-visible': isVisible }">
        <span class="partners__cta-line" aria-hidden="true"></span>
        <a href="mailto:works.nekotech@proton.me" class="partners__cta-link">
          Interested in partnering? Let's talk →
        </a>
        <span class="partners__cta-line" aria-hidden="true"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Header ── */
.partners__header {
  margin-bottom: var(--space-12);
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms var(--ease-out-quart),
              transform 600ms var(--ease-out-quart);
}

.partners__header.is-visible {
  opacity: 1;
  transform: none;
}

.partners__eyebrow {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-4);
  max-width: none;
}

.partners__heading {
  font-size: var(--text-3xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink);
  line-height: 1.05;
  margin-bottom: var(--space-4);
}

.partners__sub {
  font-size: var(--text-base);
  color: var(--muted);
  font-weight: 300;
}

/* ── Grid ── */
.partners__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-12);
}

/* ── Card ── */
.partners__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 500ms var(--ease-out-quart),
              transform 500ms var(--ease-out-quart),
              border-color var(--duration-base) ease;
}

.partners__card.is-visible {
  opacity: 1;
  transform: none;
}

.partners__card:hover {
  border-color: var(--muted);
}

/* ── Logo area ── */
.partners__card-logo {
  height: 48px;
  display: flex;
  align-items: center;
}

.partners__logo-img {
  max-height: 40px;
  max-width: 140px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.7;
  transition: opacity var(--duration-fast) ease;
}

.partners__card:hover .partners__logo-img {
  opacity: 1;
}

/* ── Body ── */
.partners__card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.partners__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.partners__card-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.partners__card-tag {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.partners__card-desc {
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.65;
}

/* ── Arrow ── */
.partners__card-arrow {
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
  font-size: var(--text-base);
  color: var(--border);
  transition: color var(--duration-fast) ease,
              transform var(--duration-fast) var(--ease-out-quart);
}

.partners__card:hover .partners__card-arrow {
  color: var(--accent);
  transform: translate(3px, -3px);
}

/* ── CTA ── */
.partners__cta {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  opacity: 0;
  transition: opacity 600ms var(--ease-out-quart) 400ms;
}

.partners__cta.is-visible {
  opacity: 1;
}

.partners__cta-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.partners__cta-link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--muted);
  white-space: nowrap;
  transition: color var(--duration-fast) ease;
}

.partners__cta-link:hover {
  color: var(--accent);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .partners__cta {
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
  }

  .partners__cta-line {
    display: none;
  }
}
</style>
