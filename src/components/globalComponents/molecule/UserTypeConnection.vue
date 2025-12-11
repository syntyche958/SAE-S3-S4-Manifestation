<!-- <template>
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
</template> -->

<template>
  <div class="card">
    <div class="flex flex-col md:flex-row">
      <LoginForm @close-dialog="closeDialog" />
      <div class="w-full md:w-2/12">
        <Divider layout="vertical" class="hidden! md:flex!"><b>OR</b></Divider>
        <Divider layout="horizontal" class="flex! md:hidden!" align="center"><b>OR</b></Divider>
      </div>
      <div class="w-full md:w-5/12 flex items-center justify-center py-5">
        <SignInForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Divider } from 'primevue'
// import { computed, ref } from 'vue'
// import { useProviderStore } from '@/stores/providers'
// import { UserTypeEnum } from '@/enums/User.enum.js'
// import { useAuthStore } from '@/stores/auth.js'
// import { useRouter } from 'vue-router'
import LoginForm from './LoginForm.vue'
import SignInForm from './SignInForm.vue'
// import { ref } from 'vue'

// const router = useRouter()
// const authStore = useAuthStore()
// const providerStore = useProviderStore()

// const selectedProvider = ref(null)
const emit = defineEmits(['hide-dialog'])
// const items = computed(() => {
//   return providerStore.providers.map((provider) => ({
//     label: provider.name,
//     id: provider.id,
//   }))
// })

function closeDialog() {
  emit('hide-dialog')
}

// function login(userType, id = undefined) {
//   if (userType === UserTypeEnum.ADMIN) {
//     authStore.login({ id: 1, type: userType })
//   } else if (userType === UserTypeEnum.PROVIDER) {
//     const userId = providerStore.get(id).userId
//     authStore.login({ id: userId, type: userType })
//   }
//   emit('hide-dialog')
// }
</script>
