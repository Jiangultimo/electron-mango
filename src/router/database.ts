export default [
  {
    path: 'database/:id/info',
    component: () => import('@/views/database/Info.vue')
  },
  {
    path: 'collection/:id/info',
    component: () => import('@/views/database/Collection.vue')
  },
]
