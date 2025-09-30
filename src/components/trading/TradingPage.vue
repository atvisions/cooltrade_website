<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />

    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="trading" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面标题 -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">交易中心</h1>
            <p class="text-gray-600 mt-2">管理您的策略、持仓和交易</p>
          </div>

          <!-- Tab 导航 -->
          <div class="mb-6">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <component :is="tab.icon" class="w-4 h-4" />
                  <span>{{ tab.name }}</span>
                  <span v-if="tab.badge" class="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {{ tab.badge }}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Tab 内容 -->
          <div class="mt-6">
            <!-- 我的策略 -->
            <MyStrategiesTab v-if="activeTab === 'strategies'" />

            <!-- 持仓管理 -->
            <PositionsTab v-if="activeTab === 'positions'" />

            <!-- 资金管理 -->
            <WalletTab v-if="activeTab === 'wallet'" />

            <!-- 交易历史 -->
            <TradeHistoryTab v-if="activeTab === 'history'" />

            <!-- 委托订单 -->
            <PendingOrdersTab v-if="activeTab === 'orders'" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ChartBarIcon,
  ChartPieIcon,
  ClockIcon,
  DocumentTextIcon,
  WalletIcon
} from '@heroicons/vue/24/outline'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import MyStrategiesTab from './tabs/MyStrategiesTab.vue'
import PositionsTab from './tabs/PositionsTab.vue'
import TradeHistoryTab from './tabs/TradeHistoryTab.vue'
import PendingOrdersTab from './tabs/PendingOrdersTab.vue'
import WalletTab from './tabs/WalletTab.vue'

// 当前激活的 tab
const activeTab = ref('strategies')

// Tab 配置
const tabs = ref([
  {
    id: 'strategies',
    name: '我的策略',
    icon: ChartBarIcon,
    badge: null
  },
  {
    id: 'positions',
    name: '持仓管理',
    icon: ChartPieIcon,
    badge: '2'
  },
  {
    id: 'wallet',
    name: '资金管理',
    icon: WalletIcon,
    badge: null
  },
  {
    id: 'history',
    name: '交易历史',
    icon: ClockIcon,
    badge: null
  },
  {
    id: 'orders',
    name: '委托订单',
    icon: DocumentTextIcon,
    badge: '3'
  }
])
</script>

