<script setup>
import { RouterView, RouterLink } from 'vue-router'

</script>

<template>
  <header>
    <div>HEADER</div>
     <nav>
        <RouterLink to="/"> Home </RouterLink>
        <RouterLink to="/about"> About </RouterLink>
        <RouterLink to="/Organisateur"> Organisateur </RouterLink>
      </nav>

  </header>

  <RouterView />
</template>
