import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'

export function useAiCompaniesSuggestions() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.AI_COMPANIES],
    queryFn: companiesService.getCompaniesOptions,
    enabled: false, // prevent automatic fetch — we control it manually
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnReconnect: true,
  })

  const companies = computed(() =>
    Array.isArray(query.data?.value) ? query.data.value : [],
  )

  return {
    companies,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
