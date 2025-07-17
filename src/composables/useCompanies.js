import { computed, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'

export function useCompanies(filterBy, customKey) {
  const key = customKey || 'default'

  const filterVal = computed(() => toValue(filterBy))

  const companiesQuery = useQuery({
    queryKey: computed(() => [
      QUERY_KEYS.COMPANIES,
      key,
      { ...filterVal.value },
    ]),
    queryFn: async () => {
      const filter = toValue(filterBy)
      const res = await companiesService.getCompanies(filter)
      return res
    },
  })

  const companies = computed(() => companiesQuery.data?.value?.companies || [])
  const total = computed(() => companiesQuery.data?.value?.total || 0)
  const maxPage = computed(() =>
    filterVal.value.pageSize
      ? Math.ceil(total.value / filterVal.value.pageSize)
      : 1,
  )

  return {
    companies,
    isLoading: companiesQuery.isLoading,
    error: companiesQuery.error,
    maxPage,
  }
}
