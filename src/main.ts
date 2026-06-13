import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './globals.css';

const app = createApp(App);
app.use(router);
app.mount('#app');

// ── Global scroll reveal for headings ──────────────────────────
// Finds all .reveal-heading elements, wraps heading lines in
// .rh-line > .rh-inner spans, then triggers .is-revealed on scroll.
function initRevealHeadings() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll<HTMLElement>('.reveal-heading, .reveal-fade').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  // Wrap heading text nodes for clip-path reveal
  document.querySelectorAll<HTMLElement>('.reveal-heading').forEach(wrapper => {
    const headings = wrapper.querySelectorAll<HTMLElement>('h1, h2, h3');
    headings.forEach(h => {
      // Skip if already processed
      if (h.querySelector('.rh-line')) return;
      const text = h.innerHTML;
      // Split on <br> or newlines, wrap each part
      const parts = text.split(/<br\s*\/?>/i);
      h.innerHTML = parts.map(part =>
        `<span class="rh-line"><span class="rh-inner">${part.trim()}</span></span>`
      ).join('');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll<HTMLElement>('.reveal-heading, .reveal-fade').forEach(el => {
    observer.observe(el);
  });
}

// Run after Vue mounts + DOM is ready
router.afterEach(() => {
  // Small delay to let Vue render
  setTimeout(initRevealHeadings, 100);
});

// Also run on initial load
setTimeout(initRevealHeadings, 200);
