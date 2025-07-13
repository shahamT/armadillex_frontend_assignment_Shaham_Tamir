import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { devMode } from 'src/config'

export default ({ app }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 30, // Consider data stale after 30 minutes
        cacheTime: 1000 * 60 * 30, // Cache data for 30 minutes
        refetchOnWindowFocus: devMode ? false : true, // Disable refetch on window focus in dev mode
        refetchOnMount: true,
      },
    },
  })

  app.use(VueQueryPlugin, {
    queryClient,
  })
}
