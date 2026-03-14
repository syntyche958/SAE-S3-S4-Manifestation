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

/**
 * Add a new registration
 * @param {number} activityId
 * @param {number} sessionId
 * @param {number} userId
 */
async function addRegistration(activityId, sessionId, userId) {
  return LocalSource.addRegistration(activityId, sessionId, userId)
}

export default {
  getAllRegistrations,
  getRegistrationsByActivity,
  getRegistrationsByUser,
  addRegistration,
}
