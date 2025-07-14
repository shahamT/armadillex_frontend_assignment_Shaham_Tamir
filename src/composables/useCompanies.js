import { computed, watchEffect } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'

export function useCompanies(filterBy) {
  const companiesQuery = useQuery({
    queryKey: [QUERY_KEYS.COMPANIES, filterBy],
    queryFn: async () => {
      const res = await companiesService.getCompanies(filterBy)
      return res
    },
    refetchOnWindowFocus: false,
  })

  watchEffect(() => {
    companiesQuery.refetch()
  })

  const companies = computed(() => companiesQuery.data?.value?.companies || [])
  const total = computed(() => companiesQuery.data?.value?.total || 0)
  const maxPage = computed(() => Math.ceil(total.value / 15))

  return {
    companies,
    isLoading: companiesQuery.isLoading,
    error: companiesQuery.error,
    maxPage,
  }
}
