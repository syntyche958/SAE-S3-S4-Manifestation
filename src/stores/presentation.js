import { ref } from 'vue'
import { defineStore } from 'pinia'

import PresentationService from '@/services/presentation.service'

export const usePresentationStore = defineStore('presentation', () => {
  // STATE
  const small = ref('')
  const big = ref('')

  // ACTIONS
  async function getPresentationContent() {
    let response = await PresentationService.getPresentationContent()
    if (response.error === 0) {
      small.value = response.data.small
      big.value = response.data.big
    } else {
      console.log(response.data)
    }
  }

  async function updateSmallText(smallTextHtml) {
    small.value = smallTextHtml
  }

  async function updateBigText(bigTextHtml) {
    big.value = bigTextHtml
  }

  return { small, big, getPresentationContent, updateSmallText, updateBigText }
})
