import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProviderPage from '@/views/ProviderPage.vue'
import ActivityPage from '@/views/ActivityPage.vue'
import organisateur from "@/views/Organisateur.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/provider',
      name: 'provider_page',
      component: ProviderPage,
    },
    {
      path: '/activity',
      name: 'activity_page',
      component: ActivityPage,
    },
    {
      path: '/organisateur',
      name: 'organisateur',
      component: organisateur,
    },
  ],
})

export default router
