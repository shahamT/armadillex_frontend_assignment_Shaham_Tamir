<template>
  <div>
    <p class="text-16 text-font-thin q-pb-sm">Enter company name</p>

    <div class="row no-wrap items-center">
      <q-select
        class="full-width text-16"
        outlined
        use-input
        hide-selected
        fill-input
        :map-options="false"
        input-debounce="0"
        dropdown-icon=""
        placeholder="Company Name"
        :options="companies"
        :model-value="selectedCompany?.label || ''"
        color="brand"
        :loading="isLoading"
        @filter="onFilter"
        @filter-abort="onFilterAbort"
        @input-value="onInputChange"
        @update:model-value="onSelect"
      >
        <!-- Custom Option Template -->
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
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        
      </q-select>

      <div class="col-auto text-18 q-ml-sm">
        <q-btn
          unelevated
          size="md"
          padding="19px 16px"
          color="brand"
          label="Continue"
          class="text-18 light-radius"
          @click="onContinue"
        />
      </div>

    </div>
    <div v-if="selectedCompany?.aiOption" class="row items-center q-pt-sm">
      <q-img
                  src="public/imgs/ai-agent.png"
                  alt="AI Agent"
                  fit="contain"
                  class="ai-avatar col-2 q-mr-md"
                />
        <p  class="col-8 text-16 text-font-thin">Great! Our AI agent can seamlessly fill in some details for you now. </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAiCompaniesSuggestions } from 'src/composables/useAiCompaniesSuggestions'

// State
const searchTerm = ref('')
const selectedCompany = ref(null)

// Suggestions from composable
const {
  companies: rawCompanies,
  isLoading,
  refetch,
} = useAiCompaniesSuggestions()

// Filtered company suggestions
const companies = computed(() => {
  if (searchTerm.value.length < 2) return []
  return rawCompanies.value?.map(c => ({ ...c, aiOption: true })) || []
})

// Handle typed input
function onInputChange(val) {
  searchTerm.value = val?.trim() || ''

  if (
    !selectedCompany.value ||
    selectedCompany.value.label !== val
  ) {
    selectedCompany.value = {
      label: val,
      value: val,
      aiOption: false
    }
  }
}

// Handle selection from dropdown
function onSelect(val) {
  if (val && typeof val === 'object') {
    selectedCompany.value = val
  }
}

// Clear suggestions when input is canceled
function onFilterAbort() {
  searchTerm.value = ''
}

// Fetch suggestions on input

function onFilter(val, update) {
  searchTerm.value = val?.trim() || ''
  if (searchTerm.value.length >= 2) {
    refetch().then(() => update())
  } else {
    update()
  }
}

function onContinue() {
  console.log('Selected Company:', selectedCompany.value)
}
</script>

<style scoped lang="scss">
.country-flag {
  width: 24px;
  height: 16px;
}

.ai-avatar{
    height: 36px;
    width: 36px;
}
</style>
