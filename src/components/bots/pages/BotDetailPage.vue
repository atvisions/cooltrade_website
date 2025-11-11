<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="bots" />
        </div>
        <main class="flex-1 min-w-0">
          <!-- 返回按钮 -->
          <Button
            variant="secondary"
            @click="handleBack"
            class="mb-8 flex items-center gap-2 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeftIcon class="h-5 w-5" />
            返回列表
          </Button>

          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-slate-500">加载中...</p>
          </div>

          <!-- 机器人详情 -->
          <div v-else-if="bot" class="space-y-8">
            <!-- 基本信息卡片 - 高级设计 -->
            <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div class="flex items-start justify-between mb-8">
                <div class="flex-1">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <CpuChipIcon class="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 class="text-4xl font-bold text-slate-900">{{ bot.name }}</h1>
                      <p class="text-slate-500 mt-2">{{ bot.description }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex gap-3">
                  <Button
                    v-if="bot.status !== 'running'"
                    variant="primary"
                    @click="handleStartBot"
                    :loading="actionLoading"
                    class="shadow-lg hover:shadow-xl transition-shadow"
                  >
                    启动
                  </Button>
                  <Button
                    v-else
                    variant="danger"
                    @click="handleStopBot"
                    :loading="actionLoading"
                    class="shadow-lg hover:shadow-xl transition-shadow"
                  >
                    停止
                  </Button>
                  <Button
                    variant="secondary"
                    @click="handleEditBot"
                    class="shadow-lg hover:shadow-xl transition-shadow"
                  >
                    编辑
                  </Button>
                </div>
              </div>

              <!-- 基础信息网格 -->
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                  <p class="text-xs font-medium text-slate-600 uppercase tracking-wider">类型</p>
                  <p class="text-lg font-semibold text-slate-900 mt-2">
                    {{ bot.bot_type === 'signal' ? '信号机器人' : '趋势跟踪' }}
                  </p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-green-300 transition-colors">
                  <p class="text-xs font-medium text-slate-600 uppercase tracking-wider">状态</p>
                  <div class="mt-2">
                    <span :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      bot.status === 'running'
                        ? 'bg-green-100 text-green-700'
                        : bot.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    ]">
                      {{ getStatusLabel(bot.status) }}
                    </span>
                  </div>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                  <p class="text-xs font-medium text-slate-600 uppercase tracking-wider">交易模式</p>
                  <div class="mt-2">
                    <span :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      bot.trading_mode === 'signal_only'
                        ? 'bg-blue-100 text-blue-700'
                        : bot.trading_mode === 'semi_auto'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-orange-100 text-orange-700'
                    ]">
                      {{ getTradingModeLabel(bot.trading_mode) }}
                    </span>
                  </div>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors">
                  <p class="text-xs font-medium text-slate-600 uppercase tracking-wider">交易对</p>
                  <p class="text-lg font-semibold text-slate-900 mt-2">{{ bot.token_symbol }}</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors">
                  <p class="text-xs font-medium text-slate-600 uppercase tracking-wider">交易所</p>
                  <p class="text-lg font-semibold text-slate-900 mt-2">{{ bot.exchange_name }}</p>
                </div>
              </div>
            </div>

            <!-- 统计信息 - 高级设计 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <!-- 总交易 -->
              <div class="group relative">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div class="relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">总交易</p>
                  <p class="text-4xl font-bold text-blue-600 mt-3">{{ bot.total_trades }}</p>
                  <p class="text-xs text-slate-400 mt-2">笔交易</p>
                </div>
              </div>

              <!-- 盈利交易 -->
              <div class="group relative">
                <div class="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div class="relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">盈利交易</p>
                  <p class="text-4xl font-bold text-green-600 mt-3">{{ bot.winning_trades }}</p>
                  <p class="text-xs text-slate-400 mt-2">笔交易</p>
                </div>
              </div>

              <!-- 亏损交易 -->
              <div class="group relative">
                <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div class="relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all duration-300">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">亏损交易</p>
                  <p class="text-4xl font-bold text-red-600 mt-3">{{ bot.losing_trades }}</p>
                  <p class="text-xs text-slate-400 mt-2">笔交易</p>
                </div>
              </div>

              <!-- 胜率 -->
              <div class="group relative">
                <div class="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div class="relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">胜率</p>
                  <p class="text-4xl font-bold text-amber-600 mt-3">{{ bot.win_rate || 0 }}%</p>
                  <p class="text-xs text-slate-400 mt-2">成功率</p>
                </div>
              </div>
            </div>

            <!-- 盈亏信息 - 高级设计 -->
            <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div class="p-2 bg-purple-100 rounded-lg">
                  <CurrencyDollarIcon class="h-6 w-6 text-purple-600" />
                </div>
                盈亏统计
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">总盈亏</p>
                  <p :class="bot.total_profit >= 0 ? 'text-green-600' : 'text-red-600'" class="text-3xl font-bold mt-3">
                    {{ formatCurrency(bot.total_profit) }}
                  </p>
                </div>
                <div class="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">盈亏百分比</p>
                  <p :class="bot.total_profit_percentage >= 0 ? 'text-green-600' : 'text-red-600'" class="text-3xl font-bold mt-3">
                    {{ bot.total_profit_percentage || 0 }}%
                  </p>
                </div>
                <div class="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">最后交易时间</p>
                  <p class="text-slate-900 mt-3">{{ formatDate(bot.last_trade_at) }}</p>
                </div>
              </div>
            </div>

            <!-- 配置信息 - 高级设计 -->
            <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <i class="pi pi-cog text-blue-600"></i>
                </div>
                配置信息
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">时间周期</p>
                  <p class="text-slate-900 mt-2 font-medium">{{ bot.timeframe }}</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">创建时间</p>
                  <p class="text-slate-900 mt-2 font-medium">{{ formatDate(bot.created_at) }}</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">启动时间</p>
                  <p class="text-slate-900 mt-2 font-medium">{{ formatDate(bot.started_at) }}</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-sm font-medium text-slate-600 uppercase tracking-wider">停止时间</p>
                  <p class="text-slate-900 mt-2 font-medium">{{ formatDate(bot.stopped_at) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 错误状态 -->
          <div v-else class="text-center py-12">
            <p class="text-slate-500">机器人不存在</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../../common/Header.vue'
import UserSidebar from '../../common/UserSidebar.vue'
import Button from '../../common/ui/Button.vue'
import { ArrowLeftIcon, CpuChipIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const actionLoading = ref(false)
const bot = ref(null)

const loadBot = async () => {
  try {
    loading.value = true
    const response = await botAPI.getBotDetail(route.params.id)
    bot.value = response.data || response
  } catch (error) {
    console.error('加载机器人详情失败:', error)
    showError('加载机器人详情失败')
  } finally {
    loading.value = false
  }
}

const handleStartBot = async () => {
  try {
    actionLoading.value = true
    await botAPI.startBot(bot.value.id)
    showSuccess('机器人已启动')
    await loadBot()
  } catch (error) {
    showError(error.message || '启动失败')
  } finally {
    actionLoading.value = false
  }
}

const handleStopBot = async () => {
  try {
    actionLoading.value = true
    await botAPI.stopBot(bot.value.id)
    showSuccess('机器人已停止')
    await loadBot()
  } catch (error) {
    showError(error.message || '停止失败')
  } finally {
    actionLoading.value = false
  }
}

const handleEditBot = () => {
  // 根据机器人类型跳转到对应的编辑页面
  if (bot.value.bot_type === 'signal') {
    router.push(`/bots/edit-signal/${bot.value.id}`)
  } else {
    router.push(`/bots/edit/${bot.value.id}`)
  }
}

const handleBack = () => {
  router.back()
}

const getStatusLabel = (status) => {
  const map = { running: '运行中', paused: '已暂停', stopped: '已停止', draft: '草稿' }
  return map[status] || status
}

const getTradingModeLabel = (mode) => {
  const map = {
    signal_only: '仅信号通知',
    semi_auto: '半自动交易',
    full_auto: '全自动交易'
  }
  return map[mode] || mode
}

const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return '$' + parseFloat(value).toFixed(2)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await loadBot()
})
</script>

