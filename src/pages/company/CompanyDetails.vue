<template>
  <q-card class="card-container">
    <!-- loading state -->
    <div
      v-if="isLoading"
      class="q-pa-xl q-ma-xl flex full-width items-center justify-center"
    >
      <q-spinner
        color="brand"
        size="4em"
      />
    </div>

    <!-- page content -->
    <div
      v-else
      class="q-pa-lg"
    >
      <!-- bread crumbs + back button -->
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

      <!-- company details -->
      <div class="row">
        <h2 class="q-mb-lg text-52">{{ company.name }}</h2>
        <q-badge
          :class="company.active ? 'positive-badge' : 'grayed-badge'"
          class="self-center q-ml-auto text-16 q-py-xs q-px-md"
        >
          <q-icon
            :name="company.active ? 'check_circle' : 'cancel'"
            class="q-mr-sm"
          />
          {{ company.active ? 'Active Company' : 'Inactive Company' }}
        </q-badge>
      </div>

      <div class="column q-gutter-y-lg">
        <q-card
          bordered
          flat
          class="q-pa-lg"
        >
          <!-- basic details -->
          <h3 class="text-20 text-font-medium q-mb-md">Basic Details</h3>

          <div class="row q-gutter-x-xl">
            <div class="q-mr-xl">
              <p class="text-16 text-secondary q-mb-xs">Legal Name</p>
              <p class="text-18 text-primary">{{ company.legalName }}</p>
            </div>

            <q-separator
              vertical
              color="brand"
            />

            <div class="q-mr-xl">
              <p class="text-16 text-secondary q-mb-xs">Country</p>

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
              <p class="text-16 text-secondary q-mb-xs">Parent Company</p>

              <q-skeleton
                width="100px"
                v-if="isParentCompanyLoading"
              />

              <router-link
                v-else-if="parentCompany"
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

        <!-- Attributes -->
        <q-card
          bordered
          flat
          class="q-pa-lg"
        >
          <h3 class="text-20 text-font-medium q-mb-md">Attributes</h3>
          <div class="row q-gutter-x-xl">
            <div class="q-mr-xl">
              <p class="text-16 text-secondary q-mb-xs">Has DPF</p>

              <q-badge
                v-if="company.isDpfFound"
                class="positive-badge text-16 row center-items q-pl-sm q-pr-sm"
              >
                <q-icon
                  name="check_circle"
                  class="q-mr-sm"
                />
                DPF Found
              </q-badge>
              <q-badge
                v-else
                class="grayed-badge text-16 text-secondary row center-items q-pl-sm q-pr-sm"
              >
                <q-icon
                  name="cancel"
                  class="q-mr-sm"
                />
                No DPF Found
              </q-badge>
            </div>

            <q-separator vertical />

            <div class="q-mr-xl">
              <p class="text-16 text-secondary q-mb-xs">AI Services</p>

              <q-badge
                v-if="company.providesAiServices"
                class="ai-badge text-16 row center-items q-pl-sm q-pr-sm"
              >
                <q-icon
                  name="smart_toy"
                  class="q-mr-sm"
                />
                Uses AI Services
              </q-badge>
              <q-badge
                v-else
                class="grayed-badge text-16 text-secondary row center-items q-pl-sm q-pr-sm"
              >
                <q-icon
                  name="cancel"
                  class="q-mr-sm"
                />
                Doesn't use AI Services
              </q-badge>
            </div>
          </div>
        </q-card>

        <!-- Subsidiary Companies -->
        <q-card
          bordered
          flat
          class="q-pa-lg"
        >
          <div class="row">
            <h3 class="text-20 text-font-medium q-mb-md">
              Subsidiary Companies
            </h3>
            <q-pagination
              v-if="childCompanies.length > 0 || isChildCompaniesLoading"
              :model-value="filterBy.page"
              @update:model-value="(val) => updateFilterBy('page', val)"
              :max="maxPage"
              direction-links
              gutter="8px"
              color="brand"
              class="q-ml-auto q-mb-md"
            />
          </div>

          <template
            v-if="childCompanies.length === 0 && !isChildCompaniesLoading"
          >
            <p class="text-18 text-italic text-secondary q-mb-md">
              This company has no registered subsidiary companies
            </p>
            <div
              class="empty-state-container column items-center justify-center text-center q-py-md"
            >
              <q-img
                src="/empty-states/empty-state-no-companies.svg"
                spinner-color="grey-5"
                style="width: 100px; height: 100px"
                fit="contain"
              />
              <p class="text-18 text-font-thin text-secondary">
                No companies to show
              </p>
            </div>
          </template>
          <CompaniesList
            v-else
            :companies="childCompanies"
            :filterBy="filterBy"
            :updateFilterBy="updateFilterBy"
            :isLoading="isChildCompaniesLoading"
          />
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import CompaniesList from 'src/components/companies/CompaniesList.vue'
import { useCompanies } from 'src/composables/useCompanies'
import { useGetCompany } from 'src/composables/useGetCompany'
import { ROUTES } from 'src/router/const'
import { companiesService } from 'src/services/api/companies.service'
import { getCountryFullName, getFlagUrl } from 'src/services/util.service'
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const companyId = computed(() => route.params.id)
const { company, isLoading } = useGetCompany(companyId)

//parent company fetching
const parentId = computed(() => {
  return company.value?.parentId ?? null
})

const { company: parentCompany, isLoading: isParentCompanyLoading } =
  useGetCompany(parentId)

//child companies
const filterBy = reactive(companiesService.getDefaultFilterBy())
filterBy.pageSize = 6
const {
  companies: childCompanies,
  isLoading: isChildCompaniesLoading,
  maxPage,
} = useCompanies(filterBy)

watch(
  () => company.value?.id,
  (newId) => {
    if (newId) {
      filterBy.parentCompany = newId
    }
  },
  { immediate: true },
)

function updateFilterBy(key, value) {
  filterBy[key] = value
}
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

.ai-badge {
  background: linear-gradient(135deg, #e0eaff, #f3e5ff);
  color: var(--q-brand);
}

.grayed-badge {
  background-color: #e4e4e4;
  color: var(--q-secondary);
}

.positive-badge {
  background-color: #cdeedd;
  color: var(--q-success-dark);
}

.empty-state-container {
  background-color: #f5f5f5;
  border-radius: var(--medium-radius);
}
</style>
