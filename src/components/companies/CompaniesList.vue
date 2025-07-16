<template>
  <!-- columns-header -->
  <q-card
    @click="viewCompany(company.id)"
    class="companies-list-column-headers flex items-center text-secondary"
    style="height: 48px"
    flat
    bordered
  >
    <div class="row items-center full-width">
      <div class="col-auto q-pl-md q-pr-md">
        <div class="flag-placeholder">
          <SortButton
            :sortKey="'country'"
            :filterBy="filterBy"
            :updateFilterBy="updateFilterBy"
            tooltipLabel="Sort by country"
          />
        </div>
      </div>

      <div class="col-4 row items-center">
        <p class="q-pr-xs">Company</p>
        <SortButton
          :sortKey="'name'"
          :filterBy="filterBy"
          :updateFilterBy="updateFilterBy"
          tooltipLabel="Sort by company name"
        />
      </div>

      <div class="col-2 row items-center">
        <p class="q-pr-xs">DPF</p>
        <SortButton
          :sortKey="'isDpfFound'"
          :filterBy="filterBy"
          :updateFilterBy="updateFilterBy"
          tooltipLabel="Sort by DPF status"
        />
      </div>

      <div class="col-2 row items-center">
        <p class="q-pr-xs">AI Services</p>
        <SortButton
          :sortKey="'providesAiServices'"
          :filterBy="filterBy"
          :updateFilterBy="updateFilterBy"
          tooltipLabel="Sort by AI services status"
        />
      </div>

      <!-- Clear Sort button -->
      <div class="col-auto q-ml-auto q-mr-sm">
        <q-btn
          v-if="isCustomSortApplied"
          outline
          label="Clear Sort"
          icon="clear"
          color="secondary"
          class="text-12"
          @click="clearSort"
        />
      </div>
    </div>
  </q-card>

  <!-- items list -->

  <div
    v-if="!isLoading"
    class="companies-list column q-gutter-y-sm q-pt-sm scroll"
  >
  <!-- empty state -->
    <div
      v-if="companies.length === 0"
      class="column items-center justify-center text-center"
    >
      <q-img
        src="public/empty-states/empty-state-no-result.svg"
        spinner-color="grey-5"
        style="width: 200px; height: 200px"
        fit="contain"
      />
      <p class="text-18 text-font-thin text-secondary">No companies to show</p>
    </div>

    <!-- items -->
    <CompanyCardPreview
      v-else
      v-for="company in companies"
      :key="company.id"
      :company="company"
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
</template>

<script setup>
import { computed } from 'vue'
import SortButton from '../common/SortButton.vue'
import CompanyCardPreview from './CompanyCardPreview.vue'

const props = defineProps({
  companies: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
  filterBy: {
    type: Object,
    required: true,
  },
  updateFilterBy: {
    type: Function,
    required: true,
  },
})

const isCustomSortApplied = computed(() => {
  return (
    props.filterBy.sortBy !== 'dateAdded' || props.filterBy.sortDir !== 'desc'
  )
})

function clearSort() {
  props.updateFilterBy('sortBy', 'dateAdded')
  props.updateFilterBy('sortDir', 'desc')
}
</script>

<style scoped lang="scss">
.flag-placeholder {
  width: 24px;
}
</style>
