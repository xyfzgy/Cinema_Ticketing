import { createRouter, createWebHashHistory } from 'vue-router'
import { isLoggedIn, isAdmin } from '@/utils/auth'

const routes = [
  { path: '/register', name: 'register', component: () => import('../views/AccountAccessView.vue'), meta: { title: '注册' } },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/AccountAccessView.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: () => import('../views/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: 'index', name: 'home', component: () => import('../views/DiscoveryHomeView.vue'), meta: { title: '首页' } },
      { path: 'movieDetail', name: 'discovery-detail', component: () => import('../views/DiscoveryDetailView.vue'), meta: { title: '电影详情' } },
      { path: 'ranking', name: 'ranking', component: () => import('../views/RankingView.vue'), meta: { title: '电影排行榜' } },
      { path: 'seckill', name: 'seckill', component: () => import('../views/SeckillView.vue'), meta: { title: '秒杀活动', requiresAuth: true } },
      { path: 'historyOrders', redirect: { path: '/personal', query: { tab: 'orders' } } },
      { path: 'personal', name: 'personal', component: () => import('../views/AccountCenterView.vue'), meta: { title: '个人中心', requiresAuth: true } },
      { path: 'adminPersonal', name: 'admin-personal', component: () => import('../views/AccountCenterView.vue'), meta: { title: '管理员中心', requiresAuth: true, requiresAdmin: true } },
      { path: 'customerService', name: 'customer-service', component: () => import('../views/ServiceChatView.vue'), meta: { title: '智能客服' } },
      { path: 'movies/:id', name: 'movie-detail', component: () => import('../views/MovieDetailView.vue') },
      { path: 'screenings', name: 'screenings', component: () => import('../views/ScreeningsView.vue') },
      {
        path: 'screenings/:id/seats',
        name: 'seats',
        component: () => import('../views/SeatSelectionView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('../views/MyOrdersView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'orders/:id',
        name: 'order-detail',
        component: () => import('../views/OrderDetailView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'ai',
        name: 'ai',
        component: () => import('../views/AiChatView.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'admin-overview', component: () => import('../views/admin/AdminStatisticsView.vue') },
      { path: 'movies', name: 'admin-movies', component: () => import('../views/admin/AdminMoviesView.vue') },
      { path: 'schedules', name: 'admin-schedules', component: () => import('../views/admin/AdminSchedulesView.vue') },
      { path: 'seckill', name: 'admin-seckill', component: () => import('../views/admin/AdminSeckillView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { title: '页面未找到' } },
]

const router = createRouter({
  // 使用 hash 路由，直接刷新业务页面时不会请求到 Spring Boot 的静态资源处理器。
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !isAdmin()) {
    return { path: '/index' }
  }
  if (to.path === '/login' && isLoggedIn()) {
    return { path: '/index' }
  }
  document.title = `${to.meta.title || '影视推荐平台'} - 影视推荐平台`
  return true
})

export default router

