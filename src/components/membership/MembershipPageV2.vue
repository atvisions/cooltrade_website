<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
    <Header />

    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="membership" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 加载状态 -->
          <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-600">加载中...</p>
            </div>
          </div>

          <!-- 主要内容 -->
          <div v-else>
            <!-- 页面标题 -->
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-gray-900">会员中心</h1>
              <p class="text-gray-600 mt-2">管理您的会员权益和订阅</p>
            </div>

            <!-- 当前订阅 - 与 BillingTab 相同样式 -->
            <div class="mb-8">
              <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">当前订阅</h3>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <!-- 会员图标 -->
                    <div :class="[
                      'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl',
                      membershipStatus.membership_tier === 'professional' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      membershipStatus.membership_tier === 'standard' ? 'bg-blue-600' : 'bg-gray-400'
                    ]">
                      {{ membershipStatus.is_premium ? '★' : '○' }}
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900">{{ currentTierName }}</h4>
                      <p class="text-gray-600">{{ membershipStatus.is_premium ? '享受高级功能和优先支持' : '基础功能，免费使用' }}</p>
                      <p v-if="membershipStatus.is_premium" class="text-sm text-gray-500">
                        月付 · 下次续费: {{ formatDate(membershipStatus.premium_expires_at) }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-gray-900">
                      {{ currentPlanPrice }}
                    </div>
                    <div class="text-sm text-gray-500">{{ membershipStatus.is_premium ? '每月' : '免费' }}</div>
                  </div>
                </div>

                <div class="mt-6">
                  <button
                    @click="scrollToPlans"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {{ membershipStatus.is_premium ? '更改计划' : '升级计划' }}
                  </button>
                </div>

                <!-- 续费提示 -->
                <div v-if="membershipStatus.is_premium && remainingDays < 30" class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="text-yellow-800 text-sm">您的会员即将到期（剩余 {{ remainingDays }} 天），建议提前续费以免影响使用</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 套餐选择区域 -->
            <div class="mb-8">
              <!-- 标题和切换器 -->
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-1">选择适合您的套餐</h2>
                  <p class="text-sm text-gray-600">灵活的定价方案，满足不同需求</p>
                </div>

                <!-- 月付/年付切换 -->
                <div class="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    @click="billingCycle = 'monthly'"
                    class="px-4 py-2 rounded-md text-sm font-medium transition-all"
                    :class="billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                  >
                    月付
                  </button>
                  <button
                    @click="billingCycle = 'yearly'"
                    class="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-1"
                    :class="billingCycle === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                  >
                    <span>年付</span>
                    <span class="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                      省20%
                    </span>
                  </button>
                </div>
              </div>

              <!-- 套餐卡片 -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <!-- 免费版 -->
                <PricingCard
                  tier="free"
                  :billing-cycle="billingCycle"
                  :is-current="!membershipStatus.is_premium"
                  :plans="plans"
                  @select="selectPlan"
                />

                <!-- Standard -->
                <PricingCard
                  tier="standard"
                  :billing-cycle="billingCycle"
                  :is-current="membershipStatus.is_premium && membershipStatus.membership_tier === 'standard'"
                  :is-popular="true"
                  :plans="plans"
                  @select="selectPlan"
                />

                <!-- Professional -->
                <PricingCard
                  tier="professional"
                  :billing-cycle="billingCycle"
                  :is-current="membershipStatus.is_premium && membershipStatus.membership_tier === 'professional'"
                  :plans="plans"
                  @select="selectPlan"
                />
              </div>
            </div>

            <!-- 功能对比表 -->
            <div class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">功能对比</h2>
              <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <table class="min-w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">功能</th>
                      <th class="px-6 py-3 text-center text-sm font-semibold text-gray-900">免费版</th>
                      <th class="px-6 py-3 text-center text-sm font-semibold text-gray-900 bg-blue-50">Standard</th>
                      <th class="px-6 py-3 text-center text-sm font-semibold text-gray-900 bg-purple-50">Professional</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="feature in features" :key="feature.name" class="hover:bg-gray-50">
                      <td class="px-6 py-3 text-sm text-gray-900">{{ feature.name }}</td>
                      <td class="px-6 py-3 text-sm text-center text-gray-600">{{ feature.free }}</td>
                      <td class="px-6 py-3 text-sm text-center text-gray-900 bg-blue-50/50 font-medium">{{ feature.standard }}</td>
                      <td class="px-6 py-3 text-sm text-center text-gray-900 bg-purple-50/50 font-medium">{{ feature.professional }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 付费记录 - 与 BillingTab 相同样式 -->
            <div class="mb-8">
              <div class="bg-white rounded-lg border border-gray-200 p-6">
                <div class="mb-6">
                  <h3 class="text-lg font-medium text-gray-900">付费记录</h3>
                </div>

                <div v-if="orders.length === 0" class="text-center py-8">
                  <p class="text-gray-600">暂无付费记录</p>
                </div>

                <div v-else class="overflow-hidden">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          描述
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          日期
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          金额
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="order in orders" :key="order.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ order.plan_name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(order.created_at) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${{ order.amount }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="[
                            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                            order.status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          ]">
                            {{ getStatusText(order.status) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <template v-if="order.status === 'pending'">
                            <button
                              @click="continuePayment(order)"
                              class="text-blue-600 hover:text-blue-700 mr-3"
                            >
                              继续支付
                            </button>
                            <button
                              @click="cancelOrder(order)"
                              class="text-red-600 hover:text-red-700"
                            >
                              取消
                            </button>
                          </template>
                          <template v-else>
                            <button
                              @click="viewOrderDetail(order)"
                              class="text-blue-600 hover:text-blue-700"
                            >
                              查看详情
                            </button>
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 分页 -->
                <div v-if="orders.length > 0" class="mt-6 flex items-center justify-between">
                  <div class="text-sm text-gray-500">
                    显示 1-{{ orders.length }} 条，共 {{ orders.length }} 条记录
                  </div>
                  <div class="flex space-x-2">
                    <button class="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">
                      上一页
                    </button>
                    <button class="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">
                      下一页
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <PaymentModal
      :show="showPaymentModal"
      :selected-plan="selectedPlanForPayment"
      @close="showPaymentModal = false"
      @success="handlePaymentSuccess"
    />

    <!-- 确认对话框 -->
    <ConfirmDialog
      :show="confirmDialog.show"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :type="confirmDialog.type"
      :confirm-text="confirmDialog.confirmText"
      :cancel-text="confirmDialog.cancelText"
      :show-cancel="confirmDialog.showCancel"
      @confirm="confirmDialog.onConfirm"
      @cancel="confirmDialog.onCancel"
      @close="confirmDialog.show = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import PaymentModal from './PaymentModal.vue'
import PricingCard from './PricingCard.vue'
import ConfirmDialog from '../common/ConfirmDialog.vue'
import { membershipAPI } from '@/utils/api'
import { showSuccess, showError } from '@/utils/notification'

// 状态
const loading = ref(true)
const billingCycle = ref('monthly') // 'monthly' or 'yearly'
const membershipStatus = ref({})
const plans = ref([])
const orders = ref([])
const showPaymentModal = ref(false)
const selectedPlanForPayment = ref(null)

// 确认对话框状态
const confirmDialog = ref({
  show: false,
  title: '确认',
  message: '',
  type: 'warning',
  confirmText: '确定',
  cancelText: '取消',
  showCancel: true,
  onConfirm: () => {},
  onCancel: () => {}
})

// 功能对比数据
const features = ref([
  { name: '信号机器人', free: '1', standard: '10', professional: '无限' },
  { name: '交易机器人', free: '1', standard: '10', professional: '无限' },
  { name: 'AI 策略生成', free: '3次/月', standard: '无限', professional: '无限' },
  { name: 'AI 市场分析', free: '✗', standard: '✓', professional: '✓' },
  { name: '策略回测', free: '3次/月', standard: '50次/月', professional: '无限' },
  { name: '回测数据范围', free: '30天', standard: '1年', professional: '5年' },
  { name: '交易所 API', free: '1个', standard: '3个', professional: '无限' },
  { name: '实时通知', free: '✗', standard: '✓', professional: '✓' },
  { name: 'Telegram 通知', free: '✗', standard: '✗', professional: '✓' },
  { name: '数据导出', free: '✗', standard: '✓', professional: '✓' },
  { name: '策略分享', free: '✗', standard: '✓', professional: '✓' },
  { name: '客服支持', free: '社区', standard: '邮件', professional: '优先' },
  { name: '专属顾问', free: '✗', standard: '✗', professional: '✓' },
])

// 计算属性
const currentTierName = computed(() => {
  if (!membershipStatus.value.is_premium) return '免费版'
  if (membershipStatus.value.membership_tier === 'professional') return 'Professional'
  return 'Standard'
})

const remainingDays = computed(() => {
  if (!membershipStatus.value.premium_expires_at) return 0
  const now = new Date()
  const expiry = new Date(membershipStatus.value.premium_expires_at)
  const diff = expiry - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

// 计算当前套餐价格
const currentPlanPrice = computed(() => {
  if (!membershipStatus.value.is_premium) return '$0'

  // 从最近的已支付订单中获取价格信息
  const paidOrder = orders.value.find(order =>
    order.status === 'paid' || order.status === 'completed'
  )

  if (paidOrder) {
    // 根据订单的 plan_type 显示价格
    const isMonthly = paidOrder.plan_type === 'monthly'
    return `$${paidOrder.amount}/${isMonthly ? '月' : '年'}`
  }

  // 如果没有订单，从 plans 中查找月付价格
  const currentPlan = plans.value.find(plan =>
    plan.tier === membershipStatus.value.membership_tier &&
    plan.plan_type === 'monthly'
  )

  if (currentPlan) {
    return `$${currentPlan.price}/月`
  }

  // 最后的降级方案：返回 $0
  return '$0'
})

// 方法

const selectPlan = (tier) => {
  if (tier === 'free') return

  // 查找对应的套餐
  const plan = plans.value.find(p => p.tier === tier && p.plan_type === billingCycle.value)

  console.log('选择套餐:', {
    tier,
    billingCycle: billingCycle.value,
    allPlans: plans.value.map(p => ({ tier: p.tier, plan_type: p.plan_type, name: p.name })),
    foundPlan: plan
  })

  if (plan) {
    selectedPlanForPayment.value = plan
    showPaymentModal.value = true
  } else {
    showError(`套餐不存在：${tier} - ${billingCycle.value}`)
  }
}

const scrollToPlans = () => {
  // 滚动到套餐卡片区域
  const element = document.querySelector('.grid')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const loadMembershipStatus = async () => {
  try {
    const response = await membershipAPI.getStatus()
    if (response.status === 'success') {
      membershipStatus.value = response.data
    }
  } catch (error) {
    console.error('加载会员状态失败:', error)
  }
}

const loadPlans = async () => {
  try {
    const response = await membershipAPI.getPlans()
    if (response.status === 'success') {
      plans.value = response.data
    }
  } catch (error) {
    console.error('加载套餐列表失败:', error)
  }
}

const loadOrders = async () => {
  try {
    const response = await membershipAPI.getOrders()
    if (response.status === 'success') {
      orders.value = response.data
    }
  } catch (error) {
    console.error('加载订单列表失败:', error)
  }
}

const continuePayment = (order) => {
  confirmDialog.value = {
    show: true,
    title: '继续支付',
    message: `订单 ${order.order_id} 将被取消并重新创建，是否继续？`,
    type: 'warning',
    confirmText: '继续',
    cancelText: '取消',
    showCancel: true,
    onConfirm: async () => {
      try {
        await membershipAPI.cancelOrder(order.order_id)
        const plan = plans.value.find(p => p.id === order.plan)
        if (plan) {
          selectedPlanForPayment.value = plan
          showPaymentModal.value = true
          await loadOrders()
        } else {
          showError('套餐信息不存在')
        }
      } catch (error) {
        console.error('处理订单失败:', error)
        showError('处理订单失败，请重试')
      }
    },
    onCancel: () => {}
  }
}

const cancelOrder = (order) => {
  confirmDialog.value = {
    show: true,
    title: '取消订单',
    message: `确定要取消订单 ${order.order_id} 吗？`,
    type: 'danger',
    confirmText: '确定取消',
    cancelText: '返回',
    showCancel: true,
    onConfirm: async () => {
      try {
        const response = await membershipAPI.cancelOrder(order.order_id)
        if (response.status === 'success') {
          showSuccess('订单已取消')
          await loadOrders()
        } else {
          showError(response.message || '取消订单失败')
        }
      } catch (error) {
        console.error('取消订单失败:', error)
        showError('取消订单失败')
      }
    },
    onCancel: () => {}
  }
}

const viewOrderDetail = (order) => {
  const details = [
    `订单号：${order.order_id}`,
    `套餐：${order.plan_name}`,
    `金额：$${order.amount}`,
    `状态：${getStatusText(order.status)}`,
    `创建时间：${formatDate(order.created_at)}`,
    `支付时间：${order.paid_at ? formatDate(order.paid_at) : '-'}`
  ].join('\n')

  confirmDialog.value = {
    show: true,
    title: '订单详情',
    message: details,
    type: 'info',
    confirmText: '关闭',
    showCancel: false,
    onConfirm: () => {},
    onCancel: () => {}
  }
}

const handlePaymentSuccess = async () => {
  showPaymentModal.value = false
  showSuccess('支付成功！会员已激活 🎉')
  await loadMembershipStatus()
  await loadOrders()
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': '待支付',
    'paid': '已支付',
    'expired': '已过期',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化
onMounted(async () => {
  await Promise.all([
    loadMembershipStatus(),
    loadPlans(),
    loadOrders()
  ])
  loading.value = false
})
</script>

<style scoped>
/* 自定义样式 */
</style>

