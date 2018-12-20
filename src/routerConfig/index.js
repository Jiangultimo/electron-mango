import Layout from '@/components/Layout'
import Index from '@/pages/index';
import Connect from '@/pages/connect'
export default [
  {
    component: Layout,
    routes: [
      {
        path: '/',
        exact: true,
        component: Index
      },
      {
        path: '/connect',
        component: Connect
      }
    ]
  }
];