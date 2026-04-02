import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProviderView from '@/views/ProviderView.vue'
import ActivityView from '@/views/ActivityView.vue'
import Admin from '@/views/AdminView.vue'
import MyReservationsView from '@/views/MyReservationsView.vue'
import AuthCallbackView from '@/views/AuthCallbackView.vue'
import ProviderStatisticsView from '@/views/ProviderStatisticsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return { ...savedPosition, behavior: 'auto' }
    }

    if (to.hash) {
      return { el: to.hash, behavior: 'auto' }
    }

    return { top: 0, left: 0, behavior: 'auto' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: MyReservationsView,
    },
    {
      path: '/auth/callback',
      name: 'auth_callback',
      component: AuthCallbackView,
    },
    {
      path: '/provider/:provider_id',
      name: 'provider_page',
      component: ProviderView,
    },
    {
      path: '/provider/:provider_id/activity/:activity_id',
      name: 'activity_page',
      component: ActivityView,
    },
    {
      path: '/provider/:provider_id/statistics',
      name: 'provider_statistics',
      component: ProviderStatisticsView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
  ],
})

export default router
