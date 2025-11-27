<template>
  <div>
    <div class="fixed flex justify-center z-1001 mt-3 sm:mt-6 w-full">
      <Menubar :model="items" class="z-1001 w-fit sm:w-[95%]">
        <template #end>
          <div style="display: flex">
            <LocaleChanger />
            <div
              v-if="
                authStore.user?.type === UserTypeEnum.ADMIN ||
                authStore.user?.type === UserTypeEnum.PROVIDER
              "
            >
              <TheAvatar />
            </div>
            <div v-else class="card flex justify-center">
              <Button
                :label="$t('message.login')"
                style="font-size: 16px; padding: 2px 6px"
                @click="displayDialog = true"
              />
              <Dialog
                v-model:visible="displayDialog"
                modal
                :header="$t('message.loginAs') + ' '"
                :style="{ width: '50vw' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
              >
                <UserTypeConnection @hide-dialog="displayDialog = false" />
              </Dialog>
            </div>
          </div>
        </template>
      </Menubar>
    </div>
    <div v-if="route.path !== '/'" class="h-20"></div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LocaleChanger from '@/components/LocaleChanger.vue'
import router from '@/router'
import { UserTypeEnum } from '@/enums/User.enum'
import { useProviderStore } from '@/stores/providers'
import { useI18n } from 'vue-i18n'
import TheAvatar from './AvatarMenu.vue'
import UserTypeConnection from '@/components/UserTypeConnection.vue'
import Dialog from 'primevue/dialog'
import { useActivityStore } from '@/stores/activities'

const route = useRoute()
const { t } = useI18n()


const authStore = useAuthStore()
const providerStore = useProviderStore()
const activityStore = useActivityStore()

const displayDialog = ref(false)

const homeItem = {
  label: computed(() => t('message.home')),
  command: () => {
    router.push('/')
  },
}
const adminItem = {
  label: computed(() => t('message.admin')),
  command: () => {
    router.push('/admin')
  },
}

const items = computed(() => {
  let providersItem = {
    label: t('message.providers'),
    items: [],
  }

  for (let provider of providerStore.providers) {
    providersItem.items.push({
      label: provider.name,
      command: () => {
        router.push(`/provider/${provider.id}`)
      },
    })
  }

  let activitiesItem = {
    label: t('message.activities'),
    items: [],
  }
  for (let activity of activityStore.activities) {
    activitiesItem.items.push({
      label: activity.name,
      command: () => {
        router.push(`/provider/${activity.providerId}/activity/${activity.id}`)
      },
    })
  }

  switch (authStore.user?.type) {
    case UserTypeEnum.ADMIN:
      return [homeItem, providersItem, activitiesItem, adminItem]
    default:
      return [homeItem, providersItem, activitiesItem]
  }
})
</script>
