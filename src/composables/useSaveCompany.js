import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { companiesService } from 'src/services/api/companies.service'
import { QUERY_KEYS } from './const'
import { notifyMsgs, notifyService } from 'src/services/notify.service'

export function useSaveCompany() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (company) => {
      return await companiesService.saveCompany(company)
    },
    onSuccess: (savedCompany, originalCompany) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] })

      const isNew = !originalCompany.id
      notifyService.success(
        isNew ? notifyMsgs.companyAdded : notifyMsgs.companyUpdated,
      )
    },
    onError: (savedCompany, originalCompany) => {
      const isNew = !originalCompany.id
      notifyService.error( isNew ? notifyMsgs.companyAddedFail :notifyMsgs.companyUpdatedFail)
    },
  })

  return {
    saveCompany: mutation.mutate,
    saveCompanyAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  }
}
