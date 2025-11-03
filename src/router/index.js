import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProviderView from '@/views/ProviderView.vue'
import ActivityPage from '@/views/ActivityPage.vue'
import { providers } from '@/datasource/data.js'
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
      props: (route) => {
        const id = Number.parseInt(route.params.provider_id)
        const provider = providers.find((p) => p.id === id)
        return { provider }
      },
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
