<template>
  <q-card class="list-container q-pa-lg">
    <!-- card header -->
    <q-card-section class="row items-center q-pa-none q-mb-md">
      <h1 class="text-40">Companies</h1>

      <!-- add company btn -->
      <div class="col-auto text-18 q-ml-auto">
        <q-btn
          unelevated
          size="md"
          padding="8px 20px 8px 12px"
          color="brand"
          icon="add"
          label="Add company"
          class="text-18 light-radius"
          @click="openAddCompanyWizard"
        />
      </div>
    </q-card-section>

    <!-- seperator -->
    <q-separator class="q-mb-md" />

    <!-- filter -->
    <CompaniesFilterPanel
      :filterBy="filterBy"
      :updateFilterBy="updateFilterBy"
      :maxPage="maxPage"
    />

    <!-- companies list -->
    <div class="companies-list-wrapper">
      <CompaniesList
        :companies="companies"
        :filterBy="filterBy"
        :updateFilterBy="updateFilterBy"
        :isLoading="isLoading"
      />
    </div>

    <!-- bottom pagination -->
    <div class="row justify-end q-mt-auto q-pa-md">
      <q-pagination
        :model-value="filterBy.page"
        @update:model-value="(val) => updateFilterBy('page', val)"
        :max="maxPage"
        direction-links
        gutter="8px"
        color="brand"
      />
    </div>
  </q-card>

  <!-- dialog for add-company flow -->
  <CompanyWizard
    v-model="isCompanyWizardOpen"
    :type="companyWizardType"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useCompanies } from 'src/composables/useCompanies'
import { companiesService } from 'src/services/api/companies.service'

import CompaniesFilterPanel from 'src/components/companies/CompaniesFilterPanel.vue'
import CompaniesList from 'src/components/companies/CompaniesList.vue'
import CompanyWizard from 'src/components/companies/company-wizard/CompanyWizard.vue'

//'add company' flow related
const isCompanyWizardOpen = ref(false)
const companyWizardType = ref('add')

function openAddCompanyWizard() {
  companyWizardType.value = 'add'
  isCompanyWizardOpen.value = true
}

//set filter by
const filterBy = ref(companiesService.getDefaultFilterBy())
filterBy.value.pageSize = 15

const { companies, maxPage, isLoading } = useCompanies(filterBy)

function updateFilterBy(key, value) {
  filterBy.value[key] = value
}
</script>
