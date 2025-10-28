<template>
  <div @click="visible = !visible">
    <OverlayBadge
      v-if="contactStore.contacts.length > 0 && authStore.user?.type === UserTypeEnum.PROVIDER"
      class="inline-flex"
      size="xsmall"
    >
      <Avatar icon="pi pi-user" class="mr-2" size="medium" shape="square"
    /></OverlayBadge>

    <Avatar v-else icon="pi pi-user" class="mr-2" size="medium" shape="square" />
  </div>

  <Menu v-if="visible" :model="items" class="absolute transform -translate-x-[75%]">
    <template #start>
      <div class="flex justify-center my-2">
        <b>{{ userName }}</b>
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
</template>

<script setup>
import { computed, ref } from 'vue'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import OverlayBadge from 'primevue/overlaybadge'
import Badge from 'primevue/badge'
import { useContactStore } from '@/stores/contact'
import { useAuthStore } from '@/stores/auth'
import { UserTypeEnum } from '@/enums/User.enum'
import { useProviderStore } from '@/stores/providers'

const contactStore = useContactStore()
const authStore = useAuthStore()
const providerStore = useProviderStore()

const userName = computed(() => {
  if (authStore.user.type === UserTypeEnum.ADMIN) return 'ADMIN'
  let providerId = authStore.user.id
  return providerStore.providers.find((p) => p.id == providerId).name
})

const visible = ref(false)
const items = computed(() => {
  let res = [
    {
      separator: true,
    },
  ]
  if (authStore.user?.type === UserTypeEnum.PROVIDER) {
    res.push({
      label: 'Message',
      icon: 'pi pi-inbox',
      badge: contactStore.contacts.length,
      command: () => console.log('TODO'),
    })
  }
  res.push({
    label: 'Se déconnecter',
    icon: 'pi pi-sign-out',
    command: () => console.log('TODO'),
  })

  return res
})
</script>
