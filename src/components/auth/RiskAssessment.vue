<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 -->
    <div class="max-w-4xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-3">风险偏好评估</h1>
        <p class="text-gray-600 text-lg">根据您的风险承受能力，为您推荐最适合的交易策略</p>
      </div>

      <!-- 当前风险等级显示 -->
      <div v-if="hasExistingAssessment && !showAssessment" class="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-8 mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6 flex-1">
            <div class="text-5xl">
              {{ currentRiskProfile.icon }}
            </div>
            <div class="flex-1">
              <div class="text-sm text-gray-500 mb-1">当前风险等级</div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ currentRiskProfile.type }}</h3>
              <p class="text-gray-600 text-sm">{{ currentRiskProfile.description }}</p>
              <p class="text-xs text-gray-400 mt-2">评估时间: {{ assessmentDate }}</p>
            </div>
          </div>
          <button
            @click="startReassessment"
            class="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex-shrink-0"
          >
            重新评估
          </button>
        </div>
        <!-- 重新评估说明 -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-start space-x-2 text-sm text-gray-600">
            <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p>
              <span class="font-medium text-gray-900">重新评估说明：</span>
              重新评估将更新您的风险等级，<span class="font-semibold text-red-600">会自动应用新的交易参数</span>（如止损、止盈等）。您的个性化配置将被覆盖。
            </p>
          </div>
        </div>
      </div>

      <!-- 评估表单 -->
      <div v-if="!hasExistingAssessment || showAssessment" class="bg-white rounded-2xl shadow-sm border border-gray-200">
          <!-- 进度指示器 - 只在问题阶段显示 -->
          <div v-if="currentQuestion <= totalQuestions" class="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xl font-bold text-gray-900">风险偏好评估</h3>
              <span class="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">{{ currentQuestion }}/{{ totalQuestions }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                :style="{ width: `${(currentQuestion / totalQuestions) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- 问题内容 -->
          <div v-if="currentQuestion <= totalQuestions" class="p-8">
            <div class="mb-8">
              <h4 class="text-xl font-bold text-gray-900 mb-3">
                {{ questions[currentQuestion - 1].title }}
              </h4>
              <p class="text-gray-600 text-base">{{ questions[currentQuestion - 1].description }}</p>
            </div>

            <!-- 选项列表 -->
            <div class="space-y-4 mb-10">
              <!-- 单选题 -->
              <label
                v-if="questions[currentQuestion - 1].type === 'single'"
                v-for="(option, index) in questions[currentQuestion - 1].options"
                :key="index"
                :class="[
                  'flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all duration-200',
                  selectedOption === index
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                ]"
              >
                <input
                  type="radio"
                  :name="`question-${currentQuestion}`"
                  :value="index"
                  v-model="selectedOption"
                  class="mt-1 mr-4 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span v-if="option.icon" class="text-xl">{{ option.icon }}</span>
                    <span class="font-semibold text-gray-900 text-base">{{ option.text }}</span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1.5">{{ option.description }}</div>
                </div>
              </label>

              <!-- 多选题 -->
              <label
                v-if="questions[currentQuestion - 1].type === 'multiple'"
                v-for="(option, index) in questions[currentQuestion - 1].options"
                :key="index"
                :class="[
                  'flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all duration-200',
                  selectedOptions.includes(index)
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                ]"
              >
                <input
                  type="checkbox"
                  :value="index"
                  v-model="selectedOptions"
                  class="mt-1 mr-4 text-blue-600 focus:ring-blue-500 w-4 h-4 rounded"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span v-if="option.icon" class="text-xl">{{ option.icon }}</span>
                    <span class="font-semibold text-gray-900 text-base">{{ option.text }}</span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1.5">{{ option.description }}</div>
                </div>
              </label>
            </div>

            <!-- 导航按钮 -->
            <div class="flex justify-between gap-4">
              <button
                @click="previousQuestion"
                :disabled="currentQuestion === 1"
                :class="[
                  'px-8 py-3 rounded-xl font-semibold transition-all duration-200',
                  currentQuestion === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm'
                ]"
              >
                上一步
              </button>
              <button
                @click="nextQuestion"
                :disabled="!isCurrentQuestionAnswered"
                :class="[
                  'px-8 py-3 rounded-xl font-semibold transition-all duration-200',
                  !isCurrentQuestionAnswered
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm hover:shadow-md'
                ]"
              >
                {{ currentQuestion === totalQuestions ? '完成评估' : '下一步' }}
              </button>
            </div>
          </div>

          <!-- 评估结果 -->
          <div v-else class="p-10">
            <!-- 成功图标 -->
            <div class="flex justify-center mb-8">
              <div class="relative">
                <div class="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
                  <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- 标题 -->
            <div class="text-center mb-10">
              <h3 class="text-3xl font-bold text-gray-900 mb-3">评估完成</h3>
              <p class="text-gray-600 text-base">根据您的回答，我们为您匹配了最适合的风险等级</p>
            </div>

            <!-- 风险等级结果卡片 - 简约设计 -->
            <div class="border-2 border-gray-200 rounded-2xl p-8 mb-8 hover:border-blue-300 transition-colors">
              <!-- 风险等级图标和名称 -->
              <div class="flex items-center justify-center mb-6">
                <div class="text-6xl mr-4">{{ riskProfile.icon }}</div>
                <div class="text-left">
                  <div class="text-sm text-gray-500 mb-1">您的风险等级</div>
                  <h4 class="text-3xl font-bold text-gray-900">{{ riskProfile.type }}</h4>
                </div>
              </div>

              <!-- 描述 -->
              <p class="text-center text-gray-600 text-base mb-8 pb-8 border-b border-gray-200">
                {{ riskProfile.description }}
              </p>

              <!-- 推荐信息 - 网格布局 -->
              <div class="grid grid-cols-2 gap-6 mb-6">
                <div class="text-center">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <div class="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">推荐策略</div>
                  <div class="font-semibold text-gray-900">{{ riskProfile.strategies }}</div>
                </div>
                <div class="text-center">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 mb-3">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">建议仓位</div>
                  <div class="font-semibold text-gray-900">{{ riskProfile.positionSize }}</div>
                </div>
              </div>

              <!-- 参数变化对比（仅重新评估时显示） -->
              <div v-if="hasExistingAssessment && previewParamComparison" class="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                  </svg>
                  <h4 class="font-semibold text-gray-900 text-lg">参数变化对比</h4>
                </div>
                <div class="space-y-4">
                  <div class="bg-white rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-600">风险等级</span>
                      <div class="flex items-center gap-3">
                        <span class="text-sm text-gray-500">{{ previewParamComparison.oldRiskLevel }}</span>
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                        <span class="text-base font-bold text-blue-600">{{ previewParamComparison.newRiskLevel }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-600">风险分数</span>
                      <div class="flex items-center gap-3">
                        <span class="text-sm text-gray-500">{{ previewParamComparison.oldRiskScore }}/10</span>
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                        <span class="text-base font-bold text-blue-600">{{ previewParamComparison.newRiskScore }}/10</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-600">最大仓位</span>
                      <div class="flex items-center gap-3">
                        <span class="text-sm text-gray-500">{{ (previewParamComparison.oldMaxPosition * 100).toFixed(0) }}%</span>
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                        <span class="text-base font-bold text-blue-600">{{ (previewParamComparison.newMaxPosition * 100).toFixed(0) }}%</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-600">止损阈值</span>
                      <div class="flex items-center gap-3">
                        <span class="text-sm text-gray-500">{{ (previewParamComparison.oldStopLoss * 100).toFixed(0) }}%</span>
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                        <span class="text-base font-bold text-blue-600">{{ (previewParamComparison.newStopLoss * 100).toFixed(0) }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p class="text-xs text-yellow-800">
                      <span class="font-semibold">注意：</span>点击"保存设置并继续"后，新的交易参数将自动应用，您之前的个性化配置将被覆盖。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <button
              @click="completeAssessment"
              class="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              保存设置并继续
            </button>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../common/Header.vue'
import notification from '../../utils/notification.js'
import { apiRequest } from '../../utils/api.js'

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// 状态管理
const hasExistingAssessment = ref(false)
const showAssessment = ref(false)
const assessmentDate = ref('')
const currentRiskProfile = ref({})
const paramComparison = ref(null)  // 保存后的参数对比数据
const previewParamComparison = ref(null)  // 预览的参数对比数据（保存前）
const existingRiskProfile = ref(null)  // 保存现有的风险画像数据

// 问卷数据
const questions = ref([
  {
    title: "您的投资经验如何？",
    description: "请选择最符合您情况的投资经验水平",
    type: 'single',
    options: [
      { text: "新手，刚开始投资", description: "刚接触加密货币投资", value: 1 },
      { text: "有一些经验，投资1-3年", description: "有一定投资经验", value: 2 },
      { text: "经验丰富，投资3-5年", description: "较为熟悉市场规律", value: 3 },
      { text: "专业投资者，5年以上经验", description: "资深投资者", value: 4 }
    ]
  },
  {
    title: "您能承受多大的投资损失？",
    description: "请选择您心理上能够接受的最大亏损比例",
    type: 'single',
    options: [
      { text: "不能承受任何损失", description: "非常保守，优先保本", value: 1 },
      { text: "可以承受5%以内的损失", description: "适度风险，稳健增长", value: 2 },
      { text: "可以承受10-20%的损失", description: "中高风险，追求收益", value: 3 },
      { text: "可以承受20%以上的损失", description: "高风险高收益", value: 4 }
    ]
  },
  {
    title: "您的投资目标是什么？",
    description: "请选择您对投资收益的期望水平",
    type: 'single',
    options: [
      { text: "保值，避免通胀", description: "稳健收益，风险较低", value: 1 },
      { text: "稳健增长，年化5-10%", description: "平衡收益与风险", value: 2 },
      { text: "积极增长，年化10-20%", description: "高收益，承担相应风险", value: 3 },
      { text: "高收益，愿意承担高风险", description: "激进策略，最大化收益", value: 4 }
    ]
  },
  {
    title: "您的投资期限是多久？",
    description: "请选择您计划持有投资的时间长度",
    type: 'single',
    key: 'investmentHorizon',
    options: [
      { text: "短期（3个月内）", description: "快进快出，追求短期收益", value: 'short' },
      { text: "中期（3-12个月）", description: "中期持有，平衡风险收益", value: 'medium' },
      { text: "长期（1年以上）", description: "长期投资，看好项目发展", value: 'long' }
    ]
  },
  {
    title: "您更关注哪类项目？",
    description: "请选择您感兴趣的项目类别（可多选）",
    type: 'multiple',
    key: 'preferredCategories',
    options: [
      { text: "DeFi", description: "去中心化金融", value: 'DeFi', icon: '💰' },
      { text: "Layer1/Layer2", description: "公链和扩容方案", value: 'Layer1', icon: '⛓️' },
      { text: "NFT", description: "数字艺术和收藏品", value: 'NFT', icon: '🎨' },
      { text: "GameFi", description: "链游和元宇宙", value: 'GameFi', icon: '🎮' },
      { text: "AI", description: "AI相关项目", value: 'AI', icon: '🤖' },
      { text: "Meme", description: "Meme币和社区币", value: 'Meme', icon: '🐕' }
    ]
  },
  {
    title: "您偏好的市值规模？",
    description: "请选择您偏好投资的项目市值规模",
    type: 'single',
    key: 'marketCapPreference',
    options: [
      { text: "大盘币", description: "市值>100亿，稳定但收益有限", value: 'large' },
      { text: "中盘币", description: "市值10-100亿，平衡风险收益", value: 'medium' },
      { text: "小盘币", description: "市值<10亿，高风险高收益", value: 'small' },
      { text: "混合配置", description: "大中小盘合理配置", value: 'mixed' }
    ]
  }
])

const currentQuestion = ref(1)
const totalQuestions = computed(() => questions.value.length)
const selectedOption = ref(null)
const selectedOptions = ref([]) // 用于多选题
const answers = ref([null, null, null, null, [], null]) // 初始化答案数组

// 检查当前问题是否已回答
const isCurrentQuestionAnswered = computed(() => {
  const question = questions.value[currentQuestion.value - 1]
  if (question.type === 'multiple') {
    return selectedOptions.value.length > 0
  } else {
    return selectedOption.value !== null
  }
})

// 下一题
const nextQuestion = () => {
  const question = questions.value[currentQuestion.value - 1]

  // 保存答案
  if (question.type === 'multiple') {
    // 多选题：保存选中的值数组
    answers.value[currentQuestion.value - 1] = selectedOptions.value.map(index =>
      question.options[index].value
    )
  } else {
    // 单选题：保存选中选项的值
    answers.value[currentQuestion.value - 1] = question.options[selectedOption.value].value
  }

  if (currentQuestion.value < totalQuestions.value) {
    currentQuestion.value++
    // 恢复下一题的答案
    loadQuestionAnswer()
  } else {
    currentQuestion.value++
    calculateRiskProfile()
  }
}

// 上一题
const previousQuestion = () => {
  if (currentQuestion.value > 1) {
    currentQuestion.value--
    // 恢复上一题的答案
    loadQuestionAnswer()
  }
}

// 加载当前问题的已保存答案
const loadQuestionAnswer = () => {
  const question = questions.value[currentQuestion.value - 1]
  const savedAnswer = answers.value[currentQuestion.value - 1]

  if (question.type === 'multiple') {
    // 多选题：恢复选中的索引数组
    if (Array.isArray(savedAnswer) && savedAnswer.length > 0) {
      selectedOptions.value = question.options
        .map((opt, index) => savedAnswer.includes(opt.value) ? index : -1)
        .filter(index => index !== -1)
    } else {
      selectedOptions.value = []
    }
    selectedOption.value = null
  } else {
    // 单选题：恢复选中的索引
    if (savedAnswer !== null && savedAnswer !== undefined) {
      const optionIndex = question.options.findIndex(opt => opt.value === savedAnswer)
      selectedOption.value = optionIndex !== -1 ? optionIndex : null
    } else {
      selectedOption.value = null
    }
    selectedOptions.value = []
  }
}

// 切换多选选项
const toggleMultipleOption = (index) => {
  const idx = selectedOptions.value.indexOf(index)
  if (idx > -1) {
    selectedOptions.value.splice(idx, 1)
  } else {
    selectedOptions.value.push(index)
  }
}

// 风险等级结果
const riskProfile = ref({})

// 计算风险等级
const calculateRiskProfile = () => {
  // 计算风险等级（只用前3个问题的分数）
  const totalScore = answers.value.slice(0, 3).reduce((sum, answer) => {
    return sum + (typeof answer === 'number' ? answer : 0)
  }, 0)

  let profileType = 'moderate'

  if (totalScore <= 4) {
    profileType = 'conservative'
  } else if (totalScore <= 8) {
    profileType = 'moderate'
  } else {
    profileType = 'aggressive'
  }

  const profiles = {
    conservative: {
      type: '保守型',
      level: 'conservative',
      icon: '🛡️',
      color: 'bg-green-500',
      description: '您偏好稳健的投资策略，注重资金安全和稳定收益',
      strategies: '低风险网格、定投策略',
      positionSize: '10-30%'
    },
    moderate: {
      type: '稳健型',
      level: 'moderate',
      icon: '⚖️',
      color: 'bg-blue-500',
      description: '您追求收益与风险的平衡，适合中等风险策略',
      strategies: '波段交易、趋势跟踪',
      positionSize: '30-60%'
    },
    aggressive: {
      type: '激进型',
      level: 'aggressive',
      icon: '🚀',
      color: 'bg-red-500',
      description: '您愿意承担较高风险以获取更高收益',
      strategies: '高频交易、杠杆策略',
      positionSize: '60-90%'
    }
  }

  riskProfile.value = profiles[profileType]

  // 如果是重新评估，生成参数对比预览
  if (hasExistingAssessment.value && existingRiskProfile.value) {
    const newRiskScore = Math.min(10, Math.max(1, Math.round(totalScore / 3)))

    // 计算新的推荐参数
    const newMaxPosition = profileType === 'conservative' ? 0.3 : profileType === 'moderate' ? 0.5 : 0.7
    const newStopLoss = profileType === 'conservative' ? 0.05 : profileType === 'moderate' ? 0.1 : 0.15

    const riskLevelMap = {
      'conservative': '保守型',
      'moderate': '稳健型',
      'aggressive': '激进型'
    }

    previewParamComparison.value = {
      oldRiskLevel: riskLevelMap[existingRiskProfile.value.risk_level] || existingRiskProfile.value.risk_level,
      newRiskLevel: profiles[profileType].type,
      oldRiskScore: existingRiskProfile.value.risk_score,
      newRiskScore: newRiskScore,
      oldMaxPosition: parseFloat(existingRiskProfile.value.max_position_size),
      newMaxPosition: newMaxPosition,
      oldStopLoss: parseFloat(existingRiskProfile.value.stop_loss_threshold),
      newStopLoss: newStopLoss
    }
  }
}

// 加载现有评估
const loadExistingAssessment = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.log('未登录，无法加载风险评估')
      return
    }

    const response = await apiRequest(`${API_BASE_URL}/api/auth/risk-assessment/status/`, {
      method: 'GET'
    })

    if (response.status === 'success' && response.data.has_assessment) {
      hasExistingAssessment.value = true
      const profile = response.data.risk_profile

      // 保存现有的风险画像数据（用于对比）
      existingRiskProfile.value = {
        risk_level: profile.risk_level,
        risk_score: profile.risk_score,
        max_position_size: profile.max_position_size,
        stop_loss_threshold: profile.stop_loss_threshold
      }

      // 转换后端数据格式为前端格式
      const riskLevelMap = {
        'conservative': { type: '保守型', icon: '🛡️', color: 'bg-green-500' },
        'moderate': { type: '稳健型', icon: '⚖️', color: 'bg-blue-500' },
        'aggressive': { type: '激进型', icon: '🚀', color: 'bg-red-500' }
      }

      const levelInfo = riskLevelMap[profile.risk_level] || riskLevelMap['moderate']
      currentRiskProfile.value = {
        ...levelInfo,
        level: profile.risk_level,
        description: profile.risk_level_display,
        strategies: getStrategiesForLevel(profile.risk_level),
        positionSize: getPositionSizeForLevel(profile.risk_level)
      }

      assessmentDate.value = new Date(profile.updated_at).toLocaleDateString('zh-CN')
    }
  } catch (error) {
    console.error('加载风险评估失败:', error)
  }
}

// 根据风险等级获取策略
const getStrategiesForLevel = (level) => {
  const strategies = {
    'conservative': '低风险网格、定投策略',
    'moderate': '波段交易、趋势跟踪',
    'aggressive': '高频交易、杠杆策略'
  }
  return strategies[level] || strategies['moderate']
}

// 根据风险等级获取仓位大小
const getPositionSizeForLevel = (level) => {
  const positionSizes = {
    'conservative': '10-30%',
    'moderate': '30-60%',
    'aggressive': '60-90%'
  }
  return positionSizes[level] || positionSizes['moderate']
}

// 开始重新评估
const startReassessment = () => {
  showAssessment.value = true
  currentQuestion.value = 1
  selectedOption.value = null
  selectedOptions.value = []
  answers.value = [null, null, null, null, [], null]
  paramComparison.value = null  // 清空参数对比
}

// 完成评估
const completeAssessment = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      notification.error('请先登录', '错误')
      router.push('/auth')
      return
    }

    // 提取投资偏好数据
    const investmentPreferences = {
      investmentHorizon: answers.value[3] || 'medium',
      preferredCategories: answers.value[4] || [],
      marketCapPreference: answers.value[5] || 'mixed'
    }

    // 准备提交数据
    const assessmentData = {
      answers: answers.value.map((answer, index) => ({
        questionIndex: index,
        answer: answer,
        question: questions.value[index].title,
        key: questions.value[index].key || null
      })),
      risk_profile: {
        level: riskProfile.value.level,
        type: riskProfile.value.type,
        description: riskProfile.value.description
      },
      investment_preferences: investmentPreferences
    }

    console.log('提交风险评估数据:', assessmentData)

    // 提交到后端API
    const response = await apiRequest(
      `${API_BASE_URL}/api/auth/risk-assessment/submit/`,
      {
        method: 'POST',
        body: JSON.stringify(assessmentData)
      }
    )

    if (response.status === 'success') {
      notification.success('风险偏好设置已保存，交易参数已自动更新', '保存成功')

      // 直接跳转到市场推荐页面
      setTimeout(() => {
        router.push('/market?tab=recommended')
      }, 1000)
    } else {
      notification.error(response.message || '保存失败', '错误')
    }

  } catch (error) {
    console.error('保存风险评估失败:', error)
    notification.error(error.message || '保存失败，请重试', '错误')
  }
}

// 组件挂载时加载现有评估
onMounted(() => {
  loadExistingAssessment()
})
</script>
