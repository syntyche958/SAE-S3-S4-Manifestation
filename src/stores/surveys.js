import { ref } from 'vue'
import { defineStore } from 'pinia'

import SurveyService from '@/services/survey.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import i18n from '@/i18n'

const { t } = i18n.global

export const useSurveyStore = defineStore('survey', () => {
  const surveys = ref([])

  async function getAllSurveys() {
    let response = await SurveyService.getAllSurveys()
    if (response.error === 0 && Array.isArray(response.data)) {
      surveys.value = response.data
    } else {
      console.log(response.data)
    }
  }

  async function addSurvey(surveyData) {
    let response = await SurveyService.addSurvey(surveyData)
    if (response.error === 0) {
      await getAllSurveys()
      displaySuccessToast(t('message.feedbackRecorded'))
    } else {
      console.log(response.data)
      displayErrToast(t('message.feedbackRecordFailed'))
    }
  }

  async function addReaction(surveyId, emoji) {
    let response = await SurveyService.addReaction(surveyId, emoji)
    if (response.error === 0) {
      await getAllSurveys()
      displaySuccessToast(t('message.reactionAdded'))
    } else {
      console.log(response.data)
      displayErrToast(t('message.reactionAddFailed'))
    }
  }

  async function deleteSurvey(surveyId) {
    let response = await SurveyService.deleteSurvey(surveyId)
    if (response.error === 0) {
      await getAllSurveys()
      displaySuccessToast(t('message.messageDeleted'))
    } else {
      console.log(response.data)
      displayErrToast(t('message.messageDeleteFailed'))
    }
  }

  async function clearSurveys() {
    let response = await SurveyService.clearSurveys()
    if (response.error === 0) {
      surveys.value = []
      displaySuccessToast(t('message.allFeedbackDeleted'))
    } else {
      console.log(response.data)
      displayErrToast(t('message.allFeedbackDeleteFailed'))
    }
  }

  return {
    surveys,
    getAllSurveys,
    addSurvey,
    addReaction,
    deleteSurvey,
    clearSurveys,
  }
})
