<script setup lang="ts">
import type i_project from '@/interfaces/i_project'
import userAvatar from './userAvatar.vue'
import { useRouter } from 'vue-router'

import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

const router = useRouter();

const props = defineProps<{
  project: i_project
  fName: string
  lName: string
  color: string
}>()

const gotoProject = (projectID: number) =>{

  router.push({
    path: "/currentProject",
    query:{
      project: projectID
    }
  })

}

</script>

<template>
  <div class="project_card" @dblclick="gotoProject(props.project.projectID)" >
    <div class="d-flex flex-row project_card_header">
      <h3>{{ props.project?.projectName }}</h3>
    </div>
    <div class="project_card_footer">
      <div class="d-flex flex-column">
        <span>Members:</span>
        <OverlayScrollbarsComponent class="members_container">
          <div class="members_scrollable_container" v-for="user in props.project.inviteArray">
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
