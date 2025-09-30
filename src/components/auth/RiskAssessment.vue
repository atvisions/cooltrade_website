<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 侧边栏 -->
    <Sidebar activeItem="settings" />

    <!-- 主内容区域 -->
    <main class="ml-64 p-8">
      <div class="max-w-4xl mx-auto">
        <!-- 页面标题 -->
        <div class="mb-8">
          <div class="flex items-center space-x-4 mb-4">
            <button
              @click="goBack"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">风险偏好设置</h1>
              <p class="text-gray-600 mt-1">根据您的风险承受能力，为您推荐最适合的交易策略</p>
            </div>
          </div>
        </div>

        <!-- 当前风险等级显示 -->
        <div v-if="hasExistingAssessment" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div :class="['w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold', currentRiskProfile.color]">
                {{ currentRiskProfile.icon }}
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">{{ currentRiskProfile.type }}</h3>
                <p class="text-gray-600">{{ currentRiskProfile.description }}</p>
                <p class="text-sm text-gray-500 mt-1">评估时间: {{ assessmentDate }}</p>
              </div>
            </div>
            <button
              @click="startReassessment"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              重新评估
            </button>
          </div>
        </div>

        <!-- 评估表单 -->
        <div v-if="!hasExistingAssessment || showAssessment" class="bg-white rounded-lg shadow-sm border border-gray-200">
          <!-- 进度指示器 -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900">风险偏好评估</h3>
              <span class="text-sm text-gray-500">{{ currentQuestion }}/{{ totalQuestions }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(currentQuestion / totalQuestions) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- 问题内容 -->
          <div v-if="currentQuestion <= totalQuestions" class="p-6">
            <div class="mb-6">
              <h4 class="text-lg font-medium text-gray-900 mb-2">
                {{ questions[currentQuestion - 1].title }}
              </h4>
              <p class="text-gray-600">{{ questions[currentQuestion - 1].description }}</p>
            </div>

            <!-- 选项列表 -->
            <div class="space-y-3 mb-8">
              <label
                v-for="(option, index) in questions[currentQuestion - 1].options"
                :key="index"
                :class="[
                  'flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200',
                  selectedOption === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <input
                  type="radio"
                  :name="`question-${currentQuestion}`"
                  :value="index"
                  v-model="selectedOption"
                  class="mt-1 mr-4 text-blue-600 focus:ring-blue-500"
                />
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ option.text }}</div>
                  <div class="text-sm text-gray-500 mt-1">{{ option.description }}</div>
                </div>
              </label>
            </div>

            <!-- 导航按钮 -->
            <div class="flex justify-between">
              <button
                @click="previousQuestion"
                :disabled="currentQuestion === 1"
                :class="[
                  'px-6 py-2 rounded-lg font-medium transition-colors duration-200',
                  currentQuestion === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                上一步
              </button>
              <button
                @click="nextQuestion"
                :disabled="selectedOption === null"
                :class="[
                  'px-6 py-2 rounded-lg font-medium transition-colors duration-200',
                  selectedOption === null
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                ]"
              >
                {{ currentQuestion === totalQuestions ? '完成评估' : '下一步' }}
              </button>
            </div>
          </div>

          <!-- 评估结果 -->
          <div v-else class="p-6 text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h3 class="text-xl font-semibold text-gray-900 mb-2">评估完成！</h3>
            <p class="text-gray-600 mb-6">根据您的回答，我们为您匹配了最适合的风险等级</p>

            <!-- 风险等级结果卡片 -->
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
              <div class="flex items-center justify-center mb-4">
                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {{ riskProfile.icon }}
                </div>
              </div>
              <h4 class="text-xl font-bold mb-2">{{ riskProfile.type }}</h4>
              <p class="text-blue-100 mb-4">{{ riskProfile.description }}</p>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-white bg-opacity-10 rounded-lg p-3">
                  <div class="text-blue-200 text-xs uppercase tracking-wide">推荐策略</div>
                  <div class="font-medium mt-1">{{ riskProfile.strategies }}</div>
                </div>
                <div class="bg-white bg-opacity-10 rounded-lg p-3">
                  <div class="text-blue-200 text-xs uppercase tracking-wide">建议仓位</div>
                  <div class="font-medium mt-1">{{ riskProfile.positionSize }}</div>
                </div>
              </div>
            </div>

            <button
              @click="completeAssessment"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../common/Sidebar.vue'
import notification from '../../utils/notification.js'

const router = useRouter()

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

// 选择选项
const selectOption = (index) => {
  selectedOption.value = index
}

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
const loadExistingAssessment = () => {
  const savedAssessment = localStorage.getItem('risk_assessment')
  if (savedAssessment) {
    try {
      const assessmentData = JSON.parse(savedAssessment)
      hasExistingAssessment.value = true
      currentRiskProfile.value = assessmentData.riskProfile
      assessmentDate.value = new Date(assessmentData.completedAt).toLocaleDateString('zh-CN')
    } catch (error) {
      console.error('加载风险评估失败:', error)
    }
  }
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
    const assessmentData = {
      answers: answers.value,
      riskProfile: riskProfile.value,
      completedAt: new Date().toISOString()
    }

    localStorage.setItem('risk_assessment', JSON.stringify(assessmentData))

    notification.success('风险偏好设置已保存', '保存成功')

    // 更新显示状态
    hasExistingAssessment.value = true
    currentRiskProfile.value = riskProfile.value
    assessmentDate.value = new Date().toLocaleDateString('zh-CN')
    showAssessment.value = false

  } catch (error) {
    console.error('保存风险评估失败:', error)
    notification.error('保存失败，请重试', '错误')
  }
}

// 返回设置页面
const goBack = () => {
  router.push('/settings')
}

// 组件挂载时加载现有评估
onMounted(() => {
  loadExistingAssessment()
})
</script>
