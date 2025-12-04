<template>
  <div class="mt-6 mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
    <!-- 标题行 -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
        <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div class="flex-1">
        <h2 class="text-sm font-semibold text-amber-900">AI 分析模式</h2>
        <p class="text-xs text-amber-700">使用 AI 深度分析市场，强化信号质量</p>
      </div>
      <button
        @click="handleToggle"
        :class="[
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 flex-shrink-0',
          enabled ? 'bg-amber-500' : 'bg-gray-300'
        ]"
      >
        <span :class="[
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
          enabled ? 'translate-x-6' : 'translate-x-1'
        ]"></span>
      </button>
    </div>

    <!-- AI 功能列表 - 竖向排列 -->
    <div class="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
      <div class="flex items-start gap-2 bg-white/60 rounded-lg p-2.5">
        <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <div>
          <div class="text-xs font-medium text-amber-900">趋势分析</div>
          <div class="text-[10px] text-amber-700">识别多空趋势和动量方向</div>
        </div>
      </div>
      <div class="flex items-start gap-2 bg-white/60 rounded-lg p-2.5">
        <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <div class="text-xs font-medium text-amber-900">风险评估</div>
          <div class="text-[10px] text-amber-700">综合评估交易风险等级</div>
        </div>
      </div>
      <div class="flex items-start gap-2 bg-white/60 rounded-lg p-2.5">
        <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <div>
          <div class="text-xs font-medium text-amber-900">交易建议</div>
          <div class="text-[10px] text-amber-700">给出买入/卖出方向建议</div>
        </div>
      </div>
      <div class="flex items-start gap-2 bg-white/60 rounded-lg p-2.5">
        <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <div>
          <div class="text-xs font-medium text-amber-900">入场价格</div>
          <div class="text-[10px] text-amber-700">推荐最佳入场价格区间</div>
        </div>
      </div>
      <div class="flex items-start gap-2 bg-white/60 rounded-lg p-2.5">
        <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <div class="text-xs font-medium text-amber-900">止盈止损</div>
          <div class="text-[10px] text-amber-700">智能计算止盈止损价位</div>
        </div>
      </div>
      <div class="flex items-start gap-2 bg-white/60 rounded-lg p-2.5">
        <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <div>
          <div class="text-xs font-medium text-amber-900">市场背景</div>
          <div class="text-[10px] text-amber-700">分析相关新闻和事件影响</div>
        </div>
      </div>
    </div>

    <!-- 会员限制提示 -->
    <div v-if="!hasAIAccess" class="mt-3 flex items-center gap-2 text-xs text-amber-700">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
      <span>需要 Standard 或以上会员</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { membershipAPI } from '../../../utils/api'

const props = defineProps({
  enabled: {
    type: Boolean,
    default: false
  },
  signalType: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:enabled', 'error', 'upgrade-required'])

const showTooltip = ref(false)
const membershipStatus = ref({
  membership_tier: 'free'
})

// 检查是否有 AI 分析权限
const hasAIAccess = computed(() => {
  const tier = membershipStatus.value.membership_tier
  return tier === 'standard' || tier === 'professional'
})

// 获取会员状态
const fetchMembershipStatus = async () => {
  try {
    const response = await membershipAPI.getStatus()
    if (response.status === 'success') {
      membershipStatus.value = response.data
    }
  } catch (error) {
    console.error('获取会员状态失败:', error)
  }
}

const handleToggle = () => {
  // 如果是价格提醒类型，显示提示信息
  if (props.signalType === 'price_alert') {
    emit('error', '价格提醒无需开启 AI 分析模式')
    return
  }

  // 如果要开启 AI 分析，检查会员权限
  if (!props.enabled && !hasAIAccess.value) {
    emit('upgrade-required')
    return
  }

  // 非价格提醒类型，正常切换
  emit('update:enabled', !props.enabled)
}

onMounted(() => {
  fetchMembershipStatus()
})
</script>


