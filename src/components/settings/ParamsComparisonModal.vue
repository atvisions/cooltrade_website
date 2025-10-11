<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="close"></div>

      <!-- 居中对齐 -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <!-- 弹窗内容 -->
      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- 标题 -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 flex items-center">
                🎉 评估完成！
              </h3>
              <p class="mt-2 text-sm text-gray-600">
                您的新风险等级：<span class="font-bold text-gray-900">{{ newRiskType }}</span>
                <span v-if="oldRiskType !== newRiskType" class="text-gray-500">
                  （从 {{ oldRiskType }} 更新）
                </span>
              </p>
            </div>
            <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 参数对比表格 -->
        <div class="px-8 py-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            推荐参数对比
          </h4>

          <div class="overflow-hidden border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参数</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">当前值</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">新推荐值</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">变化</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="param in paramComparison" :key="param.key" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-900">{{ param.label }}</span>
                      <button 
                        class="ml-2 text-gray-400 hover:text-gray-600"
                        :title="param.description"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="text-sm font-semibold text-gray-700">{{ param.current }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="text-sm font-semibold text-blue-600">{{ param.recommended }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span 
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        param.changeType === 'increase' ? 'bg-green-100 text-green-800' :
                        param.changeType === 'decrease' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      ]"
                    >
                      <span v-if="param.changeType === 'increase'">⬆️</span>
                      <span v-else-if="param.changeType === 'decrease'">⬇️</span>
                      <span v-else>➡️</span>
                      <span class="ml-1">{{ param.change }}</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 提示信息 -->
          <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="ml-3 text-sm text-blue-800">
                <p class="font-medium mb-1">请选择：</p>
                <ul class="list-disc list-inside space-y-1 text-blue-700">
                  <li><strong>保留当前参数</strong>：您的个性化配置将被保留，只更新风险等级标签</li>
                  <li><strong>应用新推荐参数</strong>：根据新的风险等级更新所有交易参数</li>
                </ul>
                <p class="mt-2 text-xs text-blue-600">💡 您随时可以在设置页面手动调整这些参数</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="bg-gray-50 px-8 py-4 flex items-center justify-end space-x-3 border-t border-gray-200">
          <button
            @click="keepCurrentParams"
            :disabled="loading"
            class="px-6 py-2.5 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            保留当前参数
          </button>
          <button
            @click="applyRecommendedParams"
            :disabled="loading"
            class="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow flex items-center space-x-2"
          >
            <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? '应用中...' : '应用新推荐参数' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { apiRequest, API_BASE_URL } from '../../utils/api.js'
import notification from '../../utils/notification.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  currentParams: {
    type: Object,
    required: true
  },
  recommendedParams: {
    type: Object,
    required: true
  },
  oldRiskType: {
    type: String,
    default: ''
  },
  newRiskType: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'applied', 'kept'])

const loading = ref(false)

// 参数对比数据
const paramComparison = computed(() => {
  const params = []
  
  // 止损比例
  const currentStopLoss = props.currentParams.stopLoss || 0
  const recommendedStopLoss = Math.round((props.recommendedParams.stop_loss_threshold || 0) * 100)
  params.push({
    key: 'stopLoss',
    label: '止损比例',
    description: '触发自动止损的亏损阈值',
    current: `${currentStopLoss}%`,
    recommended: `${recommendedStopLoss}%`,
    change: `${recommendedStopLoss > currentStopLoss ? '+' : ''}${recommendedStopLoss - currentStopLoss}%`,
    changeType: recommendedStopLoss > currentStopLoss ? 'increase' : recommendedStopLoss < currentStopLoss ? 'decrease' : 'same'
  })
  
  // 单笔投资比例
  const currentMaxSingle = props.currentParams.maxSingleInvestment || 0
  const recommendedMaxSingle = Math.round((props.recommendedParams.max_position_size || 0) * 100)
  params.push({
    key: 'maxSingleInvestment',
    label: '单笔投资比例',
    description: '单次交易占总资金的最大比例',
    current: `${currentMaxSingle}%`,
    recommended: `${recommendedMaxSingle}%`,
    change: `${recommendedMaxSingle > currentMaxSingle ? '+' : ''}${recommendedMaxSingle - currentMaxSingle}%`,
    changeType: recommendedMaxSingle > currentMaxSingle ? 'increase' : recommendedMaxSingle < currentMaxSingle ? 'decrease' : 'same'
  })
  
  return params
})

// 保留当前参数
const keepCurrentParams = () => {
  emit('kept')
  close()
}

// 应用推荐参数
const applyRecommendedParams = async () => {
  loading.value = true
  try {
    const response = await apiRequest(
      `${API_BASE_URL}/auth/risk-profile/apply-recommended-params/`,
      {
        method: 'POST'
      }
    )

    if (response.status === 'success') {
      notification.success('推荐参数已应用', '成功')
      emit('applied', response.data)
      close()
    } else {
      notification.error(response.message || '应用失败', '错误')
    }
  } catch (error) {
    console.error('应用推荐参数失败:', error)
    notification.error('应用推荐参数失败', '错误')
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
const close = () => {
  if (!loading.value) {
    emit('close')
  }
}
</script>

