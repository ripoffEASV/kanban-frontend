<script setup lang="ts">
import { onBeforeMount, onMounted, ref, reactive } from 'vue'
import OrgItem from '../components/organization_Item.vue'
import * as OrganizationCRUD from '../components/modules/organizationCRUD.js'

import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import userAvatar from '@/components/userAvatar.vue'
import projectCardComponent from '@/components/projectCardComponent.vue'
import type { User } from '../interfaces/i_user.js'
import type { Project } from '../interfaces/i_project.js'
import type { Organization } from '@/interfaces/i_organization'
import OrganizationSettings from '../components/organizationSettings.vue'
import Signup from '../components/SignupForm.vue'
import { useAuthStore } from '../stores/authStore'
import newOrganizationModal from '@/components/newOrganizationModal.vue'
import newProjectModal from '@/components/newProjectModal.vue'

const authStore = useAuthStore()

interface Org {
  id: string
  orgName: string
  createdByID: string
  ownerID: string
  orgMembers: []
  projectIDs: []
  inviteArray: []
}

const isShowingModal = ref(false)
const orgRetrieved = ref(false)

const organizationsGet = ref([] as Org[]) // use this for later when the backend works...
const currentOrg = ref([] as any[])
const isShowingOrgChangeModal = ref(false)
const isShowingNewProjectModal = ref(false)

const currentUserId = ref('' as string | null)
const projects = ref<Project[]>([])

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`

const toggleModal = () => {
  isShowingModal.value = !isShowingModal.value
}

const toggleModalFalse = () => {
  isShowingModal.value = false
}

const toggleisShowingNewProjectModal = () => {
  isShowingNewProjectModal.value = !isShowingNewProjectModal.value
}

const loadProjects = async (orgID: string) => {
  try {
    let projectData = await OrganizationCRUD.loadProjects(orgID)
    projects.value = []

    projectData.project.forEach((project: any) => {
      projects.value.push({
        projectID: project._id,
        projectName: project.projectName,
        projectStateIDs: project.projectStateIDs,
        inviteArray: project.membersInfo
      })
    })

    currentUserId.value = authStore.getUserID()
  } catch (error: any) {
    console.error('an error occurred, when loading org projects: ', error.message)
  }
}

const loadOrg = async (orgID: string) => {
  let org = await OrganizationCRUD.getSpecificOrg(orgID)

  currentOrg.value = {
    orgID: org._id,
    orgName: org.orgName,
    createdByID: org.createdByID,
    ownerID: org.ownerID,
    orgMembers: org.orgMembers,
    projectIDs: org.projectIDs,
    inviteArray: org.inviteArray,
    createdByUser: org.createdByUser[0],
    owner: org.owner,
    members: org.orgUsers
  }

  orgRetrieved.value = true

  await loadProjects(orgID)
}

const getOrgs = async () => {
  organizationsGet.value = []
  const retrievedOrgs = await OrganizationCRUD.getOrgs()

  retrievedOrgs.data.organizations.forEach((org: any) => {
    organizationsGet.value.push({
      id: org._id,
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

onMounted(async () => {
  await getOrgs()
})

const reloadPage = () => {
  isShowingModal.value = false
  getOrgs()
}

const closeNewProjectModal = () => {
  isShowingNewProjectModal.value = false
}

const reloadProjects = async () => {
  await loadProjects(currentOrg.value[0].orgID)
  isShowingNewProjectModal.value = false
}
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
        <div class="org_scroll_container d-flex flex-column overflow-auto h-100">
          <div v-for="(org, index) in organizationsGet" :key="index">
            <OrgItem
              :org-index="index + 1"
              :org-name="org.orgName"
              @click="loadOrg(org.id)"
            ></OrgItem>
          </div>
        </div>
      </div>
    </div>
    <div class="organizations_grid_2 h-100 overflow-hidden">
      <div class="d-flex flex-column px-2 py-1 h-100">
        <div class="d-flex flex-row justify-content-center" v-if="orgRetrieved">
          <div
            class="org_settings_icon_container my-auto mx-1"
            v-on:click="toggleOrgSettingsModal"
            v-if="currentOrg.ownerID.includes(currentUserId)"
          >
            <i class="bi bi-gear org_settings_icon"></i>
            <i class="bi bi-gear-fill org_settings_icon"></i>
          </div>

          <div class="d-flex flex-column flex-lg-row">
            <h2 class="my-auto px-2 mx-2">{{ currentOrg.orgName }}</h2>
            <div class="d-flex flex-column ms-auto">
              <div class="d-flex flex-row py-1">
                <span class="me-1 my-auto org_member_title_span">Creator:</span>
                <userAvatar
                  :f-name="currentOrg.createdByUser.fName"
                  :l-name="currentOrg.createdByUser.lName"
                  :color="currentOrg.createdByUser.color"
                >
                </userAvatar>
                <span class="ms-1 my-auto"
                  >{{ currentOrg.createdByUser.fName }} {{ currentOrg.createdByUser.lName }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-center h-100 pe-2">
          <div class="projects_container position-relative" v-if="orgRetrieved">
            <div v-for="project in projects">
              <projectCardComponent
                :orgMembers="currentOrg.members"
                :project="project"
              ></projectCardComponent>
            </div>

            <button
              @click="toggleisShowingNewProjectModal"
              class="add_project_div clickable"
              v-if="currentOrg.ownerID.includes(currentUserId)"
            >
              <i class="bi bi-plus-lg"></i>
              <i class="bi bi-pencil-fill"></i>
            </button>
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
    <newOrganizationModal @close="toggleModalFalse" @reload="reloadPage"></newOrganizationModal>
  </div>

  <div
    v-if="orgRetrieved"
    class="modal fade changeOrgSettings"
    :class="{ show: isShowingOrgChangeModal }"
    tabindex="-1"
    aria-labelledby="changeOrganizationSettingsModal"
  >
    <OrganizationSettings
      v-if="isShowingOrgChangeModal"
      :org="currentOrg[0]"
      @closeSettingsModal="toggleOrgSettingsModal"
      @get-orgs="getOrgs"
    >
    </OrganizationSettings>
  </div>

  <div
    v-if="orgRetrieved"
    class="modal fade newProjectModal"
    :class="{ show: isShowingNewProjectModal }"
    tabindex="-1"
    aria-labelledby="changeOrganizationSettingsModal"
  >
    <newProjectModal
      @close="closeNewProjectModal"
      @reload="reloadProjects"
      :org="currentOrg"
    ></newProjectModal>
  </div>
</template>
