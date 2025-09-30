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
                <p class="text-2xl font-bold text-gray-900">${{ totalAssets.toLocaleString() }}</p>
                <p class="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpIcon class="w-4 h-4 mr-1" />
                  +25.0%
                </p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <!-- 今日盈亏 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">今日盈亏</p>
                <p class="text-2xl font-bold text-green-600">+${{ todayProfit.toLocaleString() }}</p>
                <p class="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpIcon class="w-4 h-4 mr-1" />
                  +2.3%
                </p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ArrowTrendingUpIcon class="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <!-- 活跃策略 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">活跃策略</p>
                <p class="text-2xl font-bold text-gray-900">{{ activeStrategies }}</p>
                <p class="text-sm text-blue-600 flex items-center mt-1">
                  <PlayIcon class="w-4 h-4 mr-1" />
                  运行中
                </p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <CpuChipIcon class="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <!-- 胜率 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">胜率</p>
                <p class="text-2xl font-bold text-gray-900">73.5%</p>
                <p class="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpIcon class="w-4 h-4 mr-1" />
                  +1.2%
                </p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ChartBarIcon class="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- 资产净值走势图表 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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

        <!-- 主要内容区域 - 3列布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 当前仓位 -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">当前仓位</h3>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">实时</span>
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <div class="p-6 space-y-4">
              <PositionCard
                logo="/chain_logos/op.png"
                pair="OP / USDT"
                direction="做多"
                :leverage="10"
                exchange="OKX"
                riskLevel="中"
                :entryPrice="1.26"
                :pnl="15.20"
                :pnlPercentage="8.15"
                :margin="125.50"
                creationDate="2025/09/28 10:58:26"
              />
              <PositionCard
                logo="/chain_logos/bnb.png"
                pair="BNB / USDT"
                direction="做空"
                :leverage="5"
                exchange="Binance"
                riskLevel="低"
                :entryPrice="635.80"
                :pnl="-32.40"
                :pnlPercentage="-2.15"
                :margin="850.00"
                creationDate="2025/09/28 09:32:15"
              />
              <PositionCard
                logo="/chain_logos/eth.png"
                pair="ETH / USDT"
                direction="做多"
                :leverage="3"
                exchange="OKX"
                riskLevel="低"
                :entryPrice="2680.50"
                :pnl="89.60"
                :pnlPercentage="3.34"
                :margin="2400.00"
                creationDate="2025/09/27 16:45:30"
              />
            </div>
          </div>

          <!-- 我的策略表现 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <h4 class="text-lg font-semibold text-gray-900">我的策略表现</h4>
              <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">本周</div>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <img src="/chain_logos/eth.png" alt="ETH" class="w-6 h-6 rounded-full" />
                  <span class="text-sm font-medium text-gray-700">ETH网格策略</span>
                </div>
                <div class="text-right">
                  <div class="text-gray-900 font-semibold">+$1,250</div>
                  <div class="text-green-600 text-xs">+8.5%</div>
                </div>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <img src="/chain_logos/bnb.png" alt="BNB" class="w-6 h-6 rounded-full" />
                  <span class="text-sm font-medium text-gray-700">BNB DCA策略</span>
                </div>
                <div class="text-right">
                  <div class="text-gray-900 font-semibold">+$680</div>
                  <div class="text-green-600 text-xs">+4.2%</div>
                </div>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <img src="/chain_logos/op.png" alt="OP" class="w-6 h-6 rounded-full" />
                  <span class="text-sm font-medium text-gray-700">OP趋势跟踪</span>
                </div>
                <div class="text-right">
                  <div class="text-gray-900 font-semibold">-$120</div>
                  <div class="text-red-600 text-xs">-1.8%</div>
                </div>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <img src="/chain_logos/avax.png" alt="AVAX" class="w-6 h-6 rounded-full" />
                  <span class="text-sm font-medium text-gray-700">AVAX套利策略</span>
                </div>
                <div class="text-right">
                  <div class="text-gray-900 font-semibold">+$340</div>
                  <div class="text-green-600 text-xs">+2.8%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最近交易记录 -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <h4 class="text-lg font-semibold text-gray-900">最近交易</h4>
              <button class="text-blue-600 text-sm hover:text-blue-700 font-medium">查看全部</button>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 border-b border-gray-100">
                <div class="flex items-center space-x-3">
                  <img src="/chain_logos/eth.png" alt="ETH" class="w-8 h-8 rounded-full" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">ETH/USDT</div>
                    <div class="text-xs text-gray-500">买入 • 15:32</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-green-600 text-sm font-medium">+$285</div>
                  <div class="text-xs text-gray-500">+2.1%</div>
                </div>
              </div>
              <div class="flex items-center justify-between py-3 border-b border-gray-100">
                <div class="flex items-center space-x-3">
                  <img src="/chain_logos/bnb.png" alt="BNB" class="w-8 h-8 rounded-full" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">BNB/USDT</div>
                    <div class="text-xs text-gray-500">卖出 • 14:18</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-red-600 text-sm font-medium">-$32</div>
                  <div class="text-xs text-gray-500">-0.8%</div>
                </div>
              </div>
              <div class="flex items-center justify-between py-3">
                <div class="flex items-center space-x-3">
                  <img src="/chain_logos/avax.png" alt="AVAX" class="w-8 h-8 rounded-full" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">AVAX/USDT</div>
                    <div class="text-xs text-gray-500">买入 • 13:45</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-green-600 text-sm font-medium">+$156</div>
                  <div class="text-xs text-gray-500">+3.2%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
import PositionCard from '../trading/PositionCard.vue'

// 仪表板数据
const totalAssets = ref(125000)
const todayProfit = ref(2850)
const activeStrategies = ref(8)
</script>
