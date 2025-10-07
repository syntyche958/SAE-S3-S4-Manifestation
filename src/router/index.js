import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProviderPage from '@/views/ProviderPage.vue'
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
      name: 'mgb',
      component: ProviderPage,
    },
    {
      path: '/organisateur',
      name: 'organisateur',
      component: organisateur,
    },
  ],
})

export default router
