<template>
  <q-dialog
    v-model="modelValue"
    persistent
  >
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="min-width: 500px"
    >
      <q-btn
        icon="close"
        flat
        dense
        round
        class="absolute-top-right q-ma-sm z-top"
        @click="modelValue = false"
      />

      <q-card-section>
        <!-- step 1 -->
        <div v-if="step === 1">
          <div class="text-h3 text-28 q-pb-md">
            {{ type === 'add' ? 'Add' : 'Update' }} Company
          </div>
          <StepCompanyName
            :onNextStep="goNext"
            v-model:selectedCompany="selectedCompany"
          />
        </div>

        <!-- step 2 -->
        <div v-else-if="step === 2">
          <div class="text-h3 text-28 q-pb-md">
            {{ type === 'add' ? 'Add' : 'Update' }} Company
          </div>
          <StepCompanyDetails
            :onNextStep="goNext"
            :onPreviousStep="goBack"
            v-model:selectedCompany="selectedCompany"
          />
        </div>

        <!-- step 3 -->
        <div v-else-if="step === 3">
          <p>Step 3: Review & Confirm (Add only)</p>
        </div>
      </q-card-section>

      <!-- <q-card-actions align="between">
        <q-btn
          flat
          label="Back"
          @click="goBack"
          :disable="step === startStep"
        />
        <div>
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="modelValue = false"
          />
          <q-btn
            flat
            :label="nextLabel"
            color="primary"
            @click="goNext"
          />
        </div>
      </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StepCompanyName from './StepCompanyName.vue'
import StepCompanyDetails from './StepCompanyDetails.vue'

const modelValue = defineModel({ default: false })

const props = defineProps({
  type: {
    type: String,
    required: true,
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

// Initialize step on open
watch(modelValue, (val) => {
  if (val) {
    step.value = startStep.value
  }
})

function goBack() {
  if (step.value > startStep.value) step.value--
}

function goNext() {
  if (step.value < 3) {
    step.value++
  } else {
    saveCompany()
  }
}

function saveCompany() {
  console.log('Saving...', { type: props.type, companyId: props.companyId })
  modelValue.value = false
}
</script>

<style scoped lang="scss"></style>
