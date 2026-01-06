<template>
  <Button
    :label="$t('message.giveFeedback')"
    icon="pi pi-star"
    @click="openModal"
    severity="secondary"
    style="min-width: 10rem"
    size="small"
  />

  <Dialog
    v-model:visible="visible"
    :header="$t('Formulaire de satisfaction')"
    :style="{ width: '1100px', height: '80vh' }"
    :modal="true"
    :draggable="false"
  >
    <form @submit.prevent="submit" class="flex flex-col gap-4 w-full">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="font-semibold">{{ $t('globalRating') }} *</label>
          <Rating v-model="form.rating" :cancel="false" />
          <Message v-if="errors.rating" severity="error" size="small" variant="simple">{{
            errors.rating
          }}</Message>
        </div>

        <div>
          <label class="font-semibold">{{ $t('wouldRecommend') }}</label>
          <div class="flex gap-4 items-center mt-2">
            <RadioButton inputId="rec-yes" v-model="form.recommend" value="yes" />
            <label for="rec-yes">{{ $t('Oui') }}</label>

            <RadioButton inputId="rec-no" v-model="form.recommend" value="no" />
            <label for="rec-no">{{ $t('Non') }}</label>

            <RadioButton inputId="rec-maybe" v-model="form.recommend" value="maybe" />
            <label for="rec-maybe">{{ $t('maybe') }}</label>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="font-semibold">{{ $t('Organisation') }}</label>
          <Rating v-model="form.ratings.organisation" :cancel="false" />
        </div>
        <div>
          <label class="font-semibold">{{ $t('Animations') }}</label>
          <Rating v-model="form.ratings.animations" :cancel="false" />
        </div>
        <div>
          <label class="font-semibold">{{ $t('Accesibilité') }}</label>
          <Rating v-model="form.ratings.accessibility" :cancel="false" />
        </div>
      </div>

      <div>
        <label class="font-semibold">{{ $t('whichActivities') }}</label>
        <div class="flex gap-3 flex-wrap mt-2">
          <div v-for="act in activitiesOptions" :key="act" class="flex items-center gap-2">
            <Checkbox :inputId="act" :value="act" v-model="form.activities" />
            <label :for="act">{{ act }}</label>
          </div>
        </div>
      </div>

      <div>
        <label class="font-semibold">{{ $t('commentSuggestions') }}</label>
        <Textarea v-model="form.comment" rows="4" />
        <Message v-if="errors.comment" severity="error" size="small" variant="simple">{{
          errors.comment
        }}</Message>
      </div>

      <div class="flex gap-2">
        <InputText v-model="form.name" :placeholder="$t('nameOptional')" />
        <InputText v-model="form.email" :placeholder="$t('emailOptional')" type="email" />
      </div>

      <div class="flex items-center gap-2">
        <Checkbox v-model="form.consent" :binary="true" inputId="consent" />
        <label for="consent">{{ $t('consentText') }}</label>
      </div>
      <Message v-if="errors.consent" severity="error" size="small" variant="simple">{{
        errors.consent
      }}</Message>

      <div class="flex justify-between items-center">
        <small class="text-sm text-600">{{ $t('thankYouMessage') }}</small>
        <div class="flex justify-end gap-2">
          <Button type="button" :label="$t('message.cancel')" severity="secondary" @click="visible = false" />
          <Button type="submit" :label="$t('message.send')" />
        </div>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Message from 'primevue/message'
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
/* petits ajustements pour la largeur / responsive */
.p-dialog .p-dialog-content {
  overflow: auto;
  height: 80px;
}
</style>