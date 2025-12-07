<template>
  <div v-if="currentActivity">
    <div v-html="currentActivity.name"></div>
    <div v-html="currentActivity.presentationContent"></div>
    <div class="card" style="margin-top: 2rem" v-if="sessions && sessions.length > 0">
      <DataView :value="sessions" :sortOrder="triOrder" :sortField="triField">
        <template #header>
          <Select
            v-model="triKey"
            :options="triOptions"
            optionLabel="label"
            placeholder="Trier les sessions"
            @change="onSortChange($event)"
          />
        </template>

        <template #list="slotProps">
          <div class="flex flex-col">
            <div v-for="(item, index) in slotProps.items" :key="item.id">
              <div
                class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
              >
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                  <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                    <div>
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                        {{ item.beginingDate }} {{ item.beginingHour }}
                      </span>
                      <div class="text-lg font-medium mt-2">Session #{{ item.id }}</div>
                      <div class="text-sm text-surface-600 mt-1">
                        Durée: {{ item.duration }} minutes
                      </div>
                      <div class="text-sm text-surface-600 mt-1">Place: {{ item.nbPlace }}</div>
                    </div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <div
                      v-if="currentActivity?.canRegister"
                      class="flex flex-row-reverse md:flex-row gap-2"
                    >
                      <Button
                        icon="pi pi-user-plus"
                        :label="$t('message.signUp')"
                        @click="inscription(item)"
                        class="flex-auto md:flex-initial whitespace-nowrap"
                      ></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Button, DataView, Select } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { useActivityStore } from '@/stores/activities'
import { useSessionStore } from '@/stores/sessions.js'

const route = useRoute()
const activityStore = useActivityStore()
const sessionsStore = useSessionStore()
const toast = useToast()

const sessions = ref()
const triKey = ref()
const triOrder = ref()
const triField = ref()

const triOptions = ref([
  { label: 'Date croissante', nom: 'beginingDate' },
  { label: 'Date décroissante', nom: '!beginingDate' },
])

const currentActivity = computed(() => {
  const activityId = Number.parseInt(route.params.activity_id)
  return activityStore.activities.find((activite) => activite.id === activityId)
})

onMounted(async () => {
  await sessionsStore.getAllSessions()
  const activityId = Number.parseInt(route.params.activity_id)
  sessions.value = sessionsStore.sessions.filter((s) => s.activitiesId === activityId)
})

const onSortChange = (event) => {
  const value = event.value.nom
  const triValue = event.value

  if (value.indexOf('!') === 0) {
    triOrder.value = -1
    triField.value = value.slice(1) // enleve le 1er caractere (plus moderne que substring)
    triKey.value = triValue
  } else {
    triOrder.value = 1
    triField.value = value
    triKey.value = triValue
  }
}

function inscription(session) {
  toast.add({
    severity: 'success',
    summary: 'Inscription réussie',
    detail: `Vous êtes désormais inscrit à la séance numéro ${session.id}`,
    life: 3000, // 3sec
  })
}
</script>
