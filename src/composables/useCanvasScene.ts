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

/**
 * Frame-rate independent damping towards `target`.
 *
 * `rate` is an exponential decay constant in units of "per second": the gap to
 * the target shrinks by `e^-rate` every second, so 4 closes ~98% of it in one
 * second and 6 closes ~99.8%. It is deliberately unbounded above — the earlier
 * `Math.pow(1 - rate, dt * 60)` form treated `rate` as a 0..1 lerp factor and
 * returned NaN for every rate above 1, because a negative base raised to a
 * fractional exponent has no real value. Every caller passes a rate above 1.
 *
 * `dt` is clamped so a tab that was parked for a minute snaps instead of
 * overshooting on the first frame back.
 */
export function damp(current: number, target: number, rate: number, dt: number): number {
  if (!(dt > 0)) return current;
  const blend = 1 - Math.exp(-rate * Math.min(dt, 0.25));
  return current + (target - current) * blend;
}

/** Device pixel ratio, capped — a 3× DPR phone does not need 3× fill. */
export function cappedDPR(max = 2): number {
  return Math.min(window.devicePixelRatio || 1, max);
}
