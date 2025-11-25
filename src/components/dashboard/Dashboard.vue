<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="dashboard" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
        <!-- 页面标题和设置 -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">仪表板</h1>
            <p class="text-gray-600 mt-2">欢迎回来，查看您的交易概况</p>
          </div>
          <!-- 开关按钮 -->
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-700">隐藏模拟账户余额</span>
            <button
              @click="toggleTestnetBalance"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                hideTestnetBalance ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  hideTestnetBalance ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>

      <!-- 仪表板内容 -->
      <div class="space-y-8">
        <!-- 顶部统计卡片 - 4个卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- 现货总余额 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-500 mb-1">现货总余额</p>
                <p class="text-xl font-bold text-gray-900">{{ formatCurrency(spotTotalBalance) }}</p>
                <p class="text-xs text-gray-500 mt-1">Spot Balance</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CurrencyDollarIcon class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <!-- 合约总余额 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-500 mb-1">合约总余额</p>
                <p class="text-xl font-bold text-purple-600">{{ formatCurrency(futureTotalBalance) }}</p>
                <p class="text-xs text-gray-500 mt-1">Future Balance</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ChartBarIcon class="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <!-- 合约可用余额 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-500 mb-1">合约可用</p>
                <p class="text-xl font-bold text-green-600">{{ formatCurrency(futureAvailableBalance) }}</p>
                <p class="text-xs text-gray-500 mt-1">Available</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CurrencyDollarIcon class="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <!-- 合约冻结余额 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-500 mb-1">合约冻结</p>
                <p class="text-xl font-bold text-orange-600">{{ formatCurrency(futureFrozenBalance) }}</p>
                <p class="text-xs text-gray-500 mt-1">Frozen</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowTrendingUpIcon class="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- 资产分布 -->
        <div v-if="filteredExchanges.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">资产分布</h3>
            <!-- 切换按钮组 - 灰色底 + 白色按钮 + 最大圆角 -->
            <div class="inline-flex bg-gray-100 rounded-full p-1">
              <button
                @click="assetViewMode = 'all'"
                :class="[
                  'px-4 py-1.5 text-sm font-medium rounded-full transition-all',
                  assetViewMode === 'all'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                全部
              </button>
              <button
                @click="assetViewMode = 'spot'"
                :class="[
                  'px-4 py-1.5 text-sm font-medium rounded-full transition-all',
                  assetViewMode === 'spot'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                现货
              </button>
              <button
                @click="assetViewMode = 'future'"
                :class="[
                  'px-4 py-1.5 text-sm font-medium rounded-full transition-all',
                  assetViewMode === 'future'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                合约
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- 饼图 -->
            <div class="flex items-center justify-center">
              <svg viewBox="0 0 200 200" class="w-64 h-64">
                <!-- 饼图切片 -->
                <g v-for="(slice, index) in pieSlices" :key="index">
                  <path
                    :d="slice.path"
                    :fill="slice.color"
                    :stroke="'white'"
                    :stroke-width="2"
                    class="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                </g>
                <!-- 中心圆（甜甜圈效果） -->
                <circle cx="100" cy="100" r="50" fill="white" />
                <!-- 中心文字 -->
                <text x="100" y="90" text-anchor="middle" class="text-xs fill-gray-500">
                  {{ assetViewModeLabel }}
                </text>
                <text x="100" y="110" text-anchor="middle" class="text-sm font-bold fill-gray-900">
                  {{ formatCurrency(displayTotalAssets) }}
                </text>
              </svg>
            </div>
            <!-- 列表 -->
            <div class="space-y-3">
              <div
                v-for="(exchange, index) in filteredExchanges"
                :key="exchange.id"
                class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <!-- 使用真实的交易所 Logo -->
                    <img
                      :src="getExchangeLogo(exchange.exchange)"
                      :alt="getExchangeName(exchange.exchange)"
                      class="w-8 h-8 rounded-lg object-contain"
                      @error="handleImageError"
                    />
                    <!-- 颜色指示器 -->
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: exchangeColors[index % exchangeColors.length] }"
                    ></div>
                    <div>
                      <div class="font-medium text-gray-900">{{ exchange.name }}</div>
                      <div class="text-xs text-gray-500">{{ getExchangeName(exchange.exchange) }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-gray-900">{{ formatCurrency(getExchangeDisplayBalance(exchange)) }}</div>
                    <div class="text-xs text-gray-500">{{ getExchangePercentage(exchange) }}%</div>
                  </div>
                </div>
                <!-- 余额明细 - 始终显示以保持高度一致 -->
                <div class="flex items-center gap-4 text-xs text-gray-600 ml-11 min-h-[20px]">
                  <!-- 全部模式：显示现货和合约 -->
                  <template v-if="assetViewMode === 'all'">
                    <div class="flex items-center gap-1">
                      <span class="text-gray-500">现货:</span>
                      <span class="font-medium">{{ formatCurrency(getExchangeSpotBalance(exchange)) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-gray-500">合约:</span>
                      <span class="font-medium">{{ formatCurrency(getExchangeFutureBalance(exchange)) }}</span>
                    </div>
                  </template>
                  <!-- 现货模式：只显示现货 -->
                  <template v-else-if="assetViewMode === 'spot'">
                    <div class="flex items-center gap-1">
                      <span class="text-gray-500">现货:</span>
                      <span class="font-medium">{{ formatCurrency(getExchangeSpotBalance(exchange)) }}</span>
                    </div>
                  </template>
                  <!-- 合约模式：只显示合约 -->
                  <template v-else-if="assetViewMode === 'future'">
                    <div class="flex items-center gap-1">
                      <span class="text-gray-500">合约:</span>
                      <span class="font-medium">{{ formatCurrency(getExchangeFutureBalance(exchange)) }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 交易统计 -->
        <div v-if="exchanges.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">交易统计（最近30天）</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div class="text-sm text-gray-500 mb-1">总交易次数</div>
              <div class="text-2xl font-bold text-gray-900">{{ tradeStatistics.total_trades || 0 }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">胜率</div>
              <div class="text-2xl font-bold text-green-600">{{ tradeStatistics.win_rate || 0 }}%</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">总盈亏</div>
              <div :class="['text-2xl font-bold', tradeStatistics.total_profit >= 0 ? 'text-green-600' : 'text-red-600']">
                {{ tradeStatistics.total_profit >= 0 ? '+' : '' }}{{ formatCurrency(tradeStatistics.total_profit || 0) }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">平均收益</div>
              <div :class="['text-2xl font-bold', tradeStatistics.avg_profit >= 0 ? 'text-green-600' : 'text-red-600']">
                {{ tradeStatistics.avg_profit >= 0 ? '+' : '' }}{{ formatCurrency(tradeStatistics.avg_profit || 0) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态提示 -->
        <div v-if="exchanges.length === 0 && !isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">还没有绑定交易所</h3>
          <p class="text-gray-500 mb-6">请先绑定交易所账户，开始您的交易之旅</p>
          <router-link
            to="/exchange"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            绑定交易所
          </router-link>
        </div>
      </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import { exchangeAPI, botAPI } from '../../utils/api'

// 状态
const exchanges = ref([])
const isLoading = ref(false)
const hideTestnetBalance = ref(false)
const assetViewMode = ref('all') // 'all', 'spot', 'future'
const tradeStatistics = ref({
  total_trades: 0,
  win_rate: 0,
  total_profit: 0,
  avg_profit: 0
})

// 交易所颜色配置
const exchangeColors = [
  '#3B82F6', // 蓝色
  '#10B981', // 绿色
  '#F59E0B', // 橙色
  '#8B5CF6', // 紫色
  '#EF4444', // 红色
  '#06B6D4', // 青色
  '#EC4899', // 粉色
  '#6366F1'  // 靛蓝色
]

// 切换模拟账户显示
const toggleTestnetBalance = () => {
  hideTestnetBalance.value = !hideTestnetBalance.value
  localStorage.setItem('dashboard_hide_testnet', hideTestnetBalance.value.toString())
}

// 加载设置
const loadSettings = () => {
  const saved = localStorage.getItem('dashboard_hide_testnet')
  if (saved !== null) {
    hideTestnetBalance.value = saved === 'true'
  }
}

// 过滤后的交易所列表（根据设置隐藏模拟账户）
const filteredExchanges = computed(() => {
  if (hideTestnetBalance.value) {
    return exchanges.value.filter(ex => !ex.is_testnet)
  }
  return exchanges.value
})

// 计算现货总余额（使用 USD 价值）
const spotTotalBalance = computed(() => {
  return filteredExchanges.value.reduce((sum, ex) => {
    const snapshot = ex.balance_snapshot
    if (!snapshot || !snapshot.spot) return sum

    // 计算现货账户所有币种的 USD 价值
    let spotTotal = 0
    Object.entries(snapshot.spot).forEach(([currency, balance]) => {
      if (typeof balance === 'object') {
        // 优先使用 usd_value（后端已计算好的 USD 价值）
        if (balance.usd_value !== undefined) {
          spotTotal += parseFloat(balance.usd_value || 0)
        } else if (currency === 'USDT' || currency === 'USD' || currency === 'USDC') {
          // 稳定币直接使用 total
          spotTotal += parseFloat(balance.total || 0)
        }
      }
    })

    return sum + spotTotal
  }, 0)
})

// 计算合约总余额（使用 USD 价值）
const futureTotalBalance = computed(() => {
  return filteredExchanges.value.reduce((sum, ex) => {
    const snapshot = ex.balance_snapshot
    if (!snapshot || !snapshot.future) return sum

    // 计算合约账户所有币种的 USD 价值
    let futureTotal = 0
    Object.entries(snapshot.future).forEach(([currency, balance]) => {
      if (typeof balance === 'object') {
        // 优先使用 usd_value（后端已计算好的 USD 价值）
        if (balance.usd_value !== undefined) {
          futureTotal += parseFloat(balance.usd_value || 0)
        } else if (currency === 'USDT' || currency === 'USD' || currency === 'USDC') {
          // 稳定币直接使用 total
          futureTotal += parseFloat(balance.total || 0)
        }
      }
    })

    return sum + futureTotal
  }, 0)
})

// 计算合约可用余额（使用 USD 价值）
const futureAvailableBalance = computed(() => {
  return filteredExchanges.value.reduce((sum, ex) => {
    const snapshot = ex.balance_snapshot
    if (!snapshot || !snapshot.future) return sum

    // 计算合约账户所有币种的可用余额 USD 价值
    let futureFree = 0
    Object.entries(snapshot.future).forEach(([currency, balance]) => {
      if (typeof balance === 'object') {
        const price = balance.usd_price || 1
        if (currency === 'USDT' || currency === 'USD' || currency === 'USDC') {
          futureFree += parseFloat(balance.free || 0)
        } else if (balance.free) {
          futureFree += parseFloat(balance.free || 0) * price
        }
      }
    })

    return sum + futureFree
  }, 0)
})

// 计算合约冻结余额（使用 USD 价值）
const futureFrozenBalance = computed(() => {
  return filteredExchanges.value.reduce((sum, ex) => {
    const snapshot = ex.balance_snapshot
    if (!snapshot || !snapshot.future) return sum

    // 计算合约账户所有币种的冻结余额 USD 价值
    let futureUsed = 0
    Object.entries(snapshot.future).forEach(([currency, balance]) => {
      if (typeof balance === 'object') {
        const price = balance.usd_price || 1
        if (currency === 'USDT' || currency === 'USD' || currency === 'USDC') {
          futureUsed += parseFloat(balance.used || 0)
        } else if (balance.used) {
          futureUsed += parseFloat(balance.used || 0) * price
        }
      }
    })

    return sum + futureUsed
  }, 0)
})

// 总资产（现货 + 合约）
const totalAssets = computed(() => {
  return spotTotalBalance.value + futureTotalBalance.value
})

// 根据视图模式显示的总资产
const displayTotalAssets = computed(() => {
  if (assetViewMode.value === 'spot') {
    return spotTotalBalance.value
  } else if (assetViewMode.value === 'future') {
    return futureTotalBalance.value
  }
  return totalAssets.value
})

// 视图模式标签
const assetViewModeLabel = computed(() => {
  if (assetViewMode.value === 'spot') return '现货总资产'
  if (assetViewMode.value === 'future') return '合约总资产'
  return '总资产'
})

// 计算饼图切片（使用过滤后的交易所列表和 USD 价值）
const pieSlices = computed(() => {
  const total = displayTotalAssets.value
  if (total === 0 || filteredExchanges.value.length === 0) return []

  const slices = []
  let currentAngle = -90 // 从顶部开始（-90度）

  filteredExchanges.value.forEach((exchange, index) => {
    // 根据视图模式获取该交易所的余额
    let exchangeBalance = 0
    if (assetViewMode.value === 'spot') {
      exchangeBalance = getExchangeSpotBalance(exchange)
    } else if (assetViewMode.value === 'future') {
      exchangeBalance = getExchangeFutureBalance(exchange)
    } else {
      exchangeBalance = getExchangeTotalBalance(exchange)
    }

    if (exchangeBalance === 0) return // 跳过余额为 0 的交易所

    const percentage = exchangeBalance / total
    const angle = percentage * 360
    const endAngle = currentAngle + angle

    // 计算路径
    const startX = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180)
    const startY = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180)
    const endX = 100 + 80 * Math.cos((endAngle * Math.PI) / 180)
    const endY = 100 + 80 * Math.sin((endAngle * Math.PI) / 180)

    const largeArcFlag = angle > 180 ? 1 : 0

    const path = [
      `M 100 100`,
      `L ${startX} ${startY}`,
      `A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `Z`
    ].join(' ')

    slices.push({
      path,
      color: exchangeColors[index % exchangeColors.length],
      percentage: (percentage * 100).toFixed(1)
    })

    currentAngle = endAngle
  })

  return slices
})

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

// 获取交易所 Logo
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

// 获取单个交易所的现货余额（USD 价值）
const getExchangeSpotBalance = (exchange) => {
  const snapshot = exchange.balance_snapshot
  if (!snapshot || !snapshot.spot) return 0

  let spotTotal = 0
  Object.entries(snapshot.spot).forEach(([currency, balance]) => {
    if (typeof balance === 'object') {
      // 优先使用 usd_value
      if (balance.usd_value !== undefined) {
        spotTotal += parseFloat(balance.usd_value || 0)
      } else if (currency === 'USDT' || currency === 'USD' || currency === 'USDC') {
        spotTotal += parseFloat(balance.total || 0)
      }
    }
  })
  return spotTotal
}

// 获取单个交易所的合约余额（USD 价值）
const getExchangeFutureBalance = (exchange) => {
  const snapshot = exchange.balance_snapshot
  if (!snapshot || !snapshot.future) return 0

  let futureTotal = 0
  Object.entries(snapshot.future).forEach(([currency, balance]) => {
    if (typeof balance === 'object') {
      // 优先使用 usd_value
      if (balance.usd_value !== undefined) {
        futureTotal += parseFloat(balance.usd_value || 0)
      } else if (currency === 'USDT' || currency === 'USD' || currency === 'USDC') {
        futureTotal += parseFloat(balance.total || 0)
      }
    }
  })
  return futureTotal
}

// 获取单个交易所的总余额（USD 价值）
const getExchangeTotalBalance = (exchange) => {
  return getExchangeSpotBalance(exchange) + getExchangeFutureBalance(exchange)
}

// 根据视图模式获取交易所显示的余额
const getExchangeDisplayBalance = (exchange) => {
  if (assetViewMode.value === 'spot') {
    return getExchangeSpotBalance(exchange)
  } else if (assetViewMode.value === 'future') {
    return getExchangeFutureBalance(exchange)
  }
  return getExchangeTotalBalance(exchange)
}

// 获取单个交易所的资产占比
const getExchangePercentage = (exchange) => {
  const total = displayTotalAssets.value
  if (total === 0) return 0
  const exchangeBalance = getExchangeDisplayBalance(exchange)
  return ((exchangeBalance / total) * 100).toFixed(1)
}

// 处理图片加载错误
const handleImageError = (e) => {
  console.error('图片加载失败:', e.target.src)
  e.target.style.display = 'none'
}

// 加载交易所数据
const loadExchanges = async () => {
  try {
    isLoading.value = true
    const response = await exchangeAPI.getExchangeList()
    console.log('API 响应:', response)

    const exchangeList = response.data || []

    // 计算每个交易所的总余额和可用余额
    exchangeList.forEach(ex => {
      if (ex.balance_snapshot && typeof ex.balance_snapshot === 'object') {
        // 新格式：包含 spot 和 future
        if (ex.balance_snapshot.total_usd !== undefined) {
          ex.total_balance = ex.balance_snapshot.total_usd
          ex.available_balance = ex.total_balance * 0.8
        }
        // 旧格式：直接是币种余额对象
        else {
          ex.total_balance = Object.values(ex.balance_snapshot).reduce((sum, val) => {
            if (typeof val === 'object' && val.total) {
              return sum + parseFloat(val.total || 0)
            }
            return sum + parseFloat(val || 0)
          }, 0)
          ex.available_balance = ex.total_balance * 0.8
        }
      } else {
        ex.total_balance = 0
        ex.available_balance = 0
      }

      // 设置权限标志
      ex.has_read_permission = ex.permissions?.read || false
      ex.has_trade_permission = ex.permissions?.trade || false
    })

    exchanges.value = exchangeList
  } catch (error) {
    console.error('加载交易所失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载交易统计数据（最近30天）
const loadTradeStatistics = async () => {
  try {
    // 使用性能分析接口获取最近30天的数据
    const response = await botAPI.getPerformanceAnalysis({ timeRange: '30d' })

    if (response.success && response.data && response.data.statistics) {
      const stats = response.data.statistics
      tradeStatistics.value = {
        total_trades: stats.total_trades || 0,
        win_rate: parseFloat(stats.win_rate || 0).toFixed(1),
        total_profit: parseFloat(stats.total_profit || 0),
        avg_profit: parseFloat(stats.avg_profit || 0)
      }
    }
  } catch (error) {
    console.error('加载交易统计失败:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadSettings()
  loadExchanges()
  loadTradeStatistics()
})
</script>
