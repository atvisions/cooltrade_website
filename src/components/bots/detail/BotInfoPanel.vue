<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100">
      <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        基础信息
      </h3>
    </div>

    <!-- Info List -->
    <div class="px-5 py-4 space-y-3">
      <div v-for="(item, idx) in infoItems" :key="idx" class="flex justify-between items-center">
        <span class="text-sm text-gray-500">{{ item.label }}</span>
        <span class="text-sm font-medium" :class="item.color || 'text-gray-900'">{{ item.value }}</span>
      </div>

      <!-- 分隔线 -->
      <div v-if="showDivider" class="border-t border-gray-100 my-2"></div>

      <!-- 额外信息 -->
      <div v-for="(item, idx) in extraItems" :key="`extra-${idx}`" class="flex justify-between items-center">
        <span class="text-sm text-gray-500">{{ item.label }}</span>
        <span class="text-sm font-medium" :class="item.color || 'text-gray-900'">{{ item.value }}</span>
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div v-if="showActions" class="px-5 pb-4 space-y-2">
      <button @click="$emit('start')" v-if="status !== 'running'" :disabled="actionLoading"
        class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
        {{ actionLoading ? '启动中...' : '启动机器人' }}
      </button>
      <button @click="$emit('stop')" v-else :disabled="actionLoading"
        class="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
        {{ actionLoading ? '停止中...' : '停止机器人' }}
      </button>
      <button @click="$emit('edit')"
        class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
        编辑配置
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  infoItems: { type: Array, default: () => [] },
  extraItems: { type: Array, default: () => [] },
  showActions: { type: Boolean, default: false },
  status: { type: String, default: 'stopped' },
  actionLoading: { type: Boolean, default: false }
})

defineEmits(['start', 'stop', 'edit'])

const showDivider = computed(() => props.extraItems.length > 0)
</script>

