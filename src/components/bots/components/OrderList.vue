<template>
  <div class="space-y-6">
    <!-- 筛选器 -->
    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 状态筛选 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">状态</label>
          <select
            v-model="filters.status"
            @change="loadOrders"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="pending">待执行</option>
            <option value="submitted">已提交</option>
            <option value="partially_filled">部分成交</option>
          </select>
        </div>

        <!-- 方向筛选 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">方向</label>
          <select
            v-model="filters.side"
            @change="loadOrders"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="buy">买入</option>
            <option value="sell">卖出</option>
          </select>
        </div>

        <!-- 机器人筛选 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">机器人</label>
          <select
            v-model="filters.bot_id"
            @change="loadOrders"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option v-for="bot in bots" :key="bot.id" :value="bot.id">
              {{ bot.name }}
            </option>
          </select>
        </div>

        <!-- 刷新按钮 -->
        <div class="flex items-end">
          <button
            @click="loadOrders"
            :disabled="loading"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading">加载中...</span>
            <span v-else>刷新</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div v-if="loading && orders.length === 0" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-slate-600">加载中...</p>
    </div>

    <div v-else-if="orders.length === 0" class="bg-white rounded-xl p-12 text-center border border-slate-200">
      <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-slate-900">暂无委托订单</h3>
      <p class="mt-1 text-sm text-slate-500">当前没有待执行的订单</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- 机器人名称和交易对 -->
            <div class="flex items-center gap-3 mb-3">
              <h3 class="text-lg font-semibold text-slate-900">{{ order.bot_name }}</h3>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  order.side === 'buy'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                ]"
              >
                {{ order.side_display }}
              </span>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : order.status === 'submitted'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                ]"
              >
                {{ order.status_display }}
              </span>
            </div>

            <!-- 订单详情 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div class="text-slate-500">订单类型</div>
                <div class="font-medium text-slate-900">{{ order.type_display }}</div>
              </div>
              <div>
                <div class="text-slate-500">价格</div>
                <div class="font-medium text-slate-900">${{ Number(order.price).toFixed(2) }}</div>
              </div>
              <div>
                <div class="text-slate-500">数量</div>
                <div class="font-medium text-slate-900">{{ Number(order.quantity).toFixed(4) }}</div>
              </div>
              <div>
                <div class="text-slate-500">总价值</div>
                <div class="font-medium text-slate-900">${{ Number(order.total_value).toFixed(2) }}</div>
              </div>
            </div>

            <!-- 已成交信息（部分成交） -->
            <div v-if="order.status === 'partially_filled'" class="mt-3 p-3 bg-purple-50 rounded-lg">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div class="text-purple-600">已成交数量</div>
                  <div class="font-medium text-purple-900">{{ Number(order.filled_quantity).toFixed(4) }}</div>
                </div>
                <div>
                  <div class="text-purple-600">成交均价</div>
                  <div class="font-medium text-purple-900">${{ Number(order.filled_price).toFixed(2) }}</div>
                </div>
              </div>
            </div>

            <!-- 创建时间 -->
            <div class="mt-3 text-xs text-slate-500">
              创建时间：{{ formatDate(order.created_at) }}
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="ml-4">
            <button
              @click="cancelOrder(order.id)"
              :disabled="cancelling === order.id"
              class="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="cancelling === order.id">取消中...</span>
              <span v-else>取消订单</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page; loadOrders()"
        :class="[
          'px-4 py-2 rounded-lg transition-colors',
          currentPage === page
            ? 'bg-blue-600 text-white'
            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { botAPI } from '@/utils/api'
import { showSuccess, showError } from '@/utils/notification'

// 数据
const orders = ref([])
const bots = ref([])
const loading = ref(false)
const cancelling = ref(null)

// 筛选器
const filters = ref({
  status: '',
  side: '',
  bot_id: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)

// 加载订单列表
const loadOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      // 只显示未成交的订单
      status__in: 'pending,submitted,partially_filled',
      ...filters.value
    }

    // 移除空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null) {
        delete params[key]
      }
    })

    // 使用 botAPI 获取交易记录（过滤未成交的）
    const response = await botAPI.getTradeList(params)

    orders.value = response.results || response.data || []
    totalPages.value = Math.ceil((response.count || 0) / pageSize.value)
  } catch (error) {
    console.error('加载订单失败:', error)
    showError('加载订单失败')
  } finally {
    loading.value = false
  }
}

// 加载机器人列表（用于筛选）
const loadBots = async () => {
  try {
    const response = await botAPI.getBotList({
      bot_type: 'trend_following',
      page_size: 100
    })

    bots.value = response.results || response.data || []
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  }
}

// 取消订单
const cancelOrder = async (orderId) => {
  if (!confirm('确定要取消这个订单吗？')) {
    return
  }

  cancelling.value = orderId
  try {
    const token = localStorage.getItem('token')
    await axios.post(
      `${API_BASE_URL}/api/trading/trades/${orderId}/cancel/`,
      {},
      { headers: { 'Authorization': `Token ${token}` } }
    )

    showSuccess('订单已取消')
    await loadOrders()
  } catch (error) {
    console.error('取消订单失败:', error)
    showError(error.response?.data?.error || '取消订单失败')
  } finally {
    cancelling.value = null
  }
}

// 格式化日期
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
onMounted(() => {
  loadOrders()
  loadBots()
})
</script>

