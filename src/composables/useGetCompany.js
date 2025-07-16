import { useQuery } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'

export function useGetCompany(companyId) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.COMPANY, companyId],
    queryFn: () => companiesService.getCompanyById(companyId),
    enabled: !!companyId,
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
