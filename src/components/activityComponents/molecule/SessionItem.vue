<template>
  <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4">
    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
      <div class="flex flex-row md:flex-col justify-between items-start gap-2">
        <div>
          <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
            {{ formatSessionDate(item.beginingDate) }} {{ item.beginingHour }}
          </span>
          <div class="text-sm text-surface-600 mt-1">{{ $t('message.duration') }}: {{ item.duration }} {{ $t('message.minutes') }}</div>
          <div class="text-sm text-surface-600 mt-1">
            {{ $t('message.places') }}: {{ item.nbPlace - item.registersUsers.length }} / {{ item.nbPlace }}
          </div>
        </div>
      </div>
      <div class="flex flex-col md:items-end gap-8">
        <div v-if="canRegister" class="flex flex-row-reverse md:flex-row gap-2">
          <Button
            v-if="isCurrentProviderOwner && canShowRegistrants"
            icon="pi pi-users"
            :label="$t('message.seeRegistrants')"
            severity="info"
            outlined
            @click="$emit('show-registrants', item)"
            class="flex-auto md:flex-initial whitespace-nowrap"
          />
          <Button
            :icon="isRegistered ? 'pi pi-check' : 'pi pi-user-plus'"
            :label="isRegistered ? $t('message.alreadyRegistered') : $t('message.signUp')"
            @click="$emit('inscription', item)"
            :disabled="
              item.nbPlace <= item.registersUsers.length || isRegistered || !isUserConnected
            "
            :severity="isRegistered ? 'success' : 'primary'"
            class="flex-auto md:flex-initial whitespace-nowrap"
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const props = defineProps({
  item: Object,
  isCurrentProviderOwner: Boolean,
  isRegistered: Boolean,
  isUserConnected: Boolean,
  canRegister: Boolean,
  canShowRegistrants: Boolean,
})

defineEmits(['inscription', 'show-registrants'])

function formatSessionDate(dateStr) {
  const [year, month, day] = String(dateStr || '').split('-').map(Number)
  if (!year || !month || !day) return dateStr

  const date = new Date(year, month - 1, day)
  const dateLocale = locale.value === 'fr' ? 'fr-FR' : 'en-US'
  const formattedDate = date.toLocaleDateString(dateLocale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}
</script>
