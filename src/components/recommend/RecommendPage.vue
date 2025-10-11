<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">AI 智能推荐</h1>
        <p class="text-gray-600">基于市场数据和AI分析，为您推荐优质投资机会</p>
      </div>

      <!-- 推荐卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 推荐卡片 1 - 热门代币 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">热门代币</h3>
                <p class="text-sm text-gray-500">市场关注度最高</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">推荐</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            基于交易量、社交媒体热度和价格走势，为您推荐当前市场最热门的代币。
          </p>
          <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            查看推荐
          </button>
        </div>

        <!-- 推荐卡片 2 - 潜力新币 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">潜力新币</h3>
                <p class="text-sm text-gray-500">早期投资机会</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">新</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            发现具有增长潜力的新上市代币，抓住早期投资机会。
          </p>
          <button class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            查看推荐
          </button>
        </div>

        <!-- 推荐卡片 3 - 稳健投资 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">稳健投资</h3>
                <p class="text-sm text-gray-500">低风险选择</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full">稳健</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            市值大、波动小的成熟代币，适合稳健型投资者。
          </p>
          <button class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            查看推荐
          </button>
        </div>

        <!-- 推荐卡片 4 - DeFi 精选 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">DeFi 精选</h3>
                <p class="text-sm text-gray-500">去中心化金融</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full">DeFi</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            精选优质DeFi项目，探索去中心化金融的投资机会。
          </p>
          <button class="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
            查看推荐
          </button>
        </div>

        <!-- 推荐卡片 5 - NFT & GameFi -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">NFT & GameFi</h3>
                <p class="text-sm text-gray-500">元宇宙生态</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-semibold rounded-full">热门</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            关注NFT和GameFi领域的优质项目，把握元宇宙趋势。
          </p>
          <button class="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
            查看推荐
          </button>
        </div>

        <!-- 推荐卡片 6 - AI 分析 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">AI 深度分析</h3>
                <p class="text-sm text-gray-500">智能推荐</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">AI</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">
            基于AI算法的深度市场分析，为您提供个性化投资建议。
          </p>
          <button class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            查看推荐
          </button>
        </div>
      </div>

      <!-- 即将推出提示 -->
      <div class="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center border border-blue-100">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">更多功能即将推出</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          我们正在开发更强大的AI推荐系统，包括实时市场分析、个性化投资组合建议、风险评估等功能。敬请期待！
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../common/Header.vue'
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>

