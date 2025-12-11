import { ref } from 'vue'
import { defineStore } from 'pinia'

import AuthService from '@/services/auth.service'
import { UserTypeEnum } from '@/enums/User.enum.js'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
//import { useI18n } from 'vue-i18n'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const user = ref()

  // ACTION
  // async function getUser() {
  //   let response = await AuthService.getUser()
  //   if (response.error === 0) {
  //     user.value = response.data[0]
  //   } else {
  //     console.log(response.data)
  //   }
  // }

  function getUser() {
    return user.value
  }

  // TODO : temporaire
  // function login(_user) {
  //   user.value = _user
  // }
  // TODO : Afficher les toasts
  async function login(mail, password) {
    //const { t } = useI18n()

    let response = await AuthService.login(mail, password)
    if (response.error === 0) {
      user.value = response.data[0]
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
