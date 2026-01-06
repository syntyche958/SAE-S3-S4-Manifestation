import { useSurveyStore } from '@/stores/surveys'

/**
 * Calcule les statistiques basées sur les sondages
 */
async function getSurveyStatistics() {
  const surveyStore = useSurveyStore()
  const surveys = surveyStore.surveys

  if (!surveys || surveys.length === 0) {
    return {
      error: 0,
      status: 200,
      data: {
        totalSurveys: 0,
        averageRating: 0,
        averageSatisfaction: 0,
        ratingsDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        subRatingsAnalysis: { organisation: 0, animations: 0, accessibility: 0 },
        recommendationBreakdown: { yes: 0, no: 0, maybe: 0 },
        topActivities: [],
      },
    }
  }

  // Calculer la note moyenne et la distribution
  let totalRating = 0
  let ratingCount = 0
  const ratingsDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const subRatings = { organisation: 0, animations: 0, accessibility: 0 }
  let subRatingCount = 0
  const recommendationBreakdown = { yes: 0, no: 0, maybe: 0 }
  const activityCount = {}

  surveys.forEach((survey) => {
    // Note globale
    if (survey.rating) {
      totalRating += survey.rating
      ratingCount++
      if (ratingsDistribution.hasOwnProperty(survey.rating)) {
        ratingsDistribution[survey.rating]++
      }
    }

    // Sous-notes (organisation, animations, accessibilité)
    if (survey.ratings) {
      subRatings.organisation += survey.ratings.organisation || 0
      subRatings.animations += survey.ratings.animations || 0
      subRatings.accessibility += survey.ratings.accessibility || 0
      subRatingCount++
    }

    // Recommandations
    if (survey.recommend && recommendationBreakdown.hasOwnProperty(survey.recommend)) {
      recommendationBreakdown[survey.recommend]++
    }

    // Activités
    if (survey.activities && Array.isArray(survey.activities)) {
      survey.activities.forEach((activity) => {
        activityCount[activity] = (activityCount[activity] || 0) + 1
      })
    }
  })

  // Calculer les moyennes
  const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(2) : 0

  if (subRatingCount > 0) {
    subRatings.organisation = (subRatings.organisation / subRatingCount).toFixed(2)
    subRatings.animations = (subRatings.animations / subRatingCount).toFixed(2)
    subRatings.accessibility = (subRatings.accessibility / subRatingCount).toFixed(2)
  }

  // Top 5 activités
  const topActivities = Object.entries(activityCount)
    .map(([activity, count]) => ({ activity, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    error: 0,
    status: 200,
    data: {
      totalSurveys: surveys.length,
      averageRating: parseFloat(averageRating),
      averageSatisfaction: parseFloat(averageRating), // Alias pour compatibilité
      ratingsDistribution,
      subRatingsAnalysis: subRatings,
      recommendationBreakdown,
      topActivities,
    },
  }
}

/**
 * Récupère les statistiques par prestataire
 */
async function getStatisticsByProvider() {
  const surveyStore = useSurveyStore()
  const surveys = surveyStore.surveys

  const statsByProvider = {}

  surveys.forEach((survey) => {
    if (survey.providerId) {
      if (!statsByProvider[survey.providerId]) {
        statsByProvider[survey.providerId] = {
          totalSurveys: 0,
          totalRating: 0,
          averageRating: 0,
        }
      }

      statsByProvider[survey.providerId].totalSurveys++
      if (survey.rating) {
        statsByProvider[survey.providerId].totalRating += survey.rating
      }
    }
  })

  // Calculer les moyennes
  Object.keys(statsByProvider).forEach((providerId) => {
    const stats = statsByProvider[providerId]
    stats.averageRating =
      stats.totalSurveys > 0 ? (stats.totalRating / stats.totalSurveys).toFixed(2) : 0
  })

  return {
    error: 0,
    status: 200,
    data: statsByProvider,
  }
}

export default {
  getSurveyStatistics,
  getStatisticsByProvider,
}