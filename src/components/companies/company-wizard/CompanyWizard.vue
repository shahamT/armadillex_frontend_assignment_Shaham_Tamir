<template>
  <q-dialog
    v-model="modelValue"
    persistent
  >
    <!-- dialog content -->
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="min-width: 500px"
    >
      <!-- close dialog btn -->
      <q-btn
        icon="close"
        flat
        dense
        round
        class="absolute-top-right q-ma-sm z-top"
        @click="closeWizard"
      />

      <q-card-section>
        <!-- step 1 - company name with ai suggestions -->
        <div v-if="step === 1">
          <div class="text-h3 text-28 q-pb-md">{{ title }} Company</div>
          <StepCompanyName
            :onNextStep="goNext"
            v-model:selectedCompany="selectedCompany"
          />
        </div>

        <!-- step 2 - company details form -->
        <div v-else-if="step === 2">
          <div class="text-h3 text-28 q-pb-md">{{ title }} Company</div>
          <StepCompanyDetails
            :onNextStep="goNext"
            v-model:selectedCompany="selectedCompany"
            v-model:savedCompanyId="savedCompanyId"
          />
        </div>

        <!-- step 3 - turn active or not-->
        <div v-else-if="step === 3">
          <StepCompanyActivate
            v-model:savedCompanyId="savedCompanyId"
            :closeWizard="closeWizard"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StepCompanyName from './StepCompanyName.vue'
import StepCompanyDetails from './StepCompanyDetails.vue'
import StepCompanyActivate from './StepCompanyActivate.vue'

const modelValue = defineModel({ default: false })

const props = defineProps({
  type: {
    type: String,
    default: 'add',
  },
  companyId: {
    type: String,
    default: null,
  },
})

const step = ref(1)
const startStep = computed(() => (props.type === 'edit' ? 2 : 1))
const selectedCompany = ref(null)
const savedCompanyId = ref(null)

//preperation for adding 'edit' mode
const title = computed(
  () => `${props.type === 'add' ? 'Add' : 'Update'} Company`,
)

// Initialize step on open
watch(modelValue, (val) => {
  if (val) {
    step.value = startStep.value
    selectedCompany.value = null
    savedCompanyId.value = null
  }
})

// function goBack() {
//   if (step.value > startStep.value) step.value--
// }

function goNext() {
  if (step.value < 3) {
    step.value++
  } else {
    step.value = 1
  }
}

function closeWizard() {
  modelValue.value = false
}
</script>
