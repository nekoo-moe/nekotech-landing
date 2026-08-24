import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * Anchor navigation and scroll-spy, in one place so the header, the hero
 * CTAs and the footer all behave identically.
 */

/** Scrolls to `#id`, handing off to Lenis when it is running. */
export function scrollToHash(hash: string, offset = -8) {
  const id = hash.replace(/^#/, '');
  const target = document.getElementById(id);
  if (!target) return;

  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.25 });
  } else {
    // Reduced motion, or Lenis not mounted: let the browser decide, and it
    // will honour the user's own scroll-behaviour preference.
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top });
  }
}

/**
 * Which section is currently under the reading line. Uses a viewport-height
 * band near the top rather than "most visible", so the highlight changes at
 * the moment a heading arrives instead of halfway through a tall section.
 */
export function useActiveSection(hashes: string[]) {
  const activeHash = ref<string | null>(null);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    const targets = hashes
      .map(h => document.getElementById(h.replace(/^#/, '')))
      .filter((el): el is HTMLElement => !!el);

    if (!targets.length) return;

    const visible = new Set<string>();

    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const hash = `#${entry.target.id}`;
          if (entry.isIntersecting) visible.add(hash);
          else visible.delete(hash);
        }
        // Keep document order rather than intersection order.
        activeHash.value = hashes.find(h => visible.has(h)) ?? activeHash.value;
      },
      { rootMargin: '-12% 0px -70% 0px' }
    );

    targets.forEach(el => observer!.observe(el));
  });

  onBeforeUnmount(() => observer?.disconnect());

  return { activeHash };
}
