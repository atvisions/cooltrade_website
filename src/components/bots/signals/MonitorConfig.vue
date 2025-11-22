<template>
  <!-- 监控配置 -->
  <Card variant="default" class="mb-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">监控配置</h2>
        <p class="text-sm text-slate-500">选择要监控的交易对和时间周期</p>
      </div>
    </div>
    <div class="space-y-6">
      <!-- 交易所选择（两级联动） -->
      <div class="space-y-4">
        <!-- 选择交易所 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            选择交易所 <span class="text-red-500">*</span>
            <span class="text-xs text-slate-500 ml-2">选择要监控的交易所</span>
          </label>

          <!-- 交易所列表 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="exchange in availableExchanges"
              :key="exchange.value"
              type="button"
              @click="selectExchangeType(exchange.value)"
              :class="[
                'flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all',
                selectedExchangeType === exchange.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              ]"
            >
              <img
                :src="exchange.logo"
                :alt="exchange.label"
                class="w-12 h-12 rounded-lg mb-2 object-contain"
                @error="handleImageError"
              />
              <div class="font-medium text-slate-900 text-sm">
                {{ exchange.label }}
              </div>
              <svg
                v-if="selectedExchangeType === exchange.value"
                class="h-5 w-5 text-blue-500 mt-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <p v-if="errors.exchange_name" class="mt-1 text-sm text-red-500">{{ errors.exchange_name }}</p>
        </div>

        <!-- 选择交易所API账号 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-slate-700">
              选择交易所API账号 <span class="text-red-500">*</span>
              <span class="text-xs text-slate-500 ml-2">用于获取市场数据和执行交易</span>
            </label>
            <button
              v-if="formData.exchange_name && filteredExchangeAPIs.length === 0"
              type="button"
              @click="$router.push('/settings/exchanges')"
              class="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              添加交易所 API
            </button>
          </div>
          <Listbox v-model="formData.exchange_api" :disabled="!formData.exchange_name || filteredExchangeAPIs.length === 0">
            <div class="relative">
              <ListboxButton :class="[
                'relative w-full cursor-default rounded-lg py-2.5 pl-4 pr-10 text-left border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                !formData.exchange_name || filteredExchangeAPIs.length === 0
                  ? 'bg-slate-50 opacity-50 cursor-not-allowed'
                  : 'bg-white hover:border-slate-400'
              ]">
                <div class="flex items-center gap-3">
                  <img
                    v-if="selectedExchangeAPI"
                    :src="getExchangeLogo(selectedExchangeAPI.exchange)"
                    :alt="selectedExchangeAPI.exchange"
                    class="w-6 h-6 rounded object-contain flex-shrink-0"
                    @error="handleImageError"
                  />
                  <div v-else class="w-6 h-6 rounded bg-slate-200 flex-shrink-0 flex items-center justify-center">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <span class="block truncate text-sm text-slate-700">
                      <template v-if="selectedExchangeAPI">
                        {{ selectedExchangeAPI.exchange_display || selectedExchangeAPI.exchange }} - {{ selectedExchangeAPI.name }}
                        <span
                          :class="[
                            'text-xs px-2 py-0.5 rounded-full whitespace-nowrap ml-2',
                            selectedExchangeAPI.is_testnet
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          ]"
                        >
                          {{ selectedExchangeAPI.is_testnet ? '模拟' : '真实' }}
                        </span>
                      </template>
                      <template v-else>
                        请选择交易所API账号
                      </template>
                    </span>
                  </div>
                </div>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions v-if="formData.exchange_name && filteredExchangeAPIs.length > 0" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="api in filteredExchangeAPIs"
                    :key="api.id"
                    :value="api.id"
                    as="template"
                  >
                    <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-10']">
                      <div class="flex items-center gap-3">
                        <img
                          :src="getExchangeLogo(api.exchange)"
                          :alt="api.exchange"
                          class="w-6 h-6 rounded object-contain flex-shrink-0"
                          @error="handleImageError"
                        />
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 mb-1">
                            <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                              {{ api.name }}
                            </span>
                            <span
                              :class="[
                                'text-xs px-2 py-0.5 rounded-full whitespace-nowrap',
                                api.is_testnet
                                  ? 'bg-orange-100 text-orange-700 font-medium'
                                  : 'bg-green-100 text-green-700 font-medium'
                              ]"
                            >
                              {{ api.is_testnet ? '模拟账户' : '真实账户' }}
                            </span>
                          </div>
                          <div class="text-xs text-slate-500 truncate">
                            {{ api.exchange_display || api.exchange }}
                            <template v-if="getBalanceDisplay(api) !== '未同步'">
                              · 余额: {{ getBalanceDisplay(api) }}
                            </template>
                          </div>
                        </div>
                      </div>
                      <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
          <p v-if="errors.exchange_api" class="mt-1 text-sm text-red-500">{{ errors.exchange_api }}</p>
          <p v-if="!formData.exchange_name" class="mt-1 text-sm text-orange-500">请先选择交易所</p>
          <p v-else-if="filteredExchangeAPIs.length === 0" class="mt-1 text-sm text-orange-500">
            该交易所暂无可用的API账号，请先在"交易所管理"中添加
          </p>
        </div>
      </div>

      <!-- 代币和计价币种 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 代币搜索 -->
        <div class="md:col-span-3 token-search-container">
          <label class="block text-sm font-medium text-slate-700 mb-2">
            代币 <span class="text-red-500">*</span>
            <span v-if="!formData.exchange_name" class="text-xs text-orange-500 ml-2">请先选择交易所</span>
            <span v-else class="text-xs text-slate-500 ml-2">只显示 {{ selectedExchange?.label }} 支持的代币</span>
          </label>
          <div class="relative">
            <!-- 代币 Logo（选中时显示） -->
            <img
              v-if="selectedToken"
              :src="selectedToken.logo"
              :alt="selectedToken.symbol"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full object-contain pointer-events-none z-10"
              @error="handleImageError"
            />
            <input
              :value="tokenSearchQuery"
              @input="handleTokenInput"
              @focus="handleTokenInputFocus"
              @blur="handleTokenInputBlur"
              type="text"
              :placeholder="formData.exchange_name ? '搜索代币 (如: BTC, ETH)' : '请先选择交易所'"
              :disabled="!formData.exchange_name"
              :class="[
                'w-full py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed',
                selectedToken ? 'pl-12' : 'pl-4'
              ]"
            />
            <!-- 清除按钮 -->
            <button
              v-if="selectedToken"
              type="button"
              @click="clearTokenSelection"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10"
              title="清除选择"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div
              v-if="showTokenResults"
              class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <div v-if="tokenSearching" class="p-4 text-center text-slate-500">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  搜索中...
                </div>
              </div>
              <div v-else-if="tokenSearchResults.length === 0" class="p-4 text-center">
                <div class="text-slate-400 mb-2">
                  <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="text-slate-600 font-medium">
                  {{ tokenSearchQuery.trim() ? '未找到相关代币' : '暂无持仓代币' }}
                </div>
                <div class="text-xs text-slate-500 mt-1">
                  {{ tokenSearchQuery.trim()
                    ? `${selectedExchange?.label} 不支持该代币`
                    : '请输入代币名称或符号进行搜索'
                  }}
                </div>
              </div>
              <div v-else>
                <button
                  v-for="token in tokenSearchResults"
                  :key="token.id"
                  type="button"
                  @click="selectToken(token)"
                  class="w-full flex items-center p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
                >
                  <img
                    :src="token.logo"
                    :alt="token.symbol"
                    class="w-8 h-8 rounded-full mr-3 object-contain flex-shrink-0"
                    @error="handleImageError"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-slate-900">{{ token.symbol }}</span>
                      <span v-if="token.balance" class="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        持仓
                      </span>
                    </div>
                    <div class="text-xs text-slate-500">{{ token.name }}</div>
                    <div v-if="token.balance" class="text-xs text-green-600 mt-0.5">
                      余额: {{ formatBalance(token.balance) }} {{ token.symbol }}
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0 ml-3">
                    <div class="text-sm text-slate-600">
                      ${{ formatPrice(token.current_price) }}
                    </div>
                    <div v-if="token.balance && token.current_price" class="text-xs text-slate-500 mt-0.5">
                      ≈ ${{ formatPrice(token.balance * token.current_price) }}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <!-- 热门代币快捷选择 -->
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="popularToken in popularTokens"
              :key="popularToken"
              type="button"
              @click="quickSelectToken(popularToken)"
              class="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              {{ popularToken }}
            </button>
          </div>
          <p v-if="errors.token" class="mt-1 text-sm text-red-500">{{ errors.token }}</p>
        </div>

        <!-- 计价币种 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            计价币种
          </label>
          <Select
            v-model="formData.trading_pair"
            :options="availableQuoteAssets"
            placeholder="选择"
          />
          <p v-if="errors.trading_pair" class="mt-1 text-sm text-red-500">{{ errors.trading_pair }}</p>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import Card from '../../common/ui/Card.vue'
import Select from '../../common/ui/Select.vue'

// Props - 从父组件接收数据
const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  availableExchanges: {
    type: Array,
    default: () => []
  },
  selectedExchangeType: {
    type: String,
    default: ''
  },
  filteredExchangeAPIs: {
    type: Array,
    default: () => []
  },
  selectedExchangeAPI: {
    type: Object,
    default: null
  },
  selectedExchange: {
    type: Object,
    default: null
  },
  tokenSearchQuery: {
    type: String,
    default: ''
  },
  tokenSearchResults: {
    type: Array,
    default: () => []
  },
  tokenSearching: {
    type: Boolean,
    default: false
  },
  showTokenResults: {
    type: Boolean,
    default: false
  },
  selectedToken: {
    type: Object,
    default: null
  },
  popularTokens: {
    type: Array,
    default: () => ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'MATIC']
  },
  availableQuoteAssets: {
    type: Array,
    default: () => []
  }
})

// Emits - 向父组件发送事件
const emit = defineEmits([
  'selectExchangeType',
  'handleTokenSearch',
  'handleTokenInputFocus',
  'handleTokenInputBlur',
  'clearTokenSelection',
  'selectToken',
  'quickSelectToken',
  'update:formData',
  'update:tokenSearchQuery'
])

// 方法代理 - 将事件转发给父组件
const selectExchangeType = (exchangeType) => {
  emit('selectExchangeType', exchangeType)
}

const handleTokenInput = (event) => {
  const value = event.target.value
  emit('update:tokenSearchQuery', value)
  emit('handleTokenSearch')
}

const handleTokenSearch = () => {
  emit('handleTokenSearch')
}

const handleTokenInputFocus = () => {
  emit('handleTokenInputFocus')
}

const handleTokenInputBlur = () => {
  emit('handleTokenInputBlur')
}

const clearTokenSelection = () => {
  emit('clearTokenSelection')
}

const selectToken = (token) => {
  emit('selectToken', token)
}

const quickSelectToken = (symbol) => {
  emit('quickSelectToken', symbol)
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/40?text=Logo'
}

const getExchangeLogo = (exchange) => {
  const exchangeObj = props.availableExchanges.find(ex => ex.value === exchange)
  return exchangeObj?.logo || ''
}

const getBalanceDisplay = (api) => {
  if (!api || !api.balance_snapshot || typeof api.balance_snapshot !== 'object') {
    return '未同步'
  }

  const snapshot = api.balance_snapshot

  // 新格式：包含 spot 和 future，优先使用 total_usd
  if (snapshot.total_usd !== undefined && snapshot.total_usd !== null) {
    const totalUsd = parseFloat(snapshot.total_usd)
    if (!isNaN(totalUsd) && totalUsd > 0) {
      return `$${totalUsd.toFixed(2)}`
    }
  }

  // 尝试从现货账户获取余额
  if (snapshot.spot && typeof snapshot.spot === 'object') {
    const spotKeys = Object.keys(snapshot.spot)
    if (spotKeys.length > 0) {
      // 优先显示 USDT
      if (snapshot.spot.USDT !== undefined && snapshot.spot.USDT !== null) {
        let usdtBalance = 0
        const spotValue = snapshot.spot.USDT

        // 如果是对象，可能包含 free, used, total 等字段
        if (typeof spotValue === 'object' && spotValue !== null) {
          usdtBalance = parseFloat(spotValue.total || spotValue.free || spotValue.available || 0)
        } else {
          usdtBalance = parseFloat(spotValue)
        }

        if (!isNaN(usdtBalance) && usdtBalance > 0) {
          return `${usdtBalance.toFixed(2)} USDT`
        }
      }

      // 否则显示第一个有余额的币种
      for (const currency of spotKeys) {
        const spotValue = snapshot.spot[currency]
        let balance = 0

        if (typeof spotValue === 'object' && spotValue !== null) {
          balance = parseFloat(spotValue.total || spotValue.free || spotValue.available || 0)
        } else {
          balance = parseFloat(spotValue)
        }

        if (!isNaN(balance) && balance > 0) {
          return `${balance.toFixed(2)} ${currency}`
        }
      }
    }
  }

  // 如果现货没有余额，尝试合约账户
  if (snapshot.future && typeof snapshot.future === 'object') {
    const futureKeys = Object.keys(snapshot.future)
    if (futureKeys.length > 0) {
      // 优先显示 USDT
      if (snapshot.future.USDT !== undefined && snapshot.future.USDT !== null) {
        let usdtBalance = 0
        const futureValue = snapshot.future.USDT

        // 如果是对象，可能包含 free, used, total 等字段
        if (typeof futureValue === 'object' && futureValue !== null) {
          usdtBalance = parseFloat(futureValue.total || futureValue.free || futureValue.available || 0)
        } else {
          usdtBalance = parseFloat(futureValue)
        }

        if (!isNaN(usdtBalance) && usdtBalance > 0) {
          return `${usdtBalance.toFixed(2)} USDT`
        }
      }

      // 否则显示第一个有余额的币种
      for (const currency of futureKeys) {
        const futureValue = snapshot.future[currency]
        let balance = 0

        if (typeof futureValue === 'object' && futureValue !== null) {
          balance = parseFloat(futureValue.total || futureValue.free || futureValue.available || 0)
        } else {
          balance = parseFloat(futureValue)
        }

        if (!isNaN(balance) && balance > 0) {
          return `${balance.toFixed(2)} ${currency}`
        }
      }
    }
  }

  return '未同步'
}

const formatBalance = (balance) => {
  if (!balance) return '0'
  const num = parseFloat(balance)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`
  } else if (num >= 1) {
    return num.toFixed(2)
  } else {
    return num.toFixed(6)
  }
}

const formatPrice = (price) => {
  if (!price) return '0'
  const num = parseFloat(price)
  if (num >= 1) {
    return num.toFixed(2)
  } else {
    return num.toFixed(6)
  }
}
</script>

