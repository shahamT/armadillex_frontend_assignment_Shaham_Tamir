<template>
  <q-btn
    flat
    dense
    round
    size="sm"
    :icon="icon"
    :color="isActive ? 'brand' : 'grey-6'"
    @click="toggleSort"
    class="q-ml-xs"
    :class="isActive ? 'bg-accent' : 'none'"
  >
    <q-tooltip
      v-if="tooltipLabel"
      class="text-body2"
      anchor="top middle"
      self="bottom middle"
      :offset="[0, 8]"
    >
      {{ tooltipLabel }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  sortKey: { type: String, required: true },
  filterBy: { type: Object, required: true },
  updateFilterBy: { type: Function, required: true },
  tooltipLabel: { type: String, required: false },
})

const isActive = computed(() => props.filterBy.sortBy === props.sortKey)
const isDesc = computed(() => props.filterBy.sortDir === 'desc')

const icon = computed(() => {
  if (!isActive.value) return 'keyboard_arrow_down'
  return isDesc.value ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
})

function toggleSort() {
  if (!isActive.value) {
    props.updateFilterBy('sortBy', props.sortKey)
    props.updateFilterBy('sortDir', 'asc')
  } else if (!isDesc.value) {
    props.updateFilterBy('sortDir', 'desc')
  } else {
    // Clear sort
    props.updateFilterBy('sortBy', 'dateAdded')
    props.updateFilterBy('sortDir', 'desc')
  }
}
</script>
