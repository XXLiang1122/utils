import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/simpleH5',
    name: 'SimpleH5',
    component: () => import('../components/simpleH5/Index.vue'),
    meta: {
      title: '简易h5'
    }
  },
  {
    path: '/sketchGif',
    name: 'SketchGif',
    component: () => import('../components/sketchGif/Index.vue'),
    meta: {
      title: '线稿gif生成'
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
