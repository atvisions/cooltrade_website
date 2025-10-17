<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />

    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <!-- Coming Soon 内容 -->
      <div class="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div class="text-center max-w-2xl mx-auto px-4">
          <!-- 插图 -->
          <div class="mb-12">
            <svg class="w-64 h-64 mx-auto" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 背景圆 -->
              <circle cx="200" cy="150" r="120" fill="#EEF2FF" opacity="0.5"/>

              <!-- 人物 -->
              <ellipse cx="200" cy="240" rx="60" ry="15" fill="#E0E7FF"/>
              <rect x="180" y="180" width="40" height="60" rx="20" fill="#6366F1"/>
              <circle cx="200" cy="140" r="25" fill="#818CF8"/>

              <!-- 对话框 -->
              <rect x="240" y="100" width="100" height="60" rx="10" fill="#FFFFFF" stroke="#6366F1" stroke-width="2"/>
              <path d="M240 130 L230 135 L240 140" fill="#FFFFFF" stroke="#6366F1" stroke-width="2"/>
              <circle cx="265" cy="120" r="4" fill="#6366F1"/>
              <circle cx="280" cy="120" r="4" fill="#6366F1"/>
              <circle cx="295" cy="120" r="4" fill="#6366F1"/>
              <text x="260" y="150" font-size="12" fill="#6366F1" font-weight="bold">社区</text>

              <!-- 装饰元素 -->
              <circle cx="100" cy="80" r="8" fill="#FCD34D" opacity="0.6"/>
              <circle cx="320" cy="200" r="6" fill="#34D399" opacity="0.6"/>
              <circle cx="80" cy="200" r="10" fill="#F472B6" opacity="0.6"/>
            </svg>
          </div>

          <!-- 标题 -->
          <h1 class="text-6xl font-bold text-gray-900 mb-6">
            Coming Soon
          </h1>

          <!-- 描述 -->
          <p class="text-xl text-gray-600 mb-8">
            社区功能正在开发中，敬请期待
          </p>

          <!-- 返回按钮 -->
          <button
            @click="goToMarket"
            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Header from '../common/Header.vue'

const router = useRouter()

// 跳转到 AI 策略生成
const goToAIStrategy = () => {
  router.push('/ai-strategy')
}

// 返回市场
const goToMarket = () => {
  router.push('/market')
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-75 {
  animation-delay: 0.75s;
}
</style>

