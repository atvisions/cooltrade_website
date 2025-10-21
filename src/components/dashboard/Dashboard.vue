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
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">仪表板</h1>
          <p class="text-gray-600 mt-2">欢迎回来，查看您的交易概况</p>
        </div>

      <!-- 仪表板内容 -->
      <div class="space-y-8">
        <!-- 顶部统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- 总资产 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">总资产</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalAssets) }}</p>
                <p class="text-xs text-gray-500 mt-1">≈ {{ totalAssets.toLocaleString() }} USDT</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <!-- 可用余额 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">可用余额</p>
                <p class="text-2xl font-bold text-green-600">{{ formatCurrency(availableBalance) }}</p>
                <p class="text-xs text-gray-500 mt-1">可用于开仓</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon class="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <!-- 今日盈亏 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">今日盈亏</p>
                <p :class="['text-2xl font-bold', todayProfit >= 0 ? 'text-green-600' : 'text-red-600']">
                  {{ todayProfit >= 0 ? '+' : '' }}{{ formatCurrency(todayProfit) }}
                </p>
                <p :class="['text-xs mt-1', todayProfit >= 0 ? 'text-green-600' : 'text-red-600']">
                  {{ todayProfit >= 0 ? '+' : '' }}{{ todayProfitPercent.toFixed(2) }}%
                </p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ArrowTrendingUpIcon class="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <!-- 已绑定账户 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">已绑定账户</p>
                <p class="text-2xl font-bold text-gray-900">{{ exchanges.length }}</p>
                <p class="text-xs text-gray-500 mt-1">个交易所</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ChartBarIcon class="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- 资产分布 -->
        <div v-if="exchanges.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">资产分布</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 饼图占位 -->
            <div class="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
              <p class="text-gray-500">资产分布图表</p>
            </div>
            <!-- 列表 -->
            <div class="space-y-3">
              <div
                v-for="exchange in exchanges"
                :key="exchange.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <div class="text-2xl">{{ getExchangeIcon(exchange.exchange) }}</div>
                  <div>
                    <div class="font-medium text-gray-900">{{ exchange.name }}</div>
                    <div class="text-sm text-gray-500">{{ getExchangeName(exchange.exchange) }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-gray-900">{{ formatCurrency(exchange.total_balance) }}</div>
                  <div class="text-sm text-gray-500">{{ getAssetPercentage(exchange.total_balance) }}%</div>
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
              <div class="text-2xl font-bold text-gray-900">156</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">胜率</div>
              <div class="text-2xl font-bold text-green-600">68%</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">总盈亏</div>
              <div class="text-2xl font-bold text-green-600">+$1,234.56</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">手续费</div>
              <div class="text-2xl font-bold text-gray-900">$89.50</div>
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

        <!-- 资产净值走势图表 -->
        <div v-if="exchanges.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">资产净值走势</h3>
            <div class="flex items-center space-x-4">
              <select class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>最近7天</option>
                <option>最近30天</option>
                <option>最近90天</option>
              </select>
            </div>
          </div>
          <DashboardChart />
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
  ArrowUpIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  PlayIcon,
  CpuChipIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import DashboardChart from './DashboardChart.vue'
import { exchangeAPI } from '../../utils/api'

// 状态
const exchanges = ref([])
const isLoading = ref(false)

// 计算总资产
const totalAssets = computed(() => {
  return exchanges.value.reduce((sum, ex) => sum + parseFloat(ex.total_balance || 0), 0)
})

// 计算可用余额
const availableBalance = computed(() => {
  return exchanges.value.reduce((sum, ex) => sum + parseFloat(ex.available_balance || 0), 0)
})

// 今日盈亏（TODO: 需要从交易所获取历史数据计算）
const todayProfit = computed(() => {
  // 暂时返回0，等待实现历史数据接口
  return 0
})

const todayProfitPercent = computed(() => {
  return totalAssets.value > 0 ? (todayProfit.value / totalAssets.value) * 100 : 0
})

// 活跃策略数量（TODO: 从策略API获取）
const activeStrategies = ref(0)

// 胜率（TODO: 从交易历史API获取）
const winRate = ref(0)

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

// 获取交易所图标
const getExchangeIcon = (exchange) => {
  const icons = {
    binance: '🟡',
    okx: '🔵',
    bybit: '🟠',
    gate: '🟢',
    bitget: '🔴'
  }
  return icons[exchange] || '🏦'
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

// 获取资产占比
const getAssetPercentage = (balance) => {
  if (totalAssets.value === 0) return 0
  return ((parseFloat(balance) / totalAssets.value) * 100).toFixed(1)
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

// 组件挂载时加载数据
onMounted(() => {
  loadExchanges()
})
</script>
