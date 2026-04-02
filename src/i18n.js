import { createI18n } from 'vue-i18n'
import { messages } from './datasource/lang'

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: messages,
})

export default i18n
