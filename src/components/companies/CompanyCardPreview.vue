<template>
  <q-card
    @click="viewCompany(company.id)"
    class="company-card-preview q-pa-sm"
    bordered
  >
    <q-card-section
      horizontal
      class="company-details"
    >
      <q-img
        class="country-flag"
        :src="getFlagUrl(company.country)"
        style="width: 24px; height: 16px"
        fit="contain"
        spinner-color="grey-5"
      >
        <q-tooltip
          class="text-body2"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
        >
          {{ company.country }} ({{ getCountryFullName(company.country) }})
        </q-tooltip>
      </q-img>
      <q-card-section>
        <p class="company-name text-24">{{ company.name }}</p>
      </q-card-section>
      <q-card-section>
        <p class="text-24">{{ company.name }}</p>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { getCountryFullName, getFlagUrl } from 'src/services/util.service'

defineProps({
  company: {
    type: Object,
    required: true,
  },
})

function viewCompany(id) {
  console.log('id: ', id)
}
</script>

<style lang="scss"></style>
