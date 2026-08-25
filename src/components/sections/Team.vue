<script setup lang="ts">
/**
 * Team — the four people who write the code.
 *
 * Deliberately not a grid of four identical cards. Four equal boxes say the
 * four people are interchangeable, and a repeated template is the thing this
 * page is trying hardest to avoid: it reads as a directory export rather than
 * a masthead. So the section is a *masthead* instead — one person held in a
 * tall feature plate with a real portrait, and the whole roster beside it as a
 * stack of hairline editorial rows, each indented by its own position.
 *
 * The plate is a viewer, not a pedestal: every row is a button that promotes
 * its member into it, so all four people can be read at portrait size. The
 * roster never reorders on selection — only the marker moves — because a list
 * that reshuffles under the cursor is a list fighting the reader.
 *
 * Roles come from `t.team.roles`; names, handles and links are not translated.
 * The osu! signature card is an external image that can be slow or missing, so
 * it is lazy-loaded and its absence just removes the row. `handle` and
 * `website` are optional: a member without either simply drops those lines.
 */
import { ref, computed } from 'vue';
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
  members.map((m, i) => ({
    ...m,
    role: t.value.team.roles[m.roleKey],
    index: String(i + 1).padStart(2, '0'),
  }))
);

/** Which member the feature plate is showing. */
const active = ref(0);
const featured = computed(() => people.value[active.value]);

/** Move `delta` people through the roster, wrapping. */
function step(delta: 1 | -1) {
  const n = people.value.length;
  active.value = (active.value + delta + n) % n;
}

/* Left/right anywhere in the roster walks it, so the plate is reachable
   without tabbing through four buttons and their links. */
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    event.preventDefault();
    step(1);
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    event.preventDefault();
    step(-1);
  }
};

const pickLabel = (name: string) => t.value.team.showMember.replace('{name}', name);
</script>

<template>
  <section id="team" class="tm section section--ruled" aria-labelledby="tm-heading">
    <div class="container">
      <SectionHead
        :label="t.team.label"
        :heading="t.team.heading"
        :lede="t.team.lede"
        heading-id="tm-heading"
        index="08"
      />

      <div class="tm__masthead">
        <!-- ── Feature plate: whichever member is selected ────────────────── -->
        <article
          class="tm__feature"
          data-reveal
          @pointermove="onPointerMove"
          @pointerleave="onPointerLeave"
        >
          <span class="tm__glow" aria-hidden="true"></span>

          <div class="tm__portrait">
            <!-- Both portraits are in flow at once during the swap, hence the
                 absolute stack: a fade with `mode="out-in"` would collapse the
                 box between them. -->
            <Transition name="tm-swap">
              <img
                :key="featured.name"
                :src="featured.avatar"
                :alt="featured.name"
                width="480"
                height="600"
                loading="lazy"
                decoding="async"
              />
            </Transition>

            <!-- Gradient, not an opacity dip: the name has to stay legible over
                 whatever the portrait happens to be. -->
            <span class="tm__portrait-veil" aria-hidden="true"></span>

            <!-- Only the identity block is live: putting the region on the
                 whole plate would re-announce the portrait's alt text and both
                 link labels on every swap. -->
            <div class="tm__portrait-copy" aria-live="polite">
              <span class="tm__feature-idx num" aria-hidden="true">{{ featured.index }}</span>
              <h3 class="tm__feature-name">{{ featured.name }}</h3>
              <p class="tm__feature-role">{{ featured.role }}</p>
            </div>
          </div>

          <div class="tm__feature-foot">
            <p v-if="featured.handle" class="tm__handle num">{{ featured.handle }}</p>

            <a
              v-if="featured.osu"
              class="tm__osu"
              :href="featured.osu.profile"
              target="_blank"
              rel="noreferrer noopener"
              :aria-label="`${featured.name} — ${t.team.osuProfile}`"
            >
              <img
                :key="featured.name"
                :src="featured.osu.card"
                :alt="`${featured.name} — ${t.team.osuProfile}`"
                loading="lazy"
                decoding="async"
              />
            </a>

            <div class="tm__feature-actions">
              <a
                v-if="featured.website"
                class="tm__site link-u"
                :href="featured.website"
                target="_blank"
                rel="noreferrer noopener"
              >
                {{ t.team.website }}
                <span aria-hidden="true">↗</span>
                <span class="sr-only">({{ t.a11y.externalLink }})</span>
              </a>

              <!-- Step through the roster without aiming at a row. -->
              <div class="tm__steps">
                <button
                  class="tm__step"
                  type="button"
                  :aria-label="pickLabel(people[(active - 1 + people.length) % people.length].name)"
                  @click="step(-1)"
                >←</button>
                <button
                  class="tm__step"
                  type="button"
                  :aria-label="pickLabel(people[(active + 1) % people.length].name)"
                  @click="step(1)"
                >→</button>
              </div>
            </div>
          </div>
        </article>

        <!-- ── Roster: hairline rows, each one a button for the plate ─────── -->
        <ul class="tm__rows" role="list" @keydown="onKeydown">
          <li
            v-for="(p, i) in people"
            :key="p.name"
            class="tm__row"
            :class="{ 'is-featured': i === active }"
            data-reveal
            :style="{ '--i': i + 1, '--step': i }"
            @pointermove="onPointerMove"
            @pointerleave="onPointerLeave"
          >
            <!-- The button holds only the identity block; the outbound links
                 stay outside it, so there is no nested-interactive problem and
                 no stretched-overlay hack. -->
            <button
              class="tm__pick"
              type="button"
              :aria-pressed="i === active"
              :aria-label="pickLabel(p.name)"
              @click="active = i"
            >
              <span class="tm__row-idx num" aria-hidden="true">{{ p.index }}</span>

              <img
                class="tm__row-avatar"
                :src="p.avatar"
                alt=""
                width="52"
                height="52"
                loading="lazy"
                decoding="async"
              />

              <span class="tm__row-ident">
                <span class="tm__row-name">{{ p.name }}</span>
                <span class="tm__role">{{ p.role }}</span>
                <span v-if="p.handle" class="tm__handle num">{{ p.handle }}</span>
              </span>

              <!-- Marks the selected row, and doubles as the affordance on the
                   others: the chevron is the "this is clickable" tell. -->
              <span class="tm__mark" aria-hidden="true">
                <span v-if="i === active" class="tm__mark-on">{{ t.team.featured }}</span>
                <span v-else class="tm__mark-off">→</span>
              </span>
            </button>

            <div class="tm__row-links">
              <a
                v-if="p.osu"
                class="tm__row-link"
                :href="p.osu.profile"
                target="_blank"
                rel="noreferrer noopener"
              >
                osu!
                <span aria-hidden="true">↗</span>
                <span class="sr-only">{{ p.name }} — {{ t.team.osuProfile }} ({{ t.a11y.externalLink }})</span>
              </a>
              <a
                v-if="p.website"
                class="tm__row-link"
                :href="p.website"
                target="_blank"
                rel="noreferrer noopener"
              >
                {{ t.team.website }}
                <span aria-hidden="true">↗</span>
                <span class="sr-only">{{ p.name }} ({{ t.a11y.externalLink }})</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Masthead ──────────────────────────────────────────────────────────── */
.tm__masthead {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
  gap: clamp(2rem, 4vw, 3.5rem);
  align-items: start;
}

/* ── Feature plate ─────────────────────────────────────────────────────── */
.tm__feature {
  --mx: 50%;
  --my: 50%;
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-5);
  background:
    linear-gradient(
      152deg,
      oklch(0.150 0 0) 0%,
      oklch(0.115 0 0) 46%,
      oklch(0.092 0 0) 100%
    );
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: border-color var(--duration-base) ease;
}

.tm__feature:hover { border-color: var(--border-strong); }

.tm__glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(
    20rem circle at var(--mx) var(--my),
    oklch(0.38 0 0 / 0.45),
    transparent 68%
  );
  transition: opacity var(--duration-base) ease;
}

.tm__feature:hover .tm__glow { opacity: 1; }

/* A real portrait, not a 56px circle — the whole point of a feature plate. */
.tm__portrait {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  aspect-ratio: 4 / 5;
  background: var(--surface-2);
}

.tm__portrait img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  /* Desaturated at rest so the plate stays monochrome with the rest of the
     page, and comes back to full colour when it is being looked at. */
  filter: grayscale(0.35) contrast(1.04);
  transform: scale(1.02);
  transition:
    filter var(--duration-slow) ease,
    transform var(--duration-slower) var(--ease-cinematic),
    opacity var(--duration-slow) var(--ease-cinematic);
}

.tm__feature:hover .tm__portrait img {
  filter: none;
  transform: scale(1.05);
}

/* Portrait swap: the incoming frame fades over the outgoing one. */
.tm-swap-enter-from { opacity: 0; }
.tm-swap-leave-to { opacity: 0; }

.tm__portrait-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    oklch(0.055 0 0 / 0.92) 0%,
    oklch(0.055 0 0 / 0.55) 34%,
    transparent 68%
  );
}

.tm__portrait-copy {
  position: absolute;
  left: clamp(1rem, 2.5vw, 1.75rem);
  right: clamp(1rem, 2.5vw, 1.75rem);
  bottom: clamp(1rem, 2.5vw, 1.5rem);
}

.tm__feature-idx {
  display: block;
  font-size: var(--text-2xs);
  letter-spacing: 0.16em;
  color: var(--accent);
  margin-bottom: var(--space-2);
}

.tm__feature-name {
  font-size: var(--text-2xl);
  letter-spacing: -0.035em;
  line-height: 1;
}

.tm__feature-role {
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--ink-dim);
  margin-top: var(--space-2);
}

.tm__feature-foot {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  /* Not every member has an osu! card, and the card's height is an external
     unknown. Reserving the slot keeps the plate from resizing as the reader
     walks the roster. */
  min-height: 9.5rem;
}

.tm__feature-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-top: auto;
}

.tm__steps { display: flex; gap: var(--space-2); margin-left: auto; }

.tm__step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  font-size: var(--text-sm);
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition:
    color var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    background var(--duration-fast) ease;
}

.tm__step:hover {
  color: var(--ink);
  border-color: var(--border-strong);
  background: var(--bg-raised);
}

/* ── Roster rows ───────────────────────────────────────────────────────── */
.tm__rows {
  display: flex;
  flex-direction: column;
}

/* Each row is indented one step further than the one above it, so the stack
   steps away from the feature instead of repeating at a fixed offset. */
.tm__row {
  --mx: 50%;
  --my: 50%;
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-5);
  padding: clamp(0.9rem, 1.8vw, 1.35rem) var(--space-4);
  padding-left: calc(var(--space-4) + var(--step, 0) * 1.25rem);
  border-top: 1px solid var(--border);
  transition: padding-left var(--duration-base) var(--ease-out-quart);
}

.tm__row:last-child { border-bottom: 1px solid var(--border); }

.tm__row:hover,
.tm__row:focus-within { padding-left: calc(var(--space-6) + var(--step, 0) * 1.25rem); }

/* The hover wash is a bar behind the row, not a card background — the rows are
   a stack of hairlines and boxing them would put the template back. */
.tm__row::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  background: linear-gradient(
    to right,
    oklch(0.170 0 0) 0%,
    oklch(0.115 0 0) 60%,
    transparent 100%
  );
  transition: opacity var(--duration-base) ease;
}

.tm__row:hover::before,
.tm__row:focus-within::before { opacity: 1; }

/* The selected row keeps the wash and gains an accent edge, so the link
   between the roster and the plate is never ambiguous. */
.tm__row.is-featured::before { opacity: 1; }

.tm__row.is-featured::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--accent);
}

/* ── The picker button ─────────────────────────────────────────────────── */
.tm__pick {
  display: grid;
  grid-template-columns: 2.25rem auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-5);
  width: 100%;
  padding: 0;
  text-align: left;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}

.tm__pick:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 6px;
  border-radius: var(--radius-sm);
}

.tm__row-idx {
  font-size: var(--text-2xs);
  letter-spacing: 0.16em;
  color: var(--ink-faint);
  transition: color var(--duration-base) ease;
}

.tm__row:hover .tm__row-idx,
.tm__row.is-featured .tm__row-idx { color: var(--accent); }

.tm__row-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
  background: var(--surface-2);
  flex-shrink: 0;
  filter: grayscale(0.35);
  transition:
    border-color var(--duration-base) ease,
    filter var(--duration-base) ease;
}

.tm__row:hover .tm__row-avatar,
.tm__row.is-featured .tm__row-avatar {
  border-color: var(--accent-line);
  filter: none;
}

.tm__row-ident { display: block; min-width: 0; }

.tm__row-name {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--ink);
}

.tm__role {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--muted);
  margin-top: var(--space-1);
}

.tm__handle {
  display: block;
  font-size: var(--text-xs);
  color: var(--ink-faint);
  letter-spacing: 0.02em;
}

.tm__row-ident .tm__handle { margin-top: var(--space-1); }

/* ── Selection marker ──────────────────────────────────────────────────── */
.tm__mark {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 5rem;
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13em;
}

.tm__mark-on { color: var(--accent); white-space: nowrap; }

/* Sits at low contrast until the row is pointed at — an affordance, not a
   decoration competing with the name. */
.tm__mark-off {
  font-size: var(--text-sm);
  color: var(--ink-faint);
  transform: translateX(-0.35rem);
  opacity: 0;
  transition:
    opacity var(--duration-base) ease,
    transform var(--duration-base) var(--ease-out-quart);
}

.tm__row:hover .tm__mark-off,
.tm__row:focus-within .tm__mark-off {
  opacity: 1;
  transform: none;
  color: var(--ink);
}

/* ── Outbound links ────────────────────────────────────────────────────── */
.tm__row-links {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  flex-shrink: 0;
}

.tm__row-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--muted);
  white-space: nowrap;
  transition: color var(--duration-fast) ease, gap var(--duration-base) var(--ease-out-quart);
}

.tm__row-link:hover { color: var(--accent); gap: var(--space-3); }

/* osu! signature card — an external image of unknown height, so it scales to
   width inside a bordered box rather than dictating the plate. */
.tm__osu {
  display: block;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--hairline);
  transition: border-color var(--duration-fast) ease;
}

.tm__osu:hover { border-color: var(--accent-line); }

.tm__osu img { width: 100%; height: auto; display: block; }

.tm__site { font-size: var(--text-sm); }

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 1000px) {
  /* The plate stops being a side-by-side and becomes the top of the stack. */
  .tm__masthead { grid-template-columns: 1fr; }
  .tm__feature { flex-direction: row; align-items: stretch; gap: var(--space-6); }
  .tm__portrait { flex: 0 0 clamp(11rem, 32vw, 16rem); aspect-ratio: 3 / 4; }
  .tm__feature-foot { flex: 1; justify-content: center; min-height: 0; }
}

@media (max-width: 680px) {
  .tm__feature { flex-direction: column; }
  .tm__portrait { flex: none; aspect-ratio: 4 / 5; }

  /* The indent step is a luxury the phone column cannot afford. */
  .tm__row,
  .tm__row:hover,
  .tm__row:focus-within {
    grid-template-columns: 1fr;
    gap: var(--space-3);
    padding-left: var(--space-2);
    padding-right: var(--space-2);
  }

  .tm__pick {
    grid-template-columns: 1.75rem auto minmax(0, 1fr);
    gap: var(--space-4);
  }

  /* Row 4 of the picker grid is gone on a phone, so the marker moves under the
     name rather than being clipped off the right edge. */
  .tm__mark {
    grid-column: 2 / -1;
    justify-content: flex-start;
    min-width: 0;
  }

  .tm__mark-off { display: none; }
  .tm__row-links { padding-left: calc(1.75rem + var(--space-4)); gap: var(--space-4); }
  .tm__row-name { font-size: var(--text-base); }
}

@media (prefers-reduced-motion: reduce) {
  .tm__glow { display: none; }
  .tm__feature:hover .tm__portrait img { transform: scale(1.02); }
  .tm__portrait img { transition: opacity var(--duration-base) linear; }
  .tm__row,
  .tm__row:hover,
  .tm__row:focus-within { padding-left: calc(var(--space-4) + var(--step, 0) * 1.25rem); }
  .tm__mark-off { transform: none; }
}
</style>
