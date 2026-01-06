import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import StatisticsService from '@/services/statistics.service'

export const useStatisticsStore = defineStore('statistics', () => {
  const surveyStats = ref(null)
  const providerStats = ref(null)
  const loading = ref(false)

  async function loadSurveyStatistics() {
    loading.value = true
    try {
      const response = await StatisticsService.getSurveyStatistics()
      if (response.error === 0) {
        surveyStats.value = response.data
      } else {
        console.error('Erreur lors du chargement des statistiques', response.data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques', error)
    } finally {
      loading.value = false
    }
  }

  async function loadProviderStatistics() {
    loading.value = true
    try {
      const response = await StatisticsService.getStatisticsByProvider()
      if (response.error === 0) {
        providerStats.value = response.data
      } else {
        console.error('Erreur lors du chargement des statistiques par prestataire', response.data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques par prestataire', error)
    } finally {
      loading.value = false
    }
  }

  const averageSatisfaction = computed(() => {
    return surveyStats.value?.averageSatisfaction || 0
  })

  const totalSurveys = computed(() => {
    return surveyStats.value?.totalSurveys || 0
  })

  return {
    surveyStats,
    providerStats,
    loading,
    averageSatisfaction,
    totalSurveys,
    loadSurveyStatistics,
    loadProviderStatistics,
  }
})