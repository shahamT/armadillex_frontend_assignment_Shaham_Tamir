<template>
  <div>
    <p class="text-16 text-font-thin q-pb-sm">Enter company name</p>

    <!-- company name select -->
    <div class="row no-wrap items-center">
      <q-select
        class="full-width text-18"
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
        <!-- popup header with ai statement -->
        <template v-slot:before-options>
          <div class="q-pa-sm text-primary text-subtitle2 bg-info">
            <q-img
              src="/imgs/ai-agent.png"
              alt="AI Agent"
              fit="contain"
              class="ai-avatar-small col-2 q-mr-md q-ml-sm"
            />
            Our AI agent found few matches for you
          </div>
        </template>

        <!-- AI Company suggestion Template -->
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section class="q-pa-xs full-width column">
              <div class="row items-center justify-between">
                <div class="text-subtitle1">{{ scope.opt.label }}</div>
                <div class="text-caption text-grey q-ml-sm">
                  {{ scope.opt.industry }}
                </div>
                <q-img
                  :src="scope.opt.flagURL"
                  fit="contain"
                  class="country-flag q-ml-auto"
                />
              </div>

              <div class="text-caption text-grey-7 ellipsis-2-lines">
                {{ scope.opt.description }}
              </div>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- continue btn -->
      <div class="col-auto text-18 q-ml-sm">
        <q-btn
          unelevated
          size="md"
          padding="19px 16px"
          color="brand"
          label="Continue"
          class="text-18 light-radius"
          @click="onContinue"
          :disable="
            !props.selectedCompany || props.selectedCompany.label.length < 2
          "
        />
      </div>
    </div>
    
    <!-- ai msg in case ai suggestion was selected -->
    <div
      v-if="selectedCompany?.aiOption"
      class="row items-center q-pt-md"
    >
      <q-img
        src="/imgs/ai-agent.png"
        alt="AI Agent"
        fit="contain"
        class="ai-avatar-big col-2 q-mr-md"
      />
      <p class="col-8 text-16 text-font-thin">
        Great! Our AI agent can seamlessly fill in some details for you now.
      </p>
    </div>

    <!-- blank space placeholder -->
    <div
      v-else
      class="q-pb-sm"
    ></div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAiCompaniesSuggestions } from 'src/composables/useAiCompaniesSuggestions'

const props = defineProps({
  onNextStep: Function,
  selectedCompany: Object,
})

const emit = defineEmits(['update:selectedCompany'])

const searchTerm = ref('')

// AI suggestions
const {
  companies: rawCompanies,
  isLoading,
  refetch,
} = useAiCompaniesSuggestions()

const companies = computed(() => {
  if (searchTerm.value.length < 2) return []
  return rawCompanies.value?.map((c) => ({ ...c, aiOption: true })) || []
})

function onFilterAbort() {
  searchTerm.value = ''
}

function onFilter(val, update) {
  searchTerm.value = val?.trim() || ''
  if (searchTerm.value.length >= 2) {
    refetch().then(() => update())
  } else {
    update()
  }
}

// Handle input
function onInputChange(val) {
  searchTerm.value = val?.trim() || ''

  if (!props.selectedCompany || props.selectedCompany.label !== val) {
    emit('update:selectedCompany', {
      label: val,
      value: val,
      aiOption: false,
    })
  }
}

// Handle selection
function onSelect(val) {
  if (val && typeof val === 'object') {
    emit('update:selectedCompany', val)
  }
}

function onContinue() {
  props.onNextStep?.()
}
</script>

<style scoped lang="scss">
.ai-avatar-big {
  height: 36px;
  width: 36px;
}

.ai-avatar-small {
  height: 24px;
  width: 24px;
}

.country-flag {
  border: 1px solid var(--q-secondary-light);
  border-radius: 2px;
  width: 24px;
}
</style>
