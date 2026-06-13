<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import './ProfileCard.css';

const props = withDefaults(defineProps<{
  avatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string | null;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  showShine?: boolean;
}>(), {
  avatarUrl: '',
  iconUrl: '',
  grainUrl: '',
  behindGlowEnabled: true,
  className: '',
  enableTilt: true,
  enableMobileTilt: false,
  mobileTiltSensitivity: 5,
  miniAvatarUrl: null,
  name: 'Javi A. Torres',
  title: 'Software Engineer',
  handle: 'javicodes',
  status: 'Online',
  contactText: 'Contact',
  showUserInfo: true,
  showShine: true
});

const emit = defineEmits<{
  (e: 'contactClick'): void;
}>();

const wrapRef = ref<HTMLDivElement | null>(null);
const shellRef = ref<HTMLDivElement | null>(null);

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
};

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) => 
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

let enterTimer: number | null = null;
let leaveRafId: number | null = null;
let tiltEngine: any = null;

const createTiltEngine = () => {
  if (!props.enableTilt) return null;

  let rafId: number | null = null;
  let running = false;
  let lastTs = 0;

  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  const DEFAULT_TAU = 0.14;
  const INITIAL_TAU = 0.6;
  let initialUntil = 0;

  const setVarsFromXY = (x: number, y: number) => {
    const shell = shellRef.value;
    const wrap = wrapRef.value;
    if (!shell || !wrap) return;

    const width = shell.clientWidth || 1;
    const height = shell.clientHeight || 1;

    const percentX = clamp((100 / width) * x);
    const percentY = clamp((100 / height) * y);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const properties = {
      '--pointer-x': `${percentX}%`,
      '--pointer-y': `${percentY}%`,
      '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
      '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
      '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
      '--pointer-from-top': `${percentY / 100}`,
      '--pointer-from-left': `${percentX / 100}`,
      '--rotate-x': `${round(-(centerX / 5))}deg`,
      '--rotate-y': `${round(centerY / 4)}deg`
    };

    for (const [k, v] of Object.entries(properties)) {
      wrap.style.setProperty(k, v);
    }
  };

  const step = (ts: number) => {
    if (!running) return;
    if (lastTs === 0) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
    const k = 1 - Math.exp(-dt / tau);

    currentX += (targetX - currentX) * k;
    currentY += (targetY - currentY) * k;

    setVarsFromXY(currentX, currentY);

    const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

    if (stillFar || document.hasFocus()) {
      rafId = requestAnimationFrame(step);
    } else {
      running = false;
      lastTs = 0;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    lastTs = 0;
    rafId = requestAnimationFrame(step);
  };

  return {
    setImmediate(x: number, y: number) {
      currentX = x;
      currentY = y;
      setVarsFromXY(currentX, currentY);
    },
    setTarget(x: number, y: number) {
      targetX = x;
      targetY = y;
      start();
    },
    toCenter() {
      const shell = shellRef.value;
      if (!shell) return;
      this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
    },
    beginInitial(durationMs: number) {
      initialUntil = performance.now() + durationMs;
      start();
    },
    getCurrent() {
      return { x: currentX, y: currentY, tx: targetX, ty: targetY };
    },
    cancel() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      running = false;
      lastTs = 0;
    }
  };
};

const getOffsets = (evt: MouseEvent, el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
};

const handlePointerMove = (event: MouseEvent) => {
  const shell = shellRef.value;
  if (!shell || !tiltEngine) return;
  const { x, y } = getOffsets(event, shell);
  tiltEngine.setTarget(x, y);
};

const handlePointerEnter = (event: MouseEvent) => {
  const shell = shellRef.value;
  if (!shell || !tiltEngine) return;

  shell.classList.add('active');
  shell.classList.add('entering');
  if (enterTimer) window.clearTimeout(enterTimer);
  enterTimer = window.setTimeout(() => {
    shell.classList.remove('entering');
  }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

  const { x, y } = getOffsets(event, shell);
  tiltEngine.setTarget(x, y);
};

const handlePointerLeave = () => {
  const shell = shellRef.value;
  if (!shell || !tiltEngine) return;

  tiltEngine.toCenter();

  const checkSettle = () => {
    const { x, y, tx, ty } = tiltEngine.getCurrent();
    const settled = Math.hypot(tx - x, ty - y) < 0.6;
    if (settled) {
      shell.classList.remove('active');
      leaveRafId = null;
    } else {
      leaveRafId = requestAnimationFrame(checkSettle);
    }
  };
  if (leaveRafId) cancelAnimationFrame(leaveRafId);
  leaveRafId = requestAnimationFrame(checkSettle);
};

const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
  const shell = shellRef.value;
  if (!shell || !tiltEngine) return;

  const { beta, gamma } = event;
  if (beta == null || gamma == null) return;

  const centerX = shell.clientWidth / 2;
  const centerY = shell.clientHeight / 2;
  const x = clamp(centerX + gamma * props.mobileTiltSensitivity, 0, shell.clientWidth);
  const y = clamp(
    centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * props.mobileTiltSensitivity,
    0,
    shell.clientHeight
  );

  tiltEngine.setTarget(x, y);
};

const handleClick = () => {
  if (!props.enableMobileTilt || typeof window === 'undefined' || location.protocol !== 'https:') return;
  const anyMotion = (window as any).DeviceMotionEvent;
  if (anyMotion && typeof anyMotion.requestPermission === 'function') {
    anyMotion
      .requestPermission()
      .then((state: string) => {
        if (state === 'granted') {
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener('deviceorientation', handleDeviceOrientation);
  }
};

onMounted(() => {
  if (!props.enableTilt) return;

  tiltEngine = createTiltEngine();
  const shell = shellRef.value;
  if (!shell || !tiltEngine) return;

  shell.addEventListener('pointerenter', handlePointerEnter);
  shell.addEventListener('pointermove', handlePointerMove);
  shell.addEventListener('pointerleave', handlePointerLeave);
  shell.addEventListener('click', handleClick);

  const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
  const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
  tiltEngine.setImmediate(initialX, initialY);
  tiltEngine.toCenter();
  tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);
});

onUnmounted(() => {
  const shell = shellRef.value;
  if (shell) {
    shell.removeEventListener('pointerenter', handlePointerEnter);
    shell.removeEventListener('pointermove', handlePointerMove);
    shell.removeEventListener('pointerleave', handlePointerLeave);
    shell.removeEventListener('click', handleClick);
    shell.classList.remove('entering');
  }
  window.removeEventListener('deviceorientation', handleDeviceOrientation);
  if (enterTimer) window.clearTimeout(enterTimer);
  if (leaveRafId) cancelAnimationFrame(leaveRafId);
  if (tiltEngine) tiltEngine.cancel();
});

const cardStyle = computed(() => ({
  '--icon': props.iconUrl ? `url(${props.iconUrl})` : 'none',
  '--grain': props.grainUrl ? `url(${props.grainUrl})` : 'none',
  '--inner-gradient': props.innerGradient ?? DEFAULT_INNER_GRADIENT,
  '--behind-glow-color': props.behindGlowColor ?? 'rgba(125, 190, 255, 0.67)',
  '--behind-glow-size': props.behindGlowSize ?? '50%'
}));

const handleContactClick = () => {
  emit('contactClick');
};

const handleAvatarError = (e: Event) => {
  const t = e.target as HTMLImageElement;
  t.style.display = 'none';
};

const handleMiniAvatarError = (e: Event) => {
  const t = e.target as HTMLImageElement;
  t.style.opacity = '0.5';
  t.src = props.avatarUrl;
};
</script>

<template>
  <div ref="wrapRef" class="pc-card-wrapper" :class="props.className" :style="cardStyle">
    <div v-if="props.behindGlowEnabled" class="pc-behind" />
    <div ref="shellRef" class="pc-card-shell">
      <section class="pc-card">
        <div class="pc-inside">
          <template v-if="props.showShine">
            <div class="pc-shine" />
            <div class="pc-glare" />
          </template>
          <div class="pc-content pc-avatar-content">
            <img
              class="avatar"
              :src="props.avatarUrl"
              :alt="`${props.name || 'User'} avatar`"
              loading="lazy"
              @error="handleAvatarError"
            />
            <div v-if="props.showUserInfo" class="pc-user-info">
              <div class="pc-user-details">
                <div class="pc-mini-avatar">
                  <img
                    :src="props.miniAvatarUrl || props.avatarUrl"
                    :alt="`${props.name || 'User'} mini avatar`"
                    loading="lazy"
                    @error="handleMiniAvatarError"
                  />
                </div>
                <div class="pc-user-text">
                  <div class="pc-handle">@{{ props.handle }}</div>
                  <div class="pc-status">{{ props.status }}</div>
                </div>
              </div>
              <button
                class="pc-contact-btn"
                @click="handleContactClick"
                style="pointer-events: auto"
                type="button"
                :aria-label="`Contact ${props.name || 'user'}`"
              >
                {{ props.contactText }}
              </button>
            </div>
          </div>
          <div class="pc-content">
            <div class="pc-details">
              <h3>{{ props.name }}</h3>
              <p>{{ props.title }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
