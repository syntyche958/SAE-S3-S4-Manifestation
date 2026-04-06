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
  registrations,
} from '@/datasource/data'
import { UserTypeEnum } from '@/enums/User.enum'
import i18n from '@/i18n'
const { t } = i18n.global

function getAllProviders() {
  return { error: 0, status: 200, data: providers }
}

function getAllActivities() {
  return { error: 0, status: 200, data: activities }
}

function getAllSessions() {
  return { error: 0, status: 200, data: session }
}

function getAllContacts() {
  return { error: 0, status: 200, data: contacts }
}

function getAllContactsById(userId) {
  const providerId = providers.find((p) => p.userId === userId).id
  const data = contacts.filter((c) => c.providerId == providerId)
  return { error: 0, status: 200, data }
}

function getAllLocations() {
  return { error: 0, status: 200, data: locations }
}

function getUsers() {
  return { error: 0, status: 200, data: users }
}

function getAllNewProviders() {
  return { error: 0, status: 200, data: newProviders }
}

function getProviderImages(id) {
  return { error: 0, status: 200, data: providerImages.find((pi) => pi.id === id) }
}

function getPresentationContent() {
  return { error: 0, status: 200, data: presentation }
}

async function updateProviderDescription(providerId, providerDesc) {
  return {
    error: 0,
    status: 200,
    data: { ...providers.find((p) => p.id === providerId), description: providerDesc },
  }
}

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

function getSessionsByActivityId(activityId) {
  const data = session.filter((s) => s.activitiesId === activityId)
  return { error: 0, status: 200, data }
}

function uploadProviderImage(providerId, imageData) {
  const providerImagesEntry = providerImages.find((pi) => pi.id === providerId)

  const newImage = {
    itemImageSrc: imageData.url,
    thumbnailImageSrc: imageData.url,
    alt: imageData.name,
    title: imageData.name,
    id: Date.now(),
  }

  if (providerImagesEntry) {
    providerImagesEntry.images.push(newImage)
  } else {
    providerImages.push({
      id: providerId,
      images: [newImage],
    })
  }

  return { error: 0, status: 200, data: newImage }
}

function deleteProviderImage(providerId, imageIndex) {
  const providerImagesEntry = providerImages.find((pi) => pi.id === providerId)

  if (providerImagesEntry && providerImagesEntry.images) {
    providerImagesEntry.images.splice(imageIndex, 1)

    return { error: 0, status: 200, data: t('message.imageDeleted') }
  }

  return { error: 1, status: 404, data: t('message.providerNotFound') }
}

function updateUserTypeToProvider(userId) {
  const user = users.find((u) => u.id === userId)
  user.type = UserTypeEnum.PROVIDER
  return { error: 0, status: 200, data: user }
}

function addRegistration(activityId, sessionId, userId) {
  let newId = 1
  if (registrations.length > 0) {
    newId = Math.max(...registrations.map((r) => r.id)) + 1
  }

  const newRegistration = {
    id: newId,
    activity_id: activityId,
    session_id: sessionId,
    user_id: userId,
    registration_date: new Date().toISOString().split('T')[0],
  }

  registrations.push(newRegistration)

  return { error: 0, status: 200, data: newRegistration }
}

function getAllRegistrations() {
  return { error: 0, status: 200, data: registrations }
}

function getRegistrationsByActivity(activityId) {
  const data = registrations.filter((r) => r.activity_id === activityId)
  return { error: 0, status: 200, data }
}

function getRegistrationsByUser(userId) {
  const data = registrations.filter((r) => r.user_id === userId)
  return { error: 0, status: 200, data }
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
  addRegistration,
  getAllRegistrations,
  getRegistrationsByActivity,
  getRegistrationsByUser,
}
