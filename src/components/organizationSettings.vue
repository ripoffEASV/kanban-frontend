<script setup lang="ts">
import type { InviteUser } from '../interfaces/i_inviteUser';
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { addNewOrganization, updateOrganization  } from '../components/modules/organizationCRUD.js';
import type { Organization } from '@/interfaces/i_organization';

const inviteArray = ref([] as string[]);
const inputEmail = ref('');
const isDisabledAddUser = ref(true);

const formGroup = ref({
    inputEmail: '',
    inputOrgName: '',
    inputOrgOwner: '123'
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
    formGroup.value.inputOrgName = props.org.orgName;
    formGroup.value.inputOrgOwner = props.org.owner[0].email;
})

const emitGetOrgs = () => {
    emits('getOrgs');
}

const removeInvitedUser = (index: number) => {
  inviteArray.value.splice(index, 1)
}

const addUserToInvite = (inviteEmail: string) => {
  inviteArray.value.push(inviteEmail);
}

const addOrganization = async () => {
  try {
    /* if (inputOrgName.value == '') {
      orgNameValid.value = 'has-error'
      throw new Error('Please input an organization name')
    } */

    const org: Organization = {
        orgID: props.org._id,
        orgName: formGroup.value.inputOrgName,
        createdByID: props.org.createdByID,
        ownerID: formGroup.value.inputOrgOwner,
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
                <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                v-on:click="toggleFalseSettingsModal"
                ></button>
            </div>
            <div class="modal-body d-flex flex-column">
                <div class="modal_flex_item">
                    <div class="modal_flex_item_title">
                        <span class="text-dark">Organization created by</span>
                    </div>

                    <div class="modal_flex_item flex-row">
                        <userAvatar
                            :f-name="props.org.createdByUser[0].fName"
                            :l-name="props.org.createdByUser[0].lName"
                            :color="props.org.createdByUser[0].color"
                        ></userAvatar>
                        <span class="ms-1 my-auto text-dark">
                            {{ props.org.createdByUser[0].fName }}
                            {{ props.org.createdByUser[0].lName }}
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

                <div class="modal_flex_item">
                    <div class="modal_flex_item_title">
                        <span class="text-dark">Organization Owner</span>
                    </div>

                    <div class="modal_flex_item_content">
                        <input type="text" v-model="formGroup.inputOrgOwner" :class="['form-control']" />
                    </div>
                </div>

                <div class="modal_flex_item">
                    <div class="modal_flex_item_title">
                        <span class="text-dark">Organization Members</span>
                    </div>

                    <div class="modal_flex_item_content d-flex flex-row">
                        <input
                            type="email"
                            v-model="formGroup.inputEmail"
                            placeholder="Email"
                            :class="['form-control me-3', isEmailValid()]"/>
                        <button
                            type="button"
                            v-on:click="addUserToInvite(formGroup.inputEmail)"
                            class="btn btn-primary"
                            :disabled="isDisabledAddUser">
                                Add
                        </button>
                    </div>
                    <div class="modal_flex_item_content">
                        <!-- <OverlayScrollbarsComponent class="invited_div">
                            <div v-for="(user, index) in props.org.inviteArray" :key="user.email">
                                <div class="invite_user_item">
                                    <span class="text-dark">{{ index + 1 }}: {{ user.email }}</span>
                                    <button
                                        @click="removeInvitedUser(user)"
                                        type="button"
                                        class="btn btn-danger px-2 py-0 ms-auto">
                                        X
                                    </button>
                                </div>
                            </div>
                        </OverlayScrollbarsComponent> -->

                        <div class="separator bg-dark my-1"></div>
                            <OverlayScrollbarsComponent class="existing_members_div">
                                <div v-for="(user, index) in inviteArray" :key="user">
                                    <div class="existing_user_item">
                                        <span class="text-dark">{{ index + 1 }}: {{ user }}</span>
                                        <button
                                            @click="removeInvitedUser(index)"
                                            type="button"
                                            class="btn btn-danger px-2 py-0 ms-auto"
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            </OverlayScrollbarsComponent>
                        </div>
                    </div>
                </div>
            <div class="modal-footer">
                <button type="button" v-on:click="toggleFalseSettingsModal" class="btn btn-secondary">
                    Close
                </button>
                <button type="button" v-on:click="addOrganization" class="btn btn-primary">
                    Update Organization
                </button>
            </div>
        </div>
    </div>
</template>
