import { ref } from 'vue'
import { defineStore } from 'pinia'

import SurveyService from '@/services/survey.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'

export const useSurveyStore = defineStore('survey', () => {
  // STATE
  const surveys = ref([])

  // ACTIONS
  async function getAllSurveys() {
    let response = await SurveyService.getAllSurveys()
    if (response.error === 0) {
      surveys.value = response.data
    } else {
      console.log(response.data)
    }
  }

  async function addSurvey(surveyData) {
    let response = await SurveyService.addSurvey(surveyData)
    if (response.error === 0) {
      surveys.value.push(response.data)
      displaySuccessToast('Votre avis a bien été enregistré.')
    } else {
      console.log(response.data)
      displayErrToast("Impossible d'enregistrer votre avis.")
    }
  }

  async function clearSurveys() {
    let response = await SurveyService.clearSurveys()
    if (response.error === 0) {
      surveys.value = []
      displaySuccessToast('Tous les avis ont été supprimés.')
    } else {
      console.log(response.data)
      displayErrToast('Échec de la suppression des avis.')
    }
  }

  return {
    surveys,
    getAllSurveys,
    addSurvey,
    clearSurveys,
  }
})