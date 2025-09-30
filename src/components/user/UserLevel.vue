<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <!-- 当前等级展示 -->
    <div class="text-center mb-8">
      <div class="relative inline-block">
        <div :class="[
          'w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4',
          currentLevel.color
        ]">
          {{ currentLevel.icon }}
        </div>
        <div :class="[
          'absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white',
          currentLevel.color
        ]">
          {{ userLevel }}
        </div>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ currentLevel.name }}</h3>
      <p class="text-gray-600 mb-4">{{ currentLevel.description }}</p>
      
      <!-- 经验值进度条 -->
      <div class="max-w-md mx-auto">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>当前经验: {{ userExp }}</span>
          <span>下级需要: {{ nextLevel ? nextLevel.requiredExp : '已满级' }}</span>
        </div>
        <div class="bg-gray-200 rounded-full h-3">
          <div 
            :class="['h-3 rounded-full transition-all duration-500', currentLevel.color]"
            :style="{ width: `${expProgress}%` }"
          ></div>
        </div>
        <p class="text-sm text-gray-500 mt-2">
          {{ nextLevel ? `还需 ${nextLevel.requiredExp - userExp} 经验升级` : '已达到最高等级' }}
        </p>
      </div>
    </div>

    <!-- 等级权益 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <h4 class="text-lg font-semibold text-gray-900 mb-4">🎁 当前权益</h4>
        <div class="space-y-3">
          <div v-for="benefit in currentLevel.benefits" :key="benefit" class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-gray-700">{{ benefit }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="nextLevel">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">🚀 升级权益</h4>
        <div class="space-y-3">
          <div v-for="benefit in nextLevel.benefits" :key="benefit" class="flex items-center">
            <svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="text-gray-600">{{ benefit }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 经验获取方式 -->
    <div class="bg-gray-50 rounded-xl p-6">
      <h4 class="text-lg font-semibold text-gray-900 mb-4">💎 经验获取方式</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="method in expMethods" :key="method.action" class="bg-white rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">{{ method.action }}</span>
            <span class="text-sm font-bold text-blue-600">+{{ method.exp }}</span>
          </div>
          <p class="text-xs text-gray-500">{{ method.description }}</p>
          <div class="mt-2">
            <div class="text-xs text-gray-400">今日: {{ method.todayCount }}/{{ method.dailyLimit }}</div>
            <div class="bg-gray-200 rounded-full h-1 mt-1">
              <div 
                class="bg-blue-500 h-1 rounded-full"
                :style="{ width: `${(method.todayCount / method.dailyLimit) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 等级列表 -->
    <div class="mt-8">
      <h4 class="text-lg font-semibold text-gray-900 mb-4">🏆 等级体系</h4>
      <div class="space-y-3">
        <div 
          v-for="level in levels" 
          :key="level.level"
          :class="[
            'flex items-center p-4 rounded-lg border-2 transition-all duration-200',
            level.level === userLevel 
              ? 'border-blue-500 bg-blue-50' 
              : level.level < userLevel 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
          ]"
        >
          <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-white mr-4', level.color]">
            {{ level.icon }}
          </div>
          <div class="flex-1">
            <div class="flex items-center">
              <h5 class="font-semibold text-gray-900 mr-2">Lv.{{ level.level }} {{ level.name }}</h5>
              <span v-if="level.level === userLevel" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">当前</span>
              <span v-else-if="level.level < userLevel" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">已达成</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">需要经验: {{ level.requiredExp }} | {{ level.description }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium text-gray-700">{{ level.benefits.length }} 项权益</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 用户数据
const userLevel = ref(1)
const userExp = ref(150)

// 等级配置
const levels = ref([
  {
    level: 1,
    name: '新手交易员',
    icon: '🌱',
    color: 'bg-gray-500',
    requiredExp: 0,
    description: '刚开始交易之旅',
    benefits: ['基础策略推荐', '新手指导', '客服支持']
  },
  {
    level: 2,
    name: '初级交易员',
    icon: '📈',
    color: 'bg-blue-500',
    requiredExp: 100,
    description: '掌握基本交易技能',
    benefits: ['基础策略推荐', '新手指导', '客服支持', '邀请好友功能', '会员9.5折']
  },
  {
    level: 3,
    name: '中级交易员',
    icon: '💎',
    color: 'bg-purple-500',
    requiredExp: 300,
    description: '具备一定交易经验',
    benefits: ['基础策略推荐', '新手指导', '客服支持', '邀请好友功能', '会员9折', '高级策略解锁', '专属客服']
  },
  {
    level: 4,
    name: '高级交易员',
    icon: '👑',
    color: 'bg-yellow-500',
    requiredExp: 600,
    description: '资深交易专家',
    benefits: ['所有策略权限', '邀请好友功能', '会员8.5折', '专属客服', '优先策略推送', '交易手续费减免']
  },
  {
    level: 5,
    name: '交易大师',
    icon: '🏆',
    color: 'bg-red-500',
    requiredExp: 1000,
    description: '顶级交易大师',
    benefits: ['所有功能权限', '会员8折', '专属客服', '优先策略推送', '交易手续费减免', '专属策略定制', '收益分享计划']
  }
])

// 经验获取方式
const expMethods = ref([
  { action: '完成交易', exp: 10, description: '每笔成功交易', dailyLimit: 10, todayCount: 3 },
  { action: '邀请好友', exp: 50, description: '好友注册并交易', dailyLimit: 5, todayCount: 1 },
  { action: '策略分享', exp: 20, description: '分享交易策略', dailyLimit: 3, todayCount: 0 },
  { action: '完善资料', exp: 30, description: '完善个人信息', dailyLimit: 1, todayCount: 0 },
  { action: '连续登录', exp: 5, description: '每日登录奖励', dailyLimit: 1, todayCount: 1 },
  { action: '参与活动', exp: 25, description: '参与平台活动', dailyLimit: 2, todayCount: 0 }
])

// 计算属性
const currentLevel = computed(() => {
  return levels.value.find(level => level.level === userLevel.value) || levels.value[0]
})

const nextLevel = computed(() => {
  return levels.value.find(level => level.level === userLevel.value + 1)
})

const expProgress = computed(() => {
  if (!nextLevel.value) return 100
  const currentLevelExp = currentLevel.value.requiredExp
  const nextLevelExp = nextLevel.value.requiredExp
  const progress = ((userExp.value - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100
  return Math.min(Math.max(progress, 0), 100)
})

// 加载用户等级数据
const loadUserLevel = () => {
  // 这里应该从API获取用户等级数据
  // 暂时使用模拟数据
  const savedLevel = localStorage.getItem('user_level')
  if (savedLevel) {
    const levelData = JSON.parse(savedLevel)
    userLevel.value = levelData.level || 1
    userExp.value = levelData.exp || 0
  }
}

onMounted(() => {
  loadUserLevel()
})
</script>
