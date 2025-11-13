<template>
  <div class="w-full">
    <!-- 标签 -->
    <label v-if="label" :for="id" class="block text-sm font-medium text-slate-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
      <span v-if="loading" class="text-xs text-blue-500 ml-2">加载中...</span>
    </label>

    <!-- Combobox 容器 -->
    <Combobox
      :model-value="modelValue"
      @update:model-value="handleChange"
      :disabled="disabled || loading"
      nullable
    >
      <div class="relative">
        <!-- 输入框 -->
        <div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-colors">
          <!-- 选中项显示（混合布局） - 只在未聚焦时显示 -->
          <div v-if="selectedOption && !isInputFocused" class="absolute inset-y-0 left-0 right-0 flex flex-col justify-center pl-3 pr-10 pointer-events-none bg-white">
            <!-- 第一行：Logo + 交易对 + 价格 -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <img
                  v-if="getOptionLogo(selectedOption)"
                  :src="getOptionLogo(selectedOption)"
                  :alt="getOptionSymbol(selectedOption)"
                  class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                  @error="handleImageError"
                />
                <span class="text-sm font-medium text-slate-900 truncate">{{ getOptionSymbol(selectedOption) }}</span>
              </div>
              <span v-if="getOptionPrice(selectedOption)" class="text-sm font-medium text-slate-900 flex-shrink-0">
                {{ getOptionPrice(selectedOption) }}
              </span>
            </div>

            <!-- 第二行：余额信息 -->
            <div class="text-xs text-slate-500 mt-1 truncate">
              {{ getBalanceDisplay(selectedOption) }}
            </div>
          </div>

          <ComboboxInput
            :class="[
              'w-full border-none py-3 text-slate-900 placeholder-slate-500 focus:outline-none bg-transparent',
              selectedOption && !isInputFocused ? 'text-transparent' : 'pl-3 pr-10',
              disabled || loading ? 'bg-slate-50 cursor-not-allowed' : ''
            ]"
            :placeholder="placeholder || '搜索或选择...'"
            @change="query = $event.target.value"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
            :displayValue="(option) => isInputFocused ? getDisplayValue(option) : ''"
          />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-auto">
            <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </ComboboxButton>
        </div>

        <!-- 下拉列表 -->
        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ComboboxOptions
            class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <!-- 无结果提示 -->
            <div v-if="filteredOptions.length === 0" class="relative cursor-default select-none py-2 px-4 text-slate-700">
              {{ emptyMessage || '没有找到匹配的选项' }}
            </div>

            <!-- 有余额的选项（显示在前面） -->
            <div v-if="optionsWithBalance.length > 0">
              <div class="px-3 py-1 text-xs font-semibold text-slate-500 bg-slate-50">有余额</div>
              <ComboboxOption
                v-for="option in optionsWithBalance"
                :key="getOptionKey(option)"
                :value="option"
                v-slot="{ active, selected }"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-blue-50 text-blue-900' : 'text-slate-900',
                    'relative cursor-pointer select-none py-3 pl-10 pr-4'
                  ]"
                >
                  <!-- Logo -->
                  <img
                    v-if="getOptionLogo(option)"
                    :src="getOptionLogo(option)"
                    :alt="getOptionSymbol(option)"
                    class="absolute left-3 top-3 w-5 h-5 rounded-full object-cover"
                    @error="handleImageError"
                  />

                  <!-- 第一行：交易对 + 价格 -->
                  <div class="flex items-center justify-between mb-1">
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate text-sm']">
                      {{ getOptionSymbol(option) }}
                    </span>
                    <span v-if="getOptionPrice(option)" class="text-sm font-medium ml-2 flex-shrink-0">
                      {{ getOptionPrice(option) }}
                    </span>
                  </div>

                  <!-- 第二行：余额信息 -->
                  <div class="text-xs text-slate-500">
                    {{ getBalanceDisplay(option) }}
                  </div>

                  <!-- 选中标记 -->
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </li>
              </ComboboxOption>
            </div>

            <!-- 无余额的选项 -->
            <div v-if="optionsWithoutBalance.length > 0">
              <div v-if="optionsWithBalance.length > 0" class="px-3 py-1 text-xs font-semibold text-slate-500 bg-slate-50">其他</div>
              <ComboboxOption
                v-for="option in optionsWithoutBalance"
                :key="getOptionKey(option)"
                :value="option"
                v-slot="{ active, selected }"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-blue-50 text-blue-900' : 'text-slate-900',
                    'relative cursor-pointer select-none py-3 pl-10 pr-4'
                  ]"
                >
                  <!-- Logo -->
                  <img
                    v-if="getOptionLogo(option)"
                    :src="getOptionLogo(option)"
                    :alt="getOptionSymbol(option)"
                    class="absolute left-3 top-3 w-5 h-5 rounded-full object-cover"
                    @error="handleImageError"
                  />

                  <!-- 第一行：交易对 + 价格 -->
                  <div class="flex items-center justify-between mb-1">
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate text-sm']">
                      {{ getOptionSymbol(option) }}
                    </span>
                    <span v-if="getOptionPrice(option)" class="text-sm font-medium ml-2 flex-shrink-0">
                      {{ getOptionPrice(option) }}
                    </span>
                  </div>

                  <!-- 第二行：余额信息 -->
                  <div class="text-xs text-slate-500">
                    {{ getBalanceDisplay(option) }}
                  </div>

                  <!-- 选中标记 -->
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </li>
              </ComboboxOption>
            </div>
          </ComboboxOptions>
        </transition>
      </div>
    </Combobox>

    <!-- 错误提示 -->
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>

    <!-- 帮助文本 -->
    <p v-if="hint && !error" class="mt-1 text-sm text-slate-500">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/vue'

const props = defineProps({
  // 绑定值
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  // 选项列表
  options: {
    type: Array,
    default: () => []
  },
  // 选项标签字段
  optionLabel: {
    type: String,
    default: 'label'
  },
  // 选项值字段
  optionValue: {
    type: String,
    default: 'value'
  },
  // 余额字段（用于排序）
  balanceField: {
    type: String,
    default: 'balance'
  },
  // 标签
  label: String,
  // 占位符
  placeholder: String,
  // 禁用
  disabled: Boolean,
  // 加载中
  loading: Boolean,
  // 必填
  required: Boolean,
  // 错误信息
  error: String,
  // 帮助文本
  hint: String,
  // 空状态消息
  emptyMessage: String,
  // 自定义类名
  customClass: String,
  // ID
  id: {
    type: String,
    default: () => `combobox-${Math.random().toString(36).substring(2, 11)}`
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change'])

const query = ref('')
const isInputFocused = ref(false)

// 获取选中的选项
const selectedOption = computed(() => {
  if (!props.modelValue) return null
  return props.options.find(option => {
    if (typeof option === 'string' || typeof option === 'number') {
      return option === props.modelValue
    }
    return option[props.optionValue] === props.modelValue
  })
})

// 获取选项的显示值
const getDisplayValue = (option) => {
  if (!option) return ''
  if (typeof option === 'string' || typeof option === 'number') return option
  return option[props.optionLabel] || ''
}

// 获取选项的标签
const getOptionLabel = (option) => {
  if (typeof option === 'string' || typeof option === 'number') return option
  const label = option[props.optionLabel] || ''
  const balance = option[props.balanceField]
  if (balance && balance > 0) {
    return `${label} (余额: ${balance.toFixed(8)})`
  }
  return label
}

// 获取选项的唯一键
const getOptionKey = (option) => {
  if (typeof option === 'string' || typeof option === 'number') return option
  return option[props.optionValue] || option[props.optionLabel]
}

// 获取选项的 logo
const getOptionLogo = (option) => {
  if (!option || typeof option === 'string' || typeof option === 'number') return null
  return option.logo || null
}

// 获取选项的余额
const getOptionBalance = (option) => {
  if (!option || typeof option === 'string' || typeof option === 'number') return '0'
  const balance = option[props.balanceField] || 0
  if (balance > 0) {
    return `余额: ${balance.toFixed(8)}`
  }
  return '余额: 0'
}

// 获取选项的符号（交易对）
const getOptionSymbol = (option) => {
  if (!option || typeof option === 'string' || typeof option === 'number') return ''
  return option.symbol || option[props.optionLabel] || ''
}

// 获取选项的价格
const getOptionPrice = (option) => {
  if (!option || typeof option === 'string' || typeof option === 'number') return null
  const price = option.last_price || 0
  if (price > 0) {
    // 根据价格大小决定小数位数
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    } else {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 8 })}`
    }
  }
  return null
}

// 获取余额显示文本（根据市场类型）
const getBalanceDisplay = (option) => {
  if (!option || typeof option === 'string' || typeof option === 'number') return ''

  const marketType = option.market_type || 'spot'

  switch (marketType) {
    case 'spot':
      // 现货：显示基础资产和计价资产余额
      const baseBalance = option.base_balance || 0
      const quoteBalance = option.quote_balance || 0
      const baseAsset = option.base_asset || ''
      const quoteAsset = option.quote_asset || ''
      return `${baseAsset}: ${baseBalance.toFixed(8)} | ${quoteAsset}: ${quoteBalance.toFixed(8)}`

    case 'linear':
      // 合约-USDT：不显示保证金（在市场类型处显示）
      return ''

    case 'inverse':
      // 合约-币本位：不显示保证金（在市场类型处显示）
      return ''

    default:
      return ''
  }
}

// 处理图片加载错误
const handleImageError = (e) => {
  e.target.style.display = 'none'
}

// 过滤后的选项
const filteredOptions = computed(() => {
  if (!query.value) return props.options

  const q = query.value.toLowerCase()
  return props.options.filter(option => {
    // 搜索多个字段：symbol, label, base_asset, quote_asset
    if (typeof option === 'string' || typeof option === 'number') {
      return option.toString().toLowerCase().includes(q)
    }

    const symbol = (option.symbol || '').toLowerCase()
    const label = getDisplayValue(option).toLowerCase()
    const baseAsset = (option.base_asset || '').toLowerCase()
    const quoteAsset = (option.quote_asset || '').toLowerCase()

    return symbol.includes(q) || label.includes(q) || baseAsset.includes(q) || quoteAsset.includes(q)
  })
})

// 有余额的选项（显示在前面）
const optionsWithBalance = computed(() => {
  return filteredOptions.value.filter(option => {
    const balance = option[props.balanceField]
    return balance && balance > 0
  }).sort((a, b) => {
    // 按余额从大到小排序
    return (b[props.balanceField] || 0) - (a[props.balanceField] || 0)
  })
})

// 无余额的选项
const optionsWithoutBalance = computed(() => {
  return filteredOptions.value.filter(option => {
    const balance = option[props.balanceField]
    return !balance || balance === 0
  })
})

// 处理值变化
const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
  query.value = ''
}
</script>

