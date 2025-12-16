import { ref } from 'vue'
import { defineStore } from 'pinia'

import SurveyService from '@/services/survey.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'

export const useSurveyStore = defineStore('survey', () => {

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

  async function addReaction(surveyId,amoji){
    let response = await SurveyService.addReaction(surveyId, emoji)
    if (response.error === 0) {
      const surveyIndex = surveys.value.findIndex(s => s.id === surveyId)
      if (surveyIndex !== -1) {
        surveys.value[surveyIndex] = response.data
      }
      displaySuccessToast('Réaction ajoutée')
    }else {
      console.log(response.data)
      displayErrToast("Impossible d'ajouter la réaction")
    }
  }

  async function addAdminResponse(surveyId, responseText) {
    let response = await SurveyService.addAdminResponse(surveyId, responseText)
    if (response.error === 0) {
      const surveyIndex = surveys.value.findIndex(s => s.id === surveyId)
      if (surveyIndex !== -1) {
        surveys.value[surveyIndex] = response.data
      }
      displaySuccessToast('Reponse envoyée')
    }else {
      console.log(response.data)
      displayErrToast("Impossible d'envoyer la reponse")
    }
    
  }

  async function deleteSurvey(surveyId) {
    let response = await SurveyService.deleteSurvey()
    if (response.error === 0) {
      surveys.value = []
      displaySuccessToast('Message supprimé')
    } else {
      console.log(response.data)
      displayErrToast('Impossible de supprimer le message')
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
    addReaction,
    addAdminResponse,
    deleteSurvey,
    clearSurveys,
  }
})