import LocalSource from '@/services/localsource.service.js'
import { useContactStore } from '@/stores/contact'
import { networkErrResponse } from '@/utils/network.utils'

async function getAllContactsFromLocalSource() {
  return LocalSource.getAllContacts()
}

async function getAllContactsByIdFromLocalSource(userId) {
  return LocalSource.getAllContactsById(userId)
}

async function removeContactFromLocalSource(id) {
  return { error: 0, status: 200, data: { id } }
}

async function addContactToLocalSource(mail, providerId, activityId, message) {
  const contactStore = useContactStore()

  let lastId = 0
  contactStore.contacts.forEach((c) => {
    lastId = Math.max(lastId, c.id)
  })

  return {
    error: 0,
    status: 200,
    data: {
      id: lastId + 1,
      mail,
      providerId,
      activityId,
      message,
    },
  }
}

async function getAllContacts() {
  try {
    return await getAllContactsFromLocalSource()
  } catch {
    return networkErrResponse
  }
}

async function getAllContactsById(userId) {
  try {
    return await getAllContactsByIdFromLocalSource(userId)
  } catch {
    return networkErrResponse
  }
}

async function addContact(mail, providerId, activityId, message) {
  try {
    return await addContactToLocalSource(mail, providerId, activityId, message)
  } catch {
    return networkErrResponse
  }
}

async function removeContact(id) {
  try {
    return await removeContactFromLocalSource(id)
  } catch {
    return networkErrResponse
  }
}

export default {
  getAllContacts,
  getAllContactsById,
  addContact,
  removeContact,
}
