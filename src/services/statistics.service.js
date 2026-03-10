import { useSurveyStore } from '@/stores/surveys'
import { useSessionStore } from '@/stores/sessions'
import { useActivityStore } from '@/stores/activities'
import AuthService from '@/services/auth.service'
import { UserTypeEnum } from '@/enums/User.enum'

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

  let totalRating = 0
  let ratingCount = 0
  const ratingsDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const subRatings = { organisation: 0, animations: 0, accessibility: 0 }
  let subRatingCount = 0
  const recommendationBreakdown = { yes: 0, no: 0, maybe: 0 }
  const activityCount = {}

  surveys.forEach((survey) => {

    if (survey.rating) {
      totalRating += survey.rating
      ratingCount++
      if (Object.prototype.hasOwnProperty.call(ratingsDistribution, survey.rating)) {
        ratingsDistribution[survey.rating]++
      }
    }

    if (survey.ratings) {
      subRatings.organisation += survey.ratings.organisation || 0
      subRatings.animations += survey.ratings.animations || 0
      subRatings.accessibility += survey.ratings.accessibility || 0
      subRatingCount++
    }

    if (survey.recommend && Object.prototype.hasOwnProperty.call(recommendationBreakdown, survey.recommend)) {
      recommendationBreakdown[survey.recommend]++
    }

    if (survey.activities && Array.isArray(survey.activities)) {
      survey.activities.forEach((activity) => {
        activityCount[activity] = (activityCount[activity] || 0) + 1
      })
    }
  })

  const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(2) : 0

  if (subRatingCount > 0) {
    subRatings.organisation = (subRatings.organisation / subRatingCount).toFixed(2)
    subRatings.animations = (subRatings.animations / subRatingCount).toFixed(2)
    subRatings.accessibility = (subRatings.accessibility / subRatingCount).toFixed(2)
  }

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
      averageSatisfaction: parseFloat(averageRating),
      ratingsDistribution,
      subRatingsAnalysis: subRatings,
      recommendationBreakdown,
      topActivities,
    },
  }
}


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


async function getGeneralStatistics() {
  const sessionStore = useSessionStore()
  const activityStore = useActivityStore()

  if (!sessionStore.sessions) await sessionStore.getAllSessions()
  if (activityStore.activities.length === 0) await activityStore.getAllActivities()

  const sessions = sessionStore.sessions || []

  const totalRegistrations = sessions.reduce((acc, s) => acc + (s.registersUsers?.length || 0), 0)

  const activityRegistrations = {}
  sessions.forEach((s) => {
    if (s.activitiesId) {
      const count = s.registersUsers?.length || 0
      activityRegistrations[s.activitiesId] = (activityRegistrations[s.activitiesId] || 0) + count
    }
  })

  const registrationsPerActivity = Object.entries(activityRegistrations).map(
    ([activityId, count]) => {
      const activity = activityStore.activities.find((a) => a.id === parseInt(activityId))
      return {
        id: activityId,
        name: activity ? activity.name : `Activité ${activityId}`,
        count: count,
      }
    },
  )

  const usersResponse = await AuthService.getUsers()
  const users = usersResponse.data || []
  const userCounts = {
    [UserTypeEnum.PROVIDER]: users.filter(
      (u) => u.type === UserTypeEnum.PROVIDER && u.mail && u.mail.trim() !== '',
    ).length,
    [UserTypeEnum.VISITOR]: users.filter(
      (u) => u.type === UserTypeEnum.VISITOR && u.mail && u.mail.trim() !== '',
    ).length,
  }

  const uniqueDates = [...new Set(sessions.map((s) => s.beginingDate))].sort()
  const activitiesPerDay = {}

  const dayNames = ['Samedi', 'Dimanche']

  uniqueDates.forEach((date, index) => {
    const dayName = dayNames[index] || `Jour ${index + 1}`
    const activitiesOnDay = new Set(
      sessions.filter((s) => s.beginingDate === date).map((s) => s.activitiesId),
    )
    activitiesPerDay[dayName] = activitiesOnDay.size
  })

  dayNames.forEach((name) => {
    if (!activitiesPerDay[name]) activitiesPerDay[name] = 0
  })

  return {
    error: 0,
    status: 200,
    data: {
      totalRegistrations,
      registrationsPerActivity,
      userCounts,
      activitiesPerDay,
    },
  }
}

export default {
  getSurveyStatistics,
  getStatisticsByProvider,
  getGeneralStatistics,
}
