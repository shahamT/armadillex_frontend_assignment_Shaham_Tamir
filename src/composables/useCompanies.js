import { useQuery } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'
import { notifyMsgs, notifyService } from 'src/services/notify.service'

export function useCompanies() {
  // Main query to fetch all companies
  const companiesQuery = useQuery({
    queryKey: [QUERY_KEYS.COMPANIES],
    queryFn: async () => {
      const companies = await companiesService.getCompanies()
      notifyService.success(notifyMsgs.companiesFetched)
      return companies
    },
  })

  return {
    // Query state
    companies: companiesQuery.data,
    isLoading: companiesQuery.isLoading,
    error: companiesQuery.error,
  }
}
