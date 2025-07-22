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

    <!-- Parent Company select -->
    <p class="text-16 text-font-thin q-pt-md q-pb-xs q-pt-sm q-ml-sm">
      Parent Company
    </p>
    
    <CompanySelect
      :onCompanySelect="onParentCompanySelect"
      :selectedCompanyId="newCompany.parentId"
      class="q-pb-lg"
    />

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
import { companiesService } from 'src/services/api/companies.service'
import { reactive, watch } from 'vue'
import CountrySelect from 'src/components/common/CountrySelect.vue'
import CompanySelect from 'src/components/common/CompanySelect.vue'

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

//select company
function onParentCompanySelect(val) {
  onUpdate('parentId', val?.id || null)
}

//select country
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
