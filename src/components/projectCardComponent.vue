<script setup lang="ts">
import type { Project } from '@/interfaces/i_project'
import userAvatar from './userAvatar.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import * as projectCRUD from '../components/modules/projectCRUD.js'
import projectSettings from '../components/projectSettings.vue'
import type { User } from '@/interfaces/i_user'

const router = useRouter()

const emits = defineEmits(['reload'])

const reload = () => {
  projectRef.value = []
  emits('reload')
}

const props = defineProps<{
  project: Project
  orgMembers: User[]
}>()

const projectRef = ref([] as Project[])

const gotoProject = (projectID: string) => {
  router.push({
    path: '/currentProject',
    query: {
      project: projectID
    }
  })
}

const showProjectSettings = async (event: MouseEvent, projectID: string) => {
  try {
    event.preventDefault()
    event.stopPropagation()
    await projectCRUD.getProjectData(projectID).then((projectData) => {
      projectRef.value = projectData.data
    })
  } catch (error: any) {
    console.error(error.message)
  }
}

const closeModal = () => {
  projectRef.value = []
}
</script>

<template>
  <projectSettings
    :orgMembers="props.orgMembers"
    :projectRef="projectRef"
    @reload="reload"
    v-if="projectRef.length !== 0"
    @close="closeModal()"
  >
  </projectSettings>

  <div class="project_card" @dblclick="gotoProject(props.project.projectID)">
    <div class="d-flex flex-row project_card_header">
      <h3>{{ props.project?.projectName }}</h3>
      <div
        class="editProject_img_container ms-auto"
        @click="showProjectSettings($event, props.project.projectID)"
      >
        <i class="bi bi-gear settings"></i>
        <i class="bi bi-gear-fill settings"></i>
      </div>
    </div>
    <div class="project_card_footer">
      <div class="d-flex flex-column">
        <span>Members:</span>
        <OverlayScrollbarsComponent class="members_container">
          <div class="members_scrollable_container" v-for="user in props.orgMembers">
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
</template>

<style scoped>
.settings {
  color: '#FFFFFF';
}

.editProject_img_container .bi-gear-fill {
  display: none !important;
}

.editProject_img_container:hover .bi-gear-fill {
  display: flex !important;
}

.editProject_img_container .bi-gear {
  display: flex !important;
}

.editProject_img_container:hover .bi-gear {
  display: none !important;
}
</style>
