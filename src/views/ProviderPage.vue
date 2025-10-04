<script setup>
import { ref, onMounted } from 'vue'

import photo from '@/assets/images/placeholder.png'
import Concert_Photo_1 from '@/assets/images/Concert_Photo_1.jpeg'
import Concert_Photo_2 from '@/assets/images/Concert_Photo_2.jpg'
import Spectacle_Photo_1 from '@/assets/images/Spectacle_Photo_1.jpg'
import Spectacle_Photo_2 from '@/assets/images/Spectacle_Photo_2.jpg'

const pause = ref(false)
const container = ref(null)
const bande = ref(null)
let animationFrame
let offset = 0
const speed = 1

const images = [
  { name: 'Concert_Photo_1', image: Concert_Photo_1 },
  { name: 'Concert_Photo_2', image: Concert_Photo_2 },
  { name: 'Spectacle_Photo_1', image: Spectacle_Photo_1 },
  { name: 'Spectacle_Photo_2', image: Spectacle_Photo_2 },
]
const selectedImage = ref(images[0].image)

const activities = [
  {image: photo, text: 'photo1', description_text: "Concert médiéval mettant en scène des chanteurs et des musiciens spécialisés dans la musique d'époque", },
  {image: photo, text: 'photo2', description_text: 'Spectacle humoristique de chasse à la sorcière réservé aux moins de 12 ans'},
  {image: photo, text: 'photo2', description_text: 'Spectacle humoristique de chasse à la sorcière réservé aux moins de 12 ans'}
]

function scroll() {
  if (!pause.value && bande.value && container.value) {
    offset += speed
    const maxOffset = bande.value.scrollWidth - container.value.clientWidth
    if (offset > maxOffset) offset = 0
    bande.value.style.transform = `translateX(-${offset}px)`
  }
  animationFrame = requestAnimationFrame(scroll)
}

onMounted(() => {
  scroll()
})
</script>


<template>
  <div class="content">
    <div class="images">
      <ul class="clean-list">
        <li v-for="(item, index) in images" :key="index" @click="selectedImage = item.image">
          <img :src="item.image" :alt="item.name" class="list-image" />
        </li>
      </ul>

      <img class="grande-image" :src="selectedImage" alt="Main Image" />
    </div>

    <div class="text-zone">
      <img class="profil-pic" src="@/assets/images/profil_pic.jpg" alt="ProfilePic" />
      <div>
        <h2>Troubadours Modernes</h2>
        <p>
          Nous sommes une troupe de théâtre représentant l'association
          <i>"Troubadours Modernes"</i>. Nous proposons deux activités durant cet évènement : un
          spectacle pour enfants sur une petite scène, et un concert médiéval uniquement joué avec
          des instruments d'époque.
        </p>
      </div>
    </div>
  </div>

  <section class="bottom">
    <h1>Activités</h1>
    <div class="bande-defilante" @mouseenter="pause = true" @mouseleave="pause = false" ref="container">
      <div class="bande" ref="bande">
        <div class="activity-card" v-for="(item, index) in activities" :key="index">
          <img class="image-moyenne" :src="item.image" :alt="item.text" />
          <p>{{ item.description_text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');

img {
  border: 2px solid #ddd12e;
  border-radius: 10px;
  max-width: 200px;
}

.clean-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-image {
  width: 60px;
  height: auto;
  cursor: pointer;
}

.content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5rem;
  margin-bottom: 2rem;
}

.images {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.image-moyenne {
  width: auto;
}

.grande-image {
  height: auto;
}

.text-zone {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  gap: 20px;
  margin-left: 2rem;
  max-width: 900px;
  background-color: #e5e5e5;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ddd12e;
  color: #142557;
  font-family: 'Cormorant Garamond', serif;
}

.activities {
  display: flex;
  flex-wrap: wrap;
  column-gap: 5rem;
  row-gap: 3rem;
  justify-content: center;
  background-color: #fafafa;
  padding: 2rem;
  color: #142557;
  font-family: 'Cormorant Garamond', serif;
}

.activity-card {
  flex: 1 1 calc(50% - 2rem);
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  font-size: 18px;
  gap: 20px;
  padding: 1rem;
  background: #e5e5e5;
  border: 1px solid #ddd12e;
  border-radius: 8px;
  color: #142557;
  font-family: 'Cormorant Garamond', serif;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.activity-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.activity-card h3 {
  color: #142557;
}

.activity-card p {
  color: #142557;
}

.bottom {
  margin-left: 3rem;
  margin-right: 3rem;
  margin-bottom: 3rem;
}

body {
  padding: 0;
  background-color: #efefef;
  color: #142557;
  font-family: 'Cormorant Garamond', serif;
}

h1,
h2 {
  padding-bottom: 0.3rem;
  color: #142557;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  letter-spacing: 1px;
}

a,
button {
  color: #142557;
  background-color: #c42929;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s;
  font-family: 'Cormorant Garamond', serif;
}

a:hover,
button:hover {
  background-color: #7a1f1f;
}





.bande-defilante {
  overflow: hidden;
  width: 100%;
  padding: 1rem 0;
}

.bande {
  display: flex;
  gap: 2rem;
  transition: transform 0.1s linear; /* défilement via JS */
}

.activity-card {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem;
  background: #e5e5e5;
  border: 1px solid #ddd12e;
  border-radius: 8px;
}

</style>
