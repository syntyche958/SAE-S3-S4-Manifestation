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

  async function addNewProvider(providerName, toast) {
    let response = await ProviderService.addNewProvider(providerName)
    if (response.error === 0) {
      // TODO : Quand le back-end sera en place, plutôt appeler getAllNewProviders() pour maj le store !
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: `Votre demande a été enregistré avec succès`,
        life: 3000,
      })
      newProviders.value.push(response.data)
    } else {
      toast.add({
        severity: 'error',
        summary: 'Échec',
        detail: `Échec de l'envoi de la demande, veuillez réessayer'`,
        life: 3000,
      })
      console.log(response.data)
    }
  }

  async function removeNewProvider(data, toast) {
    let response = await ProviderService.removeNewProvider(data.id)
    if (response.error === 0) {
      // TODO : Quand le back-end sera en place, appeler getAllNewProviders() pour maj le store !
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: `La demande de ${data.name} a été supprimé avec succès`,
        life: 3000,
      })
    } else {
      console.log(response.data)
      toast.add({
        severity: 'error',
        summary: 'Échec',
        detail: `Échec de la suppression de la demande de ${data.name}`,
        life: 3000,
      })
    }
  }

  return {
    providers,
    providerImages,
    newProviders,
    getAllProviders,
    getAllNewProviders,
    getProviderImages,
    addNewProvider,
    removeNewProvider,
  }
})
