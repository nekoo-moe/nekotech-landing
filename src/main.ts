import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Open Runde, self-hosted. Loaded before globals.css so the @font-face rules
// exist by the time the custom properties reference the family.
import '@fontsource/open-runde/400.css';
import '@fontsource/open-runde/500.css';
import '@fontsource/open-runde/600.css';
import '@fontsource/open-runde/700.css';

import './globals.css';

createApp(App).use(router).mount('#app');

/**
 * One observer for every `[data-reveal]` on the page.
 *
 * The previous version rewrote `innerHTML` of every heading on a timer after
 * `router.afterEach`, which raced Vue's render and threw away the reveal
 * wrappers whenever the language changed. Now the markup is authored in the
 * templates and this only ever toggles a class.
 *
 * Reduced motion is handled in CSS (`[data-reveal]` is forced visible), so
 * there is nothing to observe in that case.
 */
const REVEALED = 'is-in';

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(REVEALED);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  // Sections mount and unmount as routes change, so watch the tree rather
  // than sweeping it once. `subtree: true` catches nested renders too.
  const attach = (root: ParentNode) => {
    root.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => observer.observe(el));
  };

  const mutations = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.hasAttribute('data-reveal')) observer.observe(node);
        attach(node);
      }
    }
  });

  const start = () => {
    const app = document.getElementById('app');
    if (!app) return;
    attach(app);
    mutations.observe(app, { childList: true, subtree: true });
  };

  // Vue has mounted synchronously above, but child components resolved by
  // `defineAsyncComponent`/route imports land a tick later.
  requestAnimationFrame(start);
}
