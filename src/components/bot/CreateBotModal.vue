<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? '编辑机器人' : '创建机器人' }}
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <XMarkIcon class="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <!-- 步骤指示器 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex items-center"
            :class="{ 'flex-1': index < steps.length - 1 }"
          >
            <div class="flex items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold',
                  currentStep >= index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                ]"
              >
                {{ index + 1 }}
              </div>
              <span
                class="ml-2 font-medium"
                :class="currentStep >= index ? 'text-blue-600' : 'text-gray-600'"
              >
                {{ step }}
              </span>
            </div>
            <div
              v-if="index < steps.length - 1"
              class="flex-1 h-1 mx-4"
              :class="currentStep > index ? 'bg-blue-600' : 'bg-gray-200'"
            ></div>
          </div>
        </div>
      </div>

      <!-- 表单内容 -->
      <div class="px-6 py-6">
        <!-- 步骤 1: 选择机器人类型 -->
        <div v-if="currentStep === 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">选择机器人类型</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="type in botTypes"
              :key="type.value"
              @click="selectBotType(type)"
              :class="[
                'p-6 border-2 rounded-lg cursor-pointer transition-all',
                formData.bot_type === type.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300',
                type.disabled ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <div class="flex items-start">
                <component :is="type.icon" class="h-8 w-8 text-blue-600 mr-3 flex-shrink-0" />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 mb-1">
                    {{ type.label }}
                    <span v-if="type.disabled" class="text-xs text-gray-500 ml-2">(即将推出)</span>
                  </h4>
                  <p class="text-sm text-gray-600">{{ type.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤 2: 选择交易所和代币 -->
        <div v-if="currentStep === 1">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">选择交易所和代币</h3>
          
          <!-- 选择交易所 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">交易所</label>
            <select
              v-model="formData.exchange_api"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">请选择交易所</option>
              <option
                v-for="exchange in exchanges"
                :key="exchange.id"
                :value="exchange.id"
              >
                {{ exchange.name }} ({{ exchange.exchange_display }})
              </option>
            </select>
          </div>

          <!-- 选择代币 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">代币</label>
            <div class="relative">
              <input
                v-model="tokenSearch"
                @input="searchTokens"
                type="text"
                placeholder="搜索代币 (如: BTC, ETH)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <!-- 代币搜索结果 -->
            <div v-if="tokenSearchResults.length > 0" class="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              <div
                v-for="token in tokenSearchResults"
                :key="token.id"
                @click="selectToken(token)"
                :class="[
                  'p-3 cursor-pointer hover:bg-gray-50 flex items-center',
                  formData.token === token.id ? 'bg-blue-50' : ''
                ]"
              >
                <img
                  v-if="token.logo"
                  :src="token.logo"
                  :alt="token.symbol"
                  class="h-8 w-8 rounded-full mr-3"
                />
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ token.symbol }}</p>
                  <p class="text-sm text-gray-600">{{ token.name }}</p>
                </div>
                <p class="text-sm text-gray-600">${{ token.current_price }}</p>
              </div>
            </div>

            <!-- 已选择的代币 -->
            <div v-if="selectedToken" class="mt-4 p-4 bg-blue-50 rounded-lg flex items-center">
              <img
                v-if="selectedToken.logo"
                :src="selectedToken.logo"
                :alt="selectedToken.symbol"
                class="h-10 w-10 rounded-full mr-3"
              />
              <div class="flex-1">
                <p class="font-semibold text-gray-900">{{ selectedToken.symbol }}</p>
                <p class="text-sm text-gray-600">{{ selectedToken.name }}</p>
              </div>
              <button
                @click="clearToken"
                class="p-1 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <XMarkIcon class="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <!-- 交易对 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">交易对</label>
            <select
              v-model="formData.trading_pair"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USDT">USDT</option>
              <option value="BUSD">BUSD</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </div>

        <!-- 步骤 3: 配置参数 -->
        <div v-if="currentStep === 2">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">配置参数</h3>
          
          <!-- 基础配置 -->
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">机器人名称</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="给您的机器人起个名字"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">描述（可选）</label>
              <textarea
                v-model="formData.description"
                rows="3"
                placeholder="描述一下这个机器人的策略"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          <!-- 风险控制 -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-gray-900 mb-4">风险控制</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">最大仓位 (USDT)</label>
                <input
                  v-model.number="formData.max_position_size"
                  type="number"
                  min="10"
                  step="10"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">杠杆倍数</label>
                <input
                  v-model.number="formData.leverage"
                  type="number"
                  min="1"
                  max="125"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">止损百分比 (%)</label>
                <input
                  v-model.number="formData.stop_loss_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">止盈百分比 (%)</label>
                <input
                  v-model.number="formData.take_profit_percentage"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <!-- 机器人特定配置 -->
          <component
            :is="botConfigComponent"
            v-if="botConfigComponent"
            v-model="formData.config"
          />
        </div>

        <!-- 步骤 4: 确认 -->
        <div v-if="currentStep === 3">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">确认信息</h3>
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">机器人类型:</span>
              <span class="font-medium text-gray-900">{{ getBotTypeLabel(formData.bot_type) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">交易所:</span>
              <span class="font-medium text-gray-900">{{ getExchangeName(formData.exchange_api) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">代币:</span>
              <span class="font-medium text-gray-900">{{ selectedToken?.symbol }} / {{ formData.trading_pair }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">最大仓位:</span>
              <span class="font-medium text-gray-900">${{ formData.max_position_size }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">杠杆:</span>
              <span class="font-medium text-gray-900">{{ formData.leverage }}x</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">止损/止盈:</span>
              <span class="font-medium text-gray-900">{{ formData.stop_loss_percentage }}% / {{ formData.take_profit_percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between">
        <button
          v-if="currentStep > 0"
          @click="currentStep--"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          上一步
        </button>
        <div v-else></div>

        <div class="flex space-x-3">
          <button
            @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            v-if="currentStep < steps.length - 1"
            @click="nextStep"
            :disabled="!canProceed"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一步
          </button>
          <button
            v-else
            @click="submitForm"
            :disabled="submitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? '创建中...' : (isEditing ? '保存' : '创建') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChartBarIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ScaleIcon,
} from '@heroicons/vue/24/outline'
import { botAPI, exchangeAPI } from '../../utils/api'
import SignalBotConfig from './config/SignalBotConfig.vue'
import TrendFollowingBotConfig from './config/TrendFollowingBotConfig.vue'

// Props
const props = defineProps({
  bot: {
    type: Object,
    default: null
  },
  defaultBotType: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['close', 'success'])

// 状态
const currentStep = ref(0)
const submitting = ref(false)
const exchanges = ref([])
const tokenSearch = ref('')
const tokenSearchResults = ref([])
const selectedToken = ref(null)

// 步骤
const steps = ['选择类型', '选择交易所', '配置参数', '确认']

// 机器人类型
const botTypes = [
  {
    value: 'signal',
    label: '信号机器人',
    description: '监控市场信号，发送通知提醒，不自动交易',
    icon: BellIcon,
    disabled: false
  },
  {
    value: 'trend_following',
    label: '趋势跟踪机器人',
    description: '识别趋势方向，自动开仓、加仓、止盈止损',
    icon: ChartBarIcon,
    disabled: false
  },
  {
    value: 'breakout',
    label: '突破机器人',
    description: '监控关键价格位，突破时自动开仓',
    icon: BoltIcon,
    disabled: true
  },
  {
    value: 'martingale',
    label: '马丁格尔机器人',
    description: '逆势加仓策略，高风险高收益',
    icon: ArrowTrendingUpIcon,
    disabled: true
  },
  {
    value: 'arbitrage',
    label: '套利机器人',
    description: '跨交易所价差套利，低风险稳定收益',
    icon: ScaleIcon,
    disabled: true
  },
]

// 表单数据
const formData = ref({
  name: '',
  bot_type: '',
  description: '',
  token: null,
  exchange_api: null,
  trading_pair: 'USDT',
  max_position_size: 100,
  leverage: 1,
  stop_loss_percentage: 5,
  take_profit_percentage: 10,
  config: {}
})

// 初始化默认机器人类型
if (props.defaultBotType) {
  const botTypeMap = {
    'signal': 'signal',
    'trend-following': 'trend_following',
    'breakout': 'breakout',
    'martingale': 'martingale',
    'arbitrage': 'arbitrage'
  }
  formData.value.bot_type = botTypeMap[props.defaultBotType] || ''
  // 如果有默认类型，跳过第一步
  if (formData.value.bot_type) {
    currentStep.value = 1
  }
}

// 是否编辑模式
const isEditing = computed(() => !!props.bot)

// 机器人配置组件
const botConfigComponent = computed(() => {
  switch (formData.value.bot_type) {
    case 'signal':
      return SignalBotConfig
    case 'trend_following':
      return TrendFollowingBotConfig
    default:
      return null
  }
})

// 是否可以继续下一步
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return !!formData.value.bot_type
    case 1:
      return !!formData.value.exchange_api && !!formData.value.token
    case 2:
      return !!formData.value.name && formData.value.max_position_size > 0
    default:
      return true
  }
})

// 选择机器人类型
const selectBotType = (type) => {
  if (!type.disabled) {
    formData.value.bot_type = type.value
  }
}

// 下一步
const nextStep = () => {
  if (canProceed.value) {
    currentStep.value++
  }
}

// 搜索代币
let searchTimeout = null
const searchTokens = async () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!tokenSearch.value || tokenSearch.value.length < 2) {
    tokenSearchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/market/tokens/?search=${tokenSearch.value}`)
      const data = await response.json()
      tokenSearchResults.value = data.results || []
    } catch (error) {
      console.error('搜索代币失败:', error)
    }
  }, 300)
}

// 选择代币
const selectToken = (token) => {
  formData.value.token = token.id
  selectedToken.value = token
  tokenSearchResults.value = []
  tokenSearch.value = ''
}

// 清除代币
const clearToken = () => {
  formData.value.token = null
  selectedToken.value = null
}

// 获取机器人类型标签
const getBotTypeLabel = (value) => {
  const type = botTypes.find(t => t.value === value)
  return type ? type.label : value
}

// 获取交易所名称
const getExchangeName = (id) => {
  const exchange = exchanges.value.find(e => e.id === id)
  return exchange ? `${exchange.name} (${exchange.exchange_display})` : ''
}

// 加载交易所列表
const loadExchanges = async () => {
  try {
    const response = await exchangeAPI.getExchangeList()
    exchanges.value = Array.isArray(response) ? response : (response.data || [])
  } catch (error) {
    console.error('加载交易所列表失败:', error)
  }
}

// 提交表单
const submitForm = async () => {
  try {
    submitting.value = true
    
    const data = {
      ...formData.value,
      exchange_api: parseInt(formData.value.exchange_api),
      token: parseInt(formData.value.token)
    }

    let response
    if (isEditing.value) {
      response = await botAPI.updateBot(props.bot.id, data)
    } else {
      response = await botAPI.createBot(data)
    }

    if (response.success) {
      emit('success')
    } else {
      alert(response.error || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    alert(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

// 初始化
onMounted(() => {
  loadExchanges()
  
  // 如果是编辑模式，填充表单数据
  if (props.bot) {
    formData.value = {
      name: props.bot.name,
      bot_type: props.bot.bot_type,
      description: props.bot.description || '',
      token: props.bot.token,
      exchange_api: props.bot.exchange_api,
      trading_pair: props.bot.trading_pair,
      max_position_size: props.bot.max_position_size,
      leverage: props.bot.leverage,
      stop_loss_percentage: props.bot.stop_loss_percentage,
      take_profit_percentage: props.bot.take_profit_percentage,
      config: props.bot.config || {}
    }
    
    // 设置选中的代币
    selectedToken.value = {
      id: props.bot.token,
      symbol: props.bot.token_symbol,
      name: props.bot.token_name,
      logo: props.bot.token_logo
    }
  }
})
</script>

