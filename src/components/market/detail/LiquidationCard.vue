<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        {{ symbol }} 爆仓数据
      </h3>
      <!-- 周期切换按钮 -->
      <div class="flex gap-1">
        <button
          v-for="period in periods"
          :key="period.key"
          @click="activePeriod = period.key"
          :class="[
            'px-2 py-1 text-xs font-medium rounded-lg transition-all',
            activePeriod === period.key
              ? 'bg-orange-100 text-orange-600'
              : 'text-gray-500 hover:bg-gray-100'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- 卡片翻转容器 -->
    <div class="px-5 py-4">
      <div class="flip-container" :class="{ 'flipping': isFlipping }">
        <div class="flip-card">
          <!-- 正面：当前周期数据 -->
          <div class="flip-card-front">
            <div v-if="loading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
            </div>
            <div v-else-if="currentData" class="space-y-4">
              <!-- 总爆仓量 -->
              <div class="text-center pb-3 border-b border-gray-100">
                <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(currentData.total) }}</div>
                <div class="text-sm text-gray-500">{{ activePeriodLabel }} 总爆仓</div>
              </div>
              <!-- 多空对比 -->
              <div class="grid grid-cols-2 gap-4">
                <!-- 多单爆仓 -->
                <div class="text-center p-3 bg-green-50 rounded-xl">
                  <div class="text-lg font-bold text-green-600">{{ formatCurrency(currentData.long) }}</div>
                  <div class="text-xs text-gray-500 mt-1">多单爆仓</div>
                  <div class="text-xs text-green-600">{{ currentData.long_count }} 笔</div>
                </div>
                <!-- 空单爆仓 -->
                <div class="text-center p-3 bg-red-50 rounded-xl">
                  <div class="text-lg font-bold text-red-600">{{ formatCurrency(currentData.short) }}</div>
                  <div class="text-xs text-gray-500 mt-1">空单爆仓</div>
                  <div class="text-xs text-red-600">{{ currentData.short_count }} 笔</div>
                </div>
              </div>
              <!-- 多空比例条 -->
              <div class="mt-2">
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div class="h-full bg-green-500 transition-all" :style="{ width: longPercent + '%' }"></div>
                  <div class="h-full bg-red-500 transition-all" :style="{ width: shortPercent + '%' }"></div>
                </div>
                <div class="flex justify-between text-xs mt-1">
                  <span class="text-green-600">{{ longPercent }}% 多</span>
                  <span class="text-red-600">{{ shortPercent }}% 空</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-400">暂无数据</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { apiRequest, API_ENDPOINTS } from '../../../utils/api.js'

const props = defineProps({
  symbol: { type: String, required: true }
})

const periods = [
  { key: '1h', label: '1H' },
  { key: '4h', label: '4H' },
  { key: '12h', label: '12H' },
  { key: '24h', label: '24H' },
]

const activePeriod = ref('1h')
const loading = ref(false)
const liquidationData = ref(null)
const isFlipping = ref(false)
let autoFlipTimer = null

const activePeriodLabel = computed(() => periods.find(p => p.key === activePeriod.value)?.label || '')

const currentData = computed(() => liquidationData.value?.liquidations?.[activePeriod.value] || null)

const longPercent = computed(() => {
  if (!currentData.value || currentData.value.total === 0) return 50
  return Math.round((currentData.value.long / currentData.value.total) * 100)
})

const shortPercent = computed(() => 100 - longPercent.value)

const formatCurrency = (val) => {
  if (!val) return '$0'
  if (val >= 1e8) return '$' + (val / 1e8).toFixed(2) + '亿'
  if (val >= 1e4) return '$' + (val / 1e4).toFixed(2) + '万'
  return '$' + val.toFixed(2)
}

const loadData = async () => {
  if (!props.symbol) return
  loading.value = true
  try {
    const response = await apiRequest(API_ENDPOINTS.MARKET_TOKEN_LIQUIDATIONS(props.symbol))
    if (response.status === 'success') {
      liquidationData.value = response.data
    }
  } catch (err) {
    console.error('加载爆仓数据失败:', err)
  } finally {
    loading.value = false
  }
}

// 自动轮播
const startAutoFlip = () => {
  autoFlipTimer = setInterval(() => {
    isFlipping.value = true
    setTimeout(() => {
      const idx = periods.findIndex(p => p.key === activePeriod.value)
      activePeriod.value = periods[(idx + 1) % periods.length].key
      isFlipping.value = false
    }, 300)
  }, 5000)
}

onMounted(() => {
  loadData()
  startAutoFlip()
})

onUnmounted(() => {
  if (autoFlipTimer) clearInterval(autoFlipTimer)
})

watch(() => props.symbol, loadData)
</script>

<style scoped>
.flip-container { perspective: 1000px; }
.flip-card { transition: transform 0.3s ease-in-out; transform-style: preserve-3d; }
.flip-container.flipping .flip-card { transform: rotateY(90deg); }
.flip-card-front { backface-visibility: hidden; }
</style>

