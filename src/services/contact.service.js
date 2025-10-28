import LocalSource from '@/services/localsource.service.js'

// TODO : Refactor
var networkErrResponse = { error: 1, status: 400, data: 'A network error occured' }

async function getAllContactsFromLocalSource() {
  return LocalSource.getAllContacts()
}

async function getAllContacts() {
  try {
    return await getAllContactsFromLocalSource()
  } catch {
    return networkErrResponse
  }
}

export default {
  getAllContacts,
}
