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
    <article class="flex max-h-64 w-48">
        <section class="flex flex-col w-full overflow-auto !border bg-slate-900">
            <div v-for="inv in invitations" :key="inv.id" class="!border-b !border-dashed ">
                <SingleInvitation :inv="inv"></SingleInvitation>
            </div>
        </section>
    </article>
</template>