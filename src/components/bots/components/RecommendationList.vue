<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">待确认</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ statistics.pending }}</p>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">已批准</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ statistics.approved }}</p>
      </div>

      <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">已拒绝</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ statistics.rejected }}</p>
      </div>

      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">已执行</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ statistics.executed }}</p>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">状态</label>
          <select 
            v-model="filters.status" 
            @change="loadRecommendations"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="pending">待确认</option>
            <option value="approved">已批准</option>
            <option value="rejected">已拒绝</option>
            <option value="expired">已过期</option>
            <option value="executed">已执行</option>
            <option value="failed">执行失败</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">方向</label>
          <select 
            v-model="filters.direction" 
            @change="loadRecommendations"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="long">做多</option>
            <option value="short">做空</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">风险等级</label>
          <select 
            v-model="filters.risk_level" 
            @change="loadRecommendations"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="low">低风险</option>
            <option value="medium">中等风险</option>
            <option value="high">高风险</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">机器人</label>
          <select 
            v-model="filters.bot_id" 
            @change="loadRecommendations"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option v-for="bot in bots" :key="bot.id" :value="bot.id">
              {{ bot.name }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="loadRecommendations"
            :disabled="loading"
            class="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="recommendations.length === 0" class="bg-white rounded-xl p-12 text-center border border-slate-200">
      <svg class="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-slate-900 mb-2">暂无交易建议</h3>
      <p class="text-slate-600">当半自动交易机器人检测到信号时，会在这里生成交易建议</p>
    </div>

    <!-- 建议列表 -->
    <div v-else class="space-y-4">
      <div
        v-for="recommendation in recommendations"
        :key="recommendation.id"
        class="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-slate-900">
                {{ recommendation.bot_name }}
              </h3>
              <span class="text-xl font-bold" :class="recommendation.direction === 'long' ? 'text-green-600' : 'text-red-600'">
                {{ recommendation.token_symbol }}
              </span>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded',
                  recommendation.direction === 'long' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]"
              >
                {{ recommendation.direction === 'long' ? '做多' : '做空' }}
              </span>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded',
                  getRiskClass(recommendation.risk_level)
                ]"
              >
                {{ getRiskLabel(recommendation.risk_level) }}
              </span>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded',
                  getStatusClass(recommendation.status)
                ]"
              >
                {{ getStatusLabel(recommendation.status) }}
              </span>
            </div>
            <p class="text-slate-600 text-sm">{{ recommendation.reason }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-slate-500 mb-1">置信度</div>
            <div class="text-2xl font-bold text-blue-600">{{ recommendation.confidence }}%</div>
          </div>
        </div>

        <!-- 交易参数 -->
        <div class="grid grid-cols-4 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <div class="text-xs text-slate-500 mb-1">入场价</div>
            <div class="text-sm font-semibold text-slate-900">${{ Number(recommendation.entry_price).toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 mb-1">仓位</div>
            <div class="text-sm font-semibold text-slate-900">${{ Number(recommendation.position_size).toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 mb-1">止损</div>
            <div class="text-sm font-semibold text-red-600">${{ Number(recommendation.stop_loss).toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 mb-1">止盈</div>
            <div class="text-sm font-semibold text-green-600">${{ Number(recommendation.take_profit).toFixed(2) }}</div>
          </div>
        </div>

        <!-- 时间信息和操作按钮 -->
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-500">
            <div>创建时间: {{ formatDate(recommendation.created_at) }}</div>
            <div v-if="recommendation.status === 'pending' && recommendation.expires_at">
              过期时间: {{ formatDate(recommendation.expires_at) }}
              <span v-if="isExpired(recommendation.expires_at)" class="text-red-600 font-medium ml-2">已过期</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div v-if="recommendation.status === 'pending'" class="flex gap-2">
            <button
              @click="approveRecommendation(recommendation)"
              :disabled="actionLoading === recommendation.id"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
            >
              批准
            </button>
            <button
              @click="rejectRecommendation(recommendation)"
              :disabled="actionLoading === recommendation.id"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium transition-colors"
            >
              拒绝
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上一页
      </button>
      <span class="text-slate-600">
        第 {{ currentPage }} / {{ totalPages }} 页
      </span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const loading = ref(false)
const actionLoading = ref(null)
const recommendations = ref([])
const bots = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)

const filters = ref({
  status: '',
  direction: '',
  risk_level: '',
  bot_id: ''
})

const statistics = computed(() => {
  return {
    pending: recommendations.value.filter(r => r.status === 'pending').length,
    approved: recommendations.value.filter(r => r.status === 'approved').length,
    rejected: recommendations.value.filter(r => r.status === 'rejected').length,
    executed: recommendations.value.filter(r => r.status === 'executed').length
  }
})

// 加载交易建议
const loadRecommendations = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      ...filters.value
    }

    // 移除空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null) {
        delete params[key]
      }
    })

    const response = await botAPI.getRecommendationList(params)
    recommendations.value = response.results || response.data || []
    totalPages.value = Math.ceil((response.count || 0) / pageSize.value)
  } catch (error) {
    console.error('加载交易建议失败:', error)
    showError('加载交易建议失败')
  } finally {
    loading.value = false
  }
}

// 加载机器人列表
const loadBots = async () => {
  try {
    const response = await botAPI.getBotList({ page_size: 100 })
    bots.value = response.results || response.data || []
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  }
}

// 批准交易建议
const approveRecommendation = async (recommendation) => {
  if (!confirm('确定要批准这个交易建议吗？批准后将立即执行交易。')) {
    return
  }

  actionLoading.value = recommendation.id
  try {
    await botAPI.approveRecommendation(recommendation.id)
    showSuccess('交易建议已批准')
    await loadRecommendations()
  } catch (error) {
    showError(error.message || '批准失败')
  } finally {
    actionLoading.value = null
  }
}

// 拒绝交易建议
const rejectRecommendation = async (recommendation) => {
  if (!confirm('确定要拒绝这个交易建议吗？')) {
    return
  }

  actionLoading.value = recommendation.id
  try {
    await botAPI.rejectRecommendation(recommendation.id)
    showSuccess('交易建议已拒绝')
    await loadRecommendations()
  } catch (error) {
    showError(error.message || '拒绝失败')
  } finally {
    actionLoading.value = null
  }
}

// 获取风险等级标签
const getRiskLabel = (level) => {
  const map = {
    low: '低风险',
    medium: '中等风险',
    high: '高风险'
  }
  return map[level] || level
}

// 获取风险等级样式
const getRiskClass = (level) => {
  const map = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700'
  }
  return map[level] || 'bg-gray-100 text-gray-700'
}

// 获取状态标签
const getStatusLabel = (status) => {
  const map = {
    pending: '待确认',
    approved: '已批准',
    rejected: '已拒绝',
    expired: '已过期',
    executed: '已执行',
    failed: '执行失败'
  }
  return map[status] || status
}

// 获取状态样式
const getStatusClass = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    expired: 'bg-gray-100 text-gray-700',
    executed: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700'
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

// 检查是否过期
const isExpired = (expiresAt) => {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 监听分页变化
watch(currentPage, () => {
  loadRecommendations()
})

onMounted(() => {
  loadRecommendations()
  loadBots()
})
</script>

