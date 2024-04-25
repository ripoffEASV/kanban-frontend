<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import type { Invitation } from '../../interfaces/i_invitation';
import orgInviteHelper from '../../components/modules/orgInviteHelper';
const { acceptInvite } = orgInviteHelper();
const props = defineProps({
    inv: Object as () => Invitation,
})

const isAnswered = ref(false);

const accept = async () => {
    await acceptInvite(props.inv?.id);
    isAnswered.value = true;
}
</script>

<template>
    <section v-if="!isAnswered" class="flex flex-row w-full border border-dotted border-gray-300 border-x-0 p-1.5">
        <section class="flex-grow">
            <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Organization</h3>
            <p class="text-sm font-medium">{{ props.inv?.orgName }}</p>
            <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-3 mb-1">Owner</h4>
            <section class="flex gap-1">
                <p class="text-sm">{{ props.inv?.owner?.fName }}</p>
                <p class="text-sm">{{ props.inv?.owner?.lName }}</p>
            </section>
        </section>

        <section class="flex justify-end items-center w-full gap-2 pr-2">
            <button class="rounded-full bg-green-600 w-8 h-8 flex justify-center items-center hover:bg-green-700"
                @click="accept">
                <i class="bi bi-check text-white"></i>
            </button>
            <button class="rounded-full bg-red-600 w-8 h-8 flex justify-center items-center hover:bg-red-700">
                <i class="bi bi-x text-white"></i>
            </button>
        </section>
    </section>
</template>