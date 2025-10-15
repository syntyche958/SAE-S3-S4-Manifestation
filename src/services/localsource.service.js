import { providers, locations, user, newProviders, providerImages } from '@/datasource/data'

/**
 * Get all providers
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:{id:number, name:string}}}
 */
function getAllProviders() {
  return { error: 0, status: 200, data: providers }
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
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:{name:string}}}
 */
function getAllNewProviders() {
  return { error: 0, status: 200, data: newProviders }
}

/**
 * Get provider images
 * @returns {{error:number, status: number, data:string} | {error:number, status:number, data:[{id:number, images:[{itemImageSrc: string, thumbnailImageSrc: string, alt: string, title:string}]}]}}
 */
function getProviderImages(id) {
  return { error: 0, status: 200, data: providerImages.find((pi) => pi.id == id) }
}

export default { getAllProviders, getAllNewProviders, getProviderImages, getAllLocations, getUser }
