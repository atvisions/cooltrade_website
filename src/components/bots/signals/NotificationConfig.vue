<template>
  <Card variant="default" class="mb-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">通知设置</h2>
        <p class="text-sm text-slate-500">选择接收信号通知的方式和频率</p>
      </div>
    </div>

    <!-- 通知渠道 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-slate-700 mb-3">通知渠道</label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label
          :class="[
            'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
            notifyEmail
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          ]"
        >
          <input
            type="checkbox"
            :checked="notifyEmail"
            @change="$emit('update:notifyEmail', $event.target.checked)"
            class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <div class="ml-3 flex-1">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="font-medium text-slate-900">邮件通知</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">发送信号通知到您的邮箱</p>
          </div>
        </label>

        <label
          :class="[
            'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
            notifyApp
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          ]"
        >
          <input
            type="checkbox"
            :checked="notifyApp"
            @change="$emit('update:notifyApp', $event.target.checked)"
            class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <div class="ml-3 flex-1">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="font-medium text-slate-900">应用内通知</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">在应用内实时接收通知</p>
          </div>
        </label>
      </div>
    </div>

    <!-- 提醒模式 -->
    <div class="border-t border-slate-200 pt-6">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        提醒频率
        <span class="text-xs text-slate-500 ml-2">控制提醒的发送频率</span>
      </label>
      <div class="space-y-2">
        <label
          v-for="mode in alertModes"
          :key="mode.value"
          :class="[
            'flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all',
            alertMode === mode.value
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          ]"
        >
          <input
            type="radio"
            :value="mode.value"
            :checked="alertMode === mode.value"
            @change="$emit('update:alertMode', mode.value)"
            class="mt-1 mr-3"
          />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-slate-900">{{ mode.label }}</span>
              <span v-if="mode.recommended" class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">推荐</span>
            </div>
            <p class="text-xs text-slate-600 mt-1">{{ mode.description }}</p>
          </div>
        </label>
      </div>

      <!-- 冷却时间（只在"条件维持提醒"模式下显示） -->
      <div v-if="alertMode === 'condition_sustain'" class="mt-4">
        <div class="flex items-baseline gap-2 mb-2">
          <label class="block text-sm font-medium text-slate-700">
            冷却时间（分钟）
          </label>
          <div class="relative">
            <button
              @mouseenter="showCooldownTooltip = true"
              @mouseleave="showCooldownTooltip = false"
              class="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showCooldownTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none"
            >
              <div class="whitespace-nowrap">条件持续满足时，两次提醒之间的最小间隔</div>
              <div class="whitespace-nowrap">新手 60 分钟 | 短期 15-30 分钟 | 专业 30 分钟</div>
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <Input
          :model-value="cooldownMinutes"
          @update:model-value="$emit('update:cooldownMinutes', $event)"
          type="number"
          min="5"
          max="1440"
          placeholder="30"
        />
      </div>

      <!-- 信号过期时间 -->
      <div class="mt-6 pt-6 border-t border-slate-200">
        <div class="flex items-baseline gap-2 mb-3">
          <label class="block text-sm font-medium text-slate-700">
            信号有效期
          </label>
          <div class="relative">
            <button
              @mouseenter="showSignalExpirationTooltip = true"
              @mouseleave="showSignalExpirationTooltip = false"
              class="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showSignalExpirationTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none"
            >
              <div class="whitespace-nowrap">防止过时信号被执行</div>
              <div class="whitespace-nowrap">短期：1-4小时 | 中期：12-24小时 | 长期：48-72小时</div>
              <div class="whitespace-nowrap">每5分钟自动检查一次</div>
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <div class="flex items-end gap-3">
          <div class="flex-1">
            <Input
              :model-value="signalExpirationHours"
              @update:model-value="$emit('update:signalExpirationHours', $event)"
              type="number"
              min="1"
              max="720"
              placeholder="24"
            />
          </div>
          <div class="text-sm text-slate-600 font-medium pb-3">小时</div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from '../../common/ui/Card.vue'
import Input from '../../common/ui/Input.vue'

const props = defineProps({
  notifyEmail: {
    type: Boolean,
    default: true
  },
  notifyApp: {
    type: Boolean,
    default: true
  },
  alertMode: {
    type: String,
    default: 'one_shot'
  },
  cooldownMinutes: {
    type: Number,
    default: 30
  },
  signalExpirationHours: {
    type: Number,
    default: 24
  }
})

defineEmits(['update:notifyEmail', 'update:notifyApp', 'update:alertMode', 'update:cooldownMinutes', 'update:signalExpirationHours'])

const showCooldownTooltip = ref(false)
const showSignalExpirationTooltip = ref(false)

const alertModes = [
  {
    label: '一次提醒',
    value: 'one_shot',
    description: '条件首次满足时提醒一次，不重复。适合普通用户。',
    recommended: true
  },
  {
    label: '条件维持提醒',
    value: 'condition_sustain',
    description: '条件持续满足时，间隔一段时间提醒一次。适合短期交易者。',
    recommended: false
  },
  {
    label: '状态变化提醒',
    value: 'state_change',
    description: '只在信号状态变化时提醒。适合专业交易者和Bot系统。',
    recommended: false
  }
]
</script>


