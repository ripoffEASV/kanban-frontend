<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from "./components/headerComponent.vue"
</script>

<template>
  <div class="h-full overflow-auto">
    <HeaderComponent></HeaderComponent>
    <RouterView/>
  </div>

</template>

<style scoped>
</style>
