<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const cardRefs = ref<HTMLElement[]>([]);

const members = [
  {
    name: 'Alyosha',
    role: 'Team Lead · Backend',
    handle: '@ssdarealest',
    website: 'https://akk1to.tech',
    avatarUrl: 'https://cdn.imgchest.com/files/37d75fe91a04.jpg',
    osuCard: 'https://osu-sig.s23.moe/card?user=ThomasSherby&mode=std&lang=en&animation=true',
    osuProfile: 'https://osu.ppy.sh/u/ThomasSherby',
    hasOsu: true,
  },
  {
    name: 'Heiznerd',
    role: 'Frontend Developer',
    handle: '@captainnhwuy',
    website: 'https://heiznerd.is-a.dev/',
    avatarUrl: 'https://cdn.imgchest.com/files/3bbfb29ac0b3.jpg',
    osuCard: 'https://osu-sig.s23.moe/card?user=heiznerd&mode=std&lang=en&animation=true',
    osuProfile: 'https://osu.ppy.sh/u/heiznerd',
    hasOsu: true,
  },
  {
    name: 'maiminhdung',
    role: 'Backend · Mobile',
    handle: '@maiminhdung',
    website: 'https://maiminhdung.dev/',
    avatarUrl: 'https://cdn.imgchest.com/files/ff3602e5b701.gif',
    osuCard: null,
    osuProfile: null,
    hasOsu: false,
  },
];

onMounted(async () => {
  await nextTick();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    cardRefs.value.forEach(el => el?.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cardRefs.value.forEach((el, i) => {
    if (!el) return;
    el.style.transitionDelay = `${i * 100}ms`;
    observer.observe(el);
  });
});
</script>

<template>
  <section id="team" class="team section">
    <div class="container">
      <header class="team__header reveal-heading">
        <h2 class="team__heading">The people building this.</h2>
        <p class="team__sub">Core team — shipping since 2025.</p>
      </header>

      <div class="team__grid">
        <article
          v-for="(member, i) in members"
          :key="member.handle"
          class="team__card"
          :ref="el => { if (el) cardRefs[i] = el as HTMLElement }"
        >
          <!-- Card header -->
          <div class="team__card-header">
            <img
              :src="member.avatarUrl"
              :alt="`${member.name} avatar`"
              class="team__avatar"
              loading="lazy"
            />
            <div class="team__card-meta">
              <h3 class="team__name">{{ member.name }}</h3>
              <p class="team__role">{{ member.role }}</p>
            </div>
          </div>

          <!-- osu! signature card -->
          <div v-if="member.hasOsu" class="team__osu">
            <a
              :href="member.osuProfile!"
              target="_blank"
              rel="noopener noreferrer"
              class="team__osu-link"
              :aria-label="`${member.name}'s osu! profile`"
            >
              <img
                :src="member.osuCard!"
                :alt="`${member.name} osu! signature card`"
                class="team__osu-card"
                loading="lazy"
              />
            </a>
          </div>

          <!-- Footer -->
          <div class="team__card-footer">
            <span class="team__handle">{{ member.handle }}</span>
            <a
              :href="member.website"
              target="_blank"
              rel="noopener noreferrer"
              class="team__link"
              :aria-label="`Visit ${member.name}'s website`"
            >
              ↗
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team__header {
  margin-bottom: var(--space-12);
}

.team__heading {
  font-size: var(--text-3xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin-bottom: var(--space-3);
}

.team__sub {
  font-size: var(--text-base);
  color: var(--muted);
}

/* ── Grid ── */
.team__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

/* ── Card entrance ── */
.team__card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 500ms var(--ease-out-quart),
              transform 500ms var(--ease-out-quart),
              border-color var(--duration-base) ease;
}

.team__card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.team__card:hover {
  border-color: var(--muted);
}

/* ── Header ── */
.team__card-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.team__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.team__card-meta { min-width: 0; }

.team__name {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team__role {
  font-size: var(--text-xs);
  color: var(--muted);
  margin-top: 2px;
}

/* ── osu! card ── */
.team__osu {
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.team__osu-link {
  display: block;
}

.team__osu-card {
  width: 100%;
  height: auto;
  display: block;
  transition: transform var(--duration-base) var(--ease-out-quart);
}

.team__osu-link:hover .team__osu-card {
  transform: scale(1.02);
}

/* ── Footer ── */
.team__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
}

.team__handle {
  font-size: var(--text-xs);
  color: var(--muted);
}

.team__link {
  font-size: var(--text-sm);
  color: var(--muted);
  transition: color var(--duration-fast) ease;
}

.team__link:hover {
  color: var(--accent);
}
</style>
