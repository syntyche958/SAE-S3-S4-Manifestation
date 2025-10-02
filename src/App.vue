<script setup>
import { RouterView } from 'vue-router'
import Button from "primevue/button"
</script>

<template>
  <header>
    <div>HEADER</div>
    <Button label="ceci est un bouton"></Button>
    <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->

  </header>

  <RouterView />
</template>
