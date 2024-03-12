<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from "./components/headerComponent.vue"
</script>

<template>
  <div class="d-flex h-100 flex-column">
    <HeaderComponent></HeaderComponent>
    <RouterView/>
  </div>

</template>

<style scoped>
</style>
