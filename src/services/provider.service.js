import LocalSource from '@/services/localsource.service.js'

async function getAllProvidersFromLocalSource() {
  return LocalSource.getAllProviders()
}

async function getAllProviders() {
  let response = null
  try {
    response = await getAllProvidersFromLocalSource()
  } catch {
    return { error: 1, status: 400, data: 'A network error occured : ' }
  }

  return response
}

export default { getAllProviders }
