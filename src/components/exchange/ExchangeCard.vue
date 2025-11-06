<template>
  <div class="border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-200">
    <!-- 主要内容区域 -->
    <div class="p-6">
      <!-- 头部信息 -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center space-x-3 flex-1">
          <!-- 交易所图标 -->
          <img
            :src="getExchangeLogo(exchange.exchange)"
            :alt="getExchangeName(exchange.exchange)"
            class="w-12 h-12 rounded-lg object-contain bg-gray-100 p-1"
            @error="handleImageError"
          />

          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <h4 class="text-xl font-semibold text-gray-900">{{ exchange.name }}</h4>
              <!-- 连接状态 -->
              <span :class="[
                'flex items-center space-x-1 text-sm',
                exchange.status === 'active' ? 'text-green-600' : 'text-red-600'
              ]">
                <span :class="[
                  'w-2 h-2 rounded-full',
                  exchange.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                ]"></span>
                <span>{{ getStatusText(exchange.status) }}</span>
              </span>
            </div>

            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <span>{{ getExchangeName(exchange.exchange) }}</span>
              <span class="text-gray-400">•</span>
              <span>最后同步: {{ formatTime(exchange.last_sync_at) }}</span>
              <span class="text-gray-400">•</span>
              <span :class="exchange.is_testnet ? 'text-orange-600' : 'text-gray-500'">
                {{ exchange.is_testnet ? '测试网' : '主网' }}
              </span>
            </div>
          </div>

          <!-- 总资产 - 始终显示 -->
          <div class="text-right">
            <div class="text-sm text-gray-500 mb-1">总资产</div>
            <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(getTotalBalance()) }}</div>
          </div>

          <!-- 展开/收起按钮 -->
          <button
            @click="isExpanded = !isExpanded"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors ml-4"
            :title="isExpanded ? '收起详情' : '展开详情'"
          >
            <svg
              class="w-5 h-5 transition-transform duration-200"
              :class="{ 'rotate-180': isExpanded }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 详细信息 - 可展开/收起 -->
      <div v-show="isExpanded" class="space-y-4 mb-4">
        <!-- API 权限列表 -->
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs font-medium text-gray-700 mb-2">API 权限</div>
          <div class="flex flex-wrap gap-2">
            <!-- 读取权限 -->
            <div :class="[
              'flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium',
              hasPermission('read') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              <span>{{ hasPermission('read') ? '✓' : '✗' }}</span>
              <span>读取</span>
            </div>

            <!-- 交易权限 -->
            <div :class="[
              'flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium',
              hasPermission('trade') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              <span>{{ hasPermission('trade') ? '✓' : '✗' }}</span>
              <span>交易</span>
            </div>

            <!-- 提现权限 -->
            <div :class="[
              'flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium',
              hasPermission('withdraw') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              <span>{{ hasPermission('withdraw') ? '✓' : '✗' }}</span>
              <span>提现</span>
            </div>
          </div>
        </div>

        <!-- 账户类型详情 -->
        <div class="space-y-2">
          <!-- 现货账户 -->
          <div v-if="hasSpotBalance()" class="bg-gray-50 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
                <span class="text-sm font-medium text-gray-700">Spot（现货）</span>
              </div>
              <button
                @click="toggleSpotDetails"
                class="text-xs text-blue-600 hover:text-blue-700"
              >
                {{ showSpotDetails ? '收起' : '展开' }}
              </button>
            </div>
            <div v-if="showSpotDetails" class="space-y-1 mt-2 pl-2 border-l-2 border-gray-300">
              <div
                v-for="(info, currency) in getSpotBalances()"
                :key="currency"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-gray-600">{{ currency }}</span>
                <span class="font-medium text-gray-900">{{ info.total }}</span>
              </div>
            </div>
          </div>

          <!-- 合约账户 -->
          <div v-if="hasFutureBalance()" class="bg-gray-50 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
                <span class="text-sm font-medium text-gray-700">Futures（合约）</span>
              </div>
              <button
                @click="toggleFutureDetails"
                class="text-xs text-blue-600 hover:text-blue-700"
              >
                {{ showFutureDetails ? '收起' : '展开' }}
              </button>
            </div>
            <div v-if="showFutureDetails" class="space-y-1 mt-2 pl-2 border-l-2 border-gray-300">
              <div
                v-for="(info, currency) in getFutureBalances()"
                :key="currency"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-gray-600">{{ currency }}</span>
                <span class="font-medium text-gray-900">{{ info.total }}</span>
              </div>
            </div>
          </div>

          <!-- 无资产提示 -->
          <div v-if="!hasSpotBalance() && !hasFutureBalance()" class="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">No assets</span>
                  <span class="text-sm font-medium text-gray-900">暂无资产</span>
                </div>
                <div v-if="exchange.is_testnet" class="text-xs text-gray-600 space-y-2">
                  <p class="font-medium text-orange-700">📌 测试网账户需要手动获取测试资金：</p>
                  <ol class="list-decimal list-inside space-y-1 ml-2 text-gray-700">
                    <li>访问 <a href="https://www.gate.com/testnet/futures_trade/BTC/BTC_USD" target="_blank" class="text-blue-600 hover:text-blue-700 underline font-medium">Gate.io 测试网合约交易</a></li>
                    <li>登录您的 Gate.io 账户（会自动创建测试网账户）</li>
                    <li>系统会自动为您的测试账户分配虚拟资金（通常是 10,000 USDT）</li>
                    <li>如需更多测试资金，可在合约账户页面点击"充值测试币"</li>
                    <li>获取资金后，返回此页面点击 <span class="inline-flex items-center px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">🔄 同步</span> 按钮刷新余额</li>
                  </ol>
                  <p class="text-orange-600 font-medium mt-2">⚠️ 注意：测试网资金仅用于模拟交易，无法提现或转换为真实资金</p>
                </div>
                <p v-else class="text-xs text-gray-600">
                  请向此账户充值后再使用
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 - 始终显示 -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <!-- 左侧：启用/禁用开关 -->
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">{{ exchange.status === 'active' ? '已启用' : '已暂停' }}</span>
          <button
            @click="$emit('toggle-status', exchange.id)"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              exchange.status === 'active' ? 'bg-blue-600' : 'bg-gray-300'
            ]"
            role="switch"
            :aria-checked="exchange.status === 'active'"
            :title="exchange.status === 'active' ? '点击暂停' : '点击启用'"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                exchange.status === 'active' ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>

        <!-- 右侧：操作按钮组 -->
        <div class="flex items-center space-x-2">
          <!-- 同步余额按钮 -->
          <button
            @click="$emit('sync', exchange.id)"
            :disabled="exchange.syncing || exchange.status !== 'active'"
            :title="exchange.syncing ? '同步中...' : '同步余额'"
            :class="[
              'p-2.5 rounded-lg transition-all duration-200 shadow-sm',
              exchange.syncing || exchange.status !== 'active'
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
            ]"
          >
            <ArrowPathIcon :class="['w-5 h-5', exchange.syncing ? 'animate-spin' : '']" />
          </button>

          <!-- 编辑按钮 -->
          <button
            @click="$emit('edit', exchange)"
            title="编辑配置"
            class="p-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <PencilIcon class="w-5 h-5" />
          </button>

          <!-- 解绑按钮 -->
          <button
            @click="$emit('unbind', exchange.id)"
            title="解绑交易所"
            class="p-2.5 bg-white border border-gray-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowPathIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  exchange: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['sync', 'edit', 'unbind', 'toggle-status'])

// 状态
const isExpanded = ref(false)
const showSpotDetails = ref(false)
const showFutureDetails = ref(false)

// 格式化货币
const formatCurrency = (value) => {
  const numValue = parseFloat(value || 0)

  // 如果金额小于 0.01，保留4位小数
  if (numValue > 0 && numValue < 0.01) {
    return '$' + numValue.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })
  }

  // 否则保留2位小数
  return '$' + numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return '未同步'
  try {
    const date = new Date(timeStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`

    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return timeStr
  }
}

// 检查权限
const hasPermission = (permissionType) => {
  if (!props.exchange.permissions) {
    return false
  }
  return props.exchange.permissions[permissionType] === true
}

// 获取交易所Logo
const getExchangeLogo = (exchange) => {
  return `/dex/${exchange}.png`
}

// 获取交易所名称
const getExchangeName = (exchange) => {
  const names = {
    binance: 'Binance',
    okx: 'OKX',
    bybit: 'Bybit',
    gate: 'Gate.io',
    bitget: 'Bitget'
  }
  return names[exchange] || exchange
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'active': '已连接',
    'error': '连接失败',
    'inactive': '未激活',
    'pending': '待验证'
  }
  return statusMap[status] || '未连接'
}

// 处理图片加载错误
const handleImageError = (e) => {
  console.error('图片加载失败:', e.target.src)
  // 使用默认图标
  e.target.style.display = 'none'
}

// 获取总余额
const getTotalBalance = () => {
  const snapshot = props.exchange.balance_snapshot
  if (!snapshot) return 0

  // 如果有新格式的数据（包含 spot 和 future）
  if (snapshot.total_usd !== undefined) {
    return snapshot.total_usd
  }

  // 兼容旧格式
  return props.exchange.total_balance || 0
}

// 检查是否有现货余额
const hasSpotBalance = () => {
  const snapshot = props.exchange.balance_snapshot
  return snapshot && snapshot.spot && Object.keys(snapshot.spot).length > 0
}

// 检查是否有合约余额
const hasFutureBalance = () => {
  const snapshot = props.exchange.balance_snapshot
  return snapshot && snapshot.future && Object.keys(snapshot.future).length > 0
}

// 获取现货余额
const getSpotBalances = () => {
  const snapshot = props.exchange.balance_snapshot
  return snapshot?.spot || {}
}

// 获取合约余额
const getFutureBalances = () => {
  const snapshot = props.exchange.balance_snapshot
  return snapshot?.future || {}
}

// 切换现货详情
const toggleSpotDetails = () => {
  showSpotDetails.value = !showSpotDetails.value
}

// 切换合约详情
const toggleFutureDetails = () => {
  showFutureDetails.value = !showFutureDetails.value
}
</script>

