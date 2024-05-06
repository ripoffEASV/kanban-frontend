<template>
  <div class="kanban_Page_Container">
    <div class="kanban_scrollable_container d-flex flex-row w-100 align-items-center">
      <div class="kanbanBoard_State" v-for="(board, boardIndex) in kanbanBoards" :key="boardIndex">
        <div class="kanban_outerBorder">
          <h2 class="kanban_title" @dblclick="editBoard(board.stateID, board.stateName)">
            {{ board.stateName }}
          </h2>
          <div class="separator"></div>

          <!-- Add other Kanban board content here -->

          <div class="kanban_task_container" @dragover.prevent @drop="handleDrop(boardIndex, tar)">
            <ul>
              <li
                v-for="(task, taskIndex) in board.taskArray"
                :key="taskIndex"
                draggable="true"
                @dragstart="handleDragStart(boardIndex, taskIndex, $event)"
                @dragend="handleDragEnd"
                @dblclick="editTask(boardIndex, taskIndex, task._id)"
              >
                <h4>{{ task.taskTitle }}</h4>
                <!-- <p>{{ task.description }}</p> -->
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="updateSingleTask.value != 'null'">
    <div
      class="modal fade taskModal"
      :class="{ show: isShowingModal }"
      tabindex="-1"
      aria-labelledby="NewOrganizationModal"
    >
      <div class="modal-dialog my-auto">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title pe-3 text-dark">Update task properties</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              v-on:click="toggleModalFalse"
            ></button>
          </div>
          <div class="modal-body d-flex flex-column taskModalBody px-0">
            <OverlayScrollbarsComponent style="padding: 1rem">
              <!-- <div class="modal_flex_item">
            <div class="modal_flex_item_title">
              <span class="text-dark">Task Description</span>
            </div>
            <div class="modal_flex_item_title pb-2">
              <span class="text-dark">{{ taskDescription }}</span>
            </div>
          </div> -->

              <div class="modal_flex_item">
                <div class="modal_flex_item_title">
                  <span class="text-dark">Task Title</span>
                </div>

                <div class="modal_flex_item_content">
                  <input
                    type="text"
                    v-model="updateSingleTask.taskTitle"
                    :class="['form-control']"
                  />
                </div>
              </div>

              <div class="modal_flex_item">
                <div class="modal_flex_item_title">
                  <span class="text-dark">Task Description</span>
                </div>

                <div class="modal_flex_item_content d-flex flex-row">
                  <textarea
                    type="text"
                    v-model="updateSingleTask.taskDescription"
                    :class="['form-control']"
                  />
                </div>
              </div>

              <div class="modal_flex_item">
                <div class="modal_flex_item_title">
                  <span class="text-dark">Label Color</span>
                </div>
                <div class="modal_flex_item_content d-flex flex-row">
                  <div
                    class="outerBorder_dropdown"
                    @click="toggleDropdown('isDropdownActive')"
                    :class="{ show: isDropdownActive }"
                  >
                    <div class="dropdown_title clickable">
                      <span class="text-dark">Select Color</span>
                    </div>
                    <div class="dropdown_container d-flex flex-column">
                      <div v-for="color in availableColors">
                        <div class="color_selector clickable">
                          <span class="text-dark me-1">{{ color.value }}</span>
                          <span class="text-dark me-1">{{ color.color }}</span>
                          <div class="colorBlock" :style="{ backgroundColor: color.hex }"></div>
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
                        <div v-for="(member, index) in memberInfo">
                          <div v-if="!isMemberInTaskMembers(member)">
                            <div
                              class="draggable_wrapper"
                              draggable="true"
                              @dragstart="dragAvailableUser($event, member)"
                              @dragend="dragAvailableUserEnd(index)"
                            >
                              <userAvatar
                                :data-userid="member._id"
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
                        @drop="handleDropAvailableUser"
                      >
                        <div v-for="(member, index) in taskMembers.member">
                          <div
                            class="draggable_wrapper"
                            draggable="true"
                            @dragstart="dragAvailableUser($event, member)"
                            @dragend="dragAvailableUserEnd(index)"
                          >
                            <userAvatar
                              :data-userid="member._id"
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
            </OverlayScrollbarsComponent>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              v-on:click="deleteTask(refBoardIndex, refTaskIndex)"
            >
              Delete
            </button>

            <button type="button" v-on:click="toggleModalFalse" class="btn btn-secondary">
              Close
            </button>
            <button
              type="button"
              v-on:click="updateTask(refBoardIndex, refTaskIndex)"
              class="btn btn-primary"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div :v-if="singleBoard != 'null'">
    <div
      class="modal fade editBoardModal"
      :class="{ show: isShowingEditBoardModal }"
      tabindex="-1"
      aria-labelledby="editBoardModal"
    >
      <div class="modal-dialog my-auto">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title pe-3 text-dark">Update Board properties</h5>
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
                <input
                  type="text"
                  class="form-control"
                  v-model="newBoardName"
                  :placeholder="singleBoard.stateName"
                />
              </div>
            </div>

            <div class="modal_flex_item">
              <div class="modal_flex_item_title">
                <span class="text-dark">Tasks in board:</span>
              </div>
              <div class="modal_flex_item">
                <div v-for="(task, index) in singleBoard.taskArray">
                  <span class="me-1 text-dark">{{ index + 1 }}:</span>
                  <span class="text-dark">{{ task.taskTitle }}</span>
                </div>

                <div class="seperator"></div>
              </div>

              <div class="modal_flex_item flex-row">
                <input type="text" class="form-control me-1" v-model="tempTaskname" />
                <button
                  type="button"
                  class="btn btn-outline-success"
                  @click="addTaskToBoard(singleBoard.stateID)"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="toggleModalFalse" class="btn btn-secondary">
              Close
            </button>
            <button
              type="button"
              v-on:click="updateBoard(singleBoard.stateID)"
              class="btn btn-primary"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import * as projectCRUD from '../components/modules/projectCRUD.js'
import * as taskCRUD from '../components/modules/taskCRUD.js'
import type { i_state } from '../interfaces/i_state'
import i_singleUser from '../interfaces/i_singleUser.js'
import userAvatar from '../components/userAvatar.vue'
import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

const isShowingModal = ref(false)
const isShowingEditBoardModal = ref(false)
const isDropdownActive = ref(false)

const taskMembers: i_singleUser = reactive({ member: new Array(), taskID: '' })

const tempBoardHeader = ref('')
const tempBoardID = ref('')
const tempTaskname = ref('')
const newBoardName = ref()
const tempTaskID = ref()

const taskTitle = ref('')
const taskDescription = ref('')
const refBoardIndex = ref(-1)
const refTaskIndex = ref(-1)
const projectID = ref()
const kanbanBoards = ref([] as i_state[])
const singleBoard = ref('null')
const updateSingleTask = ref([] as i_state[])
const memberInfo = ref([] as i_singleUser[])

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  projectID.value = urlParams.get('project')
  loadStates(projectID.value)
})

const deleteTask = async (boardIndex, taskIndex) => {
  try {
    console.log(boardIndex, taskIndex)

    await taskCRUD
      .deleteSingleTask(kanbanBoards.value[boardIndex].taskArray[taskIndex]._id)
      .then(() => {
        kanbanBoards.value[boardIndex].taskArray.splice(taskIndex, 1)
        toggleModalFalse()
      })
  } catch (error: any) {
    console.error({
      title: 'Something went wrong when deleting task',
      message: error.message
    })
  }
}

const isMemberInTaskMembers = (member: any) => {
  const isMemberInTaskMembersArray = taskMembers.member.some((taskMember) => {
    return taskMember._id === member._id
  })

  if (isMemberInTaskMembersArray) {
    return true
  }

  const isUserAssigned = kanbanBoards.value.some((board) => {
    return board.taskArray.some((task) => {
      return task.assignedToID.some((user) => user.userID === member._id)
    })
  })

  return isUserAssigned
}

const handleDropAvailableUser = (event: DragEvent) => {
  console.log('drag dropped: ', event.target)

  const user: i_singleUser = {
    _id: event.dataTransfer?.getData('userID'),
    fName: event.dataTransfer?.getData('user_fName'),
    lName: event.dataTransfer?.getData('user_lName'),
    color: event.dataTransfer?.getData('user_color')
  }
  taskMembers.member.push(user)
  console.log('assignedToID: ', updateSingleTask)
  updateSingleTask.value.assignedToID.push(user)
}

const handleDropWorkingUser = (event: DragEvent) => {
  console.log('Drop event occurred')
  const target = event.target as HTMLElement
  console.log('Target element:', target)
}

const dragAvailableUser = (event: DragEvent, user: i_singleUser) => {
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

const loadStates = async (projectID: string) => {
  await projectCRUD.loadStatesFromProjectID(projectID).then(async (data: any) => {
    console.log(data.project[0])
    kanbanBoards.value = []
    memberInfo.value = []
    taskMembers.member = []

    await data.project[0].stateInfo.map(async (board: i_state) => {
      const tempTaskArray = data.project[0].taskArray.filter((task: any) => {
        return task.stateID == board.stateID
      })
      kanbanBoards.value.push({
        stateID: board.stateID,
        stateName: board.stateName,
        position: board.position,
        taskArray: tempTaskArray
      })
    })

    await data.project[0].membersInfo.map(async (member: any) => {
      memberInfo.value.push({
        _id: member._id,
        email: member.email,
        fName: member.fName,
        lName: member.lName,
        color: member.color
      })
    })
  })
}

const availableColors = ref([
  {
    value: 1,
    color: 'lightBlue',
    hex: '#add8e6'
  },
  {
    value: 2,
    color: 'lightGreen',
    hex: '#90ee90'
  },
  {
    value: 3,
    color: 'lightRed',
    hex: '#ffb6c1'
  },
  {
    value: 4,
    color: 'lightYellow',
    hex: '#ffffe0'
  }
])

let dragBoardIndex = -1
let dragTaskIndex = -1

const handleDragStart = (boardIndex: number, taskIndex: number, event: DragEvent) => {
  dragBoardIndex = boardIndex
  dragTaskIndex = taskIndex
  console.log('task dragging')
}

const handleDrop = (targetBoardIndex: number, targetTaskIndex: number) => {
  if (dragBoardIndex !== -1 && dragTaskIndex !== -1) {
    const taskToMove = kanbanBoards.value[dragBoardIndex].taskArray[dragTaskIndex]
    kanbanBoards.value[dragBoardIndex].taskArray.splice(dragTaskIndex, 1)

    // Check if dropped above or below the target task
    if (dragBoardIndex === targetBoardIndex && dragTaskIndex < targetTaskIndex) {
      targetTaskIndex-- // Adjust index if dropped above target
    }

    kanbanBoards.value[targetBoardIndex].taskArray.splice(targetTaskIndex, 0, taskToMove)

    dragBoardIndex = -1
    dragTaskIndex = -1
    console.log('Task dropped')
  }
}

const handleDragEnd = () => {
  dragBoardIndex = -1
  dragTaskIndex = -1

  console.log('task drag end')
}

// replace taskindex with taskID
const editTask = (boardIndex: number, taskIndex: number, taskID: string) => {
  console.log('double click', taskIndex)
  updateSingleTask.value = kanbanBoards.value[boardIndex].taskArray[taskIndex]

  refBoardIndex.value = boardIndex
  refTaskIndex.value = taskIndex

  //taskTitle.value = taskToEdit.taskName
  //taskDescription.value = taskToEdit.description

  console.log(taskID)

  taskMembers.taskID = taskID
  //tempTaskID.value = taskID

  isShowingModal.value = true
}

const editBoard = (boardID: string, boardName: string) => {
  console.log('dbl click, edit board: ', boardID)
  isShowingEditBoardModal.value = true

  let tempIndex = kanbanBoards.value.findIndex((board) => board.stateID === boardID)
  singleBoard.value = kanbanBoards.value[tempIndex]

  tempBoardHeader.value = boardName
  tempBoardID.value = boardID
}

const addTaskToBoard = (boardID: string) => {
  // Find the index of the board with the matching ID
  const index = kanbanBoards.value.findIndex((board) => board.stateID === boardID)

  // If the board is found
  if (index !== -1) {
    // Ensure taskArray exists or initialize it as an empty array
    kanbanBoards.value[index].taskArray = kanbanBoards.value[index].taskArray || []
    // Push the task to taskArray
    kanbanBoards.value[index].taskArray?.push({
      taskTitle: tempTaskname.value
    })
    console.log(kanbanBoards.value[index])

    tempTaskname.value = ''
  } else {
    console.log('Board not found')
  }
}

const toggleModalFalse = () => {
  isShowingModal.value = false
  isShowingEditBoardModal.value = false

  refBoardIndex.value = -1
  refTaskIndex.value = -1
}

const updateTask = async () => {
  const data = {
    taskID: updateSingleTask.value._id,
    taskTitle: updateSingleTask.value.taskTitle,
    taskDescription: updateSingleTask.value.taskDescription,
    assignedToID: updateSingleTask.value.assignedToID
  }

  console.log(data)

  await taskCRUD.updateSingleTask(data)

  await loadStates(projectID.value)
  isShowingModal.value = false
}

const updateBoard = async () => {
  const data = {
    stateID: singleBoard.value.stateID,
    stateName: newBoardName.value != '' ? newBoardName.value : singleBoard.stateName,
    taskArray: singleBoard.value.taskArray
  }

  await projectCRUD.updateSingleProjectBoard(data)

  await console.log(data)
}

const toggleDropdown = (refVal: string) => {
  console.log(refVal)

  switch (refVal) {
    case 'isDropdownActive':
      isDropdownActive.value = !isDropdownActive.value
      break

    default:
      break
  }
}
</script>

<style scoped>
/* Add your styles here */

.editBoardModal.show {
  display: flex !important;
}

.color_selector {
  display: flex;
  flex-direction: row;
  border: 1px solid #444444;
  padding: 0.25rem;
  border-radius: 6px;
  margin-top: 0.15rem;
  margin-bottom: 0.15rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.outerBorder_dropdown {
  position: relative;
}

.outerBorder_dropdown .dropdown_container {
  display: none !important;
  position: absolute;
  background-color: white;
  left: 0;
  top: 35px;
  border: 1px solid #444444;
  border-radius: 5px;
}

.outerBorder_dropdown.show .dropdown_container {
  display: flex !important;
}

.dropdown_title {
  border: 1px solid #444444;
  border-radius: 6px;
  padding: 0.25rem;
}

.colorBlock {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
}

.user_drag_container {
  border: 1px solid #cacaca;
  width: 100%;
  height: 250px;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
}

.draggable_wrapper {
  margin: 0.25rem;
}

.taskModal.show {
  display: flex;
  background-color: #000000b0;
}

.taskModal .modal-content {
  height: 100%;
}

.taskModal .modal-dialog {
  max-width: unset !important;
  min-width: 500px;
  max-height: 85vh !important;
  overflow: hidden;
  height: 100%;
}

.taskModalBody {
  overflow: auto;
}
</style>
