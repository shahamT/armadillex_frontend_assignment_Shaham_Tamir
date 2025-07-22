import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'

export function useAiCompaniesSuggestions() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.AI_COMPANIES],
    queryFn: companiesService.getCompaniesOptions,
    enabled: false, // prevent automatic fetch - triggered manually from the component
  })

  const companies = computed(() =>
    Array.isArray(query.data?.value) ? query.data.value : [],
  )

  return {
    companies,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error,
    refetch: query.refetch,
  }
}