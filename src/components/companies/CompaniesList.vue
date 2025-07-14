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
        <div class="flag-placeholder"></div>
      </div>

      <div class="col-4">
        <p>Company</p>
      </div>

      <div class="col-2">
        <p>DPF</p>
      </div>

      <div class="col-2">
        <p>AI Services</p>
      </div>
    </div>
  </q-card>

  <!-- items list -->

  <div class="companies-list column q-gutter-y-sm q-pt-sm scroll">
    <CompanyCardPreview
      v-for="company in companies"
      :key="company.id"
      :company="company"
    />
  </div>

  <!-- Pagination -->
  <div class="col row justify-end items-center">
    <q-pagination
      :model-value="currentPage"
      @update:model-value="onPageChange"
      :max="maxPage"
      direction-links
      gutter="20px"
    />
  </div>
</template>

<script setup>
import CompanyCardPreview from './CompanyCardPreview.vue'

defineProps({
  companies: {
    type: Array,
    required: true,
  },
  maxPage: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  onPageChange: {
    type: Function,
    required: true,
  },
})
</script>

<style lang="scss">
.flag-placeholder {
  width: 24px;
}
</style>
