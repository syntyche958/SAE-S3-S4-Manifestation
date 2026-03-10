<template>
  <div
    class="session-container flex flex-col sm:flex-row sm:items-center p-4 gap-3 rounded-border border"
  >
    <div class="flex-1">
      <div class="flex items-center justify-between mb-2">
        <span class="font-bold text-lg">{{ activityName }}</span>
        <Tag :value="'Session #' + item.id" class="dark-tag"></Tag>
      </div>

      <div class="flex flex-col gap-1 text-sm text-secondary-info">
        <div class="flex items-center gap-2">
          <i class="pi pi-calendar"></i>
          <span>{{ item.beginingDate }}</span>
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
        v-tooltip.top="'Afficher le QR code'"
        @click="showQrCode = true"
      />
      <Button
        icon="pi pi-eye"
        text
        rounded
        v-tooltip.top="'Voir l\'activité'"
        @click="$emit('go-to-activity', item.activitiesId)"
      />
    </div>
  </div>

  <Dialog
    v-model:visible="showQrCode"
    header="Votre QR Code"
    :style="{ width: '25rem', margin: '1rem' }"
    modal
    class="dark-dialog"
  >
    <div class="flex justify-center p-4">
      <img
        :src="`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrCode}`"
        alt="QR Code de la session"
        class="rounded-lg"
      />
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'

defineProps({
  item: Object,
  activityName: String,
  qrCode: String,
})

const showQrCode = ref(false)

defineEmits(['go-to-activity'])
</script>

<style scoped>
/* Conteneur de la session : fond sombre et flou comme tes autres cartes */
.session-container {
  background-color: rgba(0, 0, 0, 0.4) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(250, 250, 250, 0.1) !important;
}

/* Correction du Tag : fond bleu foncé transparent pour que le texte blanc soit lisible */
:deep(.dark-tag) {
  background-color: rgba(59, 130, 246, 0.2) !important;
  color: #60a5fa !important; /* Bleu clair */
  border: 1px solid rgba(96, 165, 250, 0.5) !important;
}

/* Textes secondaires (date et heure) */
.text-secondary-info {
  color: rgba(250, 250, 250, 0.6) !important;
}

/* Forcer la couleur des icônes boutons */
:deep(.p-button.p-button-text) {
  color: #fafafa !important;
}

/* Style du Dialog pour rester dans le thème sombre */
:deep(.dark-dialog .p-dialog-header),
:deep(.dark-dialog .p-dialog-content) {
  background-color: #1a1a1a !important;
  color: #fafafa !important;
}
</style>
