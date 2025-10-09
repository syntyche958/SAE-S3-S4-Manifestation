import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProviderPage from '@/views/ProviderPage.vue'
import Organizer from "@/views/Organizer.vue";

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
      path: '/organizer',
      name: 'organizer',
      component: Organizer,
    },
  ],
})

export default router
