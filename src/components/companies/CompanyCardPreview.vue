<template>
  <router-link :to="{ name: 'company-details', params: { id: company.id } }">
    <q-card
      class="company-card-preview flex items-center"
      style="height: 48px"
      bordered
    >
      <div class="row items-center full-width">
        <!-- ------flag------- -->

        <div class="col-auto q-pl-md q-pr-md">
          <q-img
            class="country-flag"
            :src="getFlagUrl(company.country)"
            fit="contain"
            spinner-color="grey-5"
          >
            <q-tooltip
              class="text-body2"
              anchor="top left"
              self="bottom left"
              :offset="[17, 20]"
            >
              {{ company.country }} ({{ getCountryFullName(company.country) }})
            </q-tooltip>
          </q-img>
        </div>

        <!-- ------company name------- -->
        <div class="col-3 q-pr-sm flex items-center">
          <span
            class="company-name text-18 text-font-medium text-primary text-no-wrap ellipsis relative-position"
            style="display: inline-block"
          >
            {{ company.name }}
            <q-tooltip
              class="text-body2"
              anchor="top middle"
              self="bottom middle"
              :offset="[0, 16]"
            >
              {{ company.name }}
            </q-tooltip>
          </span>
        </div>

        <!-- ------DPF------- -->
        <div class="col-2 q-pr-sm">
          <q-icon
            v-if="company.isDpfFound"
            name="check_circle"
            class="dpf-icon text-18"
          />
        </div>

        <!-- ------AI------- -->
        <div class="col-2 q-pr-sm">
          <q-badge
            class="ai-badge text-12 q-pr-sm"
            v-if="company.providesAiServices"
          >
            <q-icon
              name="smart_toy"
              class="q-mr-xs"
            />
            AI
          </q-badge>
        </div>

        <!-- ------Parent Company------- -->
        <div class="col-2 q-pr-sm row">
          <q-skeleton
            class="col-6"
            v-if="isParentCompanyLoading"
          />
          <router-link
            v-else-if="parentCompany"
            :to="{
              name: 'company-details',
              params: { id: parentCompany.id },
            }"
            class="text-brand link"
          >
            {{ parentCompany.name }}
          </router-link>
        </div>

        <!-- ------Inactive------- -->
        <div class="col-1 q-pr-sm">
          <q-badge
            class="inactive-badge text-12 q-pr-sm"
            v-if="!company.active"
          >
            Inactive Company
          </q-badge>
        </div>
      </div>
    </q-card>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useGetCompany } from 'src/composables/useGetCompany'
import { getCountryFullName, getFlagUrl } from 'src/services/util.service'

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
})

//parent company fetching
const parentId = computed(() => {
  return props.company ? (props.company.parentId ?? null) : null
})

const { company: parentCompany, isLoading: isParentCompanyLoading } =
  useGetCompany(parentId.value)
</script>

<style lang="scss">
@import '/src/css/setup/variables.scss';

.company-card-preview {
  background-color: rgba(0, 38, 68, 0.01);

  box-shadow: var(--list-item-shadow);
  &:hover {
    background-color: rgba(0, 38, 68, 0.03);
    box-shadow: var(--list-item-shadow-hover);
    cursor: pointer;
  }

  .country-flag {
    width: 24px;
    height: 16px;
  }

  .ai-badge {
    background: linear-gradient(135deg, #e0eaff, #f3e5ff);
    color: var(--q-brand);
  }

  .inactive-badge {
    background-color: var(--disabled-bg-color);
    color: var(--disabled-text-color);
  }

  .dpf-icon {
    color: var(--q-success);
  }

  .link {
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
