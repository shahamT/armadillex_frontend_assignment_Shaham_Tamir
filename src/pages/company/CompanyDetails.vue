<template>
  <q-card class="card-container">
     <div
    v-if="isLoading"
    class="q-pa-xl q-ma-xl flex full-width items-center justify-center"
  >
    <q-spinner
      color="brand"
      size="4em"
    />
  </div>
    <div
      v-else
      class="q-pa-lg"
    >
      <div>
        <q-breadcrumbs class="q-mb-md">
          <q-breadcrumbs-el
            class="text-brand link"
            label="Companies"
            to="/company"
          />
          <q-breadcrumbs-el :label="company.name" />
        </q-breadcrumbs>

        <q-btn
          flat
          dense=""
          color="primary"
          icon="keyboard_backspace"
          :to="{ name: ROUTES.COMPANY }"
        >
          Back</q-btn
        >

        <h2 class="q-mb-lg text-52">{{ company.name }}</h2>

        <div class="column q-gutter-y-lg">
          <q-card
            bordered
            flat
            class="q-pa-lg"
          >
            <h3 class="text-20 text-font-medium q-mb-md">Basic Details</h3>
            <div class="row q-gutter-x-xl">
              <div class="q-mr-xl">
                <p class="text-16 text-secondary">Legal Name</p>
                <p class="text-18 text-primary">{{ company.legalName }}</p>
              </div>
              <q-separator
                vertical
                color="brand"
              />
              <div class="q-mr-xl">
                <p class="text-16 text-secondary">Country</p>
                <div class="row items-center q-gutter-x-sm">
                  <q-img
                    class="country-flag"
                    :src="getFlagUrl(company.country)"
                    fit="contain"
                    spinner-color="grey-5"
                  ></q-img>
                  <p class="text-18 text-primary">
                    {{ getCountryFullName(company.country) }}
                  </p>
                </div>
              </div>

              <q-separator vertical />

              <div class="q-mr-xl">
                <p class="text-16 text-secondary">Parent Company</p>

                <q-spinner
                  v-if="isParentCompanyLoading"
                  color="brand"
                  size="1em"
                />

                <router-link
                  v-else-if="company.parentId && parentCompany"
                  :to="{
                    name: 'company-details',
                    params: { id: parentCompany.id },
                  }"
                  class="text-18 text-primary text-brand link"
                >
                  {{ parentCompany.name }}
                </router-link>

                <p
                  v-else
                  class="text-18 text-italic text-secondary"
                >
                  No Parent Company
                </p>
              </div>
            </div>
          </q-card>
          <q-card
            bordered
            flat
            class="q-pa-lg"
          >
            <h3 class="text-20 text-font-medium q-mb-md">Attributes</h3>
            <div class="row q-gutter-x-xl">
              <div>
                <p class="text-16 text-secondary">Legal Name</p>
                <p class="text-18 text-primary">{{ company.legalName }}</p>
              </div>
              <q-separator vertical />
              <div>
                <p class="text-16 text-secondary">Country</p>
                <p class="text-18 text-primary">{{ company.country }}</p>
              </div>
            </div>
          </q-card>
          <q-card
            bordered
            flat
            class="q-pa-lg"
          >
            <h3 class="text-20 text-font-medium q-mb-md">
              Subsidiary Companies
            </h3>
            <div class="row q-gutter-x-xl">
              <div>
                <p class="text-16 text-secondary">Legal Name</p>
                <p class="text-18 text-primary">{{ company.legalName }}</p>
              </div>
              <q-separator vertical />
              <div>
                <p class="text-16 text-secondary">Country</p>
                <p class="text-18 text-primary">{{ company.country }}</p>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { useGetCompany } from 'src/composables/useGetCompany'
import { ROUTES } from 'src/router/const'
import { getCountryFullName, getFlagUrl } from 'src/services/util.service'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const companyId = route.params.id
const { company, isLoading } = useGetCompany(companyId)

//parent company
// const parentCompany = ref(null)
// const isParentCompanyLoading = ref(false)

const parentId = computed(() => company.value?.parentId)

// Create a tracked company ref manually (starts as null)
const {
  company: parentCompany,
  isLoading: isParentCompanyLoading,
  refetch: refetchParentCompany,
} = useGetCompany(null)  // starts with null

// When parentId changes, trigger refetch
watch(parentId, async (newId) => {
  if (newId) {
    await refetchParentCompany({ queryKey: ['company', newId] })
  }
}, { immediate: true })

//child companies
</script>

<style scoped lang="scss">
.card-container {
  min-height: calc(100vh - 4rem - 32px);
  overflow: hidden;
}

.country-flag {
  height: 18px;
  width: 24px;
}

.link {
  &:hover {
    text-decoration: underline;
  }
}
</style>
