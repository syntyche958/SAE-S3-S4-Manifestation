<template>
  <div @click="onAvatarClick" class="cursor-pointer">
    <OverlayBadge v-if="avatarBadgeCount > 0" class="inline-flex" size="xsmall">
      <Avatar icon="pi pi-user" class="mr-2" size="medium" shape="square" />
    </OverlayBadge>

    <Avatar v-else icon="pi pi-user" class="mr-2" size="medium" shape="square" />
  </div>

  <Menu v-if="visible" :model="items" class="absolute transform -translate-x-[75%]">
    <template #start>
      <div class="flex justify-center my-2">
        <b>{{ profileName }}</b>
      </div>
    </template>

    <template #item="{ item, props }">
      <a v-ripple class="flex items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span>{{ item.label }}</span>
        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
      </a>
    </template>
  </Menu>

  <Dialog
    v-model:visible="dialogVisible"
    :header="$t('message.messages')"
    :style="{ width: 'auto' }"
    position="topright"
    :modal="true"
    :draggable="false"
  >
    <span v-if="contacts.length === 0" class="text-surface-500 dark:text-surface-400 block mb-8">{{
      $t('message.noNewMessage')
    }}</span>
    <DataTable v-if="contacts.length !== 0" :value="contacts" tableStyle="min-width: 50rem">
      <Column field="activityId" :header="$t('message.activity')"></Column>
      <Column field="message" header="Message"></Column>
      <Column field="id" :header="$t('message.actions')">
        <template #body="{ data }"
          ><div class="flex">
            <Button :label="$t('message.reply')" icon="pi pi-envelope" @click="() => sendMail(data.mail)" />
            <Button
              :label="$t('message.markedAsDone')"
              icon="pi pi-check-circle"
              @click="() => contactStore.removeContact(data.id)"
            />
          </div> </template
      ></Column>
    </DataTable>
  </Dialog>

  <Dialog
    v-model:visible="visitorDialogVisible"
    header="Notifications"
    :style="{ width: 'auto' }"
    position="topright"
    :modal="true"
    :draggable="false"
  >
    <span
      v-if="notifications.length === 0"
      class="text-surface-500 dark:text-surface-400 block mb-8"
    >
      Aucune nouvelle notification.
    </span>

    <DataTable
      v-if="notifications.length !== 0"
      :value="notifications"
      tableStyle="min-width: 40rem"
    >
      <Column field="message" header="Message"></Column>
      <Column field="createdAt" header="Date">
        <template #body="{ data }">{{ formatNotificationDate(data.createdAt) }}</template>
      </Column>
    </DataTable>

    <div class="flex justify-end mt-4" v-if="notifications.length !== 0">
      <Button label="Marquer comme lu" icon="pi pi-check" @click="markVisitorNotificationsAsRead" />
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import OverlayBadge from 'primevue/overlaybadge'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import { useContactStore } from '@/stores/contact'
import { useAuthStore } from '@/stores/auth'
import { UserTypeEnum } from '@/enums/User.enum'
import { useProviderStore } from '@/stores/providers'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  clearNotificationsForUser,
  getNotificationsForUser,
} from '@/utils/visitorNotifications.utils'

const { t } = useI18n()

const router = useRouter()
const contactStore = useContactStore()
const authStore = useAuthStore()
const providerStore = useProviderStore()

const contacts = computed(() => {
  if (authStore.user.type !== UserTypeEnum.PROVIDER) return []

  const provider = providerStore.providers.find((p) => p.userId === authStore.user.id)
  if (!provider) return []

  return contactStore.contacts
    ? contactStore.contacts.filter((c) => c.providerId === provider.id)
    : []
})

const profileName = computed(() => {
  if (authStore.user.type === UserTypeEnum.ADMIN) return 'ADMIN'
  if (authStore.user.type === UserTypeEnum.PROVIDER) {
    return providerStore.providers.find((p) => p.userId == authStore.user.id).name
  }

  return authStore.user.mail
})

const visible = ref(false)
const dialogVisible = ref(false)
const visitorDialogVisible = ref(false)
const notifications = ref([])

const refreshNotifications = async () => {
  if (
    authStore.user?.type !== UserTypeEnum.VISITOR &&
    authStore.user?.type !== UserTypeEnum.PROVIDER
  ) {
    notifications.value = []
    return
  }

  notifications.value = await getNotificationsForUser(authStore.user?.id)
}

const avatarBadgeCount = computed(() => {
  if (authStore.user?.type === UserTypeEnum.PROVIDER)
    return contacts.value.length + notifications.value.length
  if (authStore.user?.type === UserTypeEnum.VISITOR) return notifications.value.length
  return 0
})

const onAvatarClick = async () => {
  await refreshNotifications()
  visible.value = !visible.value
}

const markVisitorNotificationsAsRead = async () => {
  await clearNotificationsForUser(authStore.user?.id)
  notifications.value = []
  visitorDialogVisible.value = false
}

const formatNotificationDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('fr-FR')
}

const items = computed(() => {
  let res = [
    {
      separator: true,
    },
  ]

  if (authStore.user?.id) {
    res.push({
      label: t('message.yourReservations'),
      icon: 'pi pi-calendar',
      command: () => {
        router.push('/reservations')
      },
    })
  }

  if (authStore.user?.type === UserTypeEnum.PROVIDER) {
    res.push({
      label: t('message.messages'),
      icon: 'pi pi-inbox',
      badge: contacts.value.length,
      command: () => (dialogVisible.value = true),
    })
  }

  if (
    authStore.user?.type === UserTypeEnum.VISITOR ||
    authStore.user?.type === UserTypeEnum.PROVIDER
  ) {
    res.push({
      label: 'Notifications',
      icon: 'pi pi-bell',
      badge: notifications.value.length,
      command: async () => {
        await refreshNotifications()
        visitorDialogVisible.value = true
      },
    })
  }

  res.push({
    label: t('message.logout'),
    icon: 'pi pi-sign-out',
    command: () => {
      authStore.logout()
      router.push('/')
    },
  })

  return res
})

const sendMail = (mail) => {
  window.location.href = `mailto:${mail}`
}
</script>
