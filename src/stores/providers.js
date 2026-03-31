import { ref } from 'vue'
import { defineStore } from 'pinia'

import ProviderService from '@/services/provider.service'
import AuthService from '@/services/auth.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'

export const useProviderStore = defineStore('provider', () => {
  const providers = ref([])
  const newProviders = ref([])
  const providerImages = ref([])
  const providerDescription = ref('')
  const isLoadingProviders = ref(false)

  async function getAllProviders() {
    isLoadingProviders.value = true
    let response = await ProviderService.getAllProviders()
    if (response.error === 0) {
      providers.value = response.data
    } else {
      console.log(response.data)
    }
    isLoadingProviders.value = false
  }

  function get(providerId) {
    return providers.value.find((p) => p.id === providerId)
  }

  async function getDescription(providerId) {
    return providers.value.find((p) => p.id == providerId).description
  }

  async function updateProviderDescription(providerId, newDescription) {
    let response = await ProviderService.updateProviderDescription(providerId, newDescription)

    if (response.error === 0) {
      providers.value = providers.value.filter((p) => p.id != providerId)
      providers.value.push(response.data)
      providers.value = providers.value.sort((a, b) => a.id - b.id) // To have consistent order display (ex: navbar)
    } else {
      console.log(response.data)
    }
  }

  async function getProviderImages(idProvider) {
    let response = await ProviderService.getProviderImages(idProvider)

    if (
      response &&
      response.error === 0 &&
      response.data &&
      response.data.id === idProvider &&
      Array.isArray(response.data.images)
    ) {
      providerImages.value = response.data.images
      return response.data.images
    }

    providerImages.value = []
    return []
  }

  async function getAllNewProviders() {
    let response = await ProviderService.getAllNewProviders()
    if (response.error === 0) {
      newProviders.value = response.data
      console.log('newProviders fetched')
    } else {
      console.log(response.data)
    }
  }

  async function addNewProvider(providerName, providerDesc) {
    let response = await ProviderService.addNewProvider(providerName, providerDesc)
    if (response.error === 0) {
      await getAllNewProviders()
      displaySuccessToast('Votre demande a été enregistré avec succès')
    } else {
      displayErrToast("Échec de l'envoi de la demande, veuillez réessayer")
      console.log(response.data)
    }
  }

  async function removeNewProvider(data) {
    let response = await ProviderService.removeNewProvider(data.id)
    if (response.error === 0) {
      await getAllNewProviders()
      displaySuccessToast(`La demande de ${data.name} a été supprimé avec succès`)
    } else {
      displayErrToast(`Échec de la suppression de la demande de ${data.name}`)
      console.log(response.data)
    }
  }

  async function validateNewProviders(data) {
    let response1 = await ProviderService.validateNewProviders(data)

    // Update user type to provider
    let response2 = await AuthService.updateUserTypeToProvider(data.userId)
    if (response1.error === 0 && response2.error === 0) {
      await getAllNewProviders()
      await getAllProviders()
      displaySuccessToast(`La demande de ${data.name} a été validé avec succès`)
    } else {
      displayErrToast(`Échec de la validation de la demande de ${data.name}`)
    }
  }

  async function uploadProviderImage(providerId, imageData) {
    let response = await ProviderService.uploadProviderImage(providerId, imageData)

    if (response.error === 0) {
      displaySuccessToast('Image uploadée avec succès')
      await getProviderImages(providerId)
    } else {
      displayErrToast("Erreur lors de l'upload")
      console.log(response.data)
    }

    return response
  }

  async function deleteProviderImage(providerId, imageId) {
    let response = await ProviderService.deleteProviderImage(providerId, imageId)

    if (response.error === 0) {
      displaySuccessToast('Image supprimée avec succès')
      await getProviderImages(providerId)
    } else {
      displayErrToast('Erreur lors de la suppression')
      console.log(response.data)
    }

    return response
  }

  return {
    providers,
    newProviders,
    providerImages,
    providerDescription,
    isLoadingProviders,
    get,
    getDescription,
    updateProviderDescription,
    getAllProviders,
    getAllNewProviders,
    getProviderImages,
    addNewProvider,
    removeNewProvider,
    validateNewProviders,
    uploadProviderImage,
    deleteProviderImage,
  }
})
