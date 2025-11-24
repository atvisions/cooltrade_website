<template>
  <div class="mt-6 mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold text-amber-900">AI 分析模式</h2>
          <div class="relative">
            <button
              @mouseenter="showTooltip = true"
              @mouseleave="showTooltip = false"
              class="p-1 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none whitespace-nowrap"
            >
              <div>调用 AI 模型进行深度分析</div>
              <div>提供详细的市场洞察和操作建议</div>
              <div>包括：市场趋势、风险评估、入场建议等</div>
              <div v-if="!hasAIAccess" class="text-amber-300 mt-1">⭐ 需要 Standard 或以上会员</div>
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <p class="text-sm text-amber-700">使用 AI 深度分析市场</p>
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

    <!-- 会员限制提示 -->
    <div v-if="!hasAIAccess && enabled" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-start gap-2">
        <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="flex-1">
          <p class="text-sm text-blue-900 font-medium">AI 分析功能需要会员权限</p>
          <p class="text-xs text-blue-700 mt-1">升级到 Standard 或 Professional 会员即可使用 AI 深度分析功能</p>
        </div>
      </div>
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


