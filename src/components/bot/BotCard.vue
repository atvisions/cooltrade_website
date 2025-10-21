<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
    <!-- 头部：机器人名称和状态 -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-1">
          <h3 class="text-lg font-semibold text-gray-900">{{ bot.name }}</h3>
          <span
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              statusColors[bot.status]
            ]"
          >
            {{ bot.status_display }}
          </span>
        </div>
        <p class="text-sm text-gray-600">{{ bot.bot_type_display }}</p>
      </div>

      <!-- 操作菜单 -->
      <div class="relative">
        <button
          @click="showMenu = !showMenu"
          class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <EllipsisVerticalIcon class="h-5 w-5 text-gray-600" />
        </button>

        <!-- 下拉菜单 -->
        <div
          v-if="showMenu"
          v-click-outside="() => showMenu = false"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
        >
          <button
            @click="$emit('view', bot); showMenu = false"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <EyeIcon class="h-4 w-4 mr-2" />
            查看详情
          </button>
          <button
            @click="$emit('edit', bot); showMenu = false"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            :disabled="bot.status === 'running'"
          >
            <PencilIcon class="h-4 w-4 mr-2" />
            编辑
          </button>
          <button
            @click="$emit('delete', bot); showMenu = false"
            class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
            :disabled="bot.status === 'running'"
          >
            <TrashIcon class="h-4 w-4 mr-2" />
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 代币信息 -->
    <div class="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
      <img
        v-if="bot.token_logo"
        :src="bot.token_logo"
        :alt="bot.token_symbol"
        class="h-8 w-8 rounded-full"
      />
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-900">{{ bot.token_symbol }}</p>
        <p class="text-xs text-gray-600">{{ bot.exchange_display }}</p>
      </div>
      <div class="text-right">
        <p class="text-xs text-gray-600">杠杆</p>
        <p class="text-sm font-medium text-gray-900">{{ bot.leverage }}x</p>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p class="text-xs text-gray-600 mb-1">总盈亏</p>
        <p
          class="text-lg font-semibold"
          :class="bot.total_profit >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ formatCurrency(bot.total_profit) }}
        </p>
        <p
          class="text-xs"
          :class="bot.total_profit_percentage >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ bot.total_profit_percentage >= 0 ? '+' : '' }}{{ bot.total_profit_percentage }}%
        </p>
      </div>

      <div>
        <p class="text-xs text-gray-600 mb-1">胜率</p>
        <p class="text-lg font-semibold text-gray-900">{{ bot.win_rate.toFixed(2) }}%</p>
        <p class="text-xs text-gray-600">{{ bot.winning_trades }}/{{ bot.total_trades }} 胜</p>
      </div>
    </div>

    <!-- 风控信息 -->
    <div class="flex items-center justify-between text-xs text-gray-600 mb-4 p-2 bg-gray-50 rounded">
      <span>止损: {{ bot.stop_loss_percentage }}%</span>
      <span>止盈: {{ bot.take_profit_percentage }}%</span>
      <span>仓位: ${{ bot.max_position_size }}</span>
    </div>

    <!-- 操作按钮 -->
    <div class="flex space-x-2">
      <button
        v-if="bot.status === 'draft' || bot.status === 'stopped'"
        @click="$emit('start', bot)"
        class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
      >
        <PlayIcon class="h-4 w-4 mr-1" />
        启动
      </button>

      <button
        v-if="bot.status === 'running'"
        @click="$emit('pause', bot)"
        class="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
      >
        <PauseIcon class="h-4 w-4 mr-1" />
        暂停
      </button>

      <button
        v-if="bot.status === 'paused'"
        @click="$emit('start', bot)"
        class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
      >
        <PlayIcon class="h-4 w-4 mr-1" />
        继续
      </button>

      <button
        v-if="bot.status === 'running' || bot.status === 'paused'"
        @click="$emit('stop', bot)"
        class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
      >
        <StopIcon class="h-4 w-4 mr-1" />
        停止
      </button>
    </div>

    <!-- 最后交易时间 -->
    <div v-if="bot.last_trade_at" class="mt-3 text-xs text-gray-500 text-center">
      最后交易: {{ formatTime(bot.last_trade_at) }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  bot: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['start', 'stop', 'pause', 'edit', 'delete', 'view'])

// 状态
const showMenu = ref(false)

// 状态颜色
const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  running: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  stopped: 'bg-red-100 text-red-700',
  error: 'bg-red-100 text-red-700',
}

// 格式化货币
const formatCurrency = (value) => {
  const numValue = parseFloat(value || 0)
  if (numValue > 0 && numValue < 0.01) {
    return '$' + numValue.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })
  }
  return '$' + numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 格式化时间
const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

