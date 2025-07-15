<template>
  <q-dialog
    v-model="modelValue"
    persistent
  >
    <q-card
      class="q-dialog-plugin"
      style="min-width: 500px"
    >
      <q-card-section>
        <div v-if="step === 1">
          <div class="text-h6">
            {{ type === 'add' ? 'Add' : 'Update' }} company
          </div>
          <StepCompanyName />
        </div>
        <div v-else-if="step === 2">
          <p>Step 2: Company Details (Add or Edit)</p>
        </div>
        <div v-else-if="step === 3">
          <p>Step 3: Review & Confirm (Add only)</p>
        </div>
      </q-card-section>

      <q-card-actions align="between">
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
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StepCompanyName from './StepCompanyName.vue'

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

const nextLabel = computed(() => {
  if (props.type === 'edit') return 'Save'
  return step.value === 3 ? 'Save' : 'Next'
})

function saveCompany() {
  console.log('Saving...', { type: props.type, companyId: props.companyId })
  modelValue.value = false
}
</script>

<style scoped lang="scss"></style>
