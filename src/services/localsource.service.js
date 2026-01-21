import {
  providers,
  locations,
  users,
  newProviders,
  providerImages,
  presentation,
  contacts,
  activities,
  session,
  surveys,
} from '@/datasource/data'
import { UserTypeEnum } from '@/enums/User.enum'

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
   * @return {{error: number, status: number, data: [{id: number, activitiesId: number, beginingDate: string, beginingHour: string, duration: number, nbPlace: number}]}}
   */
  function getAllSessions() {
    return { error: 0, status: 200, data: session }
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
function getUsers() {
  return { error: 0, status: 200, data: users }
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
   * Update provider description
   * @returns {{error:number, status: number, data:string} | {error:number, status:number, data: {id: number, name:string, description: String}}}
   */
  async function updateProviderDescription(providerId, providerDesc) {
    return {
      error: 0,
      status: 200,
      data: { ...providers.find((p) => p.id === providerId), description: providerDesc },
    }
  }

/**
 * Get all surveys
 * @returns {{error:number,status:number,data:array}}
 */
function getAllSurveys() {
  return { error: 0, status: 200, data: surveys }
}

function login(mail, password) {
  const user = users.find((u) => u.mail == mail && u.passwword == password)
  if (user) {
    return { error: 0, status: 200, data: user }
  } else {
    return { error: 1, status: 400, data: null }
  }
}

function signin(mail, password) {
  const userWithSameMail = users.find((u) => u.mail == mail)
  if (userWithSameMail !== undefined) {
    return { error: 1, status: 400, data: 'Mail already used !' }
  }
  const sortedusers = users
  sortedusers.sort((a, b) => b - a)
  const id = sortedusers.at(0).id + 1
  const newUser = { type: UserTypeEnum.VISITOR, mail, password, id }
  users.push(newUser)

  return { error: 0, status: 200, data: newUser }
}

  /**
   * Get provider images
   * @returns {{error:number, status: number, data: [{id: number, activitiesId: number, beginingDate: string, beginingHour: string, duration: number, nbPlace: number}]}}
   */
  function getSessionsByActivityId(activityId) {
    const data = session.filter((s) => s.activitiesId === activityId)
    return { error: 0, status: 200, data }
  }

  /**
   * Upload provider image
   * @returns {{error:number, status: number, data:object}}
   */
  function uploadProviderImage(providerId, imageData) {
    const providerImagesEntry = providerImages.find((pi) => pi.id === providerId)

    const newImage = {
      itemImageSrc: imageData.url,
      thumbnailImageSrc: imageData.url,
      alt: imageData.name,
      title: imageData.name,
      id: Date.now()
    }

    if (providerImagesEntry) {
      providerImagesEntry.images.push(newImage)
    } else {
      providerImages.push({
        id: providerId,
        images: [newImage]
      })
    }

    return { error: 0, status: 200, data: newImage }
  }

  /**
   * Delete provider image
   * @returns {{error:number, status: number, data:string}}
   */
  function deleteProviderImage(providerId, imageIndex) {
    const providerImagesEntry = providerImages.find((pi) => pi.id === providerId)

    if (providerImagesEntry && providerImagesEntry.images) {
      providerImagesEntry.images.splice(imageIndex, 1)

      return { error: 0, status: 200, data: 'Image supprimée' }
    }

    return { error: 1, status: 404, data: 'Prestataire non trouvé' }
  }

  function updateUserTypeToProvider(userId) {
    const user = users.find((u) => u.id === userId)
    user.type = UserTypeEnum.PROVIDER
    return { error: 0, status: 200, data: user }
  }

  export default {
    updateProviderDescription,
    getAllProviders,
    getAllActivities,
    getAllNewProviders,
    getProviderImages,
    getAllLocations,
    getUsers,
    getPresentationContent,
    getAllContacts,
    getAllContactsById,
    getAllSessions,
    getSessionsByActivityId,
    getAllSurveys,
    uploadProviderImage,
    deleteProviderImage,
    login,
    signin,
    updateUserTypeToProvider,
  }
