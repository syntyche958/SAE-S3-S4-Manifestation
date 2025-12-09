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

async function clearSurveysFromLocalSource() {
  return { error: 0, status: 200, data: [] }
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
  clearSurveys,
}