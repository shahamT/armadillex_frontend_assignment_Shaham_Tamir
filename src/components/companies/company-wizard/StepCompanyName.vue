<template>
  <div class="q-pa-md">
    <div class="row no-wrap items-center">
      <div class="full-width">
        <q-select
          outlined
          clearable
          use-input
          hide-selected
          fill-input
          placeholder="Company Name"
          :options="companies"
          v-model="selectedCompany"
          color="brand"
          :loading="isLoading"
          @filter="onFilter"
          @filter-abort="onFilterAbort"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-img :src="scope.opt.flagURL" fit="contain" class="country-flag" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>{{ scope.opt.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No companies found</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAiCompaniesSuggestions } from 'src/composables/useAiCompaniesSuggestions'

const searchTerm = ref('')
const selectedCompany = ref(null)

const { companies, isLoading, refetch } = useAiCompaniesSuggestions()

function onFilter(val, done) {
  searchTerm.value = val?.trim() || ''
  if (searchTerm.value.length >= 2) {
    refetch().then(() => done())
  } else {
    done()
  }
}

function onFilterAbort() {
  searchTerm.value = ''
}
</script>


<style scoped lang="scss">

</style>