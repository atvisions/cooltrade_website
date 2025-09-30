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

// 仪表板数据
const totalAssets = ref(125000)
const todayProfit = ref(2850)
const activeStrategies = ref(8)
</script>
