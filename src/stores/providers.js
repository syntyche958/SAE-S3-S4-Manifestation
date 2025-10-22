import { ref } from 'vue'
import { defineStore } from 'pinia'

import ProviderService from '@/services/provider.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'

export const useProviderStore = defineStore('provider', () => {
  // STATE
  const providers = ref([])
  const providerImages = ref([])
  const newProviders = ref([])

  // ACTIONS
  async function getAllProviders() {
    let response = await ProviderService.getAllProviders()
    if (response.error === 0) {
      providers.value = response.data
    } else {
      console.log(response.data)
    }
  }

  async function getProviderImages(idProvider) {
    let response = await ProviderService.getProviderImages(idProvider)
    if (response.error === 0) {
      providerImages.value = response.data.images
    } else {
      console.log(response.data)
    }
  }

  async function getAllNewProviders() {
    let response = await ProviderService.getAllNewProviders()
    if (response.error === 0) {
      newProviders.value = response.data
    } else {
      console.log(response.data)
    }
  }

  async function addNewProvider(providerName, providerDesc) {
    let response = await ProviderService.addNewProvider(providerName, providerDesc)
    if (response.error === 0) {
      // TODO : Quand le back-end sera en place, plutôt appeler getAllNewProviders() pour maj le store !
      displaySuccessToast('Votre demande a été enregistré avec succès')
      newProviders.value.push(response.data)
    } else {
      displayErrToast("Échec de l'envoi de la demande, veuillez réessayer")
      console.log(response.data)
    }
  }

  async function removeNewProvider(data) {
    let response = await ProviderService.removeNewProvider(data.id)
    if (response.error === 0) {
      // TODO : Quand le back-end sera en place, appeler getAllNewProviders() pour maj le store !
      displaySuccessToast(`La demande de ${data.name} a été supprimé avec succès`)
    } else {
      displayErrToast(`Échec de la suppression de la demande de ${data.name}`)
      console.log(response.data)
    }
  }

  async function validateNewProviders(data) {
    let response = await ProviderService.validateNewProviders(data)

    newProviders.value = newProviders.value.filter((p) => p.id != data.id)
    providers.value.push(response.data)
    if (response.error === 0) {
      displaySuccessToast(`La demande de ${data.name} a été validé avec succès`)
    } else {
      displayErrToast(`Échec de la validation de la demande de ${data.name}`)
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
    validateNewProviders,
  }
})
