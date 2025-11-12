import {
  providers,
  locations,
  user,
  newProviders,
  providerImages,
  presentation,
  contacts,
  activities,
  session,
  providerDescription,
} from '@/datasource/data'

/**
 * Get all providers
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:{id:number, name:string}}}
 */
function getAllProviders() {
  return { error: 0, status: 200, data: providers }
}

/**
 * Get all activities
 * @returns {{error:number, status:number, data:{id:number, providerId:number, name:string, description: string, presentationContent: string, locationId: integer}}}
 */
function getAllActivities() {
  return { error: 0, status: 200, data: activities }
}

/**
 * Get all sessions
 * @return {{error:number, status:number, data:{id:number, activitiesId:number, beginingDate:date, duration:number}}}
 */
function getAllSessions(){
  return {error:0, status:200, data:session}
}

/**
 * Get all contacts
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:{mail:string, providerId:number, activityId:number, message:string}}}
 */
function getAllContacts() {
  return { error: 0, status: 200, data: contacts }
}

/**
 * Get all contacts
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:{mail:string, providerId:number, activityId:number, message:string}}}
 */
function getAllContactsById(userId) {
  const providerId = providers.find((p) => p.userId === userId).id
  const data = contacts.filter((c) => c.providerId == providerId)
  return { error: 0, status: 200, data }
}

/**
 * Get all locations
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:{id:number, coord:array, area: array}}}
 */
function getAllLocations() {
  return { error: 0, status: 200, data: locations }
}

/**
 * Get user informations
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:{id:string, type:string}}}
 */
function getUser() {
  return { error: 0, status: 200, data: user }
}

/**
 * Get all new providers
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:{id: number, name:string}}}
 */
function getAllNewProviders() {
  return { error: 0, status: 200, data: newProviders }
}

/**
 * Get provider images
 * @returns {{error:number, status: number, data:string}}
 */
function getProviderImages(id) {
  return { error: 0, status: 200, data: providerImages.find((pi) => pi.id === id) }
}

/**
 * Get presentation html content
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data: {small:string}}}
 */
function getPresentationContent() {
  return { error: 0, status: 200, data: presentation }
}

/**
 * Get provider Description content
 * @returns {{error: number, status: number, data: {id: number, description: string}}}
 */
function getProviderDescription(id) {
  return { error: 0, status: 200, data: providerDescription.find((pi) => pi.id === id) }
}


export default {
  getAllProviders,
  getAllActivities,
  getAllNewProviders,
  getProviderImages,
  getAllLocations,
  getUser,
  getPresentationContent,
  getAllContacts,
  getAllContactsById,
  getAllSessions,
  getProviderDescription,
}
