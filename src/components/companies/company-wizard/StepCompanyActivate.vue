<template>     
    <q-btn
      unelevated
      size="md"
      padding="14px 16px"
      color="brand"
      label="Add Company"
      type="submit"
      class="text-18 light-radius full-width q-mt-md"
    />
</template>

<script setup>

const props = defineProps({
  onNextStep: Function,
  savedCompanyId: String,
})

console.log("savedCompanyId: ", props.savedCompanyId)

</script>

<style scoped lang="scss">

</style>
