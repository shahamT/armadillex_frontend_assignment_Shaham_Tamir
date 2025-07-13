<template>
  <q-card>
    <q-card-section>
      <h1>Companies</h1>
    </q-card-section>
    <q-card-section>
      <CompaniesList :companies="companies"/>
      <pre>
        {{ JSON.stringify(companies, null, 2) }}
      </pre>
    </q-card-section>
  </q-card>
</template>

<script setup>
import CompaniesList from 'src/components/companies/CompaniesList.vue';
import { useCompanies } from 'src/composables/useCompanies'

const { companies } = useCompanies()
</script>

<style lang="scss">
.company-card-preview{
  :hover{
    background-color: aqua;
  }
}

</style>
