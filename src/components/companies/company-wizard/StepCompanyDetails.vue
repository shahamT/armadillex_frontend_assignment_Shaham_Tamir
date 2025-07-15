<template>
  <div>
    <p class="text-16 text-font-thin q-pb-sm">Enter company name</p>     
  </div>
</template>

<script setup>

const props = defineProps({
  onNextStep: Function,
  onPreviousStep: Function,
  selectedCompany: Object
})

const emit = defineEmits(['update:selectedCompany'])

console.log("selectedCompany step2: ",props.selectedCompany )
// function onContinue() {
// props.onNextStep?.()
// }
</script>

<style scoped lang="scss">

</style>
