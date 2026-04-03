<template>
  <div v-if="currentActivity">
    <p class="m-0">
      {{ currentActivity.description }}
    </p>

    <div v-if="isVisitor && currentActivity.ratings" class="mt-6 flex align-items-center gap-3">
      <span class="font-bold text-xl">{{ $t('message.rateActivity') }}</span>
      <Rating v-model="userRating" :cancel="false" @change="onRatingChange" />
    </div>

    <Card v-if="currentActivity?.sessionsEnabled ?? true" class="mt-8">
      <template #content>
        <DataView :value="sessions" :sortOrder="triOrder" :sortField="triField">
          <template #header>
            <Select
              v-model="triKey"
              :options="triOptions"
              optionLabel="label"
              :placeholder="$t('message.sortSessions')"
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
                    :can-show-registrants="canShowRegistrants"
                    @inscription="inscription"
                    @show-registrants="showRegistrants"
                  />
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </template>
    </Card>

    <Card v-if="currentActivity?.commentsEnabled ?? true" class="mt-8">
      <template #title>
        <div class="text-xl font-bold">{{ $t('message.comments') }}</div>
      </template>
      <template #content>
        <div
          v-if="currentActivity.comments && currentActivity.comments.length > 0"
          class="flex flex-col gap-4 mb-6"
        >
          <div
            v-for="(comment, index) in currentActivity.comments"
            :key="index"
            class="p-4 surface-100 rounded-xl border border-surface-200/20"
          >
            <div class="font-bold text-lg mb-1">{{ comment.title }}</div>
            <div class="text-surface-300">{{ comment.content }}</div>

            <div
              v-if="comment.reply"
              class="mt-4 p-4 bg-emerald-950/20 rounded-lg border-l-4 border-emerald-500"
            >
              <div class="font-bold text-sm text-emerald-400 mb-1">
                {{ $t('message.providerAdminReply') }}
              </div>
              <div class="text-surface-300 text-sm">{{ comment.reply }}</div>
            </div>

            <div
              v-else-if="canReplyToComment"
              class="mt-4 flex flex-col gap-2 border-t border-surface-200/20 pt-4"
            >
              <span class="font-bold text-sm text-surface-200">{{ $t('message.replyToComment') }}</span>
              <Textarea
                v-model="commentReplies[index]"
                rows="2"
                :placeholder="$t('message.yourReply')"
                class="w-full text-sm"
              />
              <Button
                :label="$t('message.sendReply')"
                size="small"
                @click="submitReply(index)"
                :disabled="!commentReplies[index] || !commentReplies[index].trim()"
                class="w-fit"
              />
            </div>
          </div>
        </div>
        <div v-else class="text-surface-500 italic mb-6">
          {{ $t('message.noComments') }}
        </div>

        <div v-if="isVisitor" class="flex flex-col gap-3 border-t border-surface-200/20 pt-6">
          <span class="font-bold text-lg">{{ $t('message.addComment') }}</span>
          <InputText
            v-model="newComment.title"
            :placeholder="$t('message.commentTitle')"
            class="w-full"
          />
          <Textarea
            v-model="newComment.content"
            rows="4"
            :placeholder="$t('message.yourComment')"
            class="w-full"
          />
          <Button
            :label="$t('message.publishComment')"
            @click="submitComment"
            :disabled="!newComment.title.trim() || !newComment.content.trim()"
            class="w-fit mt-2"
          />
        </div>
      </template>
    </Card>
  </div>

  <RegistrantsListDialog
    v-model:visible="displayRegistrantsDialog"
    :loading="loadingRegistrants"
    :registrants="registrantsList"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { DataView, Select, Card, Rating, InputText, Textarea, Button } from 'primevue'
import { useI18n } from 'vue-i18n'
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
import { useRegistrationStore } from '@/stores/registration'

const { t } = useI18n()
const route = useRoute()
const activityStore = useActivityStore()
const sessionsStore = useSessionStore()
const authStore = useAuthStore()
const providerStore = useProviderStore()
const registrationStore = useRegistrationStore()

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
  const activityId = Number.parseInt(route.params.activity_id, 10)
  if (!Number.isFinite(activityId) || !sessionsStore.sessions) return []
  return sessionsStore.sessions.filter((s) => Number(s.activityId) === activityId)
})

const triKey = ref()
const triOrder = ref()
const triField = ref()
const selectedSession = ref(null) // the session which have been clicked to register

const triOptions = ref([
  { label: t('message.dateAsc'), nom: 'beginingDate' },
  { label: t('message.dateDesc'), nom: '!beginingDate' },
])

const currentActivity = computed(() => {
  const activityId = Number.parseInt(route.params.activity_id, 10)
  if (!Number.isFinite(activityId)) return undefined
  return activityStore.activities.find((activite) => Number(activite.id) === activityId)
})

const isVisitor = computed(() => {
  return authStore.user?.type === UserTypeEnum.VISITOR
})

const isAdmin = computed(() => {
  return authStore.user?.type === UserTypeEnum.ADMIN
})

const isCurrentProviderOwner = computed(() => {
  if (authStore.user?.type !== UserTypeEnum.PROVIDER) return false

  const provider = providerStore.providers.find((p) => p.userId === authStore.user.id)
  return provider && provider.id === currentActivity.value?.providerId
})

const canReplyToComment = computed(() => {
  return isAdmin.value || isCurrentProviderOwner.value
})

const canShowRegistrants = computed(() => {
  return (
    (isAdmin.value || isCurrentProviderOwner.value) &&
    (currentActivity.value?.registrationCountEnabled ?? true)
  )
})


const userRating = ref(0)
watch(
  [currentActivity, currentUserId],
  ([newActivity, newUserId]) => {
    if (newActivity && newActivity.ratings && newUserId) {
      const existing = newActivity.ratings.find((r) => r.userId === newUserId)
      userRating.value = existing ? existing.note : 0
    } else {
      userRating.value = 0
    }
  },
  { immediate: true },
)

async function onRatingChange() {
  if (!currentUserId.value) return
  await activityStore.addRating(currentActivity.value.id, currentUserId.value, userRating.value)
}

const newComment = ref({ title: '', content: '' })

async function submitComment() {
  if (!currentUserId.value || !newComment.value.title.trim() || !newComment.value.content.trim())
    return

  await activityStore.addComment(
    currentActivity.value.id,
    currentUserId.value,
    newComment.value.title.trim(),
    newComment.value.content.trim(),
  )

  newComment.value.title = ''
  newComment.value.content = ''
}

const commentReplies = ref({})

async function submitReply(commentIndex) {
  const replyContent = commentReplies.value[commentIndex]
  if (!replyContent || !replyContent.trim()) return

  await activityStore.addCommentReply(currentActivity.value.id, commentIndex, replyContent.trim())

  commentReplies.value[commentIndex] = ''
}

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

      registrantsList.value = allUsers.filter((u) => session.registersUsers.includes(u.id))
    }
  } catch (e) {
    console.error(e)
    displayErrToast(t('message.loadRegistrantsError'))
  } finally {
    loadingRegistrants.value = false
  }
}

async function inscription(session) {
  selectedSession.value = session
  const placesRestantes = session.nbPlace - session.registersUsers.length

  if (placesRestantes <= 0) {
    displayErrToast(t('message.noMorePlaces'))
    return
  }

  if (!isUserConnected.value) {
    displayErrToast(t('message.mustBeConnected'))
    return
  }

  const userId = currentUserId.value

  if (isRegistered(session)) {
    displayErrToast(t('message.alreadyRegisteredSession'))
    return
  }

  const result = await registrationStore.addRegistration(session.id, userId)
  if (!result) {
    displayErrToast(t('message.registrationFailed'))
    return
  }

  await sessionsStore.getAllSessions()
  displaySuccessToast(t('message.registrationSuccess'))
}
</script>
