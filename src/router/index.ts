import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';

/**
 * Two real routes. `/team` and `/contact` used to be pages of their own —
 * `/team` rendered six placeholder members, `/contact` rendered an empty div —
 * and both duplicate a section that now exists on the home page. They redirect
 * rather than 404 because they may already be linked from elsewhere.
 */
const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: Home },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/Projects.vue'),
  },

  { path: '/team', redirect: { path: '/', hash: '#team' } },
  { path: '/contact', redirect: { path: '/', hash: '#contact' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  scrollBehavior(to, _from, savedPosition) {
    // Lenis owns in-page scrolling, so a hash target is handed to it and the
    // router is told to do nothing. Returning a position here as well would
    // make the two animate against each other.
    if (to.hash) {
      const lenis = (window as any).__lenis;
      const target = document.querySelector(to.hash);
      if (lenis && target) {
        lenis.scrollTo(target, { offset: -8, duration: 1.25 });
        return false;
      }
      return { el: to.hash, top: 8 };
    }
    return savedPosition ?? { top: 0 };
  },
});

export default router;
