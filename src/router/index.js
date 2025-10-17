import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProviderPage from '@/views/ProviderPage.vue'
import ActivityPage from '@/views/ActivityPage.vue'
import { providers } from '@/datasource/data.js'
import Admin from "@/views/AdminView.vue";

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
      path:'/provider/:provider_id',
      name: 'provider_page',
      component: ProviderPage,
      props: route=>{const id = parseInt(route.params.provider_id)
        const provider = providers.find(p => p.id === id)
        return { provider }}
    },
    {
      path: '/provider/activity',
      name: 'activity_page',
      component: ActivityPage,
    },
    {

      path: '/admin',
      name: 'admin',
      component: Admin,
    },
  ],
})

export default router
