<template>
  <div class="space-y-6">
    <!-- 头部操作栏 -->
    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h3 class="text-lg font-semibold text-slate-900">信号触发器管理</h3>
          <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {{ triggers.length }} 个触发器
          </span>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          创建触发器
        </button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">状态</label>
          <select 
            v-model="filters.is_active" 
            @change="loadTriggers"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="true">已启用</option>
            <option value="false">已禁用</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">触发类型</label>
          <select 
            v-model="filters.trigger_type" 
            @change="loadTriggers"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="buy">买入信号触发</option>
            <option value="sell">卖出信号触发</option>
            <option value="any">任意信号触发</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">信号机器人</label>
          <select 
            v-model="filters.signal_bot" 
            @change="loadTriggers"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option v-for="bot in signalBots" :key="bot.id" :value="bot.id">
              {{ bot.name }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="loadTriggers"
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
    <div v-else-if="triggers.length === 0" class="bg-white rounded-xl p-12 text-center border border-slate-200">
      <svg class="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <h3 class="text-lg font-medium text-slate-900 mb-2">暂无触发器</h3>
      <p class="text-slate-600 mb-4">创建触发器来连接信号机器人和趋势跟踪机器人</p>
      <button
        @click="showCreateModal = true"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        创建第一个触发器
      </button>
    </div>

    <!-- 触发器列表 -->
    <div v-else class="space-y-4">
      <div
        v-for="trigger in triggers"
        :key="trigger.id"
        class="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- 触发器信息 -->
            <div class="flex items-center gap-3 mb-4">
              <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  触发器 #{{ trigger.id }}
                </h3>
                <p class="text-sm text-slate-600">
                  创建于 {{ formatDate(trigger.created_at) }}
                </p>
              </div>
              <span 
                :class="[
                  'px-3 py-1 text-xs font-medium rounded-full',
                  trigger.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                ]"
              >
                {{ trigger.is_active ? '已启用' : '已禁用' }}
              </span>
            </div>

            <!-- 触发器配置 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span class="text-sm font-medium text-slate-700">信号源</span>
                </div>
                <p class="text-slate-900 font-medium">{{ trigger.signal_bot_name }}</p>
                <p class="text-xs text-slate-600 mt-1">{{ trigger.signal_bot_token }}</p>
              </div>

              <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm font-medium text-slate-700">目标机器人</span>
                </div>
                <p class="text-slate-900 font-medium">{{ trigger.trend_bot_name }}</p>
                <p class="text-xs text-slate-600 mt-1">{{ trigger.trend_bot_token }}</p>
              </div>
            </div>

            <!-- 触发统计 -->
            <div class="grid grid-cols-3 gap-4">
              <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-xs text-blue-600 font-medium mb-1">触发类型</p>
                <p class="text-sm font-semibold text-blue-900">
                  {{ getTriggerTypeLabel(trigger.trigger_type) }}
                </p>
              </div>
              <div class="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p class="text-xs text-purple-600 font-medium mb-1">触发次数</p>
                <p class="text-sm font-semibold text-purple-900">
                  {{ trigger.trigger_count }} 次
                </p>
              </div>
              <div class="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p class="text-xs text-orange-600 font-medium mb-1">最后触发</p>
                <p class="text-sm font-semibold text-orange-900">
                  {{ trigger.last_triggered_at ? formatDate(trigger.last_triggered_at) : '从未触发' }}
                </p>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-col gap-2 ml-4">
            <button
              @click="toggleTrigger(trigger)"
              :disabled="actionLoading === trigger.id"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                trigger.is_active
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              ]"
            >
              {{ trigger.is_active ? '禁用' : '启用' }}
            </button>
            <button
              @click="editTrigger(trigger)"
              class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-colors"
            >
              编辑
            </button>
            <button
              @click="deleteTrigger(trigger)"
              :disabled="actionLoading === trigger.id"
              class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
            >
              删除
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

    <!-- 创建/编辑触发器模态框 -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">
          {{ showEditModal ? '编辑触发器' : '创建触发器' }}
        </h2>
        
        <div class="space-y-4">
          <!-- 信号机器人选择 -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">信号机器人 *</label>
            <select
              v-model="formData.signal_bot"
              class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">请选择信号机器人</option>
              <option v-for="bot in signalBots" :key="bot.id" :value="bot.id">
                {{ bot.name }} ({{ bot.token_symbol }})
              </option>
            </select>
          </div>

          <!-- 趋势跟踪机器人选择 -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">趋势跟踪机器人 *</label>
            <select
              v-model="formData.trend_bot"
              class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">请选择趋势跟踪机器人</option>
              <option v-for="bot in trendBots" :key="bot.id" :value="bot.id">
                {{ bot.name }} ({{ bot.token_symbol }})
              </option>
            </select>
          </div>

          <!-- 触发类型选择 -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">触发类型 *</label>
            <select
              v-model="formData.trigger_type"
              class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="buy">买入信号触发</option>
              <option value="sell">卖出信号触发</option>
              <option value="any">任意信号触发</option>
            </select>
            <p class="text-xs text-slate-600 mt-1">
              选择何种信号类型会触发趋势跟踪机器人
            </p>
          </div>

          <!-- 是否启用 -->
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              v-model="formData.is_active"
              class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label for="is_active" class="text-sm font-medium text-slate-700">
              创建后立即启用
            </label>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="flex gap-3 mt-6">
          <button
            @click="closeModal"
            class="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
          >
            取消
          </button>
          <button
            @click="submitForm"
            :disabled="submitting"
            class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
          >
            {{ submitting ? '提交中...' : (showEditModal ? '保存' : '创建') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const loading = ref(false)
const actionLoading = ref(null)
const submitting = ref(false)
const triggers = ref([])
const signalBots = ref([])
const trendBots = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)

const filters = ref({
  is_active: '',
  trigger_type: '',
  signal_bot: ''
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTrigger = ref(null)

const formData = ref({
  signal_bot: '',
  trend_bot: '',
  trigger_type: 'buy',
  is_active: true
})

// 加载触发器列表
const loadTriggers = async () => {
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

    const response = await botAPI.getTriggerList(params)
    triggers.value = response.results || response.data || []
    totalPages.value = Math.ceil((response.count || 0) / pageSize.value)
  } catch (error) {
    console.error('加载触发器失败:', error)
    showError('加载触发器失败')
  } finally {
    loading.value = false
  }
}

// 加载机器人列表
const loadBots = async () => {
  try {
    const response = await botAPI.getBotList({ page_size: 100 })
    const bots = response.results || response.data || []
    
    signalBots.value = bots.filter(bot => bot.bot_type === 'signal')
    trendBots.value = bots.filter(bot => bot.bot_type === 'trend_following')
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  }
}

// 切换触发器状态
const toggleTrigger = async (trigger) => {
  actionLoading.value = trigger.id
  try {
    await botAPI.toggleTrigger(trigger.id)
    showSuccess(trigger.is_active ? '触发器已禁用' : '触发器已启用')
    await loadTriggers()
  } catch (error) {
    showError(error.message || '操作失败')
  } finally {
    actionLoading.value = null
  }
}

// 编辑触发器
const editTrigger = (trigger) => {
  editingTrigger.value = trigger
  formData.value = {
    signal_bot: trigger.signal_bot,
    trend_bot: trigger.trend_bot,
    trigger_type: trigger.trigger_type,
    is_active: trigger.is_active
  }
  showEditModal.value = true
}

// 删除触发器
const deleteTrigger = async (trigger) => {
  if (!confirm('确定要删除这个触发器吗？删除后无法恢复。')) {
    return
  }

  actionLoading.value = trigger.id
  try {
    await botAPI.deleteTrigger(trigger.id)
    showSuccess('触发器已删除')
    await loadTriggers()
  } catch (error) {
    showError(error.message || '删除失败')
  } finally {
    actionLoading.value = null
  }
}

// 提交表单
const submitForm = async () => {
  if (!formData.value.signal_bot || !formData.value.trend_bot) {
    showError('请选择信号机器人和趋势跟踪机器人')
    return
  }

  submitting.value = true
  try {
    if (showEditModal.value) {
      await botAPI.updateTrigger(editingTrigger.value.id, formData.value)
      showSuccess('触发器已更新')
    } else {
      await botAPI.createTrigger(formData.value)
      showSuccess('触发器已创建')
    }
    closeModal()
    await loadTriggers()
  } catch (error) {
    showError(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

// 关闭模态框
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTrigger.value = null
  formData.value = {
    signal_bot: '',
    trend_bot: '',
    trigger_type: 'buy',
    is_active: true
  }
}

// 获取触发类型标签
const getTriggerTypeLabel = (type) => {
  const map = {
    buy: '买入信号',
    sell: '卖出信号',
    any: '任意信号'
  }
  return map[type] || type
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 监听分页变化
watch(currentPage, () => {
  loadTriggers()
})

onMounted(() => {
  loadTriggers()
  loadBots()
})
</script>

