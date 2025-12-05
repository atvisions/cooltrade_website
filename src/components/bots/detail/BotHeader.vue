<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- 面包屑导航 -->
    <div class="px-5 pt-4">
      <nav class="flex items-center gap-1.5 text-xs">
        <router-link :to="backPath" class="text-gray-400 hover:text-blue-600 transition-colors">
          {{ backLabel }}
        </router-link>
        <svg class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-gray-600 truncate max-w-[200px]">{{ botName }}</span>
      </nav>
    </div>

    <!-- 主信息区 -->
    <div class="p-5">
      <div class="flex items-start justify-between">
        <!-- 左侧：Logo + 基本信息 -->
        <div class="flex items-center gap-4">
          <!-- Token Logo -->
          <div class="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <img v-if="tokenLogo" :src="tokenLogo" :alt="tokenSymbol" class="w-10 h-10 object-contain" />
            <span v-else class="text-xl font-bold text-gray-400">{{ tokenSymbol?.charAt(0) || '?' }}</span>
          </div>
          <!-- 信息 -->
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h1 class="text-xl font-bold text-gray-900">{{ botName }}</h1>
              <span :class="statusClass">{{ statusLabel }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span class="font-medium text-gray-700">{{ tokenSymbol }}/{{ tradingPair }}</span>
              <span>·</span>
              <span>{{ exchangeName }}</span>
              <span v-if="marketType" class="px-1.5 py-0.5 text-xs rounded" :class="marketType === 'futures' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'">
                {{ marketType === 'futures' ? '合约' : '现货' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 右侧：操作按钮 -->
        <div class="flex items-center gap-2">
          <button v-if="status === 'running'" @click="$emit('stop')" :disabled="actionLoading"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5">
            <svg v-if="actionLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ actionLoading ? '停止中...' : '停止' }}
          </button>
          <button v-else @click="$emit('start')" :disabled="actionLoading"
            class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5">
            <svg v-if="actionLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ actionLoading ? '启动中...' : '启动' }}
          </button>
          <button @click="$emit('edit')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
            编辑
          </button>
          <button @click="$emit('delete')" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="删除">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 底部统计栏 -->
    <div v-if="showStats" class="border-t border-gray-100 bg-gray-50/50">
      <div class="grid" :class="statsGridClass">
        <div v-for="(stat, idx) in stats" :key="idx" class="px-4 py-3 text-center" :class="idx > 0 ? 'border-l border-gray-100' : ''">
          <p class="text-[11px] text-gray-500 mb-0.5">{{ stat.label }}</p>
          <p class="text-sm font-semibold" :class="stat.color || 'text-gray-900'">{{ stat.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  botName: { type: String, default: '' },
  tokenSymbol: { type: String, default: '' },
  tokenLogo: { type: String, default: '' },
  tradingPair: { type: String, default: 'USDT' },
  exchangeName: { type: String, default: '' },
  marketType: { type: String, default: '' },
  status: { type: String, default: 'stopped' },
  actionLoading: { type: Boolean, default: false },
  backPath: { type: String, default: '/signal-bots' },
  backLabel: { type: String, default: '信号机器人' },
  stats: { type: Array, default: () => [] },
  showStats: { type: Boolean, default: true }
})

defineEmits(['start', 'stop', 'edit', 'delete'])

const statusLabel = computed(() => {
  const map = { running: '运行中', paused: '已暂停', stopped: '已停止', draft: '草稿' }
  return map[props.status] || props.status
})

const statusClass = computed(() => {
  const base = 'px-2 py-0.5 rounded-full text-xs font-medium'
  if (props.status === 'running') return `${base} bg-emerald-100 text-emerald-700`
  if (props.status === 'paused') return `${base} bg-yellow-100 text-yellow-700`
  return `${base} bg-gray-100 text-gray-600`
})

const statsGridClass = computed(() => {
  const count = props.stats.length
  if (count <= 4) return `grid-cols-${count}`
  if (count <= 6) return 'grid-cols-6'
  return 'grid-cols-8'
})
</script>

