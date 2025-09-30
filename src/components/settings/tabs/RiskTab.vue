<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">风险偏好</h2>
      <p class="text-gray-600 mt-1">管理您的风险承受能力和交易偏好设置</p>
    </div>

      <!-- 当前风险等级显示 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <div :class="['w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold', getCurrentRiskColor()]">
              {{ getCurrentRiskIcon() }}
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">{{ getCurrentRiskType() }}</h3>
              <p class="text-gray-600">{{ getCurrentRiskDescription() }}</p>
              <p class="text-sm text-gray-500 mt-1">最后更新: {{ riskAssessmentDate || '未设置' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 风险评估问卷 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">风险评估问卷</h3>
            <p class="text-gray-600 mt-1">通过回答以下问题，我们将为您评估合适的风险等级</p>
          </div>
          <button
            @click="resetAssessment"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            重新评估
          </button>
        </div>

        <div class="space-y-6">
          <div v-for="(question, index) in riskQuestions" :key="index" class="border-b border-gray-100 pb-6 last:border-b-0">
            <h4 class="font-medium text-gray-900 mb-3">{{ index + 1 }}. {{ question.question }}</h4>
            <div class="space-y-2">
              <label v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center">
                <input
                  v-model="riskAnswers[index]"
                  :value="option.value"
                  type="radio"
                  :name="`question-${index}`"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-3 text-gray-700">{{ option.text }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="calculateRiskProfile"
            :disabled="!allQuestionsAnswered"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            计算风险等级
          </button>
        </div>
      </div>

      <!-- 交易偏好设置 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">交易偏好设置</h3>
        <p class="text-gray-600 mb-6">根据您的风险等级，调整具体的交易参数</p>

        <div class="space-y-6">
          <!-- 最大单笔投资比例 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              最大单笔投资比例: {{ tradingPreferences.maxSingleInvestment }}%
            </label>
            <input
              v-model.number="tradingPreferences.maxSingleInvestment"
              type="range"
              min="1"
              max="50"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>1%</span>
              <span>50%</span>
            </div>
          </div>

          <!-- 止损比例 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              止损比例: {{ tradingPreferences.stopLoss }}%
            </label>
            <input
              v-model.number="tradingPreferences.stopLoss"
              type="range"
              min="1"
              max="30"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          <!-- 止盈比例 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              止盈比例: {{ tradingPreferences.takeProfit }}%
            </label>
            <input
              v-model.number="tradingPreferences.takeProfit"
              type="range"
              min="5"
              max="100"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>5%</span>
              <span>100%</span>
            </div>
          </div>

          <!-- 交易频率 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">交易频率偏好</label>
            <select
              v-model="tradingPreferences.frequency"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="conservative">保守型 (每周1-2次)</option>
              <option value="moderate">稳健型 (每天1-2次)</option>
              <option value="active">积极型 (每天3-5次)</option>
              <option value="aggressive">激进型 (每天5次以上)</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="saveTradingPreferences"
            :disabled="tradingPreferencesLoading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ tradingPreferencesLoading ? '保存中...' : '保存设置' }}
          </button>
        </div>
      </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

// 注入父组件的数据和方法
const riskQuestions = inject('riskQuestions')
const riskAnswers = inject('riskAnswers')
const riskAssessmentDate = inject('riskAssessmentDate')
const tradingPreferences = inject('tradingPreferences')
const tradingPreferencesLoading = inject('tradingPreferencesLoading')
const getCurrentRiskColor = inject('getCurrentRiskColor')
const getCurrentRiskIcon = inject('getCurrentRiskIcon')
const getCurrentRiskType = inject('getCurrentRiskType')
const getCurrentRiskDescription = inject('getCurrentRiskDescription')
const resetAssessment = inject('resetAssessment')
const calculateRiskProfile = inject('calculateRiskProfile')
const saveTradingPreferences = inject('saveTradingPreferences')

// 检查是否所有问题都已回答
const allQuestionsAnswered = computed(() => {
  return riskAnswers.value.every(answer => answer !== null)
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>
