<template>
  <Button
    :label="$t('message.giveFeedback')"
    icon="pi pi-star"
    @click="openModal"
    variant="outlined"
    severity="contrast"
    class="hover:scale-105 transition-transform duration-200"
    size="small"
  />

  <Dialog
    v-model:visible="visible"
    :header="$t('message.satisfactionForm')"
    :style="{ width: '650px' }"
    :modal="true"
    :draggable="false"
    class="satisfaction-dialog"
  >
    <div class="px-2 pb-4">
      <p class="text-surface-400 mb-6 text-sm">
        {{ $t('message.feedbackHero') }}
      </p>

      <form @submit.prevent="submit" class="flex flex-col gap-8">
        <div class="flex flex-col gap-6 p-4 rounded-xl bg-surface-50/50 border border-surface-100">
          <div class="flex flex-col sm:flex-row justify-between gap-6">
            <div class="flex-1">
              <label class="block font-bold text-white mb-2 flex items-center gap-2">
                <i class="pi pi-star-fill text-yellow-500"></i>
                {{ $t('message.globalRating') }} *
              </label>
              <Rating v-model="form.rating" :cancel="false" size="large" />
              <transition name="p-message">
                <small v-if="errors.rating" class="text-red-500 mt-1 block">{{
                  errors.rating
                }}</small>
              </transition>
            </div>

            <div class="flex-1">
              <label class="block font-bold text-white mb-3 flex items-center gap-2">
                <i class="pi pi-thumbs-up-fill text-emerald-500"></i>
                {{ $t('message.wouldRecommend') }}
              </label>
              <div class="flex gap-4 items-center">
                <div class="flex items-center gap-2">
                  <RadioButton inputId="rec-yes" v-model="form.recommend" value="yes" />
                  <label for="rec-yes" class="text-sm cursor-pointer">{{ $t('Oui') }}</label>
                </div>
                <div class="flex items-center gap-2">
                  <RadioButton inputId="rec-no" v-model="form.recommend" value="no" />
                  <label for="rec-no" class="text-sm cursor-pointer">{{ $t('Non') }}</label>
                </div>
                <div class="flex items-center gap-2">
                  <RadioButton inputId="rec-maybe" v-model="form.recommend" value="maybe" />
                  <label for="rec-maybe" class="text-sm cursor-pointer">{{
                    $t('message.maybe')
                  }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            class="flex flex-col gap-2 p-3 rounded-lg bg-surface-100/30 border border-surface-200/20"
          >
            <label class="text-sm font-semibold text-surface-200">{{
              $t('message.organisation')
            }}</label>
            <Rating v-model="form.ratings.organisation" :cancel="false" />
          </div>
          <div
            class="flex flex-col gap-2 p-3 rounded-lg bg-surface-100/30 border border-surface-200/20"
          >
            <label class="text-sm font-semibold text-surface-200">{{
              $t('message.animations')
            }}</label>
            <Rating v-model="form.ratings.animations" :cancel="false" />
          </div>
          <div
            class="flex flex-col gap-2 p-3 rounded-lg bg-surface-100/30 border border-surface-200/20"
          >
            <label class="text-sm font-semibold text-surface-200">{{
              $t('message.accessibility')
            }}</label>
            <Rating v-model="form.ratings.accessibility" :cancel="false" />
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <label class="font-bold text-white flex items-center gap-2">
            <i class="pi pi-ticket text-purple-500"></i>
            {{ $t('message.whichActivities') }}
          </label>
          <div
            class="flex gap-3 flex-wrap bg-surface-100/20 p-4 rounded-xl border border-dashed border-surface-400/50"
          >
            <div
              v-for="act in activitiesOptions"
              :key="act"
              class="flex items-center gap-2 bg-surface-200/10 px-3 py-2 rounded-full border border-surface-400/20 shadow-sm hover:border-emerald-500/50 transition-colors cursor-pointer group"
            >
              <Checkbox :inputId="act" :value="act" v-model="form.activities" />
              <label :for="act" class="text-sm cursor-pointer select-none text-white">{{
                act
              }}</label>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-bold text-white flex items-center gap-2">
            <i class="pi pi-comment text-blue-500"></i>
            {{ $t('message.commentSuggestions') }}
          </label>
          <Textarea
            v-model="form.comment"
            rows="4"
            autoResize
            class="w-full border-surface-200 focus:border-emerald-500 transition-colors"
            placeholder="Dites-nous tout..."
          />
          <transition name="p-message">
            <small v-if="errors.comment" class="text-red-500 mt-1 block">{{
              errors.comment
            }}</small>
          </transition>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-surface-500 uppercase ml-1">{{
              $t('message.nameOptional')
            }}</label>
            <InputText v-model="form.name" class="w-full" fluid />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-surface-500 uppercase ml-1">{{
              $t('message.emailOptional')
            }}</label>
            <InputText v-model="form.email" class="w-full" type="email" fluid />
          </div>
        </div>

        <div class="flex flex-col gap-2 mt-2">
          <div
            class="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/30 border border-emerald-100"
          >
            <Checkbox v-model="form.consent" :binary="true" inputId="consent" class="mt-0.5" />
            <label for="consent" class="text-xs text-surface-600 leading-relaxed cursor-pointer">
              {{ $t('message.consentText') }}
            </label>
          </div>
          <transition name="p-message">
            <small v-if="errors.consent" class="text-red-500 ml-1 block">{{
              errors.consent
            }}</small>
          </transition>
        </div>

        <div
          class="flex flex-col sm:flex-row justify-between items-center bg-surface-100/50 -mx-6 -mb-6 px-6 py-4 mt-4 border-t border-surface-200/20"
        >
          <p class="text-xs text-surface-400 mb-4 sm:mb-0 text-center sm:text-left">
            <i class="pi pi-heart-fill text-red-400 mr-1"></i>
            {{ $t('message.thankYouMessage') }}
          </p>
          <div class="flex gap-3 w-full sm:w-auto">
            <Button
              type="button"
              :label="$t('message.cancel')"
              severity="secondary"
              text
              @click="visible = false"
              class="flex-1 sm:flex-none"
            />
            <Button
              type="submit"
              :label="$t('message.send')"
              icon="pi pi-send"
              severity="emerald"
              class="flex-1 sm:flex-none px-8"
              v-ripple
            />
          </div>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import Rating from 'primevue/rating'
import { useSurveyStore } from '@/stores/surveys'

const surveyStore = useSurveyStore()
const visible = ref(false)
const openModal = () => (visible.value = true)

const activitiesOptions = ['Animations', 'Ateliers', 'Spectacles', 'Buvette/Restauration', 'Jeux']

const form = reactive({
  rating: 0,
  recommend: '',
  ratings: {
    organisation: 0,
    animations: 0,
    accessibility: 0,
  },
  activities: [],
  comment: '',
  name: '',
  email: '',
  consent: false,
})

const errors = reactive({})

function clearErrors() {
  Object.keys(errors).forEach((k) => delete errors[k])
}

function validate() {
  clearErrors()
  if (!form.rating || form.rating < 1) errors.rating = 'Veuillez donner une note globale.'
  if (!form.consent) errors.consent = 'Le consentement est requis.'
  if (form.comment && form.comment.length > 2000)
    errors.comment = 'Commentaire trop long (max 2000).'
  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return

  const payload = {
    rating: form.rating,
    recommend: form.recommend,
    ratings: { ...form.ratings },
    activities: [...form.activities],
    comment: form.comment,
    name: form.name,
    email: form.email,
    consent: form.consent,
    createdAt: new Date().toISOString(),
  }

  try {
    await surveyStore.addSurvey(payload)
    visible.value = false
    // reset form
    form.rating = 0
    form.recommend = ''
    form.ratings.organisation = 0
    form.ratings.animations = 0
    form.ratings.accessibility = 0
    form.activities = []
    form.comment = ''
    form.name = ''
    form.email = ''
    form.consent = false
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
.satisfaction-dialog :deep(.p-dialog-content) {
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.satisfaction-dialog :deep(.p-rating-icon) {
  width: 1.5rem;
  height: 1.5rem;
}

.satisfaction-dialog :deep(.p-rating-item-active .p-rating-icon) {
  color: var(--p-emerald-500);
}

.p-message-enter-active,
.p-message-leave-active {
  transition: all 0.2s ease;
}

.p-message-enter-from,
.p-message-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
