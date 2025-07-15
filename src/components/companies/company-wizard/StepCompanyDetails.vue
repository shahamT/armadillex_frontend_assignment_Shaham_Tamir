<template>
  <q-form
    ref="companyForm"
    @submit.prevent="onSubmit"
  >
    <p class="text-16 text-font-thin q-pb-xs q-ml-sm">Company Name</p>
    <q-input
      v-model="newCompany.company_name"
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

    <p class="text-16 text-font-thin q-pb-xs q-pt-sm q-ml-sm">Legal Name</p>
    <q-input
      v-model="newCompany.company_legal_name"
      class="text-18 q-pb-lg"
      outlined
      placeholder="Legal Name"
      color="brand"
      :rules="[(val) => !!val || 'Legal name is required']"
    >
    </q-input>

    <!-- Country select -->
    <p class="text-16 text-font-thin q-pb-xs q-pt-sm q-ml-sm">Country</p>

    <q-select
      class="text-18"
      v-model="selectedCountryOption"
      @update:model-value="(val) => onUpdate('country', val?.value || '')"
      outlined
      clearable
      use-input
      hide-selected
      fill-input
      placeholder="Filter by country"
      :options="filteredOptions"
      color="brand"
      @filter="filterFn"
      @filter-abort="abortFilterFn"
      :rules="[(val) => !!val || 'Country is required']"
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
            selectedCountryOption?.flagURL || 'public/imgs/placeholder_flag.jpg'
          "
          fit="contain"
          class="country-flag q-ml-xs q-mr-xs"
        />
      </template>

      <!-- No results -->
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No countries found</q-item-section>
        </q-item>
      </template>
    </q-select>

    <p class="text-16 text-font-thin q-pt-md q-pb-xs q-pt-sm q-ml-sm">
      Parent Company
    </p>
    <q-select
      class="text-18 q-pb-lg"
      v-model="selectedParentCompany"
      @update:model-value="
        (val) => onUpdate('parent_company_id', val?.id || null)
      "
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
      @virtual-scroll="onLoadMore"
    >
      <!-- Option slot -->
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ scope.opt.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <!-- No results -->
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No companies found</q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- DPF Toggle -->
    <p class="text-16 text-font-thin q-pb-xs q-pt-sm q-ml-sm">Attributes</p>

    <div class="row center-items q-pb-md">
      <q-toggle
        v-model="newCompany.dpf_found"
        color="brand"
        keep-color
        label="Has DPF"
        class="col-5 text-16 text-font-thin"
      />

      <!-- AI Toggle -->
      <q-toggle
        v-model="newCompany.provides_ai_services"
        color="brand"
        keep-color
        label="Uses AI Services"
        class="col-5 text-16 text-font-thin"
      />
    </div>

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
import { useAddCompany } from 'src/composables/useAddCompany'
import { useCompanies } from 'src/composables/useCompanies'
import { companiesService } from 'src/services/api/companies.service'
import { getCountriesOptions } from 'src/services/util.service'
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  onNextStep: Function,
  onPreviousStep: Function,
  selectedCompany: Object,
})

// const isOn = ref(true)

const newCompany = reactive(companiesService.getEmptyCompany())

console.log('selectedCompany step2: ', props.selectedCompany)

// function onContinue() {
// props.onNextStep?.()
// }

//fill new company with selected country from step 1
watch(
  () => props.selectedCompany,
  (newVal) => {
    if (newVal) {
      newCompany.company_name = newVal.label
      if (newVal.aiOption) {
        newCompany.company_legal_name = newVal.legalName
        newCompany.country = newVal.country
      }
    }
  },
  { immediate: true },
)

const { addCompany, isLoading: isAddLoading } = useAddCompany()

async function onSubmit() {
try {
    await addCompany(newCompany)
    props.onNextStep?.()
  } catch (err) {
    console.error('Failed to add company:', err)
  }
}

//---- select parent company -----

const searchTerm = ref('')
const companyPage = ref(1)
const finalizedCompanies = ref([])
const selectedParentCompany = ref(null)

const companyFilterBy = reactive({
  ...companiesService.getDefaultFilterBy(),
  search: '',
  sortBy: 'name',
  sortDir: 'asc',
  page: 1,
})

const { companies, isLoading: isCompaniesLoading } =
  useCompanies(companyFilterBy)

watch([searchTerm, companyPage], () => {
  companyFilterBy.search = searchTerm.value
  companyFilterBy.page = companyPage.value
})

watch(companies, (newCompanies) => {
  if (companyPage.value === 1) {
    finalizedCompanies.value = [...newCompanies]
  } else {
    finalizedCompanies.value.push(...newCompanies)
  }
})

function onSearch(val, update) {
  searchTerm.value = val
  companyPage.value = 1
  update()
}

function onLoadMore({ to }) {
  if (to === finalizedCompanies.value.length - 1) {
    companyPage.value++
  }
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
