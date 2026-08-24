<script setup lang="ts">
/**
 * Header. Three jobs beyond navigation:
 *
 * 1. A scroll-progress hairline along the bottom edge — the only always-on
 *    indicator of how far down the document you are.
 * 2. Active-section highlight, shared with the footer via `useActiveSection`.
 * 3. The drawer traps nothing and does no scroll-locking gymnastics: it sets
 *    `overflow: hidden` on <html> while open and restores it on close, and
 *    Escape closes it.
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { NAV, ORG } from '@/configs/app.config';
import { scrollToHash, useActiveSection } from '@/composables/useSectionNav';
import NekoTechLogo from '@/assets/nekotech-logo.png';

const { t, language, setLanguage } = useLanguage();

const { activeHash } = useActiveSection(NAV.map(n => n.hash));

const condensed = ref(false);
const progress = ref(0);
const drawerOpen = ref(false);

let raf = 0;

const readScroll = () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    condensed.value = y > 24;
    progress.value = max > 0 ? Math.min(1, y / max) : 0;
  });
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') drawerOpen.value = false;
};

onMounted(() => {
  readScroll();
  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', readScroll, { passive: true });
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf);
  window.removeEventListener('scroll', readScroll);
  window.removeEventListener('resize', readScroll);
  window.removeEventListener('keydown', onKeydown);
  document.documentElement.style.overflow = '';
});

watch(drawerOpen, open => {
  document.documentElement.style.overflow = open ? 'hidden' : '';
});

const go = (hash: string) => {
  drawerOpen.value = false;
  // Let the drawer's scroll-lock lift before Lenis measures the target.
  requestAnimationFrame(() => scrollToHash(hash, -(68 - 8)));
};

const toggleLanguage = () => setLanguage(language.value === 'en' ? 'vi' : 'en');
</script>

<template>
  <a class="skip" href="#home" @click.prevent="go('#home')">{{ t.a11y.skipToContent }}</a>

  <header class="hd" :class="{ 'hd--condensed': condensed }" role="banner">
    <div class="hd__inner container">
      <a class="hd__mark" href="#home" @click.prevent="go('#home')">
        <img :src="NekoTechLogo" alt="" class="hd__mark-img" aria-hidden="true" />
        <span class="hd__mark-text">
          NekoTech<span class="hd__mark-sub">Foundation</span>
        </span>
      </a>

      <nav class="hd__nav" :aria-label="t.a11y.mainNav">
        <a
          v-for="item in NAV"
          :key="item.key"
          class="hd__link"
          :class="{ 'is-active': activeHash === item.hash }"
          :href="item.hash"
          :aria-current="activeHash === item.hash ? 'true' : undefined"
          @click.prevent="go(item.hash)"
        >{{ t.nav[item.key] }}</a>
      </nav>

      <div class="hd__actions">
        <button
          class="hd__lang"
          type="button"
          :aria-label="t.a11y.switchTo"
          @click="toggleLanguage"
        >
          <span :class="{ 'is-on': language === 'en' }">EN</span>
          <span class="hd__lang-sep" aria-hidden="true">/</span>
          <span :class="{ 'is-on': language === 'vi' }">VI</span>
        </button>

        <a class="hd__ghlink" :href="ORG.github" target="_blank" rel="noreferrer noopener">
          GitHub
          <span class="sr-only">({{ t.a11y.externalLink }})</span>
        </a>

        <button
          class="hd__burger"
          type="button"
          :class="{ 'is-open': drawerOpen }"
          :aria-label="drawerOpen ? t.a11y.closeMenu : t.a11y.openMenu"
          :aria-expanded="drawerOpen"
          aria-controls="hd-drawer"
          @click="drawerOpen = !drawerOpen"
        >
          <span></span><span></span>
        </button>
      </div>
    </div>

    <div class="hd__progress" aria-hidden="true">
      <span :style="{ transform: `scaleX(${progress})` }"></span>
    </div>
  </header>

  <Teleport to="body">
    <div
      v-show="drawerOpen"
      class="dr-backdrop"
      aria-hidden="true"
      @click="drawerOpen = false"
    />
    <div
      id="hd-drawer"
      class="dr"
      :class="{ 'dr--open': drawerOpen }"
      role="dialog"
      aria-modal="true"
      :aria-label="t.a11y.mainNav"
      :aria-hidden="!drawerOpen"
    >
      <nav class="dr__nav">
        <a
          v-for="(item, i) in NAV"
          :key="item.key"
          class="dr__link"
          :style="{ '--i': i }"
          :href="item.hash"
          @click.prevent="go(item.hash)"
        >
          <span class="dr__idx num">{{ String(i + 1).padStart(2, '0') }}</span>
          {{ t.nav[item.key] }}
        </a>
      </nav>

      <div class="dr__foot">
        <button class="dr__lang" type="button" @click="toggleLanguage">
          {{ t.a11y.switchTo }}
        </button>
        <a class="dr__ext" :href="ORG.github" target="_blank" rel="noreferrer noopener">
          {{ ORG.github.replace('https://', '') }}
        </a>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ── Skip link ─────────────────────────────────────────────────────────── */
.skip {
  position: fixed;
  top: var(--space-2);
  left: var(--space-2);
  z-index: var(--z-toast);
  padding: 0.6rem 1rem;
  background: var(--ink);
  color: var(--bg);
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
  transform: translateY(-160%);
  transition: transform var(--duration-base) var(--ease-cinematic);
}

.skip:focus-visible { transform: none; }

/* ── Shell ─────────────────────────────────────────────────────────────── */
.hd {
  position: fixed;
  inset: 0 0 auto;
  z-index: var(--z-header);
  height: var(--header-h);
  border-bottom: 1px solid transparent;
  transition:
    background var(--duration-base) var(--ease-out-quart),
    border-color var(--duration-base) var(--ease-out-quart);
}

.hd--condensed {
  background: oklch(0.055 0 0 / 0.72);
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  border-bottom-color: var(--border);
}

.hd__inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

/* ── Wordmark ──────────────────────────────────────────────────────────── */
.hd__mark {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.hd__mark-img { width: 26px; height: 26px; object-fit: contain; }

.hd__mark-text {
  display: flex;
  flex-direction: column;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-sm);
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.hd__mark-sub {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: var(--text-2xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* ── Nav ───────────────────────────────────────────────────────────────── */
.hd__nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-inline: auto;
}

.hd__link {
  position: relative;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--muted);
  padding-block: var(--space-2);
  transition: color var(--duration-fast) ease;
}

.hd__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-base) var(--ease-cinematic);
}

.hd__link:hover { color: var(--ink); }
.hd__link:hover::after { transform: scaleX(1); }

.hd__link.is-active { color: var(--ink); }
.hd__link.is-active::after { transform: scaleX(1); }

/* ── Actions ───────────────────────────────────────────────────────────── */
.hd__actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-shrink: 0;
}

.hd__lang {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.10em;
  color: var(--ink-faint);
  padding: 0.3rem 0;
}

.hd__lang .is-on { color: var(--ink); }
.hd__lang-sep { color: var(--border-strong); }

.hd__ghlink {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.13em;
  color: var(--muted);
  padding: 0.42rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: color var(--duration-fast) ease, border-color var(--duration-fast) ease;
}

.hd__ghlink:hover { color: var(--ink); border-color: var(--border-strong); }

/* ── Burger ────────────────────────────────────────────────────────────── */
.hd__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 30px;
  height: 30px;
}

.hd__burger span {
  display: block;
  height: 1px;
  background: var(--ink);
  transform-origin: center;
  transition: transform var(--duration-base) var(--ease-cinematic);
}

.hd__burger span:first-child { width: 100%; }
.hd__burger span:last-child  { width: 68%; align-self: flex-end; }

.hd__burger.is-open span:first-child { transform: translateY(3px) rotate(45deg); }
.hd__burger.is-open span:last-child  { width: 100%; transform: translateY(-3px) rotate(-45deg); }

/* ── Scroll progress ───────────────────────────────────────────────────── */
.hd__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
}

.hd__progress span {
  display: block;
  height: 100%;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  will-change: transform;
}

/* ── Drawer ────────────────────────────────────────────────────────────── */
.dr-backdrop {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-drawer) - 1);
  background: oklch(0 0 0 / 0.66);
  backdrop-filter: blur(2px);
}

.dr {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(360px, 88vw);
  z-index: var(--z-drawer);
  display: flex;
  flex-direction: column;
  padding: calc(var(--header-h) + var(--space-8)) var(--space-8) var(--space-8);
  background: var(--bg-raised);
  border-left: 1px solid var(--border);
  transform: translateX(100%);
  visibility: hidden;
  transition:
    transform var(--duration-slow) var(--ease-cinematic),
    visibility var(--duration-slow) step-end;
}

.dr--open {
  transform: none;
  visibility: visible;
  transition:
    transform var(--duration-slow) var(--ease-cinematic),
    visibility 0s;
}

.dr__nav { display: flex; flex-direction: column; }

.dr__link {
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
  padding-block: var(--space-4);
  border-bottom: 1px solid var(--hairline);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink-dim);
  opacity: 0;
  transform: translateX(18px);
  transition:
    opacity var(--duration-slow) var(--ease-cinematic),
    transform var(--duration-slow) var(--ease-cinematic),
    color var(--duration-fast) ease;
}

.dr--open .dr__link {
  opacity: 1;
  transform: none;
  transition-delay: calc(var(--i) * 45ms + 120ms);
}

.dr__link:hover { color: var(--ink); }

.dr__idx {
  font-size: var(--text-2xs);
  color: var(--ink-faint);
}

.dr__foot {
  margin-top: auto;
  padding-top: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-start;
}

.dr__lang,
.dr__ext {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.10em;
  color: var(--muted);
  transition: color var(--duration-fast) ease;
}

.dr__lang:hover,
.dr__ext:hover { color: var(--ink); }

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .hd__nav { display: none; }
  .hd__burger { display: flex; }
  .hd__inner { justify-content: space-between; }
}

@media (max-width: 520px) {
  .hd__ghlink { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .dr__link { opacity: 1; transform: none; transition: none; }
  .dr { transition: transform 1ms linear, visibility 1ms; }
}
</style>
