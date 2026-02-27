import { ref } from 'vue'
import { defineStore } from 'pinia'

import AuthService from '@/services/auth.service'
import { UserTypeEnum } from '@/enums/User.enum.js'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
//import { useI18n } from 'vue-i18n'

export const useAuthStore = defineStore('auth', () => {
  const STORAGE_TOKEN_KEY = 'accessToken'
  const STORAGE_USER_KEY = 'user'

  // STATE
  const user = ref({ type: UserTypeEnum.NOTCONNECTED })
  const accessToken = ref(localStorage.getItem(STORAGE_TOKEN_KEY))

  function normalizeUser(rawUser) {
    if (!rawUser) return { type: UserTypeEnum.NOTCONNECTED }

    return {
      ...rawUser,
      id: rawUser.id || rawUser._id || null,
      mail: rawUser.mail || rawUser.email || '',
      type: rawUser.type || UserTypeEnum.VISITOR,
    }
  }

  function hydrateSession() {
    const storedUser = localStorage.getItem(STORAGE_USER_KEY)
    if (!storedUser) {
      if (!accessToken.value) user.value = { type: UserTypeEnum.NOTCONNECTED }
      return
    }

    try {
      user.value = normalizeUser(JSON.parse(storedUser))
    } catch {
      localStorage.removeItem(STORAGE_USER_KEY)
      user.value = { type: UserTypeEnum.NOTCONNECTED }
    }
  }

  function persistSession(rawUser, token = null) {
    const normalizedUser = normalizeUser(rawUser)
    user.value = normalizedUser
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(normalizedUser))

    if (token) {
      accessToken.value = token
      localStorage.setItem(STORAGE_TOKEN_KEY, token)
    }
  }

  function clearSession() {
    user.value = { type: UserTypeEnum.NOTCONNECTED }
    accessToken.value = null
    localStorage.removeItem(STORAGE_USER_KEY)
    localStorage.removeItem(STORAGE_TOKEN_KEY)
  }

  async function getUser() {
    hydrateSession()
    return user.value
  }

  async function login(mail, password) {
    let response = await AuthService.login(mail, password)
    if (response.error === 0) {
      persistSession(response.data)
      displaySuccessToast('Connecté avec succés')
      return true
    } else {
      console.log(response.data)
      displayErrToast("Echec de l'authentification")
      return false
    }
  }

  async function signin(mail, password) {
    let response = await AuthService.signin(mail, password)
    console.log(response)
    if (response.error === 0) {
      persistSession(response.data)
      displaySuccessToast('Connecté avec succés')
      return true
    } else {
      console.log(response.data)
      displayErrToast("Echec de l'enregistrement")
      return false
    }
  }

  function logout() {
    clearSession()
  }

  function loginWithGoogle() {
    AuthService.startGoogleOAuth()
  }

  async function handleOAuthCallback(search = window.location.search) {
    const { token, error, user: callbackUser } = AuthService.parseOAuthCallback(search)
    if (error || !token) {
      clearSession()
      displayErrToast("Echec de l'authentification Google")
      return { ok: false, error: error || 'missing_token' }
    }

    let resolvedUser = callbackUser
    if (!resolvedUser) {
      resolvedUser = await AuthService.getProfileFromApi(token)
    }

    if (!resolvedUser) {
      resolvedUser = { type: UserTypeEnum.VISITOR }
    }

    persistSession(resolvedUser, token)
    displaySuccessToast('Connecté avec Google')
    return { ok: true }
  }

  hydrateSession()

  return {
    user,
    accessToken,
    getUser,
    login,
    logout,
    signin,
    loginWithGoogle,
    handleOAuthCallback,
  }
})
