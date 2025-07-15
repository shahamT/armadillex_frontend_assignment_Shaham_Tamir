import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'
import { notifyMsgs, notifyService } from 'src/services/notify.service'

export function useSaveCompany() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (newCompany) => {
      return await companiesService.saveCompany(newCompany)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
      notifyService.success(notifyMsgs.companyAdded)
    },
    onError: () => {
      notifyService.error(notifyMsgs.companyUpdatedFail)
    },
  })

  return {
    addCompany: mutation.mutate,
    addCompanyAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  }
}
