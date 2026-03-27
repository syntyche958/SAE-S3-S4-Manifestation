import { ref } from 'vue'
import { defineStore } from 'pinia'

import activityService from '@/services/activity.service'
import { useProviderStore } from '@/stores/providers'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import { enqueueNotificationsForUsers } from '@/utils/visitorNotifications.utils'
import i18n from '@/i18n'

const { t } = i18n.global

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
      await getAllActivities()
      displaySuccessToast(t('message.activityAddedSuccess'))
    } else {
      displayErrToast(t('message.activityAddedFailed'))
      console.log(response.data)
    }
  }

  async function refuseRequestedLocation(activityId, reason) {
    const activity = activities.value.find((a) => a.id === activityId)
    if (!activity) {
      displayErrToast('Activité introuvable')
      return
    }

    const response = await activityService.refuseRequestedLocationIdLocalSource(activityId)
    if (response.error === 0) {
      activities.value = response.data

      const providerStore = useProviderStore()
      const provider = providerStore.get(activity.providerId)
      const providerUserId = provider?.userId

      if (providerUserId != null) {
        const suffix = reason ? ` Motif : ${reason}` : ''
        enqueueNotificationsForUsers(
          [providerUserId],
          `Votre demande de placement pour l'activité "${activity.name}" a été refusée par un administrateur.${suffix}`,
        )
      }

      displaySuccessToast('La demande de placement a été refusée')
    } else {
      displayErrToast("Echec du refus de la demande de placement")
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
      displaySuccessToast(t('message.ratingRecorded'))
    } else {
      displayErrToast(t('message.ratingFailed'))
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
      displaySuccessToast(t('message.commentPublished'))
    } else {
      displayErrToast(t('message.commentFailed'))
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
      displaySuccessToast(t('message.replyPublished'))
    } else {
      displayErrToast(t('message.replyFailed'))
      console.log(response.data)
    }
  }

  async function updateServiceFlags(activityId, payload) {
  const response = await activityService.updateServiceFlagsLocalSource(activityId,payload)
  if (response.error === 0) {
    activities.value = response.data
    displaySuccessToast(t('message.serviceFlagsUpdated'))
  } else {
    displayErrToast(t('message.serviceFlagsUpdateFailed'))
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
    refuseRequestedLocation,
    addRating,
    addComment,
    addCommentReply,
    activities,
    updateServiceFlags,
  }
})
