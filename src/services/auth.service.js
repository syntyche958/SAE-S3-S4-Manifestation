import LocalSource from '@/services/localsource.service.js'

async function getUserFromLocalSource() {
  return LocalSource.getUser()
}

async function getUser() {
  let response = null
  try {
    response = await getUserFromLocalSource()
  } catch {
    return { error: 1, status: 400, data: 'A network error occured : ' }
  }

  return response
}

export default { getUser }
