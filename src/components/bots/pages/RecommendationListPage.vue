<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="recommendations" />
        </div>
        <main class="flex-1 min-w-0">
          <!-- 页面头部 -->
          <div class="mb-8">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h1 class="text-3xl font-bold text-slate-900">交易建议</h1>
                <p class="text-slate-600 mt-1">查看和管理 AI 生成的交易建议</p>
              </div>
              <Button 
                variant="secondary" 
                @click="loadRecommendations"
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
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">状态</label>
                  <Select v-model="filters.status" @change="loadRecommendations">
                    <option value="">全部</option>
                    <option value="pending">待确认</option>
                    <option value="approved">已批准</option>
                    <option value="rejected">已拒绝</option>
                    <option value="expired">已过期</option>
                    <option value="executed">已执行</option>
                    <option value="failed">执行失败</option>
                  </Select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">方向</label>
                  <Select v-model="filters.direction" @change="loadRecommendations">
                    <option value="">全部</option>
                    <option value="long">做多</option>
                    <option value="short">做空</option>
                  </Select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">风险等级</label>
                  <Select v-model="filters.risk_level" @change="loadRecommendations">
                    <option value="">全部</option>
                    <option value="low">低风险</option>
                    <option value="medium">中等风险</option>
                    <option value="high">高风险</option>
                  </Select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">机器人</label>
                  <Select v-model="filters.bot_id" @change="loadRecommendations">
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
                    <span class="text-2xl font-bold" :class="recommendation.direction === 'long' ? 'text-green-600' : 'text-red-600'">
                      {{ recommendation.token_symbol }}
                    </span>
                    <Tag :severity="getDirectionSeverity(recommendation.direction)">
                      {{ recommendation.direction_display }}
                    </Tag>
                    <Tag :severity="getRiskSeverity(recommendation.risk_level)">
                      {{ recommendation.risk_level_display }}
                    </Tag>
                    <Tag :severity="getStatusSeverity(recommendation.status)">
                      {{ recommendation.status_display }}
                    </Tag>
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
                  <div class="text-sm font-semibold text-slate-900">${{ recommendation.entry_price }}</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 mb-1">仓位</div>
                  <div class="text-sm font-semibold text-slate-900">${{ recommendation.position_size }}</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 mb-1">止损</div>
                  <div class="text-sm font-semibold text-red-600">${{ recommendation.stop_loss }}</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 mb-1">止盈</div>
                  <div class="text-sm font-semibold text-green-600">${{ recommendation.take_profit }}</div>
                </div>
              </div>

              <!-- 时间信息 -->
              <div class="flex items-center justify-between text-sm text-slate-500 mb-4">
                <div>创建时间: {{ formatDate(recommendation.created_at) }}</div>
                <div v-if="recommendation.status === 'pending'">
                  过期时间: {{ formatDate(recommendation.expires_at) }}
                  <span v-if="recommendation.is_expired" class="text-red-600 font-medium ml-2">已过期</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div v-if="recommendation.status === 'pending' && !recommendation.is_expired" class="flex gap-3">
                <Button
                  variant="primary"
                  @click="handleApprove(recommendation)"
                  :loading="actionLoading === recommendation.id"
                  class="flex-1"
                >
                  批准并执行
                </Button>
                <Button
                  variant="danger"
                  @click="handleReject(recommendation)"
                  :loading="actionLoading === recommendation.id"
                  class="flex-1"
                >
                  拒绝
                </Button>
              </div>

              <!-- 执行结果 -->
              <div v-if="recommendation.execution_result" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="text-sm text-green-800">
                  <strong>执行成功</strong>
                  <pre class="mt-2 text-xs">{{ JSON.stringify(recommendation.execution_result, null, 2) }}</pre>
                </div>
              </div>

              <!-- 失败原因 -->
              <div v-if="recommendation.failure_reason" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="text-sm text-red-800">
                  <strong>执行失败:</strong> {{ recommendation.failure_reason }}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../../common/Header.vue'
import UserSidebar from '../../common/UserSidebar.vue'
import Button from '../../common/ui/Button.vue'
import Select from '../../common/ui/Select.vue'
import Tag from 'primevue/tag'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()

// 状态
const loading = ref(false)
const actionLoading = ref(null)
const recommendations = ref([])
const bots = ref([])
const filters = ref({
  status: '',
  direction: '',
  risk_level: '',
  bot_id: ''
})

// 加载交易建议
const loadRecommendations = async () => {
  try {
    loading.value = true
    const params = {}
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.direction) params.direction = filters.value.direction
    if (filters.value.risk_level) params.risk_level = filters.value.risk_level
    if (filters.value.bot_id) params.bot_id = filters.value.bot_id

    const response = await botAPI.getRecommendationList(params)
    recommendations.value = response.data || response.results || []
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
    const response = await botAPI.getBotList({ bot_type: 'trend_following' })
    bots.value = response.data || response.results || []
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  }
}

// 批准建议
const handleApprove = async (recommendation) => {
  try {
    actionLoading.value = recommendation.id
    await botAPI.approveRecommendation(recommendation.id)
    showSuccess('交易建议已批准并执行')
    await loadRecommendations()
  } catch (error) {
    console.error('批准失败:', error)
    showError(error.message || '批准失败')
  } finally {
    actionLoading.value = null
  }
}

// 拒绝建议
const handleReject = async (recommendation) => {
  try {
    actionLoading.value = recommendation.id
    await botAPI.rejectRecommendation(recommendation.id)
    showSuccess('交易建议已拒绝')
    await loadRecommendations()
  } catch (error) {
    console.error('拒绝失败:', error)
    showError(error.message || '拒绝失败')
  } finally {
    actionLoading.value = null
  }
}

// 辅助函数
const getDirectionSeverity = (direction) => {
  return direction === 'long' ? 'success' : 'danger'
}

const getRiskSeverity = (risk) => {
  const map = { low: 'success', medium: 'warning', high: 'danger' }
  return map[risk] || 'info'
}

const getStatusSeverity = (status) => {
  const map = {
    pending: 'warning',
    approved: 'info',
    rejected: 'danger',
    expired: 'secondary',
    executed: 'success',
    failed: 'danger'
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
  loadRecommendations()
  loadBots()
})
</script>

