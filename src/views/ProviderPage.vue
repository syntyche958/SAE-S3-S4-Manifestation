<template>
  <body>
    <div class="content">
      <div class="card" style="max-width: 400px">
        <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 640px">
          <template #item="slotProps">
            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />
          </template>
          <template #thumbnail="slotProps">
            <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
          </template>
        </Galleria>
      </div>

      <div class="card-presentation-wrapper">
        <Card class="card-presentation">
          <template #content>
            <div>
              <img :src="placeholder" alt="photo" />
            </div>

            <div>
              <h2>Qui sommes-nous ?</h2>
              <p class="m-0">
                Nous sommes une troupe de théâtre représentant l'association
                <i>"Troubadours Modernes"</i>. Nous proposons deux activités durant cet évènement :
                spectacle pour enfants sur une petite scène, et un concert médiéval uniquement joué
                avec des instruments d'époque.
              </p>
            </div>
          </template>
        </Card>
      </div>

    </div>

    <section style="margin: 3rem">
      <h1>Activités</h1>
      <div class="list-activity-cards">
        <div v-for="(item, index) in activities" :key="index">
          <Card class="activity-card" style="width: 250px; overflow: hidden">
            <template #header>
              <img style="object-fit: cover" alt="user header" :src=item.image />
            </template>
            <template #title>{{item.name}}</template>
            <template #content>
              <p class="m-0">
                {{ item.description_text }}
              </p>
            </template>
          </Card>
        </div>
      </div>
    </section>
  </body>
</template>


<script setup>
import { PhotoService } from '@/services/provider.service.js'
import Card from 'primevue/card'
import Galleria from 'primevue/galleria'
import placeholder from '@/assets/images/photos/placeholder.png'

import { ref, onMounted } from 'vue'

onMounted(() => {
  PhotoService.getImages().then((data) => (images.value = data))
})

const images = ref()
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
  }
]
 
</script>

<style scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5rem;
  margin-bottom: 2rem;
}

.card-presentation-wrapper {
  display: inline-block;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: 2rem;
}

.activity-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}


body {
  padding: 2rem;
  color: #142557;
}

h1, h2 {
  padding-bottom: 0.3rem;
  font-weight: 600;
  letter-spacing: 1px;
}

img {
  border-radius: 10px;
}
</style>
