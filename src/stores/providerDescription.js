import {ref} from 'vue'
import { defineStore } from 'pinia'

import ProviderService from '@/services/provider.service.js'
export const useDescriptionStore = defineStore('providerDescription', () => {
  const description = ref("")

  async function getProviderDescriptionFromService(idProvider) {
    let response = await ProviderService.getProviderDescription(idProvider)

    if (
      response &&
      response.error === 0 &&
      response.data &&
      response.data.id === idProvider &&
      response.data.description?.length
    ) {
      description.value = response.data.description
      return description.value
    } else {
      description.value = "Entrez votre texte de presentation ici."
      return description.value
    }
  }

  async function updateProviderDescription(descriptionText) {
    description.value = descriptionText
  }

  return { description, getProviderDescriptionFromService, updateProviderDescription }
})
