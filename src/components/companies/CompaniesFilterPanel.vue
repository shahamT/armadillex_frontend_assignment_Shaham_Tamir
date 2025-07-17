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
          @update:model-value="(val) => onUpdate('page', val)"
          :max="maxPage"
          direction-links
          gutter="8px"
          color="brand"
        />
      </div>
    </div>

    <!-- Filters panel -->
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
              label="Show inactive companies"
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
          <div class="select-input col-2 q-ml-lg">
            <q-select
              :model-value="selectedCountryObj"
              @update:model-value="
                (val) => onUpdate('country', val?.value || '')
              "
              outlined
              dense
              clearable
              use-input
              hide-selected
              fill-input
              placeholder="Filter by country"
              :options="filteredOptions"
              color="brand"
              @filter="filterFn"
              @filter-abort="abortFilterFn"
            >
              <!-- Option -->
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-img
                      :src="scope.opt.flagURL"
                      fit="contain"
                      class="country-flag"
                    />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>
                      {{ scope.opt.description }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:prepend>
                <q-img
                  :src="
                    selectedCountryObj?.flagURL || '/imgs/placeholder_flag.jpg'
                  "
                  fit="contain"
                  class="country-flag q-ml-xs q-mr-xs"
                />
              </template>

              <!-- No results -->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"
                    >No countries found</q-item-section
                  >
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Parent Company select -->
          <q-select
            class="col-2 select-input q-ml-lg"
            v-model="selectedParentCompany"
            outlined
            dense
            use-input
            fill-input
            clearable
            hide-selected
            placeholder="Parent Company"
            :options="finalizedCompanies"
            color="brand"
            option-label="name"
            :loading="isCompaniesLoading"
            @filter="onSearch"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No companies found
                </q-item-section>
              </q-item>
            </template>
          </q-select>

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
                @click="
                  () => {
                    clearFilters()
                    filterOpen = false
                  }
                "
              />
            </div>
          </div>
        </q-card>
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { getCountriesOptions } from 'src/services/util.service'
import { useCompanies } from 'src/composables/useCompanies'
import { companiesService } from 'src/services/api/companies.service'

const { filterBy, onUpdate, maxPage } = defineProps({
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
  onUpdate('country', '')
  onUpdate('active', false)
  onUpdate('ai', false)
  onUpdate('dpf', false)
  onUpdate('parentCompany', '')
  selectedParentCompany.value = null
}

//---- Country filter -----
const allOptions = getCountriesOptions()
const filteredOptions = ref([...allOptions])

function filterFn(val, update) {
  const search = val.toLowerCase()
  filteredOptions.value = allOptions.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search) ||
      opt.description.toLowerCase().includes(search),
  )
  update()
}

function abortFilterFn() {
  filteredOptions.value = [...allOptions]
}

const selectedCountryObj = computed(
  () => allOptions.find((opt) => opt.value === filterBy.country) || null,
)

//Parent company filter
const finalizedCompanies = ref([])
const selectedParentCompany = ref(null)

const companyFilterBy = reactive({
  ...companiesService.getDefaultFilterBy(),
  search: '',        
  sortBy: 'name',
  sortDir: 'asc',
  page: 1,
  pageSize: null  
})

const { companies, isLoading: isCompaniesLoading } = useCompanies(
  companyFilterBy,
  'parentFilterSelect'
)

watch(companies, (newCompanies) => {
  finalizedCompanies.value = [...newCompanies]
})

function onSearch(val, update) {
  const search = val.toLowerCase()
  finalizedCompanies.value = companies.value.filter((c) =>
    c.name?.toLowerCase().includes(search)
  )
  update()
}

watch(selectedParentCompany, (val) => {
  onUpdate('parentCompany', val?.id || '')
})

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
