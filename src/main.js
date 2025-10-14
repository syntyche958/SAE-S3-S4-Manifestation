import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import App from './App.vue'
import router from './router'
import { messages } from './datasource/lang'

const app = createApp(App)

const i18n = createI18n({
  locale: 'fr',
  fallbackLocale: 'en',
  messages: messages,
})

app.use(i18n)
app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  },
})
app.use(router)

app.mount('#app')
