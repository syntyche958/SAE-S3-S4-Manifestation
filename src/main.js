import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import PrimeVue from 'primevue/config'
import { ToastService } from 'primevue'
import Aura from '@primeuix/themes/aura'
import Tooltip from 'primevue/tooltip'
import ConfirmationService from 'primevue/confirmationservice'
import Ripple from 'primevue/ripple'

import App from './App.vue'
import router from './router'
import { messages } from './datasource/lang'

const app = createApp(App)
app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)
const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: messages,
})

app.use(i18n)
app.use(createPinia())
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  },
})
app.use(router)
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
