import { ref } from 'vue';

type ScrollRevealOptions = {
  threshold?: number;
  rootMargin?: string;
};

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px' } = options;

  function reveal(el: HTMLElement, delay = 0) {
    // Content is visible by default — transition enhances, doesn't gate
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return; // No animation, already visible

    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }

  function revealList(els: HTMLElement[], staggerMs = 80) {
    els.forEach((el, i) => reveal(el, i * staggerMs));
  }

  return { reveal, revealList };
}
