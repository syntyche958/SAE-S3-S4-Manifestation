<script setup>
</script>

<template>
  <div :id="presentation">
    <div :class="'image-container'">
      <img src="@/assets/images/photos/placeholder.png" :alt="'Main activity'" />
      <div :class="'overlay'"></div>
      <h1>Nom Activité</h1>
      <a href="#map" :class="'p-button p-component'"> {{ $t('message.seeMap') }} </a>
    </div>
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
  height: 80vh;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
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
