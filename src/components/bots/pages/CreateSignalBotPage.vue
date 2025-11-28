<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-6">
        <!-- 左侧表单区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面头部 -->
          <div class="mb-8">
            <div class="flex items-center gap-4 mb-2">
              <button
                @click="handleCancel"
                class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 transition-colors"
                title="返回"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 class="text-3xl font-bold text-slate-900">{{ isEditMode ? '编辑信号机器人' : '创建信号机器人' }}</h1>
                <p class="text-slate-600 mt-1">配置市场信号监控和通知</p>
              </div>
            </div>
          </div>

          <!-- 监控配置组件 -->
          <MonitorConfig
            :form-data="formData"
            :errors="errors"
            :available-exchanges="availableExchanges"
            :selected-exchange-type="selectedExchangeType"
            :filtered-exchange-a-p-is="filteredExchangeAPIs"
            :selected-exchange-a-p-i="selectedExchangeAPI"
            :selected-exchange="selectedExchange"
            :token-search-query="tokenSearchQuery"
            :token-search-results="tokenSearchResults"
            :token-searching="tokenSearching"
            :show-token-results="showTokenResults"
            :selected-token="selectedToken"
            :popular-tokens="popularTokens"
            :available-quote-assets="availableQuoteAssets"
            @select-exchange-type="selectExchangeType"
            @update:token-search-query="tokenSearchQuery = $event"
            @handle-token-search="handleTokenSearch"
            @handle-token-input-focus="handleTokenInputFocus"
            @handle-token-input-blur="handleTokenInputBlur"
            @clear-token-selection="clearTokenSelection"
            @select-token="selectToken"
            @quick-select-token="quickSelectToken"
          />

          <!-- 信号配置 -->
          <Card variant="default" class="mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">信号配置</h2>
                <p class="text-sm text-slate-500">设置触发信号的条件和参数</p>
              </div>
            </div>

            <div class="space-y-6">
              <!-- 信号类型选择器 -->
              <SignalTypeSelector
                :signal-type="formData.signal_type"
                :error="errors.signal_type"
                @update:signal-type="formData.signal_type = $event"
              />

              <!-- 根据信号类型显示对应的配置 -->
              <!-- 价格提醒配置 -->
              <PriceAlertConfig
                v-if="formData.signal_type === 'price_alert'"
                v-model="priceAlertConfig"
                :current-price="selectedToken?.current_price || null"
              />

              <!-- 指标信号提醒配置 -->
              <IndicatorAlertConfig
                v-else-if="formData.signal_type === 'indicator_alert'"
                :selected-indicators="selectedIndicators"
                :logic="indicatorLogic"
                :indicators-config="indicatorsConfig"
                :timeframes-config="timeframesConfig"
                @update:selected-indicators="selectedIndicators = $event"
                @update:logic="indicatorLogic = $event"
                @update:indicators-config="indicatorsConfig = $event"
                @update:timeframes-primary="timeframesConfig.primary = $event"
                @toggle-confirm-timeframe="toggleConfirmTimeframe($event)"
                @update:timeframes-require-all="timeframesConfig.require_all_confirm = $event"
                @update:timeframes-min-count="timeframesConfig.min_confirm_count = Number($event)"
              />

              <!-- 波动性提醒配置 -->
              <VolatilitySignalConfig
                v-else-if="formData.signal_type === 'volatility'"
                v-model="volatilityConfig"
                :timeframes-config="timeframesConfig"
                @update:timeframes-config="timeframesConfig = $event"
              />

              <!-- 成交量/持仓提醒配置 -->
              <VolumeSignalConfig
                v-else-if="formData.signal_type === 'volume'"
                v-model="volumeAlertConfig"
                :timeframes-config="timeframesConfig"
                @update:timeframes-config="timeframesConfig = $event"
              />

              <!-- 其他信号类型配置待添加 -->
              <div v-else-if="formData.signal_type && formData.signal_type !== 'price_alert' && formData.signal_type !== 'indicator_alert' && formData.signal_type !== 'volatility' && formData.signal_type !== 'volume'" class="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div class="text-center text-slate-500">
                  <p class="text-sm">{{ formData.signal_type }} 配置待添加</p>
                </div>
              </div>
            </div>
          </Card>

          <!-- 检查间隔配置 -->
          <Card variant="default" class="mb-6">
            <template #header>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-lg font-semibold text-slate-900">检查周期</h3>
              </div>
              <p class="text-sm text-slate-600 mt-1">设置系统检查信号的频率</p>
            </template>
            <CheckIntervalConfig v-model="formData.check_interval" />
          </Card>

          <!-- 信号质量控制 -->
          <SignalQualityConfig
            v-if="formData.signal_type && formData.signal_type !== 'price_alert'"
            :config="signalQualityConfig"
            @update:config="signalQualityConfig = $event"
          />

          <!-- AI 分析配置 -->
          <AIAnalysisConfig
            :enabled="formData.use_advanced_analysis"
            :signal-type="formData.signal_type"
            @update:enabled="formData.use_advanced_analysis = $event"
            @error="showError"
            @upgrade-required="handleAIUpgradeRequired"
          />

          <!-- 通知设置 -->
          <NotificationConfig
            :notify-email="formData.notify_email"
            :notify-app="formData.notify_app"
            :alert-mode="alertConfig.mode"
            :cooldown-minutes="alertConfig.cooldown_minutes"
            @update:notify-email="formData.notify_email = $event"
            @update:notify-app="formData.notify_app = $event"
            @update:alert-mode="alertConfig.mode = $event"
            @update:cooldown-minutes="alertConfig.cooldown_minutes = $event"
          />

          <!-- 基本信息 -->
          <BasicInfoConfig
            :name="formData.name"
            :description="formData.description"
            :error="errors.name"
            @update:name="formData.name = $event"
            @update:description="formData.description = $event"
            @use-auto-generated-name="useAutoGeneratedName"
            @use-auto-generated-description="useAutoGeneratedDescription"
          />

        </main>

        <!-- 右侧配置预览 -->
        <ConfigPreview
          :form-data="formData"
          :selected-exchange="selectedExchange"
          :selected-exchange-a-p-i="selectedExchangeAPI"
          :selected-token="selectedToken"
          :alert-config="alertConfig"
          :indicator-alert-type="indicatorAlertType"
          :rsi-config="rsiConfig"
          :macd-config="macdConfig"
          :ma-cross-config="maCrossConfig"
          :atr-config="atrConfig"
          :timeframes-config="timeframesConfig"
          :selected-indicators="selectedIndicators"
          :indicator-logic="indicatorLogic"
          :indicators-config="indicatorsConfig"
          :is-bot-running="isBotRunning"
          :submitting="submitting"
          :is-edit-mode="isEditMode"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>

    <!-- 升级会员弹窗 -->
    <UpgradeMembershipModal
      ref="upgradeMembershipModal"
      title="AI 分析功能需要会员权限"
      message="AI 深度分析功能仅对 Standard 和 Professional 会员开放，升级会员即可使用"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../../common/Header.vue'
import Card from '../../common/ui/Card.vue'
import MonitorConfig from '../signals/MonitorConfig.vue'
import SignalTypeSelector from '../signals/SignalTypeSelector.vue'
import PriceAlertConfig from '../signals/PriceAlertConfig.vue'
import IndicatorAlertConfig from '../signals/IndicatorAlertConfig.vue'
import VolatilitySignalConfig from '../signals/VolatilitySignalConfig.vue'
import VolumeSignalConfig from '../signals/VolumeSignalConfig.vue'
import CheckIntervalConfig from '../signals/CheckIntervalConfig.vue'
import SignalQualityConfig from '../signals/SignalQualityConfig.vue'
import AIAnalysisConfig from '../signals/AIAnalysisConfig.vue'
import NotificationConfig from '../signals/NotificationConfig.vue'
import BasicInfoConfig from '../signals/BasicInfoConfig.vue'
import ConfigPreview from '../signals/ConfigPreview.vue'
import UpgradeMembershipModal from '../../common/UpgradeMembershipModal.vue'
import { exchangeAPI, apiRequest, API_ENDPOINTS, botAPI } from '../../../utils/api'
import { showError, showSuccess } from '../../../utils/notification'

const router = useRouter()
const route = useRoute()

// 升级会员弹窗
const upgradeMembershipModal = ref(null)

// 编辑模式
const isEditMode = computed(() => !!route.params.id)
const isBotRunning = ref(false)
const submitting = ref(false)

// 交易所相关
const selectedExchangeType = ref('')

const formData = ref({
  name: '',
  description: '',
  exchange_name: '',
  exchange_api: null,
  token: null,
  trading_pair: 'USDT',
  timeframe: '1h',
  signal_type: 'indicator_alert',  // 默认选择指标信号提醒
  notify_email: true,
  notify_app: true,
  check_interval: '5m',
  use_advanced_analysis: false,
  config: {}
})

const availableExchanges = ref([])
const availableExchangeAPIs = ref([])
const errors = ref({})

// 代币搜索
const tokenSearchQuery = ref('')
const tokenSearchResults = ref([])
const tokenSearching = ref(false)
const showTokenResults = ref(false)
const selectedToken = ref(null)
let searchTimeout = null

const popularTokens = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'MATIC']

// 选中的交易所
const selectedExchange = computed(() => {
  if (!formData.value.exchange_name) return null
  return availableExchanges.value.find(ex => ex.value === formData.value.exchange_name)
})

// 根据选中的交易所过滤 exchange_api
const filteredExchangeAPIs = computed(() => {
  if (!formData.value.exchange_name) return []
  return availableExchangeAPIs.value.filter(api => api.exchange === formData.value.exchange_name)
})

// 选中的交易所API
const selectedExchangeAPI = computed(() => {
  if (!formData.value.exchange_api) return null
  return availableExchangeAPIs.value.find(api => api.id === formData.value.exchange_api)
})

// 可用的计价币种选项
const availableQuoteAssets = computed(() => {
  const allOptions = [
    { label: 'USDT', value: 'USDT' },
    { label: 'USDC', value: 'USDC' },
    { label: 'BTC', value: 'BTC' },
    { label: 'ETH', value: 'ETH' }
  ]
  return allOptions
})

// 方法
const handleCancel = () => {
  router.push('/signal-bots')
}

const handleSubmit = async () => {
  // 验证必填项
  if (!formData.value.exchange_name) {
    showError('请选择交易所')
    return
  }

  if (!formData.value.token) {
    showError('请选择代币')
    return
  }

  if (!formData.value.name) {
    showError('请输入机器人名称')
    return
  }

  try {
    submitting.value = true

    // 根据信号类型构建config
    let config = {
      use_advanced_analysis: formData.value.use_advanced_analysis,
      alert_mode: alertConfig.value.mode,
      cooldown_minutes: Number(alertConfig.value.cooldown_minutes)  // 确保是数字类型
    }

    switch (formData.value.signal_type) {
      case 'price_alert':
        if (!priceAlertConfig.value.target_price) {
          showError('请输入目标价格')
          submitting.value = false
          return
        }

        config = {
          ...config,
          signal_type: 'price_alert',
          price_alert: {
            condition: priceAlertConfig.value.condition,
            target_price: Number(priceAlertConfig.value.target_price)  // 使用 Number() 而不是 parseFloat()
          }
        }
        break

      case 'indicator_alert':
        // 检查是否使用新的多指标格式
        if (selectedIndicators.value.length > 0) {
          // 新的多指标格式
          const indicators = selectedIndicators.value.map(type => {
            const indicatorConfig = indicatorsConfig.value[type]
            return {
              type: type,
              enabled: indicatorConfig?.enabled !== false,
              weight: indicatorConfig?.weight || 1,
              params: indicatorConfig?.params || {}
            }
          })

          config = {
            ...config,
            signal_type: 'indicator_alert',
            indicator_alert: {
              logic: indicatorLogic.value,
              indicators: indicators
            },
            timeframes_config: {
              primary: timeframesConfig.value.primary,
              confirm: timeframesConfig.value.confirm,
              require_all_confirm: timeframesConfig.value.require_all_confirm,
              min_confirm_count: Number(timeframesConfig.value.min_confirm_count)
            }
          }
        } else {
          // 旧的单指标格式（向后兼容）
          let indicatorConfig = {}
          if (indicatorAlertType.value === 'rsi') {
            indicatorConfig = {
              indicator_type: 'rsi',
              period: Number(rsiConfig.value.period),
              overbought: Number(rsiConfig.value.overbought),
              oversold: Number(rsiConfig.value.oversold)
            }
          } else if (indicatorAlertType.value === 'macd') {
            indicatorConfig = {
              indicator_type: 'macd',
              fast: Number(macdConfig.value.fast),
              slow: Number(macdConfig.value.slow),
              signal: Number(macdConfig.value.signal)
            }
          } else if (indicatorAlertType.value === 'ma_crossover') {
            indicatorConfig = {
              indicator_type: 'ma_crossover',
              fast: Number(maCrossConfig.value.fast),
              slow: Number(maCrossConfig.value.slow)
            }
          } else if (indicatorAlertType.value === 'atr') {
            indicatorConfig = {
              indicator_type: 'atr',
              period: Number(atrConfig.value.period),
              multiplier: Number(atrConfig.value.multiplier)
            }
          } else if (indicatorAlertType.value === 'volume') {
            indicatorConfig = {
              indicator_type: 'volume',
              multiplier: Number(volumeConfig.value.multiplier),
              period: Number(volumeConfig.value.period)
            }
          }
          config = {
            ...config,
            signal_type: 'indicator_alert',
            indicator_alert: indicatorConfig,
            timeframes_config: {
              primary: timeframesConfig.value.primary,
              confirm: timeframesConfig.value.confirm,
              require_all_confirm: timeframesConfig.value.require_all_confirm,
              min_confirm_count: Number(timeframesConfig.value.min_confirm_count)
            }
          }
        }
        break

      case 'volatility':
        config = {
          ...config,
          signal_type: 'volatility',
          volatility_alert: {
            volatility_threshold: Number(volatilityConfig.value.volatility_threshold),
            volatility_period: Number(volatilityConfig.value.volatility_period)
          },
          timeframes_config: {
            primary: timeframesConfig.value.primary,
            confirm: timeframesConfig.value.confirm,
            require_all_confirm: timeframesConfig.value.require_all_confirm,
            min_confirm_count: Number(timeframesConfig.value.min_confirm_count)
          }
        }
        break

      case 'volume':
        config = {
          ...config,
          signal_type: 'volume',
          volume_alert: {
            volume_multiplier: Number(volumeAlertConfig.value.volume_multiplier),
            volume_period: Number(volumeAlertConfig.value.volume_period)
          },
          timeframes_config: {
            primary: timeframesConfig.value.primary,
            confirm: timeframesConfig.value.confirm,
            require_all_confirm: timeframesConfig.value.require_all_confirm,
            min_confirm_count: Number(timeframesConfig.value.min_confirm_count)
          }
        }
        break

      // 其他信号类型待添加
      default:
        showError('暂不支持此信号类型')
        submitting.value = false
        return
    }

    // 准备提交数据
    const submitData = {
      name: formData.value.name,
      description: formData.value.description,
      token: formData.value.token,
      exchange_name: formData.value.exchange_name,
      exchange_api: formData.value.exchange_api || null,
      trading_pair: formData.value.trading_pair,
      timeframe: formData.value.timeframe,
      signal_type: formData.value.signal_type,
      notify_email: formData.value.notify_email,
      notify_app: formData.value.notify_app,
      check_interval: formData.value.check_interval,
      config: config,
      bot_type: 'signal',
      // 信号质量控制参数（价格提醒不需要）
      ...(formData.value.signal_type !== 'price_alert' && {
        signal_confirmation_bars: Number(signalQualityConfig.value.signal_confirmation_bars),
        signal_expiration_hours: Number(signalQualityConfig.value.signal_expiration_hours),
        signal_strength_threshold: Number(signalQualityConfig.value.signal_strength_threshold)
      }),
      // 多指标配置（价格提醒不需要）
      ...(formData.value.signal_type !== 'price_alert' && selectedIndicators.value.length > 0 && {
        indicators_config: {
          indicators: selectedIndicators.value.map(type => {
            const indicatorConfig = indicatorsConfig.value[type]
            return {
              type: type,
              enabled: indicatorConfig?.enabled !== false,
              weight: indicatorConfig?.weight || 33,
              params: indicatorConfig?.params || {}
            }
          }),
          trigger_threshold: Number(signalQualityConfig.value.signal_strength_threshold) || 70,
          require_all: indicatorLogic.value === 'and'
        }
      }),
      // 多时间周期配置（价格提醒不需要）
      ...(formData.value.signal_type !== 'price_alert' && {
        timeframes_config: {
          primary: timeframesConfig.value.primary,
          confirm: timeframesConfig.value.confirm,
          require_all_confirm: timeframesConfig.value.require_all_confirm,
          min_confirm_count: Number(timeframesConfig.value.min_confirm_count)
        }
      })
    }

    console.log('提交数据:', submitData)

    if (isEditMode.value) {
      // 编辑模式：更新机器人
      const botId = route.params.id
      const response = await botAPI.updateBot(botId, submitData)
      console.log('更新响应:', response)
      showSuccess('信号机器人更新成功')
    } else {
      // 创建模式：创建新机器人
      const response = await botAPI.createBot(submitData)
      console.log('创建响应:', response)
      showSuccess('信号机器人创建成功')
    }

    router.push('/signal-bots')
  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '创建失败:', error)
    console.error('错误详情:', error.data)

    // 构建详细的错误信息
    let errorMessage = error.message || (isEditMode.value ? '更新失败' : '创建失败')

    // 如果有验证错误，显示详细信息
    if (error.data && error.data.errors) {
      const errorDetails = Object.entries(error.data.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join('\n')
      errorMessage = `${error.data.error || '验证失败'}\n${errorDetails}`
    }

    showError(errorMessage)
  } finally {
    submitting.value = false
  }
}

const selectExchangeType = (exchangeType) => {
  selectedExchangeType.value = exchangeType
  formData.value.exchange_name = exchangeType

  // 清空代币选择
  formData.value.token = null
  tokenSearchQuery.value = ''
  tokenSearchResults.value = []
  selectedToken.value = null
  showTokenResults.value = false
}

const handleTokenSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  const query = tokenSearchQuery.value.trim()

  if (query.length < 1) {
    tokenSearchResults.value = []
    tokenSearching.value = false
    showTokenResults.value = false
    // 清空选择
    formData.value.token = null
    selectedToken.value = null
    return
  }

  // 检查是否选择了交易所
  if (!formData.value.exchange_name) {
    showError('请先选择交易所')
    return
  }

  // 用户正在输入，清空之前的选择
  formData.value.token = null
  selectedToken.value = null

  tokenSearching.value = true
  showTokenResults.value = true

  searchTimeout = setTimeout(async () => {
    try {
      // 添加交易所参数，只搜索该交易所支持的代币
      const response = await apiRequest(
        `${API_ENDPOINTS.AI_STRATEGY_SEARCH_TOKEN}?q=${query}&exchange=${formData.value.exchange_name}`
      )

      if (response.status === 'success') {
        tokenSearchResults.value = response.data.results || []

        // 如果没有搜索结果，显示提示
        if (tokenSearchResults.value.length === 0) {
          console.log(`⚠️ 在 ${formData.value.exchange_name} 上未找到 "${query}"`)
        }
      } else {
        tokenSearchResults.value = []
      }
    } catch (error) {
      console.error('搜索代币失败:', error)
      tokenSearchResults.value = []
      showError('搜索代币失败，请重试')
    } finally {
      tokenSearching.value = false
    }
  }, 300)
}

const handleTokenInputFocus = async () => {
  showTokenResults.value = true

  // 如果输入框为空且已选择交易所API，加载持仓代币
  if (!tokenSearchQuery.value.trim() && formData.value.exchange_api && selectedExchangeAPI.value) {
    await loadAccountTokens()
  }
}

const handleTokenInputBlur = () => {
  // 延迟隐藏下拉框，以便点击下拉框中的选项时能够正常触发
  setTimeout(() => {
    showTokenResults.value = false
  }, 200)
}

// 加载账户持仓代币
const loadAccountTokens = async () => {
  if (!selectedExchangeAPI.value) {
    return
  }

  try {
    tokenSearching.value = true

    const snapshot = selectedExchangeAPI.value.balance_snapshot
    if (!snapshot || typeof snapshot !== 'object') {
      tokenSearchResults.value = []
      return
    }

    // 收集所有有余额的代币符号
    const tokenSymbols = new Set()

    // 从现货账户收集
    if (snapshot.spot && typeof snapshot.spot === 'object') {
      Object.keys(snapshot.spot).forEach(symbol => {
        const rawValue = snapshot.spot[symbol]

        // 如果是对象，可能包含 free, used, total 等字段
        let balance = 0
        if (typeof rawValue === 'object' && rawValue !== null) {
          balance = parseFloat(rawValue.total || rawValue.free || rawValue.available || 0)
        } else {
          balance = parseFloat(rawValue)
        }

        if (!isNaN(balance) && balance > 0) {
          tokenSymbols.add(symbol)
        }
      })
    }

    // 从合约账户收集
    if (snapshot.future && typeof snapshot.future === 'object') {
      Object.keys(snapshot.future).forEach(symbol => {
        const rawValue = snapshot.future[symbol]

        // 如果是对象，可能包含 free, used, total 等字段
        let balance = 0
        if (typeof rawValue === 'object' && rawValue !== null) {
          balance = parseFloat(rawValue.total || rawValue.free || rawValue.available || 0)
        } else {
          balance = parseFloat(rawValue)
        }

        if (!isNaN(balance) && balance > 0) {
          tokenSymbols.add(symbol)
        }
      })
    }

    if (tokenSymbols.size === 0) {
      tokenSearchResults.value = []
      return
    }

    // 搜索这些代币的详细信息
    const tokens = []
    for (const symbol of tokenSymbols) {
      try {
        const response = await apiRequest(
          `${API_ENDPOINTS.AI_STRATEGY_SEARCH_TOKEN}?q=${symbol}&exchange=${formData.value.exchange_name}`
        )

        if (response.status === 'success' && response.data.results && response.data.results.length > 0) {
          const token = response.data.results[0]

          // 添加余额信息（从现货和合约账户累加）
          let totalBalance = 0

          // 从现货账户获取余额
          if (snapshot.spot && snapshot.spot[symbol]) {
            const spotValue = snapshot.spot[symbol]
            if (typeof spotValue === 'object' && spotValue !== null) {
              totalBalance += parseFloat(spotValue.total || spotValue.free || 0)
            } else {
              totalBalance += parseFloat(spotValue) || 0
            }
          }

          // 从合约账户获取余额
          if (snapshot.future && snapshot.future[symbol]) {
            const futureValue = snapshot.future[symbol]
            if (typeof futureValue === 'object' && futureValue !== null) {
              totalBalance += parseFloat(futureValue.total || futureValue.free || 0)
            } else {
              totalBalance += parseFloat(futureValue) || 0
            }
          }

          token.balance = totalBalance
          tokens.push(token)
        }
      } catch (error) {
        console.error(`搜索代币 ${symbol} 失败:`, error)
      }
    }

    // 按余额价值排序（余额 * 价格）
    tokens.sort((a, b) => {
      const valueA = (a.balance || 0) * (a.current_price || 0)
      const valueB = (b.balance || 0) * (b.current_price || 0)
      return valueB - valueA
    })

    tokenSearchResults.value = tokens
    console.log('✅ 加载持仓代币成功:', tokens.length, '个')
  } catch (error) {
    console.error('加载持仓代币失败:', error)
    tokenSearchResults.value = []
  } finally {
    tokenSearching.value = false
  }
}

const clearTokenSelection = () => {
  selectedToken.value = null
  formData.value.token = null
  tokenSearchQuery.value = ''
  tokenSearchResults.value = []
  showTokenResults.value = false
}

const selectToken = (token) => {
  selectedToken.value = token
  formData.value.token = token.id
  tokenSearchQuery.value = `${token.symbol} - ${token.name}`
  showTokenResults.value = false
  tokenSearchResults.value = []
}

const quickSelectToken = async (symbol) => {
  if (!formData.value.exchange_name) {
    showError('请先选择交易所')
    return
  }

  tokenSearching.value = true
  showTokenResults.value = true

  try {
    const response = await apiRequest(
      `${API_ENDPOINTS.AI_STRATEGY_SEARCH_TOKEN}?q=${symbol}&exchange=${formData.value.exchange_name}`
    )

    if (response.status === 'success' && response.data.results && response.data.results.length > 0) {
      const token = response.data.results[0]
      selectToken(token)
    } else {
      showError(`未找到 ${symbol}`)
    }
  } catch (error) {
    console.error('快速选择代币失败:', error)
    showError('快速选择代币失败，请重试')
  } finally {
    tokenSearching.value = false
  }
}

// 提醒模式配置
const alertConfig = ref({
  mode: 'state_change',  // 默认：状态变化提醒
  cooldown_minutes: 30   // 默认：30分钟冷却
})

// 价格提醒配置
const priceAlertConfig = ref({
  condition: 'above',
  target_price: ''
})

// 指标信号提醒配置（新的多指标格式）
const selectedIndicators = ref([])
const indicatorLogic = ref('AND')
const indicatorsConfig = ref({})

// 保留旧的单指标配置（向后兼容）
const indicatorAlertType = ref('rsi')

const rsiConfig = ref({
  period: 14,
  overbought: 70,
  oversold: 30
})

const macdConfig = ref({
  fast: 12,
  slow: 26,
  signal: 9
})

const maCrossConfig = ref({
  fast: 7,
  slow: 25
})

const atrConfig = ref({
  period: 14,
  multiplier: 2.0
})

const volumeConfig = ref({
  multiplier: 2.0,
  period: 20
})

const timeframesConfig = ref({
  primary: '1h',
  confirm: [],
  require_all_confirm: false,
  min_confirm_count: 1
})

// 信号质量控制配置
const signalQualityConfig = ref({
  signal_confirmation_bars: 1,      // 默认：1根K线确认
  signal_expiration_hours: 24,      // 默认：24小时过期
  signal_strength_threshold: 60     // 默认：60分强度阈值
})

// 波动性配置
const volatilityConfig = ref({
  volatility_threshold: 5.0,
  volatility_period: 20
})

// 成交量提醒配置（独立的成交量提醒类型，不是指标）
const volumeAlertConfig = ref({
  volume_multiplier: 2.0,
  volume_period: 20
})

// 切换确认时间周期
const toggleConfirmTimeframe = (value) => {
  const confirm = [...timeframesConfig.value.confirm]
  const index = confirm.indexOf(value)
  if (index > -1) {
    confirm.splice(index, 1)
  } else {
    confirm.push(value)
  }
  timeframesConfig.value.confirm = confirm
}

// 自动生成机器人名称
const autoGeneratedName = computed(() => {
  const parts = []

  // 交易所名称
  if (selectedExchange.value) {
    parts.push(selectedExchange.value.label)
  }

  // 代币符号
  if (selectedToken.value && selectedToken.value.symbol) {
    parts.push(selectedToken.value.symbol)
  }

  // 信号类型
  if (formData.value.signal_type) {
    // 如果是指标信号提醒
    if (formData.value.signal_type === 'indicator_alert') {
      // 优先使用多指标组合
      if (selectedIndicators.value && selectedIndicators.value.length > 0) {
        const indicatorLabels = {
          'rsi': 'RSI',
          'macd': 'MACD',
          'ma_crossover': 'MA交叉',
          'atr': 'ATR',
          'volume': '成交量'
        }

        // 如果是多个指标，显示组合
        if (selectedIndicators.value.length > 1) {
          const indicatorNames = selectedIndicators.value.map(type => indicatorLabels[type] || type)
          parts.push(`${indicatorNames.join('+')}组合`)
        } else {
          // 单个指标
          parts.push(indicatorLabels[selectedIndicators.value[0]] || '指标')
        }
      } else if (indicatorAlertType.value) {
        // 兼容旧的单指标格式
        const indicatorLabels = {
          'rsi': 'RSI',
          'macd': 'MACD',
          'ma_crossover': 'MA交叉',
          'atr': 'ATR'
        }
        parts.push(indicatorLabels[indicatorAlertType.value] || '指标信号提醒')
      } else {
        parts.push('指标信号提醒')
      }
    } else {
      const signalTypeLabels = {
        price_alert: '价格提醒',
        indicator_alert: '指标信号提醒',
        volatility: '波动性提醒',
        volume: '成交量/持仓提醒'
      }
      parts.push(signalTypeLabels[formData.value.signal_type] || formData.value.signal_type)
    }
  }

  return parts.length > 0 ? parts.join(' - ') : '未命名信号机器人'
})

// 自动生成机器人描述
const autoGeneratedDescription = computed(() => {
  const parts = []

  // 基本信息
  if (selectedExchange.value && selectedToken.value && selectedToken.value.symbol) {
    parts.push(`监控 ${selectedExchange.value.label} 交易所的 ${selectedToken.value.symbol}/${formData.value.trading_pair || 'USDT'} 交易对`)
  }

  // 信号类型和指标配置
  if (formData.value.signal_type === 'indicator_alert') {
    // 多指标组合
    if (selectedIndicators.value && selectedIndicators.value.length > 0) {
      const indicatorLabels = {
        'rsi': 'RSI',
        'macd': 'MACD',
        'ma_crossover': 'MA交叉',
        'atr': 'ATR',
        'volume': '成交量'
      }

      if (selectedIndicators.value.length > 1) {
        const indicatorNames = selectedIndicators.value.map(type => indicatorLabels[type] || type)
        const logicText = indicatorLogic.value === 'AND' ? '全部满足' : '任一满足'
        parts.push(`使用 ${indicatorNames.join('+')} 组合策略（${logicText}）`)
      } else {
        const indicatorName = indicatorLabels[selectedIndicators.value[0]] || selectedIndicators.value[0]
        parts.push(`使用 ${indicatorName} 指标`)
      }

      // 添加时间周期信息
      if (timeframesConfig.value?.primary) {
        const timeframeLabels = {
          '1m': '1分钟', '5m': '5分钟', '15m': '15分钟', '30m': '30分钟',
          '1h': '1小时', '4h': '4小时', '1d': '日线', '1w': '周线'
        }
        parts.push(`主周期 ${timeframeLabels[timeframesConfig.value.primary] || timeframesConfig.value.primary}`)
      }
    } else if (indicatorAlertType.value) {
      // 兼容旧的单指标格式
      const indicatorLabels = {
        'rsi': 'RSI',
        'macd': 'MACD',
        'ma_crossover': 'MA交叉',
        'atr': 'ATR'
      }
      parts.push(`使用 ${indicatorLabels[indicatorAlertType.value] || indicatorAlertType.value} 指标`)
    }
  } else if (formData.value.signal_type) {
    const signalTypeLabels = {
      'price_alert': '价格提醒',
      'volatility': '波动性提醒',
      'volume': '成交量/持仓提醒'
    }
    parts.push(signalTypeLabels[formData.value.signal_type] || formData.value.signal_type)
  }

  // 检查间隔
  if (formData.value.check_interval) {
    const intervalLabels = {
      '1m': '每分钟',
      '5m': '每5分钟',
      '15m': '每15分钟',
      '30m': '每30分钟',
      '1h': '每小时'
    }
    parts.push(`${intervalLabels[formData.value.check_interval] || formData.value.check_interval}检查一次`)
  }

  return parts.length > 0 ? parts.join('，') : '暂无描述'
})

// 使用自动生成的名称
const useAutoGeneratedName = () => {
  formData.value.name = autoGeneratedName.value
}

// 使用自动生成的描述
const useAutoGeneratedDescription = () => {
  formData.value.description = autoGeneratedDescription.value
}

// 处理 AI 升级要求
const handleAIUpgradeRequired = () => {
  if (upgradeMembershipModal.value) {
    upgradeMembershipModal.value.show()
  }
}

// 监听信号类型变化，价格提醒时自动关闭AI分析
watch(() => formData.value.signal_type, (newType) => {
  if (newType === 'price_alert') {
    formData.value.use_advanced_analysis = false
  }
})

// 加载机器人数据（编辑模式）
const loadBotData = async () => {
  try {
    const botId = route.params.id
    const response = await botAPI.getBotDetail(botId)
    console.log('API 响应:', response)

    // 处理不同的响应格式
    const bot = response.data || response
    console.log('加载的机器人数据:', bot)

    // 保存机器人运行状态
    isBotRunning.value = bot.is_running || bot.status === 'running'

    // 填充表单数据
    formData.value.name = bot.name || ''
    formData.value.description = bot.description || ''

    // 设置交易所
    if (bot.exchange_name) {
      formData.value.exchange_name = bot.exchange_name
      selectedExchangeType.value = bot.exchange_name
    }

    // 设置交易所API
    if (bot.exchange_api) {
      formData.value.exchange_api = typeof bot.exchange_api === 'object' ? bot.exchange_api.id : bot.exchange_api
    }

    formData.value.token = typeof bot.token === 'object' ? bot.token.id : bot.token
    formData.value.trading_pair = bot.trading_pair || 'USDT'
    formData.value.timeframe = bot.timeframe || '1h'
    formData.value.signal_type = bot.signal_bot?.signal_type || bot.signal_type || 'price_alert'
    formData.value.notify_email = bot.signal_bot?.notify_email ?? true
    formData.value.notify_app = bot.signal_bot?.notify_app ?? true
    formData.value.check_interval = bot.signal_bot?.check_interval || '5m'

    // 设置选中的代币
    if (bot.token && bot.token_symbol) {
      selectedToken.value = {
        id: typeof bot.token === 'object' ? bot.token.id : bot.token,
        symbol: bot.token_symbol,
        name: bot.token_name,
        logo: bot.token_logo,
        current_price: bot.token_current_price || 0
      }
      tokenSearchQuery.value = `${bot.token_symbol} - ${bot.token_name}`
    }

    // 加载配置
    const config = bot.config || {}

    // 加载 AI 分析模式配置
    formData.value.use_advanced_analysis = config.use_advanced_analysis || false

    // 加载提醒模式和冷却时间
    alertConfig.value.mode = config.alert_mode || 'one_shot'
    alertConfig.value.cooldown_minutes = config.cooldown_minutes || 30

    // 根据信号类型加载配置
    if (formData.value.signal_type === 'price_alert') {
      const priceAlert = config.price_alert || {}
      priceAlertConfig.value = {
        condition: priceAlert.condition || 'above',
        target_price: priceAlert.target_price ? String(priceAlert.target_price) : ''
      }
    } else if (formData.value.signal_type === 'indicator_alert') {
      const indicatorAlert = config.indicator_alert || {}

      // 检查是否是新的多指标格式
      if (indicatorAlert.indicators && Array.isArray(indicatorAlert.indicators)) {
        // 新的多指标格式
        indicatorLogic.value = indicatorAlert.logic || 'AND'
        selectedIndicators.value = indicatorAlert.indicators.map(ind => ind.type)

        // 构建 indicatorsConfig
        const newIndicatorsConfig = {}
        indicatorAlert.indicators.forEach(ind => {
          newIndicatorsConfig[ind.type] = {
            type: ind.type,
            enabled: ind.enabled !== false,
            weight: ind.weight || 1,
            params: ind.params || {}
          }
        })
        indicatorsConfig.value = newIndicatorsConfig
      } else {
        // 🔄 旧的单指标格式 → 自动转换为新的多指标格式
        const indicatorType = indicatorAlert.indicator_type || 'rsi'

        console.log('⚠️ 检测到旧版配置格式，自动转换为新的多指标格式')

        // 设置为多指标模式
        indicatorLogic.value = 'OR'  // 单指标使用 OR 逻辑
        selectedIndicators.value = [indicatorType]

        // 根据指标类型构建新格式的配置
        let params = {}
        if (indicatorType === 'rsi') {
          params = {
            period: indicatorAlert.period || 14,
            overbought: indicatorAlert.overbought || 70,
            oversold: indicatorAlert.oversold || 30
          }
        } else if (indicatorType === 'macd') {
          params = {
            fast: indicatorAlert.fast || 12,
            slow: indicatorAlert.slow || 26,
            signal: indicatorAlert.signal || 9
          }
        } else if (indicatorType === 'ma_crossover') {
          params = {
            fast: indicatorAlert.fast || 7,
            slow: indicatorAlert.slow || 25
          }
        } else if (indicatorType === 'ema_cross') {
          params = {
            fast: indicatorAlert.fast || 9,
            slow: indicatorAlert.slow || 21
          }
        } else if (indicatorType === 'atr') {
          params = {
            period: indicatorAlert.period || 14,
            multiplier: indicatorAlert.multiplier || 2.0
          }
        } else if (indicatorType === 'volume') {
          params = {
            multiplier: indicatorAlert.multiplier || 2.0,
            period: indicatorAlert.period || 20
          }
        }

        // 构建新格式的 indicatorsConfig
        indicatorsConfig.value = {
          [indicatorType]: {
            type: indicatorType,
            enabled: true,
            weight: 100,  // 单指标权重100%
            params: params
          }
        }

        console.log('✅ 旧版配置已转换:', {
          indicatorType,
          params,
          newConfig: indicatorsConfig.value
        })
      }

      // 加载时间周期配置
      const timeframesConf = config.timeframes_config || {}
      timeframesConfig.value = {
        primary: timeframesConf.primary || '1h',
        confirm: timeframesConf.confirm || [],
        require_all_confirm: timeframesConf.require_all_confirm || false,
        min_confirm_count: timeframesConf.min_confirm_count || 1
      }
    } else if (formData.value.signal_type === 'volatility') {
      const volatilityAlert = config.volatility_alert || {}
      volatilityConfig.value = {
        volatility_threshold: volatilityAlert.volatility_threshold || 5.0,
        volatility_period: volatilityAlert.volatility_period || 20
      }

      // 加载时间周期配置
      const timeframesConf = config.timeframes_config || {}
      timeframesConfig.value = {
        primary: timeframesConf.primary || '1h',
        confirm: timeframesConf.confirm || [],
        require_all_confirm: timeframesConf.require_all_confirm || false,
        min_confirm_count: timeframesConf.min_confirm_count || 1
      }
    } else if (formData.value.signal_type === 'volume') {
      const volumeAlert = config.volume_alert || {}
      volumeAlertConfig.value = {
        volume_multiplier: volumeAlert.volume_multiplier || 2.0,
        volume_period: volumeAlert.volume_period || 20
      }

      // 加载时间周期配置
      const timeframesConf = config.timeframes_config || {}
      timeframesConfig.value = {
        primary: timeframesConf.primary || '1h',
        confirm: timeframesConf.confirm || [],
        require_all_confirm: timeframesConf.require_all_confirm || false,
        min_confirm_count: timeframesConf.min_confirm_count || 1
      }
    }

    // 加载信号质量控制配置（从 signal_bot 对象中加载）
    if (bot.signal_bot) {
      signalQualityConfig.value = {
        signal_confirmation_bars: bot.signal_bot.signal_confirmation_bars || 1,
        signal_expiration_hours: bot.signal_bot.signal_expiration_hours || 24,
        signal_strength_threshold: bot.signal_bot.signal_strength_threshold || 60
      }
    }

    // 加载多时间周期配置（从 signal_bot 对象中加载）
    if (bot.signal_bot && bot.signal_bot.timeframes_config) {
      const timeframesConf = bot.signal_bot.timeframes_config
      timeframesConfig.value = {
        primary: timeframesConf.primary || '1h',
        confirm: timeframesConf.confirm || [],
        require_all_confirm: timeframesConf.require_all_confirm || false,
        min_confirm_count: timeframesConf.min_confirm_count || 1
      }
    }

  } catch (error) {
    console.error('加载机器人数据失败:', error)
    showError('加载机器人数据失败')
    router.push('/signal-bots')
  }
}

// 初始化
onMounted(async () => {
  try {
    // 加载交易所列表
    const exchangesResponse = await exchangeAPI.getSupportedExchanges()
    if (exchangesResponse.success) {
      availableExchanges.value = exchangesResponse.data
    }

    // 加载交易所API列表
    const exchangeAPIsResponse = await exchangeAPI.getExchangeList()
    if (exchangeAPIsResponse.success && exchangeAPIsResponse.data) {
      availableExchangeAPIs.value = exchangeAPIsResponse.data.results || exchangeAPIsResponse.data
    }

    // 如果是编辑模式，加载机器人数据
    if (isEditMode.value) {
      await loadBotData()
    }
  } catch (error) {
    console.error('初始化失败:', error)
    showError('加载数据失败')
  }
})
</script>