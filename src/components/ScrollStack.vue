<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import Lenis from 'lenis';
import './ScrollStack.css';

const props = withDefaults(defineProps<{
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
}>(), {
  className: '',
  itemDistance: 100,
  itemScale: 0.03,
  itemStackDistance: 30,
  stackPosition: '20%',
  scaleEndPosition: '10%',
  baseScale: 0.85,
  scaleDuration: 0.5,
  rotationAmount: 0,
  blurAmount: 0,
  useWindowScroll: false
});

const emit = defineEmits<{
  (e: 'stackComplete'): void;
}>();

const scrollerRef = ref<HTMLDivElement | null>(null);
const stackCompleted = ref(false);
let animationFrameId: number | null = null;
let lenisInstance: Lenis | null = null;
let cards: HTMLElement[] = [];
const lastTransforms = new Map();
let isUpdating = false;

const metrics = {
  containerHeight: 0,
  stackPositionPx: 0,
  scaleEndPositionPx: 0,
  endElementTop: 0,
  cards: [] as { top: number }[]
};

const calculateProgress = (scrollTop: number, start: number, end: number) => {
  if (scrollTop < start) return 0;
  if (scrollTop > end) return 1;
  return (scrollTop - start) / (end - start);
};

const parsePercentage = (value: string | number, containerHeight: number) => {
  if (typeof value === 'string' && value.includes('%')) {
    return (parseFloat(value) / 100) * containerHeight;
  }
  return typeof value === 'string' ? parseFloat(value) : value;
};

const updateMetrics = () => {
  const scroller = scrollerRef.value;
  const containerHeight = props.useWindowScroll ? window.innerHeight : (scroller?.clientHeight || 0);
  
  const stackPositionPx = parsePercentage(props.stackPosition, containerHeight) || 0;
  const scaleEndPositionPx = parsePercentage(props.scaleEndPosition, containerHeight) || 0;

  const endElement = props.useWindowScroll
    ? document.querySelector('.scroll-stack-end')
    : scrollerRef.value?.querySelector('.scroll-stack-end');
      
  let endElementTop = 0;
  if (endElement) {
    if (props.useWindowScroll) {
      const rect = endElement.getBoundingClientRect();
      endElementTop = rect.top + window.scrollY;
    } else {
      endElementTop = (endElement as HTMLElement).offsetTop;
    }
  }

  const cardMetrics = cards.map(card => {
    let top = 0;
    if (props.useWindowScroll) {
      const rect = card.getBoundingClientRect();
      top = rect.top + window.scrollY;
    } else {
      top = card.offsetTop;
    }
    return { top };
  });

  metrics.containerHeight = containerHeight;
  metrics.stackPositionPx = stackPositionPx;
  metrics.scaleEndPositionPx = scaleEndPositionPx;
  metrics.endElementTop = endElementTop;
  metrics.cards = cardMetrics;
};

const getScrollTop = () => {
  if (props.useWindowScroll) return window.scrollY;
  return scrollerRef.value?.scrollTop || 0;
};

const updateCardTransforms = () => {
  if (!cards.length || isUpdating) return;

  isUpdating = true;
  const scrollTop = getScrollTop();
  const { containerHeight, stackPositionPx, scaleEndPositionPx, endElementTop, cards: cardMetrics } = metrics;
  
  let topCardIndex = 0;
  if (props.blurAmount) {
    for (let j = 0; j < cardMetrics.length; j++) {
      const jCardTop = cardMetrics[j].top;
      const jTriggerStart = jCardTop - stackPositionPx - props.itemStackDistance * j;
      if (scrollTop >= jTriggerStart) {
        topCardIndex = j;
      }
    }
  }

  cards.forEach((card, i) => {
    if (!card) return;
    const cardMetric = cardMetrics[i];
    if (!cardMetric) return;

    const cardTop = cardMetric.top;
    const triggerStart = cardTop - stackPositionPx - props.itemStackDistance * i;
    const triggerEnd = cardTop - scaleEndPositionPx;
    const pinStart = cardTop - stackPositionPx - props.itemStackDistance * i;
    const pinEnd = endElementTop - containerHeight / 2;

    const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
    const targetScale = props.baseScale + i * props.itemScale;
    const scale = 1 - scaleProgress * (1 - targetScale);
    const rotation = props.rotationAmount ? i * props.rotationAmount * scaleProgress : 0;

    let blur = 0;
    if (props.blurAmount && i < topCardIndex) {
      const depthInStack = topCardIndex - i;
      blur = Math.max(0, depthInStack * props.blurAmount);
    }

    let translateY = 0;
    const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

    if (isPinned) {
      translateY = scrollTop - cardTop + stackPositionPx + props.itemStackDistance * i;
    } else if (scrollTop > pinEnd) {
      translateY = pinEnd - cardTop + stackPositionPx + props.itemStackDistance * i;
    }

    const newTransform = {
      translateY: Math.round(translateY * 100) / 100,
      scale: Math.round(scale * 1000) / 1000,
      rotation: Math.round(rotation * 100) / 100,
      blur: Math.round(blur * 100) / 100
    };

    const lastTransform = lastTransforms.get(i);
    const hasChanged =
      !lastTransform ||
      Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
      Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
      Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
      Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

    if (hasChanged) {
      const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
      const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

      card.style.transform = transform;
      if (card.style.filter !== filter && (filter !== '' || card.style.filter !== '')) {
        card.style.filter = filter;
      }

      lastTransforms.set(i, newTransform);
    }

    if (i === cards.length - 1) {
      const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isInView && !stackCompleted.value) {
        stackCompleted.value = true;
        emit('stackComplete');
      } else if (!isInView && stackCompleted.value) {
        stackCompleted.value = false;
      }
    }
  });

  isUpdating = false;
};

const handleScroll = () => {
  updateCardTransforms();
};

const handleResize = () => {
  updateMetrics();
  updateCardTransforms();
};

onMounted(() => {
  nextTick(() => {
    const scroller = scrollerRef.value;
    if (!scroller && !props.useWindowScroll) return;

    cards = Array.from(
      props.useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : (scroller?.querySelectorAll('.scroll-stack-card') || [])
    ) as HTMLElement[];

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${props.itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      (card.style as any).webkitTransform = 'translateZ(0)';
      (card.style as any).perspective = '1000px';
      (card.style as any).webkitPerspective = '1000px';
    });

    setTimeout(() => {
      updateMetrics();
      updateCardTransforms();
    }, 100);

    if (props.useWindowScroll) {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenisInstance.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenisInstance?.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      };
      animationFrameId = requestAnimationFrame(raf);
    } else {
      if (!scroller) return;
      lenisInstance = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientation: 'vertical',
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });

      lenisInstance.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenisInstance?.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      };
      animationFrameId = requestAnimationFrame(raf);
    }

    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (lenisInstance) {
    lenisInstance.destroy();
  }
  stackCompleted.value = false;
  cards = [];
  lastTransforms.clear();
  isUpdating = false;
});
</script>

<template>
  <div
    class="scroll-stack-scroller"
    :class="props.className"
    ref="scrollerRef"
    :style="props.useWindowScroll ? { height: 'auto', overflow: 'visible' } : {}"
  >
    <div class="scroll-stack-inner">
      <slot />
      <div class="scroll-stack-end" />
    </div>
  </div>
</template>
