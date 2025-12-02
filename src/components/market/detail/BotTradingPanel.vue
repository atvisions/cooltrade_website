<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
    <!-- 标题 + 类型切换 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
        </svg>
        我的机器人
      </h3>
      <!-- 类型切换 -->
      <div class="flex bg-gray-100 rounded-lg p-0.5">
        <button
          @click="botTypeFilter = 'signal'"
          :class="[
            'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
            botTypeFilter === 'signal' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          信号
        </button>
        <button
          @click="botTypeFilter = 'trend'"
          :class="[
            'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
            botTypeFilter === 'trend' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          交易
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 2" :key="i" class="animate-pulse bg-gray-100 rounded-xl h-24"></div>
    </div>

    <!-- 机器人列表 -->
    <div v-else-if="filteredBots.length" class="space-y-3">
      <div
        v-for="bot in filteredBots"
        :key="bot.id"
        class="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors cursor-pointer"
        @click="goToBotDetail(bot)"
      >
        <!-- 头部：名称 + 状态 -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <!-- 机器人类型图标 -->
              <div :class="[
                'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0',
                bot.bot_type === 'signal' ? 'bg-purple-100' : 'bg-blue-100'
              ]">
                <svg v-if="bot.bot_type === 'signal'" class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <svg v-else class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 class="text-sm font-medium text-gray-900 truncate">{{ bot.name }}</h4>
            </div>
            <p class="text-xs text-gray-500 mt-0.5 ml-8">{{ getBotTypeLabel(bot.bot_type) }} · {{ bot.timeframe || '1h' }}</p>
          </div>
          <span :class="[
            'px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0',
            bot.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
          ]">{{ bot.is_active ? '运行中' : '已停止' }}</span>
        </div>

        <!-- 统计数据 -->
        <div class="grid grid-cols-3 gap-2 text-center mb-2">
          <div>
            <p class="text-xs text-gray-500">{{ bot.bot_type === 'signal' ? '信号数' : '交易数' }}</p>
            <p class="text-sm font-semibold text-gray-900">{{ bot.bot_type === 'signal' ? (bot.total_signals || 0) : (bot.total_trades || 0) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">胜率</p>
            <p class="text-sm font-semibold" :class="(bot.win_rate || 0) >= 50 ? 'text-green-600' : 'text-gray-900'">{{ bot.win_rate || 0 }}%</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">收益</p>
            <p class="text-sm font-semibold" :class="(bot.total_profit_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ (bot.total_profit_percentage || 0) >= 0 ? '+' : '' }}{{ formatNumber(bot.total_profit_percentage || 0) }}%
            </p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button
            v-if="bot.is_active"
            @click.stop="handleStopBot(bot)"
            :disabled="bot.processing"
            class="flex-1 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {{ bot.processing ? '处理中...' : '停止' }}
          </button>
          <button
            v-else
            @click.stop="handleStartBot(bot)"
            :disabled="bot.processing"
            class="flex-1 py-1.5 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            {{ bot.processing ? '处理中...' : '启动' }}
          </button>
          <button
            @click.stop="goToBotDetail(bot)"
            class="flex-1 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            设置
          </button>
        </div>
      </div>
    </div>

    <!-- 无数据 -->
    <div v-else class="text-center py-6">
      <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
        <svg v-if="botTypeFilter === 'signal'" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <p class="text-sm text-gray-500">暂无 {{ token.symbol }} {{ botTypeFilter === 'signal' ? '信号' : '交易' }}机器人</p>
    </div>

    <!-- 底部：创建按钮 -->
    <div class="mt-4 pt-4 border-t border-gray-100">
      <button
        @click="goToCreateBot"
        class="w-full py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        创建{{ botTypeFilter === 'signal' ? '信号' : '交易' }}机器人
      </button>
      <div class="text-center mt-2">
        <router-link
          :to="botTypeFilter === 'signal' ? '/signal-bots' : '/bots?type=trend_following'"
          class="text-xs text-gray-500 hover:text-blue-600"
        >
          查看全部{{ botTypeFilter === 'signal' ? '信号' : '交易' }}机器人 →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { apiRequest, API_ENDPOINTS } from '../../../utils/api.js'
import { showSuccess, showError } from '../../../utils/notification.js'

const props = defineProps({
  token: { type: Object, default: () => ({}) },
  exchanges: { type: Array, default: () => [] }
})

const router = useRouter()
const loading = ref(false)
const myBots = ref([])
const botTypeFilter = ref('signal') // 'signal' | 'trend'

// 根据类型过滤机器人
const filteredBots = computed(() => {
  return myBots.value.filter(bot => bot.bot_type === botTypeFilter.value)
})

// 加载用户的机器人
const loadMyBots = async () => {
  if (!props.token?.symbol) return

  loading.value = true
  try {
    const response = await apiRequest(`${API_ENDPOINTS.BOT_LIST}?token=${props.token.symbol}`)
    myBots.value = (response.results || response || []).map(bot => ({
      ...bot,
      processing: false
    }))
  } catch (err) {
    console.error('加载机器人列表失败:', err)
    myBots.value = []
  } finally {
    loading.value = false
  }
}

// 格式化数字
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return parseFloat(num).toFixed(2)
}

// 获取机器人类型标签
const getBotTypeLabel = (type) => {
  const labels = {
    'signal': '信号机器人',
    'trend': '趋势跟踪',
    'grid': '网格交易',
    'dca': '定投策略'
  }
  return labels[type] || '交易机器人'
}

// 启动机器人
const handleStartBot = async (bot) => {
  bot.processing = true
  try {
    await apiRequest(API_ENDPOINTS.BOT_START(bot.id), { method: 'POST' })
    bot.is_active = true
    showSuccess('机器人已启动')
  } catch (err) {
    console.error('启动机器人失败:', err)
    showError(err.message || '启动失败')
  } finally {
    bot.processing = false
  }
}

// 停止机器人
const handleStopBot = async (bot) => {
  bot.processing = true
  try {
    await apiRequest(API_ENDPOINTS.BOT_STOP(bot.id), { method: 'POST' })
    bot.is_active = false
    showSuccess('机器人已停止')
  } catch (err) {
    console.error('停止机器人失败:', err)
    showError(err.message || '停止失败')
  } finally {
    bot.processing = false
  }
}

// 跳转到机器人详情/设置页（根据类型跳转不同编辑页）
const goToBotDetail = (bot) => {
  if (bot.bot_type === 'signal') {
    router.push(`/bots/edit-signal/${bot.id}`)
  } else {
    router.push(`/bots/edit/${bot.id}`)
  }
}

// 跳转到创建机器人页面（根据类型跳转不同页面）
const goToCreateBot = () => {
  const tokenSymbol = props.token?.symbol
  if (botTypeFilter.value === 'signal') {
    // 信号机器人创建页
    router.push(`/bots/create-signal?token=${tokenSymbol}`)
  } else {
    // 交易机器人创建页
    router.push(`/bots/create?token=${tokenSymbol}`)
  }
}

// 监听 token 变化
watch(() => props.token?.symbol, (newSymbol) => {
  if (newSymbol) {
    loadMyBots()
  }
}, { immediate: false })

// 组件挂载时加载
onMounted(() => {
  if (props.token?.symbol) {
    loadMyBots()
  }
})
</script>

