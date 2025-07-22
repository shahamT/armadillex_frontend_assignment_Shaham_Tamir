<template>
  <!-- Country select -->
  <div class="country-select">
    <q-select
      ref="countrySelectRef"
      :model-value="selectedCountryObj"
      @update:model-value="onCountrySelect"
      outlined
      :dense="dense"
      :class="dense ? '' : 'text-18'"
      clearable
      use-input
      hide-selected
      fill-input
      placeholder="Filter by country"
      :options="filteredCountries"
      color="brand"
      @filter="onCountryFilter"
      :rules="required? [(val) => !!val || 'Country is required'] : []"
    >
      <!-- Country Option template -->
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-img
              :src="scope.opt.flagURL"
              fit="contain"
              class="country-flag"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
            <q-item-label caption>
              {{ scope.opt.description }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:prepend>
        <q-img
          :src="selectedCountryObj?.flagURL || '/imgs/placeholder_flag.jpg'"
          fit="contain"
          class="country-flag q-ml-xs q-mr-xs"
        />
      </template>

      <!-- Country No results template -->
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No countries found</q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { getCountriesOptions } from 'src/services/util.service'
import { computed, ref } from 'vue'

const { onCountrySelect, selectedCountryCode } = defineProps({
  onCountrySelect: {
    type: Function,
    required: true,
  },
  selectedCountryCode: {
    type: String,
    required: true,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const countrySelectRef = ref()

defineExpose({
  validate: () => countrySelectRef.value?.validate?.()
})

const allCountries = getCountriesOptions()
const filteredCountries = ref([...allCountries])

function onCountryFilter(val, update) {
  const search = val.toLowerCase()
  filteredCountries.value = allCountries.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search) ||
      opt.description.toLowerCase().includes(search),
  )
  update()
}

const selectedCountryObj = computed(
  () => allCountries.find((opt) => opt.value === selectedCountryCode) || null,
)

</script>

<style scoped lang="scss">
.country-select {
  min-width: 200px;
}

.country-flag {
  width: 32px;
  max-height: 24px;
  border: 1px solid var(--q-secondary-light);
  border-radius: 2px;
}
</style>
