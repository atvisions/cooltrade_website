<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="bots" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">加载中...</p>
        </div>

        <div v-else-if="bot" class="max-w-6xl mx-auto">
          <!-- 返回按钮 -->
          <button
            @click="$router.push('/bots')"
            class="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon class="h-5 w-5 mr-2" />
            返回机器人列表
          </button>

          <!-- 机器人详情 -->
          <div class="bg-white rounded-lg shadow p-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ bot.name }}</h1>
            <p class="text-gray-600 mb-6">{{ bot.description }}</p>

            <!-- 基础信息 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p class="text-sm text-gray-600 mb-1">类型</p>
                <p class="text-lg font-semibold text-gray-900">{{ bot.bot_type_display }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">状态</p>
                <p class="text-lg font-semibold text-gray-900">{{ bot.status_display }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">总盈亏</p>
                <p
                  class="text-lg font-semibold"
                  :class="bot.total_profit >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatCurrency(bot.total_profit) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">胜率</p>
                <p class="text-lg font-semibold text-gray-900">{{ bot.win_rate.toFixed(2) }}%</p>
              </div>
            </div>

            <!-- 交易记录和信号记录 -->
            <div class="mt-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">交易记录</h2>
              <p class="text-gray-600">交易记录功能开发中...</p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-600">机器人不存在</p>
        </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { botAPI } from '../../utils/api'

const route = useRoute()
const loading = ref(false)
const bot = ref(null)

// 格式化货币
const formatCurrency = (value) => {
  const numValue = parseFloat(value || 0)
  if (numValue > 0 && numValue < 0.01) {
    return '$' + numValue.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })
  }
  return '$' + numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 加载机器人详情
const loadBot = async () => {
  try {
    loading.value = true
    const response = await botAPI.getBotDetail(route.params.id)
    if (response.success !== false) {
      bot.value = response.data || response
    }
  } catch (error) {
    console.error('加载机器人详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBot()
})
</script>

