<template>
  <div class="kanban_Page_Container">
    <div class="kanban_scrollable_container d-flex flex-row w-100 align-items-center">
      <div v-for="(board, boardIndex) in kanbanBoards" :key="boardIndex">
        <boardElement :board="board" :boardIndex="boardIndex"></boardElement>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as projectCRUD from '../components/modules/projectCRUD.js'
import i_state from '../interfaces/i_state'
import { boardElement } from '../components/boardComponent.vue'

const isShowingModal = ref(false)
const refBoardIndex = ref(-1)
const refTaskIndex = ref(-1)
const projectID = ref()
const kanbanBoards = ref([] as i_state[])

interface Task {
  id: number
  title: string
  description: string
}

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  projectID.value = urlParams.get('project')
  loadStates(projectID.value)
})

const loadStates = async (projectID: string) => {
  await projectCRUD.loadStatesFromProjectID(projectID).then(async (data: any) => {
    console.log(data[0].stateInfo)

    data[0].stateInfo.map(async (board: any) => {
      kanbanBoards.value.push({
        _id: board._id,
        stateName: board.stateName
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
</script>
