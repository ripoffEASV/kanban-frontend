<script setup lang="ts">
import userAvatar from '../components/userAvatar.vue'
import type { User } from '@/interfaces/i_user'
import type { Project } from '@/interfaces/i_project'
import { onMounted, ref } from 'vue'
import type { State } from '@/interfaces/i_state'
import * as projectCRUD from './modules/projectCRUD'

const props = defineProps<{
  orgMembers: User[]
  projectRef: Project
}>()

const tempBoardName = ref('')

const projectBoards = ref([] as State[])
const assignedMembers = ref([] as User[])
const newProjectName = ref('')

onMounted(() => {
  props.projectRef[0].projectStates?.forEach((board) => {
    projectBoards.value.push({
      ID: board._id,
      stateName: board.stateName,
      position: board.position
    })
  })

  props.projectRef[0].membersInfo?.forEach((member) => {
    assignedMembers.value.push({
      _id: member._id,
      email: member.email,
      fName: member.fName,
      lName: member.lName,
      color: member.color
    })
  })
})
const isMemberInTaskMembers = (member) => {
  const isUserInAssignedToArray = assignedMembers.value.some((user) => {
    return user.id === member._id || user._id === member._id
  })
  return isUserInAssignedToArray
}

const handleDropAvailableUser = (event: DragEvent) => {
  console.log('drag dropped: ', event.target)

  const user: User = {
    _id: event.dataTransfer?.getData('userID'),
    fName: event.dataTransfer?.getData('user_fName'),
    lName: event.dataTransfer?.getData('user_lName'),
    color: event.dataTransfer?.getData('user_color')
  }
  console.log('assignedToID: ', user)
  assignedMembers.value.push(user)
}

const handleDropWorkingUser = (event: DragEvent) => {
  console.log('Drop event occurred')
  let target = event.target as HTMLElement

  // Traverse up the DOM tree until a parent node with the class 'available' is found
  while (target && !target.classList.contains('available')) {
    target = target.parentElement
  }

  // Check if a parent node with the class 'available' was found
  if (target) {
    // Parent node with the class 'available' was found

    const userID = event.dataTransfer?.getData('userID')

    console.log(userID)

    assignedMembers.value.some((user, index) => {
      console.log(index)
      if (user._id == userID) {
        console.log('match!: ', index)
        assignedMembers.value.splice(index, 1)
      }
    })
  }
}

const dragAvailableUser = (event: DragEvent, user: User) => {
  console.log('drag started')
  console.log('Dragged Target: ', event.target)
  console.log(user)
  event.dataTransfer?.setData('userID', user._id)
  event.dataTransfer?.setData('user_fName', user.fName)
  event.dataTransfer?.setData('user_lName', user.lName)
  event.dataTransfer?.setData('user_color', user.color)
}

const dragAvailableUserEnd = (index: number) => {
  console.log('Drag ended: ', index)
}

const updateProjectCRUD = async () => {
  try {
    const data = {
      projectID: props.projectRef[0]._id,
      newProjectName: newProjectName.value,
      newBoards: projectBoards.value,
      newMembers: assignedMembers.value
    }

    await projectCRUD.updateProjectData(data).then(() => {
      emits('close')
    })
  } catch (error: any) {
    console.log('something went wrong when updating project')
  }
}

const addNewBoard = () => {
  if (tempBoardName.value !== '') {
    projectBoards.value.push({
      ID: '',
      stateName: tempBoardName.value,
      position: projectBoards.value.length + 1
    })
  }

  tempBoardName.value = ''
}

const emits = defineEmits(['close'])

const closeModal = () => {
  emits('close')
}

const deleteBoard = (boardID: string, index: number) => {
  console.log(boardID)
  if (boardID) {
    projectBoards.value[index].delete = !projectBoards.value[index].delete
  } else {
    projectBoards.value.splice(index, 1)
  }
}

const deleteProject = async () => {
  await projectCRUD.deleteProject(props.projectRef[0]._id).then(() => {
    console.log('plx')
    emits('close')
  })
}
</script>
<template>
  <div class="modal show fade editBoardModal" tabindex="-1" aria-labelledby="editBoardModal">
    <div class="modal-dialog my-auto">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title pe-3 text-dark">Update Project Settings</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal()"
          ></button>
        </div>
        <div class="modal-body d-flex flex-column">
          <div class="modal_flex_item">
            <div class="modal_flex_item_title">
              <input
                type="text"
                class="form-control"
                v-model="newProjectName"
                :placeholder="props.projectRef[0].projectName"
              />
            </div>
          </div>

          <div class="modal_flex_item">
            <div class="modal_flex_item_title">
              <span class="text-dark">Boards in Project:</span>
            </div>
            <div class="modal_flex_item">
              <div class="seperator"></div>
            </div>

            <div class="modal_flex_item flex-row">
              <input type="text" class="form-control me-1" v-model="tempBoardName" />
              <button type="button" v-on:click="addNewBoard()" class="btn btn-outline-success">
                Add
              </button>
            </div>

            <div class="modal_flex_item">
              <div v-for="(board, index) in projectBoards">
                <div class="modal_flex_item flex-row">
                  <span class="text-dark me-1">{{ index + 1 }}: </span>
                  <span class="text-dark">{{ board.stateName }}</span>
                  <div class="ms-auto">
                    <button
                      :class="board.delete ? ' btn-danger' : ' btn-outline-danger'"
                      class="px-1 py-0 btn"
                      @click="deleteBoard(board.ID, index)"
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal_flex_item">
            <div class="modal_flex_item_title">
              <span class="text-dark">Members</span>
            </div>
            <div class="modal_flex_item_content d-flex flex-row">
              <div class="col-5 d-flex flex-column">
                <span class="text-secondary">Available:</span>
                <div
                  class="user_drag_container available"
                  @dragover.prevent
                  @drop="handleDropWorkingUser($event)"
                >
                  <div class="userAvatarIteration" v-for="(member, index) in props.orgMembers">
                    <div v-if="!isMemberInTaskMembers(member)">
                      <div
                        class="draggable_wrapper"
                        draggable="true"
                        @dragstart="dragAvailableUser($event, member)"
                        @dragend="dragAvailableUserEnd(index)"
                      >
                        <userAvatar
                          :data-userid="member.id"
                          :fName="member.fName"
                          :lName="member.lName"
                          :color="member.color"
                        ></userAvatar>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-5 d-flex flex-column ms-auto">
                <span class="text-secondary">Working:</span>

                <div
                  class="user_drag_container working"
                  @dragover.prevent
                  @drop="handleDropAvailableUser($event)"
                >
                  <div class="userAvatarIteration" v-for="(member, index) in assignedMembers">
                    <div
                      class="draggable_wrapper"
                      draggable="true"
                      @dragstart="dragAvailableUser($event, member)"
                      @dragend="dragAvailableUserEnd(index)"
                    >
                      <userAvatar
                        :data-userid="member.id"
                        :fName="member.fName"
                        :lName="member.lName"
                        :color="member.color"
                      ></userAvatar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" @click="deleteProject()" class="btn btn-danger">
            Delete Project
          </button>
          <button type="button" @click="closeModal()" class="btn btn-secondary">Close</button>
          <button type="button" @click="updateProjectCRUD()" class="btn btn-primary">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal.show {
  display: flex !important;
}

.user_drag_container {
  border: 1px solid #cacaca;
  width: 100%;
  height: 250px;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: start;
}

.draggable_wrapper {
  margin: 0.25rem;
}
</style>