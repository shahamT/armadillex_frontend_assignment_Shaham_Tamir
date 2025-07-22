<template>
  <q-select
    ref="companySelectRef"
    class="company-select"
    :model-value="selectedCompanyObj"
    @update:model-value="handleUpdate"
    outlined
    :dense="dense"
    :class="dense ? '' : 'text-18'"
    use-input
    fill-input
    clearable
    hide-selected
    placeholder="Parent Company"
    :options="companies"
    color="brand"
    option-label="name"
    :loading="isLoading"
    @filter="onSearch"
    :rules="required ? [(val) => !!val || 'Required field'] : []"
  >
    <!-- Company option template -->
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <!-- Company No results template -->
    <template v-slot:no-option>
      <q-item>
        <q-item-section
          v-if="isLoading"
          class="text-grey"
        >
          Searching...
        </q-item-section>
        <q-item-section
          v-else
          class="text-grey"
        >
          No companies found
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { useCompanies } from 'src/composables/useCompanies'
import { companiesService } from 'src/services/api/companies.service'
import { computed, reactive, ref } from 'vue'

const { onCompanySelect, selectedCompanyId } = defineProps({
  onCompanySelect: {
    type: Function,
    required: true,
  },
  selectedCompanyId: {
    type: String,
    required: true,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const companySelectRef = ref()


const selectedCompanyObj = computed(() =>
  companies.value.find((c) => c.id === selectedCompanyId) || null
)

//set filterby for companies with default sort by name
const companyFilterBy = reactive({
  ...companiesService.getDefaultFilterBy(),
  sortBy: 'name',
  sortDir: 'asc',
})

//fetch companies
const { companies, isLoading } = useCompanies(
  companyFilterBy,
  'companySelect',
)

//filter companies options in input
function onSearch(val, update) {
  const search = val.toLowerCase()
  companyFilterBy.search = search
  update()
}

function handleUpdate(val) {
  onCompanySelect(val)
}

</script>

<style scoped lang="scss">
.company-select {
  min-width: 200px;
}
</style>
