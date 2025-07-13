<template>
  <q-card>
    <q-card-section>
      <h1>Companies</h1>
    </q-card-section>
    <q-card-section>
      <pre>
        {{ JSON.stringify(companies, null, 2) }}
      </pre>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useCompanies } from 'src/composables/useCompanies'

const { companies } = useCompanies()
</script>
