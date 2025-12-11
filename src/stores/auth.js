import { ref } from 'vue'
import { defineStore } from 'pinia'

import AuthService from '@/services/auth.service'
import { UserTypeEnum } from '@/enums/User.enum.js'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
//import { useI18n } from 'vue-i18n'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const user = ref()

  function getUser() {
    return user.value
  }

  async function login(mail, password) {
    let response = await AuthService.login(mail, password)
    if (response.error === 0) {
      user.value = response.data
      displaySuccessToast('Connecté avec succés')
      return true
    } else {
      console.log(response.data)
      displayErrToast("Echec de l'authentification")
      return false
    }
  }

  function logout() {
    user.value = { type: UserTypeEnum.VISITOR }
  }

  return {
    user,
    getUser,
    login,
    logout,
  }
})
