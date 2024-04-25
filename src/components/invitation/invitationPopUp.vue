<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInvitationStore } from '../../stores/invitationStore';
import orgInviteHelper from '../../components/modules/orgInviteHelper';
import SingleInvitation from './singleInvitation.vue';
import type { Invitation } from '../../interfaces/i_invitation';

const { numberOfInvites } = orgInviteHelper();

const invitationStore = useInvitationStore();
const invitations = ref([] as Invitation[]);

onMounted(() => {
    numberOfInvites();
    invitations.value = invitationStore.getInvitations();
})
</script>

<template>
    <article class="flex max-h-64 w-36">
        <section class="flex flex-col">
            <div v-for="inv in invitations" :key="inv.id">
                <SingleInvitation :inv="inv"></SingleInvitation>
            </div>
        </section>
    </article>
</template>