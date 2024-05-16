<template>
  <div class="modal-dialog my-auto px-3">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title pe-3 text-dark">New Project</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          v-on:click="close"
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
            <div
              class="dragMemberContainer px-1 py-1"
              data-type="1"
              @drop="endDrop($event)"
              @dragover.prevent
              @dragenter.prevent
            >
              <div
                class="avatarContainer"
                :draggable="true"
                v-for="member in props.org.members"
                :key="member.id"
                @dragstart="startDrag($event, member)"
                :data-id="member.id"
              >
                <userAvatar
                  :fName="member.fName"
                  :lName="member.lName"
                  :color="member.color"
                ></userAvatar>
              </div>
            </div>

            <div
              class="dragMemberContainer px-1 py-1"
              data-type="2"
              @drop="endDrop($event)"
              @dragover.prevent
              @dragenter.prevent
            >
              <div
                class="avatarContainer"
                v-for="member in projectMembers.member"
                :key="member.id"
                :draggable="true"
                @dragstart="startDrag($event, member)"
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
        <button type="button" v-on:click="close" class="btn btn-secondary">Close</button>
        <button type="button" v-on:click="addNewProject()" class="btn btn-primary">
          Add Project
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { User } from '@/interfaces/i_user'
import { reactive, ref } from 'vue'
import * as OrganizationCRUD from '../components/modules/organizationCRUD'
import type { Organization } from '@/interfaces/i_organization'
import userAvatar from './userAvatar.vue'
import { onMounted } from 'vue'

const projectBoards: any = reactive({ boards: new Array() })
const tempProjectBoardName = ref('')
const projectMembers: any = reactive({ member: new Array() })
const inputProjectName = ref()

const props = defineProps<{
  org: any
}>()

const emits = defineEmits(['close', 'reload'])

const addProjectBoard = (title: String) => {
  projectBoards.boards.push({ title: title })
  tempProjectBoardName.value = ''
}

const deleteProjectBoard = (index: number) => {
  projectBoards.boards.splice(index, 1)
}

function startDrag(event: DragEvent, user: any) {
  const target = event.target as HTMLElement
  event.dataTransfer?.setData('userID', user.id)
  event.dataTransfer?.setData('user_fName', user.fName)
  event.dataTransfer?.setData('user_lName', user.lName)
  event.dataTransfer?.setData('user_color', user.color)

  //target.className += ' hide'
}

function endDrop(event: DragEvent) {
  let target = event.target as HTMLElement

  // find parent container "dragMemberContainer" with data-attribute = "type"
  while (target && !target.classList.contains('dragMemberContainer')) {
    target = target.parentElement as HTMLElement
  }

  const type = target.getAttribute('data-type')

  if (type == '1' && target) {
    for (let i = 0; i < target.children.length; i++) {
      const child = target.children[i] as HTMLElement

      if (child.dataset.id == event.dataTransfer?.getData('userID')) {
        child.classList.remove('hide')
      }
    }

    projectMembers.member.map((member: User, index: number) => {
      if (member.id == event.dataTransfer?.getData('userID')) {
        projectMembers.member.splice(index, 1)
      }
    })
  } else if (type == '2' && target) {
    const user: any = {
      id: event.dataTransfer?.getData('userID'),
      fName: event.dataTransfer?.getData('user_fName'),
      lName: event.dataTransfer?.getData('user_lName'),
      color: event.dataTransfer?.getData('user_color')
    }

    const parentElement = document.querySelector(
      '.dragMemberContainer[data-type="1"]'
    ) as HTMLElement

    for (let i = 0; i < parentElement.children.length; i++) {
      const child = parentElement.children[i] as HTMLElement
      if (child.dataset.id == event.dataTransfer?.getData('userID')) {
        child.classList.add('hide')
      }
    }
    projectMembers.member.push(user)
  }
}

const close = () => {
  emits('close')
}

const addNewProject = async () => {
  const boards = projectBoards.boards
  const members = projectMembers.member

  const updatedBoards = boards.map((b, index) => ({
    ...b,
    position: index + 1
  }))

  try {
    await OrganizationCRUD.addNewProject(
      inputProjectName.value,
      updatedBoards,
      members,
      props.org.orgID
    )
    emits('reload')
  } catch (error: any) {
    console.error({
      title: 'Something went wrong when creating a new project',
      message: error.message
    })
  }
}
</script>
