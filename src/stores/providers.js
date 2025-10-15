import { ref } from 'vue'
import { defineStore } from 'pinia'

import ProviderService from '@/services/provider.service'

export const useProviderStore = defineStore('provider', () => {
  const providers = ref([])
  const providerImages = ref([])
  const newProviders = ref([])

  async function getAllProviders() {
    let response = await ProviderService.getAllProviders()
    if (response.error == 0) {
      providers.value = response.data
    } else {
      console.log(response.data)
    }
  }

  async function getProviderImages(id) {
    let response = await ProviderService.getProviderImages(id)
    if (response.error == 0) {
      providerImages.value = response.data.images
    } else {
      console.log(response.data)
    }
  }

  async function getAllNewProviders() {
    let response = await ProviderService.getAllNewProviders()
    if (response.error == 0) {
      newProviders.value = response.data
    } else {
      console.log(response.data)
    }
  }

  return {
    providers,
    providerImages,
    getAllProviders,
    getAllNewProviders,
    getProviderImages,
  }
})
