<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import * as GLOBAL from '../components/Globals/GLOBALS.js'
import OrgItem from '../components/organization_Item.vue'
import * as Organization from '../components/modules/organizationCRUD.js'

import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import userAvatar from '@/components/userAvatar.vue'

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
  createdByUser: []
  owner: []
}

const isShowingModal = ref(false)
const orgRetrieved = ref(false)
const isDisabledAddUser = ref(true)
const inviteArray = ref([] as User[]) // convert User interface to array, to be able to update ref array
const inputEmail = ref('')
const inputOrgName = ref('')
const orgNameValid = ref('')
const organizationsGet = ref([] as Org[]) // use this for later when the backend works...
const currentOrg = ref([] as CurrentOrg[])
const isShowingOrgChangeModal = ref(false)

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`

const projects = [
  {
    projectID: 1,
    projectName: 'Project Alpha',
    projectStateIDs: [101, 102, 103],
    invitesArray: [
      { email: 'user1@example.com', fName: 'John', lName: 'Doe', color: getRandomColor() },
      { email: 'user2@example.com', fName: 'Jane', lName: 'Doe', color: getRandomColor() },
      { email: 'user3@example.com', fName: 'Bob', lName: 'Smith', color: getRandomColor() }
    ]
  },
  {
    projectID: 2,
    projectName: 'Project Beta',
    projectStateIDs: [104, 105, 106],
    invitesArray: [
      { email: 'user4@example.com', fName: 'Alice', lName: 'Johnson', color: getRandomColor() },
      { email: 'user5@example.com', fName: 'Charlie', lName: 'Brown', color: getRandomColor() },
      { email: 'user6@example.com', fName: 'Eva', lName: 'White', color: getRandomColor() }
    ]
  },
  {
    projectID: 3,
    projectName: 'Project Gamma',
    projectStateIDs: [107, 108, 109],
    invitesArray: [
      { email: 'user22@example.com', fName: 'Tom', lName: 'Brown', color: getRandomColor() },
      { email: 'user23@example.com', fName: 'Ursula', lName: 'Garcia', color: getRandomColor() },
      { email: 'user24@example.com', fName: 'Vincent', lName: 'Miller', color: getRandomColor() },
      { email: 'user25@example.com', fName: 'Will', lName: 'White', color: getRandomColor() },
      { email: 'user26@example.com', fName: 'Xena', lName: 'Smith', color: getRandomColor() },
      { email: 'user27@example.com', fName: 'Yannick', lName: 'Johnson', color: getRandomColor() },
      { email: 'user1@example.com', fName: 'John', lName: 'Doe', color: getRandomColor() },
      { email: 'user2@example.com', fName: 'Jane', lName: 'Doe', color: getRandomColor() },
      { email: 'user3@example.com', fName: 'Bob', lName: 'Smith', color: getRandomColor() },
      { email: 'user28@example.com', fName: 'Zoe', lName: 'Brown', color: getRandomColor() },
      { email: 'user29@example.com', fName: 'Adam', lName: 'Garcia', color: getRandomColor() },
      { email: 'user30@example.com', fName: 'Bella', lName: 'Miller', color: getRandomColor() },
      { email: 'user22@example.com', fName: 'Tom', lName: 'Brown', color: getRandomColor() },
      { email: 'user23@example.com', fName: 'Ursula', lName: 'Garcia', color: getRandomColor() },
      { email: 'user24@example.com', fName: 'Vincent', lName: 'Miller', color: getRandomColor() },
      { email: 'user25@example.com', fName: 'Will', lName: 'White', color: getRandomColor() },
      { email: 'user26@example.com', fName: 'Xena', lName: 'Smith', color: getRandomColor() },
      { email: 'user27@example.com', fName: 'Yannick', lName: 'Johnson', color: getRandomColor() },
      { email: 'user1@example.com', fName: 'John', lName: 'Doe', color: getRandomColor() },
      { email: 'user2@example.com', fName: 'Jane', lName: 'Doe', color: getRandomColor() },
      { email: 'user3@example.com', fName: 'Bob', lName: 'Smith', color: getRandomColor() },
      { email: 'user28@example.com', fName: 'Zoe', lName: 'Brown', color: getRandomColor() },
      { email: 'user29@example.com', fName: 'Adam', lName: 'Garcia', color: getRandomColor() },
      { email: 'user30@example.com', fName: 'Bella', lName: 'Miller', color: getRandomColor() },
      { email: 'user22@example.com', fName: 'Tom', lName: 'Brown', color: getRandomColor() },
      { email: 'user23@example.com', fName: 'Ursula', lName: 'Garcia', color: getRandomColor() },
      { email: 'user24@example.com', fName: 'Vincent', lName: 'Miller', color: getRandomColor() },
      { email: 'user25@example.com', fName: 'Will', lName: 'White', color: getRandomColor() },
      { email: 'user26@example.com', fName: 'Xena', lName: 'Smith', color: getRandomColor() },
      { email: 'user7@example.com', fName: 'David', lName: 'Jones', color: getRandomColor() },
      { email: 'user8@example.com', fName: 'Grace', lName: 'Smith', color: getRandomColor() },
      { email: 'user9@example.com', fName: 'Frank', lName: 'Miller', color: getRandomColor() }
    ]
  },
  {
    projectID: 4,
    projectName: 'Project Delta',
    projectStateIDs: [110, 111, 112],
    invitesArray: [
      { email: 'user10@example.com', fName: 'Helen', lName: 'Johnson', color: getRandomColor() },
      { email: 'user11@example.com', fName: 'Ivan', lName: 'Garcia', color: getRandomColor() },
      { email: 'user12@example.com', fName: 'Jessica', lName: 'Smith', color: getRandomColor() }
    ]
  },
  {
    projectID: 5,
    projectName: 'Project Epsilon',
    projectStateIDs: [113, 114, 115],
    invitesArray: [
      { email: 'user13@example.com', fName: 'Kate', lName: 'Taylor', color: getRandomColor() },
      { email: 'user14@example.com', fName: 'Leo', lName: 'Martinez', color: getRandomColor() },
      { email: 'user15@example.com', fName: 'Mia', lName: 'Johnson', color: getRandomColor() }
    ]
  },
  {
    projectID: 6,
    projectName: 'Project Zeta',
    projectStateIDs: [116, 117, 118],
    invitesArray: [
      { email: 'user16@example.com', fName: 'Noah', lName: 'Brown', color: getRandomColor() },
      { email: 'user17@example.com', fName: 'Olivia', lName: 'Garcia', color: getRandomColor() },
      { email: 'user18@example.com', fName: 'Peter', lName: 'Miller', color: getRandomColor() }
    ]
  },
  {
    projectID: 7,
    projectName: 'Project Eta',
    projectStateIDs: [119, 120, 121],
    invitesArray: [
      { email: 'user19@example.com', fName: 'Quinn', lName: 'White', color: getRandomColor() },
      { email: 'user20@example.com', fName: 'Ryan', lName: 'Smith', color: getRandomColor() },
      { email: 'user21@example.com', fName: 'Sofia', lName: 'Johnson', color: getRandomColor() }
    ]
  },
  {
    projectID: 8,
    projectName: 'Project Theta',
    projectStateIDs: [122, 123, 124],
    invitesArray: [
      { email: 'user22@example.com', fName: 'Tom', lName: 'Brown', color: getRandomColor() },
      { email: 'user23@example.com', fName: 'Ursula', lName: 'Garcia', color: getRandomColor() },
      { email: 'user24@example.com', fName: 'Vincent', lName: 'Miller', color: getRandomColor() }
    ]
  },
  {
    projectID: 9,
    projectName: 'Project Iota',
    projectStateIDs: [125, 126, 127],
    invitesArray: [
      { email: 'user25@example.com', fName: 'Will', lName: 'White', color: getRandomColor() },
      { email: 'user26@example.com', fName: 'Xena', lName: 'Smith', color: getRandomColor() },
      { email: 'user27@example.com', fName: 'Yannick', lName: 'Johnson', color: getRandomColor() }
    ]
  },
  {
    projectID: 10,
    projectName: 'Project Kappa',
    projectStateIDs: [128, 129, 130],
    invitesArray: [
      { email: 'user22@example.com', fName: 'Tom', lName: 'Brown', color: getRandomColor() },
      { email: 'user23@example.com', fName: 'Ursula', lName: 'Garcia', color: getRandomColor() },
      { email: 'user24@example.com', fName: 'Vincent', lName: 'Miller', color: getRandomColor() },
      { email: 'user25@example.com', fName: 'Will', lName: 'White', color: getRandomColor() },
      { email: 'user26@example.com', fName: 'Xena', lName: 'Smith', color: getRandomColor() },
      { email: 'user27@example.com', fName: 'Yannick', lName: 'Johnson', color: getRandomColor() },
      { email: 'user1@example.com', fName: 'John', lName: 'Doe', color: getRandomColor() },
      { email: 'user2@example.com', fName: 'Jane', lName: 'Doe', color: getRandomColor() },
      { email: 'user3@example.com', fName: 'Bob', lName: 'Smith', color: getRandomColor() },
      { email: 'user28@example.com', fName: 'Zoe', lName: 'Brown', color: getRandomColor() },
      { email: 'user29@example.com', fName: 'Adam', lName: 'Garcia', color: getRandomColor() },
      { email: 'user30@example.com', fName: 'Bella', lName: 'Miller', color: getRandomColor() },
      { email: 'user22@example.com', fName: 'Tom', lName: 'Brown', color: getRandomColor() },
      { email: 'user23@example.com', fName: 'Ursula', lName: 'Garcia', color: getRandomColor() },
      { email: 'user24@example.com', fName: 'Vincent', lName: 'Miller', color: getRandomColor() },
      { email: 'user25@example.com', fName: 'Will', lName: 'White', color: getRandomColor() },
      { email: 'user26@example.com', fName: 'Xena', lName: 'Smith', color: getRandomColor() },
      { email: 'user27@example.com', fName: 'Yannick', lName: 'Johnson', color: getRandomColor() },
      { email: 'user1@example.com', fName: 'John', lName: 'Doe', color: getRandomColor() },
      { email: 'user2@example.com', fName: 'Jane', lName: 'Doe', color: getRandomColor() },
      { email: 'user3@example.com', fName: 'Bob', lName: 'Smith', color: getRandomColor() },
      { email: 'user28@example.com', fName: 'Zoe', lName: 'Brown', color: getRandomColor() },
      { email: 'user29@example.com', fName: 'Adam', lName: 'Garcia', color: getRandomColor() },
      { email: 'user30@example.com', fName: 'Bella', lName: 'Miller', color: getRandomColor() },
      { email: 'user22@example.com', fName: 'Tom', lName: 'Brown', color: getRandomColor() },
      { email: 'user23@example.com', fName: 'Ursula', lName: 'Garcia', color: getRandomColor() },
      { email: 'user24@example.com', fName: 'Vincent', lName: 'Miller', color: getRandomColor() },
      { email: 'user25@example.com', fName: 'Will', lName: 'White', color: getRandomColor() },
      { email: 'user26@example.com', fName: 'Xena', lName: 'Smith', color: getRandomColor() },
      { email: 'user27@example.com', fName: 'Yannick', lName: 'Johnson', color: getRandomColor() },
      { email: 'user1@example.com', fName: 'John', lName: 'Doe', color: getRandomColor() },
      { email: 'user2@example.com', fName: 'Jane', lName: 'Doe', color: getRandomColor() },
      { email: 'user3@example.com', fName: 'Bob', lName: 'Smith', color: getRandomColor() },
      { email: 'user28@example.com', fName: 'Zoe', lName: 'Brown', color: getRandomColor() },
      { email: 'user29@example.com', fName: 'Adam', lName: 'Garcia', color: getRandomColor() },
      { email: 'user30@example.com', fName: 'Bella', lName: 'Miller', color: getRandomColor() }
    ]
  }
]

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
    const response = await Organization.addNewOrganization(inputOrgName.value, inviteArray.value)
    await getOrgs()
    await toggleModalFalse()
  } catch (error) {
    console.error(error?.message)
  }
}

const orgNameCheck = () => {
  if (inputOrgName.value == '') {
    orgNameValid.value = 'has-error'
  }
}

const loadOrg = async (orgID: string) => {
  let org: CurrentOrg[] = await Organization.getSpecificOrg(orgID)

  currentOrg.value = [
    {
      _id: org._id,
      orgName: org.orgName,
      createdByID: org.createdByID,
      ownerID: org.ownerID,
      orgMembers: org.orgMembers,
      projectIDs: org.projectIDs,
      inviteArray: org.inviteArray,
      createdByUser: org.createdByUser,
      owner: org.owner
    }
  ]

  orgRetrieved.value = true
}

const getOrgs = async () => {
  const retrievedOrgs = await Organization.getOrgs()

  retrievedOrgs.data.organizations.forEach((org: Org) => {
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
}

const toggleOrgSettingsModal = () => {
  isShowingOrgChangeModal.value = !isShowingOrgChangeModal.value
}

const toggleFalseSettingsModal = () => {
  isShowingOrgChangeModal.value = false
}

onMounted(async () => {
  await getOrgs()
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
              @click="loadOrg(org._id)"
            ></OrgItem>
          </div>
        </OverlayScrollbarsComponent>
      </div>
    </div>
    <div class="organizations_grid_2 h-100 overflow-hidden">
      <div class="d-flex flex-column px-2 py-1 h-100">
        <div class="d-flex flex-row justify-content-center" v-if="orgRetrieved">
          <div class="org_settings_icon_container my-auto mx-1" v-on:click="toggleOrgSettingsModal">
            <i class="bi bi-gear org_settings_icon"></i>
            <i class="bi bi-gear-fill org_settings_icon"></i>
          </div>

          <div class="d-flex flex-column flex-lg-row">
            <h2 class="my-auto px-2 mx-2">{{ currentOrg[0].orgName }}</h2>
            <div class="d-flex flex-column">
              <div class="d-flex flex-row py-1">
                <span class="me-1 my-auto">Owner:</span>
                <userAvatar
                  :f-name="currentOrg[0].owner[0].fName"
                  :l-name="currentOrg[0].owner[0].lName"
                  :color="currentOrg[0].owner[0].color"
                ></userAvatar>
                <span class="ms-1 my-auto"
                  >{{ currentOrg[0].owner[0].fName }} {{ currentOrg[0].owner[0].lName }}</span
                >
              </div>

              <div class="d-flex flex-row py-1">
                <span class="me-1 my-auto">Creator:</span>
                <userAvatar
                  :f-name="currentOrg[0].createdByUser[0].fName"
                  :l-name="currentOrg[0].createdByUser[0].lName"
                  :color="currentOrg[0].createdByUser[0].color"
                ></userAvatar>
                <span class="ms-1 my-auto"
                  >{{ currentOrg[0].createdByUser[0].fName }}
                  {{ currentOrg[0].createdByUser[0].lName }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <OverlayScrollbarsComponent class="d-flex flex-row justify-content-center h-100 pe-2">
          <div class="projects_container" v-if="orgRetrieved">
            <div v-for="project in projects">
              <div class="project_card">
                <div class="d-flex flex-row project_card_header">
                  <h3>{{ project.projectName }}</h3>
                </div>
                <div class="project_card_footer">
                  <div class="d-flex flex-column">
                    <span>Members:</span>
                    <OverlayScrollbarsComponent class="members_container">
                      <div
                        class="members_scrollable_container"
                        v-for="user in project.invitesArray"
                      >
                        <userAvatar
                          class="mx-1 my-1"
                          :fName="user.fName"
                          :lName="user.lName"
                          :color="user.color"
                        >
                        </userAvatar>
                      </div>
                    </OverlayScrollbarsComponent>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </OverlayScrollbarsComponent>
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
          <h5 class="modal-title pe-3 text-dark">Create New Organization</h5>
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

  <div
    v-if="orgRetrieved"
    class="modal fade changeOrgSettings"
    :class="{ show: isShowingOrgChangeModal }"
    tabindex="-1"
    aria-labelledby="changeOrganizationSettingsModal"
  >
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
                :f-name="currentOrg[0].createdByUser[0].fName"
                :l-name="currentOrg[0].createdByUser[0].lName"
                :color="currentOrg[0].createdByUser[0].color"
              ></userAvatar>
              <span class="ms-1 my-auto text-dark"
                >{{ currentOrg[0].createdByUser[0].fName }}
                {{ currentOrg[0].createdByUser[0].lName }}</span
              >
            </div>
          </div>

          <div class="modal_flex_item">
            <div class="modal_flex_item_title">
              <span class="text-dark">Organization Name</span>
            </div>

            <div class="modal_flex_item_content">
              <input type="text" :value="currentOrg[0].orgName" :class="['form-control']" />
            </div>
          </div>

          <div class="modal_flex_item">
            <div class="modal_flex_item_title">
              <span class="text-dark">Organization Owner</span>
            </div>

            <div class="modal_flex_item_content">
              <input type="text" :value="currentOrg[0].owner[0].email" :class="['form-control']" />
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
              <OverlayScrollbarsComponent class="invited_div">
                <div v-for="(user, index) in currentOrg[0].inviteArray" :key="user.email">
                  <div class="invite_user_item">
                    <span class="text-dark">{{ index + 1 }}: {{ user.email }}</span>
                    <button
                      @click="removeInvitedUser(user)"
                      type="button"
                      class="btn btn-danger px-2 py-0 ms-auto"
                    >
                      X
                    </button>
                  </div>
                </div>
              </OverlayScrollbarsComponent>

              <div class="separator bg-dark my-1"></div>
              <OverlayScrollbarsComponent class="existing_members_div">
                <div v-for="(user, index) in currentOrg[0].inviteArray" :key="user.email">
                  <div class="existing_user_item">
                    <span class="text-dark">{{ index + 1 }}: {{ user.email }}</span>
                    <button
                      @click="removeInvitedUser(user)"
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
          <button type="button" v-on:click="addNewOrganization" class="btn btn-primary">
            Update Organization
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
