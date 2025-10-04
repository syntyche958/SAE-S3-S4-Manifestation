import { ref } from 'vue'
import { defineStore } from 'pinia'

import ProviderService from '@/services/provider.service'

export const useProviderStore = defineStore('provider', () => {
  const providers = ref([])

  async function getAllProviders() {
    let response = await ProviderService.getAllProviders()
    if (response.error == 0) {
      providers.value = response.data
    } else {
      console.log(response.data)
    }
  }

  return {
    providers,
    getAllProviders,
  }
})
