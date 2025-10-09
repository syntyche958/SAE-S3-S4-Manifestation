<script setup>
  import PresentationProviderSection from "@/components/PresentationProviderSection.vue";
  import SideBarMenuProvider from "@/components/SideBarMenuProvider.vue";
</script>

<template>
  <PresentationProviderSection />
  <SideBarMenuProvider />
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
