import { ref } from 'vue'
import { defineStore } from 'pinia'

import SurveyService from '@/services/survey.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import i18n from '@/i18n'

const { t } = i18n.global

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
      displaySuccessToast(t('message.feedbackRecorded'))
    } else {
      console.log(response.data)
      displayErrToast(t('message.feedbackRecordFailed'))
    }
  }

  async function addReaction(surveyId, amoji) {
    let response = await SurveyService.addReaction(surveyId, emoji)
    if (response.error === 0) {
      const surveyIndex = surveys.value.findIndex((s) => s.id === surveyId)
      if (surveyIndex !== -1) {
        surveys.value[surveyIndex] = response.data
      }
      displaySuccessToast(t('message.reactionAdded'))
    } else {
      console.log(response.data)
      displayErrToast(t('message.reactionAddFailed'))
    }
  }

  async function addAdminResponse(surveyId, responseText) {
    let response = await SurveyService.addAdminResponse(surveyId, responseText)
    if (response.error === 0) {
      const surveyIndex = surveys.value.findIndex((s) => s.id === surveyId)
      if (surveyIndex !== -1) {
        surveys.value[surveyIndex] = response.data
      }
      displaySuccessToast(t('message.responseSent'))
    } else {
      console.log(response.data)
      displayErrToast(t('message.responseSendFailed'))
    }
  }

  async function deleteSurvey(surveyId) {
    let response = await SurveyService.deleteSurvey()
    if (response.error === 0) {
      surveys.value = []
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
    addAdminResponse,
    deleteSurvey,
    clearSurveys,
  }
})
