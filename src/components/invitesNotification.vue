<script setup lang="ts">
import { computed } from 'vue';
import { useInvitationStore } from '../stores/invitationStore';

const invitationStore = useInvitationStore();

const invitationDisplay = computed(() => {
  const count = invitationStore.countInvitations();
  if (count > 9) {
    return '9+';
  } else {
    return count.toString();
  }
});
</script>

<template>
    <article class="p-4">
        <section class="flex justify-center items-center bg-blue-600 w-10 h-10 rounded-full relative cursor-pointer">
            <i class="bi bi-bell-fill text-3xl text-white"></i>
            <span v-if="invitationDisplay > '0'" class="flex justify-center items-center text-white font-bold text-xs w-5 h-5 bg-red-600 rounded-full absolute bottom-0 right-0 transform translate-x-1/5 -translate-y-1/5 pointer-events-none">
                {{ invitationDisplay }}
            </span>
        </section>
    </article>
</template>