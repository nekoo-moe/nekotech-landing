import { onMounted, onBeforeUnmount, type Ref } from 'vue';
import { prefersReducedMotion } from './useCanvasScene';

/**
 * Scroll-linked progress as a CSS custom property.
 *
 * The reveal system in `main.ts` is a switch: an element is out, then it is in.
 * That is what makes a page read like a slide deck — every section plays the
 * same one-shot animation and then sits still. This is the other half: a value
 * that tracks *where* an element is in the viewport, continuously, so motion
 * can be tied to the scroll itself.
 *
 * The element gets `--sp` (0 → 1) and can use it for anything: drawing a line,
 * drifting a numeral, fading a veil.
 *
 *   0  — the element's top is `start` of the way down the viewport
 *   1  — the element's bottom has risen to `end` of the way down
 *
 * All registered elements share one rAF loop, and the loop stops entirely when
 * nothing is registered. Under reduced motion the property is pinned to 1 and
 * no loop ever starts, so anything driven by it renders in its final state.
 */

interface Tracked {
  el: HTMLElement;
  varName: string;
  start: number;
  end: number;
  last: number;
}

const tracked = new Set<Tracked>();
let frame = 0;

function tick() {
  const vh = window.innerHeight || 1;

  for (const t of tracked) {
    const rect = t.el.getBoundingClientRect();

    // Distance travelled from the start line, over the total distance the
    // element covers between the start and end lines.
    const total = vh * (t.start - t.end) + rect.height || 1;
    const travelled = vh * t.start - rect.top;
    const p = Math.min(1, Math.max(0, travelled / total));

    // Writing a style on every element every frame is the expensive part, so
    // skip the ones that have not moved a meaningful amount.
    if (Math.abs(p - t.last) > 0.0015) {
      t.last = p;
      t.el.style.setProperty(t.varName, p.toFixed(4));
    }
  }

  frame = tracked.size ? requestAnimationFrame(tick) : 0;
}

export interface ScrollProgressOptions {
  /** Custom property to write. Default `--sp`. */
  varName?: string;
  /** Viewport fraction where progress starts. Default 0.9 (near the bottom). */
  start?: number;
  /** Viewport fraction where progress completes. Default 0.4. */
  end?: number;
}

export function useScrollProgress(
  target: Ref<HTMLElement | null>,
  options: ScrollProgressOptions = {}
) {
  const { varName = '--sp', start = 0.9, end = 0.4 } = options;
  let entry: Tracked | null = null;

  onMounted(() => {
    const el = target.value;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.setProperty(varName, '1');
      return;
    }

    entry = { el, varName, start, end, last: -1 };
    tracked.add(entry);
    if (!frame) frame = requestAnimationFrame(tick);
  });

  onBeforeUnmount(() => {
    if (!entry) return;
    tracked.delete(entry);
    entry = null;
    if (!tracked.size && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
}
