import activityService from './activity.service'
import sessionsService from './sessions.service'

class ProviderStatisticsService {
  async getProviderStatistics(providerId) {
    try {
      const activitiesResponse = await activityService.getAllActivities()
      if (activitiesResponse.error !== 0) {
        throw new Error('Erreur lors de la récupération des activités')
      }

      const activities = activitiesResponse.data.filter(
        (activity) =>
          activity.providerId === parseInt(providerId) &&
          (activity.registrationCountEnabled ?? true),
      )

      const sessionsResponse = await sessionsService.getAllSessions()
      if (sessionsResponse.error !== 0) {
        throw new Error('Erreur lors de la récupération des sessions')
      }

      const activityIds = activities.map((a) => a.id)
      const sessions = sessionsResponse.data.filter((s) => activityIds.includes(s.activityId))

      const registrations = []
      sessions.forEach((s) => {
        if (s.registersUsers) {
          s.registersUsers.forEach((userId) => {
            registrations.push({
              activity_id: s.activityId,
              session_id: s.id,
              user_id: userId,
              registration_date: s.beginingDate,
            })
          })
        }
      })

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

    registrations.forEach((reg) => {
      const activity = activities.find((a) => a.id === reg.activity_id)

      if (activity) {
        const activityName = activity.name
        const date = reg.registration_date
          ? new Date(reg.registration_date).toLocaleDateString('fr-FR')
          : 'Date non définie'

        const key = `${activity.id}|${date}`
        if (!stats[key]) {
          stats[key] = {
            activityId: activity.id,
            activityName: activityName,
            date: date,
            count: 0,
            rawDate: reg.registration_date ? new Date(reg.registration_date) : null,
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
