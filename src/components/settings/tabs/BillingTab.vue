<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">账单管理</h2>
      <p class="text-gray-600 mt-1">管理您的订阅计划和付费记录</p>
    </div>

      <!-- 当前订阅计划 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">当前订阅</h3>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-white font-bold', currentPlan.color]">
              {{ currentPlan.icon }}
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-900">{{ currentPlan.name }}</h4>
              <p class="text-gray-600">{{ currentPlan.description }}</p>
              <p class="text-sm text-gray-500">
                {{ currentPlan.billingCycle === 'monthly' ? '月付' : '年付' }} · 
                下次续费: {{ currentPlan.nextBilling }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-900">{{ currentPlan.price }}</div>
            <div class="text-sm text-gray-500">{{ currentPlan.billingCycle === 'monthly' ? '每月' : '每年' }}</div>
          </div>
        </div>
        
        <div class="mt-6 flex space-x-3">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            升级计划
          </button>
          <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            管理订阅
          </button>
        </div>
      </div>

      <!-- 使用统计 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">本月使用情况</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ usageStats.apiCalls }}</div>
            <div class="text-sm text-gray-500 mt-1">API 调用次数</div>
            <div class="text-xs text-gray-400">限额: {{ usageStats.apiLimit }}</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{{ usageStats.strategies }}</div>
            <div class="text-sm text-gray-500 mt-1">活跃策略数</div>
            <div class="text-xs text-gray-400">限额: {{ usageStats.strategyLimit }}</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600">{{ usageStats.storage }}</div>
            <div class="text-sm text-gray-500 mt-1">存储使用 (GB)</div>
            <div class="text-xs text-gray-400">限额: {{ usageStats.storageLimit }} GB</div>
          </div>
        </div>
      </div>

      <!-- 付费记录 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">付费记录</h3>
          <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            下载发票
          </button>
        </div>

        <div class="overflow-hidden">
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
              <tr v-for="record in billingHistory" :key="record.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ record.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    record.status === 'paid' ? 'bg-green-100 text-green-800' : 
                    record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  ]">
                    {{ record.status === 'paid' ? '已支付' : 
                       record.status === 'pending' ? '待支付' : '已取消' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button class="text-blue-600 hover:text-blue-700">
                    查看详情
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            显示 1-{{ billingHistory.length }} 条，共 {{ billingHistory.length }} 条记录
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
</template>

<script setup>
import { inject } from 'vue'

// 注入父组件的数据
const currentPlan = inject('currentPlan')
const usageStats = inject('usageStats')
const billingHistory = inject('billingHistory')
</script>
