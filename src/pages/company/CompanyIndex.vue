<template>
  <q-card class="list-container">
    <!-- header -->
    <q-card-section>
      <h1 class="text-40">Companies</h1>
    </q-card-section>

    <!-- filter -->
    <CompaniesFilterPanel
      :filterBy="filterBy"
      :onUpdate="updateFilterBy"
      :maxPage="maxPage"
    />

    <!-- list -->
    <div
      v-if="!isLoading"
      class="companies-list-wrapper column q-pa-md"
    >
      <CompaniesList
        :companies="companies"
        class="column"
        :maxPage="maxPage"
        :currentPage="filterBy.page"
        :onPageChange="(val) => updateFilterBy('page', val)"
      />
    </div>

    <!-- list loading state -->
    <div
      v-else
      class="q-pa-lg flex full-width items-center justify-center"
    >
      <q-spinner
        color="brand"
        size="4em"
      />
    </div>

  </q-card>
</template>

<script setup>
import { reactive } from 'vue'
import { useCompanies } from 'src/composables/useCompanies'
import { companiesService } from 'src/services/api/companies.service'

import CompaniesFilterPanel from 'src/components/companies/CompaniesFilterPanel.vue'
import CompaniesList from 'src/components/companies/CompaniesList.vue'

const filterBy = reactive(companiesService.getDefaultFilterBy())
const { companies, maxPage, isLoading } = useCompanies(filterBy)

console.log("companies: ", companies)

function updateFilterBy(key, value) {
  filterBy[key] = value
}
</script>

<style lang="scss"></style>
