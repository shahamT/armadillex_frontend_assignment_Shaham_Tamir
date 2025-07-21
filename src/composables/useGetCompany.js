import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'

export function useGetCompany(companyIdRef) {

  const query = useQuery({
    queryKey: computed(() => [QUERY_KEYS.COMPANY, companyIdRef.value]),
    queryFn: () => companiesService.getCompanyById(companyIdRef.value),
    enabled: computed(() => !!companyIdRef.value),
    retry: false,
    onError: (err) => {
      console.error('[VUE QUERY ERROR]', err)
    },
  })

  return {
    company: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error,
    refetch: query.refetch,
  }
}
