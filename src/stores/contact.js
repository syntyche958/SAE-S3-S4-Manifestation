import { ref } from 'vue'
import { defineStore } from 'pinia'

import ContactService from '@/services/contact.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'
import i18n from '@/i18n'

const { t } = i18n.global

// TODO : Mettre en place l'affichage des messages côté prestataire !
export const useContactStore = defineStore('contact', () => {
  // STATE
  const contacts = ref([])

  // ACTIONS
  async function getAllContacts() {
    let response = await ContactService.getAllContacts()
    if (response.error === 0) {
      contacts.value = response.data
    } else {
      console.log(response.data)
    }
  }

  // TODO : Add async function getAllContacts(provider_id)
  async function getAllContactsById(userId) {
    let response = await ContactService.getAllContactsById(userId)
    if (response.error === 0) {
      contacts.value = response.data
    } else {
      console.log(response.data)
    }
  }

  async function addContact(mail, providerId, activityId, message) {
    let response = await ContactService.addContact(mail, providerId, activityId, message)
    if (response.error === 0) {
      await getAllContacts()
      displaySuccessToast(t('message.messageSentSuccess'))
    } else {
      console.log(response.data)
      displayErrToast(t('message.sendFailed'))
    }
  }

  async function removeContact(id) {
    let response = await ContactService.removeContact(id)
    if (response.error === 0) {
      await getAllContacts()
      displaySuccessToast(t('message.taskDone'))
    } else {
      console.log(response.data)
      displayErrToast(t('message.taskDoneFailed'))
    }
  }

  return {
    contacts,
    getAllContacts,
    getAllContactsById,
    addContact,
    removeContact,
  }
})
