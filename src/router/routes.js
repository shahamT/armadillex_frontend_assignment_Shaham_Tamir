import AppIndex from 'src/pages/AppIndex.vue'
import { ROUTES } from './const'

const routes = [
  {
    path: '/',
    name: ROUTES.APP,
    redirect: ROUTES.COMPANY,
    component: AppIndex,
    children: [
      {
        path: ROUTES.COMPANY,
        name: ROUTES.COMPANY,
        component: () => import('src/pages/company/CompanyIndex.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
