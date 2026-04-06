import activityService from './activity.service'
import sessionsService from './sessions.service'
import i18n from '@/i18n'

const { t } = i18n.global

const providerStatisticsService = {
  async getProviderStatistics(providerId) {
    try {
      const activitiesResponse = await activityService.getAllActivities()
      if (activitiesResponse.error !== 0) {
        throw new Error('Erreur lors de la récupération des activités')
      }

      const providerIdNumber = Number.parseInt(providerId)
      const activities = []
      const activityIds = []

      for (const activity of activitiesResponse.data) {
        const countEnabled = activity.registrationCountEnabled ?? true
        if (activity.providerId === providerIdNumber && countEnabled) {
          activities.push(activity)
          activityIds.push(activity.id)
        }
      }

      const sessionsResponse = await sessionsService.getAllSessions()
      if (sessionsResponse.error !== 0) {
        throw new Error('Erreur lors de la récupération des sessions')
      }

      const registrations = []
      for (const session of sessionsResponse.data) {
        if (!activityIds.includes(session.activityId)) {
          continue
        }

        if (!session.registersUsers) {
          continue
        }

        for (const userId of session.registersUsers) {
          registrations.push({
            activity_id: session.activityId,
            session_id: session.id,
            user_id: userId,
            registration_date: session.beginingDate,
          })
        }
      }

      return {
        success: true,
        data: {
          activities,
          registrations,
        },
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },

  calculateRegistrationsByActivity(activities, registrations) {
    const stats = {}

    for (const reg of registrations) {
      let activity = null

      for (const currentActivity of activities) {
        if (currentActivity.id === reg.activity_id) {
          activity = currentActivity
          break
        }
      }

      if (!activity) {
        continue
      }

      if (!stats[reg.activity_id]) {
        stats[reg.activity_id] = {
          id: activity.id,
          name: activity.name,
          count: 0,
          activity,
        }
      }

      stats[reg.activity_id].count++
    }

    return Object.values(stats)
  },

  calculateRegistrationsByDay(activities, registrations) {
    const stats = {}

    for (const reg of registrations) {
      const rawDate = new Date(reg.registration_date)
      const date = rawDate.toLocaleDateString('fr-FR')

      if (!stats[date]) {
        stats[date] = {
          date,
          count: 0,
          rawDate,
        }
      }

      stats[date].count++
    }

    return Object.values(stats).sort((a, b) => a.rawDate - b.rawDate)
  },

  calculateRegistrationsByActivityAndDay(activities, registrations) {
    const stats = {}

    for (const reg of registrations) {
      let activity = null
      for (const currentActivity of activities) {
        if (currentActivity.id === reg.activity_id) {
          activity = currentActivity
          break
        }
      }

      if (!activity) {
        continue
      }

      const date = reg.registration_date
        ? new Date(reg.registration_date).toLocaleDateString('fr-FR')
        : t('message.undefinedDate')

      const key = activity.id + '|' + date
      if (!stats[key]) {
        stats[key] = {
          activityId: activity.id,
          activityName: activity.name,
          date,
          count: 0,
          rawDate: reg.registration_date ? new Date(reg.registration_date) : null,
        }
      }

      stats[key].count++
    }

    return Object.values(stats).sort((a, b) => {
      if (!a.rawDate) return 1
      if (!b.rawDate) return -1
      return a.rawDate - b.rawDate
    })
  },
}

export default providerStatisticsService
