import LocalSource from '@/services/localsource.service.js'
import { postRequest, putRequest, getRequest } from './axios.service'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function buildApiUrl(path) {
  return `${API_URL}${path}`
}

// async function loginFromLocalSource(mail, password) {
//   return LocalSource.login(mail, password)
// }

// async function signinFromLocalSource(mail, password) {
//   return LocalSource.signin(mail, password)
// }

// async function updateUserTypeToProviderFromLocalSource(userId) {
//   return LocalSource.updateUserTypeToProvider(userId)
// }

async function login(mail, password) {
  let response = null
  try {
    response = await postRequest('/auth/login', { mail, password })
  } catch {
    return { error: 1, status: 400, data: 'A network error occured : ' }
  }
  return response
}

async function signin(mail, password) {
  let response = null
  try {
    response = await postRequest('/auth/register', { mail, password })
  } catch {
    return { error: 1, status: 400, data: 'A network error occured : ' }
  }
  return response
}

async function updateUserTypeToProvider(userId) {
  let response = null
  try {
    response = await putRequest('/auth/user-type', { userId })
  } catch {
    return { error: 1, status: 400, data: 'A network error occured : ' }
  }
  return response
}

async function getUsers() {
  let response = null
  try {
    response = await getRequest('/auth/users')
  } catch {
    return { error: 1, status: 400, data: 'A network error occured : ' }
  }
  return response
}

function startGoogleOAuth() {
  window.location.href = buildApiUrl('/auth/google')
}

function parseOAuthCallback(search = window.location.search) {
  const params = new URLSearchParams(search)
  const token = params.get('token')
  const error = params.get('error')
  const encodedUser = params.get('user')

  let user = null
  if (encodedUser) {
    try {
      user = JSON.parse(decodeURIComponent(encodedUser))
    } catch {
      user = null
    }
  }

  return { token, error, user }
}

async function getProfileFromApi(token) {
  try {
    const response = await fetch(buildApiUrl('/auth/profile'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) return null
    const data = await response.json()
    return data?.user || data || null
  } catch {
    return null
  }
}

export default {
  login,
  signin,
  getUsers,
  updateUserTypeToProvider,
  startGoogleOAuth,
  parseOAuthCallback,
  getProfileFromApi,
}
