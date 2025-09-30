<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">风险偏好</h2>
      <p class="text-gray-600 mt-1">管理您的风险承受能力和交易偏好设置</p>
    </div>

    <!-- 当前风险等级显示 -->
    <div class="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <div class="text-5xl">
            {{ getCurrentRiskIcon() }}
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-1">当前风险等级</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ getCurrentRiskType() }}</h3>
            <p class="text-gray-600 text-sm">{{ getCurrentRiskDescription() }}</p>
            <p class="text-xs text-gray-400 mt-2">最后更新: {{ riskAssessmentDate || '未设置' }}</p>
          </div>
        </div>
        <button
          @click="goToRiskAssessment"
          class="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex-shrink-0"
        >
          重新评估
        </button>
      </div>
    </div>

    <!-- 交易偏好设置 -->
    <div class="bg-white rounded-2xl border border-gray-200 p-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">交易偏好设置</h3>
      <p class="text-gray-600 mb-8 text-sm">根据您的风险等级，调整具体的交易参数</p>

      <div class="space-y-8">
        <!-- 最大单笔投资比例 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-900">最大单笔投资比例</label>
            <span class="text-lg font-bold text-blue-600">{{ tradingPreferences.maxSingleInvestment }}%</span>
          </div>
          <input
            v-model.number="tradingPreferences.maxSingleInvestment"
            type="range"
            min="1"
            max="50"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>保守 1%</span>
            <span>激进 50%</span>
          </div>
        </div>

        <!-- 止损比例 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-900">止损比例</label>
            <span class="text-lg font-bold text-red-600">{{ tradingPreferences.stopLoss }}%</span>
          </div>
          <input
            v-model.number="tradingPreferences.stopLoss"
            type="range"
            min="1"
            max="30"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>严格 1%</span>
            <span>宽松 30%</span>
          </div>
        </div>

        <!-- 止盈比例 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-900">止盈比例</label>
            <span class="text-lg font-bold text-green-600">{{ tradingPreferences.takeProfit }}%</span>
          </div>
          <input
            v-model.number="tradingPreferences.takeProfit"
            type="range"
            min="5"
            max="100"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>保守 5%</span>
            <span>激进 100%</span>
          </div>
        </div>

        <!-- 交易频率 - 方块样式 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-4">交易频率偏好</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="freq in frequencyOptions"
              :key="freq.value"
              @click="tradingPreferences.frequency = freq.value"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                tradingPreferences.frequency === freq.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              ]"
            >
              <div class="flex items-start space-x-3">
                <div :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                  tradingPreferences.frequency === freq.value
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300'
                ]">
                  <svg v-if="tradingPreferences.frequency === freq.value" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L4.5 8.5L2 6"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div :class="[
                    'font-semibold text-sm mb-1',
                    tradingPreferences.frequency === freq.value ? 'text-blue-900' : 'text-gray-900'
                  ]">
                    {{ freq.label }}
                  </div>
                  <div :class="[
                    'text-xs',
                    tradingPreferences.frequency === freq.value ? 'text-blue-700' : 'text-gray-500'
                  ]">
                    {{ freq.description }}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-end">
        <button
          @click="saveTradingPreferences"
          :disabled="tradingPreferencesLoading"
          class="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
        >
          {{ tradingPreferencesLoading ? '保存中...' : '保存设置' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 注入父组件的数据和方法
const riskAssessmentDate = inject('riskAssessmentDate')
const tradingPreferences = inject('tradingPreferences')
const tradingPreferencesLoading = inject('tradingPreferencesLoading')
const getCurrentRiskIcon = inject('getCurrentRiskIcon')
const getCurrentRiskType = inject('getCurrentRiskType')
const getCurrentRiskDescription = inject('getCurrentRiskDescription')
const saveTradingPreferences = inject('saveTradingPreferences')

// 交易频率选项
const frequencyOptions = [
  {
    value: 'conservative',
    label: '保守型',
    description: '每周1-2次'
  },
  {
    value: 'moderate',
    label: '稳健型',
    description: '每天1-2次'
  },
  {
    value: 'active',
    label: '积极型',
    description: '每天3-5次'
  },
  {
    value: 'aggressive',
    label: '激进型',
    description: '每天5次以上'
  }
]

// 跳转到风险评估页面
const goToRiskAssessment = () => {
  router.push('/risk-assessment')
}
</script>

<style scoped>
/* 蓝色滑块 - 投资比例 */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

/* 红色滑块 - 止损 */
.slider-red::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.slider-red::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

/* 绿色滑块 - 止盈 */
.slider-green::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.slider-green::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}
</style>
