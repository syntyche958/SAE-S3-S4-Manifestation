import { ref } from 'vue'
import { defineStore } from 'pinia'

import PresentationService from '@/services/presentation.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import i18n from '@/i18n'

export const usePresentationStore = defineStore('presentation', () => {
  const small = ref('')
  const smallFr = ref('')
  const smallEn = ref('')
  const big = ref('')
  const bigFr = ref('')
  const bigEn = ref('')

  async function getPresentationContent() {
    let response = await PresentationService.getPresentationContent()
    if (response.error === 0 && response.data) {
      small.value = response.data.small ?? ''
      smallFr.value = response.data.smallFr || response.data.small || ''
      smallEn.value = response.data.smallEn || ''
      big.value = response.data.big ?? ''
      bigFr.value = response.data.bigFr || response.data.big || ''
      bigEn.value = response.data.bigEn || ''
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
    const locale = i18n.global.locale.value
    const response = await PresentationService.updatePresentation({ ...patch, locale })
    if (response.error === 0 && response.data) {
      if (response.data.small != null) small.value = response.data.small
      if (response.data.big != null) big.value = response.data.big
      smallFr.value = response.data.smallFr || response.data.small || ''
      smallEn.value = response.data.smallEn || ''
      bigFr.value = response.data.bigFr || response.data.big || ''
      bigEn.value = response.data.bigEn || ''
      displaySuccessToast('Présentation enregistrée.')
      return true
    }
    displayErrToast("Impossible d'enregistrer la présentation.")
    console.log(response.data)
    return false
  }

  return {
    small,
    smallFr,
    smallEn,
    big,
    bigFr,
    bigEn,
    getPresentationContent,
    updateSmallText,
    updateBigText,
    persistPresentation,
  }
})
