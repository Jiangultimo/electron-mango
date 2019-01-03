import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import database from './database'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'database',
          children: database
        }
      ]
    },
    {
      path: '/database/edit/:key',
      name: 'editDb',
      component: () => import('@/views/AddDb.vue')
    },
    {
      path: '/database/add',
      name: 'addDb',
      component: () => import('@/views/AddDb.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
