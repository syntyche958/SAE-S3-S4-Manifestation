import LocalSource from '@/services/localsource.service.js'
import { useSurveyStore } from '@/stores/surveys'
import { networkErrResponse } from '@/utils/network.utils'

async function getAllSurveysFromLocalSource() {
  return LocalSource.getAllSurveys()
}

async function addSurveyToLocalSource(surveyData) {
  const surveyStore = useSurveyStore()

  let lastId = 0
  surveyStore.surveys.forEach((s) => {
    lastId = Math.max(lastId, s.id)
  })

  return {
    error: 0,
    status: 200,
    data: {
      ...surveyData,
      id: lastId + 1,
      createdAt: new Date().toISOString(),
    },
  }
}

async function addReactionToLocalSource(surveyId, emoji) {
  const surveyStore = useSurveyStore()
  const survey = surveyStore.surveys.find(s => s.id === surveyId)

  if(!survey) {
    return {error: 1, status:404, data: 'Survey not found'}
  }

  if (!survey.reactions) {
    survey.reactions = []
  }

  survey.reactions.push(emoji)

  return {
    error: 0,
    status: 200,
    data: {...survey},
  }
  
}

async function addAdminResponseToLocalSource(surveyId, responseText) {
  const surveyStore = useSurveyStore()
  const survey = surveyStore.surveys.find(s => s.id === surveyId)

  if(!survey) {
    return {error: 1, status:404, data: 'Survey not found'}
  }

  survey.adminResponse = responseText

  return {
    error: 0,
    status: 200,
    data: {...survey},
  }
  
}

async function clearSurveysFromLocalSource() {
  return { error: 0, status: 200, data: [] }
}

async function deleteSurveyFromLocalSource(surveyId) {
  const surveyStore = useSurveyStore()
  const surveyIndex = surveyStore.surveys.findIndex(s => s.id === surveyId)
  
  if (surveyIndex === -1) {
    return { error: 1, status: 404, data: 'Survey not found' }
  }

  surveyStore.surveys.splice(surveyIndex, 1)

  return {
    error: 0,
    status: 200,
    data: { success: true },
  }
}

async function getAllSurveys() {
  try {
    return await getAllSurveysFromLocalSource()
  } catch {
    return networkErrResponse
  }
}

async function addSurvey(surveyData) {
  try {
    return await addSurveyToLocalSource(surveyData)
  } catch {
    return networkErrResponse
  }
}

async function addReaction(surveyId,emoji) {
  try {
    return await addReactionToLocalSource(surveyId, emoji)
  } catch {
    return networkErrResponse
  }
}

async function addAdminResponse(surveyId,responseText) {
  try {
    return await addAdminResponseToLocalSource(surveyId, responseText)
  } catch {
    return networkErrResponse
  }
}

async function deleteSurvey(surveyId) {
   try {
    return await deleteSurveyFromLocalSource(surveyId)
  } catch {
    return networkErrResponse
  }
}

async function clearSurveys() {
  try {
    return await clearSurveysFromLocalSource()
  } catch {
    return networkErrResponse
  }
}

export default {
  getAllSurveys,
  addSurvey,
  addAdminResponse,
  deleteSurvey,
  clearSurveys,
}