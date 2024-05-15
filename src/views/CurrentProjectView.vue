<template>
  <div class="kanban_Page_Container">
    <div
      class="kanban_scrollable_container d-flex flex-row w-100 align-items-center"
      @dragover.prevent
      @drop="dragAndDropState($event)"
    >
      <div
        class="kanbanBoard_State"
        v-for="(board, boardIndex) in kanbanBoards"
        :key="boardIndex"
        draggable="true"
        @dragstart="onDragStateStart($event, boardIndex)"
        :id="'kanbanStateBoard' + (boardIndex + 1)"
      >
        <div class="kanban_outerBorder">
          <h2 class="kanban_title" @dblclick="editBoard(board.stateID, board.stateName)">
            {{ board.stateName }}
          </h2>
          <div class="separator"></div>

          <!-- Add other Kanban board content here -->

          <div
            class="kanban_task_container"
            @dragover.prevent="handleDragOver(boardIndex, $event)"
            @drop="handleDrop(boardIndex, targetTaskIndex)"
          >
            <ul>
              <li
                v-for="(task, taskIndex) in board.taskArray"
                :key="taskIndex"
                draggable="true"
                @dragstart="handleDragStart(boardIndex, taskIndex, $event)"
                @dragend="handleDragEnd"
                @dblclick="editTask(boardIndex, taskIndex, task.id)"
                :id="'task_' + boardIndex + '_' + taskIndex"
              >
                <TaskComponent :title="task.taskTitle" :color="task.labelColor"></TaskComponent>
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
      <taskPropertiesModal
        :kanbanBoards="kanbanBoards"
        :singleTask="updateSingleTask"
        :color="taskColor"
        :members="memberInfo"
        :taskMembers="taskMembers"
        :boardIndex="refBoardIndex"
        :taskIndex="refTaskIndex"
        @close="closeTaskModal"
        @reload="reloadPage"
      ></taskPropertiesModal>
    </div>
  </div>

  <div :v-if="singleBoard != 'null'">
    <div
      class="modal fade editBoardModal"
      :class="{ show: isShowingEditBoardModal }"
      tabindex="-1"
      aria-labelledby="editBoardModal"
    >
      <editBoardModal
        :singleBoard="singleBoard"
        @close="closeEditBoardModal"
        @reload="reloadPage"
      ></editBoardModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import * as projectCRUD from '../components/modules/projectCRUD.js'
import * as taskCRUD from '../components/modules/taskCRUD.js'
import type { State } from '../interfaces/i_state'

import taskPropertiesModal from '@/components/taskPropertiesModal.vue'
import editBoardModal from '@/components/editBoardModal.vue'

import TaskComponent from '@/components/taskComponent.vue'
import type { User } from '@/interfaces/i_user'

const isShowingModal = ref(false)
const isShowingEditBoardModal = ref(false)

const taskMembers: User = reactive({ member: new Array(), taskID: '' })

const tempBoardHeader = ref('')
const tempBoardID = ref('')
const refBoardIndex = ref(-1)
const refTaskIndex = ref(-1)
const projectID = ref()
const kanbanBoards = ref([] as State[])
const singleBoard = ref('null')
const updateSingleTask = ref([] as any[])
const memberInfo = ref([] as User[])
const taskColor = ref('')

const targetTaskIndex = ref(-1)
const placeholderTop = ref(0) // Vertical position of the placeholder
const isDragging = ref(false) // Whether a task is being dragged
const dragTaskIndex = ref(-1) // Index of the dragged task

let draggedIndex: number | null = null

onMounted(() => {
  reloadPage()
})

const reloadPage = async () => {
  toggleModalFalse()
  const urlParams = new URLSearchParams(window.location.search)
  projectID.value = urlParams.get('project')
  loadStates(projectID.value)
}

function hasParentWithId(element: HTMLElement): number {
  while (element) {
    const match = element.id.match(/kanbanStateBoard(\d+)/)
    if (match) {
      return parseInt(match[1], 10) - 1 // Extract the number and return it, zero-based index
    }
    element = element.parentElement as HTMLElement
  }
  return -1
}

const onDragStateStart = (event: DragEvent, index: number) => {
  draggedIndex = index
  event.dataTransfer?.setData('text/plain', String(index))
}

const dragAndDropState = (event: DragEvent) => {
  event.preventDefault()
  const target = event.target as HTMLElement
  const targetIndex = hasParentWithId(target)

  if (draggedIndex === null || targetIndex === -1 || draggedIndex === targetIndex) {
    return
  }

  const draggedBoard = kanbanBoards.value[draggedIndex]

  if (!draggedBoard) {
    console.error('Dragged board is undefined')
    return
  }

  // Remove the dragged item
  kanbanBoards.value.splice(draggedIndex, 1)

  // Insert the dragged item at the target index
  kanbanBoards.value.splice(targetIndex, 0, draggedBoard)

  // Update positions
  kanbanBoards.value.forEach((board, index) => {
    if (board) {
      board.position = index + 1
    } else {
      console.error(`Board at index ${index} is undefined`)
    }
  })

  draggedIndex = null // Reset draggedIndex
  projectCRUD.updateStatePositions(kanbanBoards.value)
}

const loadStates = async (projectID: string) => {
  await projectCRUD.loadStatesFromProjectID(projectID).then(async (data) => {
    kanbanBoards.value = []
    memberInfo.value = []
    taskMembers.member = []

    await data.project[0].stateInfo.map(async (board) => {
      const temp = data.project[0].taskArray.filter((task) => {
        return task.stateID == board.stateID
      })
      kanbanBoards.value.push({
        stateID: board.stateID,
        stateName: board.stateName,
        position: board.position,
        taskArray: temp
      })
    })
    kanbanBoards.value.sort((a, b) => a?.position - b?.position)

    await data.project[0].membersInfo.map(async (member) => {
      memberInfo.value.push({
        id: member.id,
        email: member.email,
        fName: member.fName,
        lName: member.lName,
        color: member.color
      })
    })
  })
}

let dragBoardIndex = -1

const handleDragStart = (boardIndex: number, taskIndex: number, event: DragEvent) => {
  dragBoardIndex = boardIndex
  dragTaskIndex.value = taskIndex
}

const handleDrop = async (targetBoardIndex: number, targetTaskIndex: number) => {
  try {
    if (dragBoardIndex !== -1 && dragTaskIndex.value !== -1) {
      const taskToMove = kanbanBoards.value[dragBoardIndex].taskArray[dragTaskIndex.value]
      kanbanBoards.value[dragBoardIndex].taskArray.splice(dragTaskIndex.value, 1)

      // Adjust the targetTaskIndex if it's out of bounds
      if (targetTaskIndex < 0) {
        targetTaskIndex = 0
      } else if (targetTaskIndex > kanbanBoards.value[targetBoardIndex].taskArray.length) {
        targetTaskIndex = kanbanBoards.value[targetBoardIndex].taskArray.length
      }

      // Insert the taskToMove at the targetTaskIndex
      kanbanBoards.value[targetBoardIndex].taskArray.splice(targetTaskIndex, 0, taskToMove)

      // Update the position of all tasks in the target board
      kanbanBoards.value[targetBoardIndex].taskArray.forEach(async (task, index) => {
        if (task.stateID !== kanbanBoards.value[targetBoardIndex].stateID) {
          await taskCRUD.updateTaskState(task.id, kanbanBoards.value[targetBoardIndex].stateID)
        }

        task.position = index
      })

      dragBoardIndex = -1
      dragTaskIndex.value = -1

      await taskCRUD.updateTaskPosition(kanbanBoards.value[targetBoardIndex].taskArray)
    }
  } catch (error: any) {
    console.error({ Title: 'error when moving task position', message: error.message })
  }
}
// Drag over event handler to calculate the target task index
const handleDragOver = (boardIndex: number, event: DragEvent) => {
  // Get the index of the dragged task
  const draggedTaskIndex = dragTaskIndex.value

  // Ensure taskArray is not empty
  if (kanbanBoards.value[boardIndex].taskArray.length > 0) {
    // Get the position of the mouse relative to the viewport
    const mouseY = event.clientY

    // Calculate the index of the target task based on mouseY
    let targetIndex = -1

    // Loop through each task and check if mouseY is between its top and bottom positions
    kanbanBoards.value[boardIndex].taskArray.forEach((task, index) => {
      const taskElement = document.getElementById(`task_${boardIndex}_${index}`)
      if (taskElement) {
        const taskRect = taskElement.getBoundingClientRect()
        if (mouseY >= taskRect.top && mouseY <= taskRect.bottom) {
          // If mouseY is within the bounds of the task, set targetIndex to the current index
          targetIndex = index
        }
      }
    })

    // If targetIndex is still -1, mouseY is below all tasks, so set targetIndex to the last index
    if (targetIndex === -1) {
      targetIndex = kanbanBoards.value[boardIndex].taskArray.length
    }

    // Set the targetTaskIndex value
    targetTaskIndex.value = targetIndex
  }
}

const handleDragEnd = () => {
  dragBoardIndex = -1
  dragTaskIndex.value = -1
}

// replace taskindex with taskID
const editTask = (boardIndex: number, taskIndex: number, taskID: string) => {
  updateSingleTask.value = kanbanBoards.value[boardIndex].taskArray[taskIndex]

  refBoardIndex.value = boardIndex
  refTaskIndex.value = taskIndex
  taskColor.value = updateSingleTask.value.labelColor

  //taskTitle.value = taskToEdit.taskName
  //taskDescription.value = taskToEdit.description

  taskMembers.taskID = taskID
  //tempTaskID.value = taskID

  isShowingModal.value = true
}

const editBoard = (boardID: string, boardName: string) => {
  isShowingEditBoardModal.value = true

  let tempIndex = kanbanBoards.value.findIndex((board) => board.stateID === boardID)
  singleBoard.value = kanbanBoards.value[tempIndex]

  tempBoardHeader.value = boardName
  tempBoardID.value = boardID
}

const closeTaskModal = () => {
  toggleModalFalse()
}

const closeEditBoardModal = () => {
  toggleModalFalse()
}

const toggleModalFalse = () => {
  isShowingModal.value = false
  isShowingEditBoardModal.value = false

  refBoardIndex.value = -1
  refTaskIndex.value = -1
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

.placeholder {
  background-color: #c7c7c7; /* Placeholder color */
  height: 2px; /* Placeholder height */
  transition: height 0.3s; /* Smooth transition */
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

.userAvatarIteration {
  width: 36px;
  height: 36px;
}
</style>
