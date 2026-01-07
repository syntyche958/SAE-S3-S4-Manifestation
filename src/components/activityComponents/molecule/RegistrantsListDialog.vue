<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    header="Utilisateurs inscrits"
    :style="{ width: '50vw' }"
  >
    <div v-if="loading" class="flex justify-center">
      <i class="pi pi-spin pi-spinner text-2xl"></i>
    </div>
    <div v-else-if="registrants.length === 0">
      <p>Aucun inscrit pour cette session.</p>
    </div>
    <div v-else>
      <ul class="list-none p-0 m-0">
        <li v-for="user in registrants" :key="user.id" class="p-3 border-b surface-border flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            <span>{{ user.mail }}</span>
        </li>
      </ul>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'

defineProps({
  visible: Boolean,
  loading: Boolean,
  registrants: Array
})

defineEmits(['update:visible'])
</script>
