<template>
  <div class="flex justify-evenly">
    <Button
      :label="$t('message.admin')"
      style="font-size: 20px; padding: 3px 8px"
      @click="
        () => {
          login(UserTypeEnum.ADMIN)
          router.push('/admin')
        }
      "
    />
    <Select
      v-model="selectedProvider"
      :options="items"
      optionLabel="label"
      :placeholder="$t('message.provider')"
      @change="
        (e) => {
          const providerId = e.value.id
          login(UserTypeEnum.PROVIDER, providerId)
          router.push(`/provider/${providerId}`)
        }
      "
    /><Button :label="$t('message.visitor')" style="font-size: 20px; padding: 3px 8px" />
  </div>
</template>

<script setup>
import { Button, Select } from 'primevue'
import { computed, ref } from 'vue'
import { useProviderStore } from '@/stores/providers'
import { UserTypeEnum } from '@/enums/User.enum.js'
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'

const router = useRouter()
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
