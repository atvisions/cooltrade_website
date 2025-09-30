import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '../components/auth/AuthPage.vue'
import Dashboard from '../components/dashboard/Dashboard.vue'
import ForgotPasswordPage from '../components/auth/ForgotPasswordPage.vue'
import RiskAssessment from '../components/auth/RiskAssessment.vue'
import UserProfile from '../components/profile/UserProfile.vue'
import SettingsPage from '../components/settings/SettingsPage.vue'
import HomePage from '../components/home/HomePage.vue'
import MarketPage from '../components/market/MarketPage.vue'
import ExplorePage from '../components/explore/ExplorePage.vue'
import StrategiesPage from '../components/strategies/StrategiesPage.vue'
import FavoritesPage from '../components/user/FavoritesPage.vue'
import OrdersPage from '../components/user/OrdersPage.vue'
import SubscriptionsPage from '../components/user/SubscriptionsPage.vue'
import FollowingPage from '../components/user/FollowingPage.vue'
import NotificationsPage from '../components/user/NotificationsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: false }
  },
  {
    path: '/market',
    name: 'Market',
    component: MarketPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/explore',
    name: 'Explore',
    component: ExplorePage,
    meta: { requiresAuth: false }
  },
  {
    path: '/strategies',
    name: 'Strategies',
    component: StrategiesPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/risk-assessment',
    name: 'RiskAssessment',
    component: RiskAssessment,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:userId?',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: false }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrdersPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: SubscriptionsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/following',
    name: 'Following',
    component: FollowingPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: NotificationsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    redirect: '/auth'
  },
  {
    path: '/register',
    redirect: '/auth'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 检查用户是否已登录（这里使用localStorage模拟）
  const isAuthenticated = localStorage.getItem('auth_token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    // 需要登录但未登录，跳转到登录页
    next('/auth')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // 已登录用户访问登录页，跳转到仪表板
    next('/dashboard')
  } else if (to.path === '/' && isAuthenticated) {
    // 已登录用户访问首页，跳转到仪表板
    next('/dashboard')
  } else {
    next()
  }
})

export default router
