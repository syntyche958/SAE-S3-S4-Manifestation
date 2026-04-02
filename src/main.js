import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { ToastService } from 'primevue'
import Tooltip from 'primevue/tooltip'
import ConfirmationService from 'primevue/confirmationservice'
import Ripple from 'primevue/ripple'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Preset from './assets/Preset'

const app = createApp(App)
app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)

app.use(i18n)
app.use(createPinia())
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Preset,
    options: {
      darkModeSelector: false,
    },
  },
})
app.use(router)
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
