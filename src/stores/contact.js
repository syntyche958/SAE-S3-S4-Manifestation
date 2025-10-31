import { ref } from 'vue'
import { defineStore } from 'pinia'

import ContactService from '@/services/contact.service'
import { displayErrToast, displaySuccessToast } from '@/utils/toast.utils'

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
  async function getAllContactsById(providerId) {
    let response = await ContactService.getAllContactsById(providerId)
    if (response.error === 0) {
      contacts.value = response.data
    } else {
      console.log(response.data)
    }
  }

  async function addContact(mail, providerId, activityId, message) {
    let response = await ContactService.addContact(mail, providerId, activityId, message)
    if (response.error === 0) {
      contacts.value += response.data
      displaySuccessToast('Message envoyé avec succès !')
    } else {
      console.log(response.data)
      displayErrToast("Echec de l'envoi, veuillez réessayer !")
    }
  }

  async function removeContact(id) {
    let response = await ContactService.removeContact(id)
    if (response.error === 0) {
      contacts.value = contacts.value.filter((c) => c.id !== id)
      displaySuccessToast('Tâche marqué comme traité !')
    } else {
      console.log(response.data)
      displayErrToast('Echec de validation de la tâche, veuillez réessayer !')
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
