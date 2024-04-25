<script setup lang="ts">
import { onBeforeMount, onMounted, ref, reactive } from 'vue'
import OrgItem from '../components/organization_Item.vue'
import * as Organization from '../components/modules/organizationCRUD.js'

import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import userAvatar from '@/components/userAvatar.vue'
import projectCardComponent from '@/components/projectCardComponent.vue'
import i_singleUser from '../interfaces/i_singleUser.js'
import i_project from '../interfaces/i_project.js'

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
  orgUsers: []
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
const isShowingNewProjectModal = ref(false)
const projectBoards: any = reactive({ boards: new Array() })
const tempProjectBoardName = ref('')
const projectMembers: i_singleUser = reactive({ member: new Array() })
const inputProjectName = ref()
const projects = ref([] as i_project[])

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`

let regex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

const toggleModal = () => {
  isShowingModal.value = !isShowingModal.value
}

const toggleModalFalse = () => {
  isShowingModal.value = false
}

const toggleisShowingNewProjectModal = () => {
  isShowingNewProjectModal.value = !isShowingNewProjectModal.value
}

const toggleFalseisShowingNewProjectModal = () => {
  isShowingNewProjectModal.value = false
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
    
    await Organization.addNewOrganization(inputOrgName.value, inviteArray.value);
    await getOrgs()
    await toggleModalFalse();
  } catch (error) {
    console.error(error?.message)
  }
}

const orgNameCheck = () => {
  if (inputOrgName.value == '') {
    orgNameValid.value = 'has-error'
  }
}

const loadProjects = async (orgID: string) => {
  try {
    let projectData = await Organization.loadProjects(orgID)
    console.log(projectData)
    projects.value = []

    projectData.project.forEach((element: any) => {
      projects.value.push({
        projectID: element._id,
        projectName: element.projectName,
        projectStateIDs: element.projectStateIDs,
        inviteArray: element.membersInfo
      })
    })

    console.log(projectData)
  } catch (error) {
    console.log('an error occurred, when loading org projects: ', error.message)
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
      owner: org.owner,
      members: org.orgUsers
    }
  ]

  orgRetrieved.value = true

  await loadProjects(orgID)
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

const addProjectBoard = (title: String) => {
  projectBoards.boards.push({ title: title })
  tempProjectBoardName.value = ''
}

const deleteProjectBoard = (index: number) => {
  projectBoards.value.splice(index, 1)
}

function startDrag(event: DragEvent, user: i_singleUser) {
  console.log('drag started')
  console.log('Dragged Target: ', event.target)
  console.log(user)
  event.dataTransfer?.setData('userID', user._id)
  event.dataTransfer?.setData('user_fName', user.fName)
  event.dataTransfer?.setData('user_lName', user.lName)
  event.dataTransfer?.setData('user_color', user.color)

  event.target.className += ' hide'
}

function endDrop(event: DragEvent) {
  console.log('drag dropped: ', event.target)

  const user: i_singleUser = {
    _id: event.dataTransfer?.getData('userID'),
    fName: event.dataTransfer?.getData('user_fName'),
    lName: event.dataTransfer?.getData('user_lName'),
    color: event.dataTransfer?.getData('user_color')
  }
  console.log(user)
  projectMembers.member.push(user)
}

function addNewProject() {
  const boards = projectBoards.boards
  const members = projectMembers.member

  Organization.addNewProject(inputProjectName.value, boards, members, currentOrg.value[0]._id)
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
          <div v-for="(org, index) in organizationsGet" :key="index">
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
            <div class="d-flex flex-column ms-auto">
              <div class="d-flex flex-row py-1">
                <span class="me-1 my-auto org_member_title_span">Owner:</span>
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
                <span class="me-1 my-auto org_member_title_span">Creator:</span>
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
          <div class="projects_container position-relative" v-if="orgRetrieved">
            <div v-for="project in projects">
              <projectCardComponent :project="project"></projectCardComponent>
            </div>

            <button @click="toggleisShowingNewProjectModal" class="add_project_div clickable">
              <i class="bi bi-plus-lg"></i>
              <i class="bi bi-pencil-fill"></i>
            </button>
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

  <div
    v-if="orgRetrieved"
    class="modal fade newProjectModal"
    :class="{ show: isShowingNewProjectModal }"
    tabindex="-1"
    aria-labelledby="changeOrganizationSettingsModal"
  >
    <div class="modal-dialog my-auto px-3">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title pe-3 text-dark">New Project</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            v-on:click="toggleisShowingNewProjectModal"
          ></button>
        </div>
        <div class="modal-body d-flex flex-column">
          <div class="modal_flex_item py-1">
            <div class="modal_flex_item_title">
              <span class="text-dark">Project Name</span>
            </div>
            <div class="modal_flex_item flex-row">
              <input type="text" v-model="inputProjectName" class="form-control" />
            </div>
          </div>

          <div class="modal_flex_item py-1">
            <div class="modal_flex_item_title">
              <span class="text-dark">Project Boards</span>
            </div>
            <div class="modal_flex_item">
              <div v-for="(project, index) in projectBoards.boards" :key="index">
                <div class="d-flex flex-row py-1">
                  <span class="w-100 text-dark">{{ index + 1 }}: {{ project.title }}</span>
                  <button
                    type="button"
                    @click="deleteProjectBoard(index)"
                    class="btn btn-danger px-2 py-0"
                  >
                    x
                  </button>
                </div>
              </div>
            </div>
            <div class="modal_flex_item flex-row">
              <input type="text" v-model="tempProjectBoardName" class="form-control" />
              <button
                type="button"
                @click="addProjectBoard(tempProjectBoardName)"
                class="btn btn-primary mx-1"
              >
                Add
              </button>
            </div>
          </div>

          <div class="modal_flex_item py-1">
            <div class="modal_flex_item_title">
              <span class="text-dark">Project members</span>
            </div>
            <div class="modal_flex_item flex-row">
              <div class="dragMemberContainer px-1 py-1">
                <div
                  class="avatarContainer"
                  :draggable="true"
                  v-for="member in currentOrg[0].members"
                  :key="member._id"
                  @dragstart="startDrag($event, member)"
                >
                  <userAvatar
                    :fName="member.fName"
                    :lName="member.lName"
                    :color="member.color"
                  ></userAvatar>
                </div>
              </div>

              <div
                class="dragMemberContainer px-1"
                :draggable="true"
                @drop="endDrop($event)"
                @dragover.prevent
                @dragenter.prevent
              >
                <div
                  class="avatarContainer"
                  v-for="member in projectMembers.member"
                  :key="member._id"
                >
                  <userAvatar
                    :fName="member.fName"
                    :lName="member.lName"
                    :color="member.color"
                  ></userAvatar>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            v-on:click="toggleFalseisShowingNewProjectModal"
            class="btn btn-secondary"
          >
            Close
          </button>
          <button type="button" v-on:click="addNewProject()" class="btn btn-primary">
            Add Project
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
