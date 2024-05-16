<template>
  <div class="modal-dialog my-auto">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title pe-3 text-dark">Update Board properties</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          v-on:click="close"
        ></button>
      </div>
      <div class="modal-body d-flex flex-column">
        <div class="modal_flex_item">
          <div class="modal_flex_item_title">
            <input
              type="text"
              class="form-control"
              v-model="newBoardName"
              :placeholder="props.board.stateName"
            />
          </div>
        </div>

        <div class="modal_flex_item">
          <div class="modal_flex_item_title">
            <span class="text-dark">Tasks in board:</span>
          </div>
          <div class="modal_flex_item">
            <div v-for="(task, index) in props.board.taskArray">
              <span class="me-1 text-dark">{{ index + 1 }}:</span>
              <span class="text-dark">{{ task.taskTitle }}</span>
            </div>
            <div class="seperator"></div>
            <div v-for="(task, index) in tempTaskArray">
              <span class="me-1 text-dark">{{ index + 1 }}:</span>
              <span class="text-dark">{{ task.taskTitle }}</span>
            </div>

            <div class="seperator"></div>
          </div>

          <div class="modal_flex_item flex-row">
            <input type="text" class="form-control me-1" v-model="tempTaskname" />
            <button type="button" class="btn btn-outline-success" @click="addTaskToBoard()">
              Add
            </button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" v-on:click="close" class="btn btn-secondary">Close</button>
        <button type="button" v-on:click="updateBoard()" class="btn btn-primary">Update</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import * as projectCRUD from '../components/modules/projectCRUD'

const newBoardName = ref()
const tempTaskArray = ref([] as any[])

const tempTaskname = ref('')

const props = defineProps<{
  board: any
}>()

const emits = defineEmits(['close', 'reload'])
const close = () => {
  emits('close')
}

const updateBoard = async () => {
  // save tasks temporarily
  let mergeTaskArrays = props.board.taskArray

  // merge created tasks
  if (tempTaskArray.value.length > 0) {
    tempTaskArray.value.forEach((task) => {
      mergeTaskArrays.push(task)
    })
  }

  const data = {
    stateID: props.board.stateID,
    stateName: newBoardName.value != '' ? newBoardName.value : props.board.stateName,
    taskArray: tempTaskArray.value
  }

  tempTaskArray.value = []

  await projectCRUD.updateSingleProjectBoard(data)
}

const addTaskToBoard = () => {
  tempTaskArray.value.push({
    taskTitle: tempTaskname.value
  })

  tempTaskname.value = ''
}
</script>
