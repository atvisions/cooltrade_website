<template>
  <div
    class="relative bg-white rounded-2xl p-8 transition-all duration-300"
    :class="cardClasses"
  >
    <!-- 推荐标签 -->
    <div v-if="isPopular" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
      <span class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
        推荐
      </span>
    </div>

    <!-- 套餐图标和名称 -->
    <div class="text-center mb-6">
      <!-- 线框图标 -->
      <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" :class="tierConfig.iconBg">
        <component :is="tierConfig.icon" class="w-8 h-8" :class="tierConfig.iconColor" />
      </div>

      <h3 class="text-xl font-bold mb-2" :class="tierConfig.textColor">
        {{ tierConfig.name }}
      </h3>

      <!-- 价格 -->
      <div class="mb-3">
        <div class="flex items-baseline justify-center space-x-1">
          <span class="text-3xl font-bold" :class="tierConfig.priceColor">
            ${{ displayPrice }}
          </span>
          <span v-if="tier !== 'free'" class="text-gray-600 text-sm">
            /{{ billingCycle === 'monthly' ? '月' : '年' }}
          </span>
        </div>
        <div v-if="tier !== 'free' && billingCycle === 'yearly'" class="text-xs text-green-600 mt-1">
          相当于 ${{ monthlyEquivalent }}/月
        </div>
      </div>

      <p class="text-gray-600 text-sm">{{ tierConfig.description }}</p>
    </div>

    <!-- 按钮 -->
    <button
      @click="handleSelect"
      :disabled="isCurrent || tier === 'free'"
      class="w-full py-2.5 px-6 rounded-lg font-semibold transition-all duration-200 mb-6 text-sm"
      :class="buttonClasses"
    >
      {{ buttonText }}
    </button>

    <!-- 功能列表 -->
    <div class="space-y-2.5 text-sm">
      <div
        v-for="feature in tierConfig.features"
        :key="feature.name"
        class="flex items-start"
        :class="feature.available ? 'text-gray-700' : 'text-gray-400'"
      >
        <svg
          v-if="feature.available"
          class="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg
          v-else
          class="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>{{ feature.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  tier: {
    type: String,
    required: true,
    validator: (value) => ['free', 'standard', 'professional'].includes(value)
  },
  billingCycle: {
    type: String,
    required: true,
    validator: (value) => ['monthly', 'yearly'].includes(value)
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  plans: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

// 图标组件
const FreeIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    })
  ])
}

const StandardIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
    })
  ])
}

const ProfessionalIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
    })
  ])
}

// 套餐配置
const tierConfigs = {
  free: {
    name: '免费版',
    icon: FreeIcon,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    description: '体验基础功能',
    textColor: 'text-gray-900',
    priceColor: 'text-gray-900',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: 'signal_bots', text: '1 个信号机器人', available: true },
      { name: 'trading_bots', text: '1 个交易机器人', available: true },
      { name: 'ai_strategy', text: 'AI 策略生成（3次/月）', available: false },
      { name: 'ai_analysis', text: 'AI 市场分析', available: false },
      { name: 'backtest', text: '策略回测（3次/月）', available: false },
      { name: 'exchange_api', text: '1 个交易所 API', available: true },
      { name: 'data_export', text: '数据导出', available: false },
    ]
  },
  standard: {
    name: 'Standard',
    icon: StandardIcon,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description: '适合个人交易者',
    textColor: 'text-blue-600',
    priceColor: 'text-blue-600',
    monthlyPrice: 99,
    yearlyPrice: 950,
    features: [
      { name: 'signal_bots', text: '10 个信号机器人', available: true },
      { name: 'trading_bots', text: '10 个交易机器人', available: true },
      { name: 'ai_strategy', text: 'AI 策略生成（无限）', available: true },
      { name: 'ai_analysis', text: 'AI 市场分析', available: true },
      { name: 'backtest', text: '策略回测（50次/月）', available: true },
      { name: 'exchange_api', text: '3 个交易所 API', available: true },
      { name: 'data_export', text: '数据导出', available: true },
      { name: 'notifications', text: '实时通知', available: true },
    ]
  },
  professional: {
    name: 'Professional',
    icon: ProfessionalIcon,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    description: '适合专业交易团队',
    textColor: 'text-yellow-600',
    priceColor: 'text-yellow-600',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    features: [
      { name: 'signal_bots', text: '无限信号机器人', available: true },
      { name: 'trading_bots', text: '无限交易机器人', available: true },
      { name: 'ai_strategy', text: 'AI 策略生成（无限）', available: true },
      { name: 'ai_analysis', text: 'AI 市场分析', available: true },
      { name: 'backtest', text: '策略回测（无限）', available: true },
      { name: 'exchange_api', text: '无限交易所 API', available: true },
      { name: 'data_export', text: '数据导出', available: true },
      { name: 'notifications', text: '实时通知 + Telegram', available: true },
      { name: 'advisor', text: '专属策略顾问', available: true },
    ]
  }
}

const tierConfig = computed(() => tierConfigs[props.tier])

// 从后端获取的价格
const backendPrice = computed(() => {
  if (props.tier === 'free') return 0

  const planType = props.billingCycle === 'monthly' ? 'monthly' : 'yearly'
  const plan = props.plans.find(p =>
    p.tier === props.tier && p.plan_type === planType
  )

  return plan ? plan.price : null
})

// 显示价格：优先使用后端价格，如果没有则使用默认价格
const displayPrice = computed(() => {
  if (backendPrice.value !== null) {
    return backendPrice.value
  }

  // 降级到硬编码价格
  return props.billingCycle === 'monthly'
    ? tierConfig.value.monthlyPrice
    : tierConfig.value.yearlyPrice
})

const monthlyEquivalent = computed(() => {
  if (props.billingCycle === 'yearly' && props.tier !== 'free') {
    // 优先使用后端价格计算
    if (backendPrice.value !== null) {
      return Math.round(backendPrice.value / 12)
    }
    // 降级到硬编码价格
    return Math.round(tierConfig.value.yearlyPrice / 12)
  }
  return 0
})

const cardClasses = computed(() => {
  const classes = ['border-2', 'hover:shadow-md']

  if (props.isPopular) {
    classes.push('border-blue-500', 'shadow-md', 'transform', 'hover:-translate-y-0.5')
  } else if (props.tier === 'professional') {
    classes.push('border-yellow-400', 'hover:border-yellow-500')
  } else {
    classes.push('border-gray-200', 'hover:border-gray-300')
  }

  return classes.join(' ')
})

const buttonClasses = computed(() => {
  if (props.isCurrent || props.tier === 'free') {
    return 'bg-gray-100 text-gray-500 cursor-not-allowed'
  }
  
  if (props.tier === 'professional') {
    return 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
  }
  
  return 'bg-blue-600 text-white hover:bg-blue-700'
})

const buttonText = computed(() => {
  if (props.isCurrent) return '当前套餐'
  if (props.tier === 'free') return '免费使用'
  return '立即升级'
})

const handleSelect = () => {
  if (!props.isCurrent && props.tier !== 'free') {
    emit('select', props.tier)
  }
}
</script>
