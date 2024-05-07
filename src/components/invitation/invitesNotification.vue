<script setup lang="ts">
import { computed, ref } from 'vue';
import { useInvitationStore } from '../../stores/invitationStore';
import InvitationPopUp from './invitationPopUp.vue';

const invitationStore = useInvitationStore();
const showPopUp = ref(false);

const invitationDisplay = computed(() => {
  const count = invitationStore.countInvitations();
  if (count > 9) {
    return '9+';
  } else {
    return count.toString();
  }
});

const togglePopUp = () => {
  showPopUp.value = !showPopUp.value
}
</script>

<template>
  <article class="p-4">
    <section class="flex justify-center items-center bg-blue-600 w-10 h-10 rounded-full relative cursor-pointer"
      @click="togglePopUp">
      <i class="bi bi-bell-fill text-3xl text-white"></i>
      <span v-if="invitationDisplay > '0'"
        class="flex justify-center items-center text-white font-bold text-xs w-5 h-5 bg-red-600 rounded-full absolute bottom-0 right-0 transform translate-x-1/5 -translate-y-1/5 pointer-events-none">
        {{ invitationDisplay }}
      </span>
    </section>
    <InvitationPopUp v-if="showPopUp" class="absolute top-20 border border-white right-0 translate-x-4"></InvitationPopUp>
  </article>
</template>