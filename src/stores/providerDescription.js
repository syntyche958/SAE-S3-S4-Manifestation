import {ref} from 'vue'
import { defineStore } from 'pinia'

import ProviderService from '@/services/provider.service.js'

async function getProviderDescriptionFromService(idProvider) {
  let response = await ProviderService.getProviderDescription(idProvider)

  if (
    response &&
    response.error === 0 &&
    response.data &&
    response.data.id === idProvider &&
    response.data.description?.length
  ) {
    return response.data.description
  } else {
    return 'Entrez votre texte de presentation ici.'
  }
}

export const useDescriptionStore = defineStore('providerDescription', () => {
  const description = ref('')

  async function getProviderDescription(idProvider) {
    return await getProviderDescriptionFromService(idProvider)
  }

  async function updateProviderDescription(descriptionText) {
    description.value = descriptionText
  }

  return { description, getProviderDescription, updateProviderDescription }
})
