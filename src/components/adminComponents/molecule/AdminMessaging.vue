<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-2xl font-bold">{{ $t('Messages des avis') }}</h2>

    <div v-if="surveyStore.surveys.length === 0" class="text-center py-8 text-gray-500">
      <i class="pi pi-inbox text-4xl mb-2"></i>
      <p>{{ $t("Aucun avis pour le moment.") }}</p>
    </div>

    <div v-else class="flex flex-col gap-3">
      <Card v-for="survey in sortedSurveys" :key="survey.id" class="shadow-md" :class="{'opacity-60': survey.isDeleted}">
        <template #header>
          <div class="flex justify-between items-center px-4 pt-4">
            <div class="flex items-center gap-3">
              <Avatar :label="getInitials(survey.name)" shape="circle" size="large" />
              <div>
                <p class="font-semibold text-lg">{{ survey.name || $t('Anonyme') }}</p>

                <!--Pour voir si il a repondu: essaie -->
                <Badge
                  v-if="survey.adminResponse"
                  value="Repondu"
                  severity="warning"
                  icon="pi pi-exclamation-circle"
                />
              </div>
              <p class="text-sm text-gray-500">{{ formatDate(survey.createdAt) }}</p>
            </div>
            <div class="flex items-center gap-2">
              <Rating :modelValue="survey.rating" readonly :cancel="false" />
              <Badge
                :value="getRecommendLabel(survey.recommend)"
                :severity="getRecommendSeverity(survey.recommend)"
              />
            </div>
          </div>
        </template>

        <template #content>
          <!-- Ratings détaillés -->
          <div class="grid grid-cols-3 gap-4 mb-4 pb-4 border-b">
            <div class="flex flex-col items-center">
              <span class="text-sm text-gray-600 mb-1">{{ $t('Organisation') }}</span>
              <Rating :modelValue="survey.ratings.organisation" readonly :cancel="false" size="small" />
            </div>
            <div class="flex flex-col items-center">
              <span class="text-sm text-gray-600 mb-1">{{ $t('Animations') }}</span>
              <Rating :modelValue="survey.ratings.animations" readonly :cancel="false" size="small" />
            </div>
            <div class="flex flex-col items-center">
              <span class="text-sm text-gray-600 mb-1">{{ $t('Accesibilité') }}</span>
              <Rating :modelValue="survey.ratings.accessibility" readonly :cancel="false" size="small" />
            </div>
          </div>

          <!-- Activités suivies -->
          <div v-if="survey.activities && survey.activities.length > 0" class="mb-4">
            <p class="text-sm font-semibold mb-2">{{ $t('Activités suivies') }} :</p>
            <div class="flex gap-2 flex-wrap">
              <Chip v-for="act in survey.activities" :key="act" :label="act" />
            </div>
          </div>

          <!-- Commentaire -->
          <div v-if="survey.comment" class="mb-4 p-3 bg-gray-50 rounded">
            <p class="text-sm font-semibold mb-1">{{ $t('Commentaire') }} :</p>
            <p class="whitespace-pre-wrap">{{ survey.comment }}</p>
          </div>

          <!-- Email si fourni -->
          <div v-if="survey.email" class="mb-4">
            <p class="text-sm text-gray-600">
              <i class="pi pi-envelope mr-2"></i>{{ survey.email }}
            </p>
          </div>

          <!-- Réponse de l'admin -->
          <div v-if="survey.adminResponse" class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500">
            <p class="text-sm font-semibold mb-1">
              <i class="pi pi-reply mr-2"></i>{{ $t('Votre réponse') }}
            </p>
            <p class="whitespace-pre-wrap">{{ survey.adminResponse }}</p>
          </div>

          <div class="flex gap-2 mt-4 pt-4 border-t">
            <Button
              :label="$t('Répondre')"
              icon="pi pi-reply"
              @click="openResponseDialog(survey)"
              severity="primary"
              text
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Dialog pour répondre -->
    <Dialog
      v-model:visible="responseDialogVisible"
      :header="$t('Repondre à l\'avis')"
      :style="{ width: '600px' }"
      :modal="true"
    >
      <div class="flex flex-col gap-4">
        <Textarea
          v-model="responseText"
          :placeholder="$t('Écrivez votre réponse')"
          rows="5"
          class="w-full"
        />
        <div class="flex justify-end gap-2">
          <Button
            :label="$t('Annuler')"
            severity="secondary"
            @click="responseDialogVisible = false"
          />
          <Button :label="$t('Envoyer')" @click="submitResponse" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSurveyStore } from '@/stores/surveys'
import Card from 'primevue/card'
import Rating from 'primevue/rating'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import Chip from 'primevue/chip'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import { useI18n } from 'vue-i18n'
import { messages } from '@/datasource/lang'
import { icon } from 'leaflet'

const { t } = useI18n()
const surveyStore = useSurveyStore()

const responseDialogVisible = ref(false)
const responseText = ref('')
const selectedSurvey = ref(null)

const sortedSurveys = computed(() => {
  return [...surveyStore.surveys].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
})

function getInitials(name) {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name[0].toUpperCase()
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getRecommendLabel(recommend) {
  switch (recommend) {
    case 'yes':
      return t('Oui')
    case 'no':
      return t('Non')
    case 'maybe':
      return t('Peut-etre')
    default:
      return '-'
  }
}

function getRecommendSeverity(recommend) {
  switch (recommend) {
    case 'yes':
      return 'success'
    case 'no':
      return 'danger'
    case 'maybe':
      return 'warn'
    default:
      return 'secondary'
  }
}

function openResponseDialog(survey) {
  selectedSurvey.value = survey
  responseText.value = survey.adminResponse || ''
  responseDialogVisible.value = true
}

async function submitResponse() {
  if (!responseText.value.trim()) return

  await surveyStore.addAdminResponse(selectedSurvey.value.id, responseText.value)
  responseDialogVisible.value = false
  responseText.value = ''
  selectedSurvey.value = null
}
</script>
