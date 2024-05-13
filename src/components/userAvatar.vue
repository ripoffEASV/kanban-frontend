<template>
  <div
    class="user_avatar_container px-1 py-1 d-flex flex-row"
    :title="fullName"
    :style="{ backgroundColor: props.color }"
  >
    <span class="user_avatar_initials">{{ getInitials(props.fName ?? '') }}</span>
    <span class="user_avatar_initials">{{ getInitials(props.lName ?? '') }}</span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  fName: String,
  lName: String,
  color: String
})

const fullName = props.fName + ' ' + props.lName

const getInitials = (name: String) => {
  return name.substring(0, 1).toUpperCase()
}
</script>

<style scoped>
.user_avatar_container {
  height: 28px;
  width: 28px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.37);
}

.user_avatar_initials {
  color: white;
  display: flex;
  margin: auto;
  line-height: 0px;
  font-size: 12px;
  font-weight: bold;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}
</style>
