<template>
  <div class="companies-filter-panel q-mb-lg">
    <!-- Main row -->
    <div class="row items-center q-col-gutter-md">
      <!-- Text Search -->
      <div class="col-3">
        <q-input
          :model-value="filterBy.search"
          @update:model-value="(val) => updateFilterBy('search', val)"
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
          :outline="!filterOpen && activeFilters <= 0"
          color="secondary"
          padding="8px 16px"
          icon="filter_list"
          :label="activeFilters > 0 ? `Filters (${activeFilters})` : 'Filters'"
          class="full-width light-radius"
          @click="filterOpen = !filterOpen"
        />
      </div>

      <!-- Pagination -->
      <div class="col row justify-end items-center">
        <q-pagination
          :model-value="filterBy.page"
          @update:model-value="(val) => updateFilterBy('page', val)"
          :max="maxPage"
          direction-links
          gutter="8px"
          color="brand"
        />
      </div>
    </div>

    <!-- Collapsible filters panel -->
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
          <!-- Toggles - active / dpf / ai services -->
          <div class="q-gutter-sm col-auto">
            <q-toggle
              :model-value="filterBy.active"
              @update:model-value="(val) => updateFilterBy('active', val)"
              label="Show inactive companies"
              color="brand"
            />
            <q-toggle
              :model-value="filterBy.ai"
              @update:model-value="(val) => updateFilterBy('ai', val)"
              label="Provides AI Services"
              color="brand"
            />
            <q-toggle
              :model-value="filterBy.dpf"
              @update:model-value="(val) => updateFilterBy('dpf', val)"
              label="Listed in DPF"
              color="brand"
            />
          </div>

          <!-- Country select -->
          <CountrySelect
            :onCountrySelect="onCountrySelect"
            :selectedCountryCode="filterBy.country"
            class="q-ml-lg col-2"
            :dense="true"
          />

          <!-- Parent Company select -->
          <CompanySelect
            :onCompanySelect="onParentCompanySelect"
            :selectedCompanyId="filterBy.parentCompany"
            class="q-ml-lg col-2"
            :dense="true"
          />

          <!-- Clear filters button -->
          <div
            v-if="activeFilters > 0"
            class="auto q-ml-auto"
          >
            <div class="auto text-18">
              <q-btn
                outline
                color="secondary"
                padding="8px 16px"
                icon="filter_list_off"
                label="Clear Filters"
                class="light-radius"
                @click="handleClearFilters"
              />
            </div>
          </div>
        </q-card>
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CountrySelect from '../common/CountrySelect.vue'
import CompanySelect from '../common/CompanySelect.vue'

const { filterBy, updateFilterBy, maxPage } = defineProps({
  filterBy: {
    type: Object,
    required: true,
  },
  updateFilterBy: {
    type: Function,
    required: true,
  },
  maxPage: {
    type: Number,
    default: 5,
  },
})

//filter section expanded/collapsed
const filterOpen = ref(false)

//counting active filters
const activeFilters = computed(() => {
  let count = 0
  if (filterBy.country) count++
  if (filterBy.active) count++
  if (filterBy.ai) count++
  if (filterBy.dpf) count++
  if (filterBy.parentCompany) count++
  return count
})

//clear filters
function clearFilters() {
  updateFilterBy('country', '')
  updateFilterBy('active', false)
  updateFilterBy('ai', false)
  updateFilterBy('dpf', false)
  updateFilterBy('parentCompany', '')
}

function handleClearFilters() {
  clearFilters()
  filterOpen.value = false
}

//Country select
function onCountrySelect(val) {
  updateFilterBy('country', val?.value || '')
}

//Company select
function onParentCompanySelect(val) {
  updateFilterBy('parentCompany', val?.id || '')
}
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

.country-flag {
  width: 32px;
  max-height: 24px;
  border: 1px solid var(--q-secondary-light);
  border-radius: 2px;
}

.select-input {
  min-width: 200px;
}
</style>
