import { ref } from 'vue'
import { defineStore } from 'pinia'

import PresentationService from '@/services/presentation.service'

export const usePresentationStore = defineStore('presentation', () => {
  const small = ref('')

  async function getPresentationContent() {
    let response = await PresentationService.getPresentationContent()
    if (response.error === 0) {
      small.value = response.data.small
    } else {
      console.log(response.data)
    }
  }

  async function updateSmallText(smallTextHtml) {
    small.value = smallTextHtml
  }

  return { small, getPresentationContent, updateSmallText }
})
