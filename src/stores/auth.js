import { ref } from 'vue'
import { defineStore } from 'pinia'

import AuthService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref()

  async function getUser() {
    let response = await AuthService.getUser()
    if (response.error == 0) {
      user.value = response.data[0]
    } else {
      console.log(response.data)
    }
  }

  return {
    user,
    getUser,
  }
})
