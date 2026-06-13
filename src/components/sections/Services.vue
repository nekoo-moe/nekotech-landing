<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';

const { t } = useLanguage();
const rowRefs = ref<HTMLElement[]>([]);

const services = computed(() => [
  { title: t.value.services.items.web.title,       description: t.value.services.items.web.description,       tag: 'Frontend'   },
  { title: t.value.services.items.mobile.title,    description: t.value.services.items.mobile.description,    tag: 'Mobile'     },
  { title: t.value.services.items.fullstack.title, description: t.value.services.items.fullstack.description, tag: 'Full-stack' },
  { title: t.value.services.items.minecraft.title, description: t.value.services.items.minecraft.description, tag: 'Gaming'     },
]);

onMounted(async () => {
  await nextTick();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    rowRefs.value.forEach(el => { if (el) el.classList.add('is-visible'); });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  rowRefs.value.forEach((el, i) => {
    if (!el) return;
    (el as HTMLElement).style.transitionDelay = `${i * 90}ms`;
    observer.observe(el);
  });
});
</script>

<template>
  <section id="services" class="services section">
    <div class="container">
      <header class="services__header reveal-heading">
        <h2 class="services__heading">{{ t.services.title }}</h2>
        <p class="services__sub">{{ t.services.subtitle }}</p>
      </header>

      <ol class="services__list" role="list">
        <li
          v-for="(service, i) in services"
          :key="service.title"
          class="services__row"
          :ref="el => { if (el) rowRefs[i] = el as HTMLElement }"
          role="listitem"
        >
          <div class="services__row-inner">
            <h3 class="services__title">{{ service.title }}</h3>
            <span class="services__tag">{{ service.tag }}</span>
            <p class="services__desc">{{ service.description }}</p>
          </div>
          <div class="services__underline" aria-hidden="true"></div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.services__header {
  margin-bottom: var(--space-12);
}

.services__heading {
  font-size: var(--text-3xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin-bottom: var(--space-3);
}

.services__sub {
  font-size: var(--text-base);
  color: var(--muted);
}

/* ── Service list ── */
.services__list {
  list-style: none;
  border-top: 1px solid var(--border);
}

.services__row {
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 550ms var(--ease-out-quart),
              transform 550ms var(--ease-out-quart);
}

.services__row.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.services__row-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  align-items: center;
  column-gap: var(--space-8);
  padding: var(--space-8) 0;
  border-bottom: 1px solid var(--border);
}

.services__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
  grid-column: 1;
  grid-row: 1;
  transition: color var(--duration-base) var(--ease-out-quart);
}

.services__tag {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  grid-column: 2;
  grid-row: 1;
  align-self: center;
  flex-shrink: 0;
  transition: color var(--duration-base) ease;
}

.services__desc {
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.65;
  grid-column: 1 / -1;
  grid-row: 2;
  max-width: 680px;
  margin-top: var(--space-3);
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height var(--duration-slow) var(--ease-out-quart),
              opacity var(--duration-base) ease,
              margin-top var(--duration-base) ease;
}

/* ── Accent underline — clip-path reveal on hover ── */
.services__underline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--accent);
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--duration-slow) var(--ease-out-quart);
}

.services__row:hover .services__underline {
  clip-path: inset(0 0% 0 0);
}

.services__row:hover .services__title {
  color: var(--accent);
}

.services__row:hover .services__tag {
  color: var(--ink-dim);
}

.services__row:hover .services__desc {
  max-height: 6rem;
  opacity: 1;
  margin-top: var(--space-3);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .services__row-inner {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .services__tag {
    grid-column: 1;
    grid-row: 2;
    margin-top: var(--space-2);
  }

  .services__desc {
    grid-row: 3;
  }
}
</style>
