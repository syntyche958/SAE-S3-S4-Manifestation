<script setup>
import Card from 'primevue/card'
import Galleria from 'primevue/galleria'
import placeholder from '@/assets/images/photos/placeholder.png'
import { ref, watchEffect } from 'vue'
import { useProviderStore } from '@/stores/providers'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useDescriptionStore } from '@/stores/providerDescription.js'
import Editor from '@/components/providerComponents/ProviderEditor.vue'
import { UserTypeEnum } from '@/enums/User.enum.js'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

const route = useRoute()
const providerStore = useProviderStore()
const images = ref()
const visibleCarrousel = ref(false)
const visibleDescription = ref(false)
const visibleActivity = ref(false)
const providerDescription = useDescriptionStore()

watchEffect(() => {
  if (providerDescription.closeDialog) {
    visibleDescription.value = false
    providerDescription.closeDialog = false
  }
})

watchEffect(
  async () =>
    (images.value = await providerStore.getProviderImages(
      Number.parseInt(route.params.provider_id),
    )),
)

const responsiveOptions = ref([
  {
    breakpoint: '1300px',
    numVisible: 4,
  },
  {
    breakpoint: '575px',
    numVisible: 1,
  },
])
const activities = [
  {
    image: placeholder,
    text: 'photo1',
    name: 'Concert médiéval',
    description_text:
      "Concert médiéval mettant en scène des chanteurs et des musiciens spécialisés dans la musique d'époque",
  },
  {
    image: placeholder,
    text: 'photo2',
    name: 'Chasse à la sorcière',
    description_text: 'Spectacle humoristique de chasse à la sorcière réservé aux moins de 12 ans',
  },
]
const goToActivity = () => {
  window.location.href = '/provider/activity'
}

// TODO : Aspect texte différent (non modifiable) par le visiteur
</script>

<template>
  <div>
    <div class="content">
      <div class="card" style="max-width: 400px">
        <Galleria
          :value="images"
          :responsiveOptions="responsiveOptions"
          :numVisible="5"
          containerStyle="max-width: 640px"
        >
          <template #item="slotProps">
            <img
              :src="slotProps.item.itemImageSrc"
              :alt="slotProps.item.alt"
              style="width: 100%; border-radius: 5px"
            />
          </template>
          <template #thumbnail="slotProps">
            <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
          </template>
        </Galleria>
        <div
          v-if="
            authStore.user?.type === UserTypeEnum.ADMIN ||
            (authStore.user?.type === UserTypeEnum.PROVIDER &&
              Number.parseInt(route.params.provider_id) === authStore.user?.id)
          "
        >
          <div class="card flex justify-center" style="margin-top: 25px">
            <Button
              label="✎"
              style="font-size: 25px; padding: 0 6px"
              @click="visibleCarrousel = true"
            />
            <Dialog
              v-model:visible="visibleCarrousel"
              modal
              header="Modification des images : "
              :style="{ width: '50vw' }"
              :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            >
              <Editor />
            </Dialog>
          </div>
        </div>
      </div>

      <div>
        <Card class="card-presentation">
          <template #content>
            <div><img :src="placeholder" alt="presentation card" /><br /></div>

            <div>
              <h2>Qui sommes-nous ?</h2>
              <div class="description-content" v-html="providerDescription.description"></div>
            </div>
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
              label="✎"
              style="font-size: 25px; padding: 0 6px"
              @click="visibleDescription = true"
            />
            <Dialog
              v-model:visible="visibleDescription"
              modal
              header="Modification du texte de présentation : "
              :style="{ width: '50vw' }"
              :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            >
              <Editor />
            </Dialog>
          </div>
        </div>
      </div>
    </div>

    <section style="margin: 3rem">
      <h1>Activités</h1>
      <div class="list-activity-cards">
        <div v-for="(item, index) in activities" :key="index">
          <Card
            class="activity-card"
            style="width: 250px; overflow: hidden; cursor: pointer"
            @click="goToActivity"
          >
            <template #header>
              <img style="object-fit: cover" alt="user header" :src="item.image" />
            </template>
            <template #title>{{ item.name }}</template>
            <template #content>
              <p class="m-0">
                {{ item.description_text }}
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
                label="✎"
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
  </div>
</template>

<style scoped>
.content {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5rem;
  margin-bottom: 2rem;
  flex: 1;
  overflow-y: auto;
}

.card-presentation-wrapper {
  display: inline-block;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: 10px;
}

.card-presentation-wrapper:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

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

/* Nouveau style du menu prestataire : collé à la navbar, en haut à gauche */

.section h2 {
  color: var(--text-color, #212529);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color, #3b82f6);
}

.activity-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

h1,
h2 {
  padding-bottom: 0.3rem;
  font-weight: 600;
  letter-spacing: 1px;
}

a {
  text-decoration: none;
}

img {
  border-radius: 10px;
}

body {
  margin: 0;
  padding: 0;
  color: #142557;
}
</style>
