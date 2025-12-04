<script setup>
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import { computed, ref } from 'vue'
// import router from '@/router'
import { useProviderStore } from '@/stores/providers'
import { UserTypeEnum } from '@/enums/User.enum.js'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const providerStore = useProviderStore()

const selectedProvider = ref(null)
const emit = defineEmits(['hide-dialog'])
const items = computed(() => {
  return providerStore.providers.map((provider) => ({
    label: provider.name,
    id: provider.id,
  }))
})

function login(userType, id = undefined) {
  if (userType === UserTypeEnum.ADMIN) {
    authStore.login({ id: 1, type: userType })
  } else if (userType === UserTypeEnum.PROVIDER) {
    const userId = providerStore.get(id).userId
    authStore.login({ id: userId, type: userType })
  }
  emit('hide-dialog')
}
</script>

<template>
  <ul style="display: flex; flex-direction: row; gap: 20px; align-items: center">
    <li>
      <Button
        label="Administrateur"
        style="font-size: 20px; padding: 3px 8px"
        @click="login(UserTypeEnum.ADMIN)"
      />
    </li>

    <li>
      <Dropdown
        v-model="selectedProvider"
        :options="items"
        optionLabel="label"
        placeholder="Prestataire"
        @change="(e) => login(UserTypeEnum.PROVIDER, e.value.id)"
      />
    </li>

    <li><Button label="Visiteur" style="font-size: 20px; padding: 3px 8px" /></li>
    <li><Button label="Rester déconnecté" style="font-size: 20px; padding: 3px 8px" /></li>
  </ul>
</template>
