<template>
  <div class="space-y-6">
    <!-- 熔断警告 -->
    <div v-if="config && config.is_circuit_breaker_triggered" class="bg-red-50 border-2 border-red-500 rounded-xl p-6">
      <div class="flex items-start gap-4">
        <svg class="h-8 w-8 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-red-900 mb-2">⚠️ 熔断机制已触发</h3>
          <p class="text-red-800 mb-4">
            由于触发风控条件，所有交易已被暂停。请检查账户状态后手动重置熔断机制。
          </p>
          <button
            @click="handleResetBreaker"
            :disabled="resetLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium transition-colors"
          >
            {{ resetLoading ? '重置中...' : '重置熔断机制' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- 配置内容 -->
    <div v-else-if="config" class="space-y-6">
      <!-- 实时统计 -->
      <div class="bg-white rounded-xl p-6 border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-slate-900">实时统计</h2>
          <button
            @click="loadConfig"
            class="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            刷新
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div class="text-sm text-slate-500 mb-1">当前总仓位</div>
            <div class="text-2xl font-bold text-blue-600">${{ config.current_total_position }}</div>
            <div class="text-xs text-slate-400 mt-1">
              限制: ${{ config.max_total_position }}
            </div>
          </div>
          <div>
            <div class="text-sm text-slate-500 mb-1">当前持仓数</div>
            <div class="text-2xl font-bold text-purple-600">{{ config.current_open_positions }}</div>
            <div class="text-xs text-slate-400 mt-1">
              限制: {{ config.max_open_positions }}
            </div>
          </div>
          <div>
            <div class="text-sm text-slate-500 mb-1">今日交易次数</div>
            <div class="text-2xl font-bold text-orange-600">{{ config.today_trades_count }}</div>
            <div class="text-xs text-slate-400 mt-1">
              限制: {{ config.max_trades_per_day }}
            </div>
          </div>
          <div>
            <div class="text-sm text-slate-500 mb-1">今日盈亏</div>
            <div class="text-2xl font-bold" :class="parseFloat(config.today_pnl) >= 0 ? 'text-green-600' : 'text-red-600'">
              ${{ config.today_pnl }}
            </div>
            <div class="text-xs text-slate-400 mt-1">
              限制: ${{ config.max_daily_loss }}
            </div>
          </div>
        </div>
      </div>

      <!-- 风控配置表单 -->
      <form @submit.prevent="handleSave" class="bg-white rounded-xl p-6 border border-slate-200">
        <h2 class="text-xl font-bold text-slate-900 mb-6">风控参数配置</h2>
        
        <div class="space-y-6">
          <!-- 仓位控制 -->
          <div class="border-b border-slate-200 pb-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              仓位控制
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  最大总仓位 (USDT)
                </label>
                <input
                  type="number"
                  v-model.number="formData.max_total_position"
                  min="0"
                  step="100"
                  class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  最大持仓数量
                </label>
                <input
                  type="number"
                  v-model.number="formData.max_open_positions"
                  min="1"
                  class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  单笔最大仓位 (USDT)
                </label>
                <input
                  type="number"
                  v-model.number="formData.max_position_per_trade"
                  min="0"
                  step="10"
                  class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  单币种最大仓位 (USDT)
                </label>
                <input
                  type="number"
                  v-model.number="formData.max_position_per_symbol"
                  min="0"
                  step="10"
                  class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- 交易频率控制 -->
          <div class="border-b border-slate-200 pb-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              交易频率控制
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  每日最大交易次数
                </label>
                <input
                  type="number"
                  v-model.number="formData.max_trades_per_day"
                  min="1"
                  class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  每小时最大交易次数
                </label>
                <input
                  type="number"
                  v-model.number="formData.max_trades_per_hour"
                  min="1"
                  class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- 止损控制 -->
          <div class="border-b border-slate-200 pb-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg class="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              止损控制
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  每日最大亏损 (USDT)
                </label>
                <input
                  type="number"
                  v-model.number="formData.max_daily_loss"
                  min="0"
                  step="10"
                  class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  单笔最大亏损 (USDT)
                </label>
                <input
                  type="number"
                  v-model.number="formData.max_loss_per_trade"
                  min="0"
                  step="10"
                  class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- 熔断机制 -->
          <div>
            <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              熔断机制
            </h3>
            <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <input
                type="checkbox"
                id="enable_circuit_breaker"
                v-model="formData.enable_circuit_breaker"
                class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label for="enable_circuit_breaker" class="text-sm text-slate-700 cursor-pointer">
                启用熔断机制（当触发风控条件时自动暂停所有交易）
              </label>
            </div>
          </div>
        </div>

        <!-- 保存按钮 -->
        <div class="mt-6 flex gap-3">
          <button
            type="submit"
            :disabled="saveLoading"
            class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
          >
            {{ saveLoading ? '保存中...' : '保存配置' }}
          </button>
          <button
            type="button"
            @click="loadConfig"
            class="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
          >
            重置
          </button>
        </div>
      </form>
    </div>

    <!-- 空状态 -->
    <div v-else class="bg-white rounded-xl p-12 text-center border border-slate-200">
      <svg class="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
      <h3 class="text-lg font-medium text-slate-900 mb-2">加载配置失败</h3>
      <p class="text-slate-600 mb-4">无法加载风控配置</p>
      <button
        @click="loadConfig"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        重试
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const loading = ref(false)
const saveLoading = ref(false)
const resetLoading = ref(false)
const config = ref(null)

const formData = ref({
  max_total_position: 10000,
  max_open_positions: 5,
  max_position_per_trade: 1000,
  max_position_per_symbol: 2000,
  max_trades_per_day: 50,
  max_trades_per_hour: 10,
  max_daily_loss: 500,
  max_loss_per_trade: 100,
  enable_circuit_breaker: true
})

// 加载配置
const loadConfig = async () => {
  loading.value = true
  try {
    const response = await botAPI.getRiskConfig()

    const data = response.results?.[0] || response.data
    config.value = data

    // 更新表单数据
    if (data) {
      Object.keys(formData.value).forEach(key => {
        if (data[key] !== undefined) {
          formData.value[key] = data[key]
        }
      })
    }
  } catch (error) {
    console.error('加载风控配置失败:', error)
    showError('加载风控配置失败')
  } finally {
    loading.value = false
  }
}

// 保存配置
const handleSave = async () => {
  saveLoading.value = true
  try {
    if (config.value?.id) {
      await botAPI.updateRiskConfig(config.value.id, formData.value)
    } else {
      await botAPI.createRiskConfig(formData.value)
    }

    showSuccess('风控配置已保存')
    await loadConfig()
  } catch (error) {
    console.error('保存风控配置失败:', error)
    showError(error.response?.data?.message || '保存失败')
  } finally {
    saveLoading.value = false
  }
}

// 重置熔断
const handleResetBreaker = async () => {
  if (!confirm('确定要重置熔断机制吗？这将恢复所有交易功能。')) {
    return
  }

  resetLoading.value = true
  try {
    await botAPI.resetCircuitBreaker(config.value.id)

    showSuccess('熔断机制已重置')
    await loadConfig()
  } catch (error) {
    console.error('重置熔断失败:', error)
    showError('重置熔断失败')
  } finally {
    resetLoading.value = false
  }
}

onMounted(() => {
  loadConfig()
})
</script>

