

<template>
  <div
    v-for="session in sessions"
    :key="session.id"
    class="p-3 mb-4 border rounded-lg flex justify-between items-center"
  >
    <div class="flex flex-col gap-1">
      <div><b>Date :</b> <InputText v-model="session.beginingDate" /></div>
      <div><b>Heure :</b> <InputText v-model="session.beginingHour" /></div>
      <div><b>Durée :</b> <InputNumber v-model="session.duration" /></div>
      <div><b>Places :</b> <InputNumber v-model="session.nbPlace" /></div>
    </div>

    <Button
      label="Supprimer"
      icon="pi pi-trash"
      severity="danger"
    />
  </div>

</template>

<script setup>
import { useRoute } from 'vue-router'
import { useSessionStore } from '@/stores/sessions.js'
import { computed, onMounted } from 'vue'

const route = useRoute()
const sessionStore = useSessionStore()

const activityId = computed(() => Number.parseInt(route.params.activity_id))
const sessions = computed(() => sessionStore.sessions)

onMounted(async () => {
  await sessionStore.getSessionsByActivityId(activityId.value)
})


</script>
