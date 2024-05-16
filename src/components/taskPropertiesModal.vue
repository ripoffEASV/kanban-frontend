<script setup lang="ts">
import { ref, defineProps } from 'vue'
import type { User } from '../interfaces/i_user.js'
import type { State } from '@/interfaces/i_state'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import 'overlayscrollbars/overlayscrollbars.css'

import * as taskCRUD from '../components/modules/taskCRUD'
import userAvatar from '../components/userAvatar.vue'

const props = defineProps<{
  singleTask: any
  kanbanBoards: any
  boardIndex: number
  taskIndex: number
  color: string
  members: any
  taskMembers: any
}>()

const emits = defineEmits(['close', 'reload'])
const close = () => {
  emits('close')
}

const labelColor = ref(props.color)

const taskTitle = ref('')
const taskDescription = ref('')

const taskHoursExpected = ref()
const taskHoursSpent = ref()

const deleteTask = async (taskID, boardIndex, taskIndex) => {
  try {
    await taskCRUD.deleteSingleTask(taskID).then(() => {
      props.kanbanBoards[boardIndex].taskArray.splice(taskIndex, 1)
      emits('close')
    })
  } catch (error: any) {
    console.error({
      title: 'Something went wrong when deleting task',
      message: error.message
    })
  }
}

const isMemberInTaskMembers = (member: User) => {
  const isUserInAssignedToArray = props.singleTask.assignedToID.some((user) => {
    return user.id === member.id
  })

  return isUserInAssignedToArray
}

const handleDropAvailableUser = (event: DragEvent) => {
  const user = {
    id: event.dataTransfer?.getData('userID'),
    fName: event.dataTransfer?.getData('user_fName'),
    lName: event.dataTransfer?.getData('user_lName'),
    color: event.dataTransfer?.getData('user_color')
  }
  props.taskMembers.member.push(user)
  props.singleTask.assignedToID.push(user)
}

const handleDropWorkingUser = (event: DragEvent) => {
  let target = event.target as HTMLElement

  // find parent container "dragMemberContainer" with data-attribute = "type"
  while (target && !target.classList.contains('user_drag_container')) {
    target = target.parentElement as HTMLElement
  }

  if (target.classList.contains('available')) {
    const userID = event.dataTransfer?.getData('userID')

    props.singleTask.assignedToID.some((user, index) => {
      if (user.id == userID) {
        props.singleTask.assignedToID.splice(index, 1)
      }
    })
  }
}

const dragAvailableUser = (event: DragEvent, user) => {
  event.dataTransfer?.setData('userID', user.id)
  event.dataTransfer?.setData('user_fName', user.fName)
  event.dataTransfer?.setData('user_lName', user.lName)
  event.dataTransfer?.setData('user_color', user.color)
}

const dragAvailableUserEnd = (index: number) => {}

// Sanitize the input value to contain only numeric characters
// type defines what which input was throwing the event
const sanitizeInput = (type: number) => {
  switch (type) {
    case 1:
      taskHoursExpected.value = taskHoursExpected.value.replace(/\D/g, '')
      break
    case 2:
      taskHoursSpent.value = taskHoursSpent.value.replace(/\D/g, '')
      break

    default:
      break
  }
}

const updateTask = async () => {
  const data = {
    taskID: props.singleTask._id,
    taskTitle: taskTitle.value,
    taskDescription: taskDescription.value,
    assignedToID: props.singleTask.assignedToID,
    labelColor: labelColor.value,
    hoursExpected: taskHoursExpected.value | 0,
    hoursSpent: taskHoursSpent.value | 0
  }

  await taskCRUD.updateSingleTask(data)
  emits('reload')
}
</script>
<template>
  <div class="modal-dialog my-auto">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title pe-3 text-dark">Update task properties</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          v-on:click="close"
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
                :placeholder="props.singleTask.taskTitle"
                v-model="taskTitle"
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
                :placeholder="props.singleTask.taskDescription"
                v-model="taskDescription"
                :class="['form-control']"
              />
            </div>
          </div>

          <div class="modal_flex_item flex-row w-100 py-2">
            <div class="modal_flex_item_title my-auto">
              <span class="text-dark">Expected Task Hours</span>
            </div>

            <div class="modal_flex_item_content d-flex flex-row ms-auto justify-end">
              <input
                type="text"
                maxlength="8"
                :placeholder="props.singleTask.hoursExpected"
                v-model="taskHoursExpected"
                class="form-control w-2/4"
                @input="sanitizeInput(1)"
              />
            </div>
          </div>

          <div class="modal_flex_item flex-row w-100 py-2">
            <div class="modal_flex_item_title my-auto">
              <span class="text-dark">Actual Task Hours</span>
            </div>

            <div class="modal_flex_item_content d-flex flex-row ms-auto justify-end">
              <input
                type="text"
                maxlength="8"
                :placeholder="props.singleTask.hoursSpent"
                v-model="taskHoursSpent"
                @input="sanitizeInput(2)"
                class="form-control w-2/4"
              />
            </div>
          </div>

          <div class="modal_flex_item">
            <div class="modal_flex_item_title">
              <span class="text-dark">Label Color</span>
            </div>
            <div class="modal_flex_item_content d-flex flex-row">
              <v-color-picker hide-inputs v-model="labelColor"></v-color-picker>
              <!-- <v-color-picker id="colorpicker" hide-inputs v-model="props.color"></v-color-picker> -->
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
                    <div class="userAvatarIteration" v-for="(member, index) in props.members">
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
                    <div
                      class="userAvatarIteration"
                      v-for="(member, index) in props.singleTask.assignedToID"
                    >
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
        </OverlayScrollbarsComponent>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-danger"
          v-on:click="deleteTask(props.singleTask._id, props.boardIndex, props.taskIndex)"
        >
          Delete
        </button>

        <button type="button" v-on:click="close" class="btn btn-secondary">Close</button>
        <button type="button" v-on:click="updateTask()" class="btn btn-primary">Update</button>
      </div>
    </div>
  </div>
</template>
