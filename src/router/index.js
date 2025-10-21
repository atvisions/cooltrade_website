import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '../components/auth/AuthPage.vue'
import Dashboard from '../components/dashboard/Dashboard.vue'
import ForgotPasswordPage from '../components/auth/ForgotPasswordPage.vue'
import RiskAssessment from '../components/auth/RiskAssessment.vue'
import UserProfile from '../components/profile/UserProfile.vue'
import SettingsPage from '../components/settings/SettingsPage.vue'
import HomePage from '../components/home/HomePage.vue'
import MarketPage from '../components/market/MarketPage.vue'
import TokenDetailPage from '../components/market/TokenDetailPage.vue'
import RecommendPage from '../components/recommend/RecommendPage.vue'
import ExplorePage from '../components/explore/ExplorePage.vue'
import StrategiesPage from '../components/strategies/StrategiesPage.vue'
import FavoritesPage from '../components/user/FavoritesPage.vue'
import OrdersPage from '../components/user/OrdersPage.vue'
import SubscriptionsPage from '../components/user/SubscriptionsPage.vue'
import FollowingPage from '../components/user/FollowingPage.vue'
import NotificationsPage from '../components/user/NotificationsPage.vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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
    path: '/market/:symbol',
    name: 'TokenDetail',
    component: TokenDetailPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: RecommendPage,
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
    path: '/my-strategies',
    name: 'MyStrategies',
    component: () => import('../components/strategies/MyStrategiesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/trading',
    name: 'Trading',
    component: () => import('../components/trading/TradingPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/exchanges',
    name: 'Exchanges',
    component: () => import('../components/exchange/ExchangePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bots',
    name: 'Bots',
    component: () => import('../components/bot/BotPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bots/signal',
    name: 'SignalBots',
    component: () => import('../components/bot/BotTypePage.vue'),
    props: { botType: 'signal' },
    meta: { requiresAuth: true }
  },
  {
    path: '/bots/trend-following',
    name: 'TrendFollowingBots',
    component: () => import('../components/bot/BotTypePage.vue'),
    props: { botType: 'trend-following' },
    meta: { requiresAuth: true }
  },
  {
    path: '/bots/breakout',
    name: 'BreakoutBots',
    component: () => import('../components/bot/BotTypePage.vue'),
    props: { botType: 'breakout' },
    meta: { requiresAuth: true }
  },
  {
    path: '/bots/martingale',
    name: 'MartingaleBots',
    component: () => import('../components/bot/BotTypePage.vue'),
    props: { botType: 'martingale' },
    meta: { requiresAuth: true }
  },
  {
    path: '/bots/arbitrage',
    name: 'ArbitrageBots',
    component: () => import('../components/bot/BotTypePage.vue'),
    props: { botType: 'arbitrage' },
    meta: { requiresAuth: true }
  },
  {
    path: '/bots/:id',
    name: 'BotDetail',
    component: () => import('../components/bot/BotDetailPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/membership',
    name: 'Membership',
    component: () => import('../components/membership/MembershipPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/points',
    name: 'Points',
    component: () => import('../components/points/PointsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/ai-strategy',
    name: 'AIStrategy',
    component: () => import('../components/user/AIStrategyPage.vue'),
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

// 检查用户是否完成风险评估
async function checkRiskAssessment() {
  const token = localStorage.getItem('auth_token')
  console.log('[风险评估检查] Token:', token ? '存在' : '不存在')

  if (!token) return false

  try {
    console.log('[风险评估检查] 开始调用API...')
    const response = await axios.get(`${API_BASE_URL}/api/auth/risk-assessment/status/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    console.log('[风险评估检查] API响应:', response.data)
    const hasAssessment = response.data?.data?.has_assessment || false
    console.log('[风险评估检查] 是否完成评估:', hasAssessment)
    return hasAssessment
  } catch (error) {
    console.error('[风险评估检查] API调用失败:', error)
    return false
  }
}

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  // 检查用户是否已登录
  const isAuthenticated = localStorage.getItem('auth_token')

  // 1. 未登录用户访问需要认证的页面，跳转到登录页
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
    return
  }

  // 2. 已登录用户访问登录/注册页，跳转到首页（会触发后续的风险评估检查）
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
    return
  }

  // 3. 已登录用户访问需要认证的页面（除了风险评估页面本身）
  if (isAuthenticated && to.meta.requiresAuth && to.path !== '/risk-assessment') {
    // 检查是否完成风险评估
    const hasAssessment = await checkRiskAssessment()
    if (!hasAssessment) {
      // 未完成风险评估，跳转到风险评估页面
      console.log('用户未完成风险评估，跳转到风险评估页面')
      next('/risk-assessment')
      return
    }
  }

  // 4. 已登录用户访问首页，检查风险评估后跳转到仪表板
  if (to.path === '/' && isAuthenticated) {
    // 先检查风险评估
    const hasAssessment = await checkRiskAssessment()
    if (!hasAssessment) {
      console.log('用户未完成风险评估，跳转到风险评估页面')
      next('/risk-assessment')
      return
    }
    // 已完成风险评估，跳转到仪表板
    next('/dashboard')
    return
  }

  // 5. 其他情况，正常放行
  next()
})

export default router
