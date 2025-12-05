const STORAGE_KEY = 'app_surveys'

export async function saveSurvey(survey) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  const entry = { ...survey, id: Date.now() }
  list.push(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return Promise.resolve(entry)
}

export function getAllSurveys() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

export function clearSurveys() {
  localStorage.removeItem(STORAGE_KEY)
}