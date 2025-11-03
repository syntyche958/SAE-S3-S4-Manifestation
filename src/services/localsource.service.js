import {
  providers,
  activity,
  locations,
  user,
  newProviders,
  providerImages,
  presentation,
  contacts,
} from '@/datasource/data'

/**
 * Get all providers
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:{id:number, name:string}}}
 */
function getAllProviders() {
  return { error: 0, status: 200, data: providers }
}

/**
 * Get all activity
 * @returns {{error:number, status:number, data:{id:number, providerId:number, name:string}}}
 */
function getAllActivity() {
  return { error: 0, status: 200, data: activity }
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
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:[{id:number, images:[{itemImageSrc: string, thumbnailImageSrc: string, alt: string, title:string}]}]}}
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

export default {
  getAllProviders,
  getAllActivity,
  getAllNewProviders,
  getProviderImages,
  getAllLocations,
  getUser,
  getPresentationContent,
  getAllContacts,
  getAllContactsById,
}
