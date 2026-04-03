import { ref } from 'vue'
import { defineStore } from 'pinia'

import ProviderService from '@/services/provider.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import i18n from '@/i18n'

export const useProviderStore = defineStore('provider', () => {
  const providers = ref([])
  const newProviders = ref([])
  const providerImages = ref([])
  /** Incrémenté après upload/suppression d’image pour rafraîchir le carrousel */
  const providerImageListRevision = ref(0)
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
    const provider = get(providerId)
    if (!provider) {
      displayErrToast('Prestataire introuvable.')
      return
    }
    const descriptionText =
      typeof newDescription === 'string' ? newDescription : newDescription?.value ?? ''
    const locale = i18n.global.locale.value
    const response = await ProviderService.updateProviderDescription({
      id: providerId,
      name: provider.name,
      description: descriptionText,
      userId: provider.userId,
      locale,
    })

    if (response.error === 0) {
      providers.value = providers.value.filter((p) => p.id != providerId)
      providers.value.push(response.data)
      providers.value = providers.value.sort((a, b) => a.id - b.id)
      displaySuccessToast('Texte de présentation enregistré.')
    } else {
      displayErrToast("Impossible d'enregistrer le texte de présentation.")
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
    if (response && response.error === 0 && Array.isArray(response.data)) {
      newProviders.value = response.data
    } else {
      console.log(response?.data ?? response)
    }
  }

  async function addNewProvider(providerName, providerDesc) {
    let response = await ProviderService.addNewProvider(providerName, providerDesc)
    if (response.error === 0) {
      displaySuccessToast('Votre demande a été enregistrée avec succès')
      await getAllNewProviders()
    } else if (response.error === 401) {
      displayErrToast(i18n.global.t('message.providerRequestRequiresLogin'))
    } else {
      displayErrToast("Échec de l'envoi de la demande, veuillez réessayer")
      console.log(response.data)
    }
  }

  async function removeNewProvider(data) {
    let response = await ProviderService.removeNewProvider(data.id)
    if (response.error === 0) {
      displaySuccessToast(`La demande de ${data.name} a été supprimée avec succès`)
      await getAllNewProviders()
    } else {
      displayErrToast(`Échec de la suppression de la demande de ${data.name}`)
      console.log(response.data)
    }
  }

  async function validateNewProviders(data) {
    const response1 = await ProviderService.validateNewProviders(data)
    if (response1.error !== 0) {
      displayErrToast(`Échec de la validation de la demande de ${data.name}`)
      console.log(response1.data)
      return
    }

    await getAllNewProviders()
    await getAllProviders()
    displaySuccessToast(`La demande de ${data.name} a été validée avec succès`)
  }

  async function uploadProviderImage(providerId, imageData) {
    let response = await ProviderService.uploadProviderImage(providerId, imageData)

    if (response.error === 0) {
      displaySuccessToast('Image uploadée avec succès')
      await getProviderImages(providerId)
      providerImageListRevision.value += 1
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
      providerImageListRevision.value += 1
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
    providerImageListRevision,
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
