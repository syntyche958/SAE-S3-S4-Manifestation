<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router/index.js'
import { UserTypeEnum } from '@/enums/User.enum.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import Editor from '@/components/providerComponents/ProviderEditor.vue'
import { useAuthStore } from '@/stores/auth.js'
import { useActivityStore } from '@/stores/activities'
import { ref } from 'vue'
import placeholder from '@/assets/images/photos/placeholder.jpg'

const route = useRoute()
const visibleActivity = ref(false)
const authStore = useAuthStore()
const activityStore = useActivityStore()

const activities = computed(() => {
  const providerId = Number.parseInt(route.params.provider_id)
  return activityStore.activities.filter((a) => a.providerId === providerId)
})

function goToActivity(activityId) {
  router.push({
    name: 'activity_page',
    params: {
      provider_id: route.params.provider_id,
      activity_id: activityId,
    },
  })
}
</script>

<template>
  <section style="margin: 3rem">
    <h1>{{ $t('message.activities') }}</h1>
    <div class="list-activity-cards">
      <div v-for="(item, index) in activities" :key="index">
        <Card
          class="activity-card"
          style="width: 250px; overflow: hidden; cursor: pointer"
          @click="goToActivity(item.id)"
        >
          <template #header>
            <img style="object-fit: cover" alt="user header" :src="placeholder" />
          </template>
          <template #title>{{ item.name }}</template>
          <template #content>
            <p class="m-0">
              {{ item.description }}
            </p>
          </template>
        </Card>
        <div
          v-if="
            authStore.user?.type === UserTypeEnum.ADMIN ||
            (authStore.user?.type === UserTypeEnum.PROVIDER &&
              Number.parseInt(route.params.provider_id) === authStore.user?.id)
          "
        >
          <div class="card flex justify-center" style="margin-top: 25px">
            <Button
              icon="pi pi-pen-to-square"
              style="font-size: 25px; padding: 0 6px"
              @click="visibleActivity = true"
            />
            <Dialog
              v-model:visible="visibleActivity"
              modal
              header="Modification des activités : "
              :style="{ width: '50vw' }"
              :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            >
              <Editor v-for="(item2, index2) in activities" :key="index2" />
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.list-activity-cards {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
}

.activity-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  margin: 2rem;
}

.activity-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}
</style>
