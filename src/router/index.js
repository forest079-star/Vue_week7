import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    component: () => import('../views/admin/LoginView.vue')
  },
  {
    path: '/',
    component: () => import('../views/FrontLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/front/HomeView.vue')
      },
      {
        path: 'articles',
        name: 'articles',
        component: () => import('../views/front/articlesView.vue')
      },
      {
        path: 'article/:articleId',
        name: 'article',
        component: () => import('../views/front/articleView.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('../views/DashboardView.vue'),
    children: [
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/admin/AdminProducts.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/admin/AdminOrders.vue')
      },
      {
        path: 'coupons',
        name: 'Coupons',
        component: () => import('../views/admin/AdminCoupons.vue')
      },
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('../views/admin/AdminArticles.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/views/NotFront.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes
})

export default router
