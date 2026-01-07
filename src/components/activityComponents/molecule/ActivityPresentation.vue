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
               <SessionItem 
                 :item="item"
                 :is-current-provider-owner="isCurrentProviderOwner"
                 :is-registered="isRegistered(item)"
                 :is-user-connected="isUserConnected"
                 :can-register="currentActivity?.canRegister"
                 @inscription="inscription"
                 @show-registrants="showRegistrants"
               />
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>

  <RegistrantsListDialog 
    v-model:visible="displayRegistrantsDialog"
    :loading="loadingRegistrants"
    :registrants="registrantsList"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Button, DataView, Select } from 'primevue'
import AuthService from '@/services/auth.service'
import SessionItem from '@/components/activityComponents/molecule/SessionItem.vue'
import RegistrantsListDialog from '@/components/activityComponents/molecule/RegistrantsListDialog.vue'
// import { useToast } from 'primevue/usetoast'
import { useActivityStore } from '@/stores/activities'
import { useSessionStore } from '@/stores/sessions.js'
import { useAuthStore } from '@/stores/auth'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils.js'
import { UserTypeEnum } from '@/enums/User.enum'
import { useProviderStore } from '@/stores/providers'

const route = useRoute()
const activityStore = useActivityStore()
const sessionsStore = useSessionStore()
const authStore = useAuthStore()
const providerStore = useProviderStore()
// const toast = useToast()

const currentUserId = computed(() => {
  return authStore.user?.id
})

const isUserConnected = computed(() => {
  return authStore.user?.type !== UserTypeEnum.NOTCONNECTED
})

function isRegistered(session) {
  return session.registersUsers.includes(currentUserId.value)
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
  if (!providerStore.providers || providerStore.providers.length === 0) {
    await providerStore.getAllProviders()
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

  const displayRegistrantsDialog = ref(false)
  const loadingRegistrants = ref(false)
  const registrantsList = ref([])


  async function showRegistrants(session) {
      displayRegistrantsDialog.value = true
      loadingRegistrants.value = true
      registrantsList.value = []

      try {
          const response = await AuthService.getUsers()
          if (response.error === 0) {
              const allUsers = response.data

              registrantsList.value = allUsers.filter(u => session.registersUsers.includes(u.id))
          }
      } catch (e) {
          console.error(e)
          displayErrToast('Erreur lors du chargement des inscrits')
      } finally {
          loadingRegistrants.value = false
      }
  }

  const isCurrentProviderOwner = computed(() => {
      if (authStore.user?.type !== UserTypeEnum.PROVIDER) return false

      const provider = providerStore.providers.find(p => p.userId === authStore.user.id)
      return provider && provider.id === currentActivity.value?.providerId
  })

async function inscription(session) {
  selectedSession.value = session
  const placesRestantes = session.nbPlace - session.registersUsers.length

  if (placesRestantes <= 0) {
    displayErrToast('Plus de places disponibles pour cette session')
    return
  }

  if (!isUserConnected.value) {
    displayErrToast('Vous devez être connecté pour vous inscrire')
    return
  }

  const userId = currentUserId.value

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


  const nouvellesPlacesRestantes = session.nbPlace - (session.registersUsers.length + 1)

  displaySuccessToast(`Vous êtes inscrit à la session #${session.id}. Places restantes : ${nouvellesPlacesRestantes}/${session.nbPlace}`)
}
</script>
