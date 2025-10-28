import { ref } from 'vue'
import { defineStore } from 'pinia'
import contactService from '@/services/contact.service'

export const useContactStore = defineStore('contact', () => {
  // STATE
  const contacts = ref([])

  // ACTIONS
  async function getAllContacts() {
    let response = await contactService.getAllContacts()
    if (response.error === 0) {
      contacts.value = response.data
    } else {
      console.log(response.data)
    }
  }

  // TODO : Add async function getAllContacts(provider_id)

  return {
    contacts,
    getAllContacts,
  }
})
