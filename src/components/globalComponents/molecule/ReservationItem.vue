<template>
  <div
    class="session-container flex flex-col sm:flex-row sm:items-center p-4 gap-3 rounded-border border"
  >
    <div class="flex-1">
      <div class="mb-2">
        <span class="font-bold text-lg">{{ activityName }}</span>
      </div>

      <div class="flex flex-col gap-1 text-sm text-secondary-info">
        <div class="flex items-center gap-2">
          <i class="pi pi-calendar"></i>
          <span>{{ formattedDate }}</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-clock"></i>
          <span>{{ item.beginingHour }} ({{ item.duration }} min)</span>
        </div>
      </div>
    </div>

    <div class="flex sm:flex-col gap-2 mt-2 sm:mt-0">
      <Button
        v-if="qrCode"
        icon="pi pi-qrcode"
        text
        rounded
        v-tooltip.top="$t('message.showQrCode')"
        @click="showQrCode = true"
      />
      <Button
        icon="pi pi-eye"
        text
        rounded
        v-tooltip.top="$t('message.seeActivity')"
        @click="$emit('go-to-activity', item.activityId)"
      />
    </div>
  </div>

  <Dialog
    v-model:visible="showQrCode"
    :header="$t('message.yourQrCode')"
    :style="{ width: '25rem', margin: '1rem' }"
    modal
    class="dark-dialog"
  >
    <div class="flex justify-center p-4">
      <img
        :src="`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrCode}`"
        :alt="$t('message.qrCodeAlt')"
        class="rounded-lg"
      />
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const props = defineProps({
  item: Object,
  activityName: String,
  qrCode: String,
})

const showQrCode = ref(false)

const formattedDate = computed(() => {
  if (!props.item?.beginingDate) return ''

  const date = new Date(`${props.item.beginingDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return props.item.beginingDate

  const localizedDate = new Intl.DateTimeFormat(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)

  return localizedDate.charAt(0).toUpperCase() + localizedDate.slice(1)
})

defineEmits(['go-to-activity'])
</script>

<style scoped>
.session-container {
  background-color: rgba(0, 0, 0, 0.4) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(250, 250, 250, 0.1) !important;
}

.text-secondary-info {
  color: rgba(250, 250, 250, 0.6) !important;
}

:deep(.p-button.p-button-text) {
  color: #fafafa !important;
}

:deep(.dark-dialog .p-dialog-header),
:deep(.dark-dialog .p-dialog-content) {
  background-color: #1a1a1a !important;
  color: #fafafa !important;
}
</style>
