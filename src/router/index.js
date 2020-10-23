import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../components/Index.vue')
  },
  {
    path: '/createH5',
    name: 'createH5',
    component: () => import('../components/CreateH5.vue'),
    meta: {
      title: 'H5落地页生成'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
