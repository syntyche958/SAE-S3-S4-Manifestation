import { ref } from 'vue'
import { defineStore } from 'pinia'

import LocationsService from '@/services/locations.service'

export const useLocationStore = defineStore('locations', () => {
  const locations = ref([])

  async function getAllLocations() {
    let response = await LocationsService.getAllLocations()
    if (response.error == 0) {
      locations.value = response.data
    } else {
      console.log(response.data)
    }
  }

  return {
    locations,
    getAllLocations,
  }
})
