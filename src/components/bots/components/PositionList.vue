<template>
  <div class="space-y-6">
    <!-- 筛选器 -->
    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">状态</label>
          <select 
            v-model="filters.status" 
            @change="loadPositions"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="open">持仓中</option>
            <option value="closed">已平仓</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">方向</label>
          <select 
            v-model="filters.side" 
            @change="loadPositions"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="long">做多</option>
            <option value="short">做空</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">机器人</label>
          <select 
            v-model="filters.bot_id" 
            @change="loadPositions"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option v-for="bot in bots" :key="bot.id" :value="bot.id">
              {{ bot.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="positions.length === 0" class="bg-white rounded-xl p-12 text-center border border-slate-200">
      <svg class="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <h3 class="text-lg font-medium text-slate-900 mb-2">暂无持仓</h3>
      <p class="text-slate-600">当机器人执行交易后，持仓信息会在这里显示</p>
    </div>

    <!-- 持仓列表 -->
    <div v-else class="space-y-4">
      <div
        v-for="position in positions"
        :key="position.id"
        class="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-slate-900">
                {{ position.bot_name }}
              </h3>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded',
                  position.side === 'long' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]"
              >
                {{ position.side === 'long' ? '做多' : '做空' }}
              </span>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded',
                  position.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                ]"
              >
                {{ position.status === 'open' ? '持仓中' : '已平仓' }}
              </span>
            </div>
            <p class="text-sm text-slate-600">{{ position.symbol }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-slate-500 mb-1">盈亏</div>
            <div 
              class="text-2xl font-bold" 
              :class="parseFloat(position.unrealized_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              ${{ Number(position.unrealized_profit || 0).toFixed(2) }}
            </div>
            <div 
              class="text-sm" 
              :class="parseFloat(position.profit_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ Number(position.profit_percentage || 0).toFixed(2) }}%
            </div>
          </div>
        </div>

        <!-- 持仓详情 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div class="text-xs text-slate-500 mb-1">开仓价格</div>
            <div class="text-sm font-medium text-slate-900">${{ Number(position.entry_price || 0).toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 mb-1">当前价格</div>
            <div class="text-sm font-medium text-slate-900">${{ Number(position.current_price || 0).toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 mb-1">持仓数量</div>
            <div class="text-sm font-medium text-slate-900">{{ Number(position.quantity || 0).toFixed(4) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 mb-1">持仓价值</div>
            <div class="text-sm font-medium text-slate-900">${{ Number(position.position_value || 0).toFixed(2) }}</div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div v-if="position.status === 'open'" class="flex gap-2">
          <button
            @click="closePosition(position.id)"
            :disabled="actionLoading === position.id"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {{ actionLoading === position.id ? '平仓中...' : '平仓' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const loading = ref(false)
const actionLoading = ref(null)
const positions = ref([])
const bots = ref([])
const filters = ref({
  status: '',
  side: '',
  bot_id: ''
})

// 加载持仓列表
const loadPositions = async () => {
  try {
    loading.value = true
    const params = {}
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.side) params.side = filters.value.side
    if (filters.value.bot_id) params.bot_id = filters.value.bot_id

    const response = await botAPI.getPositionList(params)
    positions.value = response.data || response.results || []
  } catch (error) {
    console.error('加载持仓失败:', error)
    showError('加载持仓失败')
  } finally {
    loading.value = false
  }
}

// 加载机器人列表
const loadBots = async () => {
  try {
    const response = await botAPI.getBotList({ bot_type: 'trend_following' })
    bots.value = response.data || response.results || []
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  }
}

// 平仓
const closePosition = async (positionId) => {
  if (!confirm('确定要平仓吗？')) return

  try {
    actionLoading.value = positionId
    await botAPI.closePosition(positionId)
    showSuccess('平仓成功')
    await loadPositions()
  } catch (error) {
    console.error('平仓失败:', error)
    showError(error.message || '平仓失败')
  } finally {
    actionLoading.value = null
  }
}

onMounted(() => {
  loadPositions()
  loadBots()
})
</script>

