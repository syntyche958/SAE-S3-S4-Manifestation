import LocalSource from '@/services/localsource.service'

/**
 * Get all registrations
 */
async function getAllRegistrations() {
  return LocalSource.getAllRegistrations()
}

/**
 * Get registrations by activity
 * @param {number} activityId
 */
async function getRegistrationsByActivity(activityId) {
  return LocalSource.getRegistrationsByActivity(activityId)
}

/**
 * Get registrations by user
 * @param {number} userId
 */
async function getRegistrationsByUser(userId) {
  return LocalSource.getRegistrationsByUser(userId)
}

export default {
  getAllRegistrations,
  getRegistrationsByActivity,
  getRegistrationsByUser,
}