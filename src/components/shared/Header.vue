<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useLanguage } from '@/components/providers/LanguageProvider.vue';
import { NavigationConfig } from '@/configs/app.config';
import NekoTechLogo from '@/assets/nekotech-logo.png';

const { t, language, setLanguage } = useLanguage();

// Frosted header on scroll
const scrolled = ref(false);
const drawerOpen = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 40;
};

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

// Smooth scroll — delegates to Lenis via scrollTo if available, else native
const handleNavClick = (e: MouseEvent, url: string) => {
  if (!url.includes('#')) return;
  e.preventDefault();
  drawerOpen.value = false;
  const id = url.split('#').pop();
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  // Use Lenis if it's on window, otherwise native smooth scroll
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

// Language: reactive switch — NO page reload
const toggleLanguage = () => {
  setLanguage(language.value === 'en' ? 'vi' : 'en');
};
</script>

<template>
  <header
    class="nk-header"
    :class="{ 'nk-header--scrolled': scrolled }"
    role="banner"
  >
    <div class="nk-header__inner container">
      <!-- Logo / wordmark -->
      <a href="#home" class="nk-header__logo" @click="(e) => handleNavClick(e, '#home')">
        <img :src="NekoTechLogo" alt="NekoTech Foundation" class="nk-header__logo-img" />
        <span class="nk-header__wordmark">NekoTech</span>
      </a>

      <!-- Desktop nav -->
      <nav class="nk-header__nav" aria-label="Main navigation">
        <a
          v-for="item in NavigationConfig"
          :key="item.key"
          :href="item.url"
          class="nk-header__link"
          @click="(e) => handleNavClick(e, item.url)"
        >
          {{ (t.navigation as any)[item.key] }}
        </a>
      </nav>

      <!-- Actions -->
      <div class="nk-header__actions">
        <button
          class="nk-header__lang"
          @click="toggleLanguage"
          :aria-label="`Switch to ${language === 'en' ? 'Vietnamese' : 'English'}`"
        >
          {{ language === 'en' ? 'VI' : 'EN' }}
        </button>

        <!-- Mobile hamburger -->
        <button
          class="nk-header__hamburger"
          :class="{ 'is-open': drawerOpen }"
          @click="drawerOpen = !drawerOpen"
          aria-label="Toggle menu"
          :aria-expanded="drawerOpen"
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile drawer -->
  <Teleport to="body">
    <div
      class="nk-drawer"
      :class="{ 'nk-drawer--open': drawerOpen }"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <nav class="nk-drawer__nav">
        <a
          v-for="item in NavigationConfig"
          :key="item.key"
          :href="item.url"
          class="nk-drawer__link"
          @click="(e) => handleNavClick(e, item.url)"
        >
          {{ (t.navigation as any)[item.key] }}
        </a>
        <button class="nk-drawer__lang" @click="toggleLanguage">
          Switch to {{ language === 'en' ? 'Tiếng Việt' : 'English' }}
        </button>
      </nav>
    </div>
    <!-- Backdrop -->
    <div
      v-if="drawerOpen"
      class="nk-drawer-backdrop"
      @click="drawerOpen = false"
      aria-hidden="true"
    />
  </Teleport>
</template>

<style scoped>
/* ── Header shell ── */
.nk-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  height: 64px;
  transition: background var(--duration-base) var(--ease-out-quart),
              border-color var(--duration-base) var(--ease-out-quart);
  border-bottom: 1px solid transparent;
}

.nk-header--scrolled {
  background: oklch(0.06 0 0 / 0.88);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border-bottom-color: var(--border);
}

.nk-header__inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

/* ── Logo ── */
.nk-header__logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.nk-header__logo-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.nk-header__wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: -0.01em;
  color: var(--ink);
}

/* ── Desktop nav ── */
.nk-header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 1;
  justify-content: center;
}

.nk-header__link {
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--ink-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  position: relative;
  transition: color var(--duration-fast) ease;
}

.nk-header__link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent);
  transition: width var(--duration-base) var(--ease-out-quart);
}

.nk-header__link:hover {
  color: var(--ink);
}

.nk-header__link:hover::after {
  width: 100%;
}

/* ── Actions ── */
.nk-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-shrink: 0;
}

.nk-header__lang {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0.06em;
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: color var(--duration-fast) ease, border-color var(--duration-fast) ease;
}

.nk-header__lang:hover {
  color: var(--ink);
  border-color: var(--muted);
}

/* ── Hamburger ── */
.nk-header__hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 28px;
  height: 28px;
  padding: 2px;
}

.nk-header__hamburger span {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--ink);
  transition: transform var(--duration-base) var(--ease-out-quart),
              opacity var(--duration-fast) ease;
  transform-origin: center;
}

.nk-header__hamburger.is-open span:first-child {
  transform: translateY(3px) rotate(45deg);
}

.nk-header__hamburger.is-open span:last-child {
  transform: translateY(-3px) rotate(-45deg);
}

/* ── Mobile drawer ── */
.nk-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 85vw);
  background: var(--bg-raised);
  border-left: 1px solid var(--border);
  z-index: var(--z-modal);
  transform: translateX(100%);
  transition: transform var(--duration-slow) var(--ease-out-quart);
  display: flex;
  flex-direction: column;
  padding: 80px var(--space-8) var(--space-8);
}

.nk-drawer--open {
  transform: translateX(0);
}

.nk-drawer__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.nk-drawer__link {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--ink-dim);
  letter-spacing: -0.01em;
  transition: color var(--duration-fast) ease;
}

.nk-drawer__link:hover {
  color: var(--ink);
}

.nk-drawer__lang {
  margin-top: auto;
  font-size: var(--text-sm);
  color: var(--muted);
  text-align: left;
  padding: var(--space-4) 0;
  border-top: 1px solid var(--border);
  transition: color var(--duration-fast) ease;
}

.nk-drawer__lang:hover {
  color: var(--ink);
}

.nk-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: oklch(0 0 0 / 0.6);
  z-index: calc(var(--z-modal) - 1);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .nk-header__nav {
    display: none;
  }

  .nk-header__hamburger {
    display: flex;
  }
}
</style>
