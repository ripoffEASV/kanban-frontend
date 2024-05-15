<template>
  <h4 :style="{ backgroundColor: props.color }">{{ props.title }}</h4>
</template>
<script setup lang="ts">
const props = defineProps<{
  title: string
  color: string
}>()
</script>
