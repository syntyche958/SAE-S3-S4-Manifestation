import { ref } from 'vue'
import { defineStore } from 'pinia'

import activityService from '@/services/activity.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'

export const useActivityStore = defineStore('activity', () => {
  // STATE
  const activities = ref([])

  // ACTIONS
  async function getAllActivities() {
    let response = await activityService.getAllActivities()
    if (response.error === 0) activities.value = response.data
    else console.log(response.data)
  }

  function get(activityId) {
    return activities.value.find((a) => a.id === activityId)
  }

  async function updateLocationId(activity_id, locationId) {
    let response = await activityService.updateLocationIdLocalSource(activity_id, locationId)
    if (response.error === 0) activities.value = response.data
    else console.log(response.data)
  }

  async function updateRequestedLocationId(activityId, requestedLocationId) {
    let response = await activityService.updateRequestedLocationIdLocalSource(
      activityId,
      requestedLocationId,
    )
    if (response.error === 0) activities.value = response.data
    else console.log(response.data)
  }

  async function addSpot(activityId, locationId, dateHour) {
    let response = await activityService.addSpotLocalSource(activityId, locationId, dateHour)
    if (response.error === 0) {
      activities.value = response.data
      displaySuccessToast('Emplacement attribué avec succès !')
    } else {
      displayErrToast("Échec de l'attribution de l'emplacement !")
    }
  }

  async function add(providerId, name, desc) {
    let response = await activityService.addToLocalSource(providerId, name, desc)
    if (response.error === 0) {
      activities.value.push(response.data)
      displaySuccessToast(`L'activité ${name} a été ajouté avec succès !`)
    } else {
      displayErrToast(`Echec de l'ajout de l'activité ${name} !`)
      console.log(response.data)
    }
  }

  async function addRating(activityId, userId, note) {
    let response = await activityService.addRatingLocalSource(activityId, userId, note)
    if (response.error === 0) {
      const index = activities.value.findIndex((a) => a.id === activityId)
      if (index !== -1) {
        activities.value[index] = response.data
      }
      displaySuccessToast(`Votre note a été enregistrée avec succès !`)
    } else {
      displayErrToast(`Echec de l'enregistrement de la note !`)
      console.log(response.data)
    }
  }

  async function addComment(activityId, userId, title, content) {
    let response = await activityService.addCommentLocalSource(activityId, userId, title, content)
    if (response.error === 0) {
      const index = activities.value.findIndex((a) => a.id === activityId)
      if (index !== -1) {
        activities.value[index] = response.data
      }
      displaySuccessToast(`Votre commentaire a été publié avec succès !`)
    } else {
      displayErrToast(`Echec de la publication du commentaire !`)
      console.log(response.data)
    }
  }

  async function addCommentReply(activityId, commentIndex, replyContent) {
    let response = await activityService.addCommentReplyLocalSource(activityId, commentIndex, replyContent)
    if (response.error === 0) {
      const index = activities.value.findIndex((a) => a.id === activityId)
      if (index !== -1) {
        activities.value[index] = response.data
      }
      displaySuccessToast('Votre réponse a été publiée avec succès !')
    } else {
      displayErrToast('Echec de la publication de la réponse !')
      console.log(response.data)
    }
  }

  return {
    getAllActivities,
    get,
    add,
    addSpot,
    updateLocationId,
    updateRequestedLocationId,
    addRating,
    addComment,
    addCommentReply,
    activities,
  }
})
