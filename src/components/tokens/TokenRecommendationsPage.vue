<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <main class="w-full">
        <!-- 页面头部 -->
        <div class="mb-10">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-slate-900">代币推荐</h1>
            <p class="text-slate-600 mt-2">基于市场数据和技术分析，为您推荐优质交易机会</p>
          </div>

          <!-- 占位内容 -->
          <div class="flex flex-col items-center justify-center py-20">
            <div class="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-slate-900 mb-3">代币推荐功能</h2>
            <p class="text-slate-500 text-center max-w-md mb-8">
              我们正在开发智能代币推荐系统，将基于以下维度为您推荐优质交易机会：
            </p>
            
            <!-- 功能特性 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
              <!-- 市场数据分析 -->
              <div class="bg-white rounded-lg p-6 border border-slate-200">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-slate-900 mb-2">市场数据分析</h3>
                <p class="text-sm text-slate-600">综合价格走势、成交量、市值等多维度数据</p>
              </div>

              <!-- 技术指标评分 -->
              <div class="bg-white rounded-lg p-6 border border-slate-200">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-slate-900 mb-2">技术指标评分</h3>
                <p class="text-sm text-slate-600">基于 RSI、MACD、布林带等技术指标综合评估</p>
              </div>

              <!-- 风险评级 -->
              <div class="bg-white rounded-lg p-6 border border-slate-200">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-slate-900 mb-2">风险评级</h3>
                <p class="text-sm text-slate-600">为每个推荐提供清晰的风险等级和建议</p>
              </div>
            </div>

            <div class="mt-10 text-center">
              <p class="text-slate-400 text-sm">功能开发中，敬请期待...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../common/Header.vue'

// 页面数据
const loading = ref(false)
</script>

