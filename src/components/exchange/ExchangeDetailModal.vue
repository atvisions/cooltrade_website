<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>

      <!-- 居中对齐 -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <!-- 弹窗内容 -->
      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- 头部 -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-3xl">{{ getExchangeIcon(exchange.exchange) }}</div>
              <div>
                <h3 class="text-xl font-bold text-white">{{ exchange.name }}</h3>
                <p class="text-sm text-blue-100">{{ getExchangeName(exchange.exchange) }}</p>
              </div>
            </div>
            <button @click="$emit('close')" class="text-white hover:text-gray-200 transition-colors">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- 内容 -->
        <div class="px-6 py-6">
          <!-- 账户概览 -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">账户概览</h4>
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm text-gray-500 mb-1">总资产</div>
                <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(exchange.total_balance) }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm text-gray-500 mb-1">可用余额</div>
                <div class="text-2xl font-bold text-green-600">{{ formatCurrency(exchange.available_balance) }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm text-gray-500 mb-1">冻结保证金</div>
                <div class="text-2xl font-bold text-orange-600">
                  {{ formatCurrency(exchange.total_balance - exchange.available_balance) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h4>
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">交易所</span>
                <span class="text-sm font-medium text-gray-900">{{ getExchangeName(exchange.exchange) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">备注名称</span>
                <span class="text-sm font-medium text-gray-900">{{ exchange.name }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">连接状态</span>
                <span :class="[
                  'text-sm font-medium',
                  exchange.status === 'connected' ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ exchange.status === 'connected' ? '已连接' : '未连接' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">环境</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ exchange.is_testnet ? '测试网' : '主网' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">权限</span>
                <div class="flex items-center space-x-2">
                  <span v-if="exchange.has_read_permission" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    只读
                  </span>
                  <span v-if="exchange.has_trade_permission" class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    交易
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">最后同步</span>
                <span class="text-sm font-medium text-gray-900">{{ exchange.last_sync_at }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">创建时间</span>
                <span class="text-sm font-medium text-gray-900">{{ formatDate(exchange.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- 持仓信息 -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">当前持仓</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-center py-8 text-gray-500">
                暂无持仓数据
              </div>
            </div>
          </div>

          <!-- 最近交易 -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4">最近交易</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-center py-8 text-gray-500">
                暂无交易记录
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  exchange: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['close'])

// 格式化货币
const formatCurrency = (value) => {
  return '$' + parseFloat(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
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
</script>

