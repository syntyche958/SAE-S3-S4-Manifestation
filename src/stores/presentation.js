import { ref } from 'vue'
import { defineStore } from 'pinia'

import PresentationService from '@/services/presentation.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'

export const usePresentationStore = defineStore('presentation', () => {
  const small = ref('')
  const big = ref('')

  async function getPresentationContent() {
    let response = await PresentationService.getPresentationContent()
    if (response.error === 0 && response.data) {
      small.value = response.data.small ?? ''
      big.value = response.data.big ?? ''
    } else {
      console.log(response.data)
    }
  }

  function updateSmallText(smallTextHtml) {
    small.value = smallTextHtml
  }

  function updateBigText(bigTextHtml) {
    big.value = bigTextHtml
  }

  async function persistPresentation(patch) {
    const response = await PresentationService.updatePresentation(patch)
    if (response.error === 0 && response.data) {
      if (response.data.small != null) small.value = response.data.small
      if (response.data.big != null) big.value = response.data.big
      displaySuccessToast('Présentation enregistrée.')
      return true
    }
    displayErrToast('Impossible d’enregistrer la présentation.')
    console.log(response.data)
    return false
  }

  return {
    small,
    big,
    getPresentationContent,
    updateSmallText,
    updateBigText,
    persistPresentation,
  }
})
