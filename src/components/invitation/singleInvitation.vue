<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import type { Invitation } from '../../interfaces/i_invitation';
const props = defineProps({
    inv: Object as () => Invitation,
})
</script>

<template>
    <section class="flex flex-row justify-between w-full">
        <section>
            <p>{{ props.inv?.orgName }}</p>
            <section class="flex gap-1">
                <p>{{ props.inv?.owner?.fName }}</p>
                <p>{{ props.inv?.owner?.lName }}</p>
            </section>
        </section>
        
        <button>x</button>
        <button>y</button>
    </section>

</template>