<script setup lang="ts">
/**
 * Side projects — the things written for ourselves that other people ended up
 * using. Deliberately a separate page rather than a home section: they are not
 * part of the org's product argument, and padding the home page with them
 * would weaken it.
 *
 * The old version of this page ran an Aurora shader with purple/pink/red
 * stops, which contradicted the palette everywhere else. It uses the same
 * plates as the rest of the site now — no second visual language for one page.
 */
import { computed } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import AppHeader from '@/components/shared/Header.vue';
import { ORG, SITE_REPO } from '@/configs/app.config';

const { t } = useLanguage();

const INVITE_BASE = 'https://discord.com/oauth2/authorize';

const projects = [
  {
    id: 'nekobuckets' as const,
    name: 'NekoBuckets',
    invite: `${INVITE_BASE}?client_id=1372420632628822057&permissions=8&integration_type=0&scope=bot`,
    source: null,
  },
  {
    id: 'nekomusics' as const,
    name: 'NekoMusics',
    invite: `${INVITE_BASE}?client_id=1427516379912994816&permissions=8&integration_type=0&scope=bot`,
    source: 'https://github.com/nekoo-moe',
  },
];

const items = computed(() =>
  projects.map(p => ({ ...p, ...t.value.sideProjects.items[p.id] }))
);

const year = new Date().getFullYear();
</script>

<template>
  <AppHeader />

  <main id="main" class="sp">
    <div class="container">
      <router-link to="/" class="sp__back link-u">
        <span aria-hidden="true">←</span>
        {{ t.sideProjects.back }}
      </router-link>

      <header class="sp__head">
        <p class="label label--accent" data-reveal>{{ t.sideProjects.label }}</p>
        <h1 class="sp__heading" data-reveal="mask">
          <span class="line"><span>{{ t.sideProjects.heading }}</span></span>
        </h1>
        <p class="sp__lede" data-reveal style="--i: 1">{{ t.sideProjects.lede }}</p>
      </header>

      <ul class="sp__grid" role="list">
        <li
          v-for="(p, i) in items"
          :key="p.id"
          class="sp__card"
          data-reveal
          :style="{ '--i': i }"
        >
          <span class="sp__tag">{{ p.tag }}</span>
          <h2 class="sp__name">{{ p.name }}</h2>
          <p class="sp__summary">{{ p.summary }}</p>

          <div class="sp__actions">
            <a
              class="btn btn--solid"
              :href="p.invite"
              target="_blank"
              rel="noreferrer noopener"
            >
              {{ t.sideProjects.actions.invite }}
              <span aria-hidden="true">↗</span>
              <span class="sr-only">({{ t.a11y.externalLink }})</span>
            </a>
            <a
              v-if="p.source"
              class="btn btn--outline"
              :href="p.source"
              target="_blank"
              rel="noreferrer noopener"
            >
              {{ t.sideProjects.actions.viewSource }}
              <span class="sr-only">({{ t.a11y.externalLink }})</span>
            </a>
          </div>
        </li>
      </ul>
    </div>

    <footer class="sp__foot container" role="contentinfo">
      <p class="num">© {{ year }} {{ t.footer.rights }}</p>
      <p>
        {{ t.footer.builtWith }} ·
        <a :href="SITE_REPO" target="_blank" rel="noreferrer noopener" class="link-u">
          {{ t.footer.sourceLink }}
        </a>
        ·
        <a :href="ORG.github" target="_blank" rel="noreferrer noopener" class="link-u">
          {{ ORG.handle }}
        </a>
      </p>
    </footer>
  </main>
</template>

<style scoped>
.sp {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  padding-top: calc(var(--header-h) + clamp(2.5rem, 6vw, 5rem));
}

.sp__back {
  display: inline-flex;
  font-size: var(--text-sm);
  color: var(--muted);
  margin-bottom: var(--space-10);
}

.sp__head {
  padding-bottom: clamp(2.5rem, 5vw, 4rem);
  border-bottom: 1px solid var(--border);
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.sp__heading {
  font-size: var(--text-3xl);
  margin: var(--space-5) 0 var(--space-5);
  max-width: 24ch;
}

.sp__lede {
  font-size: var(--text-lg);
  font-weight: 300;
  color: var(--ink-dim);
  max-width: 52ch;
}

/* ── Cards ─────────────────────────────────────────────────────────────── */
.sp__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);
  padding-bottom: clamp(4rem, 9vw, 7rem);
}

.sp__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-8);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: border-color var(--duration-base) ease, background var(--duration-base) ease;
}

.sp__card:hover { border-color: var(--border-strong); background: var(--surface-2); }

.sp__tag {
  align-self: flex-start;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--muted);
  padding: 0.28em 0.7em;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.sp__name {
  font-size: var(--text-2xl);
  letter-spacing: -0.03em;
}

.sp__summary {
  font-size: var(--text-base);
  font-weight: 300;
  color: var(--ink-dim);
  flex: 1;
}

.sp__actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  padding-top: var(--space-2);
}

/* ── Footer ────────────────────────────────────────────────────────────── */
.sp__foot {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  padding-top: var(--space-6);
  padding-bottom: var(--space-10);
  border-top: 1px solid var(--border);
  font-size: var(--text-xs);
  color: var(--ink-faint);
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 800px) {
  .sp__grid { grid-template-columns: 1fr; }
  .sp__card { padding: var(--space-6); }
}

@media (max-width: 480px) {
  .sp__actions .btn { width: 100%; }
}
</style>
