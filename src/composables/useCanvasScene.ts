import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue';

/**
 * Shared lifecycle plumbing for the WebGL scenes.
 *
 * Every scene in this project follows the same three rules:
 *   1. If the device can't do WebGL, render nothing and let the CSS
 *      fallback underneath show through.
 *   2. If the user asked for reduced motion, draw exactly one frame.
 *   3. Never burn a frame on a scene that is off-screen or in a
 *      background tab.
 */

let webglSupport: boolean | null = null;

export function hasWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  if (typeof window === 'undefined') return (webglSupport = false);
  try {
    const canvas = document.createElement('canvas');
    webglSupport = !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl')
    );
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * True only when the target is intersecting the viewport AND the tab
 * is foregrounded. Drives whether the render loop should tick.
 */
export function useSceneActive(target: Ref<HTMLElement | null>, rootMargin = '120px') {
  const inView = ref(false);
  const tabVisible = ref(true);
  const active = ref(false);

  let observer: IntersectionObserver | null = null;

  const sync = () => { active.value = inView.value && tabVisible.value; };

  const onVisibility = () => {
    tabVisible.value = document.visibilityState === 'visible';
    sync();
  };

  onMounted(() => {
    if (target.value) {
      observer = new IntersectionObserver(
        entries => {
          inView.value = entries.some(e => e.isIntersecting);
          sync();
        },
        { rootMargin }
      );
      observer.observe(target.value);
    }
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  });

  return { active };
}

/** Frame-rate independent damping. `rate` is roughly "per 16ms". */
export function damp(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.pow(1 - rate, dt * 60));
}

/** Device pixel ratio, capped — a 3× DPR phone does not need 3× fill. */
export function cappedDPR(max = 2): number {
  return Math.min(window.devicePixelRatio || 1, max);
}
