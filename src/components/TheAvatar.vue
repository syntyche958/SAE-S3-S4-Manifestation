<template>
  <div @click="visible = !visible" class="cursor-pointer">
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

  <Dialog
    v-model:visible="dialogVisible"
    header="Messages"
    :style="{ width: 'auto' }"
    position="topright"
    :modal="true"
    :draggable="false"
  >
    <span
      v-if="contactStore.contacts.length === 0"
      class="text-surface-500 dark:text-surface-400 block mb-8"
      >Pas de nouveau message</span
    >
    <DataTable
      v-if="contactStore.contacts.length !== 0"
      :value="contactStore.contacts"
      tableStyle="min-width: 50rem"
    >
      <Column field="activityId" header="Activité"></Column>
      <Column field="message" header="Message"></Column>
      <Column field="id" header="Actions">
        <template #body="{ data }"
          ><div class="flex">
            <Button label="Répondre" icon="pi pi-envelope" @click="() => envoyerMail(data.mail)" />
            <Button
              label="Marqué comme terminé"
              icon="pi pi-check-circle"
              @click="() => contactStore.removeContact(data.id)"
            />
          </div> </template
      ></Column>
    </DataTable>
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

const contactStore = useContactStore()
const authStore = useAuthStore()
const providerStore = useProviderStore()

const userName = computed(() => {
  if (authStore.user.type === UserTypeEnum.ADMIN) return 'ADMIN'
  let providerId = authStore.user.id
  return providerStore.providers.find((p) => p.id == providerId).name
})

const visible = ref(false)
const dialogVisible = ref(false)

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
      command: () => (dialogVisible.value = true),
    })
  }
  res.push({
    label: 'Se déconnecter',
    icon: 'pi pi-sign-out',
    command: () => console.log('TODO'),
  })

  return res
})

const envoyerMail = (mail) => {
  window.location.href = `mailto:${mail}`
}
</script>
