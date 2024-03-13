<template>
  <div class="kanban_Page_Container">
    <div class="kanban_scrollable_container d-flex flex-row w-100 align-items-center">
      <div v-for="(board, boardIndex) in kanbanBoards" :key="boardIndex">
        <div class="kanban_outerBorder">
          <h2 class="kanban_title">{{ board.title }}</h2>
          <div class="separator"></div>

          <!-- Add other Kanban board content here -->

          <div class="kanban_task_container" @dragover.prevent @drop="handleDrop(boardIndex)">
            <ul>
              <li
                v-for="(task, taskIndex) in board.tasks"
                :key="taskIndex"
                draggable="true"
                @dragstart="handleDragStart(boardIndex, taskIndex, $event)"
                @dragend="handleDragEnd"
                @dblclick="editTask(boardIndex, taskIndex)"
              >
                <h4>{{ task.title }}</h4>
                <!-- <p>{{ task.description }}</p> -->
              </li>
            </ul>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isShowingModal = ref(false)
const taskTitle = ref('')
const taskDescription = ref('')
const refBoardIndex = ref(-1)
const refTaskIndex = ref(-1)

interface Task {
  id: number
  title: string
  description: string
}

interface KanbanBoard {
  id: number
  title: string
  tasks: Task[]
}

const kanbanBoards = ref([
  {
    id: 1,
    title: 'Board 1',
    tasks: generateTasks(10)
  },
  {
    id: 2,
    title: 'Board 2',
    tasks: generateTasks(10)
  },
  {
    id: 3,
    title: 'Board 3',
    tasks: generateTasks(10)
  },
  {
    id: 4,
    title: 'Board 4',
    tasks: generateTasks(10)
  }
])

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
    const taskToMove = kanbanBoards.value[dragBoardIndex].tasks[dragTaskIndex]
    kanbanBoards.value[dragBoardIndex].tasks.splice(dragTaskIndex, 1)
    kanbanBoards.value[targetBoardIndex].tasks.push(taskToMove)

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
  let taskToEdit = kanbanBoards.value[boardIndex].tasks[taskIndex]

  refBoardIndex.value = boardIndex
  refTaskIndex.value = taskIndex

  taskTitle.value = taskToEdit.title
  taskDescription.value = taskToEdit.description

  isShowingModal.value = true
}

const toggleModalFalse = () => {
  isShowingModal.value = false

  refBoardIndex.value = -1
  refTaskIndex.value = -1
}

const updateTask = (boardIndex: number, taskIndex: number) => {
  let taskToUpdate = kanbanBoards.value[boardIndex].tasks[taskIndex]

  taskToUpdate.title = taskTitle.value
  taskToUpdate.description = taskDescription.value

  refBoardIndex.value = -1
  refTaskIndex.value = -1

  isShowingModal.value = false
}
</script>

<style scoped>
/* Add your styles here */
</style>
