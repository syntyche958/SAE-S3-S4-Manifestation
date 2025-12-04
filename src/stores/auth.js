import { ref } from 'vue'
import { defineStore } from 'pinia'

import AuthService from '@/services/auth.service'
import { UserTypeEnum } from '@/enums/User.enum.js'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const user = ref()

  // ACTION
  async function getUser() {
    let response = await AuthService.getUser()
    if (response.error === 0) {
      user.value = response.data[0]
    } else {
      console.log(response.data)
    }
  }

  // TODO : temporaire
  function login(_user){
    user.value = _user;
  }

  function logout() {
    user.value = { type: UserTypeEnum.VISITOR };
  }

  return {
    user,
    getUser,
    login,
    logout,
  }
})
