<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

const partners = [
  {
    id: 'langbangvn',
    name: 'LangBangVN — CoffoxMC',
    description: 'Máy chủ Minecraft uy tín, hoạt động 5 năm với các cụm chơi hay ho, mượt mà. NekoTech Studio đồng hành cùng LangBangVN từ tháng 1/2026.',
    tag: 'Minecraft Server',
    url: 'https://langbangvn.net',
    discordUrl: 'https://discord.langbangvn.net',
    badge: '5 năm hoạt động',
    iconSrc: new URL('@/assets/langbangvnicon.png', import.meta.url).href,
    textSrc: new URL('@/assets/textlangbangvn.png', import.meta.url).href,
  },
  {
    id: 'nekostudio',
    name: 'NekoStudio',
    description: 'Dịch vụ Setup Discord Bot, Tạo Discord Bot theo yêu cầu, Khởi tạo Discord Bot theo Template, Cấu hình máy chủ Discord dễ dàng, chuyên nghiệp — đội ngũ NekoTech gồm Alyosha, Heiznerd.',
    tag: '#2 Discord Service',
    url: 'https://dsc.gg/nekostudio',
    discordUrl: 'https://dsc.gg/nekostudio',
    badge: 'Discord · Custom Bot',
    iconSrc: null,
    textSrc: null,
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
  }, { threshold: 0.15 });

  if (sectionRef.value) observer.observe(sectionRef.value);
});
</script>

<template>
  <section id="partners" class="partners section" ref="sectionRef">
    <div class="container">
      <header class="partners__header reveal-heading" :class="{ 'is-visible': isVisible }">
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
          :style="{ transitionDelay: `${i * 130 + 180}ms` }"
        >
          <!-- Logo area -->
          <div class="partners__card-logo">
            <!-- LangBangVN: icon + text logo -->
            <template v-if="partner.id === 'langbangvn'">
              <div class="partners__langbang">
                <img
                  :src="partner.iconSrc!"
                  alt="LangBangVN icon"
                  class="partners__langbang-icon"
                  loading="lazy"
                  @error="(e) => (e.target as HTMLElement).style.display = 'none'"
                />
                <img
                  :src="partner.textSrc!"
                  alt="LangBangVN"
                  class="partners__langbang-text"
                  loading="lazy"
                  @error="(e) => (e.target as HTMLElement).style.display = 'none'"
                />
                <span class="partners__langbang-fallback">LangBangVN</span>
              </div>
            </template>

            <!-- NekoStudio: text -->
            <template v-else>
              <span class="partners__logo-text">NekoStudio</span>
            </template>
          </div>

          <!-- Body -->
          <div class="partners__card-body">
            <div class="partners__card-top">
              <h3 class="partners__card-name">{{ partner.name }}</h3>
              <span class="partners__card-tag">{{ partner.tag }}</span>
            </div>
            <p class="partners__card-desc">{{ partner.description }}</p>
          </div>

          <!-- Footer -->
          <div class="partners__card-footer">
            <span class="partners__badge">{{ partner.badge }}</span>
            <div class="partners__links">
              <span class="partners__link">Visit ↗</span>
              <a
                v-if="partner.discordUrl && partner.discordUrl !== partner.url"
                :href="partner.discordUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="partners__link"
                @click.stop
              >Discord ↗</a>
            </div>
          </div>

          <div class="partners__card-arrow" aria-hidden="true">↗</div>
        </a>
      </div>

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
.partners__header.is-visible { opacity: 1; transform: none; }

.partners__eyebrow {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-4);
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
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: var(--space-5);
  margin-bottom: var(--space-12);
}

/* ── Card — pure monochrome ── */
.partners__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 500ms var(--ease-out-quart),
              transform 500ms var(--ease-out-quart),
              border-color var(--duration-base) ease;
  text-decoration: none;
}

.partners__card.is-visible { opacity: 1; transform: none; }
.partners__card:hover { border-color: var(--muted); }

/* ── Logo ── */
.partners__card-logo {
  min-height: 40px;
  display: flex;
  align-items: center;
}

.partners__langbang {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.partners__langbang-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.partners__langbang-text {
  max-height: 24px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

/* Hide fallback when images load */
.partners__langbang-icon:not([style*="display: none"]) ~ .partners__langbang-fallback,
.partners__langbang-text:not([style*="display: none"]) ~ .partners__langbang-fallback {
  display: none;
}

.partners__langbang-fallback {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.partners__logo-text {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink);
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
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.partners__card-name {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.partners__card-tag {
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.partners__card-desc {
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.65;
}

/* ── Footer ── */
.partners__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.partners__badge {
  font-size: var(--text-xs);
  color: var(--muted);
  font-weight: 500;
  letter-spacing: 0.05em;
}

.partners__links {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.partners__link {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  transition: color var(--duration-fast) ease;
}
.partners__card:hover .partners__link { color: var(--ink-dim); }

/* ── Arrow ── */
.partners__card-arrow {
  position: absolute;
  top: var(--space-5);
  right: var(--space-5);
  font-size: var(--text-sm);
  color: var(--border);
  transition: color var(--duration-fast) ease,
              transform var(--duration-fast) var(--ease-out-quart);
}
.partners__card:hover .partners__card-arrow {
  color: var(--ink-dim);
  transform: translate(3px, -3px);
}

/* ── CTA ── */
.partners__cta {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  opacity: 0;
  transition: opacity 600ms var(--ease-out-quart) 500ms;
}
.partners__cta.is-visible { opacity: 1; }

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
.partners__cta-link:hover { color: var(--ink); }

/* ── Responsive ── */
@media (max-width: 640px) {
  .partners__cta { flex-direction: column; text-align: center; gap: var(--space-4); }
  .partners__cta-line { display: none; }
}
</style>
