import { boot } from 'quasar/wrappers'
import { httpService } from '../services/http.service'

export default boot(({ app }) => {
  app.config.globalProperties.$axios = httpService
  app.config.globalProperties.$api = httpService
})
