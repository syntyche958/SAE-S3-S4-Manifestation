import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
})

const headers = { 'Content-Type': 'application/json' }
const noCacheHeaders = { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }

export async function getRequest(url, optHeaders = {}) {
  let response = null
  try {
    response = await instance.get(url, { headers: { ...noCacheHeaders, ...optHeaders } })
  } catch (error) {
    console.error(error)
    return handleErrors(url, 'get', error)
  }
  return response.data
}

export async function postRequest(url, data) {
  let response = null
  try {
    response = await instance.post(url, data, { headers })
  } catch (error) {
    console.error(error)
    return handleErrors(url, 'post', error)
  }
  return response.data
}

export async function putRequest(url, data, optHeaders = {}) {
  let response = null
  try {
    response = await instance.put(url, data, { headers: { ...headers, ...optHeaders } })
  } catch (error) {
    console.error(error)
    return handleErrors(url, 'put', error)
  }
  return response.data
}

export async function deleteRequest(url, data = null) {
  let response = null
  try {
    const config = data != null ? { data, headers } : {}
    response = await instance.delete(url, config)
  } catch (error) {
    console.error(error)
    return handleErrors(url, 'delete', error)
  }
  return response.data
}

export async function patchRequest(url, data, optHeaders = {}) {
  let response = null
  try {
    response = await instance.patch(url, data, { headers: { ...headers, ...optHeaders } })
  } catch (error) {
    console.error(error)
    return handleErrors(url, 'patch', error)
  }
  return response.data
}

function handleErrors(route, typeReq, err) {
  if (err.response) {
    console.log(`(${typeReq} - ${route}) error : `, err.message)
    return { error: err.response.status, data: err.response.data }
  } else if (err.request) {
    // Cas pas de réponse retourné
    console.log(`(${typeReq} - ${route}) error : no response`)
    return { error: 500, data: 'no response' }
  } else {
    console.log('unknown error')
    return { error: 500, data: 'unknown error' }
  }
}
