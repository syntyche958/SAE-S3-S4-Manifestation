import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProviderView from '@/views/ProviderView.vue'
import ActivityView from '@/views/ActivityView.vue'
import Admin from '@/views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
  ],
})

export default router
