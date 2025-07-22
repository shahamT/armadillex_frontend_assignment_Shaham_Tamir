<template>
  <q-form @submit.prevent="onSubmit">
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

    <CountrySelect
      ref="countrySelectRef"
      :onCountrySelect="onCountrySelect"
      :selectedCountryCode="newCompany.country"
      :required="true"
    />

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
      :options="parentCompanies"
      color="brand"
      option-label="name"
      :loading="isparentCompaniesLoading"
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
            v-if="isparentCompaniesLoading"
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
import { reactive, ref, watch } from 'vue'
import CountrySelect from 'src/components/common/CountrySelect.vue'

const { onNextStep, selectedCompany } = defineProps({
  onNextStep: Function,
  selectedCompany: Object,
})

const emit = defineEmits(['update:savedCompanyId'])

const newCompany = reactive(companiesService.getEmptyCompany())

//fill new company with selected country from step 1
watch(
  () => selectedCompany,
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

//submiting the form and adding the company
async function onSubmit() {
  try {
    const savedCompany = await saveCompanyAsync(newCompany)
    emit('update:savedCompanyId', savedCompany?.id)
    onNextStep?.()
  } catch (err) {
    console.error('Failed to add company:', err)
  }
}

//general function to update the 'new company' object
function onUpdate(key, val) {
  newCompany[key] = val
}

//---- select parent company -----
const selectedParentCompany = ref(null)

//set filterby for companies with default sort by name
const companyFilterBy = reactive({
  ...companiesService.getDefaultFilterBy(),
  sortBy: 'name',
  sortDir: 'asc',
})

//fetch companies
const { companies: parentCompanies, isLoading: isparentCompaniesLoading } =
  useCompanies(companyFilterBy, 'addCompanySelect')

//filter companies
function onSearch(val, update) {
  companyFilterBy.search = val
  update()
}

//---- select country -----

function onCountrySelect(val) {
  onUpdate('country', val?.value || '')
}
</script>

<style scoped lang="scss">
.country-flag {
  width: 32px;
  max-height: 24px;
  border: 1px solid var(--q-secondary-light);
  border-radius: 2px;
}
</style>
