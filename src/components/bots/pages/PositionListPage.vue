<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="positions" />
        </div>
        <main class="flex-1 min-w-0">
          <!-- 页面头部 -->
          <div class="mb-8">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h1 class="text-3xl font-bold text-slate-900">持仓管理</h1>
                <p class="text-slate-600 mt-1">查看和管理所有交易持仓</p>
              </div>
              <Button 
                variant="secondary" 
                @click="loadPositions"
                :loading="loading"
                class="flex items-center gap-2"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                刷新
              </Button>
            </div>

            <!-- 筛选器 -->
            <div class="bg-white rounded-xl p-4 border border-slate-200 mb-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">状态</label>
                  <Select v-model="filters.status" @change="loadPositions">
                    <option value="">全部</option>
                    <option value="open">持仓中</option>
                    <option value="closed">已平仓</option>
                  </Select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">方向</label>
                  <Select v-model="filters.side" @change="loadPositions">
                    <option value="">全部</option>
                    <option value="long">做多</option>
                    <option value="short">做空</option>
                  </Select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">机器人</label>
                  <Select v-model="filters.bot_id" @change="loadPositions">
                    <option value="">全部</option>
                    <option v-for="bot in bots" :key="bot.id" :value="bot.id">
                      {{ bot.name }}
                    </option>
                  </Select>
                </div>
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
                    <Tag :severity="getSideSeverity(position.side)">
                      {{ position.side_display }}
                    </Tag>
                    <Tag :severity="getStatusSeverity(position.status)">
                      {{ position.status_display }}
                    </Tag>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-slate-500 mb-1">盈亏</div>
                  <div class="text-2xl font-bold" :class="parseFloat(position.unrealized_profit) >= 0 ? 'text-green-600' : 'text-red-600'">
                    ${{ position.unrealized_profit }}
                  </div>
                  <div class="text-sm" :class="parseFloat(position.unrealized_profit_percentage) >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ position.unrealized_profit_percentage }}%
                  </div>
                </div>
              </div>

              <!-- 持仓信息 -->
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <div class="text-xs text-slate-500 mb-1">入场价</div>
                  <div class="text-sm font-semibold text-slate-900">${{ position.entry_price }}</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 mb-1">当前价</div>
                  <div class="text-sm font-semibold text-slate-900">${{ position.current_price }}</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 mb-1">数量</div>
                  <div class="text-sm font-semibold text-slate-900">{{ position.quantity }}</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 mb-1">初始数量</div>
                  <div class="text-sm font-semibold text-slate-900">{{ position.initial_quantity }}</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 mb-1">已实现盈亏</div>
                  <div class="text-sm font-semibold" :class="parseFloat(position.realized_profit) >= 0 ? 'text-green-600' : 'text-red-600'">
                    ${{ position.realized_profit }}
                  </div>
                </div>
              </div>

              <!-- 追踪止损信息 -->
              <div v-if="position.trailing_stop_activated" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-center gap-2 text-sm text-blue-800">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span class="font-medium">追踪止损已激活</span>
                  <span class="ml-auto">止损价: ${{ position.trailing_stop_price }}</span>
                </div>
              </div>

              <!-- 盈亏平衡信息 -->
              <div v-if="position.breakeven_activated" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center gap-2 text-sm text-green-800">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-medium">盈亏平衡已激活</span>
                </div>
              </div>

              <!-- 时间信息 -->
              <div class="flex items-center justify-between text-sm text-slate-500 mb-4">
                <div>开仓时间: {{ formatDate(position.opened_at) }}</div>
                <div v-if="position.closed_at">平仓时间: {{ formatDate(position.closed_at) }}</div>
              </div>

              <!-- 操作按钮 -->
              <div v-if="position.status === 'open'" class="flex gap-3">
                <Button
                  variant="danger"
                  @click="handleClose(position)"
                  :loading="actionLoading === position.id"
                  class="flex-1"
                >
                  手动平仓
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 确认对话框 -->
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import Header from '../../common/Header.vue'
import UserSidebar from '../../common/UserSidebar.vue'
import Button from '../../common/ui/Button.vue'
import Select from '../../common/ui/Select.vue'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const confirm = useConfirm()

// 状态
const loading = ref(false)
const actionLoading = ref(null)
const positions = ref([])
const bots = ref([])
const filters = ref({
  status: 'open',  // 默认只显示未平仓
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
    console.error('加载持仓列表失败:', error)
    showError('加载持仓列表失败')
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

// 手动平仓
const handleClose = (position) => {
  confirm.require({
    message: `确定要平仓 ${position.bot_name} 的持仓吗？`,
    header: '确认平仓',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '确认',
    rejectLabel: '取消',
    accept: async () => {
      try {
        actionLoading.value = position.id
        await botAPI.closePosition(position.id)
        showSuccess('平仓成功')
        await loadPositions()
      } catch (error) {
        console.error('平仓失败:', error)
        showError(error.message || '平仓失败')
      } finally {
        actionLoading.value = null
      }
    }
  })
}

// 辅助函数
const getSideSeverity = (side) => {
  return side === 'long' ? 'success' : 'danger'
}

const getStatusSeverity = (status) => {
  const map = {
    open: 'success',
    closed: 'secondary'
  }
  return map[status] || 'info'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadPositions()
  loadBots()
})
</script>

