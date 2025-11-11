<template>
  <div class="space-y-6">
    <!-- 回测配置卡片 -->
    <div class="bg-white rounded-xl p-6 border border-slate-200">
      <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        回测配置
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 机器人选择 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">选择机器人 *</label>
          <select
            v-model="config.bot_id"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">请选择机器人</option>
            <option v-for="bot in bots" :key="bot.id" :value="bot.id">
              {{ bot.name }} ({{ bot.token_symbol }})
            </option>
          </select>
        </div>

        <!-- 时间范围 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">回测时间范围 *</label>
          <select
            v-model="config.time_range"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
            <option value="180d">最近180天</option>
            <option value="1y">最近1年</option>
          </select>
        </div>

        <!-- 初始资金 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">初始资金 (USDT) *</label>
          <input
            type="number"
            v-model.number="config.initial_capital"
            min="100"
            step="100"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1000"
            required
          />
        </div>

        <!-- 手续费率 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">手续费率 (%)</label>
          <input
            type="number"
            v-model.number="config.fee_rate"
            min="0"
            max="1"
            step="0.01"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.1"
          />
        </div>

        <!-- 滑点 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">滑点 (%)</label>
          <input
            type="number"
            v-model.number="config.slippage"
            min="0"
            max="5"
            step="0.1"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.5"
          />
        </div>

        <!-- 回测模式 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">回测模式</label>
          <select
            v-model="config.mode"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="fast">快速回测</option>
            <option value="accurate">精确回测</option>
          </select>
        </div>
      </div>

      <!-- 开始回测按钮 -->
      <div class="mt-6 flex gap-3">
        <button
          @click="startBacktest"
          :disabled="running || !config.bot_id"
          class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg v-if="!running" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          {{ running ? '回测中...' : '开始回测' }}
        </button>
        <button
          v-if="result"
          @click="clearResult"
          class="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
        >
          清除结果
        </button>
      </div>
    </div>

    <!-- 回测进度 -->
    <div v-if="running" class="bg-white rounded-xl p-6 border border-slate-200">
      <div class="flex items-center gap-4 mb-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div>
          <h3 class="text-lg font-semibold text-slate-900">正在回测...</h3>
          <p class="text-sm text-slate-600">请稍候，这可能需要几分钟时间</p>
        </div>
      </div>
      <div class="w-full bg-slate-200 rounded-full h-2">
        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="text-sm text-slate-600 mt-2 text-center">{{ progress }}%</p>
    </div>

    <!-- 回测结果 -->
    <div v-if="result && !running" class="space-y-6">
      <!-- 结果概览 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">总收益</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold">${{ result.total_profit.toFixed(2) }}</p>
          <p class="text-sm opacity-90 mt-1">{{ result.profit_rate.toFixed(2) }}%</p>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">胜率</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ result.win_rate.toFixed(1) }}%</p>
          <p class="text-sm opacity-90 mt-1">{{ result.winning_trades }}/{{ result.total_trades }} 笔</p>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">夏普比率</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ result.sharpe_ratio.toFixed(2) }}</p>
          <p class="text-sm opacity-90 mt-1">风险调整收益</p>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">最大回撤</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ result.max_drawdown.toFixed(2) }}%</p>
          <p class="text-sm opacity-90 mt-1">风险指标</p>
        </div>
      </div>

      <!-- 详细指标 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 交易统计 -->
        <div class="bg-white rounded-xl p-6 border border-slate-200">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">交易统计</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span class="text-sm text-slate-600">总交易数</span>
              <span class="text-lg font-semibold text-slate-900">{{ result.total_trades }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span class="text-sm text-green-600">盈利交易</span>
              <span class="text-lg font-semibold text-green-700">{{ result.winning_trades }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span class="text-sm text-red-600">亏损交易</span>
              <span class="text-lg font-semibold text-red-700">{{ result.losing_trades }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span class="text-sm text-blue-600">平均持仓时间</span>
              <span class="text-lg font-semibold text-blue-700">{{ result.avg_holding_time }}h</span>
            </div>
          </div>
        </div>

        <!-- 收益统计 -->
        <div class="bg-white rounded-xl p-6 border border-slate-200">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">收益统计</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span class="text-sm text-slate-600">最终资金</span>
              <span class="text-lg font-semibold text-slate-900">${{ result.final_capital.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span class="text-sm text-green-600">最大单笔盈利</span>
              <span class="text-lg font-semibold text-green-700">${{ result.max_profit.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span class="text-sm text-red-600">最大单笔亏损</span>
              <span class="text-lg font-semibold text-red-700">${{ result.max_loss.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span class="text-sm text-blue-600">盈亏比</span>
              <span class="text-lg font-semibold text-blue-700">{{ result.profit_loss_ratio.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 收益曲线图占位符 -->
      <div class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">收益曲线</h3>
        <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
          <p class="text-slate-500">图表功能开发中...</p>
        </div>
      </div>

      <!-- 交易记录 -->
      <div class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">交易记录（前10笔）</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">时间</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">方向</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">价格</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">数量</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">盈亏</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(trade, index) in result.trades.slice(0, 10)" :key="index" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm text-slate-900">{{ trade.time }}</td>
                <td class="px-4 py-3">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded',
                    trade.side === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]">
                    {{ trade.side === 'buy' ? '买入' : '卖出' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-900">${{ trade.price.toFixed(2) }}</td>
                <td class="px-4 py-3 text-sm text-slate-900">{{ trade.quantity.toFixed(8) }}</td>
                <td class="px-4 py-3">
                  <span :class="[
                    'text-sm font-semibold',
                    trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  ]">
                    ${{ trade.profit.toFixed(2) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!result && !running" class="bg-white rounded-xl p-12 text-center border border-slate-200">
      <svg class="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <h3 class="text-lg font-medium text-slate-900 mb-2">开始回测</h3>
      <p class="text-slate-600">配置回测参数并点击"开始回测"按钮</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const running = ref(false)
const progress = ref(0)
const bots = ref([])
const result = ref(null)

const config = ref({
  bot_id: '',
  time_range: '30d',
  initial_capital: 1000,
  fee_rate: 0.1,
  slippage: 0.5,
  mode: 'fast'
})

// 加载机器人列表
const loadBots = async () => {
  try {
    const response = await botAPI.getBotList({ page_size: 100 })
    bots.value = response.results || response.data || []
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  }
}

// 开始回测
const startBacktest = async () => {
  if (!config.value.bot_id) {
    showError('请选择机器人')
    return
  }

  running.value = true
  progress.value = 0

  try {
    // 模拟回测进度
    const progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += 10
      }
    }, 500)

    // 模拟回测API调用
    await new Promise(resolve => setTimeout(resolve, 5000))

    clearInterval(progressInterval)
    progress.value = 100

    // 模拟回测结果
    result.value = {
      total_profit: 234.56,
      profit_rate: 23.46,
      win_rate: 68.5,
      total_trades: 45,
      winning_trades: 31,
      losing_trades: 14,
      sharpe_ratio: 1.85,
      max_drawdown: 12.5,
      final_capital: config.value.initial_capital + 234.56,
      max_profit: 45.67,
      max_loss: -23.45,
      profit_loss_ratio: 1.95,
      avg_holding_time: 18.5,
      trades: Array.from({ length: 45 }, (_, i) => ({
        time: new Date(Date.now() - i * 86400000).toLocaleDateString(),
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        price: 50000 + Math.random() * 10000,
        quantity: 0.001 + Math.random() * 0.01,
        profit: (Math.random() - 0.3) * 50
      }))
    }

    showSuccess('回测完成')
  } catch (error) {
    console.error('回测失败:', error)
    showError('回测失败')
  } finally {
    running.value = false
  }
}

// 清除结果
const clearResult = () => {
  result.value = null
  progress.value = 0
}

onMounted(() => {
  loadBots()
})
</script>

