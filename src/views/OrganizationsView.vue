<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import * as GLOBAL from '../components/Globals/GLOBALS.js'
import OrgItem from '../components/organization_Item.vue'

import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

interface User {
  email: String
}

interface Org {
  _id: String
  orgName: String
  createdByID: String
  ownerID: String
  orgMembers: []
  projectIDs: []
  inviteArray: []
}

interface CurrentOrg {
  _id: String
  orgName: String
  createdByID: String
  ownerID: String
  orgMembers: []
  projectIDs: []
  inviteArray: []
  createdByUer: []
  owner: []
}

let isShowingModal = ref(false)
let isDisabledAddUser = ref(true)
let inviteArray = ref([] as User[]) // convert User interface to array, to be able to update ref array
let inputEmail = ref('')
let inputOrgName = ref('')
let orgNameValid = ref('')
let organizationsGet = ref([] as Org[]) // use this for later when the backend works...
let currentOrg = ref([] as CurrentOrg[])

let organizations = ref([
  { orgIndex: 1, orgName: 'Tech Innovators Inc.' },
  { orgIndex: 2, orgName: 'Global Solutions Group International' },
  { orgIndex: 3, orgName: 'Infinite Technologies Corporation' },
  { orgIndex: 4, orgName: 'Strategic Visionaries Organization' },
  { orgIndex: 5, orgName: 'Creative Minds Development Association' },
  { orgIndex: 6, orgName: 'Future Enterprise Solutions Co.' },
  { orgIndex: 7, orgName: 'Advanced Research and Development Institute' },
  { orgIndex: 8, orgName: 'Innovative Concepts Exploration Group' },
  { orgIndex: 9, orgName: 'Pioneer Ventures for Cutting-Edge Technologies' },
  { orgIndex: 10, orgName: 'Tech Giants United Ltd.' },
  { orgIndex: 11, orgName: 'International Innovation Hub Corporation' },
  { orgIndex: 12, orgName: 'Revolutionary Technologies Consortium' },
  { orgIndex: 13, orgName: 'Global Excellence Enterprise Solutions' },
  { orgIndex: 14, orgName: 'Synergistic Solutions and Strategies Group' },
  { orgIndex: 15, orgName: 'Inventive Minds Research and Development' },
  { orgIndex: 16, orgName: 'Future Frontier Technologies Co.' },
  { orgIndex: 17, orgName: 'Cutting-Edge Innovations International' },
  { orgIndex: 18, orgName: 'Strategic Visionaries for Global Impact' }
])

let regex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

const toggleModal = () => {
  isShowingModal.value = !isShowingModal.value
}

const toggleModalFalse = () => {
  isShowingModal.value = false
}

const addUserToInvite = (inviteEmail: String) => {
  const user: User = {
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

    const bearerToken = 'bearer ' + localStorage.getItem('auth-token')

    await fetch(GLOBAL.URL + 'organizations/addNewOrganization', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'content-type': 'application/json',
        Authorization: bearerToken
      },
      credentials: 'include',
      body: JSON.stringify({
        orgName: inputOrgName.value,
        createdByID: '',
        ownerID: '',
        orgMembers: [],
        projectIDs: [],
        inviteArray: JSON.stringify(inviteArray.value)
      }) // body data type must match "Content-Type" header)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('added')
      })
      .catch((err) => {
        alert(err.message)
      })
  } catch (error) {
    console.error(error?.message)
  }
}

const orgNameCheck = () => {
  if (inputOrgName.value == '') {
    orgNameValid.value = 'has-error'
  }
}

const getOrgs = async () => {
  try {
    const token = localStorage.getItem('auth-token')

    const response = await fetch(GLOBAL.URL + 'organizations/getOrganizationsFromID', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.statusText}`)
    }

    const data = await response.json()
    data.organizations.forEach((org: Org) => {
      organizationsGet.value.push({
        _id: org._id,
        orgName: org.orgName,
        createdByID: org.createdByID,
        ownerID: org.ownerID,
        orgMembers: org.orgMembers,
        projectIDs: org.projectIDs,
        inviteArray: org.inviteArray
      })
    })
  } catch (error) {
    console.error('error: ', error)
    // Handle errors, show an alert, or perform other actions as needed.
  }
}

const getSpecificOrg = async (orgID: string) => {
  try {
    const token = localStorage.getItem('auth-token')

    const response = await fetch(GLOBAL.URL + 'organizations/getSpecificOrg/' + orgID, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.statusText}`)
    }

    const data = await response.json()

    currentOrg.value = data.org[0]

    console.log(currentOrg.value.orgName)
  } catch (error) {
    console.error('error: ', error)
    // Handle errors, show an alert, or perform other actions as needed.
  }
}

onMounted(() => {
  getOrgs()
})
</script>

<template>
  <div class="Organizations_Main_Container h-100 overflow-hidden">
    <div class="organizations_grid_1 h-100 overflow-hidden">
      <div class="new_org_container clickable px-2 py-2">
        <button class="btn btn-primary" v-on:click="toggleModal" type="button">
          + New Organzation
        </button>
      </div>

      <div class="separator"></div>
      <div class="org_list_container">
        <h3 class="mx-auto d-flex">Organizations</h3>
      </div>
      <div class="org_list_mainContainer d-flex flex-column h-100 overflow-hidden">
        <OverlayScrollbarsComponent
          class="org_scroll_container d-flex flex-column overflow-auto h-100"
        >
          <div v-for="(org, index) in organizationsGet" :key="org._id">
            <OrgItem
              :org-index="index + 1"
              :org-name="org.orgName"
              @click="getSpecificOrg(org._id)"
            ></OrgItem>
          </div>
        </OverlayScrollbarsComponent>
      </div>
    </div>
    <div class="organizations_grid_2 h-100 overflow-hidden">
      <div class="d-flex flex-column px-2 py-1">
        <div class="d-flex flex-row ms" v-if="currentOrg != null">
          <h2>{{ currentOrg.orgName }}</h2>
          <div class="d-flex flex-column ms-auto">
            <span>Owner: {{ currentOrg.owner[0].fName }} {{ currentOrg.owner[0].lName }}</span>
            <span
              >Creator: {{ currentOrg.createdByUser[0].fName }}
              {{ currentOrg.createdByUser[0].lName }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade newOrgModal"
    :class="{ show: isShowingModal }"
    tabindex="-1"
    aria-labelledby="NewOrganizationModal"
  >
    <div class="modal-dialog my-auto">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title pe-3" id="exampleModalLabel">Create New Organization</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            v-on:click="toggleModalFalse"
          ></button>
        </div>
        <div class="modal-body d-flex flex-column">
          <div class="modal_flex_item">
            <div class="modal_flex_item_title">
              <span>Organization Name</span>
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
              <span>Organization Members</span>
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
                    <span>{{ index }}: {{ user.email }}</span>
                    <button
                      @click="removeInvitedUser(user?.email)"
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
          <button type="button" v-on:click="toggleModalFalse" class="btn btn-secondary">
            Close
          </button>
          <button type="button" v-on:click="addNewOrganization" class="btn btn-primary">
            Create Organization
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
