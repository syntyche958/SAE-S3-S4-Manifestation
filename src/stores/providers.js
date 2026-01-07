import { ref } from 'vue'
import { defineStore } from 'pinia'

import ProviderService from '@/services/provider.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'

export const useProviderStore = defineStore('provider', () => {
  const providers = ref([])
  const newProviders = ref([])
  const providerImages = ref([])
  const providerDescription = ref('')

  async function getAllProviders() {
    let response = await ProviderService.getAllProviders()
    if (response.error === 0) {
      providers.value = response.data
    } else {
      console.log(response.data)
    }
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

    // Si le provider existe et a des images (même un tableau vide)
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

  async function uploadProviderImage(providerId, imageData) {
    let response = await ProviderService.uploadProviderImage(providerId, imageData)

    if (response.error === 0) {
      displaySuccessToast('Image uploadée avec succès')
      // providerImages.value = await getProviderImages(providerId)
      providerImages.value = providerImages.value.map((p) => {
        if (p.id !== providerId) return p
        return { ...p, images: [...p.images, response.data] }
      })
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
