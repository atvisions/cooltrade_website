<template>
  <div class="space-y-4 lg:sticky lg:top-24">
    
    <!-- Bot Creation Panel -->
    <div class="bg-white rounded-2xl p-6 border border-gray-200">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
          </svg>
          <h3 class="text-lg font-bold text-gray-900">交易机器人</h3>
        </div>
        <button
          v-if="!showBotForm"
          @click="showBotForm = true"
          class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          + 新建机器人
        </button>
      </div>

      <!-- Bot Creation Form -->
      <div v-if="showBotForm" class="space-y-4">
        
        <!-- Bot Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">机器人名称</label>
          <input
            v-model="botConfig.name"
            type="text"
            placeholder="我的网格机器人"
            class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <!-- Strategy Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">交易策略</label>
          <select
            v-model="botConfig.strategy"
            class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">选择策略</option>
            <option v-for="strategy in strategies" :key="strategy.code" :value="strategy.code">
              {{ strategy.name }}
            </option>
          </select>
        </div>

        <!-- Exchange Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">交易所</label>
          <select
            v-model="botConfig.exchange"
            class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">选择交易所</option>
            <option v-for="exchange in availableExchanges" :key="exchange.exchange" :value="exchange.exchange">
              {{ getExchangeName(exchange.exchange) }}
            </option>
          </select>
        </div>

        <!-- Investment Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">投资金额 (USDT)</label>
          <input
            v-model="botConfig.investment"
            type="number"
            placeholder="1000"
            class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <!-- Leverage -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">杠杆倍数</label>
            <span class="text-sm font-semibold text-gray-900">{{ botConfig.leverage }}x</span>
          </div>
          <input
            v-model="botConfig.leverage"
            type="range"
            min="1"
            :max="maxLeverage"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>1x</span>
            <span>{{ maxLeverage }}x</span>
          </div>
        </div>

        <!-- Strategy Parameters (Dynamic based on selected strategy) -->
        <div v-if="selectedStrategyParams" class="pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">策略参数</h4>
          <div class="space-y-3">
            <div v-for="(value, key) in selectedStrategyParams" :key="key">
              <label class="block text-xs text-gray-600 mb-1">{{ formatParamLabel(key) }}</label>
              <input
                v-model="botConfig.params[key]"
                :type="getInputType(key)"
                :placeholder="String(value)"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        <!-- Risk Management -->
        <div class="pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">风险管理</h4>
          <div class="space-y-3">
            <div>
              <label class="block text-xs text-gray-600 mb-1">止损 (%)</label>
              <input
                v-model="botConfig.stopLoss"
                type="number"
                placeholder="5"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">止盈 (%)</label>
              <input
                v-model="botConfig.takeProfit"
                type="number"
                placeholder="10"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3 pt-4">
          <button
            @click="createBot"
            class="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            创建并启动
          </button>
          <button
            @click="showBotForm = false"
            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            取消
          </button>
        </div>

      </div>

      <!-- Active Bots List -->
      <div v-else>
        <div v-if="activeBots.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
            </svg>
          </div>
          <p class="text-sm text-gray-600 mb-4">暂无活跃机器人</p>
          <p class="text-xs text-gray-500">创建您的第一个机器人开始自动交易</p>
        </div>

        <!-- Bot Cards -->
        <div v-else class="space-y-3">
          <div 
            v-for="bot in activeBots" 
            :key="bot.id"
            class="bg-white rounded-xl p-4 border border-gray-200"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-semibold text-gray-900 mb-1">{{ bot.name }}</h4>
                <p class="text-xs text-gray-600">{{ bot.strategy }}</p>
              </div>
              <span
                class="px-2 py-1 rounded text-xs font-medium"
                :class="bot.status === 'running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
              >
                {{ bot.status === 'running' ? '运行中' : '已停止' }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div class="text-xs text-gray-600 mb-1">PnL</div>
                <div class="text-sm font-semibold" :class="bot.pnl >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ bot.pnl >= 0 ? '+' : '' }}${{ bot.pnl }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-600 mb-1">ROI</div>
                <div class="text-sm font-semibold" :class="bot.roi >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ bot.roi >= 0 ? '+' : '' }}{{ bot.roi }}%
                </div>
              </div>
            </div>

            <div class="flex space-x-2">
              <button
                v-if="bot.status === 'running'"
                @click="$emit('stop-bot', bot.id)"
                class="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
              >
                停止
              </button>
              <button
                v-else
                @click="$emit('start-bot', bot.id)"
                class="flex-1 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-colors"
              >
                启动
              </button>
              <button class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors">
                详情
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- AI Recommendations -->
    <div v-if="!showBotForm && marketCondition" class="bg-blue-50 rounded-2xl p-4 border border-blue-200">
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-blue-900 mb-1">AI 推荐</h4>
          <p class="text-xs text-blue-700 mb-2">
            当前市场状态：{{ marketCondition }}。建议使用网格交易或定投策略。
          </p>
          <button class="text-xs font-medium text-blue-600 hover:text-blue-800">
            查看策略 →
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  token: { type: Object, default: () => ({}) },
  exchanges: { type: Array, default: () => [] },
  strategies: { type: Array, default: () => [] },
  marketCondition: { type: String, default: '' },
  technicalSignals: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['create-bot', 'start-bot', 'stop-bot'])

const showBotForm = ref(false)
const botConfig = ref({
  name: '',
  strategy: '',
  exchange: '',
  investment: 1000,
  leverage: 1,
  params: {},
  stopLoss: 5,
  takeProfit: 10
})

// Mock active bots
const activeBots = ref([])

const availableExchanges = computed(() => {
  return props.exchanges.filter(e => e.contract_spec)
})

const maxLeverage = computed(() => {
  const selected = availableExchanges.value.find(e => e.exchange === botConfig.value.exchange)
  return selected?.contract_spec?.max_leverage || 10
})

const selectedStrategyParams = computed(() => {
  const strategy = props.strategies.find(s => s.code === botConfig.value.strategy)
  return strategy?.default_params || null
})

const getExchangeName = (exchange) => {
  const names = {
    'binance': 'Binance',
    'okx': 'OKX',
    'bybit': 'Bybit',
    'gate': 'Gate.io'
  }
  return names[exchange] || exchange
}

const formatParamLabel = (key) => {
  const labels = {
    'leverage': 'Leverage',
    'grid_count': 'Grid Count',
    'price_range_percent': 'Price Range (%)',
    'profit_per_grid': 'Profit per Grid (%)',
    'stop_loss_percent': 'Stop Loss (%)',
    'interval': 'Interval (hours)',
    'amount': 'Amount per Order'
  }
  return labels[key] || key
}

const getInputType = (key) => {
  if (key.includes('percent') || key === 'leverage' || key === 'grid_count') {
    return 'number'
  }
  return 'text'
}

const createBot = () => {
  emit('create-bot', botConfig.value)
  showBotForm.value = false
  // Reset form
  botConfig.value = {
    name: '',
    strategy: '',
    exchange: '',
    investment: 1000,
    leverage: 1,
    params: {},
    stopLoss: 5,
    takeProfit: 10
  }
}
</script>

