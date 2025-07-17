import { computed, isRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'

export function useGetCompany(companyIdInput) {
  const companyId = isRef(companyIdInput)
    ? companyIdInput
    : computed(() => companyIdInput)

  const query = useQuery({
    queryKey: computed(() => [QUERY_KEYS.COMPANY, companyId.value]),
    queryFn: () => companiesService.getCompanyById(companyId.value),
    enabled: computed(() => !!companyId.value),
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
