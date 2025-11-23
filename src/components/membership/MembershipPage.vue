<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />

    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="membership" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面标题 -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">会员中心</h1>
            <p class="text-gray-600 mt-2">升级会员，解锁更多功能</p>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-600">加载中...</p>
            </div>
          </div>

          <!-- 内容区域 -->
          <div v-else>
            <!-- 当前会员状态 -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center space-x-3 mb-2">
                  <div class="text-4xl">{{ currentPlan.icon }}</div>
                  <div>
                    <h2 class="text-2xl font-bold">{{ currentPlan.name }}</h2>
                    <p class="text-blue-100">{{ currentPlan.description }}</p>
                  </div>
                </div>
                <div class="mt-4 text-sm text-blue-100">
                  <p v-if="currentPlan.id !== 'free'">到期时间: {{ expiryDate }}</p>
                  <p v-else>升级会员，享受更多权益</p>
                </div>
              </div>
              <div class="text-right">
                <button
                  v-if="currentPlan.id !== 'free'"
                  @click="scrollToPlans"
                  class="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  续费
                </button>
                <button
                  v-else
                  @click="scrollToPlans"
                  class="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  立即升级
                </button>
              </div>
            </div>
          </div>

          <!-- 会员权益对比 -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">会员权益对比</h2>
            
            <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table class="min-w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">功能</th>
                    <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <div class="flex flex-col items-center">
                        <span class="text-2xl mb-1">🆓</span>
                        <span>免费版</span>
                      </div>
                    </th>
                    <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <div class="flex flex-col items-center">
                        <span class="text-2xl mb-1">⭐</span>
                        <span>Pro版</span>
                      </div>
                    </th>
                    <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <div class="flex flex-col items-center">
                        <span class="text-2xl mb-1">💎</span>
                        <span>VIP版</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="feature in features" :key="feature.name" class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ feature.name }}</td>
                    <td class="px-6 py-4 text-center text-sm text-gray-600">{{ feature.free }}</td>
                    <td class="px-6 py-4 text-center text-sm text-gray-600">{{ feature.pro }}</td>
                    <td class="px-6 py-4 text-center text-sm text-gray-600">{{ feature.vip }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 会员套餐 -->
          <div id="plans">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">选择套餐</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="plan in plans"
                :key="plan.id"
                :class="[
                  'bg-white rounded-2xl border-2 p-8 transition-all duration-200',
                  plan.popular
                    ? 'border-blue-500 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-lg',
                  currentPlan.id === plan.id ? 'ring-2 ring-blue-500' : ''
                ]"
              >
                <!-- 推荐标签 -->
                <div v-if="plan.popular" class="text-center mb-4">
                  <span class="inline-block px-4 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    最受欢迎
                  </span>
                </div>

                <!-- 套餐图标和名称 -->
                <div class="text-center mb-6">
                  <div class="text-5xl mb-3">{{ plan.icon }}</div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>
                  <p class="text-gray-600 text-sm">{{ plan.description }}</p>
                </div>

                <!-- 价格 -->
                <div class="text-center mb-6">
                  <div class="flex items-baseline justify-center">
                    <span class="text-gray-500 text-lg">¥</span>
                    <span class="text-5xl font-bold text-gray-900">{{ plan.price }}</span>
                    <span class="text-gray-500 text-lg ml-2">/月</span>
                  </div>
                  <p v-if="plan.yearlyPrice" class="text-sm text-gray-500 mt-2">
                    年付 ¥{{ plan.yearlyPrice }} (省 ¥{{ plan.price * 12 - plan.yearlyPrice }})
                  </p>
                </div>

                <!-- 功能列表 -->
                <ul class="space-y-3 mb-8">
                  <li v-for="feature in plan.features" :key="feature" class="flex items-start">
                    <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm text-gray-600">{{ feature }}</span>
                  </li>
                </ul>

                <!-- 购买按钮 -->
                <button
                  v-if="currentPlan.id === plan.id"
                  disabled
                  class="w-full py-3 bg-gray-100 text-gray-500 rounded-xl font-medium cursor-not-allowed"
                >
                  当前套餐
                </button>
                <button
                  v-else-if="plan.id === 'free'"
                  disabled
                  class="w-full py-3 bg-gray-100 text-gray-500 rounded-xl font-medium cursor-not-allowed"
                >
                  免费使用
                </button>
                <button
                  v-else
                  @click="selectPlan(plan)"
                  :class="[
                    'w-full py-3 rounded-xl font-medium transition-all duration-200',
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  ]"
                >
                  {{ currentPlan.id === 'free' ? '立即升级' : '切换套餐' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 常见问题 -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">常见问题</h2>
            
            <div class="space-y-4">
              <div
                v-for="faq in faqs"
                :key="faq.question"
                class="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ faq.question }}</h3>
                <p class="text-gray-600">{{ faq.answer }}</p>
              </div>
            </div>
          </div>

          <!-- 订单历史 -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">我的订单</h2>

            <div v-if="orders.length === 0" class="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div class="text-gray-400 text-5xl mb-4">📋</div>
              <p class="text-gray-600">暂无订单记录</p>
            </div>

            <div v-else class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">订单号</th>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">套餐</th>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">金额</th>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">状态</th>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">创建时间</th>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in orders" :key="order.id" class="border-t border-gray-200 hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-mono text-gray-900">{{ order.order_id }}</td>
                      <td class="px-6 py-4 text-sm text-gray-900">{{ order.plan_name }}</td>
                      <td class="px-6 py-4 text-sm text-gray-900">¥{{ order.amount }}</td>
                      <td class="px-6 py-4 text-sm">
                        <span :class="getStatusClass(order.status)">
                          {{ getStatusText(order.status) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(order.created_at) }}</td>
                      <td class="px-6 py-4 text-sm">
                        <div class="flex items-center space-x-2">
                          <!-- 待支付订单：继续支付 + 取消 -->
                          <template v-if="order.status === 'pending'">
                            <button
                              @click="continuePayment(order)"
                              class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                            >
                              继续支付
                            </button>
                            <button
                              @click="cancelOrder(order)"
                              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
                            >
                              取消
                            </button>
                          </template>
                          <!-- 已支付订单：查看详情 -->
                          <template v-else-if="order.status === 'paid'">
                            <button
                              @click="viewOrderDetail(order)"
                              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
                            >
                              查看详情
                            </button>
                          </template>
                          <!-- 其他状态：无操作 -->
                          <template v-else>
                            <span class="text-gray-400 text-xs">-</span>
                          </template>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </div><!-- 结束 v-else -->
        </main>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <PaymentModal
      :show="showPaymentModal"
      :selectedPlan="selectedPlanForPayment"
      @close="showPaymentModal = false"
      @success="handlePaymentSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import PaymentModal from './PaymentModal.vue'
import { membershipAPI } from '@/utils/api'
import { showSuccess, showError } from '@/utils/notification'

// 状态管理
const loading = ref(true)
const membershipStatus = ref(null)
const plans = ref([])
const orders = ref([])
const showPaymentModal = ref(false)
const selectedPlanForPayment = ref(null)

// 计算属性 - 当前会员套餐
const currentPlan = computed(() => {
  if (!membershipStatus.value) {
    return { id: 'free', name: '免费版', icon: '🆓', description: '体验基础功能' }
  }

  if (membershipStatus.value.is_premium_active) {
    return {
      id: 'premium',
      name: '专业版',
      icon: '⭐',
      description: '享受专业功能'
    }
  }

  return { id: 'free', name: '免费版', icon: '🆓', description: '体验基础功能' }
})

// 计算属性 - 到期时间
const expiryDate = computed(() => {
  if (!membershipStatus.value?.premium_expires_at) return null
  return new Date(membershipStatus.value.premium_expires_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// 功能对比
const features = ref([
  { name: '策略生成', free: '3次/月', pro: '无限次', vip: '无限次' },
  { name: '策略数量', free: '3个', pro: '20个', vip: '无限' },
  { name: '自动交易', free: '✗', pro: '✓', vip: '✓' },
  { name: '策略分享', free: '✗', pro: '✓', vip: '✓' },
  { name: '高级分析', free: '✗', pro: '✓', vip: '✓' },
  { name: '实时信号推送', free: '✗', pro: '✓', vip: '✓' },
  { name: '交易所API绑定', free: '1个', pro: '3个', vip: '无限' },
  { name: '历史数据导出', free: '✗', pro: '✓', vip: '✓' },
  { name: '优先客服支持', free: '✗', pro: '✗', vip: '✓' },
  { name: '专属策略顾问', free: '✗', pro: '✗', vip: '✓' }
])

// 常见问题
const faqs = ref([
  {
    question: '如何升级会员？',
    answer: '选择您想要的套餐，点击"立即升级"按钮，选择加密货币支付方式完成支付即可。目前支持 USDT/USDC 多链支付。'
  },
  {
    question: '会员可以随时取消吗？',
    answer: '可以。您可以随时取消会员订阅，取消后会员权益将在当前计费周期结束后失效，不会立即失效。'
  },
  {
    question: '年付和月付有什么区别？',
    answer: '年付相比月付可以节省约20%的费用。例如专业版月付99元/月，年付950元相当于79元/月。'
  },
  {
    question: '升级后可以续费吗？',
    answer: '可以。如果您的会员未过期，续费后会在当前到期时间基础上延长；如果已过期，则从支付时间开始计算。'
  },
  {
    question: '支持哪些支付方式？',
    answer: '目前支持加密货币支付（USDT/USDC），支持 Ethereum、BSC、Polygon 等多个网络。传统支付方式（支付宝/微信）即将上线。'
  }
])

// 页面加载时获取数据
onMounted(async () => {
  await Promise.all([
    loadMembershipStatus(),
    loadPlans(),
    loadOrders()
  ])
  loading.value = false
})

// 加载会员状态
async function loadMembershipStatus() {
  try {
    const response = await membershipAPI.getStatus()
    if (response.status === 'success') {
      membershipStatus.value = response.data
    }
  } catch (error) {
    console.error('获取会员状态失败:', error)
    showError('获取会员状态失败')
  }
}

// 加载套餐列表
async function loadPlans() {
  try {
    const response = await membershipAPI.getPlans()
    if (response.status === 'success') {
      // 转换后端数据为前端格式
      plans.value = response.data.map(plan => ({
        id: plan.id,
        name: plan.name,
        type: plan.plan_type,
        price: parseFloat(plan.price),
        duration: plan.duration_days,
        icon: plan.plan_type === 'monthly' ? '⭐' : '💎',
        description: plan.plan_type === 'monthly' ? '适合专业交易者' : '适合长期使用',
        popular: plan.plan_type === 'yearly',
        features: plan.plan_type === 'monthly' ? [
          '策略生成无限次',
          '最多20个策略',
          '自动交易功能',
          '策略分享收益',
          '高级数据分析',
          '实时信号推送',
          '绑定3个交易所',
          '历史数据导出'
        ] : [
          '月付版所有功能',
          '无限策略数量',
          '无限交易所绑定',
          '优先客服支持',
          '专属策略顾问',
          '定制化策略开发',
          'API调用优先级',
          '专属社群'
        ]
      }))
    }
  } catch (error) {
    console.error('获取套餐列表失败:', error)
    showError('获取套餐列表失败')
  }
}

// 加载订单历史
async function loadOrders() {
  try {
    const response = await membershipAPI.getOrders()
    if (response.status === 'success') {
      orders.value = response.data
    }
  } catch (error) {
    console.error('获取订单历史失败:', error)
    // 订单历史失败不显示错误提示，不影响主要功能
  }
}

// 滚动到套餐区域
const scrollToPlans = () => {
  document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })
}

// 选择套餐
const selectPlan = (plan) => {
  if (plan.id === 'free') {
    return
  }
  selectedPlanForPayment.value = plan
  showPaymentModal.value = true
}

// 支付成功回调
const handlePaymentSuccess = async () => {
  showPaymentModal.value = false
  showSuccess('会员升级成功！🎉')

  // 重新加载会员状态和订单历史
  await Promise.all([
    loadMembershipStatus(),
    loadOrders()
  ])
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取订单状态样式
const getStatusClass = (status) => {
  const statusMap = {
    'pending': 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800',
    'paid': 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
    'expired': 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800',
    'cancelled': 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
  }
  return statusMap[status] || 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
}

// 获取订单状态文本
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待支付',
    'paid': '已支付',
    'expired': '已过期',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 继续支付订单
const continuePayment = async (order) => {
  // 先取消现有订单，然后重新创建
  if (confirm(`订单 ${order.order_id} 将被取消并重新创建，是否继续？`)) {
    try {
      // 取消旧订单
      await membershipAPI.cancelOrder(order.order_id)

      // 找到对应的套餐
      const plan = plans.value.find(p => p.id === order.plan)
      if (plan) {
        selectedPlanForPayment.value = plan
        showPaymentModal.value = true

        // 重新加载订单列表
        await loadOrders()
      } else {
        showError('套餐信息不存在')
      }
    } catch (error) {
      console.error('处理订单失败:', error)
      showError('处理订单失败，请重试')
    }
  }
}

// 取消订单
const cancelOrder = async (order) => {
  if (!confirm(`确定要取消订单 ${order.order_id} 吗？`)) {
    return
  }

  try {
    const response = await membershipAPI.cancelOrder(order.order_id)
    if (response.status === 'success') {
      showSuccess('订单已取消')
      // 重新加载订单列表
      await loadOrders()
    } else {
      showError(response.message || '取消订单失败')
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    showError('取消订单失败')
  }
}

// 查看订单详情
const viewOrderDetail = (order) => {
  // 显示订单详情弹窗
  alert(`订单详情：\n\n订单号：${order.order_id}\n套餐：${order.plan_name}\n金额：¥${order.amount}\n状态：${getStatusText(order.status)}\n创建时间：${formatDate(order.created_at)}\n支付时间：${order.paid_at ? formatDate(order.paid_at) : '-'}`)
}
</script>


