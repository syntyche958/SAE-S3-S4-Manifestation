import { useSurveyStore } from '@/stores/surveys'
import { useSessionStore } from '@/stores/sessions'
import { useActivityStore } from '@/stores/activities'
import AuthService from '@/services/auth.service'
import { UserTypeEnum } from '@/enums/User.enum'
import i18n from '@/i18n'
const { t } = i18n.global

function getActiveSurveys(surveysSource) {
  const surveys = []
  for (const survey of surveysSource || []) {
    if (!survey.isDeleted) {
      surveys.push(survey)
    }
  }
  return surveys
}

function getDefaultSurveyStatsData() {
  return {
    totalSurveys: 0,
    averageRating: 0,
    averageSatisfaction: 0,
    ratingsDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    subRatingsAnalysis: { organisation: 0, animations: 0, accessibility: 0 },
    recommendationBreakdown: { yes: 0, no: 0, maybe: 0 },
    topActivities: [],
  }
}

function initSurveyAccumulators() {
  return {
    totalRating: 0,
    ratingCount: 0,
    ratingsDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    subRatings: { organisation: 0, animations: 0, accessibility: 0 },
    subRatingCount: 0,
    recommendationBreakdown: { yes: 0, no: 0, maybe: 0 },
    activityCount: {},
  }
}

function applySurveyToAccumulators(survey, acc) {
  if (survey.rating) {
    acc.totalRating += survey.rating
    acc.ratingCount++
    if (Object.hasOwn(acc.ratingsDistribution, survey.rating)) {
      acc.ratingsDistribution[survey.rating]++
    }
  }

  if (survey.ratings) {
    acc.subRatings.organisation += survey.ratings.organisation || 0
    acc.subRatings.animations += survey.ratings.animations || 0
    acc.subRatings.accessibility += survey.ratings.accessibility || 0
    acc.subRatingCount++
  }

  if (survey.recommend && Object.hasOwn(acc.recommendationBreakdown, survey.recommend)) {
    acc.recommendationBreakdown[survey.recommend]++
  }

  if (survey.activities && Array.isArray(survey.activities)) {
    for (const activity of survey.activities) {
      acc.activityCount[activity] = (acc.activityCount[activity] || 0) + 1
    }
  }
}

function buildTopActivities(activityCount) {
  const topActivities = []
  for (const activityName of Object.keys(activityCount)) {
    topActivities.push({ activity: activityName, count: activityCount[activityName] })
  }

  topActivities.sort((a, b) => b.count - a.count)
  if (topActivities.length > 5) {
    topActivities.length = 5
  }

  return topActivities
}

function buildSurveyStatsData(surveys) {
  const acc = initSurveyAccumulators()

  for (const survey of surveys) {
    applySurveyToAccumulators(survey, acc)
  }

  const averageRating = acc.ratingCount > 0 ? (acc.totalRating / acc.ratingCount).toFixed(2) : 0

  if (acc.subRatingCount > 0) {
    acc.subRatings.organisation = (acc.subRatings.organisation / acc.subRatingCount).toFixed(2)
    acc.subRatings.animations = (acc.subRatings.animations / acc.subRatingCount).toFixed(2)
    acc.subRatings.accessibility = (acc.subRatings.accessibility / acc.subRatingCount).toFixed(2)
  }

  return {
    totalSurveys: surveys.length,
    averageRating: Number.parseFloat(averageRating),
    averageSatisfaction: Number.parseFloat(averageRating),
    ratingsDistribution: acc.ratingsDistribution,
    subRatingsAnalysis: acc.subRatings,
    recommendationBreakdown: acc.recommendationBreakdown,
    topActivities: buildTopActivities(acc.activityCount),
  }
}

function buildRegistrationsPerActivity(activityRegistrations, activities) {
  const registrationsPerActivity = []

  for (const activityId of Object.keys(activityRegistrations)) {
    const numericActivityId = Number.parseInt(activityId, 10)
    let activityName = `${t('message.activityFallback')} ${activityId}`

    for (const activity of activities) {
      if (activity.id === numericActivityId) {
        activityName = activity.name
        break
      }
    }

    registrationsPerActivity.push({
      id: activityId,
      name: activityName,
      count: activityRegistrations[activityId],
    })
  }

  return registrationsPerActivity
}

function countUsersByType(users) {
  let providerCount = 0
  let visitorCount = 0

  for (const user of users) {
    const type = user.type?.toLowerCase()
    const hasValidMail = user.mail && user.mail.trim() !== ''
    if (!hasValidMail) continue

    if (type === UserTypeEnum.PROVIDER) providerCount++
    if (type === UserTypeEnum.VISITOR) visitorCount++
  }

  return {
    [UserTypeEnum.PROVIDER]: providerCount,
    [UserTypeEnum.VISITOR]: visitorCount,
  }
}

function getUniqueSessionDates(sessions) {
  const uniqueDates = []
  for (const session of sessions) {
    const day = session.beginingDate
    if (!uniqueDates.includes(day)) {
      uniqueDates.push(day)
    }
  }

  uniqueDates.sort((a, b) => a.localeCompare(b))
  return uniqueDates
}

function buildActivitiesPerDay(sessions, uniqueDates) {
  const activitiesPerDay = {}
  const dayNames = [t('message.saturday'), t('message.sunday')]

  uniqueDates.forEach((date, index) => {
    const dayName = dayNames[index] || `${t('message.dayN')} ${index + 1}`
    const activitiesOnDay = []

    for (const session of sessions) {
      if (session.beginingDate !== date) continue
      if (!activitiesOnDay.includes(session.activityId)) {
        activitiesOnDay.push(session.activityId)
      }
    }

    activitiesPerDay[dayName] = activitiesOnDay.length
  })

  dayNames.forEach((name) => {
    if (!activitiesPerDay[name]) activitiesPerDay[name] = 0
  })

  return activitiesPerDay
}

async function getSurveyStatistics() {
  const surveyStore = useSurveyStore()
  const surveys = getActiveSurveys(surveyStore.surveys)

  if (!surveys || surveys.length === 0) {
    return {
      error: 0,
      status: 200,
      data: getDefaultSurveyStatsData(),
    }
  }

  return {
    error: 0,
    status: 200,
    data: buildSurveyStatsData(surveys),
  }
}

async function getStatisticsByProvider() {
  const surveyStore = useSurveyStore()
  const surveys = getActiveSurveys(surveyStore.surveys)

  const statsByProvider = {}

  for (const survey of surveys) {
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
  }

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

  let totalRegistrations = 0
  for (const session of sessions) {
    totalRegistrations += session.registersUsers?.length || 0
  }

  const activityRegistrations = {}
  for (const s of sessions) {
    if (s.activityId) {
      const count = s.registersUsers?.length || 0
      activityRegistrations[s.activityId] = (activityRegistrations[s.activityId] || 0) + count
    }
  }

  const registrationsPerActivity = buildRegistrationsPerActivity(
    activityRegistrations,
    activityStore.activities,
  )

  const usersResponse = await AuthService.getUsers()
  const users = usersResponse.data || []
  const userCounts = countUsersByType(users)
  const uniqueDates = getUniqueSessionDates(sessions)
  const activitiesPerDay = buildActivitiesPerDay(sessions, uniqueDates)

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
