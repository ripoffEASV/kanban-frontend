<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { addNewOrganization, updateOrganization, deleteOrganization  } from '../components/modules/organizationCRUD.js';
import type { Organization } from '../interfaces/i_organization';
import type { User } from '../interfaces/i_user';
import userAvatar from '../components/userAvatar.vue';

const inviteArray = ref<string[]>([]);
const ownerArray = ref<User[]>([]);
const memberArray = ref<User[]>([]);
const inputEmail = ref('');
const isDisabledAddUser = ref(true);

const formGroup = ref({
    inputEmail: '',
    inputOrgName: '',
    deleteBox: false
});
let regex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

const props = defineProps({
  org: null,
})

const emits = defineEmits(['closeSettingsModal', 'getOrgs'])

const toggleFalseSettingsModal = () => {
  emits('closeSettingsModal')
}

onMounted(() => {
    props.org.inviteArray.forEach((user: string) => {
        inviteArray.value.push(user);
    });
    console.log(props.org);
    props.org.owner.forEach((user: User) => {
        ownerArray.value.push(user);
    })
    props.org.members.forEach((user: User) => {
        memberArray.value.push(user);
    })
    formGroup.value.inputOrgName = props.org.orgName;
})

const emitGetOrgs = () => {
    emits('getOrgs');
}

const removeInvitedUser = (index: number) => {
  inviteArray.value.splice(index, 1)
}

const removeMember = (index: number) => {
    memberArray.value.splice(index, 1)
}

const toggleOwner = (user: User): void => {
    const index = ownerArray.value.findIndex((u) => u.id === user.id);

    if (index >= 0) {
        ownerArray.value.splice(index, 1);
    } else {
        ownerArray.value.push(user);
    }
}

const addUserToInvite = (inviteEmail: string) => {
    formGroup.value.inputEmail = '';
  inviteArray.value.push(inviteEmail);
}

const addOrganization = async () => {
  try {
    if (formGroup.value.inputOrgName == '') {
      return;
    }
    const owners = ownerArray.value.map(o => o.id) as string[];

    const org: Organization = {
        orgID: props.org._id,
        orgName: formGroup.value.inputOrgName,
        createdByID: props.org.createdByID,
        ownerID: owners,
        orgMembers: props.org.orgMembers,
        projectIDs: props.org.projectIDs,
        inviteArray: inviteArray.value
    } 
    
    await updateOrganization(org);
    emitGetOrgs()
    toggleFalseSettingsModal();
  } catch (error) {
    console.error(error);
  }
}

const deleteOrg = async () => {
    if (!formGroup.value.deleteBox) {
        return;
    }
    try {
        await deleteOrganization(props.org._id);
        toggleFalseSettingsModal();
    } catch(error) {
        console.error(error);
    }
}

const isEmailValid = () => {
  formGroup.value.inputEmail == ''
    ? ''
    : regex.test(formGroup.value.inputEmail)
      ? (isDisabledAddUser.value = false)
      : (isDisabledAddUser.value = true)
  return formGroup.value.inputEmail == '' ? '' : regex.test(formGroup.value.inputEmail) ? 'has-success' : 'has-error'
}

</script>

<template>
    <div class="modal-dialog my-auto px-3">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title pe-3 text-dark">Organization Settings</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                    v-on:click="toggleFalseSettingsModal"></button>
            </div>
            <div class="modal-body d-flex flex-column">
                <div class="modal_flex_item">
                    <div class="modal_flex_item_title">
                        <span class="text-dark">Organization created by</span>
                    </div>

                    <div class="modal_flex_item flex-row">
                        <userAvatar :f-name="props.org.createdByUser[0].fName"
                            :l-name="props.org.createdByUser[0].lName" :color="props.org.createdByUser[0].color">
                        </userAvatar>
                        <span class="ms-1 my-auto text-dark">
                            {{ props.org.createdByUser[0].fName }}
                            {{ props.org.createdByUser[0].lName }}
                            ({{ props.org.createdByUser[0].email }})
                        </span>
                    </div>
                </div>

                <div class="modal_flex_item">
                    <div class="modal_flex_item_title">
                        <span class="text-dark">Organization Name</span>
                    </div>

                    <div class="modal_flex_item_content">
                        <input type="text" v-model="formGroup.inputOrgName" :class="['form-control']" />
                    </div>
                </div>

                <!-- <div class="modal_flex_item">
                    <div class="modal_flex_item_title">
                        <span class="text-dark">Organization Owner</span>
                    </div>

                    <div class="modal_flex_item_content">
                        <input type="text" v-model="formGroup.inputOrgOwner" :class="['form-control']" />
                    </div>
                </div> -->

                <h1 class="text-black mt-2">Current members</h1>
                <OverlayScrollbarsComponent class="existing_members_div" v-if="memberArray.length > 0">
                    <div v-for="(user, index) in memberArray" :key="user.id">
                        <div class="existing_user_item">
                            <span class="text-dark">
                                {{ index + 1 }}:
                                {{ user.fName }} {{ user.lName }}
                                ({{ user.email }})
                                <i v-if="ownerArray.some(owner => owner.id === user.id)"
                                    v-b-tooltip.hover
                                    title="This user is an owner"
                                    class="bi bi-asterisk"></i>
                            </span>
                            <button @click="removeMember(index)" type="button" class="btn btn-danger px-2 py-0 ms-auto">
                                X
                            </button>
                            <button @click="toggleOwner(user)" type="button" class="btn btn-primary px-2 py-0 ms-auto">
                                {{ ownerArray.some(owner => owner.id === user.id) ? 'Demote' : 'Promote' }}
                            </button>
                        </div>
                    </div>
                </OverlayScrollbarsComponent>
                <div v-else class="text-red-600">There is no members assigned</div>

                <div class="modal_flex_item">
                    <div class="modal_flex_item_title">
                        <span class="text-dark">Organization Members</span>
                    </div>

                    <div class="modal_flex_item_content d-flex flex-row">
                        <input type="email" v-model="formGroup.inputEmail" placeholder="Email"
                            :class="['form-control me-3', isEmailValid()]" />
                        <button type="button" v-on:click="addUserToInvite(formGroup.inputEmail)" class="btn btn-primary"
                            :disabled="isDisabledAddUser">
                            Add
                        </button>
                    </div>
                    <div class="modal_flex_item_content">
                        <div class="separator bg-dark my-1"></div>
                        <h1 class="text-black">Invites</h1>
                        <OverlayScrollbarsComponent class="existing_members_div" v-if="inviteArray.length > 0">
                            <div v-for="(user, index) in inviteArray" :key="user">
                                <div class="existing_user_item">
                                    <span class="text-dark">{{ index + 1 }}: {{ user }}</span>
                                    <button @click="removeInvitedUser(index)" type="button"
                                        class="btn btn-danger px-2 py-0 ms-auto">
                                        X
                                    </button>
                                </div>
                            </div>
                        </OverlayScrollbarsComponent>
                        <div v-else class="text-red-600">No one currently has pending invites</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer flex flex-col">
                <section class="flex gap-2">
                    <button type="button" v-on:click="toggleFalseSettingsModal" class="btn btn-secondary">
                        Close
                    </button>
                    <button type="button" v-on:click="addOrganization" class="btn btn-primary">
                        Update Organization
                    </button>
                </section>
                <section class="flex gap-2">
                    <label class="text-black flex justify-center flex-col items-center">
                        <span>Confirm deletion</span>
                        <input type="checkbox" v-model="formGroup.deleteBox">
                    </label>
                    <button type="button" v-on:click="deleteOrg" class="btn" :class="`${formGroup.deleteBox ? 'btn-danger' : '!cursor-not-allowed'}`">
                        Delete Organization
                    </button>
                </section>
            </div>
        </div>
    </div>
</template>
