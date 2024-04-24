<template>
  <div class="kanban_Page_Container">
    <div class="kanban_scrollable_container d-flex flex-row w-100 align-items-center">
      <div v-for="(board, boardIndex) in kanbanBoards" :key="boardIndex">
        <div class="kanban_outerBorder">
          <h2 class="kanban_title" @dblclick="editBoard(board.stateID, board.stateName)">
            {{ board.stateName }}
          </h2>
          <div class="separator"></div>

          <!-- Add other Kanban board content here -->

          <div class="kanban_task_container" @dragover.prevent @drop="handleDrop(boardIndex)">
            <!-- <ul>
              <li
                v-for="(task, taskIndex) in board.tasks"
                :key="taskIndex"
                draggable="true"
                @dragstart="handleDragStart(boardIndex, taskIndex, $event)"
                @dragend="handleDragEnd"
                @dblclick="editTask(boardIndex, taskIndex)"
              >
                <h4>{{ task.title }}</h4>
                <p>{{ task.description }}</p>
              </li>
            </ul> -->
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
          <h5 class="modal-title pe-3 text-dark">Update task properties</h5>
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
              <span class="text-dark">Task Description</span>
            </div>
            <div class="modal_flex_item_title pb-2">
              <span class="text-dark">{{ taskDescription }}</span>
            </div>
          </div>

          <div class="modal_flex_item">
            <div class="modal_flex_item_title">
              <span class="text-dark">Task Title</span>
            </div>

            <div class="modal_flex_item_content">
              <input type="text" v-model="taskTitle" :class="['form-control']" />
            </div>
          </div>

          <div class="modal_flex_item">
            <div class="modal_flex_item_title">
              <span class="text-dark">Task Description</span>
            </div>

            <div class="modal_flex_item_content d-flex flex-row">
              <input type="text" v-model="taskDescription" :class="['form-control me-3']" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
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
                  <span class="text-dark">{{ task.taskName }}</span>
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
import { onMounted, ref } from 'vue'
import * as projectCRUD from '../components/modules/projectCRUD.js'
import i_state from '../interfaces/i_state'

const isShowingModal = ref(false)
const isShowingEditBoardModal = ref(false)
const tempBoardHeader = ref('')
const tempBoardID = ref('')
const tempTaskname = ref('')
const newBoardName = ref()

const taskTitle = ref('')
const taskDescription = ref('')
const refBoardIndex = ref(-1)
const refTaskIndex = ref(-1)
const projectID = ref()
const kanbanBoards = ref([] as i_state[])
const singleBoard = ref('null')

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  projectID.value = urlParams.get('project')
  loadStates(projectID.value)
})

const loadStates = async (projectID: string) => {
  await projectCRUD.loadStatesFromProjectID(projectID).then(async (data: any) => {
    console.log(data.project[0].stateInfo)

    await data.project[0].stateInfo.map(async (board: i_state) => {
      kanbanBoards.value.push({
        stateID: board.stateID,
        stateName: board.stateName,
        taskArray: board.taskArray,
        position: board.position
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

function generateTasks(count: number): Task[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Task ${index + 1}`,
    description: `Description for Task ${index + 1}`
  }))
}

let dragBoardIndex = -1
let dragTaskIndex = -1

const handleDragStart = (boardIndex: number, taskIndex: number, event: DragEvent) => {
  dragBoardIndex = boardIndex
  dragTaskIndex = taskIndex
}

const handleDrop = (targetBoardIndex: number) => {
  if (dragBoardIndex !== -1 && dragTaskIndex !== -1) {
    const taskToMove = kanbanBoards.value[dragBoardIndex].taskArray[dragTaskIndex]
    kanbanBoards.value[dragBoardIndex].taskArray.splice(dragTaskIndex, 1)
    kanbanBoards.value[targetBoardIndex].taskArray.push(taskToMove)

    dragBoardIndex = -1
    dragTaskIndex = -1
  }
}

const handleDragEnd = () => {
  dragBoardIndex = -1
  dragTaskIndex = -1
}

// replace taskindex with taskID
const editTask = (boardIndex: number, taskIndex: number) => {
  console.log('double click', taskIndex)
  let taskToEdit = kanbanBoards.value[boardIndex].taskArray[taskIndex]

  refBoardIndex.value = boardIndex
  refTaskIndex.value = taskIndex

  taskTitle.value = taskToEdit.taskName
  // taskDescription.value = taskToEdit.description

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
      taskName: tempTaskname.value
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

const updateTask = (boardIndex: number, taskIndex: number) => {
  let taskToUpdate = kanbanBoards.value[boardIndex].taskArray[taskIndex]

  taskToUpdate.taskName = taskTitle.value
  // taskToUpdate.description = taskDescription.value

  refBoardIndex.value = -1
  refTaskIndex.value = -1

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
</script>

<style scoped>
/* Add your styles here */

.editBoardModal.show {
  display: flex !important;
}
</style>
