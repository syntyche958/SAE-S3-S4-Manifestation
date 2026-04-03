import { networkErrResponse } from '@/utils/network.utils'
import { deleteRequest, getRequest, postRequest } from './axios.service'

function mapSurvey(row) {
  if (!row || typeof row !== 'object') return row
  return {
    ...row,
    createdAt:
      typeof row.createdAt === 'string'
        ? row.createdAt
        : row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : row.createdAt,
  }
}

async function getAllSurveys() {
  try {
    const response = await getRequest('/surveys')
    if (response.error === 0 && Array.isArray(response.data)) {
      return { ...response, data: response.data.map(mapSurvey) }
    }
    return response
  } catch {
    return networkErrResponse
  }
}

async function addSurvey(surveyData) {
  try {
    const { rating, recommend, ratings, activities, comment, name, email, consent } = surveyData
    const body = {
      rating,
      recommend,
      ratings,
      activities,
      comment,
      name,
      email,
      consent,
    }
    const response = await postRequest('/surveys', body)
    if (response.error === 0 && response.data) {
      return { ...response, data: mapSurvey(response.data) }
    }
    return response
  } catch {
    return networkErrResponse
  }
}

async function addReaction(surveyId, emoji) {
  try {
    const response = await postRequest(`/surveys/${surveyId}/reactions`, { emoji })
    if (response.error === 0 && response.data) {
      return { ...response, data: mapSurvey(response.data) }
    }
    return response
  } catch {
    return networkErrResponse
  }
}

async function deleteSurvey(surveyId) {
  try {
    return await deleteRequest(`/surveys/${surveyId}`)
  } catch {
    return networkErrResponse
  }
}

async function clearSurveys() {
  try {
    return await deleteRequest('/surveys')
  } catch {
    return networkErrResponse
  }
}

export default {
  getAllSurveys,
  addSurvey,
  addReaction,
  deleteSurvey,
  clearSurveys,
}
