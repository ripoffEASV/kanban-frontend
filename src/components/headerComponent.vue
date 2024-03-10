<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'



</script>

<template>

    <nav class="d-flex flex-row py-2 bg-secondary bg-gradient rounded">
        <button type="button" class="btn btn-primary ms-auto me-2">
            <RouterLink to="/login" class="text-white">login</RouterLink>
        </button>

        <!-- <RouterLink to="/about">About</RouterLink> -->
      </nav>

  </template>