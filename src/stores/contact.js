import { ref } from 'vue'
import { defineStore } from 'pinia'
import ContactService from '@/services/contact.service'

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
    } else {
      console.log(response.data)
    }

    return response
  }

  return {
    contacts,
    getAllContacts,
    getAllContactsById,
    addContact,
  }
})
