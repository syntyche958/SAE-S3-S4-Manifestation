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
                      <div class="text-sm text-surface-600 mt-1">
                        Places: {{ item.nbPlace - item.registersUsers.length }} / {{ item.nbPlace }}
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col md:items-end gap-8">
                    <div
                      v-if="currentActivity?.canRegister"
                      class="flex flex-row-reverse md:flex-row gap-2"
                    >
                      <Button
                        :icon="isRegistered(item) ? 'pi pi-check' : 'pi pi-user-plus'"
                        :label="isRegistered(item) ? 'Déjà inscrit' : $t('message.signUp')"
                        @click="inscription(item)"
                        :disabled="item.nbPlace <= item.registersUsers.length || isRegistered(item) || !isUserConnected"
                        :severity="isRegistered(item) ? 'success' : 'primary'"
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
// import { useToast } from 'primevue/usetoast'
import { useActivityStore } from '@/stores/activities'
import { useSessionStore } from '@/stores/sessions.js'
import { useAuthStore } from '@/stores/auth'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils.js'
import { UserTypeEnum } from '@/enums/User.enum'

const route = useRoute()
const activityStore = useActivityStore()
const sessionsStore = useSessionStore()
const authStore = useAuthStore()
// const toast = useToast()

const currentUserId = computed(() => {
  return authStore.user?.id || 15 // garder le 15 en dur pour le momentmais le virer plus tard
})

const isUserConnected = computed(() => {
  return authStore.user?.type !== UserTypeEnum.NOTCONNECTED
})

function isRegistered(session) {
  return session.registersUsers.includes(currentUserId.value) || session.registersUsers.includes(15)
}

const sessions = computed(() => {
  const activityId = Number.parseInt(route.params.activity_id)
  if (!sessionsStore.sessions) return []
  return sessionsStore.sessions.filter((s) => s.activitiesId === activityId)
})

const triKey = ref()
const triOrder = ref()
const triField = ref()
const selectedSession = ref(null) // the session which have been clicked to register

const triOptions = ref([
  { label: 'Date croissante', nom: 'beginingDate' },
  { label: 'Date décroissante', nom: '!beginingDate' },
])

const currentActivity = computed(() => {
  const activityId = Number.parseInt(route.params.activity_id)
  return activityStore.activities.find((activite) => activite.id === activityId)
})

onMounted(async () => {
  if (!sessionsStore.sessions || sessionsStore.sessions.length === 0) {
    await sessionsStore.getAllSessions()
  }
})

const onSortChange = (event) => {
  const value = event.value.nom
  const triValue = event.value

  if (value.indexOf('!') === 0) {
    triOrder.value = -1
    triField.value = value.slice(1)
    triKey.value = triValue
  } else {
    triOrder.value = 1
    triField.value = value
    triKey.value = triValue
  }
}

async function inscription(session) {
  selectedSession.value = session // the good session
  const placesRestantes = session.nbPlace - session.registersUsers.length

  if (placesRestantes <= 0) {
    displayErrToast('Plus de places disponibles pour cette session')
    return
  }

  const userId = 15 // user connected id
  // TODO : Ne plus la mettre en dur

  if (isRegistered(session)) {
    displayErrToast('Vous êtes déjà inscrit à cette session')
    return
  }

  // copie l'ancien tableau et ajoute le nouvel user
  const updatedData = {
    registersUsers: session.registersUsers.concat(userId),
  }
  console.log(updatedData)
  await sessionsStore.updateSession(session.id, updatedData)

  // await sessionsStore.getAllSessions()
  // sessions.value = sessionsStore.sessions.filter((s) => s.activitiesId === currentActivity.value.id) // Removed: computed property handles this
  console.log()
  const nouvellesPlacesRestantes = session.nbPlace - (session.registersUsers.length + 1)

  displaySuccessToast(`Vous êtes inscrit à la session #${session.id}. Places restantes : ${nouvellesPlacesRestantes}/${session.nbPlace}`)
}
</script>
