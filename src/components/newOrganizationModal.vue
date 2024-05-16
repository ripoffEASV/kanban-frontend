<template>
  <div class="modal-dialog my-auto">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title pe-3 text-dark">Create New Organization</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          v-on:click="closeModal"
        ></button>
      </div>
      <div class="modal-body d-flex flex-column">
        <div class="modal_flex_item">
          <div class="modal_flex_item_title">
            <span class="text-dark">Organization Name</span>
          </div>

          <div class="modal_flex_item_content">
            <input
              type="text"
              :class="['form-control', orgNameValid]"
              v-model="inputOrgName"
              @change="orgNameCheck"
            />
          </div>
        </div>

        <div class="modal_flex_item">
          <div class="modal_flex_item_title">
            <span class="text-dark">Organization Members</span>
          </div>

          <div class="modal_flex_item_content d-flex flex-row">
            <input
              type="email"
              v-model="inputEmail"
              placeholder="Email"
              :class="['form-control me-3', isEmailValid()]"
            />
            <button
              type="button"
              v-on:click="addUserToInvite(inputEmail)"
              class="btn btn-primary"
              :disabled="isDisabledAddUser"
            >
              Add
            </button>
          </div>
          <div class="modal_flex_item_content">
            <div class="invited_div">
              <div v-for="(user, index) in inviteArray" :key="user.email">
                <div class="invite_user_item">
                  <span class="text-dark">{{ index + 1 }}: {{ user.email }}</span>
                  <button
                    @click="removeInvitedUser(index)"
                    type="button"
                    class="btn btn-danger px-2 py-0 ms-auto"
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" v-on:click="closeModal" class="btn btn-secondary">Close</button>
        <button type="button" v-on:click="addNewOrganization" class="btn btn-primary">
          Create Organization
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { User } from '@/interfaces/i_user'
import { ref } from 'vue'

import * as OrganizationCRUD from '../components/modules/organizationCRUD.js'

const isDisabledAddUser = ref(true)
const inviteArray = ref([] as User[]) // convert User interface to array, to be able to update ref array
const inputEmail = ref('')
const inputOrgName = ref('')
const orgNameValid = ref('')

const emits = defineEmits(['close', 'reload'])

const closeModal = () => {
  emits('close')
}

let regex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

const addUserToInvite = (inviteEmail: String) => {
  const user: any = {
    email: inviteEmail
  }

  inviteArray.value.push(user)
  inputEmail.value = ''
  isDisabledAddUser.value = true
}

const isEmailValid = () => {
  inputEmail.value == ''
    ? ''
    : regex.test(inputEmail.value)
      ? (isDisabledAddUser.value = false)
      : (isDisabledAddUser.value = true)
  return inputEmail.value == '' ? '' : regex.test(inputEmail.value) ? 'has-success' : 'has-error'
}

const removeInvitedUser = (index: number) => {
  inviteArray.value.splice(index, 1)
}

const addNewOrganization = async () => {
  try {
    if (inputOrgName.value == '') {
      orgNameValid.value = 'has-error'
      throw new Error('Please input an organization name')
    }

    const inviteArr = inviteArray.value.map((inv) => inv.email)

    await OrganizationCRUD.addNewOrganization(inputOrgName.value, inviteArr).then(() => {
      emits('reload')
    })
  } catch (error: any) {
    console.error(error.message)
  }
}

const orgNameCheck = () => {
  if (inputOrgName.value == '') {
    orgNameValid.value = 'has-error'
  }
}
</script>
