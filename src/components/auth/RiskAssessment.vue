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
      <div v-if="hasExistingAssessment" class="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-8 mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="text-5xl">
              {{ currentRiskProfile.icon }}
            </div>
            <div>
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
              <label
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
                  <div class="font-semibold text-gray-900 text-base">{{ option.text }}</div>
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
                :disabled="selectedOption === null"
                :class="[
                  'px-8 py-3 rounded-xl font-semibold transition-all duration-200',
                  selectedOption === null
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
              <div class="grid grid-cols-2 gap-6">
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

// 问卷数据
const questions = ref([
  {
    title: "您的投资资金规模是？",
    description: "请选择您计划用于加密货币交易的资金规模",
    options: [
      { text: "1万以下", description: "适合小额试水，风险可控", weight: { conservative: 2 } },
      { text: "1-10万", description: "中等资金规模，可适度配置", weight: { moderate: 1 } },
      { text: "10-50万", description: "较大资金规模，需要专业管理", weight: { moderate: 1 } },
      { text: "50万以上", description: "大额资金，追求稳定增值", weight: { aggressive: 1 } }
    ]
  },
  {
    title: "您的加密货币交易经验如何？",
    description: "请选择最符合您情况的交易经验水平",
    options: [
      { text: "新手（<6个月）", description: "刚接触加密货币交易", weight: { conservative: 2 } },
      { text: "初级（6个月-2年）", description: "有一定交易经验", weight: { moderate: 1 } },
      { text: "中级（2-5年）", description: "较为熟悉市场规律", weight: { moderate: 1 } },
      { text: "高级（>5年）", description: "资深交易者", weight: { aggressive: 1 } }
    ]
  },
  {
    title: "您能承受的最大损失是多少？",
    description: "请选择您心理上能够接受的最大亏损比例",
    options: [
      { text: "最多5%", description: "非常保守，优先保本", weight: { conservative: 3 } },
      { text: "10-20%", description: "适度风险，稳健增长", weight: { moderate: 2 } },
      { text: "30-50%", description: "中高风险，追求收益", weight: { aggressive: 2 } },
      { text: "50%以上", description: "高风险高收益", weight: { aggressive: 3 } }
    ]
  },
  {
    title: "您期望的年化收益率是？",
    description: "请选择您对投资收益的期望水平",
    options: [
      { text: "10-20%", description: "稳健收益，风险较低", weight: { conservative: 2 } },
      { text: "30-50%", description: "平衡收益与风险", weight: { moderate: 2 } },
      { text: "100%+", description: "高收益，承担相应风险", weight: { aggressive: 2 } },
      { text: "追求最大收益", description: "激进策略，最大化收益", weight: { aggressive: 3 } }
    ]
  },
  {
    title: "您偏好的交易频率是？",
    description: "请选择您希望的交易操作频率",
    options: [
      { text: "长期持有（月级别）", description: "买入持有，长期投资", weight: { conservative: 2 } },
      { text: "中期波段（周级别）", description: "波段操作，中期持有", weight: { moderate: 2 } },
      { text: "短期交易（日级别）", description: "短线交易，快进快出", weight: { aggressive: 2 } },
      { text: "高频交易（小时级别）", description: "高频操作，追求短期收益", weight: { aggressive: 3 } }
    ]
  }
])

const currentQuestion = ref(1)
const totalQuestions = computed(() => questions.value.length)
const selectedOption = ref(null)
const answers = ref([])

// 下一题
const nextQuestion = () => {
  if (selectedOption.value === null) return
  
  // 保存答案
  answers.value[currentQuestion.value - 1] = {
    questionIndex: currentQuestion.value - 1,
    optionIndex: selectedOption.value,
    weight: questions.value[currentQuestion.value - 1].options[selectedOption.value].weight
  }
  
  if (currentQuestion.value < totalQuestions.value) {
    currentQuestion.value++
    selectedOption.value = answers.value[currentQuestion.value - 1]?.optionIndex ?? null
  } else {
    currentQuestion.value++
    calculateRiskProfile()
  }
}

// 上一题
const previousQuestion = () => {
  if (currentQuestion.value > 1) {
    currentQuestion.value--
    selectedOption.value = answers.value[currentQuestion.value - 1]?.optionIndex ?? null
  }
}

// 风险等级结果
const riskProfile = ref({})

// 计算风险等级
const calculateRiskProfile = () => {
  const scores = { conservative: 0, moderate: 0, aggressive: 0 }
  
  answers.value.forEach(answer => {
    Object.entries(answer.weight).forEach(([type, weight]) => {
      scores[type] += weight
    })
  })
  
  let profileType = 'moderate'
  if (scores.conservative >= 8) {
    profileType = 'conservative'
  } else if (scores.aggressive >= 8) {
    profileType = 'aggressive'
  }
  
  const profiles = {
    conservative: {
      type: '保守型',
      icon: '🛡️',
      color: 'bg-green-500',
      description: '您偏好稳健的投资策略，注重资金安全和稳定收益',
      strategies: '低风险网格、定投策略',
      positionSize: '10-30%'
    },
    moderate: {
      type: '稳健型',
      icon: '⚖️',
      color: 'bg-blue-500',
      description: '您追求收益与风险的平衡，适合中等风险策略',
      strategies: '波段交易、趋势跟踪',
      positionSize: '30-60%'
    },
    aggressive: {
      type: '激进型',
      icon: '🚀',
      color: 'bg-red-500',
      description: '您愿意承担较高风险以获取更高收益',
      strategies: '高频交易、杠杆策略',
      positionSize: '60-90%'
    }
  }
  
  riskProfile.value = profiles[profileType]
  riskProfile.value.level = profileType
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
  answers.value = []
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

    // 准备提交数据，确保格式符合后端要求
    const assessmentData = {
      answers: answers.value,
      risk_profile: {
        level: riskProfile.value.level,
        type: riskProfile.value.type,
        description: riskProfile.value.description,
        icon: riskProfile.value.icon,
        strategies: riskProfile.value.strategies,
        positionSize: riskProfile.value.positionSize
      }
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
      notification.success('风险偏好设置已保存', '保存成功')

      // 更新显示状态
      hasExistingAssessment.value = true
      currentRiskProfile.value = riskProfile.value
      assessmentDate.value = new Date().toLocaleDateString('zh-CN')
      showAssessment.value = false

      // 跳转到仪表板
      router.push('/dashboard')
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
