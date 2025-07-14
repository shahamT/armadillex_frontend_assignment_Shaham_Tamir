<template>
  <div class="companies-filter-panel q-pa-md">
    <!-- Main row -->
    <div class="row items-center q-col-gutter-md">
      <!-- Search -->
      <div class="col-3">
        <q-input
          :model-value="filterBy.search"
          @update:model-value="(val) => onUpdate('search', val)"
          type="search"
          class="text-18"
          outlined
          placeholder="Search companies..."
          clearable
          dense
          color="brand"
          debounce="300"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- Filter button -->
      <div class="auto text-18">
        <q-btn
          filled
          color="secondary"
          icon="tune"
          label="Filters"
          class="full-width"
          @click="filterOpen = !filterOpen"
        />
      </div>

      <!-- Pagination -->
      <div class="col row justify-end items-center">
        <q-pagination
          :model-value="filterBy.page"
          @update:model-value="(val) => onUpdate('page', val)"
          :max="maxPage"
          direction-links
          gutter="20px"
        />
      </div>
    </div>

    <!-- Filters row -->
    <q-slide-transition>
      <div
        v-show="filterOpen"
        class="q-mt-md"
      >
        <q-card
          flat
          bordered
          class="q-pa-md row items-center"
        >
          <!-- Toggles -->
          <div class="q-gutter-sm col-auto">
            <q-toggle
              :model-value="filterBy.active"
              @update:model-value="(val) => onUpdate('active', val)"
              label="Active Companies Only"
              color="brand"
            />
            <q-toggle
              :model-value="filterBy.ai"
              @update:model-value="(val) => onUpdate('ai', val)"
              label="Provides AI Services"
              color="brand"
            />
            <q-toggle
              :model-value="filterBy.dpf"
              @update:model-value="(val) => onUpdate('dpf', val)"
              label="Listed in DPF"
              color="brand"
            />
          </div>

          <!-- Country select -->
          <div class="col-3">
            <q-select
              class="text-16"
              outlined
              dense
              :model-value="filterBy.country"
              @update:model-value="(val) => onUpdate('country', val)"
              placeholder="Filter by country"
              use-input
              emit-value
              map-options
              :options="countryOptions"
              prepend-inner-icon="public"
              color="brand"
              clearable
            />
          </div>
        </q-card>
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getCountries } from 'src/services/util.service'

defineProps({
  filterBy: {
    type: Object,
    required: true,
  },
  onUpdate: {
    type: Function,
    required: true,
  },
  maxPage: {
    type: Number,
    default: 5,
  },
})

const filterOpen = ref(false)
const countryOptions = getCountries()
</script>

<style scoped lang="scss">
.companies-filter-panel {
  max-width: 100%;
}

.search-close-btn {
  border-radius: 4px;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: rgb(223, 223, 223);
  }
}
</style>
