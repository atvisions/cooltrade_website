<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="risk-config" />
        </div>
        <main class="flex-1 min-w-0">
          <!-- 页面头部 -->
          <div class="mb-8">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h1 class="text-3xl font-bold text-slate-900">风控配置</h1>
                <p class="text-slate-600 mt-1">管理全局风险控制参数</p>
              </div>
              <div class="flex gap-3">
                <Button 
                  variant="secondary" 
                  @click="loadConfig"
                  :loading="loading"
                  class="flex items-center gap-2"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  刷新
                </Button>
                <Button 
                  v-if="config && config.is_circuit_breaker_triggered"
                  variant="danger" 
                  @click="handleResetBreaker"
                  :loading="resetLoading"
                  class="flex items-center gap-2"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  重置熔断
                </Button>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <!-- 配置内容 -->
          <div v-else-if="config" class="space-y-6">
            <!-- 熔断警告 -->
            <div v-if="config.is_circuit_breaker_triggered" class="bg-red-50 border-2 border-red-500 rounded-xl p-6">
              <div class="flex items-start gap-4">
                <svg class="h-8 w-8 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-red-900 mb-2">⚠️ 熔断机制已触发</h3>
                  <p class="text-red-800 mb-4">
                    由于触发风控条件，所有交易已被暂停。请检查账户状态后手动重置熔断机制。
                  </p>
                  <Button variant="danger" @click="handleResetBreaker" :loading="resetLoading">
                    重置熔断机制
                  </Button>
                </div>
              </div>
            </div>

            <!-- 实时统计 -->
            <div class="bg-white rounded-xl p-6 border border-slate-200">
              <h2 class="text-xl font-bold text-slate-900 mb-4">实时统计</h2>
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
                    限制: -${{ config.max_daily_loss }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 配置表单 -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- 仓位限制 -->
              <div class="bg-white rounded-xl p-6 border border-slate-200">
                <h2 class="text-xl font-bold text-slate-900 mb-4">仓位限制</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      最大总仓位 (USDT)
                    </label>
                    <InputNumber
                      v-model="formData.max_total_position"
                      :min="0"
                      :step="100"
                      class="w-full"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      单机器人最大仓位 (USDT)
                    </label>
                    <InputNumber
                      v-model="formData.max_position_per_bot"
                      :min="0"
                      :step="100"
                      class="w-full"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      最大杠杆倍数
                    </label>
                    <InputNumber
                      v-model="formData.max_leverage"
                      :min="1"
                      :max="125"
                      class="w-full"
                    />
                  </div>
                </div>
              </div>

              <!-- 亏损限制 -->
              <div class="bg-white rounded-xl p-6 border border-slate-200">
                <h2 class="text-xl font-bold text-slate-900 mb-4">亏损限制</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      最大日亏损 (USDT)
                    </label>
                    <InputNumber
                      v-model="formData.max_daily_loss"
                      :min="0"
                      :step="100"
                      class="w-full"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      最大回撤百分比 (%)
                    </label>
                    <InputNumber
                      v-model="formData.max_drawdown_percentage"
                      :min="0"
                      :max="100"
                      :step="1"
                      class="w-full"
                    />
                  </div>
                </div>
              </div>

              <!-- 交易限制 -->
              <div class="bg-white rounded-xl p-6 border border-slate-200">
                <h2 class="text-xl font-bold text-slate-900 mb-4">交易限制</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      最大持仓数
                    </label>
                    <InputNumber
                      v-model="formData.max_open_positions"
                      :min="1"
                      :max="100"
                      class="w-full"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      最大日交易次数
                    </label>
                    <InputNumber
                      v-model="formData.max_trades_per_day"
                      :min="1"
                      :max="1000"
                      class="w-full"
                    />
                  </div>
                </div>
              </div>

              <!-- 熔断机制 -->
              <div class="bg-white rounded-xl p-6 border border-slate-200">
                <h2 class="text-xl font-bold text-slate-900 mb-4">熔断机制</h2>
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <Checkbox
                      v-model="formData.circuit_breaker_enabled"
                      :binary="true"
                      inputId="circuit_breaker"
                    />
                    <label for="circuit_breaker" class="text-sm font-medium text-slate-700">
                      启用熔断机制
                    </label>
                  </div>
                  <div v-if="formData.circuit_breaker_enabled">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      熔断触发亏损 (USDT)
                    </label>
                    <InputNumber
                      v-model="formData.circuit_breaker_loss"
                      :min="0"
                      :step="100"
                      class="w-full"
                    />
                    <p class="text-xs text-slate-500 mt-2">
                      当日亏损达到此金额时，自动停止所有交易
                    </p>
                  </div>
                </div>
              </div>

              <!-- 提交按钮 -->
              <div class="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  :loading="submitting"
                  class="flex-1"
                >
                  保存配置
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  @click="loadConfig"
                  class="flex-1"
                >
                  重置
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Header from '../../common/Header.vue'
import UserSidebar from '../../common/UserSidebar.vue'
import Button from '../../common/ui/Button.vue'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

// 状态
const loading = ref(false)
const submitting = ref(false)
const resetLoading = ref(false)
const config = ref(null)
const formData = ref({
  max_total_position: 0,
  max_position_per_bot: 0,
  max_leverage: 1,
  max_daily_loss: 0,
  max_drawdown_percentage: 0,
  max_open_positions: 1,
  max_trades_per_day: 1,
  circuit_breaker_enabled: true,
  circuit_breaker_loss: 0
})

// 加载配置
const loadConfig = async () => {
  try {
    loading.value = true
    const response = await botAPI.getRiskConfig()
    config.value = response.data || response
    
    // 更新表单数据
    formData.value = {
      max_total_position: parseFloat(config.value.max_total_position),
      max_position_per_bot: parseFloat(config.value.max_position_per_bot),
      max_leverage: config.value.max_leverage,
      max_daily_loss: parseFloat(config.value.max_daily_loss),
      max_drawdown_percentage: parseFloat(config.value.max_drawdown_percentage),
      max_open_positions: config.value.max_open_positions,
      max_trades_per_day: config.value.max_trades_per_day,
      circuit_breaker_enabled: config.value.circuit_breaker_enabled,
      circuit_breaker_loss: parseFloat(config.value.circuit_breaker_loss)
    }
  } catch (error) {
    console.error('加载风控配置失败:', error)
    showError('加载风控配置失败')
  } finally {
    loading.value = false
  }
}

// 提交配置
const handleSubmit = async () => {
  try {
    submitting.value = true
    await botAPI.updateRiskConfig(formData.value)
    showSuccess('风控配置已更新')
    await loadConfig()
  } catch (error) {
    console.error('更新失败:', error)
    showError(error.message || '更新失败')
  } finally {
    submitting.value = false
  }
}

// 重置熔断
const handleResetBreaker = async () => {
  try {
    resetLoading.value = true
    await botAPI.resetCircuitBreaker()
    showSuccess('熔断机制已重置')
    await loadConfig()
  } catch (error) {
    console.error('重置失败:', error)
    showError(error.message || '重置失败')
  } finally {
    resetLoading.value = false
  }
}

onMounted(() => {
  loadConfig()
})
</script>

