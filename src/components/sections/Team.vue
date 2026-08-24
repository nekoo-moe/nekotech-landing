<script setup lang="ts">
/**
 * Team — the four people who write the code.
 *
 * Roles come from `t.team.roles`; names, handles and links do not get
 * translated. The osu! signature card is an external image that can be slow
 * or missing, so it is lazy-loaded and its absence just removes the row —
 * nothing reserves empty space for it. `handle` and `website` are optional:
 * a member without either simply drops those rows.
 */
import { computed } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { useSpotlight } from '@/composables/useSpotlight';
import SectionHead from '@/components/shared/SectionHead.vue';

const { t } = useLanguage();
const { onPointerMove, onPointerLeave } = useSpotlight();

interface Member {
  name: string;
  roleKey: 'lead' | 'frontend' | 'backend' | 'deploy';
  handle?: string;
  website?: string;
  avatar: string;
  osu: { card: string; profile: string } | null;
}

const members: Member[] = [
  {
    name: 'Alyosha',
    roleKey: 'lead',
    handle: '@ssdarealest',
    website: 'https://akk1to.tech',
    avatar: 'https://cdn.imgchest.com/files/37d75fe91a04.jpg',
    osu: {
      card: 'https://osu-sig.s23.moe/card?user=ThomasSherby&mode=std&lang=en&animation=true',
      profile: 'https://osu.ppy.sh/u/ThomasSherby',
    },
  },
  {
    name: 'Heiznerd',
    roleKey: 'frontend',
    handle: '@captainnhwuy',
    website: 'https://heiznerd.is-a.dev/',
    avatar: 'https://cdn.imgchest.com/files/3bbfb29ac0b3.jpg',
    osu: {
      card: 'https://osu-sig.s23.moe/card?user=heiznerd&mode=std&lang=en&animation=true',
      profile: 'https://osu.ppy.sh/u/heiznerd',
    },
  },
  {
    name: 'maiminhdung',
    roleKey: 'backend',
    handle: '@maiminhdung',
    website: 'https://maiminhdung.dev/',
    avatar: 'https://cdn.imgchest.com/files/ff3602e5b701.gif',
    osu: null,
  },
  {
    name: 'khoasoma',
    roleKey: 'deploy',
    avatar: '/assets/khoasoma.jpg',
    osu: {
      card: 'https://osu-sig.s23.moe/card?user=khoasoma&mode=std&lang=en&animation=true',
      profile: 'https://osu.ppy.sh/u/khoasoma',
    },
  },
];

const people = computed(() =>
  members.map(m => ({ ...m, role: t.value.team.roles[m.roleKey] }))
);
</script>

<template>
  <section id="team" class="tm section section--ruled" aria-labelledby="tm-heading">
    <div class="container">
      <SectionHead
        :label="t.team.label"
        :heading="t.team.heading"
        :lede="t.team.lede"
        heading-id="tm-heading"
        index="06"
      />

      <ul class="tm__grid" role="list">
        <li
          v-for="(p, i) in people"
          :key="p.name"
          class="tm__card"
          data-reveal
          :style="{ '--i': i }"
          @pointermove="onPointerMove"
          @pointerleave="onPointerLeave"
        >
          <span class="tm__glow" aria-hidden="true"></span>

          <div class="tm__head">
            <img
              class="tm__avatar"
              :src="p.avatar"
              :alt="p.name"
              width="56"
              height="56"
              loading="lazy"
              decoding="async"
            />
            <div class="tm__ident">
              <h3 class="tm__name">{{ p.name }}</h3>
              <p class="tm__role">{{ p.role }}</p>
            </div>
          </div>

          <p v-if="p.handle" class="tm__handle num">{{ p.handle }}</p>

          <a
            v-if="p.osu"
            class="tm__osu"
            :href="p.osu.profile"
            target="_blank"
            rel="noreferrer noopener"
            :aria-label="`${p.name} — ${t.team.osuProfile}`"
          >
            <img
              :src="p.osu.card"
              :alt="`${p.name} — ${t.team.osuProfile}`"
              loading="lazy"
              decoding="async"
            />
          </a>

          <a
            v-if="p.website"
            class="tm__site link-u"
            :href="p.website"
            target="_blank"
            rel="noreferrer noopener"
          >
            {{ t.team.website }}
            <span aria-hidden="true">↗</span>
            <span class="sr-only">({{ t.a11y.externalLink }})</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.tm__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-5);
}

.tm__card {
  --mx: 50%;
  --my: 50%;
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition:
    border-color var(--duration-base) ease,
    background var(--duration-base) ease,
    transform var(--duration-base) var(--ease-out-quart);
}

.tm__card:hover {
  border-color: var(--border-strong);
  background: var(--surface-2);
  transform: translateY(-3px);
}

.tm__glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    16rem circle at var(--mx) var(--my),
    oklch(0.40 0 0 / 0.4),
    transparent 68%
  );
  transition: opacity var(--duration-base) ease;
}

.tm__card:hover .tm__glow { opacity: 1; }

.tm__head {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.tm__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
  flex-shrink: 0;
  background: var(--surface-2);
  transition: border-color var(--duration-base) ease, transform var(--duration-base) var(--ease-out-quart);
}

.tm__card:hover .tm__avatar {
  border-color: var(--accent-line);
  transform: scale(1.05);
}

.tm__ident { min-width: 0; }

.tm__name {
  font-size: var(--text-lg);
  letter-spacing: -0.025em;
}

.tm__role {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--muted);
  margin-top: var(--space-1);
}

.tm__handle {
  font-size: var(--text-xs);
  color: var(--ink-faint);
  letter-spacing: 0.02em;
}

/* osu! signature card — a real image of unknown height, so give it a ratio
   box rather than letting it shift the card when it lands. */
.tm__osu {
  display: block;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--hairline);
  transition: border-color var(--duration-fast) ease;
}

.tm__osu:hover { border-color: var(--accent-line); }

.tm__osu img { width: 100%; height: auto; display: block; }

.tm__site {
  margin-top: auto;
  padding-top: var(--space-2);
  font-size: var(--text-sm);
  align-self: flex-start;
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .tm__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-6); }
}

@media (max-width: 600px) {
  .tm__grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .tm__glow { display: none; }
  .tm__card:hover { transform: none; }
  .tm__card:hover .tm__avatar { transform: none; }
}
</style>
