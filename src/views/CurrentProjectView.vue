<template>
  <div class="kanban_Page_Container">
    <div class="kanban_scrollable_container d-flex flex-row w-100 align-items-center"
                  @dragover.prevent
                  @drop="dragAndDropState($event)">
      <div class="kanbanBoard_State" v-for="(board, boardIndex) in kanbanBoards" :key="boardIndex"
                        draggable="true"
                        @dragstart="onDragStateStart($event, boardIndex)" :id="'kanbanStateBoard' + (boardIndex + 1)">
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
                @dblclick="editTask(boardIndex, taskIndex, task._id)"
                :id="'task_' + boardIndex + '_' + taskIndex"
              >
                <h4 :style="{ backgroundColor: task.labelColor }">{{ task.taskTitle }}</h4>
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
                        <div
                          class="color_selector clickable"
                          :class="{
                            active:
                              updateSingleTask.labelColor != null &&
                              color.hex == updateSingleTask.labelColor
                          }"
                          @click="setColor(color.value)"
                        >
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
                        <div class="userAvatarIteration" v-for="(member, index) in memberInfo">
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
                        @drop="handleDropAvailableUser($event)"
                      >
                        <div
                          class="userAvatarIteration"
                          v-for="(member, index) in updateSingleTask.assignedToID"
                        >
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
            <button type="button" v-on:click="updateTask()" class="btn btn-primary">Update</button>
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
import type { State } from '../interfaces/i_state'
import type { User } from '../interfaces/i_singleUser.js'
import type { Task } from '../interfaces/i_task.js'
import userAvatar from '../components/userAvatar.vue'
import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

const isShowingModal = ref(false)
const isShowingEditBoardModal = ref(false)
const isDropdownActive = ref(false)

const taskMembers: User = reactive({ member: new Array(), taskID: '' })

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
const kanbanBoards = ref([] as State[])
const singleBoard = ref('null')
const updateSingleTask = ref([] as Task[])
const memberInfo = ref([] as User[])

const targetTaskIndex = ref(-1)
const placeholderTop = ref(0) // Vertical position of the placeholder
const isDragging = ref(false) // Whether a task is being dragged
const dragTaskIndex = ref(-1) // Index of the dragged task

let draggedIndex: number | null = null;

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  projectID.value = urlParams.get('project')
  loadStates(projectID.value)
})

const deleteTask = async (boardIndex, taskIndex) => {
  try {

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

const isMemberInTaskMembers = (member: User) => {
  const isUserInAssignedToArray = updateSingleTask.value.assignedToID?.some((user) => {
    return user._id === member._id
  })

  return isUserInAssignedToArray
}

const handleDropAvailableUser = (event: DragEvent) => {

  const user: User = {
    _id: event.dataTransfer?.getData('userID'),
    fName: event.dataTransfer?.getData('user_fName'),
    lName: event.dataTransfer?.getData('user_lName'),
    color: event.dataTransfer?.getData('user_color')
  }
  taskMembers.member.push(user)
  updateSingleTask.value.assignedToID.push(user)
}

const handleDropWorkingUser = (event: DragEvent) => {
  const target = event.target as HTMLElement

  if (target.classList.contains('available')) {
    const userID = event.dataTransfer?.getData('userID')

    updateSingleTask.value.assignedToID.some((user, index) => {
      if (user._id == userID) {
        updateSingleTask.value.assignedToID.splice(index, 1)
      }
    })
  }
}

function hasParentWithId(element: HTMLElement): number {
  while (element) {
    const match = element.id.match(/kanbanStateBoard(\d+)/);
    if (match) {
      return parseInt(match[1], 10) - 1; // Extract the number and return it, zero-based index
    }
    element = element.parentElement as HTMLElement;
  }
  return -1;
}

const onDragStateStart = (event: DragEvent, index: number) => {
  draggedIndex = index;
  event.dataTransfer?.setData('text/plain', String(index));
};

const dragAndDropState = (event: DragEvent) => {
  event.preventDefault();
  const target = event.target as HTMLElement;
  const targetIndex = hasParentWithId(target);

  if (draggedIndex === null || targetIndex === -1 || draggedIndex === targetIndex) {
    return;
  }

  const draggedBoard = kanbanBoards.value[draggedIndex];

  if (!draggedBoard) {
    console.error('Dragged board is undefined');
    return;
  }

  // Remove the dragged item
  kanbanBoards.value.splice(draggedIndex, 1);

  // Insert the dragged item at the target index
  kanbanBoards.value.splice(targetIndex, 0, draggedBoard);

  // Update positions
  kanbanBoards.value.forEach((board, index) => {
    if (board) {
      board.position = index + 1;
    } else {
      console.error(`Board at index ${index} is undefined`);
    }
  });

  draggedIndex = null; // Reset draggedIndex
  projectCRUD.updateStatePositions(kanbanBoards.value);
};

const dragAvailableUser = (event: DragEvent, user: User) => {
  event.dataTransfer?.setData('userID', user._id)
  event.dataTransfer?.setData('user_fName', user.fName)
  event.dataTransfer?.setData('user_lName', user.lName)
  event.dataTransfer?.setData('user_color', user.color)
}

const dragAvailableUserEnd = (index: number) => {
}

const loadStates = async (projectID: string) => {
  await projectCRUD.loadStatesFromProjectID(projectID).then(async (data: any) => {
    kanbanBoards.value = []
    memberInfo.value = []
    taskMembers.member = []

    await data.project[0].stateInfo.map(async (board: State) => {
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
    kanbanBoards.value.sort((a, b) => a?.position - b?.position);

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
    value: 0,
    color: 'none',
    hex: '#FFFFFF'
  },
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
    hex: '#fcde9f'
  }
])

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
          await taskCRUD.updateTaskState(task._id, kanbanBoards.value[targetBoardIndex].stateID)

        }

        task.position = index
      })

      dragBoardIndex = -1
      dragTaskIndex.value = -1

      await taskCRUD.updateTaskPosition(kanbanBoards.value[targetBoardIndex].taskArray)
    }
  } catch (error: any) {
    console.log({ Title: 'error when moving task position', message: error.message })
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
    assignedToID: updateSingleTask.value.assignedToID,
    labelColor: updateSingleTask.value.labelColor
  }

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
}

const toggleDropdown = (refVal: string) => {

  switch (refVal) {
    case 'isDropdownActive':
      isDropdownActive.value = !isDropdownActive.value
      break

    default:
      break
  }
}

const setColor = (colorVal: number) => {
  switch (colorVal) {
    case 1:
      updateSingleTask.value.labelColor = '#add8e6'
      break
    case 2:
      updateSingleTask.value.labelColor = '#90ee90'
      break
    case 3:
      updateSingleTask.value.labelColor = '#ffb6c1'
      break
    case 4:
      updateSingleTask.value.labelColor = '#fcde9f'
      break
    default:
      updateSingleTask.value.labelColor = '#4b4b4b'
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
