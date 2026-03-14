import activityService from './activity.service'
import registrationService from './registration.service'
import LocalSource from './localsource.service'

class ProviderStatisticsService {
  /**
   * Récupère toutes les statistiques d'un prestataire
   */
  async getProviderStatistics(providerId) {
    try {
      const activitiesResponse = await activityService.getAllActivities()
      if (activitiesResponse.error !== 0) {
        throw new Error('Erreur lors de la récupération des activités')
      }

      const activities = activitiesResponse.data.filter(
        (activity) => activity.providerId === parseInt(providerId),
      )

      const registrationsResponse = await registrationService.getAllRegistrations()
      if (registrationsResponse.error !== 0) {
        throw new Error('Erreur lors de la récupération des inscriptions')
      }

      const activityIds = activities.map((a) => a.id)
      const registrations = registrationsResponse.data.filter((r) =>
        activityIds.includes(r.activity_id),
      )

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
  }

  calculateRegistrationsByActivity(activities, registrations) {
    const stats = {}
    registrations.forEach((reg) => {
      const activity = activities.find((a) => a.id === reg.activity_id)
      if (activity) {
        if (!stats[reg.activity_id]) {
          stats[reg.activity_id] = {
            id: activity.id,
            name: activity.name,
            count: 0,
            activity: activity,
          }
        }
        stats[reg.activity_id].count++
      }
    })
    return Object.values(stats)
  }

  calculateRegistrationsByDay(activities, registrations) {
    const stats = {}

    registrations.forEach((reg) => {
      const date = new Date(reg.registration_date).toLocaleDateString('fr-FR')

      if (!stats[date]) {
        stats[date] = {
          date: date,
          count: 0,
          rawDate: new Date(reg.registration_date),
        }
      }
      stats[date].count++
    })

    return Object.values(stats).sort((a, b) => a.rawDate - b.rawDate)
  }

  calculateRegistrationsByActivityAndDay(activities, registrations) {
    const stats = {}
    const sessionsResponse = LocalSource.getAllSessions()
    const sessions = sessionsResponse.data

    registrations.forEach((reg) => {
      const activity = activities.find((a) => a.id === reg.activity_id)
      const session = sessions.find((s) => s.id === reg.session_id)

      if (activity && session) {
        const activityName = activity.name
        const date = session.beginingDate
          ? new Date(session.beginingDate).toLocaleDateString('fr-FR')
          : 'Date non définie'

        const key = `${activity.id}|${date}`
        if (!stats[key]) {
          stats[key] = {
            activityId: activity.id,
            activityName: activityName,
            date: date,
            count: 0,
            rawDate: session.beginingDate ? new Date(session.beginingDate) : null,
          }
        }
        stats[key].count++
      }
    })
    return Object.values(stats).sort((a, b) => {
      if (!a.rawDate) return 1
      if (!b.rawDate) return -1
      return a.rawDate - b.rawDate
    })
  }
}

export default new ProviderStatisticsService()
