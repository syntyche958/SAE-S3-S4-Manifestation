<script setup>
</script>

<template>
  <div :id="presentation">
    <div :class="'image-container'">
      <img src="@/assets/images/photos/placeholder.png" :alt="'Main Image'" />
      <h1>Nom activité</h1>
      <a href="#map" :class="'p-button p-component'"> Voir l'emplacement </a>
    </div>
  </div>

  <div>
    <Card>
      <template #content>
        <div>
          <h2>Description de l'activité :</h2>
          <p>
            Durant cet évènement médiéval, nous metterons en scène un grand concert d'instruments
            médiévaux, réalisé par des professionnels. Cet évènement est sur réservation. Vous y
            découvrirez des musiques et des instruments que vous n'avez jamais vu auparavant. Si
            vous êtes amateur de musique, d'instruments particuliers ou de l'époque médiévale, alors
            vous adorerez les performances de notre troupe.
          </p>
        </div>
      </template>
    </Card>
  </div>

  <div class="emplacement">
    <h2>Emplacement de l'activité :</h2>
    <div id="map"></div>
  </div>

</template>

<style scoped>
a {
  text-decoration: none;
}

.image-container {
  user-select: none;
  position: relative;
  width: 100%;
  height: 60vh;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#presentation {
  width: 100%;
  height: 80vh;
}

.image-container h1 {
  position: absolute;
  z-index: 1;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -25%);
  color: white;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  pointer-events: none;
  font-size: 100px;
}

@media only screen and (max-width: 950px) {
  .image-container h1 {
    font-size: 50px;
  }
}

.image-container p {
  position: absolute;
  z-index: 1;
  top: 75%;
  left: 50%;
  transform: translate(-50%, -75%);
  color: white;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  pointer-events: none;
}

.image-container a {
  position: absolute;
  z-index: 1;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -90%);
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
}
</style>
