<template>
  <div class="org_item_container px-2 py-2 d-flex flex-row clickable">
    <span class="org_item_index me-2">{{ orgIndexProp }}</span>
    <span class="org_item_name">{{ orgNameProp }}</span>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    orgIndex: Number,
    orgName: String
  },
  computed: {
    // Use the prop as a local variable
    orgIndexProp() {
      return this.orgIndex
    },
    orgNameProp() {
      return this.orgName
    }
  }
}
</script>
