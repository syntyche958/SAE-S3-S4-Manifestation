import LocalSource from '@/services/localsource.service.js'
import { useContactStore } from '@/stores/contact'

// TODO : Refactor
var networkErrResponse = { error: 1, status: 400, data: 'A network error occured' }

async function getAllContactsFromLocalSource() {
  return LocalSource.getAllContacts()
}

async function getAllContactsByIdFromLocalSource(provider_id) {
  return LocalSource.getAllContactsById(provider_id)
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

async function getAllContactsById(provider_id) {
  try {
    return await getAllContactsByIdFromLocalSource(provider_id)
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
