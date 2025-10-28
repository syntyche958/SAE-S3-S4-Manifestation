import { ref } from 'vue'
import { defineStore } from 'pinia'
import ContactService from '@/services/contact.service'

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
  async function getAllContactsById(provider_id) {
    let response = await ContactService.getAllContactsById(provider_id)
    if (response.error === 0) {
      contacts.value = response.data
    } else {
      console.log(response.data)
    }
  }

  return {
    contacts,
    getAllContacts,
    getAllContactsById,
  }
})
