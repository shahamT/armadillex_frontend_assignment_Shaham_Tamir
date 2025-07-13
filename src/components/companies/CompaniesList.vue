<template>
  <CompanyCardPreview
    v-for="company in companies"
    :key="company.id"
    :company="company"
  />
</template>

<script setup>
import CompanyCardPreview from './CompanyCardPreview.vue'

defineProps({
  companies: {
    type: Array,
    required: true,
  },
})


</script>

<style lang="scss">
</style>
