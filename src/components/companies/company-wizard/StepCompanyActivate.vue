<template>
  <div
    v-if="isLoading || !editableCompany"
    class="q-pa-md flex items-center justify-center"
  >
    <!-- loading state for company -->
    <q-spinner
      color="brand"
      size="4em"
    />
  </div>

  <!-- step content -->
  <div
    v-else
    class="column items-center text-center"
  >
    <p class="text-40">🎉</p>

    <p class="text-h3 text-28 q-pb-md">
      <span class="text-bold">{{ editableCompany.name }}</span> has been
      successfully added!
    </p>

    <p class="text-16">
      <span class="text-bold">{{ editableCompany.name }}</span> is currently
      <span class="text-bold">Inactive</span>. Do you wish to turn it
      <span class="text-bold">Active</span>?
    </p>

    <!-- //activate toggel -->
    <div class="row items-center full-width justify-center q-mt-sm">
      <p class="text-18 text-secondary q-mr-sm">Inactive</p>
      <q-toggle
        v-model="editableCompany.active"
        color="brand"
        size="xl"
        keep-color
        class="text-16 text-font-thin"
      />
      <p class="text-18 text-secondary q-ml-sm">Active</p>
    </div>

    <!-- //info msg for keeping the company inactive -->
    <div
      v-if="!editableCompany.active"
      class="info-container text-14 text-secondary row items-center justify-center no-wrap full-width q-py-sm q-px-md q-gutter-x-md"
    >
      <q-icon
        name="info"
        color="secondary"
        class="q-ml-none"
        size="md"
      />
      <span class="text-left">
        Inactive companies won’t appear in the list unless you enable <br />
        “Show inactive companies” in the filters panel.
      </span>
    </div>

    <!-- // save / close btns -->
    <div class="row full-width q-mt-md">
      <q-btn
        v-if="!editableCompany.active"
        outline
        size="md"
        padding="14px 16px"
        color="brand"
        label="Keep it Inactive"
        class="text-18 light-radius full-width"
        @click="closeWizard"
      />
      <q-btn
        v-else
        unelevated
        size="md"
        padding="14px 16px"
        color="brand"
        label="Save as Active"
        class="text-18 light-radius full-width"
        :loading="isSaving"
        @click="saveCompany"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useCompany } from 'src/composables/useCompany'
import { useSaveCompany } from 'src/composables/useSaveCompany'

const { savedCompanyId, closeWizard } = defineProps({
  savedCompanyId: String,
  closeWizard: Function,
})

const savedCompanyIdRef = computed(() => savedCompanyId) //turning into ref for useCompany hook competability
const { company, isLoading } = useCompany(savedCompanyIdRef)
const { saveCompanyAsync, isLoading: isSaving } = useSaveCompany()

const editableCompany = ref(null)

watch(
  company,
  (val) => {
    if (val) {
      editableCompany.value = { ...val }
    }
  },
  { immediate: true },
)

async function saveCompany() {
  try {
    await saveCompanyAsync(editableCompany.value)
    closeWizard()
  } catch (err) {
    console.error('Failed to update company:', err)
  }
}
</script>

<style scoped lang="scss">
.info-container {
  background-color: #f5f5f5;
  border-radius: var(--small-radius);
}
</style>
