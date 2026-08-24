/**
 * Cursor spotlight for cards and rows.
 *
 * Writes the pointer's position within an element as `--mx` / `--my`
 * percentages, so CSS can put a soft radial highlight exactly under the
 * cursor. The effect is what gives a flat plate the sense of being lit from
 * somewhere, which is most of why the reference sites' cards feel physical
 * rather than printed.
 *
 * Deliberately not a Vue ref-per-card: a page can hold a dozen of these, and
 * the handler only ever touches the element it fired on.
 */
import { prefersReducedMotion } from './useCanvasScene';

export function useSpotlight() {
  const reduced = prefersReducedMotion();

  const onPointerMove = (event: PointerEvent) => {
    if (reduced) return;
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  /** Park the highlight back at the centre so it fades out symmetrically. */
  const onPointerLeave = (event: PointerEvent) => {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  };

  return { onPointerMove, onPointerLeave };
}
