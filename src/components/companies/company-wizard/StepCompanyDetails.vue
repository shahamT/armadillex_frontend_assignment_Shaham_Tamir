<template>
  <q-form
    ref="companyForm"
    @submit.prevent="onSubmit"
  >
    <!-- company name input -->
    <p class="text-16 text-font-thin q-pb-xs q-ml-sm">Company Name *</p>
    <q-input
      v-model="newCompany.name"
      class="text-18 q-pb-lg"
      outlined
      placeholder="Company Name"
      color="brand"
      :rules="[
        (val) => !!val || 'Company name is required',
        (val) => val?.length >= 2 || 'Must be at least 2 letters',
      ]"
    >
    </q-input>

    <!-- legal name input -->
    <p class="text-16 text-font-thin q-pb-xs q-pt-sm q-ml-sm">Legal Name *</p>
    <q-input
      v-model="newCompany.legalName"
      class="text-18 q-pb-lg"
      outlined
      placeholder="Legal Name"
      color="brand"
      :rules="[(val) => !!val || 'Legal name is required']"
    >
    </q-input>

    <!-- Country select -->
    <p class="text-16 text-font-thin q-pb-xs q-pt-sm q-ml-sm">
      Headquarters Country *
    </p>

    <q-select
      class="text-18"
      v-model="selectedCountryOption"
      @update:model-value="(val) => onUpdate('country', val?.value || '')"
      outlined
      clearable
      use-input
      hide-selected
      fill-input
      placeholder="Select Country"
      :options="filteredOptions"
      color="brand"
      @filter="filterFn"
      @filter-abort="abortFilterFn"
      :rules="[(val) => !!val || 'Country is required']"
    >
      <!-- country Option template -->
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

      <!-- country flag prefix on selection -->
      <template v-slot:prepend>
        <q-img
          :src="selectedCountryOption?.flagURL || '/imgs/placeholder_flag.jpg'"
          fit="contain"
          class="country-flag q-ml-xs q-mr-xs"
        />
      </template>

      <!-- country No results template -->
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No countries found</q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- parent company select -->
    <p class="text-16 text-font-thin q-pt-md q-pb-xs q-pt-sm q-ml-sm">
      Parent Company
    </p>
    <q-select
      class="text-18 q-pb-lg"
      v-model="selectedParentCompany"
      @update:model-value="(val) => onUpdate('parentId', val?.id || null)"
      outlined
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
      <!-- parent company Option template -->
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ scope.opt.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <!-- parent company No results template-->
      <template v-slot:no-option>
        <q-item>
          <q-item-section
            v-if="isCompaniesLoading"
            class="text-grey"
            >Searching...</q-item-section
          >
          <q-item-section
            v-else
            class="text-grey"
            >No companies found</q-item-section
          >
        </q-item>
      </template>
    </q-select>

    <!-- DPF Toggle -->
    <p class="text-16 text-font-thin q-pb-xs q-pt-sm q-ml-sm">Attributes</p>

    <div class="row center-items q-pb-md">
      <q-toggle
        v-model="newCompany.isDpfFound"
        color="brand"
        keep-color
        label="Has DPF"
        class="col-5 text-16 text-font-thin"
      />

      <!-- AI Toggle -->
      <q-toggle
        v-model="newCompany.providesAiServices"
        color="brand"
        keep-color
        label="Uses AI Services"
        class="col-5 text-16 text-font-thin"
      />
    </div>

    <!-- submit btn -->
    <q-btn
      unelevated
      size="md"
      padding="14px 16px"
      color="brand"
      label="Add Company"
      type="submit"
      class="text-18 light-radius full-width q-mt-md"
      :loading="isAddLoading"
    />
  </q-form>
</template>

<script setup>
import { useSaveCompany } from 'src/composables/useSaveCompany'
import { useCompanies } from 'src/composables/useCompanies'
import { companiesService } from 'src/services/api/companies.service'
import { getCountriesOptions } from 'src/services/util.service'
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  onNextStep: Function,
  onPreviousStep: Function,
  selectedCompany: Object,
  savedCompanyId: String,
})

const emit = defineEmits(['update:savedCompanyId'])

const newCompany = reactive(companiesService.getEmptyCompany())

//fill new company with selected country from step 1
watch(
  () => props.selectedCompany,
  (newVal) => {
    if (newVal) {
      newCompany.name = newVal.label
      if (newVal.aiOption) {
        newCompany.legalName = newVal.legalName
        newCompany.country = newVal.country
      }
    }
  },
  { immediate: true },
)

const { saveCompanyAsync, isLoading: isAddLoading } = useSaveCompany()

async function onSubmit() {
  try {
    const savedCompany = await saveCompanyAsync(newCompany)
    emit('update:savedCompanyId', savedCompany?.id)
    props.onNextStep?.()
  } catch (err) {
    console.error('Failed to add company:', err)
  }
}

//---- select parent company -----
const finalizedCompanies = ref([])
const selectedParentCompany = ref(null)

const companyFilterBy = reactive({
  ...companiesService.getDefaultFilterBy(),
  search: '',
  sortBy: 'name',
  sortDir: 'asc',
  page: 1,
  pageSize: null,
})

const { companies, isLoading: isCompaniesLoading } = useCompanies(
  companyFilterBy,
  'addCompanySelect',
)

watch(companies, (newCompanies) => {
  finalizedCompanies.value = [...newCompanies]
})

function onSearch(val, update) {
  companyFilterBy.search = val
  update()
}

function onUpdate(key, val) {
  newCompany[key] = val
}

//---- select country -----
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

const selectedCountryOption = computed({
  get() {
    return allOptions.find((opt) => opt.value === newCompany.country) || null
  },
  set(val) {
    newCompany.country = val?.value || ''
  },
})
</script>

<style scoped lang="scss">
.country-flag {
  width: 32px;
  max-height: 24px;
  border: 1px solid var(--q-secondary-light);
  border-radius: 2px;
}
</style>
